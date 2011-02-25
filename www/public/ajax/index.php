<?php

function curlput($url,$data,$method = 'put') {
	
	$chand 								 = 	curl_init();
	
	curl_setopt($chand, CURLOPT_URL, 			$url); 
	curl_setopt($chand, CURLOPT_RETURNTRANSFER, 1);
	
	if ($method == 'put') {
	
		$ln							 	 =	strlen($data);
	
		$fhand 							 = 	fopen('php://memory', 'rw');
	
		fwrite($fhand,$data);
		rewind($fhand);
	
		curl_setopt($chand, CURLOPT_PUT,				1);
		curl_setopt($chand, CURLOPT_INFILESIZE, 		$ln);
		curl_setopt($chand, CURLOPT_INFILE, 			$fhand);
		
	} elseif ($method == 'post') {
		
		curl_setopt($chand, CURLOPT_POST,			1);
		curl_setopt($chand, CURLOPT_POSTFIELDS,		$data);
		
		
	}
	
	$curlreposonse						 = 	curl_exec($chand);
	
	curl_close($chand);
	
	if (!$curlreposonse)					return false;	
	
	return 									$curlreposonse;
	
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
		
		case 'edgeupdate':
			
			$url						.= 	'edges/' . $_POST['_id'];
			$putData					 =	json_encode(array("weight" => $_POST['weight']));
			
			if (curlput($url,$putData)) {
				
				$repsonse['type']		 =	'message';
				$repsonse['message']	 =	'Edge value has been updated';
			
			}
			
		break;
	
		case 'newedge':
			
			$url						.= 	'edges';
			$putData					 =	json_encode(array("type" => "WorksIn", "from" => (int) $_POST['from_id'],"to" => (int) $_POST['to_id'],"weight" => (float) $_POST['weight']));
			$postreponse 				 = 	curlput($url,$putData,'post');
			
			if ($postreponse == "\"edge already existing\"") {
				
				$repsonse['type']		 =	'error';
				$repsonse['message']	 =	'That edge already exists';
				
			} else {
				
				$repsonse['type']		 =	'message';
				$repsonse['message']	 =	'A new edge has been created';
				
			}
			
		break;
		
	}
	
}

echo json_encode($repsonse);