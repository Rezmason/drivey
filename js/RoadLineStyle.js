"use strict";

var RoadLineStyle = { __ename__ : true, __constructs__ : ["SOLID","DASH","DOT"] };

RoadLineStyle.SOLID = ["SOLID", 0];

RoadLineStyle.SOLID.__enum__ = RoadLineStyle;

RoadLineStyle.DASH = function(on, off) { var $x = ["DASH", 1, on, off]; $x.__enum__ = RoadLineStyle; return $x; };

RoadLineStyle.DOT = function(spacing) { var $x = ["DOT", 2, spacing]; $x.__enum__ = RoadLineStyle; return $x; };
