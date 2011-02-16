//#																														
//#	SOAPI 4.8													Copyright © 2000 - 2009 Dan Williams.					
//#																														

//+																														
//+	SOAPI.OptionButton																								{	
//+(																													
	
	SOAPI.widgets.optionbutton			 =	function(p) { new SOAPI.OptionButton(p); };
	
//+																														
	
	SOAPI.OptionButton					 =	SOAPI.ToggleButton.extension();
	
	SOAPI.OptionButton.extend
	
//+)																													

/*(	//~	Documentation					
	///																					
	///		This class provides a optionbutton widget.									
	///																					
)*/

({	//~	Code							
	
	//*														
	//*	Variables										{	
	//*														
	
	wtype								 :	"optionbutton",
	
	parameters							 :	SOAPI.merge(SOAPI.ToggleButton.prototype.parameters, {
		value							 :	"",
		group							 :	"false"
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
		///					...inherited from ToggleButton...								
		///					[string value], [boolean group]									
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
		///				string			The widget's value.									
		///				boolean			Whether the widget is part of a group or not.		
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
		var handlers					 =	SOAPI.OptionButton_Handlers;
	
		w.setAttribute("group", p.group != "false");
		
		SOAPI.Event.addEventHandler(w, "mouseup", handlers.onMouseUp, "OptionButton", [ "before Action" ]);
		
		//.	OptionButton value							{	
		
		var value						 =	c.value			 =	this.createComponent({
			element						 :	p.element,
			parent						 :	w,
			cType						 :	"value",
			eType						 :	"input",
			extras						 :	{ type: "hidden", name: w.getAttribute("name"), value: (p.toggled == "false") ? "" : p.value },
			criteria					 :	{ type: "hidden" }
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
//+		Handlers																								}	{	
//+																														
	
	SOAPI.OptionButton_Handlers			 =	{
		
		onMouseUp						 :	function(event) {
			
			if (this.getAttribute("group") != "false" && this.getAttribute("toggled") == "true") {
				
				var elements			 =	document.getElementsByName(this.getAttribute("name"));
				var i					 =	elements.length;
				
				while (i--) {
					
					var element			 =	elements[i];
					
					if (element !== this && isWidget(element, "optionbutton")) {
						
						element.setAttribute("toggled", false);
						
					}
					
				}
				
			}
			
			this.components.value.value	 =	(this.getAttribute("toggled") != "false") ? this.getAttribute("value") : "";
			
			return true;
			
		}
		
	};
	
//+																														
//+																												}		
//+																														
