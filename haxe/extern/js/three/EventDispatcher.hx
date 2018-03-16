package js.three;

import js.html.*;

/**
 * JavaScript events for custom objects
 * 
 * # Example
 *     var Car = function () {
 * 
 *         EventDispatcher.call( this );
 *         this.start = function () {
 * 
 *             this.dispatchEvent( { type: 'start', message: 'vroom vroom!' } );
 * 
 *         };
 * 
 *     };
 * 
 *     var car = new Car();
 *     car.addEventListener( 'start', function ( event ) {
 * 
 *         alert( event.message );
 * 
 *     } );
 *     car.start();
 * 
 * @source src/core/EventDispatcher.js
 */
@:native("THREE.EventDispatcher")
extern class EventDispatcher
{
	/**
	 * JavaScript events for custom objects
	 * 
	 * # Example
	 *     var Car = function () {
	 * 
	 *         EventDispatcher.call( this );
	 *         this.start = function () {
	 * 
	 *             this.dispatchEvent( { type: 'start', message: 'vroom vroom!' } );
	 * 
	 *         };
	 * 
	 *     };
	 * 
	 *     var car = new Car();
	 *     car.addEventListener( 'start', function ( event ) {
	 * 
	 *         alert( event.message );
	 * 
	 *     } );
	 *     car.start();
	 * 
	 * @source src/core/EventDispatcher.js
	 */
	function new() : Void;
	/**
	 * Adds a listener to an event type.
	 */
	function addEventListener(type:String, listener:Event->Void) : Void;
	/**
	 * Adds a listener to an event type.
	 */
	function hasEventListener(type:String, listener:Event->Void) : Void;
	/**
	 * Removes a listener from an event type.
	 */
	function removeEventListener(type:String, listener:Event->Void) : Void;
	/**
	 * Fire an event type.
	 */
	function dispatchEvent(event:{ var type : String; }) : Void;
}