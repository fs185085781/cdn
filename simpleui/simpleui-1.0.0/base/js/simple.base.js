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
            thisClass.initHtml = function(that){
                if(parentInit){
                    parentInit(that);
                }
                options.init(that);
            }
            win.simple[options.className] = function(){

                for(var key in thisClass){
                    this[key] = thisClass[key];
                }
                this.useClass = options.useClass;
                return this;
            }
            win.simple[options.className]["fieldMap"] =  thisClass.fieldMap;
            win.simple[options.className]["eventMap"] =  thisClass.eventMap;
            moduleMap[options.useClass] = win.simple[options.className];
            win.simple.moduleMap = moduleMap;
        },
        parse:function(element){
            var that  = this;
            for(var clazz in win.simple.moduleMap){
                var module = win.simple.moduleMap[clazz];
                var list;
                if(element){
                    list = iBase(element).find("."+clazz);
                }else{
                    list = iBase("."+clazz);
                }
                if(list == null || list.length == 0){
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
                    moduleObj.initHtml(moduleObj);
                    //设置属性
                    var fieldMap = moduleObj.fieldMap;
                    for(var field in fieldMap){
                        var value = iBase(ele).attr(field);
                        if(!value){
                            continue;
                        }
                        var setFunctionName = "set"+that.firstToUpperCase(field);
                        if(moduleObj[setFunctionName]){
                            eval("moduleObj."+setFunctionName+"(value)");
                        }else{
                            moduleObj[field] = value;
                        }
                    }
                    iBase(moduleObj.el).attr("simplekey",moduleObj.simplekey);
                    //绑定事件
                    var eventMap = moduleObj.eventMap;
                    for(var event in eventMap){
                        //vue绑定事件
                        if(simple.mode == "vue"){
                            if(simple.vueEventMap && simple.vueEventMap[clazz] && simple.vueEventMap[clazz][event] && simple.vueEventMap[clazz][event]["event"]){
                                var callback = simple.vueEventMap[clazz][event]["event"];
                                moduleObj.on(event,callback);
                                continue;
                            }
                        }
                        var value = iBase(ele).attr("on"+event);
                        if(!value){
                            continue;
                        }
                        if(win[value]){
                            moduleObj.on(event,win[value]);
                        }else{
                            if(value.trim().startsWith("function")){
                                if(win.simple.lastEventId == null){
                                    win.simple.lastEventId = 1;
                                }
                                var eventName = "simple_event_"+(win.simple.lastEventId++);
                                eval("win."+eventName+"="+value);
                                moduleObj.on(event,eval(eventName));
                            }else{
                                moduleObj.on(event,Function(value));
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
        getByUid:function(uid){
            if(!uid){
                return null;
            }
            return win.simple.allSimple[uid];
        },
        getBySelect:function(ele){
            var l = iBase(ele);
            if(l.length == 0){
                return null;
            }
            l = iBase(l[0]);
            return this.getByUid(l.attr("simplekey"));
        },
        guid:function(){
            function S4() {
                return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            }
            return S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4();
        }
    };
    for(var key in simplePlus){
        win.simple[key] = simplePlus[key];
    }
    var baseModule = {
        init:function(that){
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
            iBase(this.el).remove();
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
            iBase(this.el).addClass(value);
        },
        removeCls:function(value){
            value = value.trim();
            if(value == this.useClass){
                return;
            }
            iBase(this.el).removeClass(value);
        },
        mask:function(option){
            if(this._ismask){
               return;
            }
            this._ismask = true;
            iBase(this.el).append("<div class='simple-mask'><div class='simple-mask-loading'></div></div>");
            var loading = iBase(this.el).find(".simple-mask .simple-mask-loading");
            var top = parseInt((this.getHeight()-loading.height())/2);
            var left = parseInt((this.getWidth()-loading.width())/2);
            loading.css({top:top+"px",left:left+"px"});
        },
        unmask:function(){
            this._ismask = false;
            iBase(this.el).find(".simple-mask").remove();
        },
        getId:function(){
            return this.id;
        },
        setId:function(value){
            if(!value){
                value = null;
                iBase(this.el).removeAttr("id");
            }else{
                value = value.trim();
                iBase(this.el).attr("id",value);
            }
            this.id = value;
        },
        getName:function(){
            return this.name;
        },
        setName:function(value){
            if(!value){
                value = null;
                iBase(this.el).removeAttr("name");
            }else{
                value = value.trim();
                iBase(this.el).attr("name",value);
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
            this.visible = simple.parseBoolean(value);
            if(this.visible){
                iBase(this.el).show();
            }else{
                iBase(this.el).hide();
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
                this.cls = iBase(this.el).attr("class").replace(this.useClass,"").trim();
            }
            return this.cls;
        },
        setCls:function(value){
            if(!value){
                value = "";
            }
            value = value.trim().replace(this.useClass,"").trim();
            this.cls = value;
            iBase(this.el).attr("class",this.useClass+" "+value);
        },
        getStyle:function(){
            if(!this.style){
                this.style = iBase(this.el).attr("style");
            }
            return this.style;
        },
        setStyle:function(value){
            if(!value){
                iBase(this.el).attr("style","");
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
            iBase(this.el).css(styleMap);
            this.style = iBase(this.el).attr("style");
        },
        getWidth:function(){
            if(!this.width){
                this.width = iBase(this.el).width();
            }
            return this.width;
        },
        setWidth:function(value){
            if(value){
                if(!isNaN(value)){
                    value = value+"px";
                }
                iBase(this.el).width(value);
            }
            this.width = iBase(this.el).width();
        },
        getHeight:function(){
            if(!this.height){
                this.height = iBase(this.el).height();
            }
            return this.height;
        },
        setHeight:function(value){
            if(value){
                if(!isNaN(value)){
                    value = value+"px";
                }
                iBase(this.el).height(value);
            }
            this.height = iBase(this.el).height();
        },
        getTitle:function(){
            return this.title;
        },
        setTitle:function(value){
            if(!value){
                value = null;
                iBase(this.el).removeAttr("title");
            }else{
                value = value.trim();
                iBase(this.el).attr("title",value);
            }
            this.title = value;
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

    if(simple.mode == "jquery"){
        /*jquery模式,在文档加载完毕后执行parse*/
        iBase(function(){
            if(!simple._hasparse){
                simple.parse();
                simple._hasparse = true;
            }
        });
    }else if(simple.mode == "vue"){
        /*vue模式,先拦截vue字段watch和事件,然后在文档加载完毕后执行parse*/
        iBase(function(){
            if(!simple._hasparse){
                simple.parse();
                simple._hasparse = true;
            }
        });
        var simpleVue = Vue;
        Vue = function(options){
            /*创建vue之前处理 两件事1.字段变更同步更新 2.窃取VUE事件函数*/
            win.vuePageFieldMap = beforeCreateVueField();
            if(!options.watch){
                options.watch = {};
            }
            var data = options.data;
            for(var key in data){
                options.watch[key] = {
                    handler:new Function("val","var tempMap=vuePageFieldMap."+key+";updateVueSimpleData(tempMap,val)"),
                    deep:true,
                    immediate:true
                }
            }
            var methods = options.methods;
            for(var clazz in simple.vueEventMap){
                /**clazz为useClass字段/
                 */
                for(var type in simple.vueEventMap[clazz]){
                    /**type为事件名称/
                     */
                    for(var methodName in simple.vueEventMap[clazz][type]){
                        simple.vueEventMap[clazz][type]["event"] = methods[simple.vueEventMap[clazz][type][methodName]];
                    }
                }
            }
            return new simpleVue(options);
        }
        win.updateVueSimpleData = function(map,data){
            if(typeof data == "object" && !(data instanceof Date)){
                for(var field in data){
                    var val = data[field];
                    var tempMap = map[field];
                    win.updateVueSimpleData(tempMap,val);
                }
            }else{
                if(!map){
                    return;
                }
                var vue_id = map["vue_id"];
                var field = map["field"];
                var simpleObj = simple.getBySelect("."+vue_id);
                if(!simpleObj ){
                    return;
                }
                var setFunctionName = "set"+simple.firstToUpperCase(field);
                if(simpleObj[setFunctionName]){
                    eval("simpleObj."+setFunctionName+"(data)");
                }else{
                    simpleObj[field] = data;
                }
            }
        }
        function beforeCreateVueField(){
            var pageMap = {};
            var moduleMap = simple.moduleMap;
            var pageEventMap = {};
            for(var key in moduleMap){
                pageEventMap[key] = {};
                var fieldMap = moduleMap[key]["fieldMap"];
                var eventMap = moduleMap[key]["eventMap"];
                var list = iBase("."+key);
                if(list.length == 0){
                    continue;
                }
                for(var i=0;i<list.length;i++){
                    var ele = list[i];
                    var vue_id = "vue_id"+simple.guid();
                    iBase(ele).addClass(vue_id);
                    for(var field in fieldMap){
                        var val = iBase(ele).attr("v-bind:"+field);
                        if(!val){
                            continue;
                        }
                        var sz = val.split(".");
                        var temp = "pageMap";
                        for(var m=0;m<sz.length;m++){
                            temp += "."+sz[m];
                            if(eval(temp+"== null")){
                                eval(temp+"={}");
                            }
                        }
                        eval("pageMap."+val+"={field:field,vue_id:vue_id}");
                    }
                    for(var event in eventMap){
                        var eventName = iBase(ele).attr("v-on:"+event);
                        if(!eventName){
                            continue;
                        }
                        pageEventMap[key][event]={methodName:eventName};
                    }
                }
            }
            simple.vueEventMap = pageEventMap;
            return pageMap;
        }
    }else if(simple.mode == "react"){
        /*react模式*/

    }else if(simple.mode == "angular"){
        /*angular模式*/

    }
})(window);