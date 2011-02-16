//#																														
//#	SOAPI 4.8													Copyright � 2000 - 2009 Dan Williams.					
//#																														

//+																														
//+	SOAPI.Tooltip																									{	
//+(																													
	
	SOAPI.widgets.tooltip				 =	function(p) { new SOAPI.Tooltip(p); };
	
//+																														
	
	SOAPI.Tooltip						 =	SOAPI.Panel.extension();
	
	SOAPI.Tooltip.extend
	
//+)																													

/*(	//~	Documentation					
	///																					
	///		This class provides a tooltip widget.										
	///																					
)*/

({	//~	Code							
	
	//*														
	//*	Variables										{	
	//*														
	
	wtype								 :	"tooltip",
	
	point								 :	"bottom",
	action								 :	null,
	
	delay								 :	5000,
	
	caller								 :	null,
	
	parameters							 :	SOAPI.merge(SOAPI.Panel.prototype.parameters, {
		tabindex						 :	0,
		point							 :	"bottom"
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
		///					[string point]													
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
		///				string			The point orientation.								
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
		var handlers					 =	SOAPI.Tooltip_Handlers;
		
		//.	Tooltip container							{	
		
		w.point							 =	p.point;
		
		SOAPI.Event.addEventHandler(w, "mouseup",   handlers.onMouseUp,   "Tooltip");
		SOAPI.Event.addEventHandler(w, "mouseover", handlers.onMouseOver, "Tooltip");
		SOAPI.Event.addEventHandler(w, "mouseout",  handlers.onMouseOut,  "Tooltip");
		SOAPI.Event.addEventHandler(w, "focus",     handlers.onFocus,     "Tooltip");
		
		//.	Tooltip content							}	{	
		
		var content						 =	c.content		 =	this.createComponent({
			element						 :	p.element,
			parent						 :	w,
			cType						 :	"content"
		}, true);
		
		if (p.pieces & 4096) {
			
			c.point						 =	this.createComponent({
				element					 :	p.element,
				parent					 :	w,
				cType					 :	"point"
			}, true);
			
		}
		
		//.	Animation								}	{	
		
		var animator					 =	new SOAPI.Animator(w, "fadein");
		
		var opacity						 =	0;
		
		var opacities					 =	[];
		
		for (var i = 0; i <= 5; i++) {
			
			opacities[i]				 =	opacity + (i * (90 - opacity) / 5);
			
		}
		
		animator.addAnimation(1,
			{ opacity: opacities },
			{ interval: 40, repeat: false, relative: false }
		);
		
		var animator					 =	new SOAPI.Animator(w, "fadeout");
		
		animator.addAnimation(1);
		
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
		
		this.hide();
		
	},
	
	//-														
	//-												}		
	//-														
	
	activate							 :	function(caller, action) {
		
		this.caller						 =	caller;
		
		clearTimeout(this.timer);
		
		this.animators.fadein.Reset(1);
		
		var animator					 =	this.animators.fadeout;
		
		animator.Stop(1);
		animator.Reset(1);
		
		this.action						 =	action;
		
		var parentLayer					 =
				SOAPI.findParentWidget(caller, "desktop")
			||	SOAPI.findParentWidget(caller, "desktop").parentNode
			||	document.body
		;
		
		parentLayer.appendChild(this);
		
		this.show();
		this.moveTo(0, 0);
		
		var width						 =	this.get("actualWidth");
		var height						 =	this.get("actualHeight");
		
		if (this.point == "bottomleft") {
			
			var vertDiff				 =	this.components.point.get("actualTBottom") - this.get("actualTBottom");
			var horizDiff				 =	this.get("actualLeft") - this.components.point.get("actualLeft");
			
			var callerWidth				 =	caller.get("actualWidth");
			var callerHeight			 =	caller.get("actualHeight");
			var callerLRight			 =	caller.get("actualLRight");
			var callerTop				 =	caller.get("actualTop");
			
			var minWidth				 =	(callerWidth  > 40) ? 20 : callerWidth  / 2;
			var minHeight				 =	(callerHeight > 40) ? 20 : callerHeight / 2;
			
			this.moveTo(
				callerLRight - minWidth + horizDiff,
				callerTop    + minHeight - height - vertDiff
			);
			
		}
		
		if (!this.active)					this.animators.fadein.Play(1);
		
		this.active						 =	true;
		
		function close(object) {
			return function() {
				object.deactivate(object.caller);
			}
		}
		
	//	this.timer						 =	setTimeout(this.deactivate, this.delay);
		this.timer						 =	setTimeout(close(this), this.delay);
		
	},
	deactivate							 :	function(caller, value) {
		
		if (caller !== this.caller)			return;
		
	//	this.caller						 =	null;
		
		if (this.action &&  isFunction(this.action))			this.action(value);
		if (this.action && !isFunction(this.action))			eval(this.action);
		
		this.action						 =	null;
		
		this.close();
		
	},
	
	close								 :	function() {
		
		this.active						 =	false;
		
		var animator					 =	this.animators.fadeout;
		
		var opacity						 =	this.get("opacity");
		
		var opacities					 =	[];
		
		for (var i = 0; i <= 5; i++) {
			
			opacities[i]				 =	opacity - (i * opacity / 5);
			
		}
		
		animator.addAnimation(1,
			{ opacity: opacities },
			{ interval: 40, repeat: false, relative: false }
		);
		
		function close(object) {
			return function() {
				object.hide();
			}
		}
		
		animator.animations[1].settings.action				 =	[ close(this) ];
		
		animator.Play(1);
		
		return true;
		
	}
	
	//*														
	//*												}		
	//*														
	
});

//+																														
//+		Handlers																								}	{	
//+																														
	
	SOAPI.Tooltip_Handlers				 =	{
		
		onMouseOver						 :	function(event) {
			
			event.stopPropagation();
			
			this.blendTo(100);
			
			clearTimeout(this.timer);
			
			return true;
			
		},
		onMouseOut						 :	function(event) {
			
			event.stopPropagation();
			
			this.blendTo(90);
			
			function close(object) {
				return function() {
					object.deactivate(object.caller);
				}
			}
			
		//	this.timer					 =	setTimeout(this.deactivate, this.delay);
			this.timer					 =	setTimeout(close(this), this.delay);
			
			return true;
			
		},
		onMouseUp						 :	function(event) {
			
			event.stopPropagation();
			
			this.deactivate(this);
			
			return true;
			
		},
		
		onFocus							 :	function(event) {
			
			event.preventDefault();
			
			this.caller.focus();
			
			return false;
			
		}
		
	};
	
//+																														
//+																												}		
//+																														
