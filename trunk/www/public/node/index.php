<?php

header('Cache-Control: no-cache, must-revalidate');
header('Content-type: application/json');

$url									 =	'http://devbox:6677/';

if (isset($_GET['_id']) && !empty($_GET['_id'])) {
	
	$url								.= 	'nodes/' . $_GET['_id'] . (isset($_GET['edges']) ? '/edges/out' : NULL);
	
	$json							 	 =	@file_get_contents($url);
	
	if (empty($json))						$json = json_encode(array('type' => 'error' , 'message' => 'Failed to make a connection to data server'));
	
	echo $json;
	
}

if (isset($_POST['search']) && !empty($_POST['search'])) {
	
	$url								.= 	'search?q=' . urlencode($_POST['search']);
	
	$json							 	 =	@file_get_contents($url);
	
	if (empty($json))						$json = json_encode(array('type' => 'error' , 'message' => 'Failed to make a connection to data server'));
	
	echo $json;
	
}
