// js/gameObjects/controlPanel.js
import Interactable from './interactable.js';
import Light from '../objects/light.js';
import Gauge from '../objects/gauge.js';
import Dial from './dial.js';
import GearShiftLever from '../objects/gearShiftLever.js';
import Button from '../objects/button.js';
import { toggleIgnition } from '../objects/controls.js';
import { getGameState } from '../modules/gameManager.js';
import { clamp, getRGBA } from '../utils/helpers.js';


const DEBUG = true;

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
          x: this.width / 2 - 12*10 + 6, y: 0,
          width: 108,
          channelLen: 12*16,
          handleRadius: 20,
        })
      },
      gauges: {
        gaugePRM: new Gauge({
          body: this.body,
          x: 12*3 + 5, y: 8 - 12*6, radius: 33,
          maxValue: state.mech.engine.maxBaseRPM,
          divisions: state.mech.engine.maxBaseRPM,
          redZoneStart: 0.8,
          pointerColor: 'gold', label: 'RPM',
        }),
        speedRPM: new Gauge({
          body: this.body,
          x: 12*10 + 3, y: 8 - 12*6, radius: 33,
          maxValue: state.mech.engine.maxSpeed,
          divisions: state.mech.engine.maxSpeed / 20,
          redZoneStart: 0.8,
          pointerColor: 'dark-cyan', label: 'Speed',
        })
      },
      buttons: {
        ignitionBtn: new Button({ 
          body: this.body,
          x: 12*22 + 4, y: - 12*4, radius: 17,
          color: 'gold', highlight: 'gold', svg: this.icons.ignition,
          eventType: 'ignitionToggle',
          onClick: toggleIgnition
        })
      },
      lights: {
        clutchLight: new Light({
          body: this.body,
          x: 12*22 + 4 , y: 5 - 12*8, radius: 8,
          color: 'dark-cyan', label: null, svg: null,//this.icons.clutch,
          eventType: 'clutchToggle', state: true,
          progressive: false
        }),
        outputLight: new Light({
          body: this.body,
          x: 12*17 - 5, y: 8 - 12*6, radius: 21,
          color: 'gold', label: null, svg: this.icons.reactor,
          eventType: 'outputChange', state: true,
          progressive: true, maxValue: state.mech.reactor.maxOutput
        })
      },
      modules: {
        coolantDispenser: {
          dial: new Dial({
            body: this.body,
            x: -12*13 - 5, y: 8 - 12*8, radius: 21,
            minAngle: 15, maxAngle: 270,
            divisions: 6
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
    this.elements.lights.outputLight.render(biggerContext);
    this.elements.modules.coolantDispenser.dial.render(biggerContext);
  }

  drawCentralPanelStatic(state, body, biggerContext) {
    this.canvases.centralPanel          = document.createElement('canvas');
    this.canvases.centralPanel.width    = this.CENTRAL_PANEL_SIZE.width;
    this.canvases.centralPanel.height   = this.CENTRAL_PANEL_SIZE.height;
    this.canvases.centralPanel.ctx      = this.canvases.centralPanel.getContext('2d');

    const ctx = this.canvases.centralPanel.ctx;
    const fuelLevel = 18 * state.mech.status.bars.fuel / state.mech.reactor.maxFuel;

    ctx.fillStyle = getRGBA('auburn', 0);
    ctx.fillRect(0, 18, this.CENTRAL_PANEL_SIZE.width, this.CENTRAL_PANEL_SIZE.height - 38);

    ctx.fillStyle = getRGBA('gold', 1);
    ctx.fillRect(12*68 + 1, 12*10 + 11, 5, -fuelLevel);

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
