import emitter from './eventEmitter.js';
import { round } from '../utils/helpers.js';

const LOGGING = true;
const STEP_BASE_DISTANCE = 100; // seconds for full cycle of baseRPM steps
const SPEED_SCALE = 5.4;
const TORQUE_RAMP_RATE = 0.05;
const BASE_RPM_RAMP_RATE = 0.015;
const ENDPOINT_RPM_RAMP_RATE = 0.1;
const ENDPOINT_RPM_DECAY = 0.05;
const BRAKING_STRENGTH = 2;
const FUEL_CONS_MOD = 0.01;


const state = {
    timeElapsed: 0,
    mech: {
        chassis: {
            maxSpeed: 20,
            stability: 4,
            traction: 1,
            emptyWeight: 50,
            maximumLoad: 250,
            heatDissRate: 0.5
        },
        reactor: {
            maxFuel: 255,
            maxOutput: 12,
            maxHeat: 255,
            fuelEfficiency: 0.3,
        },
        engine: {
            overdriveThreshold: 10,
            peakTorque: 6,
            maxBaseRPM: 6,
            gears: {
                'Reverse': {
                    ratio: 1,
                    torqueFn: createAsymmetricTorque ({
                        peak: 3,
                        center: 4,
                        width: 2,
                        rate: 2,
                        ascendFactor: 0.5,   // half the curvature on the ascending side
                        descendFactor: 2,    // double the curvature on the descending side
                        minValue: 1,
                        minClampX: 1
                    })
                },
                'Neutral': {
                    ratio: 1,
                    torqueFn: createAsymmetricTorque ({
                        peak: 6,
                        center: 4,
                        width: 2,
                        rate: 2,
                        ascendFactor: 0.5,   // half the curvature on the ascending side
                        descendFactor: 2,    // double the curvature on the descending side
                        minValue: 1,
                        minClampX: 1
                    })
                },
                '1st': {
                    ratio: 1,
                    torqueFn: createAsymmetricTorque ({
                        peak: 6,
                        center: 4,
                        width: 2,
                        rate: 2,
                        ascendFactor: 0.5,   // half the curvature on the ascending side
                        descendFactor: 2,    // double the curvature on the descending side
                        minValue: 1,
                        minClampX: 1
                    })
                },
                '2nd': {
                    ratio: 1.8,
                    torqueFn: createAsymmetricTorque ({
                        peak: 4,
                        center: 4,
                        width: 2,
                        rate: 2,
                        ascendFactor: 0.3,   // half the curvature on the ascending side
                        descendFactor: 2,    // double the curvature on the descending side
                        minValue: 1,
                        minClampX: 1
                    })
                },
                '3rd': {
                    ratio: 2.6,
                    torqueFn: createAsymmetricTorque ({
                        peak: 2,
                        center: 4,
                        width: 2,
                        rate: 2,
                        ascendFactor: 0.1,   // half the curvature on the ascending side
                        descendFactor: 2,    // double the curvature on the descending side
                        minValue: 1,
                        minClampX: 1
                    })
                }
            },
            maxSpeed: 0
        },
        status: {
            bars: {
                mechIntegrity: 255,
                crewHealth: 255,
                heat: 0,
                pathfinding: 255,
                flooding: 0,
                fuel: 255,
            },
            energyOutput: 0,
            baseRPM: 0,
            torque: 0,
            gear: 'Neutral',
            endpointRPM: 0,
            movement: {
                stepAccumulator: 0,
                speedApprox: 0,
                stepCount: 0
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
    state.mech.status.fuel = state.mech.reactor.maxFuel;
    state.mech.status.bars.heat = round( state.mech.reactor.maxHeat / 2, 0);
    //calculating maxSpeed for the speedGauge
    const maxBaseRPM = state.mech.engine.maxBaseRPM
    const highestSpeedRatio = state.mech.engine.gears['3rd'].ratio;
    state.mech.engine.maxSpeed = Math.round(maxBaseRPM * highestSpeedRatio * SPEED_SCALE);

    //setting up a map
    state.map = generateTerrainMap();

    //settin up listeners
    emitter.subscribe('ignitionToggle', updateIgnition.bind(this));
    emitter.subscribe('clutchToggle', updateClutch.bind(this));
    emitter.subscribe('gearShift', updateGear.bind(this));
    emitter.subscribe('outputChange', setEnergyOutput.bind(this));
    emitter.subscribe('stepMade', updateLocation.bind(this));
    

    LOGGING ? console.log('[gameManager] Game state is set', state) : null;
}

export function generateTerrainMap(seed = 0) {
    const map = [];
    const segmentCount = 20;
    const rand = mulberry32(seed);
    
  
    let currentZ = 10;
    let currentX = 0;
  
    for (let i = 0; i < segmentCount; i++) {
        // Dynamic segment length between 30 and 300
        const segmentLength = Math.floor(rand() * 270) + 30;

        // Friction and resistance as integers 1–3
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
    state.mech.status.flags.clutch = flag;
}

function updateIgnition(newState) {
    state.mech.status.flags.ignition = newState;

    if (newState && state.mech.status.bars.fuel > 0) {
        setEnergyOutput(1);
    } else {
        setEnergyOutput(0);
    }
}

function setEnergyOutput(value) {
    const maxOutput = state.mech.reactor.maxOutput;
    const checkedValue = value >= 1 ? value : 1;
    if (state.mech.status.flags.ignition)
        state.mech.status.energyOutput = checkedValue <= maxOutput ? checkedValue : maxOutput
    else state.mech.status.energyOutput = 0
}

function updateGear (gear) {
    state.mech.status.gear = gear;
}

function updateBaseRPM() {
    const maxEnergyOutput = state.mech.reactor.maxOutput;
    const energyOutput = state.mech.status.energyOutput;
    const maxRPM = state.mech.engine.maxBaseRPM;
    const canTransmit = !state.mech.status.flags.clutch && state.mech.status.gear !== "Neutral";
    const energyBasedRPM = round((energyOutput / maxEnergyOutput) * maxRPM, 3);
    const targetRampRate = BASE_RPM_RAMP_RATE;
    const targetDecayRate = round(targetRampRate * (canTransmit ? 2 : 1), 3);
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
        canTransmit, targetRampRate, targetBaseRPM
    }) : null;
}

function updateEndpointRPM() {
    const gear = state.mech.status.gear;
    const baseRPM = state.mech.status.baseRPM;
    const canTransmit = !state.mech.status.flags.clutch && state.mech.status.gear !== "Neutral";
    const targetEndpointRPM = canTransmit ? round(baseRPM * state.mech.engine.gears[gear].ratio, 3) : 0;
    const endpointRPM = state.mech.status.endpointRPM;
    const targetRampRate = round(Math.abs(targetEndpointRPM - endpointRPM) * ENDPOINT_RPM_RAMP_RATE, 3);

    if (canTransmit) {
        //acceleration or endine braking
        if (targetEndpointRPM > endpointRPM && targetEndpointRPM - endpointRPM > targetRampRate)
            { state.mech.status.endpointRPM += targetRampRate }
        else if (targetEndpointRPM < endpointRPM && endpointRPM - targetEndpointRPM > targetRampRate)
            { state.mech.status.endpointRPM -= targetRampRate };
    } else {
        //clutch off or neutral
        if (endpointRPM > 0) { state.mech.status.endpointRPM -= ENDPOINT_RPM_DECAY }
        else { state.mech.status.endpointRPM = targetEndpointRPM }
    }

    if (state.mech.status.endpointRPM > 0.01)
        state.mech.status.endpointRPM = round(state.mech.status.endpointRPM, 3)
    else state.mech.status.endpointRPM = 0
    
    LOGGING && endpointRPM !== state.mech.status.endpointRPM ?
    emitter.emit('[LOG][gameManager] endpointRPM', {
        value: state.mech.status.endpointRPM,
        gear, baseRPM, canTransmit, targetEndpointRPM, targetRampRate
    }) : null;
}

function calculateSpeedApprox () {
    const endpointRPM = state.mech.status.endpointRPM;
    const targetSpeed = round(endpointRPM * SPEED_SCALE, 3);

    state.mech.status.movement.speedApprox = targetSpeed;

    emitter.emit('mechMoving', state.mech.status.movement.speedApprox);

    LOGGING && targetSpeed > 0 ?
    emitter.emit('[LOG][gameManager] speedApprox', {
        value: state.mech.status.movement.speedApprox,
        endpointRPM, targetSpeed
    }) : null;
}

function calculateSteps() {
    const accum = state.mech.status.movement.stepAccumulator;
    const endpointRPM = state.mech.status.endpointRPM;
    const gear = state.mech.status.gear;
    const ratio = state.mech.engine.gears[gear].ratio;
    const currentStepDistance = (STEP_BASE_DISTANCE + endpointRPM) * ratio;
    const stepNum = state.mech.status.movement.stepCount;

    if (endpointRPM > 0.01) {
        if (accum >= currentStepDistance) {
            emitter.emit('stepMade', { currentStepDistance,  stepNum });
            state.mech.status.movement.stepAccumulator = 0;
            state.mech.status.movement.stepCount++;
        } else {
            state.mech.status.movement.stepAccumulator += endpointRPM;
            state.mech.status.movement.stepAccumulator = round(state.mech.status.movement.stepAccumulator, 3);
        }
    
        LOGGING ?
        emitter.emit('[LOG][gameManager] stepMade', {
            accum, endpointRPM, currentStepDistance, ratio,
        }) : null;
    }
}

function updateTorque() {
    const gear = state.mech.status.gear;
    const baseRPM = state.mech.status.baseRPM;
    const targetTorque = Math.round(state.mech.engine.gears[gear].torqueFn(baseRPM));
    const torque = state.mech.status.torque

    if (targetTorque > torque) { state.mech.status.torque += TORQUE_RAMP_RATE }
    else { state.mech.status.torque = targetTorque };

    LOGGING && torque !== state.mech.status.torque ?
    emitter.emit('[LOG][gameManager] torque', {
        value:  state.mech.status.torque,
        gear, baseRPM, targetTorque,
    }) : null;
}

function consumeFuel() {
    const fuelConsumptionTarget = state.mech.status.energyOutput * state.mech.reactor.fuelEfficiency * FUEL_CONS_MOD;

    if (state.mech.status.bars.fuel > fuelConsumptionTarget) state.mech.status.bars.fuel -= fuelConsumptionTarget;
    else {
        state.mech.status.bars.fuel = 0;
        updateIgnition(false);
    }
    
}

function updateLocation(stepDistance) {
    const segID = state.mech.location.segmentID
    const loc = state.map[segID];
    const x = state.mech.location.x + stepDistance;

    if (segID < (state.map.length - 1)) {
        if (state.map[segID + 1].x <= x) {
            state.mech.location.x = x;
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
    calculateSteps();
    updateTorque();
    consumeFuel();
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