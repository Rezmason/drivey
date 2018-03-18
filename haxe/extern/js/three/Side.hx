package js.three;

import js.html.*;

@:native("THREE.Side")
@:enum extern abstract Side(Int) to Int
{
    var FrontSide = 0;
    var BackSide = 1;
    var DoubleSide = 2;
}
