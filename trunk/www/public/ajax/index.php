<?php

header('Cache-Control: no-cache, must-revalidate');
header('Content-type: application/json');

$repsonse								 =	array();

if (isset($_POST['key']) && !empty($_POST['key'])) {
	
	$key								 =	$_POST['key'];	
	
	switch ($key) {
		
		case 'name':
			
			$repsonse['type']			 =	'message';
			$repsonse['message']		 =	'Node name has been updated';
			
		break;
		
		case 'type':
			
			$repsonse['type']			 =	'message';
			$repsonse['message']		 =	'Node type has been updated';
			
		break;
	
		case 'facebook_ids':
		case 'moviemaster_id':
		case 'permalink':
			
			$repsonse['type']			 =	'message';
			$repsonse['message']		 =	"Property has been updated";
			
		break;
	
		case 'edge':
			
			$repsonse['type']			 =	'message';
			$repsonse['message']		 =	"Edge id {$_POST['_id']} weight has been updated to {$_POST['weight']}";
			
		break;
		
	}
	
}

echo json_encode($repsonse);