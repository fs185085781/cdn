(function(win){
    var simpleVue = Vue;
    Vue = function(options){
        var oldUpdated = options.updated;
        var oldMounted = options.mounted;
        var oldDestroyed = options.destroyed;
        options.updated = function(){
            var that = this;
            var _vnode = that._vnode;
            updateSimpleUiByVueNode(_vnode,"updated");
            if(oldUpdated){
                that.oldUpdated = oldUpdated;
                that.oldUpdated();
            }
        }
        options.mounted = function(){
            var that = this;
            var _vnode = that._vnode;
            updateSimpleUiByVueNode(_vnode,"mounted");
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
        var vueObj = new simpleVue(options);
        return vueObj;
    }
    function updateSimpleUiByVueNode(_vnode,eventName){
        if(eventName == "mounted"){
            simple.parse();
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
            var simpleObj = simple.getBySelect(node.elm);
            if(!simpleObj){
                continue;
            }
            if(!simpleObj.allBindEventMap){
                simpleObj.allBindEventMap = {};
            }
            var eventMap = node.data.on;
            var fieldMap = node.data.attrs;
            for(var event in eventMap){
                var eventName = event.substring(2);
                if(simpleObj.allBindEventMap[eventName]){
                    continue;
                }
                if(!simpleObj.eventMap[eventName]){
                    continue;
                }
                simpleObj.on(eventName,eventMap[event]);
            }
            for(var field in fieldMap){
                if(!simpleObj.fieldMap[field]){
                    continue;
                }
                var value = fieldMap[field];
                var setFunctionName = "set"+simple.firstToUpperCase(field);
                if(simpleObj[setFunctionName]){
                    eval("simpleObj."+setFunctionName+"(value)");
                }else{
                    simpleObj[field] = value;
                }
            }

        }
    }
})(window)