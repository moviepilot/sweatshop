SOAPI.widgets.list=function(p){new SOAPI.List(p);};SOAPI.List=SOAPI.Widget.extension();SOAPI.List.extend({wtype:"list",ctypes:{item:SOAPI.Button,toggle:SOAPI.ToggleButton,option:SOAPI.OptionButton},setup:function(parameters){var result=this.callParent(arguments.callee,"setup",arguments);var p=result.p;var w=result.w;var c=w.components;var items=c.items=this.createComponents({element:p.element,parent:w,cType:["item","toggle","option"]});return result;}});