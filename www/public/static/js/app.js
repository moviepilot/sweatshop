/**
 * -------------------------------------------------------------------------------- Main init object
 */
window.currentNode						 =	new Object();
window.ExtAPI							 =	new Object();

ExtAPI.App								 = 	Class.extend
({

	init								 :	function() {
		
		ExtAPI.Feedback				 	 = 	new ExtAPI.App.feedback();
		ExtAPI.Getnode				 	 =	new ExtAPI.App.getnode();
		ExtAPI.Createnode				 =	new ExtAPI.App.createnode();
		
		ExtAPI.Getnode.update(window.intiNodeId);	
		
	}

});

$(document).ready(function() { new ExtAPI.App(); });

