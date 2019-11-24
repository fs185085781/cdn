(function(){
    "use strict";
    /*兼容IE5不支持的属性*/
    /*重写string的trim方法*/
    if(typeof String.prototype.trim !== 'function') {
        String.prototype.trim = function() {
            return this.replace(/^\s+|\s+$/g, '');
        }
    }
    /*重写string的startsWith方法*/
    if(typeof String.prototype.startsWith !== 'function') {
        String.prototype.startsWith = function(str) {
            return this.indexOf(str) == 0;
        }
    }
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
                callback(mini.get($(ele).find(":first-child")[0]));
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
                    throw "EwebUiError:not find the element";
                }
                miniObj = mini.get($(miniEle)[0]);
            }
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
                    throw "EwebUiError:not find the element";
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