{Array.prototype.index=0;Array.prototype.get=function(index,wrap){if(!wrap||!this.length)return this[index];index=index%this.length;if(index<0)index+=this.length;return this[index];};Array.prototype.current=function(){return this[this.index];};Array.prototype.next=function(wrap){this.index++;if(wrap&&this.index>=this.length)this.index=0;return this[this.index];};Array.prototype.previous=function(wrap){this.index--;if(wrap&&this.index<0)this.index=this.length-1;return this[this.index];};Array.prototype.jumpTo=function(index,wrap){this.index=index;if(!wrap||!this.length)return(index>=this.length)?this[0]:this[index];this.index=this.index%this.length;if(this.index<0)this.index+=this.length;return this[this.index];};Array.prototype.jumpBy=function(amount,wrap){return this.jumpTo(this.index+amount,wrap);};Array.prototype.copy=function(){var tempArray=[];var i=this.length;while(i--)tempArray[i]=(this[i]instanceof Array)?this[i].copy():this[i];return tempArray;};Array.prototype.swap=function(firstIndex,secondIndex){if(firstIndex<0)firstIndex=this.length+firstIndex;if(secondIndex<0)secondIndex=this.length+secondIndex;if(this[firstIndex]==this[secondIndex])return;var tempIndex=this[firstIndex];this[firstIndex]=this[secondIndex];this[secondIndex]=tempIndex;};Array.prototype.range=function(from,to,step){if(from==null&&to==null)return[];if(from!=null&&from==to)return[from];var range=[];var i=from;if(!step)step=1;if((step>0&&from>to)||(step<0&&from<to)){step*=-1;}while(true){range.push(i);if((from<to&&i>=to)||(from>to&&i<=to)){return range;}i+=step;}};Array.prototype.contains=function(value){var i=this.length;while(i--)if(this[i]===value)return true;return false;};Array.prototype.indexOf=function(value){for(var i=0;i<this.length;i++){if(this[i]===value)return i;}return false;};Array.prototype.indicesOf=function(value){var results=[];for(var i=0;i<this.length;i++){if(this[i]===value)results.push(i);}return results.length?results:false;};Array.prototype.map=function(func){for(var results=[],i=0;i<this.length;i++){results.push(func(this[i]));}return results;};}{String.prototype.pad=function(chars,char){for(var padding="",i=this.length;i<chars;i++){padding+=char;}return padding+this;};String.prototype.trim=function(){var str=this.replace(/^\s\s*/,"");var ws=/\s/;var i=str.length;while(ws.test(str.charAt(--i)));return str.slice(0,i+1);};String.prototype.strip=function(){return this.replace(/\s+/," ");};String.prototype.reverse=function(){return this.split("").reverse().join("");};String.prototype.contains=function(value){return(this.indexOf(value)>=0);};String.prototype.beginsWith=function(value){return(value==this.substring(0,value.length));};String.prototype.endsWith=function(value){return(value==this.substring(this.length-value.length));};String.prototype.stripTags=function(){return this.replace(/<\/?[^>]+>/gi,"");};String.prototype.htmlEncode=function(){var entities={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"};var t=this;for(var i in entities)t=t.replace(i,entities[i]);return t;};String.prototype.htmlDecode=function(){var entities={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"};var t=this;for(var i in entities)t=t.replace(entities[i],i);return t;};String.prototype.urlEncode=function(){return encodeURIComponent(this);};String.prototype.urlDecode=function(){return decodeURIComponent(this);};}{document.getClientWidth=function(){var doc=document.documentElement;return(doc&&doc.clientWidth)?doc.clientWidth:document.body.clientWidth;};document.getClientHeight=function(){var doc=document.documentElement;return(doc&&doc.clientHeight)?doc.clientHeight:document.body.clientHeight;};}{window.isArray=function(value){return isObject(value)&&value.constructor==Array;};window.isBoolean=function(value){return typeof value=="boolean";};window.isFunction=function(value){return typeof value=="function";};window.isObject=function(value){return(value&&typeof value=="object")||isFunction(value);};window.isNull=function(value){return typeof value=="object"&&!value;};window.isNumber=function(value){return typeof value=="number"&&isFinite(value);};window.isNaNNumber=function(value){return typeof value=="number"&&isNaN(value);};window.isUnNumber=function(value){return typeof value=="number"&&(isNaN(value)||!isFinite(value));};window.isString=function(value){return typeof value=="string";};window.isUndefined=function(value){return typeof value=="undefined";};window.isUnknown=function(value){return isObject(value)&&typeof value.constructor!="function";};window.isWidget=function(value,type){if(!isObject(value)||!value.hasAttribute||!value.hasAttribute("widget"))return false;if(!type)return true;var wtype=value.getAttribute("widget").split(" ");var i=wtype.length;while(i--)if(wtype[i]==type)return true;return false;};window.isComponent=function(value,type){if(!isObject(value)||!value.hasAttribute||!value.hasAttribute("component"))return false;return(type)?value.getAttribute("component")==type:value.hasAttribute("component");};}{window.getElementsById=function(){if(arguments.length==1){return(isString(arguments[0]))?document.getElementById(arguments[0]):arguments[0];}for(var elements=[],i=0;i<arguments.length;i++){var element=arguments[i];elements.push((isString(element))?document.getElementById(element):element);}return elements;};window.$=window.getElementsById;window.getElementsByClassName=function(className,tag){if(ie&&SOAPI.HTMLElement)return SOAPI.HTMLElement.getElementsByClassName(className,tag);return document.getElementsByClassName(className,tag);};window.$C=window.getElementsByClassName;window.getElementsBySelector=function(selector){var levels=selector.trim().split(/\s+/);var scope=[document];for(var i=0,level;(level=levels[i])!=null;i++){var id="";var tagName="";var className="";var classNames=[];var state=0;for(var j=0,chr;(chr=level.charAt(j))!="";j++){switch(chr){case"#":if(state==1||id)return[];state=1;break;case".":if(state==2&&!className)return[];if(state==2){classNames.push(className);className="";}state=2;break;default:switch(state){case 0:tagName+=chr;break;case 1:id+=chr;break;case 2:className+=chr;break;}break;}}if(state==1&&!id)return[];if(state==2&&!className)return[];if(state==2)classNames.push(className);var element=(id)?$(id):null;if(id){if(!element)return[];if(tagName&&element.nodeName.toLowerCase()!=tagName)return[];for(var j=0;j<classNames.length;j++){if(!element.className||!element.className.match(new RegExp("(\\s|^)"+classNames[j]+"(\\s|$)"))){return[];}}scope=[element];continue;}var found=[];for(var j=0;j<scope.length;j++){var elements=scope[j].getElementsByTagName(tagName||"*");for(var k=0;k<elements.length;k++){found.push(elements[k]);}}scope=[];for(var j=0,item;(item=found[j])!=null;j++){if(!classNames.length){scope.push(item);continue;}if(!item.className)continue;for(var matched=true,k=0;k<classNames.length;k++){if(!item.className.match(new RegExp("(\\s|^)"+classNames[k]+"(\\s|$)"))){matched=false;break;}}if(matched)scope.push(item);}}return scope;};window.$S=window.getElementsBySelector;}