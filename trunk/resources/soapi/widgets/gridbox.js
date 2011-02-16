//#																														
//#	SOAPI 4.8													Copyright � 2000 - 2009 Dan Williams.					
//#																														

//+																														
//+	SOAPI.Gridbox																									{	
//+(																													
	
	SOAPI.widgets.gridbox				 =	function(p) { new SOAPI.Gridbox(p); };
	
//+																														
	
	SOAPI.Gridbox						 =	SOAPI.Scrollbox.extension();
	
	SOAPI.Gridbox.extend
	
//+)																													

/*(	//~	Documentation					
	///																					
	///		This class provides a gridbox widget.										
	///																					
)*/

({	//~	Code							
	
	//*														
	//*	Variables										{	
	//*														
	
	wtype								 :	"gridbox",
	ctypes								 :	{ scrollbarV: SOAPI.Scrollbar, scrollbarH: SOAPI.Scrollbar, grid: SOAPI.Grid },
	
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
		///					...inherited from Scrollbox...									
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
		var handlers					 =	SOAPI.Gridbox_Handlers;
		
		SOAPI.Event.addEventHandler(w, "contentchange", handlers.onContentChange, "Gridbox", [ "before Scrollbox" ]);
		
		//.	Gridbox colheader							{	
		
		var colheader					 =	c.colheader		 =	this.createComponent({
			element						 :	p.element,
			parent						 :	w,
			cType						 :	"colheader"
		});
		
		//.	Gridbox colheader grid					}	{	
		
		colheader.components			 =	c				 =	{};
		
		var grid						 =	c.grid			 =	this.createComponent({
			element						 :	colheader,
			parent						 :	colheader,
			widget						 :	w,
			cType						 :	"grid",
			eType						 :	"table"
		});
		
		grid._setRowState				 =	grid.setRowState;
		grid._setColState				 =	grid.setColState;
		grid._addCell					 =	grid.addCell;
		grid.setRowState				 =	handlers.grid.blank;
		grid.setColState				 =	handlers.grid.setColState;
		grid.addCell					 =	handlers.colheader.addCell;
		grid.defaultAutoNumType			 =	"col";
		
		//.	Gridbox colheader header row			}	{	
		
		var rows						 =	grid.rows;
		var i							 =	rows.length;
		
		while (i--) {
			
			var row						 =	rows[i];
			var cells					 =	row.cells;
			var j						 =	cells.length;
			
			while (j--)						this.makeSizer(cells[j], false);
			
		}
		
		c								 =	w.components;
		
		//.	Gridbox rowheader						}	{	
		
		var rowheader					 =	c.rowheader		 =	this.createComponent({
			element						 :	p.element,
			parent						 :	w,
			cType						 :	"rowheader"
		});
		
		//.	Gridbox rowheader grid					}	{	
		
		rowheader.components			 =	c				 =	{};
		
		var grid						 =	c.grid			 =	this.createComponent({
			element						 :	rowheader,
			parent						 :	rowheader,
			widget						 :	w,
			cType						 :	"grid",
			eType						 :	"table"
		});
		
		grid._setRowState				 =	grid.setRowState;
		grid._setColState				 =	grid.setColState;
		grid._addCell					 =	grid.addCell;
		grid.setRowState				 =	handlers.grid.setRowState;
		grid.setColState				 =	handlers.grid.blank;
		grid.addCell					 =	handlers.rowheader.addCell;
		grid.defaultAutoNumType			 =	"row";
		
		//.	Gridbox rowheader header row			}	{	
		
		var rows						 =	grid.rows;
		var i							 =	rows.length;
		
		while (i--) {
			
			var row						 =	rows[i];
			var cells					 =	row.cells;
			var j						 =	cells.length;
			
			while (j--)						this.makeSizer(cells[j], true);
			
		}
		
		c								 =	w.components;
		
		//.	Gridbox content grid					}	{	
		
		var content						 =	c.content;
		
		content.components				 =	c				 =	{};
		
		var grid						 =	c.grid			 =	this.createComponent({
			element						 :	content,
			parent						 :	content,
			widget						 :	w,
			cType						 :	"grid",
			eType						 :	"table"
		});
		
		grid._setRowState				 =	grid.setRowState;
		grid._setColState				 =	grid.setColState;
		grid.setRowState				 =	handlers.grid.setRowState;
		grid.setColState				 =	handlers.grid.setColState;
		
		c								 =	w.components;
		
		//.	Gridbox topleft							}	{	
		
		var topleft						 =	c.topleft		 =	this.createComponent({
			element						 :	p.element,
			parent						 :	w,
			cType						 :	"topleft"
		});
		
		//.											}		
		
		return result;
		
	},
	
	//-														
	//-												}		
	//-														
	
	makeSizer							 :	function(cell, vertical) {
		
		var c							 =	cell.components;
		var content						 =	c.content;
		var sizer						 =	c.sizer			 =	this.createComponent({
			element						 :	cell,
			parent						 :	cell,
			widget						 :	cell.parentWidget,
			cType						 :	"sizer",
			eType						 :	"div"
		});
		
		sizer.dragger.enabled			 =	true;
		sizer.dragger.removePartner(sizer);
		
		if (vertical) {
			
			content.dragger.restrict	 =	true;
			content.dragger.addRestriction("height", { min: 0});
			sizer.dragger.addPartner(sizer,   null, { top:    1 }, true);
			sizer.dragger.addPartner(content, null, { height: 1 }, true);
			
		} else {
			
			cell.dragger.restrict		 =	true;
			cell.dragger.addRestriction("width", { min: 0});
			sizer.dragger.addPartner(sizer, { left:  1 }, null, true);
			sizer.dragger.addPartner(cell,  { width: 1 }, null, true);
			
		}
		
		SOAPI.Event.addEventHandler(w, "mousedown");
		SOAPI.Event.addEventHandler(w, "mouseup");
		SOAPI.Event.addEventHandler(w, "drag",      SOAPI.Gridbox_Handlers.sizer.onDrag, "Gridbox");
		SOAPI.Event.addEventHandler(w, "dragstart");
		SOAPI.Event.addEventHandler(w, "dragend");
		
		return cell;
		
	},
	
	setupScrollPartners					 :	function() {
		
		this.callParent(arguments.callee, "setupScrollPartners");
		
		var content						 =	this.components.content;
		var rowheader					 =	this.components.rowheader;
		var colheader					 =	this.components.colheader;
		var scrollbarV					 =	this.components.scrollbarV;
		var scrollbarH					 =	this.components.scrollbarH;
		var contentHeight				 =	content.get("actualHeight");
		var contentWidth				 =	content.get("actualWidth");
		var scrollHeight				 =	content.get("scrollHeight");
		var scrollWidth					 =	content.get("scrollWidth");
		
		scrollbarV.removePartner(rowheader);
		scrollbarH.removePartner(colheader);
		scrollbarV.addPartner(rowheader, "scrollTop",  0, scrollHeight - contentHeight);
		scrollbarH.addPartner(colheader, "scrollLeft", 0, scrollWidth  - contentWidth);
		
	},
	
	setRowState							 :	function(index, state) {
		
		this.components.content.components.grid._setRowState(index, state);
		this.components.rowheader.components.grid._setRowState(index, state);
		
	},
	setColState							 :	function(index, state) {
		
		this.components.content.components.grid._setColState(index, state);
		this.components.colheader.components.grid._setColState(index, state);
		
	},
	
	addRow								 :	function(rowPos, tbody, numCells, headerText, headerAutoNum) {
		
		var rowheader					 =	this.components.rowheader.components.grid;
		var content						 =	this.components.content.components.grid;
		var rowheaderResult				 =	rowheader.addRow(rowPos, tbody, numCells);
		var contentResult				 =	content.addRow(rowPos, tbody, numCells);
		var cell						 =	rowheaderResult.row.cells[0];
		
		if (!headerAutoNum)					headerAutoNum	 =	"row";
		
		cell.setAttribute("autonumber", headerAutoNum);
		
		if (headerText)						cell.write(headerText);
		else if (headerAutoNum == "row")	cell.write(cell.parentNode.rowIndex + 1);
		
		return rowheaderResult;
		
	},
	removeRow							 :	function(rowPos, tbody) {
		
		this.components.content.components.grid.removeRow(rowPos, tbody);
		return this.components.rowheader.components.grid.removeRow(rowPos, tbody);
		
	},
	removeAllRows						 :	function(tbody) {
		
		this.components.content.components.grid.removeAllRows(tbody);
		this.components.rowheader.components.grid.removeAllRows(tbody);
		
	},
	
	addCol								 :	function(colPos, headerText, headerAutoNum) {
		
		var colheader					 =	this.components.colheader.components.grid;
		var content						 =	this.components.content.components.grid;
		var colheaderResult				 =	colheader.addCol(colPos);
		var contentResult				 =	content.addCol(colPos);
		var cell						 =	colheader.rows[0].cells[colPos];
		
		if (!headerAutoNum)					headerType		 =	"col";
		
		cell.setAttribute("autonumber", headerAutoNum);
		
		if (headerText)						cell.write(headerText);
		else if (headerAutoNum == "col")	cell.write(cell.cellIndex + 1);
		
		return colheaderResult;
		
	},
	removeCol							 :	function(colPos) {
		
		this.components.content.components.grid.removeCol(colPos);
		return this.components.colheader.components.grid.removeCol(colPos);
		
	},
	
	updateRows							 :	function(tbody, min, max) {
		
		this.components.content.components.grid.updateRows(tbody, min, max);
		this.rowheader.content.components.grid.updateRows(tbody, min, max);
		this.colheader.content.components.grid.updateRows(tbody, min, max);
		
	},
	
	applyData							 :	function(data, startRow, tbody) {
		
		this.components.content.components.grid.applyData(data, startRow, tbody);
		
	},
	clearData							 :	function(tbody) {
		
		this.components.content.components.grid.clearData(tbody);
		
	},
	
	setDimensions						 :	function(numRows, numCols, tbody) {
		
		var rowheader					 =	this.components.rowheader.components.grid;
		var colheader					 =	this.components.colheader.components.grid;
		
		this.components.content.components.grid.setDimensions(numRows, numCols, tbody, true);
		rowheader.setDimensions(numRows, null, rowheader.tHead, true);
		colheader.setDimensions(null, numCols, colheader.tHead, true);
		
		SOAPI.Event.triggerEvent("contentchange", this);
		
	},
	
	syncColWidths						 :	function() {
		
		var colheader					 =	this.components.colheader.components.grid;
		var content						 =	this.components.content.components.grid;
		var colrow						 =	colheader.rows[0];
		var row							 =	content.rows[0];
		
		if (!colrow || !row)				return;
		
		var colcells					 =	colrow.cells;
		var cells						 =	row.cells;
		var i							 =	colcells.length;
		
		while (i--) {
			
			if (!cells[i])					continue;
			
			var width					 =	colcells[i].get("width");
			
			cells[i].styleTo("width", width);
			
			//i		The following lines are here to correct a weird bug in Firefox.		
			
			var appliedWidth			 =	cells[i].get("width");
			
			if (appliedWidth != width) {
				
				cells[i].styleTo("width", width + (width - appliedWidth));
				
			}
			
		}
		
	},
	syncRowHeights						 :	function() {
		
		var rowheader					 =	this.components.rowheader.components.grid.rows;
		var content						 =	this.components.content.components.grid.rows;
		
		var i							 =	rowheader.length;
		
		while (i--) {
			
			var rowrow					 =	rowheader[i];
			var row						 =	content[i];
			
			if (!rowrow || !row)			continue;
			
			var height					 =	rowrow.cells[0].components.content.get("height");
			var cells					 =	row.cells;
			var j						 =	cells.length;
			
			while (j--) {
				
				if (cells[j])				cells[j].components.content.styleTo("height", height);
				
			}
			
		}
		
	},
	updateSizerPositions				 :	function(grid, vertical) {
		
		var posProperty					 =	(vertical) ? "top" : "left";
		var sizeProperty				 =	(vertical) ? "actualHeight" : "actualWidth";
		var rows						 =	grid.rows;
		var i							 =	rows.length;
		
		while (i--) {
			
			var row						 =	rows[i];
			var cells					 =	row.cells;
			var j						 =	cells.length;
			
			while (j--) {
				
				var cell				 =	cells[j];
				var sizer				 =	cell.components.sizer;
				
				sizer.styleTo(posProperty, cell.get(posProperty) + cell.get(sizeProperty) - sizer.get(sizeProperty) / 2);
				
			}
			
		}
		
	}
	
	//*														
	//*												}		
	//*														
	
});

