<?php

header("Content-Type: text/javascript; charset=UTF-8");

$jsDir                                   =  './js/';

$jsFiles                                 =  scandir($jsDir);

foreach($jsFiles as $jsFile) {
    
    if (!preg_match("/^\.+/",$jsFile))      echo file_get_contents($jsDir . $jsFile);
    
}

exit();