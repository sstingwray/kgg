// experimental-state-controller.js

import { generateTerrainMap } from './experimental-terragen.js';

function normalizedParabola(norm, peak, width, scale = 1, minOutput = 0.1) {
  return Math.max(minOutput, scale * (1 - Math.pow((norm - peak) / width, 2)));
}

// === Configurable Constants ===
const STEP_CYCLE_DURATION = 8; // seconds for full cycle of baseRPM steps
const STALL_RECOVERY_TIME = 0.1; // time needed to recover from stall
const SPEED_INERTIA_SCALE = 25;  // how speed influences inertia
const FRICTION_DECAY_MULTIPLIER = 0.01; // friction impact on speed decay
const RPM_DECAY_WHEN_STALLED = 0.01; // endpointRPM drag multiplier
const GEAR_SHIFT_COOLDOWN = 0.5; // time after shift before energy returns
const MAX_ENERGY_OUTPUT = 20; // maximum energy the mech can output
const MAX_HEAT = 100; // maximum heat capacity before limits hit
const FUEL_OUTPUT_FLOOR = 0.5; // minimum energyOutput for idle fuel burn
const HEAT_GEN_RATE = 0.2; // heat produced per unit of energy output
const HEAT_DISS_RATE = 0.5; // cooling factor when output is low
const HEAT_DISS_THRESHOLD = 5; // threshold below which passive cooling happens
const TORQUE_RAMP_RATE = 0.2; // how fast torque value responds to changes
const RPM_DECAY_RATE = 0.01; // passive endpointRPM decay rate

