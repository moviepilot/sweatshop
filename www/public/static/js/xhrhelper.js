/**
 * -------------------------------------------------------------------------------- XHRhelper object
 */

ExtAPI.App.xhrhelper			 		 = 	Class.extend
({
	
	loadingDomRef						 :	null,
	
	overlayDomRef						 :	null,
	
	loadTimeout							 :	null,
	
	init								 :	function() {
		
		var handlers					 =	ExtAPI.App.xhrhelper.eventHandlers;
		
		if ($('#loadindicator').length > 0) {
			
			this.loadingDomRef			 =	$('#loadindicator');
			this.loadingDomRef.hide();			
			
			this.loadingDomRef.bind('ajaxSend',		{ ref : this }, handlers.ajax.onajaxsend);
			this.loadingDomRef.bind('ajaxComplete',	{ ref : this }, handlers.ajax.onajaxcomplete);
			this.loadingDomRef.bind('ajaxError',	{ ref : this }, handlers.ajax.onajaxerror);
			
		}
		
		if ($('#loadindicator').length > 0) {
			
			this.overlayDomRef			 =	$('#xhroverlay');
			this.overlayDomRef.hide();			
			
		}
		
	},
	
	clearLoadIndicator					 :	function() {
		
		if (this.loadTimeout != null) {
			
			clearTimeout(this.loadTimeout);
		
			this.loadTimeout 	 		 = 	null;
		
		}
		
		this.loadingDomRef.hide();
		this.overlayDomRef.hide();	
		
	}
	
});

ExtAPI.App.xhrhelper.eventHandlers 		 = 	{
	
	ajax								 :	{
	
		onajaxsend						 :	function(event) {
		
			var ref						 =	event.data.ref;
			
			if (ref.loadTimeout != null) {
				
				clearTimeout(ref.loadTimeout);
				
				ref.loadTimeout			 =	null;
				
			}
			
			ref.loadTimeout				 =	setTimeout(function(){ ref.loadingDomRef.show(); },2000);
			
			ref.overlayDomRef.show();	
			
			return true;
		
		},
		
		onajaxcomplete					 :	function(event) {
		
			var ref						 =	event.data.ref;
			
			ref.clearLoadIndicator();	
			
			return true;
		
		},
		
		onajaxerror						 :	function(event) {
		
			var ref						 =	event.data.ref;
			
			ref.clearLoadIndicator();
			
			ExtAPI.Feedback.showMessage(ExtAPI.Feedback._ERROR,'The request has failed');
			
			return true;
		
		}
	
	}
	
}
