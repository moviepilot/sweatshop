<?php
	
	$requirements						 =	array(
		"soapi"							 =>	array(
			"animator"					 =>	array("soapi" => "sprite transition"),
			"class"						 =>	array("soapi" => "soapi"),
			"cookie"					 =>	array("soapi" => "core"),
			"core"						 =>	array("soapi" => "core_all core_opera core_ie core_gecko"),
			"dragger"					 =>	array("soapi" => "class event"),
			"event"						 =>	array("soapi" => "events"),
			"events"					 =>	array("soapi" => "soapi"),
			"soapi"						 =>	array("soapi" => "core cookie"),
			"sprite"					 =>	array("soapi" => "dragger"),
			"validator"					 =>	array("soapi" => "soapi"),
			"widget"					 =>	array("soapi" => "sprite ajax"),
			"ajax"						 =>	array("soapi" => "core"),
			"transition"				 =>	array("soapi" => "core"),
			"raphael"					 =>	array("raphael"),
			"date"					 	 =>	array("date")
		),
		"soapi_widgets"					 =>	array(
			"actions"					 => array("soapi" => "widget"),
			"anibutton"					 =>	array("soapi_widgets" => "button"),
			"button"					 =>	array("soapi_widgets" => "panel"),
			"clock"						 =>	array("soapi" => "widget"),
			"chart"						 =>	array("soapi_widgets" => "panel" , "soapi" => "raphael"),
			"desktop"					 =>	array("soapi_widgets" => "panel"),
			"dialog"					 =>	array("soapi_widgets" => "window"),
			"datepicker"				 =>	array("soapi_widgets" => "panel" , "soapi" => "date"),
			"draggroup"				 	 =>	array("soapi" => "widget","soapi_widgets" => "panel"),
			"form"						 =>	array("soapi" => "widget"),
			"grid"						 =>	array("soapi" => "widget"),
			"gridbox"					 =>	array("soapi_widgets" => "scrollbox grid"),
			"lightbox"					 =>	array("soapi_widgets" => "dialog"),
			"list"						 =>	array("soapi_widgets" => "optionbutton"),
			"listbox"					 =>	array("soapi_widgets" => "scrollbox list"),
			"menu"						 =>	array("soapi_widgets" => "list menuitem"),
			"menuitem"					 =>	array("soapi_widgets" => "button"),
			"optionbutton"				 =>	array("soapi_widgets" => "togglebutton"),
			"panel"						 =>	array("soapi" => "widget animator"),
			"progressbar"				 =>	array("soapi" => "widget"),
			"scrollbar"					 =>	array("soapi_widgets" => "button"),
			"scrollbox"					 =>	array("soapi_widgets" => "scrollbar"),
			"selectbox"					 =>	array("soapi_widgets" => "menu"),
			"splitpanel"				 =>	array("soapi_widgets" => "button"),
			"tabstrip"					 =>	array("soapi_widgets" => "scrollbox"),
			"textarea"					 =>	array("soapi" => "validator validator_definitions", "soapi_widgets" => "textbox scrollbox"),
			"textbox"					 =>	array("soapi" => "widget validator validator_definitions"),
			"togglebutton"				 =>	array("soapi_widgets" => "button"),
			"tooltip"					 =>	array("soapi" => "animator", "soapi_widgets" => "window"),
			"upload"					 =>	array("soapi" => "widget"),
			"window"					 =>	array("soapi_widgets" => "button"),
		),
	);
	
	$namespaces							 =	array(
		"soapi"							 =>	"",
		"soapi_widgets"					 =>	"widgets/",
	);
	
	function getRequirements($namespace, $module) {
		
		global $requirements;
		
		$list							 =	array();
		
		if (!isset($requirements[$namespace]) || !isset($requirements[$namespace][$module])) {
			
			return $list;
			
		}
		
		$needed							 =	$requirements[$namespace][$module];
		
		foreach ($needed as $neededNamespace => $neededModules) {
			
			$neededModules				 =	explode(" ", $neededModules);
			
			foreach ($neededModules as $neededModule) {
				
				$neededList				 =	getRequirements($neededNamespace, $neededModule);
				
				foreach ($neededList as $item) {
					
					if (!in_array($item, $list)) {
						
						$list[]			 =	$item;
						
					}
					
				}
				
				$neededItem				 =	array($neededNamespace, $neededModule);
				
				if (!in_array($neededItem, $list)) {
					
					$list[]				 =	$neededItem;
					
				}
				
				
			}
			
		}
		
		return $list;
		
	}
	
	$list								 =	array();
	
	foreach ($_GET as $namespace => $modules) {
		
		$modules						 =	explode(" ", $modules);
		
		foreach ($modules as $module) {
			
			$neededList					 =	getRequirements($namespace, $module);
			
			foreach ($neededList as $item) {
				
				if (!in_array($item, $list)) {
					
					$list[]				 =	$item;
					
				}
				
			}
			
			$neededItem					 =	array($namespace, $module);
			
			if (!in_array($neededItem, $list)) {
				
				$list[]					 =	$neededItem;
				
			}
			
		}
		
	}
	
	$files								 =	array();
	
	foreach ($list as $item) {
		
		$files[]						 =	(isset($namespaces[$item[0]]) ? $namespaces[$item[0]] : "") . $item[1] . ".js";
		
	}
	
	header("Content-Type: text/javascript; charset=UTF-8");
	
	foreach ($files as $file) {
		
		echo(file_get_contents($file));
		
	}
	
	exit();
	