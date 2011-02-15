window.SOAPI=window.SOAPI||{};var SOAPI=window.SOAPI;{SOAPI.version="4.8";SOAPI.progress=false;SOAPI.built=false;SOAPI.action=null;SOAPI.widgets=SOAPI.widgets||{};SOAPI.setupActions=[];SOAPI.speedtest=0;SOAPI.setup=function(progress,action,build){while(SOAPI.setupActions.length){var setupAction=SOAPI.setupActions.shift();setupAction();}if(progress)SOAPI.progress=true;if(action)SOAPI.action=action;if(SOAPI.built){if(SOAPI.action&&isFunction(SOAPI.action))SOAPI.action();if(SOAPI.action&&!isFunction(SOAPI.action))eval(SOAPI.action);SOAPI.action=null;return;}var theHTMLElement=(ie&&SOAPI.HTMLElement)?SOAPI.HTMLElement:window.HTMLElement.prototype;for(var member in SOAPI.Sprite.prototype){if(["parentClass","construct","isSprite","dragger","animators","timer","callParent"].contains(member))continue;theHTMLElement[member]=SOAPI.Sprite.prototype[member];}if(ie&&SOAPI.HTMLElement)SOAPI.extendHTML(document);if(!(SOAPI.speedtest=SOAPI.Cookie.get('speedtest'))){function fibTest(n){var s=0;if(n==0)return s;if(n==1){s+=1;return s;}else {return fibTest(n-1)+fibTest(n-2);}};var timeOne=new Date();var testArray=new Array();for(i=0;i<27;i++)testArray.push(fibTest(i));var timeTwo=new Date();var diff=timeTwo.getTime()-timeOne.getTime();if(diff<650)SOAPI.speedtest='good';else SOAPI.speedtest='poor';SOAPI.Cookie.set('speedtest',SOAPI.speedtest,3600);}SOAPI.Event.setupEventHandlers();if(build)return SOAPI.buildWidgets();if(SOAPI.action&&isFunction(SOAPI.action))SOAPI.action();if(SOAPI.action&&!isFunction(SOAPI.action))eval(SOAPI.action);};SOAPI.createElement=function(parameters){var p={type:"div",element:null,parent:document.body,attributes:null,styles:null,content:null,insert:true};for(var pName in parameters){if(parameters[pName]!=null)p[pName]=parameters[pName];}var px={left:true,top:true,width:true,height:true};if(isString(p.parent))p.parent=document.getElementById(p.parent);if(isString(p.element))p.element=document.getElementById(p.element);var e=(p.element)?p.element:document.createElement(p.type);for(pName in p.attributes){if(p.attributes[pName]!=null)e.setAttribute(pName,p.attributes[pName]);}for(pName in p.styles){if(p.styles[pName]!=null){e.style[pName]=(px[pName]==null)?p.styles[pName]:parseFloat(p.styles[pName])+"px";}}if(p.content!=null)e.innerHTML=p.content;if(!p.element&&p.insert)p.parent.appendChild(e);return e;};SOAPI.destroyElement=function(element){if(isString(element))element=document.getElementById(element);element.innerHTML="";element.outerHTML="";};SOAPI.findAllChildElements=function(parent,type,attributes,recurse,limit,forwards){type=(type)?type.toLowerCase():"*";var a=(attributes)?attributes:{};var children=[];var childNodes=(recurse)?parent.getElementsByTagName(type):parent.childNodes;var i=childNodes.length;while(i--){var child=childNodes[(forwards)?childNodes.length-i-1:i];if(child.nodeType!=1||(type!="*"&&child.tagName.toLowerCase()!=type)){continue;}var found=true;for(var aName in a){var found=false;if(!child.hasAttribute(aName))break;var attribute=child.getAttribute(aName);if(isArray(a[aName])){var aSub=a[aName];var j=aSub.length;while(j--){var aSubName=aSub[j];switch(aName){case"widget":found=isWidget(child,aSubName);break;case"class":found=attribute.split(" ").contains(aSubName);break;default:found=attribute==aSubName;break;}if(found)break;}}else {switch(aName){case"widget":found=isWidget(child,a[aName]);break;case"class":found=attribute.split(" ").contains(a[aName]);break;default:found=attribute==a[aName];break;}}if(!found)break;}if(found)children.push(child);if(children.length>=limit)break;}return children;};SOAPI.findFirstChildElement=function(parent,type,attributes,recurse){return this.findAllChildElements(parent,type,attributes,recurse,1,true)[0];};SOAPI.findLastChildElement=function(parent,type,attributes,recurse){return this.findAllChildElements(parent,type,attributes,recurse,1)[0];};SOAPI.findAllChildComponents=function(parent,cType,eType,recurse){return this.findAllChildElements(parent,eType,{component:cType},recurse);};SOAPI.findFirstChildComponent=function(parent,cType,eType,recurse){return this.findFirstChildElement(parent,eType,{component:cType},recurse);};SOAPI.findLastChildComponent=function(parent,cType,eType,recurse){return this.findLastChildElement(parent,eType,{component:cType},recurse);};SOAPI.findAllChildWidgets=function(parent,wType,eType,recurse){return this.findAllChildElements(parent,eType,{widget:wType},recurse);};SOAPI.findFirstChildWidget=function(parent,wType,eType,recurse){return this.findFirstChildElement(parent,eType,{widget:wType},recurse);};SOAPI.findLastChildWidget=function(parent,wType,eType,recurse){return this.findLastChildElement(parent,eType,{widget:wType},recurse);};SOAPI.getMatchingAttributes=function(element,attributes){for(var i in attributes){if(element.hasAttribute(i))attributes[i]=element.getAttribute(i);}return attributes;};SOAPI.buildWidgets=function(element){element=element||document.body;var elements=[];var allelements=element.getElementsByTagName("*");var stack=[element];var buildsubs=0;for(var i=0,e;(e=allelements[i])!=null;i++){if(((isWidget(e)&&this.widgets[e.getAttribute("widget")])||isComponent(e))&&!e.built){var hasBuild=e.hasAttribute("build");var hasBuildsubs=e.hasAttribute("buildsubs");var j=stack.length-1;while(j>=0){if(stack[j]===document.body||stack[j].contains(e)){stack.push(e);if(buildsubs==j&&((hasBuildsubs&&e.getAttribute("buildsubs")!="false")||(!hasBuildsubs))){buildsubs=j+1;}j++;break;}stack.pop();j--;if(buildsubs>j)buildsubs=j;}if(isWidget(e)&&buildsubs>=j-1&&(j==1||((hasBuild&&e.getAttribute("build")!="false")||(!hasBuild)))){elements.push(e);}}}if(isWidget(element))element.builtsubs=true;var progress=this.progress;if(!this.ProgressBar)progress=false;if(progress){progress=this.progress={};progress.time=0;progress.elements=elements;progress.element=0;progress.bar=new this.ProgressBar({element:document.getElementById("SOAPI_LoadBar")});return this.buildNextWidget();}for(var i=0,e;(e=elements[i])!=null;i++)this.widgets[e.getAttribute("widget")]({element:e});this.built=true;SOAPI.setup();};SOAPI.buildNextWidget=function(){var progress=SOAPI.progress;var e=progress.elements[progress.element];SOAPI.widgets[e.getAttribute("widget")]({element:e});progress.element++;if(progress.element<progress.elements.length){var now=new Date();var time=now.getTime();if(time-progress.time>1000){progress.bar.updatePosition(progress.element/progress.elements.length*100);progress.time=time;return setTimeout(SOAPI.buildNextWidget,0);}else {return SOAPI.buildNextWidget();}}progress.bar.parentNode.removeChild(progress.bar);SOAPI.progress=true;SOAPI.built=true;SOAPI.setup();};SOAPI.findParentWidget=function(element,type){while((element=element.parentNode)!==document){if(isWidget(element,type))return element;}return false;};SOAPI.findParentComponent=function(element,type){while((element=element.parentNode)!==document){if(isComponent(element,type))return element;}return false;};SOAPI.configureWidgetPieces=function(config){for(var i in config){var pieces=config[i];var widget=SOAPI[i].prototype;if(!isObject(pieces)){widget.parameters=SOAPI.merge(widget.parameters);widget.parameters.pieces=pieces;continue;}for(var j in pieces){if(j=="self"){widget.parameters.pieces=pieces[j];continue;}widget.ctypes[j]=widget.ctypes[j].duplicate();var proto=widget.ctypes[j].prototype;proto.parameters=SOAPI.merge(proto.parameters);proto.parameters.pieces=pieces[j];}}};SOAPI.merge=function(){if(isArray(arguments[0]))return[].concat(arguments);var result={};for(var i=0;i<arguments.length;i++){var object=arguments[i];for(var j in object)result[j]=object[j];}return result;};SOAPI.applyBackgroundCSS=function(element){if(isString(element))element=document.getElementById(element);if(element.tagName.toLowerCase()!="img")return;var bg=element.getAppliedStyle("background-image");if(bg.length>5)element.src=bg.match(/http.+[^")]/g)[0];else  if(element.src=="")element.style.display="none";element.style.backgroundImage="none";};SOAPI.extendHTML=function(baseElement){var element=!isString(baseElement)?baseElement:$(baseElement);var elements=element.getElementsByTagName("*");var HTMLElement=SOAPI.HTMLElement;for(var i=elements.length-1;i>=0;i--){var el=elements[i];if(typeof el.getAppliedStyle=="undefined"){if(el.tagName=="OBJECT"){for(var pName in HTMLElement){if(!el[pName])el[pName]=HTMLElement[pName];}continue;}for(var p in HTMLElement)el[p]=HTMLElement[p];}}};}