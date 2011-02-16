//#																														
//#	SOAPI 4.8													Copyright © 2000 - 2009 Dan Williams.					
//#																														

//+																														
//+	Array extensions																								{	
//+																														

/*(	//~	Documentation					
	///																					
	///		These functions extend the Array object.									
	///																					
)*/

{	//~	Code							
	
	//*														
	//*	Variables										{	
	//*														
	
	Array.prototype.index				 =	0;				///		Keeps track of the current index.					
	
	//*														
	//*												}		
	//*														
	
	//*														
	//*	Methods											{	
	//*														
	
	//-														
	//-	get												{	
	//-														
	
	Array.prototype.get					 =	function
	
	/*(	//~	Documentation				
		///																					
		///		Get a specific element.														
		///																					
		///	(	Syntax:																		
		///			mixed get( integer index[, boolean wrap] )								
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Gets a specific element.												
		///	)																				
		///	(	Parameters:																	
		///			integer				The index to get.									
		///			boolean				Whether to wrap around to the end of the array		
		///								once the beginning is reached.						
		///	)																				
		///	(	Result:																		
		///			mixed				The array element.									
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		index,
		wrap
		
	)
	
	{	//~	Code						
		
		if (!wrap || !this.length)			return this[index];
		
		index							 =	index % this.length;
		
		if (index < 0)						index			+=	this.length;
		
		return this[index];
		
	};
	
	//-														
	//-												}		
	//-														
	
	//-														
	//-	current											{	
	//-														
	
	Array.prototype.current				 =	function
	
	/*(	//~	Documentation				
		///																					
		///		Get the current element.													
		///																					
		///	(	Syntax:																		
		///			mixed current( void )													
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Gets the current element.												
		///	)																				
		///	(	Parameters:																	
		///			void																	
		///	)																				
		///	(	Result:																		
		///			mixed				The array element.									
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		//	None
		
	)
	
	{	//~	Code						
		
		return this[this.index];
		
	};
	
	//-														
	//-	next										}	{	
	//-														
	
	Array.prototype.next				 =	function
	
	/*(	//~	Documentation				
		///																					
		///		Get the next element.														
		///																					
		///	(	Syntax:																		
		///			mixed next( [boolean wrap] )											
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Gets the next element.													
		///	)																				
		///	(	Parameters:																	
		///			boolean				Whether to wrap around to the beginning of the		
		///								array once the end is reached.						
		///	)																				
		///	(	Result:																		
		///			mixed				The array element.									
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		wrap
		
	)
	
	{	//~	Code						
		
		this.index++;
		
		if (wrap && this.index >= this.length)	this.index	 =	0;
		
		return this[this.index];
		
	};
	
	//-														
	//-	previous									}	{	
	//-														
	
	Array.prototype.previous			 =	function
	
	/*(	//~	Documentation				
		///																					
		///		Get the previous element.													
		///																					
		///	(	Syntax:																		
		///			mixed previous( [boolean wrap] )										
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Gets the previous element.												
		///	)																				
		///	(	Parameters:																	
		///			boolean				Whether to wrap around to the end of the array		
		///								once the beginning is reached.						
		///	)																				
		///	(	Result:																		
		///			mixed				The array element.									
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		wrap
		
	)
	
	{	//~	Code						
		
		this.index--;
		
		if (wrap && this.index < 0)			this.index		 =	this.length - 1;
		
		return this[this.index];
		
	};
	
	//-														
	//-	jumpTo										}	{	
	//-														
	
	Array.prototype.jumpTo				 =	function
	
	/*(	//~	Documentation				
		///																					
		///		Jump to a specific element.													
		///																					
		///	(	Syntax:																		
		///			mixed jumpTo( integer index[, boolean wrap] )							
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Jumps to a specific element.											
		///	)																				
		///	(	Parameters:																	
		///			integer				The index to jump to.								
		///			boolean				Whether to wrap around to the end of the array		
		///								once the beginning is reached.						
		///	)																				
		///	(	Result:																		
		///			mixed				The array element.									
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		index,
		wrap
		
	)
	
	{	//~	Code						
		
		this.index						 =	index;
		
		if (!wrap || !this.length)			return (index >= this.length) ? this[0] : this[index];
		
		this.index						 =	this.index % this.length;
		
		if (this.index < 0)					this.index		+=	this.length;
		
		return this[this.index];
		
	};
	
	//-														
	//-	jumpBy										}	{	
	//-														
	
	Array.prototype.jumpBy				 =	function
	
	/*(	//~	Documentation				
		///																					
		///		Jump by a specific number of elements.										
		///																					
		///	(	Syntax:																		
		///			mixed jumpBy( integer amount[, boolean wrap] )							
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Jumps by a specific number of elements.									
		///	)																				
		///	(	Parameters:																	
		///			integer				The amount of elements to jump by.					
		///			boolean				Whether to wrap around to the other side of the		
		///								array once the limit is reached.					
		///	)																				
		///	(	Result:																		
		///			mixed				The array element.									
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		amount,
		wrap
		
	)
	
	{	//~	Code						
		
		return this.jumpTo(this.index + amount, wrap);
		
	};
	
	//-														
	//-												}		
	//-														
	
	//*														
	
	//-														
	//-	copy											{	
	//-														
	
	Array.prototype.copy				 =	function
	
	/*(	//~	Documentation				
		///																					
		///		Create a copy of the array.													
		///																					
		///	(	Syntax:																		
		///			array copy( void )														
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Creates a copy of the array.											
		///	)																				
		///	(	Parameters:																	
		///			void																	
		///	)																				
		///	(	Result:																		
		///			array				A copy of the original array.						
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		//	None
		
	)
	
	{	//~	Code						
		
		var tempArray					 =	[];
		var i							 =	this.length;
		
		while (i--)							tempArray[i]	 =	(this[i] instanceof Array) ? this[i].copy() : this[i];
		
		return tempArray;
		
	};
	
	//-														
	//-	swap										}	{	
	//-														
	
	Array.prototype.swap				 =	function
	
	/*(	//~	Documentation				
		///																					
		///		Swap two array elements.													
		///																					
		///	(	Syntax:																		
		///			void swap( integer firstIndex, integer secondIndex )					
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Swaps two array elements.												
		///	)																				
		///	(	Parameters:																	
		///			mixed				The index of the first item.						
		///			mixed				The index of the second item.						
		///	)																				
		///	(	Result:																		
		///			void																	
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		firstIndex,
		secondIndex
		
	)
	
	{	//~	Code						
		
		if (firstIndex < 0)					firstIndex		 =	this.length + firstIndex;
		if (secondIndex < 0)				secondIndex		 =	this.length + secondIndex;
		
		if (this[firstIndex] == this[secondIndex])				return;
		
		var tempIndex					 =	this[firstIndex];
		this[firstIndex]				 =	this[secondIndex];
		this[secondIndex]				 =	tempIndex;
		
	};
	
	//-														
	//-												}		
	//-														
	
	//*														
	
	//-														
	//-	range											{	
	//-														
	
	Array.prototype.range				 =	function
	
	/*(	//~	Documentation				
		///																					
		///		Create a range of elements.													
		///																					
		///	(	Syntax:																		
		///			array range( number from, number to[, number step] )					
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Creates a range of elements as a new array, and returns the array.		
		///	)																				
		///	(	Parameters:																	
		///			number				The start of the range.								
		///			number				The end of the range.								
		///			number				The increment to use.								
		///	)																				
		///	(	Result:																		
		///			array				A new array containing the range of values.			
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		from,
		to,
		step
		
	)
	
	{	//~	Code						
		
		if (from == null && to == null)		return [];
		if (from != null && from == to)		return [ from ];
		
		var range						 =	[];
		var i							 =	from;
		
		if (!step)							step			 =	1;
		
		if ((step > 0 && from > to) || (step < 0 && from < to)) {
			
			step						*=	-1;
			
		}
		
		while (true) {
			
			range.push(i);
			
			if ((from < to && i >= to) || (from > to && i <= to)) {
				
				return range;
				
			}
			
			i							+=	step;
			
		}
		
	};
	
	//-														
	//-												}		
	//-														
	
	//*														
	
	//-														
	//-	contains										{	
	//-														
	
	Array.prototype.contains			 =	function
	
	/*(	//~	Documentation				
		///																					
		///		Check if an array contains a specified value.								
		///																					
		///	(	Syntax:																		
		///			boolean contains( mixed value )											
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Checks if an array contains a specified value.							
		///	)																				
		///	(	Parameters:																	
		///			mixed				The value to look for.								
		///	)																				
		///	(	Result:																		
		///			boolean				Whether the array contains the value or not.		
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		value
		
	)
	
	{	//~	Code						
		
		var i							 =	this.length;
		
		while (i--)						if (this[i] === value)	return true;
		
		return false;
		
	};
	
	//-														
	//-	indexOf										}	{	
	//-														
	
	Array.prototype.indexOf				 =	function
	
	/*(	//~	Documentation				
		///																					
		///		Check if an array contains a specified value.								
		///																					
		///	(	Syntax:																		
		///			mixed contains( mixed value )											
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Return the first index that contains the specified value.				
		///	)																				
		///	(	Parameters:																	
		///			mixed				The value to look for.								
		///	)																				
		///	(	Result:																		
		///			mixed				The index, or false.								
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		value
		
	)
	
	{	//~	Code						
		
		for (var i = 0; i < this.length; i++) {
			
			if (this[i] === value)			return i;
			
		}
		
		return false;
		
	};
	
	//-														
	//-	indicesOf									}	{	
	//-														
	
	Array.prototype.indicesOf			 =	function
	
	/*(	//~	Documentation				
		///																					
		///		Check if an array contains specified values.								
		///																					
		///	(	Syntax:																		
		///			mixed indicesOf( mixed value )											
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Return the indices that contain the specified value.					
		///	)																				
		///	(	Parameters:																	
		///			mixed				The value to look for.								
		///	)																				
		///	(	Result:																		
		///			mixed				The indices, or false.								
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		value
		
	)
	
	{	//~	Code						
		
		var results						 =	[];
		
		for (var i = 0; i < this.length; i++) {
			
			if (this[i] === value)			results.push(i);
			
		}
		
		return results.length ? results : false;
		
	};
	
	//-														
	//-												}		
	//-														
	
	//*														
	
	//-														
	//-	map												{	
	//-														
	
	Array.prototype.map					 =	function
	
	/*(	//~	Documentation				
		///																					
		///		Apply a function to array values.											
		///																					
		///	(	Syntax:																		
		///			array map( function func )												
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Applies a function to array values and returns the results.				
		///	)																				
		///	(	Parameters:																	
		///			function			The function to apply.								
		///	)																				
		///	(	Result:																		
		///			array				The results.										
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		func
		
	)
	
	{	//~	Code						
		
		for (var results = [], i = 0; i < this.length; i++) {
			
			results.push(func(this[i]));
			
		}
		
		return results;
		
	};
	
	//-														
	//-												}		
	//-														
	
	//*														
	//*												}		
	//*														
	
}

//+																														
//+																												}		
//+																														

//+																														
//+	String extensions																								{	
//+																														

/*(	//~	Documentation					
	///																					
	///		These functions extend the String object.									
	///																					
)*/

{	//~	Code							
	
	//*														
	//*	Methods											{	
	//*														
	
	//-														
	//-	pad												{	
	//-														
	
	String.prototype.pad				 =	function
	
	/*(	//~	Documentation				
		///																					
		///		Pad a string.																
		///																					
		///	(	Syntax:																		
		///			string pad( number chars, string char )									
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Pads a string to a certain length.										
		///	)																				
		///	(	Parameters:																	
		///			number				The length to pad to.								
		///			string				The character to pad with.							
		///	)																				
		///	(	Result:																		
		///			string				The padded string.									
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		chars,
		char
		
	)
	
	{	//~	Code						
		
		for (var padding = "", i = this.length; i < chars; i++) {
			
			padding						+=	char;
			
		}
		
		return padding + this;
		
	};
	
	//-														
	//-	trim										}	{	
	//-														
	
	String.prototype.trim				 =	function
	
	/*(	//~	Documentation				
		///																					
		///		Trim a string.																
		///																					
		///	(	Syntax:																		
		///			string trim( void )														
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Trims whitespace from both ends of a string.							
		///	)																				
		///	(	Parameters:																	
		///			void																	
		///	)																				
		///	(	Result:																		
		///			string				The trimmed string.									
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		//	None
		
	)
	
	{	//~	Code						
		
		var	str							 =	this.replace(/^\s\s*/, "");
		var ws							 =	/\s/;
		var i							 =	str.length;
		
		while (ws.test(str.charAt(--i)));
		
		return str.slice(0, i + 1);
		
	};
	
	//-														
	//-	strip										}	{	
	//-														
	
	String.prototype.strip				 =	function
	
	/*(	//~	Documentation				
		///																					
		///		Strip a string.																
		///																					
		///	(	Syntax:																		
		///			string strip( void )													
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Strips repeated whitespace from a string, replacing each occurrence		
		///			of multiple whitespaces with a signle space.							
		///	)																				
		///	(	Parameters:																	
		///			void																	
		///	)																				
		///	(	Result:																		
		///			string				The stripped string.								
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		//	None
		
	)
	
	{	//~	Code						
		
		return this.replace(/\s+/, " ");
		
	};
	
	//-														
	//-	reverse										}	{	
	//-														
	
	String.prototype.reverse			 =	function
	
	/*(	//~	Documentation				
		///																					
		///		Reverse a string.															
		///																					
		///	(	Syntax:																		
		///			string reverse( void )													
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Reverses a string.														
		///	)																				
		///	(	Parameters:																	
		///			void																	
		///	)																				
		///	(	Result:																		
		///			string				The reversed string.								
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		//	None
		
	)
	
	{	//~	Code						
		
		return this.split("").reverse().join("");
		
	};
	
	//-														
	//-												}		
	//-														
	
	//*														
	
	//-														
	//-	contains										{	
	//-														
	
	String.prototype.contains			 =	function
	
	/*(	//~	Documentation				
		///																					
		///		Check if an string contains a specified value.								
		///																					
		///	(	Syntax:																		
		///			boolean contains( string value )										
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Checks if an string contains a specified value.							
		///	)																				
		///	(	Parameters:																	
		///			string				The value to look for.								
		///	)																				
		///	(	Result:																		
		///			boolean				Whether the string contains the value or not.		
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		value
		
	)
	
	{	//~	Code						
		
		return (this.indexOf(value) >= 0);
		
	};
	
	//-														
	//-	beginsWith									}	{	
	//-														
	
	String.prototype.beginsWith			 =	function
	
	/*(	//~	Documentation				
		///																					
		///		Check if an string begins with a specified value.							
		///																					
		///	(	Syntax:																		
		///			boolean beginsWith( string value )										
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Checks if an string begins with a specified value.						
		///	)																				
		///	(	Parameters:																	
		///			string				The value to look for.								
		///	)																				
		///	(	Result:																		
		///			boolean				Whether the string contains the value or not.		
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		value
		
	)
	
	{	//~	Code						
		
		return (value == this.substring(0, value.length));
		
	};
	
	//-														
	//-	endsWith									}	{	
	//-														
	
	String.prototype.endsWith			 =	function
	
	/*(	//~	Documentation				
		///																					
		///		Check if an string ends with a specified value.								
		///																					
		///	(	Syntax:																		
		///			boolean endsWith( string value )										
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Checks if an string ends with a specified value.						
		///	)																				
		///	(	Parameters:																	
		///			string				The value to look for.								
		///	)																				
		///	(	Result:																		
		///			boolean				Whether the string contains the value or not.		
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		value
		
	)
	
	{	//~	Code						
		
		return (value == this.substring(this.length - value.length));
		
	};
	
	//-														
	//-												}		
	//-														
	
	//*														
	
	//-														
	//-	stripTags										{	
	//-														
	
	String.prototype.stripTags			 =	function
	
	/*(	//~	Documentation				
		///																					
		///		Strip HTML tags from a string.												
		///																					
		///	(	Syntax:																		
		///			string stripTags( void )												
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Strips HTML tags from a string.											
		///	)																				
		///	(	Parameters:																	
		///			void																	
		///	)																				
		///	(	Result:																		
		///			string				The stripped string.								
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		//	None
		
	)
	
	{	//~	Code						
		
		return this.replace(/<\/?[^>]+>/gi, "");
		
	};
	
	//-														
	//-												}		
	//-														
	
	//-														
	//-	htmlEncode										{	
	//-														
	
	String.prototype.htmlEncode			 =	function
	
	/*(	//~	Documentation				
		///																					
		///		HTML encode a string.														
		///																					
		///	(	Syntax:																		
		///			string htmlEncode( void )												
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			HTML encodes a string.													
		///	)																				
		///	(	Parameters:																	
		///			void																	
		///	)																				
		///	(	Result:																		
		///			string				The encoded string.									
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		//	None
		
	)
	
	{	//~	Code						
		
		var entities					 =	{ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" };
		var t							 =	this;
		
		for (var i in entities)				t				 =	t.replace(i, entities[i]);
		
		return t;
		
	};
	
	//-														
	//-	htmlDecode									}	{	
	//-														
	
	String.prototype.htmlDecode			 =	function
	
	/*(	//~	Documentation				
		///																					
		///		HTML decode a string.														
		///																					
		///	(	Syntax:																		
		///			string htmlDecode( void )												
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			HTML decodes a string.													
		///	)																				
		///	(	Parameters:																	
		///			void																	
		///	)																				
		///	(	Result:																		
		///			string				The decoded string.									
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		//	None
		
	)
	
	{	//~	Code						
		
		var entities					 =	{ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" };
		var t							 =	this;
		
		for (var i in entities)				t				 =	t.replace(entities[i], i);
		
		return t;
		
	};
	
	//-														
	//-	urlEncode									}	{	
	//-														
	
	String.prototype.urlEncode			 =	function
	
	/*(	//~	Documentation				
		///																					
		///		URL encode a string.														
		///																					
		///	(	Syntax:																		
		///			string urlEncode( void )												
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			URL encodes a string.													
		///	)																				
		///	(	Parameters:																	
		///			void																	
		///	)																				
		///	(	Result:																		
		///			string				The encoded string.									
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		//	None
		
	)
	
	{	//~	Code						
		
		return encodeURIComponent(this);
		
	};
	
	//-														
	//-	urlDecode									}	{	
	//-														
	
	String.prototype.urlDecode			 =	function
	
	/*(	//~	Documentation				
		///																					
		///		URL decode a string.														
		///																					
		///	(	Syntax:																		
		///			string urlDecode( void )												
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			URL decodes a string.													
		///	)																				
		///	(	Parameters:																	
		///			void																	
		///	)																				
		///	(	Result:																		
		///			string				The decoded string.									
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		//	None
		
	)
	
	{	//~	Code						
		
		return decodeURIComponent(this);
		
	};
	
	//-														
	//-												}		
	//-														
	
	//*														
	//*												}		
	//*														
	
}

//+																														
//+																												}		
//+																														

//+																														
//+	Document extensions																								{	
//+																														

/*(	//~	Documentation					
	///																					
	///		These functions provide document extensions.								
	///																					
)*/

