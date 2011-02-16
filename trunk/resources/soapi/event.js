//#																														
//#	SOAPI 4.8													Copyright © 2000 - 2009 Dan Williams.					
//#																														

//+																														
//+	SOAPI.Event																										{	
//+(																													
	
	SOAPI.Event							 =
	
//+)																													

/*(	//~	Documentation					
	///																					
	///		This is the event handler.													
	///																					
)*/

{	//~	Code							
	
	//*														
	//*	Variables										{	
	//*														
	
	button								 :	0,
		LEFT							 :	1,
		RIGHT							 :	2,
		MIDDLE							 :	4,
	wheelDelta							 :	0,
	x									 :	0,
	y									 :	0,
	offsetX								 :	0,
	offsetY								 :	0,
	distanceX							 :	0,
	distanceY							 :	0,
	currentLeft							 :	0,
	currentTop							 :	0,
	
	dragActive							 :	false,
	dragImminent						 :	false,
	changeOnDrag						 :	[],
	
	//*														
	//*												}		
	//*														
	
	//*														
	//*	Methods											{	
	//*														
	
	//-														
	//-	setupEventHandlers								{	
	//-														
	
	setupEventHandlers					 :	function
	
	/*(	//~	Documentation				
		///																					
		///		Setup event handlers.														
		///																					
		///	(	Syntax:																		
		///			void setupEventHandlers( void )											
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Sets up event handlers.													
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
		
		SOAPI.Event.addEventHandler(document, "mousemove");
		SOAPI.Event.addEventHandler(document, "mousedown");
		SOAPI.Event.addEventHandler(document, "mouseup");
	//	SOAPI.Event.addEventHandler((ie) ? document : window, "mousewheel");
		
		var sets						 =	[
			document.getElementsByTagName("input"),
			document.getElementsByTagName("textarea")
		];
		var s							 =	sets.length;
		
		while (s--) {
			
			var elements				 =	sets[s];
			var i						 =	elements.length;
			
			while (i--) {
				
				SOAPI.Event.addEventHandler(elements[i], "focus");
				SOAPI.Event.addEventHandler(elements[i], "blur");
				
			}
			
		}
		
	},
	
	//-														
	//-												}		
	//-														
	
	//-														
	//-	addEventHandler									{	
	//-														
	
	addEventHandler						 :	function
	
	/*(	//~	Documentation				
		///																					
		///		Add an event handler.														
		///																					
		///	(	Syntax:																		
		///			boolean addEventHandler(												
		///				mixed element, string type[, mixed handler, string name[,			
		///				array order]]														
		/// 		)																		
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Adds an event handler.													
		///	)																				
		///	(	Parameters:																	
		///			mixed				The element.										
		///			string				The event type.										
		///			mixed				The event handler. This can either be a function,	
		///								wich will be called with the event's element as		
		///								this; or it can be an array, the first item of		
		///								which should be the object to use as this, and		
		///								the second item being the function to call.			
		///			string				The handler name.									
		///			array				The position in the queue to place the handler in.	
		///	)																				
		///	(	Result:																		
		///			boolean				Success or failure.									
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		element,
		type,
		handler,
		name,
		order
		
	)
	
	{	//~	Code						
		
		if (isString(element))				element			 =	document.getElementById(element);
		if (!isArray(order))				order			 =	(order) ? [ order ] : [ "last" ];
		
		type							 =	type.toLowerCase().replace(/^on/, "");
		
		if (!SOAPI.Events[type])			return false;
		
		if (!element.eventHandlers) {
			
			element.eventHandlers		 =	{};
			element.eventQueues			 =	{};
			
		}
		
		if (!element.eventHandlers[type]) {
			
			var defaultName				 =	SOAPI.Events[type][0];
			
			element.eventHandlers[type]						 =	{};
			element.eventHandlers[type][defaultName]		 =	{ handler: SOAPI.Events[defaultName], pos: 0 };
			element.eventQueues[type]						 =	[ defaultName ];
			
			if (SOAPI.Events[type][1]) {
				
				if (element.addEventListener) {
					
					element.addEventListener(SOAPI.Events[type][1], SOAPI.Events["on" + type], false);
					
				} else {
					
					//~~	Using attachEvent does not allow bubble detection using 'this'
//					element.attachEvent("on" + SOAPI.Events[type][1], SOAPI.Events["on" + type]);
					element["on" + SOAPI.Events[type][1]]	 =	SOAPI.Events["on" + type];
					
				}
				
			}
			
		}
		
		if (!handler || !name)				return true;
		
		var handlers					 =	element.eventHandlers[type];
		var queue						 =	element.eventQueues[type];
		
		if (handlers[name])					queue.splice(handlers[name].pos, 1);
		
		var pos							 =	false;
		
		for (var i = 0; i < order.length; i++) {
			
			if (order[i] == "last") {
				
				pos						 =	queue.push(name);
				
				break;
				
			}
			
			if (order[i] == "first") {
				
				pos						 =	queue.unshift(name);
				
				break;
				
			}
			
			var info					 =	order[i].split(" ", 2);
			
			if (handlers[info[1]]) {
				
				pos						 =	handlers[info[1]].pos;
				
				if (info[0] != "before")	pos++;
				
				queue.splice(pos, 0, name);
				
				break;
				
			}
			
		}
		
		if (isArray(handler)) {
			
			handlers[name]					 =	{ element: handler[0], handler: handler[1] };
			
		} else {
			
			handlers[name]					 =	{ handler: handler };
			
		}
		
		for (var i = 0; i < queue.length; i++) {
			
			handlers[queue[i]].pos		 =	i;
			
		}
		
		return true;
		
	},
	
	//-														
	//-	removeEventHandler							}	{	
	//-														
	
	removeEventHandler					 :	function
	
	/*(	//~	Documentation				
		///																					
		///		Remove an event handler.													
		///																					
		///	(	Syntax:																		
		///			boolean removeEventHandler(												
		///				mixed element, string type, string name								
		/// 		)																		
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Removes an event handler.												
		///	)																				
		///	(	Parameters:																	
		///			mixed				The element.										
		///			string				The event type.										
		///			string				The handler name.									
		///	)																				
		///	(	Result:																		
		///			boolean				Success or failure.									
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		element,
		type,
		name
		
	)
	
	{	//~	Code						
		
		if (isString(element))				element			 =	document.getElementById(element);
		
		type							 =	type.toLowerCase().replace(/^on/, "");
		
		if (
				!SOAPI.Events["on" + type]
			||	!element.eventHandlers || !element.eventHandlers[type] || !element.eventHandlers[type][name]
		) {
			
			return false;
			
		}
		
		var handlers					 =	element.eventHandlers[type];
		var queue						 =	element.eventQueues[type];
		
		queue.splice(handlers[name].pos, 1);
		
		handlers[name]					 =	null;
		
		for (var i = 0; i < queue.length; i++)		handlers[queue[i]].pos	 =	i;
		
		if (!queue.length) {
			
			element.eventHandlers[type]	 =	null;
			element.eventQueues[type]	 =	null;
			
			if (SOAPI.Events[type][1]) {
				
				if (element.removeEventListener) {
					
					element.removeEventListener(SOAPI.Events[type][1], SOAPI.Events["on" + type], false);
					
				} else {
					
					element.detachEvent("on" + SOAPI.Events[type][1], SOAPI.Events["on" + type]);
					
				}
				
			}
			
		}
		
		return true;
		
	},
	
	//-														
	//-												}		
	//-														
	
	//-														
	//-	copyEventHandlers								{	
	//-														
	
	copyEventHandlers					 :	function
	
	/*(	//~	Documentation				
		///																					
		///		Copy event handlers.														
		///																					
		///	(	Syntax:																		
		///			void copyEventHandlers( mixed from, mixed to[, boolean deep] )			
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Sets up event handlers.													
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
		
		from,
		to,
		deep
		
	)
	
	{	//~	Code						
		
		//	Quick and dirty. Will break with unexpected event orders.
		
		if (isString(from))					from			 =	document.getElementById(from);
		if (isString(to))					to				 =	document.getElementById(to);
		
		if (deep) {
			
			for (var i = 0; i < from.childNodes.length; i++) {
				
				SOAPI.Event.copyEventHandlers(from.childNodes[i], to.childNodes[i], true);
				
			}
			
		}
		
		if (isWidget(from))					SOAPI.widgets[from.getAttribute("widget")]({ element: to });
		
		if (!from.eventQueues)				return;
		
		for (var type in from.eventQueues) {
			
			for (var i = 0; i < from.eventQueues[type].length; i++) {
				
				var name				 =	from.eventQueues[type][i];
				
				if (name.match(/^on/))		continue;
				
				SOAPI.Event.addEventHandler(to, type, from.eventHandlers[type][name].handler, name);
				
			}
			
		}
		
	},
	
	//-														
	//-												}		
	//-														
	
	//-														
	//-	processEvent									{	
	//-														
	
	processEvent						 :	function
	
	/*(	//~	Documentation				
		///																					
		///		Process an event.															
		///																					
		///	(	Syntax:																		
		///			boolean processEvent( string type, object event, object element )		
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Processes an event.														
		///	)																				
		///	(	Parameters:																	
		///			string				The event type.										
		///			object				The event object.									
		///			object				The event element.									
		///	)																				
		///	(	Result:																		
		///			boolean				The result.											
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		type,
		event,
		element
		
	)
	
	{	//~	Code						
		
		var e							 =	event || window.event;
		var E							 =	(e.event) ? e : { event: e };
		
		element							 =	(ie)
			? (e.srcElement && e.srcElement.eventHandlers && e.srcElement.eventHandlers[type] ? e.srcElement : element)
			: element || e.target
		;
		
		var p							 =	{
			type						 :	type,
			element						 :	element,
			stop						 :	false,
			stopPropagation				 :	this._stopPropagation,
			preventDefault				 :	this._preventDefault,
			stopProcessing				 :	this._stopProcessing,
			getMouseButton				 :	this._getMouseButton
		};
		
		for (var i in p)					E[i]			 =	p[i];
		
		if (ie && e.fromElement)			e.relatedTarget	 =	(e.type == "mouseover") ? e.fromElement : e.toElement;
		
		if (!element.eventHandlers || !element.eventHandlers[type])									return true;
		
		var handlers					 =	element.eventHandlers[type];
		var queue						 =	element.eventQueues[type];
		
		for (var i = 0; i < queue.length; i++) {
			
			var handler					 =	handlers[queue[i]];
			
			if (!handler.handler.apply((handler.element) ? handler.element : element, [ E ]))		return false;
			if (E.stop)																				return true;
			
		}
		
		return true;
		
	},
	
	//-														
	//-	triggerEvent								}	{	
	//-														
	
	triggerEvent						 :	function
	
	/*(	//~	Documentation				
		///																					
		///		Trigger an event.															
		///																					
		///	(	Syntax:																		
		///			boolean triggerEvent(													
		///				string type, object element[, object properties[,					
		///				boolean propogate[, boolean percolate[, boolean pass]]]]			
		///			)																		
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Triggers an event.														
		///	)																				
		///	(	Parameters:																	
		///			string				The event type.										
		///			object				The event element.									
		///			object				Additional event properties.						
		///			boolean				Whether to propogate (bubble) the event.			
		///			boolean				Whether to percolate the event.						
		///			boolean				Whether to pass the event.							
		///	)																				
		///	(	Result:																		
		///			boolean				Success or failure.									
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		type,
		element,
		properties,
		propogate,
		percolate,
		pass
		
	)
	
	{	//~	Code						
		
		if (isString(element))				element			 =	document.getElementById(element);
		
		type							 =	type.toLowerCase().replace(/^on/, "");
		
		if (!SOAPI.Events[type])			return false;
		
		var E							 =	properties || {};
		
		E.event							 =	E.event || {};
		E.event.target					 =	element;
		
		SOAPI.Event.processEvent(type, E, element);
		
		if (propogate && !E.cancelPropogation)					this.propogateEvent(E, element, pass);
		if (percolate && !E.cancelPercolation)					this.percolateEvent(E, element);
		
		return true;
		
	},
	
	//-														
	//-												}		
	//-														
	
	//-														
	//-	propogateEvent									{	
	//-														
	
	propogateEvent						 :	function
	
	/*(	//~	Documentation				
		///																					
		///		Propogate an event.															
		///																					
		///	(	Syntax:																		
		///			void propogateEvent( object event, object element[, boolean pass] )		
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Propogates (bubbles) an event to an appropriate ancestor.				
		///	)																				
		///	(	Parameters:																	
		///			object				The event object.									
		///			object				The current target.									
		///			boolean				Whether to pass the event.							
		///	)																				
		///	(	Result:																		
		///			void																	
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		event,
		element,
		pass
		
	)
	
	{	//~	Code						
		
		while (element !== document) {
			
			element						 =	element.parentNode;
			
			if (!element)					return;
			
			if (element.eventHandlers && element.eventHandlers[event.type]) {
				
				if (pass && element[event.type])				element[event.type]();
				else											this.processEvent(event.type, event, element);
				
				break;
				
			}
			
		}
		
	},
	
	//-														
	//-	percolateEvent								}	{	
	//-														
	
	percolateEvent						 :	function
	
	/*(	//~	Documentation				
		///																					
		///		Percolate an event.															
		///																					
		///	(	Syntax:																		
		///			void percolateEvent( object event, object element )						
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Percolates an event to appropriate descendants.							
		///	)																				
		///	(	Parameters:																	
		///			object				The event object.									
		///			object				The current target.									
		///	)																				
		///	(	Result:																		
		///			void																	
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		event,
		element
		
	)
	
	{	//~	Code						
		
		var elements					 =	element.getElementsByTagName("*");
		
		for (var i = 0; i < elements.length; i++) {
			
			if (elements[i].eventHandlers && elements[i].eventHandlers[event.type]) {
				
				this.processEvent(event.type, event, elements[i]);
				
			}
			
		}
		
	},
	
	//-														
	//-												}		
	//-														
	
	//-														
	//-	stopPropagation									{	
	//-														
	
	_stopPropagation					 :	function
	
	/*(	//~	Documentation				
		///																					
		///		Stop event propagation (bubbling).											
		///																					
		///	(	Syntax:																		
		///			void stopPropagation( void )											
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Stops event propagation (bubbling).										
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
		
		var e							 =	this.event;
		
		if (e.stopPropagation)				e.stopPropagation();
		else								e.cancelBubble	 =	true;
		
		this.cancelPropogation			 =	true;
		
	},
	
	//-														
	//-	stopPercolation								}	{	
	//-														
	
	stopPercolation						 :	function
	
	/*(	//~	Documentation				
		///																					
		///		Stop event percolation.														
		///																					
		///	(	Syntax:																		
		///			void stopPercolation( void )											
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Stops event percolation.												
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
		
		this.cancelPercolation			 =	true;
		
	},
	
	//-														
	//-	preventDefault								}	{	
	//-														
	
	_preventDefault						 :	function
	
	/*(	//~	Documentation				
		///																					
		///		Stop default event action.													
		///																					
		///	(	Syntax:																		
		///			void preventDefault( void )												
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Stops default event action.												
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
		
		var e							 =	this.event;
		
		if (e.preventDefault)				e.preventDefault();
		else								e.returnValue	 =	false;
		
	},
	
	//-														
	//-	stopProcessing								}	{	
	//-														
	
	_stopProcessing						 :	function
	
	/*(	//~	Documentation				
		///																					
		///		Stop processing the event queue.											
		///																					
		///	(	Syntax:																		
		///			void stopProcessing( void )												
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Stops processing the event queue.										
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
		
		this.stop						 =	true;
		
	},
	
	//-														
	//-												}		
	//-														
	
	//-														
	//-	getMouseButton									{	
	//-														
	
	_getMouseButton						 :	function
	
	/*(	//~	Documentation				
		///																					
		///		Get the mouse button.														
		///																					
		///	(	Syntax:																		
		///			integer getMouseButton( void )											
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Gets the mouse button.													
		///	)																				
		///	(	Parameters:																	
		///			void																	
		///	)																				
		///	(	Result:																		
		///			integer				The mouse button.									
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		//	None
		
	)
	
	{	//~	Code						
		
		var E							 =	SOAPI.Event;
		var e							 =	this.event;
		
		return (e.which)
			?	((e.which == 2) ? E.MIDDLE : ((e.which == 3) ? E.RIGHT : E.LEFT))
			:	e.button
		;
		
	}
	
	//-														
	//-												}		
	//-														
	
	//*														
	//*												}		
	//*														
	
};

//+																														
//+																												}		
//+																														
