/**
 * -------------------------------------------------------------------------------- Createnode object
 */

ExtAPI.App.createnode					 = 	Class.extend
({
	
	button								 :	null,
	
	nodeName							 :	null,
	nodeType							 :	null,
	addConnection						 :	null,
	
	init								 :	function() {
		
		if ($('#newNodeButton').length > 0) {
			
			var handlers				 =	ExtAPI.App.createnode.eventHandlers;
			
			this.button					 =	$('#newNodeButton');
			
			this.button.bind('mousedown', { 'ref' : this }, handlers.button.onmousedown);
						
		}
		
	},
	
	buildModal							 :	function() {
		
		if ($('#modal').length > 0)			$('#modal').remove();
		
		var modal						 = 	$('<div />').attr('id','modal');
		
		$('body').append(modal);
		
		var obj							 =	this;
		modal.dialog({
			
			height						 :  290,
			modal						 : 	true,
			minWidth					 :	400,
			title 						 : 	'Create a new node',
			buttons						 : 	{
				
				"Add"			 : 	function() {
									
					if (obj.saveNode()) {
					
						obj 				 =	null;
						
						$(this).dialog('close');
						$(this).empty();
						
					}
					
				},
				
				Cancel					 : 	function() { $( this ).dialog( "close" ); }
				
			}
		
			});
		
		//~ Form
		
		this.addConnection				 =	$('<input type="checkbox" />').attr('id','addConnection').val('yes');
		this.nodeName					 =	$('<input type="text"/>');
		this.nodeType					 =	$('<select />');
		
		var nodeTypes					 =	ExtAPI.App.config.getNodeTypes();
		var ln							 =	nodeTypes.length;
		
		while (ln--) {
			
			var option					 =	$('<option />').val(nodeTypes[ln]).text(nodeTypes[ln]);
			
			this.nodeType.append(option);
		
		}
		
		var form						 =	$('<div />').text('Enter new node detail below.').addClass('createNodeForm');
		var nameRow						 =	$('<div />').text('Node name: ').append(this.nodeName);
		var typeRow						 =	$('<div />').text('Node type: ').append(this.nodeType);
		var connectionRow				 =	$('<div />').append($('<label for="addConnection"/>').text(' (Add connection to current node)')).prepend(this.addConnection);
		
		form.append(nameRow);
		form.append(typeRow);
		form.append(connectionRow);
		
		modal.append(form);		
	
	},
	
	saveNode							 :	function() {
		
		if (this.nodeName.val() && this.nodeType.val()) {
			
			var obj						 =	this;
			var data					 =	new Object();
			
			data.type			 		 = 	this.nodeType.val();
			data.name					 =	this.nodeName.val();
				
				$.ajax({
			
					url 				 : 	'/nodes',
					type				 :	'post',
					data 				 : 	$.toJSON(data),
					complete 			 : 	function(jqXHR) { obj.onComplete(jqXHR); obj = null; },
					contentType			 : 	'application/json'
				
				});
			
			return true;
		
		}
		
		return false;
		
	},
	
	onComplete							 :	function(jqXHR) {
		
		if (jqXHR.statusText == 'success') {
			
			ExtAPI.Feedback.showMessage(ExtAPI.Feedback._MESSAGE,'New node created');
			
			var node					 =	$.parseJSON(jqXHR.responseText);
			
			if (node._id) {
				
				if (this.addConnection.is(':checked')) {
					
					ExtAPI.Getnode.connections.addConnection(node);
					
				} else {
					
					ExtAPI.Getnode.update(node._id);
					
				}	
				
			}
			
		} else if (jqXHR.statusText == 'error') {
			
			ExtAPI.Feedback.showMessage(ExtAPI.Feedback._ERROR,jqXHR.responseText);
			
		}
		
		this.nodeName					 =	null;
		this.nodeType					 =	null;
		this.addConnection				 =	null;
		
	}
	
});

ExtAPI.App.createnode.eventHandlers 	 = 	{
	
	button 									 :	{
		
		onmousedown						 :	function(event) {
			
			var ref						 =	event.data.ref;
			
			ref.buildModal();
			
			return true;
			
		}
		
	}
	
}

