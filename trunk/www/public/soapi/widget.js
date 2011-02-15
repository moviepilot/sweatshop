SOAPI.Widget=SOAPI.Class.extension();SOAPI.Widget.extend({wtype:"",ctypes:{},built:true,builtsubs:false,handlers:null,components:null,elementType:"div",parameters:{element:null,parent:document.body,id:null,"class":null,style:null,pieces:0,disabled:"false"},construct:function(parameters){this.components={};var result=this.setup(parameters);var p=result.p;var w=result.w;if(p.element==null)p.parent.appendChild(w);this.configure.apply(w);return w;},setup:function(parameters){var p=this.setupParameters(parameters);var w=this.createWidget(p,null,this.elementType);var c=w.components;var pieces={16:"top",32:"bottom",64:"left",128:"right",256:"topleft",512:"topright",1024:"bottomleft",2048:"bottomright"};for(var i in pieces){if(p.pieces&i){c[pieces[i]]=this.createComponent({element:p.element,parent:w,cType:pieces[i]});}}if(p.pieces&8){c.filler=this.createComponent({element:p.element,parent:w,cType:"filler",eType:"img"});}if(p.pieces&2){c.inner=this.createComponent({element:p.element,parent:w,cType:"inner"});if(p.pieces&4){var inner=w.components.inner;inner.components=c={};c.filler=this.createComponent({element:inner,parent:inner,widget:w,cType:"filler",eType:"img"});}}return{p:p,w:w};},configure:function(){},setupParameters:function(parameters){var p=SOAPI.merge(this.parameters,parameters);if(p.element!=null){for(var pName in p){if(pName!="element"&&pName!="parent"&&p.element.hasAttribute(pName)){p[pName]=p.element.getAttribute(pName);}}}p.disabled=(p.disabled!="false"&&p.disabled!=null)?true:null;p.usable=!p.disabled;return p;},createWidget:function(parameters,extras,type){var a={widget:this.wtype};for(var pName in extras)a[pName]=extras[pName];for(var pName in parameters){if(pName!="element"&&pName!="parent"){a[pName]=parameters[pName];}}var w=new SOAPI.Sprite(SOAPI.createElement({type:type,element:parameters.element,attributes:a,insert:false}),this.draggable);for(var member in this)w[member]=this[member];return w;},createComponent:function(parameters,makeSprite,draggable){var p={element:null,parent:null,widget:null,cType:null,eType:"div",extras:null,criteria:null,parameters:null,recurse:false};for(var pName in parameters){if(parameters[pName]!=null)p[pName]=parameters[pName];}p.eType=p.eType.toLowerCase();p.widget=p.widget||p.parent;var a={};var c={component:p.cType};for(var pName in p.extras)a[pName]=p.extras[pName];for(var pName in p.criteria)c[pName]=p.criteria[pName];var child=null;if(p.element!=null)child=SOAPI.findLastChildElement(p.element,"*",c,p.recurse);if(child!=null)a=SOAPI.getMatchingAttributes(child,a);a.component=p.cType;var component=SOAPI.createElement({type:p.eType,element:child,parent:p.parent,attributes:a});var parameters=p.parameters||{};parameters.element=component;parameters.parent=p.parent;if(this.ctypes[p.cType]!=null)component=new this.ctypes[p.cType](parameters);component.parentWidget=p.widget;if(makeSprite)component=new SOAPI.Sprite(component,draggable);SOAPI.applyBackgroundCSS(component);return component;},createComponents:function(parameters,makeSprite,draggable){var p={element:null,parent:null,widget:null,cType:null,eType:"div",extras:null,criteria:null,parameters:null,recurse:false};for(var pName in parameters){if(parameters[pName]!=null)p[pName]=parameters[pName];}p.eType=p.eType.toLowerCase();p.widget=p.widget||p.parent;var ctypes=this.ctypes;var children=null;var c={component:p.cType};for(var pName in p.criteria)c[pName]=p.criteria[pName];if(p.element!=null)children=SOAPI.findAllChildElements(p.element,"*",c,p.recurse);if(!children)return[];var items=[];var i=children.length;var j=0;while(i--){var a={id:null,"class":null,style:null};for(var pName in p.extras)a[pName]=p.extras[pName];var child=children[i];a=SOAPI.getMatchingAttributes(child,a);items[j]=SOAPI.createElement({type:p.eType,element:child,parent:p.parent,attributes:a});var cType=items[j].getAttribute("component");var parameters=p.parameters||{};parameters.element=items[j];if(ctypes[cType]!=null)items[j]=new ctypes[cType](parameters);items[j].parentWidget=p.widget;if(makeSprite)items[j]=new SOAPI.Sprite(items[j],draggable);SOAPI.applyBackgroundCSS(items[j++]);}return items;},allow:function(noBubble){if(!this.isDisabled)this.setAttribute("usable",true);if(!noBubble)this.allowChildren();},deny:function(noBubble){this.setAttribute("usable",false);if(!noBubble)this.denyChildren();},allowChildren:function(){var elements=this.getElementsByTagName("*");for(var i=0,e;(e=elements[i])!=null;i++){if(isWidget(e)&&e.allow)e.allow(true);}},denyChildren:function(){var elements=this.getElementsByTagName("*");for(var i=0,e;(e=elements[i])!=null;i++){if(isWidget(e)&&e.deny)e.deny(true);}},isUsable:function(){return this.getAttribute("usable")!="false";},enable:function(){this.removeAttribute("disabled");this.allow();},disable:function(){this.setAttribute("disabled",true);this.deny();},onFocus:function(event){this.setAttribute("focused",true);return true;},onBlur:function(event){this.setAttribute("focused",false);return true;}});