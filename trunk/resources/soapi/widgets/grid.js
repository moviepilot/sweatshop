//#																														
//#	SOAPI 4.8													Copyright © 2000 - 2009 Dan Williams.					
//#																														

//+																														
//+	SOAPI.Grid																										{	
//+(																													
	
	SOAPI.widgets.grid					 =	function(p) { new SOAPI.Grid(p); };
	
//+																														
	
	SOAPI.Grid							 =	SOAPI.Widget.extension();
	
	SOAPI.Grid.extend
	
//+)																													

/*(	//~	Documentation					
	///																					
	///		This class provides a grid widget.											
	///																					
)*/

({	//~	Code							
	
	//*														
	//*	Variables										{	
	//*														
	
	wtype								 :	"grid",
	
	defaultAutoNumType					 :	"none",
	noUpdate							 :	false,
	
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
		///					...inherited from Widget...										
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
		this.handlers					 =	SOAPI.Grid_Handlers;
		
		//.	Grid elements								{	
		
		if (!w.tBodies.length) {
			
			SOAPI.createElement({
				type					 :	"tbody",
				parent					 :	w,
				insert					 :	true
			});
			
		}
		
		var tbodies						 =	(w.tHead) ? [ w.tHead ] : [];
		var i							 =	w.tBodies.length;
		
		while (i--)							tbodies.push(w.tBodies[i]);
		
		if (w.tFoot)						tbodies.push(w.tFoot);
		
		var i							 =	tbodies.length;
		
		while (i--) {
			
			var tbody					 =	tbodies[i];
			var rows					 =	tbody.rows;
			var j						 =	rows.length;
			
			while (j--) {
				
				var row					 =	this.makeRow(rows[j]);
				var cells				 =	row.cells;
				var k					 =	cells.length;
				
				while (k--) {
					
					var cell			 =	this.makeCell(cells[k]);
					
					cell.parentWidget	 =	w;
					
					if (cell.hasAttribute("text"))				cell.write(cell.getAttribute("text"));
					
				}
				
			}
			
		}
		
		w.updateRows();
		
		//.											}		
		
		return result;
		
	},
	
	//-														
	//-												}		
	//-														
	
	makeRow								 :	function(row) {
		
		var handlers					 =	this.handlers.row;
		
		row.setAttribute("state", "default");
		
		SOAPI.Event.addEventHandler(row, "mouseover", handlers.onMouseOver, "Grid");
		SOAPI.Event.addEventHandler(row, "mouseout",  handlers.onMouseOut,  "Grid");
		
		return row;
		
	},
	makeCell							 :	function(cell) {
		
		var handlers					 =	this.handlers.cell;
		var c							 =	cell.components	 =	{};
		var content						 =	c.content		 =	this.createComponent({
			element						 :	cell,
			parent						 :	cell,
			cType						 :	"content"
		});
		
		cell.setAttribute("state", "default");
		cell.setAttribute("rowstate", "default");
		cell.setAttribute("colstate", "default");
		cell.setAttribute("action", (cell.hasAttribute("action")) ? cell.getAttribute("action") : "");
		cell.setAttribute("autonumber", (cell.hasAttribute("autonumber")) ? cell.getAttribute("autonumber") : this.defaultAutoNumType);
		
		SOAPI.Event.addEventHandler(cell, "mouseover", handlers.onMouseOver, "Grid");
		SOAPI.Event.addEventHandler(cell, "mouseout",  handlers.onMouseOut,  "Grid");
		SOAPI.Event.addEventHandler(cell, "mouseover", handlers.onMouseOver, "Grid");
		SOAPI.Event.addEventHandler(cell, "mouseout",  handlers.onMouseOut,  "Grid");
		SOAPI.Event.addEventHandler(cell, "action");
		
		cell.write						 =	handlers.write;
		
		return cell;
		
	},
	
	setRowState							 :	function(index, state) {
		
		if (!this.rows[parseInt(index)])	return;
		
		var cells						 =	this.rows[parseInt(index)].cells;
		var i							 =	cells.length;
		
		while (i--)							cells[i].setAttribute("rowstate", state);
		
	},
	setColState							 :	function(index, state) {
		
		index							 =	parseInt(index);
		
		var rows						 =	this.rows;
		var i							 =	rows.length;
		
		while (i--) {
			
			var cell					 =	rows[i].cells[index];
			
			if (cell)						cell.setAttribute("colstate", state);
			
		}
		
	},
	
	addRow								 :	function(rowPos, tbody, numCells) {
		
		if (tbody == null)					tbody			 =	this.tBodies[this.tBodies.length - 1];
		
		var rows						 =	tbody.rows;
		
		if (rowPos == null)					rowPos			 =	rows.length;
		
		var before						 =	rowPos < rows.length;
		
		if (rowPos >= rows.length)			rowPos			 =	(rows.length) ? rows.length - 1 : 0;
		
		var refRow						 =	rows[rowPos];
		
		var newRow						 =	this.makeRow(SOAPI.createElement({
			type						 :	"tr",
			insert						 :	false
		}));
		
		if (refRow)							refRow.parentNode[(before) ? "insertBefore" : "insertAfter"](newRow, refRow);
		else								tbody.appendChild(newRow);
		
		if (numCells == null)				numCells		 =	1;
		
		while (numCells--)					this.addCell(newRow.rowIndex, null, tbody);
		
		if (!this.noUpdate) {
			
			this.updateRows(tbody, rowPos);
			
			SOAPI.Event.bubbleContentChange(this);
			
		}
		
		return { row: newRow, rows: rows.length };
		
	},
	removeRow							 :	function(rowPos, tbody) {
		
		if (tbody == null)					tbody			 =	this.tBodies[this.tBodies.length - 1];
		
		var rows						 =	tbody.rows;
		
		if (rowPos == null)					rowPos			 =	rows.length - 1;
		
		var row							 =	rows[rowPos];
		
		if (!row)							return 0;
		
		tbody.removeChild(row);
		
		if (!this.noUpdate) {
			
			this.updateRows(tbody, rowPos);
			
			SOAPI.Event.bubbleContentChange(this);
			
		}
		
		return rows.length;
		
	},
	removeAllRows						 :	function(tbody) {
		
		if (tbody == null)					tbody			 =	this;
		
		var rows						 =	tbody.rows;
		var i							 =	rows.length;
		
		while (i--)							rows[i].parentNode.removeChild(rows[i]);
		
		if (!this.noUpdate)					SOAPI.Event.bubbleContentChange(this);
		
	},
	
	addCol								 :	function(colPos) {
		
		var i							 =	this.rows.length;
		
		while (i--)							this.addCell(i, colPos, this);
		
		if (!this.noUpdate)					SOAPI.Event.bubbleContentChange(this);
		
	},
	removeCol							 :	function(colPos) {
		
		var i							 =	this.rows.length;
		
		while (i--)							this.removeCell(i, colPos, this);
		
		if (!this.noUpdate)					SOAPI.Event.bubbleContentChange(this);
		
	},
	
	addCell								 :	function(rowPos, cellPos, tbody, header) {
		
		if (tbody == null)					tbody			 =	this.tBodies[this.tBodies.length - 1];
		
		var row							 =	tbody.rows[rowPos];
		
		if (!row)							return false;
		
		var cells						 =	row.cells;
		
		if (cellPos == null)				cellPos			 =	cells.length;
		
		var before						 =	cellPos < cells.length;
		var atEnd						 =	cellPos == cells.length;
		
		if (cellPos >= cells.length)		cellPos			 =	(cells.length) ? cells.length - 1 : 0;
		
		var refCell						 =	cells[cellPos];
		
		var newCell						 =	this.makeCell(SOAPI.createElement({
			type						 :	(header) ? "th" : "td",
			attributes					 :	{ component: "cell" },
			insert						 :	false
		}));
		
		newCell.parentWidget			 =	this;
		
		if (refCell && !atEnd)				row[(before) ? "insertBefore" : "insertAfter"](newCell, refCell);
		else								row.appendChild(newCell);
		
		if (!this.noUpdate) {
			
			this.updateRows(tbody, rowPos, rowPos);
			
			SOAPI.Event.bubbleContentChange(this);
			
		}
		
		return { cell: newCell, cells: cells.length };
		
	},
	removeCell							 :	function(rowPos, cellPos, tbody) {
		
		if (tbody == null)					tbody			 =	this.tBodies[this.tBodies.length - 1];
		
		var row							 =	tbody.rows[rowPos];
		
		if (!row)							return false;
		
		var cells						 =	row.cells;
		
		if (cellPos == null)				cellPos			 =	cells.length - 1;
		
		var cell						 =	cells[cellPos];
		
		if (!cell)							return 0;
		
		row.removeChild(cell);
		
		if (!this.noUpdate) {
			
			this.updateRows(tbody, rowPos, rowPos);
			
			SOAPI.Event.bubbleContentChange(this);
			
		}
		
		return cells.length;
		
	},
	removeAllCells						 :	function(rowPos, tbody) {
		
		if (tbody == null)					tbody			 =	this.tBodies[this.tBodies.length - 1];
		
		var row							 =	tbody.rows[rowPos];
		
		if (!row)							return false;
		
		var cells						 =	row.cells;
		var i							 =	cells.length;
		
		while (i--)							row.removeChild(cells[i]);
		
		if (!this.noUpdate)					SOAPI.Event.bubbleContentChange(this);
		
	},
	
	updateRows							 :	function(tbody, min, max) {
		
		if (this.noUpdate)					return;
		
		if (tbody == null)					tbody			 =	this;
		
		var rows						 =	tbody.rows;
		
		if (!rows.length)					return;
		
		if (min == null || min < 0)			min				 =	0;
		if (max == null || max < 0)			max				 =	rows.length - 1;
		
		for (var i = min; i <= max; i++) {
			
			var row						 =	rows[i];
			var cells					 =	row.cells;
			var j						 =	cells.length;
			
			while (j--) {
				
				var cell				 =	cells[j];
				var autonum				 =	cell.getAttribute("autonumber");
				
				if (autonum == "row")		cell.write(row.rowIndex + 1);
				if (autonum == "col")		cell.write(cell.cellIndex + 1);
				
				cell.setAttribute("row", row.rowIndex + 1);
				cell.setAttribute("col", cell.cellIndex + 1);
				cell.setAttribute("oddrow", (row.rowIndex   % 2) == 0);
				cell.setAttribute("oddcol", (cell.cellIndex % 2) == 0);
				
			}
			
			row.setAttribute("row", row.rowIndex + 1);
			row.setAttribute("odd", (row.rowIndex % 2) == 0);
			
		}
		
	},
	
	applyData							 :	function(data, startRow, tbody) {
		
		if (startRow == null)				startRow		 =	0;
		if (tbody == null)					tbody			 =	this;
		
		var rows						 =	tbody.rows;
		
		for (var i = 0, datarow; (datarow = data[i]) != null; i++) {
			
			var row						 =	rows[i + startRow];
			
			if (!row)						break;
			
			var cells					 =	row.cells;
			
			for (var j = 0, datacell; (datacell = datarow[j]) != null; j++) {
				
				var cell				 =	cells[j];
				
				if (!cell)					break;
				
				if (isObject(datacell)) {
					
					//	Attributes
					if (datacell.a) {
						
						for (var k in datacell.a)	cell[k]	 =	datacell[k];
						
					}
					
					//	Data
					cell.write((datacell.d) ? datacell.d : "");
					
					continue;
					
				}
				
				cell.write(datacell);
				
			}
			
		}
		
	},
	clearData							 :	function(tbody) {
		
		if (tbody == null)					tbody			 =	this;
		
		var rows						 =	tbody.rows;
		
		if (!rows)							return;
		
		var i							 =	rows.length;
		
		while (i--) {
			
			var row						 =	rows[i];
			var cells					 =	row.cells;
			var j						 =	cells.length;
			
			while (j--)						cells[j].write("");
			
		}
		
		if (!this.noUpdate)					SOAPI.Event.bubbleContentChange(this);
		
	},
	
	setDimensions						 :	function(numRows, numCols, tbody, noBubble) {
		
		this.noUpdate					 =	true;
		
		if (tbody == null)					tbody			 =	this.tBodies[this.tBodies.length - 1];
		if (numRows == null)				numRows			 =	1;
		if (numCols == null)				numCols			 =	1;
		
		var rows						 =	tbody.rows;
		
		if (rows.length > numRows) {
			
			var minRow					 =	numRows - 1;
			var i						 =	rows.length - numRows;
			
			while (i--)						tbody.removeChild(rows[rows.length - 1]);
			
		} else if (rows.length < numRows) {
			
			var minRow					 =	rows.length - 1;
			var i						 =	numRows - rows.length;
			
			while (i--)						this.addRow(null, tbody, numCols);
			
		}
		
		var i							 =	rows.length;
		
		while (i--) {
			
			var row						 =	rows[i];
			var cells					 =	row.cells;
			
			if (cells.length > numCols) {
				
				var j					 =	cells.length - numCols;
				
				while (j--)					row.removeChild(cells[cells.length - 1]);
				
			} else if (cells.length < numCols) {
				
				var j					 =	numCols - cells.length;
				
				while (j--)					this.addCell(i, null, tbody);
				
			}
			
		}
		
		this.noUpdate					 =	false;
		
		this.updateRows(tbody, minRow);
		
		if (!noBubble)						SOAPI.Event.bubbleContentChange(this);
		
	}
	
	//*														
	//*												}		
	//*														
	
});

