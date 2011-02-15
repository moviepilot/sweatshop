/**
 * -------------------------------------------------------------------------------- Title object
 */
ExtAPI.App.title			 			 = 	SOAPI.Class.extension();

ExtAPI.App.title.extend
({
	
	el									 :	null,
	
	title								 :	null,
	input								 :	null,
	mode								 :	'display',
	
	construct							 :	function() {
		
		if ($('title')) {
			
			var handlers				 =	ExtAPI.App.title.eventHandlers;
			
			this.el						 =	$('title');
						
			this.title					 = 	this.el.children[0];
			this.title.onselectstart 	 = 	function() { return false; }
			this.title.unselectable 	 = 	'on';
			this.title.style.MozUserSelect  =	'none';
			
			SOAPI.Event.addEventHandler(this.el,"onmouseup",[this,handlers.el.onmouseup],'title');
			
		}		
		
	},
	
	createInput						 	 :	function() {
		
		if (this.mode == 'display') {
			
			this.mode					 =	'edit';
			this.setInterface();
			
			var value					 =	this.title != undefined ? this.title.innerHTML : '';		
			var handlers				 =	ExtAPI.App.title.eventHandlers;
			
			this.input					 =	SOAPI.createElement({
				
				type 					 : 	'input',
				parent 					 : 	this.el,
				
				attributes 				 : 	{
					
					value 				 : 	value,
					type 				 : 	'text',
					id					 :	'titleInput'
					
					}
				
				});
			
			this.input.focus();
			
			SOAPI.Event.addEventHandler(this.input,	"blur",		[this,handlers.input.onblur],	'title');
			SOAPI.Event.addEventHandler(this.input,	"keyup",	[this,handlers.input.onkeyup],	'title');
			
		}
		
	},
	
	saveInput							 :	function() {
		
		if (this.input.value != '' && (this.title.innerHTML != this.input.value)) {
			
			var data					 =	new Object();
			data._id					 =	window.node._id;
			data.key				 	 = 	'name';
			data.value					 =	this.title.innerHTML = this.input.value;
					
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
				
				this.title.hide();
				
			break;
			
			case 'display':
				
				this.el.removeChild(this.input);
				this.input 			 	=	null;
					
				this.title.show();
				
			break;
			
		}
		
	}
	
});

ExtAPI.App.title.eventHandlers 		 	 = 	{
	
	el								 	 :	{
		
		onmouseup						 :	function(event) {
			
			this.createInput();
			
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

