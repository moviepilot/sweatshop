SOAPI.Events.response=["onResponse"];SOAPI.Events.onResponse=function(event){return true};SOAPI.widgets.form=function(p){new SOAPI.Form(p);};SOAPI.Form=SOAPI.Widget.extension();SOAPI.Form.extend({wtype:"form",mimetype:"text/html",elementType:"form",parameters:SOAPI.merge(SOAPI.Widget.prototype.parameters,{url:"",method:"",action:""}),setup:function(parameters){var result=this.callParent(arguments.callee,"setup",arguments);var p=result.p;var w=result.w;SOAPI.Event.addEventHandler(w,"response");if(w.hasAttribute("onresponse")){eval("var func = function(event) {"+w.getAttribute("onresponse")+"}");SOAPI.Event.addEventHandler(w,"response",func,"Attribute");w.removeAttribute("onresponse");}return result;},submit:function(object){this.request(this.gather(),object);},gather:function(){var data=[];var elements=[];var inputs=this.getElementsByTagName("input");var textareas=this.getElementsByTagName("textarea");for(var i=0,e;(e=inputs[i])!=null;i++)elements.push(e);for(var i=0,e;(e=textareas[i])!=null;i++)elements.push(e);for(var i=0,e;(e=elements[i])!=null;i++){if(isComponent(e)&&!SOAPI.findParentWidget(e).built)continue;if(e.name==""||(e.name.indexOf("[")!==false&&e.value==""))continue;data.push(e.name+"="+encodeURIComponent(e.value));}var textareas=SOAPI.findAllChildWidgets(this,"textarea","div",true);for(var i=0,e;(e=textareas[i])!=null;i++){if(!e.built||!e.hasAttribute("name"))continue;data.push(e.getAttribute("name")+"="+encodeURIComponent(e.getValue()));}return data.join("&");},request:function(data,object){function xhrProcessor(form,xhr,object){return function(){if(xhr.readyState!=4)return;if(xhr.status!=200)return alert("There was a problem with the request.");SOAPI.Event.triggerEvent("response",form,{data:xhr.responseText,object:object});};}var xhr=new XMLHttpRequest();if(xhr.overrideMimeType)xhr.overrideMimeType(this.mimetype);xhr.onreadystatechange=xhrProcessor(this,xhr,object||this);xhr.open(this.getAttribute("method"),this.getAttribute("url"),true);xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded; charset=UTF-8");xhr.setRequestHeader("Content-length",data.length);xhr.setRequestHeader("Connection","close");xhr.send(data);}});