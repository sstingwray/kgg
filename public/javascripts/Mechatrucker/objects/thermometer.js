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
    this.heat      = options.heat;

    // subscribe to your heat updates
    emitter.subscribe('heatUpdate', this.setHeat.bind(this));
  }

  setHeat(value) {
    this.heat = value;
  }

  render(ctx) {
    const base = localToWorld(this.body, this.localPos);
    const angle = this.body.angle;

    const frac = (this.heat - this.min) / (this.max - this.min);
    ctx.save();
    ctx.translate(base.x, base.y);
    ctx.rotate(angle);

    ctx.fillStyle = getRGBA('dark-cyan', 0);
    ctx.fillRect(0, 0, this.width, this.height);

    const fillH = this.height * 0.66 * frac;
    ctx.fillStyle = getRGBA('auburn', 1);
    ctx.fillRect(this.width / 2 - 2, this.height - 28, 4, -fillH);

    ctx.restore();
  }
}
