//#																														
//#	SOAPI 4.8													Copyright © 2000 - 2009 Dan Williams.					
//#																														

//+																														
//+	HTMLElement extensions																							{	
//+(																													
	
	window.SOAPI						 =	window.SOAPI || {};
	var SOAPI							 =	window.SOAPI;
	
	SOAPI.Core_IE_HTMLElement			 =	function() {/*}*/
	
//+																														

	SOAPI.HTMLElement					 =
	
//+)																													

/*(	//~	Documentation					
	///																					
	///		This provides an HTMLElement object for use in IE. It is not a true			
	///		HTMLElement object, but that seemed like the best name. It is used to		
	///		extend general element nodes in IE.											
	///																					
)*/

{	//~	Code							
	
	//*														
	//*	Methods											{	
	//*														
	
	//-														
	//-	getElementsByClassName [$C]						{	
	//-														
	
	getElementsByClassName				 :	function
	
	/*(	//~	Documentation				
		///																					
		///		Get element(s) by class name.												
		///																					
		///	(	Syntax:																		
		///			mixed getElementsByClassName( string className[, string tag] )			
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Gets element(s) by class name.											
		///	)																				
		///	(	Parameters:																	
		///			string				The class name to look for.							
		///			string				The tag to look for.								
		///	)																				
		///	(	Result:																		
		///			mixed				The element(s).										
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		className,
		tag
		
	)
	
	{	//~	Code						
		
		var elements					 =	[];
		var tagElements					 =	document.getElementsByTagName(tag || "*");
		var pattern						 =	new RegExp("(^|\\s)" + className + "(\\s|$)");
		
		for (var i = 0; i < tagElements.length; i++) {
			
			if (pattern.test(tagElements[i].className)) {
				
				elements.push(tagElements[i]);
				
			}
			
		}
		
		return elements;		
		
	},
	
	//-														
	//-												}		
	//-														
	
	//-														
	//-	replaceHTML										{	
	//-														
	
	replaceHTML							 :	function
	
	/*(	//~	Documentation				
		///																					
		///		Replace inner HTML.															
		///																					
		///	(	Syntax:																		
		///			void replaceHTML( string html )											
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Replaces inner HTML using the most efficient method.					
		///	)																				
		///	(	Parameters:																	
		///			string				The HTML to use.									
		///	)																				
		///	(	Result:																		
		///			void																	
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		html
		
	)
	
	{	//~	Code						
		
		this.innerHTML					 =	html;
		
	},
	
	//-														
	//-												}		
	//-														
	
	//-														
	//-	hasAttribute									{	
	//-														
	
	hasAttribute						 :	function
	
	/*(	//~	Documentation				
		///																					
		///		Check for an attribute.														
		///																					
		///	(	Syntax:																		
		///			boolean hasAttribute( string name )										
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Checks for an attribute.												
		///	)																				
		///	(	Parameters:																	
		///			string				The attribute name.									
		///	)																				
		///	(	Result:																		
		///			boolean				Whether the attribute exists or not.				
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		name
		
	)
	
	{	//~	Code						
		
		switch (name) {
			
			case "class":					name			 =	"className";		break;
			case "for":						name			 =	"htmlFor";			break;
			
		}
		
		return this[name] != null;
		
	},
	
	//-														
	//-	getAttribute								}	{	
	//-														
	
	getAttribute						 :	function
	
	/*(	//~	Documentation				
		///																					
		///		Get an attribute.															
		///																					
		///	(	Syntax:																		
		///			string getAttribute( string name )										
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Gets an attribute.														
		///	)																				
		///	(	Parameters:																	
		///			string				The attribute name.									
		///	)																				
		///	(	Result:																		
		///			string				The attribute value.								
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		name
		
	)
	
	{	//~	Code						
		
		switch (name) {
			
			case "class":					return this.className;
			case "style":					return this.style.cssText;
			case "for":						return this.htmlFor;
			default:						return String(this[name]);
			
		}
		
	},
	
	//-														
	//-	setAttribute								}	{	
	//-														
	
	setAttribute						 :	function
	
	/*(	//~	Documentation				
		///																					
		///		Set an attribute.															
		///																					
		///	(	Syntax:																		
		///			void setAttribute( string name, string value )							
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Sets an attribute.														
		///	)																				
		///	(	Parameters:																	
		///			string				The attribute name.									
		///			string				The attribute value.								
		///	)																				
		///	(	Result:																		
		///			void																	
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		name,
		value
		
	)
	
	{	//~	Code						
		
		switch (name) {
			
			case "class":					this.className		 =	value;	break;
			case "style":					this.style.cssText	 =	value;	break;
			case "for":						this.htmlFor		 =	value;	break;
			default:						this[name]			 =	value;
			
		}
		
		this.refresh();
		
	},
	
	//-														
	//-												}		
	//-														
	
	//-														
	//-	insertAfter										{	
	//-														
	
	insertAfter							 :	function
	
	/*(	//~	Documentation				
		///																					
		///		Complements insertBefore.													
		///																					
		///	(	Syntax:																		
		///			void insertAfter( object node, object referenceNode )					
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Complements insertBefore.												
		///	)																				
		///	(	Parameters:																	
		///			object				The node to insert.									
		///			object				The node to insert after.							
		///	)																				
		///	(	Result:																		
		///			void																	
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		node,
		referenceNode
		
	)
	
	{	//~	Code						
		
		this.insertBefore(node, referenceNode.nextSibling);
		
	},
	
	//-														
	//-	prependChild								}	{	
	//-														
	
	prependChild						 :	function
	
	/*(	//~	Documentation				
		///																					
		///		Complements appendChild.													
		///																					
		///	(	Syntax:																		
		///			void prependChild( object node )										
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Complements appendChild.												
		///	)																				
		///	(	Parameters:																	
		///			object				The node to insert.									
		///	)																				
		///	(	Result:																		
		///			void																	
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		node
		
	)
	
	{	//~	Code						
		
		this.insertBefore(node, this.firstChild);
		
	},
	
	//-														
	//-												}		
	//-														
	
	//-														
	//-	contains										{	
	//-														
	
	contains							 :	function
	
	/*(	//~	Documentation				
		///																					
		///		Check if a node contains another node.										
		///																					
		///	(	Syntax:																		
		///			boolean contains( object node )											
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Checks if a node contains another node as a descendant.					
		///	)																				
		///	(	Parameters:																	
		///			object				The node to look for.								
		///	)																				
		///	(	Result:																		
		///			boolean				Whether the node is a descendant or not.			
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		node
		
	)
	
	{	//~	Code						
		
		while (node && (this != node))		node			 =	node.parentNode;
		
		return this == node;
		
	},
	
	//-														
	//-												}		
	//-														
	
	//-														
	//-	getAppliedStyle									{	
	//-														
	
	getAppliedStyle						 :	function
	
	/*(	//~	Documentation				
		///																					
		///		Get an applied style.														
		///																					
		///	(	Syntax:																		
		///			string getAppliedStyle( string name )									
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Sets an attribute.														
		///	)																				
		///	(	Parameters:																	
		///			string				The style name.										
		///	)																				
		///	(	Result:																		
		///			string				The style value.									
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		name
		
	)
	
	{	//~	Code						
		
		name							 =	name.replace(/\-(\w)/g, function(match, p1) {
			return p1.toUpperCase();
		});
		
		return this.currentStyle[name];
		
	},
	
	//-														
	//-												}		
	//-														
	
	//-														
	//-	refresh											{	
	//-														
	
	refresh								 :	function
	
	/*(	//~	Documentation				
		///																					
		///		Refresh applied styles.														
		///																					
		///	(	Syntax:																		
		///			void refresh( void )													
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Refreshes applied styles.												
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
		
		this.className					 =	this.className;
		
	}
	
	//-														
	//-												}		
	//-														
	
	//*														
	//*												}		
	//*														
	
};
	
//+																														
	
	/*{*/};
	
//+)																													
//+																												}		
//+																														

//+																														
//+	createElement extensions																						{	
//+(																													
	
	SOAPI.Core_IE_CreateElement			 =	function() {/*}*/
	
//+)																													

	//-														
	//-	createElement									{	
	//-														
	
	document._createElement				 =	document.createElement;
	document.createElement				 =	function
	
	/*(	//~	Documentation				
		///																					
		///		Create an element.															
		///																					
		///	(	Syntax:																		
		///			object createElement( string type )										
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Creates an element.														
		///	)																				
		///	(	Parameters:																	
		///			string				The element type.									
		///	)																				
		///	(	Result:																		
		///			object				The created element.								
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		type
		
	)
	
	{	//~	Code						
		
		var element						 =	document._createElement(type);
		var HTMLElement					 =	SOAPI.HTMLElement;
		
		for (var pName in HTMLElement)		element[pName]	 =	HTMLElement[pName];
		
		return element;
		
	};
	
	//-														
	//-												}		
	//-														
	
//+(																													
	
	/*{*/};
	
//+)																													
//+																												}		
//+																														
