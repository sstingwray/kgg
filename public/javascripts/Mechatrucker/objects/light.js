import emitter from '../modules/eventEmitter.js';
import Interactable from './interactable.js';
import { localToWorld, getRGBA, clamp } from '../utils/helpers.js';

export default class Light extends Interactable {
  constructor(options = {}) {
    super();
    this.body        = options.body;
    this.localPos    = { x: options.x, y: options.y };
    this.radius      = options.radius;
    this.color       = options.color;
    this.label       = options.label;
    this.svg         = options.svg;
    this.progressive = options.progressive;
    this.maxValue    = options.maxValue;
    this.value       = 0.01;
    this.state       = options.state;
    this.event       = options.eventType;
    this.callback    = options.onToggle || (() => {});
    this.isPressed   = false;
    

    emitter.subscribe(this.event, this.reactToState.bind(this))
  }

  getWorldCircle() {
    // top-left in world
    const worldTL = localToWorld(this.body, this.localPos);
    return { x: worldTL.x, y: worldTL.y, r: this.radius };
  }

  isPointInside(px, py) {
    const { x, y, r } = this.getWorldCircle();
        
    return px >= x - r && px <= x + r && py >= y - r && py <= y + r;
  }

  onMouseDown(event) {
    const x = event.offsetX, y = event.offsetY;

    if (this.isPointInside(x, y)) {
      this.isPressed = true;
      console.log(`[DEBUG] ${ this.label } light is clicked`);
      
    }
  }

  reactToState(event) {
    if (this.progressive) this.value = clamp(event / this.maxValue, 0.01, 1);
    else this.state = event;
    
  }

  render(ctx) {
    const { x, y, r } = this.getWorldCircle();
    ctx.save();
    
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI*2);
    ctx.fillStyle = getRGBA(this.color, 0.2);
    if (this.progressive) {
      ctx.fillStyle = getRGBA(this.color, this.value);
      ctx.shadowColor = getRGBA(this.color, this.value);
      ctx.shadowBlur = 40;           
      ctx.shadowOffsetX = 0;            
      ctx.shadowOffsetY = 0;
    } else {
      ctx.fillStyle = this.state ? getRGBA(this.color, 1) : null;
      ctx.shadowColor = 'transparent';
      if (this.state) {
          ctx.shadowColor = getRGBA(this.color, 1);
          ctx.shadowBlur = 20;           
          ctx.shadowOffsetX = 0;            
          ctx.shadowOffsetY = 0;
      }
    };
    ctx.fill();
    ctx.shadowColor = 'transparent';
    if (this.label) {
      ctx.fillStyle    = getRGBA('white', 0.5);
      ctx.font         = `12px sans-serif`;
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(this.label, x, y + r + 8);
    };
    if (this.svg) {
      const svgScale = 1.4;
      ctx.drawImage(this.svg, x - r*svgScale / 2, y - r*svgScale / 2, r*svgScale, r*svgScale);
    }
    
    ctx.restore();
  }
}
