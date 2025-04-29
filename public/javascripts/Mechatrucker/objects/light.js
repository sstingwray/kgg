import emitter from '../modules/eventEmitter.js';
import Interactable from './interactable.js';
import { localToWorld, getRGBA } from '../utils/helpers.js';

export default class Light extends Interactable {
  constructor(options = {}) {
    super();
    this.body      = options.body;
    this.localPos  = { x: options.x, y: options.y };
    this.radius    = options.radius;
    this.label     = options.label;
    this.state     = options.state;
    this.event     = options.eventType;
    this.callback  = options.onToggle || (() => {});
    this.isPressed = false;

    emitter.subscribe(this.event, this.reactToState.bind(this))
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

  onMouseDown(event) {
    if (this.isPointInside(event.offsetX, event.offsetY)) {
      this.isPressed = true;
      console.log(`[DEBUG] ${ this.label } light is clicked`);
      
    }
  }

  reactToState(event) {
    this.state = event;
  }

  render(ctx) {
    const { x, y, r } = this.getWorldCircle();
    ctx.save();
    
    // fill circle
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI*2);
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
    ctx.fillText(this.label, x, y + r + 8);
    ctx.restore();
  }
}
