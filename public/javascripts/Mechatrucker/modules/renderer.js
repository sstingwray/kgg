import emitter from './eventEmitter.js';
import Matter from './matter.esm.js';
import { initEngine, runEngine } from './engine.js';
import { initPhysics } from './physics.js';

const LOGGING = false;

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
  emitter.emit('[LOG][renderer] Renderer initialized', render);
  return render;
}

export function renderScene(container, assets, dimensions) {
  const engine = initEngine();
  runEngine(engine);
  LOGGING ? console.log('Engine:', engine) : null;
  
  const render = initRenderer(engine, container, dimensions);
  LOGGING ? console.log('Renderer:', render) : null;

  const physicsElements = initPhysics(engine, assets, dimensions);
  LOGGING ? console.log('Physics:', physicsElements) : null;

  return { engine, render, physicsElements };
}