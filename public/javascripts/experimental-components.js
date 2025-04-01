// experimental-components.js

// === BUTTON ===
function createButton(label, onClick) {
  const wrapper = document.createElement('div');
  wrapper.className = 'control-wrapper';

  const btn = document.createElement('button');
  btn.textContent = label;
  btn.className = 'control-button';
  btn.addEventListener('click', () => onClick());

  wrapper.appendChild(btn);
  return {
    element: wrapper,
    setLabel: (text) => { btn.textContent = text; },
    click: () => { onClick(); }
  };
}

// === ENGINE LOOP ===
const engineContext = new (window.AudioContext || window.webkitAudioContext)();
let engineSource = null;
let engineLoop = null;
let enginePlaybackRateNode = null;
function startEngineLoop() {
  try {
    if (!engineSource) {
      fetch("/sounds/engine.wav")
        .then(res => res.arrayBuffer())
        .then(buffer => engineContext.decodeAudioData(buffer))
        .then(decoded => {
          engineSource = engineContext.createBufferSource();
          engineSource.buffer = decoded;
          engineSource.loop = true;

          enginePlaybackRateNode = engineContext.createGain();
          const playbackRateControl = engineContext.createGain();

          // custom pitch-style filter using playbackRate
          engineSource.playbackRate.value = 1.0;

          engineSource.connect(engineContext.destination);
          engineSource.start();
        });
    }
  } catch (e) {
    console.warn("Engine loop failed to play:", e);
  }
}

function stopEngineLoop() {
  if (engineSource) {
    try {
      engineSource.stop();
    } catch (e) {}
    engineSource.disconnect();
    engineSource = null;
  }
  engineLoop = null;
  enginePlaybackRateNode = null;
}

function updateEngineLoopPlaybackRate(baseRPM) {
  if (engineSource) {
    const clamped = Math.max(0.2, Math.min(2.0, baseRPM / 5));
    engineSource.playbackRate.value = clamped;
  }
}

// === IGNITION OFF SOUND ===
function playIgnitionOffSound() {
  try {
    const audio = new Audio("/sounds/engine-off.ogg");
    audio.play();
  } catch (e) {
    console.warn("Ignition off sound failed to play:", e);
  }
}

// === IGNITION SOUND ===
function playIgnitionSound() {
  try {
    const audio = new Audio("/sounds/ignition-toggle.wav");
    audio.play();
  } catch (e) {
    console.warn("Ignition sound failed to play:", e);
  }
}

// === TOGGLE BUTTON ===
function createToggleButton(label, initial = false, onToggle = () => {}) {
  const wrapper = document.createElement('div');
  wrapper.className = 'control-wrapper';

  const btn = document.createElement('button');
  let state = initial;

  const updateVisual = () => {
    btn.textContent = label;
    btn.classList.toggle('toggled', state);
  };

  btn.className = 'control-button';
  btn.addEventListener('click', () => {
    state = !state;
    updateVisual();
    if (label === "⚡") {
      if (state) {
        playIgnitionSound();
        startEngineLoop();
      } else {
        stopEngineLoop();
        playIgnitionOffSound();
      }
    }
    onToggle(state);
  });

  updateVisual();
  wrapper.appendChild(btn);

  return {
    element: wrapper,
    setValue: (val) => {
      const clamped = Boolean(val);
      if (state !== clamped) {
        state = clamped;
        updateVisual();
        onToggle(state);
      }
    },
    getValue: () => state
  };
}

// === SLIDER ===
function createSlider(label, options = {}) {
  const {
    min = 0,
    max = 100,
    step = 1,
    initial = min,
    discrete = false,
    onChange = () => {}
  } = options;

  const wrapper = document.createElement('div');
  wrapper.className = 'control-wrapper';

  const title = document.createElement('label');
  title.textContent = label;
  wrapper.appendChild(title);

  const slider = document.createElement('input');
  slider.type = 'range';
  slider.min = min;
  slider.max = max;
  slider.step = step;
  slider.value = initial;
  slider.className = discrete ? 'slider-discrete' : 'slider-continuous';

  slider.addEventListener('input', () => {
    onChange(Number(slider.value));
  });

  wrapper.appendChild(slider);

  return {
    element: wrapper,
    setValue: (value) => {
      const clamped = Math.max(min, Math.min(max, value));
      if (slider.value !== clamped.toString()) {
        slider.value = clamped;
        onChange(clamped);
      }
    },
    getValue: () => Number(slider.value)
  };
}

