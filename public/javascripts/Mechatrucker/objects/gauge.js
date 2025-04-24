// js/gameObjects/gauge.js
import Interactable from './interactable.js';
import { getRGBA } from '../utils/helpers.js';

export default class Gauge extends Interactable {
  /**
   * Circular gauge with dynamic notches, a pointer, and a redline zone.
   *
   * @param {Object} options
   * @param {number} options.x             – center x of the gauge
   * @param {number} options.y             – center y of the gauge
   * @param {number} options.radius        – gauge radius
   * @param {number} options.maxValue      – maximum value (e.g. max RPM)
   * @param {number} [options.divisions=10]– number of notches around the arc
   * @param {number} [options.redZoneStart=0.8] – fraction (0–1) of maxValue where red zone begins
   * @param {string} [options.label='']    – optional gauge label underneath
   */
  constructor({
    x, y, radius, maxValue,
    divisions = 10,
    redZoneStart = 0.8,
    label = ''
  }) {
    super({});
    this.x            = x;
    this.y            = y;
    this.radius       = radius;
    this.maxValue     = maxValue;
    this.divisions    = divisions;
    this.redZoneStart = redZoneStart;
    this.label        = label;
    this.value        = 0;
  }

  /**
   * Update the gauge’s current value.
   * @param {number} v
   */
  setValue(v) {
    this.value = Math.max(0, Math.min(v, this.maxValue));
  }

  render(ctx) {
    const { x, y, radius, maxValue, divisions, redZoneStart, value } = this;
    // Angles for a 270° arc from 225° to -45°
    const startAngle = Math.PI;
    const endAngle   = Math.PI*2;
    const totalArc   = (startAngle - endAngle + 2*Math.PI) % (2*Math.PI); // = 1.5π

    ctx.save();
    ctx.translate(x, y);

    // ---- Draw background ----
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fillStyle = getRGBA('raisin-black', 1);
    ctx.fill();

    // ---- Draw outer stroke ----
    ctx.lineWidth   = 2;
    ctx.strokeStyle = getRGBA('davy-gray', 1);
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.stroke();

    // ---- Draw tick marks ----
    for (let i = 0; i <= divisions; i++) {
      const fraction = i / divisions;
      const angle = startAngle + fraction * totalArc;
      // determine color: red if beyond redZoneStart
      const isRed = fraction >= redZoneStart;
      ctx.strokeStyle = isRed ? getRGBA('auburn', 1) : getRGBA('white', 0.5);
      ctx.lineWidth = 3;
      // inner and outer radius for tick
      const r1 = radius * 0.8;
      const r2 = radius * 0.95;
      ctx.beginPath();
      ctx.moveTo(r1 * Math.cos(angle), r1 * Math.sin(angle));
      ctx.lineTo(r2 * Math.cos(angle), r2 * Math.sin(angle));
      ctx.stroke();
      
      // Draw label at each major division
      const labelRadius = radius * 0.65;
      const labelValue  = Math.round(fraction * maxValue);
      const lx = labelRadius * Math.cos(angle);
      const ly = labelRadius * Math.sin(angle);
      ctx.fillStyle = getRGBA('white', 0.5);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(labelValue.toString(), lx, ly);
    }

    // ---- Draw pointer ----
    const valueFraction = value / maxValue;
    const pointerAngle  = startAngle + valueFraction * totalArc;
    ctx.strokeStyle = getRGBA('gold', 1);
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, 3);
    ctx.lineTo(
      radius * 0.7 * Math.cos(pointerAngle),
      radius * 0.7 * Math.sin(pointerAngle)
    );
    ctx.stroke();

    // ---- Draw center hub ----
    ctx.fillStyle = '#222';
    ctx.beginPath();
    ctx.arc(0, 3, radius * 0.2, 0, 2*Math.PI);
    ctx.fill();

    // ---- Draw label and value ----
    ctx.fillStyle = getRGBA('white', 0.5);
    ctx.textAlign = 'center';
    // label underneath
    if (this.label) {
      ctx.font = `${radius * 0.2}px sans-serif`;
      ctx.fillText(this.label, 0, radius * 0.5);
    }

    ctx.restore();
  }
}
