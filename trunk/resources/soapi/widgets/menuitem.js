//#																														
//#	SOAPI 4.8													Copyright © 2000 - 2009 Dan Williams.					
//#																														

//+																														
//+	SOAPI.MenuItem																									{	
//+(																													
	
	SOAPI.Events.select					 =	[ "onSelect"		];
	SOAPI.Events.onSelect				 =	function(event) { return true };
	
//+																														
	
	SOAPI.widgets.menuitem				 =	function(p) { new SOAPI.MenuItem(p); };
	
//+																														
	
	SOAPI.MenuItem						 =	SOAPI.Button.extension();
	
	SOAPI.MenuItem.extend
	
//+)																													

/*(	//~	Documentation					
	///																					
	///		This class provides a menuitem widget.										
	///																					
)*/

({	//~	Code							
	
	//*														
	//*	Variables										{	
	//*														
	
	wtype								 :	"menuitem",
	
	parameters							 :	SOAPI.merge(SOAPI.Button.prototype.parameters, {
		tabindex						 :	"",
		value							 :	"",
		selectable						 :	"true"
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
		///					[string value], [boolean selectable]							
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
		///				boolean			Whether the widget is selectable.					
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
		var handlers					 =	SOAPI.MenuItem_Handlers;
		
		w.setAttribute("selectable", p.selectable != "false");
		
		SOAPI.Event.removeEventHandler(w, "mousedown", "Button");
		SOAPI.Event.removeEventHandler(w, "mouseup",   "Button");
		SOAPI.Event.removeEventHandler(w, "mouseup",   "Action");
		SOAPI.Event.removeEventHandler(w, "mouseover", "Button");
		SOAPI.Event.removeEventHandler(w, "mouseout",  "Button");
		SOAPI.Event.addEventHandler(w, "mousedown", handlers.onMouseDown, "MenuItem");
		SOAPI.Event.addEventHandler(w, "mouseup",   handlers.onMouseUp,   "MenuItem");
		SOAPI.Event.addEventHandler(w, "mouseover", handlers.onMouseOver, "MenuItem");
		SOAPI.Event.addEventHandler(w, "mouseout",  handlers.onMouseOut,  "MenuItem");
		
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
		
		this.callParent(arguments.callee, "configure",arguments);
		this.detectSubMenu();
		
	},
	
	//-														
	//-												}		
	//-														
	
	detectSubMenu						 :	function() {
		
		var i							 =	this.childNodes.length;
		
		while (i--) {
			
			var child					 =	this.childNodes[i];
			
			if (isWidget(child, "menu")) {
				
				this.submenu			 =	child;
				this.setAttribute("heading", true);
				
				return true;
				
			}
			
		}
		
		this.submenu					 =	null;
		this.setAttribute("heading", false);
		
		return false;
		
	}
	
	//*														
	//*												}		
	//*														
	
});

//+																														
//+		Handlers																								}	{	
//+																														
	
	SOAPI.MenuItem_Handlers				 =	{
		
		onMouseDown						 :	function(event) {
			
			if (!this.submenu) {
				
				this.setAttribute("state", "down");
				
				event.preventDefault();
				event.stopPropagation();
				
			}
			
			if (ie)							SOAPI.MenuLayer.mdmenu		 =	SOAPI.MenuLayer.menu;
			
			return false;
			
		},
		onMouseUp						 :	function(event) {
			
			if (this.submenu)				return true;
			
			this.setAttribute("state", "default");
			
			event.stopPropagation();
			
			if (this.getAttribute("selectable") == "false") {
				
				SOAPI.findParentWidget(this, "menu").deactivate();
				
				SOAPI.Event.triggerEvent("action", this);
				
				return true;
				
			}
			
			SOAPI.Event.triggerEvent("select", this, { item: this, value: this.getAttribute("value") }, true);
			
			return true;
			
		},
		onMouseOver						 :	function(event) {
			
			this.setAttribute("state", "over");
			
			var submenu						 =	this.submenu;
			
			if (submenu != null && event.element !== document && !submenu.isVisible()) {
				
				submenu.show();
				submenu.styleTo( { left: "", top: "" } );
				
				submenu.adjustPosition();
				
			}
			
			return true;
			
		},
		onMouseOut						 :	function(event) {
			
			if (this.contains(event.event.relatedTarget))		return true;
			
			this.setAttribute("state", "default");
			
			if (this.submenu != null)		this.submenu.hide();
			
			return true;
			
		}
		
	};
	
//+																														
//+																												}		
//+																														
