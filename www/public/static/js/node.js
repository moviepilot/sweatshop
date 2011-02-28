/**
 * -------------------------------------------------------------------------------- Getnode object
 */
ExtAPI.App.node					 		 = 	Class.extend
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
		
		this.startTimer();
		
		this.breadcrumb					 =	new ExtAPI.App.breadcrumb();
		
	},
	
	get									 :	function(request) {
		
		this._requests.push(request);
	
	},
	
	processRequest						 :	function() {
		
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
		
	},
	
	getNode								 :	function(_id) {
		
		this.detroyUI();
		
		//~ Get node, and edges
		
		var obj							 =	this;
		
		this.get({ data : { 'url' : '/nodes/' + _id }, 					callback : function(data){ obj.buildApp(data); }});
		this.get({ data : { 'url' : '/nodes/' + _id + '/edges/out' }, 	callback : function(data){ obj.updateEdges(data); }});
		
	},
	
	buildApp							 :	function(data) {
		
		if (data)							window.currentNode = data;
		
		this.breadcrumb.addId(data._id,data.name);
		
		this.nodename					 =	new ExtAPI.App.nodename();
		this.nodetype					 =	new ExtAPI.App.nodetype();
		this.nodeprops					 =	new ExtAPI.App.nodeprops();
		
		// Leaving the image upload to later, the following line just sets the bg of the
		// pic holder for the time being
		
		if (window.currentNode.picture_url)	$('#pic').css('background-image','url(' + window.currentNode.picture_url + ')');
	
	},
	
	updateEdges							 :	function(data) {
		
		if (data) {
			
			window.currentNode.edges 	 =	data;
			this.connections			 =	new ExtAPI.App.connections();	
		
		}
		
	},
	
	detroyUI							 :	function() {
		
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
			
			this.connections.destroy();
			this.connections			 =	null;
			
		}		
		
	},
	
	startTimer							 :	function() {
		
		//~ Run the processRequest for the first time, so that we don't have to wait
		
		var obj							 =	this;	
		var timer						 =	setInterval(function(){ obj.processRequest(); },100);
		
	}
	
});

