// js/gameObjects/panelThermometer.js
import Interactable from './interactable.js';
import emitter from '../modules/eventEmitter.js';
import { getRGBA, localToWorld } from '../utils/helpers.js';

export default class Thermometer extends Interactable {
  constructor(options = {}) {
    super();
    this.body      = options.body;
    this.localPos  = { x: options.x, y: options.y };
    this.width     = options.width;
    this.height    = options.height;
    this.min       = options.min;
    this.max       = options.max;
    this.heat      = options.min;

    // subscribe to your heat updates
    emitter.subscribe('heatUpdate', this.setHeat.bind(this));
  }

  setHeat(value) {
    this.heat = Math.max(this.min, Math.min(this.max, value));
  }

  render(ctx) {
    // compute world-space base point and rotation
    const base = localToWorld(this.body, this.localPos);
    const angle = this.body.angle;

    // fraction of fill
    const frac = (this.heat - this.min) / (this.max - this.min);

    ctx.save();
    // move to base and rotate
    ctx.translate(base.x, base.y);
    ctx.rotate(angle);

    // draw tube outline
    ctx.strokeStyle = getRGBA('jet', 1);
    ctx.lineWidth   = 2;
    ctx.strokeRect(0, -this.height, this.width, this.height);

    // draw filled “mercury”
    const fillH = this.height * frac;
    ctx.fillStyle = getRGBA(this.fillKey, 1);
    ctx.fillRect(0, -fillH, this.width, fillH);

    // optional: draw tick marks at 0%, 50%, 100%
    ctx.strokeStyle = getRGBA('davy\'s gray', 1);
    ctx.lineWidth   = 1;
    [0, 0.5, 1].forEach(f => {
      const y = -this.height * f;
      ctx.beginPath();
      ctx.moveTo(-4, y);
      ctx.lineTo(0, y);
      ctx.stroke();
    });

    ctx.restore();
  }
}
