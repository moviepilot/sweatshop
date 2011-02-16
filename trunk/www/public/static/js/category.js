/**
 * -------------------------------------------------------------------------------- Category object
 */
ExtAPI.App.category			 			 = 	SOAPI.Class.extension();

ExtAPI.App.category.extend
({
	
	el									 :	null,
	
	mode								 :	'display',
	
	construct							 :	function() {
		
		if ($('category')) {
			
			var handlers				 =	ExtAPI.App.category.eventHandlers;
			
			this.el						 =	$('category');
						
			SOAPI.Event.addEventHandler(this.el,"change",[this,handlers.el.onmouseup],'category');
			
		}		
		
	},
	
	saveSelect							 :	function() {
		
		var data						 =	new Object();
		data._id						 =	window.node._id;
		data.key				 		 = 	'category';
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

ExtAPI.App.category.eventHandlers 		 = 	{
	
	el 									 :	{
		
		onmouseup						 :	function(event) {
			
			this.saveSelect();
			
			return true;
			
		}
		
	}
	
}

