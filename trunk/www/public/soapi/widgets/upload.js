SOAPI.widgets.upload=function(p){new SOAPI.Upload(p);};SOAPI.Upload=SOAPI.Widget.extension();SOAPI.Upload.extend({wtype:"upload",parameters:SOAPI.merge(SOAPI.Widget.prototype.parameters,{tabindex:0}),setup:function(parameters){var result=this.callParent(arguments.callee,"setup",arguments);var p=result.p;var w=result.w;var c=w.components;var handlers=SOAPI.Dialog_Handlers;console.log('asdsad');return result;},});SOAPI.Dialog_Handlers={};