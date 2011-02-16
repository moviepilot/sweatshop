//#																														
//#	SOAPI 4.8													Copyright © 2000 - 2009 Dan Williams.					
//#																														

//+																														
//+	SOAPI.Tabstrip																									{	
//+(																													
	
	SOAPI.widgets.tabstrip				 =	function(p) { new SOAPI.Tabstrip(p); };
	
//+																														
	
	SOAPI.Tabstrip						 =	SOAPI.Panel.extension();
	
	SOAPI.Tabstrip.extend
	
//+)																													

/*(	//~	Documentation					
	///																					
	///		This class provides a tabstrip widget.										
	///																					
)*/

({	//~	Code							
	
	//*														
	//*	Variables										{	
	//*														
	
	wtype								 :	"tabstrip",
	ctypes								 :	{ tabbar: SOAPI.Scrollbox, tab: SOAPI.Button, content: SOAPI.Panel },
	
	currentTab							 :	null,
	
	parameters							 :	SOAPI.merge(SOAPI.Panel.prototype.parameters, {
		tabbar							 :	"top"
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
		///					...inherited from Panel...										
		///					[string tabbar]													
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
		///				string			The tabbar position.								
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
		var c							 =	w.components;
		var handlers					 =	SOAPI.Tabstrip_Handlers;
		
		//.	Tabstrip content							{	
		
		var content						 =	c.content		 =	this.createComponent({
			element						 :	p.element,
			parent						 :	w,
			cType						 :	"content"
		});
		
		content.components				 =	c				 =	{};
		
		//.	Tabstrip tabsheets						}	{	
		
		var tabsheets					 =	c.tabsheets		 =	this.createComponents({
			element						 :	content,
			parent						 :	content,
			widget						 :	w,
			cType						 :	"tabsheet",
			extras						 :	{ "default": false }
		}, true);
		var i							 =	tabsheets.length;
		
		while (i--) {
			
			var tabsheet				 =	tabsheets[i];
			
			if (tabsheet.getAttribute("default") != "false") {
				
				w.currentTab			 =	i;
				
			}
			
			tabsheet.hide();
			
		}
		
		if (w.currentTab == null && tabsheets.length) {
			
			w.currentTab				 =	0;
			
		}
		
		c								 =	w.components;
		
		//.	Tabstrip tabbar							}	{	
		
		var tabbar						 =	c.tabbar		 =	this.createComponent({
			element						 :	p.element,
			parent						 :	w,
			cType						 :	"tabbar"
		});
		
		tabbar.components				 =	c				 =	tabbar.components || {};
		
		//.	Tabstrip tabs							}	{	
		
		var tabs						 =	c.tabs			 =	this.createComponents({
			element						 :	tabbar,
			parent						 :	tabbar,
			widget						 :	w,
			cType						 :	"tab",
			recurse						 :	true
		});
		var i							 =	tabs.length;
		
		while (i--) {
			
			var tab						 =	tabs[i];
			
			tab.setAttribute("active", false);
			
			tab.number					 =	i;
			
			SOAPI.Event.addEventHandler(tab, "mousedown", handlers.tab.onMouseDown, "Tabstrip");
			
		}
		
		//.											}		
		
		if (isNumber(w.currentTab) && tabs.length) {
			
			tabsheets[w.currentTab].show();
			tabs[w.currentTab].setAttribute("active", true);
			
		}
		
		return result;
		
	}
	
	//-														
	//-												}		
	//-														
	
	//*														
	//*												}		
	//*														
	
});

//+																														
//+		Handlers																								}	{	
//+																														
	
	SOAPI.Tabstrip_Handlers				 =	{
		
		tab								 :	{
			
			onMouseDown					 :	function(event) {
				
				var tabstrip			 =	this.parentWidget;
				var tabsheets			 =	tabstrip.components.content.components.tabsheets;
				var tabs				 =	tabstrip.components.tabbar.components.tabs;
				
				if (tabsheets[this.number]) {
					
					if (isNumber(tabstrip.currentTab)) {
						
						tabsheets[tabstrip.currentTab].hide();
						tabs[tabstrip.currentTab].setAttribute("active", false);
						
					}
					
					tabsheets[this.number].show();
					tabs[this.number].setAttribute("active", true);
					
					tabstrip.currentTab	 =	this.number;
					
					if (!tabsheets[this.number].builtsubs)		SOAPI.buildWidgets(tabsheets[this.number])
					
				}
				
				return true;
				
			}
			
		}
		
	};
	
//+																														
//+																												}		
//+																														
