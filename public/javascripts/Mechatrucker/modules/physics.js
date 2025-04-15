// js/modules/physics.js

import emitter from './eventEmitter.js';
import { connectMonitorWithConnector } from '../utils/helpers.js';

export function initPhysics(engine, assets, dimensions) {
  const { width, height } = dimensions;
  const FOREGROUND_CATEGORY = 0x0002;
  const BACKGROUND_CATEGORY = 0x0004;
  
  // --- Create swaying monitors ---
  const monitorWidth = 12*32, monitorHeight = 12*18;
  const leftMonitorX = 24 + monitorWidth / 2;
  const rightMonitorX = width - (36 + monitorWidth / 2);
  const topMonitorsY = 48 + monitorHeight / 2;
  const leftMonitorMount = { x: 6 + leftMonitorX, y: -16 };
  const rightMonitorMount = { x: 6 + rightMonitorX, y: -16 };
  const leftMonitorCableStart = { x: 12, y: -4 };
  const cableConnectorX = 200;
  const cableConnectorY = 24;
  
  const leftMonitor = Matter.Bodies.rectangle(
    leftMonitorX,
    topMonitorsY,
    24 + monitorWidth,
    monitorHeight,
    {
      string: 'monitor-l',
      restitution: 0.5,
      collisionFilter: {
        category: FOREGROUND_CATEGORY,
        // let it collide with everything else (adjust mask as needed)
        mask: 0xFFFFFFFF
      },
      render: {
        anchors: false,
        order: 2,
        sprite: {
          texture: assets.monitorL.src,
          xScale: 0.75,  // Adjust this divisor based on the SVG's natural width.
          yScale: 0.75  // Adjust this divisor based on the SVG's natural height.
        }
      },
    }
  );

  const leftMonitorConnector = connectMonitorWithConnector(engine, leftMonitor, leftMonitorMount, 8);
  leftMonitorConnector.collisionFilter = {
    category: BACKGROUND_CATEGORY,
    mask: 0xFFFFFFFF & ~FOREGROUND_CATEGORY  
  };

  const rightMonitor = Matter.Bodies.rectangle(
    rightMonitorX,
    topMonitorsY,
    24 + monitorWidth,
    monitorHeight,
    {
      string: 'monitor-rl',
      restitution: 0.5,
      collisionFilter: {
        category: FOREGROUND_CATEGORY,
        mask: 0xFFFFFFFF  
      },
      render: {
        order: 2,
        sprite: {
          texture: assets.monitorR.src,
          // You might need to adjust xScale and yScale based on your asset's dimensions.
          xScale: 0.75,  // Adjust this divisor based on the SVG's natural width.
          yScale: 0.75  // Adjust this divisor based on the SVG's natural height.
        }
      }
    }
  );

  const rightMonitorConnector = connectMonitorWithConnector(engine, rightMonitor, rightMonitorMount, 8);
  rightMonitorConnector.collisionFilter = {
    category: BACKGROUND_CATEGORY,
    mask: 0xFFFFFFFF & ~FOREGROUND_CATEGORY  
  };
  
  
  // --- Create a dangling cable ---
  const cableSegmentCount = 76;
  const cableSegmentRadius = 0.05;
  const cableStart = leftMonitorCableStart;
  
  const cable = Matter.Composites.stack(
    cableStart.x, cableStart.y, 1, cableSegmentCount, 0, 5,
    (x, y) => Matter.Bodies.circle(x, y, cableSegmentRadius, {
      stiffness: 1,
      collisionFilter: {
        category: BACKGROUND_CATEGORY,
        // Exclude collisions with monitors by removing MONITOR_CATEGORY from the mask.
        mask: 0xFFFFFFFF & ~FOREGROUND_CATEGORY  
      },
      render: {
        fillStyle: '#888',
        order: 1,
      }
    })
  );
  
  Matter.Composites.chain(cable, 0.5, 0, -0.5, 0, {
    stiffness: 1,
    length: 4,
    render: {
      anchors: false,
      type: 'line',
      order: 1,
    },
  });
  
  const cableAttachment = Matter.Constraint.create({
    pointA: cableStart,
    bodyB: cable.bodies[0],
    pointB: { x: 0, y: 0 },
    stiffness: 1,
    collisionFilter: {
      category: BACKGROUND_CATEGORY,
      // Exclude collisions with monitors by removing MONITOR_CATEGORY from the mask.
      mask: 0xFFFFFFFF & ~FOREGROUND_CATEGORY  
    },
    render: {
      anchors: false,
      type: 'line',
      order: 1,
    },
  });
  
  const cableToMonitor = Matter.Constraint.create({
    bodyA: cable.bodies[cable.bodies.length - 1],
    pointA: { x: 0, y: 0 },
    bodyB: leftMonitor,
    pointB: { x: -cableConnectorX, y: cableConnectorY },
    length: 4,
    stiffness: 0.8,
    damping: 0.05,
    collisionFilter: {
      category: BACKGROUND_CATEGORY,
      // Exclude collisions with monitors by removing MONITOR_CATEGORY from the mask.
      mask: 0xFFFFFFFF & ~FOREGROUND_CATEGORY  
    },
    render: {
      anchors: false,
      type: 'line'
    },
    collisionFilter: { group: -1 },
  });
  
  // --- Create a bobble-head toy ---
  const bobbleX = width / 2;
  const bobbleY = height - 75;
  
  const bobbleHead = Matter.Bodies.circle(bobbleX, bobbleY, 20, {
    restitution: 0.8
  });
  
  const bobbleConstraint = Matter.Constraint.create({
    pointA: { x: bobbleX, y: bobbleY - 50 },
    bodyB: bobbleHead,
    stiffness: 0.02,
    damping: 0.1
  });
  
  // --- Optional: Create ground ---
  const floor = Matter.Bodies.rectangle(width/2, height, width, 24,  { isStatic: true, render: { visible: false }});
  const roof = Matter.Bodies.rectangle(width/2, 0, width, 24, { isStatic: true, render: { visible: false } });
  const leftWall = Matter.Bodies.rectangle(- 48, height/2, 24, height, { isStatic: true, render: { visible: true } });
  const rightWall = Matter.Bodies.rectangle(width + 48, height/2, 24, height, { isStatic: true, render: { visible: true } });
  
  // Add all bodies and constraints to the world.
  Matter.World.add(engine.world, [
    cable, cableAttachment, cableToMonitor,
    leftMonitor, rightMonitor,
    bobbleHead, bobbleConstraint,
    floor, roof, leftWall, rightWall
  ]);

  console.log(`Physics initialized.`);
  
  // Return an object with references for further use if needed.
  return {
    cable,
    bobbleHead,
    leftMonitor,
    rightMonitor
  };
}