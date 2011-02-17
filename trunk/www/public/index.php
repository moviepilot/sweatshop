<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
    "http://www.w3.org/TR/html4/strict.dtd"
    >
<html lang="en">
<head>
    <title>Movie Pilot demo interface</title>
    
    <link rel="stylesheet" href="/static/css/global.css" type="text/css" media="screen" />
    
    <script type="text/javascript" src="/soapi/js.php?soapi_widgets=slider" charset="utf-8"></script>
    <script type="text/javascript" src="/static/app.php" charset="utf-8"></script>
    <script type="text/javascript" src="/static/common.js" charset="utf-8"></script>
    
    <script>
        
        window.node_id                   =  <?=$_GET['_id'] ? $_GET['_id'] : 12233; ?>;
    
    </script>
    
</head>
<body>
    <div id="wrapper">
        
        <div id="name">
            <h1></h1>
        </div>
        
        <div id="feedback"></div>
        
        <div class="column">
            
            <div id="types">
                
                <h2>Type</h2>
                
                <div>
                    <select id="type">
                        <option value="Movie">Movie</option>
                        <option value="Person">Person</option>
                        <option value="Category">Category</option>
                    </select>
                </div>
            </div>
            
            <div id="pic"></div>
            
            <div id="movies" class="connection">
                
                <h2>Movies</h2>
                
                <div></div>
            </div>
            
        </div>
        
        <div class="column">

            <div id="nodeprops">
                <div>
                    <div class="header">
                        <div class="key" disabled="true">Key</div>
                        <div class="value" disabled="true">Value</div>
                        <div class="del" disabled="true">Del</div>
                    </div>                    
                </div>
                
                <div id="addnew">Add [+]</div>
                
            </div>
            
            <div id="people" class="connection">
                
                <h2>People</h2>
                
                <div></div>
                
            </div>

        </div>
        
        <div class="column last">
            
            <div id="connections">
                
                <h2>Add a connection</h2>
                
                <div>
                    <input type="text" id="searchConnections" value="search..." />
                
                    <div id="holder"></div>
                
                </div>
                
            </div>
            
            <div id="properties" class="connection">
                
                <h2>Properties</h2>
                
                <div></div>
                
            </div>
            
        </div>
        
    </div>
</body>
</html>
