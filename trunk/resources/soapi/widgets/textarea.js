//#																														
//#	SOAPI 4.8													Copyright � 2000 - 2009 Dan Williams.					
//#																														

//+																														
//+	SOAPI.Textarea																									{	
//+(																													
	
	SOAPI.widgets.textarea				 =	function(p) { new SOAPI.Textarea(p); };
	
//+																														
	
	SOAPI.Textarea						 =	SOAPI.Widget.extension();
	
	SOAPI.Textarea.extend
	
//+)																													

/*(	//~	Documentation					
	///																					
	///		This class provides a textarea widget.										
	///																					
)*/

({	//~	Code							
	
	//*														
	//*	Variables										{	
	//*														
	
	wtype								 :	"textarea",
	ctypes								 :	{ scrollbox: SOAPI.Scrollbox },
	
	parameters							 :	SOAPI.merge(SOAPI.Widget.prototype.parameters, {
		tabindex						 :	0
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
		///					[integer tabindex], [integer maxlength], [string filter],		
		///					[string tooltip], [string text]									
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
		///				integer			The widget's tabindex.								
		///				integer			The maximum number of characters allowed.			
		///				string			The validation filter to use.						
		///				string			The id of the tooltip to use.						
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
		var handlers					 =	SOAPI.Textarea_Handlers;
		
		//.	Textarea container							{	
		
		w.allow							 =	SOAPI.Textbox.prototype.allow;
		w.deny							 =	SOAPI.Textbox.prototype.deny;
		w.write							 =	SOAPI.Textbox.prototype.write;
		
		w.setAttribute("tabindex", "");
		
		SOAPI.Event.addEventHandler(w, "focus", w.onFocus, "Widget");
		SOAPI.Event.addEventHandler(w, "blur",  w.onBlur,  "Widget");
		SOAPI.Event.addEventHandler(w, "focus", SOAPI.Textbox_Handlers.onFocus, "Textarea");
		SOAPI.Event.addEventHandler(w, "blur",  SOAPI.Textbox_Handlers.onBlur,  "Textarea");
		
		SOAPI.Event.addEventHandler(w, "noderemovedfromdocument",  handlers.onNodeRemovedFromDocument,  "Textarea");
		SOAPI.Event.addEventHandler(w, "nodeinsertedintodocument", handlers.onNodeInsertedIntoDocument, "Textarea");
		
		//.	Textarea scrollbox						}	{	
		
		var scrollbox					 =	c.scrollbox		 =	this.createComponent({
			element						 :	p.element,
			parent						 :	w,
			cType						 :	"scrollbox"
		});
		
		scrollbox.disabled				 =	!w.isUsable();
		scrollbox.components.scrollbarV.removePartner(scrollbox.components.content);
		scrollbox.components.scrollbarH.removePartner(scrollbox.components.content);
		scrollbox.setupScrollPartners	 =	handlers.scrollbox.setupScrollPartners;
		scrollbox.recalculate			 =	handlers.scrollbox.recalculate;
		
		//.	Textarea textbox						}	{	
		
		var textbox						 =	c.textbox		 =	this.createComponent({
			element						 :	scrollbox.components.content,
			parent						 :	scrollbox.components.content,
			widget						 :	w,
			cType						 :	"textbox",
			eType						 :	"iframe",
			extras						 :	{ name: w.getAttribute("name"), tabindex: p.tabindex }
		}, true);
		
		textbox.disabled				 =	!w.isUsable();
		textbox.write					 =	handlers.textbox.write;
		
		SOAPI.Event.addEventHandler(textbox, "focus", w.onFocus, "Widget");
		SOAPI.Event.addEventHandler(textbox, "blur",  w.onBlur,  "Widget");
		
		c.scrollbox.components.content.components			 =	{};
		c.scrollbox.components.content.components.textbox	 =	c.textbox;
		
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
		
		this.setupIframe();
		
		if (this.hasAttribute("text"))		this.write(this.getAttribute("text"), true, "afterbegin");
		
		this.removeAttribute("text");
		
	},
	
	//-														
	//-												}		
	//-														
	
	getValue							 :	function() {
		
		return this.components.textbox.body.innerHTML;
		
	},
	
	setValue							 :	function(value) {
		
		this.components.textbox.body.innerHTML				 =	value;
		
	},
	
	setupIframe							 :	function() {
		
		var handlers					 =	SOAPI.Textarea_Handlers;
		var textbox						 =	this.components.textbox;
		
		textbox.contentWindow.HTMLElement					 =	HTMLElement;
		
		var doc							 =	textbox.contentWindow.document;
		
		doc.parentWidget				 =	this;
		doc.designMode					 =	"On";
		doc.open();
		doc.write("<html><head></head><body style='font-family: Tahoma, Verdana, Arial, sans-serif; font-size: 11px; color: #001563; margin: 0px; padding: 1px 3px;'></body></html>");
		doc.close();
		
		SOAPI.Event.addEventHandler(doc, "keypress", handlers.textbox.onKeyPress, "Textarea");
		SOAPI.Event.addEventHandler(doc, "change",   handlers.textbox.onChange,   "Textarea");
		SOAPI.Event.addEventHandler(textbox, "keypress", SOAPI.Textbox_Handlers.textbox.onKeyPress, "Textbox");
		SOAPI.Event.addEventHandler(textbox, "change",   SOAPI.Textbox_Handlers.textbox.onChange,   "Textbox");
		
		textbox.body					 =	doc.body;
		
	},
	
	updateSize							 :	function() {
		
		var content						 =	this.components.scrollbox.components.content;
		var textbox						 =	this.components.textbox;
		var body						 =	textbox.body;
		
		var contentHeight				 =	content.get("height");
		var textboxHeight				 =	textbox.get("clientHeight");
		var bodyHeight					 =	body.offsetHeight + 20;
		
		if (bodyHeight > textboxHeight || (bodyHeight < textboxHeight && bodyHeight > contentHeight)) {
			
			textbox.styleTo("height", bodyHeight);
			SOAPI.Event.triggerEvent("contentchange", this.components.scrollbox);
			
		} else if (bodyHeight < contentHeight) {
			
			textbox.styleTo("height", contentHeight);
			SOAPI.Event.triggerEvent("contentchange", this.components.scrollbox);
			
		}
		
	}
	
	//*														
	//*												}		
	//*														
	
});

//+																														
//+		Handlers																								}	{	
//+																														
	
	SOAPI.Textarea_Handlers				 =	{
		
		onNodeRemovedFromDocument		 :	function(event) {
			
			this.savedValue				 =	this.getValue();
			
			return true;
			
		},
		
		onNodeInsertedIntoDocument		 :	function(event) {
			
			this.setupIframe();
			
			this.setValue(this.savedValue);
			
			this.savedValue				 =	null;
			
			return true;
			
		},
		
		scrollbox						 :	{
			
			recalculate					 :	function() {
				
				if (!this.isUsable())		return false;
				
				var content				 =	this.components.content.components.textbox.body;
				var scrollbarV			 =	this.components.scrollbarV;
				var scrollbarH			 =	this.components.scrollbarH;
				var contentHeight		 =	content.clientHeight;
				var contentWidth		 =	content.clientWidth;
				var scrollHeight		 =	content.scrollHeight;
				var scrollWidth			 =	content.scrollWidth;
				var scrollTop			 =	content.scrollTop;
				var scrollLeft			 =	content.scrollLeft;
				
				if (scrollHeight - scrollTop < contentHeight) {
					
					SOAPI.Sprite.prototype.styleTo.apply(content, [ "scrollTop", scrollHeight - contentHeight ]);
					
					scrollTop			 =	content.scrollTop;
					
				}
				
				if (scrollWidth - scrollLeft < contentWidth) {
					
					SOAPI.Sprite.prototype.styleTo.apply(content, [ "scrollLeft", scrollWidth - contentWidth ]);
					
					scrollLeft			 =	content.scrollLeft;
					
				}
				
				this.setupScrollPartners();
				
				scrollbarV.recalculateScrollProperties(0, scrollHeight, scrollTop,  contentHeight);
				scrollbarH.recalculateScrollProperties(0, scrollWidth,  scrollLeft, contentWidth);
				
				if (contentHeight < scrollHeight) {
					
					if (!scrollbarV.isUsable())					this.showScrollbarV();
					
				} else {
					
					if (scrollbarV.isUsable())					this.hideScrollbarV();
					
				}
				
				if (content.clientWidth < content.scrollWidth) {
					
					if (!scrollbarH.isUsable())					this.showScrollbarH();
					
				} else {
					
					if (scrollbarH.isUsable())					this.hideScrollbarH();
					
				}
				
			},
			
			setupScrollPartners			 :	function() {
				
				var content				 =	this.components.content.components.textbox.body;
				var scrollbarV			 =	this.components.scrollbarV;
				var scrollbarH			 =	this.components.scrollbarH;
				var contentHeight		 =	content.clientHeight;
				var contentWidth		 =	content.clientWidth;
				var scrollHeight		 =	content.scrollHeight;
				var scrollWidth			 =	content.scrollWidth;
				
				scrollbarV.removePartner(content);
				scrollbarH.removePartner(content);
				scrollbarV.addPartner(content, "scrollTop",  0, scrollHeight - contentHeight);
				scrollbarH.addPartner(content, "scrollLeft", 0, scrollWidth  - contentWidth);
				
			}
			
		},
		
		textbox							 :	{
			
			write						 :	function(html, append, position) {
				
				position				 =	position || "beforeend";
				
				if (append)					this.body.insertAdjacentHTML(position, html);
				else						this.body.innerHTML	 =	html;
				
			},
			
			onKeyPress					 :	function(event) {
				
				SOAPI.Event.triggerEvent("contentchange", this.parentWidget.components.scrollbox);
				
				return true;
				
			},
			
			onChange					 :	function(event) {
				
				SOAPI.Event.triggerEvent("contentchange", this.parentWidget.components.scrollbox);
				
				return true;
				
			}
			
		}
		
	};
	
//+																														
//+																												}		
//+																														
