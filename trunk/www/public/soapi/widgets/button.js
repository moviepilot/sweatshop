SOAPI.Events.action=["onAction"];SOAPI.Events.onAction=function(event){return true};SOAPI.widgets.button=function(p){new SOAPI.Button(p);};SOAPI.Button=SOAPI.Panel.extension();SOAPI.Button.extend({wtype:"button",parameters:SOAPI.merge(SOAPI.Panel.prototype.parameters,{tabindex:0,action:""}),setup:function(parameters){var result=this.callParent(arguments.callee,"setup",arguments);var p=result.p;var w=result.w;var c=w.components;var handlers=SOAPI.Button_Handlers;w.setAttribute("tabindex",p.tabindex);w.setAttribute("state","default");SOAPI.Event.addEventHandler(w,"mousedown",handlers.onMouseDown,"Button");SOAPI.Event.addEventHandler(w,"mouseup",handlers.onMouseUp,"Button");SOAPI.Event.addEventHandler(w,"mouseup",handlers.onMouseUpAction,"Action");SOAPI.Event.addEventHandler(w,"mouseover",handlers.onMouseOver,"Button");SOAPI.Event.addEventHandler(w,"mouseout",handlers.onMouseOut,"Button");SOAPI.Event.addEventHandler(w,"action");SOAPI.Event.addEventHandler(w,"focus",w.onFocus,"Widget");SOAPI.Event.addEventHandler(w,"blur",w.onBlur,"Widget");if(w.hasAttribute("onaction")){eval("var func = function(event) {"+w.getAttribute("onaction")+"}");SOAPI.Event.addEventHandler(w,"action",func,"Attribute");w.removeAttribute("onaction");}if(p.pieces&4096){var icon=c.icon=this.createComponent({element:p.element,parent:w,cType:"icon"});}return result;}});SOAPI.Button_Handlers={onMouseOver:function(event){this.setAttribute("state","over");event.stopPropagation();return true;},onMouseOut:function(event){this.setAttribute("state","default");event.stopPropagation();return true;},onMouseDown:function(event){this.setAttribute("state","down");event.stopPropagation();return true;},onMouseUp:function(event){this.setAttribute("state","over");event.stopPropagation();return true;},onMouseUpAction:function(event){SOAPI.Event.triggerEvent("action",this);return true;}};