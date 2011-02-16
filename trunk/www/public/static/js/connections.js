/**
 * -------------------------------------------------------------------------------- Connections object
 */
ExtAPI.App.connections		 			 = 	SOAPI.Class.extension();

ExtAPI.App.connections.extend
({
	
	domTypes							 :	new Object(),
		
	mode								 :	'display',
	
	construct							 :	function() {
		
		if (window.node.edges) {
			
			this.domTypes.Movie			 =	$('movies');
			this.domTypes.People		 =	$('people');	
			this.domTypes.Properties	 =	$('properties');
			
			this.processEdges();
			
		}
		
	},
	
	processEdges						 :	function() {
		
		var ln 							 = 	window.node.edges.length;
		
		while (ln--) {
			
			var connection				 =	new ExtAPI.App.connection(window.node.edges[ln],this.domTypes[window.node.edges[ln].to.type].children[1]);
			
		}
		
	}	
	
});

