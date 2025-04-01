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
    GearKnobComponent,
    SliderComponent,
    LeverComponent
  } from './experimental-components.js';
  
  const game = createGameState();
  
  // === Setup UI Panels ===
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

    let lastBaseRPM = null;
    let lastGear = null;
    let lastIgnition = false;
  
  function setupKeyboardInput() {
    window.addEventListener('keydown', e => {
      if (e.code === 'Space') game.setClutchOverride(true);
    });
    window.addEventListener('keyup', e => {
      if (e.code === 'Space') game.setClutchOverride(false);
    });
  }
  
  function renderStaticPanels() {
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
  
  let autoClutchToggle, gearKnob, outputLever;
  function setupCockpitControls() {
    autoClutchToggle = new ToggleButtonComponent("A", false, () => game.toggleAutomaticClutch());
    panels.cockpitControls.appendChild(autoClutchToggle.element);
  
    gearKnob = new GearKnobComponent({
      initial: 1,
      onChange: (label) => {
        const state = game.getState();
        const allowShift = state.automaticClutch || !state.clutchEngaged;
        if (allowShift) game.setGear(label);
      }
    });
    panels.cockpitControls.appendChild(gearKnob.element);
  }
  
  function setupReactorControls() {
    const reactorWrapper = document.createElement('div');
    reactorWrapper.className = 'reactor-cluster';
  
    const reactorLeft = document.createElement('div');
    reactorLeft.className = 'reactor-side-buttons';
  
    const ignitionToggle = new ToggleButtonComponent("⚡", false, (val) => {
      val ? playIgnitionSound() : playIgnitionOffSound();
      game.toggleIgnition();
    });
  
    const overdriveToggle = new ToggleButtonComponent("🔥", false, () => {});
    [ignitionToggle, overdriveToggle].forEach(btn => {
      btn.element.style.marginBottom = '12px';
      reactorLeft.appendChild(btn.element);
    });
  
    outputLever = new LeverComponent({
      label: "Output",
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
  
      gearKnob.setDisabled(!s.automaticClutch && s.clutchEngaged);
      updateEngineLoopPlaybackRate(s.baseRPM);
  
      clutchIndicator.textContent = s.clutchEngaged ? 'Clutch: Engaged' : 'Clutch: Disengaged';
      clutchIndicator.style.color = s.clutchEngaged ? '#0f0' : '#ff0';
      autoClutchToggle.setValue(s.automaticClutch);
  
      monitorCtx.clearRect(0, 0, monitorCanvas.width, monitorCanvas.height);
      drawMiniMeter(monitorCtx, 10, 10, "Fuel", s.fuel, 100, "#0f0");
      drawMiniMeter(monitorCtx, 10, 30, "Energy", s.energyOutput, 20, "#0ff");
      drawMiniMeter(monitorCtx, 10, 50, "Heat", s.heat, 100, "#f00");
  
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
  
      const gearIndexMap = { "Reverse": 0, "Neutral": 1, "1st": 2, "2nd": 3, "3rd": 4 };
      const currentGearIndex = gearIndexMap[s.gear];
      if (lastGearIndex !== currentGearIndex) {
        gearKnob.setValue(currentGearIndex);
        lastGearIndex = currentGearIndex;
        playGearShiftSound();
      }
  
      outputLever.setValue(s.energyOutput);
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
  
  function initializeUI() {
    setupKeyboardInput();
    renderStaticPanels();
    setupSystemMonitor();
    setupHUD();
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