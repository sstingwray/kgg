import emitter from './eventEmitter.js';
import { round, randRange } from '../utils/helpers.js';

const LOGGING = true;
const SPEED_SCALE = 20;
const TORQUE_RAMP_RATE = 0.05;
const BASE_RPM_RAMP_RATE = 0.05;
const ENDPOINT_RPM_RAMP_RATE = 0.01;
const RESISTANCE_STOPPING_RATE = 0.01;
const FUEL_CONS_MOD = 0.01;
const HEAT_GEN_MOD = 0.001;
const HEAT_DISS_MOD = 0.01;


const state = {
  timeElapsed: 0,
  mech: {
    chassis: {
      stability: 4,
      traction: 1,
      stepLength: 10,
      emptyWeight: 50,
      maximumLoad: 250,
      heatDissRate: 0.5
    },
    reactor: {
      maxFuel: 255,
      maxOutput: 20,
      maxHeat: 255,
      fuelEfficiency: 0.3,
    },
    engine: {
      overdriveThreshold: 10,
      peakTorque: 6,
      peakTorqueRPM: 4,
      maxBaseRPM: 6,
      gears: {
        'R': {
          ratio: round(1 / 2.18, 4),
          torqueFn: null,
        },
        'N': {
          ratio: 1,
          torqueFn: null,
        },
        '1st': {
          ratio: round(1 / 2.18, 4),
          torqueFn: null,
        },
        '2nd': {
          ratio: round(1 / 1.32, 4),
          torqueFn: null,
        },
        '3rd': {
          ratio: round(1 / 0.9, 4),
          torqueFn: null,
        }
      },
      maxEndpointRPM: 0,
      maxSpeed: 0
    },
    modules: {
      coolantCanister: {
        maxCapacity: 255,
        coolantStrength: 1
      }
    },
    status: {
      bars: {
        mechIntegrity: 255,
        crewHealth: 255,
        heat: null,
        pathfinding: 255,
        flooding: 0,
        fuel: null,
      },
      energyOutput: 0,
      baseRPM: 0,
      torque: 0,
      speedResistanceFactor: 0,
      gear: 'N',
      endpointRPM: 0,
      movement: {
        stepAccumulator: 0,
        speedApprox: 0,
        stepCount: 0,
      },
      modules: {
        coolantCanister: {
          amount: null,
          valve: 0
        }
      },
      flags: {
        ignition: false,
        clutch: false,
        brake: false,
        overdrive: false
      }
    },
    location: {
      x: 0,
      segmentID: 0
    }
  },
  map : []
}

export function setupGameState() {
  //stocking the Mech
  state.mech.status.bars.fuel = state.mech.reactor.maxFuel;
  state.mech.status.modules.coolantCanister.amount = state.mech.modules.coolantCanister.maxCapacity;
  state.mech.status.bars.heat = round( state.mech.reactor.maxHeat / 2, 0);
  //calculating maxSpeed for the speedGauge
  const maxBaseRPM = state.mech.engine.maxBaseRPM
  const highestSpeedRatio = state.mech.engine.gears['3rd'].ratio;
  state.mech.engine.maxEndpointRPM = round(maxBaseRPM * highestSpeedRatio);
  state.mech.engine.maxSpeed = round(state.mech.engine.maxEndpointRPM * SPEED_SCALE);
  //setting up gears
  state.mech.engine.gears['R'].torqueFn = createAsymmetricTorque ({
    peak: round(state.mech.engine.maxBaseRPM / 3, 0),
    center: state.mech.engine.peakTorqueRPM, width: 2,
    rate: 2, ascendFactor: 0.5, descendFactor: 2,
    minValue: 1, minClampX: 1
  });
  state.mech.engine.gears['N'].torqueFn = createAsymmetricTorque ({
    peak: state.mech.engine.maxBaseRPM,
    center: state.mech.engine.peakTorqueRPM, width: 2,
    rate: 2, ascendFactor: 0.5, descendFactor: 2,
    minValue: 1, minClampX: 1
  });
  state.mech.engine.gears['1st'].torqueFn = createAsymmetricTorque ({
    peak: state.mech.engine.maxBaseRPM - 1,
    center: state.mech.engine.peakTorqueRPM, width: 2,
    rate: 2, ascendFactor: 0.5, descendFactor: 2,
    minValue: 1, minClampX: 1
  });
  state.mech.engine.gears['2nd'].torqueFn = createAsymmetricTorque ({
    peak: state.mech.engine.maxBaseRPM - 2,
    center: state.mech.engine.peakTorqueRPM, width: 2,
    rate: 2, ascendFactor: 0.3, descendFactor: 2,
    minValue: 1, minClampX: 1
  });
  state.mech.engine.gears['3rd'].torqueFn = createAsymmetricTorque ({
    peak: state.mech.engine.maxBaseRPM - 3,
    center: state.mech.engine.peakTorqueRPM, width: 2,
    rate: 2, ascendFactor: 0.1, descendFactor: 2,
    minValue: 1, minClampX: 1
  });


  //setting up a map
  state.map = generateTerrainMap();

  //settin up listeners
  emitter.subscribe('ignitionToggle', updateIgnition.bind(this));
  emitter.subscribe('clutchToggle', updateClutch.bind(this));
  emitter.subscribe('gearShift', updateGear.bind(this));
  emitter.subscribe('outputInput', setEnergyOutput.bind(this));
  emitter.subscribe('coolantCanisterValveChange', updateCoolantCanisterValve.bind(this));
  emitter.subscribe('beat', calculateSteps.bind(this));
  emitter.subscribe('stepMade', updateLocation.bind(this));
  emitter.emit('[LOG][gameManager] Game state is set', state);
}

