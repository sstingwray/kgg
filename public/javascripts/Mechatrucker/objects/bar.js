import { clamp } from "../utils/helpers";

export default class Bar {
  /**
   * @param {Object} opts
   * @param {number} opts.x           – center x (for circle) or top-left x (for rect)
   * @param {number} opts.y           – center y or top-left y
   * @param {number} opts.width       – bar width (for rect)
   * @param {number} opts.height      – bar height (for rect)
   * @param {number} opts.radius      – outer radius (for circle)
   * @param {string} opts.color       – fill/stroke color (any canvas CSS color)
   * @param {'rect'|'circle'} opts.shape
   * @param {'linear'|'discrete'} opts.fillStyle
   * @param {number} opts.interval    – discrete step size (in same units as value)
   * @param {number} [opts.min=0]
   * @param {number} [opts.max=1]
   * @param {number} [opts.angle=0]   – rotation in degrees
   */
  constructor(options = {}) {
    this.body      = options.body;
    this.localPos  = { x: options.x, y: options.y };
    this.width     = options.width;
    this.height    = options.height;
    this.radius    = options.radius;
    this.color     = options.color;
    this.shape     = options.shape;
    this.fillStyle = options.fillStyle;
    this.interval  = options.interval;
    this.min       = options.min;
    this.max       = options.max;
    this.angleDeg  = options.angle;
    this.event     = options.eventType;
    this.value     = options.value;

    if (this.event) emitter.subscribe(this.event, this.reactToState.bind(this));
  }

  get center() { return localToWorld(this.body, this.localPos) }

  reactToState(value) {
    this.value = clamp(value, this.min, this.max);
  }

  render(ctx) {
    const frac = (this.value - this.min) / (this.max - this.min);
    const angle = (this.angleDeg * Math.PI) / 180;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(angle);

    ctx.fillStyle   = this.color;
    ctx.strokeStyle = this.color;

    if (this.shape === 'rect') {
      // draw background
      ctx.globalAlpha = 0.2;
      ctx.fillRect(0, 0, this.width, this.height);
      ctx.globalAlpha = 1;

      if (this.fillStyle === 'linear') {
        // smooth fill
        ctx.fillRect(0, 0, this.width * frac, this.height);
      } else {
        // discrete fill
        const total = this.max - this.min;
        const steps = Math.floor(total / this.interval);
        const stepW = this.width / steps;
        const filled = Math.floor(frac * steps);
        for (let i = 0; i < filled; i++) {
          ctx.fillRect(i * stepW, 0, stepW - 1, this.height);
        }
      }

    } else if (this.shape === 'circle') {
      // background ring
      ctx.lineWidth = this.radius * 0.1;
      ctx.beginPath();
      ctx.arc(0, 0, this.radius, 0, 2*Math.PI);
      ctx.stroke();

      if (this.fillStyle === 'linear') {
        // smooth arc
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, 2*Math.PI * frac);
        ctx.stroke();
      } else {
        // discrete arc segments
        const total = this.max - this.min;
        const steps = Math.floor(total / this.interval);
        const segAng = (2*Math.PI) / steps;
        const filled = Math.floor(frac * steps);
        for (let i = 0; i < filled; i++) {
          ctx.beginPath();
          ctx.arc(0, 0, this.radius, i*segAng, (i+1)*segAng);
          ctx.stroke();
        }
      }
    }

    ctx.restore();
  }
}
