//#																														
//#	SOAPI 4.8													Copyright © 2000 - 2009 Dan Williams.					
//#																														

//+																														
//+	SOAPI.Dragger																									{	
//+(																													
	
	SOAPI.Dragger						 =	SOAPI.Class.extension();
	
	SOAPI.Dragger.extend
	
//+)																													

/*(	//~	Documentation					
	///																					
	///		This is a drag handler object.												
	///																					
)*/

({	//~	Code							
	
	//*														
	//*	Variables										{	
	//*														
	
	enabled								 :	false,
	bringToTop							 :	false,
	restrict							 :	false,
	restrictions						 :	null,			///		object		
	partners							 :	null,			///		array		
	targets								 :	null,			///		array		
	
	//*														
	//*												}		
	//*														
	
	//*														
	//*	Methods											{	
	//*														
	
	//-														
	//-	construct										{	
	//-														
	
	construct							 :	function
	
	/*(	//~	Documentation					
		///																					
		///		Class constructor.															
		///																					
		///	(	Syntax:																		
		///			void construct( void )													
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Class constructor.														
		///	)																				
		///	(	Parameters:																	
		///			void																	
		///	)																				
		///	(	Result:																		
		///			void																	
		///	)																				
		///																					
	)*/

	(	//~	Parameters					
		
		//	None
		
	)
	
	{	//~	Code						
		
		this.restrictions				 =	{};
		this.partners					 =	[];
		this.targets					 =	[];
		
	},
	
	//-														
	//-												}		
	//-														
	
	//-														
	//-	addRestriction									{	
	//-														
	
	addRestriction						 :	function
	
	/*(	//~	Documentation				
		///																					
		///		Add a drag restriction.														
		///																					
		///	(	Syntax:																		
		///			void addRestriction( string style[, object properties] )				
		///																					
		///				object properties { [number min], [number max], [number step] }		
		///																					
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Adds a drag restriction.												
		///	)																				
		///	(	Parameters:																	
		///			string				The style property to be restricted.				
		///			object				An object containing the restriction properties.	
		///				number			Minimum style property value.						
		///				number			Maximum style property value.						
		///				number			A step value.										
		///	)																				
		///	(	Result:																		
		///			void																	
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		style,
		properties
		
	)
	
	{	//~	Code						
		
		//:	Parameters									{	
		
		//	Defaults
		var p							 =	{
			min							 :	null,
			max							 :	null,
			step						 :	null,
			delta						 :	0
		};
		
		for (var pName in properties)		p[pName]		 =	properties[pName];
		
		//:											}		
		
		if (!isString(style))				return;
		
		this.restrictions[style]		 =	p;
		
	},
	
	//-														
	//-	removeRestriction							}	{	
	//-														
	
	removeRestriction					 :	function
	
	/*(	//~	Documentation				
		///																					
		///		Remove a drag restriction.													
		///																					
		///	(	Syntax:																		
		///			void removeRestriction( string style )									
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Removes a drag restriction.												
		///	)																				
		///	(	Parameters:																	
		///			string				The style property being restricted.				
		///	)																				
		///	(	Result:																		
		///			void																	
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		style
		
	)
	
	{	//~	Code						
		
		if (!isString(style))				return;
		
		var restrictions				 =	{};
		
		for (var i in this.restrictions) {
			
			if (i != style) {
				
				restrictions[i]			 =	this.restrictions[i];
				
			}
			
		}
		
		this.restrictions				 =	restrictions;
		
	},
	
	//-														
	//-												}		
	//-														
	
	//-														
	//-	addPartner										{	
	//-														
	
	addPartner							 :	function
	
	/*(	//~	Documentation				
		///																					
		///		Add a drag partner.															
		///																					
		///	(	Syntax:																		
		///			void addPartner( mixed sprite[, object x[, object y[, boolean key]]] )	
		///																					
		///				object x { number (style) }											
		///																					
		///				object y { number (style) }											
		///																					
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Adds a drag partner.													
		///	)																				
		///	(	Parameters:																	
		///			mixed				The sprite to use as a drag partner.				
		///			object				An object containing the partner X properties.		
		///				number			Style multiplication factor for X-axis.				
		///			object				An object containing the partner Y properties.		
		///				number			Style multiplication factor for Y-axis.				
		///			boolean				Whether the partner is key (restricts all).			
		///	)																				
		///	(	Result:																		
		///			void																	
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		sprite,
		x,
		y,
		key
		
	)
	
	{	//~	Code						
		
		if (isString(sprite))				sprite			 =	document.getElementById(sprite);
		if (!isObject(x))					x				 =	{};
		if (!isObject(y))					y				 =	{};
		
		for (var i in x) {
			
			if (x[i] == null)				x[i]			 =	1;
			
		}
		for (var i in y) {
			
			if (y[i] == null)				y[i]			 =	1;
			
		}
		
		this.partners.push({
			sprite						 :	sprite,
			multiplyX					 :	x,
			multiplyY					 :	y,
			key							 :	key
		});
		
	},
	
	//-														
	//-	removePartner								}	{	
	//-														
	
	removePartner						 :	function
	
	/*(	//~	Documentation				
		///																					
		///		Remove a drag partner.														
		///																					
		///	(	Syntax:																		
		///			void removePartner( mixed sprite )										
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Removes a drag partner.													
		///	)																				
		///	(	Parameters:																	
		///			mixed				The sprite being used as a drag partner.			
		///	)																				
		///	(	Result:																		
		///			void																	
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		sprite
		
	)
	
	{	//~	Code						
		
		if (isString(sprite))				sprite			 =	document.getElementById(sprite);
		
		var i							 =	this.partners.length;
		
		while (i--) {
			
			if (this.partners[i].sprite === sprite) {
				
				this.partners.splice(i, 1);
				
				break;
				
			}
			
		}
		
	},
	
	//-														
	//-												}		
	//-														
	
	//-														
	//-	addTarget										{	
	//-														
	
	addTarget							 :	function
	
	/*(	//~	Documentation				
		///																					
		///		Add a drag target.															
		///																					
		///	(	Syntax:																		
		///			void addTarget( mixed sprite )											
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Adds a drag target.														
		///	)																				
		///	(	Parameters:																	
		///			mixed				The sprite to use as a drag target.					
		///	)																				
		///	(	Result:																		
		///			void																	
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		sprite
		
	)
	
	{	//~	Code						
		
		if (isString(sprite))				sprite			 =	document.getElementById(sprite);
		
		this.targets.push({
			sprite						 :	sprite,
			over						 :	false
		});
		
	},
	
	//-														
	//-	removeTarget								}	{	
	//-														
	
	removeTarget						 :	function
	
	/*(	//~	Documentation				
		///																					
		///		Remove a drag target.														
		///																					
		///	(	Syntax:																		
		///			void removeTarget( mixed sprite )										
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Removes a drag target.													
		///	)																				
		///	(	Parameters:																	
		///			mixed				The sprite being used as a drag target.				
		///	)																				
		///	(	Result:																		
		///			void																	
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		sprite
		
	)
	
	{	//~	Code						
		
		if (isString(sprite))				sprite			 =	document.getElementById(sprite);
		
		var i							 =	this.targets.length;
		
		while (i--) {
			
			if (this.targets[i].sprite === sprite) {
				
				this.targets.splice(i, 1);
				
				break;
				
			}
			
		}
		
	}
	
	//-														
	//-												}		
	//-														
	
	//*														
	//*												}		
	//*														
	
});

//+																														
//+																												}		
//+																														
