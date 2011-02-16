/**
 * -------------------------------------------------------------------------------- Type object
 */
ExtAPI.App.type			 				 = 	SOAPI.Class.extension();

ExtAPI.App.type.extend
({
	
	el									 :	null,
	
	mode								 :	'display',
	
	construct							 :	function() {
		
		if ($('type')) {
			
			var handlers				 =	ExtAPI.App.type.eventHandlers;
			
			this.el						 =	$('type');
			
			if (window.node.type != '') {
				
				for (var i = 0; i < this.el.options.length; i++) {
					
					if (this.el.options[i].value == window.node.type) this.el.options[i].selected = true;
					
				}
				
			}
						
			SOAPI.Event.addEventHandler(this.el,"change",[this,handlers.el.onmouseup],'type');
			
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
		
	}
	
});

ExtAPI.App.type.eventHandlers 		 = 	{
	
	el 									 :	{
		
		onmouseup						 :	function(event) {
			
			this.saveSelect();
			
			return true;
			
		}
		
	}
	
}

