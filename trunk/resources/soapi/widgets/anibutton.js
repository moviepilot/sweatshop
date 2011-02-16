//#																														
//#	SOAPI 4.8													Copyright © 2000 - 2009 Dan Williams.					
//#																														

//+																														
//+	SOAPI.AniButton																									{	
//+(																													
	
	SOAPI.widgets.anibutton				 =	function(p) { new SOAPI.AniButton(p); };
	
//+																														
	
	SOAPI.AniButton						 =	SOAPI.Button.extension();
	
	SOAPI.AniButton.extend
	
//+)																													

/*(	//~	Documentation					
	///																					
	///		This class provides an animated button widget.								
	///																					
)*/

({	//~	Code							
	
	//*														
	//*	Variables										{	
	//*														
	
	wtype								 :	"anibutton",
	
	parameters							 :	SOAPI.merge(SOAPI.Button.prototype.parameters, {
		frames							 :	1,
		frame							 :	1
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
		///					...inherited from Button...										
		///					[integer frames], [integer frame]								
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
		///				integer			How many frames the widget has.						
		///				integer			The widget's current frame.							
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
	//	var c							 =	w.components;
		var handlers					 =	SOAPI.AniButton_Handlers;
		
		w.setAttribute("frames", p.frames);
		w.setAttribute("frame",  p.frame);
		
		SOAPI.Event.addEventHandler(w, "mousedown", handlers.onMouseDown, "AniButton");
		
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
//+		Handlers																								}	{	
//+																														
	
	SOAPI.AniButton_Handlers			 =	{
		
		onMouseDown						 :	function(event) {
			
			var frames					 =	parseInt(this.getAttribute("frames"));
			var frame					 =	parseInt(this.getAttribute("frame"));
			
			frame++;
			
			if (frame > frames)				frame			 =	1;
			
			this.setAttribute("frame", frame);
			
			return true;
			
		}
		
	};
	
//+																														
//+																												}		
//+																														
