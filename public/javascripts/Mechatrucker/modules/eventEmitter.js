// js/eventEmitter.js
const LOGGING = true;

class EventEmitter {
    constructor() {
        this.events = {};
        this.lastPayload = {};
    }
  
    subscribe(eventName, fn) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(fn);
    }
  
    unsubscribe(eventName, fn) {
        if (!this.events[eventName]) return;
        this.events[eventName] = this.events[eventName].filter(cb => cb !== fn);
    }
  
    emit(eventName, data) {
        if (this.lastPayload[eventName] !== undefined && this.lastPayload[eventName] === data) { return }
        LOGGING ? console.log(`[EVENT] ${eventName}:`, data) : null;
        this.lastPayload[eventName] = data;
        if (!this.events[eventName]) return;
        this.events[eventName].forEach(callback => callback(data));
    }
  }
  
  const emitter = new EventEmitter();
  export default emitter;  