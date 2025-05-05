// js/gameObjects/gearShiftLever.js

import emitter from '../modules/eventEmitter.js';
import Interactable from './interactable.js';
import { getRGBA } from '../utils/helpers.js';

const Vector = Matter.Vector;

/**
 * GearShiftLever rides on a moving panelBody and allows selecting gears when clutch is disengaged.
 */
export default class GearShiftLever extends Interactable {
  constructor({ body, x = 0, y = 0, channelLen = 120, handleRadius = 15 } = {}) {
    super();
    this.body         = body;
    this.localOffset  = Vector.create(x, y);
    this.channelLen   = channelLen;
    this.handleRadius = handleRadius;

    // Gear definitions
    this.gearNames   = ['Reverse', 'Neutral', '1st', '2nd', '3rd'];
    this.gearCount   = this.gearNames.length;
    this.currentGear = 1; // start at Neutral
    this.isDragging  = false;

    // clutch flag from outside
    this.clutch = false;
    emitter.subscribe('clutchToggle', this.handleClutchChange.bind(this));
  }

  handleClutchChange(state) {
    this.clutch = state;
  }

  /**
   * Convert a panel-local vector (x,y) into world coords
   */
  toWorld(local) {
    // rotate local vector by panel angle, then translate
    const rotated = Vector.rotate(local, this.body.angle);
    return Vector.add(rotated, this.body.position);
  }

  /**
   * Compute local Y offset along channel for a given gear index
   */
  localOffsetForIndex(index) {
    const half = this.channelLen / 2;
    const frac = index / (this.gearCount - 1);
    return frac * this.channelLen - half;
  }

  /**
   * Compute handle position in world coords based on currentGear
   */
  getHandlePos() {
    const dy = this.localOffsetForIndex(this.currentGear);
    const localPos = Vector.create(this.localOffset.x, this.localOffset.y + dy);
    return this.toWorld(localPos);
  }

  onMouseDown(event) {
    const pos = this.getHandlePos(); 
    const dx = event.offsetX - pos.x;
    const dy = event.offsetY - pos.y;    
    if (dx*dx + dy*dy <= this.handleRadius**2) {
      if (!this.clutch) {
        console.log('Clutch engaged; lever locked.');
        return;
      }
      this.isDragging = true;
    }
  }

  onMouseMove(event) {
    if (!this.isDragging) return;
    // map screen coords to panel-local coords
    const P = this.body.position;
    const rel = Vector.create(event.offsetX - P.x, event.offsetY - P.y);
    const local = Vector.rotate(rel, -this.body.angle);
    // extract local Y relative to lever channel
    const localY = local.y - this.localOffset.y;
    const frac = Math.min(1, Math.max(0, (localY + this.channelLen/2) / this.channelLen));
    const idx  = Math.round(frac * (this.gearCount - 1));
    if (idx !== this.currentGear) {
      this.currentGear = idx;
      emitter.emit('gearShift', this.gearNames[idx]);
    }
  }

  onMouseUp() {
    this.isDragging = false;
  }

  render(ctx) {
    // compute channel endpoints
    const half = this.channelLen / 2;
    const topLocal    = Vector.create(this.localOffset.x, this.localOffset.y - half);
    const bottomLocal = Vector.create(this.localOffset.x, this.localOffset.y + half);
    const top    = this.toWorld(topLocal);
    const bottom = this.toWorld(bottomLocal);

    ctx.save();
    // draw channel line
    ctx.strokeStyle = getRGBA('jet', 1);
    ctx.lineWidth   = 6;
    ctx.beginPath();
    ctx.moveTo(top.x, top.y);
    ctx.lineTo(bottom.x, bottom.y);
    ctx.stroke();
    ctx.shadowColor = getRGBA('dark-cyan', 1);

    // draw gear markers and labels
    for (let i = 0; i < this.gearCount; i++) {
      const dy    = this.localOffsetForIndex(i);
      const mark  = this.toWorld(Vector.create(this.localOffset.x, this.localOffset.y + dy));
      // marker circle
      ctx.beginPath();
      ctx.shadowBlur = (i === this.currentGear ? 20 : 0);
      ctx.shadowOffsetX = 0;            
      ctx.shadowOffsetY = 0;
      ctx.arc(mark.x, mark.y, 8, 0, 2*Math.PI);
      ctx.fillStyle   = getRGBA('jet', 1);
      ctx.fill();
      // label
      ctx.fillStyle   = (i === this.currentGear
                          ? getRGBA('dark-cyan', 1)
                          : getRGBA('dark-cyan', 0.5));
      ctx.font        = i === this.currentGear ? 'bold 14px sans-serif' : '12px sans-serif';
      ctx.textAlign   = 'left'; 
      ctx.textBaseline= 'middle';
      ctx.fillText(this.gearNames[i], mark.x + 24, mark.y);
    }

    ctx.shadowBlur = 0;
    // draw handle
    const handle = this.getHandlePos();
    ctx.beginPath();
    ctx.arc(handle.x, handle.y, this.handleRadius, 0, 2*Math.PI);
    ctx.fillStyle   = getRGBA('gold', 1);
    ctx.fill();
    ctx.lineWidth   = 1;
    ctx.strokeStyle = getRGBA('raisin-black', 1);
    ctx.stroke();
    
    // Draw the main pad of the cat paw (acting as the gear shift handle)
    // Define toe pad positions relative to the handle center
    const toePads = [
      { x: handle.x - 10,  y: handle.y - 2,    r: 2.5  },
      { x: handle.x - 4,   y: handle.y - 9,    r: 3     },
      { x: handle.x + 4,   y: handle.y - 9,    r: 3     },
      { x: handle.x + 10,  y: handle.y - 2,    r: 2.5  },
      { x: handle.x - 4,   y: handle.y + 6,    r: 5    },
      { x: handle.x,       y: handle.y + 4,    r: 6    },
      { x: handle.x + 4,   y: handle.y + 6,    r: 5    },
      ];
  
      // Draw each toe pad along with a small white detail
      toePads.forEach(pad => {
        ctx.beginPath();
        ctx.arc(pad.x, pad.y, pad.r, 0, Math.PI * 2);
        ctx.fillStyle = getRGBA('raisin-black', 1);
        ctx.fill();
      });

    ctx.restore();
  }
}
