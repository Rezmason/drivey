"use strict";

class Input {
  constructor() {
    this.keysDown = new Set();
    document.addEventListener("keydown", this.onKeyDown.bind(this));
    document.addEventListener("keyup", this.onKeyUp.bind(this));
  }

  onKeyDown(event) {
    this.keysDown.add(event.code);
  }

  onKeyUp(event) {
    this.keysDown.delete(event.code);
  }

  isKeyDown(code) {
    return this.keysDown.has(code);
  }
}
