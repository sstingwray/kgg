// js/modules/engine.js

import emitter from './eventEmitter.js';

const { Engine, Runner } = window.Matter;

export function initEngine() {
// Create a new Matter.js engine with default options.
const engine = Engine.create();

// Configure the engine's timing.
// The timeScale of 1 represents normal speed.
engine.timing.timeScale = 1;

// Optionally, set custom gravity or other world properties.
// For example, setting gravity in the y-direction:
engine.gravity.y = 1; // Default value; adjust as needed.

console.log(`Engine initialized.`);

return engine;
}

export function runEngine(engine) {
  const runner = Runner.create();
  Runner.run(runner, engine);
  return runner;
}
