//#																														
//#	SOAPI 4.8													Copyright © 2000 - 2009 Dan Williams.					
//#																														

//+																														
//+	SOAPI.Widget																									{	
//+(																													
	
	SOAPI.Widget						 =	SOAPI.Class.extension();
	
	SOAPI.Widget.extend
	
//+)																													

/*(	//~	Documentation					
	///																					
	///		This is a class, providing inheritance, super-class member access, and		
	///		flexible extensibility.														
	///																					
)*/

({	//~	Code							
	
	//*														
	//*	Variables										{	
	//*														
	
	wtype								 :	"",
	ctypes								 :	{},
///	build								 :	true,			///		This is only used by the builder					
	built								 :	true,
///	buildsubs							 :	true,			///		This is only used by the builder					
	builtsubs							 :	false,
	
	handlers							 :	null,			///		object		
	components							 :	null,			///		object		
	
	elementType							 :	"div",			///		What element type to use for the widget				
	
	parameters							 :	{				///		Default parameters									
		element							 :	null,
		parent							 :	document.body,
		//	Attributes that can be passed through from HTML
		id								 :	null,
		"class"							 :	null,
		style							 :	null,
		pieces							 :	0,				///		No extra pieces by default							
		disabled						 :	"false"
	///	build							 :	"true"			///		This parameter is only used by the builder			
	///	buildsubs						 :	"true"			///		This parameter is only used by the builder			
	},
	
	//*														
	//*												}		
	//*														
	
	//*														
	//*	Methods											{	
	//*														
	
	//-														
	//-	construct										{	
	//-														
	
	construct							 :	function
	
	/*(	//~	Documentation				
		///																					
		///		Perform additional setup.													
		///																					
		///	(	Syntax:																		
		///			object setup( object parameters )										
		///																					
		///				object parameters {													
		///					[object element], [mixed parent], [string id],					
		///					[string class], [string style], [integer pieces],				
		///					[boolean disabled]												
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
		///				object			The current widget element.							
		///				mixed			The parent element to add to.						
		///				string			The widget id.										
		///				string			The class to use.									
		///				string			The style properties.								
		///				integer			Which pieces to create.								
		///				boolean			Whether the widget is disabled.						
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
		
		this.components					 =	{};
		
		var result						 =	this.setup(parameters);
		var p							 =	result.p;
		var w							 =	result.w;
		
		if (p.element == null)				p.parent.appendChild(w);
		
		this.configure.apply(w);
		
		return w;
		
	},
	
	//-														
	//-												}		
	//-														
	
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
		///					[object element], [mixed parent], [string id],					
		///					[string class], [string style], [integer pieces],				
		///					[boolean disabled], [boolean buildsubs]							
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
		///				object			The current widget element.							
		///				mixed			The parent element to add to.						
		///				string			The widget id.										
		///				string			The class to use.									
		///				string			The style properties.								
		///				integer			Which pieces to create.								
		///				boolean			Whether the widget is disabled.						
		///				boolean			Whether to auto-build child widgets.				
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
		
		var p							 =	this.setupParameters(parameters);
		var w							 =	this.createWidget(p, null, this.elementType);
		var c							 =	w.components;
		
	///	w.buildsubs						 =	p.buildsubs != "false";		///		This is only used by the builder		
	///	w.build							 =	p.build     != "false";		///		This is only used by the builder		
		
		//.	Extra pieces								{	
		
		var pieces						 =	{
			16:								"top",
			32:								"bottom",
			64:								"left",
			128:							"right",
			256:							"topleft",
			512:							"topright",
			1024:							"bottomleft",
			2048:							"bottomright"
		};
		
		for (var i in pieces) {
			
			if (p.pieces & i) {
				
				c[pieces[i]]			 =	this.createComponent({
					element				 :	p.element,
					parent				 :	w,
					cType				 :	pieces[i]
				});
				
			}
			
		}
		
		if (p.pieces & 8) {
			
			c.filler					 =	this.createComponent({
				element					 :	p.element,
				parent					 :	w,
				cType					 :	"filler",
				eType					 :	"img"
			});
			
		}
		
		if (p.pieces & 2) {
			
			c.inner						 =	this.createComponent({
				element					 :	p.element,
				parent					 :	w,
				cType					 :	"inner"
			});
			
			if (p.pieces & 4) {
				
				var inner				 =	w.components.inner;
				
				inner.components		 =	c				 =	{};
				
				c.filler				 =	this.createComponent({
					element				 :	inner,
					parent				 :	inner,
					widget				 :	w,
					cType				 :	"filler",
					eType				 :	"img"
				});
				
			}
			
		}
		
		//.											}		
		
		return { p: p, w: w };
		
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
		
		//i(																				
		//i		The default configure function does nothing, and should be overridden.		
		//i)																				
		
	},
	
	//-														
	//-												}		
	//-														
	
	//-														
	//-	setupParameters									{	
	//-														
	
	setupParameters						 :	function
	
	/*(	//~	Documentation				
		///																					
		///		Setup parameters.															
		///																					
		///	(	Syntax:																		
		///			object setupParameters( object parameters )								
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Sets up parameters.														
		///	)																				
		///	(	Parameters:																	
		///			object				Supplied parameters.								
		///	)																				
		///	(	Result:																		
		///			object				The appropriate parameter values.					
		///	)																				
		///																					
	)*/

	(	//~	Parameters					
		
		parameters
		
	)
	
	{	//~	Code						
		
		//	Defaults
		var p							 =	SOAPI.merge(this.parameters, parameters);
		
		//i(																				
		//i		The p object stores the main widget properties. The default properties		
		//i		can be overridden by those passed to the function, which in turn can be		
		//i		overridden by those specified by the widget element's HTML attributes.		
		//i)																				
		
		if (p.element != null) {
			
			for (var pName in p) {
				
				if (pName != "element" && pName != "parent" && p.element.hasAttribute(pName)) {
					
					p[pName]			 =	p.element.getAttribute(pName);
					
				}
				
			}
			
		}
		
		p.disabled						 =	(p.disabled != "false" && p.disabled != null) ? true : null;
		p.usable						 =	!p.disabled;
		
		return p;
		
	},
	
	//-														
	//-	createWidget								}	{	
	//-														
	
	createWidget						 :	function
	
	/*(	//~	Documentation				
		///																					
		///		Create widget.																
		///																					
		///	(	Syntax:																		
		///			object createWidget(													
		///				object parameters[, object extras[, string type]]					
		///			)																		
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Creates the widget.														
		///	)																				
		///	(	Parameters:																	
		///			object				Supplied parameters.								
		///			object				Extra attributes.									
		///			string				The widget element type.							
		///	)																				
		///	(	Result:																		
		///			object				The widget.											
		///	)																				
		///																					
	)*/

	(	//~	Parameters					
		
		parameters,
		extras,
		type
		
	)
	
	{	//~	Code						
		
		var a							 =	{
			widget						 :	this.wtype
		};
		
		for (var pName in extras)			a[pName]		 =	extras[pName];
		for (var pName in parameters) {
			
			if (pName != "element" && pName != "parent") {
				
				a[pName]				 =	parameters[pName];
				
			}
			
		}
		
		var w							 =	new SOAPI.Sprite(SOAPI.createElement({
			type						 :	type,
			element						 :	parameters.element,
			attributes					 :	a,
			insert						 :	false
		}), this.draggable);
		
		for (var member in this)			w[member]		 =	this[member];
		
		return w;
		
	},
	
	//-														
	//-	createComponent								}	{	
	//-														
	
	createComponent						 :	function
	
	/*(	//~	Documentation				
		///																					
		///		Create component.															
		///																					
		///	(	Syntax:																		
		///			object createComponent(													
		///				object parameters[, boolean makeSprite[, boolean draggable]]		
		///			)																		
		///																					
		///				object parameters {													
		///					object element, object parent, [object widget], string cType,	
		///					[string eType], [object extras], [object criteria]				
		///					[object parameters], [boolean recurse]							
		///				}																	
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Creates a component.													
		///	)																				
		///	(	Parameters:																	
		///			object				An object containing the parameters to use.			
		///				object			The existing element to search in, if present.		
		///				object			The element to add the component to.				
		///				object			The widget to which the element belongs.			
		///				string			The component type.									
		///				string			The type of element to create.						
		///				object			Extra attributes.									
		///				object			Search criteria - attributes to find or match.		
		///				object			Additional parameters to pass.						
		///				boolean			Whether to recurse or just look at one level.		
		///			boolean				Whether to make the component into a Sprite.		
		///			boolean				Whether to add dragability to the sprite.			
		///	)																				
		///	(	Result:																		
		///			object				The component.										
		///	)																				
		///																					
	)*/

	(	//~	Parameters					
		
		parameters,
		makeSprite,
		draggable
		
	)
	
	{	//~	Code						
		
		//:	Parameters									{	
		
		//	Defaults
		var p							 =	{
			element						 :	null,
			parent						 :	null,
			widget						 :	null,
			cType						 :	null,
			eType						 :	"div",
			extras						 :	null,
			criteria					 :	null,
			parameters					 :	null,
			recurse						 :	false
		};
		
		for (var pName in parameters) {
			
			if (parameters[pName] != null)	p[pName]		 =	parameters[pName];
			
		}
		
		//:											}		
		
		p.eType							 =	p.eType.toLowerCase();
		p.widget						 =	p.widget || p.parent;
		
		//	Attributes that can be passed through from HTML
		var a							 =	{};
		var c							 =	{
			component					 :	p.cType
		};
		
		for (var pName in p.extras)			a[pName]		 =	p.extras[pName];
		for (var pName in p.criteria)		c[pName]		 =	p.criteria[pName];
		
		var child						 =	null;
		if (p.element != null)				child			 =	SOAPI.findLastChildElement(p.element, "*", c, p.recurse);
		if (child   != null)				a				 =	SOAPI.getMatchingAttributes(child, a);
		
		//i(																				
		//i		The component attribute is specifically set.								
		//i)																				
		
		a.component						 =	p.cType;
		
		var component					 =	SOAPI.createElement({
			type						 :	p.eType,
			element						 :	child,
			parent						 :	p.parent,
			attributes					 :	a
		});
		
		var parameters					 =	p.parameters || {};
		parameters.element				 =	component;
		parameters.parent				 =	p.parent;
		
		if (this.ctypes[p.cType] != null)	component		 =	new this.ctypes[p.cType](parameters);
		
		component.parentWidget			 =	p.widget;
		
		if (makeSprite)						component		 =	new SOAPI.Sprite(component, draggable);
		
		SOAPI.applyBackgroundCSS(component);
		
		return component;
		
	},
	
	//-														
	//-	createComponents							}	{	
	//-														
	
	createComponents					 :	function
	
	/*(	//~	Documentation				
		///																					
		///		Create components.															
		///																					
		///	(	Syntax:																		
		///			object createComponents(												
		///				object parameters[, boolean makeSprite[, boolean draggable]]		
		///			)																		
		///																					
		///				object parameters {													
		///					object element, object parent, [object widget], mixed cType,	
		///					[string eType], [object extras], [object criteria]				
		///					[object parameters], [boolean recurse]							
		///				}																	
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Creates components.														
		///	)																				
		///	(	Parameters:																	
		///			object				An object containing the parameters to use.			
		///				object			The existing element to search in, if present.		
		///				object			The element to add the components to.				
		///				object			The widget to which the element belongs.			
		///				mixed			The component type.									
		///				string			The type of element to create.						
		///				object			Extra attributes.									
		///				object			Search criteria - attributes to find or match.		
		///				object			Additional parameters to pass.						
		///				boolean			Whether to recurse or just look at one level.		
		///			boolean				Whether to make the component into a Sprite.		
		///			boolean				Whether to add dragability to the sprite.			
		///	)																				
		///	(	Result:																		
		///			array				The components.										
		///	)																				
		///																					
	)*/

	(	//~	Parameters					
		
		parameters,
		makeSprite,
		draggable
		
	)
	
	{	//~	Code						
		
		//:	Parameters									{	
		
		//	Defaults
		var p							 =	{
			element						 :	null,
			parent						 :	null,
			widget						 :	null,
			cType						 :	null,
			eType						 :	"div",
			extras						 :	null,
			criteria					 :	null,
			parameters					 :	null,
			recurse						 :	false
		};
		
		for (var pName in parameters) {
			
			if (parameters[pName] != null)	p[pName]		 =	parameters[pName];
			
		}
		
		//:											}		
		
		p.eType							 =	p.eType.toLowerCase();
		p.widget						 =	p.widget || p.parent;
		
		var ctypes						 =	this.ctypes;
		var children					 =	null;
		var c							 =	{
			component					 :	p.cType
		};
		for (var pName in p.criteria)		c[pName]		 =	p.criteria[pName];
		
		if (p.element != null)				children		 =	SOAPI.findAllChildElements(p.element, "*", c, p.recurse);
		
		if (!children)						return [];
		
		var items						 =	[];
		var i							 =	children.length;
		var j							 =	0;
		
		while (i--) {
			
			//	Attributes that can be passed through from HTML
			var a						 =	{
				id						 :	null,
				"class"					 :	null,
				style					 :	null
			};
			
			for (var pName in p.extras)		a[pName]		 =	p.extras[pName];
			
			var child					 =	children[i];
			a							 =	SOAPI.getMatchingAttributes(child, a);
			
			//i(																				
			//i		The component attribute is specifically set.								
			//i)																				
			
			items[j]					 =	SOAPI.createElement({
				type					 :	p.eType,
				element					 :	child,
				parent					 :	p.parent,
				attributes				 :	a
			});
			
			var cType					 =	items[j].getAttribute("component");
			var parameters				 =	p.parameters || {};
			parameters.element			 =	items[j];
			
			if (ctypes[cType] != null)		items[j]		 =	new ctypes[cType](parameters);
			
			items[j].parentWidget		 =	p.widget;
			
			if (makeSprite)					items[j]		 =	new SOAPI.Sprite(items[j], draggable);
			
			SOAPI.applyBackgroundCSS(items[j++]);
			
		}
		
		return items;
		
	},
	
	//-														
	//-												}		
	//-														
	
	//-														
	//-	allow											{	
	//-														
	
	allow								 :	function
	
	/*(	//~	Documentation				
		///																					
		///		Allow use of the widget.													
		///																					
		///	(	Syntax:																		
		///			void allow( [boolean noBubble] )										
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Allows use of the widget.												
		///	)																				
		///	(	Parameters:																	
		///			boolean				Whether to not bubble to children.					
		///	)																				
		///	(	Result:																		
		///			void																	
		///	)																				
		///																					
	)*/

	(	//~	Parameters					
		
		noBubble
		
	)
	
	{	//~	Code						
		
		if (!this.isDisabled)				this.setAttribute("usable", true);
		
		if (!noBubble)						this.allowChildren();
		
	},
	
	//-														
	//-	deny										}	{	
	//-														
	
	deny								 :	function
	
	/*(	//~	Documentation				
		///																					
		///		Deny use of the widget.														
		///																					
		///	(	Syntax:																		
		///			void deny( [boolean noBubble] )											
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Denies use of the widget.												
		///	)																				
		///	(	Parameters:																	
		///			boolean				Whether to not bubble to children.					
		///	)																				
		///	(	Result:																		
		///			void																	
		///	)																				
		///																					
	)*/

	(	//~	Parameters					
		
		noBubble
		
	)
	
	{	//~	Code						
		
		this.setAttribute("usable", false);
		
		if (!noBubble)						this.denyChildren();
		
	},
	
	//-														
	//-	allowChildren								}	{	
	//-														
	
	allowChildren						 :	function
	
	/*(	//~	Documentation				
		///																					
		///		Allow use of child widgets.													
		///																					
		///	(	Syntax:																		
		///			void allowChildren( void )												
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Allows use of child widgets.											
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
		
		var elements					 =	this.getElementsByTagName("*");
		
		for (var i = 0, e; (e = elements[i]) != null; i++) {
			
			if (isWidget(e) && e.allow)		e.allow(true);
			
		}
		
	},
	
	//-														
	//-	denyChildren								}	{	
	//-														
	
	denyChildren						 :	function
	
	/*(	//~	Documentation				
		///																					
		///		Deny use of child widgets.													
		///																					
		///	(	Syntax:																		
		///			void denyChildren( void )												
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Denies use of child widgets.											
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
		
		var elements					 =	this.getElementsByTagName("*");
		
		for (var i = 0, e; (e = elements[i]) != null; i++) {
			
			if (isWidget(e) && e.deny)		e.deny(true);
			
		}
		
	},
	
	//-														
	//-	isUsable									}	{	
	//-														
	
	isUsable							 :	function
	
	/*(	//~	Documentation				
		///																					
		///		Check if a widget is usable.												
		///																					
		///	(	Syntax:																		
		///			boolean isUsable( void )												
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Checks if a widget is usable.											
		///	)																				
		///	(	Parameters:																	
		///			void																	
		///	)																				
		///	(	Result:																		
		///			boolean				Whether the widget is usable.						
		///	)																				
		///																					
	)*/

	(	//~	Parameters					
		
		//	None
		
	)
	
	{	//~	Code						
		
		return this.getAttribute("usable") != "false";
		
	},
	
	//-														
	//-												}		
	//-														
	
	//-														
	//-	enable											{	
	//-														
	
	enable								 :	function
	
	/*(	//~	Documentation				
		///																					
		///		Enable the widget.															
		///																					
		///	(	Syntax:																		
		///			void enable( void )														
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Enables the widget.														
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
		
		this.removeAttribute("disabled");
		
		this.allow();
		
	},
	
	//-														
	//-	disable										}	{	
	//-														
	
	disable								 :	function
	
	/*(	//~	Documentation				
		///																					
		///		Disable the widget.															
		///																					
		///	(	Syntax:																		
		///			void disable( void )													
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Disables the widget.													
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
		
		this.setAttribute("disabled", true);
		
		this.deny();
		
	},
	
	//-														
	//-												}		
	//-														
	
	onFocus								 :	function(event) {
		
		this.setAttribute("focused", true);
		
		return true;
		
	},
	onBlur								 :	function(event) {
		
		this.setAttribute("focused", false);
		
		return true;
		
	}
	
	//*														
	//*												}		
	//*														
	
});

//+																														
//+																												}		
//+																														
