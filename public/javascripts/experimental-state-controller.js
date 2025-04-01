// experimental-state-controller.js

export function createGameState() {
  const engineConfig = {
  peakTorque: 10,
  energyToTorqueRate: 0.6,
  fuelEfficiency: 0.02
};

  const state = {
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
    currentLoad: 1200,

    clutchEngaged: true,
    clutchOverride: false,
    automaticClutch: false,
    gearShiftCooldown: 0,

    speedHistory: Array(100).fill(0) // for graphing
  };

  const gearRatios = {
    "Reverse": 1,
    "Neutral": 0,
    "1st": 1,
    "2nd": 1.8,
    "3rd": 3.2
  };

  const mechMass = state.emptyWeight + state.currentLoad;
  const dragFactor = (state.terrainResistance + state.terrainFriction) / mechMass;

  function updateClutch(delta) {
    if (state.clutchOverride) {
      state.clutchEngaged = false;
    } else {
      if (state.gearShiftCooldown > 0) {
        state.gearShiftCooldown = Math.max(0, state.gearShiftCooldown - delta);
        state.clutchEngaged = false;
      } else {
        state.clutchEngaged = true;
      }
    }
  }

  function updateFuel(delta) {
    if (state.ignition) {
      const effectiveOutput = Math.max(0.5, state.energyOutput);
      const rate = engineConfig.fuelEfficiency;
      state.fuel = Math.max(0, state.fuel - rate * effectiveOutput * delta);
    }
  }

  function updateHeat(delta) {
    const output = state.energyOutput;
    const heatGen = output * 0.6;
    const heatDiss = output < 5 ? (5 - output) * 0.5 : 0;
    state.heat = Math.min(100, Math.max(0, state.heat + (heatGen - heatDiss) * delta));
  }

  function calculateTorque() {
    const output = state.ignition ? state.energyOutput : 0;

    // Calculate raw torque as a normalized input
    let normalizedOutput = Math.min(1, Math.max(0, output / 20)); // range 0–1
    let torqueCurve = 0;

    if (normalizedOutput <= 0.25) {
      torqueCurve = engineConfig.energyToTorqueRate * normalizedOutput * 4;
    } else if (normalizedOutput <= 0.75) {
      torqueCurve = 1; // plateau region
    } else {
      torqueCurve = 1 - (normalizedOutput - 0.75) * 4; // taper off
    }

    const gearRatio = gearRatios[state.gear] || 0;
    const torqueFactor = 1 / Math.max(gearRatio/2, 0.5);
    const penalty = !state.clutchEngaged || state.gear == "Neutral" ? 0.5 : 0.4;

    const targetTorque = state.ignition
      ? engineConfig.peakTorque * torqueCurve * torqueFactor * penalty
      : 0;

    state.torque += (targetTorque - state.torque) * 0.2;
  }

  function updateRPMs(delta) {
    const output = state.ignition ? state.energyOutput : 0;
    const baseRPMTarget = output * 0.5; // directly driven by energy output

    const torqueDelta = state.torque - state.terrainResistance;
    const canClimb = torqueDelta >= 0;

    if (canClimb) {
      const boost = torqueDelta / 10; // boost factor from excess torque
      const rampRate = 2 + boost * 2;
      state.baseRPM += (baseRPMTarget - state.baseRPM) * rampRate * delta;
    } else {
      const lossRate = state.clutchEngaged ? Math.max(state.gearRatio/2, 0.5) * 4 : (state.terrainResistance + state.terrainFriction) * 0.5;
      state.baseRPM -= lossRate * delta;
    }

    state.baseRPM = Math.max(0, state.baseRPM);

    const canTransmit = state.clutchEngaged && state.gear !== "Neutral";
    const targetEndpointRPM = canTransmit ? state.baseRPM * (gearRatios[state.gear] || 0) : 0;
    state.endpointRPM -= state.endpointRPM * dragFactor * 50 * delta;


    if (canTransmit) {
      state.endpointRPM += (targetEndpointRPM - state.endpointRPM) * 0.1;
    } else {
      // Only slight decay if not transmitting
      state.endpointRPM -= state.endpointRPM * 0.01 * delta;
    }
  }

  function updateSpeed() {
    if (state.torque < state.terrainResistance) {
      state.endpointRPM -= state.endpointRPM * 0.1;
      state.speed -= state.speed * 0.05;
    } else {
      state.speed = state.endpointRPM * 10;
    }
    state.speed = Math.max(0, state.speed);
  }

  function checkStall() {
    state.isStalled = state.clutchEngaged && state.torque < state.terrainResistance;
  }

  function updateHistory() {
    state.speedHistory.push(state.speed);
    if (state.speedHistory.length > 100) state.speedHistory.shift();
  }

  function tick(delta = 1) {
    updateClutch(delta);
    updateFuel(delta);
    updateHeat(delta);
    calculateTorque();
    updateRPMs(delta);
    updateSpeed();
    checkStall();
    updateHistory();
  }

  return {
    getState: () => ({ ...state }),
    tick,
    setEnergyOutput: (val) => {
      state.energyOutput = state.ignition ? Math.max(0, Math.min(20, val)) : 0;
    },
    setGear: (gear) => {
      if ((state.automaticClutch || !state.clutchEngaged) && gear in gearRatios && gear !== state.gear) {
        state.gear = gear;
        state.gearShiftCooldown = 0.5;
      }
    },
    toggleIgnition: () => {
      state.ignition = !state.ignition;
      if (!state.ignition) state.energyOutput = 0;
    },
    toggleAutomaticClutch: () => {
      state.automaticClutch = !state.automaticClutch;
    },
    setClutchOverride: (isHeld) => {
      state.clutchOverride = isHeld;
    }
  };
}
