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
		
		case 'category':
			
			$repsonse['type']			 =	'message';
			$repsonse['message']		 =	'Node category has been updated';
			
		break;
		
	}
	
}



echo json_encode($repsonse);