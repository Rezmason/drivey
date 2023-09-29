import { getOffsetPoints, makeCirclePath, makePolygonPath } from "./paths.js";
import { fract } from "./math.js";

const modelSolidLine = ({ spacing, curve, x, width, start, end }) => {
  if (start === end) return [];
  width = Math.abs(width);
  const outsidePoints = getOffsetPoints(curve, x - width / 2, start, end, spacing);
  const insidePoints = getOffsetPoints(curve, x + width / 2, start, end, spacing);
  outsidePoints.reverse();
  if (Math.abs(end - start) < 1) {
    return [makePolygonPath(outsidePoints.concat(insidePoints))];
  } else {
    return [makePolygonPath(outsidePoints), makePolygonPath(insidePoints)];
  }
};

const modelDashedLine = ({ spacing, length, curve, x, width, start, end }) => {
  if (start === end) return [];
  start = fract(start);
  end = end === 1 ? 1 : fract(end);
  if (end < start) end++;

  const dashSpan = length + spacing;
  const numDashes = Math.floor((end - start) / dashSpan);
  return Array(numDashes)
    .fill()
    .map((_, index) => start + index * dashSpan)
    .map((start) =>
      modelSolidLine({
        curve,
        x,
        width,
        start,
        end: Math.min(end, start + length),
      })
    )
    .flat();
};

const modelDottedLine = ({ spacing, curve, x, width, start, end }) => {
  if (start === end) return [];
  const positions = getOffsetPoints(curve, x, start, end, spacing);
  return positions.map((pos) => makeCirclePath(pos.x, pos.y, width)).flat();
};

const lineModelersByType = {
  solid: modelSolidLine,
  dashed: modelDashedLine,
  dotted: modelDottedLine,
};

const partModelersByType = {
  disk: modelDottedLine,
  box: modelDashedLine,
  wire: modelSolidLine,
};

export { lineModelersByType, partModelersByType };
