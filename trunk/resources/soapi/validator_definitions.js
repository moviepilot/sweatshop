//#																														
//#	SOAPI 4.8													Copyright © 2000 - 2009 Dan Williams.					
//#																														

//+																														
//+	SOAPI.Validator.Definitions																						{	
//+																														

/*(	//~	Documentation					
	///																					
	///		This module describes validation definitions.								
	///																					
)*/

{	//~	Code							
	
	var valid							 =	SOAPI.Validator;
	
	valid.addDefinition("Alphabetic", {
		filters							 :	valid.ALPHABETIC,
		custom							 :	"",
		description						 :	"A-Z and a-z only"
	});
	valid.addDefinition("Alphabetic_S", {
		filters							 :	valid.ALPHABETIC,
		custom							 :	" ",
		description						 :	"A-Z, a-z, and space only"
	});
	valid.addDefinition("Alphanumeric", {
		filters							 :	valid.ALPHANUMERIC,
		custom							 :	"",
		description						 :	"A-Z, a-z, and 0-9 only"
	});
	valid.addDefinition("Alphanumeric_S", {
		filters							 :	valid.ALPHANUMERIC,
		custom							 :	" ",
		description						 :	"A-Z, a-z, 0-9, and space only"
	});
	valid.addDefinition("Any", {
		filters							 :	valid.ALPHANUMERIC,
		custom							 :	" !#\u00A3$%&()*+,-./:;<=>?@[\\]^_`{|}~",
		description						 :	"all characters except ' and \""
	});
	valid.addDefinition("Any_BQ", {
		filters							 :	valid.ALPHANUMERIC,
		custom							 :	" !#\u00A3$%&()*+,-./:;<=>?@[\\]^_`{|}~'\"",
		description						 :	"all characters"
	});
	valid.addDefinition("Any_DQ", {
		filters							 :	valid.ALPHANUMERIC,
		custom							 :	" !#\u00A3$%&()*+,-./:;<=>?@[\\]^_`{|}~\"",
		description						 :	"all characters except '"
	});
	valid.addDefinition("Any_Multi", {
		filters							 :	valid.ALPHANUMERIC,
		custom							 :	" !#\u00A3$%&()*+,-./:;<=>?@[\\]^_`{|}~\t\r\n",
		description						 :	"all characters except ' and \""
	});
	valid.addDefinition("Any_Multi_BQ", {
		filters							 :	valid.ALPHANUMERIC,
		custom							 :	" !#\u00A3$%&()*+,-./:;<=>?@[\\]^_`{|}~'\"\t\r\n",
		description						 :	"all characters"
	});
	valid.addDefinition("Any_Multi_DQ", {
		filters							 :	valid.ALPHANUMERIC,
		custom							 :	" !#\u00A3$%&()*+,-./:;<=>?@[\\]^_`{|}~\"\t\r\n",
		description						 :	"all characters except '"
	});
	valid.addDefinition("Any_Multi_SQ", {
		filters							 :	valid.ALPHANUMERIC,
		custom							 :	" !#\u00A3$%&()*+,-./:;<=>?@[\\]^_`{|}~'\t\r\n",
		description						 :	"all characters except \""
	});
	valid.addDefinition("Any_SQ", {
		filters							 :	valid.ALPHANUMERIC,
		custom							 :	" !#\u00A3$%&()*+,-./:;<=>?@[\\]^_`{|}~'",
		description						 :	"all characters except \""
	});
	valid.addDefinition("Boolean", {
		filters							 :	valid.NO_FILTER,
		custom							 :	"01",
		description						 :	"0 and 1 only"
	});
	valid.addDefinition("Date", {
		filters							 :	valid.ALPHANUMERIC,
		custom							 :	" ,-./:",
		description						 :	"A-Z, a-z, 0-9, space, and ,-./: only"
	});
	valid.addDefinition("Decimal", {
		filters							 :	valid.NUMERIC,
		custom							 :	".",
		description						 :	"0-9 and . only"
	});
	valid.addDefinition("Decimal_S", {
		filters							 :	valid.NUMERIC,
		custom							 :	" .",
		description						 :	"0-9, space, and . only"
	});
	valid.addDefinition("Email", {
		filters							 :	valid.LOWERCASE | valid.NUMERIC,
		custom							 :	".-@_",
		description						 :	"a-z, 0-9, and .-@_ only",
		actionBefore					 :	'data=data.toLowerCase()'
	});
	valid.addDefinition("Filename", {
		filters							 :	valid.ALPHANUMERIC,
		custom							 :	" !#\u00A3$%&()+,-.;=@[]^_`{}~'",
		description						 :	"all characters except \\/:*?\"<>|"
	});
	valid.addDefinition("Filepath", {
		filters							 :	valid.ALPHANUMERIC,
		custom							 :	" !#\u00A3$%&()+,-./;=@[]^_`{}~'",
		description						 :	"all characters except \\:*?\"<>|"
	});
	valid.addDefinition("Integer", {
		filters							 :	valid.NUMERIC,
		custom							 :	"-",
		description						 :	"0-9 and - only"
	});
	valid.addDefinition("Integer_S", {
		filters							 :	valid.NUMERIC,
		custom							 :	" -",
		description						 :	"0-9, space, and - only"
	});
	valid.addDefinition("Lowercase", {
		filters							 :	valid.LOWERCASE,
		custom							 :	"",
		description						 :	"a-z only",
		actionBefore					 :	'data=data.toLowerCase()'
	});
	valid.addDefinition("Lowercase_S", {
		filters							 :	valid.LOWERCASE,
		custom							 :	" ",
		description						 :	"a-z and space only",
		actionBefore					 :	'data=data.toLowerCase()'
	});
	valid.addDefinition("Number", {
		filters							 :	valid.NUMERIC,
		custom							 :	"-.",
		description						 :	"0-9 and -. only"
	});
	valid.addDefinition("Number_S", {
		filters							 :	valid.NUMERIC,
		custom							 :	" -.",
		description						 :	"0-9, space, and -. only"
	});
	valid.addDefinition("Numeric", {
		filters							 :	valid.NUMERIC,
		custom							 :	"",
		description						 :	"0-9 only"
	});
	valid.addDefinition("Numeric_S", {
		filters							 :	valid.NUMERIC,
		custom							 :	" ",
		description						 :	"0-9 and space only"
	});
	valid.addDefinition("Uppercase", {
		filters							 :	valid.UPPERCASE,
		custom							 :	"",
		description						 :	"A-Z only",
		actionBefore					 :	'data=data.toUpperCase()'
	});
	valid.addDefinition("Uppercase_S", {
		filters							 :	valid.UPPERCASE,
		custom							 :	" ",
		description						 :	"A-Z and space only",
		actionBefore					 :	'data=data.toUpperCase()'
	});
	valid.addDefinition("URL", {
		filters							 :	valid.ALPHANUMERIC,
		custom							 :	":/.-_?&#=+%",
		description						 :	"A-Z, a-z, 0-9, and :/.-_?&#=+% only"
	});
	valid.addDefinition("Variable_PHP", {
		filters							 :	valid.ALPHANUMERIC,
		custom							 :	"_",
		description						 :	"A-Z, a-z, 0-9, and _ only"
	});
	
}

//+																														
//+																												}		
//+																														
