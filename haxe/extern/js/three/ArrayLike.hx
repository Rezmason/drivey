package js.three;

abstract ArrayLike<T>(Dynamic) from { var length(default, never):Int; } to { var length(default, never):Int; }
{
	@:arrayAccess
	public inline function get(key:Int)
	{
		return this[key];
	}
	
	@:arrayAccess
	public inline function arrayWrite(k:Int, v:T) : T
	{
		this[k] = v;
		return v;
	}
}