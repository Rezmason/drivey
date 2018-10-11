"use strict";

class Buttons {
  constructor() {
    this.listeners = [];
    this.awakeTimer = null;
    this.buttonsContainer = document.createElement("div");
    this.buttonsContainer.id = "buttonsContainer";
    this.element = document.createElement("div");
    this.element.id = "buttons";
    document.body.appendChild(this.buttonsContainer);
    this.buttonsContainer.appendChild(this.element);

    this.addButton("cruise", 3, [0, 1, 2, 3], value => {
      const numLights = parseInt(value);
      return `auto<br>drive<br><br>${
        Array(3).fill().map((_, index) => {
          return `<span class="light ${numLights > index ? "on" : "off"}"></span>`;
        }).join(" ")
      }`;
    });

    this.addButton("dashboard", true, [true, false], value => {
      return `show<br>dash<br><br><span class="light ${value === "true" ? "on" : "off"}"></span>`;
    });

    this.addButton("npcCars", 0, [0, 8, 16, 24], value => {
      const numLights = parseInt(value) / 8;
      return `other<br>cars<br><br>${
        Array(3).fill().map((_, index) => {
          return `<span class="light ${numLights > index ? "on" : "off"}"></span>`;
        }).join(" ")
      }`;
    });

    this.addButton("camera", "driver", ["driver", "overhead", "world"], value => {
      return `view<br>from<br><br><span class="indicator">${value}</span>`;
    });

    this.addButton("rearView", false, [true, false], value => {
      return `rear<br>view<br><br><span class="light ${value === "true" ? "on" : "off"}"></span>`;
    });

    this.addButton("drivingSide", "right", ["left", "right"], value => {
      return `drive<br>on<br><br><span class="indicator">${value}</span>`;
    });

    this.addButton("music", "", [""], value => `mix<br>tape<br><br><span class="indicator">play</span><br>`);

    this.addButton("level", "industrial", ["night", "tunnel", "city", "industrial", "warp", "spectre", "beach"], value => {
      return `current<br>level<br><br><span class="indicator">${value}</span>`;
    });

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
    if(this.buttonsContainer.className == "awake"){ return; }
    clearTimeout(this.awakeTimer)
    this.buttonsContainer.className = "awake"  
    this.awakeTimer = setTimeout(() => { this.buttonsContainer.className = ""; }, 1000)
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
