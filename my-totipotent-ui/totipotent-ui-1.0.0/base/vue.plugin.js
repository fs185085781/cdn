(function(win){
    "use strict";
    Vue.prototype._oldInit = Vue.prototype._init;
    Vue.prototype._init = function(options){
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
        this._oldInit(options);
    }
    function updateUiByVueNode(that,eventName){
        var _vnode = that._vnode;
        if(eventName == "mounted"){
            totipUi.parse();
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
            var uiObj = totipUi.getBySelect(node.elm);
            if(!uiObj){
                continue;
            }
            uiObj.vue = that;
            var eventMap = node.data.on;
            var fieldMap = node.data.attrs;
            for(var event in eventMap){
                var eventName = event.substring(2);
                if(uiObj.allBindEventMap[eventName]){
                    continue;
                }
                uiObj.on(eventName,eventMap[event]);
                uiObj.allBindEventMap[eventName] = eventName;
            }
            for(var field in fieldMap){
                var value = fieldMap[field];
                var setFunctionName = "set"+totipUi.firstToUpperCase(field);
                if(uiObj[setFunctionName]){
                    eval("uiObj."+setFunctionName+"(value)");
                }
            }
        }
    }
})(window)