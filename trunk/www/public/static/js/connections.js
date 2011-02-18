/**
 * -------------------------------------------------------------------------------- Connections object
 */
ExtAPI.App.connections		 			 = 	SOAPI.Class.extension();

ExtAPI.App.connections.extend
({
	
	domTypes							 :	null,
	rows								 :	null,
	
	mode								 :	'display',
	
	holder								 :	null,
	searchEl							 :	null,
	searched							 :	false,
	
	searchResults						 :	null,
	
	construct							 :	function() {
		
		var handlers					 =	ExtAPI.App.connections.eventHandlers;
		
		if (window.node.edges) {
			
			this.domTypes				 =	new Object();
			this.rows					 =	new Array();
			this.domTypes.Movie			 =	$('movies');
			this.domTypes.Person		 =	$('people');	
			this.domTypes.Properties	 =	$('properties');
			
			this.processEdges();
			
		}
		
		if ($('searchConnections'))	{
			
			this.searchEl 				 = 	$('searchConnections');
			this.holder					 =	$('holder');
			
			SOAPI.Event.addEventHandler(this.searchEl,	"keyup",		[this,handlers.searchEl.onkeyup],		"connections");
			SOAPI.Event.addEventHandler(this.searchEl,	"mousedown",	[this,handlers.searchEl.onmousedown],	"connections");
			SOAPI.Event.addEventHandler(this.searchEl,	"blur",			[this,handlers.searchEl.onblur],		"connections");
			
		}
		
	},
	
	processEdges						 :	function() {
		
		var ln 							 = 	window.node.edges.length;
		
		while (ln--) {
			
			this.rows.push(new ExtAPI.App.connection(window.node.edges[ln],this.domTypes[window.node.edges[ln].to.type].children[1],false));
			
		}
		
	},
	
	doSearch						 	 :	function() {
		
		if (this.searchEl.value != '' && !this.searched) {
			
			this.searched				 =	true;
			this.mode					 =	'searching';
			
			var data					 =	new Object();
			data.search					 = 	this.searchEl.value;				
			
			var obj						 =	this;			
			SOAPI.Ajax.request({
					
				url						 :	'/node/',
				dataType		 		 :	'post',
				showProgress		 	 :	false,
				data			 		 :	data,
				onSuccess				 :	function(data){ obj.onResponse(data); }
						
				});
			
			this.setInterface();
			
		}
		
	},
	
	onResponse							 :	function(response) {
		
		if (response.type == 'error') {
					
			ExtAPI.Feedback.showMessage(ExtAPI.Feedback._ERROR,response.message);
		
		} else {
			
			this.destroyRows();
			
			this.searchResults			 =	null;
			
			if (response.length > 0) {
				
				this.searchResults		 = 	response;
				
				var ln 					 =	response.length;
				
				while (ln--) {
					
					this.addResultRow(response[ln],ln);
					
				}
				
			} else {
				
				SOAPI.createElement({ parent : this.holder , content : 'No results' });
				
			}
		
		}
		
		this.mode						 =	'display';
		this.setInterface();
		
	},
	
	addResultRow						 :	function(data,id) {
		
		var row							 =	SOAPI.createElement({
					
			parent 				 	 	 : 	this.holder,
			attributes 			 	 	 : 	{ 'class' : 'row' }
			
			});
		
		row.onselectstart 				 = 	function() { return false; }
		row.unselectable 		 		 = 	'on';
		row.style.MozUserSelect			 =	'none';
	
		// ~ Name
		
		var name						 = 	SOAPI.createElement({
					
			parent 						 : 	row,
			content						 :	data.name + ' [' + data.type + ']',
			attributes 					 : 	{ 'class' : 'name' }
			
			});
		
		//~ Add
		
		var add							 = 	SOAPI.createElement({
					
			parent 						 : 	row,
			content						 :	'[+]',
			attributes 					 : 	{
				
				'class' 				 : 	'add',
				'id'					 :	id
				
				}
			
			});	
		
		var handlers					 =	ExtAPI.App.connections.eventHandlers;
		
		SOAPI.Event.addEventHandler(add,'mousedown',[this,handlers.searchResults.onmousedown],'connections');
		
	},
	
	destroyRows							 :	function() {
		
		if (this.holder.children.length > 0) {
			
			var ln						 =	this.holder.children.length;
			
			while (ln --) {
				
				SOAPI.Event.removeEventHandler(this.holder.children[ln],'mousedown','connections');
				
				SOAPI.destroyElement(this.holder.children[ln]);				
				
			}		
			
		}	
		
	},
	
	setInterface						 :	function() {
		
		switch (this.mode) {
			
			case 'searching':
				
				this.searchEl.disabled	 =	true;
				this.searchEl.addClassName('searching');
				
			break;
			
			case 'display':
				
				this.searchEl.disabled	 =	false;
				this.searchEl.removeClassName('searching');
				
			break;
			
		}
		
	},
	
	addConnection						 :	function(el) {
		
		if (el.getAttribute('id')) {
			
			var result					 =	this.searchResults[el.getAttribute('id')];
			
			this.rows.push(new ExtAPI.App.connection(result,this.domTypes[result.type].children[1],true));	
			
		}
		
	},
	
	destroy								 :	function() {
		
		SOAPI.Event.removeEventHandler(this.searchEl,	"keyup",	"connections");
		SOAPI.Event.removeEventHandler(this.searchEl,	"mousedown","connections");
		SOAPI.Event.removeEventHandler(this.searchEl,	"blur",		"connections");
		
		this.destroyRows();
		
		for (var i = 0; i < this.rows.length; i++)  	this.rows[i].destroy();
		
		this.domTypes					 =	null;
		this.rows						 =	null;
		this.holder						 =	null;
		this.searchEl					 =	null;
		this.searched					 =	false;
		this.searchResults				 =	null;		
		
	}
	
});

ExtAPI.App.connections.eventHandlers  	 = 	{
	
	searchEl						 	 :	{
		
		onkeyup							 :	function(event) {
			
			this.searched				 =	false;
			
			if (event.event.keyCode == '13') this.doSearch();
			
			return true;
						
		},
		
		onmousedown						 :	function(event) {
			
			if (this.searchEl.value == 'search...')	this.searchEl.value = '';
			
			return true;
			
		},
		
		onblur							 :	function(event) {
			
			if (this.searchEl.value == '')	this.searchEl.value = 'search...';
			else
											this.doSearch();
			
			this.searched				 =	false;
										
			return true;
			
		}
		
	},
	
	searchResults						 :	{
	
		onmousedown						 :	function(event) {
		
			this.addConnection(event.element);
		
			return true;
		
		}
		
	}
	
}


