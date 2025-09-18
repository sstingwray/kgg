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
    if (this.label.startsWith('<')) {
      this.button.innerHTML = this.label;
    } else {
      if (this.label.startsWith('<')) {
      this.button.innerHTML = this.label;
    } else {
      this.button.textContent = this.label;
    }
    }

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
    if (this.label.startsWith('<')) {
      this.button.innerHTML = this.label;
    } else {
      this.button.textContent = this.label;
    }
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
    return { index: this.index, label: this.labels[this.index] };
  }

  updateLabel() {
    if (!this.labelColumn) return;
    const children = this.labelColumn.querySelectorAll('.gear-stick-label-entry');
    children.forEach((el, idx) => {
      el.classList.toggle('active', idx === this.index);
    });
  }

  updateLabel() {
    if (!this.labelColumn) return;
    const children = this.labelColumn.querySelectorAll('.gear-stick-label-entry');
    children.forEach((el, idx) => {
      el.classList.toggle('active', idx === this.index);
    });
  }

  updateLabel() {
    if (!this.labelColumn) return;
    const children = this.labelColumn.querySelectorAll('.gear-stick-label-entry');
    children.forEach((el, idx) => {
      el.classList.toggle('active', idx === this.index);
    });
  }

  updateLabel() {
    if (!this.label) return;
    this.label.textContent = `Gear: ${this.labels[this.index]}`;
  }

  updateLabel() {
    if (!this.label) return;
    this.label.textContent = `Gear: ${this.labels[this.index]}`;
  }

  updateLabel() {
    this.label.textContent = `Gear: ${this.labels[this.index]}`;
  }
}

// === BUTTON COMPONENT ===
class ButtonComponent extends BaseComponent {
  constructor(label, onClick = () => {}) {
    super();
    this.button = document.createElement('button');
    this.button.className = 'control-button';
    if (label.startsWith('<')) {
      this.button.innerHTML = label;
    } else {
      this.button.textContent = label;
    }
    this.button.addEventListener('click', () => onClick());
    this.wrapper.appendChild(this.button);
  }

  setLabel(text) {
    if (text.startsWith('<')) {
      this.button.innerHTML = text;
    } else {
      this.button.textContent = text;
    }
  }

  click() {
    this.button.click();
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

    let isDragging = false;

    this.lever.addEventListener('mousedown', (e) => {
      isDragging = true;
      handleMove(e);
    });

    window.addEventListener('mousemove', (e) => {
      if (isDragging) handleMove(e);
    });

    window.addEventListener('mouseup', () => {
      if (isDragging) isDragging = false;
    });

    const handleMove = (e) => {
      const rect = this.lever.getBoundingClientRect();
      const relY = e.clientY - rect.top;
      const percent = relY / rect.height;
      let newValue = (1 - percent) * (this.max - this.min) + this.min;
      if (this.discrete) newValue = Math.round(newValue);
      newValue = Math.max(this.min, Math.min(this.max, newValue));
      if (newValue !== this.value) {
        this.value = newValue;
        this.onChange(this.value);
        this.updatePosition();
      }
    };

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
  }
}

// === GEAR STICK COMPONENT ===
class GearStickComponent extends BaseComponent {
  constructor({ labels = ["Reverse", "Neutral", "1st", "2nd", "3rd"], initial = 1, onChange = () => {} } = {}) {
    super();
    this.labels = labels;
    this.index = initial;
    this.onChange = onChange;

    this.track = document.createElement('div');
    this.track.className = 'gear-stick-track';

    this.knob = document.createElement('div');
    this.knob.className = 'gear-stick-knob';
    this.track.appendChild(this.knob);

    this.track.addEventListener('click', (e) => {
      const rect = this.track.getBoundingClientRect();
      const relY = e.clientY - rect.top;
      const slotHeight = rect.height / this.labels.length;
      const newIndex = Math.floor(relY / slotHeight);
      this.setValue(newIndex);
      this.onChange(this.labels[newIndex], newIndex);
    });

    this.labelColumn = document.createElement('div');
    this.labelColumn.className = 'gear-stick-label-column';
    this.labels.forEach((label, i) => {
      const span = document.createElement('span');
      span.textContent = label[0];
      span.className = 'gear-stick-label-entry';
      this.labelColumn.appendChild(span);
    });

    const layout = document.createElement('div');
    layout.className = 'gear-stick-layout';
    layout.appendChild(this.labelColumn);
    layout.appendChild(this.track);

    this.wrapper.appendChild(layout);
    this.setValue(initial);
    this.updateLabel();
  }

  setValue(index) {
    if (index < 0 || index >= this.labels.length) return;
    this.index = index;
    const percent = (index + 0.5) / this.labels.length;
    this.knob.style.top = `${percent * 100}%`;
    this.knob.setAttribute('data-label', this.labels[this.index]);
    this.updateLabel();
  }

  updateLabel() {
    if (!this.labelColumn) return;
    const children = this.labelColumn.querySelectorAll('.gear-stick-label-entry');
    children.forEach((el, idx) => {
      el.classList.toggle('active', idx === this.index);
    });
  }

  getValue() {
    return { index: this.index, label: this.labels[this.index] };
  }
}

// === EXPORTS ===
export {
  BaseComponent,
  ButtonComponent,
  ToggleButtonComponent,
  GearStickComponent,
  SliderComponent,
  LeverComponent
 };