window.SOAPI=window.SOAPI||{};var SOAPI=window.SOAPI;SOAPI.Core_Gecko_HTMLElement=function(){{HTMLElement.prototype.getElementsByClassName=function(className,tag){var elements=[];var tagElements=this.getElementsByTagName(tag||"*");var pattern=new RegExp("(^|\\s)"+className+"(\\s|$)");for(var i=0;i<tagElements.length;i++){if(pattern.test(tagElements[i].className)){elements.push(tagElements[i]);}}return elements;};HTMLElement.prototype.$C=HTMLElement.prototype.getElementsByClassName;HTMLElement.prototype.replaceHTML=function(html){var parent=this.parentNode;var newElement=this.cloneNode(false);newElement.innerHTML=html;parent.replaceChild(newElement,this);SOAPI.Event.copyEventHandlers(this,newElement,false);};HTMLElement.prototype.insertAdjacentHTML=function(location,html){var range=this.ownerDocument.createRange();switch(String(location).toLowerCase()){case"beforebegin":range.setStartBefore(this);this.parentNode.insertBefore(range.createContextualFragment(html),this);break;case"afterbegin":range.selectNodeContents(this);range.collapse(true);this.insertBefore(range.createContextualFragment(html),this.firstChild);break;case"beforeend":range.selectNodeContents(this);range.collapse(false);this.appendChild(range.createContextualFragment(html));break;case"afterend":range.setStartAfter(this);this.parentNode.insertBefore(range.createContextualFragment(html),this.nextSibling);break;}};HTMLElement.prototype.__defineGetter__("outerHTML",function(){var html="<"+this.tagName;var emptyTags={BR:true,HR:true,IMG:true,INPUT:true,LINK:true,META:true,PARAM:true};for(var i=0,attribute;attribute=this.attributes[i];i++){html+=" "+attribute.name+"=\""+attribute.value+"\"";}return html+((emptyTags[this.tagName])?" />":">"+this.innerHTML+"</"+this.tagName+">");});HTMLElement.prototype.__defineSetter__("outerHTML",function(html){var range=this.ownerDocument.createRange();range.setStartBefore(this);this.parentNode.replaceChild(range.createContextualFragment(html),this);});HTMLElement.prototype.insertAfter=function(node,referenceNode){this.insertBefore(node,referenceNode.nextSibling);};HTMLElement.prototype.prependChild=function(node){this.insertBefore(node,this.firstChild);};HTMLElement.prototype.__defineGetter__("isDisabled",function(){return this.hasAttribute("disabled");});HTMLElement.prototype.contains=function(node){while(node&&(this!=node))node=node.parentNode;return this==node;};HTMLElement.prototype.getAppliedStyle=function(name){return document.defaultView.getComputedStyle(this,null).getPropertyValue(name);};HTMLElement.prototype.refresh=function(){};}};SOAPI.Core_Gecko_CreateElement=function(){document._createElement=document.createElement;document.createElement=function(type){var element=document._createElement(type);if(type.toLowerCase()=="input"||type.toLowerCase()=="textarea"){SOAPI.Event.addEventHandler(element,"focus");SOAPI.Event.addEventHandler(element,"blur");}return element;};};