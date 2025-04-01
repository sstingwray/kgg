// experimental-state-controller.js

function createGameState() {
  let state = {
    fuel: 100,
    energyOutput: 0,
    heat: 0,
    torque: 0,
    baseRPM: 0,
    endpointRPM: 0,
    gear: "Neutral",
    gearRatio: 0,
    ignition: false,
    speed: 0,
    isStalled: false,

    terrainResistance: 2,
    terrainFriction: 3,

    traction: 7,
    emptyWeight: 1200,
    maxLoad: 4000,
    currentLoad: 1200
  };

  const gearRatios = {
    "Reverse": 1,
    "Neutral": 0,
    "1st": 1,
    "2nd": 1.2,
    "3rd": 1.6
  };

  let clutchEngaged = true;
  let clutchOverride = false;
  let gearShiftCooldown = 0;
  let automaticClutch = false;

  function update(deltaSeconds = 1) {
    // Clutch logic
    if (clutchOverride) {
      clutchEngaged = false;
    } else {
      clutchEngaged = gearShiftCooldown <= 0;
      if (gearShiftCooldown > 0) {
        gearShiftCooldown = Math.max(0, gearShiftCooldown - deltaSeconds);
      }
    }

    const ignition = state.ignition;
    const output = ignition ? state.energyOutput : 0;
    const effectiveOutput = ignition ? Math.max(0.5, output) : 0;

    // Fuel usage
    const fuelBurnRate = 0.02 * effectiveOutput;
    if (ignition) {
      state.fuel = Math.max(0, state.fuel - fuelBurnRate * deltaSeconds);
    }

    // Heat generation and dissipation
    const heatGen = effectiveOutput * 0.6;
    const heatDissipation = effectiveOutput < 5 ? (5 - effectiveOutput) * 0.5 : 0;
    state.heat = Math.min(100, Math.max(0, state.heat + (heatGen - heatDissipation) * deltaSeconds));

    // Raw torque calculation
    let rawTorque = 0;
    if (effectiveOutput <= 5) {
      rawTorque = 0.6 * effectiveOutput;
    } else if (effectiveOutput <= 15) {
      rawTorque = 3 + ((effectiveOutput - 5) / 10) * 3;
    } else {
      rawTorque = 6 - ((effectiveOutput - 15) / 5) * 3;
    }

    const selectedGear = clutchEngaged ? state.gear : "Neutral";
    const gearRatio = gearRatios[selectedGear] || 0;
    const gearTorqueFactor = 1 / Math.max(gearRatio, 0.5);

    const torquePenalty = clutchEngaged ? 0.5 : 1;
    state.torque = ignition ? Math.max(0, Math.min(10, rawTorque * gearTorqueFactor * torquePenalty)) : 0;

    // Base RPM logic
    if (!clutchEngaged || state.gear == 'Neutral' || state.torque > state.terrainResistance) {
      const targetRPM = (effectiveOutput / 20) * 10;
      state.baseRPM += (targetRPM - state.baseRPM) * 0.1;
    } else {
      state.baseRPM -= state.baseRPM * 0.05;
    }
    state.baseRPM = ignition ? Math.max(0.5, state.baseRPM) : 0;

    state.gearRatio = gearRatio;
    state.endpointRPM = state.baseRPM * gearRatio;
    state.speed = state.endpointRPM * 10;

    state.isStalled = clutchEngaged && (state.torque < state.terrainResistance);
  }

  return {
    getState: () => ({ ...state, clutchEngaged, automaticClutch }),

    setEnergyOutput: (val) => {
      const newVal = Math.max(0, Math.min(20, val));
      if (state.ignition) {
        state.energyOutput = newVal;
      } else {
        state.energyOutput = 0;
      }
    },

    setGear: (gear) => {
      const canShift = automaticClutch || clutchEngaged;
      if (canShift && gear in gearRatios && gear !== state.gear) {
        state.gear = gear;
        gearShiftCooldown = 0.5;
      }
    },

    toggleIgnition: () => {
      state.ignition = !state.ignition;
      if (!state.ignition) {
        state.energyOutput = 0;
      }
    },

    setClutchOverride: (isHeld) => {
      clutchOverride = isHeld;
    },

    toggleAutomaticClutch: () => {
      automaticClutch = !automaticClutch;
    },

    tick: update
  };
}