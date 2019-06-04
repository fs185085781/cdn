(function(win){
    "use strict";
    var ui = win[win.uiprefix];
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
    /*提供基础方法工具类*/
    var tools = {
        encode:function(jsonObj) {
            var that = this;
            var result = '',
                curVal;
            if (jsonObj === null) {
                return String(jsonObj);
            }
            switch (typeof jsonObj) {
                case 'number':
                case 'boolean':
                    return String(jsonObj);
                case 'string':
                    return '"' + jsonObj + '"';
                case 'undefined':
                case 'function':
                    return undefined;
            }
            switch (Object.prototype.toString.call(jsonObj)) {
                case '[object Array]':
                    result += '[';
                    for (var i = 0, len = jsonObj.length; i < len; i++) {
                        curVal = that.encode(jsonObj[i]);
                        result += (curVal === undefined ? null : curVal) + ",";
                    }
                    if (result !== '[') {
                        result = result.slice(0, -1);
                    }
                    result += ']';
                    return result;
                case '[object Date]':
                    return '"' + that.formatDate(jsonObj,"yyyy-MM-dd HH:mm:ss") + '"';
                case '[object RegExp]':
                    return "{}";
                case '[object Object]':
                    result += '{';
                    for (i in jsonObj) {
                        if (jsonObj.hasOwnProperty(i)) {
                            curVal = that.encode(jsonObj[i]);
                            if (curVal !== undefined) {
                                result += '"' + i + '":' + curVal + ',';
                            }
                        }
                    }
                    if (result !== '{') {
                        result = result.slice(0, -1);
                    }
                    result += '}';
                    return result;

                case '[object String]':
                    return '"' + jsonObj.toString() + '"';
                case '[object Number]':
                case '[object Boolean]':
                    return jsonObj.toString();
            }
        },
        decode:function(str){
            if(typeof str == "object"){
                return str;
            }
            return eval("("+str+")");
        },
        formatDate:function(date,format){
            if(!date){
                return null;
            }
            if(typeof date == "string"){
                return date;
            }
            if(!date instanceof Date){
                return null;
            }
            if(!format){
                format = "yyyy-MM-dd HH:mm:ss";
            }
            var formatMap ={};
            var year = date.getFullYear();//yyyy
            var month = date.getMonth();
            var day = date.getDate();
            var hour = date.getHours();
            var minutes = date.getMinutes();
            var seconds = date.getSeconds();
            var misec = date.getMilliseconds();
            var week = date.getDay();
            formatMap.yyyy = String(year);
            formatMap.yy =  formatMap.yyyy.substring(2);
            formatMap.y =  formatMap.yy;
            if( formatMap.y<10){
                formatMap.y = String( formatMap.y*1);
            }
            formatMap.MMMM = ui.lang.MMMMS[month];
            formatMap.MMM = ui.lang.MMMS[month];
            formatMap.M = String(month+1);
            formatMap.MM =  formatMap.M;
            if( formatMap.MM < 10){
                formatMap.MM = "0"+ formatMap.MM;
            }
            formatMap.dddd = ui.lang.dddds[week];
            formatMap.ddd = ui.lang.ddds[week];
            formatMap.d = String(day);
            formatMap.dd =  formatMap.d;
            if( formatMap.dd < 10){
                formatMap.dd = "0"+ formatMap.dd;
            }
            formatMap.H = String(hour);
            formatMap.HH =  formatMap.H;
            if( formatMap.HH < 10){
                formatMap.HH = "0"+ formatMap.HH;
            }
            formatMap.H = String(hour);
            formatMap.HH =  formatMap.H;
            if( formatMap.HH < 10){
                formatMap.HH = "0"+ formatMap.HH;
            }
            formatMap.m = String(minutes);
            formatMap.mm =  formatMap.m;
            if( formatMap.mm < 10){
                formatMap.mm = "0"+ formatMap.mm;
            }
            formatMap.s = String(seconds);
            formatMap.ss = formatMap.s;
            if(formatMap.ss < 10){
                formatMap.ss = "0"+formatMap.ss;
            }
            formatMap.S = String(misec);
            formatMap.SSS = formatMap.S;
            if(formatMap.SSS < 100){
                formatMap.SSS = "0"+formatMap.SSS;
            }
            if(formatMap.SSS < 10){
                formatMap.SSS = "0"+formatMap.SSS;
            }
            formatMap.aa = "AM";
            formatMap.h = String(hour);
            if(hour>=12){
                formatMap.aa = "PM";
                formatMap.h = String(hour-12);
            }
            formatMap.hh =  formatMap.h;
            if( formatMap.hh < 10){
                formatMap.hh = "0"+ formatMap.hh;
            }
            var arrs = ["yyyy","yy","y","MMMM","MMM","MM","M","dddd","ddd","dd","d","HH","H","hh","h","mm","m","ss","s","SSS","S","aa"];
            var tempFormat = format+"";
            function toZero(str){
                var temp = "";
                var length = str.length;
                for(var i=0;i<length;i++){
                    temp +="0";
                }
                return temp;
            }
            for(var i=0;i<arrs.length;i++){
                var arr = arrs[i];
                var c;
                while((c = format.indexOf(arr)) !=-1){
                    format = format.substring(0,c)+toZero(formatMap[arr])+format.substring(c+arr.length);
                    tempFormat = tempFormat.substring(0,c)+formatMap[arr]+tempFormat.substring(c+arr.length);
                }
            }
            return tempFormat;
        },
        parseDate:function(str,format){
            if(!str){
                return null;
            }
            if(str instanceof Date){
                return str;
            }
            /*format 为yyyy MM dd HH hh mm ss SSS aa的随意组合*/
            if(format){
                if(str.length != format.length){
                    return null;
                }
                var date = new Date();
                date.setFullYear(1900);
                date.setMonth(0);
                date.setDate(1);
                date.setHours(0);
                date.setMinutes(0);
                date.setSeconds(0);
                date.setMilliseconds(0);
                var formatMaps = [{id:"yyyy",name:"FullYear"},{id:"MM",name:"Month"},{id:"dd",name:"Date"},{id:"HH",name:"Hours"},{id:"hh",name:"Hours"},{id:"mm",name:"Minutes"},{id:"ss",name:"Seconds"},{id:"SSS",name:"Milliseconds"}];
                var flag = true;
                var c;
                var hourPlus=0;
                if((c = format.indexOf("aa")) != -1 && str.substring(c,c+2).toLowerCase() == "pm"){
                    hourPlus = 12;
                }
                for(var i=0;i<formatMaps.length;i++){
                    var formatMap = formatMaps[i];
                    if((c = format.indexOf(formatMap.id)) == -1){
                        continue;
                    }
                    var val = str.substring(c,c+formatMap.id.length);
                    if(!val || isNaN(val)){
                        flag = false;
                        break;
                    }
                    val = val*1;
                    if(formatMap.id == "MM"){
                        val = val -1;
                    }else if(formatMap.id == "hh"){
                        val = val + hourPlus;
                    }
                    eval("date.set"+formatMap.name+"("+val+")");
                }
                if(flag){
                    return date;
                }
            }else{
                var formats = ["yyyy-MM-dd HH:mm:ss.SSS","yyyy-MM-dd HH:mm:ss","yyyy-MM-dd HH:mm","yyyy-MM-dd","MM-dd-yyyy"];
                for(var i=0;i<formats.length;i++){
                    var tempDate = this.parseDate(str,formats[i]);
                    if(tempDate){
                        return tempDate;
                    }
                }
            }
            var tempDate = new Date(str);
            if(!isNaN(tempDate)){
                return tempDate;
            }
            return null;
        }, firstToUpperCase:function(str){
            if(!str){
                return str;
            }
            str = str+"";
            str = str.substring(0,1).toUpperCase()+str.substring(1);
            return str;
        },
        regModule:function(options){
            if(!options.useClass){
                return;
            }
            options.useClass = options.useClass.toLowerCase().trim();
            var moduleMap = ui.moduleMap;
            if(!moduleMap){
                moduleMap = {};
            }
            if(moduleMap[options.useClass]){
                return;
            }
            if(!options.thisClass){
                return;
            }
            var m = options.clazz;
            m.prototype.useClass = options.useClass;
            for(var key in options.thisClass){
                m.prototype[key] = options.thisClass[key];
            }
            m.prototype.fieldMap = {};
            for(var i=0;i<options.fields.length;i++){
                m.prototype.fieldMap[options.fields[i]] = 1;
            }
            m.prototype.eventMap = {};
            for(var i=0;i<options.events.length;i++){
                m.prototype.eventMap[options.events[i]] = 1;
            }
            if(options.parentClass){
                var parentThat = new options.parentClass();
                for(var key in parentThat){
                    if(m.prototype[key]){
                        continue;
                    }
                    m.prototype[key] = parentThat[key];
                }
                var fieldMap = parentThat.fieldMap;
                for(var field in fieldMap){
                    if(m.prototype.fieldMap[field]){
                        continue;
                    }
                    m.prototype.fieldMap[field] = 1;
                }
                var eventMap = parentThat.eventMap;
                for(var event in eventMap){
                    if(m.prototype.eventMap[event]){
                        continue;
                    }
                    m.prototype.eventMap[event] = 1;
                }
                m.prototype.initHtml = function(){
                    parentThat.initHtml();
                    this.init();
                }
            }else{
                m.prototype.initHtml = options.init;
            }
            moduleMap[options.useClass] = m;
            ui.moduleMap = moduleMap;
        },
        parse:function(element){
            var that  = this;
            var parentEle = jQuery("body");
            if(element){
                parentEle = jQuery(element);
            }
            if(parentEle.length == 0){
                return;
            }
            if(element){
                /*父级也可能是组件*/
                for(var clazz in ui.moduleMap){
                    if(parentEle.hasClass(clazz)){
                        parseSimpleData(parentEle[0],ui.moduleMap[clazz]);
                    }
                }
            }
            for(var clazz in ui.moduleMap){
                var module = ui.moduleMap[clazz];
                var list = jQuery(parentEle).find("."+clazz);
                if(list == null || list.length == 0){
                    continue;
                }
                for(var i=0;i<list.length;i++){
                    var ele = list[i];
                    parseSimpleData(ele,module);
                }
            }
            function parseSimpleData(ele,module){
                if(ele.getAttribute("uikey")){
                    return;
                }
                if(ui.lastKeyId == null){
                    ui.lastKeyId = 1;
                }
                var keyId = ui.lastKeyId++;
                var moduleObj = new module();
                moduleObj.uikey = ui.prefix+"-"+keyId;
                if(!ui.allSimple){
                    ui.allSimple = {};
                }
                moduleObj.el = ele;
                ui.allSimple[moduleObj.uikey] = moduleObj;
                moduleObj.initHtml();
                //设置属性
                var fieldMap = moduleObj.fieldMap;
                for(var field in fieldMap){
                    var value = jQuery(ele).attr(field);
                    if(!value){
                        continue;
                    }
                    try{
                        value = eval(value);
                    }catch (e) {

                    }
                    var setFunctionName = "set"+that.firstToUpperCase(field);
                    if(moduleObj[setFunctionName]){
                        eval("moduleObj."+setFunctionName+"(value)");
                    }else{
                        moduleObj[field] = value;
                    }
                }
                jQuery(moduleObj.el).attr("uikey",moduleObj.uikey);
                //绑定事件
                var eventMap = moduleObj.eventMap;
                for(var event in eventMap){
                    var value = jQuery(ele).attr("el"+event);
                    if(!value){
                        continue;
                    }
                    value = value.trim();
                    if(win[value]){
                        moduleObj.on(event,win[value]);
                    }else if(value.startsWith("function")){
                        if(ui.lastEventId == null){
                            ui.lastEventId = 1;
                        }
                        var eventName = ui.prefix+"_event_"+(ui.lastEventId++);
                        eval("win."+eventName+"="+value);
                        moduleObj.on(event,eval(eventName));
                    }else if(value.indexOf("(")!=-1 && value.indexOf(")")!=-1){
                        var z = value.indexOf("(");
                        var m = value.indexOf(":");
                        var method;
                        if(m != -1 && m<z){
                            method = value.substring(m+1,z);
                        }else{
                            method = value.substring(0,z);
                        }
                        if(method && win[method]){
                            moduleObj.on(event,win[method]);
                        }
                    }
                }
            }
        },
        parseString:function(val){
            if(typeof val == "string"){
                try{
                   var temp = eval(val);
                   if(typeof temp =="string"){
                       return temp.trim();
                   }
                }catch (e) {}
                return val.trim();
            }else if(val == null){
                return "";
            }else if(typeof val == "function"){
                return String(val);
            }else{
                return this.encode(val);
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
                try{
                    val = eval(val);
                }catch (e) {}
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
                if(!isNaN(val)){
                    return val*1;
                }else{
                    try{
                        val = eval(val);
                    }catch (e) {}
                    if(!isNaN(val)){
                        return val*1;
                    }
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
            return this.decode(val);
        },
        validate:function(val,vtype,error){
            var map = {
                "email":"^[\\w!#$%&'*+/=?^_`{|}~-]+(?:\\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\\w](?:[\\w-]*[\\w])?\\.)+[\\w](?:[\\w-]*[\\w])?$",
                "url":"^[a-zA-z]+://[^\\s]*$",
                "int":"^-?[1-9]\\d*$",
                "float":"^-?[1-9]\\d*\\.\\d*|-0\\.\\d*[1-9]\\d*$",
                "chinese":"^[\\u4e00-\\u9fa5]*$",
                "pocode":"^[1-9]\\d{5}(?!\\d)$",
                "idcard":"^(\\d{6})(\\d{4})(\\d{2})(\\d{2})(\\d{3})([0-9]|X)$",
                "phone":"^[1]{1}[3|4|5|6|7|8|9]{1}\\d{9}$",
                "english":"^[\\w| |,|.|?|\"|'|:]+$",
            };
            var mapMsg = {
                "email":"请输入正确的邮箱",
                "url":"请输入正确的网址",
                "int":"请输入整数",
                "float":"请输入小数",
                "chinese":"请输入中文",
                "pocode":"请输入正确的邮编",
                "idcard":"请输入正确的身份证号",
                "phone":"请输入正确的手机号",
                "english":"请输入英文"
            };
            var result = {flag:true};
            if(val == null){
                result.flag = false;
            }
            val = (val+"").trim();
            if(val == ""){
                result.flag = false;
            }
            if(!result.flag){
                result.msg = "不能为空";
                return result;
            }
            if(!this.specialList){
                this.specialList = [];
                var spList = ["^maxLength:[1-9]\\d*$","^minLength:[1-9]\\d*$","^rangeLength:[1-9]\\d*,[1-9]\\d*$","^rangeChar:[1-9]\\d*,[1-9]\\d*$","^range:[1-9]\\d*,[1-9]\\d*$"];
                var spMs = ["maxLength","minLength","rangeLength","rangeChar","range"];
                var spListMasg = ["不能超过$1个字符串","不能少于$1个字符串","字符串长度必须在$1到$2之间","字符个数必须在$1到$2之间","数值范围必须在$1到$2之间"];
                for(var i=0;i<spList.length;i++){
                    this.specialList[this.specialList.length]={reg:new RegExp(spList[i]),msg:spListMasg[i],m:spMs[i]}
                }
            }
            for(var i=0;i<this.specialList.length;i++){
                var spMap = this.specialList[i];
                if(!spMap.reg.test(vtype)){
                    continue;
                }
                var spError = "";
                if(spMap.m == "maxLength"){
                    var l = vtype.replace("maxLength:","")*1;
                    spError = spMap.msg.replace("$1",l);
                    result.flag = val.length<=l;
                }else if(spMap.m == "minLength"){
                    var l = vtype.replace("minLength:","")*1;
                    spError = spMap.msg.replace("$1",l);
                    result.flag = val.length>=l;
                }else if(spMap.m == "rangeLength"){
                    var ls = vtype.replace("rangeLength:","").split(",");
                    spError = spMap.msg.replace("$1",ls[0]).replace("$2",ls[1]);
                    result.flag = val.length>=ls[0] && val.length<=ls[1];
                }else if(spMap.m == "rangeChar"){
                    var ls = vtype.replace("rangeChar:","").split(",");
                    spError = spMap.msg.replace("$1",ls[0]).replace("$2",ls[1]);
                    var count = 0;
                    for(var n=0;n<val.length;n++){
                        var index = val.charCodeAt(n);
                        count += index>128?2:1;
                    }
                    result.flag = count>=ls[0] && count<=ls[1];
                }else if(spMap.m == "range"){
                    var ls = vtype.replace("range:","").split(",");
                    spError = spMap.msg.replace("$1",ls[0]).replace("$2",ls[1]);
                    if(isNaN(val)){
                        spError = "不是数字";
                        result.flag = false;
                    }else{
                        result.flag = val>=ls[0] && val<=ls[1];
                    }
                }
                if(!result.flag){
                    if(error){
                        result.msg = error;
                    }else{
                        result.msg = spError;
                    }
                }
                return result;
            }
            var needReg = map[vtype];
            var needMsg = mapMsg[vtype];
            if(!needReg){
                needReg = vtype;
            }
            if(error){
                needMsg = error;
            }
            if(!needReg || !needMsg){
                result.msg = "未找到正则表达式或错误信息";
                return result;
            }
            try{
                var flag = new RegExp(needReg).test(val);
                result.flag = flag;
                if(!flag){
                    result.msg = needMsg;
                }
            }catch (e) {
                result.flag = false;
                result.msg = "正则表达式不合法";
            }
            return result;
        },
        getByUid:function(uid){
            if(!uid){
                return null;
            }
            return ui.allSimple[uid];
        },
        getBySelect:function(ele){
            var l = jQuery(ele);
            if(l.length == 0){
                return null;
            }
            l = jQuery(l[0]);
            return this.getByUid(l.attr("uikey"));
        },
        getsBySelect:function(eles){
            var l = jQuery(eles);
            if(l.length == 0){
                return [];
            }
            var list = [];
            for(var i=0;i<l.length;i++){
                var one = this.getByUid(jQuery(l[i]).attr("uikey"));
                if(one == null){
                    continue;
                }
                list[list.length] = one;
            }
            return list;
        },
        hideAllPopup:function(){
            if(!this.closePopupMap){
                this.closePopupMap = {};
            }
            var fMap = this.closePopupMap;
            for(var key in fMap){
                try{
                    fMap[key]();
                }catch (e) {
                    delete fMap[key];
                }
            }
        },
        pushHidePopup:function(key,callBack){
            if(!this.closePopupMap){
                this.closePopupMap = {};
            }
            this.closePopupMap[key] = callBack;
        },
        guid:function(){
            function S4() {
                return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            }
            return S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4();
        },
        list2tree:function(list,idField,parentField){
            function addToList(one,list,idField,parentField){
                for(var i=0;i<list.length;i++){
                    var temp = list[i];
                    if(!one[parentField]){
                        /*说明是顶级,不处理*/
                        continue;
                    }
                    if(one[idField] == temp[idField]){
                        /*是当前自己,不处理*/
                        continue;
                    }
                    if(one[parentField] == temp[idField]){
                        /*说明one是temp的子集*/
                        if(!temp.children || !(temp.children instanceof Array)){
                            temp.children = [];
                        }
                        temp.children[temp.children.length] = one;
                        return true;
                    }else if(temp.children && (temp.children instanceof Array)){
                        var flag = addToList(one,temp.children,idField,parentField);
                        if(flag){
                            return flag;
                        }
                    }
                }
                return false;
            }
            var removeList = [];
           for(var i=0;i<list.length;i++){
               var flag = addToList(list[i],list,idField,parentField);
               removeList[i] = flag;
           }
           var dataTree = [];
            for(var i=0;i<list.length;i++){
                if(!removeList[i]){
                    dataTree[dataTree.length] = list[i];
                }
            }
            return dataTree;
        }
    };
    for(var key in tools){
        ui[key] = tools[key];
    }
    /*提供基础组件*/
    var baseModule = {
        init:function(){
        },
        fire:function(type,data){
            if(!this.allBindEventMap || !this.allBindEventMap[type]){
                return;
            }
            if(!this.allBindEventMap[type]){
                return;
            }
            var e = {base:this,type:type};
            if(data){
                e.data = data;
            }
            this.allBindEventMap[type](e);
        },
        getEl:function(){
            return this.el;
        },
        on:function(type,callback){
            if(!this.eventMap || !this.eventMap[type]){
                return;
            }
            if(!this.allBindEventMap){
                this.allBindEventMap = {};
            }
            this.allBindEventMap[type] = callback;
        },
        un:function(type){
            if(!this.allBindEventMap){
                return;
            }
            delete this.allBindEventMap[type];
        },
        set:function(opt){
            if(!opt){
                return;
            }
            var that = this;
            for(var key in opt){
                var value = opt[key];
                var setFunctionName = "set"+ui.firstToUpperCase(key);
                if(that[setFunctionName]){
                    eval("that."+setFunctionName+"(value)");
                }else{
                    that[key] = value;
                }
            }
        },
        destroy:function(){
            jQuery(this.el).remove();
            this.fire("destroy");
            delete ui.allSimple[this.uikey];
        },
        show:function(){
            this.setVisible(true);
        },
        hide:function(){
            this.setVisible(false);
        },
        enable:function(){
            this.setEnabled(true);
        },
        disable:function(){
            this.setEnabled(false);
        },
        doLayout:function(){

        },
        addCls:function(value){
            value =ui.parseString(value);
            if(value == this.useClass){
                return;
            }
            jQuery(this.el).addClass(value);
        },
        removeCls:function(value){
            value = ui.parseString(value);
            if(value == this.useClass){
                return;
            }
            jQuery(this.el).removeClass(value);
        },
        mask:function(){
            if(this._ismask){
               return;
            }
            this._ismask = true;
            jQuery(this.el).append("<div class='simple-mask'><div class='simple-mask-loading'></div></div>");
            var loading = jQuery(this.el).find(".simple-mask .simple-mask-loading");
            var top = parseInt((this.getHeight()-loading.height())/2);
            var left = parseInt((this.getWidth()-loading.width())/2);
            loading.css({top:top+"px",left:left+"px"});
        },
        unmask:function(){
            this._ismask = false;
            jQuery(this.el).find(".simple-mask").remove();
        },
        getId:function(){
            return this.id;
        },
        setId:function(value){
            value = ui.parseString(value);
            if(!value){
                value = null;
                jQuery(this.el).removeAttr("id");
            }else{
                jQuery(this.el).attr("id",value);
            }
            this.id = value;
        },
        getName:function(){
            return this.name;
        },
        setName:function(value){
            value = ui.parseString(value);
            if(!value){
                value = null;
                jQuery(this.el).removeAttr("name");
            }else{
                jQuery(this.el).attr("name",value);
            }
            this.name = value;
        },
        getVisible:function(){
            if(typeof this.visible != "boolean"){
                this.setVisible(true);
            }
            return this.visible;
        },
        setVisible:function(value){
            this.visible = ui.parseBoolean(value);
            if(this.visible){
                jQuery(this.el).show();
            }else{
                jQuery(this.el).hide();
            }
        },
        getEnabled:function(){
            if(typeof this.enabled != "boolean"){
                this.setEnabled(true);
            }
            return this.enabled;
        },
        setEnabled:function(value){
            this.enabled = ui.parseBoolean(value);
            function toDisabled(el,val){
                el.disabled = val;
                if(el.children && el.children.length>0){
                    for(var i=0;i<el.children.length;i++){
                        var temp = el.children[i];
                        toDisabled(temp,val);
                    }
                }
            }
            toDisabled(this.el,!this.enabled);
        },
        getCls:function(){
            if(!this.cls){
                this.cls = jQuery(this.el).attr("class").replace(this.useClass,"").trim();
            }
            return this.cls;
        },
        setCls:function(value){
            value = ui.parseString(value);
            if(!value){
                value = "";
            }
            value = value.replace(this.useClass,"").trim();
            this.cls = value;
            jQuery(this.el).attr("class",this.useClass+" "+value);
        },
        getStyle:function(){
            if(!this.style){
                this.style = jQuery(this.el).attr("style");
            }
            return this.style;
        },
        setStyle:function(value){
            value = ui.parseString(value);
            if(!value){
                jQuery(this.el).attr("style","");
                return;
            }
            var csss = value.split(";");
            var styleMap = {};
            for (var i=0;i<csss.length;i++){
                var css = csss[i];
                var cssMap = css.split(":");
                if(cssMap.length != 2){
                    continue;
                }
                var key = cssMap[0].trim();
                var val = cssMap[1].trim();
                if(key && val){
                    styleMap[key] = val;
                }
            }
            jQuery(this.el).css(styleMap);
            this.style = jQuery(this.el).attr("style");
        },
        getWidth:function(){
            if(!this.width){
                this.width = jQuery(this.el).width();
            }
            return this.width;
        },
        setWidth:function(value){
            if(value){
                if(!isNaN(value)){
                    value = value+"px";
                }
                jQuery(this.el).width(value);
            }
            this.width = jQuery(this.el).width();
        },
        getHeight:function(){
            if(!this.height){
                this.height = jQuery(this.el).height();
            }
            return this.height;
        },
        setHeight:function(value){
            if(value){
                if(!isNaN(value)){
                    value = value+"px";
                }
                jQuery(this.el).height(value);
            }
            this.height = jQuery(this.el).height();
        },
        getTitle:function(){
            return this.title;
        },
        setTitle:function(value){
            value = ui.parseString(value);
            if(!value){
                value = null;
                jQuery(this.el).removeAttr("title");
            }else{
                jQuery(this.el).attr("title",value);
            }
            this.title = value;
        }
    }
    /*注册基础组件*/
    ui.BaseModule=function(){};
    ui.regModule({
        clazz:ui.BaseModule,
        useClass:ui.prefix+"-base",
        fields:["id","name","visible","enabled","cls","style","width","height","title"],
        events:["destroy"],
        parentClass:null,
        thisClass:baseModule,
        init:baseModule.init
    });
    if(ui.env == "pc"){
        /*加载PC必备组件tools和nav*/
        document.write('<script src="' + ui.jsPath + '/modules/tools.js" type="text/javascript"></sc' + 'ript>');
        document.write('<link href="' + ui.jsPath + '/skin/'+ui.skin+'/tools.css" rel="stylesheet" type="text/css" />');
        document.write('<script src="' + ui.jsPath + '/modules/nav.js" type="text/javascript"></sc' + 'ript>');
        document.write('<link href="' + ui.jsPath + '/skin/'+ui.skin+'/nav.css" rel="stylesheet" type="text/css" />');
        document.write('<link href="' + ui.jsPath + '/skin/'+ui.skin+'/base.css" rel="stylesheet" type="text/css" />');
    }else if(ui.env == "m"){
        /*加载手机必备组件mobile*/
        document.write('<script src="' + ui.jsPath + '/modules/mobile.js" type="text/javascript"></sc' + 'ript>');
        document.write('<link href="' + ui.jsPath + '/skin/'+ui.skin+'/mobile.css" rel="stylesheet" type="text/css" />');
    }
    jQuery(function(){
        jQuery("body").click(function(){
            ui.hideAllPopup();
        });
    });
})(window);