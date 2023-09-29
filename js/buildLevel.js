import { Parser } from "./../lib/expr-eval.js";
import { getDefaultValuesForType, getParseFuncForAttribute, getHoistForType } from "./levelSchemas.js";

const parser = new Parser();
const evaluateExpression = (expression, scope) => parser.parse(expression).evaluate(scope);
const braced = /^{(.*)}$/;
const evaluateRawValue = (parser, scope, rawValue) => {
  if (rawValue == null || rawValue === "") return undefined;
  if (typeof rawValue !== "string") return rawValue;

  const expression = rawValue.match(braced)?.[1];
  if (expression != null) {
    return evaluateExpression(expression, scope);
  }

  return parser(rawValue);
};

const dashed = /(.*?)-([a-zA-Z])/g;
const dashedToCamelCase = (s) => s.replace(dashed, (_, a, b) => a + b.toUpperCase());

const simplify = (element, parentScope = {}) => {
  const type = element.tagName.toLowerCase();

  const rawAttributes = {
    ...getDefaultValuesForType(type),
    ...Object.fromEntries(Array.from(element.attributes).map(({ name, value }) => [dashedToCamelCase(name), value])),
  };

  const attributes = Object.fromEntries(
    Object.entries(rawAttributes).map(([name, value]) => [name, evaluateRawValue(getParseFuncForAttribute(type, name), parentScope, value)])
  );

  const hoist = getHoistForType(type)?.(attributes);
  Object.assign(parentScope, hoist);

  const iteratorId = type === "repeat" ? Object.keys(hoist).pop() : undefined;
  const count = type === "repeat" ? hoist[iteratorId] : 1;
  const scopes = Array(count)
    .fill()
    .map((_, index) => ({ ...parentScope, [iteratorId]: index }));
  const children = scopes
    .map((scope) => Array.from(element.children).map((child) => simplify(child, scope)))
    .flat()
    .map((child) => (child.type === "repeat" ? child.children : [child]))
    .flat();

  return { type, id: attributes.id, attributes, children, ...hoist };
};

export default (dom) => simplify(dom.querySelector("drivey"));
