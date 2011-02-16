//#																														
//#	SOAPI 4.8													Copyright © 2000 - 2009 Dan Williams.					
//#																														

//+																														
//+	SOAPI.Transition																								{	
//+(																													
	
	SOAPI.Transition					 =
	
//+)																													

/*(	//~	Documentation					
	///																						
	///		This is an transition object, call it staticly to 								
	///		generate a transition, or composite transition									
	///																						
)*/

{	//~	Code							
	
	//*														
	//*	Variables										{	
	//*														
	
	decimalPlaces						 :	2,				///		Defines the accuracy of calculations				
	
	bounceDefault						 :	[				///		Bounce transition defaults							
												[0, 0.2],
												[0.1, 0.5],
												[0.4, 1]
											],
	
	spolyDefault						 :	2,				///		SPoly transition defaults							
										
	polyDefault							 :	[0,1],			///		Poly transition defaults							

	backDefault							 :	[1,0.5],		///		Back transition defaults							

	
	//*														
	//*												}		
	//*														
	
	//*														
	//*	Methods											{	
	//*														
	
	//-														
	//-	generate										{	
	//-														
	
	generate							:	function
	
	/*(	//~	Documentation				
		///																					
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Generates a transition.													
		///	)																				
		///	(	Parameters:																	
		///			array				Mixed array of transitions.
		///				string			Transition type.
		///				string			Direction.
		///				integer			Steps.
		///			integer				The start value.									
		///			integer				The finish value.									
		///	)																				
		///	(	Result:																		
		///			array				The results.										
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		transition_types,
		x0,
		x1
		
	)	
	
	{	//~	Code						
		
		var total_steps 				 = 	0;
		var number_of_transitions 		 =	transition_types.length;
		
		for (var i = 0; i < number_of_transitions; i++) {
			
			transition 					 =	transition_types[i];
			
			total_steps 				 =	total_steps + transition[2];
		}
	
		var array_of_values 			 =	new Array();
		
		var transition;
		var transition_type;
		var ease_type;
		var degree;
		var steps;
		var temp_array;
		
		var gap;
	
		var y0 							 =	x0;
		var diff 						 =	x1 - x0;
		var y1;
		
		for (var i = 0; i < number_of_transitions; i++) {
			
			transition 					 =	transition_types[i];
			transition_type 			 =	transition[0];
			ease_type 					 =	transition[1];
			steps 						 =	transition[2];
			options 					 =	transition[3];
			
			gap 						 =	diff * (steps / total_steps);
			y1 							 =	y0 + gap;
			
			array_of_values.pop();
					
			temp_array 					 =	this.transitionHandler(transition_type, ease_type, y0, y1, steps, options);
			array_of_values 			 =	array_of_values.concat(temp_array);
					
			y0 							 =	y1;
		}
	
		return array_of_values;
		
	},	
	
	//-														
	//-												}		
	//-														
	
	//-														
	//-	transitionHandler								{	
	//-														
	
	transitionHandler					 :	function
	
	(	//~	Parameters					
		
		transition_type,
		ease_type,
		x0,
		x1,
		steps,
		options
		
	)
	
	{	//~	Code						
		
		standard_values 				 =	this.standardTransition(steps, transition_type, options);
		
		if (ease_type == "In") {
			
			adjusted_values 			 = 	this.shiftValues(standard_values, x0, x1);
			
		} else {
			
			adjusted_values 			 =	this.flipAndShiftValues(standard_values, x0, x1);	
		
		}
		
		return adjusted_values;
		
	},
	
	//-														
	//-												}		
	//-														
	
	//-														
	//-	standardTransition								{	
	//-														
	
	standardTransition					 :	function
	
	(	//~	Parameters					
		
		steps,
		transition_type,
		options
		
	)
	
	{	//~	Code						
		
		var start_x 					 =	0;
		var final_x 					 =	1;
			
		if (transition_type == "Sin") {
			
			start_x 					 =	3 * (Math.PI / 2);
			final_x 					 = 	2 * Math.PI;
		
		} else if (transition_type == "Bounce") {
			
			options 					 =	this.findBounceDetails(options);
		
		} else if (transition_type == "Back") {
			
			options 					 =	this.findBackCoefficients(options);
		
		} else if(transition_type == "SPoly") {
			
			options 					 = 	this.findStandardPolynomial(options);
		
		}
			
		var gap 						 =	(final_x - start_x) / steps;
		var standard_values 			 = 	new Array(steps + 1);
		var x 							 = 	start_x;
		
		for (var i = 0; i <= steps; i++) {
			
			standard_values[i] 			 = 	this.standardTransitionHandler(x, transition_type, options);
			x 							 = 	x + gap;
		
		}
		
		return standard_values;
		
	},
	
	//-														
	//-												}		
	//-														
	
	//-														
	//-	standardTransitionHandler						{	
	//-														

	standardTransitionHandler			:	function
	
	(	//~	Parameters					
		
		x,
		transition_type,
		options
	
	)	
	
	{	//~	Code						
		
		switch (transition_type) {
			
			case "Sin":
				
				return this.sinTransition(x);
				
			case "Exp":
				
				return this.expTransition(x);
		
			case "SPoly":
				
				return this.polynomialTransition(x, options);
					
			case "Poly":
				
				return this.polynomialTransition(x, options);
				
			case "Circ":
				
				return this.circTransition(x);
			
			case "Back":
						
				return this.polynomialTransition(x, options);
				
			case "Bounce":
				
				return this.bounceTransition(x, options[1], options[0]);
			
			case "Linear":
			default:
		
				return x;
				
		}
		
	},
	
	//-														
	//-												}		
	//-														
	
	//-														
	//-	findStandardPolynomial							{	
	//-														

	findStandardPolynomial				 :	function
	
	(	//~	Parameters					
		
		degree
		
	)	
	
	{	//~	Code						
		
		degree 							 = 	(degree == undefined ? this.spolyDefault : degree);
		var coefficients 				 = 	new Array(degree + 1);
		
		for (var i = 0; i <= degree; i++) {
			
			coefficients[i] 			 = 	0;
		
		}
		
		coefficients[degree] 			 = 	1;
		
		return coefficients;
		
	},
	
	//-														
	//-												}		
	//-														
	
	//-														
	//-	polynomialTransition							{	
	//-														
	
	polynomialTransition				 :	function
	
	(	//~	Parameters					
		
		x,
		options
		
	)	
	
	{	//~	Code						
		
		var coefficients 				 = 	(options == undefined ? this.polyDefault : options);
		var polynomial_degree 			 =	coefficients.length - 1;
		var expression_value 			 = 	0;
		var x_power 					 = 	1;
		
		for (var i = 0; i <= polynomial_degree; i++) {
			
			expression_value 			 = 	expression_value + (coefficients[i] * x_power);
			x_power 					 = 	x_power * x;
		
		}
		
		return expression_value;
		
	},
	
	//-														
	//-												}		
	//-														
	
	//-														
	//-	sinTransition									{	
	//-														
	
	sinTransition						 :	function
	
	(	//~	Parameters					
		
		x
	
	)	
	
	{	//~	Code						
		
		return Math.sin(x) + 1;
	
	},
	
	//-														
	//-												}		
	//-														
	
	//-														
	//-	expTransition									{	
	//-														

	expTransition						:	function
	
	(	//~	Parameters					
		
		x
		
	)	
	
	{	//~	Code						
		
		return (Math.exp(x) - 1) / (Math.exp(1) - 1);
	
	},
	
	//-														
	//-												}		
	//-														
	
	//-														
	//-	circTransition									{	
	//-														
	
	circTransition						 :	function
	
	(	//~	Parameters					
		
		x
		
	)	
	
	{	//~	Code						
		
		return 1 - Math.sqrt(1 - Math.pow(x, 2));
	
	},
	
	//-														
	//-												}		
	//-														
	
	//-														
	//-	flipAndShiftValues								{	
	//-														
	
	flipAndShiftValues					 :	function
	
	(	//~	Parameters					
		
		standard_values,
		x0,
		x1
		
	)	
	
	{	//~	Code						
		
		var array_length 				 = 	standard_values.length;	
		var adjusted_values 			 = 	new Array(array_length);
		var gap 						 = 	x1 - x0;
		var scale_factor 				 = 	Math.pow(10, this.decimalPlaces);
		
		var flipped_value;
		var adjusted_value;
		var rounded_value;
		
		for (var i = 0; i < array_length; i++) {
			
			flipped_value 				 = 	1 - standard_values[array_length - i - 1];
			adjusted_value 				 = 	gap * flipped_value + x0;
			adjusted_values[i] 			 = 	Math.round(adjusted_value * scale_factor) / scale_factor;
		
		}
		
		return adjusted_values;
		
	},
	
	//-														
	//-												}		
	//-														
	
	//-														
	//-	shiftValues										{	
	//-														
	
	shiftValues							 :	function
	
	(	//~	Parameters					
		
		standard_values,
		x0,
		x1
	
	)
	
	{	//~	Code						
		
		var array_length 				 = 	standard_values.length;	
		var adjusted_values 			 = 	new Array(array_length);
		var gap 						 = 	x1 - x0;
		var scale_factor 				 = 	Math.pow(10, this.decimalPlaces);
		
		var adjusted_value;
		var rounded_value;
		
		for (var i = 0; i < array_length; i++) {
			
			adjusted_value 				 = 	gap * standard_values[i] + x0;
			adjusted_values[i] 			 = 	Math.round(adjusted_value * scale_factor) / scale_factor;
		}
		
		return adjusted_values;
		
	},
	
	//-														
	//-												}		
	//-														
	
	//-														
	//-	findBackCoefficients							{	
	//-														
	
	findBackCoefficients				 :	function
	
	(	//~	Parameters					
		
		options
		
	)
	
	{	//~	Code						
		
		options 						 = 	(options == undefined ? this.backDefault : options);
				
		var h 							 = 	options[0];
		var p							 = 	options[1];
		
		// find cubic polynomial where f(0) = 0, f(1) = 1, f(p) = h, and (p,h) is peak point
		var a  							 =	((1/3)*h - (1/2)*h*p + (1/6)*Math.pow(p,3)) / ((1/2) * Math.pow(p,2) + (1/2)*h - p*h);
		var c 							 =	1 / ((1/3) - (1/2)*(a + p) + a * p);
		
		var coefficients 				 = 	new Array(0, c*a*p, (-1/2)*(a+p)*c, (1/3)*c);
		
		return coefficients;
		
	},
	
	//-														
	//-												}		
	//-														
	
	//-														
	//-	findBounceDetails								{	
	//-														
	
	findBounceDetails					 :	function
	
	(	//~	Parameters					
		
		options
		
	)
	
	{	//~	Code						
		
		if(options == undefined) 		options = this.bounceDefault;
		
		var bounce_heights 				 = 	new Array(0);
		var x_points 					 = 	new Array(0);
			
		for (var i = 0; i < options.length; i++) {
			
			details 					 = 	options[i];
			x_points.push(details[0]);
			bounce_heights.push(details[1]);
		
		}
		
		x_points.push(1 + (1 - x_points[x_points.length - 1]));
		
		return Array(x_points, bounce_heights);
		
	},
	
	//-														
	//-												}		
	//-														
	
	//-														
	//-	bounceTransition								{	
	//-														
	
	bounceTransition					 :	function
	
	(	//~	Parameters					
		
		x,
		bounce_heights,
		x_points
	
	)	
	
	{	//~	Code						
		
		current_index 					 = 	0;
	
		while (((x_points[current_index] <= x) && (x < x_points[current_index + 1])) == false) {
			
			current_index 				+= 	1;
		
		}
	
		return (x - x_points[current_index]) * (x_points[current_index + 1] - x) * ((4 * bounce_heights[current_index]) / (Math.pow(x_points[current_index + 1] - x_points[current_index], 2))); 
	
	}
	
	//-														
	//-												}		
	//-														

	//*														
	//*												}		
	//*														
	
};

//+																														
//+																												}		
//+																														