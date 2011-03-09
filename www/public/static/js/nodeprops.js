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
	
	helper								 :	null,
	facebookIDs							 :	null,
	
	mode								 :	'display',
	
	proptypes							 :	null,
	
	init 								 :	function() {
		
		if ($('#nodeprops').length > 0) {
			
			var currNode				 =	window.currentNode;
			
			this.holder					 =	$('#nodepropsholder');
			this.addNew					 =	$('#addNewTypes');
			
			this.rows					 =	new Array();
			this.proptypes				 = 	{
				
				facebook_id				 :	false,
				moviemaster_id			 :	false,
				permalink				 :	false
				
			}
			
			//~ Just for demo purposes - should really be some sort of key value type thing so that it's felexible
			
			if (currNode._id)				this.addRow('_id', currNode._id, true);
			
			if (currNode.facebook_ids != undefined && currNode.facebook_ids.length > 0) {
				
				var ln 					=	currNode.facebook_ids.length;
				
				for (var i = 0; i < ln; i++) {
					
					this.addRow('facebook_id',currNode.facebook_ids[i],false);
					
				}
				
				this.resolveFacebookIds();
				
			}
			
			if (currNode.moviemaster_id)	this.addRow('moviemaster_id', currNode.moviemaster_id, false);
			if (currNode.permalink)			this.addRow('permalink', currNode.permalink, false);
			
			this.addTypes();
							
		}		
		
	},
	
	addTypes							 :	function() {
		
		this.addNew.children().unbind();
		this.addNew.children().remove();
		
		var handlers					 =	ExtAPI.App.nodeprops.eventHandlers;
		
		for (var ptype in this.proptypes) {
			
			if (!this.proptypes[ptype] || ptype == 'facebook_id') {
				
				var value					 = 	$('<div />').text(ptype);
				
				value.bind('mousedown',{ ref : this }, handlers.addNew.onmousedown);
				
				this.addNew.append(value);
				
			}			
			
		}
		
	},
	
	addRow						 		 :	function(key,value,protect) {
	
		//~ Remove types that we've already go on load
		
		this.proptypes[key]				 = true;
		
		var handlers				 	 =	ExtAPI.App.nodeprops.eventHandlers;
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
		
		if (key == 'facebook_id') 			valcol.attr('title','Click to view link');
		
		//~ Don't add listeners, or del if the row needs to be proteced
		
		if (!protect) {
			
			var delcol					 =	$('<div />').addClass('del');
			
			delcol.text('[x]');
			row.append(delcol);
			
			valcol.bind('mousedown', { ref : this , keyRef : key }, handlers.value.onmousedown);
			delcol.bind('mousedown', { ref : this , row : row }, 	handlers.del.onmousedown);
			
		}
		
		//~ Add the row
		
		this.holder.append(row);
		
		this.rows.push(row);
		
		return row;
		
	},
	
	edit								 :	function(event) {
		
		if (this.mode == 'display') {
			
			var keyVal					 =	event.data.keyRef;
			var initVal					 =	$(event.target).text();
			
			if (keyVal == 'facebook_id') {
				
				if (this.facebookIDs[initVal] != undefined && this.facebookIDs[initVal].link) {
					
					window.open(this.facebookIDs[initVal].link,'_new');
					
				} else {
					
					ExtAPI.Feedback.showMessage(ExtAPI.Feedback._ERROR,'No link associated with that ID');
					
				}
				
			} else {
			
				this.curreEl			 = 	$(event.target);
				this.keyVal				 =	keyVal;
				this.initVal 			 = 	initVal;
				this.mode				 =	'edit';
				
				var handlers			 =	ExtAPI.App.nodeprops.eventHandlers;
				
				this.curreEl.empty();
				
				this.input				 =	$('<input type="text"/>').attr('id','keyInput');
				
				this.curreEl.append(this.input);
				
				var obj						 =	this;
				var timeout					 =	null;
			
				timeout						 =	setTimeout(function(){ obj.input.focus(); clearTimeout(timeout); },1);
										
				this.input.bind('blur',		{ 'ref' : this }, handlers.input.onblur);
				this.input.bind('keyup',	{ 'ref' : this }, handlers.input.onkeyup);
				
				this.setInterface();
				
			}
			
		}
		
	},
	
	removeProperty						 :	function(event) {
		
		var row							 =	event.data.row;
		var target						 =	$(event.target);
		
		var data						 =	new Object();
		var key							 =	row.children('.key').text();
			
		this.rows.splice(this.rows.indexOf(row),1);
		
		row.remove();
		
		if (key == 'facebook_id') {
				
			data['facebook_ids']		 = 	this.getFacebookIds();
			
		} else {
			
			data[key] 					 = 	'';
		
		}
		
		var obj							 =	this;
		$.ajax({
		
			url 						 : 	'/nodes/' + window.currentNode._id,
			type						 :	'put',
			data 						 : 	$.toJSON(data),
			complete 					 : 	function(jqXHR) { obj.onComplete(jqXHR); obj = null; },
			contentType					 : 	'application/json'
			
		});
		
		this.proptypes[key]				 =	false;
		
		this.addTypes();
		
	},
	
	saveInput							 :	function(rem) {
		
		var save					 	 =	false;
		
		
		if (this.input != null && this.input.val() && (this.input.val() != this.initVal)) save = true;
			 
		if (rem) {
			
			this.keyVal					 =	rem;
			save 						 = 	true;
		
		}
			
		if (save) {
			
			this.mode					 =	'saving';
			
			var data					 =	new Object();
			var key				 	  	 = 	this.keyVal;
			
			if (key == 'facebook_id') {
				
				data['facebook_ids']	 = 	this.getFacebookIds();
				
			} else {
				
				data[key] 				 = 	this.input.val();
			
			}
			
			var obj						 =	this;
			$.ajax({
			
				url 					 : 	'/nodes/' + window.currentNode._id,
				type					 :	'put',
				data 					 : 	$.toJSON(data),
				complete 				 : 	function(jqXHR) { obj.onComplete(jqXHR); obj = null; },
				contentType				 : 	'application/json'
				
			});
			
		} else {
			
			this.mode					 =	'display';
			
		}
		
		this.setInterface();
		
	},
	
	onComplete							 :	function(jqXHR) {
		
		if (jqXHR.statusText == 'success') {
			
			ExtAPI.Feedback.showMessage(ExtAPI.Feedback._MESSAGE,'Node property updated');
			
			this.mode					 =	'display';
			this.initVal				 = 	this.input == null ? 0 : this.input.val();
			
			if (jqXHR.responseText)			window.currentNode = eval('(' + jqXHR.responseText + ')');			
			
		} else if (jqXHR.statusText == 'error') {
				
			ExtAPI.Feedback.showMessage(ExtAPI.Feedback._ERROR,jqXHR.responseText);
			
			this.mode					 =	'edit';
			
		}
		
		this.setInterface();
		this.resolveFacebookIds();
		
	},
	
	getFacebookIds						 :	function() {
		
		var facebookIds					 =	new Array();						
		
		for (var i = 0; i < this.rows.length; i++) {
			
			var key						 =	this.rows[i].children('.key').text();
			
			if (key == 'facebook_id') {
				
				if (this.curreEl && this.rows[i][0] == this.curreEl.parent()[0]) {
					
					facebookIds.push(this.input.val());
				
				} else {

					facebookIds.push(this.rows[i].children('.value').text());

				}
				
			}
			
		}
		
		return facebookIds;
		
	},
	
	
	setInterface						 :	function() {
		
		switch (this.mode) {
			
			case 'saving':
				
				if (this.input != null) {
					
					this.input.attr('disabled', 'disabled');
					this.input.addClass('saving');
				
				}
				
			break;
			
			case 'edit':
				
				this.input.val(this.initVal);
				this.input.removeAttr('disabled');
				this.input.removeClass('saving');
				
				this.input.focus();
				
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
	
	resolveFacebookIds					 :	function(data,status) {
		
		if (status == undefined) {
			
			var fbids					 =	window.currentNode.facebook_ids;
			
			data						 =	new Object();
			data.ids					 =	fbids.toString();
			
			var obj							 =	this;
			$.ajax({
			
				url 						 : 	'https://graph.facebook.com/',
				data 						 : 	data,
				type						 :	'get',
				dataType					 :	'jsonp',
				success 					 : 	function(data,status) { obj.resolveFacebookIds(data,status); }
				
			});
			
			ExtAPI.Feedback.showMessage(ExtAPI.Feedback._INFO,'Resolving Facebook IDs');
			
		} else if (status == 'success') {
			
			if (data.length != 0) 			this.facebookIDs = data;
			
			ExtAPI.Feedback.clearMessage();
			
		} else {
			
			ExtAPI.Feedback.showMessage(ExtAPI.Feedback._ERROR,'Failed to resolve Facebook IDs');
			
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
		this.initVal					 =	0;
		this.keyVal						 =	'';
		this.helper						 =	null;
		this.facebookIDs				 =	null;
		
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
			
			if (target.text() == 'facebook_id')  {
			
				//~ We would need to add anything in here that requires a helper
			
				this.helper				 = 	new ExtAPI.App.facebookhelper(ref);
			
			} else {
				
				ref.addRow(target.text(),'enter value...',false);
				ref.addTypes();
									
			}
			
			return true;		
			
		}		
		
	}
	
}

