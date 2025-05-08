import Interactable from './interactable.js';
import { localToWorld } from '../utils/helpers.js';

export default class Dial extends Interactable {
  constructor(options) {
    super();
    this.body       = options.body;
    this.localPos   = { x: options.x, y: options.y };
    this.radius     = options.radius;
    this.minRad     = this.deg2rad(options.minAngle);
    this.maxRad     = this.deg2rad(options.maxAngle);
    this.divisions  = options.divisions;
    this.valueRad   = this.minRad;
    this.dragging   = false;
    this._offset    = 0;
  }

  deg2rad(deg) {
    return (deg * Math.PI) / 180;
  }

  rad2deg(rad) {
    return (rad * 180) / Math.PI;
  }

  get center() {
    return localToWorld(this.body, this.localPos);
  }

  /** Mouse down: start drag if pointer in dial circle */
  onMouseDown(event) {
    const { x, y } = event.offsetX != null
      ? { x: event.offsetX, y: event.offsetY }
      : { x: event.clientX, y: event.clientY };
    const c = this.center;
    const dx = x - c.x, dy = y - c.y;
    if (dx*dx + dy*dy <= this.radius * this.radius) {
      this.dragging = true;
      // compute pointer angle
      const ang = Math.atan2(dy, dx);
      // store offset: difference between pointer and current value
      this._offset = ang - this.valueRad;
    }
  }

  /** Mouse move: update angle if dragging */
  onMouseMove(event) {
    if (!this.dragging) return;
    const { x, y } = event.offsetX != null
      ? { x: event.offsetX, y: event.offsetY }
      : { x: event.clientX, y: event.clientY };
    const c = this.center;
    const dx = x - c.x, dy = y - c.y;
    let ang = Math.atan2(dy, dx) - this._offset;
    // normalize to [–PI, PI]
    ang = ((ang + Math.PI*3) % (Math.PI*2)) - Math.PI;
    // clamp between minRad and maxRad
    if (ang < this.minRad) ang = this.minRad;
    if (ang > this.maxRad) ang = this.maxRad;
    this.valueRad = ang;
  }

  /** Mouse up: end drag */
  onMouseUp() {
    this.dragging = false;
  }

  /** Render the dial */
  render(ctx) {
    const c = this.center;
    ctx.save();
    // draw dial background
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(c.x, c.y, this.radius, 0, Math.PI*2);
    ctx.fill();

    // draw notches
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 2;
    for (let i = 0; i < this.divisions; i++) {
      const frac = i / this.divisions;
      const ang = this.minRad + frac * (this.maxRad - this.minRad);
      const x1 = c.x + Math.cos(ang) * (this.radius * 0.9);
      const y1 = c.y + Math.sin(ang) * (this.radius * 0.9);
      const x2 = c.x + Math.cos(ang) * (this.radius * 0.75);
      const y2 = c.y + Math.sin(ang) * (this.radius * 0.75);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    // draw pointer dot
    const px = c.x + Math.cos(this.valueRad) * (this.radius * 0.6);
    const py = c.y + Math.sin(this.valueRad) * (this.radius * 0.6);
    ctx.fillStyle = this.dragging ? '#0f0' : '#0af';
    ctx.beginPath();
    ctx.arc(px, py, this.radius * 0.1, 0, Math.PI*2);
    ctx.fill();

    ctx.restore();
  }
}
