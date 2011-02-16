//#																														
//#	SOAPI 4.8													Copyright © 2000 - 2009 Dan Williams.					
//#																														

//+																														
//+	SOAPI.Form																										{	
//+(																													
	
	SOAPI.Events.response				 =	[ "onResponse"		];
	SOAPI.Events.onResponse				 =	function(event) { return true };
	
//+																														
	
	SOAPI.widgets.form					 =	function(p) { new SOAPI.Form(p); };
	
//+																														
	
	SOAPI.Form							 =	SOAPI.Widget.extension();
	
	SOAPI.Form.extend
	
//+)																													

/*(	//~	Documentation					
	///																					
	///		This class provides a form widget.											
	///																					
)*/

({	//~	Code							
	
	//*														
	//*	Variables										{	
	//*														
	
	wtype								 :	"form",
//	method								 :	"GET",
	mimetype							 :	"text/html",
	
	elementType							 :	"form",			///		What element type to use for the widget				
	
	parameters							 :	SOAPI.merge(SOAPI.Widget.prototype.parameters, {
		url								 :	"",
		method							 :	"",
		action							 :	""
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
		///					[string url], [string method], [string action]					
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
		///				string			The URL to use.										
		///				string			The form method.									
		///				string			An action to perform.								
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
	//	var c							 =	w.components;
	//	var handlers					 =	SOAPI.Form_Handlers;
		
		SOAPI.Event.addEventHandler(w, "response");
		
		if (w.hasAttribute("onresponse")) {
			
			eval("var func = function(event) {" + w.getAttribute("onresponse") + "}");
			SOAPI.Event.addEventHandler(w, "response", func, "Attribute");
			w.removeAttribute("onresponse");
			
		}
		
		return result;
		
	},
	
	//-														
	//-												}		
	//-														
	
	submit								 :	function(object) {
		
		this.request(this.gather(), object);
		
	},
	
	gather								 :	function() {
		
		var data						 =	[];
		var elements					 =	[];
		var inputs						 =	this.getElementsByTagName("input");
		var textareas					 =	this.getElementsByTagName("textarea");
		
		for (var i = 0, e; (e = inputs[i])    != null; i++)		elements.push(e);
		for (var i = 0, e; (e = textareas[i]) != null; i++)		elements.push(e);
		
		for (var i = 0, e; (e = elements[i]) != null; i++) {
			
			if (isComponent(e) && !SOAPI.findParentWidget(e).built)					continue;
			if (e.name == "" || (e.name.indexOf("[") !== false && e.value == ""))	continue;
			
			data.push(e.name + "=" + encodeURIComponent(e.value));
			
		}
		
		var textareas					 =	SOAPI.findAllChildWidgets(this, "textarea", "div", true);
		
		for (var i = 0, e; (e = textareas[i]) != null; i++) {
			
			if (!e.built || !e.hasAttribute("name"))			continue;
			
			data.push(e.getAttribute("name") + "=" + encodeURIComponent(e.getValue()));
			
		}
		
		return data.join("&");
		
	},
	request								 :	function(data, object) {
		
		function xhrProcessor(form, xhr, object) {
			return function() {
				if (xhr.readyState != 4)	return;
				if (xhr.status != 200)		return alert("There was a problem with the request.");
				SOAPI.Event.triggerEvent("response", form, { data: xhr.responseText, object: object });
			};
		}
		
		var xhr							 =	new XMLHttpRequest();
		
		if (xhr.overrideMimeType)			xhr.overrideMimeType(this.mimetype);
		
		xhr.onreadystatechange			 =	xhrProcessor(this, xhr, object || this);
		xhr.open(this.getAttribute("method"), this.getAttribute("url"), true);
		
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
		xhr.setRequestHeader("Content-length", data.length);
		xhr.setRequestHeader("Connection", "close");
		
		xhr.send(data);
		
	}
	
	//*														
	//*												}		
	//*														
	
});

//+																														
//+																												}		
//+																														
