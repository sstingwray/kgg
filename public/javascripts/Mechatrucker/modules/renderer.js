// js/modules/renderer.js

import emitter from './eventEmitter.js';
import { initEngine, runEngine } from './engine.js';
import { initPhysics } from './physics.js';

const Matter = window.Matter;

export function initRenderer(engine, container, dimensions) {
  const { width, height } = dimensions;

  const render = Matter.Render.create({
    element: container,
    engine: engine,
    options: {
      width: width,
      height: height,
      background: `url('images/Mechatrucker/bg.png') no-repeat center center;`,
      wireframes: false,
      hasBounds: true
    }
  });  

  Matter.Render.run(render);
  console.log(`Renderer initialized.`);

  return render;
}

export function renderScene(container, assets, dimensions) {
  const engine = initEngine();
  runEngine(engine);
  console.log('Engine:', engine);
  
  const render = initRenderer(engine, container, dimensions);
  console.log('Renderer:', render);

  const physicsElements = initPhysics(engine, assets, dimensions);
  console.log('Physics:', physicsElements);

  return { engine, render, physicsElements };
}