// experimental-main.js (Modular Rewrite)

import {
  playGearShiftSound,
  playIgnitionSound,
  playIgnitionOffSound,
  startEngineLoop,
  stopEngineLoop,
  updateEngineLoopPlaybackRate,
  playVentingSound,
  playStepSound
} from './experimental-audio.js';

import { createGameState } from './experimental-state-controller.js';
import {
  ButtonComponent,
  ToggleButtonComponent,
  GearStickComponent,
  SliderComponent,
  LeverComponent
} from './experimental-components.js';

const game = createGameState();

// === Setup UI Panels ===
const panels = {
  timeBiome: document.getElementById('panel-top-left'),
  terrainScanner: document.getElementById('panel-top-center'),
  systemMonitor: document.getElementById('panel-top-right'),
  holodeck: document.getElementById('panel-mid-left'),
  cockpitControls: document.getElementById('panel-bottom-right'),
  reactorControls: document.getElementById('panel-mid-right'),
  modules: document.getElementById('panel-bottom-left'),
  cargoAndTools: document.getElementById('panel-bottom-center'),
  hud: document.getElementById('panel-center-main')
};

function setupKeyboardInput() {
  const STEP = 1;
  const isPopupVisible = () => document.body.classList.contains('disabled-input');
    window.addEventListener('keydown', e => {
    if (e.code === 'KeyW') {
      const s = game.getState();
      const newVal = Math.min(20, s.energyOutput + STEP);
      game.setEnergyOutput(newVal);
    } else if (e.code === 'KeyS') {
      const s = game.getState();
      const newVal = Math.max(0, s.energyOutput - STEP);
      game.setEnergyOutput(newVal);
    }
    if (isPopupVisible()) return;
    if (e.code === 'Space') game.setClutchOverride(true);
  });
    window.addEventListener('keyup', e => {
    if (isPopupVisible()) return;
    if (e.code === 'Space') game.setClutchOverride(false);
  });
}

function renderStaticPanels() {
  panels.timeBiome.innerHTML = `
    <div>Time: 14:42</div>
    <div>Biome: Jungle</div>
    <div>Coords: X:231, Y:588, Z:3</div>
  `;
  panels.cargoAndTools.innerHTML = `
    <div>Cargo Interface - Placeholder</div>
    <div>Arm Tools - Placeholder</div>
    <div>External Hatch - Placeholder</div>
    <button onclick="console.log('Ejection triggered')">Eject</button>
  `;
}

function setupModules() {
  const ventButton = new ButtonComponent(`<i class="fa-solid fa-wind"></i>`, () => {
    if (document.body.classList.contains('disabled-input')) return;
    if (ventButton.element.disabled) return;
    game.activateVenting();
    playVentingSound();
    ventButton.element.disabled = true;
    ventButton.element.classList.add('cooldown');
    ventButton.element.style.setProperty('--cooldown-duration', '5s');
    setTimeout(() => {
      ventButton.element.disabled = false;
      ventButton.element.classList.remove('cooldown');
    }, 5000);
  });
    panels.modules.appendChild(ventButton.element);
}

let monitorCanvas, monitorCtx;
function setupSystemMonitor() {
  monitorCanvas = document.getElementById("systemMonitorCanvas");
  monitorCtx = monitorCanvas.getContext("2d");
  const scale = window.devicePixelRatio || 1;
  monitorCanvas.width = 260 * scale;
  monitorCanvas.height = 100 * scale;
  monitorCanvas.style.width = "260px";
  monitorCanvas.style.height = "100px";
  monitorCtx.scale(scale, scale);
}

function drawMiniMeter(ctx, x, y, label, value, max, color) {
  const width = 160, height = 12, pct = value / max;
  ctx.fillStyle = "#111";
  ctx.fillRect(x, y, width, height);
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width * pct, height);
  ctx.strokeStyle = "#0f0";
  ctx.strokeRect(x, y, width, height);
  ctx.font = "11px monospace";
  ctx.fillStyle = "#0f0";
  ctx.fillText(`${label}: ${value.toFixed(1)}`, x + width + 10, y + 10);
}

