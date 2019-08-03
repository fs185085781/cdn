(function(win){
    "use strict";
    Vue.prototype._oldInit = Vue.prototype._init;
    Vue.prototype.oldMounted = function(){};
    Vue.prototype.oldUpdated = function(){};
    Vue.prototype.oldDestroyed = function(){};
    Vue.prototype.oldCreated = function(){};
    Vue.prototype._init = function(options){
        if(options.mounted){
            Vue.prototype.oldMounted = options.mounted;
        }
        if(options.updated){
            Vue.prototype.oldUpdated = options.updated;
        }
        if(options.destroyed){
            Vue.prototype.oldDestroyed = options.destroyed;
        }
        if(options.created){
            Vue.prototype.oldCreated = options.created;
        }
        options.updated = function(){
            var that = this;
            that.updateUiByVue();
            that.oldUpdated();
        }
        options.mounted = function(){
            var that = this;
            that.createUiByVue();
            that.oldMounted();
        }
        options.destroyed = function(){
            var that = this;
            that.destroyedUiByVue();
            that.oldDestroyed();
        }
        options.created = function(){
            var that = this;
            that.createdUiByVue();
            that.oldCreated();
        }
        this.totipUiMap = {};
        this._oldInit(options);
    }
    Vue.prototype.createUiByVue = function(){
        var that = this;
        tot.parseUi();
        recursiveVnode(that._vnode,that);
    }
    Vue.prototype.updateUiByVue = function(){
        var that = this;
        recursiveVnode(that._vnode,that);
    }
    Vue.prototype.destroyedUiByVue = function(){
        var that = this;
    }
    Vue.prototype.createdUiByVue = function(){
        var that = this;
        jQuery.each(tot.valueChangedCtrls,function(i,cls){
            var divClass = tot.prefixClass+cls;
            jQuery("."+divClass).each(function(i,div){
                var valueProp = jQuery(div).attr("v-bind:value");
                jQuery(div).attr("v-on:updatevaluechange",valueProp+"=$event.target.value");
            });
        });
    }
    function recursiveVnode(vnode,that){
        if(vnode.children && vnode.children.length > 0){
            jQuery.each(vnode.children,function(i,childNode){
                recursiveVnode(childNode,that);
            });
        }
        actionVnode(vnode,that);
    }
    function actionVnode(vnode,that){
        if(!vnode || !vnode.data || !vnode.data.staticClass){
            return;
        }
        var uiObj = tot.getBySelect(vnode.elm);
        if(!uiObj){
            return;
        }
        if(uiObj.onValueChanged){
            uiObj.on("valuechanged",function(e){
                var input = e.sender.totipUiEl;
                input.value = e.value;
                if(input.value instanceof Date){
                    input.value = e.sender.getFormValue();
                }
                var event = document.createEvent("MouseEvents");
                event.initMouseEvent("updatevaluechange", true, true, document.defaultView, 0, 0, 0, 0, 0, false, false, false, 0, null,null);
                input.dispatchEvent(event);
            });
        }
        if(that.totipUiMap[uiObj.totipUid] == null){
            that.totipUiMap[uiObj.totipUid] = {attrs:{},on:{}};
        }
        var attrs = vnode.data.attrs;
        var oldAttrs = that.totipUiMap[uiObj.totipUid].attrs;
        for(var field in attrs){
            var value = attrs[field];
            if(value == oldAttrs[field]){
                continue;
            }
            var setFunctionName = "set"+tot.firstToUpperCase(tot.underlineToHump(field));
            if(uiObj[setFunctionName]){
                eval("uiObj."+setFunctionName+"(value)");
            }
            oldAttrs[field] = value;
        }
        var ons = vnode.data.on;
        var oldOns = that.totipUiMap[uiObj.totipUid].on;
        for(var field in ons){
            var value = ons[field];
            if(value == oldOns[field]){
                continue;
            }
            var eventName = field.substring(2);
            uiObj.on(eventName,value);
            oldOns[field] = value;
        }
    }
})(window)