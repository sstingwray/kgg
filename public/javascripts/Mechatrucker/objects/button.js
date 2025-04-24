import emitter from '../modules/eventEmitter.js';
import Interactable from './interactable.js';
import { getRGBA } from '../utils/helpers.js';

export default class Button extends Interactable {
  constructor(options = {}) {    
    // Call the base Interactable constructor.
    super(options);
    
    // Set button-specific properties.
    this.x = options.x || 0;
    this.y = options.y || 0;
    this.radius = options.radius || 18;
    this.svg = options.svg;
    this.eventToListen = options.eventType;
    this.callback = options.onClick || (() => console.log('Button clicked'));
    this.isPressed = false;
    this.isActive = false;
    
    // Set a render order if desired.
    this.render.order = options.renderOrder || 100;

    emitter.subscribe(this.eventToListen, this.reactToState.bind(this))
  }

  /**
   * Determines if the given point (in canvas coordinates) is inside the button area.
   * @param {number} px - The x-coordinate (canvas relative) of the point.
   * @param {number} py - The y-coordinate (canvas relative) of the point.
   * @return {boolean} True if the point is inside the button bounds.
   */
  isPointInside(px, py) {
    return (px >= this.x - this.radius && px <= this.x + this.radius &&
            py >= this.y - this.radius && py <= this.y + this.radius);
  }

  /**
   * Handles mouse down events for the button.
   * @param {Object} event - The mouse event. Expect properties canvasX and canvasY as canvas-relative coordinates.
   */
  onMouseDown(event) {
    const rect = event.target.getBoundingClientRect();
    // Convert the global mouse coordinates to canvas-local coordinates.
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    if (this.isPointInside(mouseX, mouseY)) {
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

  /**
   * Renders the button on the given canvas context.
   * @param {CanvasRenderingContext2D} context - The 2D drawing context.
   */
  render(context) {
    context.save();
    const svgImg = this.svg; 
  
    // Circle
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    context.fillStyle = this.isPressed ? getRGBA('auburn', 0.5) : getRGBA('auburn', 1);
    context.fill();

    // Icon
    context.drawImage(svgImg, this.x - (this.radius / 2), this.y - (this.radius / 2), this.radius, this.radius);
    
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