//+																														
//+		Handlers																								}	{	
//+																														
	
	SOAPI.Gridbox_Handlers				 =	{
		
		onContentChange					 :	function() {
			
			this.syncRowHeights();
			this.syncColWidths();
			this.updateSizerPositions(this.components.colheader.components.grid, false);
			this.updateSizerPositions(this.components.rowheader.components.grid, true);
			
		},
		
		grid							 :	{
			
			setRowState					 :	function(index, state) {
				
				this.parentWidget.setRowState(index, state);
				
			},
			setColState					 :	function(index, state) {
				
				this.parentWidget.setColState(index, state);
				
			},
			blank						 :	function() {}
			
		},
		colheader						 :	{
			
			addCell						 :	function(rowPos, cellPos, tbody, header) {
				
				this.parentWidget.makeSizer(this._addCell(rowPos, cellPos, tbody, header).cell, false);
				
			}
			
		},
		rowheader						 :	{
			
			addCell						 :	function(rowPos, cellPos, tbody, header) {
				
				this.parentWidget.makeSizer(this._addCell(rowPos, cellPos, tbody, header).cell, true);
				
			}
			
		},
		sizer							 :	{
			
			onDrag						 :	function() {
				
				SOAPI.Event.bubbleContentChange(this.parentWidget);
				
			}
			
		}
		
	};
	
//+																														
//+																												}		
//+																														
