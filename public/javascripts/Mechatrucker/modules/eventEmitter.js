// js/eventEmitter.js

class EventEmitter {
    constructor() {
        this.events = {};
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
        console.log(`${eventName} emitted, payload:`);
        console.log(data);
        if (!this.events[eventName]) return;
        this.events[eventName].forEach(callback => callback(data));
    }
  }
  
  const emitter = new EventEmitter();
  export default emitter;  