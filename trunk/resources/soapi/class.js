//#																														
//#	SOAPI 4.8													Copyright © 2000 - 2009 Dan Williams.					
//#																														

//+																														
//+	SOAPI.Class																										{	
//+(																													
	
	SOAPI.Class							 =	function() {};
	
//+)																													

/*(	//~	Documentation					
	///																					
	///		This is a class, providing inheritance, super-class member access, and		
	///		flexible extensibility.														
	///																					
)*/

{	//~	Code							
	
	//*														
	//*	Methods											{	
	//*														
	
	//-														
	//-	construct										{	
	//-														
	
	SOAPI.Class.prototype.construct		 =	function
	
	/*(	//~	Documentation				
		///																					
		///		Class constructor.															
		///																					
		///	(	Syntax:																		
		///			void construct( void )													
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Class constructor.														
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
		
		//i(																				
		//i		The default constructor does nothing, and should be overridden.				
		//i)																				
		
	};
	
	//-														
	//-												}		
	//-														
	
	//-														
	//-	extension										{	
	//-														
	
	SOAPI.Class.extension				 =	function
	
	/*(	//~	Documentation				
		///																					
		///		Class extender.																
		///																					
		///	(	Syntax:																		
		///			SOAPI.Class extension( void )											
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Class extender. This function generates a new class, based on the		
		///			class on which this function was called.								
		///	)																				
		///	(	Parameters:																	
		///			void																	
		///	)																				
		///	(	Result:																		
		///			SOAPI.Class			A generated subclass, based on SOAPI.Class.			
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		//	None
		
	)
	
	{	//~	Code						
		
		var subClass					 =	this.duplicate();
		
		subClass.prototype.parentClass	 =	this.prototype;
		
		return subClass;
		
	};
	
	//-														
	//-	extend										}	{	
	//-														
	
	SOAPI.Class.extend					 =	function
	
	/*(	//~	Documentation				
		///																					
		///		Class extender.																
		///																					
		///	(	Syntax:																		
		///			void extend( object members )											
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Class extender. This function extends a class by adding members to		
		///			the class's prototype member. This is simply a shortcut to using		
		///			the prototype member directly - members can still be added directly		
		///			to prototype.															
		///	)																				
		///	(	Parameters:																	
		///			object				An object containing the members to add.			
		///	)																				
		///	(	Result:																		
		///			void																	
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		members
		
	)
	
	{	//~	Code						
		
		for (var member in members)		this.prototype[member]	 =	members[member];
		
	};
	
	//-														
	//-												}		
	//-														
	
	//-														
	//-	duplicate										{	
	//-														
	
	SOAPI.Class.duplicate				 =	function
	
	/*(	//~	Documentation				
		///																					
		///		Class duplicator.															
		///																					
		///	(	Syntax:																		
		///			SOAPI.Class duplicate( void )											
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Class duplicator. This function generates a new class, based on the		
		///			class on which this function was called.								
		///	)																				
		///	(	Parameters:																	
		///			void																	
		///	)																				
		///	(	Result:																		
		///			SOAPI.Class			A generated sibling class, based on SOAPI.Class.	
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		//	None
		
	)
	
	{	//~	Code						
		
		var Class						 =	SOAPI.Class;
		var sibClass					 =	function() {
			if (arguments[0] !== Class)		return this.construct.apply(this, arguments);
		};
		
		sibClass.prototype				 =	new this(Class);
		sibClass.extension				 =	this.extension;
		sibClass.extend					 =	this.extend;
		sibClass.duplicate				 =	this.duplicate;
		
		return sibClass;
		
	};
	
	//-														
	//-												}		
	//-														
	
	//-														
	//-	callParent										{	
	//-														
	
	SOAPI.Class.prototype.callParent	 =	function
	
	/*(	//~	Documentation				
		///																					
		///		Call function of parent class.												
		///																					
		///	(	Syntax:																		
		///			mixed extend( object object, string name[, array parameters] )			
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Calls a function of a parent class. This function looks for the			
		///			supplied function in the class ancestors hierarchy, and once found,		
		///			calls the named function of the current function's parent.				
		///	)																				
		///	(	Parameters:																	
		///			object				The current function, to search for.				
		///			string				The name of the current function (to be called).	
		///			array				Parameters to pass to the function.					
		///	)																				
		///	(	Result:																		
		///			mixed				The result of the function.							
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		object,
		name,
		parameters
		
	)
	
	{	//~	Code						
		
		var currentClass				 =	this;
		var found						 =	null;
		
		while (currentClass != null) {
			
			if (currentClass[name] === object)	found		 =	currentClass;
			
			currentClass				 =	currentClass.parentClass;
			
		}
		
		//	If we didn't encounter success in the parent hierarchy, we'll assume a side call is being made
		currentClass					 =	found || this;
		
		return currentClass.parentClass[name].apply(this, parameters);
		
	};
	
	//-														
	//-												}		
	//-														
	
	//*														
	//*												}		
	//*														
	
}

//+																														
//+																												}		
//+																														
