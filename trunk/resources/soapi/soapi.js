//#																														
//#	SOAPI 4.8													Copyright © 2000 - 2009 Dan Williams.					
//#																														

//+																														
//+	SOAPI																											{	
//+(																													
	
	window.SOAPI						 =	window.SOAPI || {};
	var SOAPI							 =	window.SOAPI;
	
//+)																													

/*(	//~	Documentation					
	///																					
	///		This is the main SOAPI object.												
	///																					
)*/

{	//~	Code							
	
	//*														
	//*	Variables										{	
	//*														
	
	SOAPI.version						 =	"4.8";
	
	SOAPI.progress						 =	false;
	SOAPI.built							 =	false;
	SOAPI.action						 =	null;
	
	SOAPI.widgets						 =	SOAPI.widgets || {};
	
	SOAPI.setupActions					 =	[];
	
	SOAPI.speedtest						 = 	0;
	
	//*														
	//*												}		
	//*														
	
	//*														
	//*	Methods											{	
	//*														
	
	//-														
	//-	setup											{	
	//-														
	
	SOAPI.setup							 =	function
	
	/*(	//~	Documentation				
		///																					
		///		Setup SOAPI.																
		///																					
		///	(	Syntax:																		
		///			void setup( [boolean progress[, mixed action[, boolean build]]] )		
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Sets up SOAPI.															
		///	)																				
		///	(	Parameters:																	
		///			boolean				Whether to show a progress bar.						
		///			mixed				A function to run, or text to be evaluated, once	
		///								everything has been set up.							
		///			boolean				Whether to build widgets.							
		///	)																				
		///	(	Result:																		
		///			void																	
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		progress,
		action,
		build
		
	)
	
	{	//~	Code						
		
		while (SOAPI.setupActions.length) {
			
			var setupAction				 =	SOAPI.setupActions.shift();
			
			setupAction();
			
		}
		
		if (progress)						SOAPI.progress	 =	true;
		if (action)							SOAPI.action	 =	action;
		
		if (SOAPI.built) {
			
			if (SOAPI.action &&  isFunction(SOAPI.action))		SOAPI.action();
			if (SOAPI.action && !isFunction(SOAPI.action))		eval(SOAPI.action);
			
			SOAPI.action				 =	null;
			
			return;
			
		}
		
		var theHTMLElement				 =	(ie && SOAPI.HTMLElement) ? SOAPI.HTMLElement : window.HTMLElement.prototype;
		
		for (var member in SOAPI.Sprite.prototype) {
			
			if (["parentClass", "construct", "isSprite", "dragger", "animators", "timer", "callParent"].contains(member))	continue;
			
			theHTMLElement[member]		 =	SOAPI.Sprite.prototype[member];
			
		}
		
		if (ie && SOAPI.HTMLElement) 		SOAPI.extendHTML(document);
	
		//~ Speed test
		
		if (!(SOAPI.speedtest = SOAPI.Cookie.get('speedtest'))) {
			
			function fibTest(n) {
				
				var s = 0;
				
				if (n == 0) return 			s;
				
				if (n == 1) {
					
					s += 1;
					
					return 					s;
				
				} else {
					
					return 					fibTest(n - 1) + fibTest(n - 2);
				
				}
				
			};
			
			var timeOne 				 = 	new Date();
			var testArray 				 = 	new Array();
			
			for (i = 0; i < 27; i++)  		testArray.push(fibTest(i));
			
			var timeTwo 				 = 	new Date();
			var diff 					 =	timeTwo.getTime() - timeOne.getTime();
			
			if (diff < 650)					SOAPI.speedtest = 'good';
			else
											SOAPI.speedtest = 'poor';
											
			SOAPI.Cookie.set('speedtest',SOAPI.speedtest,3600);
			
		}
		
		SOAPI.Event.setupEventHandlers();
		
		if (build)							return SOAPI.buildWidgets();
		
		if (SOAPI.action &&  isFunction(SOAPI.action))			SOAPI.action();
		if (SOAPI.action && !isFunction(SOAPI.action))			eval(SOAPI.action);
		
	};
	
	//-														
	//-												}		
	//-														
	
	//-														
	//-	createElement									{	
	//-														
	
	SOAPI.createElement					 =	function
	
	/*(	//~	Documentation				
		///																					
		///		Create a new element.														
		///																					
		///	(	Syntax:																		
		///			object createElement( object parameters )								
		///																					
		///				object parameters {													
		///					[string type], [mixed element], [mixed parent],					
		///					[object attributes], [object styles], [string content],			
		///					[boolean insert]												
		///				}																	
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Creates a new element, or optionally alters an existing one.			
		///	)																				
		///	(	Parameters:																	
		///			object				An object containing the parameters to use.			
		///				string			The type of element to create.						
		///				mixed			An existing element to alter.						
		///				mixed			The parent element to add to.						
		///				object			An object containing the properties to use.			
		///				object			An object containing the styles to use.				
		///				string			The element content.								
		///				boolean			Whether to insert the element into the document.	
		///	)																				
		///	(	Result:																		
		///			object				The created (or altered) element.					
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		parameters
		
	)
	
	{	//~	Code						
		
		//:	Parameters									{	
		
		//	Defaults
		var p							 =	{
			type						 :	"div",
			element						 :	null,
			parent						 :	document.body,
			attributes					 :	null,
			styles						 :	null,
			content						 :	null,
			insert						 :	true
		};
		
		for (var pName in parameters) {
			
			if (parameters[pName] != null)	p[pName]		 =	parameters[pName];
			
		}
		
		//:											}		
		
		var px							 =	{ left: true, top: true, width: true, height: true };
		
		if (isString(p.parent))				p.parent		 =	document.getElementById(p.parent);
		if (isString(p.element))			p.element		 =	document.getElementById(p.element);
		
		var e							 =	(p.element) ? p.element : document.createElement(p.type);
		
		for (pName in p.attributes) {
			
			if (p.attributes[pName] != null)					e.setAttribute(pName, p.attributes[pName]);
			
		}
		for (pName in p.styles)				{
			
			if (p.styles[pName] != null) {
				
				e.style[pName]			 =	(px[pName] == null) ? p.styles[pName] : parseFloat(p.styles[pName]) + "px";
				
			}
			
		}
		
		if (p.content != null)				e.innerHTML		 =	p.content;
		
		if (!p.element && p.insert)			p.parent.appendChild(e);
		
		return e;
		
	};
	
	//-														
	//-	destroyElement								}	{	
	//-														
	
	SOAPI.destroyElement				 =	function
	
	/*(	//~	Documentation				
		///																					
		///		Destroy an element.															
		///																					
		///	(	Syntax:																		
		///			void destroyElement( mixed element )									
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Destroys an element.													
		///	)																				
		///	(	Parameters:																	
		///			mixed				The element to destroy.								
		///	)																				
		///	(	Result:																		
		///			void																	
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		element
		
	)
	
	{	//~	Code						
		
		if (isString(element))				element			 =	document.getElementById(element);
		
		element.innerHTML				 =	"";
		element.outerHTML				 =	"";
		
	};
	
	//-														
	//-												}		
	//-														
	
	//-														
	//-	findAllChildElements							{	
	//-														
	
	SOAPI.findAllChildElements			 =	function
	
	/*(	//~	Documentation				
		///																					
		///		Find all child elements.													
		///																					
		///	(	Syntax:																		
		///			array findAllChildElements(												
		///				object parent[, string type[, object attributes[,					
		///				boolean recurse[, integer limit[, boolean forwards]]]]]				
		///			)																		
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Finds all the elements matching the search criteria.					
		///	)																				
		///	(	Parameters:																	
		///			object				The element containing the children.				
		///			string				The type of element to look for.					
		///			object				The attributes to look for.							
		///			boolean				Whether to recurse or just look at one level.		
		///			integer				The maximum number of results to return.			
		///			boolean				Whether to go forwards through the elements.		
		///	)																				
		///	(	Result:																		
		///			array				The child elements.									
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		parent,
		type,
		attributes,
		recurse,
		limit,
		forwards
		
	)
	
	{	//~	Code						
		
		//i(																				
		//i		In Internet Explorer, scopeName represents the namespace, and tagName		
		//i		represents the tag inside that namespace. In Firefox/Mozilla, both are		
		//i		given inside tagName, separated by a colon. Only Internet Explorer has		
		//i		a scopeName property.														
		//i)																				
		
		type							 =	(type)       ? type.toLowerCase() : "*";
		var a							 =	(attributes) ? attributes         : {};
		var children					 =	[];
		var childNodes					 =	(recurse) ? parent.getElementsByTagName(type) : parent.childNodes;
		var i							 =	childNodes.length;
		
		while (i--) {
			
			var child					 =	childNodes[(forwards) ? childNodes.length - i - 1 : i];
			
			if (child.nodeType != 1 || (type != "*" && child.tagName.toLowerCase() != type)) {
				
				continue;
				
			}
			
			var found					 =	true;
			
			for (var aName in a) {
				
				var found				 =	false;
				
				if (!child.hasAttribute(aName))					break;
				
				var							attribute		 =	child.getAttribute(aName);
				
				if (isArray(a[aName])) {
					
					var aSub			 =	a[aName];
					var j				 =	aSub.length;
					
					while (j--) {
						
						var aSubName	 =	aSub[j];
						
						switch (aName) {
							
							case "widget":	found			 =	isWidget(child, aSubName);					break;
							case "class":	found			 =	attribute.split(" ").contains(aSubName);	break;
							default:		found			 =	attribute == aSubName;						break;
							
						}
						
						if (found)			break;
						
					}
					
				} else {
					
					switch (aName) {
						
						case "widget":		found			 =	isWidget(child, a[aName]);					break;
						case "class":		found			 =	attribute.split(" ").contains(a[aName]);	break;
						default:			found			 =	attribute == a[aName];						break;
						
					}
					
				}
				
				if (!found)					break;
				
			}
			
			if (found)						children.push(child);
			if (children.length >= limit)	break;
			
		}
		
		return children;
		
	};
	
	//-														
	//-	findFirstChildElement						}	{	
	//-														
	
	SOAPI.findFirstChildElement			 =	function
	
	/*(	//~	Documentation				
		///																					
		///		Find a child element.														
		///																					
		///	(	Syntax:																		
		///			object findFirstChildElement(											
		///				object parent[, string type[, object attributes[,					
		///				boolean recurse]]]													
		///			)																		
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Finds the first element matching the search criteria.					
		///	)																				
		///	(	Parameters:																	
		///			object				The element containing the children.				
		///			string				The type of element to look for.					
		///			object				The attributes to look for.							
		///			boolean				Whether to recurse or just look at one level.		
		///	)																				
		///	(	Result:																		
		///			object				The child element.									
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		parent,
		type,
		attributes,
		recurse
		
	)
	
	{	//~	Code						
		
		return this.findAllChildElements(parent, type, attributes, recurse, 1, true)[0];
		
	};
	
	//-														
	//-	findLastChildElement						}	{	
	//-														
	
	SOAPI.findLastChildElement			 =	function
	
	/*(	//~	Documentation				
		///																					
		///		Find a child element.														
		///																					
		///	(	Syntax:																		
		///			object findLastChildElement(											
		///				object parent[, string type[, object attributes[,					
		///				boolean recurse]]]													
		///			)																		
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Finds the last element matching the search criteria.					
		///	)																				
		///	(	Parameters:																	
		///			object				The element containing the children.				
		///			string				The type of element to look for.					
		///			object				The attributes to look for.							
		///			boolean				Whether to recurse or just look at one level.		
		///	)																				
		///	(	Result:																		
		///			object				The child element.									
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		parent,
		type,
		attributes,
		recurse
		
	)
	
	{	//~	Code						
		
		return this.findAllChildElements(parent, type, attributes, recurse, 1)[0];
		
	};
	
	//-														
	//-												}		
	//-														
	
	//-														
	//-	findAllChildComponents							{	
	//-														
	
	SOAPI.findAllChildComponents		 =	function
	
	/*(	//~	Documentation				
		///																					
		///		Find all child components.													
		///																					
		///	(	Syntax:																		
		///			array findAllChildComponents(											
		///				object parent, string cType, string eType[, boolean recurse]		
		///			)																		
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Finds all the components of the type specified.							
		///	)																				
		///	(	Parameters:																	
		///			object				The element containing the components.				
		///			string				The type of component to look for.					
		///			string				The type of element to look for.					
		///			boolean				Whether to recurse or just look at one level.		
		///	)																				
		///	(	Result:																		
		///			array				The child components.								
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		parent,
		cType,
		eType,
		recurse
		
	)
	
	{	//~	Code						
		
		return this.findAllChildElements(parent, eType, { component: cType }, recurse);
		
	};
	
	//-														
	//-	findFirstChildComponent						}	{	
	//-														
	
	SOAPI.findFirstChildComponent		 =	function
	
	/*(	//~	Documentation				
		///																					
		///		Find a child component.														
		///																					
		///	(	Syntax:																		
		///			object findFirstChildComponent(											
		///				object parent, string cType, string eType[, boolean recurse]		
		///			)																		
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Finds the first component of the type specified.						
		///	)																				
		///	(	Parameters:																	
		///			object				The element containing the components.				
		///			string				The type of component to look for.					
		///			string				The type of element to look for.					
		///			boolean				Whether to recurse or just look at one level.		
		///	)																				
		///	(	Result:																		
		///			object				The child component.								
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		parent,
		cType,
		eType,
		recurse
		
	)
	
	{	//~	Code						
		
		return this.findFirstChildElement(parent, eType, { component: cType }, recurse);
		
	};
	
	//-														
	//-	findLastChildComponent						}	{	
	//-														
	
	SOAPI.findLastChildComponent		 =	function
	
	/*(	//~	Documentation				
		///																					
		///		Find a child component.														
		///																					
		///	(	Syntax:																		
		///			object findLastChildComponent(											
		///				object parent, string cType, string eType[, boolean recurse]		
		///			)																		
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Finds the last component of the type specified.							
		///	)																				
		///	(	Parameters:																	
		///			object				The element containing the components.				
		///			string				The type of component to look for.					
		///			string				The type of element to look for.					
		///			boolean				Whether to recurse or just look at one level.		
		///	)																				
		///	(	Result:																		
		///			object				The child component.								
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		parent,
		cType,
		eType,
		recurse
		
	)
	
	{	//~	Code						
		
		return this.findLastChildElement(parent, eType, { component: cType }, recurse);
		
	};
	
	//-														
	//-												}		
	//-														
	
	//-														
	//-	findAllChildWidgets								{	
	//-														
	
	SOAPI.findAllChildWidgets			 =	function
	
	/*(	//~	Documentation				
		///																					
		///		Find all child widgets.														
		///																					
		///	(	Syntax:																		
		///			array findAllChildWidgets(												
		///				object parent, string wType, string eType[, boolean recurse]		
		///			)																		
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Finds all the widgets of the type specified.							
		///	)																				
		///	(	Parameters:																	
		///			object				The element containing the widgets.					
		///			string				The type of widget to look for.						
		///			string				The type of element to look for.					
		///			boolean				Whether to recurse or just look at one level.		
		///	)																				
		///	(	Result:																		
		///			array				The child widgets.									
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		parent,
		wType,
		eType,
		recurse
		
	)
	
	{	//~	Code						
		
		return this.findAllChildElements(parent, eType, { widget: wType }, recurse);
		
	};
	
	//-														
	//-	findFirstChildWidget						}	{	
	//-														
	
	SOAPI.findFirstChildWidget			 =	function
	
	/*(	//~	Documentation				
		///																					
		///		Find a child widget.														
		///																					
		///	(	Syntax:																		
		///			object findFirstChildWidget(											
		///				object parent, string wType, string eType[, boolean recurse]		
		///			)																		
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Finds the first widget of the type specified.							
		///	)																				
		///	(	Parameters:																	
		///			object				The element containing the widgets.					
		///			string				The type of widget to look for.						
		///			string				The type of element to look for.					
		///			boolean				Whether to recurse or just look at one level.		
		///	)																				
		///	(	Result:																		
		///			object				The child widget.									
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		parent,
		wType,
		eType,
		recurse
		
	)
	
	{	//~	Code						
		
		return this.findFirstChildElement(parent, eType, { widget: wType }, recurse);
		
	};
	
	//-														
	//-	findLastChildWidget							}	{	
	//-														
	
	SOAPI.findLastChildWidget			 =	function
	
	/*(	//~	Documentation				
		///																					
		///		Find a child widget.														
		///																					
		///	(	Syntax:																		
		///			object findLastChildWidget(												
		///				object parent, string wType, string eType[, boolean recurse]		
		///			)																		
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Finds the last widget of the type specified.							
		///	)																				
		///	(	Parameters:																	
		///			object				The element containing the widgets.					
		///			string				The type of widget to look for.						
		///			string				The type of element to look for.					
		///			boolean				Whether to recurse or just look at one level.		
		///	)																				
		///	(	Result:																		
		///			object				The child widget.									
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		parent,
		wType,
		eType,
		recurse
		
	)
	
	{	//~	Code						
		
		return this.findLastChildElement(parent, eType, { widget: wType }, recurse);
		
	};
	
	//-														
	//-												}		
	//-														
	
	//-														
	//-	getMatchingAttributes							{	
	//-														
	
	SOAPI.getMatchingAttributes			 =	function
	
	/*(	//~	Documentation				
		///																					
		///		Get matching attributes.													
		///																					
		///	(	Syntax:																		
		///			object getMatchingAttributes( object element, object attributes )		
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Returns the attributes of the element supplied, if found.				
		///	)																				
		///	(	Parameters:																	
		///			object				The element containing the components.				
		///			object				The attributes to look for.							
		///	)																				
		///	(	Result:																		
		///			object				The attributes found.								
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		element,
		attributes
		
	)
	
	{	//~	Code						
		
		for (var i in attributes) {
			
			if (element.hasAttribute(i))	attributes[i]	 =	element.getAttribute(i);
			
		}
		
		return attributes;
		
	};
	
	//-														
	//-												}		
	//-														
	
	//-														
	//-	buildWidgets									{	
	//-														
	
	SOAPI.buildWidgets					 =	function
	
	/*(	//~	Documentation				
		///																					
		///		Build widgets.																
		///																					
		///	(	Syntax:																		
		///			void buildWidgets( [object element] )									
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Finds and builds all widgets in the document.							
		///	)																				
		///	(	Parameters:																	
		///			object				The element to look for widgets in.					
		///	)																				
		///	(	Result:																		
		///			void																	
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		element
		
	)
	
	{	//~	Code						
		
		element							 =	element || document.body;
		
		var elements					 =	[];
		var allelements					 =	element.getElementsByTagName("*");
		var stack						 =	[ element ];
		var buildsubs					 =	0;
	
		for (var i = 0, e; (e = allelements[i]) != null; i++) {
		
			if (((isWidget(e) && this.widgets[e.getAttribute("widget")]) || isComponent(e)) && !e.built) {
				
				var hasBuild			 =	e.hasAttribute("build");
				var hasBuildsubs		 =	e.hasAttribute("buildsubs");
				var j					 =	stack.length - 1;
				
				while (j >= 0) {
					
					if (stack[j] === document.body || stack[j].contains(e)) {
						
						stack.push(e);
						
						if (
								buildsubs == j
							&&	((hasBuildsubs && e.getAttribute("buildsubs") != "false") || (!hasBuildsubs))
						) {
							
							buildsubs	 =	j + 1;
							
						}
						
						j++;
						
						break;
						
					}
					
					stack.pop();
					
					j--;
					
					if (buildsubs > j)		buildsubs		 =	j;
					
				}
				
				if (
						isWidget(e) && buildsubs >= j - 1
					&&	(j == 1 || ((hasBuild && e.getAttribute("build") != "false") || (!hasBuild)))
				) {
					
					elements.push(e);
					
				}
				
			}
			
		}
		
		if (isWidget(element))			element.builtsubs	 =	true;
		
		var progress					 =	this.progress;
		
		if (!this.ProgressBar)				progress		 =	false;
		
		if (progress) {
			
			progress					 =	this.progress	 =	{};
			progress.time				 =	0;
			progress.elements			 =	elements;
			progress.element			 =	0;
			progress.bar				 =	new this.ProgressBar({
				element					 :	document.getElementById("SOAPI_LoadBar")
			});
			
			return this.buildNextWidget();
			
		}
		
		for (var i = 0, e; (e = elements[i]) != null; i++)		this.widgets[e.getAttribute("widget")]({ element: e });
		
		this.built						 =	true;
		
		SOAPI.setup();
		
	};
	
	//-														
	//-	buildNextWidget								}	{	
	//-														
	
	SOAPI.buildNextWidget				 =	function
	
	/*(	//~	Documentation				
		///																					
		///		Build the next widget.														
		///																					
		///	(	Syntax:																		
		///			void buildNextWidget( void )											
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Builds the next widget in the document.									
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
		
		var progress					 =	SOAPI.progress;
		var e							 =	progress.elements[progress.element];
		
		SOAPI.widgets[e.getAttribute("widget")]({ element: e });
		
		progress.element++;
		
		if (progress.element < progress.elements.length) {
			
			var now						 =	new Date();
			var time					 =	now.getTime();
			
			if (time - progress.time > 1000) {
				
				progress.bar.updatePosition(progress.element / progress.elements.length * 100);
				
				progress.time			 =	time;
				
				return setTimeout(SOAPI.buildNextWidget, 0);
				
			} else {
				
				return SOAPI.buildNextWidget();
				
			}
			
		}
		
		progress.bar.parentNode.removeChild(progress.bar);
		
		SOAPI.progress					 =	true;
		SOAPI.built						 =	true;
		
		SOAPI.setup();
		
	};
	
	//-														
	//-												}		
	//-														
	
	//-														
	//-	findParentWidget								{	
	//-														
	
	SOAPI.findParentWidget				 =	function
	
	/*(	//~	Documentation				
		///																					
		///		Find a parent widget.														
		///																					
		///	(	Syntax:																		
		///			object findParentWidget( object element[, string type] )				
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Finds a parent widget matching the specified type.						
		///	)																				
		///	(	Parameters:																	
		///			object				The child element.									
		///			object				The type of widget to look for.						
		///	)																				
		///	(	Result:																		
		///			object				The parent widget.									
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		element,
		type
		
	)
	
	{	//~	Code						
		
		while ((element = element.parentNode) !== document) {
			
			if (isWidget(element, type))	return element;
			
		}
		
		return false;
		
	};
	
	//-														
	//-	findParentComponent							}	{	
	//-														
	
	SOAPI.findParentComponent			 =	function
	
	/*(	//~	Documentation				
		///																					
		///		Find a parent component.													
		///																					
		///	(	Syntax:																		
		///			object findParentComponent( object element[, string type] )				
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Finds a parent component matching the specified type.					
		///	)																				
		///	(	Parameters:																	
		///			object				The child element.									
		///			object				The type of component to look for.					
		///	)																				
		///	(	Result:																		
		///			object				The parent component.								
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		element,
		type
		
	)
	
	{	//~	Code						
		
		while ((element = element.parentNode) !== document) {
			
			if (isComponent(element, type))		return element;
			
		}
		
		return false;
		
	};
	
	//-														
	//-												}		
	//-														
	
	//*														
	
	//-														
	//-	configureWidgetPieces							{	
	//-														
	
	SOAPI.configureWidgetPieces			 =	function
	
	/*(	//~	Documentation				
		///																					
		///		Configure widget pieces.													
		///																					
		///	(	Syntax:																		
		///			void configureWidgetPieces( object config )								
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Configures widget pieces.												
		///	)																				
		///	(	Parameters:																	
		///			object				The configuration to apply.							
		///	)																				
		///	(	Result:																		
		///			void																	
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		config
		
	)
	
	{	//~	Code						
		
		for (var i in config) {
			
			var pieces					 =	config[i];
			var widget					 =	SOAPI[i].prototype;
			
			if (!isObject(pieces)) {
				
				widget.parameters		 =	SOAPI.merge(widget.parameters);
				widget.parameters.pieces =	pieces;
				
				continue;
				
			}
			
			for (var j in pieces) {
				
				if (j == "self") {
					
					widget.parameters.pieces				 =	pieces[j];
					
					continue;
					
				}
				
				widget.ctypes[j]		 =	widget.ctypes[j].duplicate();
				
				var proto				 =	widget.ctypes[j].prototype;
				
				proto.parameters		 =	SOAPI.merge(proto.parameters);
				proto.parameters.pieces	 =	pieces[j];
				
			}
			
		}
		
	};
	
	//-														
	//-												}		
	//-														
	
	//*														
	
	//-														
	//-	merge											{	
	//-														
	
	SOAPI.merge							 =	function
	
	/*(	//~	Documentation				
		///																					
		///		Merge two or more objects.													
		///																					
		///	(	Syntax:																		
		///			mixed merge( mixed object[, mixed object [...]] )						
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Merges two or more objects.												
		///	)																				
		///	(	Parameters:																	
		///			mixed				The first object.									
		///			mixed				The second object.									
		///			mixed				The nth object.										
		///	)																				
		///	(	Result:																		
		///			mixed				The merged objects.									
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		//	Arbitrary
		
	)
	
	{	//~	Code						
		
		if (isArray(arguments[0]))			return [].concat(arguments);
		
		var result						 =	{};
		
		for (var i = 0; i < arguments.length; i++) {
			
			var object					 =	arguments[i];
			
			for (var j in object)			result[j]		 =	object[j];
			
		}
		
		return result;
		
	};
	
	//-														
	//-												}		
	//-														
	
	//*														
	
	//-														
	//-	applyBackgroundCSS								{	
	//-														
	
	SOAPI.applyBackgroundCSS			 =	function
	
	/*(	//~	Documentation				
		///																					
		///		Apply CSS background to image src.											
		///																					
		///	(	Syntax:																		
		///			void applyBackgroundCSS( object element )								
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Applies CSS background to image src.									
		///	)																				
		///	(	Parameters:																	
		///			object				The element to apply the background to.				
		///	)																				
		///	(	Result:																		
		///			void																	
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		element
		
	)
	
	{	//~	Code						
		
		if (isString(element))				element			 =	document.getElementById(element);
		
		if (element.tagName.toLowerCase() != "img")				return;
		
		var bg							 =	element.getAppliedStyle("background-image");
		
		if (bg.length > 5)					element.src		 		 =	bg.match(/http.+[^")]/g)[0];
		else if (element.src == "")			element.style.display	 =	"none";
		
		element.style.backgroundImage	 =	"none";
		
	};
	
	//-														
	//-												}		
	//-														
	
	//*														
	
	//-														
	//-	extendHTML										{	
	//-														
	
	SOAPI.extendHTML					 =	function
	
	/*(	//~	Documentation				
		///																					
		///		Will apply the extended HTML methods (for IE).								
		///																					
		///	(	Syntax:																		
		///			void extendHTML( string )												
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Applies the base extended HTML methods from the base element.			
		///	)																				
		///	(	Parameters:																	
		///			string				The base DOM node.									
		///	)																				
		///	(	Result:																		
		///			void																	
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		baseElement
		
	)
	
	{	//~	Code						
		
		var element 					 =	!isString(baseElement) ? baseElement : $(baseElement);	 
		var elements					 =	element.getElementsByTagName("*");
		var HTMLElement				 	 =	SOAPI.HTMLElement;
		
		for (var i = elements.length - 1; i >= 0; i--) {
			
			var el				 		 =	elements[i];
		
			if (typeof el.getAppliedStyle == "undefined") {
				
				if (el.tagName == "OBJECT") {
					
					for (var pName in HTMLElement) {
						
						if (!el[pName])		el[pName]	 =	HTMLElement[pName];
						
					}
					
					continue;
					
				}
				
				for (var p in HTMLElement) 	el[p]	 	 =	HTMLElement[p];
				
			}
			
		}
		
	};
	
	//-														
	//-												}		
	//-														
		
	//*														
	//*												}		
	//*														
	
}

//+																														
//+																												}		
//+																														
