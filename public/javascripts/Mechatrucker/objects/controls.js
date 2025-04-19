import emitter from '../modules/eventEmitter.js';
import { getGameState } from '../modules/gameManager.js';

export function toggleIgnition() {
    const state = getGameState();
    const newIgnitionStatus = state.mech.status.flags.ignition ? false : true;
    
    emitter.emit('ignitionToggle', newIgnitionStatus);
} 