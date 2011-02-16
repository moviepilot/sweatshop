<?php

header('Cache-Control: no-cache, must-revalidate');
header('Content-type: application/json');

if (isset($_GET['_id']) && !empty($_GET['_id'])) {
	
	$url								 = 	'http://devbox:6677/node/' . $_GET['_id'] . (isset($_GET['edges']) ? '/edges' : NULL);
	
	echo 								 	file_get_contents($url);
	
}

