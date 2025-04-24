// js/gameObjects/controlPanel.js
import Interactable from './interactable.js';
import Light from '../objects/light.js';
import Gauge from '../objects/gauge.js';
import { getGameState } from '../modules/gameManager.js';
import { getRGBA } from '../utils/helpers.js';

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
  constructor({
    x, y, width, height,
    fill = 'transparent',
    stroke = 'transparent',
    lineWidth = 0
  }) {
    super({});
    this.x         = x;
    this.y         = y;
    this.width     = width;
    this.height    = height;
    this.fill      = fill;
    this.stroke    = stroke;
    this.lineWidth = lineWidth;
    this.MONITOR_LEFT_SIZE   = { width: 12*29, height: 12*15 - 4 };
    this.MONITOR_RIGHT_SIZE  = { width: 12*29, height: 12*15 - 4 };
    this.CENTRAL_PANEL_SIZE  = { width: 12*27, height: 12*14     };
    this.GEARBOX_CANVAS_SIZE = { width: 12*8,  height: 12*5 - 4  };
    this.canvases  = {};
  }

  render(biggerContext, physicsElements) {
    const state = getGameState();
    
    this.drawLeftMonitor(state, physicsElements.leftMonitor, biggerContext);
    this.drawRightMonitor(state, physicsElements.rightMonitor, biggerContext);
    this.drawCentralPanel(state, physicsElements.centralPanel, biggerContext);
    this.drawGearbox(state, physicsElements.centralPanel, biggerContext);

  }

  drawLeftMonitor(state, body, biggerContext) {
    this.canvases.leftMonitor           = document.createElement('canvas');
    this.canvases.leftMonitor.width     = this.MONITOR_LEFT_SIZE.width;
    this.canvases.leftMonitor.height    = this.MONITOR_LEFT_SIZE.height;
    this.canvases.leftMonitor.ctx       = this.canvases.leftMonitor.getContext('2d');

    let ctx = this.canvases.leftMonitor.ctx;

    ctx.clearRect(0, 0, this.MONITOR_LEFT_SIZE.width, this.MONITOR_LEFT_SIZE.height);
    ctx.fillStyle = getRGBA('auburn', 0);
    ctx.fillRect(0, 0, this.MONITOR_LEFT_SIZE.width, this.MONITOR_LEFT_SIZE.height);

    ctx.fillStyle = '#0f0';
    ctx.fillText(`Terrain: ${'placeholder'}`, 36, 36);

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
    ctx.fillStyle = getRGBA('auburn', 0);
    ctx.fillRect(0, 0, this.MONITOR_RIGHT_SIZE.width, this.MONITOR_RIGHT_SIZE.height);

    const values = [
        { label:'Energy', pct: state.mech.status.energyOutput/state.mech.reactor.maxOutput },
        { label:'Heat',   pct: state.mech.status.heat/state.mech.reactor.maxHeat },
        { label:'Fuel',   pct: state.mech.status.fuel/state.mech.reactor.maxFuel }
    ];
    values.forEach((v,i) => {
        ctx.fillStyle = getRGBA('dark-cyan', 1);
        ctx.fillRect(24, 12*2*i+12, (this.MONITOR_RIGHT_SIZE.width-48)*v.pct, 24);
        ctx.fillStyle = '#fff';
        ctx.fillText(`${v.label}: ${Math.round(v.pct*100)}%`, 36, 12*2*i+24+4);
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

    cx = 12*16 - 1 + radius * 2 + radius;
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
