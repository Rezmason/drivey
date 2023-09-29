import { Color, Vector2 } from "./../lib/three/three.module.js";

const verbatim = (_) => _;
const safeParseFloat = (s) => {
  const f = parseFloat(s);
  return isNaN(f) ? 0 : f;
};
const safeParseInt = (s) => {
  const i = parseInt(s);
  return isNaN(i) ? 0 : i;
};
const parseNumberList = (s) => s.split(",").map((s) => safeParseFloat(s.trim()));
const parseColor = (s) => new Color(...parseNumberList(s));
const parseVec2 = (s) => new Vector2(...parseNumberList(s));
const parseBool = (s) => s === "true";

export { verbatim, safeParseFloat, safeParseInt, parseNumberList, parseColor, parseVec2, parseBool };