export function createGameState() {
  const engineConfig = {
  peakTorque: 10,
  maxRPM: 10,
  energyToTorqueRate: 0.6,
  fuelEfficiency: 0.02
};

  let stallRecoveryTimer = 0;

  const state = {
    stepCount: 0,
    events: [],
    fuel: 100,
    energyOutput: 0,
    heat: 0,
    torque: 0,
    inertia: 0,
    baseRPM: 0,
    endpointRPM: 0,
    gear: "Neutral",
    ignition: false,
    speed: 0,
    isStalled: false,

    terrainResistance: 2,
    terrainFriction: 3,

    traction: 4,
    emptyWeight: 120,
    maxLoad: 400,
    currentLoad: 0,

    clutchEngaged: true,
    clutchOverride: false,
    automaticClutch: false,
    gearShiftCooldown: 0,

    mechX: 0,
  };

  const gearRatios = {
    "Reverse": {
      ratio: 1,
      torqueFunction: (_, energyOutput) => {
        const norm = Math.min(1, energyOutput / MAX_ENERGY_OUTPUT);
        return normalizedParabola(norm, 0.15, 0.3, 1.2);
      }
    },
    "Neutral": {
      ratio: 0,
      torqueFunction: (_, energyOutput) => {
        const norm = Math.min(1, energyOutput / MAX_ENERGY_OUTPUT);
        return null;
      }
    },
    "1st": {
      ratio: 2,
      torqueFunction: (_, energyOutput) => {
        const norm = Math.min(1, energyOutput / MAX_ENERGY_OUTPUT);
        return normalizedParabola(norm, 0.15, 0.6, 1.2);
      }
    },
    "2nd": {
      ratio: 3,
      torqueFunction: (_, energyOutput) => {
        const norm = Math.min(1, energyOutput / MAX_ENERGY_OUTPUT);
        return normalizedParabola(norm, 0.5, 0.4, 0.6);
      }
    },
    "3rd": {
      ratio: 4,
      torqueFunction: (_, energyOutput) => {
        const norm = Math.min(1, energyOutput / MAX_ENERGY_OUTPUT);
        return normalizedParabola(norm, 0.8, 0.3, 0.3);
      }
    }
  };

  const mechMass = state.emptyWeight + state.currentLoad;
  const dragFactor = 0.2 * (mechMass/(state.emptyWeight + state.maxLoad));
  console.log(`mechMass = ${mechMass}, dragFactor = ${dragFactor}`);
  

  const terrain = generateTerrainMap({ segmentLength: 100, segmentCount: 20, seed: 69 });

  let currentSegmentIndex = 0;
  state.terrainMap = terrain;
  state.currentSegment = terrain[0];
  state.missionComplete = false;
  state.missionSummary = null;
  state.timeElapsed = 0;
  state.maxSpeed = 0;
  state.fuelStart = state.fuel;


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
      const effectiveOutput = Math.max(FUEL_OUTPUT_FLOOR, state.energyOutput);
      const rate = engineConfig.fuelEfficiency;
      state.fuel = Math.max(0, state.fuel - rate * effectiveOutput * delta);
    }
  }

  function updateHeat(delta) {
    const output = state.ignition && !state.energyOutputCutoff ? state.energyOutput : 0;
    const heatGen = output * HEAT_GEN_RATE;
    const heatDiss = output < HEAT_DISS_THRESHOLD ? (HEAT_DISS_THRESHOLD - output) * HEAT_DISS_RATE : 0;
    state.heat = Math.min(MAX_HEAT, Math.max(0, state.heat + (heatGen - heatDiss) * delta));
  }

  function calculateTorque() {
    const output = (state.ignition && !state.energyOutputCutoff) ? state.energyOutput : 0;

    // Calculate raw torque as a normalized input
    let normalizedOutput = Math.min(1, Math.max(0, output / MAX_ENERGY_OUTPUT)); // range 0–1
    let torqueCurve = 0;

    if (normalizedOutput <= 0.25) {
      torqueCurve = engineConfig.energyToTorqueRate * normalizedOutput * 4;
    } else if (normalizedOutput <= 0.75) {
      torqueCurve = 1; // plateau region
    } else {
      torqueCurve = 1 - (normalizedOutput - 0.75) * 4; // taper off
    }

    const gear = gearRatios[state.gear] || { ratio: 0, torqueFunction: () => 0 };
    const torqueFactor = gear.torqueFunction(torqueCurve, output);
    const frictionZoneBoost = !state.clutchEngaged || state.gear === "Neutral" ? 1.5 : 1;

    const targetTorque = state.ignition
      ? Math.min(engineConfig.peakTorque * torqueCurve * torqueFactor * frictionZoneBoost, engineConfig.peakTorque)
      : 0;

    state.torque += (targetTorque - state.torque) * TORQUE_RAMP_RATE;
  }

  function updateRPMs(delta) {
    const energyBasedRPM = (state.energyOutput / MAX_ENERGY_OUTPUT) * engineConfig.maxRPM;
    const torqueRatio = state.torque / engineConfig.peakTorque;
    const baseRPMTarget = energyBasedRPM * (0.5 + 0.5 * torqueRatio);
    const canTransmit = state.clutchEngaged && state.gear !== "Neutral";

    const torqueDelta =  canTransmit ? (state.torque + state.inertia) - state.terrainResistance : 0;
    const canClimb = torqueDelta >= 0;


    if (canClimb) {
      const boost = torqueDelta / 10; // boost factor from excess torque
      const rampRate = 2 + boost * 2;
      state.baseRPM += (baseRPMTarget - state.baseRPM) * rampRate * delta;
    } else {
      const gearRatio = gearRatios[state.gear]?.ratio || 0;
      const lossRate = state.clutchEngaged ? Math.max(gearRatio / 2, 0.5) * 4 : (state.terrainResistance) * 0.5;
      state.baseRPM -= lossRate * delta;
    }

    state.baseRPM = Math.max(0, state.baseRPM);

    const targetEndpointRPM = canTransmit ? state.baseRPM * (gearRatios[state.gear]?.ratio || 0) : 0;
    const stallDrag = dragFactor * RPM_DECAY_WHEN_STALLED;
    state.endpointRPM -= state.endpointRPM * stallDrag * delta;

    if (canTransmit) {
      state.endpointRPM += (targetEndpointRPM - state.endpointRPM) * 0.1;
    } else {
      // Only slight decay if not transmitting
      state.endpointRPM -= state.endpointRPM * RPM_DECAY_RATE * delta;
    }
  }

  function checkStall() {
    const belowThreshold = state.clutchEngaged && (state.torque + state.inertia) < state.terrainResistance;
  
    if (belowThreshold) {
      stallRecoveryTimer += 1 / 20;
      if (stallRecoveryTimer >= STALL_RECOVERY_TIME) {
        state.isStalled = true;
      }
    } else {
      stallRecoveryTimer = 0;
      state.isStalled = false;
    }
  }

  function updateTerrainFromPosition(x) {
    const current = state.terrainMap[currentSegmentIndex];
    const next = state.terrainMap[currentSegmentIndex + 1];

    if (next && x >= next.x) {
      currentSegmentIndex++;
    } else if (currentSegmentIndex > 0 && x < current.x) {
      currentSegmentIndex--;
    }

    const segment = state.terrainMap[currentSegmentIndex];
    state.terrainResistance = segment.resistance;
    state.terrainFriction = segment.friction;
    state.currentSegment = segment;
  }

  function shutdownMech() {
    state.gear ='Neutral';
    state.ignition = false;
    state.energyOutput = 0;
  }

  function activateVenting() {
    state.heat = Math.max(0, state.heat - 20);
    state.fuel = Math.max(0, state.fuel - 5);
    state.events.push({ type: "VENTING_ACTIVATED", timestamp: state.timeElapsed });
  }

  function checkMissionComplete() {
    const lastSegment = state.terrainMap[state.terrainMap.length - 1];
    if (state.mechX >= lastSegment.x && !state.missionComplete) {
      state.missionComplete = true;
      const totalDistance = state.mechX.toFixed(1);
      const travelTime = state.timeElapsed.toFixed(1);
      const maxReachedSpeed = state.maxSpeed.toFixed(1);
      const fuelUsed = state.fuelStart - state.fuel;
      const avgFuelRate = fuelUsed > 0 ? (fuelUsed / state.timeElapsed).toFixed(3) : '0.000';

      state.missionSummary = `Mission Complete!
        Total Distance: ${totalDistance}m
        Time: ${travelTime}s
        Max Speed: ${maxReachedSpeed}m/s
        Avg Fuel Consumption: ${avgFuelRate}/s
        Total Steps: ${state.stepCount}`;
      state.missionCompleteMessage = state.missionSummary;
      state.events.push({ type: "MISSION_COMPLETE", timestamp: state.timeElapsed });
      shutdownMech();
      return true;
    }
    return false;
  }

  function updateEnergyOutputCutoff(delta) {
    if (state.energyOutputCutoff) {
      state.energyOutputRestoreDelay -= delta;
      if (state.energyOutputRestoreDelay <= 0) {
        state.energyOutputCutoff = false;
      }
    }
  }

  let timeSinceLastStep = STEP_CYCLE_DURATION; // initialized to max to allow first step

  function handleStepEvents(delta) {
    // Calculate inertia based on speed
    state.inertia = 2 * (1 - Math.exp(-state.speed / SPEED_INERTIA_SCALE));
  
    const gear = gearRatios[state.gear] || { ratio: 0 };
    const stepLength = state.endpointRPM * gear.ratio;
    const stepCooldownTime = STEP_CYCLE_DURATION / (state.endpointRPM || 1);
  
    if (!state.ignition || stepLength <= 0) return;
  
    timeSinceLastStep += delta;
      
    while (timeSinceLastStep >= stepCooldownTime) {
      state.mechX += stepLength;
      state.stepCount++;
      timeSinceLastStep = 0;
  
      state.events.push({
        type: "STEP",
        terrainResistance: state.terrainResistance,
        gear: state.gear,
        gearRatio: gear.ratio,
        torque: state.torque,
        inertia: state.inertia
      });
    }
  
    state.speed = stepLength;
  }  