{	//~	Code							
	
	//*														
	//*	Functions										{	
	//*														
	
	//-														
	//-	getClientWidth									{	
	//-														
	
	document.getClientWidth				 =	function
	
	/*(	//~	Documentation				
		///																					
		///		Get the client width.														
		///																					
		///	(	Syntax:																		
		///			integer getClientWidth( void )											
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Gets the client width.													
		///	)																				
		///	(	Parameters:																	
		///			void																	
		///	)																				
		///	(	Result:																		
		///			integer				The client width.									
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		//	None
		
	)
	
	{	//~	Code						
		
		var doc							 =	document.documentElement;
		
		return (doc && doc.clientWidth) ? doc.clientWidth : document.body.clientWidth;
		
	};
	
	//-														
	//-	getClientHeight								}	{	
	//-														
	
	document.getClientHeight			 =	function
	
	/*(	//~	Documentation				
		///																					
		///		Get the client height.														
		///																					
		///	(	Syntax:																		
		///			integer getClientHeight( void )											
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Gets the client height.													
		///	)																				
		///	(	Parameters:																	
		///			void																	
		///	)																				
		///	(	Result:																		
		///			integer				The client height.									
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		//	None
		
	)
	
	{	//~	Code						
		
		var doc							 =	document.documentElement;
		
		return (doc && doc.clientHeight) ? doc.clientHeight : document.body.clientHeight;
		
	};
	
	//-														
	//-												}		
	//-														
	
	//*														
	//*												}		
	//*														
	
}

//+																														
//+																												}		
//+																														

//+																														
//+	Type detection functions																						{	
//+																														

/*(	//~	Documentation					
	///																					
	///		These functions provide type detection.										
	///																					
)*/

{	//~	Code							
	
	//*														
	//*	Functions										{	
	//*														
	
	//-														
	//-	isArray											{	
	//-														
	
	window.isArray						 =	function
	
	/*(	//~	Documentation				
		///																					
		///		Check if a value is an array.												
		///																					
		///	(	Syntax:																		
		///			boolean isArray( mixed value )											
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Checks if a value is an array.											
		///	)																				
		///	(	Parameters:																	
		///			mixed				The value to check.									
		///	)																				
		///	(	Result:																		
		///			boolean				The result of the check.							
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		value
		
	)
	
	{	//~	Code						
		
		return isObject(value) && value.constructor == Array;
		
	};
	
	//-														
	//-	isBoolean									}	{	
	//-														
	
	window.isBoolean					 =	function
	
	/*(	//~	Documentation				
		///																					
		///		Check if a value is a boolean.												
		///																					
		///	(	Syntax:																		
		///			boolean isBoolean( mixed value )										
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Checks if a value is a boolean.											
		///	)																				
		///	(	Parameters:																	
		///			mixed				The value to check.									
		///	)																				
		///	(	Result:																		
		///			boolean				The result of the check.							
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		value
		
	)
	
	{	//~	Code						
		
		return typeof value == "boolean";
		
	};
	
	//-														
	//-	isFunction									}	{	
	//-														
	
	window.isFunction					 =	function
	
	/*(	//~	Documentation				
		///																					
		///		Check if a value is a function.												
		///																					
		///	(	Syntax:																		
		///			boolean isFunction( mixed value )										
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Checks if a value is a function.										
		///	)																				
		///	(	Parameters:																	
		///			mixed				The value to check.									
		///	)																				
		///	(	Result:																		
		///			boolean				The result of the check.							
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		value
		
	)
	
	{	//~	Code						
		
		return typeof value == "function";
		
	};
	
	//-														
	//-	isObject									}	{	
	//-														
	
	window.isObject						 =	function
	
	/*(	//~	Documentation				
		///																					
		///		Check if a value is an object.												
		///																					
		///	(	Syntax:																		
		///			boolean isObject( mixed value )											
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Checks if a value is an object.											
		///	)																				
		///	(	Parameters:																	
		///			mixed				The value to check.									
		///	)																				
		///	(	Result:																		
		///			boolean				The result of the check.							
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		value
		
	)
	
	{	//~	Code						
		
		//i(																				
		//i		null is in fact an object, but is not determined to be so here.				
		//i)																				
		
		return (value && typeof value == "object") || isFunction(value);
		
	};
	
	//-														
	//-	isNull										}	{	
	//-														
	
	window.isNull						 =	function
	
	/*(	//~	Documentation				
		///																					
		///		Check if a value is null.													
		///																					
		///	(	Syntax:																		
		///			boolean isNull( mixed value )											
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Checks if a value is null.												
		///	)																				
		///	(	Parameters:																	
		///			mixed				The value to check.									
		///	)																				
		///	(	Result:																		
		///			boolean				The result of the check.							
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		value
		
	)
	
	{	//~	Code						
		
		//i(																				
		//i		It's often simpler to directly compare the value to null than to use		
		//i		this function. When using "===", null compares explicitly to null,			
		//i		whereas using "==" will match null to both null and undefined.				
		//i)																				
		
		return typeof value == "object" && !value;
		
	};
	
	//-														
	//-	isNumber									}	{	
	//-														
	
	window.isNumber						 =	function
	
	/*(	//~	Documentation				
		///																					
		///		Check if a value is a number.												
		///																					
		///	(	Syntax:																		
		///			boolean isNumber( mixed value )											
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Checks if a value is a number.											
		///	)																				
		///	(	Parameters:																	
		///			mixed				The value to check.									
		///	)																				
		///	(	Result:																		
		///			boolean				The result of the check.							
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		value
		
	)
	
	{	//~	Code						
		
		return typeof value == "number" && isFinite(value);
		
	};
	
	//-														
	//-	isNaNNumber									}	{	
	//-														
	
	window.isNaNNumber					 =	function
	
	/*(	//~	Documentation				
		///																					
		///		Check if a value is a number and NaN.										
		///																					
		///	(	Syntax:																		
		///			boolean isNaNNumber( mixed value )										
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Checks if a value is a number and NaN.									
		///	)																				
		///	(	Parameters:																	
		///			mixed				The value to check.									
		///	)																				
		///	(	Result:																		
		///			boolean				The result of the check.							
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		value
		
	)
	
	{	//~	Code						
		
		return typeof value == "number" && isNaN(value);
		
	};
	
	//-														
	//-	isUnNumber									}	{	
	//-														
	
	window.isUnNumber					 =	function
	
	/*(	//~	Documentation				
		///																					
		///		Check if a value is an unusable number.										
		///																					
		///	(	Syntax:																		
		///			boolean isUnNumber( mixed value )										
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Checks if a value is an unusable number.								
		///	)																				
		///	(	Parameters:																	
		///			mixed				The value to check.									
		///	)																				
		///	(	Result:																		
		///			boolean				The result of the check.							
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		value
		
	)
	
	{	//~	Code						
		
		return typeof value == "number" && (isNaN(value) || !isFinite(value));
		
	};
	
	//-														
	//-	isString									}	{	
	//-														
	
	window.isString						 =	function
	
	/*(	//~	Documentation				
		///																					
		///		Check if a value is a string.												
		///																					
		///	(	Syntax:																		
		///			boolean isString( mixed value )											
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Checks if a value is a string.											
		///	)																				
		///	(	Parameters:																	
		///			mixed				The value to check.									
		///	)																				
		///	(	Result:																		
		///			boolean				The result of the check.							
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		value
		
	)
	
	{	//~	Code						
		
		return typeof value == "string";
		
	};
	
	//-														
	//-	isUndefined									}	{	
	//-														
	
	window.isUndefined					 =	function
	
	/*(	//~	Documentation				
		///																					
		///		Check if a value is undefined.												
		///																					
		///	(	Syntax:																		
		///			boolean isUndefined( mixed value )										
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Checks if a value is undefined.											
		///	)																				
		///	(	Parameters:																	
		///			mixed				The value to check.									
		///	)																				
		///	(	Result:																		
		///			boolean				The result of the check.							
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		value
		
	)
	
	{	//~	Code						
		
		//i(																				
		//i		This function is here for sake of completeness, however if it is used on	
		//i		a value that has not already been declared, an error will be generated.		
		//i		In this instance, typeof should be used directly to check for undefined,	
		//i		or, "==" can be used to check against null (which will match both null		
		//i		and undefined). This function should therefore only be used to check		
		//i		things like function parameters, which are undefined if nothing has been	
		//i		passed to them, but have been declared and so do exist. The key here is		
		//i		that existance is not related to whether a value is undefined. The			
		//i		variable itself can simply exist or not exist, depending on whether it		
		//i		has been declared - it's value can be anything, including undefined.		
		//i)																				
		
		return typeof value == "undefined";
		
	};
	
	//-														
	//-	isUnknown									}	{	
	//-														
	
	window.isUnknown					 =	function
	
	/*(	//~	Documentation				
		///																					
		///		Check if a value is of an unknown type.										
		///																					
		///	(	Syntax:																		
		///			boolean isUnknown( mixed value )										
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Checks if a value is of an unknown type.								
		///	)																				
		///	(	Parameters:																	
		///			mixed				The value to check.									
		///	)																				
		///	(	Result:																		
		///			boolean				The result of the check.							
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		value
		
	)
	
	{	//~	Code						
		
		//i(																				
		//i		This function is here to detect things like ActiveX objects, that are		
		//i		objects, but unusable in the same way as normal objects.					
		//i)																				
		
		return isObject(value) && typeof value.constructor != "function";
		
	};
	
	//-														
	//-	isWidget									}	{	
	//-														
	
	window.isWidget						 =	function
	
	/*(	//~	Documentation				
		///																					
		///		Check if a value is a widget.												
		///																					
		///	(	Syntax:																		
		///			boolean isWidget( mixed value[, string type] )							
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Checks if a value is a widget.											
		///	)																				
		///	(	Parameters:																	
		///			mixed				The value to check.									
		///			string				The type of widget to match.						
		///	)																				
		///	(	Result:																		
		///			boolean				The result of the check.							
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		value,
		type
		
	)
	
	{	//~	Code						
		
		if (!isObject(value) || !value.hasAttribute || !value.hasAttribute("widget"))		return false;
		if (!type)																			return true;
		
		var wtype						 =	value.getAttribute("widget").split(" ");
		var i							 =	wtype.length;
		
		while (i--)						if (wtype[i] == type)	return true;
		
		return false;
		
	};
	
	//-														
	//-	isComponent									}	{	
	//-														
	
	window.isComponent					 =	function
	
	/*(	//~	Documentation				
		///																					
		///		Check if a value is a component.											
		///																					
		///	(	Syntax:																		
		///			boolean isComponent( mixed value[, string type] )						
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Checks if a value is a component.										
		///	)																				
		///	(	Parameters:																	
		///			mixed				The value to check.									
		///			string				The type of component to match.						
		///	)																				
		///	(	Result:																		
		///			boolean				The result of the check.							
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		value,
		type
		
	)
	
	{	//~	Code						
		
		if (!isObject(value) || !value.hasAttribute || !value.hasAttribute("component"))		return false;
		
		return (type) ? value.getAttribute("component") == type : value.hasAttribute("component");
		
	};
	
	//-														
	//-												}		
	//-														
	
	//*														
	//*												}		
	//*														
	
}

//+																														
//+																												}		
//+																														

//+																														
//+	Common global functions																							{	
//+																														

/*(	//~	Documentation					
	///																					
	///		These functions provide various global features.							
	///																					
)*/

{	//~	Code							
	
	//*														
	//*	Functions										{	
	//*														
	
	//-														
	//-	getElementsById [$]								{	
	//-														
	
	window.getElementsById				 =	function
	
	/*(	//~	Documentation				
		///																					
		///		Get element(s) by id.														
		///																					
		///	(	Syntax:																		
		///			mixed getElementsById( [mixed element[, ...]] )							
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Gets element(s) by id.													
		///	)																				
		///	(	Parameters:																	
		///			mixed				The element to get.									
		///	)																				
		///	(	Result:																		
		///			mixed				The element(s).										
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		//	Multiple
		
	)
	
	{	//~	Code						
		
		if (arguments.length == 1) {
			
			return (isString(arguments[0])) ? document.getElementById(arguments[0]) : arguments[0];
			
		}
		
		for (var elements = [], i = 0; i < arguments.length; i++) {
			
			var element					 =	arguments[i];
			
			elements.push((isString(element)) ? document.getElementById(element) : element);
			
		}
		
		return elements;
		
	};
	
	window.$							 =	window.getElementsById;
	
	//-														
	//-	getElementsByClassName [$C]					}	{	
	//-														
	
	window.getElementsByClassName		 =	function
	
	/*(	//~	Documentation				
		///																					
		///		Get element(s) by class name.												
		///																					
		///	(	Syntax:																		
		///			mixed getElementsByClassName( string className[, string tag] )			
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Gets element(s) by class name.											
		///	)																				
		///	(	Parameters:																	
		///			string				The class name to look for.							
		///			string				The tag to look for.								
		///	)																				
		///	(	Result:																		
		///			mixed				The element(s).										
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		className,
		tag
		
	)
	
	{	//~	Code						
		
		if (ie && SOAPI.HTMLElement) 		return SOAPI.HTMLElement.getElementsByClassName(className, tag);
		
		return document.getElementsByClassName(className, tag);
		
	};
	
	window.$C							 =	window.getElementsByClassName;
	
	//-														
	//-	getElementsBySelector [$S]					}	{	
	//-														
	
	window.getElementsBySelector		 =	function
	
	/*(	//~	Documentation				
		///																					
		///		Get element(s) by CSS selector.												
		///																					
		///	(	Syntax:																		
		///			mixed getElementsBySelector( string selector )							
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Gets element(s) by CSS selector.										
		///	)																				
		///	(	Parameters:																	
		///			string				The selector to use.								
		///	)																				
		///	(	Result:																		
		///			mixed				The element(s).										
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		selector
		
	)
	
	{	//~	Code						
		
		var levels						 =	selector.trim().split(/\s+/);
		var scope						 =	[ document ];
		
		for (var i = 0, level; (level = levels[i]) != null; i++) {
			
			var id						 =	"";
			var tagName					 =	"";
			var className				 =	"";
			var classNames				 =	[];
			var state					 =	0;				///		0 = alpha, 1 = id, 2 = class	
			
			//	Tokenize the selector level
			for (var j = 0, chr; (chr = level.charAt(j)) != ""; j++) {
				
				switch (chr) {
					
					case "#":
						
						//	More than one id
						if (state == 1 || id)					return [];
						
						state			 =	1;				///		id		
						
					break;
					
					case ".":
						
						//	Empty class name
						if (state == 2 && !className)			return [];
						
						//	New class name
						if (state == 2) {
							
							classNames.push(className);
							className	 =	"";
							
						}
						
						state			 =	2;				///		class	
						
					break;
					
					default:
						
						switch (state) {
							
							case 0:			tagName			+=	chr;	break;
							case 1:			id				+=	chr;	break;
							case 2:			className		+=	chr;	break;
							
						}
						
					break;
					
				}
				
			}
			
			//	Check end state
			if (state == 1 && !id)			return [];
			if (state == 2 && !className)	return [];
			
			if (state == 2)					classNames.push(className);
			
			var element					 =	(id) ? $(id) : null;
			
			//	The selector contains an id
			if (id) {
				
				if (!element)				return [];
				if (tagName && element.nodeName.toLowerCase() != tagName)		return [];
				
				for (var j = 0; j < classNames.length; j++) {
					
				//	if (!element.hasClassName(classNames[j])) {//}
					if (!element.className || !element.className.match(new RegExp("(\\s|^)" + classNames[j] + "(\\s|$)"))) {
						
						return [];
						
					}
					
				}
				
				scope					 =	[ element ];
				
				continue;
				
			}
			
			//	No id, so collect all appropriate tags and check their classes
			var found					 =	[];
			
			for (var j = 0; j < scope.length; j++) {
				
				var elements			 =	scope[j].getElementsByTagName(tagName || "*");
				
				for (var k = 0; k < elements.length; k++) {
					
					found.push(elements[k]);
					
				}
				
			}
			
			scope						 =	[];
			
			for (var j = 0, item; (item = found[j]) != null; j++) {
				
				if (!classNames.length) {
					
					scope.push(item);
					
					continue;
					
				}
				
				if (!item.className)		continue;
				
				for (var matched = true, k = 0; k < classNames.length; k++) {
					
				//	if (!item.hasClassName(classNames[k])) {//}
					if (!item.className.match(new RegExp("(\\s|^)" + classNames[k] + "(\\s|$)"))) {
						
						matched			 =	false;
						
						break;
						
					}
					
				}
				
				if (matched)				scope.push(item);
				
			}
			
		}
		
		return scope;
		
	};
	
	window.$S							 =	window.getElementsBySelector;
	
	//-														
	//-												}		
	//-														
	
	//*														
	//*												}		
	//*														
	
}

//+																														
//+																												}		
//+																														
