// js/gameObjects/interactable.js

export default class Interactable {
    /**
     * Base definition for an interactable object.
     * @param {Object} options - Configuration options.
     * @param {number} options.x - The x-coordinate of the interactable.
     * @param {number} options.y - The y-coordinate of the interactable.
     * @param {number} options.width - The width of the interactable.
     * @param {number} options.height - The height of the interactable.
     * @param {number} [options.threshold=10] - Movement threshold for drag/detection.
     */
    constructor(options = {}) {
      this.x = options.x || 0;
      this.y = options.y || 0;
      this.width = options.width || 50;
      this.height = options.height || 50;
      this.threshold = options.threshold || 10; // threshold for movement-based interactions
  
      // State properties: "idle", "hovered", "pressed", etc.
      this.state = 'idle';
      this.active = false; // is the object currently being interacted with?
  
      // Store the initial mouse/touch coordinates when interaction begins
      this._startX = 0;
      this._startY = 0;
    }
  
    /**
     * Check if a point (usually mouse coordinates) is inside the interactable's bounds.
     * @param {number} px - The x-coordinate of the point.
     * @param {number} py - The y-coordinate of the point.
     * @return {boolean} True if the point is inside, false otherwise.
     */
    isPointInside(px, py) {
      return (
        px >= this.x &&
        px <= this.x + this.width &&
        py >= this.y &&
        py <= this.y + this.height
      );
    }
  
    /**
     * Handler for mouse down events.
     * @param {Object} event - The mouse event object.
     */
    onMouseDown(event) {
      if (this.isPointInside(event.clientX, event.clientY)) {
        this.active = true;
        this.state = 'pressed';
        this._startX = event.clientX;
        this._startY = event.clientY;
        // Custom behavior can be added here or in subclasses.
        console.log('Interactable activated');
      }
    }
  
    /**
     * Handler for mouse move events.
     * Only acts if the interactable is in an active state.
     * @param {Object} event - The mouse event object.
     */
    onMouseMove(event) {
      if (!this.active) return;
      const dx = event.clientX - this._startX;
      const dy = event.clientY - this._startY;
      if (Math.abs(dx) > this.threshold || Math.abs(dy) > this.threshold) {
        // Invoke custom drag behavior; override onDrag in subclasses for specific interactions.
        this.onDrag({ dx, dy });
      }
    }
  
    /**
     * Called when a dragging motion is detected.
     * Override this method in subclasses for custom drag behavior (e.g. for levers or sticks).
     * @param {Object} delta - The delta of movement.
     * @param {number} delta.dx - Change in x.
     * @param {number} delta.dy - Change in y.
     */
    onDrag(delta) {
      // Base behavior: log the delta movement.
      // Subclasses can update position/state here.
      console.log('Dragging with delta:', delta);
    }
  
    /**
     * Handler for mouse up events.
     * Ends the interaction and resets state.
     * @param {Object} event - The mouse event object.
     */
    onMouseUp(event) {
      if (this.active) {
        this.active = false;
        // Optionally determine if the action is valid or if the control should revert.
        this.onRelease();
        this.state = 'idle';
        console.log('Interaction ended');
      }
    }
  
    /**
     * Called when the interaction is finished.
     * Override for custom release behavior (e.g. snapping back to original position).
     */
    onRelease() {
      // Base functionality is empty. Subclasses should override this.
      console.log('Released');
    }
  
    /**
     * Updates the state of the interactable.
     * @param {number} deltaTime - Time elapsed since last update.
     */
    update(deltaTime) {
      // Base update logic can be placed here.
      // For example: automatic returning to original state if not fully engaged.
    }
  
    /**
     * Renders the interactable on the provided canvas context.
     * @param {CanvasRenderingContext2D} context - The drawing context.
     */
    render(context) {
      context.save();
  
      // Change appearance based on state (for example purposes)
      switch (this.state) {
        case 'pressed':
          context.fillStyle = '#ccc';
          break;
        case 'hovered':
          context.fillStyle = '#bbb';
          break;
        default:
          context.fillStyle = '#999';
      }
  
      // Draw a simple rectangle as the interactable's visual representation.
      context.fillRect(this.x, this.y, this.width, this.height);
      context.restore();
    }
  }
  