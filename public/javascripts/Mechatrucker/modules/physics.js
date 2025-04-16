// js/modules/physics.js

import emitter from './eventEmitter.js';
import { connectMonitorWithConnector, getRGBA } from '../utils/helpers.js';

export function initPhysics(engine, assets, dimensions) {
  const { width, height } = dimensions;
  const FOREGROUND_CATEGORY = 0x0002;
  const BACKGROUND_CATEGORY = 0x0004;
  const MONITOR_LEFT_SIZE =   { width: 12*18, height: 12*32 };
  const MONITOR_RIGHT_SIZE =  { width: 12*18, height: 12*32 };
  const MONITOR_ARM_WIDTH = 8;

  const cableSegmentCount = 76;
  const cableSegmentRadius = 0.05;
  const cableWidth = 4;
  const cableColor = getRGBA('night', 1);

  const paramsMonitorLeft = {
    placement:    { x: 24 + MONITOR_LEFT_SIZE.width,            y: -96 + MONITOR_LEFT_SIZE.height / 2 },
    size:         MONITOR_LEFT_SIZE,
    mount:        { x: 24 + MONITOR_LEFT_SIZE.width,            y: -24},
    cable: {
      start:      { x: 12,                                      y: -4 },
      connector:  { x: 200,                                     y: 24 },
    }
  }

  const paramsMonitorRight = {
    placement:    { x: width - (24 + MONITOR_RIGHT_SIZE.width), y: -96 + MONITOR_RIGHT_SIZE.height / 2 },
    size:         MONITOR_RIGHT_SIZE,
    mount:        { x: width - (24 + MONITOR_RIGHT_SIZE.width), y: -24},
    cable: {
      start:      { x: width - 12,                              y: -4 },
      connector:  { x: -201,                                    y: 24 },
    }
  }

  const paramsCentralPanel = {
    placement:    { x: width / 2,                               y: height - 12*25 / 2 },
    size:         { width: width,                               height: 12*25 }
  }

  const leftMonitor = Matter.Bodies.rectangle(
    paramsMonitorLeft.placement.x,
    paramsMonitorLeft.placement.y,
    24 + paramsMonitorLeft.size.width,
    paramsMonitorLeft.size.height,
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
  
  const leftMonitorConnector = connectMonitorWithConnector(engine, leftMonitor, paramsMonitorLeft.mount, MONITOR_ARM_WIDTH);
  leftMonitorConnector.collisionFilter = {
    category: BACKGROUND_CATEGORY,
    mask: 0xFFFFFFFF & ~FOREGROUND_CATEGORY  
  };

  const rightMonitor = Matter.Bodies.rectangle(
    paramsMonitorRight.placement.x,
    paramsMonitorRight.placement.y,
    24 + paramsMonitorRight.size.width,
    paramsMonitorRight.size.height,
    {
      string: 'monitor-r',
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

  const rightMonitorConnector = connectMonitorWithConnector(engine, rightMonitor, paramsMonitorRight.mount, MONITOR_ARM_WIDTH);
  rightMonitorConnector.collisionFilter = {
    category: BACKGROUND_CATEGORY,
    mask: 0xFFFFFFFF & ~FOREGROUND_CATEGORY  
  };
  
  
  // --- Create a dangling cable for the left monitor---
  const cableLeft = Matter.Composites.stack(
    paramsMonitorLeft.cable.start.x, paramsMonitorLeft.cable.start.y, 1, cableSegmentCount, 0, 5,
    (x, y) => Matter.Bodies.circle(x, y, cableSegmentRadius, {
      stiffness: 1,
      collisionFilter: {
        category: BACKGROUND_CATEGORY,
        // Exclude collisions with monitors by removing MONITOR_CATEGORY from the mask.
        mask: 0xFFFFFFFF & ~FOREGROUND_CATEGORY  
      },
      render: {
        fillStyle: cableColor,
        order: 1,
      }
    })
  );
  Matter.Composites.chain(cableLeft, 0.5, 0, -0.5, 0, {
    stiffness: 1,
    length: 4,
    render: {
      strokeStyle: cableColor,
      lineWidth: cableWidth,
      anchors: false,
      order: 1,
    },
  });
  const cableLeftAttachment = Matter.Constraint.create({
    pointA: paramsMonitorLeft.cable.start,
    bodyB: cableLeft.bodies[0],
    pointB: { x: 0, y: 0 },
    stiffness: 1,
    collisionFilter: {
      category: BACKGROUND_CATEGORY,
      // Exclude collisions with monitors by removing MONITOR_CATEGORY from the mask.
      mask: 0xFFFFFFFF & ~FOREGROUND_CATEGORY  
    },
    render: {
      visible: false,
      order: 1
    },
  });
  const cableToLeftMonitor = Matter.Constraint.create({
    bodyA: cableLeft.bodies[cableLeft.bodies.length - 1],
    pointA: { x: 0, y: 0 },
    bodyB: leftMonitor,
    pointB: { x: -paramsMonitorLeft.cable.connector.x, y: paramsMonitorLeft.cable.connector.y },
    length: 4,
    stiffness: 0.8,
    damping: 0.05,
    collisionFilter: {
      category: BACKGROUND_CATEGORY,
      // Exclude collisions with monitors by removing MONITOR_CATEGORY from the mask.
      mask: 0xFFFFFFFF & ~FOREGROUND_CATEGORY  
    },
    render: {
      strokeStyle: cableColor,
      lineWidth: cableWidth,
      anchors: true,
      type: 'line'
    },
  });

  // --- Create a dangling cable for the right monitor---
  const cableRight = Matter.Composites.stack(
    paramsMonitorRight.cable.start.x, paramsMonitorRight.cable.start.y, 1, cableSegmentCount, 0, 5,
    (x, y) => Matter.Bodies.circle(x, y, cableSegmentRadius, {
      stiffness: 1,
      collisionFilter: {
        category: BACKGROUND_CATEGORY,
        // Exclude collisions with monitors by removing MONITOR_CATEGORY from the mask.
        mask: 0xFFFFFFFF & ~FOREGROUND_CATEGORY  
      },
      render: {
        fillStyle: cableColor,
        order: 1,
      }
    })
  );
  Matter.Composites.chain(cableRight, 0.5, 0, -0.5, 0, {
    stiffness: 1,
    length: 4,
    render: {
      strokeStyle: cableColor,
      lineWidth: cableWidth,
      anchors: false,
      order: 1,
    },
  });
  const cableRightAttachment = Matter.Constraint.create({
    pointA: paramsMonitorRight.cable.start,
    bodyB: cableRight.bodies[0],
    pointB: { x: 0, y: 0 },
    stiffness: 1,
    collisionFilter: {
      category: BACKGROUND_CATEGORY,
      // Exclude collisions with monitors by removing MONITOR_CATEGORY from the mask.
      mask: 0xFFFFFFFF & ~FOREGROUND_CATEGORY  
    },
    render: {
      visible: false,
      order: 1
    },
  });
  const cableToRightMonitor = Matter.Constraint.create({
    bodyA: cableRight.bodies[cableRight.bodies.length - 1],
    pointA: { x: 0, y: 0 },
    bodyB: rightMonitor,
    pointB: { x: -paramsMonitorRight.cable.connector.x, y: paramsMonitorRight.cable.connector.y },
    length: 4,
    stiffness: 0.8,
    damping: 0.05,
    collisionFilter: {
      category: BACKGROUND_CATEGORY,
      // Exclude collisions with monitors by removing MONITOR_CATEGORY from the mask.
      mask: 0xFFFFFFFF & ~FOREGROUND_CATEGORY  
    },
    render: {
      strokeStyle: cableColor,
      lineWidth: cableWidth,
      anchors: true,
      type: 'line'
    },
  });
  
  const centralPanel = Matter.Bodies.rectangle(
    paramsCentralPanel.placement.x,
    paramsCentralPanel.placement.y,
    paramsCentralPanel.size.width,
    paramsCentralPanel.size.height,
    {
      isStatic: true,
      string: 'central-panel',
      restitution: 0.8,
      render: {
        visible: true,
        sprite: {
          texture: assets.centralPanel.src,
          xScale: 0.53,  // Adjust this divisor based on the SVG's natural width.
          yScale: 0.53  // Adjust this divisor based on the SVG's natural height.
        }
      }
    }
  );

  const floor = Matter.Bodies.rectangle(width/2, height, width, 24,  { isStatic: true, render: { visible: false }});
  const roof = Matter.Bodies.rectangle(width/2, -96, width, 24, { isStatic: true, render: { visible: true } });
  const leftWall = Matter.Bodies.rectangle(- 48, height/2, 24, height, { isStatic: true, render: { visible: true } });
  const rightWall = Matter.Bodies.rectangle(width + 48, height/2, 24, height, { isStatic: true, render: { visible: true } });

  Matter.World.add(engine.world, [
    cableLeft, cableLeftAttachment, cableToLeftMonitor,
    cableRight, cableRightAttachment, cableToRightMonitor,
    leftMonitor, rightMonitor,
    centralPanel,
    floor, roof, leftWall, rightWall
  ]);

  console.log(`Physics initialized.`);
  
  // Return an object with references for further use if needed.
  return {
    cableLeft, cableRight,
    leftMonitor, rightMonitor,
    centralPanel
  };
}