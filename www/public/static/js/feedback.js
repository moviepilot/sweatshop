/**
 * -------------------------------------------------------------------------------- Fedback object
 */

ExtAPI.App.feedback				 		 = 	Class.extend
({
	
	el									 :	null,
	
	_ERROR								 :	'error',
	_INFO								 :	'info',
	_MESSAGE							 :	'message',
	
	updateTimeout						 :	null,	
	
	_MESSAGE_ERROR					  	 :	'Please provide a feedback message',
	_TYPE_ERROR							 :	'Please select an existing feedback type',
	
	init								 :	function() {
		
		if ($('#feedback').length > 0) {
			
			this.el						 =	$('#feedback');
			this.el.hide();
			
		}		
		
	},
	
	showMessage							 :	function(type,message) {
	
		if (this.el) {
			
			var className				 =	null;
			
			switch (type) {
				
				case this._ERROR:
					
					className 			 =	this._ERROR;
					
				break;
				
				case this._INFO:
					
					className 			 =	this._INFO;
					
				break;
				
				case this._MESSAGE:
					
					className 			 =	this._MESSAGE;
					
				break;
				
			}
			
			if (className != null) {
				
				this.el.removeClass();
				this.el.addClass(className);
				
				if (message != undefined) {
				
					if (this.updateTimeout != null) {
					
						clearTimeout(this.updateTimeout);
					
						this.updateTimeout 	 = 	null;
					
					}
				
					this.el.text(message);
					this.el.stop().show().css('opacity',1);
					
					if (type != this._ERROR) {
					
						var obj 		 	 =	this;
						this.updateTimeout	 =	setTimeout(function(){ obj.clearMessage(); },5000);
					
					}
				
				} else {
					
					throw this._MESSAGE_ERROR;
					
				}	
				
				
			} else {
				
				this.el.removeClass();
				throw this._TYPE_ERROR;
				
			}
			
					
			return true;	
			
		}
				
		return false;
		
	},
	
	clearMessage						 :	function() {
		
		clearTimeout(this.updateTimeout);
		
		this.updateTimeout 	 = 	null;
		
		this.el.fadeOut(1000);
		
	}
	
});

