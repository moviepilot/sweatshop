/**
 * -------------------------------------------------------------------------------- Connections object
 */
ExtAPI.App.connections		 			 = 	SOAPI.Class.extension();

ExtAPI.App.connections.extend
({
	
	domTypes							 :	new Object(),
		
	mode								 :	'display',
	
	holder								 :	null,
	searchEl							 :	null,
	searched							 :	false,
	
	construct							 :	function() {
		
		var handlers					 =	ExtAPI.App.connections.eventHandlers;
		
		if (window.node.edges) {
			
			this.domTypes.Movie			 =	$('movies');
			this.domTypes.People		 =	$('people');	
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
			
			var connection				 =	new ExtAPI.App.connection(window.node.edges[ln],this.domTypes[window.node.edges[ln].to.type].children[1]);
			
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
			
			if (response.length > 0) {
				
				var ln 					 =	response.length;
				
				while (ln--) {
					
					this.addRow(response[ln]);
					
				}
				
			} else {
				
				SOAPI.createElement({ parent : this.holder , content : 'No results' });
				
			}
		
		}
		
		this.mode						 =	'display';
		this.setInterface();
		
	},
	
	addRow								 :	function(data) {
		
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
			content						 :	data.name,
			attributes 					 : 	{ 'class' : 'name' }
			
			});
		
		//~ Add
		
		var add							 = 	SOAPI.createElement({
					
			parent 						 : 	row,
			content						 :	'[+]',
			attributes 					 : 	{
				
				'class' 				 : 	'add',
				'type' 					 : 	data.type,
				'_id'					 :	data._id
				
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
				
				this.holder.removeChild(this.holder.children[ln]);				
				
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
		
		if (el.getAttribute('_id') && el.getAttribute('type')) {
			
			//console.log(this.domTypes[el.getAttribute('type')].children[1]);
			
			//var connection				 =	new ExtAPI.App.connection(window.node.edges[ln],this.domTypes[el.getAttribute('type')].children[1]);	
			
		}
		
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


