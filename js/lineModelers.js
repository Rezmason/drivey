import { getOffsetPoints, makeCirclePath, makePolygonPath } from "./paths.js";
import { fract } from "./math.js";

const modelSolidLine = ({ spacing, road, x, width, start, end }) => {
  if (start === end) return [];
  width = Math.abs(width);
  const outsidePoints = getOffsetPoints(road.curve, x - width / 2, start, end, spacing / road.length);
  const insidePoints = getOffsetPoints(road.curve, x + width / 2, start, end, spacing / road.length);
  outsidePoints.reverse();
  if (Math.abs(end - start) < 1) {
    return [makePolygonPath(outsidePoints.concat(insidePoints))];
  } else {
    return [makePolygonPath(outsidePoints), makePolygonPath(insidePoints)];
  }
};

const modelDashedLine = ({ spacing, length, road, x, width, start, end }) => {
  if (start === end) return [];
  start = fract(start);
  end = end === 1 ? 1 : fract(end);
  if (end < start) end++;
  const dashSpan = (length + spacing) / road.length;
  const dashLength = (dashSpan * length) / (length + spacing);
  const dashes = [];
  for (let dashStart = start; dashStart < end; dashStart += dashSpan) {
    dashes.push(
      modelSolidLine({
        road,
        x,
        width,
        start: dashStart,
        end: Math.min(end, dashStart + dashLength)
      })
    );
  }
  return dashes.flat(); // TODO: array map
};

const modelDottedLine = ({ spacing, road, x, width, start, end }) => {
  if (start === end) return [];
  const positions = getOffsetPoints(road.curve, x, start, end, spacing / road.length);
  return positions.map(pos => makeCirclePath(pos.x, pos.y, width)).flat();
};

const lineModelersByType = {
  solid: modelSolidLine,
  dashed: modelDashedLine,
  dotted: modelDottedLine
};

const partModelersByType = {
  disk: modelDottedLine,
  box: modelDashedLine,
  wire: modelSolidLine
};

export { lineModelersByType, partModelersByType };
