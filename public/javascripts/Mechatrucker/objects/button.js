import emitter from '../modules/eventEmitter.js';
import Interactable from './interactable.js';
import { localToWorld, getRGBA } from '../utils/helpers.js';

export default class Button extends Interactable {
  constructor(options = {}) {
    super();
    this.body      = options.body;
    this.localPos  = { x: options.x, y: options.y };
    this.radius    = options.radius;
    this.color     = options.color;
    this.highlight = options.highlight;
    this.svg       = options.svg;
    this.event     = options.eventType;
    this.callback  = options.onClick;
    this.isPressed = false;
    this.isActive  = false;

    emitter.subscribe(this.event, this.reactToState.bind(this))
  }

  getWorldCircle() {
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
      setTimeout(() => {
        this.isPressed = false;
      }, 500);
      this.callback();
    }
  }

  reactToState(event) {
    setTimeout(() => {
      this.isActive = event;
    }, 200);
  }

  render(context) {
    const { x, y, r } = this.getWorldCircle();
    context.save();
    // Circle
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI * 2);
    context.fillStyle = this.isPressed ? getRGBA(this.color, 0.2) : getRGBA(this.color, 0.6);
    context.fill();

    if (this.svg) context.drawImage(this.svg, x - (r / 2), y - (r / 2), r, r);
    
    // On-light
    if (this.isActive) {
      context.shadowColor = getRGBA(this.highlight, 1);
      context.shadowBlur = 4;           
      context.shadowOffsetX = 0;            
      context.shadowOffsetY = 0;
      context.lineWidth = 2;
      context.strokeStyle = getRGBA(this.highlight, 1);
      context.stroke();
    };


    context.restore();
  }
}
