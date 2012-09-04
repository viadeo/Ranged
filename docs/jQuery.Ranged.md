Class: Ranged {#Ranged}
=========================================

Ranged is a jQuery plugin who allow you to easily create a draggable slider by extending a range input or any arbitrary element.

Ranged Method: constructor {#Ranged:constructor}
-------------------------------------------------------------------

### Syntax:

	$(element).Ranged(options);

### Arguments:

1. options - (object) Options for the plugin.

### Options:

* min - (integer: defaults to 0) The minimum value of the range.
* max - (integer: defaults to 1) The maximum value of the range.
* step - (integer: defaults to 0.01) The value of a step.
* value - (integer: defaults to 0) The start value of the range.
* createBar - (boolean: defaults to true) If true the element for the bar will be created by the plugin.
* createThumb - (boolean: defaults to true) If true the element for the thumb will be created by the plugin.
* rangedClass - (string: defaults to `ranged`) The CSS class used on the container.
* barClass - (string: defaults to `ranged-bar`) The CSS class used on the bar.
* thumbClass - (string: defaults to `ranged-thumb`) The CSS class used on the thumb.

### Events:

* onChange (function) The function to execute when the value of the range has changed; passed the range value.
* onDragStart (function) The function to execute when the user started dragging the range thumb; passed the range value.
* onDragEnd (function) The function to execute after the user ended dragging the range thumb; passed the range value.

Target any <input type="range"> and extend it using Ranged.

Ranged will automaticaly retrieve the values of the `min`, `max`, `step` and `value` attributes and use them for his instance.

### Examples:

#### HTML:

	<input id="my-range" class="ranged" type="range" min="-10" max="10" step="1" value="0" />

#### JavaScript:

	$('#my-range').Ranged({
		onChange: function(value) {
			console.log('Range new value is ' + value);
		}
	});

You can also target any arbitrary element, like a span.

#### HTML:

	<span id="my-range"></span>

#### JavaScript:

	$('#my-range').Ranged({
		min: -10,
		max: 10,
		step: 1,
		onChange: function(value) {
			console.log('Range new value is ' + value);
		}
	});

Then you can style the Ranged elements using CSS. You can find an example of CSS in the ["example" directory](https://github.com/viadeo/Ranged/blob/master/docs).

By default the CSS classes are:

* .ranged - The container
* .ranged-bar - The progress bar
* .ranged-thumb - The draggable element

You can change the classes name using the options.

Ranged Method: value {#Ranged:value-set}
-------------------------------------------------------------------

Set the value of the Ranged instance.

### Syntax:

	$('#my-range').Ranged('value', value)); // Set the value to `value`

### Returns:

* (object) jQuery collection.

Ranged Method: value {#Ranged:value-get}
-------------------------------------------------------------------

Get the value of the Ranged instance.

### Syntax:

	$('#my-range').Ranged('value'); // Return the value

### Returns:

* (integer) Value of the Ranged instance.