import emitter from "../modules/eventEmitter.js";
import Matter from '../modules/matter.esm.js';
import { getRGBA } from "../utils/helpers.js";

export default class Interactable {

  constructor(options = {}) {
    this.id        = options.id;
    this.body      = options.body;
    this.localPos  = { x: options.x, y: options.y };
    this.shape     = options.shape;
    this.radius    = options.radius || null;
    this.width     = options.width || null;
    this.height    = options.height || null;
    this.event     = options.eventType;
    this.callback  = options.callback || (() => { console.log(`Fired placeholder event callback for ${ this.id }.`) });
    this.onClick   = options.onClick  || (() => { console.log(`Fired placeholder onClick for ${ this.id }.`) });
    this.value     = options.value;
    this.getValue  = options.getValue;
    this.x         = 0;
    this.y         = 0;

    if (this.event) emitter.subscribe(this.event, this.callback.bind(this));
  }
    
  get center() {
    if (!this.body) return { x: this.x, y: this.y };
    const rotated  = Matter.Vector.rotate(this.localPos, this.body.angle);
    return Matter.Vector.add(rotated, this.body.position);
  }

  update() {
    const c = this.center;
    this.x = c.x;
    this.y = c.y;
      
    if (this.getValue) this.value = this.getValue();
  }

  toLocal(event) {
    const x = event.offsetX ?? event.clientX;
    const y = event.offsetY ?? event.clientY;
    const c = this.center;
    const v = Matter.Vector.create(x - c.x, y - c.y);
    return this.body ? Matter.Vector.rotate(v, -this.body.angle) : v;
  }

  isPointInCircle(event, radius) {
    const local = this.toLocal(event);
    return local.x**2 + local.y**2 <= radius**2;
  }

  isPointInRect(event, width, height) {
    const local = this.toLocal(event);
    return local.x >= 0 && local.x <= width
          && local.y >= 0 && local.y <= height;
  }

  static deg2rad(d) { return d*Math.PI/180; }
  static rad2deg(r) { return r*180/Math.PI; }
  static normDeg(rad) {
    let d = rad*180/Math.PI;
    if (d<0) d+=360;
    return d;
  }
  static deltaDeg(a,b) {
    let d = a - b;
    if (d>180)  d-=360;
    if (d<-180) d+=360;
    return d;
  }
  
  onMouseDown(event) {
    let isClicked = false;
    if (this.shape == 'circle') isClicked = this.isPointInCircle(event, this.radius);
    else isClicked = this.isPointInRect(event, this.width, this.height);

    if (isClicked) this.onClick();
  }

  render(context) {
    context.save();
      
    context.fillStyle = getRGBA('auburn', 0.5);
    if (this.shape == 'circle') {
      context.arc(this.x, this.y, this.radius, 0, Math.PI*2);
      context.fill();
    } else context.fillRect(this.x, this.y, this.width, this.height);

    context.restore();
  }
}
  