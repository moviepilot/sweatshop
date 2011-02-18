/**
 * -------------------------------------------------------------------------------- Connection object
 */
ExtAPI.App.connection		 			 = 	SOAPI.Class.extension();

ExtAPI.App.connection.extend
({
	
	connection							 :	null,
	parentEl							 :	null,
	
	row									 :	null,
	name								 :	null,
	weight								 :	null,
	
	updateTimer							 :	null,
	
	construct							 :	function(connection,parentEl,newCon) {
		
		this.parentEl				 	 = 	parentEl;
		
		if (newCon) 						this.connection	= this.genNewConnection(connection);
		else
											this.connection	= connection;
		
		this.buildConnection();
		
	},
	
	genNewConnection					 :	function(connection) {
		
		var newConnection				 =	{
		
			_id				 			 :	null,
			weight			 			 :	0,
			to							 :	{
				
				_id						 :	connection._id,
				name			 		 :	connection.name,
				type					 :	connection.type
				
			}
		
		}
		
		return newConnection;
		
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
		
		this.name						 = 	SOAPI.createElement({
					
			parent 						 : 	this.row,
			content						 :	this.connection.to.name,
			attributes 					 : 	{ 'class' : 'name' }
			
			});
		
		//~ Weight
		
		this.weight						 = 	SOAPI.createElement({
					
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
		
		SOAPI.Event.addEventHandler(this.name,		"onmouseup",	[this,handlers.name.onmouseup],		"connection");
		SOAPI.Event.addEventHandler(this.weight,	"scrollend",	[this,handlers.slider.scrollend],	"connection");
		
	},
	
	saveInput							 :	function(value) {
		
		clearTimeout(this.updateTimer);
		
		if (this.connection.weight != value) {
			
			var data					 =	new Object();
			data._id					 =	this.connection._id;
			data.nodeid					 =	this.connection.to._id;
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
		
	},
	
	destroy								 :	function() {
		
		SOAPI.Event.removeEventHandler(this.name,	"onmouseup", "connection");
		SOAPI.Event.removeEventHandler(this.weight,	"scrollend", "connection");
		
		// We should put in something to destroy the widget...
		
		SOAPI.destroyElement(this.name);
		SOAPI.destroyElement(this.weight);
		SOAPI.destroyElement(this.row);
		
		this.connection					 =	null;
		this.parentEl					 =	null;
		this.row						 = 	null;
		this.updateTimer				 =	null;
		
	}
	
});

ExtAPI.App.connection.eventHandlers 	 = 	{
	
	name								 :	{
		
		onmouseup						 :	function(event) {
			
			ExtAPI.Node.getNode(this.connection.to._id);
						
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

