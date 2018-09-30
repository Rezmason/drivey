class Buttons {
  constructor() {
    this.listeners = [];
  }

  addListener(func) {
    if (!this.listeners.includes(func)) {
      this.listeners.push(func);
    }
  }
}
