import Interactable from './interactable.js';
import { getRGBA } from '../utils/helpers.js';

export default class Button extends Interactable {
  constructor(options = {}) {
    console.log(options);
    
    // Call the base Interactable constructor.
    super(options);
    // Set button-specific properties.
    this.x = options.x || 0;
    this.y = options.y || 0;
    this.radius = options.radius || 18;
    this.svg = options.svg;
    this.callback = options.onClick || (() => console.log('Button clicked'));
    this.isPressed = false;
    
    // Set a render order if desired.
    this.render.order = options.renderOrder || 100;
  }

  /**
   * Determines if the given point (in canvas coordinates) is inside the button area.
   * @param {number} px - The x-coordinate (canvas relative) of the point.
   * @param {number} py - The y-coordinate (canvas relative) of the point.
   * @return {boolean} True if the point is inside the button bounds.
   */
  isPointInside(px, py) {
    console.log('px', px, 'py', py);
    console.log('x', this.x, 'y', this.y);
    
    
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
    console.log(this.isPointInside(mouseX, mouseY));
    
    
    if (this.isPointInside(mouseX, mouseY)) {
      this.callback();
      this.isPressed = true;
    }
  }

  /**
   * Handles mouse up events for the button.
   * @param {Object} event - The mouse event.
   */
  onMouseUp(event) {
    // Only trigger click if the button was pressed and the mouse is still within its bounds.
    this.isPressed = false;
  }

  /**
   * Renders the button on the given canvas context.
   * @param {CanvasRenderingContext2D} context - The 2D drawing context.
   */
  render(context) {
    context.save();
    const svgImg = this.svg;    

    // Draw the circle.
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    context.fillStyle = '#FFB6C1';  // Light pink fill.
    context.fill();
    context.lineWidth = 2;
    context.strokeStyle = '#DDA0DD'; // Light purple stroke.
    context.stroke();

    // Determine the size for the SVG asset.
    // Here, we'll make the SVG cover 80% of the circle's diameter.
    const desiredSize = (this.radius * 2) * 0.8;

    // Calculate top-left coordinates to center the SVG within the circle.
    const imgX = this.x - (desiredSize / 2);
    const imgY = this.y - (desiredSize / 2);

    // Draw the inline SVG image inside the circle.
    context.drawImage(svgImg, imgX, imgY, desiredSize, desiredSize);

    context.restore();
  }
}