// === GEAR KNOB ===
function createGearKnob(options = {}) {
  const {
    labels = ["Reverse", "Neutral", "1st", "2nd", "3rd"],
    initial = 1,
    onChange = () => {}
  } = options;

  let index = initial;
  let isDisabled = false;

  const wrapper = document.createElement('div');
  wrapper.className = 'control-wrapper';

  const label = document.createElement('label');
  label.textContent = "Gear";
  wrapper.appendChild(label);

  const track = document.createElement('div');
  track.className = 'gear-track';

  const knob = document.createElement('div');
  knob.className = 'gear-knob';

  track.appendChild(knob);
  wrapper.appendChild(track);

  track.addEventListener('click', (e) => {
    if (isDisabled) return;
    const rect = track.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const slotWidth = rect.width / labels.length;
    const newIndex = Math.floor(relX / slotWidth);
    if (newIndex !== index) {
      index = newIndex;
      updatePosition();
      onChange(labels[index], index);
    }

    // Move this logic here so it works in both manual and auto clutch modes
    try {
      const audio = new Audio("/sounds/gear-shift.wav");
      audio.play();
    } catch (e) {
      console.warn("Gear shift sound failed to play:", e);
    }
  });
  

  function updatePosition() {
    const percent = (index + 0.5) / labels.length * 100;
    knob.style.left = `${percent}%`;
    knob.setAttribute('data-label', labels[index]);
  }

  updatePosition();

  return {
    element: wrapper,
    setValue: (idx) => {
      if (idx >= 0 && idx < labels.length) {
        index = idx;
        updatePosition();
      }
    },
    getValue: () => ({ label: labels[index], index }),
    setDisabled: (disabled) => {
      isDisabled = disabled;
      if (disabled) {
        track.classList.add('disabled');
        knob.style.opacity = 0.4;
      } else {
        track.classList.remove('disabled');
        knob.style.opacity = 1.0;
      }
    }
  };
}

// === LEVER ===
function createLever(label, options = {}) {
  const {
    min = 0,
    max = 100,
    step = 1,
    initial = min,
    discrete = false,
    onChange = () => {}
  } = options;

  const range = max - min;
  let currentValue = initial;

  const wrapper = document.createElement('div');
  wrapper.className = 'control-wrapper';

  const title = document.createElement('label');
  title.textContent = label;
  wrapper.appendChild(title);

  const track = document.createElement('div');
  track.className = 'lever-track';

  const knob = document.createElement('div');
  knob.className = 'lever-knob';
  track.appendChild(knob);
  wrapper.appendChild(track);

  function updatePosition() {
    const percent = (currentValue - min) / range;
    knob.style.top = `${(1 - percent) * 100}%`;
  }

  let dragging = false;

  knob.addEventListener('mousedown', (e) => {
    e.preventDefault();
    dragging = true;
    document.body.style.userSelect = 'none';
  });

  document.addEventListener('mouseup', () => {
    dragging = false;
    document.body.style.userSelect = '';
  });

  document.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    const rect = track.getBoundingClientRect();
    const offsetY = e.clientY - rect.top;
    const percent = Math.min(Math.max(offsetY / rect.height, 0), 1);
    let newValue = min + (1 - percent) * range;

    if (discrete) newValue = Math.round(newValue / step) * step;

    if (newValue !== currentValue) {
      currentValue = newValue;
      updatePosition();
      onChange(currentValue);
    }
  });

  updatePosition();

  return {
    element: wrapper,
    setValue: (val) => {
      const clamped = Math.max(min, Math.min(max, val));
      if (clamped !== currentValue) {
        currentValue = clamped;
        updatePosition();
        onChange(currentValue);
      }
    },
    getValue: () => currentValue
  };
}
