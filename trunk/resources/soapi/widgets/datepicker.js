//#																														
//#	SOAPI 4.8													Copyright © 2000 - 2010 Dan Williams.					
//#																														

//+																														
//+	SOAPI.DatePicker																									{	
//+(																													
	
	SOAPI.widgets.datepicker			 =	function(p) { new SOAPI.DatePicker(p); };
	
//+																														
	
	SOAPI.DatePicker					 =	SOAPI.Widget.extension();
	
	SOAPI.DatePicker.extend
	
//+)																													

/*(	//~	Documentation					
	///																					
	///		This class provides a date picker widget.										
	///																					
)*/

({	//~	Code							
	
	//*														
	//*	Variables										{	
	//*														
	
	wtype								 :	"datepicker",
	ctypes								 :	{ caldisplay: SOAPI.Panel },
	
	parameters							 :	SOAPI.merge(SOAPI.Widget.prototype.parameters, {
		tabindex						 :	0
	}),
	
	_TODAY								 :	'today',
	_NOT_MONTH							 :	'notmonth',
	_SELECTED							 :	'selected',
	_MONTH								 :	'month',
	
	inline								 :	false,
	inputField							 :	null,
	widget								 :	null,
	removeTimer							 :	null,
	
	inputErrState						 :	false,
	
	year								 :	null,
	month								 :	null,
	day									 :	null,
	originalDate						 :	new Date(),
	
	calDisplayActive					 :	false,	
	updateTimeout					 	 :	null,
	
	monthNames							 :	['January','February','March','April','May','June','July','August','September','October','November','December'], 
	dayNames							 :	['Su','Mo','Tu','We','Th','Fr','Sa'],
	
	//*														
	//*												}		
	//*														
	
	//*														
	//*	Methods											{	
	//*														
	
	//-														
	//-	setup											{	
	//-														
	
	setup								 :	function
	
	/*(	//~	Documentation				
		///																					
		///		Perform additional setup.													
		///																					
		///	(	Syntax:																		
		///			object setup( object parameters )										
		///																					
		///				object parameters {													
		///					...inherited from Panel...										
		///					[integer tabindex], [string action]								
		///				}																	
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Performs additional setup.												
		///	)																				
		///	(	Parameters:																	
		///			object				An object containing the parameters to use.			
		///				integer			The widget's tabindex.								
		///				string			An action to perform.								
		///	)																				
		///	(	Result:																		
		///			object				The results.										
		///				object			The parameters.										
		///				object			The widget.											
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		parameters
		
	)
	
	{	//~	Code						
		
		var result						 =	this.callParent(arguments.callee, "setup", arguments);
		var p							 =	result.p;
		var w							 =	this.widget = result.w;
		var c							 =	w.components;
		var handlers					 =	SOAPI.DatePicker_Handlers;
		
		//.	Date picker container					{	
		
		var caldisplay					 =	c.caldisplay =	this.createComponent({
			element						 :	p.element,
			parent						 :	w,
			cType						 :	"caldisplay"
		}, true, true);
		
		var animator				 	 =	new SOAPI.Animator(caldisplay, "fadein");
		
		animator.addAnimation(1,
			{ opacity					 : 	SOAPI.Transition.generate([new Array('Linear','In',15)], 0, 100) },
			{ interval : 10, repeat : false , relative : false }
		);
		
		var animator					 =	new SOAPI.Animator(caldisplay, "fadeout");
		
		animator.addAnimation(1);
			
		//.	Controls								{	
		
		var controls					 =	c.controls	 =	this.createComponent({
			element						 :	p.element,
			parent						 :	c.caldisplay,
			cType						 :	"controls"
		}, true, true);
		
		var yearSelect					 =	c.yearSelect =	this.createComponent({
			element						 :	p.element,
			parent						 :	c.controls,
			cType						 :	"yearSelect",
			eType						 :	"select"
		}, true, false);
		
		var monthSelect					 =	c.monthSelect =	this.createComponent({
			element						 :	p.element,
			parent						 :	c.controls,
			cType						 :	"monthSelect",
			eType						 :	"select"
		}, true, false);
		
		//.	Calendar								{	
		
		var calendar					 =	c.calendar   =	this.createComponent({
			element						 :	p.element,
			parent						 :	c.caldisplay,
			cType						 :	"calendar",
			eType						 :	"table"
		}, true, false);

		//.	Cal button								{	
		
		var calbutton					 =	c.calbutton  =	this.createComponent({
			element						 :	p.element,
			parent						 :	w,
			cType						 :	"calbutton"
		}, true, false);

		calbutton.onselectstart 		 = 	function() { return false; };
		calbutton.unselectable 			 = 	'on';
		calbutton.style.MozUserSelect 	 =	'none';

		//.	Input									{	
		
		var textbox						 =	c.textbox  	 =	this.createComponent({
			element						 :	p.element,
			parent						 :	w,
			cType						 :	"textbox"
		}, true, false);
		
		var calinput					 =	c.calinput	 =	this.createComponent({
			element						 :	p.element,
			parent						 :	c.textbox,
			cType						 :	"calinput",
			eType						 :	"input",
			extras						 :	{ name : textbox.getAttribute("name"), id : w.id + '_input', type : 'text' }
		}, true);
		
		SOAPI.Event.addEventHandler(calbutton, 		"mousedown", 	[this,handlers.calbutton.onMouseDown],	"datepicker");
		SOAPI.Event.addEventHandler(calendar, 		"mousedown", 	[this, handlers.calDays.onMouseDown],	"datepicker");
		
		SOAPI.Event.addEventHandler(calinput, 		"keyup", 		[this, handlers.calinput.onEvent], 		"datepicker");
		SOAPI.Event.addEventHandler(calinput, 		"focus", 		[this, handlers.calinput.onEvent], 		"datepicker");
		SOAPI.Event.addEventHandler(calinput, 		"blur", 		[this, handlers.calinput.onEvent], 		"datepicker");
				
		SOAPI.Event.addEventHandler(yearSelect, 	"mousedown", 	handlers.select.onMouseDown,			"datepicker");
		SOAPI.Event.addEventHandler(monthSelect,	"mousedown", 	handlers.select.onMouseDown,			"datepicker");
		SOAPI.Event.addEventHandler(yearSelect, 	"change", 		[this, handlers.select.change],			"datepicker");
		SOAPI.Event.addEventHandler(monthSelect,	"change", 		[this, handlers.select.change],			"datepicker");
		
		if (textbox.getAttribute("value") > 0) 		{
			
			this.originalDate.setTime(textbox.getAttribute("value") * 1000);
			this.setDate(this.originalDate);
			
			calinput.value 				 = 	0;
			
			this.displayFormattedDate();
			
		} else {
			
			this.setDate(this.originalDate);
			
		}
		
		//.	Run first create of calendar			{	
				
		this.updateCalendar();
		this.updateControls();
		
		//.											}		
		
		return result;
		
	},
	
	//-														
	//-	configure										{	
	//-														
	
	configure							 :	function
	
	/*(	//~	Documentation				
		///																					
		///		Perform additional configuration.											
		///																					
		///	(	Syntax:																		
		///			void configure( void )													
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Performs additional configuration.										
		///	)																				
		///	(	Parameters:																	
		///			void																	
		///	)																				
		///	(	Result:																		
		///			void																	
		///	)																				
		///																					
	)*/

	(	//~	Parameters					
		
		//	None
		
	)
	
	{	//~	Code						
		
		if (this.getAttribute("type") && this.getAttribute("type") == 'inline') {
			
			this.components.calinput.type = 'hidden';
			
			this.components.textbox.hide();
			this.components.calbutton.hide();
			
		} else {
			
			this.components.caldisplay.hide();
				
		}
		
	},
	
	//-														
	//-												}		
	//-	
	
	setDate								 :	function(val) {
		
		this.year						 =	val.getFullYear();
		this.month						 =	val.getMonth();
		this.day						 =	val.getDate();
		
	},
	
	updateCalendar						 :	function() {
		
		var calendar					 =	this.components.calendar;
		
		while (calendar.hasChildNodes()) 	calendar.removeChild(calendar.lastChild);
		
		var todaysDate 					 = 	new Date();
		todaysDate 						 = 	new Date(todaysDate.getFullYear(), todaysDate.getMonth(), todaysDate.getDate());
		
		var calendarDate				 =	new Date(this.year,this.month,this.day);
		var calDays				 		 =	32 - new Date(calendarDate.getFullYear(), calendarDate.getMonth(), 32).getDate();
		var noDateCalDays		 		 =	(new Date(calendarDate.getFullYear(), calendarDate.getMonth(), 1).getDay() + 7) % 7;
		var calRows						 =	Math.ceil((noDateCalDays + calDays) / 7);
		var day							 =	new Date(calendarDate.getFullYear(), calendarDate.getMonth(), 1 - noDateCalDays);
		var daysOfWeek					 =	7;
		
		var calendarHeader				 = this.addRow();
		
		calendarHeader.setAttribute('class','header');
		
		for	(var i = 0; i < 7; i++)			this.addCell(calendarHeader,this.dayNames[i]);
		
		while (calRows--) {
			
			var row 					 =	this.addRow();
			daysOfWeek					 =	7;
			
			while (daysOfWeek--) {
				
				var cell 				 = 	this.addCell(row,day.getDate());
				
				if (
				
					day.getDate() 		== 	todaysDate.getDate() 	&&
					day.getMonth() 		== 	todaysDate.getMonth() 	&&
					day.getFullYear() 	== 	todaysDate.getFullYear()
				
					)					 	cell.addClassName(this._TODAY);			// Is today
				
				if (day.getMonth() != calendarDate.getMonth()) {
					
					cell.addClassName(this._NOT_MONTH);								// Is not in this month
					
				} else
											cell.addClassName(this._MONTH);			// Is in this month
					
				if(
					
					day.getDate() 		== 	this.originalDate.getDate() 	&&
					day.getMonth() 		== 	this.originalDate.getMonth()	&&
					day.getFullYear() 	== 	this.originalDate.getFullYear()
				
				)							cell.addClassName(this._SELECTED);		// Is selcted
											
				day.setDate(day.getDate() + 1);
				
			}
			
		}
		
	},	
	
	updateControls						 :	function() {
		
		//.	Year								{	
	
		var yearsToDisplay				 =	20;
		var yearStart				 	 =	this.year - (yearsToDisplay / 2);
		
		this.components.yearSelect.innerHTML 	= '';
		this.components.monthSelect.innerHTML	= '';	
				
		while (yearsToDisplay--) {
			
			var option					 =	SOAPI.createElement({
			
				type					 :	"option",
				parent					 :	this.components.yearSelect,
				content					 :	yearStart,
				attributes				 :
				{
					value				 :	yearStart
				}
			
			});
			
			if(this.year == yearStart++) 	option.setAttribute('selected','selected');
		
		}
		
		
		//.	Month								{	
		
		for (month in this.monthNames) {
			
			if (!isNaN(month)) {
				
				option					 =	SOAPI.createElement({
					type				 :	"option",
					parent				 :	this.components.monthSelect,
					content				 :	this.monthNames[month],
					attributes			 :	{
						
						value			 :	month
					
					}
				
				});
				
				if(this.month == month) 	option.setAttribute('selected','selected');
			
			}
			
		}
		
	},
	
	addRow								 :	function() {
		
		var row 						 =	SOAPI.createElement({
			
			type						 :	"tr",
			parent						 :	this.components.calendar
		
		});
		
		return row;
		
	},
	
	addCell								 :	function(row,val) {
		
		var cell						 =	SOAPI.createElement({
			
			type						 :	"td",
			parent						 :	row
		
		});
		
		cell.write(val);
		
		return cell;
	
	},
	
	select								 :	function(el) {
		
		var tableElements 				 = 	SOAPI.findAllChildElements(this.components.calendar,'td',{},true);
		var ln 							 = 	tableElements.length;
		
		while (ln--) 						tableElements[ln].removeClassName(this._SELECTED);
				
		el.addClassName(this._SELECTED);
		
		// There is a bit of confusion over this, so should really be confirmed, but
		// I was getting different times in PHP on different servers - should spend
		// with more understanding of the situation.
		
		this.day						 =	el.innerHTML;
		
		this.displayFormattedDate();
		
	},
	
	displayFormattedDate				 :	function() {
		
		var input					 	 = 	this.components.calinput;
		
		//~ This tests for the fact that there could be no input but inputs coming from cal.
		
		if (input.value != '' || this.calDisplayActive) {
		
			var dateToDisplay			 =	new Date(this.year , this.month , this.day,23,59);
			input.value				 	 =	dateToDisplay.getDate() + ' ' + this.monthNames[dateToDisplay.getMonth()] + ' ' + dateToDisplay.getFullYear();
		
			SOAPI.Event.triggerEvent("change",this.widget);
		
		}
		
	},
	
	calDisplayActivate					 :	function() {
		
		var caldisplay					 =	this.components.caldisplay;
		var animator 				 	 =	caldisplay.animators.fadein;
		
		caldisplay.show();
		
		animator.Stop(1);
		animator.Reset(1);
		animator.Play(1);
				
		this.calDisplayActive			 =	true;
				
	},
	
	calDisplayDeactivate				 :	function() {
		
		var caldisplay					 =	this.components.caldisplay;
		var animator 				 	 =	caldisplay.animators.fadeout;
		
		this.calDisplayActive			 =	false;
		
		var opacity						 =	caldisplay.get("opacity");
		
		animator.addAnimation(1,
			{ opacity 					 : 	SOAPI.Transition.generate([new Array('Linear','In',15)], opacity, 0)  },
			{ interval: 10, repeat: false, relative: false, action:  [function(){ caldisplay.hide(); }] }
		);
		
		animator.Play(1);
		
	},
	
	setFocus							 :	function(event) {
		
		var focused					 	 =	this.widget.contains(event.event.target) && event.type != 'blur' ? true : false;
		
		this.widget.setAttribute('focused',(focused ? 'true' : 'false'));
		
		if (!focused) {
			
			if (this.calDisplayActive)		this.calDisplayDeactivate();
			
		} else {
			
			this.components.calinput.focus();
			
		}
		
	},
	
	updateCalFromInput					 :	function(timestamp) {
		
		if (!this.inputErrState) {
			
			this.originalDate			 =	new Date(timestamp);
						 			
			this.setDate(this.originalDate);
			this.updateCalendar();
			this.updateControls();
			
		}
		
	}
	
	//-														
	//-												}		
	//-														
	
	//*														
	//*												}		
	//*														
	
});

