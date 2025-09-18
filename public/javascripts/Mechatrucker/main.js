import { setupUI, renderUI } from './modules/sceneManager.js';
import { setupAudio } from './modules/audioManager.js';
import { setupInput } from './modules/inputManager.js';
import { setupGameState } from './modules/gameManager.js';
import { renderScene } from './modules/renderer.js';
import { preloadAssets } from './utils/helpers.js';
import emitter from './modules/eventEmitter.js';
import Matter from './modules/matter.esm.js';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('game-container');
  const dimensions = { width: 1024, height: 1024 };

  preloadAssets((assets) => {
    emitter.emit('[LOG][main] Assets preloaded', assets);
    setupGameState();
    const { engine, render, physicsElements } = renderScene(container, assets, dimensions);
    setupUI(render, assets, physicsElements);
      
    Matter.Events.on(render, 'afterRender', function() {
      renderUI(render, physicsElements);
    });
    setupAudio(assets);
    setupInput(engine, render, physicsElements);
  });
});
