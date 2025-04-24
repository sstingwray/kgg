// js/gameObjects/gearShiftLever.js

import emitter from '../modules/eventEmitter.js';
import Interactable from './interactable.js';
import { getRGBA } from '../utils/helpers.js'

export default class GearShiftLever extends Interactable {
    
  /**
   * Creates a new GearShiftLever.
   * @param {Object} options - Configuration options.
   * @param {number} options.x - X coordinate for the lever channel container.
   * @param {number} options.y - Y coordinate for the lever channel container.
   * @param {number} options.width - Width of the container.
   * @param {number} options.channelTop - Y position (relative to the container) for top of channel.
   * @param {number} options.channelBottom - Y position for bottom of the channel.
   * @param {number} [options.handleRadius=15] - Radius of the round handle.
   */
  constructor(options = {}) {
    // Call the base Interactable constructor.
    super(options);
    // Where the lever channel sits inside the parent container.
    this.x = options.x || 0;
    this.y = options.y || 0;
    this.width = options.width || 100;
    
    // Define the vertical boundaries for the channel relative to this.y.
    this.channelTop = options.channelTop || (this.y + 20);
    this.channelBottom = options.channelBottom || (this.y + 220);
    
    // Define the gear positions: Reverse, Neutral, 1st, 2nd, 3rd.
    this.gearCount = 5;
    this.gearNames = ['Reverse', 'Neutral', '1st', '2nd', '3rd'];
    this.gearPositions = [];
    for (let i = 0; i < this.gearCount; i++) {
      // Evenly distribute positions between channelTop and channelBottom.
      let pos = this.channelTop + i * ((this.channelBottom - this.channelTop) / (this.gearCount - 1));
      this.gearPositions.push(pos);
      
    }
    
    // Start with the lever in Neutral (index 1).
    this.currentGearIndex = 1;
    this.handleY = this.gearPositions[this.currentGearIndex];
    this.handleRadius = options.handleRadius || 15;
    this.handleOffsetX = 0;
    
    // Flags
    this.isDragging = false;
    this.isHovered = false;
    // By default, assume the clutch is engaged; you must disengage it (via space bar later)
    // before the lever can be moved.
    this.clutch = false;

    emitter.subscribe('clutchToggle', this.handleClutchChange.bind(this))
  }

  handleClutchChange(newState) {
    this.clutch = newState;
  }
  
  /**
   * Checks for mouse down on the handle.
   * The lever can only be grabbed if the clutch is disengaged.
   * @param {MouseEvent} event 
   */

  onMouseDown(event) {
    // Get the canvas's position on the page.
    const rect = event.target.getBoundingClientRect();
    // Convert the global mouse coordinates to canvas-local coordinates.
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    // Calculate the center X of the lever channel.
    const centerX = this.x + this.width / 2;
    // Determine if the click occurred within the handle's circular area.
    const dx = mouseX - centerX;
    const dy = mouseY - this.handleY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance <= this.handleRadius) {
      if (!this.clutch) {
        console.log("Clutch is engaged; gear lever cannot be moved.");
        return;
      }
      this.isDragging = true;
      this.handleOffsetX = -5;
      // Store the starting mouse Y for tracking movement.
      this._startY = event.clientY;
    }
  }
  
  /**
   * Updates the handle's vertical position as it is being dragged.
   * @param {MouseEvent} event 
   */
  onMouseMove(event) {
    if (!this.isDragging) return;
    // Calculate movement delta.
    let deltaY = event.clientY - this._startY;
    // Update handleY and then reset _startY.
    let newY = this.handleY + deltaY;
    
    // Clamp newY to the channel boundaries.
    newY = Math.max(this.channelTop, Math.min(newY, this.channelBottom));
    
    this.handleY = newY;
    this._startY = event.clientY;
  }
  
  /**
   * When the mouse is released, snap the handle to the nearest gear position.
   * @param {MouseEvent} event 
   */
  onMouseUp(event) {
    if (!this.isDragging) return;
    this.isDragging = false;
    
    // Find the nearest gear position.
    let closestIndex = 0;
    let minDist = Math.abs(this.handleY - this.gearPositions[0]);
    for (let i = 1; i < this.gearPositions.length; i++) {
      let d = Math.abs(this.handleY - this.gearPositions[i]);
      if (d < minDist) {
        minDist = d;
        closestIndex = i;
      }
    }
    // Snap to the closest position.
    this.currentGearIndex = closestIndex;
    this.handleY = this.gearPositions[closestIndex];
    this.handleOffsetX = 0;
    emitter.emit('gearShift', this.gearNames[this.currentGearIndex]);
  }
  
  /**
   * Renders the gear shift lever on the given canvas context.
   * @param {CanvasRenderingContext2D} context 
   */
  render(context) {
    context.save();

    // Draw the lever channel as a vertical line in the center.
    const centerX = this.x + this.width / 2;
    context.strokeStyle = getRGBA('jet', 1);
    context.lineWidth = 8;
    context.beginPath();
    context.moveTo(centerX, this.channelTop);
    context.lineTo(centerX, this.channelBottom);
    context.stroke();
    
    // Draw markers and labels for each gear position.
    
    for (let i = 0; i < this.gearPositions.length; i++) {
        context.beginPath();
        context.arc(centerX, this.gearPositions[i], 8, 0, 2 * Math.PI);
        context.fillStyle = getRGBA('jet', 1);
        context.shadowColor = 'transparent';
        context.shadowBlur = 20;           
        context.shadowOffsetX = 0;            
        context.shadowOffsetY = 0;
        context.fill();
        if (this.currentGearIndex == i) {
            context.fillStyle = getRGBA('dark-cyan', 1);
            context.shadowColor = getRGBA('dark-cyan', 1);
            context.font = " bold 14px sans-serif";
        } else {
            context.fillStyle = getRGBA('dark-cyan', 0.5);
            context.font = "12px sans-serif";
        };
        context.fillText(this.gearNames[i], centerX + 24, this.gearPositions[i] + 4);
    }
    
    // Draw the lever handle.
    const handleX = centerX + this.handleOffsetX;
    context.fillStyle = getRGBA('gold', 1);
    context.shadowColor = 'transparent';
    context.beginPath();
    context.arc(handleX, this.handleY, this.handleRadius, 0, 2 * Math.PI);
    context.fill();
    
    

    // Draw the main pad of the cat paw (acting as the gear shift handle)
    // Define toe pad positions relative to the handle center
    const toePads = [
    { x: handleX - 10,  y: this.handleY - 2,    r: 2.5  },
    { x: handleX - 4,   y: this.handleY - 9,    r: 3     },
    { x: handleX + 4,   y: this.handleY - 9,    r: 3     },
    { x: handleX + 10,  y: this.handleY - 2,    r: 2.5  },
    { x: handleX - 4,   y: this.handleY + 6,    r: 5    },
    { x: handleX,       y: this.handleY + 4,    r: 6    },
    { x: handleX + 4,   y: this.handleY + 6,    r: 5    },
    ];

    // Draw each toe pad along with a small white detail
    toePads.forEach(pad => {
    context.beginPath();
    context.arc(pad.x, pad.y, pad.r, 0, Math.PI * 2);
    context.fillStyle = getRGBA('raisin-black', 1);
    context.fill();
    });

    context.restore();
  }
}
