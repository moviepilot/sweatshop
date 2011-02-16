//#																														
//#	SOAPI 4.8													Copyright © 2000 - 2009 Dan Williams.					
//#																														

//+																														
//+	SOAPI.Desktop																									{	
//+(																													
	
	SOAPI.widgets.desktop				 =	function(p) { new SOAPI.Desktop(p); };
	
//+																														
	
	SOAPI.Desktop						 =	SOAPI.Widget.extension();
	
	SOAPI.Desktop.extend
	
//+)																													

/*(	//~	Documentation					
	///																					
	///		This class provides a desktop widget.										
	///																					
)*/

({	//~	Code							
	
	//*														
	//*	Variables										{	
	//*														
	
	wtype								 :	"desktop",
	
	ctypes								 :	{ taskbar: SOAPI.Panel },
	
	parameters							 :	SOAPI.merge(SOAPI.Widget.prototype.parameters, {
		taskbar							 :	"top"
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
		///					[string taskbar]												
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
		///				string			The taskbar position.								
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
	//	var handlers					 =	SOAPI.Desktop_Handlers;
		
		//.	Desktop workspace							{	
		
		var workspace					 =	c.workspace		 =	this.createComponent({
			element						 :	p.element,
			parent						 :	w,
			cType						 :	"workspace"
		}, true);
		
		//.	Desktop taskbar							}	{	
		
		var taskbar						 =	c.taskbar		 =	this.createComponent({
			element						 :	p.element,
			parent						 :	w,
			cType						 :	"taskbar"
		});
		
		var c							 =	taskbar.components;
		
		var content						 =	c.content		 =	this.createComponent({
			element						 :	taskbar,
			parent						 :	taskbar,
			cType						 :	"content"
		}, true);
		
		//.	Extra pieces							}	{	
		
		if (p.pieces & 4096) {
			
			var c						 =	w.components;
			
			var wallpaper				 =	c.wallpaper		 =	this.createComponent({
				element					 :	p.element,
				parent					 :	w,
				cType					 :	"wallpaper"
			});
			
			if (p.pieces & 8192) {
				
				wallpaper.components	 =	c				 =	{};
				
				c.filler				 =	this.createComponent({
					element				 :	wallpaper,
					parent				 :	wallpaper,
					widget				 :	w,
					cType				 :	"filler",
					eType				 :	"img"
				});
				
			}
			
		}
		
		if (p.pieces & 16384) {
			
			var c						 =	w.components;
			
			var overlay					 =	c.overlay		 =	this.createComponent({
				element					 :	p.element,
				parent					 :	w,
				cType					 :	"overlay"
			});
			
			if (p.pieces & 32768) {
				
				overlay.components		 =	c				 =	{};
				
				c.filler				 =	this.createComponent({
					element				 :	overlay,
					parent				 :	overlay,
					widget				 :	w,
					cType				 :	"filler",
					eType				 :	"img"
				});
				
			}
			
		}
		
		if (p.pieces & 65536) {
			
			var c						 =	w.components;
			
			var logo					 =	c.logo			 =	this.createComponent({
				element					 :	p.element,
				parent					 :	w,
				cType					 :	"logo"
			});
			
			if (p.pieces & 131072) {
				
				logo.components			 =	c				 =	{};
				
				c.filler				 =	this.createComponent({
					element				 :	logo,
					parent				 :	logo,
					widget				 :	w,
					cType				 :	"filler",
					eType				 :	"img"
				});
				
			}
			
		}
		
		//.											}		
		
		return result;
		
	},
	
	//-														
	//-												}		
	//-														
	
	recalculateWorkspace				 :	function() {
		
		var taskbar						 =	this.components.taskbar;
		var workspace					 =	this.components.workspace;
		var position					 =	this.getAttribute("taskbar");
		var size						 =	(position == "top" || position == "bottom")
			?	taskbar.get("ActualHeight")
			:	taskbar.get("ActualWidth")
		;
		
		workspace.styleTo({ top: 0, bottom: 0, left: 0, right: 0 });
		workspace.styleTo(position, size);
		
	}
	
	//*														
	//*												}		
	//*														
	
});

//+																														
//+																												}		
//+																														
