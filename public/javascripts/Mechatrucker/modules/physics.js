// js/modules/physics.js

import emitter from './eventEmitter.js';
import { getRGBA } from '../utils/helpers.js';

export function initPhysics(engine, assets, dimensions) {
  const { width, height } = dimensions;
  const FOREGROUND_CATEGORY = 0x0002;
  const BACKGROUND_CATEGORY = 0x0004;
  const MONITOR_LEFT_SIZE   = { width: 12*18, height: 12*32 };
  const MONITOR_RIGHT_SIZE  = { width: 12*18, height: 12*32 };
  const MONITOR_ARM_WIDTH   = 16;
  const THERMO_SIZE         = { width: 12*3, height: 12*10 };

  const cableSegmentCount = 24;
  const cableSegmentRadius = 0.01;
  const cableWidth = 4;
  const cableLength = 24;
  const cableColor = getRGBA('davy-gray', 1);

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
  const paramsThermometer = {
    placement:    { x: width - (24 + MONITOR_RIGHT_SIZE.width), y: 96 + MONITOR_RIGHT_SIZE.height / 2 },
    size:         THERMO_SIZE,
    cable: {
      start:      { x: width - 12,                              y: -4 },
      connector:  { x: 0,                                       y: -THERMO_SIZE.height / 2 },
    }
  }
  const paramsCentralPanel = {
    placement:    { x: width / 2,                               y: height - 12*14 },
    size:         { width: width + 12*5 + 8,                        height: 12*25 },
  }

  //LEFT MONITOR
  const leftMonitor = Matter.Bodies.rectangle(
    paramsMonitorLeft.placement.x,
    paramsMonitorLeft.placement.y,
    paramsMonitorLeft.size.height,
    paramsMonitorLeft.size.width,
    {
      string: 'monitor-l',
      restitution: 0.5,
      collisionFilter: {
        category: FOREGROUND_CATEGORY,
        // let it collide with everything else (adjust mask as needed)
        mask: 0xFFFFFFFF
      },
      render: {
        fillStyle: getRGBA('auburn', 1),
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
  const leftMonitorConnector = createBodyConnector(engine, leftMonitor, paramsMonitorLeft.mount, MONITOR_ARM_WIDTH);
  leftMonitorConnector.collisionFilter = {
    category: BACKGROUND_CATEGORY,
    mask: 0xFFFFFFFF & ~FOREGROUND_CATEGORY  
  };

  //RIGHT MONITOR
  const rightMonitor = Matter.Bodies.rectangle(
    paramsMonitorRight.placement.x,
    paramsMonitorRight.placement.y,
    paramsMonitorRight.size.height,
    paramsMonitorRight.size.width,
    {
      string: 'monitor-r',
      restitution: 0.5,
      collisionFilter: {
        category: FOREGROUND_CATEGORY,
        mask: 0xFFFFFFFF  
      },
      render: {
        fillStyle: getRGBA('auburn', 1),
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
  const rightMonitorConnector = createBodyConnector(engine, rightMonitor, paramsMonitorRight.mount, MONITOR_ARM_WIDTH);
  rightMonitorConnector.collisionFilter = {
    category: BACKGROUND_CATEGORY,
    mask: 0xFFFFFFFF & ~FOREGROUND_CATEGORY  
  };

  //THERMOMETER
  const thermometer = Matter.Bodies.rectangle(
    paramsThermometer.placement.x,
    paramsThermometer.placement.y,
    paramsThermometer.size.width,
    paramsThermometer.size.height,
    {
      string: 'thermometer',
      restitution: 0.5,
      collisionFilter: {
        category: FOREGROUND_CATEGORY,
        // let it collide with everything else (adjust mask as needed)
        mask: 0xFFFFFFFF
      },
      render: {
        fillStyle: getRGBA('auburn', 1),
        anchors: false,
        order: 2,
        sprite: {
          texture: assets.thermometer.src,
          xScale: 1,  // Adjust this divisor based on the SVG's natural width.
          yScale: 1  // Adjust this divisor based on the SVG's natural height.
        }
      },
    }
  );
  
  //LEFT CABLE
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
    length: cableLength,
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
    length: 0,
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

  //RIGHT CABLE
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
    length: cableLength,
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
    length: 0,
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

  //THERMO CABLE
  const cableThermo = Matter.Composites.stack(
    paramsThermometer.cable.start.x, paramsThermometer.cable.start.y, 1, cableSegmentCount / 1.2, 0, 5,
    (x, y) => Matter.Bodies.circle(x, y, cableSegmentRadius, {
      stiffness: 1,
      damping: 0.05,
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
  Matter.Composites.chain(cableThermo, 0.5, 0, -0.5, 0, {
    stiffness: 1,
    damping: 0.05,
    length: cableLength,
    render: {
      strokeStyle: cableColor,
      lineWidth: cableWidth,
      anchors: false,
      order: 1,
    },
  });
  const cableThermoAttachment = Matter.Constraint.create({
    pointA: paramsThermometer.cable.start,
    bodyB: cableThermo.bodies[0],
    pointB: { x: 0, y: 0 },
    stiffness: 0.8,
    damping: 0.05,
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
  const cableToThermo = Matter.Constraint.create({
    bodyA: cableThermo.bodies[cableThermo.bodies.length - 1],
    pointA: { x: 0, y: 0 },
    bodyB: thermometer,
    pointB: { x: -paramsThermometer.cable.connector.x, y: paramsThermometer.cable.connector.y },
    length: 0,
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

  //CENTRAL PANEL
  const centralPanel = Matter.Bodies.rectangle(
    paramsCentralPanel.placement.x,
    paramsCentralPanel.placement.y,
    paramsCentralPanel.size.width,
    paramsCentralPanel.size.height,
    {
      isStatic: false,
      string: 'central-panel',
      restitution: 0.8,
      render: {
        fillStyle: getRGBA('auburn', 0.5),
        visible: true,
        sprite: {
          texture: assets.centralPanel.src,
          //yOffset: 0.05,
          xScale: 0.53,  // Adjust this divisor based on the SVG's natural width.
          yScale: 0.53  // Adjust this divisor based on the SVG's natural height.
        }
      }
    }
  );

  //CABIN CONTRAINTS
  const floor = Matter.Bodies.rectangle(width/2, height, width, 1,  { isStatic: true, render: { visible: false }});
  const roof = Matter.Bodies.rectangle(width/2, -96, width, 24, { isStatic: true, render: { visible: true } });
  const leftWall = Matter.Bodies.rectangle(- 48, height/2, 24, height, { isStatic: true, render: { visible: true } });
  const rightWall = Matter.Bodies.rectangle(width + 48, height/2, 24, height, { isStatic: true, render: { visible: true } });

  Matter.World.add(engine.world, [
    cableLeft, cableLeftAttachment, cableToLeftMonitor,
    cableRight, cableRightAttachment, cableToRightMonitor,
    cableThermo, cableThermoAttachment, cableToThermo,
    leftMonitor, rightMonitor, thermometer,
    centralPanel,
    floor, roof, leftWall, rightWall
  ]);

  //bind to events
  emitter.subscribe('engineWorking', engineShake.bind(this, engine));
  emitter.subscribe('stepMade', stepShake.bind(this, engine));

  console.log(`[physics] Physics initialized.`);
  return {
    cableLeft, cableRight,
    leftMonitor, rightMonitor,
    centralPanel
  };
}

export function createBodyConnector(engine, body, canvasAnchor, connectorWidth = 10) {
  const dx = body.position.x - canvasAnchor.x;
  const dy = body.position.y - canvasAnchor.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const midX = (canvasAnchor.x + body.position.x) / 2;
  const midY = (canvasAnchor.y + body.position.y) / 2;
  
  // Create the connector rectangle.
  // The rectangle's height is set to the distance between the two points
  const connector = Matter.Bodies.rectangle(midX, midY, connectorWidth, distance, {
    // If the connector should move (rather than being static), leave isStatic false.
    render: {
      fillStyle: getRGBA('jet', 0.5),
      order: 1
    }
  });
  
  // Define the attachment points in the connector's local coordinates.
  // In a rectangle, the top edge (relative to its center) is at y = -height/2,
  // and the bottom edge is at y = height/2.
  const localTop = { x: 0, y: -distance / 2 };
  const localBottom = { x: 0, y: distance / 2 };
  
  // Create a pin constraint connecting the top of the connector to the canvas anchor.
  const constraintAnchor = Matter.Constraint.create({
    bodyA: connector,
    pointA: localTop,
    pointB: canvasAnchor,  // Fixed point in world coordinates.
    stiffness: 1,
    render: {
      visible: false
    }
  });
  
  // Create another pin constraint connecting the bottom of the connector to the monitor.
  // Here, we attach to the monitor's center (or adjust pointB if a different point is desired).
  const constraintMonitor = Matter.Constraint.create({
    bodyA: connector,
    pointA: localBottom,
    bodyB: body,
    pointB: { x: 0, y: -24 },
    stiffness: 1,
    render: {
      visible: false
    }
  });
  
  // Add the connector and its constraints to the world.
  Matter.World.add(engine.world, [connector, constraintAnchor, constraintMonitor]);
  
  return connector;
}

function engineShake(engine, value) {
  const force = value * 0.001;
  console.log('force', force);
  

  Matter.Composite.allBodies(engine.world).forEach(body => {
    if (body.string) {
      Matter.Body.applyForce(
        body, 
        {
            x: body.position.x + 5 - Math.random()*10,
            y: body.position.y + 5 - Math.random()*10
        },
        { x: force - force * Math.random()*2, y: force*2 }
    )};
  })
}

function stepShake(engine, value) {
  const force = value.currentStepDistance * 0.001;

  Matter.Composite.allBodies(engine.world).forEach(body => {
    if (body.string) {
      Matter.Body.applyForce(
        body, 
        {
            x: body.position.x + 10 - Math.random()*20,
            y: body.position.y + 10 - Math.random()*20
        },
        { x: force - force * Math.random()*2, y: force*2 }
    )};
  })
}