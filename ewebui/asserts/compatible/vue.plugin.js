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
        var oldBeforeUpdate = options.beforeUpdate;
        var oldUpdated = options.updated;
        var oldCreated = options.created;
        /**
         * 用于将miniui的class替换成别的class
         */
        changeClass();
        options.created = function(){
            var that = this;
            /**
             * 用于双向绑定,方便输入的事件回馈
             */
            bindModelDocument();
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
        console.log("将miniui的div重新包括一层,并调用mini.parse初始化,并绑定事件")
        $.each(ctrlMap,function(key,val){
            var jlist = $(".p-"+key);
            if(jlist.length ==0){
                return true;
            }
            $.each(jlist,function (i,ele) {
                var wb = $(ele).prop("outerHTML")+"";
                $(ele).html(wb);
                var miniEle = $(ele).find(":first-child");
                if(miniEle.length>0){
                    miniEle.removeClass("p-"+key).addClass(key);
                    if(miniEle.attr("mini-id")){
                        miniEle.attr("id",miniEle.attr("mini-id")).removeAttr("mini-id");
                    }
                }
            });
        });
        mini.parse();
        dgbl([vnode]);
        function dgbl(list){
            $.each(list,function(i,node){
                if(node.children && node.children.length > 0 ){
                    dgbl(node.children);
                }
                if(node.data && node.data.on && node.data.attrs && node.data.attrs.minicls){
                    bindEvent(node);
                }
            });
        }
        function bindEvent(node){
            var minicls = node.data.attrs.minicls;
            var ctrl = ctrlMap[minicls];
            if(!ctrl){
                return;
            }
            var miniObj = mini.get($(node.elm).find(":first-child")[0]);
            if(!miniObj){
                return;
            }
            var eventMap = node.data.on;
            $.each(eventMap,function(key,event){
                if(!ctrl["on"+key]){
                    return true;
                }
                miniObj.on(key,event);
                if(key == "valuechanged"){
                    miniObj.on(key,function(e){
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
     * 将所有符合条件的miniui的class替换掉
     */
    function changeClass(){
        console.log("替换class")
        $.each(ctrlMap,function(key,val){
            var jlist = $("."+key);
            if(jlist.length ==0){
                return true;
            }
            $.each(jlist,function (i,ele) {
                $(ele).removeClass(key).addClass("p-"+key).attr("minicls",key);
                if($(ele).attr("id")){
                    $(ele).attr("mini-id",$(ele).attr("id")).removeAttr("id");
                }
            });
        });
    }

    /**
     * 更新doc
     */
    function updateDocument(beforeVnode,afterVnode){
        console.log("更新文档")
        dgbl([beforeVnode],[afterVnode]);
        function dgbl(beforeList,afterList){
            $.each(beforeList,function(i,bv){
                var av = afterList[i];
                if(bv.children && bv.children.length > 0 ){
                    dgbl(bv.children,av.children);
                }
                if(bv.data && bv.data.attrs && bv.data.attrs.minicls){
                    action(bv,av);
                }
            });
        }
        function action(bv,av){
            var minicls = bv.data.attrs.minicls;
            var ctrl = ctrlMap[minicls];
            if(!ctrl){
                return;
            }
            var miniObj = mini.get($(av.elm).find(":first-child")[0]);
            if(!miniObj){
                return;
            }
            var battrs = bv.data.attrs;
            var aattrs = av.data.attrs;
            var map = {};
            $.each(battrs,function(key,val){
                map[key] = 1;
            });
            $.each(aattrs,function(key,val){
                map[key] = 1;
            });
            $.each(map,function(key,val){
                var value = aattrs[key];
                if(battrs[key] == value){
                    return true;
                }
                var prop = ctrl[key];
                if(!prop){
                    return true;
                }
                if(prop.type == "function"){
                    eval("miniObj."+prop.real+"(value)");
                }else{
                    var setProp = ctrl["set"+key];
                    if(setProp && setProp.type == "function"){
                        eval("miniObj."+setProp.real+"(value)");
                    }else{
                        miniObj[prop.real] = value;
                    }
                }
            });
        }
    }

    /**
     * 双向绑定 用户输入事件
     */
    function bindModelDocument(){
        console.log("双向绑定")
        $.each(ctrlMap,function(key,val){
            var jlist = $(".p-"+key);
            if(jlist.length ==0){
                return true;
            }
            $.each(jlist,function (i,ele) {
                var valueProp = $(ele).attr("v-bind:value");
                if(!valueProp){
                    valueProp = $(ele).attr(":value");
                }
                if(valueProp){
                    jQuery(ele).attr("v-on:updatevaluechange",valueProp+"=$event.target.value");
                }
            });
        });
    }
})()