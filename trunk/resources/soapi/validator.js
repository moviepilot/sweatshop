//#																														
//#	SOAPI 4.8													Copyright © 2000 - 2009 Dan Williams.					
//#																														

//+																														
//+	SOAPI.Validator																									{	
//+(																													
	
	SOAPI.Validator						 =
	
//+)																													

/*(	//~	Documentation					
	///																					
	///		This is the validation handler.												
	///																					
)*/

{	//~	Code							
	
	//*														
	//*	Variables										{	
	//*														
	
	NO_FILTER							 :	0,
	UPPERCASE							 :	1,
	LOWERCASE							 :	2,
	ALPHABETIC							 :	3,
	NUMERIC								 :	4,
	ALPHANUMERIC						 :	7,
	ALL									 :	7,
	
	definitions							 :	{},
	
	//*														
	//*												}		
	//*														
	
	//*														
	//*	Methods											{	
	//*														
	
	//-														
	//-	addDefinition									{	
	//-														
	
	addDefinition						 :	function
	
	/*(	//~	Documentation				
		///																					
		///		Add a validation definition.												
		///																					
		///	(	Syntax:																		
		///			void addDefinition( string name, object parameters )					
		///																					
		///				object parameters {													
		///					[integer filters], [string custom], [string description],		
		///					[mixed actionBefore], [mixed actionAfter]						
		///				}																	
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Adds a validation definition.											
		///	)																				
		///	(	Parameters:																	
		///			object				An object containing the parameters to use.			
		///				object			A bit-set integer specifying filter constants.		
		///				string			Custom characters to allow.							
		///				string			A description of the definition.					
		///				mixed			An action to execute before validation.				
		///				mixed			An action to execute after validation.				
		///			string				The name of the definition.							
		///	)																				
		///	(	Result:																		
		///			void																	
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		name,
		parameters
		
	)
	
	{	//~	Code						
		
		//	Defaults
		var p							 =	{
			filters						 :	this.NO_FILTER,
			custom						 :	"",
			description					 :	"",
			actionBefore				 :	null,
			actionAfter					 :	null
		};
		
		for (var pName in parameters)		p[pName]		 =	parameters[pName];
		
		this.definitions[name]			 =	p;
		
	},
	
	//-														
	//-												}		
	//-														
	
	//-														
	//-	validateKey										{	
	//-														
	
	validateKey							 :	function
	
	/*(	//~	Documentation				
		///																					
		///		Validate a keypress.														
		///																					
		///	(	Syntax:																		
		///			boolean validateKey(													
		///				object object, object event, string definition, integer maxlength	
		///			)																		
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Validates a string.														
		///	)																				
		///	(	Parameters:																	
		///			object				The event's source element.							
		///			object				The keypress event.									
		///			string				The name of the validation definition.				
		///			integer				The maximum number of characters to accept.			
		///	)																				
		///	(	Result:																		
		///			boolean				Whether the keypress is allowed or not.				
		///								The result is actually 0 if the input was			
		///								rejected due to maxlength being reached.			
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		object,
		event,
		definition,
		maxlength
		
	)
	
	{	//~	Code						
		
		var e							 =	event.event;
		
		//i(																				
		//i		The event has the following properties:										
		//i																					
		//i		keyCode		altKey		repeat												
		//i		charCode	ctrlKey		which												
		//i		type		shiftKey														
		//i)																				
		
		var keyCode						 =	e.keyCode;
		var charCode					 =	e.charCode || e.keyCode;
		
		if (!keyCode && !charCode)			return true;
		
		//i(																				
		//i		Key codes:																	
		//i																					
		//i		08		Backspace															
		//i		09		Tab																	
		//i		10		Linefeed (LF)														
		//i		13		Carriage-return (CR)												
		//i		16		Shift																
		//i		17		Ctrl																
		//i		18		Alt																	
		//i		19		Pause/Break															
		//i		20		Caps Lock															
		//i		27		Escape																
		//i		32		Space																
		//i		33		Page Up																
		//i		34		Page Down															
		//i		35		End																	
		//i		36		Home																
		//i		37		Left Arrow (Cursor)													
		//i		38		Up Arrow (Cursor)													
		//i		39		Right Arrow (Cursor)												
		//i		40		Down Arrow (Cursor)													
		//i		45		Insert																
		//i		46		Delete																
		//i		48-57	0 to 9 Numeric														
		//i		65-90	a to z (also A to Z)												
		//i		91		Left Windows Key													
		//i		92		Right Windows Key													
		//i		93		Select Key															
		//i		96-105	Num Pad - 0-9 (with Numlock set)									
		//i		106		Num Pad - Multiply													
		//i		107		Num Pad - Add														
		//i		109		Num Pad - Subtract													
		//i		110		Num Pad - Period													
		//i		111		Num Pad - Divide													
		//i		112-123	F1-F12																
		//i		144		Num Lock															
		//i		145		Scroll Lock															
		//i		186		Semi-colon															
		//i		187		Equals																
		//i		188		Comma																
		//i		189		Hyphen																
		//i		190		Period																
		//i		191		Forward Slash														
		//i		192		Grave Accent														
		//i		219		Open Bracket														
		//i		220		Back Slash															
		//i		221		Close Braket														
		//i		222		Single Quote														
		//i)																				
		
		//	IE does not register a keypress for special keys. Opera does, but uses e.which, which is 0 for specials.
		
		if (
				(opera && (
						!e.which
					||	keyCode == 16						//	Shift
					||	keyCode == 17						//	Ctrl
				))
			||	(!ie && !opera && (
						keyCode == 8						//	Backspace
					||	keyCode == 9						//	Tab
					||	keyCode == 35						//	End
					||	keyCode == 36						//	Home
					||	keyCode == 46						//	Delete
					||	(keyCode >= 37 && keyCode <= 40)	//	Arrow keys
					||	(charCode == 120 && e.ctrlKey)		//	Ctrl-X = Cut
					||	(charCode ==  99 && e.ctrlKey)		//	Ctrl-C = Copy
				))
		) {
			
			return true;
			
		}
		
		if (
				(charCode == 118 && e.ctrlKey)				//	Ctrl-V = Paste
		) {
			
			function validate(object, definition, maxlength) {
				return function() {
					object.value		 =	SOAPI.Validator.validateText(object.value, definition, maxlength);
				}
			}
			
			this.timer					 =	setTimeout(validate(object, definition, maxlength), 0);
			
			return true;
			
		}
		
		var selectionStart				 =	object.selectionStart;
		var selectionEnd				 =	object.selectionEnd;
		
		if (object.value.length >= maxlength && (ie || selectionStart == selectionEnd)) {
			
			event.preventDefault();
			
			return 0;
			
		}
		
		var keyChar						 =	String.fromCharCode(charCode);
		var newKeyChar					 =	this.validateText(keyChar, definition);
		
		if (!newKeyChar) {
			
			event.preventDefault();
			
			return false;
			
		}
		
		//i(																				
		//i		If, as a result of an action, the new character is different to the			
		//i		original, it needs replacing.												
		//i)																				
		
		if (ie) {
			
			if (newKeyChar != keyChar)		e.keyCode		 =	newKeyChar.charCodeAt(0);
			
			return true;
			
		}
		
		if (newKeyChar != keyChar) {
			
			object.value				 =	object.value.substring(0, selectionStart)
				+ newKeyChar + object.value.substring(selectionEnd);
			
			object.setSelectionRange(selectionStart + newKeyChar.length, selectionStart + newKeyChar.length);
			
			event.preventDefault();
			
		}
		
		return true;
		
	},
	
	//-														
	//-	validateText								}	{	
	//-														
	
	validateText						 :	function
	
	/*(	//~	Documentation				
		///																					
		///		Validate a string.															
		///																					
		///	(	Syntax:																		
		///			string validate( string text, string definition, integer maxlength )	
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Validates a string.														
		///	)																				
		///	(	Parameters:																	
		///			string				The text to validate.								
		///			string				The name of the validation definition.				
		///			integer				The maximum number of characters allowed.			
		///	)																				
		///	(	Result:																		
		///			string				The validated string.								
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		text,
		definition,
		maxlength
		
	)
	
	{	//~	Code						
		
		var definition					 =	this.definitions[definition];
		
		if (!definition)					return text;
		
		if (definition.actionBefore)		text			 =	this.executeAction(definition.actionBefore, text);
		
		var validText					 =	"";
		
		for (var i = 0; i < text.length; i++) {
			
			var charCode				 =	text.charCodeAt(i);
			
			if (
					(((definition.filters & this.UPPERCASE) == this.UPPERCASE) && (charCode > 64 && charCode < 91))
				||	(((definition.filters & this.LOWERCASE) == this.LOWERCASE) && (charCode > 96 && charCode < 123))
				||	(((definition.filters & this.NUMERIC)   == this.NUMERIC)   && (charCode > 47 && charCode < 58))
				||	(definition.custom.indexOf(text.charAt(i)) !== -1)
			) {
				
				validText				+=	text.charAt(i);
				
			}
			
		}
		
		if (definition.actionAfter)			validText		 =	this.executeAction(definition.actionAfter, validText);
		
		return (maxlength) ? validText.substring(0, maxlength) : validText;
		
	},
	
	//-														
	//-												}		
	//-														
	
	//-														
	//-	executeAction									{	
	//-														
	
	executeAction						 :	function
	
	/*(	//~	Documentation				
		///																					
		///		Execute an action.															
		///																					
		///	(	Syntax:																		
		///			mixed executeAction( mixed action, string data )						
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Executes an action.														
		///	)																				
		///	(	Parameters:																	
		///			mixed				The action.											
		///			string				The data to validate.								
		///	)																				
		///	(	Result:																		
		///			mixed				The validated data.									
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		action,
		data
		
	)
	
	{	//~	Code						
		
		if (isFunction(action))				return action(data);
		if (isString(action))				eval(action);
		
		if (isArray(action)) {
			
			for (var key in action)			eval(action[key]);
			
		}
		
		return data;
		
	}
	
	//-														
	//-												}		
	//-														
	
	//*														
	//*												}		
	//*														
	
};

//+																														
//+																												}		
//+																														
