"use strict";

class Buttons {
  constructor() {
    this.listeners = [];
    this.buttonsContainer = document.createElement("div");
    this.buttonsContainer.id = "buttonsContainer";
    this.element = document.createElement("div");
    this.element.id = "buttons";
    document.body.appendChild(this.buttonsContainer);
    this.buttonsContainer.appendChild(this.element);

    this.addButton("cruise", 3, [0, 1, 2, 3], value => {
      const index = parseInt(value);
      return `<div class='label'>autopilot</div>
      <div class='option'>${
        Array(3).fill().map((_, id) => {
          return `<span class="light ${index > id ? "on" : "off"}"></span>`;
        }).join(" ")
      }</div>`;
    });

    this.addButton("npcCars", 0, [0, 1, 2, 3], value => {
      const index = parseInt(value);
      return `<div class='label'>cars</div>
      <div class='option'>${
        Array(3).fill().map((_, id) => {
          return `<span class="light ${index > id ? "on" : "off"}"></span>`;
        }).join(" ")
      }</div>`;
    });

    this.addButton("drivingSide", "right", ["left", "right"], value => `
      <div class='label'>lane</div>
      <div class='option'>
        <span class="indicator">${value}</span>
      </div>`);

    this.addButton("camera", "driver", ["driver", "rear", "overhead", "world"], value => `
      <div class='label'>camera</div>
      <div class='option'>
        <span class="indicator">${value}</span>
      </div>`);


    this.addButton("controls", "touch", ["touch", "arrows", "switch", "eyes"], value => `
      <div class='label'>controls</div>
      <div class='option'>
        <span class="indicator">${value.replace("_", "<br>")}</span>
      </div>`);

    this.addButton("quality", "high", ["high", "medium", "low"], value =>  `
      <div class='label'>quality</div>
      <div class='option'>
        <span class="indicator">${value}</span>
      </div>`);

    this.addButton("music", "", [""], value => `
      <div class='label'>mixtape</div>
      <div class='option'>
        <span class="indicator">play</span>
      </div>`);

    this.addButton("level", "industrial", ["night", "tunnel", "city", "industrial", "warp", "spectre", "beach"], value => `
      <div class='label'>level</div>
      <div class='option'>
        <span class="indicator">${value}</span>
      </div>`);

    const stylesheet = Array.from(document.styleSheets).find(sheet => sheet.title === "main");
    this.bodyRule = Array.from(stylesheet.cssRules).find(rule => rule.selectorText === "body, colors");

    window.addEventListener("mousemove", this.onMouse.bind(this), false);
    window.addEventListener("mousedown", this.onMouse.bind(this), false);
    window.addEventListener("mouseup", this.onMouse.bind(this), false);
  }

  onMouse() {
    this.wakeUp()
  }

  wakeUp() {
    if (this.buttonsContainer.className === "awake") return;
    clearTimeout(this.awakeTimer);
    this.buttonsContainer.className = "awake";
    this.awakeTimer = setTimeout(() => this.buttonsContainer.className = "", 3000);
  }

  addListener(func) {
    if (!this.listeners.includes(func)) {
      this.listeners.push(func);
    }
  }

  dispatch(id, value) {
    for (const listener of this.listeners) {
      listener(id, value);
    }
  }

  addButton(id, defaultValue, allValues, labelMaker) {
    allValues = allValues.map(value => value.toString());
    let value = defaultValue.toString();
    let index = allValues.indexOf(value);
    let button = document.createElement("button");
    button.id = `button_${id}`;
    button.name = id;
    button.type = "button";
    button.innerHTML = labelMaker(value);
    this.element.appendChild(button);
    button.addEventListener("click", () => {
      index = (index + 1) % allValues.length;
      value = allValues[index];
      button.innerHTML = labelMaker(value);
      this.dispatch(id, value);
    });
  }

  setTint(tint) {
    let dashboardColor = tint.clone().multiplyScalar(0.4);
    let litColor = tint.clone().lerp(new THREE.Color(1, 1, 1), 0.25);
    this.bodyRule.style.setProperty("--dashboard-color", `#${dashboardColor.getHex().toString(16).padStart(6, "0")}`);
    this.bodyRule.style.setProperty("--lit-color", `#${litColor.getHex().toString(16).padStart(6, "0")}`);
  }
}
