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
  /**
   * A container component for cockpit controls.
   * Renders a panel and propagates input to its child interactables.
   *
   * @param {Object} options
   * @param {number} options.x       – top‐left x of panel
   * @param {number} options.y       – top‐left y of panel
   * @param {number} options.width   – panel width
   * @param {number} options.height  – panel height
   * @param {string} [options.fill]  – background color
   * @param {string} [options.stroke]– border color
   * @param {number} [options.lineWidth] – border thickness
   */
  constructor(options = {}) {
    super({});
    this.x         = options.x;
    this.y         = options.y;
    this.width     = options.width;
    this.height    = options.height;
    this.body      = options.body;
    this.icons     = options.icons
    this.canvases = {};
    this.MONITOR_LEFT_SIZE   = { width: 12*29, height: 12*15 - 4 };
    this.MONITOR_RIGHT_SIZE  = { width: 12*29, height: 12*15 - 4 };
    this.CENTRAL_PANEL_SIZE  = { width: 12*27, height: 12*14     };
    this.GEARBOX_CANVAS_SIZE = { width: 12*8,  height: 12*5 - 4  };
    this.elements = {
        gearShiftLever: new GearShiftLever({
          panelBody: this.body,
          x: this.width / 2 - 12*10 + 6,
          y: 48,
          width: 108,
          channelLen: 152,
          handleRadius: 20,
        }),
        ignitionBtn: new Button({
            x: this.width - 12*19,
            y: this.y + 12*12,
            radius: 18, svg: this.icons.ignition,
            eventType: 'ignitionToggle',
            onClick: toggleIgnition
        })
    }
  }

  returnElements() {
    return this.elements;
  }

  render(biggerContext, physicsElements) {
    const state = getGameState();
  
    this.drawLeftMonitor(state, physicsElements.leftMonitor, biggerContext);
    this.drawRightMonitor(state, physicsElements.rightMonitor, biggerContext);
    this.drawCentralPanel(state, physicsElements.centralPanel, biggerContext);
    this.drawGearbox(state, physicsElements.centralPanel, biggerContext);

    this.elements.gearShiftLever.render(biggerContext);
    this.elements.ignitionBtn.render(
      physicsElements.centralPanel,
      { width: this.width, height: this.height },
      biggerContext);
  }

  drawLeftMonitor(state, body, biggerContext) {
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

  drawRightMonitor(state, body, biggerContext) {
    this.canvases.rightMonitor          = document.createElement('canvas');
    this.canvases.rightMonitor.width    = this.MONITOR_LEFT_SIZE.width;
    this.canvases.rightMonitor.height   = this.MONITOR_LEFT_SIZE.height;
    this.canvases.rightMonitor.ctx      = this.canvases.rightMonitor.getContext('2d');

    let ctx = this.canvases.rightMonitor.ctx;

    ctx.clearRect(0, 0, this.MONITOR_RIGHT_SIZE.width, this.MONITOR_RIGHT_SIZE.height);
    ctx.fillStyle = getRGBA('dark-cyan', 0.1);
    ctx.fillRect(0, 0, this.MONITOR_RIGHT_SIZE.width, this.MONITOR_RIGHT_SIZE.height);

    const values = [
        { label:'Energy', pct: state.mech.status.energyOutput/state.mech.reactor.maxOutput },
        { label:'Heat',   pct: state.mech.status.heat/state.mech.reactor.maxHeat },
        { label:'Fuel',   pct: state.mech.status.fuel/state.mech.reactor.maxFuel }
    ];
    values.forEach((v,i) => {
        ctx.fillStyle = getRGBA('dark-cyan', 0.2);
        ctx.fillRect(24, 12*2*i+12, (this.MONITOR_RIGHT_SIZE.width-48)*v.pct, 24);
        ctx.fillStyle = getRGBA('white', 0.8);
        ctx.fillText(`${ v.label }: ${ Math.round(v.pct*100) }%`, 36, 12*2*i+24+4);
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

  drawCentralPanel(state, body, biggerContext) {
    this.canvases.centralPanel          = document.createElement('canvas');
    this.canvases.centralPanel.width    = this.CENTRAL_PANEL_SIZE.width;
    this.canvases.centralPanel.height   = this.CENTRAL_PANEL_SIZE.height;
    this.canvases.centralPanel.ctx      = this.canvases.centralPanel.getContext('2d');

    let ctx = this.canvases.centralPanel.ctx;

    ctx.fillStyle = getRGBA('auburn', 0);
    ctx.fillRect(0, 0, this.CENTRAL_PANEL_SIZE.width, this.CENTRAL_PANEL_SIZE.height);

    this.drawRPMGauge(state, ctx);
    this.drawSpeedGauge(state, ctx);

    biggerContext.save();
    biggerContext.translate(body.position.x + 12*13, body.position.y - 12*7 - 2);
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

  drawGearbox(state, body, biggerContext) {
    this.canvases.gearbox               = document.createElement('canvas');
    this.canvases.gearbox.width         = this.GEARBOX_CANVAS_SIZE.width;
    this.canvases.gearbox.height        = this.GEARBOX_CANVAS_SIZE.height;
    this.canvases.gearbox.ctx           = this.canvases.gearbox.getContext('2d');

    let ctx = this.canvases.gearbox.ctx;

    ctx.fillStyle = getRGBA('auburn', 0);
    ctx.fillRect(0, 0, this.GEARBOX_CANVAS_SIZE.width, this.GEARBOX_CANVAS_SIZE.height);

    this.drawClutchLight(state, ctx);

    biggerContext.save();
    biggerContext.translate(body.position.x + 12*35 + 4, body.position.y - 12*6);
    biggerContext.rotate(body.angle);
    biggerContext.drawImage(
        this.canvases.gearbox,
        -this.GEARBOX_CANVAS_SIZE.width  / 2,
        -this.GEARBOX_CANVAS_SIZE.height  / 2,
        this.GEARBOX_CANVAS_SIZE.width,
        this.GEARBOX_CANVAS_SIZE.height
    );
    biggerContext.restore();
  }

  drawRPMGauge(state, ctx) {
    const radius = 33;
    let cx = 0;
    let cy = 0;

    cx = 12*9 + 1 + radius * 2 + radius;
    cy = 8 + radius;

    const newGauge = new Gauge({
        x: cx, y: cy, radius: radius,
        divisions: state.mech.engine.maxBaseRPM,
        redZoneStart: 0.8,
        maxValue: state.mech.engine.maxBaseRPM,
        label: 'RPM',
    });

    newGauge.setValue(state.mech.status.baseRPM);
    newGauge.render(ctx);
  }

  drawSpeedGauge(state, ctx) {
    const radius = 33;
    let cx = 0;
    let cy = 0;

    cx = 12*17 - 13 + radius * 2 + radius;
    cy = 8 + radius;

    const newGauge = new Gauge({
        x: cx, y: cy, radius: radius,
        divisions: state.mech.engine.maxSpeed / 20,
        redZoneStart: 0.8,
        maxValue: state.mech.engine.maxSpeed,
        label: 'Speed',
    });

    newGauge.setValue(state.mech.status.movement.speedApprox);
    newGauge.render(ctx);
  }

  drawClutchLight(state, ctx) {
    const radius = 8;
    let cx = 0;
    let cy = 0;

    cx = 6 + radius * 2;
    cy = 16 + radius;

    let newLight = new Light({
        x: cx, y: cy, radius: radius,
        label: 'Clutch',
        state: state.mech.status.flags.clutch
    });
    
    newLight.render(ctx);
  }

}
