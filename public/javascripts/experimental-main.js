// experimental-main.js (Modular Rewrite)

import {
  startEngineLoop,
  stopEngineLoop,
  updateEngineLoopPlaybackRate,
  playIgnitionSound,
  playIgnitionOffSound,
  playGearShiftSound
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
  holodeck: document.getElementById('panel-top-center'),
  cockpitControls: document.getElementById('panel-bottom-right'),
  reactorControls: document.getElementById('panel-mid-right'),
  modules: document.getElementById('panel-bottom-left'),
  cargoAndTools: document.getElementById('panel-bottom-center'),
  hud: document.getElementById('panel-center-main')
};

  let lastBaseRPM = null;
  let lastGear = null;
  let lastIgnition = false;

function setupKeyboardInput() {
  const isPopupVisible = () => document.body.classList.contains('disabled-input');
    window.addEventListener('keydown', e => {
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
    const audio = new Audio('/sounds/venting.wav');
    audio.play();
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

function drawSpinningWheel(ctx, centerX, centerY, radius, rpm) {
  const speed = rpm / 100 * Math.PI * 2;
  wheelAngle += speed;
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(wheelAngle);
  ctx.drawImage(rpmWheel, -radius, -radius, radius * 2, radius * 2);
  ctx.restore();
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

function startGameLoop() {
  const popup = document.getElementById("mission-complete-popup");
  const popupText = document.getElementById("mission-summary-text");
  setInterval(() => {
    const delta = 1 / 20;
    game.tick(delta);
    const s = game.getState();

    // --- Audio Events ---
      if (s.ignition !== lastIgnition) {
          if (s.ignition) {
          playIgnitionSound();
          startEngineLoop();
          } else {
          playIgnitionOffSound();
          stopEngineLoop();
          }
          lastIgnition = s.ignition;
      }
  
      if (s.baseRPM !== lastBaseRPM) {
          updateEngineLoopPlaybackRate(s.baseRPM);
          lastBaseRPM = s.baseRPM;
      }
  
      if (s.gear !== lastGear) {
          playGearShiftSound();
          lastGear = s.gear;
      }

    gearStick.track.classList.toggle('disabled', !s.automaticClutch && s.clutchEngaged);
    updateEngineLoopPlaybackRate(s.baseRPM);

    clutchIndicator.textContent = s.clutchEngaged ? 'Clutch: Engaged' : 'Clutch: Disengaged';
    clutchIndicator.style.color = s.clutchEngaged ? '#0f0' : '#ff0';
    autoClutchToggle.setValue(s.automaticClutch);

    monitorCtx.clearRect(0, 0, monitorCanvas.width, monitorCanvas.height);
    drawMiniMeter(monitorCtx, 10, 10, "Fuel", s.fuel, 100, "#0f0");
    drawMiniMeter(monitorCtx, 10, 30, "Heat", s.heat, 100, "#f00");
    if (s.ignition) { drawMiniMeter(monitorCtx, 10, 50, "Energy", s.energyOutput, 20, "#0ff") };

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
    drawSpinningWheel(ctx, 320, 80, 30, s.endpointRPM);
    drawTerrainMap(s.terrainMap, s.mechX);
    drawMechPictogram();

    const gearIndexMap = { "Reverse": 0, "Neutral": 1, "1st": 2, "2nd": 3, "3rd": 4 };
    const currentGearIndex = gearIndexMap[s.gear];
    if (lastGearIndex !== currentGearIndex) {
      gearStick.setValue(currentGearIndex);
      lastGearIndex = currentGearIndex;
      playGearShiftSound();
    }

    outputLever.setValue(s.energyOutput);

    if (s.missionComplete && popup.classList.contains('hidden')) {
      popupText.textContent = s.missionCompleteMessage;
      popup.classList.remove('hidden');
      document.body.classList.add('disabled-input');
    }
  }, 50);
}

function setupTorqueGraph() {
  const canvas = document.createElement('canvas');
  canvas.id = 'torqueGraphCanvas';
  canvas.width = 400;
  canvas.height = 100;
  canvas.style.position = 'absolute';
  canvas.style.bottom = '36px';
  canvas.style.right = '10px';
  canvas.style.border = '1px solid #0f0';
  canvas.style.background = '#000';
  canvas.style.zIndex = 5;
  panels.hud.appendChild(canvas);

  return canvas.getContext('2d');
}

  function drawTorqueGraph(ctx, values) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.strokeStyle = '#0f0';
  ctx.beginPath();
  const step = ctx.canvas.width / values.length;
  values.forEach((val, i) => {
    const x = i * step;
    const y = ctx.canvas.height - (val / 330) * ctx.canvas.height;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
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
  const width = terrainCanvas.width;
  const height = terrainCanvas.height;
  const scale = 660;
  const centerX = 200;

  terrainCtx.clearRect(0, 0, width, height);
  terrainCtx.lineWidth = 2;

  for (let i = 0; i < terrainMap.length - 1; i++) {
    const seg = terrainMap[i];
    const next = terrainMap[i + 1];
    const relX = seg.x - mechX;
    const relNextX = next.x - mechX;
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
    const relX = seg.x - mechX;
    const relNextX = next.x - mechX;

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

function initializeUI() {
  setupKeyboardInput();
  renderStaticPanels();
  setupModules();
  setupSystemMonitor();
  setupTerrainScanner();
  setupHUD();
  setupHolodeck();
  setupReactorControls();
  setupCockpitControls();
  const torqueCtx = setupTorqueGraph();

  setInterval(() => {
      const state = game.getState();
      drawTorqueGraph(torqueCtx, state.speedHistory);
  }, 100);

  startGameLoop();
}

initializeUI();

