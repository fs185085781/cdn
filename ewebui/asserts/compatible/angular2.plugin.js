(function(win){
    "use strict";
    var ui = win[win.uiprefix];
    win.angularEvent = function(e){
        e.base.angular2.uiOutput.emit(e);
    }
    win.SimpleUiComponent = function(clazz){
        if(!ui.angular2ModuleMap){
            ui.angular2ModuleMap = {};
        }
        var module = ui.moduleMap[clazz];
        if(!module){
            console.error(clazz +" no has the module")
            return;
        }
        var oneComponent= ui.angular2ModuleMap[clazz];
        if(oneComponent){
            return oneComponent;
        }
        var selector ='['+clazz+']';
        var moduleObj = new module();
        var eventMap = moduleObj.eventMap;
        var fieldMap = moduleObj.fieldMap;
        var template = "<div";
        template +=" class=\""+clazz+"\"";
        for(var field in fieldMap){
            template +=" [attr."+field+"]=\"uiInput."+field+"\"";
        }
        template +="></div>";
        var oneComponent= ng.core.Component({
            selector: selector,
            inputs: ['uiInput'],
            outputs: ['uiOutput'],
            template: template,
            providers: [ng.core.ElementRef]
        }).Class({
            constructor: [ng.core.ElementRef, function(ref) {
                this.el = ref.nativeElement;
                this.uiOutput = new ng.core.EventEmitter();
            }],
            ngAfterViewChecked:function(){
                if(!this.hasParse){
                    var uiEl = jQuery(this.el).find("."+clazz);
                    this.uiEl = uiEl;
                    ui.parse(uiEl);
                    var uiObj = ui.getBySelect(uiEl);
                    this.ui = uiObj;
                    this.hasParse = true;
                    if(!this.ui){
                        return
                    }
                    uiObj.angular2 = this;
                    for(var event in eventMap){
                        var val = this.uiInput["el"+event];
                        if(!val){
                            continue;
                        }
                        var hasBindMap = uiObj.allBindEventMap;
                        if(!hasBindMap){
                            hasBindMap = {};
                        }
                        if(hasBindMap[event]){
                            continue;
                        }
                        uiObj.on(event,angularEvent);
                    }
                }
                if(!this.ui){
                    return
                }
                var uiObj = this.ui;
                //处理数据变化
                if(!this.oldDataMap){
                    this.oldDataMap = {};
                }
                var oldDataMap = this.oldDataMap;
                for(var field in fieldMap){
                    var val = this.uiInput[field];
                    var oldVal = oldDataMap[field];
                    if(!oldVal && !val){
                        continue;
                    }
                    if(oldVal == val){
                        continue;
                    }
                    var setFunctionName = "set"+ui.firstToUpperCase(field);
                    if(uiObj[setFunctionName]){
                        eval("uiObj."+setFunctionName+"(val)");
                    }else{
                        uiObj[field] = val;
                    }
                    oldDataMap[field] = val;
                }
            }
        });
        ui.angular2ModuleMap[clazz] = oneComponent;
        oneComponent.clazz = clazz;
        return oneComponent;
    }
})(window)