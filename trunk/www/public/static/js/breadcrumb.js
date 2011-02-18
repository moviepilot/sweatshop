/**
 * -------------------------------------------------------------------------------- Breadcrumb object
 */
ExtAPI.App.breadcrumb		 			 = 	SOAPI.Class.extension();

ExtAPI.App.breadcrumb.extend
({	
	
	el 									 :	null,
		
	ids									 :	null,
	elements							 :	null,
	
	construct							 :	function() {
		
		if ($('breadcrumb')) {
			
			this.el						 =	$('breadcrumb');
			this.ids					 =	new Array();
			this.elements				 =	new Array();
			
		}
		
	},
	
	addId								 :	function(_id,name) {
		
		var link						 =	new Object();
		link._id						 =	_id;
		link.name						 =	name;
		
		this.addLink(link);
		
	},
	
	addLink								 :	function(link) {
		
		if (this.ids.length > 0) {
		
			SOAPI.createElement({
						
				parent 					 : 	this.el,
				content					 :	'>',
				attributes				 :	{ 'class' : 'seperator' }
				
				});	
		
		}
		
		var add							 = 	SOAPI.createElement({
					
			parent 						 : 	this.el,
			content						 :	link.name
			
			
			});	
		
		add._id							 = 	link._id;
		
		var handlers					 =	ExtAPI.App.breadcrumb.eventHandlers;
		
		SOAPI.Event.addEventHandler(add, "mousedown", handlers.el.onmousedown, "breadcrumb");
		
		this.elements.push(add);
		this.ids.push(link);
		
	}
	
});

ExtAPI.App.breadcrumb.eventHandlers  	 = 	{
	
	el								 	 :	{
		
		onmousedown						 :	function(event) {
			
			ExtAPI.Node.getNode(event.element._id);
			
			return true;
			
		}
		
	}
	
}


