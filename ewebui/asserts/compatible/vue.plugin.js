(function(){
    "use strict";
    Vue.prototype._oldInit = Vue.prototype._init;
    Vue.prototype.fireEvent = function(key,event){
        if(event){
            this[key] = event;
            this[key]();
        }
    }
    Vue.prototype._init = function(options){
        var oldMounted = options.mounted;
        options.mounted = function(){
            //我拦截的,可以在这里写框架代码
            var that = this;
            if(oldMounted){
                that.oldMounted = oldMounted;
                //用户输入的,调用用户的生命周期方法
                that.oldMounted();
            }
        }

        var oldBeforeUpdate = options.beforeUpdate;
        var oldUpdated = options.updated;
        var oldCreated = options.created;
        options.created = function(){
            var that = this;
            /**
             * 用于将miniui的class替换成别的class,并绑定双向输入事件
             */
            copatible.changeAllClass(function(ele){
                var valueProp = $(ele).attr("v-bind:value");
                if(!valueProp){
                    valueProp = $(ele).attr(":value");
                }
                if(valueProp){
                    jQuery(ele).attr("v-on:updatevaluechange",valueProp+"=$event.target.value");
                }
            });
            that.fireEvent("oldCreated",oldCreated);
        }
        options.mounted = function(){
            var that = this;
            /**
             * 用于初始化miniui组件,并绑定事件
             */
            initDocument(that._vnode);
            that.fireEvent("oldMounted",oldMounted);
        }
        options.beforeUpdate = function(){
            var that = this;
            that.beforeVnode = that._vnode;
            that.fireEvent("oldBeforeUpdate",oldBeforeUpdate);
        }
        options.updated = function(){
            var that = this;
            that.afterVnode = that._vnode;
            /**
             * 用于对比前后的虚拟dom,并更新miniui组件
             */
            updateDocument(that.beforeVnode, that.afterVnode);
            that.fireEvent("oldUpdated",oldUpdated);
        }
        this._oldInit(options);
    }
    /**
     * 初始化doc,将miniui的div重新包括一层,并调用mini.parse初始化
     */
    function initDocument(vnode){
        copatible.parseMiniAll(null,function(){
            dgbl([vnode]);
        });
        function dgbl(list){
            $.each(list,function(i,node){
                if(node.children && node.children.length > 0 ){
                    dgbl(node.children);
                }
                if(node.data && node.data.on && node.data.attrs && node.data.attrs.minicls){
                    //bindEvent(node);
                    var eventMap = node.data.on;
                    copatible.bindEvent(node.elm,eventMap,function(e){
                        var input = $(node.elm)[0];
                        input.value = e.value;
                        var event = document.createEvent("MouseEvents");
                        event.initMouseEvent("updatevaluechange", true, true, document.defaultView, 0, 0, 0, 0, 0, false, false, false, 0, null,null);
                        input.dispatchEvent(event);
                    });
                }
            });
        }
    }
    /**
     * 更新doc
     */
    function updateDocument(beforeVnode,afterVnode){
        dgbl([beforeVnode],[afterVnode]);
        function dgbl(beforeList,afterList){
            $.each(beforeList,function(i,bv){
                var av = afterList[i];
                if(bv.children && bv.children.length > 0 ){
                    dgbl(bv.children,av.children);
                }
                if(bv.data && bv.data.attrs && bv.data.attrs.minicls){
                    copatible.updateComponent(av.elm,bv.data.attrs,av.data.attrs);
                }
            });
        }
    }
})()