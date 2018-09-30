class Buttons {
  constructor() {
    this.listeners = [];
    this.element = document.createElement("div");
    document.body.appendChild(this.element);

    this.addButton("steering", true, [true, false]);
    this.addButton("dashboard", true, [true, false]);
    this.addButton("npcCars", 0, [0, 8, 16, 24]);
    this.addButton("camera", "firstPerson", ["firstPerson", "birdseye"]);
    this.addButton("rearView", false, [true, false]);
    this.addButton("drivingSide", "right", ["left", "right"]);
    this.addButton("level", "industrial", ["night", "tunnel", "city", "industrial", "warp", "spectre", "beach"]);
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

  addButton(id, defaultValue, allValues) {
    allValues = allValues.map(value => value.toString());
    let value = defaultValue;
    let index = allValues.indexOf(value);
    if (allValues.length > 2) {
      let select = document.createElement("select");
      allValues.forEach(value => {
        const option = document.createElement("option");
        option.value = value;
        option.innerText = `${id} : ${value}`;
        select.appendChild(option);
      });
      this.element.appendChild(select);
      select.addEventListener("change", () => {
        index = allValues.indexOf(select.value);
        value = allValues[index];
        this.dispatch(id, value);
      });
    } else {
      let button = document.createElement("button");
      button.name = id;
      button.type = "button";
      button.innerText = `${id} : ${value}`;
      this.element.appendChild(button);
      button.addEventListener("click", () => {
        index = (index + 1) % allValues.length;
        value = allValues[index];
        button.innerText = `${id} : ${value}`;
        this.dispatch(id, value);
      });
    }
  }
}
