(function (win) {
    win.tot=win.mini;
    win.tot.prefixClass = "totipotent-";
    var temp = {
        firstToUpperCase: function (str) {
            if (!str) {
                return str;
            }
            str = str + "";
            str = str.substring(0, 1).toUpperCase() + str.substring(1);
            return str;
        },
        firstToLowerCase: function (str) {
            if (!str) {
                return str;
            }
            str = str + "";
            str = str.substring(0, 1).toLowerCase() + str.substring(1);
            return str;
        },
        underlineToHump:function(str){
            while(true){
                var has = str.indexOf("_");
                if(has == -1){
                    break;
                }
                var next = str.substring(has+1,has+2);
                if(next == ""){
                    str = str.substring(0,has);
                }else{
                    str = str.substring(0,has)+next.toUpperCase()+str.substring(has+2);
                }
            }
            return str;
        },
        getRealValue: function (val) {
            try {
                /*IE浏览器下eval执行到不包含的变量不会抛异常返回undefined*/
                if (eval(val) == eval(eval(val))) {
                    /*当前是数值或是对象*/
                } else {
                    try {
                        val = eval(val);
                    } catch (e2) {
                        /*无法使用eval的不处理*/
                    }
                }
            } catch (e) {
                /*谷歌浏览器下eval执行到不包含的变量会抛异常进这里*/
                try {
                    val = eval(val);
                } catch (e2) {
                    /*无法使用eval的不处理*/
                }
            }
            return val;
        },
        regCtrls:function(){
            var that = this;
            that.ctrlMap = {};
            that.valueChangedCtrls = [];
           var ctrls = [];
           jQuery.each(tot,function(key,val){
               if(eval("tot."+key) && eval("tot."+key+".prototype") && eval("tot."+key+".prototype.uiCls")){
                   ctrls[ctrls.length] = key;
               }
           });
           jQuery.each(ctrls,function(i,item){
               var uiCls = eval("tot."+item+".prototype.uiCls");
               uiCls = uiCls.replace("mini-","");
               var ctrl = eval("tot."+item+".prototype");
               var fieldList = [];
               if(ctrl.onValueChanged){
                   that.valueChangedCtrls[that.valueChangedCtrls.length] = uiCls;
               }
               jQuery.each(ctrl,function(key,val){
                   if(typeof val != "function"){
                       return true;
                   }
                   if(key.length <=3 || key.substring(0,3) != "get"){
                       return true;
                   }
                   var set = "set"+key.substring(3);
                   if(!ctrl[set] || typeof ctrl[set] != "function"){
                       return true;
                   }
                   var realField = that.firstToLowerCase(key.substring(3));
                   fieldList[fieldList.length] = realField;
               });
               that.ctrlMap[uiCls] = {fieldList:fieldList,ctrlClass:eval("tot."+item)};
           });
        },
       parseUi: function () {
            var that = this;
            if (that.lastKeyId == null) {
                that.lastKeyId = 1;
            }
            if (that.uiMap == null) {
                that.uiMap = {};
            }
            jQuery.each(that.ctrlMap,function (field,ctrl) {
                jQuery("."+that.prefixClass+ field).each(function (n, item) {
                    if (item.getAttribute("uikey")) {
                        return true;
                    }
                    jQuery(item).html("<div class='mini-" + field + "'></div>");
                });
            });
           tot.parse();
           jQuery.each(that.ctrlMap,function (field,ctrl) {
               jQuery("."+that.prefixClass+ field).each(function (n, item) {
                   if (item.getAttribute("uikey")) {
                       return true;
                   }
                   var obj = tot.get(jQuery(item).find(":first-child")[0]);
                   if(obj == null){
                       return true;
                   }
                   var key = "totipkey-" + (that.lastKeyId++);
                   jQuery(item).attr("uikey", key);
                   obj.totipUiEl = item;
                   obj.totipUid = key;
                   obj.totipType = field;
                   that.uiMap[key] = obj;
                   var events = {};
                   jQuery.each(item.attributes, function (i, attr) {
                       if (!attr.specified) {
                           return true;
                       }
                       if(attr.name.indexOf("sizzle") != -1) {
                           return true;
                       }
                       if (attr.name == "class" || attr.name == "uikey" || attr.name == "id") {
                           return true;
                       }
                       if(ctrl.fieldList.contains(attr.name)){
                           var value = that.getRealValue(attr.value);
                           eval("obj.set"+that.firstToUpperCase(that.underlineToHump(attr.name))+"(value)");
                       }else{
                           if (attr.name.length > 2 && attr.name.substring(0, 2) == "el") {
                               events[attr.name.substring(2)] = attr.value;
                           }
                       }
                   });
                   jQuery.each(events, function (key, value) {
                       value = value.trim();
                       if (win[value]) {
                           obj.on(key, win[value]);
                       } else if (value.startsWith("function")) {
                           if (that.lastEventId == null) {
                               that.lastEventId = 1;
                           }
                           var eventName = "totip_event_" + (that.lastEventId++);
                           eval("win." + eventName + "=" + value);
                           obj.on(key, eval(eventName));
                       } else if (value.indexOf("(") != -1 && value.indexOf(")") != -1) {
                           var z = value.indexOf("(");
                           var m = value.indexOf(":");
                           var method;
                           if (m != -1 && m < z) {
                               method = value.substring(m + 1, z);
                           } else {
                               method = value.substring(0, z);
                           }
                           if (method && win[method]) {
                               obj.on(key, win[method]);
                           }
                       }else{
                           return true;
                       }
                   });
               });
           });
        },
        getBySelect:function(el){
            var key = jQuery(el).attr("uikey");
            if(!key){
                return null;
            }
            return this.uiMap[key];
        }
    }
    for(var key in temp){
        win.tot[key] = temp[key];
    }
    win.tot.regCtrls();
})(window);