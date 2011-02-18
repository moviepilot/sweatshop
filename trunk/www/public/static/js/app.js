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
		ExtAPI.Node						 =	new ExtAPI.App.node();
		
		// This is just here for demo purposes, as we don't know how were are getting to this point
		
		ExtAPI.Node.getNode(window.intiNodeId);		
				
	}
	
});

window.setup2							 =	function() { new ExtAPI.App(); }

