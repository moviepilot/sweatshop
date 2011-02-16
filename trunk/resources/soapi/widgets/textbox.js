//#																														
//#	SOAPI 4.8													Copyright © 2000 - 2009 Dan Williams.					
//#																														

//+																														
//+	SOAPI.Textbox																									{	
//+(																													
	
	SOAPI.widgets.textbox				 =	function(p) { new SOAPI.Textbox(p); };
	
//+																														
	
	SOAPI.Textbox						 =	SOAPI.Widget.extension();
	
	SOAPI.Textbox.extend
	
//+)																													

/*(	//~	Documentation					
	///																					
	///		This class provides a textbox widget.										
	///																					
)*/

({	//~	Code							
	
	//*														
	//*	Variables										{	
	//*														
	
	wtype								 :	"textbox",
	
	parameters							 :	SOAPI.merge(SOAPI.Widget.prototype.parameters, {
		tabindex						 :	0,
		value							 :	"",
		password						 :	"false"
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
		///					[integer tabindex], [string value], [integer maxlength],		
		///					[string filter], [string tooltip], [boolean password]			
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
		///				string			The widget's value.									
		///				integer			The maximum number of characters allowed.			
		///				string			The validation filter to use.						
		///				string			The id of the tooltip to use.						
		///				boolean			Whether the widget is a password or plain text.		
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
		var handlers					 =	SOAPI.Textbox_Handlers;
		
		//.	Textbox container							{	
		
		w.setAttribute("tabindex", "");
		w.setAttribute("password", p.password != "false");
		
		SOAPI.Event.addEventHandler(w, "focus", w.onFocus,        "Widget");
		SOAPI.Event.addEventHandler(w, "blur",  w.onBlur,         "Widget");
		SOAPI.Event.addEventHandler(w, "focus", handlers.onFocus, "Textbox");
		SOAPI.Event.addEventHandler(w, "blur",  handlers.onBlur,  "Textbox");
		
		//.	Textbox textbox							}	{	
		
		var type						 =	(p.password == "false") ? "text" : "password";
		
		var textbox						 =	c.textbox		 =	this.createComponent({
			element						 :	p.element,
			parent						 :	w,
			cType						 :	"textbox",
			eType						 :	"input",
			extras						 :	{ name: w.getAttribute("name"), tabindex: p.tabindex, value: p.value },
			criteria					 :	{ type: type }
		}, true);
		
		textbox.disabled				 =	!w.isUsable();
		textbox.write					 =	handlers.textbox.write;
		
		SOAPI.Event.addEventHandler(textbox, "focus",    w.onFocus,                   "Widget");
		SOAPI.Event.addEventHandler(textbox, "blur",     w.onBlur,                    "Widget");
		SOAPI.Event.addEventHandler(textbox, "keypress", handlers.textbox.onKeyPress, "Textbox");
		SOAPI.Event.addEventHandler(textbox, "change",   handlers.textbox.onChange,   "Textbox");
		
		//.											}		
		
		return result;
		
	},
	
	//-														
	//-												}		
	//-														
	
	write								 :	function(html, append, position) {
		
		this.components.textbox.write(html, append, position);
		
	},
	
	allow								 :	function() {
		
		this.callParent(arguments.callee, "allow");
		
		this.components.textbox.disabled =	this.isDisabled;
		
	},
	deny								 :	function() {
		
		this.callParent(arguments.callee, "deny");
		
		this.components.textbox.disabled =	true;
		
	}
	
	//*														
	//*												}		
	//*														
	
});

//+																														
//+		Handlers																								}	{	
//+																														
	
	SOAPI.Textbox_Handlers				 =	{
		
		onFocus							 :	function(event) {
			
			this.components.textbox.focus();
			
			return true;
			
		},
		onBlur							 :	function(event) {
			
			if (this.hasAttribute("tooltip"))	document.getElementById(this.getAttribute("tooltip")).deactivate(this);
			
			return true;
			
		},
		
		textbox							 :	{
			
			write						 :	function(text, append) {
				
				this.value				 =	(append) ? this.value + text : text;
				
			},
			
			onKeyPress					 :	function(event) {
				
				var valid				 =	(this.parentWidget.getAttribute("filter"))
					?	SOAPI.Validator.validateKey(
							this,
							event,
							this.parentWidget.getAttribute("filter"),
							this.parentWidget.getAttribute("maxlength")
						)
					:	true
				;
				
				if (!valid && this.parentWidget.hasAttribute("tooltip")) {
					
					var tooltip			 =	document.getElementById(this.parentWidget.getAttribute("tooltip"));
					
					tooltip.write(
						(valid === false)
						?	((event.event.keyCode == 13)
							?	"<b>Invalid key pressed.</b><br />" +
								"Please use the Tab key to move between<br />" +
								"fields, rather than the Enter key."
							:	"<b>Invalid character entered.</b><br />" +
								"The characters allowed are:<br />" +
								SOAPI.Validator.definitions[this.parentWidget.getAttribute("filter")].description
							)
						:	"<b>Maximum length reached.</b><br />" +
							"Only " + this.parentWidget.getAttribute("maxlength") +
							" characters are allowed in this field."
					);
					tooltip.activate(this.parentWidget);
					
				}
				
				return valid;
				
			},
			onChange					 :	function(event) {
				
				if (this.parentWidget.getAttribute("filter")) {
					
					this.value			 =	SOAPI.Validator.validateText(
						this.value,
						this.parentWidget.getAttribute("filter"),
						this.parentWidget.getAttribute("maxlength")
					);
					
				}
				
				return true;
				
			}
			
		}
		
	};
	
//+																														
//+																												}		
//+																														
