import Interactable from './interactable.js';
import emitter from '../modules/eventEmitter.js';
import { getRGBA, localToWorld } from '../utils/helpers.js';

export default class Monitor extends Interactable {
  constructor(options = {}) {
    super();
    this.body        = options.body;
    this.localPos    = { x: options.x, y: options.y };
    this.width       = options.width;
    this.height      = options.height;
    this.debug       = options.debug;
    this.orientation = options.orientation;
    this.canvas      = {};
  }

  render(ctx, values) {
    const base = localToWorld(this.body, this.localPos);
    const angle = this.body.angle;
    const orientAdjustX = this.orientation == 'left' ? 0 : -18;

    ctx.save();
    ctx.translate(base.x + orientAdjustX, base.y);
    ctx.rotate(angle);
    ctx.fillStyle = getRGBA('dark-cyan', 0.1);
    ctx.fillRect(0, 0, this.width, this.height);    
    
    values.forEach((v,i) => {
        if (!this.debug && v.debug) return;
        ctx.fillStyle = getRGBA('white', 0.8);
        if (v.pct) ctx.fillText(`${ v.label }: ${ v.pct }`, 36, 12*2*i+24+4);
        else ctx.fillText(`${ v.label }`, 36, 12*2*i+24+4);
        
    });
    
    ctx.restore();
  }
}
