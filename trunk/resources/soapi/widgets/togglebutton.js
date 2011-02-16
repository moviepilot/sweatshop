//#																														
//#	SOAPI 4.8													Copyright © 2000 - 2009 Dan Williams.					
//#																														

//+																														
//+	SOAPI.ToggleButton																								{	
//+(																													
	
	SOAPI.Events.toggle					 =	[ "onToggle"		];
	SOAPI.Events.onToggle				 =	function(event) { return true };
	
//+																														
	
	SOAPI.widgets.togglebutton			 =	function(p) { new SOAPI.ToggleButton(p); };
	
//+																														
	
	SOAPI.ToggleButton					 =	SOAPI.Button.extension();
	
	SOAPI.ToggleButton.extend
	
//+)																													

/*(	//~	Documentation					
	///																					
	///		This class provides a togglebutton widget.									
	///																					
)*/

({	//~	Code							
	
	//*														
	//*	Variables										{	
	//*														
	
	wtype								 :	"togglebutton",
	
	parameters							 :	SOAPI.merge(SOAPI.Button.prototype.parameters, {
		toggled							 :	"false"
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
		///					[boolean toggled]												
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
		///				boolean			Whether the widget is toggled or not.				
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
		var handlers					 =	SOAPI.ToggleButton_Handlers;
		
		w.setAttribute("toggled", p.toggled != "false");
		
		SOAPI.Event.addEventHandler(w, "mouseup", handlers.onMouseUp, "ToggleButton", [ "before Action" ]);
		SOAPI.Event.addEventHandler(w, "toggle",  handlers.onToggle,  "ToggleButton");
		
		//.	Extra pieces								{	
		
		if (p.pieces & 8192) {
			
			c.trigger					 =	this.createComponent({
				element					 :	p.element,
				parent					 :	w,
				cType					 :	"trigger"
			}, true);
			
			var trigger					 =	c.trigger;
			
			SOAPI.Event.addEventHandler(trigger, "mousedown", handlers.trigger.onMouseDown, "ToggleButton");
			SOAPI.Event.addEventHandler(trigger, "mouseup",   handlers.trigger.onMouseUp,   "ToggleButton");
			
		}
		
		if (p.pieces & 1 && p.element.firstChild)				p.element.prependChild(c.content);
		
		//.											}		
		
		return result;
		
	},
	
	//-														
	//-												}		
	//-														
	
	toggle								 :	function() {
		
		var toggled						 =	this.getAttribute("toggled");
		
		if (toggled == "false" && !this.builtsubs)				SOAPI.buildWidgets(this);
		
		this.setAttribute("toggled", (toggled == "false"));
		
		SOAPI.Event.triggerEvent("contentchange", this, null, true);
		
	}
	
	//*														
	//*												}		
	//*														
	
});

//+																														
//+		Handlers																								}	{	
//+																														
	
	SOAPI.ToggleButton_Handlers			 =	{
		
		onMouseUp						 :	function(event) {
			
			SOAPI.Event.triggerEvent("toggle", this);
			
			return true;
			
		},
		
		onToggle						 :	function(event) {
			
			this.toggle();
			
			return true;
			
		},
		
		trigger							 :	{
			
			onMouseDown					 :	function(event) {
				
				SOAPI.Event.triggerEvent("toggle", this.parentWidget);
				
				event.stopPropagation();
				
				return true;
				
			},
			onMouseUp					 :	function(event) {
				
				event.preventDefault();
				event.stopPropagation();
				
				return false;
				
			}
			
		}
		
	};
	
//+																														
//+																												}		
//+																														
