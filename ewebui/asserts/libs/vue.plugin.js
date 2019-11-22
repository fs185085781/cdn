(function(){
    "use strict";
    Vue.prototype._oldInit = Vue.prototype._init;
    Vue.prototype._init = function(options){
        var oldBeforeUpdate = options.beforeUpdate;
        var oldUpdated = options.updated;
        var oldMounted = options.mounted;
        var oldDestroyed = options.destroyed;
        changeClass();
        options.mounted = function(){
            var that = this;
            initDocument();
            if(oldMounted){
                that.oldMounted = oldMounted;
                that.oldMounted();
            }
        }
        options.beforeUpdate = function(){
            var that = this;
            that.beforeVnode = that._vnode;
            if(oldBeforeUpdate){
                that.oldBeforeUpdate = oldBeforeUpdate;
                that.oldBeforeUpdate();
            }
        }
        options.updated = function(){
            var that = this;
            that.afterVnode = that._vnode;
            updateDocument(that.beforeVnode, that.afterVnode);
            if(oldUpdated){
                that.oldUpdated = oldUpdated;
                that.oldUpdated();
            }
        }
        options.destroyed = function(){
            var that = this;
            console.log("页面已经销毁");
            if(oldDestroyed){
                that.oldDestroyed = oldDestroyed;
                that.oldDestroyed();
            }
        }
        this._oldInit(options);
    }

    /**
     * 初始化doc,将miniui的div重新包括一层,并调用mini.parse初始化
     */
    function initDocument(){
        $.each(ctrlMap,function(key,val){
            var jlist = $(".p-"+key);
            if(jlist.length ==0){
                return true;
            }
            $.each(jlist,function (i,ele) {
                var wb = $(ele).prop("outerHTML")+"";
                $(ele).html(wb);
                $(ele).find(":first-child").removeClass("p-"+key).addClass(key);
            });
        });
        mini.parse();
    }

    /**
     * 将所有符合条件的miniui的class替换掉
     */
    function changeClass(){
        $.each(ctrlMap,function(key,val){
            var jlist = $("."+key);
            if(jlist.length ==0){
                return true;
            }
            $.each(jlist,function (i,ele) {
                $(ele).removeClass(key).addClass("p-"+key).attr("minicls",key);
            });
        });
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
})()