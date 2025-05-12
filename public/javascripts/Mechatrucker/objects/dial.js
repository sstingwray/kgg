// js/gameObjects/panelDial.js
import Interactable from './interactable.js';
import { getRGBA, localToWorld } from '../utils/helpers.js';

const Vector = Matter.Vector;

export default class PanelDial extends Interactable {
  constructor(options = {}) {
    super();
    this.body        = options.body;
    this.localPos    = { x: options.x, y: options.y };
    this.radius      = options.radius;
    this.color       = options.color;
    this.highlight   = options.highlight;
    this.svg         = options.svg;
    this.event       = options.eventType;
    this.callback    = options.onChange;
    this.teethCount  = options.teethCount;
    this.toothWidth  = options.toothWidth;
    this.toothLength = options.toothLength;
    this.minDeg      = options.minAngle;
    this.maxDeg      = options.maxAngle;
    this.notches     = options.notches;

    this.valueDeg    = options.minAngle;
    this.innerRadius = 0.8;
    this.dragging    = false;
    this.prevRawDeg  = 0;
  }

  get center() {
    return localToWorld(this.body, this.localPos);
  }

  _toLocal(event) {
    const x = event.offsetX ?? event.clientX;
    const y = event.offsetY ?? event.clientY;
    const c = this.center;
    const dx = x - c.x, dy = y - c.y;
    return Vector.rotate(Vector.create(dx, dy), -this.body.angle);
  }

  onMouseDown(event) {
    const local = this._toLocal(event);
    const dist  = Math.hypot(local.x, local.y);
    if (dist < 0 || dist > (this.radius + this.toothLength) * 1) return;

    this.dragging = true;
    // initialize raw angle
    let raw = Math.atan2(local.y, local.x) * 180/Math.PI;
    if (raw < 0) raw += 360;
    this.prevRawDeg = raw;
  }

  onMouseMove(event) {
    if (!this.dragging) return;
    const local = this._toLocal(event);
    let raw = Math.atan2(local.y, local.x) * 180/Math.PI;
    if (raw < 0) raw += 360;

    // compute smallest delta around the circle
    let d = raw - this.prevRawDeg;
    if (d > 180)  d -= 360;
    if (d < -180) d += 360;

    // accumulate and clamp
    let v = this.valueDeg + d;
    if (v < this.minDeg) v = this.minDeg;
    if (v > this.maxDeg) v = this.maxDeg;
    this.valueDeg = v;

    this.prevRawDeg = raw;

    if (this.callback) this.callback(this.valueDeg / this.maxDeg);
  }

  onMouseUp() {
    this.dragging = false;
  }

  render(ctx) {
    const c = this.center;
    ctx.save();
    ctx.translate(c.x, c.y);

    for (let i = 0; i < this.notches; i++) {
      const deg  = this.minDeg + (i / this.notches) * (this.maxDeg - this.minDeg);
      const ang  = deg * Math.PI/180;
      const x1   = Math.cos(ang) * (this.radius + 8);
      const y1   = Math.sin(ang) * (this.radius + 8);
      const x2   = Math.cos(ang) * (this.radius + 16);
      const y2   = Math.sin(ang) * (this.radius + 16);
      ctx.lineWidth   = 2;
      ctx.strokeStyle = getRGBA('cosmic-latte', 1);
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.restore();
    }

    const arrowRadius = this.radius + 20;
    const endRad      = Math.PI / 2;
    const headLen     = 8;
    const headAngle   = Math.PI / 4;

    ctx.strokeStyle = getRGBA('cosmic-latte', 1);
    ctx.lineWidth   = 1.2;
    ctx.lineCap     = 'round';
    ctx.save();
    ctx.beginPath();
    ctx.arc(0, 0, arrowRadius, this.minDeg, endRad, false);
    ctx.stroke();

    const tangent = endRad - Math.PI / 2;

    const tipX = Math.cos(endRad) * arrowRadius;
    const tipY = Math.sin(endRad) * arrowRadius;

    const leftX  = tipX + Math.cos(tangent - headAngle) * (headLen);
    const leftY  = tipY + Math.sin(tangent - headAngle) * (headLen);
    const rightX = tipX + Math.cos(tangent + headAngle) * (headLen);
    const rightY = tipY + Math.sin(tangent + headAngle) * (headLen);

    ctx.beginPath();
    ctx.moveTo(leftX, leftY);
    ctx.lineTo(tipX, tipY);
    ctx.lineTo(rightX, rightY);
    ctx.stroke();
    ctx.restore();

    ctx.rotate(this.valueDeg * Math.PI/180);

    ctx.fillStyle = getRGBA(this.color, 1);
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = getRGBA(this.highlight, 1);
    ctx.beginPath();
    ctx.arc(0, 0, this.radius * this.innerRadius, 0, 2 * Math.PI);
    ctx.fill();
    if (this.svg) ctx.drawImage(this.svg, 0 - (this.radius / 2), 0 - (this.radius / 2), this.radius, this.radius);

    const step = (2 * Math.PI) / this.teethCount;
    const innerR = this.radius * this.innerRadius;
    for (let i = 0; i < this.teethCount; i++) {
      const mid = i * step;
      const a1  = mid - this.toothWidth / 2;
      const a2  = mid + this.toothWidth / 2;
      ctx.fillStyle = (i === 0) ? getRGBA(this.highlight, 1) : getRGBA(this.color, 1);
      ctx.save();
      ctx.rotate(i * step);
      ctx.fillRect(innerR - 1, -this.toothWidth / 2, (i === 0) ? this.toothLength*1.2 + 2 : this.toothLength + 2, this.toothWidth);
      ctx.restore();
    }

    ctx.restore();
  }
  
}
