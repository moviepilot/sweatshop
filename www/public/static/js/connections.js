/**
 * -------------------------------------------------------------------------------- Connections object
 */

ExtAPI.App.connections					 = 	Class.extend
({
	
	domTypes							 :	null,
	rows								 :	null,
	
	mode								 :	'display',
	
	holder								 :	null,
	searchEl							 :	null,
	searched							 :	false,
	
	searchResults						 :	null,
	
	init								 :	function() {
		
		var handlers					 =	ExtAPI.App.connections.eventHandlers;
		
		this.domTypes				  	 =	new Object();
		this.rows					 	 =	new Array();
		
		this.domTypes.Movie				 =	$('#moviesHolder');
		this.domTypes.Person			 =	$('#peopleHolder');	
		this.domTypes.Properties		 =	$('#propertiesHolder');
			
		this.processEdges();
		
		if ($('#searchConnections').length > 0 && $('#searchholder').length > 0)	{
			
			this.searchEl 				 = 	$('#searchConnections');
			this.holder					 =	$('#searchholder');
						
			this.searchEl.bind('keyup',		{ 'ref' : this }, handlers.searchEl.onkeyup);
			this.searchEl.bind('mousedown',	{ 'ref' : this }, handlers.searchEl.onmousedown);
			this.searchEl.bind('blur',		{ 'ref' : this }, handlers.searchEl.onblur);
		
			this.searchEl.val('search...');
			
		}
		
	},
	
	processEdges						 :	function() {
		
		var edges						 =	window.currentNode.edges;
		var ln 							 = 	edges.length;
		
		while (ln--) 						this.rows.push(new ExtAPI.App.connection(edges[ln],this.domTypes[edges[ln].to.type],false));
		
	},
	
	doSearch						 	 :	function() {
		
		if (this.searchEl.val() && !this.searched) {
			
			this.searched				 =	true;
			this.mode					 =	'searching';
			
			var data					 =	new Object();
			data.term					 = 	this.searchEl.val();				
			
			this.searchEl.blur();
			
			var obj						 =	this;
			$.ajax({
			
				url 					 : 	'/search',
				data 					 : 	data,
				success 				 : 	function(data) { obj.onResponse(data);  obj = null; }
				
			});
				
			this.setInterface();
			
		}
		
	},
	
	onResponse							 :	function(response) {
		
		if (response.type == 'error') {
					
			ExtAPI.Feedback.showMessage(ExtAPI.Feedback._ERROR,response.message);
		
		} else {
			
			this.destroySearchRows();
			
			this.searchResults			 =	null;
			
			if (response.length > 0) {
				
				this.searchResults		 = 	response;
				
				var ln 					 =	response.length;
				
				while (ln--) {
					
					this.addResultRow(response[ln],ln);
					
				}
				
			} else {
				
				this.holder.append($('<div />').text('No results'));
				
			}
		
		}
		
		this.mode						 =	'display';
		this.setInterface();
		
	},
	
	addResultRow						 :	function(data,id) {
		
		//~ Row
		
		var row							 =	$('<div />').addClass('row');
		
		row.attr('id',id);
		row.disableSelection();
		
		//~ Name
		
		var name						 =	$('<div />').addClass('name');
		
		name.text(data.name);
		row.append(name);
		
		//~ Add
		
		var add							 =	$('<div />').addClass('add');
		
		add.text('[+]');
		row.append(add);
				
		//~ Add the row
		
		this.holder.append(row);
		
		var handlers					 =	ExtAPI.App.connections.eventHandlers;
		
		add.bind('mousedown',	{ ref : this }, handlers.searchResults.onaddmousedown);
		name.bind('mousedown',	{ ref : this }, handlers.searchResults.onnamemousedown);
		
	},
	
	destroySearchRows					 :	function() {
		
		this.holder.children().children().unbind();
		this.holder.empty();
		
	},
	
	setInterface						 :	function() {
		
		switch (this.mode) {
			
			case 'searching':
				
				this.searchEl.attr('disabled', 'disabled');
				this.searchEl.addClass('searching');
				
			break;
			
			case 'display':
				
				this.searchEl.removeAttr('disabled');
				this.searchEl.removeClass('searching');
				
			break;
			
		}
		
	},
	
	addConnection						 :	function(node) {
		
		var newConnection				 =	new ExtAPI.App.connection(node,this.domTypes[node.type],true);
		
		//~ Nasty closure - but perhaps the best way of doing it?
		
		var obj							 =	this;
		var listenForNewRow				 =	function(e,p) {
			
			if (p.error && p.exists) 		newConnection.destroy();
			else
											obj.rows.push(newConnection);
							
		};
		
		$(newConnection).bind('connectionstate',listenForNewRow);
		
	},
	
	reset								 :	function() {
		
		if (this.rows != null) {
		
			for (var i = 0; i < this.rows.length; i++) {
				
				this.rows[i].destroy();
				this.rows[i]				 =	null;
			
			}
			
			this.rows						 =	new Array();
			
		}		
		
	}
	
});

ExtAPI.App.connections.eventHandlers  	 = 	{
	
	searchEl						 	 :	{
		
		onkeyup							 :	function(event) {
			
			var ref						 =	event.data.ref;
			
			ref.searched				 =	false;
			
			if (event.keyCode == '13') 		ref.doSearch();
			
			return true;
						
		},
		
		onmousedown						 :	function(event) {
			
			var ref						 =	event.data.ref;
			
			ref.searchEl.focus();
			
			if (ref.searchEl.val() == 'search...')	ref.searchEl.val('');
			
			return true;
			
		},
		
		onblur							 :	function(event) {
			
			var ref						 =	event.data.ref;
			
			if (ref.searchEl.val() == '')	ref.searchEl.val('search...');
			else
											ref.doSearch();
			
			ref.searched				 =	false;
										
			return true;
			
		}
		
	},
	
	searchResults						 :	{
	
		onaddmousedown					 :	function(event) {
		
			var ref						 =	event.data.ref;
			var target					 =	$(event.target);
			
			ref.addConnection(ref.searchResults[target.parent().attr('id')]);
		
			return true;
		
		},
		
		onnamemousedown					 :	function(event) {
			
			var ref						 =	event.data.ref;
			var target					 =	$(event.target);
			var result					 =	ref.searchResults[target.parent().attr('id')];
			
			ExtAPI.Getnode.update(result._id);
		
			return true;
		
		}		
		
	}
	
}


