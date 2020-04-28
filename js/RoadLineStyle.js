export default {
  type: {
    SOLID: "SOLID",
    DASH: "DASH",
    DOT: "DOT"
  },

  SOLID: pointSpacing => ({ type: "SOLID", pointSpacing }),
  DASH: (on, off, pointSpacing) => ({ type: "DASH", on, off, pointSpacing }),
  DOT: spacing => ({ type: "DOT", spacing })
};
