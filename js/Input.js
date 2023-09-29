class Input {
  constructor() {
    this.slow = false;
    this.fast = false;
    this.gasPedal = 0;
    this.brakePedal = 0;
    this.handbrake = 0;
    this.steer = 0;
    this.minCruiseSpeed = 0;
    this.manualSteerSensitivity = 1;
    this.autoSteerSensitivity = 1;
    this.cruiseSpeedMultiplier = 1;
    this.laneShift = 0;
  }

  update() {}
}

const touchesFrom = (event) => Array.from(event.changedTouches);

class TouchInput extends Input {
  constructor() {
    super();
    this.manualSteerSensitivity = 0.025;
    this.deltas = new Map();

    document.addEventListener("touchstart", (event) => {
      touchesFrom(event)
        .filter((touch) => touch.target.type !== "button")
        .forEach((touch) => {
          this.deltas.set(touch.identifier, {
            x: touch.clientX,
            y: touch.clientY,
            dx: 0,
            dy: 0,
          });
        });
    });
    document.addEventListener("touchend", (event) => {
      touchesFrom(event)
        .filter((touch) => this.deltas.has(touch.identifier))
        .forEach((touch) => {
          this.deltas.delete(touch.identifier);
        });
    });
    document.addEventListener("touchmove", (event) => {
      touchesFrom(event)
        .filter((touch) => this.deltas.has(touch.identifier))
        .forEach((touch) => {
          const delta = this.deltas.get(touch.identifier);
          [delta.dx, delta.dy] = [touch.clientX - delta.x, touch.clientY - delta.y];
        });
    });
    document.addEventListener("touchcancel", (event) => this.deltas.clear());
    document.addEventListener("mousedown", (event) => {
      if (event.target.type === "button") return;
      if (event.button !== 0) return;
      this.deltas.set(-1, { x: event.clientX, y: event.clientY, dx: 0, dy: 0 });
    });
    document.addEventListener("mouseup", (event) => this.deltas.delete(-1));
    document.addEventListener("mousemove", (event) => {
      const delta = this.deltas.get(-1);
      if (delta != null) [delta.dx, delta.dy] = [event.clientX - delta.x, event.clientY - delta.y];
    });
    document.addEventListener("mouseout", (event) => this.deltas.delete(-1));
  }

  update() {
    const total = { x: 0, y: 0 };

    for (const delta of this.deltas.values()) {
      total.x += delta.dx;
      total.y += delta.dy;
    }

    const minDimension = Math.min(window.innerWidth, window.innerHeight);

    total.x = Math.min(1, Math.max(-1, (total.x * 2) / minDimension));
    total.y = Math.min(1, Math.max(-1, (total.y * 2) / minDimension));

    this.steer = -total.x;
    this.gasPedal = total.y < 0 ? -total.y : 0;
    this.brakePedal = total.y > 0 ? total.y : 0;
  }
}

class KeyboardInput extends Input {
  constructor() {
    super();
    this.manualSteerSensitivity = 0.025;
    this.keysDown = new Set();
    document.addEventListener("keydown", (event) => this.keysDown.add(event.code));
    document.addEventListener("keyup", (event) => this.keysDown.delete(event.code));
  }

  update() {
    this.slow = this.keysDown.has("ShiftLeft") || this.keysDown.has("ShiftRight");
    this.fast = this.keysDown.has("ControlLeft") || this.keysDown.has("ControlRight");
    this.gasPedal = this.keysDown.has("ArrowUp") ? 1 : 0;
    this.brakePedal = this.keysDown.has("ArrowDown") ? 1 : 0;
    this.handbrake = this.keysDown.has("Space") ? 1 : 0;
    this.steer = 0;
    if (this.keysDown.has("ArrowLeft")) this.steer += 1;
    if (this.keysDown.has("ArrowRight")) this.steer -= 1;
  }
}

class OneSwitchInput extends Input {
  constructor() {
    super();
    this.manualSteerSensitivity = 0.0125;
    this.autoSteerSensitivity = 0.5;
    this.minCruiseSpeed = 0.5;
    this.cruiseSpeedMultiplier = 4;
    this.shiftSpeed = -0.2;

    document.addEventListener("click", (event) => {
      if (event.target.type !== "button") this.shiftSpeed *= -1;
    });
    document.addEventListener("touchstart", (event) => {
      if (event.target.type !== "button") this.shiftSpeed *= -1;
    });
  }

  update() {
    this.laneShift += this.shiftSpeed;
  }
}

class EyeGazeInput extends Input {
  constructor() {
    super();
    this.manualSteerSensitivity = 0.025;
    this.autoSteerSensitivity = 1;
    this.minCruiseSpeed = 0.5;
    this.cruiseSpeedMultiplier = 4;
    this.xRatio = 0.5;
    this.yRatio = 0.5;

    document.addEventListener("mousemove", (event) => {
      this.xRatio = event.clientX / window.innerWidth;
      this.yRatio = event.clientY / window.innerWidth;
    });
    document.addEventListener("touchstart", (event) => {
      this.xRatio = touchesFrom(event).pop().clientX / window.innerWidth;
      this.yRatio = touchesFrom(event).pop().clientY / window.innerWidth;
    });
  }

  update() {
    const HORIZONTAL_DEAD_ZONE = 0.45;
    const VERTICAL_DEAD_ZONE = 0.35;

    this.steer = 0;
    if (this.xRatio < 0.5 - HORIZONTAL_DEAD_ZONE) this.steer = 1;
    if (this.xRatio > 0.5 + HORIZONTAL_DEAD_ZONE) this.steer = -1;

    this.gasPedal = this.yRatio < 0.5 - VERTICAL_DEAD_ZONE ? 1 : 0;
    this.brakePedal = this.yRatio > 0.5 + VERTICAL_DEAD_ZONE ? 1 : 0;
  }
}

const controlSchemesByName = new Map([
  ["touch", new TouchInput()],
  ["arrows", new KeyboardInput()],
  ["1 switch", new OneSwitchInput()],
  ["eye gaze", new EyeGazeInput()],
]);

export { Input, controlSchemesByName };
