SOAPI.Events={mousedown:["onMouseDown","mousedown"],mousemove:["onMouseMove","mousemove"],mouseup:["onMouseUp","mouseup"],mousewheel:["onMouseWheel",(!ie)?"DOMMouseScroll":"mousewheel"],mouseover:["onMouseOver","mouseover"],mouseout:["onMouseOut","mouseout"],focus:["onFocus",(!ie)?"focus":"activate"],blur:["onBlur",(!ie)?"blur":"deactivate"],keypress:["onKeyPress","keypress"],keydown:["onKeyDown","keydown"],keyup:["onKeyUp","keyup"],change:["onChange","change"],nodeinserted:["onNodeInserted","DOMNodeInserted"],noderemoved:["onNodeRemoved","DOMNodeRemoved"],nodeinsertedintodocument:["onNodeInsertedIntoDocument","DOMNodeInsertedIntoDocument"],noderemovedfromdocument:["onNodeRemovedFromDocument","DOMNodeRemovedFromDocument"],drag:["onDrag"],dragstart:["onDragStart"],dragend:["onDragEnd"],dragover:["onDragOver"],dragout:["onDragOut"],drop:["onDrop"],sizechange:["onSizeChange"],contentchange:["onContentChange"],action:["onAction"],onmousedown:function(event){return SOAPI.Event.processEvent("mousedown",event,this);},onmousemove:function(event){return SOAPI.Event.processEvent("mousemove",event,this);},onmouseup:function(event){return SOAPI.Event.processEvent("mouseup",event,this);},onmousewheel:function(event){return SOAPI.Event.processEvent("mousewheel",event,this);},onmouseover:function(event){return SOAPI.Event.processEvent("mouseover",event,this);},onmouseout:function(event){return SOAPI.Event.processEvent("mouseout",event,this);},onfocus:function(event){return SOAPI.Event.processEvent("focus",event,this);},onblur:function(event){return SOAPI.Event.processEvent("blur",event,this);},onkeypress:function(event){return SOAPI.Event.processEvent("keypress",event,this);},onkeydown:function(event){return SOAPI.Event.processEvent("keydown",event,this);},onkeyup:function(event){return SOAPI.Event.processEvent("keyup",event,this);},onchange:function(event){return SOAPI.Event.processEvent("change",event,this);},onnodeinserted:function(event){return SOAPI.Event.processEvent("nodeinserted",event,this);},onnoderemoved:function(event){return SOAPI.Event.processEvent("noderemoved",event,this);},onnodeinsertedintodocument:function(event){return SOAPI.Event.processEvent("nodeinsertedintodocument",event,this);},onnoderemovedfromdocument:function(event){return SOAPI.Event.processEvent("noderemovedfromdocument",event,this);},onMouseDown:function(event){var E=SOAPI.Event;var e=event.event;var element=event.element;E.button=event.getMouseButton();E.x=e.clientX+document.body.scrollLeft;E.y=e.clientY+document.body.scrollTop;E.currentLeft=(element.isSprite)?element.get("left"):element.offsetLeft;E.currentTop=(element.isSprite)?element.get("top"):element.offsetTop;E.offsetX=E.x-E.currentLeft;E.offsetY=E.y-E.currentTop;if(!element.isSprite)return true;if(element.isUsable&&!element.isUsable()){if(element.parentNode)E.triggerEvent("focus",element.parentNode,null,true);return false;}if(E.button==E.LEFT&&element.dragger&&element.dragger.enabled){E.triggerEvent("focus",element,null,true);E.dragImminent=element;event.stopPropagation();}return true;},onMouseMove:function(event){var E=SOAPI.Event;var e=event.event;E.x=e.clientX+document.body.scrollLeft;E.y=e.clientY+document.body.scrollTop;E.distanceX=E.x-E.offsetX-E.currentLeft;E.distanceY=E.y-E.offsetY-E.currentTop;E.currentLeft+=E.distanceX;E.currentTop+=E.distanceY;if(!E.dragActive){if(!E.dragImminent){if(event.element.isUsable&&!event.element.isUsable())event.stopProcessing();return true;}event.element=E.dragImminent;E.triggerEvent("dragstart",event.element);E.dragImminent=false;}event.element=E.dragActive;if(!event.element.isSprite)return false;if(event.getMouseButton()){E.triggerEvent("drag",event.element);}else {E.triggerEvent("dragend",event.element);}event.stopPropagation();return false;},onMouseUp:function(event){var E=SOAPI.Event;var e=event.event;E.x=e.clientX+document.body.scrollLeft;E.y=e.clientY+document.body.scrollTop;E.dragImminent=false;if(!E.dragActive){if(event.element.isUsable&&!event.element.isUsable())event.stopProcessing();return true;}E.triggerEvent("dragend",E.dragActive);event.stopPropagation();return true;},onMouseWheel:function(event){var E=SOAPI.Event;var e=event.event;if(e.wheelDelta)E.wheelDelta=e.wheelDelta/120*((opera)?1:-1);if(e.detail)E.wheelDelta=e.detail;if(E.dragActive)return false;if(event.element.isUsable&&!event.element.isUsable())event.stopProcessing();return true;},onMouseOver:function(event){if(SOAPI.Event.dragActive&&event.element!=SOAPI.Event.dragActive)event.stopProcessing();if(event.element.isUsable&&!event.element.isUsable())event.stopProcessing();return true;},onMouseOut:function(event){if(SOAPI.Event.dragActive&&event.element!=SOAPI.Event.dragActive)event.stopProcessing();if(event.element.isUsable&&!event.element.isUsable())event.stopProcessing();return true;},onDragStart:function(event){SOAPI.Event.dragActive=event.element;var elements=event.element.getElementsByTagName("*");var i=elements.length;while(i--){if(elements[i].eventHandlers&&elements[i].eventHandlers["sizechange"]){SOAPI.Event.changeOnDrag.push(elements[i]);}}return true;},onDrag:function(event){var E=SOAPI.Event;var element=E.dragActive;if(E.distanceX||E.distanceY)SOAPI.Events.doDrag(E,element.dragger.partners,false);if(E.distanceX||E.distanceY)SOAPI.Events.doDrag(E,element.dragger.partners,true);var targets=element.dragger.targets;var topTarget=null;var topZIndex=null;var i=targets.length;while(i--){var target=targets[i];var sprite=target.sprite;var zIndex=parseInt(sprite.style.zIndex);if(E.x>sprite.get("ActualLeft")&&E.x<sprite.get("ActualLRight")&&E.y>sprite.get("ActualTop")&&E.y<sprite.get("ActualTBottom")&&(zIndex>topZIndex||(isNaN(zIndex)&&topZIndex==null))&&sprite.isVisible()){topTarget=target;if(!isNaN(zIndex))topZIndex=zIndex;}}if(topTarget&&!topTarget.over){E.triggerEvent("dragover",topTarget.sprite);topTarget.over=true;}var i=targets.length;while(i--){var target=targets[i];if(target!==topTarget&&target.over){E.triggerEvent("dragout",target.sprite);target.over=false;}}var i=E.changeOnDrag.length;while(i--)E.triggerEvent("sizechange",E.changeOnDrag[i]);return true;},onDragEnd:function(event){var partners=SOAPI.Event.dragActive.dragger.partners;var i=partners.length;while(i--){var r=partners[i].sprite.dragger.restrictions;for(style in r)r[style].delta=0;}var targets=SOAPI.Event.dragActive.dragger.targets;var i=targets.length;while(i--){if(targets[i].over){SOAPI.Event.triggerEvent("drop",targets[i].sprite);break;}}SOAPI.Event.dragActive=false;SOAPI.Event.changeOnDrag=[];return true;},doDrag:function(object,partners,apply){var i=partners.length;while(i--){var partner=partners[i];var sprite=partner.sprite;for(var axis in{X:null,Y:null}){var multiply=partner["multiply"+axis];for(var style in multiply){if(multiply[style]==null)continue;var d=object["distance"+axis]*multiply[style];if(apply){sprite.styleBy(style,d);continue;}var styles=[[style,1]];switch(style){case"width":{var sl=sprite.style.left;var sr=sprite.style.right;if(sl!=""||sr==""){styles.push(["right",-1],["lright",1]);}else {styles.push(["left",-1],["rleft",1]);}}break;case"left":{var sw=sprite.style.width;var sl=sprite.style.left;if((sw=="auto"||sw=="")&&sl!=""){styles.push(["width",-1]);}else {styles.push(["right",-1],["lright",1]);}styles.push(["rleft",-1]);}break;case"right":{var sw=sprite.style.width;var sr=sprite.style.right;if((sw=="auto"||sw=="")&&sr!=""){styles.push(["width",-1]);}else {styles.push(["left",-1],["rleft",1]);}styles.push(["lright",-1]);}break;case"height":{var st=sprite.style.top;var sb=sprite.style.bottom;if(st!=""||sb==""){styles.push(["bottom",-1],["tbottom",1]);}else {styles.push(["top",-1],["btop",1]);}}break;case"top":{var sh=sprite.style.height;var st=sprite.style.top;if((sh=="auto"||sh=="")&&st!=""){styles.push(["height",-1]);}else {styles.push(["bottom",-1],["tbottom",1]);}styles.push(["btop",-1]);}break;case"bottom":{var sh=sprite.style.height;var sb=sprite.style.bottom;if((sh=="auto"||sh=="")&&sb!=""){styles.push(["height",-1]);}else {styles.push(["top",-1],["btop",1]);}styles.push(["tbottom",-1]);}break;}if(!sprite.dragger.restrict)continue;var j=styles.length;while(j--){var r=sprite.dragger.restrictions[styles[j][0]];if(!r)continue;var value=parseFloat(sprite.get(styles[j][0]));d*=styles[j][1];r.delta+=d;if(d<0&&r.min!=null&&value+d<=r.min){d=r.min-value;}else  if(d>0&&r.max!=null&&value+d>=r.max){d=r.max-value;}else  if(SOAPI.Event.dragActive&&((d<0&&r.delta>0&&r.delta+d>0)||(d>0&&r.delta<0&&r.delta+d<0))){d=0;}r.delta-=d;d*=styles[j][1];if(!d||r.step==null)continue;d*=styles[j][1];r.delta+=d;var steps=Math.floor(Math.abs(r.delta)/r.step);var part=r.delta%r.step;if(Math.abs(part)>r.step/2){steps++;d=steps*r.step*((r.delta>0)?1:-1);r.delta-=d;d*=styles[j][1];}else {d=0;}}if(partner.key)object["distance"+axis]=d/multiply[style];}}}},onFocus:function(event){SOAPI.Event.propogateEvent(event,event.element);if(SOAPI.Event.dragActive)event.preventDefault();return true;},onBlur:function(event){SOAPI.Event.propogateEvent(event,event.element);return true;},onDragOver:function(event){return true;},onDragOut:function(event){return true;},onDrop:function(event){return true;},onKeyPress:function(event){return true;},onKeyDown:function(event){return true;},onKeyUp:function(event){return true;},onChange:function(event){return true;},onSizeChange:function(event){return true;},onContentChange:function(event){return true;},onNodeInserted:function(event){return true;},onNodeRemoved:function(event){return true;},onNodeInsertedIntoDocument:function(event){return true;},onNodeRemovedFromDocument:function(event){return true;}};