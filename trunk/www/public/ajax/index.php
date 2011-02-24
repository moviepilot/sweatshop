<?php

function curlput($url,$putData) {
	
	$ln							 		 =	strlen($putData);
	
	$fhand 								 = 	fopen('php://memory', 'rw');
	
	fwrite($fhand,$putData);
	rewind($fhand);
	
	$chand 								 = 	curl_init();
	
	curl_setopt($chand, CURLOPT_URL, 				$url); 
	curl_setopt($chand, CURLOPT_RETURNTRANSFER, 	1); 
	curl_setopt($chand, CURLOPT_PUT, 				1); 
	curl_setopt($chand, CURLOPT_INFILE, 			$fhand);
	curl_setopt($chand, CURLOPT_INFILESIZE, 		$ln);
	
	$curlreposonse						 = 	curl_exec($chand);
	
	if (!$curlreposonse)			return false;	
	
	return true;
	
}


header('Cache-Control: no-cache, must-revalidate');
header('Content-type: application/json');

$response								 =	array();
$url									 =	'http://devbox:6677/';

if (isset($_POST['key']) && !empty($_POST['key'])) {
	
	$key								 =	$_POST['key'];	
	
	switch ($key) {
		
		case 'name':
			
			$url						.= 	'nodes/' . $_POST['_id'];
			$putData					 =	json_encode(array('name' => $_POST['value']));
			
			if (curlput($url,$putData)) {
				
				$repsonse['type']		 =	'message';
				$repsonse['message']	 =	'Node name has been updated';
			
			}
			
		break;
		
		case 'type':
			
			$url						.= 	'nodes/' . $_POST['_id'];
			$putData					 =	json_encode(array('type' => $_POST['value']));
			
			if (curlput($url,$putData)) {
				
				$repsonse['type']		 =	'message';
				$repsonse['message']	 =	'Node type has been updated';
			
			}
			
		break;
	
		case 'facebook_ids':
			
			$url						.= 	'nodes/' . $_POST['_id'];
			$putData					 =	json_encode(array($key => split(',',$_POST['value'])));
			
			if (curlput($url,$putData)) {
				
				$repsonse['type']		 =	'message';
				$repsonse['message']	 =	'Facebook ids have been updated';
			
			}
			
		break;
	
		case 'moviemaster_id':
		case 'permalink':
			
			$url						.= 	'nodes/' . $_POST['_id'];
			$putData					 =	json_encode(array($key => $_POST['value']));
			
			if (curlput($url,$putData)) {
				
				$repsonse['type']		 =	'message';
				$repsonse['message']	 =	'Property has been updated';
			
			}
			
		break;
		
		case 'nodepropremove':
			
			$url						.= 	'nodes/' . $_POST['_id'];
			$putData					 =	json_encode(array($_POST['value'] => ''));
			
			if (curlput($url,$putData)) {
				
				$repsonse['type']		 =	'message';
				$repsonse['message']	 =	'Property has been removed';
			
			}			
			
		break;
		
		case 'edge':
			
			if ($_POST['_id'] == 'null') {
				
				$repsonse['type']		 =	'message';
				$repsonse['message']	 =	"A new edge has been created to node id {$_POST['nodeid']}";
				
			} else {
			
				$repsonse['type']		 =	'message';
				$repsonse['message']	 =	"Edge id {$_POST['_id']} weight has been updated to {$_POST['weight']}";
			
			}
			
		break;
		
	}
	
}

echo json_encode($repsonse);