export function generateTerrainMap(seed = 0) {
  const terrainData = {
    types: [],
  };
  const map = [];
  const segmentCount = 20;
  const rand = mulberry32(seed);
    
  
  let currentZ = 10;
  let currentX = 0;
  
  for (let i = 0; i < segmentCount; i++) {
    const segmentLength = Math.floor(rand() * 700) + 300;
    const resistance = Math.floor(rand() * 3) + 1;
    const friction = Math.floor(rand() * 3) + 1;
    const type = terrainData.types[randRange(0, terrainData.types.length)];

    // Resistance-based color coding
    let resistanceColor = "green";
    if (resistance > 2) resistanceColor = "red";
    else if (resistance > 4) resistanceColor = "yellow";

    // Smoother elevation transition
    const deltaZ = (rand() - 0.5) * 10; // more gradual than original ±5
    currentZ += deltaZ;

    map.push({
      x: currentX,
      z: +currentZ.toFixed(0),
      type,
      resistance,
      resistanceColor,
      friction
    });

    currentX += segmentLength;
  }
  
  return map;
}
  
// Simple seeded PRNG
function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function updateClutch(flag) {
  state.mech.status.flags.clutch = !flag;
}

function updateIgnition() {
  state.mech.status.flags.ignition = !state.mech.status.flags.ignition;

  if (state.mech.status.flags.ignition && state.mech.status.bars.fuel > 0) {
    setEnergyOutput(1);
  } else {
    setEnergyOutput(0);
  }
  emitter.emit('ignitionState', state.mech.status.flags.ignition);
}

function setEnergyOutput(value) {
  const maxOutput = state.mech.reactor.maxOutput;
  const checkedValue = value >= 1 ? value : 1;
  if (state.mech.status.flags.ignition)
    state.mech.status.energyOutput = checkedValue <= maxOutput ? checkedValue : maxOutput;
  else state.mech.status.energyOutput = 0;
  emitter.emit('outputChange', state.mech.status.energyOutput);
}

function updateGear (gear) {
  state.mech.status.gear = gear;
}

