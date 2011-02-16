//#																														
//#	SOAPI 4.8													Copyright � 2000 - 2009 Dan Williams.					
//#																														

//+																														
//+	SOAPI.Selectbox																									{	
//+(																													
	
	SOAPI.widgets.selectbox				 =	function(p) { new SOAPI.Selectbox(p); };
	
//+																														
	
	SOAPI.Selectbox						 =	SOAPI.Button.extension();
	
	SOAPI.Selectbox.extend
	
//+)																													

/*(	//~	Documentation					
	///																					
	///		This class provides a select box widget.									
	///																					
)*/

({	//~	Code							
	
	//*														
	//*	Variables										{	
	//*														
	
	wtype								 :	"selectbox",
	ctypes								 :	{ menu: SOAPI.Menu },
	
	parameters							 :	SOAPI.merge(SOAPI.Button.prototype.parameters, {
		value							 :	""
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
		///					[string value]													
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
		var handlers					 =	SOAPI.Selectbox_Handlers;
		
		SOAPI.Event.addEventHandler(w, "mousedown", handlers.onMouseDown, "Selectbox");
		SOAPI.Event.addEventHandler(w, "select",    handlers.onSelect,    "Selectbox");
		SOAPI.Event.addEventHandler(w, "focus",     handlers.onFocus,     "Selectbox");
		SOAPI.Event.addEventHandler(w, "blur",      handlers.onBlur,      "Selectbox");
		
		if (w.hasAttribute("onselect")) {
			
			eval("var func = function(event) {" + w.getAttribute("onselect") + "}");
			SOAPI.Event.addEventHandler(w, "select", func, "Attribute");
			w.removeAttribute("onselect");
			
		}
		
		//.	Selectbox content							{	
		
		var content						 =	c.content		 =	this.createComponent({
			element						 :	p.element,
			parent						 :	w,
			cType						 :	"content"
		}, true);
		
		//.	Selectbox value							}	{	
		
		var value						 =	c.value			 =	this.createComponent({
			element						 :	p.element,
			parent						 :	w,
			cType						 :	"value",
			eType						 :	"input",
			extras						 :	{ type: "hidden", name: w.getAttribute("name"), value: p.value },
			criteria					 :	{ type: "hidden" }
		});
		
		w.setAttribute("value", "");
		
		//.	Selectbox menu							}	{	
		
		var menu						 =	c.menu			 =	this.createComponent({
			element						 :	p.element,
			parent						 :	w,
			cType						 :	"menu"
		});
		
		menu.hide();
		
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
	
	SOAPI.Selectbox_Handlers			 =	{
		
		onSelect						 :	function(event) {
			
			var menuItem				 =	event.item;
			var content					 =	this.components.content;
			var i						 =	content.childNodes.length;
			
			while (i--)						content.removeChild(content.childNodes[i]);
			
			for (var i = 0; i < menuItem.childNodes.length; i++) {
				
				var node				 =	menuItem.childNodes[i];
				
				if (!isWidget(node, "menu")) {
					
					content.appendChild(node.cloneNode(true));
					
				}
				
			}
			
			this.components.value.value	 =	event.value;
			this.components.menu.deactivate();
			
			SOAPI.Event.triggerEvent('change',this.components.value);
			
			event.stopPropagation();
			
			return true;
			
		},
		onMouseDown						 :	function(event) {
			
			var menu					 =	this.components.menu;
			
			if (menu.active)				return (menu.deactivate() || true);
			
			menu.activate();
			
			if ((menu.get("ActualTBottom") - document.getClientHeight() > 0) && !menu.hasClassName('above')) {
				
				menu.styleTo("top", menu.get("top") - menu.get("ActualHeight") - this.get("ActualHeight"));
				
				menu.addClassName('above');
				
			} 			
			
			menu.styleTo("width", this.get("width"));
			
			var thisWidth				 =	this.get("ActualWidth");
			var menuWidth				 =	menu.get("ActualWidth");
			
			if (menuWidth != thisWidth)		menu.styleBy("width", thisWidth - menuWidth);
			
			return true;
			
		},
		onFocus							 :	function(event) {
			
			SOAPI.Event.triggerEvent("mouseover", this);
			
			return true;
			
		},
		onBlur							 :	function(event) {
			
			if (ie && SOAPI.MenuLayer.mdmenu && SOAPI.MenuLayer.mdmenu.originalParent === this) {
				
				SOAPI.MenuLayer.mdmenu		 =	null;
				
				event.preventDefault();
				event.stopPropagation();
				
				return false;
				
			}
		
			SOAPI.Event.triggerEvent("mouseout", this);
			
			this.components.menu.deactivate();
			
			return true;
			
		}
		
	};
	
//+																														
//+																												}		
//+																														
