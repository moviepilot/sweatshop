//#																														
//#	SOAPI 4.8													Copyright © 2000 - 2009 Dan Williams.					
//#																														

//+																														
//+	SOAPI.Menu																										{	
//+(																													
	
	SOAPI.setupActions.push(function() {
		SOAPI.MenuLayer					 =	SOAPI.createElement( { parent : document.body } );
		
		SOAPI.MenuLayer.menu			 =	null;			///	The current menu object.								
		SOAPI.MenuLayer.mdmenu			 =	null;			///	The menu undergoing mousedown. Used by IE only.
		
		var passMenuItem				 =	function(event) {
			if (this.menu)					SOAPI.Event.triggerEvent("select", this.menu.originalParent, event);
		};
	
		SOAPI.Event.addEventHandler(SOAPI.MenuLayer, "select", passMenuItem, "Menu");
		
	});
	
	
//+																														
	
	SOAPI.widgets.menu					 =	function(p) { new SOAPI.Menu(p); };
	
//+																														
	
	SOAPI.Menu							 =	SOAPI.List.extension();
	
	SOAPI.Menu.extend
	
//+)																													

/*(	//~	Documentation					
	///																					
	///		This class provides a menu widget.											
	///																					
)*/

({	//~	Code							
	
	//*														
	//*	Variables										{	
	//*														
	
	wtype								 :	"menu",
	ctypes								 :	{ item: SOAPI.MenuItem, toggle: SOAPI.ToggleButton, option: SOAPI.OptionButton },
	
	originalParent						 :	null,
	active								 :	false,
	
	parameters							 :	SOAPI.merge(SOAPI.List.prototype.parameters, {
		orientation						 :	"vertical"
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
		///					...inherited from List...										
		///					[string orientation]											
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
		///				string			The menu orientation.								
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
	//	var handlers					 =	SOAPI.Menu_Handlers;
		
		var vertical					 =	(p.orientation == "vertical");
		
		w.setAttribute("orientation", (vertical) ? "vertical" : "horizontal");
		w.setAttribute("ptype", (isWidget(p.parent)) ? p.parent.getAttribute("widget") : "");
		
		w.orientation					 =	(vertical) ? "vertical" : "horizontal";
		
		return result;
		
	},
	
	//-														
	//-												}		
	//-														
	
	activate							 :	function() {
		
		this.show();
		
		this.active						 =	true;
		
		
	},
	deactivate							 :	function() {
		
		this.active						 =	false;
		
		this.hide();
		
	},
	
	adjustPosition						 :	function() {
		
		var originalLeft				 =	this.get("left");
		var lright						 =	this.get("ActualLRight");
		var width						 =	this.get("ActualWidth");
		var cwidth						 =	document.getClientWidth();
		var distance					 =	lright - cwidth;
		
		if (distance > 0)					this.styleTo("left", 0 - width);
		
		var left						 =	this.get("ActualLeft");
		
	//	if (left < 0)						this.styleTo("left", this.get("left") - left);
		if (left < 0)						this.styleTo("left", originalLeft - distance);
		
		var originalTop					 =	this.get("top");
		var tbottom						 =	this.get("ActualTBottom");
		var height						 =	this.get("ActualHeight");
		var cheight						 =	document.getClientHeight();
		var distance					 =	tbottom - cheight;
		
		if (distance > 0)					this.styleTo("top", originalTop - distance);
		
	}
	
	//*														
	//*												}		
	//*														
	
});

//+																														
//+																												}		
//+																														
