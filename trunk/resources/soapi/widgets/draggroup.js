//#																														
//#	SOAPI 4.8													Copyright � 2000 - 2009 Dan Williams.					
//#																														

//+																														
//+	SOAPI.DragGroup																									{	
//+(																													
	
	SOAPI.widgets.draggroup				 =	function(p) { new SOAPI.DragGroup(p); };
	
//+																														
	
	SOAPI.DragGroup						 =	SOAPI.Widget.extension();
	
	SOAPI.DragGroup.extend
	
//+)																													

/*(	//~	Documentation					
	///																					
	///		This class provides a DragGroup widget.										
	///																					
)*/

({	//~	Code							
	
	//*														
	//*	Variables										{	
	//*														
	
	wtype								 :	"draggroup",
	
	selectedPosition					 :	null,
	
	inTransition						 :	false,
	
	sendTimer							 :	null,
	
	repositioned					  	 :	false,
	
	url									 :	null,
	
	restrict							 :	null,
	
	dragElements						 :	[ ],
	
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
		var handlers					 =	SOAPI.DragGroup_Handlers;
		
		this.dragElements				 = 	SOAPI.findAllChildElements(w,'*',{},false,999,true);
				
		// Run through all the elements, and add listeners
		
		var ln							 =	this.dragElements.length;
		
		for (i = 0; i < ln; i++) {
			
			var el						 =	new SOAPI.Sprite(this.dragElements[i],true);
			
			el.onselectstart 			 = 	function() { return false; }
			el.unselectable 			 = 	'on';
			el.style.MozUserSelect 		 = 	'none';
			
			el.dragger.enabled 			 = 	true;
			
			SOAPI.Event.addEventHandler(el, 		'mousedown',	handlers.dragEl.mousedown,				'draggroup');
			SOAPI.Event.addEventHandler(el, 		'dragstart',	[this,handlers.dragEl.cloneAndDrag],	'draggroup');
			SOAPI.Event.addEventHandler(el, 		'dragend');
			
			var animator				 =	new SOAPI.Animator(el, "fader");
			
			// Append a confirmation DIV
			
			var confirm					 = 	this.createComponent({
				
				parent					 :	el,
				cType					 :	'confirm'
				
			});
			
			el.confirm 				 	 = 	new SOAPI.Sprite(confirm,true);
			
		}
		
		if (w.hasAttribute("submitUrl")) 	this.url = w.getAttribute("submitUrl");
		
		if (w.hasAttribute("restrictMove") && w.getAttribute("restrictMove") == 'true') {
			
			this.restrict 				 = 	new Object();
			
			this.restrict.left			 = w.get('actualleft');
			this.restrict.right			 = w.get('actuallright');
			this.restrict.top			 = w.get('actualtop');
			this.restrict.bottom		 = w.get('actualtbottom');
			
		}
		
		
		//.											}		
		
		return result;
		
	},
	
	//-														
	//-												}		
	//-														
			
	//-														
	//-	reposition									{		
	//-														
	
	reposition						 	 :	function
	
	(	//~	Parameters					
	
		el
		
	)		
	
	{	//~	Code
		
		var parentEl					 =	el.parentEl;
		var ln							 =	this.dragElements.length
		var x 							 =  SOAPI.Event.x;
		var y 							 = 	SOAPI.Event.y;
		var index 						 = 	this.dragElements.indexOf(parentEl);
		
		var colEl	 					 = 	null;
		var moveNext 					 = 	true;
		
		while (ln--) {
			
			var colx 					 = 	false;
			var coly 					 = 	false;
			
			if (parentEl != this.dragElements[ln]) {
				
				if (x >= this.dragElements[ln].get('actualleft') && x <= this.dragElements[ln].get('actuallright')) colx = true;
				
				if (y >= this.dragElements[ln].get('actualtop') && y <= this.dragElements[ln].get('actualtbottom')) coly = true;
				
				if (colx && coly) {
					
					colEl 				 = 	this.dragElements[ln];
					
					if (index > ln) 		moveNext = false;
					
					break;
				
				}
			
			}
		
		}
		
		if (colEl != null && !this.inTransition) {
			
			var animator 				 =	colEl.animators.fader;
			var ref						 =	this;
			
			this.inTransition	 		 =	true;
			this.repositioned			 =	true;
			
			animator.addAnimation(1,
				{
					opacity 			 : 	SOAPI.Transition.generate([new Array('Linear','In',15)], 100, 	0)
				},
				{
					interval			 :	8,
					repeat			 	 : 	false,
					relative		 	 : 	false,
					direction		  	 : 	1,
					action			 	 :

						[ function(event) {
							
							if (moveNext)	colEl.parentNode.insertAfter(parentEl,colEl);
							else
											colEl.parentNode.insertBefore(parentEl,colEl);
							
							ref.dragElements 	= new Array();
							ref.dragElements 	= SOAPI.findAllChildElements(colEl.parentNode,'*',{},false,999,true);
							
							animator.Play(2);
							
						} ]
						
				});
			
			animator.addAnimation(2,
				{
					opacity 			 : 	SOAPI.Transition.generate([new Array('Linear','In',15)], 0, 	100)
				},
				{
					interval		 	 :	8,
					repeat			 	 : 	false,
					relative		 	 : 	false,
					direction		 	 : 	1,
					action			 	 :
					
						[ function(event) {
							
							ref.inTransition 		 	 = 	false;
							colEl.style.opacity		 	 = 	'';
							colEl.style.MozUserSelect	 = 	'none';
							
						} ]
							
				});
			
			animator.Play(1);
		
		}
				
		return true;
		
	},
	
	//-														
	//-												}		
	//-														
			
	//-														
	//-	send									{		
	//-														
	
	send							 	 :	function
	
	(	//~	Parameters					
	
		el
		
	)		
	
	{	//~	Code
		
		if (this.url != null) {
		
			var ref 					 = 	this;
			
			function sendData() {
				
				var ln 					 =	ref.dragElements.length;
				var data				 =	new Object();
				
				for (var i = 0; i < ln; i++) {
					
					data[i] 			 = 	ref.dragElements[i].getAttribute("elementid");
					
				}
				
				SOAPI.Ajax.request({
					
					url					 :	ref.url,
					dataType		 	 :	'post',
					data			 	 :	data,
					saveState		 	 :	false,
					onSuccess		 	 :	function(){ return ref.onComplete(el); },
					showProgress		 :	false
					
				});
				
				clearTimeout(ref.sendTimer);
				
			};
			
			this.sendTimer 				 = 	setTimeout(sendData,2000);
			
		}
		
	},
	
	//-														
	//-												}		
	//-														
			
	//-														
	//-	onComplete									{		
	//-														
	
	onComplete						 	 :	function
	
	(	//~	Parameters					
	
		el
		
	)		
	
	{	//~	Code
				
		var animator				 	 =	new SOAPI.Animator(el.confirm, "fader");
		var transition 					 = 	new Array();
		var transition 					 = 	transition.concat(SOAPI.Transition.generate([new Array('Sin','In',40)], 0, 100),SOAPI.Transition.generate([new Array('Sin','Out',40)], 100, 0));
		
		animator.addAnimation(1,
			{
				opacity 				 : 	transition
			},
			{
				interval				 :	20,
				repeat				 	 : 	false,
				relative			 	 : 	false,
				direction			  	 : 	1
					
			});
		
		animator.Play(1);
		
		this.repositioned				 =	false;
			
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
	
	SOAPI.DragGroup_Handlers			 =	{
		
		dragEl							 :	{
			
			mousedown					 :	function(event) {
				
				event.stopPropagation();
				event.preventDefault();
				
				return true;
				
			},
			
			cloneAndDrag				 :	function(event) {
				
				event.stopPropagation();
				event.preventDefault();
				
				if (this.sendTimer != null) clearTimeout(this.sendTimer);
				
				// Clone the element
				
				var clone 				 = 	SOAPI.createElement({ type : event.element.nodeName });
				
				for (var attribute in event.element.attributes) {
					
					if (!isNaN(attribute)) {
						
						var attr		 =	event.element.attributes[attribute];
						
						try {
							
							clone.setAttribute(attr.name,attr.value);
						
						} catch(e) {}
						
					}
					
				}
								
				clone 					 = 	new SOAPI.Sprite(clone,true);
				clone.innerHTML			 =	event.element.innerHTML;
				clone.parentEl			 =	event.element;
				clone.draggable 		 = 	true;
				clone.dragger.enabled 	 = 	true;
				
				clone.addClassName('dgElementClone');
				clone.moveTo(event.element.get('actualleft'), event.element.get('actualtop'));
				
				document.body.appendChild(clone);
				
				//~Restrict if required
								
				if (this.restrict) {
					
					clone.dragger.restrict 	 = 	true;
					
					clone.dragger.addRestriction('left',	{ min : this.restrict.left, max : (this.restrict.right - clone.get('width')) });
					clone.dragger.addRestriction('top', 	{ min : this.restrict.top, 	max : (this.restrict.bottom - clone.get('height')) });
					
				}
				
				SOAPI.Event.addEventHandler(clone, 			"mousedown");
				SOAPI.Event.addEventHandler(clone, 			"dragstart");
				SOAPI.Event.addEventHandler(clone, 			"dragend",		[this,SOAPI.DragGroup_Handlers.clone.dragend],	'draggroup');
				SOAPI.Event.addEventHandler(clone, 			"drag",			[this,SOAPI.DragGroup_Handlers.clone.drag],		'draggroup');
						
				// And swap the events over
				
				SOAPI.Event.triggerEvent("dragend", 		event.element);
				SOAPI.Event.triggerEvent("dragstart", 		clone);
				
				event.element.addClassName('holder');
				
				return true;
				
			}
		
		},
		
		clone							 :	{
			
			dragend						 :	function(event) {
				
				if (event.element.parentEl) {
					
					event.element.parentEl.removeClassName('holder');
					
					SOAPI.Event.removeEventHandler(event.element, 	"mousedown");
					SOAPI.Event.removeEventHandler(event.element, 	"dragstart");
					SOAPI.Event.removeEventHandler(event.element, 	"dragend", 		"draggroup");
					SOAPI.Event.removeEventHandler(event.element, 	"drag");
					
					if (this.repositioned)		this.send(event.element.parentEl);
					
					document.body.removeChild(event.element);
				
				}
				
				return true;
				
			},
			
			drag						 :	function(event) {
				
				this.reposition(event.element);
				
				return true;
				
			}
			
		}
		
	};
	
//+																														
//+																												}		
//+																														
