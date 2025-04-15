// js/modules/sceneManager.js

import GearShiftLever from '../objects/gearShiftLever.js';
import { initEngine, runEngine } from './engine.js';
import { initRenderer } from './renderer.js';
import { initPhysics } from './physics.js';

const Matter = window.Matter;

const sceneElements = {};

export function getSceneElements() {
    return sceneElements;
}

export function initScene(renderer) {
  const canvas = renderer.canvas;
  const width = canvas.width;
  const height = canvas.height;

  // Define the central control panel at the bottom (for interactables).
  sceneElements.controlPanel = {
    x: 0,
    y: height - 12*25, // 150 px high control panel
    width: width,
    height: 12*25,
  };

  // Define the left monitor hanging from the top.
  sceneElements.leftMonitor = {
    x: 24,
    y: 24,
    width: 12*32,  // width of 200 pixels
    height: 12*18, // height of 150 pixels
  };

  // Define the right monitor hanging from the top.
  sceneElements.rightMonitor = {
    x: width - 12*32 - 24,
    y: 24,
    width: 12*32,
    height: 12*18,
  };

  // Define the cockpit window in the center.
  sceneElements.cockpitWindow = {
    x: width * 0.1, // starting right after left monitor
    y: sceneElements.leftMonitor.height - 50, // below monitors
    width: width * 0.8,
    height: height - sceneElements.controlPanel.height - sceneElements.leftMonitor.height,
  };

  // --- Create the Gear Shift Lever ---
  // Position it inside the control panel. For example, offset it 50px from the left,
  // and 20px from the top of the control panel.
  const leverOptions = {
    x: sceneElements.controlPanel.width - 164,
    y: sceneElements.controlPanel.y,
    width: 100,
    // The vertical channel can be defined relative to the control panel:
    channelTop: sceneElements.controlPanel.y + 84,
    channelBottom: sceneElements.controlPanel.y + 264,
    handleRadius: 20,
  };
  sceneElements.gearShiftLever = new GearShiftLever(leverOptions);

  console.log(`Scene initialized:`, sceneElements);
}

export function drawBackground(renderer) {
  const ctx = renderer.context;
  
  // Destructure layout elements.
  const { cockpitWindow, leftMonitor, rightMonitor, controlPanel } = sceneElements;
  
  // --- Render the Cockpit Window (World View) ---
  // For this demo, we'll fill it with a sky-blue color.
  ctx.fillStyle = `rgba(50, 147, 147, 0.5)`;
  ctx.fillRect(cockpitWindow.x, cockpitWindow.y, cockpitWindow.width, cockpitWindow.height);
  
  // --- Render the Left Monitor ---
  const svgMonitorLeftUrl = 'images/Mechatrucker/monitor-l.svg';
  const imgMonitorLeft = new Image();
  imgMonitorLeft.src = svgMonitorLeftUrl;
  ctx.drawImage(imgMonitorLeft, leftMonitor.x, leftMonitor.y, leftMonitor.width, leftMonitor.height);
  
  // --- Render the Right Monitor ---
  const svgMonitorRightUrl = 'images/Mechatrucker/monitor-r.svg';
  const imgMonitorRight = new Image();
  imgMonitorRight.src = svgMonitorRightUrl;
  ctx.drawImage(imgMonitorRight, rightMonitor.x, rightMonitor.y, rightMonitor.width, rightMonitor.height);
  
  // --- Render the Central Control Panel ---
  const svgCentralPanelUrl = 'images/Mechatrucker/central-terminal.svg';
  const imgCentralPanel = new Image();
  imgCentralPanel.src = svgCentralPanelUrl;
  ctx.drawImage(imgCentralPanel, controlPanel.x, controlPanel.y, controlPanel.width, controlPanel.height);
  // --- Render the Gear Shift Lever (if defined) ---
  if (sceneElements.gearShiftLever) {
    sceneElements.gearShiftLever.render(ctx);
  }
}

export function renderScene(container, assets, dimensions) {
  // 1. Initialize engine.
  const engine = initEngine();
  runEngine(engine);
  console.log('Engine:', engine);
  
  // 2. Initialize renderer using the container element.
  const render = initRenderer(engine, container, dimensions);
  console.log('Renderer:', render);

  // 3. Initialize physics simulation elements.
  
  const physicsElements = initPhysics(engine, assets, dimensions);
  console.log('Physics:', physicsElements);

  console.log('Sorted bodies:', Matter.Composite.allBodies(engine.world) );

  return { engine, render, physicsElements };
}
