import ControlPanel from '../objects/controlPanel.js';
import { getRGBA } from '../utils/helpers.js';
import { getGameState } from './gameManager.js';

const sceneElements = {};
const LOGGING = true;

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

  sceneElements.controlPanel = new ControlPanel(controlPanelOptions);
  Object.assign(sceneElements, sceneElements.controlPanel.returnElements());

  LOGGING ? console.log(`[sceneManager] Interactive UI is set:`, sceneElements) : null;
}

export function renderUI(renderer, physicsElements) {
  const state = getGameState();
  const ctx = renderer.context;

  //interactables
  sceneElements.controlPanel.render(ctx, physicsElements);
  
}
