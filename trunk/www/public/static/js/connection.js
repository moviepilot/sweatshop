/**
 * -------------------------------------------------------------------------------- Connection object
 */
ExtAPI.App.connection		 			 = 	SOAPI.Class.extension();

ExtAPI.App.connection.extend
({
	
	connection							 :	null,
	parentEl							 :	null,
	
	row									 :	null,
	
	updateTimer							 :	null,
	
	construct							 :	function(connection,parentEl) {
		
		this.connection					 = 	connection;
		this.parentEl					 = 	parentEl;
		
		this.buildConnection();
		
	},
	
	buildConnection						 :	function() {
		
		//~ Row
		
		this.row						 =	SOAPI.createElement({
					
			parent 				 	 	 : 	this.parentEl,
			attributes 			 	 	 : 	{ 'class' : 'row' }
			
			});
		
		
		this.row.onselectstart 			 = 	function() { return false; }
		this.row.unselectable 		 	 = 	'on';
		this.row.style.MozUserSelect	 =	'none';
	
		// ~ Name
		
		var name						 = 	SOAPI.createElement({
					
			parent 						 : 	this.row,
			content						 :	this.connection.to.name,
			attributes 					 : 	{ 'class' : 'name' }
			
			});
		
		//~ Weight
		
		var weight						 = 	SOAPI.createElement({
					
			parent 						 : 	this.row,
			attributes 					 : 	{
				
				'widget' 				 : 	'slider',
				'value' 				 : 	(this.connection.weight * 100),
				'min'					 :	0,
				'max'					 :	100
				
				}
			
			});	
		
		SOAPI.buildWidgets(this.row);		
		
		var handlers					 =	ExtAPI.App.connection.eventHandlers;
		
		SOAPI.Event.addEventHandler(name,	"onmouseup",	[this,handlers.name.onmouseup],		"connection");
		SOAPI.Event.addEventHandler(weight,	"scrollend",	[this,handlers.slider.scrollend],	"connection");
		
	},
	
	saveInput							 :	function(value) {
		
		clearTimeout(this.updateTimer);
		
		if (this.connection.weight != value) {
			
			var data					 =	new Object();
			data._id					 =	this.connection._id;
			data.key				 	 = 	'edge';
			data.weight					 =	value;
				
			var obj						 =	this;
			SOAPI.Ajax.request({
					
				url						 :	'/ajax/',
				dataType		 		 :	'post',
				showProgress		 	 :	false,
				data			 		 :	data,
				onSuccess				 :	function(data){ obj.onResponse(data); }
						
				});
			
			this.mode					 =	'saving';
			this.setInterface();
						
		}		
		
	},
	
	onResponse							 :	function(response) {
		
		if (response.type == 'message') 	ExtAPI.Feedback.showMessage(ExtAPI.Feedback._MESSAGE,response.message);
		else
											ExtAPI.Feedback.showMessage(ExtAPI.Feedback._ERROR,response.message);
		
		this.mode					 	 =	'display';
		this.setInterface();
		
	},
	
	setInterface						 :	function() {
		
		switch (this.mode) {
			
			case 'saving':
				
				this.row.addClassName('saving');
				
			break;
			
			case 'display':
				
				this.row.removeClassName('saving');
				
			break;
			
		}
		
	}
	
});

ExtAPI.App.connection.eventHandlers 	 = 	{
	
	name								 :	{
		
		onmouseup						 :	function(event) {
			
			window.location				 =	'/?_id=' + this.connection.to._id;
						
			return true;
			
		}
		
	},
	
	slider								 :	{
		
		scrollend						 :	function(event) {
			
			if (this.updateTimer != null) {
				
				clearTimeout(this.updateTimer);
				
				this.updateTimer		 =	null;
				
			}
			
			var obj						 =	this;
			this.updateTimer			 = 	setTimeout(function(){ obj.saveInput(event.element.value.toPrecision(1)); },2000);
			
			return true;
			
		}	
		
	}
	
}

