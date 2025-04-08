// experimental-audio.js

// === Volume Settings ===
const VOLUME_SETTINGS = {
  engine: 0.2,
  ignition: 0.8,
  ignitionOff: 0.8,
  gearShift: 0.8,
  venting: 1.0,
  step: 0.6
};

const engineContext = new (window.AudioContext || window.webkitAudioContext)();
let engineSource = null;
let engineBuffer = null;
let engineLoopPlaying = false;

async function loadEngineBuffer() {
  if (!engineBuffer) {
    const res = await fetch("/sounds/engine.wav");
    const arrayBuffer = await res.arrayBuffer();
    engineBuffer = await engineContext.decodeAudioData(arrayBuffer);
  }
}

export async function startEngineLoop() {
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

export function stopEngineLoop() {
  if (engineSource) {
    try {
      engineSource.stop();
      engineSource.disconnect();
    } catch (e) {}
    engineSource = null;
    engineLoopPlaying = false;
  }
}

export function updateEngineLoopPlaybackRate(baseRPM) {
    if (!isFinite(baseRPM)) return;
    if (engineSource && engineLoopPlaying) {
      const clamped = Math.max(0.2, Math.min(2.0, baseRPM / 5));
      engineSource.playbackRate.value = clamped;
    }
  }
  

export function playIgnitionSound() {
  try {
    const audio = new Audio("/sounds/ignition-toggle.wav");
    audio.volume = VOLUME_SETTINGS.ignition;
    audio.play();
  } catch (e) {
    console.warn("Ignition sound failed to play:", e);
  }
}

export function playIgnitionOffSound() {
  try {
    const audio = new Audio("/sounds/engine-off.ogg");
    audio.volume = VOLUME_SETTINGS.ignitionOff;
    audio.play();
  } catch (e) {
    console.warn("Ignition off sound failed to play:", e);
  }
}

export function playGearShiftSound() {
  try {
    const audio = new Audio("/sounds/gear-shift.wav");
    audio.volume = VOLUME_SETTINGS.gearShift;
    audio.play();
  } catch (e) {
    console.warn("Gear shift sound failed to play:", e);
  }
}

export function playVentingSound() {
  try {
    const audio = new Audio("/sounds/venting.wav");
    audio.volume = VOLUME_SETTINGS.venting;
    audio.play();
  } catch (e) {
    console.warn("Venting sound failed to play:", e);
  }
}

export function playStepSound(rate = 1.0) {
  try {
    const audio = new Audio("/sounds/mech-step.mp3");
    audio.volume = VOLUME_SETTINGS.step;
    audio.playbackRate = Math.min(2.0, Math.max(0.5, rate));
    audio.play();
  } catch (e) {
    console.warn("Step sound failed to play:", e);
  }
}