/**
 * -------------------------------------------------------------------------------- Fedback object
 */
ExtAPI.App.feedback			 			 = 	SOAPI.Class.extension();

ExtAPI.App.feedback.extend
({
	
	el									 :	null,
	
	_ERROR								 :	'error',
	_INFO								 :	'info',
	_MESSAGE							 :	'message',
	
	updateTimeout						 :	null,	
	
	_MESSAGE_ERROR					  	 :	'Please provide a feedback message',
	_TYPE_ERROR							 :	'Please select an existing feedback type',
	
	construct							 :	function() {
		
		if ($('feedback')) {
			
			this.el						 =	$('feedback');
			this.el.hide();
			
			var animator					 =	new SOAPI.Animator(new SOAPI.Sprite(this.el), "fadeout");
		
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
				
				this.el.setAttribute('class',className);
				
				if (message != undefined) {
				
					if (this.updateTimeout != null) {
					
						clearTimeout(this.updateTimeout);
					
						this.updateTimeout 	 = 	null;
					
					}
				
					this.el.innerHTML	 =	message.trim();
					this.el.show();
					this.el.styleTo('opacity',1);
					
					if (type != this._ERROR) {
					
						var obj 		 	 =	this;
						this.updateTimeout	 =	setTimeout(function(){ obj.clearMessage(); },5000);
					
					}
				
				} else {
					
					throw this._MESSAGE_ERROR;
					
				}	
				
				
			} else {
				
				this.el.removeAttribute('class');
				throw this._TYPE_ERROR;
				
			}
			
					
			return true;	
			
		}
				
		return false;
		
	},
	
	clearMessage						 :	function() {
		
		clearTimeout(this.updateTimeout);
		
		this.updateTimeout 	 = 	null;
		
		var el							 =	this.el;
		var animator 				 	 =	el.animators.fadeout;
		
		var opacity						 =	el.get("opacity");
		
		animator.addAnimation(1,
			{ opacity 					 : 	SOAPI.Transition.generate([new Array('Linear','In',15)], opacity, 0)  },
			{ interval: 10, repeat: false, relative: false, action:  [function(){ el.hide(); }] }
		);
		
		animator.Play(1);
		
	}
	
});

