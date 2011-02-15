/**
 * -------------------------------------------------------------------------------- Main init object
 */
window.node								 =	new Object();
window.node._id							 = 	12354984;

window.ExtAPI 							 = 	window.ExtAPI || {};

ExtAPI.App 					 			 = 	SOAPI.Class.extension();

ExtAPI.App.extend
({
	
	construct							 :	function() {
		
		ExtAPI.Feedback					 = 	new ExtAPI.App.feedback();
		
		var title						 =	new ExtAPI.App.title();
		var category					 =	new ExtAPI.App.category();
		
	}
	
});

window.setup2							 =	function() { new ExtAPI.App(); }

