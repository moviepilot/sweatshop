window.onDomReady						 =	function(action) {
	
	var done							 =	false;
	window.onload						 =	loaded;
	
	if (document.addEventListener)			document.addEventListener("DOMContentLoaded", loaded, false);
	
	if ((/WebKit|KHTML|MSIE/i).test(navigator.userAgent))		check();
	
	function check() {
		
		if (document.body !== null && document.getElementsByTagName) {
			
			if (typeof document.fileSize != "undefined") {
				
				try {
					
					document.documentElement.doScroll("left");
					loaded();
				
				} catch (err) {}
			
			}
			
			if (typeof document.readyState != "undefined" && (/loaded|complete/).test(document.readyState)) loaded();
		}
		
		if (!done)							setTimeout(check, 10);
	
	};
	
	function loaded() {
		
		if (!done) {
			
			done						 =	true;
			action();
		
		}
		
	};
};

window.onDomReady(function() { SOAPI.setup(false, "setup()", false); });

window.setup							 =	function() {
	
	SOAPI.action						 =	false;
	SOAPI.buildWidgets();
	
	if (window.setup2) 						window.setup2();
	
};