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
		
		ExtAPI.Feedback.showMessage(ExtAPI.Feedback._INFO,'Requesting node data');
		
		// This is just here for demo purposes, as we don't know how were are getting to this point
		
		var obj							 =	this;
		SOAPI.Ajax.request({
			
			url 						 : 	'/node/',
			data 						 : 	{
				
				_id 					 : 	window.node_id
				
				},
			
			onSuccess : function(data) {
			
				if (data.type == 'error') {
					
					ExtAPI.Feedback.showMessage(ExtAPI.Feedback._ERROR,data.message);
				
				} else {
				
					ExtAPI.Feedback.clearMessage();
					
					window.node			 =	data;
					obj.buildApp();
				
				}
				
				}});
		
	},
	
	buildApp							 :	function() {
		
		ExtAPI.Feedback.showMessage(ExtAPI.Feedback._INFO,'Requesting edge data');
		
		var nodename					 =	new ExtAPI.App.nodename();
		var category					 =	new ExtAPI.App.nodetype();
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
				
				if (data.type == 'error') {
					
					ExtAPI.Feedback.showMessage(ExtAPI.Feedback._ERROR,data.message);
				
				} else {
				
					ExtAPI.Feedback.clearMessage();
					
					window.node.edges		 =	data;
					obj.updateEdges();
				
				}
				
			}});
		
	},
	
	updateEdges							 :	function() {
		
		var connections					 =	new ExtAPI.App.connections();		
		
	}
	
});

window.setup2							 =	function() { new ExtAPI.App(); }

