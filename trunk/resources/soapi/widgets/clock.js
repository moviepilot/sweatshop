//#																														
//#	SOAPI 4.8													Copyright © 2000 - 2009 Dan Williams.					
//#																														

//+																														
//+	SOAPI.Clock																										{	
//+(																													
	
	SOAPI.widgets.clock					 =	function(p) { new SOAPI.Clock(p); };
	
//+																														
	
	SOAPI.Clock							 =	SOAPI.Widget.extension();
	
	SOAPI.Clock.extend
	
//+)																													

/*(	//~	Documentation					
	///																					
	///		This class provides a clock widget.											
	///																					
)*/

({	//~	Code							
	
	//*														
	//*	Variables										{	
	//*														
	
	wtype								 :	"clock",
	
	draggable							 :	true,
	
	seconds								 :	true,
	timer								 :	null,
	
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
		var handlers					 =	SOAPI.Clock_Handlers;
	
		//.	Clock container								{	
		
		w.dragger.enabled				 =	true;
		w.oncontextmenu					 =	function() { return false; };
		
		SOAPI.Event.addEventHandler(w, "mousedown", handlers.onMouseDown, "Clock");
		
		//.											}		
		
		return result;
		
	},
	
	//-														
	//-												}		
	//-														
	
	//-														
	//-	configure										{	
	//-														
	
	configure							 :	function
	
	/*(	//~	Documentation				
		///																					
		///		Perform additional configuration.											
		///																					
		///	(	Syntax:																		
		///			void configure( void )													
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Performs additional configuration.										
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
		
		this.displayTime();
		
	},
	
	//-														
	//-												}		
	//-														
	
	pad									 :	function(number, places) {
		
		var str							 =	number.toString();
		
		if (str.length > places)			return number.toPrecision(places);
		
		while (str.length < places)			str				 =	'0' + str;
		
		return str;
		
	},
	
	displayTime							 :	function() {
		
		function timer(clock) {
			return function() { clock.displayTime(); };
		}
		
		var now							 =	new Date();
		var offset						 =	now.getTimezoneOffset();
		var now							 =	new Date(now - (offset * 60 * 1000));
		var hours						 =	this.pad(Math.floor(now.getHours()), 2);
		var minutes						 =	this.pad(Math.floor(now.getMinutes()), 2);
		var seconds						 =	this.pad(Math.floor(now.getSeconds()), 2);
		this.innerHTML					 =	"" + hours + ":" + minutes + ((this.seconds) ? ":" + seconds : "");
		this.timer						 =	setTimeout(timer(this), 500);
		
	}
	
	//*														
	//*												}		
	//*														
	
});

//+																														
//+		Handlers																								}	{	
//+																														
	
	SOAPI.Clock_Handlers				 =	{
		
		onMouseDown						 :	function(event) {
			
			if (SOAPI.Event.button == SOAPI.Event.RIGHT) {
				
				this.seconds			 =	!this.seconds;
				
				event.stopPropagation();
				
				clearTimeout(this.timer);
				
				this.displayTime();
				
			}
			
			return true;
			
		}
		
	};
	
//+																														
//+																												}		
//+																														
