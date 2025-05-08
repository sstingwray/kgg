// js/gameObjects/gauge.js
import Interactable from './interactable.js';
import { localToWorld, getRGBA } from '../utils/helpers.js';

export default class Gauge extends Interactable {
  constructor(options) {
    super();
    this.body         = options.body;
    this.localPos     = { x: options.x, y: options.y };
    this.radius       = options.radius;
    this.maxValue     = options.maxValue;
    this.divisions    = options.divisions;
    this.redZoneStart = options.redZoneStart;
    this.label        = options.label;
    this.pointerColor = options.pointerColor;
    this.value        = 0;
  }

  setValue(v) {
    this.value = Math.max(0, Math.min(v, this.maxValue));
  }

  getWorldCircle() {
    // top-left in world
    const worldTL = localToWorld(this.body, this.localPos);
    return { x: worldTL.x, y: worldTL.y, r: this.radius };
  }
  
  isPointInside(px, py) {
    const { x, y, r } = this.getWorldCircle();
    console.log({ x, y, r });
    console.log({ px, py });
        
    return px >= x - r && px <= x + r && py >= y - r && py <= y + r;
  }

  render(value, ctx) {
    this.value = Math.max(0, Math.min(value, this.maxValue));
    const { x, y, r } = this.getWorldCircle();
    // Angles for a 270° arc from 225° to -45°
    const startAngle = Math.PI;
    const endAngle   = Math.PI*2;
    const totalArc   = (startAngle - endAngle + 2*Math.PI) % (2*Math.PI); // = 1.5π

    ctx.save();
    ctx.translate(x, y);

    // ---- Draw background ----
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fillStyle = getRGBA('raisin-black', 1);
    ctx.fill();

    // ---- Draw outer stroke ----
    ctx.lineWidth   = 2;
    ctx.strokeStyle = getRGBA('davy-gray', 1);
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.stroke();

    // ---- Draw tick marks ----
    for (let i = 0; i <= this.divisions; i++) {
      const fraction = i / this.divisions;
      const angle = startAngle + fraction * totalArc;
      // determine color: red if beyond redZoneStart
      const isRed = fraction >= this.redZoneStart;
      ctx.strokeStyle = isRed ? getRGBA('auburn', 1) : getRGBA('white', 0.5);
      ctx.lineWidth = 3;
      // inner and outer radius for tick
      const r1 = r * 0.8;
      const r2 = r * 0.95;
      ctx.beginPath();
      ctx.moveTo(r1 * Math.cos(angle), r1 * Math.sin(angle));
      ctx.lineTo(r2 * Math.cos(angle), r2 * Math.sin(angle));
      ctx.stroke();
      
      // Draw label at each major division
      const labelRadius = r * 0.65;
      const labelValue  = Math.round(fraction * this.maxValue);
      const lx = labelRadius * Math.cos(angle);
      const ly = labelRadius * Math.sin(angle);
      ctx.fillStyle = getRGBA('white', 0.5);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `${labelRadius * 0.3}px sans-serif`;
      ctx.fillText(labelValue.toString(), lx, ly);
    }

    // ---- Draw pointer ----
    const valueFraction = value / this.maxValue;
    const pointerAngle  = startAngle + valueFraction * totalArc;
    ctx.strokeStyle = getRGBA(this.pointerColor, 1);
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, 3);
    ctx.lineTo(
      r * 0.7 * Math.cos(pointerAngle),
      r * 0.7 * Math.sin(pointerAngle)
    );
    ctx.stroke();

    // ---- Draw center hub ----
    ctx.fillStyle = getRGBA('jet', 1);
    ctx.beginPath();
    ctx.arc(0, 3, r * 0.2, 0, 2*Math.PI);
    ctx.fill();

    // ---- Draw label and value ----
    ctx.fillStyle = getRGBA('white', 0.5);
    ctx.textAlign = 'center';
    // label underneath
    if (this.label) {
      ctx.font = `${r * 0.3}px sans-serif`;
      ctx.fillText(this.label, 0, r * 0.6);
    }

    ctx.restore();
  }
}
