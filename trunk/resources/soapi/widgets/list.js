//#																														
//#	SOAPI 4.8													Copyright © 2000 - 2009 Dan Williams.					
//#																														

//+																														
//+	SOAPI.List																										{	
//+(																													
	
	SOAPI.widgets.list					 =	function(p) { new SOAPI.List(p); };
	
//+																														
	
	SOAPI.List							 =	SOAPI.Widget.extension();
	
	SOAPI.List.extend
	
//+)																													

/*(	//~	Documentation					
	///																					
	///		This class provides a list widget.											
	///																					
)*/

({	//~	Code							
	
	//*														
	//*	Variables										{	
	//*														
	
	wtype								 :	"list",
	ctypes								 :	{ item: SOAPI.Button, toggle: SOAPI.ToggleButton, option: SOAPI.OptionButton },
	
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
		///					...inherited from Widget...										
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
	//	var handlers					 =	SOAPI.List_Handlers;
		
		//.	List items									{	
		
		var items						 =	c.items			 =	this.createComponents({
				element					 :	p.element,
				parent					 :	w,
				cType					 :	[ "item", "toggle", "option" ]
		});
		
		//.											}		
		
		return result;
		
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
