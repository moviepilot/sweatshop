/**
 * -------------------------------------------------------------------------------- Main init object
 */
window.node								 =	new Object();

window.ExtAPI 							 = 	window.ExtAPI || {};

ExtAPI.App 					 			 = 	SOAPI.Class.extension();

ExtAPI.App.extend
({
	
	construct							 :	function() {
		
		ExtAPI.Feedback					 = 	new ExtAPI.App.feedback();
		
		// This is just here for demo purposes, as we don't know how were are getting to this point
		
		var obj							 =	this;
		SOAPI.Ajax.request({
			
			url 						 : 	'/node/',
			data 						 : 	{
				
				_id 					 : 	window.node_id
				
				},
			
			onSuccess : function(data) {
				
				window.node				 =	data;
				obj.buildApp();
				
			}});
		
	},
	
	buildApp							 :	function() {
		
		var name						 =	new ExtAPI.App.name();
		var category					 =	new ExtAPI.App.type();
		var nodeprops					 =	new ExtAPI.App.nodeprops();
		
		// Leaving the image upload to later, the following line just sets the bg of the
		// pic holder for the time being
		
		if (window.node.picture_url)		$('pic').style.backgroundImage = 'url(' + window.node.picture_url + ')';
		
		// Also, just get the edges here - but idealy this needs to be tied together properly.
		
		var obj							 =	this;
		SOAPI.Ajax.request({
			
			url 						 : 	'/node/',
			data 						 : 	{
				
				_id 					 : 	window.node_id,
				edges					 :	true
				
				},
			
			onSuccess : function(data) {
				
				window.node.edges		 =	data;
				obj.updateEdges();
				
			}});
		
	},
	
	updateEdges							 :	function() {
		
		var connections					 =	new ExtAPI.App.connections();		
		
	}
	
});

window.setup2							 =	function() { new ExtAPI.App(); }

