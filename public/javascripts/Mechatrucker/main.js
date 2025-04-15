// js/main.js

import emitter from './modules/eventEmitter.js';
import { setupInput } from './modules/inputManager.js';
import { initScene, drawBackground, renderScene } from './modules/sceneManager.js';
import { preloadAssets } from './utils/helpers.js';


document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('game-container');
    const dimensions = { width: 1024, height: 1024 };

    preloadAssets((assets) => {
        console.log('Assets preloaded:', assets);
        const { engine, render, physicsElements } = renderScene(container, assets, dimensions);
        setupInput(engine, render, physicsElements);
      });

    //initScene(canvas);

});
