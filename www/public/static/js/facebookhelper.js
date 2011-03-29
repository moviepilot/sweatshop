/**
 * -------------------------------------------------------------------------------- Facebook helper object
 */

ExtAPI.App.facebookhelper		 	 	 = 	Class.extend
({
	
	ref									 :	null,
	
	searchEl							 :	null,
	searchResults						 :	null,
	
	progressBar							 :	null,
	
	searchOffset						 :	0,
	
	init								 :	function(ref) {
		
		if (ref)					 		this.ref = ref;
		
		this.buildModal();
		this.search();	
		
	},
	
	buildModal							 :	function() {
		
		if ($('#modal').length > 0)			$('#modal').remove();
		
		var modal						 = 	$('<div />').attr('id','modal');
		var handlers					 =	ExtAPI.App.facebookhelper.eventHandlers;
		
		$('body').append(modal);
		
		var obj							 =	this;
		modal.dialog({
			
			height						 :  520,
			modal						 : 	true,
			minWidth					 :	580,
			title 						 : 	'Search Facebook',
			buttons						 : 	{
				
				"Add selected"			 : 	function() {
				
					obj.saveSelection(this);
				
					obj 				 =	null;
					
					$(this).dialog('close');
					$(this).remove();
					
				},
				
				"More..."			 	 : 	function() { obj.search(); },
				
				Cancel					 : 	function() { $( this ).dialog( "close" ); }
				
			}

			});
		
		//~ Search field
		
		var searchHolder				 =	$('<div />').addClass('fbsearch');
		
		searchHolder.text('Searching for: ');
		
		this.searchEl					 =	$('<input type="text"/>');
		
		this.searchEl.val(window.currentNode.name);
		
		this.searchEl.bind('keyup', { 'ref' : this }, handlers.input.onkeyup);
			
		searchHolder.append(this.searchEl);
		
		this.searchResults				 =	$('<div />').addClass('fbsearchresults');
		
		modal.append(searchHolder);
		modal.append(this.searchResults);		
		
		//~ Progress bar
		
		this.progressBar				 =	$('<div />').attr('id','fbprogress').progressbar({ value: 100 });
		this.progressBar.hide();
		
		modal.append(this.progressBar);
		
	},
	
	search								 :	function() {
		
		this.searchResults.children().remove();
		
		var data						 = 	new Object();
		
		data.q 							 =	this.searchEl.val();
		data.type						 =	'page';
		data.fields						 =	'id,link,name,category,picture,likes';
		data.limit						 =	25;
		data.offset						 =	this.searchOffset;
		
		var obj							 =	this;
		$.ajax({
		
			url 						 : 	'https://graph.facebook.com/search',
			data 						 : 	data,
			type						 :	'get',
			dataType					 :	'jsonp',
			success 					 : 	function(data,status) { obj.onResponse(data,status);  obj = null; }
			
		});
		
		this.progressBar.show();
		
	},
	
	onResponse							 :	function(data,status) {
		
		this.progressBar.hide();
		
		if (status == 'success') {
			
			if (data.data && data.data.length > 0) {
				
				this.searchOffset		+= 	25;
				
				var ln 					 =	data.data.length;
				
				for (var i = 0; i < ln; i++) {
					
					if (!window.currentNode.facebook_ids || window.currentNode.facebook_ids.indexOf(data.data[i].id) == -1) this.addResultRow(data.data[i]);
				
				}
				
				this.searchResults.scrollTop(0);
				
			} else {
				
				this.searchResults.text("We couldn't find node results matching those terms");
				
			}			
			
		} else {
			
			this.searchResults.text('Unable to connect to Facebook at this time');
			
		}
		
	},
	
	addResultRow 						 :	function(data) {
		
		var handlers					 =	ExtAPI.App.facebookhelper.eventHandlers;
		
		var row							 =	$('<div />').addClass('fbsearchrow');
		
		row.disableSelection();
		
		//~ Image
		
		var image						 =	$('<img />').addClass('image');							
		
		image.attr('src',data.picture);
		row.append(image);
		
		//~ Name
		
		var name						 =	$('<div />').addClass('name');							
		
		name.text(data.name);
		row.append(name);
		
		//~ Category
		
		var category					 =	$('<div />').addClass('category');							
		
		category.text(data.category);
		row.append(category);
		
		//~ Likes
		
		var likes						 =	$('<div />').addClass('likes');							
		
		likes.text('Likes: ' + data.likes);
		row.append(likes);
		
		//~ Link
		
		var link						 =	$('<a />').addClass('link');							
		link.attr('href',data.link);
		link.text(data.link);
		row.append(link);
				
		//~ Checkbox
		
		var checkboxHolder				 =	$('<div />').addClass('checkboxHolder');							
		
		checkboxHolder.text('Select ');
		row.append(checkboxHolder);
		
		var check						 =	$('<input type="checkbox" />').addClass('checkbox').val(data.id);
		checkboxHolder.append(check);
		
		check.bind('mouseup', handlers.checkbox.onmouseup);
		
		this.searchResults.append(row);
				
	},
	
	saveSelection						 :	function(ref) {
		
		var checkboxes					 =	$('.checkbox:checked');
		
		if (checkboxes.length > 0) {
			
			var ln 						 =	checkboxes.length;
			
			for (var i = 0; i < ln; i++) {
				
				if (checkboxes[i].checked) 	this.ref.addRow('facebook_id',checkboxes[i].value,false);
			
			}
			
			this.ref.saveInput('facebook_id');
			
		}
		
		this.destroy();
		
	},
	
	destroy								 :	function() {
		
		this.searchResults.children().unbind();
		this.searchResults.children().remove();
		
		this.progressBar.remove();
	
		this.searchEl.unbind();
		this.searchEl.remove();
				
		this.ref						 =	null;	
		this.searchEl					 =	null;
		this.searchResults				 =	null;
		this.progressBar				 =	null;
		this.total						 =	0;
		
	}

});

ExtAPI.App.facebookhelper.eventHandlers	 = 	{
	
	input								 :	{
		
		onkeyup							 :	function(event) {
			
			var ref 					 =	event.data.ref;
			
			if (event.keyCode == '13') {
				
				ref.searchOffset		 =	0;
				ref.search();
				
			}
			
			return true;
			
		}
		
	},
	
	checkbox							 :	{
		
		onmouseup						 :	function(event)  {
			
			$(this).parents('.fbsearchrow').toggleClass('selected');
						
			return true;
		
		}
		
	}
	
}

