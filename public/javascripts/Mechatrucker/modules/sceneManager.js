import ControlPanel from '../objects/controlPanel.js';
import GearShiftLever from '../objects/gearShiftLever.js';
import Button from '../objects/button.js';
import { toggleIgnition } from '../objects/controls.js';
import { getRGBA } from '../utils/helpers.js';

const sceneElements = {};

export function getSceneElements() {
    return sceneElements;
}

export function setupUI(render, assets) {
  const canvas = render.canvas;
  const ctx = render.context;
  const width = canvas.width;
  const height = canvas.height;
  console.log(canvas);
  
  ctx.drawImage(assets.bg, 0, 0, width, height);

  Matter.Events.on(render, 'beforeRender', () => {
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(assets.bg, 0, 0, width, height);
    ctx.fillStyle = getRGBA('auburn', 0);
    ctx.fill();
  });

  const controlPanelOptions = {
    x: 0,
    y: height - 12*20,
    width: width,
    height: 12*22,
  };
  const leverOptions = {
    x: controlPanelOptions.width - 12*14,
    y: controlPanelOptions.y + 48,
    width: 108,
    channelTop: controlPanelOptions.y + 48,
    channelBottom: controlPanelOptions.y + 12*15,
    handleRadius: 20,
  };
  const ignitionOptions = {
    x: controlPanelOptions.width - 12*19,
    y: controlPanelOptions.y + 12*12,
    radius: 18, svg: assets.ignitionIco,
    eventType: 'ignitionToggle',
    onClick: toggleIgnition
  };

  sceneElements.controlPanel = new ControlPanel(controlPanelOptions);
  sceneElements.gearShiftLever = new GearShiftLever(leverOptions);
  sceneElements.ignitionBtn = new Button(ignitionOptions);

  console.log(`Interactive UI is set:`, sceneElements);
}

export function renderUI(renderer, physicsElements) {
  const ctx = renderer.context;

  //interactables
  sceneElements.gearShiftLever.render(ctx);
  sceneElements.ignitionBtn.render(ctx);
  sceneElements.controlPanel.render(ctx, physicsElements);
}
