// experimental-components.js

// === BASE COMPONENT ===
class BaseComponent {
  constructor() {
    this.wrapper = document.createElement('div');
    this.wrapper.className = 'control-wrapper';
  }

  get element() {
    return this.wrapper;
  }
}

// === TOGGLE BUTTON COMPONENT ===
class ToggleButtonComponent extends BaseComponent {
  constructor(label, initial = false, onToggle = () => {}) {
    super();
    this.label = label;
    this.state = initial;
    this.onToggle = onToggle;

    this.button = document.createElement('button');
    this.button.className = 'control-button';
    this.button.textContent = label;

    this.button.addEventListener('click', () => {
      this.state = !this.state;
      this.updateVisual();
      this.onToggle(this.state);
    });

    this.wrapper.appendChild(this.button);
    this.updateVisual();
  }

  updateVisual() {
    this.button.classList.toggle('toggled', this.state);
    this.button.textContent = this.label;
  }

  setValue(val) {
    const clamped = Boolean(val);
    if (this.state !== clamped) {
      this.state = clamped;
      this.updateVisual();
      this.onToggle(this.state);
    }
  }

  getValue() {
    return this.state;
  }
}

// === BUTTON COMPONENT ===
class ButtonComponent extends BaseComponent {
  constructor(label, onClick = () => {}) {
    super();
    this.button = document.createElement('button');
    this.button.className = 'control-button';
    this.button.textContent = label;
    this.button.addEventListener('click', () => onClick());
    this.wrapper.appendChild(this.button);
  }

  setLabel(text) {
    this.button.textContent = text;
  }

  click() {
    this.button.click();
  }
}

// === GEAR KNOB COMPONENT ===
class GearKnobComponent extends BaseComponent {
  constructor({
    labels = ["Reverse", "Neutral", "1st", "2nd", "3rd"],
    initial = 1,
    onChange = () => {}
  } = {}) {
    super();
    this.labels = labels;
    this.index = initial;
    this.isDisabled = false;
    this.onChange = onChange;

    const label = document.createElement('label');
    label.textContent = "Gear";
    this.wrapper.appendChild(label);

    this.track = document.createElement('div');
    this.track.className = 'gear-track';
    this.knob = document.createElement('div');
    this.knob.className = 'gear-knob';
    this.track.appendChild(this.knob);
    this.wrapper.appendChild(this.track);

    this.track.addEventListener('click', (e) => {
      if (this.isDisabled) return;
      const rect = this.track.getBoundingClientRect();
      const relX = e.clientX - rect.left;
      const slotWidth = rect.width / this.labels.length;
      const newIndex = Math.floor(relX / slotWidth);
      if (newIndex !== this.index) {
        this.index = newIndex;
        this.updatePosition();
        this.onChange(this.labels[this.index], this.index);
      }
    });

    this.updatePosition();
  }

  updatePosition() {
    const percent = (this.index + 0.5) / this.labels.length * 100;
    this.knob.style.left = `${percent}%`;
    this.knob.setAttribute('data-label', this.labels[this.index]);
  }

  setValue(idx) {
    if (idx >= 0 && idx < this.labels.length) {
      this.index = idx;
      this.updatePosition();
    }
  }

  getValue() {
    return { label: this.labels[this.index], index: this.index };
  }

  setDisabled(disabled) {
    this.isDisabled = disabled;
    this.track.classList.toggle('disabled', disabled);
    this.knob.style.opacity = disabled ? 0.4 : 1.0;
  }
}

// === SLIDER COMPONENT ===
class SliderComponent extends BaseComponent {
  constructor({ min = 0, max = 100, initial = 0, step = 1, onChange = () => {} } = {}) {
    super();
    this.min = min;
    this.max = max;
    this.step = step;
    this.value = initial;
    this.onChange = onChange;

    this.slider = document.createElement('input');
    this.slider.type = 'range';
    this.slider.min = min;
    this.slider.max = max;
    this.slider.step = step;
    this.slider.value = initial;
    this.slider.className = 'control-slider';

    this.slider.addEventListener('input', () => {
      this.value = parseFloat(this.slider.value);
      this.onChange(this.value);
    });

    this.wrapper.appendChild(this.slider);
  }

  setValue(val) {
    this.value = Math.max(this.min, Math.min(this.max, val));
    this.slider.value = this.value;
  }

  getValue() {
    return this.value;
  }
}

// === LEVER COMPONENT ===
class LeverComponent extends BaseComponent {
  constructor({ label = '', onActivate = () => {}, cooldown = 0, min = 0, max = 100, initial = 0, discrete = false, onChange = () => {} } = {}) {
    super();
    this.cooldown = cooldown;
    this.onActivate = onActivate;
    this.ready = true;
    this.min = min;
    this.max = max;
    this.value = initial;
    this.discrete = discrete;
    this.onChange = onChange;

    this.lever = document.createElement('div');
    this.lever.className = 'lever-track';

    this.knob = document.createElement('div');
    this.knob.className = 'lever-knob';
    this.knob.textContent = label;
    this.lever.appendChild(this.knob);

    this.lever.addEventListener('click', (e) => {
      const rect = this.lever.getBoundingClientRect();
      const relY = e.clientY - rect.top;
      const percent = relY / rect.height;
      let newValue = (1 - percent) * (this.max - this.min) + this.min;
      if (this.discrete) newValue = Math.round(newValue);
      this.value = Math.max(this.min, Math.min(this.max, newValue));
      this.onChange(this.value);
      this.updatePosition();
    });

    this.wrapper.appendChild(this.lever);
    this.updatePosition();
  }

  setValue(val) {
    this.value = Math.max(this.min, Math.min(this.max, val));
    this.updatePosition();
  }

  getValue() {
    return this.value;
  }

  updatePosition() {
    const percent = (this.value - this.min) / (this.max - this.min);
    const top = (1 - percent) * 100;
    this.knob.style.top = `${top}%`;
    this.knob.textContent = this.value;
  }
}

// === EXPORTS ===
export {
  BaseComponent,
  ButtonComponent,
  ToggleButtonComponent,
  GearKnobComponent,
  SliderComponent,
  LeverComponent
};
