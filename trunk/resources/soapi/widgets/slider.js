//#																														
//#	SOAPI 4.8													Copyright © 2000 - 2009 Dan Williams.					
//#																														

//+																														
//+	SOAPI.Slider																									{	
//+(																													
	
	SOAPI.widgets.slider				 =	function(p) { new SOAPI.Slider(p); };
	
//+																														
	
	SOAPI.Slider						 =	SOAPI.Panel.extension();
	
	SOAPI.Slider.extend
	
//+)																													

/*(	//~	Documentation					
	///																					
	///		This class provides a slider widget.										
	///																					
)*/

({	//~	Code							
	
	//*														
	//*	Variables										{	
	//*														
	
	wtype								 :	"slider",
	ctypes								 :	{ scrollbarV: SOAPI.Scrollbar, scrollbarH: SOAPI.Scrollbar },
	
	parameters							 :	SOAPI.merge(SOAPI.Panel.prototype.parameters, {
		tabindex						 :	0,
		action							 :	""
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
		///					[integer tabindex], [string action]								
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
		///				integer			The widget's tabindex.								
		///				string			An action to perform.								
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
		var handlers					 =	SOAPI.Slider_Handlers;
		
		var scrollbarH					 =	c.scrollbarH	 =	this.createComponent({
			element						 :	p.element,
			parent						 :	w,
			cType						 :	"scrollbarH",
			parameters					 :	{ orientation: "horizontal" }
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
		
		var min							 =	this.getAttribute('min');
		var max							 =	this.getAttribute('max');
		var value						 =	this.getAttribute('value');
		var width						 =	this.components.scrollbarH.components.handle.get('actualwidth');
		
		this.components.scrollbarH.recalculateScrollProperties(min, max, value, width);		
		
	}
	
	//*														
	//*												}		
	//*														
	
});

//+																														
//+		Handlers																								}	{	
//+																														
	
	SOAPI.Slider_Handlers				 =	{
		
		
		
	};
	
//+																														
//+																												}		
//+																														
