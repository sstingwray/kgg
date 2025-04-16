// js/utils/helpers.js

const Matter = window.Matter;

const originalAllBodies = Matter.Composite.allBodies;

Matter.Composite.allBodies = function(composite) {
  let bodies = originalAllBodies(composite);
  bodies.sort((a, b) => {
    // Use the custom order, defaulting to 0 if not present.
    const orderA = a.render.order || 0;
    const orderB = b.render.order || 0;
    return orderA - orderB;
  });
  
  return bodies;
};

export function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }
  
  // Add other general purpose functions as needed.

export function getRGBA(name, opacity) {
  switch (name) {
    case 'night':
      return `rgba(17, 17, 17, ${opacity})`;
    case 'eerie-black':
      return `rgba(27, 27, 27, ${opacity})`;
    case `raisin-black`:
      return `rgba(36, 33, 36, ${opacity})`;
    case `jet`:
      return`rgba(52, 52, 52, ${opacity})`;
    case 'davy-gray':
      return `rgba(85, 85, 85, ${opacity})`;
    case `white`:
      return `rgba(242, 243, 244, ${opacity})`;
    case `neon-green`:
      return `rgba(57, 255, 20, ${opacity})`;
    case `auburn`:
      return `rgba(165, 42, 42, ${opacity})`;
    case `dark-cyan`:
      return `rgba(0, 139, 139, ${opacity})`;
    case `gold`:
      return `rgba(212, 175, 55, ${opacity})`;
  };
}

export function preloadAssets(callback) {
  const assets = {};
  let loadedCount = 0;
  const assetSources = {
    monitorL: 'images/Mechatrucker/monitor-l.svg',
    monitorR: 'images/Mechatrucker/monitor-r.svg',
    centralPanel: 'images/Mechatrucker/Central-Terminal.svg',
    ignitionIco: 'images/Mechatrucker/bolt-solid.svg',
  };

  const assetNames = Object.keys(assetSources);
  const totalAssets = assetNames.length;

  assetNames.forEach(name => {
    const img = new Image();
    img.src = assetSources[name];
    img.onload = () => {
      assets[name] = img;
      loadedCount++;
      if (loadedCount === totalAssets) {
        callback(assets);
      }
    };
    img.onerror = (err) => {
      console.error(`Error loading asset: ${name}`, err);
      loadedCount++;
      if (loadedCount === totalAssets) {
        callback(assets);
      }
    };
  });
}

export function connectMonitorWithConnector(engine, monitorBody, canvasAnchor, connectorWidth = 10) {
  // Calculate the vector from the canvas anchor to the monitor.
  const dx = monitorBody.position.x - canvasAnchor.x;
  const dy = monitorBody.position.y - canvasAnchor.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Find the midpoint between the canvas anchor and the monitor.
  const midX = (canvasAnchor.x + monitorBody.position.x) / 2;
  const midY = (canvasAnchor.y + monitorBody.position.y) / 2;
  
  // Create the connector rectangle.
  // The rectangle's height is set to the distance between the two points
  const connector = Matter.Bodies.rectangle(midX, midY, connectorWidth, distance, {
    // If the connector should move (rather than being static), leave isStatic false.
    isStatic: false,
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
    damping: 0.1,
    render: {
      visible: false
    }
  });
  
  // Create another pin constraint connecting the bottom of the connector to the monitor.
  // Here, we attach to the monitor's center (or adjust pointB if a different point is desired).
  const constraintMonitor = Matter.Constraint.create({
    bodyA: connector,
    pointA: localBottom,
    bodyB: monitorBody,
    pointB: { x: 0, y: -24 },
    stiffness: 1,
    damping: 0.1,
    render: {
      visible: false
    }
  });
  
  // Add the connector and its constraints to the world.
  Matter.World.add(engine.world, [connector, constraintAnchor, constraintMonitor]);
  
  return connector;
}
