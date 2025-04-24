// js/main.js

import { setupInput } from './modules/inputManager.js';
import { setupUI, renderUI } from './modules/sceneManager.js';
import { renderScene } from './modules/renderer.js';
import { preloadAssets } from './utils/helpers.js';
import { setupGameState } from './modules/gameManager.js';


document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('game-container').children[0];
  const container = document.getElementById('game-container');
  const dimensions = { width: 1024, height: 1024 };

  preloadAssets((assets) => {
      console.log('Assets preloaded:', assets);
      const { engine, render, physicsElements } = renderScene(container, assets, dimensions);
      setupUI(render, assets);
      Matter.Events.on(render, 'afterRender', function() {
        renderUI(render, physicsElements);
      });
      
      setupInput(engine, render, physicsElements);

      setupGameState();

      //console.log(Matter.Composite.allBodies(engine.world));
    });

  

});
