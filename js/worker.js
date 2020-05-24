import modelLevel from "./modelLevel.js";

addEventListener("message", ({ data }) => {
  const level = modelLevel(data);
  postMessage(level);
});
