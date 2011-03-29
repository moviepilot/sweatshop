/**
 * -------------------------------------------------------------------------------- Createnode object
 */

ExtAPI.App.createnode					 = 	Class.extend
({
	
	button								 :	null,
	modal								 :	null,
	
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
		
		if ($('#modal').length > 0) {
			
			this.nodeName				 =	null;
			this.nodeType				 =	null;
			this.addConnection			 =	null;
			this.modal.remove();
			
		}
                
		this.modal						 =	$('<div />').attr('id','modal');
		
		$('body').append(this.modal);
		
		var obj							 =	this;
		this.modal.dialog({
			
			height						 :  290,
			modal						 : 	true,
			minWidth					 :	420,
			title 						 : 	(window.currentNode._id != undefined ? 'Create/search nodes' : 'Welcome to the Sweatshop'),
			buttons						 : 	{
				
				"Add"					 : 	function() {
									
					if (obj.saveNode()) {
					
						//obj.resetModal();
					
						obj 			 =	null;
						
						$(this).dialog('close');
						$(this).empty();
						
					}
					
				},
				
				Cancel					 : 	function() { $(this).dialog('close'); $(this).empty(); }
				
			}
		
			});
		
		//~ Form
		
		this.addConnection				 =	$('<input type="checkbox" />').attr('id','addConnection').val('yes');
		this.nodeName					 =	$('<input type="text"/>');
		this.nodeType					 =	$('<select />');
		
		var handlers				 	 =	ExtAPI.App.createnode.eventHandlers;
		var nodeTypes					 =	ExtAPI.App.config.getNodeTypes();
		var ln							 =	nodeTypes.length;
		
		while (ln--) {
			
			var option					 =	$('<option />').val(nodeTypes[ln]).text(nodeTypes[ln]);
			
			this.nodeType.append(option);
		
		}
		
		var form						 =	$('<div />').text('Enter the name of an existing node, or create a new one from the detail below.').addClass('createNodeForm');
		var nameRow						 =	$('<div />').text('Node name: ').append(this.nodeName);
		var typeRow						 =	$('<div />').text('Node type: ').append(this.nodeType);
		var connectionRow				 =	$('<div />').append($('<label for="addConnection"/>').text(' (Add connection to current node)')).prepend(this.addConnection);
		
		form.append(nameRow);
		form.append(typeRow);
		form.append(connectionRow);
		
		//~ Add in the autocomplete, overide display params
		
		this.nodeName.autocomplete({
			
			source						 : 	'/search',
			minLength					 : 	2
			
		}).data( "autocomplete" )._renderItem = function(ul, item) {
			
			return 							$('<li />').data("item.autocomplete", item).append("<a>" + item.name + "</a>").appendTo(ul);
				
		};
		
		this.nodeName.bind('autocompleteopen', 		{ 'ref' : this }, handlers.nodeName.onautocompleteopen);
		this.nodeName.bind('autocompleteselect',	{ 'ref' : this }, handlers.nodeName.onautocompleteselect);
		this.nodeName.bind('focusout',				{ 'ref' : this }, handlers.nodeName.onfocusout);
		
		//~ Ensure that new node is not possible from the start
		
		this.enableNewNode(false);
		
		this.modal.append(form);
		this.nodeName.focus();
	
	},
	
	enableNewNode						 :	function(state) {
		
		if (state) {
			
			this.nodeType.attr('disabled', '');
			if (window.currentNode._id != undefined) this.addConnection.attr('disabled', '');
			
		} else {
				
			this.nodeType.attr('disabled', 'disabled');
			this.addConnection.attr('disabled', 'disabled');
			
		}	
		
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
		
		
		
	}
	
});

ExtAPI.App.createnode.eventHandlers 	 = 	{
	
	button 								 :	{
		
		onmousedown						 :	function(event) {
			
			var ref						 =	event.data.ref;
			
			ref.buildModal();
			
			return true;
			
		}
		
	},
	
	nodeName							 :	{
		
		onautocompleteopen				 :	function(event,ui) {
			
			var ref						 =	event.data.ref;
			
			ref.enableNewNode(false);
			
			return true;
			
		},
		
		onautocompleteselect			 :	function(event,ui) {
			
			var ref						 =	event.data.ref;
			
			if (ui.item._id) {
				
				ExtAPI.Getnode.update(ui.item._id);
				
				ref.modal.dialog('close');
					
				return true;
			
			}
			
			return false;
			
		},
		
		onfocusout						 :	function(event,ui) {
			
			var ref						 =	event.data.ref;
			
			ref.enableNewNode(true);
			
			return false;
			
		}
		
	}
	
}

