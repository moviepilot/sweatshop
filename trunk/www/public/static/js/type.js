/**
 * -------------------------------------------------------------------------------- Nodetype object
 */
ExtAPI.App.nodetype			 			 = 	SOAPI.Class.extension();

ExtAPI.App.nodetype.extend
({
	
	el									 :	null,
	
	mode								 :	'display',
	
	construct							 :	function() {
		
		if ($('type')) {
			
			var handlers				 =	ExtAPI.App.nodetype.eventHandlers;
			
			this.el						 =	$('type');
			
			if (window.node.type != '') {
				
				for (var i = 0; i < this.el.options.length; i++) {
					
					if (this.el.options[i].value == window.node.type) this.el.options[i].selected = true;
					
				}
				
			}
						
			SOAPI.Event.addEventHandler(this.el,"change",[this,handlers.el.onmouseup],'nodetype');
			
		}		
		
	},
	
	saveSelect							 :	function() {
		
		var data						 =	new Object();
		data._id						 =	window.node._id;
		data.key				 		 = 	'type';
		data.value						 =	this.el.value;
				
		var obj							 =	this;
		SOAPI.Ajax.request({
				
			url							 :	'/ajax/',
			dataType		 			 :	'post',
			showProgress		 		 :	false,
			data			 			 :	data,
			onSuccess					 :	function(data){ obj.onResponse(data); }
					
			});
		
		this.mode						 =	'saving';
		this.setInterface();
		
	},
	
	onResponse							 :	function(response) {
		
		if (response.type == 'message') 	ExtAPI.Feedback.showMessage(ExtAPI.Feedback._MESSAGE,response.message);
		else
											ExtAPI.Feedback.showMessage(ExtAPI.Feedback._ERROR,response.message);
		
		this.mode						 =	'display';
		this.setInterface();
		
	},
	
	setInterface						 :	function() {
		
		switch (this.mode) {
			
			case 'saving':
								
				this.el.disabled 		 =	true;
				this.el.addClassName('saving');
				
			break;
			
			case 'display':
				
				this.el.disabled 		 =	false;
				this.el.removeClassName('saving');
				
			break;
			
		}
		
	},
	
	destroy								 :	function() {
		
		SOAPI.Event.removeEventHandler(this.el,"change",'nodetype');
		
		this.el							 =	null;	
		
	}
	
});

ExtAPI.App.nodetype.eventHandlers 		 = 	{
	
	el 									 :	{
		
		onmouseup						 :	function(event) {
			
			this.saveSelect();
			
			return true;
			
		}
		
	}
	
}

