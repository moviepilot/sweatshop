/**
 * -------------------------------------------------------------------------------- Breadcrumb object
 */

ExtAPI.App.breadcrumb				 	 = 	Class.extend
({	
	
	el 									 :	null,
		
	elements							 :	null,
	domref								 :	null,
	
	toDisplay							 :	5,
	
	init							 :	function() {
		
		if ($('#breadcrumb').length > 0) {
			
			this.el						 =	$('#breadcrumb');
			this.elements				 =	new Array();
			this.domref					 =	new Array();
		
		}
		
	},
	
	addId								 :	function(_id,name) {
		
		if (this.el) {
		
			var linkObj					 =	new Object();
			linkObj._id					 =	_id;
			linkObj.name				 =	name;
			
			this.elements.push(linkObj);
			
			if (this.domref.length >= this.toDisplay) this.checkAndReDisplay();
			else
											this.addLink(linkObj);
		
		}
		
	},
	
	addLink								 :	function(obj) {
		
		var handlers					 =	ExtAPI.App.breadcrumb.eventHandlers;
		var link						 =	$("<div />").text(obj.name);
		
		link.bind('mousedown',{
			
			'ref' 						 : 	this,
			'elementsval' 				 : 	obj
			
			}, handlers.link.onmousedown);
		
		this.el.append(link);
		this.domref.push(link);
		
	},
	
	checkAndReDisplay					 : 	function() {
		
		this.destroy();
		
		var ln							 =	this.elements.length;
		var i							 = 	ln - this.toDisplay;
		
		if (i < 0)							i = 0;
		
		for (i; i < ln; i++) {
			
			this.addLink(this.elements[i]);
			
		}
		
	},
	
	resetElements						 :	function(index) {
		
		var elements					 =	this.elements.splice(0,index);
		
		this.elements					 = 	new Array();
		this.elements					 =	elements;
		
		this.checkAndReDisplay();
				
	},
	
	destroy								 :	function() {
		
		var ln 							 =	this.domref.length;
		
		while (ln--) {
			
			this.domref[ln].unbind();
			this.domref[ln].remove();
						
		}
		
		this.domref						 = 	new Array();
		
	}
	
});

ExtAPI.App.breadcrumb.eventHandlers  	 = 	{
	
	link								 :	{
		
		onmousedown						 :	function(event) {
			
			var ref						 =	event.data.ref;
			var elementsval				 =	event.data.elementsval;
			var index 					 =	ref.elements.indexOf(elementsval);
			
			ref.resetElements(index);
			
			ExtAPI.Getnode.update(elementsval._id);
			
			return true;
			
		}
		
	}
	
}


