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

    terrainResistance: 4,
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

  function update(deltaSeconds = 1) {
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

    // Torque curve (nonlinear)
    if (effectiveOutput <= 5) {
      state.torque = 0.6 * effectiveOutput;
    } else if (effectiveOutput <= 15) {
      state.torque = 3 + ((effectiveOutput - 5) / 10) * 3;
    } else {
      state.torque = 6 - ((effectiveOutput - 15) / 5) * 3;
    }
    state.torque = ignition ? Math.max(0, Math.min(10, state.torque)) : 0;

    // Base RPM growth if torque exceeds resistance
    if (state.torque > state.terrainResistance) {
      state.baseRPM += ((effectiveOutput / 20) * 10 - state.baseRPM) * 0.1;
    } else {
      state.baseRPM -= state.baseRPM * 0.05;
    }
    state.baseRPM = ignition ? Math.max(0.5, state.baseRPM) : 0;

    // Endpoint RPM depends on gear ratio
    state.gearRatio = gearRatios[state.gear] || 0;
    state.endpointRPM = state.baseRPM * state.gearRatio;
  }

  return {
    getState: () => ({ ...state }),

    setEnergyOutput: (val) => {
      const newVal = Math.max(0, Math.min(20, val));
      if (state.ignition) {
        state.energyOutput = newVal;
      } else {
        state.energyOutput = 0;
      }
    },

    setGear: (gear) => {
      if (gear in gearRatios) {
        state.gear = gear;
      }
    },

    toggleIgnition: () => {
      state.ignition = !state.ignition;
      if (!state.ignition) {
        state.energyOutput = 0;
      }
    },

    tick: update
  };
}
