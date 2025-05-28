import Interactable from './interactable.js';
import Bar from './bar.js';
import Light from '../objects/light.js';
import Gauge from '../objects/gauge.js';
import Dial from './dial.js';
import GearShiftLever from '../objects/gearShiftLever.js';
import Button from '../objects/button.js';
import emitter from '../modules/eventEmitter.js';
import { getGameState } from '../modules/gameManager.js';
import { round, getRGBA } from '../utils/helpers.js';

export default class ControlPanel extends Interactable {
  constructor(options = {}) {
    super();
    this.x         = options.x;
    this.y         = options.y;
    this.width     = options.width;
    this.height    = options.height;
    this.body      = options.body;
    this.icons     = options.icons
    this.canvases = {};
    this.CENTRAL_PANEL_SIZE  = { width: this.width, height: this.height };
    this.GEARBOX_CANVAS_SIZE = { width: 12*8,  height: 12*5 - 4  };

    const state = getGameState();

    this.elements = {
      levers: {
        gearShiftLever: new GearShiftLever({
          body: this.body,
          x: this.width / 2 - (12*7), y: 0,
          width: 108,
          channelLen: 12*16,
          handleRadius: 20,
        })
      },
      gauges: {
        gaugePRM: new Gauge({
          body: this.body,
          x: 5 + 12*14, y: 8 - 12*2, radius: 34,
          maxValue: state.mech.engine.maxBaseRPM,
          divisions: state.mech.engine.maxBaseRPM,
          redZoneStart: 0.8,
          pointerColor: 'dark-cyan', label: 'RPM',
        }),
        speedRPM: new Gauge({
          body: this.body,
          x: 7 + 12*3, y: 8 - 12*2, radius: 40,
          maxValue: 20*10,
          divisions: 5,
          redZoneStart: 1.1,
          pointerColor: 'dark-cyan', label: 'Speed',
        })
      },
      buttons: {
        ignitionBtn: new Button({ 
          body: this.body,
          x: 3 + 12*9, y: 8 + 12*1, radius: 18,
          color: 'raisin-black', highlight: 'neon-green', svg: this.icons.ignition,
          eventType: 'ignitionState', onClick: () => { emitter.emit('ignitionToggle', round(performance.now() / 100, 2)) }
        })
      },
      lights: {
        clutchLight: new Light({
          body: this.body,
          x: 3 + 12*9 , y: 6 - 12*11, radius: 8,
          color: 'dark-cyan', label: null, svg: null,//this.icons.clutch,
          eventType: 'clutchToggle', state: true,
          progressive: false
        }),
      },
      bars: {
        fuelBar: new Bar({
          id: 'fuelBar', body: this.body, x: 0 + 12*23, y: 4 + 12*1,
          shape: 'circle', width: 8, height: 18, radius: 20,
          value: state.mech.status.bars.fuel, getValue: () => { return state.mech.status.bars.fuel },
          min: 0, max: state.mech.reactor.maxFuel,
          color: 'cosmic-latte', fillColor: 'neon-green', fillStyle: 'linear'
        }),
        energyBar: new Bar({
          id: 'energyBar', body: this.body, x: 0 + 12*14, y: 10 - 12*13,
          angle: 90, shape: 'rect', width: 28, height: 96, radius: 20,
          value: state.mech.status.energyOutput, getValue: () => { return state.mech.status.energyOutput },
          min: 0, max: state.mech.reactor.maxOutput, interval: 1, segmHeight: 4,
          color: null, fillColor: 'neon-green', fillStyle: 'segmented'
        }),
        coolantBar: new Bar({
          id: 'coolantBar', body: this.body, x: 2 - 12*39, y: 8 - 12*4,
          shape: 'circle', width: 8, height: 18, radius: 8,
          value: state.mech.status.modules.coolantCanister.amount, getValue: () => { return state.mech.status.modules.coolantCanister.amount },
          min: 0, max: state.mech.reactor.maxFuel,
          color: 'cosmic-latte', fillColor: 'white', fillStyle: 'linear'
        }),
      },
      modules: {
        coolantDispenser: {
          dial: new Dial({
            body: this.body,
            x: 4 - 12*37, y: 4 - 12*6, radius: 16,
            svg: this.icons.coolant, color: 'davy-gray', highlight: 'auburn', notches: 2,
            teethCount: 6, toothWidth: 14, toothLength: 4,
            minAngle: 0, maxAngle: 360,
            eventType: 'heatUpdate', onChange: (value) => { emitter.emit('coolantCanisterValveChange', value) }
          }),
        }
      }
    }
  }

  returnElements() {
    return this.elements;
  }

  render(biggerContext, physicsElements) {
    const state = getGameState();
  
    this.drawCentralPanelStatic(state, physicsElements.centralPanel, biggerContext);

    this.elements.levers.gearShiftLever.render(biggerContext);
    this.elements.gauges.gaugePRM.render(state.mech.status.baseRPM, biggerContext);
    this.elements.gauges.speedRPM.render(state.mech.status.movement.speedApprox, biggerContext);
    this.elements.buttons.ignitionBtn.render(biggerContext);
    this.elements.lights.clutchLight.render(biggerContext);
    this.elements.bars.fuelBar.update();
    this.elements.bars.fuelBar.render(biggerContext);
    this.elements.bars.energyBar.update();
    this.elements.bars.energyBar.render(biggerContext);
    this.elements.bars.coolantBar.update();
    this.elements.bars.coolantBar.render(biggerContext);
    this.elements.modules.coolantDispenser.dial.render(biggerContext);
  }

  drawCentralPanelStatic(state, body, biggerContext) {
    this.canvases.centralPanel          = document.createElement('canvas');
    this.canvases.centralPanel.width    = this.CENTRAL_PANEL_SIZE.width;
    this.canvases.centralPanel.height   = this.CENTRAL_PANEL_SIZE.height;
    this.canvases.centralPanel.ctx      = this.canvases.centralPanel.getContext('2d');

    const ctx = this.canvases.centralPanel.ctx;

    ctx.fillStyle = getRGBA('auburn', 0);
    ctx.fillRect(0, 18, this.CENTRAL_PANEL_SIZE.width, this.CENTRAL_PANEL_SIZE.height - 38);

    //ctx.fillStyle = getRGBA('dark-cyan', 1);
    //ctx.fillRect(12*68 + 1, 12*10 + 11, 5, -fuelLevel);

    biggerContext.save();
    biggerContext.translate(body.position.x, body.position.y);
    biggerContext.rotate(body.angle);
    biggerContext.drawImage(
      this.canvases.centralPanel,
      -this.CENTRAL_PANEL_SIZE.width  / 2,
      -this.CENTRAL_PANEL_SIZE.height  / 2,
      this.CENTRAL_PANEL_SIZE.width,
      this.CENTRAL_PANEL_SIZE.height
    );
    biggerContext.restore();
  }
}
