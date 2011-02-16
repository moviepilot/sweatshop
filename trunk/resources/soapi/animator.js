//#																														
//#	SOAPI 4.8													Copyright © 2000 - 2009 Dan Williams.					
//#																														

//+																														
//+	SOAPI.Animator																									{	
//+(																													
	
	SOAPI.Animator						 =	SOAPI.Class.extension();
	
	SOAPI.Animator.extend
	
//+)																													

/*(	//~	Documentation					
	///																					
	///		This is an animator object.													
	///																					
)*/

({	//~	Code							
	
	//*														
	//*	Variables										{	
	//*														
	
	parentNode							 :	null,			///		Sprite		
	id									 :	null,
	animations							 :	null,			///		array		
	
	//*														
	//*												}		
	//*														
	
	//*														
	//*	Methods											{	
	//*														
	
	//-														
	//-	construct										{	
	//-														
	
	construct							 :	function
	
	/*(	//~	Documentation					
		///																					
		///		Class constructor.															
		///																					
		///	(	Syntax:																		
		///			object construct( mixed sprite, string id )								
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Class constructor.														
		///																					
		///			Example of construction:												
		///																					
		///				myAnimator			 =	new SOAPI.Animator("elementId", "anim");	
		///				myAnimator			 =	new SOAPI.Animator(element, "anim");		
		///																					
		///			When constructing an animator, there has to be an existing sprite		
		///			for the animator to be added too. The animator constructor function		
		///			has to be fed two arguments: the sprite to add the animator to, and		
		///			the name to give to the animator.										
		///																					
		///			Multiple animators can be added to a single sprite, and as each			
		///			animator is essentially a collection of animations, it may be useful	
		///			to use them to group animations just like layers can be grouped in a	
		///			graphics program. Each animator animation runs independantly of all		
		///			other animations and has its own unique aIndex number, which needs		
		///			to be specifically assigned.											
		///																					
		///			When an animation is created, it does not start automatically. The		
		///			Play() method needs to be invoked in order to start the animation.		
		///																					
		///			The animation navigation methods are distinguished by the fact that		
		///			they start with a capital letter. This is to make them stand out,		
		///			and also to prevent conflict with the existing reset and reverse		
		///			functions.																
		///	)																				
		///	(	Parameters:																	
		///			mixed					The sprite to add the animator to.				
		///			string					The id of the animator.							
		///	)																				
		///	(	Result:																		
		///			void																	
		///	)																				
		///																					
	)*/

	(	//~	Parameters						
		
		sprite,
		id
		
	)
	
	{	//~	Code							
		
		if (isString(sprite))				sprite			 =	document.getElementById(sprite);
		
		this.parentNode					 =	sprite;
		this.parentNode.animators[id]	 =	this;
		this.id							 =	id;
		this.animations					 =	[];
		
	},

	//-														
	//-												}		
	//-														
	
	//*														
	
	//-														
	//-	addAnimation									{	
	//-														
	
	addAnimation						 :	function
	
	/*(	//~	Documentation				
		///																					
		///		Add an animation.															
		///																					
		///	(	Syntax:																		
		///			void addAnimation(														
		///				integer aIndex[, object properties[, object settings[,				
		///				object custom]]]													
		///			)																		
		///																					
		///				object properties {													
		///					[mixed left], [mixed top], [mixed width], [mixed height],		
		///					[mixed clipTop], [mixed clipRight], [mixed clipBottom],			
		///					[mixed clipLeft], [mixed opacity]								
		///				}																	
		///																					
		///				object settings {													
		///					[mixed interval], [integer frameMin], [integer frameMax],		
		///					[integer stepLimit], [integer direction], [boolean repeat],		
		///					[boolean relative], [mixed action]								
		///				}																	
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Adds an animation.														
		///																					
		///			Properties to be animated (and also the interval setting) can be		
		///			assigned an array of values, or a single value. The supplied values		
		///			are then treated as either absolute or relative values, depending on	
		///			the choice made (interval values are always absolute).					
		///																					
		///			The relative setting refers to whether the animation uses absolute		
		///			or relative referencing - however this is still relative to the			
		///			object's parent (container) object. If relative, the properties			
		///			change by the values given, otherwise they change to the values.		
		///																					
		///			When an animation is created, it does not start automatically. The		
		///			Play() method needs to be invoked in order to start the animation.		
		///																					
		///			After the animation is complete, the array of action statements are		
		///			executed one by one.													
		///	)																				
		///	(	Parameters:																	
		///			integer				The index to use for the animation.					
		///			object				An object containing the properties to animate.		
		///				mixed			Value(s) for the left property.						
		///				mixed			Value(s) for the top property.						
		///				mixed			Value(s) for the width property.					
		///				mixed			Value(s) for the height property.					
		///				mixed			Value(s) for the clipTop property.					
		///				mixed			Value(s) for the cliptRight property.				
		///				mixed			Value(s) for the clipBottom property.				
		///				mixed			Value(s) for the clipLeft property.					
		///				mixed			Value(s) for the opacity property.					
		///			object				An object containing the animation settings.		
		///				mixed			Value(s) for the interval setting.					
		///				integer			The minimum frame to play.							
		///				integer			The maximum frame to play.							
		///				integer			The maximum number of steps to play.				
		///				integer			The direction in which to play.						
		///				boolean			Whether to repeat (cycle arrays).					
		///				boolean			Whether property values are relative or absolute.	
		///				mixed			Value(s) for the action(s) to execute when done.	
		///			object				An object containing custom properties to animate.	
		///	)																				
		///	(	Result:																		
		///			void																	
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		aIndex,
		properties,
		settings,
		custom
		
	)
	
	{	//~	Code						
		
	//	if (this.animations[aIndex])		return alert("Animation " + aIndex + " already exists");
		
		//:	Parameters									{	
		
		//	Defaults
		var p							 =	{
			left						 :	[],
			top							 :	[],
			width						 :	[],
			height						 :	[],
			clipTop						 :	[],
			clipRight					 :	[],
			clipBottom					 :	[],
			clipLeft					 :	[],
			opacity						 :	[]
		};
		var s							 =	{
			interval					 :	[ 40 ],
			frameMin					 :	null,
			frameMax					 :	null,
			stepLimit					 :	null,
			direction					 :	1,
			repeat						 :	true,
			relative					 :	false,
			action						 :	[]
		};
		var c							 =	{};
		
		for (var pName in properties)		p[pName]		 =	properties[pName];
		for (var pName in settings)			s[pName]		 =	settings[pName];
		
		if (isObject(custom))				c				 =	custom;
		
		for (var pName in p) {
			
			if (!isObject(p[pName]))		p[pName]		 =	[ p[pName] ];
			
		}
		for (var pName in c) {
			
			if (!isObject(c[pName]))		c[pName]		 =	[ c[pName] ];
			
		}
		
		if (!isObject(s.interval))			s.interval		 =	[ s.interval ];
		if (!isObject(s.action))			s.action		 =	[ s.action   ];
		
		//:											}		
		
		var animation					 =	{
			timer						 :	null,
			frame						 :	0,
			step						 :	1,
			busy						 :	false,
			updated						 :	false,
			properties					 :	p,
			settings					 :	s,
			custom						 :	c
		};
		
		this.animations[aIndex]			 =	animation;
		
	},
	
	//-														
	//-	runAnimation								}	{	
	//-														
	
	runAnimation						 :	function
	
	/*(	//~	Documentation				
		///																					
		///		Run an animation.															
		///																					
		///	(	Syntax:																		
		///			void runAnimation( integer aIndex )										
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Runs an animation.														
		///	)																				
		///	(	Parameters:																	
		///			integer				The animation index.								
		///	)																				
		///	(	Result:																		
		///			void																	
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		aIndex
		
	)
	
	{	//~	Code						
		
		var animation					 =	this.animations[aIndex];
		var properties					 =	animation.properties;
		var settings					 =	animation.settings;
		var custom						 =	animation.custom;
		
		animation.frame					+=	settings.direction;
		animation.step++;
		
		if (
				(settings.frameMax != null && animation.frame > settings.frameMax)
			||	(settings.frameMin != null && animation.frame < settings.frameMin)
			||	(settings.stepLimit && animation.step > settings.stepLimit)
		) {
			
			return this.doActions(aIndex);
			
		}
		
		for (var pName in properties)		properties[pName].jumpBy(settings.direction, settings.repeat);
		for (var pName in custom)			custom[pName].jumpBy(settings.direction, settings.repeat);
		
		animation.updated				 =	false;
		
		if (!this.Update(aIndex))			return this.doActions(aIndex);
		
		function timer(animator, aIndex) {
			return function() { animator.runAnimation(aIndex); };
		}
		
		animation.timer					 =	setTimeout(
			timer(this, aIndex),
			settings.interval.jumpBy(settings.direction, settings.repeat)
		);
		
	},
	
	//-														
	//-												}		
	//-														
	
	//-														
	//-	doActions										{	
	//-														
	
	doActions							 :	function
	
	/*(	//~	Documentation				
		///																					
		///		Do actions.																	
		///																					
		///	(	Syntax:																		
		///			void doActions( integer aIndex )										
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Do actions.																
		///	)																				
		///	(	Parameters:																	
		///			integer				The animation index.								
		///	)																				
		///	(	Result:																		
		///			void																	
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		aIndex
		
	)
	
	{	//~	Code						
		
		this.Pause(aIndex);
		
		for (var i = 0, action; action = this.animations[aIndex].settings.action[i]; i++) {
			
			if (isFunction(action))			action();
			if (isString(action))			eval(action);
			
			if (isArray(action)) {
				
				for (var key in action)		eval(action[key]);
				
			}
			
		}
		
	},
	
	//-														
	//-												}		
	//-														
	
	//*														
	
	//-														
	//-	Play											{	
	//-														
	
	Play								 :	function
	
	/*(	//~	Documentation				
		///																					
		///		Play an animation.															
		///																					
		///	(	Syntax:																		
		///			void Play( integer aIndex )												
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Plays an animation.														
		///	)																				
		///	(	Parameters:																	
		///			integer				The animation index.								
		///	)																				
		///	(	Result:																		
		///			void																	
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		aIndex
		
	)
	
	{	//~	Code						
		
		if (this.animations[aIndex].busy)	return;
		
		this.animations[aIndex].busy	 =	true;
		
		this.runAnimation(aIndex);
		
	},
	
	//-														
	//-	PlayAll										}	{	
	//-														
	
	PlayAll								 :	function
	
	/*(	//~	Documentation				
		///																					
		///		Play all animations.														
		///																					
		///	(	Syntax:																		
		///			void PlayAll( void )													
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Plays all animations.													
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
		
		var aIndex						 =	this.animations.length;
		
		while (aIndex--)					this.Play(aIndex);
		
	},
	
	//-														
	//-												}		
	//-														
	
	//-														
	//-	Stop											{	
	//-														
	
	Stop								 :	function
	
	/*(	//~	Documentation				
		///																					
		///		Stop an animation.															
		///																					
		///	(	Syntax:																		
		///			void Stop( integer aIndex )												
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Stops an animation.														
		///	)																				
		///	(	Parameters:																	
		///			integer				The animation index.								
		///	)																				
		///	(	Result:																		
		///			void																	
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		aIndex
		
	)
	
	{	//~	Code						
		
		this.Pause(aIndex);
		this.Reset(aIndex);
		
	},
	
	//-														
	//-	StopAll										}	{	
	//-														
	
	StopAll								 :	function
	
	/*(	//~	Documentation				
		///																					
		///		Stop all animations.														
		///																					
		///	(	Syntax:																		
		///			void StopAll( void )													
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Stops all animations.													
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
		
		this.PauseAll();
		this.ResetAll();
		
	},
	
	//-														
	//-												}		
	//-														
	
	//-														
	//-	Pause											{	
	//-														
	
	Pause								 :	function
	
	/*(	//~	Documentation				
		///																					
		///		Pause an animation.															
		///																					
		///	(	Syntax:																		
		///			void Pause( integer aIndex )											
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Pauses an animation.													
		///	)																				
		///	(	Parameters:																	
		///			integer				The animation index.								
		///	)																				
		///	(	Result:																		
		///			void																	
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		aIndex
		
	)
	
	{	//~	Code						
		
		this.animations[aIndex].busy	 =	false;
		
		clearTimeout(this.animations[aIndex].timer);
		
	},
	
	//-														
	//-	PauseAll									}	{	
	//-														
	
	PauseAll							 :	function
	
	/*(	//~	Documentation				
		///																					
		///		Pause all animations.														
		///																					
		///	(	Syntax:																		
		///			void PauseAll( void )													
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Pauses all animations.													
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
		
		var aIndex						 =	this.animations.length;
		
		while (aIndex--)					this.Pause(aIndex);
		
	},
	
	//-														
	//-												}		
	//-														
	
	//-														
	//-	Reset											{	
	//-														
	
	Reset								 :	function
	
	/*(	//~	Documentation				
		///																					
		///		Reset an animation.															
		///																					
		///	(	Syntax:																		
		///			void Reset( integer aIndex )											
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Resets an animation.													
		///	)																				
		///	(	Parameters:																	
		///			integer				The animation index.								
		///	)																				
		///	(	Result:																		
		///			void																	
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		aIndex
		
	)
	
	{	//~	Code						
		
		var animation					 =	this.animations[aIndex];
		var properties					 =	animation.properties;
		var settings					 =	animation.settings;
		var custom						 =	animation.custom;
		
		animation.frame					 =	0;
		animation.step					 =	1;
		
		for (var pName in properties)		properties[pName].jumpTo(0);
		for (var pName in custom)			custom[pName].jumpTo(0);
		
		settings.interval.jumpTo(0);
		
	},
	
	//-														
	//-	ResetAll									}	{	
	//-														
	
	ResetAll							 :	function
	
	/*(	//~	Documentation				
		///																					
		///		Reset all animations.														
		///																					
		///	(	Syntax:																		
		///			void ResetAll( void )													
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Resets all animations.													
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
		
		var aIndex						 =	this.animations.length;
		
		while (aIndex--)					this.Reset(aIndex);
		
	},
	
	//-														
	//-												}		
	//-														
	
	//-														
	//-	Reverse											{	
	//-														
	
	Reverse								 :	function
	
	/*(	//~	Documentation				
		///																					
		///		Reverse an animation.														
		///																					
		///	(	Syntax:																		
		///			void Reverse( integer aIndex )											
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Reverses an animation.													
		///	)																				
		///	(	Parameters:																	
		///			integer				The animation index.								
		///	)																				
		///	(	Result:																		
		///			void																	
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		aIndex
		
	)
	
	{	//~	Code						
		
		this.animations[aIndex].settings.direction			*=	-1;
		
	},
	
	//-														
	//-	ReverseAll									}	{	
	//-														
	
	ReverseAll							 :	function
	
	/*(	//~	Documentation				
		///																					
		///		Reverse all animations.														
		///																					
		///	(	Syntax:																		
		///			void ReverseAll( void )													
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Reverses all animations.												
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
		
		var aIndex						 =	this.animations.length;
		
		while (aIndex--)					this.Reverse(aIndex);
		
	},
	
	//-														
	//-												}		
	//-														
	
	//-														
	//-	JumpTo											{	
	//-														
	
	JumpTo								 :	function
	
	/*(	//~	Documentation				
		///																					
		///		Jump to an animation frame.													
		///																					
		///	(	Syntax:																		
		///			void JumpTo( integer aIndex, integer frame )							
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Jumps to to an animation frame.											
		///	)																				
		///	(	Parameters:																	
		///			integer				The animation index.								
		///			integer				The animation frame.								
		///	)																				
		///	(	Result:																		
		///			void																	
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		aIndex,
		frame
		
	)
	
	{	//~	Code						
		
		var animation					 =	this.animations[aIndex];
		var properties					 =	animation.properties;
		var settings					 =	animation.settings;
		var custom						 =	animation.custom;
		
		animation.frame					 =	frame;
		
		for (var pName in properties)		properties[pName].jumpTo(frame, settings.repeat);
		for (var pName in custom)			custom[pName].jumpTo(frame, settings.repeat);
		
		settings.interval.jumpTo(frame, settings.repeat);
		
	},
	
	//-														
	//-	JumpToAll									}	{	
	//-														
	
	JumpToAll							 :	function
	
	/*(	//~	Documentation				
		///																					
		///		Jump to an animation frame in all animations.								
		///																					
		///	(	Syntax:																		
		///			void JumpToAll( integer frame )											
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Jumps to to an animation frame in all animations.						
		///	)																				
		///	(	Parameters:																	
		///			integer				The animation frame.								
		///	)																				
		///	(	Result:																		
		///			void																	
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		frame
		
	)
	
	{	//~	Code						
		
		var aIndex						 =	this.animations.length;
		
		while (aIndex--)					this.JumpTo(aIndex, frame);
		
	},
	
	//-														
	//-												}		
	//-														
	
	//-														
	//-	JumpBy											{	
	//-														
	
	JumpBy								 :	function
	
	/*(	//~	Documentation				
		///																					
		///		Jump by a certain number of frames.											
		///																					
		///	(	Syntax:																		
		///			void JumpBy( integer aIndex, integer frames )							
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Jumps by a certain number of frames.									
		///	)																				
		///	(	Parameters:																	
		///			integer				The animation index.								
		///			integer				The number of frames to jump by.					
		///	)																				
		///	(	Result:																		
		///			void																	
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		aIndex,
		frames
		
	)
	
	{	//~	Code						
		
		var animation					 =	this.animations[aIndex];
		var properties					 =	animation.properties;
		var settings					 =	animation.settings;
		var custom						 =	animation.custom;
		
		animation.frame					+=	frames;
		
		for (var pName in properties)		properties[pName].jumpBy(frames, settings.repeat);
		for (var pName in custom)			custom[pName].jumpBy(frames, settings.repeat);
		
		settings.interval.jumpBy(frames, settings.repeat);
		
	},
	
	//-														
	//-	JumpByAll									}	{	
	//-														
	
	JumpByAll							 :	function
	
	/*(	//~	Documentation				
		///																					
		///		Jump by a certain number of frames in all animations.						
		///																					
		///	(	Syntax:																		
		///			void JumpByAll( integer frames )										
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Jumps by a certain number of frames in all animations.					
		///	)																				
		///	(	Parameters:																	
		///			integer				The number of frames to jump by.					
		///	)																				
		///	(	Result:																		
		///			void																	
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		frames
		
	)
	
	{	//~	Code						
		
		var aIndex						 =	this.animations.length;
		
		while (aIndex--)					this.JumpBy(aIndex, frames);
		
	},
	
	//-														
	//-												}		
	//-														
	
	//-														
	//-	Update											{	
	//-														
	
	Update								 :	function
	
	/*(	//~	Documentation				
		///																					
		///		Updates the display.														
		///																					
		///	(	Syntax:																		
		///			void Update( integer aIndex )											
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Updates the display.													
		///	)																				
		///	(	Parameters:																	
		///			integer				The animation index.								
		///	)																				
		///	(	Result:																		
		///			void																	
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		aIndex
		
	)
	
	{	//~	Code						
		
		var animation					 =	this.animations[aIndex];
		var properties					 =	animation.properties;
		var settings					 =	animation.settings;
		var custom						 =	animation.custom;
		var p							 =	{};
		var values						 =	0;
		var method						 =	(settings.relative) ? "By" : "To";
		
		if (settings.relative && animation.updated)				return;
		
		for (var pName in properties) {
			
			p[pName]					 =	properties[pName].current();
			
			if (p[pName] != null)			values++;
			
		}
		
		if (p.clipTop != null || p.clipRight != null || p.clipBottom != null || p.clipLeft != null) {
			
			this.parentNode["clip" + method](p.clipTop, p.clipRight, p.clipBottom, p.clipLeft);
			
		}
		
		if (p.width   != null || p.height != null)				this.parentNode["size"  + method](p.width, p.height);
		if (p.left    != null || p.top    != null)				this.parentNode["move"  + method](p.left, p.top);
		if (p.opacity != null)									this.parentNode["blend" + method](p.opacity);
		
		for (var pName in custom) {
			
			var value					 =	custom[pName].current();
			
			if (value == null)				continue;
			
			values++;
			
			this.parentNode["style" + method](pName, value);
			
		}
		
		animation.updated				 =	true;
		
		return values;
		
	},
	
	//-														
	//-	UpdateAll									}	{	
	//-														
	
	UpdateAll							 :	function
	
	/*(	//~	Documentation				
		///																					
		///		Update the display for all animations.										
		///																					
		///	(	Syntax:																		
		///			void UpdateAll( void )													
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Updates the display for all animations.									
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
		
		var aIndex						 =	this.animations.length;
		
		while (aIndex--)					this.Update(aIndex);
		
	},
	
	//-														
	//-												}		
	//-														
	
	//-														
	//-	Clear											{	
	//-														
	
	Clear								 :	function
	
	/*(	//~	Documentation				
		///																					
		///		Clear an animation.															
		///																					
		///	(	Syntax:																		
		///			void Clear( integer aIndex )											
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Clears an animation.													
		///	)																				
		///	(	Parameters:																	
		///			integer				The animation index.								
		///	)																				
		///	(	Result:																		
		///			void																	
		///	)																				
		///																					
	)*/
	
	(	//~	Parameters					
		
		aIndex
		
	)
	
	{	//~	Code						
		
		this.Stop(aIndex);
		
		this.animations[aIndex]			 =	null;
		
	},
	
	//-														
	//-	ClearAll									}	{	
	//-														
	
	ClearAll							 :	function
	
	/*(	//~	Documentation				
		///																					
		///		Clear all animations.														
		///																					
		///	(	Syntax:																		
		///			void ClearAll( void )													
		///	)																				
		///	(	Scope:																		
		///			Public																	
		///	)																				
		///	(	Description:																
		///			Clears all animations.													
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
		
		var aIndex						 =	this.animations.length;
		
		while (aIndex--)					this.Clear(aIndex);
		
	}
	
	//-														
	//-												}		
	//-														
	
	//*														
	//*												}		
	//*														
	
});

//+																														
//+																												}		
//+																														
