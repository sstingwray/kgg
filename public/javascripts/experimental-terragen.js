// terrain-generator.js

export function generateTerrainMap({ segmentLength = 100, segmentCount = 100, seed = 0 } = {}) {
    const map = [];
    const rand = mulberry32(seed);
  
    let currentZ = 0;
    let currentX = 0;
  
    for (let i = 0; i < segmentCount; i++) {
      const friction = +(rand() * 10).toFixed(2);
      const resistance = +(rand() * 10).toFixed(2);
      currentZ += (rand() - 0.5) * 5; // gentle vertical shifts
  
      map.push({
        x: currentX,
        z: +currentZ.toFixed(2),
        friction,
        resistance
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