let hudCanvas, ctx, rpmWheel, wheelAngle = 0, clutchIndicator;
function setupHUD() {
  hudCanvas = document.getElementById("hudCanvas");
  ctx = hudCanvas.getContext("2d");
  rpmWheel = document.getElementById("rpmWheelImg");
  clutchIndicator = document.createElement('div');
  clutchIndicator.style.position = 'absolute';
  clutchIndicator.style.bottom = '10px';
  clutchIndicator.style.left = '10px';
  clutchIndicator.style.font = '14px monospace';
  clutchIndicator.style.color = '#0f0';
  panels.hud.appendChild(clutchIndicator);
}

function drawMeter(ctx, x, y, label, value, max, color = "#0f0") {
  const height = 20, width = 200, ratio = value / max;
  ctx.fillStyle = "#222";
  ctx.fillRect(x, y, width, height);
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width * ratio, height);
  ctx.strokeStyle = "#0f0";
  ctx.strokeRect(x, y, width, height);
  ctx.fillStyle = "#0f0";
  ctx.font = "12px monospace";
  ctx.fillText(`${label}: ${value.toFixed(1)}`, x, y - 4);
}

let autoClutchToggle, gearStick, outputLever;
function setupCockpitControls() {
  autoClutchToggle = new ToggleButtonComponent("A", false, () => {
    if (document.body.classList.contains('disabled-input')) return;
    game.toggleAutomaticClutch();
  });
  panels.cockpitControls.appendChild(autoClutchToggle.element);

  gearStick = new GearStickComponent({
      initial: 1,
      onChange: (label, index, trigger = 'user') => {
      const state = game.getState();
      const allowShift = state.automaticClutch || !state.clutchEngaged;
      if (trigger === 'user' && !allowShift) {
          // Prevent user drag without clutch disengaged
          gearStick.setValue(lastGearIndex, false);
          return;
        }
        game.setGear(label);
    }
  });
  panels.cockpitControls.appendChild(gearStick.element);
}

function setupReactorControls() {
  const reactorWrapper = document.createElement('div');
  reactorWrapper.className = 'reactor-cluster';

  const reactorLeft = document.createElement('div');
  reactorLeft.className = 'reactor-side-buttons';

  const ignitionToggle = new ToggleButtonComponent(`<i class="fa-solid fa-bolt"></i>`, false, (val) => {
    if (document.body.classList.contains('disabled-input')) return;
    val ? playIgnitionSound() : playIgnitionOffSound();
    game.toggleIgnition();
  });

  const overdriveToggle = new ToggleButtonComponent(`<i class="fa-solid fa-fire-flame-curved"></i>`, false, () => {
    if (document.body.classList.contains('disabled-input')) return;});
  [ignitionToggle, overdriveToggle].forEach(btn => {
    btn.element.style.marginBottom = '12px';
    reactorLeft.appendChild(btn.element);
  });

  outputLever = new LeverComponent({
    label: "",
    min: 0,
    max: 20,
    step: 1,
    initial: 5,
    discrete: true,
    onChange: (val) => game.setEnergyOutput(val)
  });

  const reactorRight = document.createElement('div');
  reactorRight.className = 'reactor-output-lever';
  reactorRight.appendChild(outputLever.element);

  reactorWrapper.appendChild(reactorLeft);
  reactorWrapper.appendChild(reactorRight);

  panels.reactorControls.appendChild(reactorWrapper);
}

let lastGearIndex = null;

function handleAudioEvents(events, state) {
  events.forEach(event => {
    switch (event.type) {
      case "GEAR_SHIFT": playGearShiftSound(); break;
      case "IGNITION_ON": playIgnitionSound(); startEngineLoop(); break;
      case "IGNITION_OFF": playIgnitionOffSound(); stopEngineLoop(); break;
      case "VENTING_ACTIVATED": playVentingSound(); break;
      case "STEP": playStepSound(event.rate); break;
    }
  });
}

function handleStepVisual(event) {
  const intensity = 10
  const cockpit = document.getElementById("cockpit");
  const shakables = document.getElementsByClassName("shakeable");
  console.log(cockpit);
  
  
  if (!shakables) return;

  Array.from(shakables).forEach(dom => {    
    dom.style.transform = `translate(${(Math.random() - 0.5) * 4 * intensity}px, ${(Math.random() - 0.5) * 4 * intensity}px)`;
    setTimeout(() => {
      dom.style.transform = '';
    }, 100);
  });
}

function handleVisualEvents(events, state) {
  events.forEach(event => {
    switch (event.type) {
      case "STEP":
        handleStepVisual(event);
        break;

      case "MISSION_COMPLETE":
        //handleMissionCompleteVisual(event);
        break;

      case "VENTING_ACTIVATED":
        //handleVentingVisual(event);
        break;

      case "GEAR_SHIFT":
        //handleGearShiftVisual(event);
        break;

      // Add more cases as needed
    }
  });
}


