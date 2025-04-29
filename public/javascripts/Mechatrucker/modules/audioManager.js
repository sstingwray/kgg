import emitter from './eventEmitter.js';

const VOLUME_SETTINGS = {
    engine: 0.1,
    ignition: 0.4,
    ignitionOff: 1,
    gearShift: 0.8,
    venting: 1.0,
    step: 0.2
};

const engineContext = new (window.AudioContext || window.webkitAudioContext)();
let engineSource = null;
let engineBuffer = null;
let engineLoopPlaying = false;

export function setupAudio() {

    emitter.subscribe('ignitionToggle', manageEngineLoop.bind(this));
    emitter.subscribe('gearShift', playGearShiftSound.bind(this));
    emitter.subscribe('engineWorking', updateEngineLoopPlaybackRate.bind(this));
    emitter.subscribe('stepMade', playStepSound.bind(this));
    //emitter.subscribe('outputChange', placeholder.bind(this));
}
  
async function loadEngineBuffer() {
    if (!engineBuffer) {
        const res = await fetch("/sounds/engine.wav");
        const arrayBuffer = await res.arrayBuffer();
        engineBuffer = await engineContext.decodeAudioData(arrayBuffer);
    }
}
async function manageEngineLoop(flag) {
    if (flag) {
        playIgnitionSound();
        startEngineLoop();
    } else {
        stopEngineLoop();
        playIgnitionOffSound();
    };
}
  
async function startEngineLoop() {
    await loadEngineBuffer();
    if (!engineLoopPlaying) {
        engineSource = engineContext.createBufferSource();
        engineSource.buffer = engineBuffer;
    
        const gainNode = engineContext.createGain();
        gainNode.gain.value = VOLUME_SETTINGS.engine;
        engineSource.connect(gainNode);
        gainNode.connect(engineContext.destination);
        engineSource.loop = true;
        engineSource.playbackRate.value = 1.0;
        engineSource.start(0);
        engineLoopPlaying = true;
    }
}
  
function stopEngineLoop() {
    if (engineSource) {
        try {
            engineSource.stop();
            engineSource.disconnect();
        } catch (e) {}
        engineSource = null;
        engineLoopPlaying = false;
    }
}
  
function updateEngineLoopPlaybackRate(baseRPM) {
    if (!isFinite(baseRPM)) return;
    if (engineSource && engineLoopPlaying) {
        const clamped = Math.max(0.2, Math.min(2.0, baseRPM / 5));
        engineSource.playbackRate.value = clamped;
    }
}
    
  
function playIgnitionSound() {
    try {
        const audio = new Audio("/sounds/ignition-toggle.wav");
        audio.volume = VOLUME_SETTINGS.ignition;
        audio.play();
    } catch (e) {
        console.warn("Ignition sound failed to play:", e);
    }
}
  
function playIgnitionOffSound() {
    try {
        const audio = new Audio("/sounds/engine-off.ogg");
        audio.volume = VOLUME_SETTINGS.ignitionOff;
        audio.play();
    } catch (e) {
        console.warn("Ignition off sound failed to play:", e);
    }
}
  
function playGearShiftSound() {
    try {
        const audio = new Audio("/sounds/gear-shift.wav");
        audio.volume = VOLUME_SETTINGS.gearShift;
        audio.play();
    } catch (e) {
        console.warn("Gear shift sound failed to play:", e);
    }
}
  
function playVentingSound() {
    try {
        const audio = new Audio("/sounds/venting.wav");
        audio.volume = VOLUME_SETTINGS.venting;
        audio.play();
    } catch (e) {
        console.warn("Venting sound failed to play:", e);
    }
}
  
function playStepSound() {
    try {
        const audio = new Audio("/sounds/mech-step.mp3");
        audio.volume = VOLUME_SETTINGS.step;
        audio.play();
    } catch (e) {
        console.warn("Step sound failed to play:", e);
    }
}