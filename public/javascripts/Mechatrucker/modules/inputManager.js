// js/modules/inputManager.js

import emitter from './eventEmitter.js';
import { getSceneElements } from './sceneManager.js';

export function setupInput(engine, render, physicsElements) {
    const canvas = document.getElementById('game-container').children[0];
    const sceneElements = getSceneElements();
    const defaultShakeForce = 0.5;
    
    // Example: Handle keyboard input for cockpit controls
    document.addEventListener('keydown', event => {
        console.log(`"${event.key}" pressed down, code = ${event.code}`);
        switch (event.code) {
            case 'KeyW':
                // Increase reactor output or perform specific control action
                break;
            case 'KeyA':
                if (event.repeat) return;
                // Turn left, etc.

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

                emitter.emit('turningLeft', true);
                break;
            case 'KeyD':
                if (event.repeat) return;
                
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

                emitter.emit('turningRight', true);
                break;
            case 'Space':
                if (event.repeat) return;
                // Disengage clutch
                emitter.emit('clutchStateChange', false);
                break;
            // Add other key mappings...
        }
    });

    document.addEventListener('keyup', event => {
        console.log(`"${event.key}" let go, code = ${event.code}`);
        switch (event.code) {
            case 'KeyA':
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
                break;
            case 'Space':
                // Engage clutch
                emitter.emit('clutchStateChange', true);
                break;
        }
    });

    // Convert mouse events to canvas-relative coordinates.
    const getCanvasCoordinates = (event) => {
        const rect = canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        };
    };

    //gearShiftLever events

    //canvas.addEventListener('mousedown', (event) => sceneElements.gearShiftLever.onMouseDown(event));
    //canvas.addEventListener('mousemove', (event) => sceneElements.gearShiftLever.onMouseMove(event));
    //canvas.addEventListener('mouseup', (event) => sceneElements.gearShiftLever.onMouseUp(event));

    
    console.log(`Input Handler initialized.`);
  }
  