import emitter from './eventEmitter.js';
import Matter from './matter.esm.js';
import { getRGBA } from '../utils/helpers.js';

const FOREGROUND_CATEGORY = 0x0002;
const BACKGROUND_CATEGORY = 0x0004;
const cableWidth = 4;
const cableLength = 0;
const cableColor = getRGBA('davy-gray', 1);

export function initPhysics(engine, assets, dimensions) {
  const { width, height } = dimensions;

  const MONITOR_LEFT_SIZE   = { width: 12*18, height: 12*32 };
  const MONITOR_RIGHT_SIZE  = { width: 12*18, height: 12*32 };
  const THERMO_SIZE         = { width: 12*3, height: 12*10 };

  const paramsMonitorLeft = {
    string: 'monitor-l',
    texture:      assets.monitorL.src,
    placement:    { x: 24 + MONITOR_LEFT_SIZE.width,            y: -12 + MONITOR_LEFT_SIZE.height / 2 },
    size:         MONITOR_LEFT_SIZE,
    mount:        { x: 24 + MONITOR_LEFT_SIZE.width,            y: -12},
    cable: {
      cableSegmentCount: 36,
      cableSegmentLength: 12,
      cableSegmentWidth: 4,
      start:      { x: 12,                                      y: -14 },
      connector:  { x: 200,                                     y: 24 },
    }
  }
  const paramsMonitorRight = {
    string: 'monitor-r',
    texture:      assets.monitorR.src,
    placement:    { x: width - (24 + MONITOR_RIGHT_SIZE.width), y: -12 + MONITOR_RIGHT_SIZE.height / 2 },
    size:         MONITOR_RIGHT_SIZE,
    mount:        { x: width - (24 + MONITOR_RIGHT_SIZE.width), y: -12 },
    cable: {
      cableSegmentCount: 36,
      cableSegmentLength: 12,
      cableSegmentWidth: 4,
      start:      { x: width - 12,                              y: -14 },
      connector:  { x: -201,                                    y: 24 },
    }
  }
  const paramsThermometer = {
    string: 'thermometer',
    texture:      assets.thermometer.src,
    placement:    { x: width - 36,                              y: 12*40 },
    size:         THERMO_SIZE,
    cable: {
      cableSegmentCount: 4,
      cableSegmentLength: 24,
      cableSegmentWidth: 4,
      start:      { x: width - 12*3 - 6,                        y: height / 2  - 12*5 + 2},
      connector:  { x: 0,                                       y: -4 -THERMO_SIZE.height / 2 },
    }
  }
  const paramsCentralPanel = {
    placement:    { x: width / 2,                               y: height - 12*14 },
    size:         { width: width + 12*5 + 8,                        height: 12*25 },
  }

  const leftMonitor  = createMonitor(paramsMonitorLeft);
  const rightMonitor = createMonitor(paramsMonitorRight);
  const thermometer = createThermometer(paramsThermometer);

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
          xScale: 1,  // Adjust this divisor based on the SVG's natural width.
          yScale: 1  // Adjust this divisor based on the SVG's natural height.
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
    leftMonitor.cable.cable, leftMonitor.cable.cableAttachment, leftMonitor.cable.cableToBody,
    leftMonitor.mount.connector, leftMonitor.mount.mountToCanvas, leftMonitor.mount.mountToBody,

    rightMonitor.cable.cable, rightMonitor.cable.cableAttachment, rightMonitor.cable.cableToBody,
    rightMonitor.mount.connector, rightMonitor.mount.mountToCanvas, rightMonitor.mount.mountToBody,

    thermometer.cable.cable, thermometer.cable.cableAttachment, thermometer.cable.cableToBody,

    leftMonitor.monitor, rightMonitor.monitor, thermometer.thermometer,

    centralPanel,

    floor, roof, leftWall, rightWall
  ]);

  //bind to events
  emitter.subscribe('engineWorking', engineShake.bind(this, engine));
  emitter.subscribe('stepMade', stepShake.bind(this, engine));

  emitter.emit('[LOG][physics] Physics initialized.');
  return {
    cableLeft:    leftMonitor.cable.cable,
    cableRight:   rightMonitor.cable.cable,
    leftMonitor:  leftMonitor.monitor,
    rightMonitor: rightMonitor.monitor,
    thermometer: thermometer.thermometer,
    centralPanel
  };
}

export function createBodyConnector(body, params, width = 24, length = 156) {  
  const connector = Matter.Bodies.rectangle(params.x, params.y, width, length, {
    stiffness: 1,
    collisionFilter: {
      category: BACKGROUND_CATEGORY,
      mask: 0xFFFFFFFF & ~FOREGROUND_CATEGORY
    },
    render: {
      fillStyle: getRGBA('jet', 0.5),
      order: 1
    }
  });
  
  const mountToCanvas = Matter.Constraint.create({
    bodyA: connector,
    pointA: { x: 0, y: length / 2 - 12},
    bodyB: null,
    pointB: params,
    length: 0,
    stiffness: 1,
    render: {
      visible: false,
      anchors: false
    }
  });

  const mountToBody = Matter.Constraint.create({
    bodyA: connector,
    pointA: { x: 0, y: 12 - length / 2 },
    bodyB: body,
    pointB: { x: 0, y: -24 },
    length: 0,
    stiffness: 1,
    render: {
      visible: false,
      anchors: false
    }
  });
  
  return { connector, mountToCanvas, mountToBody };
}

