//#																														
//#	SOAPI 4.8													Copyright © 2000 - 2009 Dan Williams.					
//#																														

//+																														
//+	SOAPI.Sprite																									{	
//+(																													
	
	SOAPI.Sprite						 =	SOAPI.Class.extension();
	
	SOAPI.Sprite.extend
	
//+)																													

/*(	//~	Documentation					
	///																					
	///		This is a sprite object. It gets added to an element such as a div, in		
	///		order to turn that element into a sprite.									
	///																					
)*/

({	//~	Code							
	
	//*														
	//*	Variables										{	
	//*														
	
	isSprite							 :	true,
	timer								 :	0,
	dragger								 :	null,			///		Dragger		
	animators							 :	null,			///		object		
	
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
		///		Class constructor.															
		///																					
		///	(	Syntax:																		
		///			object construct( mixed element[, boolean draggable] )					
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Class constructor.														
		///																					
		///			Example of construction:												
		///																					
		///				mySprite1		 =	new SOAPI.Sprite("elementId");					
		///				mySprite2		 =	new SOAPI.Sprite(element);						
		///																					
		///			When constructing a sprite, there has to be an existing element			
		///			(e.g. a div) for the sprite to be based on. The element is fed into		
		///			the sprite constructor function, which adds sprite capabilities and		
		///			then returns the enhanced element (which is now a sprite).				
		///																					
		///			If using the Animation API, multi-threaded, multi-grouped animations	
		///			can be performed by adding one or more animations to the relevant		
		///			sprite. These can then be accessed through the sprite.					
		///	)																				
		///	(	Parameters:																	
		///			mixed				The id of the element to turn into a sprite,		
		///								or the element itself.								
		///			boolean				Whether to add event handlers.						
		///			boolean				Whether to add dragability.							
		///	)																				
		///	(	Result:																		
		///			object				The element, turned into a sprite.					
		///	)																				
		///																					
	)*/

	(	//~	Parameters						
		
		element,
		draggable
		
	)
	
	{	//~	Code							
		
		if (isString(element))				element			 =	document.getElementById(element);
		
		if (!element.isSprite) {
			
			for (var member in this) 		element[member]	 =	this[member];
						
			element.animators			 =	{};
			
		}
		
		if (draggable && !element.dragger) {
			
			element.dragger				 =	new SOAPI.Dragger();
			
			element.dragger.addPartner(element, { left: 1 }, { top: 1 }, true);
			
		}
		
		return element;
		
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
		///		Enable the sprite.															
		///																					
		///	(	Syntax:																		
		///			void enable( void )														
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Enables the sprite.														
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
		
	},
	
	//-														
	//-	disable										}	{	
	//-														
	
	disable								 :	function
	
	/*(	//~	Documentation				
		///																					
		///		Disable the sprite.															
		///																					
		///	(	Syntax:																		
		///			void disable( void )													
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Disables the sprite.													
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
		
	},
	
	//-														
	//-												}		
	//-														
	
	//:	Get properties									{	
	
	get									 :	function(name, giveUnits) {
		
		switch (name.replace(/-/g, "").toLowerCase()) {
			
			//;	Width									{	
			
			case "width": {
				
				var value				 =	this.getAppliedStyle("width");
				
				return (!isNumber(value) && value.indexOf("px") < 0) ? this.clientWidth : parseFloat(value);
				
			}
			
			case "offsetwidth":				return this.offsetWidth;
			case "clientwidth":				return this.clientWidth;
			case "scrollwidth":				return this.scrollWidth;
			case "actualwidth":				return this.offsetWidth;
			
			case "contentwidth": {
				
				var value				 =	0;
				var i					 =	this.childNodes.length;
				
				while (i--) {
					
					var node			 =	this.childNodes[i];
					
					if (node.nodeType != 1)						continue;
					
					var width			 =	node.offsetLeft + node.offsetWidth;
					
					if (width > value)		value			 =	width;
					
				}
				
				return value;
				
			}
			
			//;	Height								}	{	
			
			case "height": {
				
				var value				 =	this.getAppliedStyle("height");
				
				return (!isNumber(value) && value.indexOf("px") < 0) ? this.clientHeight : parseFloat(value);
				
			}
			
			case "offsetheight":			return this.offsetHeight;
			case "clientheight":			return this.clientHeight;
			case "scrollheight":			return this.scrollHeight;
			case "actualheight":			return this.offsetHeight;
			
			case "contentheight": {
				
				var value				 =	0;
				var i					 =	this.childNodes.length;
				
				while (i--) {
					
					var node			 =	this.childNodes[i];
					
					if (node.nodeType != 1)						continue;
					
					var height			 =	node.offsetTop + node.offsetHeight;
					
					if (height > value)		value			 =	height;
					
				}
				
				return value;
				
			}
			
			//;	Min/max width/height				}	{	
			
			case "minwidth":				return parseFloat(this.getAppliedStyle("min-width"));
			case "maxwidth":				return parseFloat(this.getAppliedStyle("max-width"));
			case "minheight":				return parseFloat(this.getAppliedStyle("min-height"));
			case "maxheight":				return parseFloat(this.getAppliedStyle("max-height"));
			
			//;	Left								}	{	
			
			case "left": {
				
				var value				 =	this.getAppliedStyle("left");
				
				return (!isNumber(value) && value.indexOf("px") < 0) ? this.offsetLeft : parseFloat(value);
				
			}
			
			case "offsetleft":				return this.offsetLeft;
			case "clientleft":				return this.clientLeft;
			case "scrollleft":				return this.scrollLeft;
			case "actualleft":				return this.getActual("offsetLeft");
			
			//;	Right								}	{	
			
			case "right": {
				
				var value				 =	this.getAppliedStyle("right");
				
				return (!isNumber(value) && value.indexOf("px") < 0) ? this.offsetRight : parseFloat(value);
				
			}
			
			case "offsetright":				return this.offsetRight;
			case "clientright":				return this.clientRight;
			case "scrollright":				return this.scrollRight;
			case "actualright":				return this.getActual("offsetRight");
			
			//;	Top									}	{	
			
			case "top": {
				
				var value				 =	this.getAppliedStyle("top");
				
				return (!isNumber(value) && value.indexOf("px") < 0) ? this.offsetTop : parseFloat(value);
				
			}
			
			case "offsettop":				return this.offsetTop;
			case "clienttop":				return this.clientTop;
			case "scrolltop":				return this.scrollTop;
			case "actualtop":				return this.getActual("offsetTop");
			
			//;	Bottom								}	{	
			
			case "bottom": {
				
				var value				 =	this.getAppliedStyle("bottom");
				
				return (!isNumber(value) && value.indexOf("px") < 0) ? this.offsetBottom : parseFloat(value);
				
			}
			
			case "offsetbottom":			return this.offsetBottom;
			case "clientbottom":			return this.clientBottom;
			case "scrollbottom":			return this.scrollBottom;
			case "actualbottom":			return this.getActual("offsetBottom");
			
			//;	RLeft								}	{	
			
			case "rleft":					return this.get("right")       + this.get("width");
			case "offsetrleft":				return this.get("offsetright") + this.get("offsetwidth");
			case "clientrleft":				return this.get("clientright") + this.get("clientwidth");
			case "scrollrleft":				return this.get("scrollright") + this.get("scrollwidth");
			case "actualrleft":				return this.get("actualright") + this.get("actualwidth");
			
			//;	LRight								}	{	
			
			case "lright":					return this.get("left")       + this.get("width");
			case "offsetlright":			return this.get("offsetleft") + this.get("offsetwidth");
			case "clientlright":			return this.get("clientleft") + this.get("clientwidth");
			case "scrolllright":			return this.get("scrollleft") + this.get("scrollwidth");
			case "actuallright":			return this.get("actualleft") + this.get("actualwidth");
			
			//;	BTop								}	{	
			
			case "btop":					return this.get("bottom")       + this.get("height");
			case "offsetbtop":				return this.get("offsetbottom") + this.get("offsetheight");
			case "clientbtop":				return this.get("clientbottom") + this.get("clientheight");
			case "scrollbtop":				return this.get("scrollbottom") + this.get("scrollheight");
			case "actualbtop":				return this.get("actualbottom") + this.get("actualheight");
			
			//;	TBottom								}	{	
			
			case "tbottom":					return this.get("top")       + this.get("height");
			case "offsettbottom":			return this.get("offsettop") + this.get("offsetheight");
			case "clienttbottom":			return this.get("clienttop") + this.get("clientheight");
			case "scrolltbottom":			return this.get("scrolltop") + this.get("scrollheight");
			case "actualtbottom":			return this.get("actualtop") + this.get("actualheight");
			
			//;	Clip								}	{	
			
			case "clip": {
				
				var regex				 =	(giveUnits) ? /rect|\(|\)|\s/ig : /rect|\(|\)|px|\s/ig;
				var clip				 =	this.getAppliedStyle("clip").replace(regex, "").split(",");
				
				if (clip.length < 4) {
					
					if (clip.length == 1 && clip[0] == "")		return [ "auto",  "auto",  "auto",  "auto"  ];
					if (clip.length == 1)						return [ clip[0], clip[0], clip[0], clip[0] ];
					if (clip.length == 2)						return [ clip[0], clip[1], clip[0], clip[1] ];
					
					clip[3]				 =	"auto";
					
				}
				
				return clip;
				
			}
			
			//;	Opacity								}	{	
			
			case "opacity":					return parseFloat(this.getAppliedStyle("opacity")) * 100;
			
			//;	Border								}	{	
			
			case "borderleftwidth":
			case "borderrightwidth":
			case "bordertopwidth":
			case "borderbottomwidth":		return parseFloat(this.getAppliedStyle(name));
			
			//;										}		
			
			default:						return this.getAppliedStyle(name);
			
		}
		
	},
	getActual							 :	function(name) {
		
		var obj							 =	this;
		var value						 =	obj[name];
		var offsetName					 =	(name.substring(0, 6) == "offset") ? name.substring(6).toLowerCase() : "";
		var borderName					 =	(offsetName) ? "border-" + offsetName + "-width" : "";
		
		while (obj = obj.offsetParent) {
			
			var borderWidth				 =	(borderName) ? parseFloat(obj.getAppliedStyle(borderName)) : 0;
			
			value						+=	obj[name] + (isNaN(borderWidth) ? 0 : borderWidth);
			
			if (gecko && obj.getAppliedStyle("overflow") == "hidden" ) {
				
				value					+=	isNaN(borderWidth) ? 0 : borderWidth;
				
			}
			
		}
		
		return value;
		
	},
	
	//:	Movement									}	{	
	
	moveTo								 :	function(left, top) {
		
		this.styleTo({ left: left, top: top });
		
	},
	moveBy								 :	function(left, top) {
		
		this.moveTo(
			(left != null) ? this.get("left") + left : left,
			(top  != null) ? this.get("top")  + top  : top
		);
		
	},
	
	//:	Dimensions									}	{	
	
	sizeTo								 :	function(width, height) {
		
		this.styleTo({ width: (width < 0) ? 0 : width, height: (height < 0) ? 0 : height });
		
	},
	sizeBy								 :	function(width, height) {
		
		this.sizeTo(
			(width  != null) ? this.get("width")  + width  : width,
			(height != null) ? this.get("height") + height : height
		);
		
	},
	
	//:	Clipping									}	{	
	
	clipTo								 :	function(clipTop, clipRight, clipBottom, clipLeft) {
		
		var clip						 =	this.get("clip", true);
		
		if (clipTop    != null)				clip[0]			 =	(clipTop    == "auto") ? "auto" : clipTop    + "px";
		if (clipRight  != null)				clip[1]			 =	(clipRight  == "auto") ? "auto" : clipRight  + "px";
		if (clipBottom != null)				clip[2]			 =	(clipBottom == "auto") ? "auto" : clipBottom + "px";
		if (clipLeft   != null)				clip[3]			 =	(clipLeft   == "auto") ? "auto" : clipLeft   + "px";
		
		this.style.clip					 =	"rect(" + clip[0] + " " + clip[1] + " " + clip[2] + " " + clip[3] + ")";
		
	},
	clipBy								 :	function(clipTop, clipRight, clipBottom, clipLeft) {
		
		var clip						 =	this.get("clip", false);
		
		clipTop							 =	parseFloat(clipTop);
		clipRight						 =	parseFloat(clipRight);
		clipBottom						 =	parseFloat(clipBottom);
		clipLeft						 =	parseFloat(clipLeft);
		
		clipTop							 =	(clipTop)
			?	clipTop + ((clip[0] == "auto") ? 0 : parseFloat(clip[0]))
			:	clip[0]
		;
		
		clipRight						 =	(clipRight)
			?	clipRight + ((clip[1] == "auto") ? this.scrollWidth : parseFloat(clip[1]))
			:	clip[1]
		;
		
		clipBottom						 =	(clipBottom)
			?	clipBottom + ((clip[2] == "auto") ? this.scrollHeight : parseFloat(clip[2]))
			:	clip[2]
		;
		
		clipLeft						 =	(clipLeft)
			?	clipLeft + ((clip[3] == "auto") ? 0 : parseFloat(clip[3]))
			:	clip[3]
		;
		
		this.clipTo(clipTop, clipRight, clipBottom, clipLeft);
		
	},
	
	//:	Opacity										}	{	
	
	blendTo								 :	function(opacity) {
		
		if (!isNumber(opacity))				return;
		
		this.style.opacity				 =	opacity / 100;
		
		if (ie) this.style.filter		 =	"alpha(opacity=" + opacity + ")";
		
	},
	blendBy								 :	function(opacity) {
		
		this.blendTo((this.get("opacity") * 100) + opacity);
		
	},
	
	//:	Visibilty									}	{	
	
	hide								 :	function() {
		
		this.style.visibility			 =	"hidden";
		
		if (this.getAppliedStyle("display") != "none") {
			
			this.previousDisplayCSS		 =	this.getAppliedStyle("display");
			this.style.display			 =	"none";
			
		}
		
	},
	show								 :	function() {
		
		this.style.visibility			 =	"visible";
		
		if (this.getAppliedStyle("display") == "none") {
			
			this.style.display			 =	(this.previousDisplayCSS) ? this.previousDisplayCSS : "block";
			
		}
		
		SOAPI.Event.triggerEvent("sizechange",    this, null, false, true);
		SOAPI.Event.triggerEvent("contentchange", this, null, true);
		
	},
	visibilityTo						 :	function(visible) {
		
		this[(visible) ? "show" : "hide"]();
		
	},
	isVisible							 :	function() {
		
		return !(this.getAppliedStyle("visibility") == "hidden" || this.getAppliedStyle("display") == "none");
		
	},
	toggleVisibility					 :	function() {
		
		this[(this.isVisible) ? "hide" : "show"]();
		
	},
	
	//:	CSS class name								}	{	
	
	classNames							 :	function() {
		
		return this.className.split(/\s+/);
		
	},
	hasClassName						 :	function(className) {
		
		return (this.className && this.className.match(new RegExp("(^|\\s)" + className + "(\\s|$)"))) ? true : false;
		
	},
	addClassName						 :	function(className) {
		
		if (this.hasClassName(className))	return;
		
		this.className					+=	(this.className ? " " : "") + className;
		
	},
	removeClassName						 :	function(className) {
		
		this.className					 =	this.className.replace(new RegExp("(^|\\s+)" + className + "(\\s+|$)"), " ").trim();
		
	},
	toggleClassName						 :	function(className) {
		
		this[(this.hasClassName(className)) ? "removeClassName" : "addClassName"](className);
		
	},
	
	//:	CSS style change							}	{	
	
	styleTo								 :	function(name, value) {
		
		var px							 =	{
			"width": true, "height": true, "left": true, "right": true, "top": true, "bottom": true
		};
		var pos							 =	{ "width": true, "height": true };
		var scroll						 =	{ "scrollTop": true, "scrollLeft": true };
		var styles						 =	isObject(name) ? name : {};
		
		if (!isObject(name))				styles[name]	 =	value;
		
		for (var i in styles) {
			
			if (styles[i] == null || isUnNumber(styles[i]))	continue;
			
			if (pos[i] && styles[i] < 0)	styles[i]		 =	0;
			
			if (scroll[i])					this[i]			 =	styles[i];
			else							this.style[i]	 =	styles[i] + ((isNumber(styles[i]) && px[i]) ? "px" : "");
			
		}
		
	},
	styleBy								 :	function(name, value) {
		
		var styles						 =	isObject(name) ? name : {};
		
		if (!isObject(name))				styles[name]	 =	value;
		
		for (var i in styles) {
			
			if (isNumber(styles[i]))		styles[i]		+=	this.get(i);
			
		}
		
		this.styleTo(styles);
		
	},
	
	//:	Write										}	{	
	
	write								 :	function(html, append, position) {
		
		position						 =	position || "beforeend";
		
		if (append)							this.insertAdjacentHTML(position, html);
		else								this.innerHTML	 =	html;
		
	}
	
	//:												}		
	
	//*														
	//*												}		
	//*														
	
});

//+																														
//+																												}		
//+																														
