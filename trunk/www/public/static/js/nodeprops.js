/**
 * -------------------------------------------------------------------------------- Nodeprops object
 */
ExtAPI.App.nodeprops		 			 = 	SOAPI.Class.extension();

ExtAPI.App.nodeprops.extend
({
	
	el									 :	null,
	
	rows								 :	null,
	holder								 :	null,
	input								 :	null,
	curreEl								 :	null,
	initVal								 :	0,
	
	mode								 :	'display',
	
	construct							 :	function() {
		
		if ($('nodeprops')) {
			
			var handlers				 =	ExtAPI.App.nodeprops.eventHandlers;
			
			this.el						 =	$('nodeprops');
			this.holder					 =	this.el.children[0];
			this.rows					 =	new Array();
			
			//~ Just for demo purposes - should really be some sort of key value type thing so that it's felexible
		
			if (window.node._id)			this.addRow('_id',				window.node._id,			true,false);
	
			if (window.node.facebook_ids != undefined && window.node.facebook_ids.length > 0) {
				
				for (var i = 0; i < window.node.facebook_ids.length; i++) {
					
					this.addRow('facebook_id',window.node.facebook_ids[i],false,true);
					
				}
				
			}
			
			if (window.node.moviemaster_id)	this.addRow('moviemaster_id',	window.node.moviemaster_id,	false,true);
			if (window.node.permalink)		this.addRow('permalink',		window.node.permalink,		false,true);
			
			SOAPI.Event.addEventHandler(this.holder,	"onmouseup",		[this,handlers.holder.onmouseup],'nodeprops');
								
		}		
		
	},
	
	
	
	addRow						 		 :	function(key,value,protect,del) {
		
		//~ Row
		
		var row							 =	SOAPI.createElement({
					
			parent 				 	 	 : 	this.holder,
			attributes 			 	 	 : 	{
				
				'class'			 	 	 : 	'row'
								
				}
			
			});
		
		// ~ Key

		SOAPI.createElement({
					
			parent 						 : 	row,
			content						 :	key,
			attributes 					 : 	{
				
				'class'					 : 	'key',
				'disabled'				 :	protect
				
				}
			
			});
		
		//~ Value
		
		SOAPI.createElement({
					
			parent 						 : 	row,
			content						 :	value,
			attributes 					 : 	{
				
				'class'					 : 	'value',
				'disabled'				 :	protect
				
				}
			
			});
		
		//~ Del button
		
		if (del) {
			
			SOAPI.createElement({
					
				parent 					 : 	row,
				content					 :	'[x]',
				attributes 				 : 	{
				
					'class'				 : 	'del',
					'disabled'			 :	false
					
					}
				
				});
			
		}
		
		this.rows.push(row);
				
	},
	
	edit								 :	function(element) {
		
		if (this.mode == 'display') {
			
			this.curreEl				 = 	element;
			this.mode					 =	'edit';
			
			var value					 =	this.initVal = element.innerHTML;		
			var handlers				 =	ExtAPI.App.nodeprops.eventHandlers;
			
			this.curreEl.innerHTML		 =	'';
				
			this.input					 =	SOAPI.createElement({
			
			type 						 : 	'input',
			parent 						 : 	element,
				
			attributes 					 : 	{
						
				value 					 : 	value,
				type 					 : 	'text',
				id						 :	'keyInput'
				
				}
			
			});
			
			this.input.focus();
			
			SOAPI.Event.addEventHandler(this.input,	"blur",		[this,handlers.input.onblur],	'nodeprops');
			SOAPI.Event.addEventHandler(this.input,	"keyup",	[this,handlers.input.onkeyup],	'nodeprops');
						
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
			data.key				 	 = 	this.curreEl.parentNode.children[0].innerHTML;
			
			if (data.key == 'facebook_id') {
				
				data.value 				 = 	this.getFacebookIds();
				data.key				 =	'facebook_ids';
				
			} else {
				
				data.value 				 = 	this.input.value;
			
			}
			
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
		
		if (response.type == 'message') {
			
			ExtAPI.Feedback.showMessage(ExtAPI.Feedback._MESSAGE,response.message);
			
			this.mode					 =	'display';
			this.initVal				 = 	this.input.value;
			
		} else	{
				
			ExtAPI.Feedback.showMessage(ExtAPI.Feedback._ERROR,response.message);
			
			this.mode					 =	'edit';
			
		}
		
		this.setInterface();
		
	},
	
	getFacebookIds						 :	function() {
		
		var facebookIds					 =	new Array();						
		
		for (var i = 0; i < this.rows.length; i++) {
			
			var key						 =	this.rows[i].children[0].innerHTML;
			
			if (key == 'facebook_id') {
				
				if (!this.rows[i].contains(this.curreEl))	facebookIds.push(this.rows[i].children[1].innerHTML);	
				else
															facebookIds.push(this.input.value);
				
			}
			
		}
		
		return facebookIds;
		
	},
	
	
	setInterface						 :	function() {
		
		switch (this.mode) {
			
			case 'saving':
				
				this.input.disabled		 =	true;
				this.input.addClassName('saving');
				
			break;
			
			case 'edit':
				
				this.input.value		 =	this.initVal;
				this.input.disabled		 =	false;
				
				this.input.removeClassName('saving');
				
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
			
			if (event.event.target.getAttribute('disabled') == 'false' && this.mode == 'display') {
			
				if (event.event.target.hasClassName('value'))	this.edit(event.event.target);
				
				if (event.event.target.hasClassName('del'))		this.removeProperty(event.event.target);
				
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

