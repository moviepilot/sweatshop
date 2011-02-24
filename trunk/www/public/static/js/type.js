/**
 * -------------------------------------------------------------------------------- Nodetype object
 */

ExtAPI.App.nodetype					 	 = 	Class.extend
({
	
	el									 :	null,
	
	mode								 :	'display',
	value								 :	null,
	
	init								 :	function() {
		
		if ($('#type').length > 0) {
			
			var handlers				 =	ExtAPI.App.nodetype.eventHandlers;
			
			this.el						 =	$('#type');
			
			this.value					 = 	window.currentNode.type;
			this.selectOption();
			
			this.el.bind('change', { 'ref' : this }, handlers.el.onchange);
						
		}	
		
	},
	
	selectOption						 :	function() {
		
		this.el.children("option[value='" +  this.value + "']").attr('selected','selected');
		
	},
	
	saveSelect							 :	function() {
		
		var data						 =	new Object();
		data._id						 =	window.currentNode._id;
		data.key				 		 = 	'type';
		data.value						 =	this.el.val();
		
		var obj							 =	this;
		$.ajax({
		
			url 						 : 	'/ajax/',
			type						 :	'post',
			data 						 : 	data,
			success 					 : 	function(data) { obj.onResponse(data) }
			
		});
			
		this.mode						 =	'saving';
		this.setInterface();
		
	},
	
	onResponse							 :	function(response) {
		
		if (response.type == 'message') {
			
			ExtAPI.Feedback.showMessage(ExtAPI.Feedback._MESSAGE,response.message);
			
			this.value					 =	this.el.val();
			
		} else {
		
			ExtAPI.Feedback.showMessage(ExtAPI.Feedback._ERROR,response.message);
			
			this.selectOption();
			
		}
		
		this.mode						 =	'display';
		this.setInterface();
		
	},
	
	setInterface						 :	function() {
		
		switch (this.mode) {
			
			case 'saving':
								
				this.el.attr('disabled', 'disabled');
				this.el.addClass('saving');
				
			break;
			
			case 'display':
				
				this.el.removeAttr('disabled');
				this.el.removeClass('saving');
				
			break;
			
		}
		
	},
	
	destroy								 :	function() {
		
		this.el.unbind();
		
		this.el							 =	null;	
		
	}
	
});

ExtAPI.App.nodetype.eventHandlers 		 = 	{
	
	el 									 :	{
		
		onchange						 :	function(event) {
			
			var ref						 =	event.data.ref;
			
			ref.saveSelect();
			
			return true;
			
		}
		
	}
	
}

