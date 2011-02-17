/**
 * -------------------------------------------------------------------------------- Nodename object
 */
ExtAPI.App.nodename			 			 = 	SOAPI.Class.extension();

ExtAPI.App.nodename.extend
({
	
	el									 :	null,
	
	name								 :	null,
	input								 :	null,
	mode								 :	'display',
	
	construct							 :	function() {
		
		if ($('name')) {
			
			var handlers				 =	ExtAPI.App.nodename.eventHandlers;
			
			this.el						 =	$('name');
			this.name					 = 	this.el.children[0];
			this.name.onselectstart 	 = 	function() { return false; }
			this.name.unselectable 	 	 = 	'on';
			this.name.style.MozUserSelect  =	'none';
			
			if (window.node.name != '')		this.name.innerHTML = window.node.name;
						
			SOAPI.Event.addEventHandler(this.name,"onmouseup",[this,handlers.el.onmouseup],'name');
			
		}		
		
	},
	
	edit							 	 :	function() {
		
		if (this.mode == 'display') {
			
			this.mode					 =	'edit';
			
			var value					 =	this.name != undefined ? this.name.innerHTML : '';		
			var handlers				 =	ExtAPI.App.nodename.eventHandlers;
			
			this.input					 =	SOAPI.createElement({
				
				type 					 : 	'input',
				parent 					 : 	this.el,
				
				attributes 				 : 	{
					
					value 				 : 	value,
					type 				 : 	'text',
					id					 :	'nameInput'
					
					}
				
				});
			
			this.input.focus();
			
			SOAPI.Event.addEventHandler(this.input,	"blur",		[this,handlers.input.onblur],	"name");
			SOAPI.Event.addEventHandler(this.input,	"keyup",	[this,handlers.input.onkeyup],	"name");
			
			this.setInterface();
			
		}
		
	},
	
	saveInput							 :	function() {
		
		if (this.input.value != '' && (this.name.innerHTML != this.input.value)) {
			
			var data					 =	new Object();
			data._id					 =	window.node._id;
			data.key				 	 = 	'name';
			data.value					 =	this.input.value;
					
			var obj						 =	this;
			SOAPI.Ajax.request({
					
				url						 :	'/ajax/',
				dataType		 		 :	'post',
				showProgress		 	 :	false,
				data			 		 :	data,
				onSuccess				 :	function(data){ obj.onResponse(data); }
						
				});
			
			this.mode					 =	'saving';
			this.setInterface();
			
		} else {
			
			this.mode					 =	'display';
			this.setInterface();
			
		}
		
	},
	
	onResponse							 :	function(response) {
		
		if (response.type == 'message') {
			
			ExtAPI.Feedback.showMessage(ExtAPI.Feedback._MESSAGE,response.message);
			
			this.mode					 =	'display';
			
			
		} else	{
				
			ExtAPI.Feedback.showMessage(ExtAPI.Feedback._ERROR,response.message);
			
			this.mode					 =	'edit';
			
		}
		
		this.setInterface();
		
	},
	
	setInterface						 :	function() {
		
		switch (this.mode) {
			
			case 'saving':
				
				this.input.disabled		 =	true;
				this.input.addClassName('saving');
				
			break;
			
			case 'edit':
				
				this.input.value		 =	this.name.innerHTML;
				this.input.disabled		 =	false;
				
				this.input.removeClassName('saving');
				this.name.hide();
				
			break;
			
			case 'display':
				
				this.name.innerHTML		 =	this.input.value;
				
				SOAPI.Event.removeEventHandler(this.input,"blur",	"name");
				SOAPI.Event.removeEventHandler(this.input,"keyup",	"name");
				
				this.el.removeChild(this.input);
				this.input 			 	=	null;
				
				this.name.show();
				
			break;
			
		}
		
	}
	
});

ExtAPI.App.nodename.eventHandlers 	 	 = 	{
	
	el								 	 :	{
		
		onmouseup						 :	function(event) {
			
			this.edit();
			
			return true;
						
		}		
		
	},
	
	input								 :	{
		
		onblur							 :	function(event)  {
			
			this.saveInput();	
			
			return true;
		
		},
		
		onkeyup							 :	function(event) {
			
			if (event.event.keyCode == '13')	this.saveInput();
			
			return true;
			
		}
		
	}
	
}

