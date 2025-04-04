// experimental-audio.js

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
    engineSource.loop = true;
    engineSource.playbackRate.value = 1.0;
    engineSource.connect(engineContext.destination);
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
    audio.play();
  } catch (e) {
    console.warn("Ignition sound failed to play:", e);
  }
}

export function playIgnitionOffSound() {
  try {
    const audio = new Audio("/sounds/engine-off.ogg");
    audio.play();
  } catch (e) {
    console.warn("Ignition off sound failed to play:", e);
  }
}

export function playGearShiftSound() {
  try {
    const audio = new Audio("/sounds/gear-shift.wav");
    audio.play();
  } catch (e) {
    console.warn("Gear shift sound failed to play:", e);
  }
}

export function playVentingSound() {
  try {
    const audio = new Audio("/sounds/venting.wav");
    audio.play();
  } catch (e) {
    console.warn("Venting sound failed to play:", e);
  }
}