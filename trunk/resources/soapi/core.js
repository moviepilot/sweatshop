//#																														
//#	SOAPI 4.8													Copyright © 2000 - 2009 Dan Williams.					
//#																														

//+																														
//+	Browser detection																								{	
//+																														

/*(	//~	Documentation					
	///																					
	///		This code sets up some simple browser detection variables.					
	///																					
)*/

{	//~	Code							
	
	window.opera						 =	window.opera || false;
	window.ie							 =	(!window.opera && typeof HTMLElement == "undefined");
	window.gecko						 =	(!window.ie);
	
}

//+																														
//+																												}		
//+																														

//+																														
//+	SOAPI core modules																								{	
//+																														
	
	if (opera) {
		
		SOAPI.Core_Opera_HTMLElement.call();
		SOAPI.Core_Opera_CreateElement.call();
		
	} else if (ie) {
		
		SOAPI.Core_IE_HTMLElement.call();
		SOAPI.Core_IE_CreateElement.call();
		
	} else {
		
		SOAPI.Core_Gecko_HTMLElement.call();
		SOAPI.Core_Gecko_CreateElement.call();
		
	}
	
//+																														
//+																												}		
//+																														
