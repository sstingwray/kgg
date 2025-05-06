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

export function round(value, decimals = 0) {
  let returnNum = Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
  return returnNum ? returnNum : 0;
};

function randRange(min, max) {
  return min + Math.random() * (max - min);
}

export function localToWorld(body, local) {
  const rotated = Matter.Vector.rotate(local, body.angle);
  return Matter.Vector.add(rotated, body.position);
}

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
    bg:           'images/Mechatrucker/bg.png',     
    monitorL:     'images/Mechatrucker/monitor-l.svg',
    monitorR:     'images/Mechatrucker/monitor-r.svg',
    thermometer:  'images/Mechatrucker/thermometer.svg',
    centralPanel: 'images/Mechatrucker/Central-Terminal.svg',
    ignitionIco:  'images/Mechatrucker/bolt-solid.svg',
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
