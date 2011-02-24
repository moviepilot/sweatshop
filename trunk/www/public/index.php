<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
    "http://www.w3.org/TR/html4/strict.dtd"
    >
<html lang="en">
<head>
    <title>Movie Pilot demo interface</title>
    
    <link rel="stylesheet" href="/static/css/global.css" type="text/css" media="screen" />
    <link rel="stylesheet" href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8/themes/base/jquery-ui.css" type="text/css" media="screen" />
    
    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.5.0/jquery.min.js" charset="utf-8"></script>
    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.9/jquery-ui.min.js" charset="utf-8"></script>
     <script type="text/javascript" src="/static/jquery.class.js" charset="utf-8"></script>
    <script type="text/javascript" src="/static/app.php" charset="utf-8"></script>
    
    <script>
        
        window.intiNodeId                =  12233;
    
    </script>
    
</head>
<body>
    <div id="wrapper">
        
        <div id="breadcrumb"></div>
        
        <div id="name">
            <h1></h1>
        </div>
        
        <div id="feedback"></div>
        
        <div class="column">
            
            <div id="types">
                
                <h2>Type</h2>
                
                <div>
                    <select id="type">
                        <option value="">Select...</option>
                        <option value="Movie">Movie</option>
                        <option value="Person">Person</option>
                        <option value="Category">Category</option>
                    </select>
                </div>
            </div>
            
            <div id="pic"></div>
            
            <div id="movies" class="connection">
                
                <h2>Movies</h2>
                
                <div id="moviesHolder"></div>
            </div>
            
        </div>
        
        <div class="column">

            <div id="nodeprops">
                <div id="nodepropsholder">
                    <div class="header">
                        <div class="key" disabled="true">Key</div>
                        <div class="value" disabled="true">Value</div>
                        <div class="del" disabled="true">Del</div>
                    </div>
                </div>
                
                <div id="addnew">
                    Add [+]
                    
                    <div id="addNewTypes">
                       
                    </div>                
                </div>
                
            </div>
            
            <div id="people" class="connection">
                
                <h2>People</h2>
                
                <div id="peopleHolder"></div>
                
            </div>

        </div>
        
        <div class="column last">
            
            <div id="connections">
                
                <h2>Add a connection</h2>
                
                <div>
                    <input type="text" id="searchConnections" />
                
                    <div id="searchholder"></div>
                
                </div>
                
            </div>
            
            <div id="properties" class="connection">
                
                <h2>Properties</h2>
                
                <div id="propertiesHolder"></div>
                
            </div>
            
        </div>
        
    </div>
</body>
</html>
