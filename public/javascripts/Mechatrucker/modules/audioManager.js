import emitter from './eventEmitter.js';
import { getGameState } from '../modules/gameManager.js';
import { clamp } from '../utils/helpers.js';

const VOLUME_SETTINGS = {
    engine: 0.1,
    ignition: 0.4,
    ignitionOff: 1,
    gearShift: 0.8,
    venting: 1.0,
    step: 0.1,
    music: 6
};

const engineContext = new (window.AudioContext || window.webkitAudioContext)();
let engineSource = null;
let engineBuffer = null;
let engineLoopPlaying = false;
let musicManager = null;

export function setupAudio() {
    musicManager = setupMusicManager();

    //emitter.subscribe('ignitionToggle', manageEngineLoop.bind(this));
    emitter.subscribe('ignitionToggle', manageMusic.bind(this));
    emitter.subscribe('gearShift', playGearShiftSound.bind(this));
    emitter.subscribe('engineWorking', updateEngineLoopPlaybackRate.bind(this));
    emitter.subscribe('stepMade', playStepSound.bind(this));
    emitter.subscribe('mechMoving', musicManager.updateRPM.bind(this));
    //emitter.subscribe('outputChange', placeholder.bind(this));
}
  
async function loadEngineBuffer() {
    if (!engineBuffer) {
        const res = await fetch("/sounds/engine.wav");
        const arrayBuffer = await res.arrayBuffer();
        engineBuffer = await engineContext.decodeAudioData(arrayBuffer);
    }
}
async function manageEngineLoop(flag) {
    if (flag) {
        playIgnitionSound();
        startEngineLoop();
    } else {
        stopEngineLoop();
        playIgnitionOffSound();
    };
}
  
async function startEngineLoop() {
    await loadEngineBuffer();
    if (!engineLoopPlaying) {
        engineSource = engineContext.createBufferSource();
        engineSource.buffer = engineBuffer;
    
        const gainNode = engineContext.createGain();
        gainNode.gain.value = VOLUME_SETTINGS.engine;
        engineSource.connect(gainNode);
        gainNode.connect(engineContext.destination);
        engineSource.loop = true;
        engineSource.playbackRate.value = 1.0;
        engineSource.start(0);
        engineLoopPlaying = true;
    }
}
  
function stopEngineLoop() {
    if (engineSource) {
        try {
            engineSource.stop();
            engineSource.disconnect();
        } catch (e) {}
        engineSource = null;
        engineLoopPlaying = false;
    }
}
  
function updateEngineLoopPlaybackRate(baseRPM) {
    if (!isFinite(baseRPM)) return;
    if (engineSource && engineLoopPlaying) {
        const clamped = Math.max(0.2, Math.min(2.0, baseRPM / 5));
        engineSource.playbackRate.value = clamped;
    }
}
    
  
function playIgnitionSound() {
    try {
        const audio = new Audio("/sounds/ignition-toggle.wav");
        audio.volume = VOLUME_SETTINGS.ignition;
        audio.play();
    } catch (e) {
        console.warn("Ignition sound failed to play:", e);
    }
}
  
function playIgnitionOffSound() {
    try {
        const audio = new Audio("/sounds/engine-off.ogg");
        audio.volume = VOLUME_SETTINGS.ignitionOff;
        audio.play();
    } catch (e) {
        console.warn("Ignition off sound failed to play:", e);
    }
}
  
function playGearShiftSound() {
    try {
        const audio = new Audio("/sounds/gear-shift.wav");
        audio.volume = VOLUME_SETTINGS.gearShift;
        audio.play();
    } catch (e) {
        console.warn("Gear shift sound failed to play:", e);
    }
}
  
function playVentingSound() {
    try {
        const audio = new Audio("/sounds/venting.wav");
        audio.volume = VOLUME_SETTINGS.venting;
        audio.play();
    } catch (e) {
        console.warn("Venting sound failed to play:", e);
    }
}
  