function updateGameState(delta) {
    updateClutch(delta);
    updateFuel(delta);
    updateHeat(delta);
    calculateTorque();
    updateRPMs(delta);
    checkStall();
    updateTerrainFromPosition(state.mechX);
}

function tick(delta = 1) {
  // Main game update loop per tick (20Hz default)
  // - Applies energy cutoff, step mechanics, game state and mission progress
  if (checkMissionComplete()) return;

  updateEnergyOutputCutoff(delta);
  handleStepEvents(delta);
  
  state.timeElapsed += delta;
  if (state.speed > state.maxSpeed) state.maxSpeed = state.speed;

  updateGameState(delta);
}

function getSteppedMechX() {
  // Provides an interpolated mech position for smooth visuals
  const gear = gearRatios[state.gear] || { ratio: 0 };
  const stepLength = state.endpointRPM * gear.ratio;
  if (stepLength <= 0) return state.mechX;

  const prev = Math.floor(state.mechX / stepLength) * stepLength;
  const next = prev + stepLength;
  const t = (state.mechX - prev) / stepLength;
  return prev * (1 - t) + next * t;
}

  return {
    getState: () => {
      if (state.events.length) {
        console.log("[Game Events]", JSON.stringify(state.events, null, 2));
      }
      const snapshot = { ...state, events: [...state.events], steppedMechX: getSteppedMechX() };
      state.events.length = 0;
      return snapshot;
    },
    tick,
    setEnergyOutput: (val) => {
      state.energyOutput = Math.max(0, Math.min(MAX_ENERGY_OUTPUT, val));
    },
    setGear: (gear) => {
      if ((state.automaticClutch || !state.clutchEngaged) && gear in gearRatios && gear !== state.gear) {
        state.gear = gear;
        state.events.push({ type: "GEAR_SHIFT", value: gear, timestamp: state.timeElapsed });
        state.gearShiftCooldown = GEAR_SHIFT_COOLDOWN;
        state.energyOutputCutoff = true;
        state.energyOutputRestoreDelay = GEAR_SHIFT_COOLDOWN;
      }
    },
    toggleIgnition: () => {
      state.ignition = !state.ignition;
      state.events.push({ type: state.ignition ? "IGNITION_ON" : "IGNITION_OFF", timestamp: state.timeElapsed });
      if (!state.ignition) state.energyOutput = 0;
    },
    toggleAutomaticClutch: () => {
      state.automaticClutch = !state.automaticClutch;
    },
    setClutchOverride: (isHeld) => {
      state.clutchOverride = isHeld;
    },
    activateVenting
  };
}
