//#																														
//#	SOAPI 4.8													Copyright © 2000 - 2009 Dan Williams.					
//#																														

//+																														
//+	SOAPI.Cookie																									{	
//+(																													
	
	SOAPI.Cookie						 =
	
//+)																													

/*(	//~	Documentation					
	///																					
	///		This is the cookie handler.													
	///																					
)*/

{	//~	Code							
	
	//*														
	//*	Methods											{	
	//*														
	
	//-														
	//-	get												{	
	//-														
	
	get									 :	function
	
	/*(	//~	Documentation				
		///																					
		///		Get a cookie.																
		///																					
		///	(	Syntax:																		
		///			string get( string name )												
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Gets a cookie.															
		///	)																				
		///	(	Parameters:																	
		///			string				The cookie name.									
		///	)																				
		///	(	Result:																		
		///			string				The cookie value.									
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		name
		
	)
	
	{	//~	Code						
		
		var start						 =	document.cookie.indexOf(name + "=");
		
		if (start == -1)					return;
		
		var middle						 =	start + name.length + 1;
		var end							 =	document.cookie.indexOf(';', middle);
		
		if (end == -1)						end				 =	document.cookie.length;
		
		return unescape(document.cookie.substring(middle, end));
		
	},
	
	//-														
	//-	set											}	{	
	//-														
	
	set									 :	function
	
	/*(	//~	Documentation				
		///																					
		///		Set a cookie.																
		///																					
		///	(	Syntax:																		
		///			void set(																
		///				string name, string value[, integer expires[, string path[,			
		///				string domain[, boolean secure]]]]									
		///			)																		
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Sets a cookie.															
		///	)																				
		///	(	Parameters:																	
		///			string				The cookie name.									
		///			string				The cookie value.									
		///			integer				The time in seconds until the cookie expires.		
		///			string				The cookie path.									
		///			string				The cookie domain.									
		///			boolean				Whether the cookie is secure.						
		///	)																				
		///	(	Result:																		
		///			void																	
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		name,
		value,
		expires,
		path,
		domain,
		secure
		
	)
	
	{	//~	Code						
		
		var cookie						 =	name + "=" + escape(value);
		
		if (expires != null) {
			
			var date					 =	new Date();
			
			date.setTime(date.getTime() + (expires * 1000));
			
			cookie						+=	";expires=" + date.toGMTString();
			
		}
		
		cookie							+=	";path=" + ((path != null) ? path : "/");
		
		if (domain != null)					cookie			+=	";domain=" + domain;
		if (secure)							cookie			+=	";secure";
		
		document.cookie					 =	cookie;
		
	},
	
	//-														
	//-	clear										}	{	
	//-														
	
	clear								 :	function
	
	/*(	//~	Documentation				
		///																					
		///		Clear a cookie.																
		///																					
		///	(	Syntax:																		
		///			void clear( string name[, string path[, string domain]] )				
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Clears a cookie.														
		///	)																				
		///	(	Parameters:																	
		///			string				The cookie name.									
		///			string				The cookie path.									
		///			string				The cookie domain.									
		///	)																				
		///	(	Result:																		
		///			void																	
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		name,
		path,
		domain
		
	)
	
	{	//~	Code						
		
		this.set(name, "", -1, path, domain);
		
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
