//#																														
//#	SOAPI 4.8													Copyright © 2000 - 2009 Dan Williams.					
//#																														

//+																														
//+	SOAPI.SplitPanel																								{	
//+(																													
	
	SOAPI.widgets.splitpanel			 =	function(p) { new SOAPI.SplitPanel(p); };
	
//+																														
	
	SOAPI.SplitPanel					 =	SOAPI.Widget.extension();
	
	SOAPI.SplitPanel.extend
	
//+)																													

/*(	//~	Documentation					
	///																					
	///		This class provides a split panel widget.									
	///																					
)*/

({	//~	Code							
	
	//*														
	//*	Variables										{	
	//*														
	
	wtype								 :	"splitpanel",
	ctypes								 :	{ topleft: SOAPI.Panel, bottomright: SOAPI.Panel, handle: SOAPI.Button },
	
	orientation							 :	"horizontal",
	
	parameters							 :	SOAPI.merge(SOAPI.Widget.prototype.parameters, {
		orientation						 :	"horizontal"
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
		///				string			The split's orientation (vertical or horizontal).	
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
		var handlers					 =	SOAPI.SplitPanel_Handlers;
		
		//.	SplitPanel container						{	
		
		var vertical					 =	(p.orientation == "vertical");
		
		w.setAttribute("orientation", (vertical) ? "vertical" : "horizontal");
		
		w.orientation					 =	(vertical) ? "vertical" : "horizontal";
		w.onsizechange					 =	SOAPI.Event.onsizechange;
		
		SOAPI.Event.addEventHandler(w, "sizechange", handlers.onSizeChange, "SplitPanel");
		
		//.	SplitPanel top/left panel				}	{	
		
		var topleft						 =	c.topleft		 =	this.createComponent({
			element						 :	p.element,
			parent						 :	w,
			cType						 :	"topleft"
		}, true, true);
		
		//.	SplitPanel bottom/right panel			}	{	
		
		var bottomright					 =	c.bottomright	 =	this.createComponent({
			element						 :	p.element,
			parent						 :	w,
			cType						 :	"bottomright"
		}, true, true);
		
		//.	SplitPanel splitter						}	{	
		
		var splitter					 =	c.splitter		 =	this.createComponent({
			element						 :	p.element,
			parent						 :	w,
			cType						 :	"splitter"
		}, true, true);
		
		splitter.components				 =	c				 =	{};
		
		//.	SplitPanel handle						}	{	
		
		var handle						 =	c.handle		 =	this.createComponent({
			element						 :	splitter,
			parent						 :	splitter,
			widget						 :	w,
			cType						 :	"handle"
		}, true, true);
		
		SOAPI.Event.addEventHandler(handle, "dragstart");
		SOAPI.Event.addEventHandler(handle, "dragend");
		SOAPI.Event.addEventHandler(handle, "drag",      handlers.handle.onDrag,      "SplitPanel");
		
		handle.dragger.enabled			 =	true;
		handle.dragger.removePartner(handle);
		topleft.dragger.restrict		 =	true;
		bottomright.dragger.restrict	 =	true;
		
		if (vertical) {
			
			topleft.dragger.addRestriction(    "height", { min: 0});
			bottomright.dragger.addRestriction("height", { min: 0});
			handle.dragger.addPartner(splitter,    null, { top:    1 }, true);
			handle.dragger.addPartner(topleft,     null, { height: 1 }, true);
			handle.dragger.addPartner(bottomright, null, { top:    1 }, true);
			
		} else {
			
			topleft.dragger.addRestriction(    "width", { min: 0});
			bottomright.dragger.addRestriction("width", { min: 0});
			handle.dragger.addPartner(splitter,    { left:  1 }, null, true);
			handle.dragger.addPartner(topleft,     { width: 1 }, null, true);
			handle.dragger.addPartner(bottomright, { left:  1 }, null, true);
			
		}
		
		//.												}		
		
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
		
		SOAPI.Event.triggerEvent("sizechange", this);
		
	},
	
	//-														
	//-												}		
	//-														
	
	splitTo								 :	function(position) {
		
		var vertical					 =	(this.orientation == "vertical");
		var topleft						 =	this.components.topleft;
		var bottomright					 =	this.components.bottomright;
		var splitter					 =	this.components.splitter;
		var sizeProperty				 =	(vertical) ? "height" : "width";
		var startProperty				 =	(vertical) ? "top"    : "left";
		var splitterSize				 =	splitter.get("Actual" + sizeProperty);
		
		splitter.styleTo(   startProperty, position)
		topleft.styleTo(    sizeProperty,  position);
		bottomright.styleTo(startProperty, position + splitterSize);
		
		SOAPI.Event.triggerEvent("sizechange", this);
		
	}
	
	//*														
	//*												}		
	//*														
	
});

//+																														
//+		Handlers																								}	{	
//+																														
	
	SOAPI.SplitPanel_Handlers			 =	{
		
		onSizeChange					 :	function(event) {
			
			var vertical				 =	(this.orientation == "vertical");
			var topleft					 =	this.components.topleft;
			var bottomright				 =	this.components.bottomright;
			var splitter				 =	this.components.splitter;
			var sizeProperty			 =	(vertical) ? "height" : "width";
			var startProperty			 =	(vertical) ? "top"    : "left";
			var totalSize				 =	this.get("Actual" + sizeProperty);
			var splitterStart			 =	splitter.get(startProperty);
			var splitterSize			 =	splitter.get("Actual" + sizeProperty);
			
			if (splitterStart > totalSize - splitterSize)		splitter.styleTo(startProperty, totalSize - splitterSize);
			if (totalSize < splitterSize)						splitter.styleTo(startProperty, 0);
			
			splitterStart				 =	splitter.get(startProperty);
			
			topleft.styleTo(    sizeProperty,  splitterStart);
			bottomright.styleTo(startProperty, splitterStart + splitterSize);
			
		},
		
		handle							 :	{
			
			onDrag						 :	function(event) {
				
				SOAPI.Event.triggerEvent("sizechange", this.parentWidget, null, false, true);
				
				return true;
				
			}
			
		}
		
	};
	
//+																														
//+																												}		
//+																														
