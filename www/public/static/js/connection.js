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
		
		if (this.connection.weight == undefined) this.connection.weight = 0;
		
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
		this.weight.bind('slide',		{ ref : this }, handlers.slider.slide);
		
	},
	
	saveInput							 :	function(value) {
		
		clearTimeout(this.updateTimer);
		
		if (this.connection.weight != value) {
			
			var obj						 =	this;
			var data					 =	new Object();
			data.weight					 =	value;
			
			// Node that this will create a new node, but there
			// is no response, so we can't allow further updates at this stage.
			
			if (this.connection._id == null) {
				
				data.type			 	 = 	'WorksIn';
				data.from				 =	window.currentNode._id;
				data.to					 = 	this.connection.to._id;	
				
				$.ajax({
			
					url 				 : 	'/edges',
					type				 :	'post',
					data 				 : 	$.toJSON(data),
					complete 			 : 	function(jqXHR) { obj.onComplete(jqXHR); obj = null; },
					contentType			 : 	'application/json'
				
				});
				
			} else {
				
				$.ajax({
			
					url 				 : 	'/edges/' + this.connection._id,
					type				 :	'put',
					data 				 : 	$.toJSON(data),
					complete 			 : 	function(jqXHR) { obj.onComplete(jqXHR); obj = null; },
					contentType			 : 	'application/json'
				
				});
				
			}
					
			this.mode					 =	'saving';
			this.setInterface();
						
		}	
		
	},
	
	onComplete							 :	function(jqXHR) {
		
		if (jqXHR.statusText == 'success') {
			
			ExtAPI.Feedback.showMessage(ExtAPI.Feedback._MESSAGE,'Edge value has been updated');
			
			$(this).trigger('connectionstate',{ error : false });
			
			if (this.connection._id == null) {
				
				this.connection			 =	$.parseJSON(jqXHR.responseText);
				
			}
		
		} else if (jqXHR.statusText == 'error') {
			
			ExtAPI.Feedback.showMessage(ExtAPI.Feedback._ERROR,jqXHR.responseText);
			
			$(this).trigger('connectionstate',{ error : true , exists : true });
			
			return;
		
		}
		
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
		
		if (this.name) {
			
			this.name.unbind();
			this.name.remove();
			
		}
		
		if (this.weight) {
			
			this.weight.unbind();
			this.weight.remove();
		
		}
		
		if (this.row) 						this.row.remove();
		
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
			
			ExtAPI.Getnode.update(ref.connection.to._id);
						
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
			
			ref.weight.children()[1].innerHTML = '';
			
			return true;
			
		},
		
		slide							 :	function(event,ui) {
			
			var ref						 =	event.data.ref;
			
			ref.weight.children()[1].innerHTML = (ui.value / 100);
						
			return true;
			
		}
		
	}
	
}

