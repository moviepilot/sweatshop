/**
 * -------------------------------------------------------------------------------- Nodeprops object
 */

ExtAPI.App.nodeprops				 	 = 	Class.extend
({
	
	holder								 :	null,
	addNew							 	 :	null,
	
	rows								 :	null,
	
	input								 :	null,
	curreEl								 :	null,
	initVal								 :	null,
	keyVal								 :	null,
	
	mode								 :	'display',
	
	proptypes							 :	null,
	
	init 								 :	function() {
		
		if ($('#nodeprops').length > 0) {
			
			var currNode				 =	window.currentNode;
			
			this.holder					 =	$('#nodepropsholder');
			this.addNew					 =	$('#addNewTypes');
			
			this.rows					 =	new Array();
			this.proptypes				 =	['facebook_id','moviemaster_id','permalink'];
			this.initVal				 =	0;
			this.keyVal					 =	'';
			
			//~ Just for demo purposes - should really be some sort of key value type thing so that it's felexible
			
			if (currNode._id)				this.addRow('_id', currNode._id, true);
			
			if (currNode.facebook_ids != undefined && currNode.facebook_ids.length > 0) {
				
				var ln 					=	currNode.facebook_ids.length;
				
				for (var i = 0; i < ln; i++) {
					
					this.addRow('facebook_id',currNode.facebook_ids[i],false);
					
				}
				
			}
			
			if (currNode.moviemaster_id)	this.addRow('moviemaster_id', currNode.moviemaster_id, false);
			if (currNode.permalink)			this.addRow('permalink', currNode.permalink, false);
			
			this.addTypes();
							
		}		
		
	},
	
	addTypes							 :	function() {
		
		//~ This is only to give an idea of how it will work, until we've decided ultimatelly how props will work
		
		var ln							 =	this.proptypes.length;
		var handlers					 =	ExtAPI.App.nodeprops.eventHandlers;
		
		while (ln--) {
			
			var value					 = 	$('<div />').text(this.proptypes[ln]);
			
			value.bind('mousedown',{ ref : this }, handlers.addNew.onmousedown);
			
			this.addNew.append(value);
			
		}
		
	},
	
	addRow						 		 :	function(key,value,protect) {
	
		//~ Remove types that we've already go on load
		
		var handlers				 	 =	ExtAPI.App.nodeprops.eventHandlers;
		var ln							 =	this.proptypes.length;
		
		while (ln--) {
			
			if (this.proptypes[ln] == key && key != 'facebook_id') 	this.proptypes.splice(ln,1);
			
		}
		
		//~ Row
		
		var row							 =	$('<div />').addClass('row');
		
		row.disableSelection();
		
		//~ Key
		
		var keycol						 =	$('<div />').addClass('key');							
		
		keycol.text(key);
		row.append(keycol);
		
		//~ Value
		
		var valcol						 =	$('<div />').addClass('value');	
		
		valcol.text(value);
		row.append(valcol);
		
		//~ Don't add listeners, or del if the row needs to be proteced
		
		if (!protect) {
			
			var delcol					 =	$('<div />').addClass('del');
			
			delcol.text('[x]');
			row.append(delcol);
			
			valcol.bind('mousedown',{ ref : this , keyRef : key }, handlers.value.onmousedown);
			delcol.bind('mousedown',{ ref : this , row : row }, handlers.del.onmousedown);
			
		}
		
		//~ Add the row
		
		this.holder.append(row);
		
		this.rows.push(row);
		
		return row;
		
	},
	
	edit								 :	function(event) {
		
		if (this.mode == 'display') {
			
			this.mode					 =	'edit';
			
			this.curreEl				 = 	$(event.target);
			this.keyVal					 =	event.data.keyRef;
			this.initVal 				 = 	this.curreEl.text();
			
			var handlers				 =	ExtAPI.App.nodeprops.eventHandlers;
			
			this.curreEl.empty();
			
			this.input					 =	$('<input type="text"/>').attr('id','keyInput');
			
			this.curreEl.append(this.input);
			
			this.input.focus();
						
			this.input.bind('blur',		{ 'ref' : this }, handlers.input.onblur);
			this.input.bind('keyup',	{ 'ref' : this }, handlers.input.onkeyup);
			
			this.setInterface();
			
		}
		
	},
	
	removeProperty						 :	function(event) {
		
		var row							 =	event.data.row;
		var target						 =	$(event.target);
		
		var data						 =	new Object();
		data._id						 =	window.currentNode._id;
		data.key				 		 = 	'nodepropremove';
		data.value						 =	row.children('.key').text();
		
		row.remove();
		
		var obj						 =	this;
		$.ajax({
		
			url 					 : 	'/ajax/',
			type					 :	'post',
			data 					 : 	data,
			success 				 : 	function(data) { obj.onResponse(data) }
			
		});
		
	},
	
	saveInput							 :	function() {
		
		if (this.input.val() && (this.input.val() != this.initVal)) {
			
			this.mode					 =	'saving';
			
			var data					 =	new Object();
			data._id					 =	window.currentNode._id;
			data.key				 	 = 	this.keyVal;
			
			if (data.key == 'facebook_id') {
				
				data.value 				 = 	this.getFacebookIds();
				data.key				 =	'facebook_ids';
				
			} else {
				
				data.value 				 = 	this.input.val();
			
			}
			
			var obj						 =	this;
			$.ajax({
			
				url 					 : 	'/ajax/',
				type					 :	'post',
				data 					 : 	data,
				success 				 : 	function(data) { obj.onResponse(data) }
				
			});
			
		} else {
			
			this.mode					 =	'display';
			
		}
		
		this.setInterface();
		
	},
	
	onResponse							 :	function(response) {
		
		if (response.type == 'message') {
			
			ExtAPI.Feedback.showMessage(ExtAPI.Feedback._MESSAGE,response.message);
			
			this.mode					 =	'display';
			this.initVal				 = 	this.input == null ? 0 : this.input.val();
			
		} else	{
				
			ExtAPI.Feedback.showMessage(ExtAPI.Feedback._ERROR,response.message);
			
			this.mode					 =	'edit';
			
		}
		
		this.setInterface();
		
	},
	
	getFacebookIds						 :	function() {
		
		var facebookIds					 =	new Array();						
		
		for (var i = 0; i < this.rows.length; i++) {
			
			var key						 =	this.rows[i].children('.key').text();
			
			if (key == 'facebook_id') {
				
				if (this.rows[i][0] == this.curreEl.parent()[0])	facebookIds.push(this.input.val());
				else
																	facebookIds.push(this.rows[i].children('.value').text());
				
			}
			
		}
		
		return facebookIds.toString();
		
	},
	
	
	setInterface						 :	function() {
		
		switch (this.mode) {
			
			case 'saving':
				
				this.input.attr('disabled', 'disabled');
				this.input.addClass('saving');
				
			break;
			
			case 'edit':
				
				this.input.val(this.initVal);
				this.input.removeAttr('disabled');
				this.input.removeClass('saving');
				
			break;
			
			case 'display':
				
				if (this.input != null) {
				
					this.input.unbind();
					this.input.remove();
									
					this.curreEl.text(this.initVal);
				
				}
				
			break;
			
		}
		
	},
	
	destroy								 :	function() {
		
		this.addNew.children().unbind();
		this.addNew.children().remove();
				
		var ln							 =	this.rows.length;
		
		while (ln--) {
			
			this.rows[ln].children().unbind();
			this.rows[ln].empty();
			this.rows[ln].remove();
			this.rows[ln]				 =	null;
						
		}
		
		this.rows						 =	null;
		this.holder						 =	null;
		this.input						 =	null;
		this.curreEl					 =	null;
		this.initVal					 =	null;
		this.keyVal						 =	null;
		
	}
	
});

ExtAPI.App.nodeprops.eventHandlers 		 = 	{
	
	value								 :	{
		
		onmousedown						 :	function(event) {
			
			var ref 					 =	event.data.ref;
			
			ref.edit(event);
			
			return true;		
			
		}		
		
	},
	
	del									 :	{
		
		onmousedown						 :	function(event) {
			
			var ref 					 =	event.data.ref;
			
			ref.removeProperty(event);
						
			return true;		
			
		}		
		
	},
	
	input								 :	{
		
		onblur							 :	function(event)  {
			
			var ref 					 =	event.data.ref;
			
			ref.saveInput();	
			
			return true;
		
		},
		
		onkeyup							 :	function(event) {
			
			var ref 					 =	event.data.ref;
			
			if (event.keyCode == '13')	ref.saveInput();
			
			return true;
			
		}
		
	},
	
	addNew								 :	{
		
		onmousedown						 :	function(event) {
			
			var target					 =	$(event.target);
			var ref 					 =	event.data.ref;
			
			ref.addRow(target.text(),'enter value...',false);
			
			if (target.text() != 'facebook_id')	target.remove();
			
			return true;		
			
		}		
		
	}
	
}

