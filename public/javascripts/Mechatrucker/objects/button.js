import emitter from '../modules/eventEmitter.js';
import Interactable from './interactable.js';
import { localToWorld, getRGBA } from '../utils/helpers.js';

export default class Button extends Interactable {
  constructor(options = {}) {    
    super();
    this.body      = options.body;
    this.localPos  = { x: options.x, y: options.y };
    this.radius    = options.radius;
    this.svg       = options.svg;
    this.event     = options.eventType;
    this.callback  = options.onClick;
    this.isPressed = false;
    this.isActive  = false;

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
    const svgImg = this.svg; 
    context.save();
    // Circle
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI * 2);
    context.fillStyle = this.isPressed ? getRGBA('auburn', 0.5) : getRGBA('auburn', 1);
    context.fill();

    // Icon
    context.drawImage(svgImg, x - (r / 2), y - (r / 2), r, r);
    
    // On-light
    if (this.isActive) {
      context.shadowColor = getRGBA('dark-cyan', 1);
      context.shadowBlur = 4;           
      context.shadowOffsetX = 0;            
      context.shadowOffsetY = 0;
      context.lineWidth = 2;
      context.strokeStyle = getRGBA('dark-cyan', 1);
      context.stroke();
    };


    context.restore();
  }
}
