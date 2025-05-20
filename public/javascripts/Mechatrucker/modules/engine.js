import emitter from './eventEmitter.js';
import Matter from './matter.esm.js';
import { updateGameState } from './gameManager.js';

export function initEngine() {
// Create a new Matter.js engine with default options.
  const engine = Matter.Engine.create({
    constraintIterations: 36,
    positionIterations:   12,
    velocityIterations:   12
  });

  // Configure the engine's timing.
  // The timeScale of 1 represents normal speed.
  engine.timing.timeScale = 1;

  // Optionally, set custom gravity or other world properties.
  // For example, setting gravity in the y-direction:
  engine.gravity.y = 1; // Default value; adjust as needed.

  emitter.emit('[LOG][engine] Engine initialized', engine);
  return engine;
}

export function runEngine(engine) {
  const runner = Matter.Runner.create();
  Matter.Runner.run(runner, engine);

  Matter.Events.on (engine, 'beforeUpdate', (event) => {
    updateGameState(event.delta);
  })

  return runner;
}
