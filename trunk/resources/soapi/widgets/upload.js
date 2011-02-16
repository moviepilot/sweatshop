//#																														
//#	SOAPI 4.8													Copyright © 2000 - 2010 Dan Williams.					
//#																														

//+																														
//+	SOAPI.Upload																									{	
//+(																													
	
	SOAPI.widgets.upload				 =	function(p) { new SOAPI.Upload(p); };
	
//+																														
	
	SOAPI.Upload						 =	SOAPI.Widget.extension();
	
	SOAPI.Upload.extend
	
//+)																													

/*(	//~	Documentation					
	///																					
	///		This class provides an upload widget.										
	///																					
)*/

({	//~	Code							
	
	//*														
	//*	Variables										{	
	//*														
	
	wtype								 :	"upload",
		
	parameters							 :	SOAPI.merge(SOAPI.Widget.prototype.parameters, {
		tabindex						 :	0
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
		///					...inherited from Widget...										
		///					[boolean resizeable]											
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
		///				boolean			Whether the window is resizeable.					
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
		var handlers					 =	SOAPI.Dialog_Handlers;
		
		
		console.log('asdsad');
			
		
		//.											}		
		
		return result;
		
	},
	
	//-														
	//-												}		
	//-														
	
	//*														
	//*												}		
	//*														
	
});

//+																														
//+		Handlers																								}	{	
//+																														
	
	SOAPI.Dialog_Handlers				 =	{
		
		
		
	};
	
//+																														
//+																												}		
//+																														
