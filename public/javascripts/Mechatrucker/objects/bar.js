import Interactable from "./interactable.js";
import { clamp, getRGBA } from "../utils/helpers.js";
import emitter from "../modules/eventEmitter.js";

export default class Bar extends Interactable {
  constructor(options = {}) {
    super({
      id:            options.id,
      body:          options.body,
      x:             options.x,
      y:             options.y,
      shape:         options.shape,
      radius:        options.radius || null,
      width:         options.width || null,
      height:        options.height || null,
      event:         options.eventType,
      callback:      options.callback || (() => { console.log(`Fired placeholder event callback for ${ this.id }.`) }),
      onClick:       options.onClick  || (() => { console.log(`Fired placeholder onClick for ${ this.id }.`) }),
      value:         options.value,
      getValue:      options.getValue
    });

    this.color      = options.color;
    this.fillColor  = options.fillColor;
    this.fillStyle  = options.fillStyle;
    this.interval   = options.interval;
    this.segmHeight = options.segmHeight;
    this.min        = options.min;
    this.max        = options.max;
    this.angleDeg   = options.angle;
    this.value      = options.value;

    this.stepCount  = this.segmHeight ? Math.floor((this.max - this.min) / this.interval) : null;

    if (this.event) emitter.subscribe(this.event, this.callback.bind(this));
  }

  render(context) {
    this.update();
    const frac = (this.value - this.min) / (this.max - this.min);
    const angle = (this.angleDeg * Math.PI) / 180;

    context.save();
    context.translate(this.x, this.y);
    context.fillStyle = getRGBA(this.fillColor, 1);
    context.shadowColor = getRGBA(this.fillColor, 1);
    context.shadowBlur = 20;           
    context.shadowOffsetX = 0;            
    context.shadowOffsetY = 0;

    if (this.shape == 'rect') {
      context.rotate(angle);      
      if (this.fillStyle == 'linear') {
        if (this.color) {
          context.fillStyle = getRGBA(this.color, 1);
          context.fillRect(0, 0, this.width, -this.height);
          context.fillStyle = getRGBA(this.fillColor, 1);
        };
        context.fillRect(0, 0, this.width, -this.height * frac);
      } else {
        const stepH = this.segmHeight ? this.segmHeight : this.height / (this.stepCount * 2);
        const filled = Math.floor(frac * this.stepCount);
        if (this.color) {
          context.fillStyle = getRGBA(this.color, 1);
          context.fillRect(0, 0, this.width, -this.segmHeight*(this.stepCount*2 - 1));
          context.fillStyle = getRGBA(this.fillColor, 1);
        };
        for (let i = 0; i < filled; i++) {
          context.fillRect(0, -(i + 1)*stepH - i*stepH, this.width, stepH);
        }
      }
    } else if (this.shape == 'circle') {
      context.save();
      
      context.beginPath();
      context.arc(0, 0, this.radius, 0, 2*Math.PI);
      context.clip();
      context.fillStyle = getRGBA(this.fillColor, 1);

      if (this.fillStyle == 'linear') {
        context.fillRect(-this.radius, this.radius, this.radius * 2, -this.radius * 2 * frac);
      } else {
        const total = this.max - this.min;
        const steps      = Math.max(1, Math.floor(total / this.interval));
        const filled     = Math.floor(frac * steps);
        const fullH      = this.radius * 2;
        const bandH      = fullH / steps;
        const gap        = 2;
        
        for (let i = 0; i < filled; i++) {
          const bandTop = this.y + this.radius - (i + 1) * bandH;
          context.fillRect(this.x - this.radius, bandTop + gap/2, this.radius * 2, bandH - gap );
        }
      }
      context.restore();
      context.beginPath();
      context.arc(0, 0, this.radius, 0, Math.PI*2);
      context.lineWidth = this.radius * 0.2;
      context.strokeStyle = getRGBA(this.color, 1);
      context.stroke();
    }

    context.restore();
    //console.log(`[DEBUG] Rendering ${ this.id || 'unnamed Bar component' }`, this);
  }
}
