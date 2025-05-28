import emitter from './eventEmitter.js';
import { round, randRange } from '../utils/helpers.js';

const LOGGING = true;
const TORQUE_RAMP_RATE = 0.05;
const RPM_RAMP_RATE = 0.05;
const MASS_INDEX_BASE = 1;
const FUEL_CONS_MOD = 0.01;
const HEAT_GEN_MOD = 0.001;
const HEAT_DISS_MOD = 0.01;
const GEARSHIFT_DELAY = 320;
const STALL_DELAY = 350;

const state = {
  timeElapsed: 0,
  mech: {
    chassis: {
      stability: 4,
      traction: 1,
      stepLength: 20,
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
          transmitting: -1
        },
        'N': {
          ratio: 1,
          torqueFn: null,
          transmitting: 0,
        },
        '1st': {
          ratio: round(1 / 2.18, 4),
          torqueFn: null,
          transmitting: 1,
        },
        '2nd': {
          ratio: round(1 / 1.32, 4),
          torqueFn: null,
          transmitting: 1,
        },
        '3rd': {
          ratio: round(1 / 0.9, 4),
          torqueFn: null,
          transmitting: 1,
        }
      }
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
      maxEndpointRPM: 0,
      maxSpeed: 0,
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
  state.mech.status.maxEndpointRPM = state.mech.engine.gears['3rd'].ratio * state.mech.engine.maxBaseRPM;
  state.mech.status.maxSpeed = state.mech.status.maxEndpointRPM * state.mech.chassis.stepLength;
  //setting up gears
  state.mech.engine.gears['R'].torqueFn = createAsymmetricTorque ({
    peak: round(state.mech.engine.maxBaseRPM / 3, 0),
    center: state.mech.engine.peakTorqueRPM, width: 3,
    rate: 0.8, ascendFactor: 0.5, descendFactor: 2,
    minValue: 1
  });
  state.mech.engine.gears['N'].torqueFn = createAsymmetricTorque ({
    peak: state.mech.engine.maxBaseRPM,
    center: state.mech.engine.peakTorqueRPM, width: 4,
    rate: 0.5, ascendFactor: 0.7, descendFactor: 2,
    minValue: 1
  });
  state.mech.engine.gears['1st'].torqueFn = createAsymmetricTorque ({
    peak: state.mech.engine.maxBaseRPM - 1,
    center: state.mech.engine.peakTorqueRPM, width: 3,
    rate: 0.8, ascendFactor: 0.6, descendFactor: 2,
    minValue: 1
  });
  state.mech.engine.gears['2nd'].torqueFn = createAsymmetricTorque ({
    peak: state.mech.engine.maxBaseRPM - 2,
    center: state.mech.engine.peakTorqueRPM, width: 2,
    rate: 1, ascendFactor: 0.3, descendFactor: 2,
    minValue: 1
  });
  state.mech.engine.gears['3rd'].torqueFn = createAsymmetricTorque ({
    peak: state.mech.engine.maxBaseRPM - 3,
    center: state.mech.engine.peakTorqueRPM, width: 2,
    rate: 1.2, ascendFactor: 0.1, descendFactor: 2,
    minValue: 1
  });

  //setting up a map
  state.map = generateTerrainMap();

  //settin up listeners
  emitter.subscribe('ignitionToggle', updateIgnition.bind(this));
  emitter.subscribe('clutchToggle', updateClutch.bind(this));
  emitter.subscribe('gearShift', updateGear.bind(this));
  emitter.subscribe('outputInput', setEnergyOutput.bind(this));
  emitter.subscribe('coolantCanisterValveChange', updateCoolantCanisterValve.bind(this));
  emitter.subscribe('beat', updateLocation.bind(this));
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
    const type = terrainData.types[randRange(0, terrainData.types.length)];
    const resistance = Math.floor(rand() * 3) + 1;
    const friction = Math.floor(rand() * 3) + 1;

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
      segmentLength,
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
  const currentOutput = state.mech.status.energyOutput;
  state.mech.status.gear = gear;
  setEnergyOutput(1);
  setTimeout(() => {
    setEnergyOutput(currentOutput);
  }, GEARSHIFT_DELAY);
}

