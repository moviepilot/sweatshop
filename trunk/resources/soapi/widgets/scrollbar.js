//#																														
//#	SOAPI 4.8													Copyright � 2000 - 2009 Dan Williams.					
//#																														

//+																														
//+	SOAPI.Scrollbar																									{	
//+(																													
	
	SOAPI.Events.scrollstart			 =	[ "onScrollStart"	];
	SOAPI.Events.scrollend				 =	[ "onScrollEnd"		];
	SOAPI.Events.scroll					 =	[ "onScroll"		];
	SOAPI.Events.onScrollStart			 =	function(event) { return true };
	SOAPI.Events.onScrollEnd			 =	function(event) { return true };
	SOAPI.Events.onScroll				 =	function(event) { return true };
	
//+																														
	
	SOAPI.widgets.scrollbar				 =	function(p) { new SOAPI.Scrollbar(p); };
	
//+																														
	
	SOAPI.Scrollbar						 =	SOAPI.Widget.extension();
	
	SOAPI.Scrollbar.extend
	
//+)																													

/*(	//~	Documentation					
	///																					
	///		This class provides a scrollbar widget.										
	///																					
)*/

({	//~	Code							
	
	//*														
	//*	Variables										{	
	//*														
	
	wtype								 :	"scrollbar",
	ctypes								 :	{ track: SOAPI.Panel, upleft: SOAPI.Button, downright: SOAPI.Button, handle: SOAPI.Button },
	
	orientation							 :	"horizontal",
	initialDelay						 :	500,
	repeatDelay							 :	50,
	timer								 :	null,
	initialDone							 :	false,
	active								 :	false,
	distanceFactor						 :	20,
	partners							 :	null,			///		array			
	min									 :	0,				///		actual value	
	max									 :	100,			///		actual value	
	position							 :	0,				///		percent			
	slice								 :	10,				///		percent			
	ratio								 :	1,
	trackStart							 :	0,				///		actual value	
	trackSize							 :	100,			///		actual value	
	handleSize							 :	10,				///		actual value	
	
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
		///				string			The bar's orientation (vertical or horizontal).		
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
		var handlers					 =	SOAPI.Scrollbar_Handlers;
		
		//.	Scrollbar container							{	
		
		var vertical					 =	(p.orientation == "vertical");
		
		w.orientation					 =	(vertical) ? "vertical" : "horizontal";
		w.setAttribute("orientation", w.orientation);
		
		SOAPI.Event.addEventHandler(w, "mousewheel",    handlers.onMouseWheel,    "Scrollbar");
		SOAPI.Event.addEventHandler(w, "scrollstart",   handlers.onScrollStart,   "Scrollbar");
		SOAPI.Event.addEventHandler(w, "scrollend",     handlers.onScrollEnd,     "Scrollbar");
		SOAPI.Event.addEventHandler(w, "contentchange", handlers.onContentChange, "Scrollbar");
		
		//.	Scrollbar track							}	{	
		
		var track						 =	c.track			 =	this.createComponent({
			element						 :	p.element,
			parent						 :	w,
			cType						 :	"track"
		});
		
		SOAPI.Event.addEventHandler(track, "mousedown", handlers.track.onMouseDown, "Scrollbar");
		SOAPI.Event.addEventHandler(track, "mouseup",   handlers.track.onMouseUp,   "Scrollbar");
		SOAPI.Event.addEventHandler(track, "mouseout",  handlers.track.onMouseOut,  "Scrollbar");
		
		//.	Scrollbar up/left button				}	{	
		
		var upleft						 =	c.upleft		 =	this.createComponent({
			element						 :	p.element,
			parent						 :	w,
			cType						 :	"upleft"
		});
		
		upleft.setAttribute("tabindex", "");
		
		SOAPI.Event.addEventHandler(upleft, "mousedown", handlers.upleft.onMouseDown, "Scrollbar");
		SOAPI.Event.addEventHandler(upleft, "mouseup",   handlers.upleft.onMouseUp,   "Scrollbar", [ "before Action" ]);
		SOAPI.Event.addEventHandler(upleft, "mouseout",  handlers.upleft.onMouseOut,  "Scrollbar");
		
		//.	Scrollbar down/right button				}	{	
		
		var downright					 =	c.downright		 =	this.createComponent({
			element						 :	p.element,
			parent						 :	w,
			cType						 :	"downright"
		});
		
		downright.setAttribute("tabindex", "");
		
		SOAPI.Event.addEventHandler(downright, "mousedown", handlers.downright.onMouseDown, "Scrollbar");
		SOAPI.Event.addEventHandler(downright, "mouseup",   handlers.downright.onMouseUp,   "Scrollbar", [ "before Action" ]);
		SOAPI.Event.addEventHandler(downright, "mouseout",  handlers.downright.onMouseOut,  "Scrollbar");
		
		//.	Scrollbar handle						}	{	
		
		var handle						 =	c.handle		 =	this.createComponent({
			element						 :	p.element,
			parent						 :	w,
			cType						 :	"handle"
		}, true, true);
		
		handle.minSize					 =	10;
		handle.dragger.enabled			 =	true;
		handle.dragger.restrict			 =	true;
		handle.dragger.removePartner(handle);
		handle.dragger.addPartner(handle, (vertical) ? null : { left: 1 }, (vertical) ? { top: 1 } : null, true);
		handle.setAttribute("tabindex", "");
		
		SOAPI.Event.addEventHandler(handle, "mouseover", handlers.handle.onMouseOver, "Scrollbar", [ "after onMouseOver" ]);
		SOAPI.Event.addEventHandler(handle, "mouseout",  handlers.handle.onMouseOut,  "Scrollbar", [ "after onMouseOut"  ]);
		SOAPI.Event.addEventHandler(handle, "dragstart", handlers.handle.onDragStart, "Scrollbar");
		SOAPI.Event.addEventHandler(handle, "dragend",   handlers.handle.onDragEnd,   "Scrollbar");
		SOAPI.Event.addEventHandler(handle, "drag",      handlers.handle.onDrag,      "Scrollbar");
		
		//.											}		
		
		w.partners						 =	[];
		
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
		
		this.recalculateScrollProperties(0, 500, 0, 100);
		
	},
	
	//-														
	//-												}		
	//-														
	
	//-														
	//-	addPartner										{	
	//-														
	
	addPartner							 :	function
	
	/*(	//~	Documentation				
		///																					
		///		Add a scroll partner.														
		///																					
		///	(	Syntax:																		
		///			void addPartner(														
		///				mixed sprite, string property, number min, number max				
		///			)																		
		///																					
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Adds a scroll partner.													
		///	)																				
		///	(	Parameters:																	
		///			mixed				The sprite to use as a scroll partner.				
		///			string				The name of the property to change.					
		///			number				The minimum property value.							
		///			number				The maximum property value.							
		///	)																				
		///	(	Result:																		
		///			void																	
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		sprite,
		property,
		min,
		max
		
	)
	
	{	//~	Code						
		
		if (isString(sprite))				sprite			 =	document.getElementById(sprite);
		
		this.partners.push({
			sprite						 :	sprite,
			property					 :	property,
			min							 :	min,
			max							 :	max
		});
		
	},
	
	//-														
	//-	removePartner								}	{	
	//-														
	
	removePartner						 :	function
	
	/*(	//~	Documentation				
		///																					
		///		Remove a scroll partner.													
		///																					
		///	(	Syntax:																		
		///			void removePartner( mixed sprite[, string property] )					
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Removes a scroll partner.												
		///	)																				
		///	(	Parameters:																	
		///			mixed				The sprite being used as a scroll partner.			
		///			string				The name of the property.							
		///	)																				
		///	(	Result:																		
		///			void																	
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		sprite,
		property
		
	)
	
	{	//~	Code						
		
		if (isString(sprite))				sprite			 =	document.getElementById(sprite);
		
		var i							 =	this.partners.length;
		
		while (i--) {
			
			if (this.partners[i].sprite === sprite && (property == null || this.partners[i].property == property)) {
				
				this.partners.splice(i, 1);
				
			}
			
		}
		
	},
	
	//-														
	//-												}		
	//-														
	
	recalculateScrollProperties			 :	function(min, max, position, slice) {
		
		var vertical					 =	(this.orientation == "vertical");
		var track						 =	this.components.track;
		var handle						 =	this.components.handle;
		var trackStart					 =	(vertical) ? track.get("top")     : track.get("left");
		var trackSize					 =	(vertical) ? track.get("height")  : track.get("width");
		var handleStart					 =	(vertical) ? handle.get("top")    : handle.get("left");
		var area						 =	max - min;
		
		this.max						 =	max;
		this.min						 =	min;
		this.position					 =	position / (area - slice);		///		percent		
		this.slice						 =	slice / area;					///		percent		
		this.ratio						 =	area / trackSize;
		this.trackStart					 =	trackStart;
		this.trackSize					 =	trackSize;
		
		var handleSize					 =	Math.round(trackSize * this.slice);
		
		if (this.position < 0)				this.position	 =	0;
		if (this.position > 1)				this.position	 =	1;
		if (handleSize < handle.minSize)	handleSize		 =	handle.minSize;
		if (handleSize > trackSize)			handleSize		 =	trackSize;
		
		handle.visibilityTo(handleSize != trackSize);
		handle.styleTo((vertical) ? "height" : "width", handleSize);
		
		this.handleSize					 =	handleSize;
		
		var trackArea					 =	trackSize - handleSize;
		var property					 =	(vertical) ? "top" : "left";
		
		handle.dragger.removeRestriction(property);
		handle.dragger.addRestriction(property, { min: trackStart, max: trackStart + trackArea });
		
		handle.styleTo(property, trackStart + this.position * trackArea);
		
		this.updateScrollPartners();
		
	},
	
	doScroll							 :	function(direction, trackPressed, wheelUsed) {
		
		var vertical					 =	(this.orientation == "vertical");
		var handle						 =	this.components.handle;
		var pos							 =	(vertical) ? SOAPI.Event.y : SOAPI.Event.x;
		var start						 =	(vertical) ? handle.get("ActualTop") : handle.get("ActualLeft");
		var end							 =	start + ((vertical) ? handle.get("height") : handle.get("width"));
		var distance					 =	this.distanceFactor / this.ratio * direction * ((trackPressed) ? 10 : 1);
		var property					 =	"distance" + ((vertical) ? "Y" : "X");
		
		handle[property]				 =	(trackPressed && !(direction < 0 && pos < start) && !(direction > 0 && pos > end))
			?	0
			:	distance
		;
		
		if (handle[property])				SOAPI.Events.doDrag(handle, handle.dragger.partners, false);
		if (handle[property])				SOAPI.Events.doDrag(handle, handle.dragger.partners, true);
		if (handle[property])				this.updateScrollPosition();
		
		if (this.active && this.isUsable()) {
			
			function timer(scrollbar, direction, trackPressed) {
				return function() { scrollbar.doScroll(direction, trackPressed); };
			}
			
			this.timer					 =	setTimeout(
				timer(this, direction, trackPressed),
				(this.initialDone) ? this.repeatDelay : this.initialDelay
			);
			this.initialDone			 =	true;
			
		} else {
			
			clearTimeout(this.timer);
			
			this.initialDone			 =	false;
			
		}
		
		return true;
		
	},
	
	updateScrollPosition				 :	function() {
		
		var handle						 =	this.components.handle;
		var handleStart					 =	(this.orientation == "vertical") ? handle.get("top") : handle.get("left");
		
		this.position					 =	(handleStart - this.trackStart) / (this.trackSize - this.handleSize);
		
		if (!isNumber(this.position))		this.position	 =	0;
		
		this.updateScrollPartners();
		
	},
	updateScrollPartners				 :	function() {
		
		for (var i = this.partners.length - 1; i >= 0; i--) {
			
			var p						 =	this.partners[i];
			
			if (p.sprite.isSprite) {
				
				p.sprite.styleTo(p.property, (p.min + (p.max - p.min) * this.position));
				
			} else {
				
				SOAPI.Sprite.prototype.styleTo.apply(p.sprite, [ p.property, (p.min + (p.max - p.min) * this.position) ]);
				
			}
			
		}
		
	},
	
	scrollTo							 :	function(percent) {
		
		if (!isNumber(percent))				return;
		
		percent							/=	100;
		
		if (percent < 0)					percent			 =	0;
		if (percent > 1)					percent			 =	1;
		
		this.position					 =	percent;
		
		this.components.handle.styleTo(
			(this.orientation == "vertical") ? "top" : "left",
			this.trackStart + percent * (this.trackSize - this.handleSize)
		);
		
		this.updateScrollPartners();
		
	},
	scrollBy							 :	function(percent) {
		
		if (!isNumber(percent))				return;
		
		this.scrollTo(percent + this.position * 100);
		
	},
	
	allow								 :	function(noBubble) {
		
		this.callParent(arguments.callee, "allow", arguments);
		
		this.components.handle.visibilityTo(this.handleSize != this.trackSize);
		
	},
	deny								 :	function(noBubble) {
		
		this.callParent(arguments.callee, "deny", arguments);
		
		this.components.handle.hide();
		
	}
	
	//:														
	
	//*														
	//*												}		
	//*														
	
});

//+																														
//+		Handlers																								}	{	
//+																														
	
	SOAPI.Scrollbar_Handlers			 =	{
		
		onMouseWheel					 :	function(event) {
			
			event.stopPropagation();
			event.preventDefault();
			
			SOAPI.Event.triggerEvent("scrollstart", this, { direction: SOAPI.Event.wheelDelta, wheelUsed: true });
			
			return true;
			
		},
		onScrollStart					 :	function(event) {
			
			if (event.direction != null && this.isUsable()) {
				
				this.active				 =	!event.wheelUsed;
				
				this.doScroll(event.direction, event.trackPressed, event.wheelUsed);
				
			} else {
				
				this.active				 =	false;
				
			}
			
			return true;
			
		},
		onScrollEnd						 :	function(event) {
			
			this.active					 =	false;
			this.initialDone			 =	false;
			
			clearTimeout(this.timer);
			
			return true;
			
		},
		onContentChange					 :	function(event) {
			
			return event.stopPropagation() || true;
			
		},
		
		track							 :	{
			
			onMouseDown					 :	function(event) {
				
				if (SOAPI.Event.button != SOAPI.Event.LEFT)		return true;
				
				var vertical			 =	(this.parentWidget.orientation == "vertical");
				var handle				 =	this.parentWidget.components.handle;
				var pos					 =	(vertical) ? SOAPI.Event.y : SOAPI.Event.x;
				var start				 =	(vertical) ? handle.get("ActualTop") : handle.get("ActualLeft");
				var end					 =	start + ((vertical) ? handle.get("height") : handle.get("width"));
				var direction			 =	0;
				
				if (pos < start)			direction		 =	-1;
				if (pos > end)				direction		 =	 1;
				
				SOAPI.Event.triggerEvent("scrollstart", this.parentWidget, { direction: direction, trackPressed: true });
				
				return true;
				
			},
			onMouseUp					 :	function(event) {
				
				SOAPI.Event.triggerEvent("scrollend", this.parentWidget);
				
				return true;
				
			},
			onMouseOut					 :	function(event) {
				
				SOAPI.Event.triggerEvent("scrollend", this.parentWidget);
				
				return true;
				
			}
			
		},
		
		handle							 :	{
			
			onMouseOver					 :	function(event) {
				
				if (SOAPI.Event.dragActive)		this.out	 =	event.stopProcessing() && false;
				
				return true;
				
			},
			onMouseOut					 :	function(event) {
				
				if (SOAPI.Event.dragActive)		this.out	 =	event.stopProcessing() || true;
				
				return true;
				
			},
			onDragStart					 :	function(event) {
				
				SOAPI.Event.triggerEvent("scrollstart", this.parentWidget);
				
				return true;
				
			},
			onDrag						 :	function(event) {
				
				this.parentWidget.updateScrollPosition();
				
				return true;
				
			},
			onDragEnd					 :	function(event) {
				
				if (this.out)				this.out		 =	SOAPI.Event.triggerEvent("mouseout", this) && false;
				
				SOAPI.Event.triggerEvent("scrollend", this.parentWidget);
				
				return true;
				
			}
			
		},
		
		upleft							 :	{
			
			onMouseDown				 :	function(event) {
				
				if (SOAPI.Event.button != SOAPI.Event.LEFT)		return true;
				
				SOAPI.Event.triggerEvent("scrollstart", this.parentWidget, { direction: -1 });
				
				return true;
				
			},
			onMouseUp					 :	function(event) {
				
				SOAPI.Event.triggerEvent("scrollend", this.parentWidget);
				
				return true;
				
			},
			onMouseOut					 :	function(event) {
				
				SOAPI.Event.triggerEvent("scrollend", this.parentWidget);
				
				return true;
				
			}
			
		},
		
		downright						 :	{
			
			onMouseDown					 :	function(event) {
				
				if (SOAPI.Event.button != SOAPI.Event.LEFT)		return true;
				
				SOAPI.Event.triggerEvent("scrollstart", this.parentWidget, { direction: 1 });
				
				return true;
				
			},
			onMouseUp					 :	function(event) {
				
				SOAPI.Event.triggerEvent("scrollend", this.parentWidget);
				
				return true;
				
			},
			onMouseOut					 :	function(event) {
				
				SOAPI.Event.triggerEvent("scrollend", this.parentWidget);
				
				return true;
				
			}
			
		}
		
	};
	
//+																														
//+																												}		
//+																														
