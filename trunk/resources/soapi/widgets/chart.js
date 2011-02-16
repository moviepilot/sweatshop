//#																														
//#	SOAPI 4.8													Copyright © 2000 - 2010 Dan Williams.					
//#																														

//+																														
//+	SOAPI.Chart																									{	
//+(																													
	
	SOAPI.widgets.chart				 	=	function(p) { new SOAPI.Chart(p); };
	
//+																														
	
	SOAPI.Chart						 	=	SOAPI.Widget.extension();
	
	SOAPI.Chart.extend
	
//+)																													

/*(	//~	Documentation					
	///																					
	///		This class provides a chart widget.										
	///																					
)*/

({	//~	Code							
	
	//*														
	//*	Variables										{	
	//*														
	
	raphael								 :	{ },
	
	controlAction						 :	{ },
	
	barRollAction						 :	{ },
	
	barClickAction						 :	null,
	
	backClickAction						 :	null,
	
	toolTip								 :	null,
	
	hoverBars							 :	{ },
	
	focusedDataSet						 :	0,					// The currently focused data set
	
	selectedView						 :	null,				// An array of values of the focused node ID within a data set
	
	savedSelectedView					 :	null,				// Keeps a reference of where the user browsed
	
	dataReference						 :	null,				// Node tree to reference where the user is browsing
	
	selectedRefNode						 :	{ },				// The currently selected node from the dataReference
	
	calculatedVals					 	 :	null,				// An array of each sets calculated values
	
	bars								 :	null,
	
	path								 :	null,
	
	trendline							 :	null,
	
	controls							 :	{ },
	
	transitionalElements				 :	null,
	
	dataHighlights						 :	null,
	
	grids								 :	null,
	
	dims								 :	null,	
	
	indent								 :	20,
	
	sequentialIndent					 :	0,
	
	toolTipApendVal						 :	'',
	
	inTransition						 :	false,
	
	showVertAxis						 :	true,
	
	showTrendLine						 :	true,
	
	vertAxis							 :	null,
	
	wrap								 :	false,
	
	contiguous							 :	true,
	
	wtype								 :	"chart",
	
	parameters							 :	SOAPI.merge(SOAPI.Panel.prototype.parameters, {
		tabindex						 :	0
	}),
	
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
		var w							 =	result.w;
		var c							 =	w.components;
		
		var canvas						 =	c.canvas =	this.createComponent({
			element						 :	p.element,
			parent						 :	w,
			cType						 :	"chart"
		}, true, false);
		
		// Process extra values
		
		var extras							 =	{
			type						 :	'line',
			vgridcount					 :	4,
			font						 : 	'Arial',
			duration					 :	600,
			colours						 :	{ 1 : "#00A9E2", 2 : "#2AE815", 3 : "#2AE815"},
			gridcolour					 :	"#dddddd",
			data						 :	{ }
		};
		
		// Pull in the attributes for the different chart type
		
		for (eName in  extras) {
			
			if(w.attributes[eName] != null) {
				
				if(typeof extras[eName] == 'object') 		extras[eName] = eval( "(" + w.attributes[eName].value + ")" );
				else
					extras[eName] 		 				 =	w.attributes[eName].value;
				
			}
			
		}
		
		this.parameters 				 = 	SOAPI.merge(this.parameters,extras);
		
		//~ Speed things up for slower browsers.
		
		if (SOAPI.speedtest == 'poor') 		this.parameters.duration /= 1.5;
		
		this.savedSelectedView			 = 	new Array();
		this.selectedView				 = 	new Array();
		this.calculatedVals				 =	new Array();
		this.grids						 =	new Object();
		this.transitionalElements		 =	new Object();
		this.dims						 =	new Object();
		this.dataReference				 =	new Object();
		
		// Instanciate Raphael
		
		this.raphael 					 = 	Raphael(
											
											this.components.canvas,
											this.components.canvas.get('width'),
											this.components.canvas.get('height')
											
											);
		
		//~~ Make sure the fix for webkit b
		
		this.raphael.safari();
		
		//~~ Custom attribute to save a value with each dot
		
		this.raphael.customAttributes.dataId = function(num){ return num; };
		
		if (this.parameters.data != '') {
			
			// Set up the initial data to view
			
			var ln 						 =	this.parameters.data.length;
			
			while (ln--) {
				
				this.selectedView.push(0);
				this.savedSelectedView.push(0);
				this.calculatedVals.push(new Array());
				
			}
			
			this.selectedView[this.focusedDataSet]	 =	this.parameters.data[this.focusedDataSet].data.length - 1;
			
			// Build the dataReference Object
						
			this.dataReference.children  =	this.buildDataReference(this.parameters.data.length - 1);
			
			this.selectedRefNode		 =	this.dataReference.children[this.selectedView[this.focusedDataSet]];
			
			switch (this.parameters.type) {
				
				case 'line':
					this.generateLineChart();
				break;
			
				case 'bar':
					this.generateBarChart();
				break;
				
			}
			
		}
		
		return result;
		
	},
	
	//-														
	//-												}		
	//-														

	//-														
	//-	buildDataReference									{	
	//-														
	
	buildDataReference					 :	function
	
	(	//~	Parameters					
	
		setCount,
		incrementer,
		parentRef
				
	)	
	
	{	//~	Code	

		var obj 					 = 	new Object();
			
		if (incrementer == undefined) incrementer = 0;
		else
			incrementer++;
		
		var ln 						 = 	this.parameters.data[incrementer].viewTitles.length;
		
		for (var i = 0; i < ln; i++) {
			
			// Check if the parent value is null, if not, then skip
			
			obj[i]					 =	new Object();
			
			// This assumes that the first array of data is full.
			// And builds the data reference
			
			var node 				 =	new Object();
			
			if (incrementer > 0) {
				
				node.nodes 			 =	new Array();
				node.highlightGroups =	new Array();
				node.max 			 = 	0;
				
				// Add in the reference to the data object
				
				this.parameters.data[incrementer].data.push(node);
				
			} else {
				
				node 				 =	this.parameters.data[incrementer].data[i];
				
			}
			
			obj[i].node 			 =	node;
			obj[i].parent		 	 = 	(parentRef != undefined ? parentRef : this.dataReference);
			
			// Then build the calculatedVals reference 
			
			var calcVal				 =	new Array();
			
			this.calculatedVals[incrementer].push(calcVal);
			
			obj[i].node.calculatedVals	 = 	calcVal;
			
			if (parentRef && parentRef.node.nodes[i] === null) continue;
			
			if (setCount != incrementer) obj[i].children = this.buildDataReference(setCount,incrementer,obj[i]);
		
		}
		
		return obj;
		
	},
	
	//-														
	//-												}		
	//-														

	//-														
	//-	updateDataStore									{	
	//-														
	
	updateDataStore				 		 :	function
	
	(	//~	Parameters					
	
		dataId,
		getStr
		
	)	
	
	{	//~	Code
		
		// This will go away and get the data - the timeout is only to simulate that.
		
		var data 						 =	eval("(" + getStr + ")");
		var obj 						 =	this;
		
		// This is further fakery, so that we're not loading too much daily data
		
		var holderLn 					 =	this.parameters.data[this.focusedDataSet + 1].data.length;
		var dataLn 						 =	data.length;
		var count 						 =	0;
		var recalculate					 =	false;
		
		for (var i = 0; i < holderLn; i++) {
			
			if (data[count]) {
			
				this.parameters.data[this.focusedDataSet + 1].data[i].highlightGroups		 =	data[count].highlightGroups.slice(0);
				this.parameters.data[this.focusedDataSet + 1].data[i].max					 =	parseInt(data[count].max);
				this.parameters.data[this.focusedDataSet + 1].data[i].nodes					 =	data[count].nodes.slice(0);
				
				if (parseInt(data[count].max) > this.parameters.data[this.focusedDataSet + 1].max) {
					
					this.parameters.data[this.focusedDataSet + 1].max = parseInt(data[count].max);
									
				}
			
			}
			
			count++;
			
			if(count == dataLn) count = 0;
			
		}
		
		setTimeout(function(){ obj.chartIncrementor(dataId,'set'); },50);
	
	},
	
	//-														
	//-												}		
	//-														
		
	//-														
	//-	chartIncrementor								{	
	//-														
	
	chartIncrementor					 :	function
	
	(	//~	Parameters					
	
		dataId,
		type
		
	)	
	
	{	//~	Code
		
		if (type == 'view') {
			
			this.inTransition		 	 =	true;
			
			// Choose the correct incrementor
			
			var increment 			 	 =	false;
			
			if (this.wrap && !this.contiguous) 	increment 	 = 	this.incrementWrapNonCont(dataId);
			if (!this.wrap && this.contiguous) 	increment 	 =	this.incrementContNonWrap(dataId);
			
			if (increment) this.controlAction();
			else {
				
				this.inTransition		 =	false;
				
				this.showMessage('No more values in this direction');
			
			}
							
		} else if (type == 'set') {
			
			// Check if the child element has anything in it
			
			if (this.selectedRefNode.children && this.selectedRefNode.node.nodes[dataId] != null) {
				
				this.inTransition		 =	true;
			
				if (this.selectedRefNode.children[dataId].node.nodes.length == 0) {
					
					this.updateDataStore(dataId,this.parameters.data[this.focusedDataSet + 1].getStr);
					
				} else {
					
					this.savedSelectedView[this.focusedDataSet] 	 = 	this.selectedView[this.focusedDataSet];
					
					this.selectedRefNode 							 =	this.selectedRefNode.children[dataId];
					this.focusedDataSet				 				 +=	1;
					this.selectedView[this.focusedDataSet] 			 =	dataId;
					
					this.barClickAction();
					
				}
			
			} else {
				
				this.showMessage('You are at the maximum data depth');
				
			}
			
		}
			
	},
	
	//-														
	//-												}		
	//-														

	//-														
	//-	incrementWrapNonCont								{	
	//-														
		
	incrementWrapNonCont				 :	function
	
	(	//~	Parameters					
	
		increment
		
	)	
	
	{	//~	Code
		
		var incVal						 =	this.selectedView[this.focusedDataSet];
		var totalLength			 		 = 	0;
		
		for (var el in this.selectedRefNode.parent.children) totalLength++;
		
		incVal 					 		 += increment;
		
		if (incVal >= totalLength) 			incVal  = 0;
		if (incVal < 0) 					incVal  = totalLength - 1;
		
		if (this.selectedRefNode.parent.children[incVal].node.calculatedVals[0] != null) {
			
			this.selectedView[this.focusedDataSet]   = 	incVal;
			this.selectedRefNode					 =	this.selectedRefNode.parent.children[incVal];
			
			return true;
		
		}
		
		return false;
		
	},
	
	//-														
	//-												}		
	//-														
	
	//-														
	//-	incrementWrapCont								{	
	//-														
		
	incrementContNonWrap			 	 :	function
	
	(	//~	Parameters					
	
		increment
		
	)	
	
	{	//~	Code
	
		var nodeTotal					 =	this.parameters.data[this.focusedDataSet].viewTitles.length - 1;
		var incVal						 =	this.selectedView[this.focusedDataSet];
		var refNode						 =	null;
		var parentIncrement				 =	false;
		
		incVal 					 		 += increment;
		
		if (incVal ==  -1) {
			
			refNode 					 =	this.findRelation(this.selectedRefNode,'fromBeginning',this.focusedDataSet);
			incVal  					 = 	nodeTotal;
			parentIncrement 			 =	true;
			
		}
		
		if (incVal > nodeTotal) {
			
			refNode 					 =	this.findRelation(this.selectedRefNode,'fromEnd',this.focusedDataSet);
			incVal  					 =	0;
			parentIncrement 			 =	true;
			
		}
		
		if (parentIncrement && refNode != null) {
			
			this.selectedView[this.focusedDataSet]   = 	incVal;
			this.selectedRefNode 					 = 	refNode.children[incVal];
			
			this.checkAndCalcSet();
			
			this.toolTipApendVal 		 =	'';
			ln							 =	this.focusedDataSet;
			
			while (ln--) {
				
				this.toolTipApendVal 	 += ' ' + this.parameters.data[ln].viewTitles[this.selectedView[ln]];
				
			}
			
			return true;
		
		} else if (!parentIncrement) {
		
			this.selectedView[this.focusedDataSet]   = 	incVal;
			this.selectedRefNode					 =	this.selectedRefNode.parent.children[incVal];
			
			this.checkAndCalcSet();
			
			return true;
		
		}
		
		return false;
		
	},
	
	//-														
	//-												}		
	//-														

	
	//-														
	//-	checkAndCalcSet								{	
	//-														
		
	checkAndCalcSet			 	 	 	 :	function
	
	(	//~	Parameters					
	
		// None
		
	)	
	
	{	//~	Code
	
		if (this.selectedRefNode.node.calculatedVals.length == 0) {
		
			for (var el in this.selectedRefNode.parent.children) {
			
				if (this.parameters.type == 'line') {
								
					this.selectedRefNode.parent.children[el].node.calculatedVals.push(this.calcDotsAndPaths (
				
											this.dims[this.focusedDataSet].botRgt.y,
											this.dims[this.focusedDataSet].normalise,
											this.dims[this.focusedDataSet].topLft.x,
											this.dims[this.focusedDataSet].hGrid,
											this.selectedRefNode.parent.children[el].node.nodes,
											this.parameters.data[this.focusedDataSet].nodeLabels.length
												
											));
			
				} else {
					
					this.selectedRefNode.parent.children[el].node.calculatedVals.push(this.calcBarVals (
			
											this.dims[this.focusedDataSet].botRgt.y,
											this.dims[this.focusedDataSet].normalise,
											this.dims[this.focusedDataSet].topLft.x,
											this.dims[this.focusedDataSet].hGrid,
											this.selectedRefNode.parent.children[el].node.nodes,
											this.parameters.data[this.focusedDataSet].nodeLabels.length
											
											));
				
				}
			
			}
		
		}
		
	},
	
	//-														
	//-												}		
	//-		

	//-														
	//-	findRelation									{	
	//-														
		
	findRelation						 :	function
	
	(	//~	Parameters					
	
		node,
		type,
		selected,
		incrementor
		
	)	
	
	{	//~	Code
	
		var nodeRef = node.parent;
		
		if (incrementor == undefined) 		incrementor = selected;
		
		if (type == 'fromBeginning') {
			
			if (nodeRef && nodeRef.children[this.selectedView[incrementor] - 1] == undefined) {
				
				nodeRef 				 =	this.findRelation(nodeRef,'fromBeginning',selected,--incrementor);
			
			} else if (nodeRef && nodeRef.children[this.selectedView[incrementor] - 1]) {
				
				nodeRef 				 =	nodeRef.children[this.selectedView[incrementor] - 1];
				
				var maxId 				 = 	-1;
				var ln 					 = 	selected - incrementor - 1;
				
				for (var el in nodeRef.children) maxId++;
				
				while (ln--) {
					
					nodeRef 			 = 	nodeRef.children[maxId];
					
					this.selectedView[ln + 1] 	 = 	maxId;
				
				}
				
				this.selectedView[incrementor] 	 -= 1;
				
			} else {
			
				return null;
			
			}
			
		}
		
		if (type == 'fromEnd') {
			
			if (nodeRef && nodeRef.children[this.selectedView[incrementor] + 1] == undefined) {
				
				nodeRef 				 =	this.findRelation(nodeRef,'fromEnd',selected,--incrementor);
			
			} else if (nodeRef && nodeRef.children[this.selectedView[incrementor] + 1]) {
			
				nodeRef 				 = 	nodeRef.children[this.selectedView[incrementor] + 1];
				
				var ln 					 = 	selected - incrementor - 1;
				
				while (ln--) {
					
					nodeRef 			 =	nodeRef.children[0];
					
					this.selectedView[ln + 1] 	 = 	0;
				
				}
				
				this.selectedView[incrementor] 	 += 1;
				
			} else {
			
				return null;
			
			}
			
		}
		
		return nodeRef;
		
	},
	
	//-														
	//-												}		
	//-														
				
	//-														
	//-	generateLineChart								{	
	//-														
	
	generateLineChart					 :	function
	
	(	//~	Parameters					
	
		//	None
		
	)	
	
	{	//~	Code
		
		// Generate just the first chart		
		
		this.width						 =	this.components.canvas.get('width');
		this.height						 =	this.components.canvas.get('height');
				
		this.dims[this.focusedDataSet]	 = 	this.calcChartDims(this.indent,this.parameters.data[this.focusedDataSet].nodeLabels.length);
		
		// Create the grid
		
		this.grids[this.focusedDataSet]	 = 	this.drawGrid(
												
											this.dims[this.focusedDataSet].topLft.x,
											this.dims[this.focusedDataSet].topLft.y,
											this.dims[this.focusedDataSet].chartWidth,
											this.dims[this.focusedDataSet].chartHeight,
											this.dims[this.focusedDataSet].hGrid,
											this.dims[this.focusedDataSet].vGrid,
											this.parameters.data[this.focusedDataSet].nodeLabels,
											'left'
											
											);
		
		// Calc all the paths for the first data set
		
		this.dots						 =	this.raphael.set();
		this.hoverBars					 =	this.raphael.set();
		this.dataHighlights				 =	this.raphael.set();
		this.vertAxis					 =	this.raphael.set();
		
		if (this.showTrendLine) {
			
			this.trendLine 				 =	this.raphael.path('M 0 0').attr({
			
				stroke 					 :	'#ccc',
				'stroke-width'			 :	4,
				'stroke-linecap' 		 :	'round',
				opacity					 :	0.6
				
				});
		
		}
		
		this.checkAndCalcSet();
				
		// Create the controls
		
		this.controls					 =	this.createControls(((this.dims[this.focusedDataSet].chartWidth / 2) + this.dims[this.focusedDataSet].topLft.x),0);
		
		// Add in the tool tip
		
		this.createToolTip();
		
		// Load up the first path set, and dot vals
		
		this.displayCurrentDataSet();
		
		// Set up the transitions
		
		this.barClickAction 			 = 	this.transitionToDataSet_Line;
		this.backClickAction			 = 	this.transitionFromDataSet_Line;
		
	},
	
	//-														
	//-												}		
	//-														
	
	//-														
	//-	generateBarChart								{	
	//-														
	
	generateBarChart					 :	function
	
	(	//~	Parameters					
	
		//	None
		
	)	
	
	{	//~	Code						

		// Generate just the first chart		
		
		this.width						 =	this.components.canvas.get('width');
		this.height						 =	this.components.canvas.get('height');
				
		this.dims[this.focusedDataSet]	 = 	this.calcChartDims(this.indent,this.parameters.data[this.focusedDataSet].nodeLabels.length,true);
		
		// Create the grid
		
		this.grids[this.focusedDataSet]	 = 	this.drawGrid(
												
											this.dims[this.focusedDataSet].topLft.x,
											this.dims[this.focusedDataSet].topLft.y,
											this.dims[this.focusedDataSet].chartWidth,
											this.dims[this.focusedDataSet].chartHeight,
											this.dims[this.focusedDataSet].hGrid,
											this.dims[this.focusedDataSet].vGrid,
											this.parameters.data[this.focusedDataSet].nodeLabels,
											'middle'
											
											);
		

		this.bars						 =	this.raphael.set();
		this.hoverBars					 =	this.raphael.set();
		this.dataHighlights				 =	this.raphael.set();
		this.vertAxis					 =	this.raphael.set();
		
		if (this.showTrendLine) {
			
			this.trendLine 				 =	this.raphael.path('M 0 0').attr({
			
				stroke 					 :	'#ccc',
				'stroke-width'			 :	4,
				'stroke-linecap' 		 :	'round',
				opacity					 :	0.6
				
				});
		
		}
		
		this.checkAndCalcSet();
		
		// Create the controls
		
		this.controls					 =	this.createControls(((this.dims[this.focusedDataSet].chartWidth / 2) + this.dims[this.focusedDataSet].topLft.x),0);
		
		// Add in the tool tip
		
		this.createToolTip();
		
		// Load up the first path set, and dot vals
		
		this.displayCurrentDataSet();
		
		// Set up the transitions
		
		this.barClickAction 			 = 	this.transitionToDataSet_Bar;
		this.backClickAction			 =	this.transitionFromDataSet_Bar;
		
	},
	
	controlAction						 :	function
		
	(	//~	Parameters					
	
		//	None
				
	)	
	
	{	//~	Code	
		
		var text						 =	this.parameters.data[this.focusedDataSet].viewTitles[this.selectedView[this.focusedDataSet]] + ' ' + this.toolTipApendVal;
		var ln							 =	0;
		var node 						 =	this.selectedRefNode.node.calculatedVals[0];
		
		switch (this.parameters.type) {
			
			case 'bar':
				
				ln						 =	node.length;
				while (ln--) {
				
					var height			 =	node[ln][3];
					
					this.bars[ln].stop().animate({ y : node[ln][1] , height :  (height == null ? 0 : height) } , this.parameters.duration , '<>');
					
					if (height == null) {
						
						this.grids[this.focusedDataSet][0][ln].hide();
						
					} else {
						
						this.grids[this.focusedDataSet][0][ln].show();
						
					}
					
				}
				
			break;
		
			case 'line':
				
				if (window.ie || SOAPI.speedtest == 'poor') {
					
					var obj = this;
					
					ln					 =	this.dots.length;
					
					this.path.stop().animate({ path: node.path }, this.parameters.duration, '<>',function(){ obj.dots.show(); });
					this.dots.hide();
					
					while (ln--) {
					
						this.dots[ln].attr({
						
							cx 			 :  node.dots[ln][0],
							cy 			 :	(node.dots[ln][1] == null ? this.dims[this.focusedDataSet].botRgt.y :  node.dots[ln][1]),
							opacity		 :	(node.dots[ln][1] == null ? 0 :  1)
							
							});
						
						
						if (node.dots[ln][1] == null) {
						
							this.grids[this.focusedDataSet][0][ln].hide();
						
						} else {
							
							this.grids[this.focusedDataSet][0][ln].show();
							
						}
						
					}
					
				} else {
					
					ln					 =	this.dots.length;
					
					this.path.stop().animate({ path: node.path }, this.parameters.duration, '<>');
					
					while (ln--) {
						
						this.dots[ln].stop().animate({
							
							cx 		 	 :  node.dots[ln][0],
							cy 			 :	(node.dots[ln][1] == null ? this.dims[this.focusedDataSet].botRgt.y :  node.dots[ln][1]),
							opacity		 :	(node.dots[ln][1] == null ? 0 :  1)
							
							} , this.parameters.duration , '<>');
							
						if (node.dots[ln][1] == null) {
						
							this.grids[this.focusedDataSet][0][ln].hide();
						
						} else {
							
							this.grids[this.focusedDataSet][0][ln].show();
							
						}
					
					}
					
				}
				
			break;
			
		}
		
		if (this.showTrendLine)				this.trendLine.animate({ path : this.calcTrendLine() },this.parameters.duration,'<>');
		
		this.inTransition				 =	false;
		
		this.controls[1].attr({ text	 :	text });
		this.toolTip.hide();
		this.updateDataHighlights();
		
		return false;
		
	},
	
	barAction							 :	function
			
	(	//~	Parameters					
	
		dataId,
		state
		
	)	
		
	{	//~	Code	
		
		if (this.selectedRefNode.node.nodes[dataId] == null) return false;
		
		var txt1						 =	this.selectedRefNode.node.nodes[dataId] + ' ' + this.parameters.data[this.focusedDataSet].unit;
		var txt2						 =	this.parameters.data[this.focusedDataSet].nodeLabels[dataId] + ' ' +  this.parameters.data[this.focusedDataSet].viewTitles[this.selectedView[this.focusedDataSet]]  + ' ' + this.toolTipApendVal;
		var x							 =	0;
		var y							 =	0;
		
		switch (this.parameters.type) {
			
			case 'bar':
				
				if (window.ie || SOAPI.speedtest == 'poor') {
					
					if (state == 'over') {
					
						this.bars[dataId].attr({ fill : this.parameters.colours[this.focusedDataSet + 1] });
					
					} else if(this.bars[dataId]) this.bars[dataId].attr({ fill : this.parameters.colours[this.focusedDataSet] });
				
				
				} else {
					
					if (state == 'over') {
					
						this.bars[dataId].animate({ fill : this.parameters.colours[this.focusedDataSet + 1] } , 200 , '<>' );
					
					} else if(this.bars[dataId]) this.bars[dataId].animate({ fill : this.parameters.colours[this.focusedDataSet] } , 200);
					
				}
				
				x 						 =	(this.selectedRefNode.node.calculatedVals[0][dataId][0] + (this.selectedRefNode.node.calculatedVals[0][dataId][2] / 2));
				y 						 = 	this.selectedRefNode.node.calculatedVals[0][dataId][1];
				
			break;
		
			case 'line':
				
				if (window.ie || SOAPI.speedtest == 'poor') {
					
					if (state == 'over') {
					
						this.dots[dataId].attr({ r : 5 });
					
					} else if(this.dots[dataId]) this.dots[dataId].attr({ r : 4 });;
				
				
				} else {
					
					if (state == 'over') {
					
						this.dots[dataId].animate({ r : 6 } , 200 , '<>' );
					
					} else if(this.dots[dataId]) this.dots[dataId].animate({ r : 4 } , 200);
					
				}
				
				x 						 =	this.selectedRefNode.node.calculatedVals[0].dots[dataId][0];
				y 						 = 	this.selectedRefNode.node.calculatedVals[0].dots[dataId][1];
			
			break;
			
		}
		
		// Update the tool tip.
		
		this.updateToolTip(
											
											x,
											y,
											txt1,
											txt2
											
											);
		
		
		return true;
	
	},
	
	displayCurrentDataSet				 :	function
		
	(	//~	Parameters					
	
		//	None
		
	)	
	
	{	//~	Code	
		
		// Put any highlights in vert axis, so that they are at the bottom, but above the backgound.
		
		this.dataHighlights.toFront();
		this.updateDataHighlights();
		this.updateVertAxis();
		
		if (this.showTrendLine) 			this.trendLine.show().toFront();
		
		var ln 							 =	0;
		var i							 =	0;
		
		// Work out what to show for the toolTip, and control
		
		this.toolTipApendVal 			 =	'';
		ln								 =	this.focusedDataSet;
		
		while (ln--) {
			
			this.toolTipApendVal += ' ' + this.parameters.data[ln].viewTitles[this.selectedView[ln]];
			
		}
		
		// Update the controls.
		
		this.controls[1].attr({ text: this.parameters.data[this.focusedDataSet].viewTitles[this.selectedView[this.focusedDataSet]] + ' ' + this.toolTipApendVal });
		this.controls[0].attr({ fill : this.parameters.colours[this.focusedDataSet] });
		
		// Get the current node, and do bars and lines.
		
		var node 						 =	this.selectedRefNode.node.calculatedVals[0];
		
		if (this.parameters.type == 'bar') {
		
			this.bars					 =	this.raphael.set();
			
			ln							 =	node.length;
			for (i = 0; i < ln; i++) {
				
				var bar 				 =	this.bars.push(this.raphael.rect(node[i][0], node[i][1], node[i][2],node[i][3]));
				bar.attr({
					
					stroke			 	 :	this.parameters.gridcolour,
					fill			 	 : 	this.parameters.colours[this.focusedDataSet],
					'stroke-width'	 	 :	1,
					dataId 			 	 :	i
					
					});
				
				if (node[i][3] == null) {
					
					this.grids[this.focusedDataSet][0][i].hide();
					
				} else {
					
					this.grids[this.focusedDataSet][0][i].show();
					
				}
				
			}
		
		} else if (this.parameters.type == 'line') {
			
			this.dots					 =	this.raphael.set();
			this.path					 =	this.raphael.path(node.path);
			
			this.path.attr({
					
					fill			 	 :	'none',
					'stroke-width'	 	 :	4,
					stroke 			 	 :	this.parameters.colours[this.focusedDataSet],
					'stroke-linecap' 	 :	'round'
					
					});
			
			ln							 =	node.dots.length;
			for (i = 0; i < ln; i++) {
				
				var cx 					 =	node.dots[i][0];
				var cy					 = 	node.dots[i][1];
				
				this.dots.push(this.raphael.circle(cx, (cy == null ? this.dims[this.focusedDataSet].botRgt.y : cy), 4));
				this.dots[i].attr({
						
					fill			 	 :	'#fff' ,
					stroke				 : 	this.parameters.colours[this.focusedDataSet],
					'stroke-width'		 :	2,
					dataId 				 :	i,
					opacity 			 : 	(cy == null ? 0 : 1)
						
					});
				
				if (cy == null) {
					
					this.grids[this.focusedDataSet][0][i].hide();
					
				} else {
					
					this.grids[this.focusedDataSet][0][i].show();
					
				}
				
			}
			
		}
			
		if (this.showTrendLine)				this.trendLine.attr({ path : this.calcTrendLine() });
		
		// Organise the tooltip, and put the hover bars to the front
		
		this.toolTip[2].toFront();
		this.toolTip[0].toFront();
		this.toolTip[1].toFront();
		
		this.updateHoverBars((this.parameters.type == 'bar' ? true : false));
		
		return false;
		
	},
	
	calcTrendLine						 :	function
		
	(	//~	Parameters					
	
		//	None
		
	)	
	
	{	//~	Code	
		
		var path 						 =	'';
		var nodes 						 =	this.selectedRefNode.node.nodes.slice(0);
		var dataId 						 =	this.parameters.data[this.focusedDataSet].data.indexOf(this.selectedRefNode.node);
		var trendVals 					 =	new Array();
		var i 							 =	0;
		var ln 							 =	0;
		
		if (dataId > 0) {
			
			var ln						 = 	this.parameters.data[this.focusedDataSet].data[dataId - 1].nodes.length;
			
			while (ln--) {
				
				if (this.parameters.data[this.focusedDataSet].data[dataId - 1].nodes[ln] != null) {
					
					nodes.unshift(this.parameters.data[this.focusedDataSet].data[dataId - 1].nodes[ln]);
					i++;
				}
				
				if (i == 4) break;
				
			}
			
			i 							 =	4;
			
		}
		
		ln 								 =	nodes.length;
		for (i; i < ln; i++) {
			
			var val 					 =	(parseInt(nodes[i - 4]) + parseInt(nodes[i - 3]) + parseInt(nodes[i - 2]) + parseInt(nodes[i - 1]) + parseInt(nodes[i])) / 5;
			
			trendVals.push((isNaN(val) ? 0 : val));
			
		}
		
		// If the chart is a bar chart, then the dims will be all out of wack with a line.
		
		var hgrid						 =	this.dims[this.focusedDataSet].hGrid;
		
		if (this.parameters.type == 'bar') {
			
			hgrid 						 =	this.calcChartDims(this.indent,this.parameters.data[this.focusedDataSet].nodeLabels.length).hGrid;
		
		}
		
		path 							 =	this.calcDotsAndPaths (
				
											this.dims[this.focusedDataSet].botRgt.y,
											this.dims[this.focusedDataSet].normalise,
											this.dims[this.focusedDataSet].topLft.x,
											hgrid,
											trendVals,
											trendVals.length
												
											).path;
				
		return path;
	
	},
	
	updateHoverBars						 :	function
		
	(	//~	Parameters					
	
		forBars
		
	)	
	
	{	//~	Code
		
		forBars							 =	typeof(forBars) == undefined ? false : forBars;
		
		var i 							 =	0;
		var ln							 =	0;
		var bar							 =	{ };
		var width						 =	this.dims[this.focusedDataSet].hGrid;
		var height						 =	this.dims[this.focusedDataSet].chartHeight;
		var vals						 =	this.selectedRefNode.node.calculatedVals[0];
		
		var handlers					 =	SOAPI.Chart_Handlers;
		
		if (this.hoverBars.length > 0) {
			
			ln							 =	this.hoverBars.length;
			while (ln--) {
				
				bar 					 =	this.hoverBars[ln];
				
				SOAPI.Event.removeEventHandler(bar.node,	'mouseover',	'chart');
				SOAPI.Event.removeEventHandler(bar.node,	'mouseout',		'chart');
				SOAPI.Event.removeEventHandler(bar.node,	'mousedown',	'chart');
				
				bar.remove();
				
			}
			
			this.hoverBars 				 =	this.raphael.set();
			
		}
		
		ln								 =	vals.length || vals.dots.length;	
		for (i = 0; i < ln; i++) {
			
			bar							 =	this.raphael.rect((forBars ? vals[i][0] : vals.dots[i][0] - (width / 2)), 32 , width , height);
			bar.attr({
						stroke 			 :	'none',
						fill 			 :	'#000',
						opacity 		 : 	0,
						dataId 			 : 	i,
						cursor 			 : 	'pointer'
						});
			
			SOAPI.Event.addEventHandler(bar.node,	'mouseover',	[this , handlers.hoverbar.mouseover],	'chart');
			SOAPI.Event.addEventHandler(bar.node,	'mouseout',		[this , handlers.hoverbar.mouseout],	'chart');
			SOAPI.Event.addEventHandler(bar.node,	'mousedown',	[this , handlers.hoverbar.mousedown],	'chart');	
			
			this.hoverBars.push(bar);
			
		}
		
	},
	
	//-														
	//-												}		
	//-														
	
	//-														
	//-	lineAnimate										{	
	//-														
		
	drawGrid							 :	function
	
	(
		
		startX,
		startY,
		width,
		height,
		xIntVal,
		yIntVal,
		labels,
		txtAlign
		
	)
	
	{
		
		// Draw hlines
		
		var incVal						 =	startX;
		
		var gridObject					 =  this.raphael.set(this.raphael.set(),this.raphael.set(),this.raphael.set());
		var ln							 =	labels.length + (txtAlign == 'left' ? 0 : 1);
		
		for (i = 0; i < ln; i++) {
						
			var grid 					 =	this.raphael.path('M ' + [ incVal , startY ] + ' v ' + height);
			grid.attr({
						
				stroke					 :	this.parameters.gridcolour,
				'stroke-width'			 :	1
				
				});
			
			if(labels[i]) {
			
				var txtX				 =	0;
				
				switch (txtAlign) {
					
					case 'left':
						txtX			 =	incVal;
					break;
				
					case 'middle':
					default:
						txtX			 =	incVal + (xIntVal / 2);
					break;
				
				}
							
				var text 				 =	this.raphael.text(txtX , (startY + height + (window.ie ?  15 : 12)) , labels[i]);
				text.attr({
							
					fill			 	 :	this.parameters.colours[this.focusedDataSet],
					'font-family' 	 	 : 	this.parameters.font,
					'font-size' 	 	 : 	10
					
					});
				
				gridObject[0].push(text);
				
			}
			
			incVal += xIntVal;
			
			gridObject[1].push(grid);
			
		}
		
		// Draw vlines
		
		incVal							 =	startY;
		ln								 =	Math.round(height / yIntVal);
		
		for (var i = 0; i <= ln; i++) {
			
			grid						 =	this.raphael.path('M ' + [ startX , incVal ] + ' h ' + width );
			grid.attr({
						
				stroke					 :	this.parameters.gridcolour,
				'stroke-width'			 :	1
						
				});
			
			incVal += yIntVal;
			
			gridObject[2].push(grid);
			
		}
		
		return gridObject;
		
	},
	
	calcDotsAndPaths					 :	function
	
	(
	
		zeroPoint,
		normalise,
		startX,
		xIntVal,
		data,
		hValCount
		
	)
	
	{
		
		if (data.length > 0) {
			
			var dotsAndPaths 				 =	new Object();
			
			var x	 						 =	startX;
			var y	 						 =	0;
			
			dotsAndPaths.path				 =	'';
			dotsAndPaths.dots				 =	new Array();
			
			for(var j = 0; j < hValCount; j++) {
				
				if(j) dotsAndPaths.path		 +=	' C ' + [ (x + (xIntVal / 2)) , y , ((x +=	xIntVal) - (xIntVal / 2)) , (y = zeroPoint - normalise * data[j]) , x , y];
				else
					dotsAndPaths.path		 +=	' M ' + [ x , (y =	zeroPoint - normalise * data[j])];
				
				dotsAndPaths.dots.push([x,(data[j] == null ? null : y)]);
				
			}
			
			return dotsAndPaths;
	
		}
		
		return null;
	
	},
	
	calcBarVals						 	 :	function
	
	(
	
		zeroPoint,
		normalise,
		startX,
		xIntVal,
		data,
		hValCount
		
	)
	
	{
		
		if (data.length > 0) {
		
			var bars 					 =	new Array();
			var x 						 =	startX;
			var y 						 =	0;
			
			for(var j = 0; j < hValCount; j++) {
				
				var rect				 =	new Array();
				
				if(j) x 				 +=	xIntVal;
				
				y 						 =	zeroPoint - normalise * data[j];
				
				height					 =	(data[j] == null ? null : normalise * data[j]);
				
				rect.push(x,y,xIntVal,height);
				
				bars.push(rect);
			
			}
				
			return bars;
		}
		
		return null;
	
	},
	
	createControls						 :	function
	
	(
		
		x,
		y
		
	)
	
	{
		
		var controls					 =	this.raphael.set();
		var handlers					 =	SOAPI.Chart_Handlers;
		
		x -= 75;
		
		controls.push(this.raphael.rect(x, y, 150, 26, 13).attr({fill: this.parameters.colours[this.focusedDataSet] , stroke: "none"}));
		controls.push(this.raphael.text(x + 75, y + 13, '').attr({
						
			fill			 			 :	'#fff',
			stroke						 :	'none',
			'font-family' 				 :	this.parameters.font ,
			'font-size' 				 :	11
						
			}));
		
		// Fix y for IE
		
		if (window.ie) 						controls[1].attr({ y : y + 15 });
		
		if (this.parameters.data[this.focusedDataSet].data.length > 1) {
			
			controls.push(this.raphael.circle(x + 137, y + 13, 10).attr({
				
				fill					 :	'#fff',
				stroke 					 : 	'none',
				cursor 					 : 	'pointer',
				dataId 					 : 	1
				
				}));
			
			controls.push(this.raphael.path('M ' + [ (x + 133), (y + 8) ] + ' v 10 l 10 , -5 z').attr({
				
				fill				 	 : 	'#000',
				cursor 					 : 	'pointer',
				stroke 					 : 	'none',
				dataId 					 : 	1
				
				}));
			
			controls.push(this.raphael.circle(x + 13, y + 13 , 10).attr({
				
				fill					 :	'#fff',
				stroke 					 :	'none',
				cursor 					 : 	'pointer',
				dataId 					 : 	-1
				
				}));
			
			controls.push(this.raphael.path('M ' + [ (x + 17) , (y + 8) ] + ' v 10 l -10 , -5 z').attr({
				
				fill					 :	'#000',
				cursor 					 : 	'pointer',
				stroke 					 : 	'none',
				dataId 					 : 	-1
				
				}));
			
			SOAPI.Event.addEventHandler(controls[3].node,	'mouseup',	[this , handlers.controls.mousedown],	'chart');
			SOAPI.Event.addEventHandler(controls[5].node, 	'mouseup',	[this , handlers.controls.mousedown],	'chart');
			SOAPI.Event.addEventHandler(controls[2].node,	'mouseup',	[this , handlers.controls.mousedown],	'chart');
			SOAPI.Event.addEventHandler(controls[4].node, 	'mouseup',	[this , handlers.controls.mousedown],	'chart');
			
		}
		
		// Add in feedback display
		
		controls.push(this.raphael.path('M 0 0').attr({
				
				fill					 :	this.parameters.colours[0],
				stroke 					 : 	'none'
				
				}));
		
		controls.push(this.raphael.text(this.dims[0].botRgt.x,13,'').attr({
			
			fill			 			 :	this.parameters.colours[0],
			stroke						 :	'none',
			'font-family' 				 :	this.parameters.font ,
			'font-size' 				 :	10,
			'text-anchor'				 :	'end'
			
			}));
	
		if (window.ie) 						controls[7].attr({ y : 16 });
	
		return controls;
	},
	
	createToolTip						 :	function
	
	(	//~	Parameters					
	
		//	None
		
	)	
	
	{	//~	Code	
		
		this.toolTip					 =	this.raphael.set();
		
		this.toolTip.push(this.raphael.text(0,0,''), this.raphael.text(0,0,''), this.raphael.path('M 0 0'));
		
		this.toolTip[0].attr({
						
			fill 	 					 :	'#ffffff',
			'font-family'				 :	this.parameters.font,
			'font-size' 				 :	13,	
			text  						 :	''
						
						});
		
		this.toolTip[1].attr({
						
			fill 			 			 : 	this.parameters.colours[this.focusedDataSet],
			'font-family' 				 : 	this.parameters.font,
			'font-size' 				 : 	10,				
			text  						 :	''
			
			});
		
		this.toolTip[2].attr({
						
			fill 						 :	'#000',
			opacity						 : 	0.7,
			stroke 						 : 	'#666',
			'stroke-width' 				 : 	2
			
			});
		
		this.toolTip.boundingBox		 =	{ };
		this.toolTip.state				 =	'left';
				
		this.toolTip.hide();
				
	},
	
	showMessage							 :	function
	
	(
		
		txt
		
	)
	
	{
		
		if (txt && this.controls[7].attr('text') == '') {
			
			this.controls[7].attr({
				
				text 					 :	txt,
				opacity 				 : 	1
				
				});
			
			this.controls[6].attr({
				
				path					 :	'M ' + [ (this.dims[0].botRgt.x - this.controls[7].getBBox().width - 12), 9 ] + ' v 8 l 8 , -4 z',
				opacity 				 : 	1
				
				});
			
			var obj = this;
			var fader = null;
			
			if (fader != null) clearTimeout(fader);
			
			fader = setTimeout(function() {
				
											obj.controls[6].animate({ opacity : 0 },200,'<>');
											obj.controls[7].animateWith(obj.controls[6],{ opacity : 0 },200,'<>', function() {
												
												obj.controls[7].attr({ text : '' });
												
											});
											
											clearTimeout(fader); }, 3000);
			
		}
		
	},
	
	updateToolTip						 :	function
	
	(
		x,
		y,
		txt1,
		txt2
		
	)
	
	{
		
		if (this.inTransition) 		 	 return false;
			
		// Animate the tooltip
		
		this.toolTip[0].attr({ text : txt1 });
		this.toolTip[1].attr({ text : txt2 });
		
		this.toolTip.boundingBox.width 	 =	Math.max(this.toolTip[0].getBBox().width, this.toolTip[1].getBBox().width);
		this.toolTip.boundingBox.height	 =	15;
		
		var startX 						 = 	x + 10;
		var startY						 = 	y - ((this.toolTip.boundingBox.height / 2) + 10);
		
		var path						 =	null;
		var midpoints					 =	null;
		
		// Choose which side it should go on.
		
		if (x > (this.components.canvas.get('width') - (this.toolTip.boundingBox.width + 50))) {
			
			path						 =	'M ' + [ (startX - this.toolTip.boundingBox.width - 20) , startY ] + ' h ' + this.toolTip.boundingBox.width + ' l 10 ' + ((this.toolTip.boundingBox.height / 2) + 10) + ' l -10 ' + ((this.toolTip.boundingBox.height / 2) + 10) + ' h -' + this.toolTip.boundingBox.width + ' a 10,10 0 0,1 -10,-10 v -' + this.toolTip.boundingBox.height + ' a 10,10 0 0,1 10,-10';
			midpoint					 =	startX - (this.toolTip.boundingBox.width / 2) - 22.5;	
		
		} else {
			
			path						 =	'M ' + [ startX , startY ] + ' h ' + this.toolTip.boundingBox.width + ' a 10,10 0 0,1 10,10 v ' + this.toolTip.boundingBox.height + ' a 10,10 0 0,1 -10,10 h -' + this.toolTip.boundingBox.width + ' l -10 -' + ((this.toolTip.boundingBox.height / 2) + 10) + 'z';
			midpoint					 =	startX + (this.toolTip.boundingBox.width / 2) + 2.5;	
		
		}
		
		// Make it move
		
		if (SOAPI.speedtest == 'poor') {
			
			
			this.toolTip[2].attr({ path : path }).show();
			this.toolTip[0].attr({ x : midpoint , y : y - (window.ie ?  4 : 7) }).show();
			this.toolTip[1].attr({ x : midpoint , y : y + (window.ie ?  8 : 6) }).show();
			
		} else {
			
			var obj 					 =	this;
			
			this.toolTip[2].stop().animate({ path : path } , 150 , ' ' , function(){ obj.toolTip.show(); });
			this.toolTip[0].stop().animateWith(this.toolTip[2] , { x : midpoint , y : y - (window.ie ?  4 : 7) } , 150);
			this.toolTip[1].stop().animateWith(this.toolTip[2] , { x : midpoint , y : y + (window.ie ?  8 : 6) } , 150);
		
		}
		
		return true;
		
	},
	
	createBackButton					 :	function
	
	(	//~	Parameters					
	
		x,
		y,
		text,
		colour
		
	)	
	
	{	//~	Code
		
		var backButton					 = 	this.raphael.set();
		
		backButton.push(this.raphael.text((x + 26),(y + 12),text));
		
		var width 						 =	backButton[0].getBBox().width + 35;

		backButton.push(this.raphael.rect(x, y, width, 26, 13));
		
		backButton[0].toFront();
		
		
		backButton.push(this.raphael.circle(x + 13, y + 13 , 10));
		backButton.push(this.raphael.path('M ' + [ (x + 17) , (y + 8) ] + ' v 10 l -10 , -5 z'));
		backButton.push(this.raphael.rect(x, y, width, 26));
		
		backButton[0].attr({
			
			fill 	 					 :	'#fff',
			stroke	 					 :	'none',
			'text-anchor'				 :	'start'
			
			});
		
		// Fix y for IE
		
		if (window.ie) 						backButton[0].attr({ y : y + 15 });
				
		backButton[1].attr({
			
			fill						 :	colour,
			stroke						 : 'none'
			
			});
				
		backButton[2].attr({
						
			fill						 :	'#fff',
			stroke 						 : 	'none'
			
			});
		
		backButton[3].attr({
			
			fill						 : '#000',
			stroke 						 : 'none'
			
			});
		
		backButton[4].attr({
			
			fill						 : '#000',
			cursor 						 : 'pointer',
			stroke 						 : 'none',
			opacity						 :	0,
			dataId						 :	(this.focusedDataSet - 1)
			
			});
		
		var handlers					 =	SOAPI.Chart_Handlers;
		
		SOAPI.Event.addEventHandler(backButton[4].node,	'mousedown',	[this , handlers.backButton.mousedown],	'chart');
		
		return backButton;
				
	},
	
	updateDataHighlights				 :	function
					
	(	//~	Parameters					
	
		//	None
		
	)	
	
	{	//~	Code
		
		// If the highlights are the same count, they will need to be all added in.
		
		var node 						 = 	this.selectedRefNode.node;
		var groups						 =	node.highlightGroups.length;
		
		if (groups) {
			
			var ln						 =	this.parameters.data[this.focusedDataSet].nodeLabels.length;
			var i						 =  0;
			
			if (this.dataHighlights.length != this.parameters.data[this.focusedDataSet].nodeLabels.length) {
			
				this.dataHighlights.remove();
				
				this.dataHighlights 	 =	this.raphael.set();
				
				var width				 = 	this.dims[this.focusedDataSet].hGrid;
				var x					 =	this.dims[this.focusedDataSet].topLft.x;
					
				for (i = 0; i < ln; i++) {
				
					var highlightBar	 =	this.dataHighlights.push(this.raphael.rect(x,32,(((!i || i == (ln -1)) && this.parameters.type == 'line') ? (width / 2) : width),this.dims[this.focusedDataSet].chartHeight));
					
					highlightBar.attr({
						
						stroke 			 : 	0,
						fill 			 : 	'#fff',
						opacity 		 : 	0
						
						});
					
					x 					 +=	(!i && this.parameters.type == 'line' ? (width / 2) : width);
					
				}
			
			}
			
			for (i = 0; i < ln; i++) {
				
				var fadeOut 			 =	true;
				
				for (var j = 0; j < groups; j++) {
					
					if (node.highlightGroups[j].vals && node.highlightGroups[j].vals.contains(i)) {
						
						if (window.ie || SOAPI.speedtest == 'poor') {
							
							this.dataHighlights[i].show().attr({ opacity : 0.5 , fill : node.highlightGroups[j].colour });	
							
						} else {
							
							this.dataHighlights[i].show().stop().animate({ opacity : 0.5 , fill : node.highlightGroups[j].colour },this.parameters.duration);	
							
						}
					
						fadeOut			 =	false;
						
					}
					
				}
				
				if (fadeOut) {
					
					if (window.ie || SOAPI.speedtest == 'poor') {
							
						this.dataHighlights[i].attr({ opacity : 0  });	
						
					} else {
						
						this.dataHighlights[i].stop().animate({ opacity : 0  },this.parameters.duration);
						
					}	
					
				}
					
			}
				
		} else {
			
			this.dataHighlights.attr({ opacity : 0 });
				
		}
		
	},
	
	updateVertAxis						 : 	function
						
	(	//~	Parameters					
	
		//	None
		
	)	
	
	{	//~	Code
		
		if (this.showVertAxis) {
			
			var ln						 =	parseInt(this.parameters.vgridcount) + 1;
			var y						 =	this.dims[this.focusedDataSet].topLft.y + 4;
			var max						 =	parseInt(this.parameters.data[this.focusedDataSet].max);
			var incVal					 =	max / this.parameters.vgridcount;
			
			if (!this.vertAxis.length) {
			
				while (ln--) {
					
					this.vertAxis.push(this.raphael.text(this.indent,y,''));
					
					y					 +=	this.dims[this.focusedDataSet].vGrid;
					
				}
			
			}
			
			ln							 =	this.vertAxis.length;
			for (var i = 0; i < ln; i++) {
				
				this.vertAxis[i].attr({
						text 			 : 	Math.round(max).toString(),
						fill			 :	this.parameters.colours[this.focusedDataSet],
						'font-family' 	 : 	this.parameters.font,
						'font-size' 	 : 	10
						});
				
				max						 -=	incVal;
				
			}
			
		}
		
	},
	
	calcChartDims						 :	function
		
	(	//~	Parameters					
	
		widthFactor,
		hLabels,
		forBars
		
	)	
	
	{	//~	Code
		
		forBars							 =	typeof(forBars) == undefined ? false : forBars;
		
		var dimensions					 =	new Object();
		
		dimensions.chartHeight			 =	this.height - 52;
		dimensions.chartWidth			 =	this.width - (widthFactor * 2) - (this.showVertAxis ? 20 : 0);
		
		dimensions.hGrid				 =	dimensions.chartWidth / (hLabels - (forBars ? 0 : 1));
		dimensions.vGrid				 =	dimensions.chartHeight / this.parameters.vgridcount;
		dimensions.normalise			 =	dimensions.chartHeight / this.parameters.data[this.focusedDataSet].max;
		
		
		dimensions.topLft				 =	{
												
			x		 					 :	this.width - dimensions.chartWidth - widthFactor,
			y		 				 	 :	32
											
			};
		
		dimensions.botRgt				 =	{
												
			x							 :	this.width - widthFactor,
			y							 :	this.height - 20
											
			};
		
		return dimensions;
		
	},
	
	transitionToDataSet_Bar				 :	function
			
	(	//~	Parameters					
	
		//	None	
		
	)	
	
	{	//~	Code
		
		var idFrom						 =	this.focusedDataSet - 1;
		var idTo						 =	this.focusedDataSet;
		var margin						 =	this.sequentialIndent;
		var widthFactor					 =	this.indent + (margin * this.focusedDataSet);
		var dataId						 =	this.selectedView[this.focusedDataSet];
		
		// Set up and calculate.
		
		this.transitionalElements[idTo]	 =	this.raphael.set();
		
		this.toolTip.hide();
		this.dataHighlights.hide();
		
		if (this.showTrendLine) 			this.trendLine.hide();
		
		if (!this.dims[idTo]) {
		
			this.dims[idTo]				 = 	this.calcChartDims(widthFactor,this.parameters.data[idTo].nodeLabels.length,true);
		
		}
		
		// Create the two paths that will define the split, work out the two sets of vals that will make up each path
		
		this.transitionalElements[idTo].push(
															
											this.raphael.set(),			// 0 Left Bars
											this.raphael.set(),			// 1 Right Bars
											this.raphael.rect(),		// 2 Background box
											this.raphael.rect(),		// 3 Left vert bar
											this.raphael.rect()			// 4 Right vert bar
															
											);		
		
		// Calc up the background, and vert bars of the new chart
		
		var startX 						 = 	this.bars[dataId].attr('x');
		var startY					 	 = 	this.bars[dataId].attr('y');
		
		this.transitionalElements[idTo][2].attr({
															
			x 							 :	startX,
			y							 :	this.dims[idTo].topLft.y,
			width						 :	this.bars[dataId].attr('width'),
			height						 :	this.dims[idTo].chartHeight,
			fill 						 :	'#eee',
			stroke 						 :	'none'
			
			});
			
		var vertBarVals = {
							
			x 			 				 :	(startX - 3),
			y 							 : 	this.dims[idTo].topLft.y,
			width						 : 	3,
			height						 : 	this.dims[idTo].chartHeight,
			fill						 :	this.parameters.colours[idFrom],
			stroke						 : 	'none'
		
			};
							
		this.transitionalElements[this.focusedDataSet][3].attr(vertBarVals);
		this.transitionalElements[this.focusedDataSet][4].attr(vertBarVals);
		this.transitionalElements[this.focusedDataSet][4].attr({ x : (startX + this.bars[dataId].attr('width')) });
		
		// Firstly, calc up the new bars
		
		this.checkAndCalcSet();
			
		// Run through the bars, decide which go which way etc
		
		var bBox						 = 	this.bars[0].getBBox();
		
		var bar 						 = 	new Object();
		var xLeft						 =	bBox.x;
		var barWidth					 =	bBox.width / 2;
		var xRight						 =	this.dims[idFrom].botRgt.x - ((this.bars.length - dataId - (dataId > 0 ? 1 : 0)) * barWidth);
		var ln							 =	this.bars.length;
		
		for (var i = 0; i < ln; i++) {
			
			bar 						 =	this.bars[i].clone();
			
			bar.attr({ fill : this.parameters.colours[idFrom] });
			
			if (dataId >= 1 && i <= dataId) {
				
				this.transitionalElements[idTo][0].push(bar);
				bar.animate({ x : xLeft , width : barWidth },this.parameters.duration, '<>');
				xLeft += barWidth;
				
			} else {
				
				this.transitionalElements[idTo][1].push(bar);
				bar.animate({ x : xRight , width : barWidth },this.parameters.duration, '<>');
				xRight += barWidth;
				
			}
			
		}
		
		// Make sure the vert bars are at the front
		
		if(this.transitionalElements[idFrom]) {
				
			this.transitionalElements[idFrom][3].toFront();
			this.transitionalElements[idFrom][4].toFront();
		
		}
		
		// Clean up all the bits.
		
		this.bars.remove();
		this.toolTip.hide();
		
		this.transitionalElements[this.focusedDataSet][2].toFront();
		this.transitionalElements[this.focusedDataSet][3].toFront();
		this.transitionalElements[this.focusedDataSet][4].toFront();
		
		// Function to carry out at the end of the main transition (below this function)
		
		var obj 						 = 	this;
		var onTransitionComplete		 = 	function() {
			
			obj.grids[idTo] = obj.drawGrid(
															
											obj.dims[idTo].topLft.x,
											obj.dims[idTo].topLft.y,
											obj.dims[idTo].chartWidth,
											obj.dims[idTo].chartHeight,
											obj.dims[idTo].hGrid,
											obj.dims[idTo].vGrid,
											obj.parameters.data[idTo].nodeLabels,
											'middle'
														
											);
			
			obj.displayCurrentDataSet();
			obj.bars.hide();
			
			obj.grids[idTo][0].hide();
			obj.grids[idTo][1].hide();			
			
			obj.transitionalElements[idTo][3].toFront();
			obj.transitionalElements[idTo][4].toFront();
						
			// Fade on all the new elements from left to right
					
			var fade					 =	null;
			var i						 =	0;
			var height					 =	obj.selectedRefNode.node.calculatedVals[0];
			
			function fader() {
				
				if (height[i][3] != null) 	obj.grids[idTo][0][i].show();
				
				obj.grids[idTo][1][i].show();
				obj.bars[i].show();
				
				i++;
				
				if (i == obj.parameters.data[idTo].nodeLabels.length) {
					
					obj.inTransition	 =	false;
					
					clearInterval(fade);
					
				}
				
			};
			
			fade 						 =	setInterval(fader, (window.ie ? 5: 15));
		
			return false;
			
		};
		
		// -----------------------------------------------
		// Animate everything for the transition
		// -----------------------------------------------
		
		// First the background, and vertBars
		
		this.transitionalElements[idTo][2].animate({ x : this.dims[idTo].topLft.x , width : this.dims[idTo].chartWidth },this.parameters.duration, '<>',onTransitionComplete);
		
		this.transitionalElements[idTo][3].animateWith(this.transitionalElements[idTo][2] , { x : this.dims[idTo].topLft.x }, this.parameters.duration, '<>');
		this.transitionalElements[idTo][4].animateWith(this.transitionalElements[idTo][2] , { x : (this.dims[idTo].botRgt.x - 2) }, this.parameters.duration, '<>');
				
		// DataSetOne grid
		
		this.grids[idFrom][0].hide();
		
		// Add in the back button, so that we can return to the main view (5 Back text)
		
		var backButtonX					 =	this.dims[idFrom].topLft.x;
		
		if(this.transitionalElements[idFrom] != undefined) backButtonX = this.transitionalElements[idFrom][5].getBBox().x + this.transitionalElements[idFrom][5].getBBox().width + 2;
		
		this.transitionalElements[idTo].push(this.createBackButton(backButtonX,0,this.parameters.data[idFrom].returnText,this.parameters.colours[idFrom]));
		
		// Save more bits into the transitional elements object
		
		this.transitionalElements[idTo].startX 	 =	startX;
		this.transitionalElements[idTo].startY 	 =	startY;
				
		return true;
		
	},
	
		
	transitionFromDataSet_Bar			 :	function
				
	(	//~	Parameters					
	
		dataId
		
	)	
	
	{	//~	Code	
		
		var idFrom						 =	this.focusedDataSet;
		var idTo						 =	this.focusedDataSet	-= 1;
		
		this.selectedRefNode 			 =	this.dataReference;
		this.inTransition				 =	true;
		
		for (var i = 0; i <= idTo; i++) {
			
			this.selectedRefNode		 = 	this.selectedRefNode.children[this.savedSelectedView[i]];
			this.selectedView[i] 		 =	this.savedSelectedView[i];
		
		}
		
		this.toolTip.hide();
		this.dataHighlights.hide();
		this.checkAndCalcSet();
		
		if (this.showTrendLine) 			this.trendLine.hide();
		
		var obj							 =	this;
		var onComplete					 =	function() {
			
			obj.displayCurrentDataSet();
			
			obj.transitionalElements[idFrom].remove();
			
			// Make sure the bars are at the front
		
			if(obj.transitionalElements[idTo]) {
					
				obj.transitionalElements[idTo][3].toFront();
				obj.transitionalElements[idTo][4].toFront();
			
			}
						
			if (dataId != idTo) obj.transitionFromDataSet_Bar(dataId);
			
			obj.inTransition			 =	false;	
		
			return true;
			
		};
		
		// Then move all the bits back to their original position, first background, and vertbars
		
		this.transitionalElements[idFrom][2].animate({ x : this.transitionalElements[idFrom].startX , width : 1 , opacity : 0 },this.parameters.duration, '<>',onComplete);
		
		this.transitionalElements[idFrom][3].animateWith(this.transitionalElements[idFrom][2] , { x : this.transitionalElements[idFrom].startX , opacity : 0 }, this.parameters.duration, '<>');
		this.transitionalElements[idFrom][4].animateWith(this.transitionalElements[idFrom][2] , { x : this.transitionalElements[idFrom].startX , opacity : 0}, this.parameters.duration, '<>');
		
		// Move each of the halves back.
		
		var ln							 =	this.transitionalElements[idFrom][0].length;
		var node						 =	this.selectedRefNode.node.calculatedVals[0];
		
		while (ln--) {
			
			this.transitionalElements[idFrom][0][ln].animate({ x : node[ln][0] , width : node[ln][2] }, this.parameters.duration, '<>');
			
		}
		
		ln								 = 	node.length;
		var i							 =	ln - this.transitionalElements[idFrom][1].length;
								 
		for (var j = 0 , i; i < ln; i++, j++) {
			
			this.transitionalElements[idFrom][1][j].animate({ x : node[i][0] , width : node[i][2] }, this.parameters.duration, '<>');
		
		}
		
		// The grids
		
		this.grids[idTo][0].show();
		
		this.grids[idFrom].remove();
		this.bars.remove();
	
		return true;
	
	},
	
	transitionToDataSet_Line			 :	function
			
	(	//~	Parameters					
	
		//	None		
		
	)	
	
	{	//~	Code
		
		var idFrom						 =	this.focusedDataSet - 1;
		var idTo						 =	this.focusedDataSet;
		var margin						 =	this.sequentialIndent;
		var widthFactor					 =	this.indent + (margin * this.focusedDataSet);
		var dataId						 =	this.selectedView[this.focusedDataSet];
		
		// Set up and calculate.
		
		this.transitionalElements[idTo]	 =	this.raphael.set();
		
		this.toolTip.hide();
		this.dataHighlights.hide();
		
		if (this.showTrendLine) 			this.trendLine.hide();
		
		if (!this.dims[idTo]) {
		
			this.dims[idTo]				 = 	this.calcChartDims(widthFactor,this.parameters.data[idTo].nodeLabels.length);
		
		}
		
		// Create the two paths that will define the split, work out the two sets of vals that will make up each path
		
		this.transitionalElements[idTo].push(
															
											this.raphael.path(),		// 0 Left Path
											this.raphael.path(),		// 1 Right Path
											this.raphael.rect(),		// 2 Background box
											this.raphael.rect(),		// 3 Left vert bar
											this.raphael.rect()			// 4 Right vert bar
															
											);
		
		// Split the line up into the parts
		
		var leftVals					 =	this.selectedRefNode.parent.node.nodes.slice(0,(dataId + 1));
		var rightVals				 	 = 	this.selectedRefNode.parent.node.nodes.slice(dataId);
		
		var leftHalf					 =	this.calcDotsAndPaths(
																
											this.dims[idFrom].botRgt.y,
											this.dims[idFrom].normalise,
											this.dims[idFrom].topLft.x,
											this.dims[idFrom].hGrid,
											leftVals,
											leftVals.length
											
											);
		
		var rightHalf	 				 =	this.calcDotsAndPaths(
																
											this.dims[idFrom].botRgt.y,
											this.dims[idFrom].normalise,
											this.dims[idFrom].botRgt.x - ((rightVals.length - 1) * this.dims[idFrom].hGrid),	
											this.dims[idFrom].hGrid,
											rightVals,
											rightVals.length
											
											);
		
		
		
		// Save all the little bits into the transitional elements object, that way we don't have to calc them again
		
		this.transitionalElements[idTo].leftHalf		 =	leftHalf;
		this.transitionalElements[idTo].rightHalf 		 =	rightHalf;
				
		// And display them over the existing path
		
		this.transitionalElements[idTo][0].attr({
																
			path					 	 :	leftHalf.path,
			fill			 			 :	'none',
			'stroke-width'	 			 :	4,
			'stroke-linecap' 			 :	'round',
			stroke 			 			 :	this.parameters.colours[idFrom]
																
		});
		
		this.transitionalElements[idTo][1].attr({
			
			path			 		 	 :	rightHalf.path,
			fill			 			 :	'none',
			'stroke-width'				 :	4,
			'stroke-linecap'			 :	'round',
			stroke 						 :	this.parameters.colours[idFrom]
		
		});
		
		// Then re-calc where we want to squish things too.
		
		leftHalf 				 	 	 =	this.calcDotsAndPaths(
																
											this.dims[idFrom].botRgt.y,
											this.dims[idFrom].normalise,
											this.dims[idFrom].topLft.x,											
											(this.dims[idTo].topLft.x - this.dims[idFrom].topLft.x) / (leftVals.length - 1),
											leftVals,
											leftVals.length
											
											);
		
		var intWidth					 = 	(this.dims[idFrom].botRgt.x - this.dims[idTo].botRgt.x) / ((rightVals.length == 1 ? 2 : rightVals.length) - 1);
		
		rightHalf	 					 =	this.calcDotsAndPaths(
																
											this.dims[idFrom].botRgt.y,
											this.dims[idFrom].normalise,
											this.dims[idFrom].botRgt.x - ((rightVals.length - 1) * intWidth),
											intWidth,
											rightVals,
											rightVals.length
											
											);
		
		// Firstly, calc up the new paths 
		
		this.checkAndCalcSet();
		
		// Calc up the background, and vert bars of the new chart
		
		var startX 						 = 	this.selectedRefNode.parent.node.calculatedVals[0].dots[dataId][0];
		var startY					 	 = 	this.selectedRefNode.parent.node.calculatedVals[0].dots[dataId][1];
		
		this.transitionalElements[idTo][2].attr({
																
			x 							 :	startX,
			y							 :	this.dims[idTo].topLft.y,
			width						 :	2,
			height						 :	this.dims[idTo].chartHeight,
			fill 						 :	'#eee',
			stroke 						 :	'none'
											
			});
			
		var vertBarVals = {
		
			x 			 				 :	startX,
			y 							 : 	this.dims[idTo].topLft.y,
			width						 : 	3,
			height						 : 	this.dims[idTo].chartHeight,
			fill						 :	this.parameters.colours[idFrom],
			stroke						 : 	'none'
		
			};
							
		this.transitionalElements[this.focusedDataSet][3].attr(vertBarVals);
		this.transitionalElements[this.focusedDataSet][4].attr(vertBarVals);
			
		// Remove the existing line and dots, hide dateSetOne grid
		
		this.dots.remove();
		this.path.remove();
		this.toolTip.hide();
		
		// Add in the path, in it's compressed form
		
		this.path						 =	this.raphael.path('M ' + [startX,startY]);
		this.dots						 =	this.raphael.set();
		
		this.path.attr({
						
			fill						 :	'none',
			'stroke-width'				 :	4,
			stroke 						 :	this.parameters.colours[idTo]
			
			});
		
		// Calc up what the path will start from and then look like, it needs to look flat (with all the dots),  then expanded
		
		var nullPath					 = 	'M ' + [this.dims[idTo].topLft.x , startY] + ' h ';
		var startDots					 =	this.dims[idTo].topLft.x;
		
		for (var i = 0; i < this.parameters.data[idTo].nodeLabels.length; i++) {
			
			if (i) nullPath 			 +=	' ' + this.dims[idTo].hGrid;
			
			if (!window.ie && SOAPI.speedtest == 'good') {

				var dot 				 =	this.raphael.circle(startDots,startY,4);
				dot.attr({
							
					fill				 :	'#fff' ,
					stroke				 :  this.parameters.colours[idTo],
					'stroke-width'		 :	2
					
					});
				
				this.dots.push(dot);
			
			startDots 					 +=	this.dims[idTo].hGrid;
			
			}
			
		}
		
		if (!window.ie && SOAPI.speedtest == 'good') this.dots.hide();
		
		this.transitionalElements[this.focusedDataSet][3].toFront();
		this.transitionalElements[this.focusedDataSet][4].toFront();
		
		// Function to carry out at the end of the main transition (below this function)
		
		var obj 						 = 	this;
		var onTransitionComplete		 = 	function() {
			
			obj.grids[obj.focusedDataSet] = obj.drawGrid(
				
											obj.dims[idTo].topLft.x,
											obj.dims[idTo].topLft.y,
											obj.dims[idTo].chartWidth,
											obj.dims[idTo].chartHeight,
											obj.dims[idTo].hGrid,
											obj.dims[idTo].vGrid,
											obj.parameters.data[idTo].nodeLabels,
											'left'
											
											);	
			
			obj.grids[obj.focusedDataSet][0].hide();
			obj.grids[obj.focusedDataSet][1].hide();
			
			obj.path.toFront();
			
			obj.transitionalElements[idTo][3].toFront();
			obj.transitionalElements[idTo][4].toFront();
			
			// Fade on all the new elements from left to right
			
			var node 					 =	obj.selectedRefNode.node.calculatedVals[0];
			var fade					 =	null;
			var i						 =	0;
			
			function fader() {
				
				if (node.dots[i][1] != null) obj.grids[idTo][0][i].show();
					
				obj.grids[idTo][1][i].show();
				
				if (!window.ie && SOAPI.speedtest == 'good')				obj.dots[i].show().toFront();
				
				i++;
				
				if (i == obj.parameters.data[idTo].nodeLabels.length)
				{
					obj.path.animate({ path : node.path },obj.parameters.duration, '<>',function(){ obj.inTransition = false; obj.path.remove(); obj.dots.remove(); obj.displayCurrentDataSet(); });
					
					if (!window.ie && SOAPI.speedtest == 'good')	{
						
						var ln			 =	node.dots.length;
						while (ln--) {
							
							var cy		 =	node.dots[ln][1];
						
							obj.dots[ln].animate({ cx : node.dots[ln][0] , cy : (cy == null ? obj.dims[idTo].botRgt.y : cy) , opacity : (cy == null ? 0 : 1) } , obj.parameters.duration , '<>');
							
						}
					
					}
					
					clearInterval(fade);
					
				}
				
			};
			
			fade 						 =	setInterval(fader, (window.ie ? 3 : 15));
		
			return false;
		
		};
			
		// -----------------------------------------------
		// Animate everything for the transition
		// -----------------------------------------------
		
		// First the background, and vertBars 
		
		this.transitionalElements[idTo][2].animate({ x : this.dims[idTo].topLft.x , width : this.dims[idTo].chartWidth },this.parameters.duration, '<>',onTransitionComplete);
		
		this.transitionalElements[idTo][3].animateWith(this.transitionalElements[idTo][2] , { x : (this.dims[idTo].topLft.x - 2) }, this.parameters.duration, '<>');
		this.transitionalElements[idTo][4].animateWith(this.transitionalElements[idTo][2] , { x : (this.dims[idTo].botRgt.x - 1) }, this.parameters.duration, '<>');
		
		// The the left and right hand paths
	
		this.transitionalElements[idTo][0].animateWith(this.transitionalElements[idTo][2] , { path : leftHalf.path , opacity : (margin == 0 ? 0 : 1) }, this.parameters.duration, '<>');
		this.transitionalElements[idTo][1].animateWith(this.transitionalElements[idTo][2] , { path : rightHalf.path , opacity : (margin == 0 ? 0 : 1) }, this.parameters.duration, '<>');
	
		// DataSetOne grid
		
		this.grids[idFrom][0].hide();
		
		// And the path, and hover bars
		
		this.path.animateWith(this.transitionalElements[idTo][2] ,{ path : nullPath },this.parameters.duration,'<>');
				
		// Add in the back button, so that we can return to the main view (5 Back text)
		
		var backButtonX					 			 		 =	this.dims[idFrom].topLft.x;
		
		if(this.transitionalElements[idFrom] != undefined) 		backButtonX = this.transitionalElements[idFrom][5].getBBox().x + this.transitionalElements[idFrom][5].getBBox().width + 2;
		
		this.transitionalElements[idTo].push(this.createBackButton(backButtonX,0,this.parameters.data[idFrom].returnText,this.parameters.colours[idFrom]));
		
		// Save more bits into the transitional elements object
		
		this.transitionalElements[idTo].nullPath 			 =	nullPath;
		this.transitionalElements[idTo].startX 				 =	startX;
		this.transitionalElements[idTo].startY 				 =	startY;
		
		return true;
		
	},
	
	transitionFromDataSet_Line			 :	function
				
	(	//~	Parameters					
	
		dataId
		
	)	
	
	{	//~	Code	
		
		var idFrom						 =	this.focusedDataSet;
		var idTo						 =	this.focusedDataSet	-= 1;
	
		this.selectedRefNode 			 =	this.dataReference;
		this.inTransition				 =	true;
		
		for (var i = 0; i <= idTo; i++) {
			
			this.selectedRefNode		 = 	this.selectedRefNode.children[this.savedSelectedView[i]];
			this.selectedView[i] 		 =	this.savedSelectedView[i];
		
		}
				
		this.toolTip.hide();
		this.dataHighlights.hide();
		this.checkAndCalcSet();
		
		if (this.showTrendLine) 			this.trendLine.hide();
		
		// On complete function that will be called at the end of the return
		
		var obj							 =	this;
		var onComplete					 =	function() {
			
			obj.transitionalElements[idFrom].remove();
			
			obj.displayCurrentDataSet();
		
			if (dataId != idTo) obj.transitionFromDataSet_Line(dataId);
			
			obj.inTransition			 =	false;	
		
			return true;
			
		};
		
		// Then move all the bits back to their original position, first background, and vertbars
		
		this.transitionalElements[idFrom][2].animate({ x : this.transitionalElements[idFrom].startX , width : 0 },this.parameters.duration, '<>',onComplete);
		
		this.transitionalElements[idFrom][3].animateWith(this.transitionalElements[idFrom][2] , { x : this.transitionalElements[idFrom].startX }, this.parameters.duration, '<>');
		this.transitionalElements[idFrom][4].animateWith(this.transitionalElements[idFrom][2] , { x : this.transitionalElements[idFrom].startX }, this.parameters.duration, '<>');
		
		// Then the two paths
		
		this.transitionalElements[idFrom][0].animateWith(this.transitionalElements[idFrom][2] , { path : this.transitionalElements[idFrom].leftHalf.path , opacity : 1 }, this.parameters.duration, '<>');
		this.transitionalElements[idFrom][1].animateWith(this.transitionalElements[idFrom][2] , { path : this.transitionalElements[idFrom].rightHalf.path , opacity : 1 }, this.parameters.duration, '<>');
		
		this.grids[idTo][0].show();
		
		// Remove unused bits
		
		this.grids[idFrom].remove();
		this.path.remove();
		this.dots.remove();
		
		return true;
	
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
	
	SOAPI.Chart_Handlers				 =	{
		
		controls						 :
		{
			
			mousedown					 :	function(event) {
				
				event.stopPropagation();
			
				if (!this.inTransition)  this.chartIncrementor(event.element.raphael.attrs.dataId,'view'); 
			
				return true;
			
			}
			
		},
		
		hoverbar						 :	{
		
			mouseover				 :	function(event) {
				
				if (!this.inTransition)  this.barAction(event.element.raphael.attrs.dataId,'over');
				
				return true;
				
			},
			
			mouseout				 :	function(event) {
				
				if (!this.inTransition)	 this.barAction(event.element.raphael.attrs.dataId,'out');
				
				return true;
			
			},
			
			mousedown				 :	function(event) {
				
				if (!this.inTransition)	  this.chartIncrementor(event.element.raphael.attrs.dataId,'set');
				
				return true;
			}
				
		},
		
		backButton						 :	{
			
			mousedown					 :	function(event) {
				
				if (!this.inTransition)	 this.backClickAction(event.element.raphael.attrs.dataId);
				
				return true;
				
			}
			
		}
		
	};
	
//+																														
//+																												}		
//+																														
