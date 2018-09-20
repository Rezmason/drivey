"use strict";

const RoadLineStyle = {
    type: {
        SOLID: "SOLID",
        DASH: "DASH",
        DOT: "DOT",
    },

    SOLID: () => ({ type:"SOLID" }),
    DASH: (on, off) => ({ type:"DASH", on, off }),
    DOT: (spacing) => ({ type:"DOT", spacing }),
};

