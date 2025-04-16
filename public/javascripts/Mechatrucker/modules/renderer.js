// js/modules/renderer.js

import emitter from './eventEmitter.js';
import { renderScene } from './sceneManager.js';

const Matter = window.Matter;

// This module handles canvas creation and drawing.
export function initCanvas() {
  const canvas = document.getElementById('game-canvas');
  // You can set the canvas dimensions based on your layout or container
  canvas.width = 1024;
  canvas.height = 1024;

  const context = canvas.getContext('2d');

  console.log(`Canvas initialized.`);

  return {
    canvas,
    context,
    draw() {
      // Clear the canvas for the new frame
      context.clearRect(0, 0, canvas.width, canvas.height);
      
      // Render the scene elements that were set up in the scene manager.
      renderScene({ canvas, context });
    },
  };
}

export function initRenderer(engine, container, dimensions) {
  const { width, height } = dimensions;

  const render = Matter.Render.create({
    element: container,
    engine: engine,
    options: {
      width: width,
      height: height,
      background: 'transparent',
      wireframes: false,
      hasBounds: true
    }
  });  

  Matter.Render.run(render);
  console.log(`Renderer initialized.`);

  return render;
}
