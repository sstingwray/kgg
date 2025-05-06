// js/gameObjects/controlPanel.js
import Interactable from './interactable.js';
import Light from '../objects/light.js';
import Gauge from '../objects/gauge.js';
import GearShiftLever from '../objects/gearShiftLever.js';
import Button from '../objects/button.js';
import { toggleIgnition } from '../objects/controls.js';
import { getGameState } from '../modules/gameManager.js';
import { getRGBA } from '../utils/helpers.js';

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
    this.MONITOR_LEFT_SIZE   = { width: 12*29, height: 12*15 - 4 };
    this.MONITOR_RIGHT_SIZE  = { width: 12*29, height: 12*15 - 4 };
    this.CENTRAL_PANEL_SIZE  = { width: this.width, height: this.height };
    this.GEARBOX_CANVAS_SIZE = { width: 12*8,  height: 12*5 - 4  };

    const state = getGameState();

    this.elements = {
      levers: {
        gearShiftLever: new GearShiftLever({
          body: this.body,
          x: this.width / 2 - 12*10 + 6, y: 22,
          width: 108,
          channelLen: 152,
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
          label: 'RPM',
        }),
        speedRPM: new Gauge({
          body: this.body,
          x: 12*10 + 3, y: 8 - 12*6, radius: 33,
          maxValue: state.mech.engine.maxSpeed,
          divisions: state.mech.engine.maxSpeed / 20,
          redZoneStart: 0.8,
          label: 'Speed',
        })
      },
      buttons: {
        ignitionBtn: new Button({
          body: this.body,
          x: 12*22 + 5, y: - 12*4,
          radius: 17, svg: this.icons.ignition,
          eventType: 'ignitionToggle',
          onClick: toggleIgnition
        })
      },
      lights: {
        clutchLight: new Light({
          body: this.body,
          x: this.width / 2 - 12*10 + 6, y: 2 - 12*8, radius: 8,
          label: 'Clutch',
          eventType: 'clutchToggle',
        })
      }
    }    
  }

  returnElements() {
    return this.elements;
  }

  render(biggerContext, physicsElements) {
    const state = getGameState();
  
    this.drawLeftMonitorStatic(state, physicsElements.leftMonitor, biggerContext);
    this.drawRightMonitorStatic(state, physicsElements.rightMonitor, biggerContext);
    this.drawCentralPanelStatic(state, physicsElements.centralPanel, biggerContext);

    this.elements.levers.gearShiftLever.render(biggerContext);
    this.elements.gauges.gaugePRM.render(state.mech.status.baseRPM, biggerContext);
    this.elements.gauges.speedRPM.render(state.mech.status.movement.speedApprox, biggerContext);
    this.elements.buttons.ignitionBtn.render(biggerContext);
    this.elements.lights.clutchLight.render(biggerContext);
  }

  drawLeftMonitorStatic(state, body, biggerContext) {
    this.canvases.leftMonitor           = document.createElement('canvas');
    this.canvases.leftMonitor.width     = this.MONITOR_LEFT_SIZE.width;
    this.canvases.leftMonitor.height    = this.MONITOR_LEFT_SIZE.height;
    this.canvases.leftMonitor.ctx       = this.canvases.leftMonitor.getContext('2d');

    let ctx = this.canvases.leftMonitor.ctx;

    ctx.clearRect(0, 0, this.MONITOR_LEFT_SIZE.width, this.MONITOR_LEFT_SIZE.height);
    ctx.fillStyle = getRGBA('dark-cyan', 0.1);
    ctx.fillRect(0, 0, this.MONITOR_LEFT_SIZE.width, this.MONITOR_LEFT_SIZE.height);    

    const values = [
      { label:'Steps',  pct: state.mech.status.movement.stepCount }
    ];
    if (DEBUG) {
      values.push({ label:'[DEBUG]Torque',  pct: Math.round(state.mech.status.torque) });
    }
    
    values.forEach((v,i) => {
        ctx.fillStyle = getRGBA('white', 0.8);
        ctx.fillText(`${ v.label }: ${ v.pct }`, 36, 12*2*i+24+4);
    });

    biggerContext.save();
    biggerContext.translate(body.position.x + 9, body.position.y - 2);
    biggerContext.rotate(body.angle);
    biggerContext.drawImage(
        this.canvases.leftMonitor,
        -this.MONITOR_LEFT_SIZE.width  / 2,
        -this.MONITOR_LEFT_SIZE.height  / 2,
        this.MONITOR_LEFT_SIZE.width,
        this.MONITOR_LEFT_SIZE.height
    );
    biggerContext.restore();
  }

  drawRightMonitorStatic(state, body, biggerContext) {
    this.canvases.rightMonitor          = document.createElement('canvas');
    this.canvases.rightMonitor.width    = this.MONITOR_LEFT_SIZE.width;
    this.canvases.rightMonitor.height   = this.MONITOR_LEFT_SIZE.height;
    this.canvases.rightMonitor.ctx      = this.canvases.rightMonitor.getContext('2d');

    let ctx = this.canvases.rightMonitor.ctx;

    ctx.clearRect(0, 0, this.MONITOR_RIGHT_SIZE.width, this.MONITOR_RIGHT_SIZE.height);
    ctx.fillStyle = getRGBA('dark-cyan', 0.1);
    ctx.fillRect(0, 0, this.MONITOR_RIGHT_SIZE.width, this.MONITOR_RIGHT_SIZE.height);

    const values = [
        { label:`Press "Space" to toggle the Clutch.`, pct: null },
        { label:`Use "W" and "S" to control Energy Output.`, pct: null },
        { label:`To begin, press the red ignition button.`, pct: null },
        { label:'Energy', pct: state.mech.status.energyOutput/state.mech.reactor.maxOutput },
        { label:'Heat',   pct: state.mech.status.bars.heat/state.mech.reactor.maxHeat },
        { label:'Fuel',   pct: state.mech.status.bars.fuel/state.mech.reactor.maxFuel }
    ];
    values.forEach((v,i) => {
        if (v.pct) {
          ctx.fillStyle = getRGBA('dark-cyan', 0.2);
          ctx.fillRect(24, 12*2*i+12, (this.MONITOR_RIGHT_SIZE.width-48)*v.pct, 24);
          ctx.fillStyle = getRGBA('white', 0.8);
          ctx.fillText(`${ v.label }: ${ Math.round(v.pct*100) }%`, 36, 12*2*i+24+4);
        } else {
          ctx.fillStyle = getRGBA('white', 0.8);
          ctx.fillText(`${ v.label }`, 36, 12*2*i+24+4);
        };
        
    });

    biggerContext.save();
    biggerContext.translate(body.position.x - 8, body.position.y - 2);
    biggerContext.rotate(body.angle);
    biggerContext.drawImage(
        this.canvases.rightMonitor,
        -this.MONITOR_RIGHT_SIZE.width  / 2,
        -this.MONITOR_RIGHT_SIZE.height  / 2,
        this.MONITOR_RIGHT_SIZE.width,
        this.MONITOR_RIGHT_SIZE.height
    );
    biggerContext.restore();
  }

  drawCentralPanelStatic(state, body, biggerContext) {
    this.canvases.centralPanel          = document.createElement('canvas');
    this.canvases.centralPanel.width    = this.CENTRAL_PANEL_SIZE.width;
    this.canvases.centralPanel.height   = this.CENTRAL_PANEL_SIZE.height;
    this.canvases.centralPanel.ctx      = this.canvases.centralPanel.getContext('2d');

    let ctx = this.canvases.centralPanel.ctx;

    ctx.fillStyle = getRGBA('auburn', 0);
    ctx.fillRect(0, 18, this.CENTRAL_PANEL_SIZE.width, this.CENTRAL_PANEL_SIZE.height - 38);

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
