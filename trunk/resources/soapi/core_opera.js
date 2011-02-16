//#																														
//#	SOAPI 4.8													Copyright © 2000 - 2009 Dan Williams.					
//#																														

//+																														
//+	HTMLElement extensions																							{	
//+(																													
	
	window.SOAPI						 =	window.SOAPI || {};
	var SOAPI							 =	window.SOAPI;
	
	SOAPI.Core_Opera_HTMLElement		 =	function() {/*}*/
	
//+)																													

/*(	//~	Documentation					
	///																					
	///		These functions extend the HTMLElement object, to emulate IE functions.		
	///																					
)*/

{	//~	Code							
	
	//*														
	//*	Methods											{	
	//*														
	
	//-														
	//-	getElementsByClassName [$C]						{	
	//-														
	
	HTMLElement.prototype.getElementsByClassName			 =	function
	
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
		var tagElements					 =	this.getElementsByTagName(tag || "*");
		var pattern						 =	new RegExp("(^|\\s)" + className + "(\\s|$)");
		
		for (var i = 0; i < tagElements.length; i++) {
			
			if (pattern.test(tagElements[i].className)) {
				
				elements.push(tagElements[i]);
				
			}
			
		}
		
		return elements;		
		
	};
	
	HTMLElement.prototype.$C			 =	HTMLElement.prototype.getElementsByClassName;
	
	//-														
	//-												}		
	//-														
	
	//-														
	//-	replaceHTML										{	
	//-														
	
	HTMLElement.prototype.replaceHTML	 =	function
	
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
		
		var parent						 =	this.parentNode;
		var newElement					 =	this.cloneNode(false);
		
		newElement.innerHTML			 =	html;
		
		parent.replaceChild(newElement, this);
		
		SOAPI.Event.copyEventHandlers(this, newElement, false);
		
	};
	
	//-														
	//-												}		
	//-														
	
	//-														
	//-	insertAfter										{	
	//-														
	
	HTMLElement.prototype.insertAfter	 =	function
	
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
		
	};
	
	//-														
	//-	prependChild								}	{	
	//-														
	
	HTMLElement.prototype.prependChild	 =	function
	
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
		
	};
	
	//-														
	//-												}		
	//-														
	
	//-														
	//-	contains										{	
	//-														
	
	HTMLElement.prototype.contains		 =	function
	
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
		
	};
	
	//-														
	//-												}		
	//-														
	
	//-														
	//-	getAppliedStyle									{	
	//-														
	
	HTMLElement.prototype.getAppliedStyle =	function
	
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
		
		return document.defaultView.getComputedStyle(this, null).getPropertyValue(name);
		
	};
	
	//-														
	//-												}		
	//-														
	
	//-														
	//-	refresh											{	
	//-														
	
	HTMLElement.prototype.refresh		 =	function
	
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
		
		//i(																				
		//i		This function does nothing in Opera, as a refresh is not needed.			
		//i)																				
		
	};
	
	//-														
	//-												}		
	//-														
	
	//*														
	//*												}		
	//*														
	
}

//+(																													
	
	/*{*/};
	
//+)																													
//+																												}		
//+																														

//+																														
//+	createElement extensions																						{	
//+(																													
	
	SOAPI.Core_Opera_CreateElement		 =	function() {/*}*/
	
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
		
		if (type.toLowerCase() == "input" || type.toLowerCase() == "textarea") {
			
			SOAPI.Event.addEventHandler(element, "focus");
			SOAPI.Event.addEventHandler(element, "blur");
			
		}
		
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
