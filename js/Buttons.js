import isTouchDevice from "./isTouchDevice.js";

export default class Buttons {
  constructor() {
    this.listeners = [];
    this.buttonsContainer = document.createElement("div");
    this.buttonsContainer.id = "buttonsContainer";
    this.element = document.createElement("div");
    this.element.id = "buttons";
    this.isMouseOverEmbeddedPlaylist = false;
    this.isMouseOver = false;
    document.body.appendChild(this.buttonsContainer);
    this.buttonsContainer.appendChild(this.element);

    this.addButton("cruise", 2, [0, 1, 2, 3], (value) => {
      const index = parseInt(value);
      return `<div class='label'>autopilot</div>
      <div class='option'>${Array(3)
        .fill()
        .map((_, id) => {
          return `<span class="light ${index > id ? "on" : "off"}"></span>`;
        })
        .join(" ")}</div>`;
    });

    this.addButton("npcCars", 2, [0, 1, 2, 3], (value) => {
      const index = parseInt(value);
      const lights = Array(3)
        .fill()
        .map((_, id) => `<span class="light ${index > id ? "on" : "off"}"></span>`)
        .join(" ");
      return `<div class='label'>cars</div>
      <div class='option'>${lights}</div>`;
    });

    this.addButton(
      "drivingSide",
      "right",
      ["left", "right"],
      (value) => `
      <div class='label'>&nbsp;&nbsp;side&nbsp;&nbsp;</div>
        <div class='option'>
        <span class="indicator">${value}</span>
      </div>`
    );

    this.addButton(
      "camera",
      "driver",
      ["driver", "hood", "rear", "backseat", "chase", "aerial", "satellite"],
      (value) => `
      <div class='label'>camera</div>
        <div class='option'>
        <span class="indicator">${value}</span>
      </div>`
    );

    this.addButton(
      "effect",
      "ombré",
      ["ombré", "wireframe", "technicolor", "merveilles"],
      (value) => `
      <div class='label'>effect</div>
        <div class='option'>
        <span class="indicator">${value}</span>
      </div>`
    );

    this.addButton(
      "controls",
      isTouchDevice ? "touch" : "arrows",
      ["touch", "arrows", "1 switch", "eye gaze"],
      (value) => `
      <div class='label'>controls</div>
        <div class='option'>
        <span class="indicator">${value.replace("_", "<br>")}</span>
      </div>`
    );

    this.addButton(
      "quality",
      "high",
      ["high", "medium", "low"],
      (value) => `
      <div class='label'>quality</div>
        <div class='option'>
        <span class="indicator">${value}</span>
      </div>`
    );

    this.addButton(
      "music",
      "",
      [""],
      (value) => `
      <div class='label'>mixtape</div>
        <div class='option'>
        <span class="indicator">play</span>
      </div>`
    );

    const embeddedPlaylist = document.createElement("div");
    embeddedPlaylist.id = "embedded-playlist";
    embeddedPlaylist.innerHTML = `
    <div id="backdrop"></div>
    <iframe
      src="https://open.spotify.com/embed/playlist/4ukrs3cTKjTbLoFcxqssXi?theme=0"
      src=""
      allowtransparency="true"
      allow="autoplay; clipboard-write; encrypted-media;"
      scrolling="no"
      loading="lazy">
    </iframe>`;
    this.element.appendChild(embeddedPlaylist);
    embeddedPlaylist.addEventListener("mouseover", () => (this.isMouseOverEmbeddedPlaylist = true));
    embeddedPlaylist.addEventListener("mouseout", () => (this.isMouseOverEmbeddedPlaylist = false));

    this.addButton(
      "level",
      "industrial",
      ["industrial", "night", "city", "tunnel", "beach", "warp", "spectre", "nullarbor", "marshland"],
      (value) => `
      <div class='label'>level select</div>
        <div class='option'>
        <span class="indicator">${value}</span>
      </div>`
    );

    const stylesheet = Array.from(document.styleSheets).find((sheet) => sheet.title === "main");
    this.bodyRule = Array.from(stylesheet.cssRules).find((rule) => rule.selectorText === "body, colors");

    document.addEventListener("mousemove", this.onMouse.bind(this), false);
    document.addEventListener("mousedown", this.onMouse.bind(this), false);
    document.addEventListener("mouseup", this.onMouse.bind(this), false);
    document.addEventListener("touchstart", this.onMouse.bind(this), false);
    document.addEventListener("touchmove", this.onMouse.bind(this), false);
    document.addEventListener("touchend", this.onMouse.bind(this), false);

    this.element.addEventListener("mouseover", () => (this.isMouseOver = true));
    this.element.addEventListener("mouseout", () => (this.isMouseOver = false));
  }

  onMouse() {
    this.wakeUp();
  }

  wakeUp() {
    if (this.buttonsContainer.classList.contains("awake")) return;
    clearTimeout(this.awakeTimer);
    this.buttonsContainer.classList.toggle("awake", true);
    this.awakeTimer = setTimeout(() => {
      this.buttonsContainer.classList.toggle("awake", false);
      if (this.isMouseOver || this.isMouseOverEmbeddedPlaylist) {
        this.wakeUp();
      }
    }, 3000);
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
    const button = document.createElement("button");
    allValues = allValues.map((value) => value.toString());
    button.allValues = allValues;
    button.value = defaultValue.toString();
    button.index = allValues.indexOf(button.value);
    button.id = `button_${id}`;
    button.name = id;
    button.type = "button";
    button.innerHTML = labelMaker(button.value);
    button.labelMaker = labelMaker;
    this.element.appendChild(button);
    button.addEventListener("click", () => {
      button.index = (button.index + 1) % allValues.length;
      button.value = allValues[button.index];
      button.innerHTML = labelMaker(button.value);
      this.dispatch(id, button.value);
    });
  }

  setButton(id, value) {
    const button = document.getElementById(`button_${id}`);
    button.index = button.allValues.indexOf(value);
    if (button.index === -1) {
      button.index = 0;
    }

    button.value = button.allValues[button.index];
    button.innerHTML = button.labelMaker(button.value);
    this.dispatch(id, button.value);
  }

  setColors(backgroundColor, borderColor, lightColor) {
    this.bodyRule.style.setProperty("--dashboard-background-color", `#${backgroundColor.getHex().toString(16).padStart(6, "0")}`);
    this.bodyRule.style.setProperty("--dashboard-border-color", `#${borderColor.getHex().toString(16).padStart(6, "0")}`);
    this.bodyRule.style.setProperty("--dashboard-light-color", `#${lightColor.getHex().toString(16).padStart(6, "0")}`);
  }

  setWireframe(enabled) {
    this.element.classList.toggle("wireframe", enabled);
  }
}
