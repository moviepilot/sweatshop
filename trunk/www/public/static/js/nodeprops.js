/**
 * -------------------------------------------------------------------------------- Nodeprops object
 */
ExtAPI.App.nodeprops		 			 = 	SOAPI.Class.extension();

ExtAPI.App.nodeprops.extend
({
	
	el									 :	null,
	
	rows								 :	null,
	rowHolder							 :	null,
	input								 :	null,
	curreEl								 :	null,
	initVal								 :	0,
	
	mode								 :	'display',
	
	construct							 :	function() {
		
		if ($('nodeprops')) {
			
			var handlers				 =	ExtAPI.App.nodeprops.eventHandlers;
			
			this.el						 =	$('nodeprops');
			this.holder					 =	this.el.children[0];
			this.rows					 =	this.el.$C('row');
			
			SOAPI.Event.addEventHandler(this.holder,"onmouseup",[this,handlers.holder.onmouseup],'nodeprops');
								
		}		
		
	},
	
	addProperty						 	 :	function() {
		
		
		
	},
	
	edit								 :	function(element) {
		
		if (this.mode == 'display') {
			
			this.curreEl				 = 	element;
			this.mode					 =	'edit';
					
			this.setInterface();
			
		}
		
	},
	
	removeProperty						 :	function(element) {
		
		this.holder.removeChild(element.parentNode);
		
	},
	
	saveInput							 :	function() {
		
		if (this.input.value != '' && (this.input.value != this.initVal)) {
			
			var data					 =	new Object();
			data._id					 =	window.node._id;
			data.key				 	 = 	'nodeprop';
			data.type					 =	this.curreEl.classNames()[0];
			data.value					 =	this.initVal = this.input.value;
			data.rowid					 = 	this.curreEl.parentNode.getAttribute('rowid')
			
			var obj						 =	this;
			SOAPI.Ajax.request({
					
				url						 :	'/ajax/',
				dataType		 		 :	'post',
				showProgress		 	 :	false,
				data			 		 :	data,
				onSuccess				 :	function(data){ obj.onResponse(data); }
						
				});
			
			this.mode					 =	'saving';
			
		} else {
			
			this.mode					 =	'display';
			
		}
		
		this.setInterface();
		
	},
	
	onResponse							 :	function(response) {
		
		
	},
	
	setInterface						 :	function() {
		
		switch (this.mode) {
			
			case 'saving':
				
				this.input.disabled		 =	true;
				this.input.addClassName('saving');
				
			break;
			
			case 'edit':
				
				var value				 =	this.initVal = this.curreEl.innerHTML;		
				var handlers			 =	ExtAPI.App.nodeprops.eventHandlers;
				
				this.curreEl.innerHTML	 =	'';
				
				this.input				 =	SOAPI.createElement({
					
					type 				 : 	'input',
					parent 				 : 	this.curreEl,
					
					attributes 			 : 	{
						
						value 			 : 	value,
						type 			 : 	'text',
						id				 :	'keyInput'
						
						}
					
					});
				
				this.input.focus();
				
				SOAPI.Event.addEventHandler(this.input,	"blur",		[this,handlers.input.onblur],	'nodeprops');
				SOAPI.Event.addEventHandler(this.input,	"keyup",	[this,handlers.input.onkeyup],	'nodeprops');
				
			break;
			
			case 'display':
				
				SOAPI.Event.removeEventHandler(this.input,"blur",	"nodeprops");
				SOAPI.Event.removeEventHandler(this.input,"keyup",	"nodeprops");
				
				this.curreEl.removeChild(this.input);
								
				this.input				 = 	null;
				this.curreEl.innerHTML 	 =	this.initVal;
				
			break;
			
		}
		
	}
	
});

ExtAPI.App.nodeprops.eventHandlers 		 = 	{
	
	holder								 :	{
		
		onmouseup						 :	function(event) {
			
			if (!event.event.target.hasAttribute('disabled') && this.mode == 'display') {
			
				if (event.event.target.hasClassName('key') || event.event.target.hasClassName('value'))	this.edit(event.event.target);
				
				if (event.event.target.hasClassName('del'))												this.removeProperty(event.event.target);		
				
			}
			
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

