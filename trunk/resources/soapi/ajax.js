//#																														
//#	SOAPI 4.8													Copyright © 2000 - 2009 Dan Williams.					
//#																														

//+																														
//+	SOAPI.Ajax																										{	
//+(																													
	
	SOAPI.Ajax							 =
	
//+)																													

/*(	//~	Documentation					
	///																					
	///		This is the ajax request object.											
	///																					
)*/

{	//~	Code							
	
	//*														
	//*	Variables										{	
	//*														
	
	ajax								 :	null,			///		The Ajax object	
	updating							 :	false,
	requestHashKey						 :	0,						
	requests							 :	[ ],
	currentRequest						 :	{ },
	currentHash							 :	null,
	hashListener						 :	null,
	
	loadIndicator						 :	null,
	timerOn								 :	false,
	
	_404_ERROR							 :	'The request URL was unreachable',
	_AJAX_FAIL							 :	'Unable to create the AJAX request',
	_EMPTY_URL							 :	'No request provided',
	
	//*														
	//*												}		
	//*														
	
	//*														
	//*	Methods											{	
	//*														
	
						
	request								 :	function
	
	/*(	//~	Documentation				
		///																					
		///		Setup an ajax request.														
		///																					
		///	(	Syntax:																		
		///			void request( mixed properties )										
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Sets up an ajax request.												
		///	)																				
		///	(	Parameters:																	
		///			mixed				The request properties								
		///				string			Where to make the request to						
		///				object			Data to send with request							
		///				string			Method to send data									
		///				mixed			To be carried out on success of request				
		///				mixed			To be carried out on request failure				
		///				boolean			If the response should be evaled on a ref object
		///				mixed			Value(s) passed to any returned executable code		
		///				boolean			Show slow progress indicator						
		///	)																				
		///	(	Result:																		
		///			void																	
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		properties
	
	)
	
	{	//~	Code						
		
		//	Defaults
		var r							 =	{
			url						 	 :	null,
			data						 :	'',
			dataType					 :	'GET',
			onSuccess					 :	function(){},
			onError						 :	function(e) { console.log(e); },
			onUploadEvents				 :	function(){},
			executeResponse				 :	false,
			DOMReference				 :	[ ],
			showProgress				 :	true
		};
		
		if (isObject(properties)) {
			
			for (var pName in properties) 	r[pName] 	 =	properties[pName];
			
			if (properties.dataType) 		r.dataType	 =	properties.dataType.toUpperCase();
			
			if (r.dataType == 'FILE' && isObject(properties.data)) {
				
				r.data					 =	properties.data;
				
			} else if (isObject(r.data)) {
				
				r.data 					 = 	'';
				
				for (var key in properties.data) r.data +=	key + '=' + properties.data[key] + '&';
				
			}
			
			this.currentRequest 		 = 	r;
			this.make();
			
		}
		
	},
	
	//-														
	//-												}		
	//-														
	
	//-														
	//-	make											{	
	//-														
	
	make								 :	function
	
	(	//~	Parameters					
	
		//	None
		
	)	
	
	{	//~	Code						
		
		try {
			
			this.ajax					 =	window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
			
			if (this.currentRequest.url == null)			 	throw this._EMPTY_URL;
			if (!this.ajax)									 	throw this._AJAX_FAIL;
			
			//~~ Keeps reference
			var obj						 =	this;										
			this.ajax.onreadystatechange =	function(){ return obj.xhrProcessor(); };
			
			this.updating				 =	new Date();
			
			if (this.currentRequest.dataType == "POST") {
				
				var url					 =	this.currentRequest.url + '?' + this.updating.getTime();
				
				this.ajax.open("POST", url, true);
				this.ajax.setRequestHeader("X-Requested-With", "XMLHttpRequest");
				this.ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
				this.ajax.send(this.currentRequest.data);
				
			} else if (this.currentRequest.dataType == "FILE") {
			
				var url					 =	this.currentRequest.url + this.updating.getTime();
			
				this.ajax.upload.onprogress = this.ajax.upload.onload = this.ajax.upload.onerror = this.currentRequest.onUploadEvents;
				
				this.ajax.open("POST", url, true);
				this.ajax.setRequestHeader("X-Requested-With", "XMLHttpRequest");
				this.ajax.setRequestHeader("Content-Type", this.currentRequest.data.type);
				this.ajax.setRequestHeader("Content-Length", this.currentRequest.data.fileSize);  
				this.ajax.send(this.currentRequest.data);	
				
			} else {
				
				var url					 =	this.currentRequest.url + '?' + this.currentRequest.data + this.updating.getTime();
				
				this.ajax.open("GET", url, true);
				this.ajax.setRequestHeader("X-Requested-With", "XMLHttpRequest");
				this.ajax.send(null);
			
			}
		
		} catch(e) {
			
			this.currentRequest.onError(e);
			
			return false;
		
		}
		
		return true;
		
	},
	
	//-														
	//-												}		
	//-														
	
	//-														
	//-	xhrProcessor									{	
	//-														
	
	xhrProcessor						 :	function
	
	(	//~	Parameters					
	
		//	None
		
	)	

	{	//~	Code
		
		this.showHideLoadIndicator(true);
		
		if (this.ajax.readyState != 4) 	return;
		
		if (this.ajax.responseText != '') {
			
			// Eval data, and clear the ajax object
			
			var data				 	 =	eval("(" + this.ajax.responseText + ")");
			this.ajax 					 = 	null;
			
			if (this.currentRequest.executeResponse) {
				
				var object 				 =	this.currentRequest.DOMReference;
				
				eval(data.command);
			
			} else {
				
				this.currentRequest.onSuccess(data);
			
			}
			
			this.updating 				 =	false;
			
		}
			
		this.showHideLoadIndicator(false);
		
		return;
		
	},
	
	//-														
	//-												}		
	//-														
	
	//-														
	//-	showHideLoadIndicator							{	
	//-														
	
	showHideLoadIndicator				 :	function
	
	(	//~	Parameters					
		
		show
		
	)
	
	{	//~	Code						
		
		// Set up the loadindicator
		if (!this.loadIndicator) {
			
			this.loadIndicator			 = 	SOAPI.createElement({ parent : document.body , attributes : { id : 'loadIndicator' }});
		
		}
		
		if (show && this.currentRequest.showProgress) {
			
			if(!this.timerOn) {
				
				//~~ Keeps reference
				
				var obj 				 = 	this;
				this.waitForLoad 		 =	setTimeout(function(){ obj.loadIndicator.show(); }, 2500);
				this.timerOn 			 = 	true;
			
			}
			
		} else if(this.timerOn) {
			
			clearTimeout(this.waitForLoad);
			
			this.timerOn 				 =	false;
			this.loadIndicator.hide();
		
		}
	
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
