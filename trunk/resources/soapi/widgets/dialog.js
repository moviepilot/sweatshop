//#																														
//#	SOAPI 4.8													Copyright © 2000 - 2009 Dan Williams.					
//#																														

//+																														
//+	SOAPI.Dialog																									{	
//+(																													
	
	SOAPI.setupActions.push(function() {
		SOAPI.DialogLayer				 =	SOAPI.createElement( { parent : document.body } );
	});
	
//+																														
	
	SOAPI.widgets.dialog				 =	function(p) { new SOAPI.Dialog(p); };
	
//+																														
	
	SOAPI.Dialog						 =	SOAPI.Widget.extension();
	
	SOAPI.Dialog.extend
	
//+)																													

/*(	//~	Documentation					
	///																					
	///		This class provides a dialog widget.										
	///																					
)*/

({	//~	Code							
	
	//*														
	//*	Variables										{	
	//*														
	
	wtype								 :	"dialog",
	ctypes								 :	{ window: SOAPI.Window },
	
	action								 :	null,
	
	parameters							 :	SOAPI.merge(SOAPI.Widget.prototype.parameters, {
		resizeable						 :	"false"
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
		///					[boolean resizeable]											
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
		///				boolean			Whether the window is resizeable.					
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
		var handlers					 =	SOAPI.Dialog_Handlers;
		
		//.	Dialog window								{	
		
		var window						 =	c.window		 =	this.createComponent({
			element						 :	p.element,
			parent						 :	w,
			cType						 :	"window",
			extras						 :	{ taskbar: "false" }
		});
		
		window.draggable				 =	false;
		
		SOAPI.Event.removeEventHandler(window, 					"blur", 										"Widget");
		SOAPI.Event.removeEventHandler(window.components.close, "mouseup", 										"Window");
		SOAPI.Event.addEventHandler(window.components.close, 	"mouseup", 	handlers.close.onMouseUp, 			"Dialog", [ "before Action" ]);
		//SOAPI.Event.addEventHandler(window.components.content,	"change",	[w,handlers.window.contentChange],	"Window");
		
		
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
		
		if (this.hasAttribute("text"))		this.components.window.components.titlebar.write(this.getAttribute("text"), true);
		
		this.hide();
		
	},
	
	//-														
	//-												}		
	//-														
	
	activate							 :	function(action) {
		
		this.action						 =	action;
		
		if (this.parentNode !== SOAPI.DialogLayer)				SOAPI.DialogLayer.appendChild(this);
				
		this.resizePositionAndShow();
			
	},
	
	deactivate							 :	function(value) {
		
		if (this.action &&  isFunction(this.action))			this.action(value);
		if (this.action && !isFunction(this.action))			eval(this.action);
		
		this.action						 =	null;
		
		this.hide();
		
	},
	
	resizePositionAndShow				 :	function() {
		
		var window						 =	this.components.window;
		
		this.show();
		this.moveTo(0, 0);
		
		//~ Just base the width on the first child element
		
		if (window.components.content.children[0] != undefined) {
		
			var width						 =	window.components.content.children[0].get('clientwidth');
			var height						 = 	window.components.content.children[0].get('clientheight');
	
			window.sizeTo(width,height);
			
		}
		
		window.styleTo("left", (document.getClientWidth()  - window.get("width"))  / 2);
		window.styleTo("top",  (document.getClientHeight() - window.get("height")) / 2);
					
		window.focus();
		
	}
	
	//*														
	//*												}		
	//*														
	
});

//+																														
//+		Handlers																								}	{	
//+																														
	
	SOAPI.Dialog_Handlers				 =	{
		
		close							 :	{
			
			onMouseUp					 :	function(event) {
				
				SOAPI.Event.triggerEvent("mouseout", this);
				
				this.parentWidget.parentWidget.deactivate("close");
				
				return true;
				
			}
			
		},
		
		window							 :	{
			
			contentChange				 :	function(event) {
			
				this.resizePositionAndShow();
				
				return true;
			
			}
		
		}
		
	};
	
//+																														
//+																												}		
//+																														
