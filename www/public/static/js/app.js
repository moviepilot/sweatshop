/**
 * -------------------------------------------------------------------------------- Main init object
 */
window.currentNode						 =	new Object();
window.ExtAPI							 =	new Object();

ExtAPI.App								 = 	Class.extend
({

	init								 :	function() {
		
		ExtAPI.Feedback				 	 = 	new ExtAPI.App.feedback();
		ExtAPI.Node					 	 =	new ExtAPI.App.node();
		
		ExtAPI.Node.getNode(window.intiNodeId);	
		
	}

});

$(document).ready(function() { new ExtAPI.App(); });

