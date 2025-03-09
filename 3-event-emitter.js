class EventEmitter {
  constructor() {
    this.events = {};
  }

  // Subscribe to an event
  on(event, listener) {
    // Implementation here
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }

  // Subscribe to an event only once
  once(event, listener) {
    // Implementation here
    const __wrapper = (...args) => {
      listener(...args);
      this.off(event, __wrapper);
    };
    this.on(event, __wrapper);
  }

  // Unsubscribe from an event
  off(event, listener) {
    // Implementation here
    if (!this.events[event]) {
      return;
    }
    this.events[event] = this.events[event].filter((l) => l !== listener);
  }

  // Remove all listeners for an event
  removeAllListeners(event) {
    // Implementation here
    delete this.events[event];
  }

  // Emit an event
  emit(event, ...args) {
    // Implementation here
    if (!this.events[event]) {
      return;
    }
    this.events[event].forEach((listener) => listener(...args));
  }

  // Get all listeners for an event
  listeners(event) {
    // Implementation here
    return this.events[event] || [];
  }

  // Get all event names
  eventNames() {
    // Implementation here
    return Object.keys(this.events);
  }
}

// Example Usage
const emitter = new EventEmitter();

const greet = (name) => console.log(`Hello, ${name}!`);
const farewell = (name) => console.log(`Goodbye, ${name}!`);

emitter.on("greet", greet);
emitter.emit("greet", "Basit");

emitter.on("farewell", farewell);
emitter.emit("farewell", "Basit");

const onceListener = () => console.log("This should only be logged once");
emitter.once("onceEvent", onceListener);
emitter.emit("onceEvent");
emitter.emit("onceEvent");

console.log("Listeners for greet:", emitter.listeners("greet"));
console.log("Event names:", emitter.eventNames());

emitter.off("greet", greet);
emitter.emit("greet", "Basit");

emitter.removeAllListeners("farewell");
emitter.emit("farewell", "Basit");
