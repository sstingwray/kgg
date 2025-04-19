import emitter from './eventEmitter.js';

function createAsymmetricTorque({
        peak,
        center = 0,
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

        if (x <= center) {
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

const STEP_CYCLE_DURATION = 8; // seconds for full cycle of baseRPM steps
const STALL_RECOVERY_TIME = 0.1; // time needed to recover from stall
const SPEED_INERTIA_SCALE = 25;  // how speed influences inertia
const RPM_DECAY_WHEN_STALLED = 0.01; // endpointRPM drag multiplier
const GEAR_SHIFT_COOLDOWN = 0.5; // time after shift before energy returns
const TORQUE_RAMP_RATE = 0.2;
const RPM_RAMP_RATE = 0.2;


const state = {
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
            maxFuel: 100,
            maxOutput: 12,
            maxHeat: 100,
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
                        center: 3,
                        rate: 0.2,
                        ascendFactor: 0.5,   // half the curvature on the ascending side
                        descendFactor: 2,    // double the curvature on the descending side
                        minValue: 1,
                        minClampX: 1
                    })
                },
                'Neutral': {
                    ratio: 0,
                    torqueFn: createAsymmetricTorque ({
                        peak: 6,
                        center: 3,
                        rate: 0.2,
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
                        center: 3,
                        rate: 0.2,
                        ascendFactor: 0.5,   // half the curvature on the ascending side
                        descendFactor: 2,    // double the curvature on the descending side
                        minValue: 1,
                        minClampX: 1
                    })
                },
                '2nd': {
                    ratio: 2,
                    torqueFn: createAsymmetricTorque ({
                        peak: 4,
                        center: 3,
                        rate: 0.2,
                        ascendFactor: 0.3,   // half the curvature on the ascending side
                        descendFactor: 2,    // double the curvature on the descending side
                        minValue: 1,
                        minClampX: 1
                    })
                },
                '3rd': {
                    ratio: 3,
                    torqueFn: createAsymmetricTorque ({
                        peak: 2,
                        center: 3,
                        rate: 0.2,
                        ascendFactor: 0.1,   // half the curvature on the ascending side
                        descendFactor: 2,    // double the curvature on the descending side
                        minValue: 1,
                        minClampX: 1
                    })
                }
            }
        },
        status: {
            fuel: 0,
            energyOutput: 0,
            heat: 0,
            speed: 0,
            torque: 0,
            baseRPM: 0,
            endpointRPM: 0,
            gear: 'Neutral',
            flags: {
                ignition: false,
                clutch: false,
                brake: false,
                overdrive: false
            }
        }
    },
    map : []
}

export function setupGameState() {
    //stocking the Mech
    state.mech.status.fuel = state.mech.reactor.maxFuel;

    //setting up a map
    state.map = generateTerrainMap();

    //settin up listeners
    emitter.subscribe('ignitionToggle', updateIgnition.bind(this));
    emitter.subscribe('clutchStateChange', updateClutch.bind(this));
    emitter.subscribe('gearShift', updateGear.bind(this));
    emitter.subscribe('outputChange', updateEnergyOutput.bind(this));

    console.log('Game state is set:', state);
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

function updateIgnition (newState) {
    state.mech.status.flags.ignition = newState;

    newState ? updateEnergyOutput(1) : updateEnergyOutput(0);
}

function updateEnergyOutput (isGrowing) {
    if (isGrowing) {
        state.mech.status.energyOutput < state.mech.reactor.maxOutput ? state.mech.status.energyOutput++ : null;
    } else {
        state.mech.status.energyOutput > 0 ? state.mech.status.energyOutput-- : null;
    }
    console.log(state.mech.status.energyOutput);
    
}

function updateGear (gear) {
    state.mech.status.gear = gear;
}

function updateBaseRPM () {
    const maxEnergyOutput = state.mech.reactor.maxOutput;
    const energyOutput = state.mech.status.energyOutput;
    const maxRPM = state.mech.engine.maxBaseRPM;
    const energyBasedRPM = (energyOutput / maxEnergyOutput) * maxRPM;

    const targetRampRate = RPM_RAMP_RATE;

    const targetBasedRPM = energyBasedRPM;

    const canTransmit = !state.mech.status.flags.clutch && state.mech.status.gear !== "Neutral";
    const canClimb = canTransmit;

    const baseRPM = state.mech.status.baseRPM;

    if (canClimb) {
        //If the Mech can climb, ramp up the base RPM up to the max
        if (targetBasedRPM > baseRPM) { state.mech.status.baseRPM += targetRampRate }
        else { state.mech.status.baseRPM = targetBasedRPM };
    } else {
        //If cannot, decrease RPM
        if (baseRPM > 0) { state.mech.status.baseRPM -= RPM_RAMP_RATE }
        else { state.mech.status.baseRPM = 0 };
    }

    console.log('baseRPM:', state.mech.status.baseRPM, {
        maxEnergyOutput, energyOutput, maxRPM, energyBasedRPM,
        canTransmit, canClimb,
        targetRampRate, targetBasedRPM
    });
}

function updateTorque () {
    const gear = state.mech.status.gear;
    const baseRPM = state.mech.status.baseRPM;
    const targetTorque = Math.round(state.mech.engine.gears[gear].torqueFn(baseRPM));
    const torque = state.mech.status.torque

    if (targetTorque > torque) { state.mech.status.torque += TORQUE_RAMP_RATE }
    else { state.mech.status.torque = targetTorque };

    console.log('torque:', state.mech.status.torque, {
        gear, baseRPM, targetTorque,
    });
}

function updateClutch (flag) {
    state.mech.status.flags.clutch = flag;
}

export function getGameState() {
    return state
}

export function updateGameState() {
    if (state.mech.status.flags.ignition) {
        updateBaseRPM();
        updateTorque();
    };
}