/**
 * -------------------------------------------------------------------------------- Getnode object
 */
ExtAPI.App.getnode				 		 = 	Class.extend
({	
	
	_requests							 :	new Array(),
	_currentRequest						 :	null,
	_loading							 :	false,
			
	nodename							 :	null,
	nodetype							 :	null,
	nodeprops							 :	null,
	connections							 :	null,
	
	breadcrumb							 :	null,
	
	init								 :	function() {
		
		this.breadcrumb					 =	new ExtAPI.App.breadcrumb();
		
	},
	
	update								 :	function(_id) {
		
		this.destroyUI();
		
		//~ Get node, and edges
		
		var obj							 =	this;
		
		this.get({ data : { 'url' : '/nodes/' + _id }, 					callback : function(data){ obj.buildNodeUI(data); }});
		this.get({ data : { 'url' : '/nodes/' + _id + '/edges/out' }, 	callback : function(data){ obj.buildEdgeUI(data); }});
		
	},
	
	get									 :	function(request) {
		
		this._requests.push(request);
		this.processRequests();
	
	},
	
	processRequests						 :	function() {
		
		if (!this._loading && this._requests.length > 0) {
			
			ExtAPI.Feedback.showMessage(ExtAPI.Feedback._INFO,'Requesting node data');
			
			this._loading				 =	true;
			this._currentRequest		 =	this._requests.shift();
			
			var obj						 =	this;
			
			$.ajax({
			
				url 					 : 	this._currentRequest.data.url,
				success 				 : 	function(data) { obj.callback(data); obj = null; }
				
			});
					
		}
		
	},
	
	callback							 :	function(data) {
		
		if (data.type == 'error') {
			
			ExtAPI.Feedback.showMessage(ExtAPI.Feedback._ERROR,data.message);
		
		} else {
		
			ExtAPI.Feedback.clearMessage();
			
			this._currentRequest.callback(data);
		
		}
		
		this._currentRequest			 =	null;
		this._loading					 =	false;
		
		if (this._requests.length > 0) 		this.processRequests();
		
	},
	
	buildNodeUI							 :	function(data) {
		
		if (data) {
			
			window.currentNode 			 = 	data;
		
			this.breadcrumb.addId(data._id,data.name);
			
			this.nodename				 =	new ExtAPI.App.nodename();
			this.nodetype				 =	new ExtAPI.App.nodetype();
			this.nodeprops				 =	new ExtAPI.App.nodeprops();
			
			this.updatePictureURL();
		
		}
	
	},
	
	updatePictureURL					 :	function() {
		
		// Leaving the image upload to later, the following line just sets the bg of the
		// pic holder for the time being
			
		$('#pic').css('background-image','url(' + window.currentNode.picture_url + ')');
		
	},
	
	buildEdgeUI							 :	function(data) {
		
		if (data) {
			
			window.currentNode.edges 	 =	data;
			
			if (this.connections == null) {
			
				this.connections		 =	new ExtAPI.App.connections();	
			
			} else {
				
				this.connections.processEdges();
				
			}
			
		}
		
	},
	
	destroyUI							 :	function() {
		
		if (this.nodename != null) {
			
			this.nodename.destroy();
			this.nodename				 =	null;
			
		}
		
		if (this.nodetype != null) {
			
			this.nodetype.destroy();
			this.nodetype				 =	null;
			
		}
		
		if (this.nodeprops != null) {
			
			this.nodeprops.destroy();
			this.nodeprops				 =	null;
			
		}
		
		if (this.connections != null) {
			
			this.connections.reset();
			
		}		
		
	}
	
});

