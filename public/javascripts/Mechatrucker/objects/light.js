// js/gameObjects/light.js
import Interactable from './interactable.js';
import { getRGBA } from '../utils/helpers.js';

export default class Light extends Interactable {
  /**
   * Creates a new Light indicator.
   * @param {Object} options
   * @param {number} options.x      – center x of the light
   * @param {number} options.y      – center y of the light
   * @param {number} options.radius – radius of the light circle
   * @param {string} options.label  – text label shown underneath
   * @param {boolean} [options.state=false] – initial on/off state
   * @param {Function} [options.onToggle]   – called whenever the light changes state
   */
  constructor(options = {}) {
    super(options);
    this.x       = options.x      || 0;
    this.y       = options.y      || 0;
    this.radius  = options.radius || 12;
    this.label   = options.label  || '';
    this.state   = options.state;
    this.callback= options.onToggle || (() => {});
    this.isPressed = false;
    // give it a render order if you sort bodies
    this.render.order = options.renderOrder || 100;
  }

  /** hit‑test a point (canvas coords) against the light’s circle */
  isPointInside(px, py) {
    const dx = px - this.x, dy = py - this.y;
    return dx*dx + dy*dy <= this.radius*this.radius;
  }

  onMouseDown(event) {
    if (this.isPointInside(event.canvasX, event.canvasY)) {
      this.isPressed = true;
      this.state     = !this.state;     // immediate visual feedback
      this.callback(this.state);        // notify listener
    }
  }

  onMouseUp(event) {
    this.isPressed = false;
    // no further action on release
  }

  render(ctx) {
    ctx.save();
    
    // fill circle
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
    ctx.fillStyle = this.state ? getRGBA('dark-cyan', 1) : getRGBA('dark-cyan', 0.2);
    ctx.shadowColor = 'transparent';
    if (this.state) {
        ctx.shadowColor = getRGBA('dark-cyan', 1);
        ctx.shadowBlur = 20;           
        ctx.shadowOffsetX = 0;            
        ctx.shadowOffsetY = 0;
    }
    // draw label
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.fillStyle    = getRGBA('white', 0.5);
    ctx.font         = `12px sans-serif`;
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(this.label, this.x, this.y + this.radius + 8);
    ctx.restore();
  }
}