function createCableConnection (body, params) {
  //cable segments
  const cable = Matter.Composites.stack(
    params.start.x, params.start.y, 1, params.cableSegmentCount, 0, 5,
    (x, y) => Matter.Bodies.rectangle(x, y, params.cableSegmentLength, params.cableSegmentWidth, {
      stiffness: 0.8,
      damping: 0.01,
      collisionFilter: {
        category: BACKGROUND_CATEGORY,
        mask: 0xFFFFFFFF & ~FOREGROUND_CATEGORY
      },
      render: {
        visible: true,
        fillStyle: cableColor,
        order: 2,
      }
    })
  );
  //connecting segments
  Matter.Composites.chain(cable, 0.5, 0, -0.5, 0, {
    stiffness: 0.8,
    damping: 0.01,
    length: cableLength,
    collisionFilter: {
      category: BACKGROUND_CATEGORY,
      mask: 0
    },
    render: {
      visible: false,
      type: 'pin',
      strokeStyle: cableColor,
      lineWidth: cableWidth,
      order: 1,
    },
  });
  //mounting point for the cable
  const cableAttachment = Matter.Constraint.create({
    pointA: params.start,
    bodyB: cable.bodies[0],
    pointB: { x: -params.cableSegmentLength / 2, y: 0 },
    length: 0,
    stiffness: 0.8,
    damping: 0.01,
    collisionFilter: {
      category: BACKGROUND_CATEGORY,
      mask: 0
    },
    render: {
      lineWidth: cableWidth,
      strokeStyle: cableColor,
      type: 'pin',
      visible: true,
    },
  });
  // body connection  
  const cableToBody = Matter.Constraint.create({
    bodyA: cable.bodies[cable.bodies.length - 1],
    pointA: { x: params.cableSegmentLength / 2, y: 0 },
    bodyB: body,
    pointB: { x: -params.connector.x, y: params.connector.y },
    length: 0,
    stiffness: 0.8,
    damping: 0.01,
    collisionFilter: {
      category: BACKGROUND_CATEGORY,
      mask: 0
    },
    render: {
      lineWidth: cableWidth,
      strokeStyle: cableColor,
      type: 'pin',
      visible: true,
    }
    
  });

  return { cable, cableAttachment, cableToBody };
}

function createMonitor (params) {
  const monitor = Matter.Bodies.rectangle(
    params.placement.x,
    params.placement.y,
    params.size.height,
    params.size.width,
    {
      string: params.string,
      restitution: 0.5,
      collisionFilter: {
        category: FOREGROUND_CATEGORY,
        mask: 0xFFFFFFFF
      },
      render: {
        fillStyle: getRGBA('auburn', 1),
        order: 2,
        sprite: {
          texture: params.texture,
          xScale: 0.75,
          yScale: 0.75
        }
      },
    }
  );

  const mount = createBodyConnector(monitor, params.mount);
  const cable = createCableConnection(monitor, params.cable);

  return { monitor, mount, cable };
}

function createThermometer (params) {
  const thermometer = Matter.Bodies.rectangle(
    params.placement.x,
    params.placement.y,
    params.size.width,
    params.size.height,
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
          texture: params.texture,
          xScale: 1,  // Adjust this divisor based on the SVG's natural width.
          yScale: 1  // Adjust this divisor based on the SVG's natural height.
        }
      },
    }
  );
  Matter.Body.setCentre(thermometer, { x: 0, y: 12 }, true);

  const cable = createCableConnection(thermometer, params.cable)

  return { thermometer, cable };
}

function engineShake(engine, value) {
  const force = value * 0.0001;

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
          x: bodyMassMod * (force - force * Math.random()*2),
          y: bodyMassMod * force*2 
        }
      )};
  })
}

function stepShake(engine, value) {
  const force = value.currentStepDistance * 0.0005;

  Matter.Composite.allBodies(engine.world).forEach(body => {
    if (body.string) {
      let bodyMassMod = body.mass * 0.05;
      let bodySizeXMod = body.bounds.max.x * 0.1;
      let bodySizeYMod = body.bounds.max.y * 0.1;
      Matter.Body.applyForce(
        body, 
        {
          x: body.position.x + bodySizeXMod - Math.random() * bodySizeXMod * 2,
          y: body.position.y + bodySizeYMod - Math.random() * bodySizeYMod * 2
        },
        { 
          x: bodyMassMod * (force - force * Math.random()*2),
          y: bodyMassMod * force*2 
        }
      )};
  })
}