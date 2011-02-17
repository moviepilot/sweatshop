/**
 * -------------------------------------------------------------------------------- Connection object
 */
ExtAPI.App.connection		 			 = 	SOAPI.Class.extension();

ExtAPI.App.connection.extend
({
	
	connection							 :	null,
	parentEl							 :	null,
	
	construct							 :	function(connection,parentEl) {
		
		this.connection					 = connection;
		this.parentEl					 = parentEl;
		
		this.buildConnection();
		
	},
	
	buildConnection						 :	function() {
		
		//~ Row
		
		var handlers					 =	ExtAPI.App.connection.eventHandlers;
		
		var row							 =	SOAPI.createElement({
					
			parent 				 	 	 : 	this.parentEl,
			attributes 			 	 	 : 	{ 'class' : 'row' }
			
			});
		
		// ~ Name
		
		var name						 = 	SOAPI.createElement({
					
			parent 						 : 	row,
			content						 :	this.connection.to.name,
			attributes 					 : 	{ 'class' : 'name' }
			
			});
		
		//~ Weight
		
		var weight						 = 	SOAPI.createElement({
					
			parent 						 : 	row,
			attributes 					 : 	{
				
				'widget' 				 : 	'slider',
				'value' 				 : 	(this.connection.weight * 100),
				'min'					 :	0,
				'max'					 :	100
				
				}
			
			});	
		
		SOAPI.buildWidgets(row);		
		SOAPI.Event.addEventHandler(name,	"onmouseup",		[this,handlers.name.onmouseup],	"name");
		
	}
	
});

ExtAPI.App.connection.eventHandlers 	 = 	{
	
	name								 :	{
		
		onmouseup						 :	function(event) {
			
			window.location				 =	'/?_id=' + this.connection.to._id;
						
			return true;
			
		}
		
	}
	
}

