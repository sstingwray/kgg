// js/modules/inputManager.js

import emitter from './eventEmitter.js';
import { getSceneElements } from './sceneManager.js';
import { getGameState } from './gameManager.js';

export function setupInput(engine, render, physicsElements) {
    const canvas = document.getElementById('game-container').children[0];
    const sceneElements = getSceneElements();
    const defaultShakeForce = 0.5;
    const xRandMod = 0.25;
    const yRandMod = 0.1;
    const state = getGameState();
    
    // Example: Handle keyboard input for cockpit controls
    document.addEventListener('keydown', event => {
        //console.log(`"${event.key}" pressed down, code = ${event.code}`);
        switch (event.code) {
            case 'KeyQ':
                console.log('Game State:', getGameState());
                break;
            case 'KeyW':
                emitter.emit('outputChange', state.mech.status.energyOutput + 1);
                break;
            case 'KeyS':
                emitter.emit('outputChange', state.mech.status.energyOutput - 1);
                break;
            case 'KeyA':
                if (event.repeat) return;
                Matter.Composite.allBodies(engine.world).forEach(body => {
                    if (body.string) {
                        let bodyMassMod = body.mass * 0.005;
                        
                        Matter.Body.applyForce(
                            body, 
                            {
                                x: body.position.x + 5 - Math.random()*10,
                                y: body.position.y + 5 - Math.random()*10
                            },
                            {
                                x: bodyMassMod * (-defaultShakeForce + Math.random()*xRandMod),
                                y: bodyMassMod * Math.random()*yRandMod
                            }
                    )};
                });

                emitter.emit('turningLeft', true);
                break;
            case 'KeyD':
                if (event.repeat) return;
                Matter.Composite.allBodies(engine.world).forEach(body => {
                    if (body.string) {
                        let bodyMassMod = body.mass * 0.005;
                        
                        Matter.Body.applyForce(
                            body, 
                            {
                                x: body.position.x + 5 - Math.random()*10,
                                y: body.position.y + 5 - Math.random()*10
                            },
                            {
                                x: bodyMassMod * (defaultShakeForce + Math.random()*xRandMod),
                                y: bodyMassMod * Math.random()*yRandMod
                            }
                    )};
                });

                emitter.emit('turningRight', true);
                break;
            case 'Space':
                if (event.repeat) return;
                // Disengage clutch
                emitter.emit('clutchToggle', true);
                break;
            // Add other key mappings...
        }
    });

    document.addEventListener('keyup', event => {
        //console.log(`"${event.key}" let go, code = ${event.code}`);
        switch (event.code) {
            /*case 'KeyA':
                if (event.repeat) return;
                // Turn left, etc.

                Matter.Body.applyForce(
                    physicsElements.leftMonitor, 
                    physicsElements.leftMonitor.position,
                    { x: defaultShakeForce + Math.random()*0.1, y: Math.random()*1 }
                );
                Matter.Body.applyForce(
                    physicsElements.rightMonitor, 
                    physicsElements.rightMonitor.position,
                    { x: defaultShakeForce + Math.random()*0.1, y: Math.random()*1 }
                );

                emitter.emit('turningLeft', false);
                break;
            case 'KeyD':
                if (event.repeat) return;

                Matter.Body.applyForce(
                    physicsElements.leftMonitor, 
                    physicsElements.leftMonitor.position,
                    { x: -defaultShakeForce + Math.random()*0.1, y: Math.random()*1 }
                );
                Matter.Body.applyForce(
                    physicsElements.rightMonitor, 
                    physicsElements.rightMonitor.position,
                    { x: -defaultShakeForce + Math.random()*0.1, y: Math.random()*1 }
                );

                emitter.emit('turningRight', false);
                break;*/
            case 'Space':
                // Engage clutch
                emitter.emit('clutchToggle', false);
                break;
        }
    });

    canvas.addEventListener('mousedown', (event) => sceneElements.levers.gearShiftLever.onMouseDown(event));
    canvas.addEventListener('mousemove', (event) => sceneElements.levers.gearShiftLever.onMouseMove(event));
    canvas.addEventListener('mouseup',   (event) => sceneElements.levers.gearShiftLever.onMouseUp(event));

    canvas.addEventListener('mousedown', (event) => sceneElements.buttons.ignitionBtn.onMouseDown(event));
    
    console.log(`[inputManager] Input Handler initialized.`);
  }
  