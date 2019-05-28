(function(win){
    "use strict";
    var ui = win.simple;
    win.SimpleUiComponent = function(clazz){
        if(!ui.angular2ModuleMap){
            ui.angular2ModuleMap = {};
        }
        var module = ui.moduleMap[clazz];
        if(!module){
            console.log("此模块不存在");
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
        /*for(var event in eventMap){
            template +=" [attr.el"+event+"]=\"uiInput.el"+event+"\"";
        }*/
        template +="></div>";
        var oneComponent= ng.core.Component({
            selector: selector,
            inputs: ['uiInput'],
            template: template,
            providers: [ng.core.ElementRef]
        }).Class({
            constructor: [ng.core.ElementRef, function(ref) {
                this.el = ref.nativeElement;
            }],
            ngAfterViewChecked:function(){
                var uiEl = iBase(this.el).find("."+clazz);
                this.uiEl = uiEl;
                ui.parse(uiEl);
                var uiObj = ui.getBySelect(uiEl);
                if(!uiObj){
                    return;
                }
                this.ui = uiObj;
                uiObj.angular2 = this;
                var allBindMap = ui.angular2ModuleMap[clazz].allBindMap;
                if(allBindMap){
                    for(var event in eventMap){
                        var val = this.uiInput["el"+event];
                        if(!val){
                            continue;
                        }
                        var func = allBindMap[val];
                        if(!func){
                            continue;
                        }
                        var hasBindMap = uiObj.allBindEventMap;
                        if(!hasBindMap){
                            hasBindMap = {};
                        }
                        if(hasBindMap[event]){
                            continue;
                        }
                        uiObj.on(event,func);
                    }
                }
                //处理数据变化
                if(!this.oldDataMap){
                    this.oldDataMap = {};
                }
                var oldDataMap = this.oldDataMap;
                for(var field in fieldMap){
                    var val = this.uiInput[field];
                    var oldVal = oldDataMap[field];
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
    win.SimpleUiBindEvent=function(module,methodName,func){
        var clazz = module.clazz;
        var allBindMap = ui.angular2ModuleMap[clazz].allBindMap;
        if(!allBindMap){
            allBindMap = {};
            ui.angular2ModuleMap[clazz].allBindMap = allBindMap;
        }
        allBindMap[methodName] = func;
    };
})(window)