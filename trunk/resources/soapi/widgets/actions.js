//#																														
//#	SOAPI 4.8													Copyright � 2000 - 2009 Dan Williams.					
//#																														

//+																														
//+	SOAPI.Actions																										{	
//+(																													
	
	SOAPI.widgets.actions				 =	function(p) { new SOAPI.Actions(p); };
	
//+																														
	
	SOAPI.Actions						 =	SOAPI.Widget.extension();
	
	SOAPI.Actions.extend
	
//+)																													

/*(	//~	Documentation					
	///																					
	///		This class provides an actions widget.											
	///																					
)*/

({	//~	Code							
	
	//*														
	//*	Variables										{	
	//*														
	
	wtype								 :	"actions",
	
	actionButtons						 :	null,
	identifier							 :	null,
	menuType							 :	'inline',
	
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
		///					[string text]													
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
		///				string			Text to display.									
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
		var handlers					 =	SOAPI.Actions_Handlers;
		
		if (w.hasAttribute('identifierval')) 	this.identifier 	 = 	w.getAttribute('identifierval');
		if (w.hasAttribute('mtype')) 			this.menuType 		 = 	w.getAttribute('mtype');
		
		var rankings					 =	this.getSetCookie();
		var buttons				 		 = 	SOAPI.findAllChildElements(w,'*',{},false,999,true);
		var ln 							 =	buttons.length;
		var shownum						 =	w.hasAttribute('shownum') ? w.getAttribute('shownum') : 3;
		
		this.actionButtons				 =	new Array();
		
		if (rankings.length != buttons.length) {
			
			rankings					 =	new Array();
			
			for (var i = 0; i < ln; i++)	rankings.push(0);
			
			this.getSetCookie(rankings);
			
		}
		
		var menu						 =	c.menu			 =	this.createComponent({
			element						 :	p.element,
			parent						 :	w,
			cType						 :	"menu"
		});
		
		if (ln > 0) {
			
			for (var i = 0; i < ln; i++) {
				
				var el					 = 	new Object();
				
				el.element 	 			 =	new SOAPI.Sprite(buttons[i],false);
				el.ranking 	 			 =	rankings[i];
				el.element.ref			 =	i;
				
				this.actionButtons.push(el);
				
				w.removeChild(buttons[i]);
				
			}
			
			//~ Sort buttons, then add back to the DOM.
			
			this.sortActionButtons();
			
			for (var i = 0; i < ln; i++) 	{
				
				if (i < shownum && this.menuType == 'inline') {
					
					w.appendChild(this.actionButtons[i].element);
				
				} else if (this.menuType == 'inline') {
				
					menu.appendChild(this.actionButtons[i].element);
					
				}
				
				if (this.menuType == 'dropdown') {
					
					if (i < shownum) w.appendChild(this.actionButtons[i].element.cloneNode(false));
					
					if (this.actionButtons[i].element.title != '') 	this.actionButtons[i].element.innerHTML = this.actionButtons[i].element.title;
										
					menu.appendChild(this.actionButtons[i].element);
				}
				
			}
			
			SOAPI.Event.addEventHandler(w, 'mousedown', [this,handlers.widget.mousedown], 'actions');
			SOAPI.Event.addEventHandler(w, 'mouseover', function(){
				
				var viewportHeight 		 = 	w.offsetParent.get('scrollheight');
				
				menu.show();
				
				if (viewportHeight - (menu.get('actualheight') + w.get('offsettop')) < 0) {
					
					menu.addClassName('above');
					
				} else if(menu.hasClassName('above')) {
				
					menu.removeClassName('above');
				
				}
				
			}, 'actions');
			
			
			SOAPI.Event.addEventHandler(w, 'mouseout', 	function(){ menu.hide(); }, 'actions');
			
			menu.hide();
			
		}
		
		//.											}		
		
		return result;
		
	},
	
	//-														
	//-												}		
	//-														
		
	getSetCookie						 :	function(rankings) {

		var returnedRankings			 =	null;
		
		if (rankings == undefined) {
	
			var cookie					 = 	SOAPI.Cookie.get(this.identifier);
			
			if (cookie != undefined) 		returnedRankings = eval('[' + cookie + ']');
			else
											returnedRankings = new Array();
			
		} else {
			
			returnedRankings			 =	rankings;
			
		}
		
		SOAPI.Cookie.set(this.identifier,returnedRankings.toString(),3600);

		return returnedRankings;
	
	},
	
	//-														
	//-												}		
	//-														
		
	sortActionButtons					 :	function() {
		
		var ln							 =	this.actionButtons.length;
		
		for	(var x = 0; x < ln; x++) {
			
			for (var y = 0; y < (ln - 1); y++) {
				
				if (this.actionButtons[y].ranking < this.actionButtons[y + 1].ranking) {
				
					var temp 				 	 = 	this.actionButtons[y + 1];
					
					this.actionButtons[y + 1]	 = 	this.actionButtons[y];
					this.actionButtons[y] 		 = 	temp;
					
				}
			
			}
		  
		}
		
	},
	
	//-														
	//-												}		
	//-														

	saveClick							 :	function(el) {
		
		var rankings					 =	this.getSetCookie();
		
		rankings[el.ref]				+= 	1;
		
		this.getSetCookie(rankings);
		
	}
	
		
	//*														
	//*												}		
	//*														
	
});

//+																														
//+																												}		
//+																														

//+																														
//+		Handlers																								}	{	
//+																														
	
	SOAPI.Actions_Handlers			 	 =	{
		
		widget							 :	{
			
			mousedown					 :	function(event) {
				
				var target				 =	event.event.srcElement != undefined ? event.event.srcElement : event.event.target;
				
				this.saveClick(target);
				
				return true;					
				
			}
						
		}
	};