function updateUI(s) {
  gearStick.track.classList.toggle('disabled', !s.automaticClutch && s.clutchEngaged);
  clutchIndicator.textContent = s.clutchEngaged ? 'Clutch: Engaged' : 'Clutch: Disengaged';
  clutchIndicator.style.color = s.clutchEngaged ? '#0f0' : '#ff0';
  autoClutchToggle.setValue(s.automaticClutch);

  monitorCtx.clearRect(0, 0, monitorCanvas.width, monitorCanvas.height);
  drawMiniMeter(monitorCtx, 10, 10, "Fuel", s.fuel, 100, "#0f0");
  drawMiniMeter(monitorCtx, 10, 30, "Heat", s.heat, 100, "#f00");
  if (s.ignition) drawMiniMeter(monitorCtx, 10, 50, "Energy", s.energyOutput, 20, "#0ff");

  ctx.clearRect(0, 0, hudCanvas.width, hudCanvas.height);
  drawMeter(ctx, 20, 30, "Torque", s.torque, 10, "#ff0");
  drawMeter(ctx, 20, 70, "Base RPM", s.baseRPM, 10, "#ccc");
  drawMeter(ctx, 20, 110, "Endpoint RPM", s.endpointRPM, 100, "#fff");
  drawMeter(ctx, 20, 150, "Speed", s.speed, 1000, "#0ff");
  if (s.isStalled) {
    ctx.fillStyle = "#f00";
    ctx.font = "16px monospace";
    ctx.fillText("⚠️ STALLED", 20, 190);
  }

  drawTerrainMap(s.terrainMap, s.mechX);

  const gearIndexMap = { "Reverse": 0, "Neutral": 1, "1st": 2, "2nd": 3, "3rd": 4 };
  const currentGearIndex = gearIndexMap[s.gear];
  if (lastGearIndex !== currentGearIndex) {
    gearStick.setValue(currentGearIndex);
    lastGearIndex = currentGearIndex;
    playGearShiftSound();
  }

  outputLever.setValue(s.energyOutput);

  const popup = document.getElementById("mission-complete-popup");
  const popupText = document.getElementById("mission-summary-text");
  if (s.missionComplete && popup.classList.contains('hidden')) {
    popupText.textContent = s.missionCompleteMessage;
    popup.classList.remove('hidden');
    document.body.classList.add('disabled-input');
  }
}

function startGameLoop() {
  setInterval(() => {
    const delta = 1 / 20;
    game.tick(delta);
    const s = game.getState();
    handleAudioEvents(s.events, s);
    handleVisualEvents(s.events, s);
    updateUI(s);
  }, 50);
}

let terrainCanvas, terrainCtx;
let holodeckCanvas, holodeckCtx;

function setupTerrainScanner() {
  terrainCanvas = document.getElementById("terrainScannerCanvas");
  terrainCtx = terrainCanvas.getContext("2d");
}

function setupHolodeck() {
  holodeckCanvas = document.getElementById("holodeckCanvas");
  holodeckCtx = holodeckCanvas.getContext("2d");
}

