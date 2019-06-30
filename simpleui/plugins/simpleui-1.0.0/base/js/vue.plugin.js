(function(win){
    "use strict";
    var ui = win[win.uiprefix];
    var tempVue = Vue;
    Vue = function(options){
        var oldUpdated = options.updated;
        var oldMounted = options.mounted;
        var oldDestroyed = options.destroyed;
        options.updated = function(){
            var that = this;
            updateUiByVueNode(that,"updated");
            if(oldUpdated){
                that.oldUpdated = oldUpdated;
                that.oldUpdated();
            }
        }
        options.mounted = function(){
            var that = this;
            updateUiByVueNode(that,"mounted");
            if(oldMounted){
                that.oldMounted = oldMounted;
                that.oldMounted();
            }
        }
        options.destroyed = function(){
            var that = this;
            if(oldDestroyed){
                that.oldDestroyed = oldDestroyed;
                that.oldDestroyed();
            }
        }
        var vueObj = new tempVue(options);
        return vueObj;
    }
    function updateUiByVueNode(that,eventName){
        var _vnode = that._vnode;
        if(eventName == "mounted"){
            ui.parse();
        }
        if(!_vnode){
            return;
        }
        var children = _vnode.children;
        if(!children || children.length ==0){
            return;
        }
        for(var i=0;i<children.length;i++){
            var node = children[i];
            var uiObj = ui.getBySelect(node.elm);
            if(!uiObj){
                continue;
            }
            uiObj.vue = that;
            if(!uiObj.allBindEventMap){
                uiObj.allBindEventMap = {};
            }
            var eventMap = node.data.on;
            var fieldMap = node.data.attrs;
            for(var event in eventMap){
                var eventName = event.substring(2);
                if(uiObj.allBindEventMap[eventName]){
                    continue;
                }
                if(!uiObj.eventMap[eventName]){
                    continue;
                }
                uiObj.on(eventName,eventMap[event]);
            }
            for(var field in fieldMap){
                if(!uiObj.fieldMap[field]){
                    continue;
                }
                var value = fieldMap[field];
                var setFunctionName = "set"+ui.firstToUpperCase(field);
                if(uiObj[setFunctionName]){
                    eval("uiObj."+setFunctionName+"(value)");
                }else{
                    uiObj[field] = value;
                }
            }

        }
    }
})(window)