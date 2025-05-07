import ControlPanel from '../objects/controlPanel.js';
import Monitor from '../objects/monitor.js';
import { getRGBA } from '../utils/helpers.js';
import { getGameState } from './gameManager.js';

const sceneElements = {};
const LOGGING = true;
const MONITOR_LEFT_SIZE   = { width: 12*29, height: 12*15 - 4 };
const MONITOR_RIGHT_SIZE  = { width: 12*29, height: 12*15 - 4 };

export function getSceneElements() {
    return sceneElements;
}

export function setupUI(render, assets, physicsElements) {
  const canvas = render.canvas;
  const ctx = render.context;
  const width = canvas.width;
  const height = canvas.height;
  
  ctx.drawImage(assets.bg, 0, 0, width, height);

  Matter.Events.on(render, 'beforeRender', () => {
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(assets.bg, 0, 0, width, height);
    ctx.fillStyle = getRGBA('auburn', 0);
    ctx.fill();
  });  

  const controlPanelOptions = {
    x: 0, y: height - 12*20,
    width: width, height: 12*28 + 2,
    body: physicsElements.centralPanel,
    icons: {
      ignition: assets.ignitionIco,
    }
  };

  const leftMonitorOptions = {
    x: 9 - MONITOR_LEFT_SIZE.width / 2, y: - 2 - MONITOR_LEFT_SIZE.height / 2,
    width: 12*29, height: 12*15 - 4,
    body: physicsElements.leftMonitor,
    debug: true, orientation: 'left'
  };

  const rightMonitorOptions = {
    x: 9 - MONITOR_RIGHT_SIZE.width / 2, y: - 2 - MONITOR_RIGHT_SIZE.height / 2,
    width: 12*29, height: 12*15 - 4,
    body: physicsElements.rightMonitor,
    debug: true, orientation: 'right'
  };
  
  sceneElements.leftMonitor = new Monitor(leftMonitorOptions);
  sceneElements.rightMonitor = new Monitor(rightMonitorOptions);
  sceneElements.controlPanel = new ControlPanel(controlPanelOptions);
  Object.assign(sceneElements, sceneElements.controlPanel.returnElements());

  LOGGING ? console.log(`[sceneManager] Interactive UI is set:`, sceneElements) : null;
}

export function renderUI(renderer, physicsElements) {
  const ctx = renderer.context;
  const state = getGameState();
  const leftMonitorValues = [
    { debug: false, label:'Steps',         pct: state.mech.status.movement.stepCount },
    { debug: true,  label:'[DEBUG]Torque', pct: Math.round(state.mech.status.torque) },
    { debug: true,  label:'[DEBUG]Energy', pct: state.mech.status.energyOutput },
    { debug: true,  label:'[DEBUG]Heat',   pct: state.mech.status.bars.heat },
    { debug: true,  label:'[DEBUG]Fuel',   pct: state.mech.status.bars.fuel }
  ];
  const rightMonitorValues = [
    { debug: false, label:`Press "Space" to toggle the Clutch.`,       pct: null },
    { debug: false, label:`Use "W" and "S" to control Energy Output.`, pct: null },
    { debug: false, label:`To begin, press the red ignition button.`,  pct: null }
  ];

  //interactables
  sceneElements.controlPanel.render(ctx, physicsElements);
  sceneElements.leftMonitor.render(ctx, leftMonitorValues);
  sceneElements.rightMonitor.render(ctx, rightMonitorValues);
  
}