function updateBaseRPM() {
  const maxEnergyOutput = state.mech.reactor.maxOutput;
  const energyOutput = state.mech.status.energyOutput;
  const maxRPM = state.mech.engine.maxBaseRPM;
  const energyBasedRPM = round((energyOutput / maxEnergyOutput) * maxRPM, 3);
  const targetRampRate = BASE_RPM_RAMP_RATE;
  const targetDecayRate = round(targetRampRate * 3, 3);
  const targetBaseRPM = energyBasedRPM;
  const baseRPM = state.mech.status.baseRPM;
    
  if (targetBaseRPM > baseRPM && targetBaseRPM - baseRPM > targetRampRate)
  { state.mech.status.baseRPM += targetRampRate }
  else if (targetBaseRPM < baseRPM && baseRPM - targetBaseRPM > targetDecayRate)
  { state.mech.status.baseRPM -= targetDecayRate }
  else state.mech.status.baseRPM = targetBaseRPM

  state.mech.status.baseRPM = round(state.mech.status.baseRPM, 3);

  emitter.emit('engineWorking', state.mech.status.baseRPM);

  LOGGING && energyOutput !== state.mech.status.baseRPM ?
    emitter.emit('[LOG][gameManager] baseRPM', {
      value: state.mech.status.baseRPM,
      maxEnergyOutput, energyOutput, maxRPM, energyBasedRPM,
      targetRampRate, targetBaseRPM
    }) : null;
}

function updateTorque() {
  const gear = state.mech.status.gear;
  const baseRPM = state.mech.status.baseRPM;
  const targetTorque = round(state.mech.engine.gears[gear].torqueFn(baseRPM), 4);
  const torque = state.mech.status.torque

  if (targetTorque > torque) { state.mech.status.torque += TORQUE_RAMP_RATE }
  else { state.mech.status.torque = targetTorque };

  LOGGING && torque !== state.mech.status.torque ?
    emitter.emit('[LOG][gameManager] torque', {
      value:  state.mech.status.torque,
      gear, baseRPM, targetTorque,
    }) : null;
}

function updateEndpointRPM() {
  const gear = state.mech.status.gear;
  const baseRPM = state.mech.status.baseRPM;
  const endpointRPM = state.mech.status.endpointRPM;
  const canTransmit = !state.mech.status.flags.clutch && state.mech.status.gear !== "N";
  const gearRatio = state.mech.engine.gears[gear].ratio;
  const resistance = state.map[state.mech.location.segmentID].resistance;
  const speedResistanceFactor = state.mech.status.speedResistanceFactor;
  const torqueDelta = state.mech.status.torque - speedResistanceFactor - resistance;
  const targetRampRate = gearRatio * torqueDelta * ENDPOINT_RPM_RAMP_RATE;  
  
  if (canTransmit) {
    if (torqueDelta > 0) state.mech.status.endpointRPM += targetRampRate;
    else state.mech.status.endpointRPM += torqueDelta * RESISTANCE_STOPPING_RATE;
  } else {
    //clutch off or neutral
    if (endpointRPM > 0) { state.mech.status.endpointRPM -= (resistance + speedResistanceFactor) * RESISTANCE_STOPPING_RATE }
    else state.mech.status.endpointRPM = 0
  }

  if (state.mech.status.endpointRPM > 0.001) {
    state.mech.status.endpointRPM = round(state.mech.status.endpointRPM, 3);
    emitter.emit('mechMoving', state.mech.status.endpointRPM);
  } else {
    state.mech.status.endpointRPM = 0;
    emitter.emit('mechStopped', state.mech.status.movement.stepCount);
  }
    
  LOGGING && endpointRPM !== state.mech.status.endpointRPM ?
    emitter.emit('[LOG][gameManager] endpointRPM', {
      value: state.mech.status.endpointRPM,
      gear, baseRPM, canTransmit, resistance, speedResistanceFactor, torqueDelta, targetRampRate
    }) : null;
}

function calculateSpeedApprox () {
  const endpointRPM = state.mech.status.endpointRPM;
  const targetSpeed = round(endpointRPM * SPEED_SCALE, 3);
  const maxBaseRPM = state.mech.engine.maxBaseRPM;

  state.mech.status.movement.speedApprox = targetSpeed;
  state.mech.status.speedResistanceFactor = round(Math.max(1, 10 - maxBaseRPM) * Math.max(1, state.mech.status.movement.speedApprox) / state.mech.engine.maxSpeed, 4);

  LOGGING && targetSpeed > 0 ?
    emitter.emit('[LOG][gameManager] speedApprox', {
      value: state.mech.status.movement.speedApprox,
      endpointRPM, targetSpeed
    }) : null;
}

