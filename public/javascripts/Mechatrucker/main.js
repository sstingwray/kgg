// js/main.js

import { setupUI, renderUI } from './modules/sceneManager.js';
import { setupAudio } from './modules/audioManager.js';
import { setupInput } from './modules/inputManager.js';
import { setupGameState } from './modules/gameManager.js';
import { renderScene } from './modules/renderer.js';
import { preloadAssets } from './utils/helpers.js';

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('game-container').children[0];
  const container = document.getElementById('game-container');
  const dimensions = { width: 1024, height: 1024 };

  preloadAssets((assets) => {
      console.log('[main] Assets preloaded:', assets);
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