function drawTerrainMap(terrainMap, mechX) {
  const steppedMechX = game.getState().steppedMechX;

  const width = terrainCanvas.width;
  const height = terrainCanvas.height;
  const scale = 660;
  const centerX = 200;

  terrainCtx.clearRect(0, 0, width, height);
  terrainCtx.lineWidth = 2;

  for (let i = 0; i < terrainMap.length - 1; i++) {
    const seg = terrainMap[i];
    const next = terrainMap[i + 1];
    const relX = seg.x - steppedMechX;
    const relNextX = next.x - steppedMechX;
    if (relX >= -530 && relX <= 530) {
      const screenX = (relX / scale) * width + width / 2;
      const screenY = height / 2 - seg.z * 2;
      if (i === 0 || (terrainMap[i - 1].x - mechX) < -530) {
        terrainCtx.moveTo(screenX, screenY);
      } else {
        terrainCtx.lineTo(screenX, screenY);
      }

      // === Draw colored terrain difficulty ===
      terrainCtx.strokeStyle = seg.resistanceColor || '#0f0';
      terrainCtx.lineTo(screenX, screenY);
    }
  }
  
  // Draw each segment as a colored slope with start/end notches
  for (let i = 0; i < terrainMap.length - 1; i++) {
    const seg = terrainMap[i];
    const next = terrainMap[i + 1];
    const speed = game.getState().speed;
    const gear = game.getState().gear;
    const baseRPM = game.getState().baseRPM;
    const ratio = { "Reverse": -1, "Neutral": 0, "1st": 1, "2nd": 1.2, "3rd": 1.6 }[gear] || 0;
    const stepLength = baseRPM * ratio;
    const snappedMechX = stepLength > 0 ? Math.floor(steppedMechX / stepLength) * stepLength : steppedMechX;
    
  const relX = seg.x - snappedMechX;
    const relNextX = next.x - snappedMechX;

    if (relX >= -530 && relX <= 530) {
      const sx = (relX / scale) * width + width / 2;
      const sy = height / 2 - seg.z * 2;
      const ex = (relNextX / scale) * width + width / 2;
      const ey = height / 2 - next.z * 2;

      terrainCtx.beginPath();
      terrainCtx.moveTo(sx, sy);
      terrainCtx.lineTo(ex, ey);
      terrainCtx.strokeStyle = seg.resistanceColor || '#0f0';
      terrainCtx.stroke();

      // Notches
      terrainCtx.beginPath();
      terrainCtx.strokeStyle = '#0ff';
      terrainCtx.moveTo(sx, sy - 2);
      terrainCtx.lineTo(sx, sy + 2);
      terrainCtx.moveTo(ex, ey - 2);
      terrainCtx.lineTo(ex, ey + 2);
      terrainCtx.stroke();
    }
  }

  // Draw mech position
  terrainCtx.fillStyle = '#ff0';
  terrainCtx.beginPath();
  terrainCtx.moveTo(width / 2 - 5, height / 2);
  terrainCtx.lineTo(width / 2 + 5, height / 2);
  terrainCtx.lineTo(width / 2, height / 2 - 10);
  terrainCtx.fill();
}

function drawMechPictogram() {
  const ctx = holodeckCtx;
  const w = holodeckCanvas.width;
  const h = holodeckCanvas.height;
  ctx.clearRect(0, 0, w, h);

  // Glow background
  const gradient = ctx.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, 100);
  gradient.addColorStop(0, 'rgba(0, 255, 255, 0.1)');
  gradient.addColorStop(1, 'rgba(0, 255, 255, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = "#0ff";
  ctx.lineWidth = 2;

  // Torso
  ctx.beginPath();
  ctx.moveTo(w / 2 - 20, h / 2 - 30);
  ctx.lineTo(w / 2 - 15, h / 2 - 60);
  ctx.lineTo(w / 2 + 15, h / 2 - 60);
  ctx.lineTo(w / 2 + 20, h / 2 - 30);
  ctx.closePath();
  ctx.stroke();

  // Head/Cockpit
  ctx.beginPath();
  ctx.rect(w / 2 - 8, h / 2 - 70, 16, 10);
  ctx.stroke();

  // Arms
  ctx.beginPath();
  ctx.moveTo(w / 2 - 20, h / 2 - 30);
  ctx.lineTo(w / 2 - 35, h / 2);
  ctx.lineTo(w / 2 - 30, h / 2 + 30);

  ctx.moveTo(w / 2 + 20, h / 2 - 30);
  ctx.lineTo(w / 2 + 35, h / 2);
  ctx.lineTo(w / 2 + 30, h / 2 + 30);
  ctx.stroke();

  // Legs
  ctx.beginPath();
  ctx.moveTo(w / 2 - 10, h / 2);
  ctx.lineTo(w / 2 - 15, h / 2 + 40);
  ctx.lineTo(w / 2 - 10, h / 2 + 50);

  ctx.moveTo(w / 2 + 10, h / 2);
  ctx.lineTo(w / 2 + 15, h / 2 + 40);
  ctx.lineTo(w / 2 + 10, h / 2 + 50);
  ctx.stroke();
}

function setupPanels() {
  renderStaticPanels();
  setupModules();
  setupSystemMonitor();
  setupTerrainScanner();
  setupHUD();
  setupHolodeck();
  drawMechPictogram();
  setupReactorControls();
  setupCockpitControls();
}

function initializeUI() {
  console.log(`Started the init...`);
  setupKeyboardInput();
  setupPanels();
  startGameLoop();
}

initializeUI();