function playStepSound() {
    try {
        const audio = new Audio("/sounds/mech-step.mp3");
        audio.volume = VOLUME_SETTINGS.step;
        audio.play();
    } catch (e) {
        console.warn("Step sound failed to play:", e);
    }
}

class MusicManager {
    constructor() {
        this.thresholds = {
            kick:   0,     
            hihat:  0,
            snare:  0,
            stab:   99,
            lead:   99,
        };
        //channels
        this.kickCh   = new Tone.Channel(0, 0).toDestination();
        this.hihatCh  = new Tone.Channel(0, 0).toDestination();
        this.snareCh  = new Tone.Channel(0, 0).toDestination();
        this.stabCh   = new Tone.Channel(0, 0).toDestination();
        this.leadCh   = new Tone.Channel(0, 0).toDestination();
        //effects
        this.distortion     = new Tone.Distortion(0.8);
        this.chebyshev      = new Tone.Chebyshev(100);
        this.eq             = new Tone.EQ3(-6, +4, +3);
        this.compressor     = new Tone.Compressor({ threshold: -24, ratio: 4, attack: 0.005, release: 0.2 });
        this.reverb         = new Tone.Freeverb({ roomSize: 0.7, wet: 0.2 });
        this.bitcrush       = new Tone.BitCrusher({ bits: 5, wet:0.4 });
        this.lowPassFilter  = new Tone.Filter(1200, 'lowpass');
        this.highPassFilter = new Tone.Filter(30, 'highpass');
        this.chorus         = new Tone.Chorus(3, 2.5, 0.2);
        this.delay          = new Tone.FeedbackDelay('8n', 0.3);
        
        //kick
        this.kick = new Tone.MembraneSynth({
            pitchDecay:     0.1,      
            octaves:        8,
            oscillator:     { type: 'sine' },
            envelope: {
              attack:       0.002,
              decay:        0.3,
              sustain:      0.0,
              release:      0.1
            }
          }).chain(
            this.highPassFilter, this.compressor, this.eq, this.kickCh
        );

        //hihats
        this.hihatEvents = [
            { time: '0:0:0', value: '' },
            { time: '0:0:2', value: '' },
            { time: '0:1:0', value: '' },
            { time: '0:1:2', value: 'open' },
            { time: '0:2:0', value: '' },
            { time: '0:2:2', value: '' },
            { time: '0:3:0', value: '' },
            { time: '0:3:2', value: 'open' }
        ];
        this.hihatClosed = new Tone.MetalSynth({
            frequency:       9000,
            envelope: {
                attack:      0.001,
                decay:       0.05,
                release:     0.01
            },
            harmonicity:     5.1,
            modulationIndex: 64,
            resonance:       2000,
            octaves:         1
        }).chain(
            this.highPassFilter, this.compressor, this.reverb, this.hihatCh
        );
        this.hihatOpen = new Tone.MetalSynth({
            frequency:       3000,
            envelope: {
                attack:      0.001,
                decay:       0.2,
                release:     0.15
            },
            harmonicity:     1.5,
            modulationIndex: 2,
            resonance:       1500,
            octaves:         1
          }).chain(
            this.highPassFilter, this.compressor, this.reverb, this.hihatCh
        );

        //snare
        this.snareEvents = [
            { time: '0:0:0', value: '' },
            { time: '0:0:2', value: 'play' },
            { time: '0:1:0', value: '' },
            { time: '0:1:2', value: 'play' },
            { time: '0:2:0', value: '' },
            { time: '0:2:2', value: 'play' },
            { time: '0:3:0', value: '' },
            { time: '0:3:2', value: 'play' }
        ];
        this.snare = new Tone.NoiseSynth({
            noise: { type: 'white' },
            envelope: { attack: 0.001, decay: 0.15, sustain: 0, release: 0.05 }
        }).chain(
            this.reverb, 
            this.snareCh
        );

        //stab
        this.stab = new Tone.PluckSynth({
            attackNoise: 1,
            dampening: 4000,
            resonance: 0.9
        }).connect(this.stabCh);

        //lead
        this.riffEvents = [
            { time: '0:0:0', value: ['C1', 'G1'] },
            { time: '0:0:2', value: ['C1', 'G1'] },
            { time: '0:1:0', value: ['C3', 'G3'] },
            { time: '0:1:2', value: ['C1', 'G1'] },
            { time: '0:2:0', value: ['C1', 'G1'] },
            { time: '0:2:2', value: ['C1', 'G1'] },
            { time: '0:3:0', value: ['C3', 'G3'] },
            { time: '0:3:2', value: [null] }
        ];
        this.guitar = new Tone.FMSynth({
            harmonicity:     2.5,
            modulationIndex: 12,
            carrier:   { envelope: { attack:0.001, decay:0.2, sustain:0.3, release:0.4 } },
            modulation: { envelope: { attack:0.001, decay:0.1, sustain:0,   release:0.1 } }
          }).chain(
            //distortion, chebyshev, eq, compressor, reverb,

            //bitcrush, filter, distortion, chorus, reverb,
            this.leadCh
        );
        //this.guitar.connect(this.leadCh);
    
        Tone.Transport.scheduleRepeat(time => {
            this.kick.triggerAttackRelease('D1', '4n', time);
        }, '4n');
        const hihatPart = new Tone.Part((time, { value }) => {
            if (value === 'closed') this.hihatClosed.triggerAttackRelease('16n', time);
            else if (value === 'open') this.hihatOpen.triggerAttackRelease('8n', time);
            else return;
        }, this.hihatEvents).start('0:0:0');
        hihatPart.loop = true;
        hihatPart.loopEnd = '1m';
        const snarePart = new Tone.Part((time, { value }) => {
            if (value === 'play') this.snare.triggerAttackRelease('16n', time);
            else return;
        }, this.snareEvents).start('0:0:0');
        snarePart.loop = true;
        snarePart.loopEnd = '1m';
    
        // Stab on the “& of 1” and “& of 3”
        Tone.Transport.scheduleRepeat((time) => {
            const beat = Number(Tone.Transport.position.split(':')[1]);
            if (beat === 0 || beat === 2) {
            this.stab.triggerAttackRelease('G4', '8n', time + Tone.Time('8n') * 1);
            }
        }, '2n');

        //lead part loop
        const leadPart = new Tone.Part((time, { value }) => {
            for (const [index, note] of value.entries()) {
                 if (!note) return;
                this.guitar.triggerAttackRelease(note, '16n', time + index*Tone.Time('64n'));
            };
        }, this.riffEvents).start('0:0:0');
        leadPart.loop = true;
        leadPart.loopEnd = '1m';

        Tone.Destination.volume.value = -VOLUME_SETTINGS.music;

        this.updateRPM = this.updateRPM.bind(this);
    }

