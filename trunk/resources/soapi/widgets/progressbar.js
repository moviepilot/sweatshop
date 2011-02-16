//#																														
//#	SOAPI 4.8													Copyright © 2000 - 2009 Dan Williams.					
//#																														

//+																														
//+	SOAPI.ProgressBar																								{	
//+(																													
	
	SOAPI.widgets.progressbar			 =	function(p) { new SOAPI.ProgressBar(p); };
	
//+																														
	
	SOAPI.ProgressBar					 =	SOAPI.Widget.extension();
	
	SOAPI.ProgressBar.extend
	
//+)																													

/*(	//~	Documentation					
	///																					
	///		This class provides a progress bar widget.									
	///																					
)*/

({	//~	Code							
	
	//*														
	//*	Variables										{	
	//*														
	
	wtype								 :	"progressbar",
	
	ctypes								 :	{ bar: SOAPI.Widget },
	
	orientation							 :	"horizontal",
	position							 :	0,				///		percent		
	
	parameters							 :	SOAPI.merge(SOAPI.Widget.prototype.parameters, {
		orientation						 :	"horizontal"
	}),
	
	//*														
	//*												}		
	//*														
	
	//*														
	//*	Methods											{	
	//*														
	
	//-														
	//-	setup											{	
	//-														
	
	setup								 :	function
	
	/*(	//~	Documentation				
		///																					
		///		Perform additional setup.													
		///																					
		///	(	Syntax:																		
		///			object setup( object parameters )										
		///																					
		///				object parameters {													
		///					...inherited from Panel...										
		///					[string orientation]											
		///				}																	
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Performs additional setup.												
		///	)																				
		///	(	Parameters:																	
		///			object				An object containing the parameters to use.			
		///				string			The bar's orientation (vertical or horizontal).		
		///	)																				
		///	(	Result:																		
		///			object				The results.										
		///				object			The parameters.										
		///				object			The widget.											
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		parameters
		
	)
	
	{	//~	Code						
		
		var result						 =	this.callParent(arguments.callee, "setup", arguments);
		var p							 =	result.p;
		var w							 =	result.w;
		var c							 =	w.components;
	//	var handlers					 =	SOAPI.ProgressBar_Handlers;
		
		//.	ProgressBar container						{	
		
		var vertical					 =	(p.orientation == "vertical");
		
		w.setAttribute("orientation", (vertical) ? "vertical" : "horizontal");
		
		w.orientation					 =	(vertical) ? "vertical" : "horizontal";
		
		//.	ProgressBar bar							}	{	
		
		var bar							 =	c.bar			 =	this.createComponent({
			element						 :	p.element,
			parent						 :	w,
			cType						 :	"bar"
		});
		
		//.											}		
		
		return result;
		
	},
	
	//-														
	//-												}		
	//-														
	
	//-														
	//-	configure										{	
	//-														
	
	configure							 :	function
	
	/*(	//~	Documentation				
		///																					
		///		Perform additional configuration.											
		///																					
		///	(	Syntax:																		
		///			void configure( void )													
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Performs additional configuration.										
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
		
		this.updatePosition(0);
		
	},
	
	//-														
	//-												}		
	//-														
	
	updatePosition						 :	function(position) {
		
		var vertical					 =	(this.orientation == "vertical");
		var bar							 =	this.components.bar;
		var border						 =	(vertical)
			?	this.get("border-top-width")  + this.get("border-bottom-width")
			:	this.get("border-left-width") + this.get("border-right-width")
		;
		var sizeProperty				 =	(vertical) ? "height" : "width";
		var size						 =	this.get(sizeProperty) - border;
		
		this.position					 =	(position > 100) ? 100 : ((position < 0) ? 0 : position);
		
		bar.styleTo(sizeProperty, size * (this.position / 100));
		
	}
	
	//*														
	//*												}		
	//*														
	
});

//+																														
//+																												}		
//+																														
