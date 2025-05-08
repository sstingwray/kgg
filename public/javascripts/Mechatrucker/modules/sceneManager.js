import ControlPanel from '../objects/controlPanel.js';
import Monitor from '../objects/monitor.js';
import Thermometer from '../objects/thermometer.js';
import { getRGBA } from '../utils/helpers.js';
import { getGameState } from './gameManager.js';

const sceneElements = {};
const LOGGING = true;
const MONITOR_LEFT_SIZE   = { width: 12*29,     height: 12*15 - 4 };
const MONITOR_RIGHT_SIZE  = { width: 12*29,     height: 12*15 - 4 };
const THERMOMETER_SIZE    = { width: 12*4 - 10, height: 12*11 - 6 };

export function getSceneElements() {
    return sceneElements;
}

export function setupUI(render, assets, physicsElements) {
  const canvas = render.canvas;
  const ctx = render.context;
  const width = canvas.width;
  const height = canvas.height;
  const state = getGameState();
  
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
    x: -MONITOR_LEFT_SIZE.width / 2, y: -MONITOR_LEFT_SIZE.height / 2,
    width: MONITOR_LEFT_SIZE.width, height: MONITOR_LEFT_SIZE.height,
    body: physicsElements.leftMonitor,
    debug: true, orientation: 'left'
  };

  const rightMonitorOptions = {
    x: -MONITOR_RIGHT_SIZE.width / 2, y: -MONITOR_RIGHT_SIZE.height / 2,
    width: MONITOR_RIGHT_SIZE.width, height: MONITOR_RIGHT_SIZE.height,
    body: physicsElements.rightMonitor,
    debug: true, orientation: 'right'
  };

  const thermometerOptions = {
    x: -THERMOMETER_SIZE.width / 2, y: -THERMOMETER_SIZE.height / 2,
    width: THERMOMETER_SIZE.width, height: THERMOMETER_SIZE.height,
    min: 0, max: state.mech.reactor.maxHeat, heat: state.mech.status.bars.heat,
    body: physicsElements.thermometer
  };

  console.log('physicsElements', physicsElements);
  
  
  sceneElements.leftMonitor  = new Monitor(leftMonitorOptions);
  sceneElements.rightMonitor = new Monitor(rightMonitorOptions);
  sceneElements.thermometer  = new Thermometer(thermometerOptions);
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
  sceneElements.thermometer.render(ctx);
  
}