//+																														
//+		Handlers																								}	{	
//+																														
	
	SOAPI.Grid_Handlers					 =	{
		
		row								 :	{
			
			onMouseOver					 :	function(event) {
				
				this.setAttribute("state", "over");
				
				event.stopPropagation();
				
				return true;
				
			},
			onMouseOut					 :	function(event) {
				
				this.setAttribute("state", "default");
				
				event.stopPropagation();
				
				return true;
				
			}
			
		},
		cell							 :	{
			
			onMouseOver					 :	function(event) {
				
				this.setAttribute("state", "over");
				this.parentWidget.setRowState(this.parentNode.rowIndex, "over");
				this.parentWidget.setColState(this.cellIndex, "over");
				
				return true;
				
			},
			onMouseOut					 :	function(event) {
				
				this.setAttribute("state", "default");
				this.parentWidget.setRowState(this.parentNode.rowIndex, "default");
				this.parentWidget.setColState(this.cellIndex, "default");
				
				return true;
				
			},
			onMouseDown					 :	function(event) {
				
				this.setAttribute("state", "down");
				this.parentWidget.setRowState(this.parentNode.rowIndex, "down");
				this.parentWidget.setColState(this.cellIndex, "down");
				
				event.stopPropagation();
				
				return true;
				
			},
			onMouseUp					 :	function(event) {
				
				this.setAttribute("state", "over");
				this.parentWidget.setRowState(this.parentNode.rowIndex, "over");
				this.parentWidget.setColState(this.cellIndex, "over");
				
				event.stopPropagation();
				
				SOAPI.Event.triggerEvent("action", this);
				
				return true;
				
			},
			write						 :	function(html, append) {
				
				this.components.content.write(html, append);
				
			}
			
		}
		
	};
	
//+																														
//+																												}		
//+																														
