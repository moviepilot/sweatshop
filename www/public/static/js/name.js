/**
 * -------------------------------------------------------------------------------- Nodename object
 */

ExtAPI.App.nodename					 	 = 	Class.extend
({
	
	el									 :	null,
	
	h1									 :	null,
	input								 :	null,
	mode								 :	'display',
	
	init								 :	function() {
		
		if ($('#name').length > 0) {
			
			var handlers				 =	ExtAPI.App.nodename.eventHandlers;
			
			this.el						 =	$('#name');
			this.h1						 =	this.el.children();
			
			this.h1.disableSelection();
			
			if (window.currentNode.name != '')		this.h1.text(window.currentNode.name);
			
			this.h1.bind('mousedown',{ 'ref' : this }, handlers.h1.onmousedown);
						
		}		
		
	},
	
	edit							 	 :	function() {
		
		if (this.mode == 'display') {
			
			this.mode					 =	'edit';
			
			var value					 =	this.h1 != undefined ? this.h1.text() : '';		
			var handlers				 =	ExtAPI.App.nodename.eventHandlers;
			
			this.input					 =	$('<input type="text"/>').attr('id','nameInput');
			
			this.el.append(this.input);
			this.input.focus();
			
			this.input.bind('blur',		{ 'ref' : this }, handlers.input.onblur);
			this.input.bind('keyup',	{ 'ref' : this }, handlers.input.onkeyup);
			
			this.setInterface();
			
		}
		
	},
	
	saveInput							 :	function() {
		
		if (this.input.val() && (this.h1.text() != this.input.val())) {
			
			var data					 =	new Object();
			data.name					 =	this.input.val();
			
			var obj						 =	this;
			$.ajax({
			
				url 					 : 	'/nodes/' + window.currentNode._id,
				type					 :	'put',
				data 					 : 	$.toJSON(data),
				complete 				 : 	function(jqXHR) { obj.onComplete(jqXHR); obj = null; },
				contentType				 : 	'application/json'
				
			});
			
			this.mode					 =	'saving';
			this.setInterface();
			
		} else {
			
			this.mode					 =	'display';
			this.setInterface();
			
		}
		
	},
	
	onComplete							 :	function(jqXHR) {
		
		if (jqXHR.statusText == 'success') {
			
			ExtAPI.Feedback.showMessage(ExtAPI.Feedback._MESSAGE,'Node name has been updated');
			
			this.mode					 =	'display';
			
		} else if (jqXHR.statusText == 'error') {
			
			ExtAPI.Feedback.showMessage(ExtAPI.Feedback._ERROR,jqXHR.responseText);
			
			this.mode					 =	'edit';
			
		}
		
		this.setInterface();
		
	},
	
	setInterface						 :	function() {
		
		switch (this.mode) {
			
			case 'saving':
				
				this.input.attr('disabled', 'disabled');
				this.input.addClass('saving');
				
			break;
			
			case 'edit':
				
				this.input.val(this.h1.text());
				this.input.removeAttr('disabled');
				this.input.removeClass('saving');
				this.h1.hide();
				
			break;
			
			case 'display':
				
				this.h1.text(this.input.val());
				
				this.input.unbind();
				this.input.remove();
				
				this.input 			 	=	null;
				
				this.h1.show();
				
			break;
			
		}
		
	},
	
	destroy								 :	function() {
		
		this.h1.unbind();
		
		this.el							 =	null;
		this.h1							 =	null;
		this.input						 =	null;	
		
	}
	
});

ExtAPI.App.nodename.eventHandlers 	 	 = 	{
	
	h1								 	 :	{
		
		onmousedown						 :	function(event) {
			
			var ref						 =	event.data.ref;
			
			ref.edit();
			
			return true;
						
		}		
		
	},
	
	input								 :	{
		
		onblur							 :	function(event)  {
			
			var ref						 =	event.data.ref;
			
			ref.saveInput();	
			
			return true;
		
		},
		
		onkeyup							 :	function(event) {
			
			var ref						 =	event.data.ref;
			
			if (event.keyCode == '13')		ref.saveInput();
			
			return true;
			
		}
		
	}
	
}

