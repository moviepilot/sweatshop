//#																														
//#	SOAPI 4.8													Copyright © 2000 - 2009 Dan Williams.					
//#																														

//+																														
//+	SOAPI.Scrollbox																									{	
//+(																													
	
	SOAPI.widgets.scrollbox				 =	function(p) { new SOAPI.Scrollbox(p); };
	
//+																														
	
	SOAPI.Scrollbox						 =	SOAPI.Panel.extension();
	
	SOAPI.Scrollbox.extend
	
//+)																													

/*(	//~	Documentation					
	///																					
	///		This class provides a scrollbox widget.										
	///																					
)*/

({	//~	Code							
	
	//*														
	//*	Variables										{	
	//*														
	
	wtype								 :	"scrollbox",
	ctypes								 :	{ scrollbarV: SOAPI.Scrollbar, scrollbarH: SOAPI.Scrollbar },
	
	parameters							 :	SOAPI.merge(SOAPI.Panel.prototype.parameters, {
		scrollbars						 :	"",
		scrollbarH						 :	"",
		scrollbarV						 :	""
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
		///					...inherited from Panel...										
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
		var handlers					 =	SOAPI.Scrollbox_Handlers;
		
		//.	Scrollbox container							{	
		
		if (p.scrollbars != "both" && p.scrollbars != "none" && p.scrollbars != "horizontal" && p.scrollbars != "vertical") {
			
			p.scrollbars				 =	"auto";
			
		}
		if (p.scrollbarH != "on" && p.scrollbarH != "off" && p.scrollbarH != "auto") {
			
			p.scrollbarH				 =	(p.scrollbars == "both" || p.scrollbars == "horizontal")
				?	"on"
				:	((p.scrollbars == "none" || p.scrollbars == "vertical") ? "off" : "auto"
			);
			
		}
		if (p.scrollbarV != "on" && p.scrollbarV != "off" && p.scrollbarV != "auto") {
			
			p.scrollbarV				 =	(p.scrollbars == "both" || p.scrollbars == "vertical")
				?	"on"
				:	((p.scrollbars == "none" || p.scrollbars == "horizontal") ? "off" : "auto"
			);
			
		}
		
		w.setAttribute("scrollbars", p.scrollbars);
		w.setAttribute("scrollbarH", p.scrollbarH);
		w.setAttribute("scrollbarV", p.scrollbarV);
		w.setAttribute("scrollH",    p.scrollbarH == "on");
		w.setAttribute("scrollV",    p.scrollbarV == "on");
		
		SOAPI.Event.addEventHandler(w, "mousewheel",    handlers.onMouseWheel,    "Scrollbox");
		SOAPI.Event.addEventHandler(w, "sizechange",    handlers.onSizeChange,    "Scrollbox");
		SOAPI.Event.addEventHandler(w, "contentchange", handlers.onContentChange, "Scrollbox");
		
		//.	Scrollbox content						}	{	
		
		var content						 =	c.content		 =	this.createComponent({
			element						 :	p.element,
			parent						 :	w,
			cType						 :	"content"
		}, true);
		
		content.write					 =	handlers.content.write;
		
		//.	Vertical scrollbar 						}	{	
		
		var scrollbarV					 =	c.scrollbarV	 =	this.createComponent({
			element						 :	p.element,
			parent						 :	w,
			cType						 :	"scrollbarV",
			parameters					 :	{ orientation: "vertical" }
		});
		
		//.	Horizontal scrollbar 					}	{	
		
		var scrollbarH					 =	c.scrollbarH	 =	this.createComponent({
			element						 :	p.element,
			parent						 :	w,
			cType						 :	"scrollbarH",
			parameters					 :	{ orientation: "horizontal" }
		});
		
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
		
		if (this.getAttribute("scrollbarV") != "on")			this.hideScrollbarV();
		if (this.getAttribute("scrollbarH") != "on")			this.hideScrollbarH();
		
		SOAPI.Event.triggerEvent("contentchange", this);
		
	},
	
	//-														
	//-												}		
	//-														
	
	recalculate							 :	function() {
		
		if (!this.isUsable())				return false;
		
		var content						 =	this.components.content;
		var scrollbarV					 =	this.components.scrollbarV;
		var scrollbarH					 =	this.components.scrollbarH;
		var contentHeight				 =	content.get("actualHeight");
		var contentWidth				 =	content.get("actualWidth");
		var scrollHeight				 =	content.get("scrollHeight");
		var scrollWidth					 =	content.get("scrollWidth");
		var scrollTop					 =	content.get("scrollTop");
		var scrollLeft					 =	content.get("scrollLeft");
		
		if (scrollHeight - scrollTop < contentHeight) {
			
			content.styleTo("scrollTop", scrollHeight - contentHeight);
			
			scrollTop					 =	content.get("scrollTop");
			
		}
		
		if (scrollWidth - scrollLeft < contentWidth) {
			
			content.styleTo("scrollLeft", scrollWidth - contentWidth);
			
			scrollLeft					 =	content.get("scrollLeft");
			
		}
		
		this.setupScrollPartners();
		
		scrollbarV.recalculateScrollProperties(0, scrollHeight, scrollTop,  contentHeight);
		scrollbarH.recalculateScrollProperties(0, scrollWidth,  scrollLeft, contentWidth);
		
		if (contentHeight < scrollHeight) {
			
			if (!scrollbarV.isUsable())		this.showScrollbarV();
			
		} else {
			
			if (scrollbarV.isUsable())		this.hideScrollbarV();
			
		}
		
		if (content.get("actualWidth") < content.get("scrollWidth")) {
			
			if (!scrollbarH.isUsable())		this.showScrollbarH();
			
		} else {
			
			if (scrollbarH.isUsable())		this.hideScrollbarH();
			
		}
		
		return true;
		
	},
	
	setupScrollPartners					 :	function() {
		
		var content						 =	this.components.content;
		var scrollbarV					 =	this.components.scrollbarV;
		var scrollbarH					 =	this.components.scrollbarH;
		var contentHeight				 =	content.get("actualHeight");
		var contentWidth				 =	content.get("actualWidth");
		var scrollHeight				 =	content.get("scrollHeight");
		var scrollWidth					 =	content.get("scrollWidth");
		
		scrollbarV.removePartner(content);
		scrollbarH.removePartner(content);
		scrollbarV.addPartner(content, "scrollTop",  0, scrollHeight - contentHeight);
		scrollbarH.addPartner(content, "scrollLeft", 0, scrollWidth  - contentWidth);
		
	},
	
	showScrollbarH						 :	function() {
		
		if (this.getAttribute("scrollbarH") == "off")			return;
		
		this.components.scrollbarH.allow();
		this.components.scrollbarH.show();
		
		if (this.getAttribute("scrollH") == "true")				return;
		
		this.setAttribute("scrollH", true);
		
		this.recalculate();
		
	},
	hideScrollbarH						 :	function() {
		
		this.components.scrollbarH.deny();
		
		if (this.getAttribute("scrollbarH") == "on")			return;
		
		this.components.scrollbarH.hide();
		
		if (this.getAttribute("scrollH") == "false")			return;
		
		this.setAttribute("scrollH", false);
		
		this.recalculate();
		
	},
	
	showScrollbarV						 :	function() {
		
		if (this.getAttribute("scrollbarV") == "off")			return;
		
		this.components.scrollbarV.allow();
		this.components.scrollbarV.show();
		
		if (this.getAttribute("scrollV") == "true")				return;
		
		this.setAttribute("scrollV", true);
		
		this.recalculate();
		
	},
	hideScrollbarV						 :	function() {
		
		this.components.scrollbarV.deny();
		
		if (this.getAttribute("scrollbarV") == "on")			return;
		
		this.components.scrollbarV.hide();
		
		if (this.getAttribute("scrollV") == "false")			return;
		
		this.setAttribute("scrollV", false);
		
		this.recalculate();
		
	},
	
	allow								 :	function(noBubble) {
		
		this.callParent(arguments.callee, "allow", arguments);
		
		SOAPI.Event.triggerEvent("contentchange", this);
		
	}
	
	//*														
	//*												}		
	//*														
	
});

//+																														
//+		Handlers																								}	{	
//+																														
	
	SOAPI.Scrollbox_Handlers			 =	{
		
		onMouseWheel					 :	function(event) {
			
			event.stopPropagation();
			event.preventDefault();
			
			var scrollbar				 =	(this.components.scrollbarV.isUsable()) ? "scrollbarV" : "scrollbarH";
			
			SOAPI.Event.triggerEvent("scrollstart", this.components[scrollbar], { direction: SOAPI.Event.wheelDelta, wheelUsed: true });
			
			return false;
			
		},
		onSizeChange					 :	function(event) {
			
			return this.recalculate();
			
		},
		onContentChange					 :	function(event) {
			
			return this.recalculate() || true;
			
		},
		
		content							 :	{
			
			write						 :	function(html) {
				
				this.innerHTML			 =	html;
				
				SOAPI.Event.triggerEvent("contentchange", this.parentWidget);
				
			}
			
		}
		
	};
	
//+																														
//+																												}		
//+																														
