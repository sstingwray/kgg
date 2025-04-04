// experimental-terragen.js

export function generateTerrainMap({ segmentCount = 100, seed = 0 } = {}) {
  const map = [];
  const rand = mulberry32(seed);

  let currentZ = 0;
  let currentX = 0;

  for (let i = 0; i < segmentCount; i++) {
    // Dynamic segment length between 30 and 300
    const segmentLength = Math.floor(rand() * 270) + 30;

    // Friction and resistance as integers 1–5
    const friction = Math.floor(rand() * 5) + 1;
    const resistance = Math.floor(rand() * 5) + 1;

    // Resistance-based color coding
    let resistanceColor = "green";
    if (resistance > 2) resistanceColor = "red";
    else if (resistance > 4) resistanceColor = "yellow";

    // Smoother elevation transition
    const deltaZ = (rand() - 0.5) * 2.5; // more gradual than original ±5
    currentZ += deltaZ;

    map.push({
      x: currentX,
      z: +currentZ.toFixed(2),
      friction,
      resistance,
      resistanceColor
    });

    currentX += segmentLength;
  }

  return map;
}

// Simple seeded PRNG
function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}