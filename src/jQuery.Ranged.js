(function($) {

	var methods = {

		init : function( options ) {

			this.Ranged.options = $.extend( {}, this.Ranged.defaults, options );

			var elms = [];

			this.each(function() {

				var $this = $( this ),
					data = $this.data( 'Ranged' )
				;

				if ( data ) return; // Already extended element, skip

				if ( $this.is( 'input[type=range]' ) ) $this = $this.Ranged( '_extendInputRanged' );

				$this.data('Ranged', {
					target: $this,
					options: $this.Ranged.options
				});
				$( document ).data( 'Ranged', {} );

				$this.Ranged( '_build' );      // Build the slider
				$this.Ranged( '_calculate' );  // Calculate the values
				$this.Ranged( '_bindEvents' ); // Bind the events

				elms.push( $this[0] );
			});

			return $( elms );
		},

		/*
		 *  Replace the (currently poorly supported) input range by a div
		 */
		_extendInputRanged: function() {
			this.Ranged.options.min = +this.attr( 'min' );
			this.Ranged.options.max = +this.attr( 'max' );
			this.Ranged.options.step = +this.attr( 'step' );
			this.Ranged.options.value = +this.attr( 'value' );

			var newRanged = $( '<div>', {
				id: this.attr( 'id' ),
				'class': this.attr('class') ? this.attr('class') + ' ' + this.Ranged.options.rangedClass : this.Ranged.options.rangedClass
			});

			this.replaceWith( newRanged );

			return newRanged;
		},
	
		/*
		 * Construct elements
		 */
		_build: function() {
			var bar, thumb;

			// Add the ranged class on the main element
			this.addClass(this.Ranged.options.rangedClass);

			// Create the progress bar
			if ( this.data( 'Ranged' ).options.createBar ) {
				bar = $( '<span>', {
					'class': this.data( 'Ranged' ).options.barClass/*,
					'style': 'width: ' + this.Ranged( '_valueToPx' , this.data( 'Ranged' ).options.value )  + 'px'*/
				}).appendTo( this );
			} else bar = this.find( '.' + this.data( 'Ranged' ).options.barClass );

			// Create the thumb
			if ( this.data( 'Ranged' ).options.createThumb ) {
				thumb = $( '<span>', {
					'class': this.data( 'Ranged' ).options.thumbClass,
					tabindex: 0,
					role: 'slider',
					'aria-valuemax': this.data( 'Ranged' ).options.max,
					'aria-valuemin': this.data( 'Ranged' ).options.min,
					'aria-valuenow': this.data( 'Ranged' ).options.value,
					'aria-valuetext': this.data( 'Ranged' ).options.value
				}).appendTo( this );
			} else thumb = this.find( '.' + this.data( 'Ranged' ).options.thumbClass );

			this.data( 'Ranged' ).bar = bar;
			this.data( 'Ranged' ).thumb = thumb;

			return this;
		},

		/*
		 * Bind events
		 */
		_bindEvents: function() {
			this.data( 'Ranged' ).thumb.on( 'mousedown', this, function(e) {
				var that = e.data;
				$( document ).data( 'Ranged' ).active = that;
				that.data( 'Ranged' ).dragStartX = e.clientX;
				that.data( 'Ranged' ).dragStartW = parseInt( that.data( 'Ranged' ).bar.css( 'width' ), 10 );
				that.data( 'Ranged' ).options.onDragStart.apply(that, [ that.Ranged( 'value' ) ] ); // Trigger the onDragStart event
			});

			if ( !$( document ).data( 'Ranged' ).events ) {
				$( document )
					.on( 'mousemove', function(e) {
						var that = $(document).data('Ranged' ).active;
						if ( !that ) return; // Exit if there is no active Ranged

						// Constrain the slider position between 0 and the total width
						var position = Math.max(
							0,
							Math.min(
								that.data( 'Ranged' ).width,
								that.data( 'Ranged' ).dragStartW + ( e.clientX - that.data( 'Ranged' ).dragStartX )
							)
						);
						// Convert the position to step
						var value = that.Ranged( '_pxToValue', position );

						if ( that.Ranged( 'value' ) == value ) return;                // Exit if there is no step change
						that.Ranged( 'value', value );                                // Update the current step
						that.data( 'Ranged' ).options.onChange.apply(that, [value] ); // Trigger the onChange event
					})
					.on( 'mouseup', function() {
						var that = $( document ).data( 'Ranged' ).active;
						if ( !that ) return;

						$( document ).data( 'Ranged' ).active = null; // Set the active Ranged to null

						that.data( 'Ranged' ).options.onDragEnd.apply(that, [ that.Ranged( 'value' ) ] ); // Trigger the onDragEnd event
					})
					.data( 'Ranged' ).events = true;
			}

			return this;
		},

		/*
		 * Get/Set the value
		 */
		value: function(value) {
			// Get
			if ( value === undefined ) return this.data( 'Ranged' ).thumb.attr( 'aria-valuenow' );

			// Set
			this.data( 'Ranged' ).bar.css( 'width', this.Ranged( '_valueToPx', value ) ); // Change the progress bar value
			this.data( 'Ranged' ).thumb.attr( 'aria-valuenow', value );
			this.data( 'Ranged' ).thumb.attr( 'aria-valuetext', value );
			return this;
		},

		/*
		 * Calculate some values needed for the slider
		 */
		_calculate: function() {
			this.data( 'Ranged' ).width = this.width();                                                                     // Store the slider width
			var range = this.data( 'Ranged' ).options.max - this.data( 'Ranged' ).options.min;                              // Get the total range, from min to max
			this.data( 'Ranged' ).stepWidth = this.data( 'Ranged' ).options.step * ( this.data( 'Ranged' ).width / range ); // Get the step width (in px)
			this.Ranged( 'value', this.data( 'Ranged' ).options.value );
		},

		/*
		 * Conversions functions
		 */

		// Pixels to step
		_pxToStep: function(px) {
			var
				steps = px / this.data( 'Ranged' ).stepWidth, // Divide the width by step
				fullSteps = Math.floor( steps ),              // Get the number of full steps
				parialStep = steps - fullSteps                // Get the remaining partial step (a value between 0 an 1)
			;
			if ( parialStep > 0.5 ) fullSteps++;              // If the parial step is > 0.5 we are closer to the next step, so we round to the next step

			return fullSteps; // Return the steps
		},

		// Pixels to value
		_pxToValue: function(px) {
			return this.Ranged( '_stepToValue', this.Ranged( '_pxToStep', px ) );
		},

		// Step to pixels
		_stepToPx: function(step) {
			return step * this.data( 'Ranged' ).stepWidth;
		},

		// Step to value
		_stepToValue: function(step) {
			return step * this.data( 'Ranged' ).options.step + this.data( 'Ranged' ).options.min;
		},

		// Value to step
		_valueToStep: function(value) {
			return (value - this.data( 'Ranged' ).options.min) / this.data( 'Ranged' ).options.step;
		},

		// Value to pixels
		_valueToPx: function(value) {
			return this.Ranged( '_valueToStep', value ) * this.data( 'Ranged' ).stepWidth;
		}

	};

	$.fn.Ranged = function( method ) {

		if ( methods[method] ) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ) );
		} else if ( typeof method === 'object' || !method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.Ranged' );
		}

	};

	$.fn.Ranged.defaults = {
		min: 0,
		max: 1,
		step: 0.01,
		value: 0,
		createBar: true,
		createThumb: true,
		rangedClass: 'ranged',
		barClass: 'ranged-bar',
		thumbClass: 'ranged-thumb',
		
		onChange: function(value) {},
		onDragStart: function(value) {},
		onDragEnd: function(value) {}
	};

	$.fn.Ranged.options = {};

})(jQuery);