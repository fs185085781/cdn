(function(){
    "use strict";
    //auto
    window.mini.autoParse = false;
    //debug
    window.mini_debugger = false;
    var ctrlMap = {};
    var css = "";
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
               var type=typeof val2;
               if(key2 == "value"){
                   type = "string";
               }
               propMap[key2Low] = {real:key2,type:type};
           }
        });
        ctrlMap[clazz] = propMap;
        css += ",.p-"+clazz;
    });
    css = css.substring(1);
    css += "{display:inline !important;}";
    function findIncludeOwn(parent,className){
        var jlist = $(parent).find("."+className);
        if(jlist.length ==0 && !$(parent).hasClass(className)){
            return [];
        }
        var list = [];
        $.each(jlist,function(i,one){
            list[list.length] = one;
        });
        if($(parent).hasClass(className)){
            list[list.length] = $(parent)[0];
        }
        return list;
    }
    var copatible = {
        ctrlMap:ctrlMap,
        changeMiniuiClass:function(parent,callback){
            var that = this;
            if(parent==null || $(parent).length == 0){
                parent = $("body")[0];
            }else{
                parent = $(parent)[0];
            }
            var clist = [];
            $.each(that.ctrlMap,function(key,val){
                var list = findIncludeOwn(parent,key);
                $.each(list,function (i,ele) {
                    $(ele).removeClass(key).addClass("p-"+key).attr("minicls",key);
                    if($(ele).attr("id")){
                        $(ele).attr("mini-id",$(ele).attr("id")).removeAttr("id");
                    }
                    clist[clist.length] = ele;
                });
            });
            if(callback){
                callback(clist);
            }
        },
        parseMiniUi:function(parent,callback){
            if(parent==null || $(parent).length == 0){
                parent = $("body")[0];
            }else{
                parent = $(parent)[0];
            }
            var listEle = [];
            $.each(ctrlMap,function(key,val){
                var list = findIncludeOwn(parent,"p-"+key);
                $.each(list,function (i,ele) {
                    var wb = $(ele).prop("outerHTML")+"";
                    $(ele).html(wb);
                    var miniEle = $(ele).find(":first-child");
                    if(miniEle.length>0){
                        miniEle = $(miniEle[0]);
                        miniEle.removeClass("p-"+key).addClass(key);
                        if(miniEle.attr("mini-id")){
                            miniEle.attr("id",miniEle.attr("mini-id")).removeAttr("mini-id");
                        }
                        listEle[listEle.length] = ele;
                    }
                });
            });
            mini.parse(parent);
            var miniObjList = [];
            $.each(listEle,function (i,ele) {
                var miniObj = mini.get($(ele).find(":first-child")[0]);
                if(miniObj){
                    miniObjList[miniObjList.length] = miniObj;
                }
            })
            if(callback){
                callback(miniObjList);
            }
            if($("#p-mini-inline").length == 0){
                $("body").append("<style id='p-mini-inline' type='text/css'>"+css+"</style>");
            }
        },
        bindEvent:function(ele,evnetMap,valueChangeFire){
            var that = this;
            var miniEle = $(ele).find(":first-child");
            if(miniEle.length == 0){
                throw "EwebUiError bindEvent:not find the element";
            }
            var miniObj = mini.get($(miniEle)[0]);
            if(!miniObj){
                throw "EwebUiError bindEvent:the ele is not a mini obj";
            }
            var clazzName = miniObj.uiCls;
            var ctrl = that.ctrlMap[clazzName];
            if(!ctrl){
                throw "EwebUiError bindEvent:ctrlMap has updated";
            }
            $.each(evnetMap,function(key,val){
                if(!ctrl["on"+key]){
                    return true;
                }
                if(val){
                    miniObj.on(key,val);
                }else{
                    miniObj.un(key,null);
                }
            });
            if(valueChangeFire && ctrl["onvaluechanged"]){
                if(!miniObj.valueUpdateEvent){
                    miniObj.valueUpdateEvent = function(e){
                        valueChangeFire(e);
                    }
                }
                miniObj.on("valuechanged",miniObj.valueUpdateEvent);
            }
        },
        updateComponent:function(ele,prepMap,currentMap,callback){
            var that = this;
            var miniObj = ele;
            if(!ele.isControl){
                var miniEle = $(ele).find(":first-child");
                if(miniEle.length == 0){
                    console.warn("未找到mini元素");
                    $(ele).hide();
                    return;
                }
                miniObj = mini.get(miniEle[0]);
            }
            if(!miniObj){
                $(ele).hide();
                console.warn("未找到mini实体");
                return;
            }
            var clazzName = miniObj.uiCls;
            var ctrl = that.ctrlMap[clazzName];
            if(!ctrl){
                throw "EwebUiError updateComponent:ctrlMap has updated";
            }
            var map = {};
            $.each(prepMap,function(key,val){
                map[key] = 1;
            });
            $.each(currentMap,function(key,val){
                map[key] = 1;
            });
            var eventMap = {};
            $.each(map,function(key,val){
                var value = currentMap[key];
                if(prepMap[key] == value){
                    return true;
                }
                var prop = ctrl[key];
                var event = ctrl["on"+key];
                if(event){
                    eventMap[key] = value;
                }
                if(!prop){
                    return true;
                }
                value = that.getRealValue(value);
                value = that.parseData(value,prop.type);
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
            if(callback){
                callback(eventMap);
            }
        },
        destroyComponent:function(ele){
            var miniObj = ele;
            if(!ele.isControl){
                var miniEle = $(ele).find(":first-child");
                if(miniEle.length == 0){
                    throw "EwebUiError:not find the destroyComponent element";
                }
                miniObj = mini.get($(miniEle)[0]);
            }
            if(miniObj){
                miniObj.destroy();
            }
        },
        getRealValue:function (val){
            try{
                /*IE浏览器下eval执行到不包含的变量不会抛异常返回undefined*/
                if(eval(val) == eval(eval(val))){
                    /*当前是数值或是对象*/
                }else{
                    try{
                        val = eval(val);
                    }catch (e2) {
                        /*无法使用eval的不处理*/
                    }
                }
            }catch (e) {
                /*谷歌浏览器下eval执行到不包含的变量会抛异常进这里*/
                try{
                    val = eval(val);
                }catch (e2) {
                    /*无法使用eval的不处理*/
                }
            }
            return val;
        },
        parseData:function(val,type){
            if(type == "string"){
                return this.parseString(val);
            }else if(type == "boolean"){
                return this.parseBoolean(val);
            }if(type == "number"){
                return this.parseNumber(val);
            }if(type == "object"){
                return this.parseObject(val);
            }else{
                throw "EwebUiError:can not convert val";
            }
        },
        parseString:function(val){
            if(typeof val == "string"){
                return val.trim();
            }else if(val == null){
                return "";
            }else if(typeof val == "function"){
                return String(val);
            }else if(val instanceof Date){
                return mini.formatDate(val,"yyyy-MM-dd HH:mm:ss");
            }else{
                return mini.encode(val);
            }
        },
        parseBoolean:function(val){
            if(typeof val == "boolean"){
                return val;
            }if(val == "true" || val == "false"){
                return eval(val);
            }if(val == "1" || val =="0"){
                return Boolean(Number(val));
            }else if(val == null){
                return false;
            }else if(typeof val == "string"){
                val = val.trim();
                if(val){
                    return true;
                }else{
                    return false;
                }
            }
            return true;
        },
        parseNumber:function(val){
            if(typeof val == "number"){
                return val;
            }else if(typeof val == "string"){
                val = val.trim();
                if(!isNaN(val)){
                    return val*1;
                }
            }else if(val instanceof Date){
                return val.getTime();
            }
            return 0;
        },
        parseObject:function(val){
            if(typeof val != "string"){
                return val;
            }
            return mini.decode(val);
        }
    };
    window.copatible = copatible;
    /**
     * 所有兼容层的实现原理均为以下步骤
     * 1.替换所有miniui的class
     * 2.准备双向绑定素材
     * 3.对mini进行外包一层,并调用mini初始化
     * 4.当有数据更新的时候,同步更新文档
     */
})()