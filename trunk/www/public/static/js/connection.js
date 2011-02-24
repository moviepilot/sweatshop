/**
 * -------------------------------------------------------------------------------- Connection object
 */

ExtAPI.App.connection					 = 	Class.extend
({
	
	connection							 :	null,
	parentEl							 :	null,
	
	row									 :	null,
	name								 :	null,
	weight								 :	null,
	
	updateTimer							 :	null,
	
	init								 :	function(connection,parentEl,newCon) {
		
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
		
		this.row						 =	$('<div />').addClass('row');
		
		this.row.disableSelection();
		
		//~ Name
		
		this.name						 =	$('<div />').addClass('name');
		
		this.name.text(this.connection.to.name);
		this.row.append(this.name);
		
		//~ Weight
		
		this.weight						 =	$('<div />').addClass('weight');
		
		this.weight.slider({
			
			range						 : 	'max',
			min							 : 	0,
			max							 : 	100,
			step						 :	10,
			value					 	 :	(this.connection.weight * 100)
		
			});
		
		this.row.append(this.weight);
				
		//~ Add the row
		
		this.parentEl.append(this.row);
		
		var handlers					 =	ExtAPI.App.connection.eventHandlers;
		
		this.name.bind('mousedown',		{ ref : this }, handlers.name.mousedown);
		this.weight.bind('slidestop',	{ ref : this }, handlers.slider.slidestop);
		
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
			$.ajax({
			
				url 					 : 	'/ajax/',
				type					 :	'post',
				data 					 : 	data,
				success 				 : 	function(data) { obj.onResponse(data) }
				
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
				
				this.row.addClass('saving');
				
			break;
			
			case 'display':
				
				this.row.removeClass('saving');
				
			break;
			
		}
		
	},
	
	destroy								 :	function() {
		
		this.name.unbind();
		this.weight.unbind();
		
		this.name.remove();
		this.weight.remove();
		this.row.remove();
		
		this.connection					 =	null;
		this.parentEl					 =	null;
		this.name						 =	null;
		this.weight						 =	null;
		this.row						 = 	null;
		this.updateTimer				 =	null;
		
	}
	
});

ExtAPI.App.connection.eventHandlers 	 = 	{
	
	name								 :	{
		
		mousedown						 :	function(event) {
			
			var ref						 =	event.data.ref;
			
			ExtAPI.Node.getNode(ref.connection.to._id);
						
			return true;
			
		}
		
	},
	
	slider								 :	{
		
		slidestop						 :	function(event,ui) {
			
			var ref						 =	event.data.ref;
			
			if (ref.updateTimer != null) {
				
				clearTimeout(ref.updateTimer);
				
				ref.updateTimer		 	 =	null;
				
			}
			
			ref.updateTimer			 = 	setTimeout(function(){ ref.saveInput(Number(ui.value / 100).toPrecision(1)); },2000);
			
			
			return true;
			
		}	
		
	}
	
}

