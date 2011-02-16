//#																														
//#	SOAPI 4.8													Copyright © 2000 - 2009 Dan Williams.					
//#																														

//+																														
//+	SOAPI.Panel																										{	
//+(																													
	
	SOAPI.widgets.panel					 =	function(p) { new SOAPI.Panel(p); };
	
//+																														
	
	SOAPI.Panel							 =	SOAPI.Widget.extension();
	
	SOAPI.Panel.extend
	
//+)																													

/*(	//~	Documentation					
	///																					
	///		This class provides a panel widget.											
	///																					
)*/

({	//~	Code							
	
	//*														
	//*	Variables										{	
	//*														
	
	wtype								 :	"panel",
	
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
		///					[string text]													
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
		///				string			Text to display.									
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
	//	var handlers					 =	SOAPI.Panel_Handlers;
		
		w._write						 =	SOAPI.Sprite.prototype.write;
		
		//.	Extra pieces								{	
		
		if (p.pieces & 1) {
			
			c.content					 =	this.createComponent({
				element					 :	p.element,
				parent					 :	w,
				cType					 :	"content"
			}, true);
			
		}
		
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
		
		if (this.hasAttribute("text"))		this.write(this.getAttribute("text"), true, "afterbegin");
		
		this.removeAttribute("text");
		
	},
	
	//-														
	//-												}		
	//-														
	
	write								 :	function(html, append, position) {
		
		if (this.components.content) {
			
			this.components.content.write(html, append, position);
			
		} else {
			
			this._write(html, append, position);
			
		}
		
	}
	
	//*														
	//*												}		
	//*														
	
});

//+																														
//+																												}		
//+																														
