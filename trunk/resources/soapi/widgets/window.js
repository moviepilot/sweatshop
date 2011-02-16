//#																														
//#	SOAPI 4.8													Copyright � 2000 - 2009 Dan Williams.					
//#																														

//+																														
//+	SOAPI.Window																									{	
//+(																													
	
	SOAPI.Events.minimize				 =	[ "onMinimize"		];
	SOAPI.Events.maximize				 =	[ "onMaximize"		];
	SOAPI.Events.restore				 =	[ "onRestore"		];
	SOAPI.Events.close					 =	[ "onClose"			];
	SOAPI.Events.onMinimize				 =	function(event) { return true };
	SOAPI.Events.onMaximize				 =	function(event) { return true };
	SOAPI.Events.onRestore				 =	function(event) { return true };
	SOAPI.Events.onClose				 =	function(event) { return true };
	
//+																														
	
	SOAPI.widgets.window				 =	function(p) { new SOAPI.Window(p); };
	
//+																														
	
	SOAPI.Window						 =	SOAPI.Panel.extension();
	
	SOAPI.Window.extend
	
//+)																													

/*(	//~	Documentation					
	///																					
	///		This class provides a window widget.										
	///																					
)*/

({	//~	Code							
	
	//*														
	//*	Variables										{	
	//*														
	
	wtype								 :	"window",
	ctypes								 :	{ titlebar: SOAPI.Panel, task: SOAPI.Button, minimize: SOAPI.Button, maximize: SOAPI.Button, close: SOAPI.Button },
	
	draggable							 :	true,
	
	parameters							 :	SOAPI.merge(SOAPI.Panel.prototype.parameters, {
		tabindex						 :	0,
		resizeable						 :	"false",
		taskbar							 :	"true"
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
		///					[boolean resizeable], [integer tabindex], [boolean taskbar]		
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
		///				integer			The window's tabindex.								
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
		var handlers					 =	SOAPI.Window_Handlers;
		
		//.	Window container							{	
		
		w.setAttribute("resizeable", p.resizeable != "false");
		w.setAttribute("taskbar",    p.taskbar    != "false");
		w.setAttribute("state",      "default");
		
		w.dragger.enabled				 =	p.resizeable != "false";
		w.dragger.removePartner(w);
		
		SOAPI.Event.addEventHandler(w, "mousedown");
		SOAPI.Event.addEventHandler(w, "mouseup");
		SOAPI.Event.addEventHandler(w, "focus",     w.onFocus,            "Widget");
		SOAPI.Event.addEventHandler(w, "focus",     handlers.onFocus,     "Window");
		SOAPI.Event.addEventHandler(w, "blur",      w.onBlur,             "Widget");
		SOAPI.Event.addEventHandler(w, "blur",      handlers.onBlur,      "Window");
		SOAPI.Event.addEventHandler(w, "drag");
		SOAPI.Event.addEventHandler(w, "dragstart", handlers.onDragStart, "Window");
		SOAPI.Event.addEventHandler(w, "dragend",   handlers.onDragEnd,   "Window");
		SOAPI.Event.addEventHandler(w, "minimize",  handlers.onMinimize,  "Window");
		SOAPI.Event.addEventHandler(w, "maximize",  handlers.onMaximize,  "Window");
		SOAPI.Event.addEventHandler(w, "restore",   handlers.onRestore,   "Window");
		SOAPI.Event.addEventHandler(w, "close",     handlers.onClose,     "Window");
		
		//.	Window content							}	{	
		
		var content						 =	c.content		 =	this.createComponent({
			element						 :	p.element,
			parent						 :	w,
			cType						 :	"content"
		}, true);
		
		SOAPI.Event.addEventHandler(content, "mousedown", handlers.content.onMouseDown, "Window");
		SOAPI.Event.addEventHandler(content, "mouseup",   handlers.content.onMouseUp,   "Window");
		
		//.	Window titlebar							}	{	
		
		var titlebar					 =	c.titlebar		 =	this.createComponent({
			element						 :	p.element,
			parent						 :	w,
			cType						 :	"titlebar"
		}, true, true);
		
		titlebar.dragger.enabled		 =	true;
		titlebar.dragger.removePartner(titlebar);
		titlebar.dragger.addPartner(w, { left: 1 }, { top: 1 });
		
		SOAPI.Event.addEventHandler(titlebar, "mousedown");
		SOAPI.Event.addEventHandler(titlebar, "mouseup");
		SOAPI.Event.addEventHandler(titlebar, "drag");
		SOAPI.Event.addEventHandler(titlebar, "dragstart", handlers.titlebar.onDragStart, "Window");
		SOAPI.Event.addEventHandler(titlebar, "dragend",   handlers.titlebar.onDragEnd,   "Window");
		
		//.	Window taskbar button					}	{	
		
		if (w.getAttribute("taskbar") != "false") {
			
			var task					 =	c.task			 =	this.createComponent({
				element					 :	p.element,
				parent					 :	w,
				cType					 :	"task",
				extras					 :	{ "class": w.className }
			});
			
			SOAPI.Event.addEventHandler(task, "mouseup",   handlers.task.onMouseUp,   "Window", [ "before Action" ]);
			SOAPI.Event.addEventHandler(task, "mousedown", handlers.task.onMouseDown, "Window");
			SOAPI.Event.addEventHandler(task, "focus",     handlers.task.onFocus,     "Window", [ "before onFocus" ]);
			
		}
		
		//.	Window minimize button					}	{	
		
		var minimize					 =	c.minimize		 =	this.createComponent({
			element						 :	p.element,
			parent						 :	w,
			cType						 :	"minimize"
		});
		
		SOAPI.Event.addEventHandler(minimize, "mouseup", handlers.minimize.onMouseUp, "Window", [ "before Action" ]);
		
		//.	Window maximize button					}	{	
		
		var maximize					 =	c.maximize		 =	this.createComponent({
			element						 :	p.element,
			parent						 :	w,
			cType						 :	"maximize"
		});
		
		SOAPI.Event.addEventHandler(maximize, "mouseup", handlers.maximize.onMouseUp, "Window", [ "before Action" ]);
		
		//.	Window close button						}	{	
		
		var close						 =	c.close			 =	this.createComponent({
			element						 :	p.element,
			parent						 :	w,
			cType						 :	"close"
		});
		
		SOAPI.Event.addEventHandler(close, "mouseup", handlers.close.onMouseUp, "Window", [ "before Action" ]);
		
		//.	Animation								}	{	
		
		var animator					 =	new SOAPI.Animator(w, "fade");
		
	//	var opacity						 =	w.get("opacity");
		var opacity						 =	0;
		
		var opacities					 =	[];
		
		for (var i = 0; i <= 5; i++) {
			
			opacities[i]				 =	opacity + (i * (100 - opacity) / 5);
			
		}
		
		animator.addAnimation(1,
			{ opacity: opacities },
			{ interval: 0, direction: -1, repeat: false, relative: false }
		);
		
		//.	Extra pieces							}	{	
		
		if (p.pieces & 4096) {
			
			var icon					 =	c.icon		 =	this.createComponent({
				element					 :	p.element,
				parent					 :	w,
				cType					 :	"icon"
			});
			
		}
		
		if (p.pieces & 8192) {
			
			var gripper					 =	c.gripper		 =	this.createComponent({
				element					 :	p.element,
				parent					 :	w,
				cType					 :	"gripper"
			});
			
		}
		
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
		
		var c							 =	this.components;
		
		if (this.hasAttribute("text"))		c.titlebar.write(this.getAttribute("text"), true);
		if (this.hasAttribute("text"))		c.task.write(this.getAttribute("text"), true);
		
		if (this.getAttribute("taskbar") != "false") {
			
			var desktop					 =	SOAPI.findParentWidget(this, "desktop");
			
			if (desktop)					desktop.components.taskbar.components.content.appendChild(c.task);
			if (desktop)					desktop.recalculateWorkspace();
			
		}
		
		function show(object) {
			return function() {
				object.show();
				try {
					object.parentWidget.focus();
				} catch(err) {}
			}
		}
		
		var animator					 =	this.animators.fade;
		
		animator.animations[1].settings.action				 =	[ show(c.content) ];
		
		c.content.hide();
		
		animator.Reverse(1);
		animator.Play(1);
		
	},
	
	//-														
	//-												}		
	//-														
	
	minimize							 :	function() { SOAPI.Event.triggerEvent("minimize", this); },
	maximize							 :	function() { SOAPI.Event.triggerEvent("maximize", this); },
	restore								 :	function() { SOAPI.Event.triggerEvent("restore", this); },
	close								 :	function() { SOAPI.Event.triggerEvent("close", this); }
	
	//*														
	//*												}		
	//*														
	
});

//+																														
//+		Handlers																								}	{	
//+																														
	
	SOAPI.Window_Handlers				 =	{
		
		onFocus							 :	function(event) {
			
			var current					 =	SOAPI.findLastChildElement(this.parentNode, "div", { widget: "window" });
			
			if (current !== this) {
				
				//!		https://bugzilla.mozilla.org/show_bug.cgi?id=254144		
				
				SOAPI.Event.triggerEvent("noderemovedfromdocument",  this, { event: { relatedTarget: this } }, false, true);
				
				this.parentNode.insertAfter(this, current);
				
				SOAPI.Event.triggerEvent("nodeinsertedintodocument", this, { event: { relatedTarget: this } }, false, true);
				
			}
			
			if (this.components.task)		this.components.task.setAttribute("focused", true);
			
			return true;
			
		},
		onBlur							 :	function(event) {
			
			if (this.components.task)		this.components.task.setAttribute("focused", false);
			
			return true;
			
		},
		
		onDragStart						 :	function(event) {
			
			var multiplyX				 =	{ width:  1 };
			var multiplyY				 =	{ height: 1 };
			
			if (SOAPI.Event.offsetX < this.get("width")  / 2) {
				
				multiplyX.left			 =	 1;
				multiplyX.width			 =	-1;
				
			}
			if (SOAPI.Event.offsetY < this.get("height") / 2) {
				
				multiplyY.top			 =	 1;
				multiplyY.height		 =	-1;
				
			}
			
			this.dragger.addPartner(this, multiplyX, multiplyY, true);
			this.dragger.addRestriction("width",  { min: this.get("minWidth") });
			this.dragger.addRestriction("height", { min: this.get("minHeight") });
			this.dragger.restrict		 =	true;
			
			return true;
			
		},
		onDragEnd						 :	function(event) {
			
			this.dragger.removePartner(this);
			this.dragger.removeRestriction("width");
			this.dragger.removeRestriction("height");
			
			return true;
			
		},
		
		onMinimize						 :	function(event) {
			
			this.hide();
			this.blur();
			
			return true;
			
		},
		onMaximize						 :	function(event) {
			
			this.setAttribute("state", "maximized");
			
			this.dragger.enabled							 =	false;
			this.components.titlebar.dragger.enabled		 =	false;
			
			SOAPI.Event.triggerEvent("sizechange", this, null, false, true);
			
			return true;
			
		},
		onRestore						 :	function(event) {
			
			if (!this.isVisible()) {
				
				this.show();
				
			} else {
				
				this.setAttribute("state", "default");
				
				this.dragger.enabled							 =	this.getAttribute("resizeable") != "false";
				this.components.titlebar.dragger.enabled		 =	true;
				
				SOAPI.Event.triggerEvent("sizechange", this, null, false, true);
				
			}
			
			this.focus();
			
			return true;
			
		},
		onClose							 :	function(event) {
			
			if (!this.closing) {
				
				this.closing			 =	true;
				
				function close(object) {
					return function() { object.close(); }
				}
				
				var animator			 =	this.animators.fade;
				
				animator.animations[1].settings.action		 =	[ close(this) ];
				
				this.components.content.hide();
				
				animator.Reverse(1);
				animator.Play(1);
				
				return true;
				
			}
			
			var desktop					 =	SOAPI.findParentWidget(this, "desktop");
			
			this.hide();
			if (this.components.task)		this.components.task.parentNode.removeChild(this.components.task);
			this.parentNode.removeChild(this);
			
			if (desktop)					desktop.recalculateWorkspace();
			
			return true;
			
		},
		
		titlebar						 :	{
			
			onDragStart					 :	function(event) {
				
				this.parentWidget.components.content.hide();
				
				return true;
				
			},
			onDragEnd					 :	function(event) {
				
				this.parentWidget.components.content.show();
				
				return true;
				
			}
			
		},
		
		content							 :	{
			
			onMouseDown					 :	function(event) {
				
				event.stopPropagation();
				
				return true;
				
			},
			onMouseUp					 :	function(event) {
				
				event.stopPropagation();
				
				return true;
				
			}
			
		},
		
		task							 :	{
			
			onMouseUp					 :	function(event) {
				
				if (!this.parentWidget.isVisible()) {
					
					SOAPI.Event.triggerEvent("restore", this.parentWidget);
					
				} else if (this.parentWidget.getAttribute("focused") == "true") {
					
					SOAPI.Event.triggerEvent("minimize", this.parentWidget);
					
				} else {
					
					this.parentWidget.focus();
					
				}
				
				return true;
				
			},
			onMouseDown					 :	function(event) {
				
				event.stopPropagation();
				event.preventDefault();
				
				return false;
				
			},
			onFocus						 :	function(event) {
				
				event.stopPropagation();
				event.preventDefault();
				
				return false;
				
			}
			
		},
		
		minimize						 :	{
			
			onMouseUp					 :	function(event) {
				
				SOAPI.Event.triggerEvent("mouseout", this);
				SOAPI.Event.triggerEvent("minimize", this.parentWidget);
				
				return true;
				
			}
			
		},
		
		maximize						 :	{
			
			onMouseUp					 :	function(event) {
				
				var w					 =	this.parentWidget;
				
				SOAPI.Event.triggerEvent("mouseout", this);
				SOAPI.Event.triggerEvent((w.getAttribute("state") == "maximized") ? "restore" : "maximize", w);
				
				return true;
				
			}
			
		},
		
		close							 :	{
			
			onMouseUp					 :	function(event) {
				
				SOAPI.Event.triggerEvent("mouseout", this);
				SOAPI.Event.triggerEvent("close",    this.parentWidget);
				
				return true;
				
			}
			
		}
		
	};
	
//+																														
//+																												}		
//+																														