    startMusic() {
        Tone.Transport.start('0:0:0');
        emitter.emit('[LOG][audioManager] music ON', null);
    }

    stopMusic() {
        Tone.Transport.stop();
        emitter.emit('[LOG][audioManager] music OFF', null);
    }

  
    updateRPM(speed) {        
        const bpm = rpmToBpm(speed);
        
        Tone.Transport.bpm.rampTo(bpm, 0.2);

        this.kickCh.mute  = speed < this.thresholds.kick;
        this.hihatCh.mute = speed < this.thresholds.hihat;
        this.snareCh.mute = speed < this.thresholds.snare;
        this.stabCh.mute  = speed < this.thresholds.stab;
        this.leadCh.mute  = speed < this.thresholds.lead;
    }
}

export function setupMusicManager() {
    const manager = new MusicManager();

    return manager;
}

async function manageMusic(flag) {
    if (flag) {
        musicManager.startMusic();
    } else {
        musicManager.stopMusic();
    };
}

function rpmToBpm(speed) {
    const MIN_SPEED = 0, MAX_SPEED = 200;
    const MIN_BPM = 140, MAX_BPM = 160;

    const clamped = clamp(speed, MIN_SPEED, MAX_SPEED);
    
    return MIN_BPM + (clamped / MAX_SPEED) * (MAX_BPM - MIN_BPM);
}