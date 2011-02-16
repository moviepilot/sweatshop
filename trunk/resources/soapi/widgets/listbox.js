//#																														
//#	SOAPI 4.8													Copyright © 2000 - 2009 Dan Williams.					
//#																														

//+																														
//+	SOAPI.Listbox																									{	
//+(																													
	
	SOAPI.widgets.listbox				 =	function(p) { new SOAPI.Listbox(p); };
	
//+																														
	
	SOAPI.Listbox						 =	SOAPI.Scrollbox.extension();
	
	SOAPI.Listbox.extend
	
//+)																													

/*(	//~	Documentation					
	///																					
	///		This class provides a listbox widget.										
	///																					
)*/

({	//~	Code							
	
	//*														
	//*	Variables										{	
	//*														
	
	wtype								 :	"listbox",
	ctypes								 :	{ scrollbarV: SOAPI.Scrollbar, scrollbarH: SOAPI.Scrollbar, content: SOAPI.List },
	
	parameters							 :	SOAPI.merge(SOAPI.Scrollbox.prototype.parameters, {
		scrollbars						 :	"",
		multi							 :	"false"
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
		///					...inherited from Scrollbox...									
		///					[string scrollbars], [string scrollbarH], [string scrollbarV]	
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
		///				string			The scrollbar display properties.					
		///				string			The horizontal scrollbar display properties.		
		///				string			The vertical scrollbar display properties.			
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
	//	var handlers					 =	SOAPI.Listbox_Handlers;
		
		if (p.scrollbars != "both" && p.scrollbars != "none" && p.scrollbars != "horizontal" && p.scrollbars != "auto") {
			
			p.scrollbars				 =	"vertical";
			
		}
		
		w.setAttribute("multi",      p.multi != "false");
		w.setAttribute("scrollbars", p.scrollbars);
		
		//.	Listbox option values						{	
		
		var name						 =	w.getAttribute("name");
		
		if (name) {
			
			var items					 =	c.content.components.items;
			var i						 =	items.length;
			
			while (i--) {
				
				var item				 =	items[i];
				
				if (!isComponent(item, "option"))				continue;
				
				if (!item.getAttribute("name")) {
					
					item.setAttribute("group", p.multi == "false");
					item.setAttribute("name",  name);
					item.components.value.setAttribute("name",  name);
					
				}
				
			}
			
		}
		
		//.											}		
		
		return result;
		
	},
	
	//-														
	//-												}		
	//-														
	
	passMenuItem						 :	function(menuItem) {
		
		//i(																				
		//i		This function does nothing, and is here to trap selected menu items.		
		//i)																				
		
	}
	
	//*														
	//*												}		
	//*														
	
});

//+																														
//+																												}		
//+																														
