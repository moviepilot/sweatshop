//#																														
//#	SOAPI 4.8													Copyright © 2000 - 2009 Dan Williams.					
//#																														

//+																														
//+	SOAPI.LightBox																									{	
//+(																													
	
	SOAPI.widgets.lightbox				 =	function(p) { new SOAPI.LightBox(p); };
	
//+																														
	
	SOAPI.LightBox						 =	SOAPI.Widget.extension();
	
	SOAPI.LightBox.extend
	
//+)																													

/*(	//~	Documentation					
	///																					
	///		This class provides a Lightbox widget.										
	///																					
)*/

({	//~	Code							
	
	//*														
	//*	Variables										{	
	//*														
	
	wtype								 :	"lightbox",
	ctypes								 :	{ dialog: SOAPI.Dialog },
	
	galleryElements						 :	[ ],
	
	currentElement						 :	0,
	
	parameters							 :	SOAPI.merge(SOAPI.Panel.prototype.parameters, {
		tabindex						 :	0
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
		///					[integer tabindex], [string action]								
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
		///				integer			The widget's tabindex.								
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
		var c							 =	w.components;
		var handlers					 =	SOAPI.LightBox_Handlers;
		
		//.	Dialog element								{	
		
		var dialog						 =	c.dialog		 =	this.createComponent({
			element						 :	p.element,
			parent						 :	w,
			cType						 :	"dialog",
			extras						 :	{ taskbar: "false" }
		});
		
		if (w.hasAttribute("galleryElements")) {
		
			var galleryElements			 =	$C(w.getAttribute("galleryElements"));
			var ln						 =	galleryElements.length;
			
			while (ln--) {
				
				SOAPI.Event.addEventHandler(galleryElements[ln], 	"mousedown", 	[this , handlers.galleryElement.mousedown],	'lightbox');
				
				this.galleryElements.push(galleryElements[ln]);
				
			}
			
			// Add animator
			
			var animator				 =	new SOAPI.Animator(c.dialog.components.window, "resize");
				
			// Add in forward back buttons
			
			var forward					 =	c.forward		 =	this.createComponent({
				parent					 :	c.dialog.components.window,
				cType					 :	'forward'
			});
			
			var back					 =	c.back			 =	this.createComponent({
				parent					 :	c.dialog.components.window,
				cType					 :	'back'
			});
			
			forward.hide();
			back.hide();
						
			SOAPI.Event.addEventHandler(forward,	"mousedown", 	[this , handlers.directionButtons.mousedown],	'lightbox');
			SOAPI.Event.addEventHandler(back, 		"mousedown", 	[this , handlers.directionButtons.mousedown],	'lightbox');
			
			SOAPI.Event.addEventHandler(c.dialog.components.window, 	"mouseover", 	[this , handlers.directionButtons.mouseover],	'lightbox');
			SOAPI.Event.addEventHandler(c.dialog.components.window, 	"mouseout", 	[this , handlers.directionButtons.mouseout],	'lightbox');
			
			if (dialog.components.window.components.icon) 	dialog.components.window.components.icon.hide();
			
		}
		
		//.											}		
		
		return result;
		
	},
			
	//-														
	//-												}		
	//-														
	
	//-														
	//-	displayImage								{		
	//-														
	
	displayImage					 	 :	function
	
	(	//~	Parameters					
	
		//	None
		
	)		
	
	{	//~	Code
	
		if (this.galleryElements[this.currentElement].hasAttribute('lightboxlink')) {
			
			if (!this.components.dialog.isVisible()) this.components.dialog.activate();
			
			var window					 = 	this.components.dialog.components.window;
			var content 				 = 	this.components.dialog.components.window.components.content;
			var animator 				 =	window.animators.resize;
			
			content.innerHTML 			 = 	'';
			
			var left					 =	window.get('actualleft');
			var top						 =	window.get('actualtop');
			var width					 =	window.get('actualwidth');
			var height					 =	window.get('actualheight');
			
			var image 					 = 	new Image();
			image.src 					 = 	this.galleryElements[this.currentElement].getAttribute('lightboxlink');
			
			image.onload 				 = 	function() {
				
				content.appendChild(this);
				this.styleTo('opacity',0);
				
				var toWidth				 =	this.get('clientwidth') 	> document.getClientWidth()  ? document.getClientWidth()  - 10 : this.get('clientwidth');
				var toHeight			 =	this.get('clientheight') 	> document.getClientHeight() ? document.getClientHeight() - 10 : this.get('clientheight');
				
				var toLeft				 = 	(document.getClientWidth()  - toWidth)  / 2;
				var toTop				 =	(document.getClientHeight() - toHeight) / 2;
				
				animator.addAnimation(1,
					{
						left 			 : 	SOAPI.Transition.generate([new Array('Sin','In',20),new Array('Sin','Out',15)], left, 	toLeft),
						top 			 : 	SOAPI.Transition.generate([new Array('Sin','In',20),new Array('Sin','Out',15)], top, 	toTop),
						width 			 : 	SOAPI.Transition.generate([new Array('Sin','In',20),new Array('Sin','Out',15)], width, 	toWidth),
						height 			 : 	SOAPI.Transition.generate([new Array('Sin','In',20),new Array('Sin','Out',15)], height,	toHeight)
					},
					{
						interval		 :	5,
						repeat			 : 	false,
						relative		 : 	false,
						direction		 : 	1,
						action			 :
							[ function(event) {
								
								image.styleTo('opacity',1);
								
							} ]
					});
				
				animator.Play(1);
								
				return true;
			
			};
		
		}
		
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
	
	SOAPI.LightBox_Handlers				 =	{
		
		galleryElement				 	 :	{
			
			mousedown				 	 :	function(event) {
				
				this.currentElement		 =	this.galleryElements.indexOf(event.element);
				this.displayImage();
				
				return true;
				
			}
			
		},
		
		directionButtons				 :	{
			
			mousedown					 :	function(event) {
				
				if (event.element.getAttribute('component') == 'forward')  this.currentElement--;
				else
					this.currentElement++;
					
				if (this.currentElement == this.galleryElements.length) this.currentElement = 0;
				if (this.currentElement == -1) this.currentElement = (this.galleryElements.length - 1);
				
				this.displayImage();
				
				return true;
				
			},
			
			mouseover					 :	function(event) {
				
				this.components.back.show();
				this.components.forward.show();
				
				return true;
			
			},
			
			mouseout					 :	function(event) {
				
				this.components.back.hide();
				this.components.forward.hide();
				
				return true;
				
			}
			
		}
	};
	
//+																														
//+																												}		
//+																														
