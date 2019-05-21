(function(win){
    /*兼容IE5不支持的属性*/
    /*重写string的trim方法*/
    if(typeof String.prototype.trim !== 'function') {
        String.prototype.trim = function() {
            return this.replace(/^\s+|\s+$/g, '');
        }
        String.prototype.startsWith = function(str) {
            return this.indexOf(str) == 0;
        }
    }
    /*重写getElementsByClassName*/
    if(!win.document.getElementsByClassName){
        win.document.getElementsByClassName = function(cName){
            var arr = [];
            var allElements = document.getElementsByTagName('*');
            for (var i = 0; i < allElements.length; i++) {
                var allCNames = allElements[i].className.split(' ');
                for (var j = 0; j < allCNames.length; j++) {
                    if (allCNames[j] == cName) {
                        arr.push(allElements[i]);
                        break;
                    }
                }
            }
            return arr;
        }
    }
    var simplePlus = {
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
                    return '"' + (jsonObj.toJSON ? jsonObj.toJSON() : jsonObj.toString()) + '"';
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
            var MMMMS = ["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"];
            var MMMS = ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];
            var dddds = ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];
            var ddds = ["日","一","二","三","四","五","六"];
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
            formatMap.MMMM = MMMMS[month];
            formatMap.MMM = MMMS[month];
            formatMap.M = String(month+1);
            formatMap.MM =  formatMap.M;
            if( formatMap.MM < 10){
                formatMap.MM = "0"+ formatMap.MM;
            }
            formatMap.dddd = dddds[week];
            formatMap.ddd = ddds[week];
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
            for(var i=0;i<arrs.length;i++){
                var arr = arrs[i];
                var c;
                while((c = format.indexOf(arr)) !=-1){
                    format = format.substring(0,c)+formatMap[arr]+format.substring(c+arr.length);
                }
            }
            return format;
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
            var moduleMap = win.simple.moduleMap;
            if(!moduleMap){
                moduleMap = {};
            }
            if(moduleMap[options.useClass]){
                return;
            }
            if(!options.thisClass){
                return;
            }
            var thisClass = {};
            if(options.parentClass){
                var obj = new options.parentClass();
                for(var key in obj){
                    thisClass[key] = obj[key];
                }
            }
            //子类覆盖父类的方法和属性
            for(var key in options.thisClass){
                thisClass[key] = options.thisClass[key];
            }
            var fieldMap  = thisClass.fieldMap;
            if(!fieldMap){
                fieldMap = {};
            }
            if(options.fields && options.fields.length > 0){
                for(var i=0;i<options.fields.length;i++){
                    fieldMap[options.fields[i]] = 1;
                }
            }
            thisClass.fieldMap = fieldMap;
            var eventMap  = thisClass.eventMap;
            if(!eventMap){
                eventMap = {};
            }
            if(options.events && options.events.length > 0){
                for(var i=0;i<options.events.length;i++){
                    eventMap[options.events[i]] = 1;
                }
            }
            thisClass.eventMap = eventMap;
            var parentInit = thisClass.initHtml;
            thisClass.initHtml = function(){
                if(parentInit){
                    parentInit();
                }
                options.init();
            }
            win.simple[options.className] = function(){
                for(var key in thisClass){
                    this[key] = thisClass[key];
                }
                this.useClass = options.useClass;
                return this;
            }
            moduleMap[options.useClass] = win.simple[options.className];
            win.simple.moduleMap = moduleMap;
        },
        parse:function(element){
            var that  = this;
            for(var key in win.simple.moduleMap){
                var module = win.simple.moduleMap[key];
                var list = document.getElementsByClassName(key);
                if(list.length == 0){
                    continue;
                }
                for(var i=0;i<list.length;i++){
                    var ele = list[i];
                    if(ele.getAttribute("simplekey")){
                        continue;
                    }
                    if(win.simple.lastKeyId == null){
                        win.simple.lastKeyId = 1;
                    }
                    var keyId = win.simple.lastKeyId++;
                    var moduleObj = new module();
                    moduleObj.simplekey = "simple-"+keyId;
                    if(!win.simple.allSimple){
                        win.simple.allSimple = {};
                    }
                    moduleObj.el = ele;
                    win.simple.allSimple[moduleObj.simplekey] = moduleObj;
                    moduleObj.initHtml();
                    //获取默认的display
                    moduleObj._defaultDisplay = win.simple.getCss(moduleObj.el,"display");
                    //设置属性
                    var fieldMap = moduleObj.fieldMap;
                    for(var key in fieldMap){
                        var value = ele[key];
                        if(!value){
                            value = moduleObj.el.getAttribute(key);
                        }
                        if(!value){
                            continue;
                        }
                        if(key == "style"){
                            value = value.cssText;
                        }
                        var setFunctionName = "set"+that.firstToUpperCase(key);
                        if(moduleObj[setFunctionName]){
                            eval("moduleObj."+setFunctionName+"(value)");
                        }else{
                            moduleObj[key] = value;
                        }
                    }
                    moduleObj.el.simplekey = moduleObj.simplekey;
                    //绑定事件
                    var eventMap = moduleObj.eventMap;
                    for(var key in eventMap){
                        var value = ele["on"+key];
                        if(!value){
                            value = moduleObj.el.getAttribute("on"+key);
                        }
                        if(!value){
                            continue;
                        }
                        if(win[value]){
                            moduleObj.on(key,win[value]);
                        }else{
                            if(value.trim().startsWith("function")){
                                if(win.simple.lastEventId == null){
                                    win.simple.lastEventId = 1;
                                }
                                var eventName = "win.simple_event_"+(win.simple.lastEventId++);
                                eval(eventName+"="+value);
                                moduleObj.on(key,eval(eventName));
                            }else{
                                moduleObj.on(key,Function(value));
                            }
                        }

                    }
                }
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
            }
            return true;
        },
        setCss:function(el,csskey,cssval){
            el.style[csskey]=cssval;
        },
        getCss:function(el,csskey){
            return el.style[csskey];
        },
        css:function(el,options,value){
            //1.value 不存在 options 存在  获取,设置
            //4.value 存在 options 存在 设置
            if(!options){
                return;
            }
            if(typeof options == "string"){
                if(value){
                    this.setCss(el,options,value);
                }else{
                    return this.getCss(el,options);
                }
            }else if(typeof options == "object"){
                for(var key in options){
                    this.setCss(el,key,options[key]);
                }
            }else{
                return;
            }
        },
        getByUid:function(uid){
            return win.simple.allSimple[uid];
        }
    };
    for(var key in simplePlus){
        win.simple[key] = simplePlus[key];
    }
    var baseModule = {
        init:function(){
            console.log("初始化了base");
        },
        fire:function(type,data){
            if(!this.allBindEventMap || !this.allBindEventMap[type]){
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
                var setFunctionName = "set"+simple.firstToUpperCase(key);
                if(that[setFunctionName]){
                    eval("that."+setFunctionName+"(value)");
                }else{
                    that[key] = value;
                }
            }
        },
        destroy:function(){
            this.el.parentNode.removeChild(this.el);
            this.fire("destroy");
            delete win.simple.allSimple[this.simplekey];
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
            value = value.trim();
            if(value == this.useClass){
                return;
            }
            var clazz = " "+this.el.className+" ";
            if(clazz.indexOf(" "+value+" ") != -1){
                return;
            }
            clazz = clazz.trim()+" "+value;
            this.el.className = clazz;
        },
        removeCls:function(value){
            value = value.trim();
            if(value == this.useClass){
                return;
            }
            var clazz = this.el.className.trim();
            clazz = clazz.replace(value,"").trim();
            this.el.className = clazz;
        },
        mask:function(option){

        },
        unmask:function(){

        },
        getId:function(){
            return this.id;
        },
        setId:function(value){
            if(!value){
                this.el.removeAttribute("id");
                delete this.id;
                return;
            }
            this.el.id = value;
            this.id = this.el.id;
        },
        getName:function(){
            return this.name;
        },
        setName:function(value){
            if(!value){
                this.el.removeAttribute("name");
                delete this.name;
                return;
            }
            this.el.name = value;
            this.name = this.el.name;
        },
        getVisible:function(){
            if(typeof this.visible != "boolean"){
                this.setVisible(true);
            }
            return this.visible;
        },
        setVisible:function(value){
            this.visible = simple.parseBoolean(value);
            this.removeCls("show");
            this.removeCls("hidden");
            if(this.visible){
                this.addCls("show");
            }else{
                this.addCls("hidden");
            }
        },
        getEnabled:function(){
            if(typeof this.enabled != "boolean"){
                this.setEnabled(true);
            }
            return this.enabled;
        },
        setEnabled:function(value){
            this.enabled = simple.parseBoolean(value);
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
                this.cls = this.el.className.replace(this.useClass,"").trim();
            }
            return this.cls;
        },
        setCls:function(value){
            if(!value){
                value = "";
            }
            value = value.trim().replace(this.useClass,"").trim();
            this.cls = value;
            this.el.className = this.useClass+" "+value;
        },
        getStyle:function(){
            if(!this.style){
                this.style = this.el.style.cssText;
            }
            return this.style;
        },
        setStyle:function(value){
            if(!value){
                this.el.style.cssText = "";
                return;
            }
            var csss = value.split(";");
            var styleNew = "";
            for (var i=0;i<csss.length;i++){
                var css = csss[i];
                var cssMap = css.split(":");
                if(cssMap.length != 2){
                    continue;
                }
                var key = cssMap[0].trim();
                var val = cssMap[1].trim();
                if(key && val){
                    styleNew += key+":"+val+";";
                }
            }
            this.el.style.cssText = styleNew;
            this.style = this.el.style.cssText;
        },
        getWidth:function(){
            if(!this.width){
                this.width = this.el.offsetWidth;
            }
            return this.width;
        },
        setWidth:function(value){
            console.log(value);
            if(value){
                if(!isNaN(value)){
                    value = value+"px";
                }
                simple.css(this.el,{width:value});
            }
            this.width = this.el.offsetWidth;
        },
        getHeight:function(){
            if(!this.height){
                this.height = this.el.offsetHeight;
            }
            return this.height;
        },
        setHeight:function(value){
            console.log(value);
            if(value){
                if(!isNaN(value)){
                    value = value+"px";
                }
                simple.css(this.el,{height:value});
            }
            this.height = this.el.offsetHeight;
        },
        getTitle:function(){
            return this.title;
        },
        setTitle:function(value){
            if(!value){
                this.el.removeAttribute("title");
                delete this.title;
                return;
            }
            this.el.title = value;
            this.title = this.el.title;
        }
    }
    simple.regModule({
        className:"BaseModule",
        useClass:"simple-base",
        fields:["id","name","visible","enabled","cls","style","width","height","title"],
        events:["destroy"],
        parentClass:null,
        thisClass:baseModule,
        init:baseModule.init
    });
    var textBox = {
        init:function(){
            console.log("初始化了textBox");
        },
        getFormValue:function(){

        }
    }
    simple.regModule({
        className:"TextBox",
        useClass:"simple-textbox",
        fields:["value"],
        events:["enter"],
        parentClass:simple.BaseModule,
        thisClass:textBox,
        init:textBox.init
    });
    var combobox = {
        init:function(){
            console.log("初始化了combobox");
        },
        getFormValue:function(){

        }
    }
    simple.regModule({
        className:"ComboBox",
        useClass:"simple-combobox",
        fields:["value"],
        events:["enter"],
        parentClass:simple.TextBox,
        thisClass:combobox,
        init:combobox.init
    });
})(window);