//+																														
//+		Handlers																								}	{	
//+																														
	
	SOAPI.DatePicker_Handlers			 =	{
		
		calbutton						 :	{
			
			onMouseDown					 :	function(event) {
				
				event.preventDefault();
				event.stopPropagation();
				
				this.setFocus(event);
				
				if (this.calDisplayActive) 	this.calDisplayDeactivate();
				else
											this.calDisplayActivate();
											
				return true;
				
			}
			
		},
		
		calinput						 :	{
			
			onEvent						 :	function(event) {
				
				event.preventDefault();
				event.stopPropagation();
			
				if (this.updateTimeout != null) {
					
					clearTimeout(this.updateTimeout);
					
					this.updateTimeout 	 = 	null;
					
				}
				
				var keyCodes			 =  [38,40,13];
				var e				 	 =	event.event;
				
				var timestamp			 =	null;
				var input				 =	event.element;
				var dateTypeOne			 =	Date.parseDate(input.value,'d/m/y');
				var dateTypeTwo			 =	Date.parseDate(input.value,'d/m');
				var dateTypeThree		 =	Date.parseDate(input.value,'d-m-Y');
				var dateTypeFour		 =	Date.parseDate(input.value,'d-m-y');
				var dateTypeFive		 =	Date.parseDate(input.value,'d-m');
				
				if (dateTypeOne != null) 		timestamp	 =	dateTypeOne.getTime();
				else if (dateTypeTwo != null)	timestamp	 =	dateTypeTwo.getTime();
				else if (dateTypeThree != null)	timestamp	 =	dateTypeThree.getTime();
				else if (dateTypeFour != null)	timestamp	 =	dateTypeFour.getTime();
				else if (dateTypeFive != null)	timestamp	 =	dateTypeFive.getTime();
				else
												timestamp	 = 	Date.parse(input.value);
				
				//~ Check for up and down arrow clicks.
				
				var keyPressUpdate		 = 	false;
				if (keyCodes.contains(e.keyCode)) {
					
					if (e.keyCode == '38') 	timestamp  +=	86400000;
				
					if (e.keyCode == '40') 	timestamp  -=	86400000;
					
					if (e.keyCode == '13') {
						
						if (this.calDisplayActive)		this.calDisplayDeactivate();
						else
														this.calDisplayActivate();
						
					} else {
						
						keyPressUpdate	 =	true;
						
					}
					
				}
				
				//~ Check that the timestamp generated is ok - perhaps this should include a less than zero for > epoch
				
				if (isNaN(timestamp)) {
					
					this.inputErrState 	 = 	true;
					
					input.addClassName('err');
					
				} else {
					
					this.inputErrState 	 =	false;	
					
					input.removeClassName('err');
					
					if (!keyPressUpdate) {
					
						var obj 		 	 =	this;
						this.updateTimeout	 =	setTimeout(function(){ obj.updateCalFromInput(timestamp); obj.displayFormattedDate(); },1000);
					
					} else {
						
						this.updateCalFromInput(timestamp);
						this.displayFormattedDate();
						
					}
					
				}
				
				this.setFocus(event);
				
				return true;
				
			}
			
		},
		
		calDays							 :	{
			
			onMouseDown					 :	function(event) {
				
				event.preventDefault();
				event.stopPropagation();
				
				var target				 =	event.event.srcElement != undefined ? event.event.srcElement : event.event.target;
				
				if(target.hasClassName(this._MONTH)) this.select(target);
				
				return true;
			
			}
			
		},
		
		select							 :	{
			
			change						 :	function(event) {
				
				var target				 =	event.event.srcElement != undefined ? event.event.srcElement : event.event.target;
				
				if(target == this.components.monthSelect) this.month = target.value;
				else
					this.year			 =	target.value;
				
				this.updateCalendar();
				this.updateControls();
				
				return true;
				
			},
			
			onMouseDown					 :	function(event) {
				
				event.preventDefault();
				event.stopPropagation();
				
				return false;
				
			}
			
		}
		
	};
	
//+																														
//+																												}		
//+																														