function calculateSteps() {
  const currentStepDistance = state.mech.status.movement.speedApprox;
  if (currentStepDistance === 0) return;
  const stepNum = state.mech.status.movement.stepCount;
  
  emitter.emit('stepMade', { currentStepDistance,  stepNum });
  state.mech.status.movement.stepCount++;
}

function consumeFuel() {
  const fuelConsumptionTarget = state.mech.status.energyOutput * state.mech.reactor.fuelEfficiency * FUEL_CONS_MOD;

  if (state.mech.status.bars.fuel > fuelConsumptionTarget) state.mech.status.bars.fuel -= fuelConsumptionTarget;
  else {
    state.mech.status.bars.fuel = 0;
    emitter.emit('outOfFuel', true);
    emitter.emit('ignitionToggle', false);
  };

  state.mech.status.bars.fuel = round(state.mech.status.bars.fuel, 4);
};

function updateHeat() {
  const baseHeatGen = state.mech.status.energyOutput * HEAT_GEN_MOD;

  const baseHeatDiss = state.mech.chassis.heatDissRate * HEAT_DISS_MOD;
  const hasCoolant = state.mech.status.modules.coolantCanister.amount > 0 ? true: false;
  const coolantValve = state.mech.status.modules.coolantCanister.valve;
  const coolantStrength = state.mech.modules.coolantCanister.coolantStrength;
  const coolantEffect = hasCoolant ? coolantValve * coolantStrength : 0;

  const targetHeat = state.mech.status.bars.heat + baseHeatGen - baseHeatDiss - coolantEffect;

  if (targetHeat < 0) state.mech.status.bars.heat = 0;
  else if (targetHeat > state.mech.reactor.maxHeat) state.mech.status.bars.heat = state.mech.reactor.maxHeat;
  else state.mech.status.bars.heat = targetHeat;

  if (hasCoolant) state.mech.status.modules.coolantCanister.amount -= state.mech.status.modules.coolantCanister.valve;
  else state.mech.status.modules.coolantCanister.amount = 0;

  if (coolantValve > 0 && hasCoolant) emitter.emit('coolantRelease', coolantValve);
  else emitter.emit('coolantRelease', 0);

  emitter.emit('coolantLeft', state.mech.status.modules.coolantCanister.amount);

  state.mech.status.bars.heat = round(state.mech.status.bars.heat, 4);

  //emitter.emit('heatUpdate', state.mech.status.bars.heat);
}

function updateCoolantCanisterValve(value) {
  state.mech.status.modules.coolantCanister.valve = value;
}

function updateLocation(stepData) {
  const segID = state.mech.location.segmentID
  const loc = state.map[segID];
  const x = round(state.mech.location.x + stepData.currentStepDistance, 4);

  if (segID < (state.map.length - 1)) {
    emitter.emit('[LOG][gameManager] Location update', { stepData, segID, loc, x });
    if (state.map[segID + 1].x <= x) {
      state.mech.location.x = round(x, 4);
      emitter.emit('enteringNewSegment', segID + 1);
      state.mech.location.segmentID++;
            
    } else {
      state.mech.location.x = x;
    }
  } else {
    emitter.emit('finishedMap', true);
  }

}

export function getGameState() {
  return state
}

export function updateGameState(delta) {
  state.timeElapsed += delta;
  state.timeElapsed = round(state.timeElapsed, 4)
  updateBaseRPM();
  updateEndpointRPM();
  calculateSpeedApprox();
  updateTorque();
  consumeFuel();
  updateHeat();
}

function createAsymmetricTorque({
  peak,
  center = 0,
  width = 1,
  rate,
  ascendFactor = 1,
  descendFactor = 1,
  minValue = 0,
  minClampX = 1
}) {

  const rateAscend  = rate * ascendFactor;
  const rateDescend = rate * descendFactor;

  return function(x) {
    const dx = x - center;
    let val;

    if (x <= center + width) {
      // slower rise
      val = peak - rateAscend * dx * dx;
    } else {
      // sharper fall
      val = peak - rateDescend * dx * dx;
    }

    // floor it to minValue if x ≥ minClampX
    if (x >= minClampX && val < minValue) {
      return minValue;
    }
    // otherwise never go below zero
    return val > 0 ? val : 0;
  };
}