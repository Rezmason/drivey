package js.three;

import js.html.*;

@:native("THREE.PathActions")
extern enum PathActions
{
	MOVE_TO;
	LINE_TO;
	QUADRATIC_CURVE_TO;
	BEZIER_CURVE_TO;
	CSPLINE_THRU;
	ARC;
	ELLIPSE;
}