function updateBaseRPM() {
  const maxEnergyOutput = state.mech.reactor.maxOutput;
  const energyOutput = state.mech.status.energyOutput;
  const maxRPM = state.mech.engine.maxBaseRPM;
  const energyBasedRPM = round((energyOutput / maxEnergyOutput) * maxRPM, 3);

  const baseRPM = state.mech.status.baseRPM;
  const targetBaseRPM = energyBasedRPM;

  const canTransmit = !state.mech.status.flags.clutch && state.mech.status.gear !== "N";

  const torque = state.mech.status.torque;
  const momentum = round(MASS_INDEX_BASE * (state.mech.status.movement.speedApprox / state.mech.status.maxSpeed), 3);
  const resistance = canTransmit ? state.map[state.mech.location.segmentID].resistance : 0;
  const canClimb = round(torque + momentum - resistance, 3) > 0 ? true : false;
  const torqueDelta = Math.abs(state.mech.status.torque - resistance);
  const engineAcceleration = round(1 + torqueDelta / 10, 3);
  const inertia = round(baseRPM / targetBaseRPM, 3);
  const rate = round(RPM_RAMP_RATE * inertia + RPM_RAMP_RATE * engineAcceleration, 3);

  if (canClimb) {
    //if can climb, either ramp up, decay or settle
    if (targetBaseRPM > baseRPM) {
      if (targetBaseRPM - baseRPM > rate) state.mech.status.baseRPM += rate
    } else if (baseRPM > targetBaseRPM) {
      if (baseRPM - targetBaseRPM > rate) state.mech.status.baseRPM -= rate
    } else state.mech.status.baseRPM = targetBaseRPM;
  } else {
    //if cannot climb, either stall or decay
    if (baseRPM <= 0) {
      state.mech.status.baseRPM = 0;
      if (state.mech.status.flags.ignition) setTimeout(() => {
        if (state.mech.status.baseRPM == 0) {
          emitter.emit('stalled', true);
          emitter.emit('ignitionToggle', false);
        };
      }, STALL_DELAY);
    } else state.mech.status.baseRPM -= rate;
  }

  state.mech.status.baseRPM = round(state.mech.status.baseRPM, 3);

  emitter.emit('engineWorking', state.mech.status.baseRPM);

  LOGGING && energyOutput !== state.mech.status.baseRPM ?
    emitter.emit('[LOG][gameManager] baseRPM', {
      value: state.mech.status.baseRPM,
      maxEnergyOutput, energyOutput, maxRPM, energyBasedRPM, targetBaseRPM,
      canTransmit, torque, momentum, resistance, canClimb, torqueDelta, engineAcceleration, inertia, rate
    }) : null;
}

function updateTorque() {
  const gear = state.mech.status.gear;
  const baseRPM = state.mech.status.baseRPM;
  const targetTorque = round(state.mech.engine.gears[gear].torqueFn(baseRPM), 4);
  const torque = state.mech.status.torque

  if (targetTorque > torque) state.mech.status.torque += TORQUE_RAMP_RATE;
  else state.mech.status.torque = targetTorque;

  LOGGING && torque !== state.mech.status.torque ?
    emitter.emit('[LOG][gameManager] torque', {
      value:  state.mech.status.torque,
      gear, baseRPM, targetTorque,
    }) : null;
}

function updateEndpointRPM() {
  const baseRPM = state.mech.status.baseRPM;
  const endpointRPM = state.mech.status.endpointRPM;
  const gear = state.mech.engine.gears[state.mech.status.gear];
  const targetEndpointRPM = baseRPM * gear.ratio;
  const canTransmit = !state.mech.status.flags.clutch && state.mech.status.gear !== "N";

  const rate = RPM_RAMP_RATE;
  
  if (canTransmit) {
    state.mech.status.endpointRPM = targetEndpointRPM;
  } else {
    if (endpointRPM - rate > 0) state.mech.status.endpointRPM -= rate
    else state.mech.status.endpointRPM = 0;
  };

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
      baseRPM, gear, targetEndpointRPM, canTransmit
    }) : null;
}

function calculateSpeedApprox () {
  const currentSpeed = state.mech.status.movement.speedApprox;
  const endpointRPM = state.mech.status.endpointRPM;
  const stepLength = state.mech.chassis.stepLength;

  state.mech.status.movement.speedApprox = endpointRPM * stepLength;

  LOGGING && currentSpeed !== state.mech.status.movement.speedApprox ?
    emitter.emit('[LOG][gameManager] speedApprox', {
      value: state.mech.status.movement.speedApprox,
      endpointRPM, stepLength
    }) : null;
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

function updateLocation() {
  if (state.mech.status.movement.speedApprox == 0) return;
  const segID = state.mech.location.segmentID
  const loc = state.map[segID];
  const x = round(state.mech.location.x + state.mech.chassis.stepLength, 4);

  if (segID < (state.map.length - 1)) {
    emitter.emit('[LOG][gameManager] Location update', { segID, loc, x });
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
  state.timeElapsed = round(state.timeElapsed, 4);
  updateBaseRPM();
  updateEndpointRPM();
  calculateSpeedApprox();
  if (state.mech.status.flags.ignition) {
    updateTorque();
    consumeFuel();
  };
  updateHeat();
}

function createAsymmetricTorque({
  peak,
  center = 0,
  width = 1,
  rate,
  ascendFactor = 1,
  descendFactor = 1,
  minValue = 0
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
    
    return val > minValue ? val : minValue;
  };
}