// experimental-main.js

// Load the game state controller
const game = createGameState();

// Reference all UI panels
const panels = {
  timeBiome: document.getElementById('panel-top-left'),
  holoDeck: document.getElementById('panel-top-center'),
  systemMonitor: document.getElementById('panel-top-right'),
  terrainScanner: document.getElementById('panel-mid-left'),
  cockpitControls: document.getElementById('panel-bottom-right'),
  reactorControls: document.getElementById('panel-mid-right'),
  modules: document.getElementById('panel-bottom-left'),
  cargoAndTools: document.getElementById('panel-bottom-center'),
  hud: document.getElementById('panel-center-main')
};

// === STATIC UI ===
panels.timeBiome.innerHTML = `
  <div>Time: 14:42</div>
  <div>Biome: Jungle</div>
  <div>Coords: X:231, Y:588, Z:3</div>
`;

panels.terrainScanner.innerHTML = `<div>Scanner Mode: <em>Terrain</em></div>`;

panels.modules.innerHTML = `<div>Module Activation - Placeholder</div>`;

panels.cargoAndTools.innerHTML = `
  <div>Cargo Interface - Placeholder</div>
  <div>Arm Tools - Placeholder</div>
  <div>External Hatch - Placeholder</div>
  <button onclick="console.log('Ejection triggered')">Eject</button>
`;

// === SYSTEM MONITOR ===
const monitorCanvas = document.getElementById("systemMonitorCanvas");
const monitorCtx = monitorCanvas.getContext("2d");
const scale = window.devicePixelRatio || 1;
monitorCanvas.width = 260 * scale;
monitorCanvas.height = 100 * scale;
monitorCanvas.style.width = "260px";
monitorCanvas.style.height = "100px";
monitorCtx.scale(scale, scale);

function drawMiniMeter(ctx, x, y, label, value, max, color) {
  const width = 160;
  const height = 12;
  const pct = value / max;

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

// === HUD CANVAS (TORQUE, RPM, WHEEL, SPEED) ===
const hudCanvas = document.getElementById("hudCanvas");
const ctx = hudCanvas.getContext("2d");
const rpmWheel = document.getElementById("rpmWheelImg");
let wheelAngle = 0;

function drawMeter(ctx, x, y, label, value, max, color = "#0f0") {
  const height = 20;
  const width = 200;
  const ratio = value / max;

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

// === GEAR SELECTOR RESTORE ===
const gearKnob = createGearKnob({
  initial: 1,
  onChange: (label) => {
    game.setGear(label);
    console.log(`Gear changed to: ${label}`);
  }
});
panels.cockpitControls.appendChild(gearKnob.element);

// === REACTOR CONTROLS ===
const reactorWrapper = document.createElement('div');
reactorWrapper.className = 'reactor-cluster';

const reactorLeft = document.createElement('div');
reactorLeft.className = 'reactor-side-buttons';

const ignitionToggle = createToggleButton("⚡", false, () => {
  game.toggleIgnition();
  console.log("Ignition toggled");
});
const overdriveToggle = createToggleButton("🔥", false, (val) => {
  console.log(`Overdrive: ${val}`);
});
[ignitionToggle, overdriveToggle].forEach(btn => {
  btn.element.style.marginBottom = '12px';
  reactorLeft.appendChild(btn.element);
});

const outputLever = createLever("Output", {
  min: 0,
  max: 20,
  step: 1,
  initial: 5,
  discrete: true,
  onChange: (val) => {
    game.setEnergyOutput(val);
    console.log(`Output changed: ${val}`);
  }
});

const reactorRight = document.createElement('div');
reactorRight.className = 'reactor-output-lever';
reactorRight.appendChild(outputLever.element);

reactorWrapper.appendChild(reactorLeft);
reactorWrapper.appendChild(reactorRight);

panels.reactorControls.appendChild(reactorWrapper);

// === MAIN LOOP ===
let lastGearIndex = null;
setInterval(() => {
  const delta = 1 / 20; // 20 updates per second
  game.tick(delta);
  const s = game.getState();

  // Draw system monitor (Fuel, Energy, Heat)
  monitorCtx.clearRect(0, 0, monitorCanvas.width, monitorCanvas.height);
  drawMiniMeter(monitorCtx, 10, 10, "Fuel", s.fuel, 100, "#0f0");
  drawMiniMeter(monitorCtx, 10, 30, "Energy", s.energyOutput, 20, "#0ff");
  drawMiniMeter(monitorCtx, 10, 50, "Heat", s.heat, 100, "#f00");

  // Draw HUD canvas (Torque, RPMs, Spinning Wheel, Speed)
  ctx.clearRect(0, 0, hudCanvas.width, hudCanvas.height);
  drawMeter(ctx, 20, 30, "Torque", s.torque, 10, "#ff0");
  drawMeter(ctx, 20, 70, "Base RPM", s.baseRPM, 10, "#ccc");
  drawMeter(ctx, 20, 110, "Endpoint RPM", s.endpointRPM, 100, "#fff");
  drawMeter(ctx, 20, 150, "Speed", s.speed, 1000, "#0ff");
  drawSpinningWheel(ctx, 320, 80, 30, s.endpointRPM);

  // Sync gear knob
  const gearIndexMap = { "Reverse": 0, "Neutral": 1, "1st": 2, "2nd": 3, "3rd": 4 };
  const currentGearIndex = gearIndexMap[s.gear];
  if (lastGearIndex !== currentGearIndex) {
    gearKnob.setValue(currentGearIndex);
    lastGearIndex = currentGearIndex;
  }

  // Sync lever with state
  outputLever.setValue(s.energyOutput);
}, 50);
