(function(){
    "use strict";
    var ctrlMap = {};
    jQuery.each(mini,function(key,val){
        if(!mini[key]){
            return true;
        }
        if(!mini[key].prototype){
            return true;
        }
        if(!mini[key].prototype.uiCls){
            return true;
        }
        if(mini[key].prototype.uiCls == "mini-gridview"){
            return true;
        }
        if(!mini[key].prototype.isControl){
            return true;
        }
        var clazz = mini[key].prototype.uiCls;
        var prototype = mini[key].prototype;
        var propMap = {};
        jQuery.each(prototype,function(key2,val2){
            var key2Low = key2.toLowerCase();
           if(propMap[key2Low]===undefined){
               propMap[key2Low] = {real:key2,type:typeof val2};
           }
        });
        ctrlMap[clazz] = propMap;
    });
    var copatible = {
        ctrlMap:ctrlMap,
        changeAllClass:function(oneCallback,afterCallback){
            var that = this;
            $.each(that.ctrlMap,function(key,val){
                var jlist = $("."+key);
                if(jlist.length ==0){
                    return true;
                }
                $.each(jlist,function (i,ele) {
                    that.changeOneClass(key,ele,oneCallback);
                });
            });
            if(afterCallback){
                afterCallback();
            }
        },
        changeOneClass:function(classNameStr,ele,callback){
            var that = this;
            var clazzSz = classNameStr.split(" ");
            var className="";
            $.each(clazzSz,function(i,item){
                if(that.ctrlMap[item]){
                    className = item;
                    return false;
                }
            });
            if(!className || !that.ctrlMap[className]){
                throw "EwebUiError:"+className+" is not a miniui class";
            }
            $(ele).removeClass(className).addClass("p-"+className).attr("minicls",className);
            if($(ele).attr("id")){
                $(ele).attr("mini-id",$(ele).attr("id")).removeAttr("id");
            }
            if(callback){
                callback(ele);
            }
        },
        parseMiniAll:function(oneCallback,afterCallback){
            var that = this;
            $.each(ctrlMap,function(key,val){
                var jlist = $(".p-"+key);
                if(jlist.length ==0){
                    return true;
                }
                $.each(jlist,function (i,ele) {
                    that.parseMiniOne(key,ele,oneCallback);
                });
            });
            if(afterCallback){
                afterCallback();
            }
        },
        parseMiniOne:function(classNameStr,ele,callback){
            var that = this;
            var clazzSz = classNameStr.split(" ");
            var className="";
            $.each(clazzSz,function(i,item){
                if(that.ctrlMap[item]){
                    className = item;
                    return false;
                }
            });
            if(!className || !that.ctrlMap[className]){
                throw "EwebUiError:"+className+" is not a miniui class";
            }
            var wb = $(ele).prop("outerHTML")+"";
            $(ele).html(wb);
            var miniEle = $(ele).find(":first-child");
            if(miniEle.length>0){
                miniEle.removeClass("p-"+className).addClass(className);
                if(miniEle.attr("mini-id")){
                    miniEle.attr("id",miniEle.attr("mini-id")).removeAttr("mini-id");
                }
            }
            mini.parse(ele);
            if(callback){
                callback(ele);
            }
        },
        bindEvent:function(ele,evnetMap,valueChangeFire){
            var that = this;
            var miniEle = $(ele).find(":first-child");
            if(miniEle.length == 0){
                throw "EwebUiError:not find the element";
            }
            var miniObj = mini.get($(miniEle)[0]);
            if(!miniObj){
                throw "EwebUiError:the ele is not a mini obj";
            }
            var clazzName = miniObj.uiCls;
            var ctrl = that.ctrlMap[clazzName];
            if(!ctrl){
                throw "EwebUiError:ctrlMap has updated";
            }
            $.each(evnetMap,function(key,val){
                if(!ctrl["on"+key]){
                    return true;
                }
                miniObj.on(key,val);
            });
            if(valueChangeFire && ctrl["onvaluechanged"]){
                miniObj.on("valuechanged",function(e){
                    valueChangeFire(e);
                });
            }
        },
        updateComponent:function(ele,prepMap,currentMap){
            var that = this;
            var miniEle = $(ele).find(":first-child");
            if(miniEle.length == 0){
                throw "EwebUiError:not find the element";
            }
            var miniObj = mini.get($(miniEle)[0]);
            if(!miniObj){
                throw "EwebUiError:the ele is not a mini obj";
            }
            var clazzName = miniObj.uiCls;
            var ctrl = that.ctrlMap[clazzName];
            if(!ctrl){
                throw "EwebUiError:ctrlMap has updated";
            }
            var map = {};
            $.each(prepMap,function(key,val){
                map[key] = 1;
            });
            $.each(currentMap,function(key,val){
                map[key] = 1;
            });
            $.each(map,function(key,val){
                var value = currentMap[key];
                if(prepMap[key] == value){
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
    };
    window.ctrlMap = ctrlMap;
    window.copatible = copatible;
    /**
     * 所有兼容层的实现原理均为以下步骤
     * 1.替换所有miniui的class
     * 2.准备双向绑定素材
     * 3.对mini进行外包一层,并调用mini初始化
     * 4.当有数据更新的时候,同步更新文档
     */
})()