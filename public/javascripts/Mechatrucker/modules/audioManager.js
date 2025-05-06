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
let contextStarted = false;

export function setupAudio(assets) {
    musicManager = setupMusicManager();

    //emitter.subscribe('ignitionToggle', manageEngineLoop.bind(this));
    emitter.subscribe('ignitionToggle', async (isOn) => {
        if (isOn) {
          if (!contextStarted) {
            await Tone.start('0:0:0');
            contextStarted = true;
          }
          Tone.Transport.start();
          emitter.emit('[LOG][audioManager] music ON', null);
        } else {
          Tone.Transport.pause();
          emitter.emit('[LOG][audioManager] music OFF', null);
        }
      });
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
            kickOne:     60,
            kickTwo:     15,  
            hihatClosed: 0,
            hihatOpen:   5,
            stab:        30,
            lead:        99,
        };
        this.players = new Tone.Players({
            kickOne:    '/sounds/music/kick_1.wav',
            kickTwo:    '/sounds/music/kick_2.wav',
            hihatClosed:'/sounds/music/hi_hat_open.wav',
            hihatOpen:  '/sounds/music/hi_hat_closed.wav',
            acid:       '/sounds/music/acid.wav',
            clap:       '/sounds/music/clap.wav',
        });
        //channels
        this.kickOneCh   = new Tone.Channel(0, 0).toDestination();
        this.kickTwoCh   = new Tone.Channel(0, 0).toDestination();
        this.hihatClosedCh  = new Tone.Channel(0, 0).toDestination();
        this.hihatOpenCh  = new Tone.Channel(0, 0).toDestination();
        this.stabCh      = new Tone.Channel(0, 0).toDestination();
        this.leadCh      = new Tone.Channel(0, 0).toDestination();
        //effects
        this.distortion     = new Tone.Distortion(0.8);
        this.chebyshev      = new Tone.Chebyshev(20);
        this.eq             = {};
        this.eq.kick        = new Tone.EQ3(-6, +4, +3);
        this.eq.lead        = new Tone.EQ3(-6, +4, +3);
        this.compressor     = {};
        this.compressor
                      .kick = new Tone.Compressor({ threshold: -24, ratio: 4, attack: 0.005, release: 0.2 });
        this.compressor
                     .hihat = new Tone.Compressor({ threshold: -30, ratio: 3, attack: 0.001, release: 0.1 });
        this.compressor
                      .lead = new Tone.Compressor({ threshold: -24, ratio: 4, attack: 0.005, release: 0.2 });  
        this.reverb = {};
        this.reverb.hihat   = new Tone.Freeverb({ roomSize: 0.3, dampening: 2000, wet: 0.1 });
        this.reverb.snare   = new Tone.Freeverb({ roomSize: 0.2, wet: 0.2 });
        this.reverb.lead    = new Tone.Freeverb({ roomSize: 0.7, wet: 0.2 });
        this.bitcrush       = new Tone.BitCrusher({ bits: 5, wet:0.4 });
        this.highPassFilter = {};
        this.highPassFilter
                      .kick = new Tone.Filter(30, 'highpass');
        this.highPassFilter
                     .hihat = new Tone.Filter(30, 'highpass');
        this.lowPassFilter  = new Tone.Filter(1200, 'lowpass');
        this.chorus         = new Tone.Chorus(3, 2.5, 0.);
        this.delay          = new Tone.FeedbackDelay('8n', 0.3);

        //<== metronome
        this.metronomeEvents = [
            { time: '0:0:0', value: ['One'] },
            { time: '0:1:0', value: ['Two'] },
            { time: '0:2:0', value: ['Three'] },
            { time: '0:3:0', value: ['Four'] },
        ];

        // metronome ==/>
        const metronome = new Tone.Part((time, { value, size }) => {
            for (const [index, note] of value.entries()) {
                if (!note) return;
                emitter.emit(`beat${note}`, null);
            };
        }, this.metronomeEvents).start('0:0:0');

        metronome.loop = true;
        metronome.loopEnd = '1m';
        //<== kick
        //Part 1
        this.kickOneEvents = [
            { time: '0:0:0', value: ['one'] },
            { time: '0:1:0', value: ['one'] },
            { time: '0:2:0', value: ['one'] },
            { time: '0:3:0', value: ['one'] },
        ];
        this.players.player('kickOne').chain( this.kickOneCh );
        const kickOnePart = new Tone.Part((time, { value, size }) => {
            for (const [index, note] of value.entries()) {
                if (!note) return;
                this.players.player('kickOne').start(time);
            };
        }, this.kickOneEvents).start('0:0:0');

        kickOnePart.loop = true;
        kickOnePart.loopEnd = '1m';

        //Part 2
        this.kickTwoEvents = [
            { time: '0:0:0', value: [null] },
            { time: '0:1:0', value: [null] },
            { time: '0:2:0', value: [null] },
            { time: '0:3:0', value: ['two'] },
            { time: '0:4:0', value: [null] },
            { time: '0:4:2', value: ['two'] },
            { time: '0:5:0', value: [null] },
            { time: '0:6:0', value: [null] },
            { time: '0:7:0', value: ['two'] },
        ];
        this.players.player('kickTwo').chain( this.kickTwoCh );
        const kickTwoPart = new Tone.Part((time, { value, size }) => {
            for (const [index, note] of value.entries()) {
                if (!note) return;
                this.players.player('kickTwo').start(time);
            };
        }, this.kickTwoEvents).start('0:0:0');

        kickTwoPart.loop = true;
        kickTwoPart.loopEnd = '2m';
        // kick ==/>

        //<== hihats
        //Part 1
        this.hihatClosedEvents = [
            { time: '0:0:0', value: [null] },
            { time: '0:0:2', value: ['closed'] },
            { time: '0:1:0', value: ['closed'] },
            { time: '0:1:2', value: ['closed'] },
            { time: '0:2:0', value: [null] },
            { time: '0:2:2', value: ['closed'] },
            { time: '0:3:0', value: ['closed'] },
            { time: '0:3:2', value: ['closed'] }
        ];
        this.players.player('hihatClosed').chain( this.hihatClosedCh );
        const hihatClosedPart = new Tone.Part((time, { value, size }) => {
            for (const [index, note] of value.entries()) {
                if (!note) return;
                this.players.player('hihatClosed').start(time);
            };
        }, this.hihatClosedEvents).start('0:0:0');

        hihatClosedPart.loop = true;
        hihatClosedPart.loopEnd = '1m';

        //Part 2
        this.hihatOpenEvents = [
            { time: '0:0:0', value: ['open'] },
            { time: '0:0:2', value: [null] },
            { time: '0:1:0', value: [null] },
            { time: '0:1:2', value: [null] },
            { time: '0:2:0', value: [null] },
            { time: '0:2:2', value: [null] },
            { time: '0:3:0', value: [null] },
            { time: '0:3:2', value: [null] }
        ];
        this.players.player('hihatOpen').chain( this.hihatOpenCh );

        const hihatOpenPart = new Tone.Part((time, { value, size }) => {
            for (const [index, note] of value.entries()) {
                if (!note) return;
                this.players.player('hihatOpen').start(time);
            };
        }, this.hihatOpenEvents).start('0:0:0');

        hihatOpenPart.loop = true;
        hihatOpenPart.loopEnd = '1m';
        // hihats ==/>

        //<== stab
        this.stabEvents = [
            { time: '0:0:0', value: ['clap'], size: '16n' },
            { time: '0:0:2', value: [null], size: '16n' },
            { time: '0:1:0', value: [null], size: '16n' },
            { time: '0:1:2', value: [null], size: '16n' },
            { time: '0:2:0', value: ['clap'], size: '16n' },
            { time: '0:2:2', value: [null], size: '32n' },
            { time: '0:2:3', value: [null], size: '16n' },
            { time: '0:3:0', value: [null], size: '32n' },
            { time: '0:3:1', value: [null], size: '32n' },
            { time: '0:3:2', value: [null], size: '16n' }
        ];

        this.players.player('acid').chain( this.stabCh );
        this.players.player('clap').chain( this.stabCh );
        
        const stabPart = new Tone.Part((time, { value, size }) => {
            for (const [index, note] of value.entries()) {
                if (!note) return;
                if (note === 'acid') this.players.player('acid').start(time);
                else if (note === 'clap') this.players.player('clap').start(time);
            };
        }, this.stabEvents).start('0:0:0');

        stabPart.loop = true;
        stabPart.loopEnd = '1m';
        //stab ==/>

        //<== lead
        this.riffEvents = [
            { time: '0:0:0', value: ['B2'], size: '16n' },
            { time: '0:0:2', value: [null], size: '32n' },
            { time: '0:0:3', value: ['B2'], size: '32n' },
            { time: '0:1:0', value: ['B2'], size: '32n' },
            { time: '0:1:1', value: [null], size: '32n' },
            { time: '0:1:2', value: ['B2'], size: '32n' },
            { time: '0:1:3', value: ['B2'], size: '32n' },
            { time: '0:2:0', value: [null], size: '16n' },
            { time: '0:2:2', value: ['B2'], size: '16n' },
            { time: '0:2:3', value: [null], size: '32n' },
            { time: '0:3:0', value: ['A2'], size: '16n' },
            { time: '0:3:3', value: [null], size: '32n' },
            { time: '0:4:0', value: ['C3'], size: '16n' },
            { time: '0:4:3', value: [null], size: '32n' },
            { time: '0:5:0', value: ['C3'], size: '16n' },
            { time: '0:5:3', value: [null], size: '32n' },
            { time: '0:6:0', value: ['A2'], size: '32n' },
            { time: '0:6:1', value: ['A2'], size: '32n' },
            { time: '0:6:3', value: [null], size: '32n' },
            { time: '0:7:0', value: ['B2'], size: '32n' },
            { time: '0:7:1', value: ['B2'], size: '32n' },
            { time: '0:7:2', value: [null], size: '16n' },

        ];
        this.lead = new Tone.FMSynth({
            harmonicity:     2.5,
            modulationIndex: 12,
            carrier:   { envelope: { attack: 0.001, decay: 0, sustain: 0, release: 0.01 } },
            modulation: { envelope: { attack: 0.001, decay: 0, sustain: 0,   release: 0.1 } }
          }).chain(
            this.distortion, this.chebyshev, this.eq.lead, this.compressor.lead, this.lowPassFilter, this.reverb.lead,

            //this.bitcrush, this.lowPassFilter, this.distortion, this.chorus, this.reverb.lead,
            this.leadCh
        );

        const leadPart = new Tone.Part((time, { value, size }) => {
            for (const [index, note] of value.entries()) {
                if (!note) return;
                this.lead.triggerAttackRelease(note, size, time + index*Tone.Time('64n'));
            };
        }, this.riffEvents).start('0:0:0');

        leadPart.loop = true;
        leadPart.loopEnd = '2m';
        //lead ==/>

        this.updateRPM = this.updateRPM.bind(this);
    }

    updateRPM(speed) {        
        const bpm = rpmToBpm(speed);
        
        Tone.Transport.bpm.rampTo(bpm, 0.2);

        this.kickOneCh.mute  = speed < this.thresholds.kickOne;
        this.kickTwoCh.mute  = speed < this.thresholds.kickTwo;
        this.hihatClosedCh.mute = speed < this.thresholds.hihatClosed;
        this.hihatOpenCh.mute = speed < this.thresholds.hihatOpen;
        this.stabCh.mute  = speed < this.thresholds.stab;
        this.leadCh.mute  = speed < this.thresholds.lead;
    }
}

export function setupMusicManager() {
    const manager = new MusicManager();

    return manager;
}

function rpmToBpm(speed) {
    const MIN_SPEED = 0, MAX_SPEED = 100;
    const MIN_BPM = 125, MAX_BPM = 140;

    const clamped = clamp(speed, MIN_SPEED, MAX_SPEED);
    
    return MIN_BPM + (clamped / MAX_SPEED) * (MAX_BPM - MIN_BPM);
}