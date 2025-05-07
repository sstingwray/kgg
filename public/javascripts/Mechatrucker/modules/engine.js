// js/modules/engine.js

import emitter from './eventEmitter.js';
import { updateGameState } from './gameManager.js';

const { Engine, Runner, Events } = window.Matter;

export function initEngine() {
// Create a new Matter.js engine with default options.
const engine = Engine.create({
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

console.log(`[engine] Engine initialized.`);

return engine;
}

export function runEngine(engine) {
  const runner = Runner.create();
  Runner.run(runner, engine);

  Events.on (engine, 'beforeUpdate', (event) => {
    updateGameState(event.delta);
  })

  return runner;
}
