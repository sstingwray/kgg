// js/modules/sceneManager.js

import { toggle } from '../objects/controls.js';
import GearShiftLever from '../objects/gearShiftLever.js';
import Button from '../objects/button.js';
import { initEngine, runEngine } from './engine.js';
import { initRenderer } from './renderer.js';
import { initPhysics } from './physics.js';

const Matter = window.Matter;

const sceneElements = {};

export function getSceneElements() {
    return sceneElements;
}

export function initScene(renderer, assets) {
  const canvas = renderer.canvas;
  const width = canvas.width;
  const height = canvas.height;

  // Define the central control panel at the bottom (for interactables).
  sceneElements.controlPanel = {
    x: 0,
    y: height - 12*20, // 150 px high control panel
    width: width,
    height: 12*22,
  };

  // --- Create the Gear Shift Lever ---
  // Position it inside the control panel. For example, offset it 50px from the left,
  // and 20px from the top of the control panel.
  const leverOptions = {
    x: sceneElements.controlPanel.width - 12*14,
    y: sceneElements.controlPanel.y,
    width: 108,
    // The vertical channel can be defined relative to the control panel:
    channelTop: sceneElements.controlPanel.y,
    channelBottom: sceneElements.controlPanel.y + 12*15,
    handleRadius: 20,
  };

  const ignitionOptions = {
    x: sceneElements.controlPanel.width - 12*19,
    y: sceneElements.controlPanel.y + 12*12,
    radius: 18, svg: assets.ignitionIco,
    onClick: toggle('ignition')
  };

  sceneElements.gearShiftLever = new GearShiftLever(leverOptions);
  
  sceneElements.ignitionBtn = new Button(ignitionOptions);

  console.log(`Scene initialized:`, sceneElements);
}

export function drawControls(renderer) {
  const ctx = renderer.context;

  sceneElements.gearShiftLever.render(ctx);
  sceneElements.ignitionBtn.render(ctx);
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

  return { engine, render, physicsElements };
}
