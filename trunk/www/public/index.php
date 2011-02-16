<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
    "http://www.w3.org/TR/html4/strict.dtd"
    >
<html lang="en">
<head>
    <title>Movie Pilot demo interface</title>
    
    <link rel="stylesheet" href="/static/css/global.css" type="text/css" media="screen" />
    
    <script type="text/javascript" src="/soapi/js.php?soapi_widgets=panel" charset="utf-8"></script>
    <script type="text/javascript" src="/static/app.php" charset="utf-8"></script>
    <script type="text/javascript" src="/static/common.js" charset="utf-8"></script>
    
</head>
<body>
    <div id="wrapper">
        
        <div id="title">
            <h1>Fear and loathing in Las Vegas</h1>
        </div>
        
        <div id="feedback"></div>
        
        <div class="column">
            
            <div id="cat">
                
                <h2>Category</h2>
                
                <select id="category">
                    <option value="0">Movie</option>
                    <option value="1">Person</option>
                    <option value="2">Category</option>
                </select>
            </div>
            
            <div id="pic"></div>
            
            <div id="movies">
                
                <h2>Movies</h2>
                
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
                    
                    <div class="row" rowid="123">
                        <div class="key" disabled="true">_id</div>
                        <div class="value" disabled="true">12354984</div>
                    </div>
                    
                    <div class="row" rowid="784">
                        <div class="key">moviemaster_id</div>
                        <div class="value">547</div>
                        <div class="del">[x]</div>
                    </div>
                    
                    <div class="row" rowid="389">
                        <div class="key">facebook_id</div>
                        <div class="value">1279879379</div>
                        <div class="del">[x]</div>
                    </div>
                </div>
                
                <div id="addnew">Add [+]</div>
                
            </div>
            
            <div id="people">
                
                <h2>People</h2>
                
            </div>

        </div>
        
        <div class="column last">
            
            <div id="connections">
                
                <h2>Add a connection</h2>
                
                <p><input type="text" id="searchConnections" value="search..." /></p>
                
            </div>
            
            <div id="properties">
                
                <h2>Properties</h2>
                
            </div>
            
        </div>
        
    </div>
</body>
</html>
