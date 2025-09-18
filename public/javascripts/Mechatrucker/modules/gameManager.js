import emitter from './eventEmitter.js';
import { round, randRange } from '../utils/helpers.js';

const LOGGING = true;
const RPM_RAMP_RATE = 0.05;
const SPEED_RAMP_RATE = 0.1;
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
      stepRate: 2,
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
      peakTorqueBase: 3,
      maxSpeed: 120,
      peakTorqueRPM: 4,
      maxBaseRPM: 6,
      gears: {
        'R': {
          ratio: round(1 / 2.18, 4),
          peakTorque: 2,
          torqueFunc: null,
          stepRecovery: 2,
          transmitting: 1,
          direction: -1,

          torqueFn: null,
        },
        'N': {
          ratio: 1,
          peakTorque: 6,
          torqueFunc: null,
          stepRecovery: 1,
          transmitting: 0,
          direction: 1,

          torqueFn: null,
        },
        '1st': {
          ratio: round(1 / 2.18, 4),
          peakTorque: 5,
          torqueFunc: null,
          stepRecovery: 2,
          transmitting: 1,
          direction: 1,

          torqueFn: null,
        },
        '2nd': {
          ratio: round(1 / 1.32, 4),
          peakTorque: 4,
          torqueFunc: null,
          stepRecovery: 3,
          transmitting: 1,
          direction: 1,

          torqueFn: null,
        },
        '3rd': {
          ratio: round(1 / 0.9, 4),
          peakTorque: 2,
          torqueFunc: null,
          stepRecovery: 4,
          transmitting: 1,
          direction: 1,

          torqueFn: null,
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
      movement: {
        gear: null,
        torque: 0,
        momentum: 0,
        gait: 0,
        lastStep: {
          stepNumber: null,
          gear: null,
          recoveryAccum: null
        },
        rpm: 0,
        speed: 0,
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
  state.mech.status.movement.gear = state.mech.engine.gears['N'];
  //setting up gears
  state.mech.engine.gears['R'].peakTorque = round(state.mech.engine.peakTorqueBase * (1 / state.mech.engine.gears['R'].ratio), 0);
  state.mech.engine.gears['R'].torqueFunc = getEnergyToTorqueFunc({
    rate: 0.5, floor: 1, ceiling: state.mech.engine.gears['R'].peakTorque
  });
  state.mech.engine.gears['R'].torqueFn = createAsymmetricTorque ({
    peak: state.mech.engine.gears['R'].peakTorque,
    center: state.mech.engine.peakTorqueRPM, width: 3,
    rate: 0.8, ascendFactor: 0.5, descendFactor: 2,
    minValue: 1
  });

  state.mech.engine.gears['N'].peakTorque = round(state.mech.engine.peakTorqueBase * (1 / state.mech.engine.gears['N'].ratio), 0);
  state.mech.engine.gears['N'].torqueFunc = getEnergyToTorqueFunc({
    rate: 0.5, floor: 1, ceiling: state.mech.engine.gears['N'].peakTorque
  });
  state.mech.engine.gears['N'].torqueFn = createAsymmetricTorque ({
    peak: state.mech.engine.gears['N'].peakTorque,
    center: state.mech.engine.peakTorqueRPM, width: 4,
    rate: 0.5, ascendFactor: 0.7, descendFactor: 2,
    minValue: 1
  });

  state.mech.engine.gears['1st'].peakTorque = round(state.mech.engine.peakTorqueBase * (1 / state.mech.engine.gears['1st'].ratio), 0);
  state.mech.engine.gears['1st'].torqueFunc = getEnergyToTorqueFunc({
    rate: 0.5, floor: 1, ceiling: state.mech.engine.gears['1st'].peakTorque
  });
  state.mech.engine.gears['1st'].torqueFn = createAsymmetricTorque ({
    peak: state.mech.engine.gears['1st'].peakTorque,
    center: state.mech.engine.peakTorqueRPM, width: 3,
    rate: 0.8, ascendFactor: 0.6, descendFactor: 2,
    minValue: 1
  });

  state.mech.engine.gears['2nd'].peakTorque = round(state.mech.engine.peakTorqueBase * (1 / state.mech.engine.gears['2nd'].ratio), 0);
  state.mech.engine.gears['2nd'].torqueFunc = getEnergyToTorqueFunc({
    rate: 0.5, floor: 1, ceiling: state.mech.engine.gears['2nd'].peakTorque
  });
  state.mech.engine.gears['2nd'].torqueFn = createAsymmetricTorque ({
    peak: state.mech.engine.gears['2nd'].peakTorque,
    center: state.mech.engine.peakTorqueRPM, width: 2,
    rate: 1, ascendFactor: 0.3, descendFactor: 2,
    minValue: 1
  });

  state.mech.engine.gears['3rd'].peakTorque = round(state.mech.engine.peakTorqueBase * (1 / state.mech.engine.gears['3rd'].ratio), 0);
  state.mech.engine.gears['3rd'].torqueFunc = getEnergyToTorqueFunc({
    rate: 0.5, floor: 1, ceiling: state.mech.engine.gears['3rd'].peakTorque
  });
  state.mech.engine.gears['3rd'].torqueFn = createAsymmetricTorque ({
    peak: state.mech.engine.gears['3rd'].peakTorque,
    center: state.mech.engine.peakTorqueRPM, width: 2,
    rate: 1.2, ascendFactor: 0.1, descendFactor: 2,
    minValue: 1
  });

  setLastStep();

  //setting up a map
  state.map = generateTerrainMap();

  //settin up listeners
  emitter.subscribe('ignitionToggle', updateIgnition.bind(this));
  emitter.subscribe('clutchToggle', updateClutch.bind(this));
  emitter.subscribe('gearShift', setGear.bind(this));
  emitter.subscribe('outputInput', setEnergyOutput.bind(this));
  emitter.subscribe('coolantCanisterValveChange', updateCoolantCanisterValve.bind(this));
  emitter.subscribe('beat', tryStep.bind(this));
  emitter.subscribe('stepMade', updateLocation.bind(this));
  emitter.emit('[LOG][gameManager] Game state is set', state);
}

export function generateTerrainMap(seed = 0) {
  const terrainData = {
    types: [
      {
        id: '', smoothness: 0, resistance: 0, traction: 0,
        features: []
      },
    ],
    features: [
      {
        id: 'sporeCloud', name: 'Spore Cloud', modifies: null, value: null,
        description: `stub`,
        affectedBars: [
          {
            bar: 'heat', beatsToActivate: 3, fn: () => { return 1 },
            msg: `Airvents are clogged by the spores and rapidly growing mycelium.`,
            trigger: 'preCleanse',
          },
        ],
        cleanseConditions: [
          {
            module: 'coolantCanister', fn: (value) => { return value > 0.2 },
            msg: `Blowing subzero coolant throught the mech seems to kill the spores.`,
          }
        ]
      },
      {
        id: 'electroVineTangle', name: 'Electro-vine Tangle', modifies: null, value: null,
        description: `stub.`,
        affectedBars: [
          {
            bar: 'mechIntegrity', beatsToActivate: 1, fn: () => { return -1 },
            msg: `Electric shock from impacts is causing widespread damage to the mech's systems.`,
            trigger: 'preCleanse',
          },
        ],
        cleanseConditions: [
          {
            module: 'stub', fn: (value) => { return value > 2 },
            msg: `Active shielding seems to hold against the shock for now.`
          }
        ]
      },
      {
        id: 'acidicPool', name: 'Acidic Pool', modifies: null, value: null,
        description: `While .`,
        affectedBars: [
          {
            bar: 'crewHealth', beatsToActivate: 2, fn: () => { return 1 },
            msg: `Toxic fumes are slowly but surely poisoning you.`,
            trigger: 'preCleanse',
          },
          {
            bar: 'heat', beatsToActivate: 4, fn: () => { return 1 },
            msg: `While clean from the toxins, the cockpit is getting significantly hotter.`,
            trigger: 'postCleanse',
          },
        ],
        cleanseConditions: [
          {
            module: 'stub', fn: (value) => { return value > 2 },
            msg: `Sealing the cockpit stops the fumes from entering.`
          }
        ]
      },
    ]
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

function setGear (gear) {
  //const currentOutput = state.mech.status.energyOutput;
  state.mech.status.gear = gear;
  state.mech.status.movement.gear = state.mech.engine.gears[gear];
  /*setEnergyOutput(1);
  setTimeout(() => {
    setEnergyOutput(currentOutput);
  }, GEARSHIFT_DELAY);*/
}

function setLastStep() {
  state.mech.status.movement.lastStep = {
    stepNumber: state.mech.status.movement.stepCount,
    gear: state.mech.status.movement.gear,
    recoveryAccum: state.mech.status.movement.gear.stepRecovery
  };
}

function getTorque (energyOutput, maxEnergyOutput, gear) {
  return round((energyOutput / maxEnergyOutput) * gear.peakTorque, 3);
}

function getMomentum (speed, maxSpeed) {
  return round(MASS_INDEX_BASE * (speed / maxSpeed), 3);
}

function getResistance (gear, clutchState, segmentID) {
  return round(gear.transmitting == 0 || !clutchState ? 0 : state.map[segmentID].resistance, 3);
}

function getStepDistance (gear) {
  return round(gear.direction * gear.ratio * state.mech.chassis.stepLength, 3);
}

function getRPM (base, energyOutput, maxEnergy) {
  const energyFactor = round(energyOutput / maxEnergy, 3);
 
  return round(base * energyFactor, 3);
}

function getSmoothRPM () {
  const targetRPM = getRPM(
    state.mech.engine.maxBaseRPM,
    state.mech.status.energyOutput,
    state.mech.reactor.maxOutput
  );
  const currentRPM = state.mech.status.movement.rpm;
  
  return round(getSmoothRate({
    target: targetRPM, current: currentRPM,
    rate: RPM_RAMP_RATE, ascent: 3 }), 3);
}

function getSpeed (rpm, gait) {
  return round(rpm * gait, 3);
}

function getSmoothSpeed () {
  const targetSpeed = getSpeed(
    state.mech.status.movement.rpm,
    state.mech.status.movement.gait
  );
  const currentSpeed = state.mech.status.movement.speed

  return round(getSmoothRate({
    target: targetSpeed, current: currentSpeed,
    rate: SPEED_RAMP_RATE, ascent: 3 }), 3);
}

function tryStep () {
  const torque = getTorque(state.mech.status.energyOutput, state.mech.reactor.maxOutput, state.mech.status.movement.gear);
  const momentum = getMomentum(state.mech.status.movement.speed, state.mech.engine.maxSpeed);
  const resistance = getResistance(state.mech.status.movement.gear, state.mech.status.flags.clutch, state.mech.location.segmentID);
  const canTransmit = !state.mech.status.flags.clutch && state.mech.status.movement.gear.transmitting !== 0;
  const canClimb = torque + momentum - resistance > 0;
  const targetGait = canTransmit && canClimb ? getStepDistance(state.mech.status.movement.gear) : 0;
  const currentGait = state.mech.status.movement.gait;
  const targetRate = state.mech.chassis.stepRate * state.mech.status.movement.gear.ratio;
   
  state.mech.status.movement.gait = getSmoothRate({ 
    target: targetGait, current: currentGait,
    rate: targetRate, ascent: 3, descent: 3 });

  if (state.mech.status.movement.gait > 0) {
    state.mech.status.movement.stepCount++;
    emitter.emit('stepMade', state.mech.status.movement.gait, true);
  };
  

  LOGGING ? emitter.emit('[LOG][gameManager] tryStep', {
    torque, momentum, resistance, canTransmit, canClimb, targetGait, currentGait, targetRate
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

  emitter.emit('heatUpdate', state.mech.status.bars.heat);
}

function updateCoolantCanisterValve(value) {
  state.mech.status.modules.coolantCanister.valve = value;
}

function updateLocation(stepLength) {
  const segID = state.mech.location.segmentID
  const loc = state.map[segID];
  const x = round(state.mech.location.x + stepLength, 4);

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
  state.mech.status.movement.rpm = getSmoothRPM();
  state.mech.status.movement.speed = getSmoothSpeed();
  state.mech.status.movement.torque = getTorque(
    state.mech.status.energyOutput,
    state.mech.reactor.maxOutput,
    state.mech.status.movement.gear
  );
  state.mech.status.movement.momentum = getMomentum(
    state.mech.status.movement.speed,
    state.mech.engine.maxSpeed
  );

  if (state.mech.status.flags.ignition) {
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

function getEnergyToTorqueFunc ({ rate, floor, ceiling }) {
  return (input) => {
    const x = Math.max(0, input);
    const logarithmic = Math.log1p(rate * x);
    const normalized = logarithmic / ( 1 + logarithmic);
    const scaled = floor + normalized * (ceiling - floor);
    return scaled;
  }
}

function getSmoothRate ({ target, current, rate, ascent = 1, descent = 1 }) {  
  if (target - current >= 0)
    if (target - current >= rate * ascent) return round(current + rate * ascent, 3); else return target;
  else
    if (current - target >= rate * descent) return round(current - rate * descent, 3); else return target;
}