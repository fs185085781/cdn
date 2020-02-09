(function(){
    /*拓展工具类*/
    initExpand();
    /*初始化utils工具*/
    window.utils = initUtils();
    var utilsPath = utils.getJsPath("utils.js",1);
    initConfig(utilsPath+"/config.js");
    var tempConfig = window.config;
    utils.removeProp(window,"config");
    initConfig(utilsPath+"/"+tempConfig.configType+"-path.js");
    for(var key in tempConfig){
        window.config[key] = tempConfig[key];
    }
    var uiHost = utils.getRelativePath();
    var bootPathMap = {
        "mint":uiHost+"/mint-ui/js/boot.js",
        "vant":uiHost+"/vant-ui/js/boot.js",
        "element":uiHost+"/element-ui/js/boot.js",
        "antd":uiHost+"/ant-design/js/boot.js"
    }
    /*时间工具类*/
    document.write('<script src="' + uiHost + '/plugins/time-utils/time-utils.js" type="text/javascript"></sc' + 'ript>');
    /*加载vue*/
    document.write('<script src="'+config.vue[config.env+"Path"]+'" type="text/javascript"></sc' + 'ript>');
    /*加载axios*/
    document.write('<script src="'+config.axios[config.env+"Path"]+'" type="text/javascript"></sc' + 'ript>');
    /*加载框架*/
    document.write('<script src="' + bootPathMap[utils.from] + '" type="text/javascript"></sc' + 'ript>');
    /*utils拓展类*/
    document.write('<script src="' + uiHost + '/plugins/utils-expand/utils-expand.js" type="text/javascript"></sc' + 'ript>');
    /*加载插件*/
    utils.pluginPath = uiHost+"/plugins";
    document.write('<script src="' + utilsPath + '/plugins.js" type="text/javascript"></sc' + 'ript>');
    /*调试页面*/
    if(utils.getParamer("debug") == "true"){
        document.write('<script src="' + utils.pluginPath + '/eruda/eruda.js" type="text/javascript"></sc' + 'ript>');
        utils.delayAction(function(){
            return window.eruda!=null;
        },function(){
            window.eruda.init();
        });
    }
    function initUtils(){
        var tools = {
            getParamer: function (key) {
                var map = this.getSearch();
                return map[key];
            },
            getSearch: function () {
                var search = decodeURIComponent(location.search);
                return this.getSearchByStr(search);
            },
            getSearchByStr:function(search){
                if (search) {
                    search = search.substring(1);
                } else {
                    return {};
                }
                var strsz = search.split("&");
                var map = {};
                for (var i=0; i<strsz.length; i++){
                    var strs = strsz[i];
                    if (strs.indexOf("=") != -1) {
                        var tempsz = strs.split("=");
                        var tempkey = tempsz[0];
                        var tempvalue = tempsz[1];
                        map[tempkey] = tempvalue;
                    }
                }
                return map;
            },
            setLocalStorage:function(key,val){
                var map = {};
                map[key] = val;
                localStorage.setItem(key,JSON.stringify(map));
            },
            getLocalStorage:function(key){
                var mapStr = localStorage.getItem(key);
                if(!mapStr){
                    mapStr = "{}";
                }
                var map = JSON.parse(mapStr);
                return map[key];
            },
            delLocalStorage:function(key){
                localStorage.removeItem(key);
            },
            getRemoteData:function(url,async,callback){
                try{
                    async = async === false?false:true;
                    var xmlhttp;
                    if (window.XMLHttpRequest){
                        xmlhttp=new XMLHttpRequest();
                    }else{
                        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
                    }
                    xmlhttp.onreadystatechange=function(){
                        if(xmlhttp.readyState==4){
                            callback({text:xmlhttp.responseText,status:1});
                        }
                    }
                    xmlhttp.open("GET",url,async);
                    xmlhttp.send();
                }catch (e) {
                    callback({status:0,text:e.toString()});
                }
            },
            getRelativePath:function(){
                return this.getJsPath("utils.js",2);
            },
            getJsPath:function(js, length) {
                var scripts = document.getElementsByTagName("script");
                var path = "";
                for (var i = 0, l = scripts.length; i < l; i++) {
                    var src = scripts[i].src;
                    if (src.indexOf(js) != -1) {
                        path = src;
                        break;
                    }
                }
                var ss = path.split("/");
                ss.length = ss.length - length;
                path = ss.join("/");
                return path;
            },
            removeProp:function(obj,fieldName){
                try{
                    delete obj[fieldName];
                }catch (e) {
                    obj[fieldName] = undefined;
                }
            },loadJs:function(path,id,type){
                if(!path){
                    return;
                }
                if(id && document.getElementById(id)){
                    document.getElementById(id).remove();
                }
                var script = document.createElement("script");
                script.src = path;
                if(id){
                    script.id = id;
                }
                if(!type){
                    type = "text/javascript";
                }
                script.type = type;
                if(!document.head){
                    document.head = document.getElementsByTagName("head")[0];
                }
                document.head.appendChild(script);
            },
            loadCss:function(path,id,rel,type){
                if(!path){
                    return;
                }
                if(id && document.getElementById(id)){
                    document.getElementById(id).remove();
                }
                var link = document.createElement("link");
                link.href = path;
                if(id){
                    link.id = id;
                }
                if(!rel){
                    rel = "stylesheet";
                }
                link.rel = rel;
                if(!type){
                    type = "text/css";
                }
                link.type = type;
                if(!document.head){
                    document.head = document.getElementsByTagName("head")[0];
                }
                document.head.appendChild(link);
            },
            delayAction:function(tjFn,acFn,maxDelay){
                var that = this;
                if(!maxDelay){
                    maxDelay = 24*60*60*1000;
                }
                var key = "da"+Date.now()+parseInt(Math.random()*10000);
                var timeKey = "time"+key;
                that[timeKey]=Date.now();
                that[key]=function () {
                    if(Date.now()-that[timeKey]>maxDelay){
                        that.removeProp(that,key);
                        that.removeProp(that,timeKey);
                    }else{
                        if(tjFn()){
                            that.removeProp(that,key);
                            that.removeProp(that,timeKey);
                            acFn();
                        }else{
                            setTimeout(that[key],100);
                        }
                    }
                }
                that[key]();
            }
        }
        var jsSearch = getJsSearch("utils.js");
        if(jsSearch.from != "mint" && jsSearch.from != "vant" && jsSearch.from != "antd"){
            jsSearch.from = "element";
        }
        var plugins = [];
        if(jsSearch.plugins && jsSearch.plugins.trim()){
            plugins=jsSearch.plugins.trim().split(",");
        }
        jsSearch.plugins = plugins;
        for(var key in jsSearch){
            tools[key] = jsSearch[key];
        }
        function getJsSearch(js){
            var scripts = document.getElementsByTagName("script");
            var map = {};
            var c;
            for (var i = 0, l = scripts.length; i < l; i++) {
                var src = scripts[i].src;
                if ((c = src.indexOf(js) ) != -1) {
                    map = tools.getSearchByStr(src.substring(c+js.length));
                    break;
                }
            }
            return map;
        }
        return tools;
    }
    function initConfig(url){
        url += "?_="+new Date().getTime();
        utils.getRemoteData(url,false,function(res){
            if(res.status == 1){
                eval(res.text);
            }
        });
    }
    function initExpand(){
        /*兼容低版本浏览器不支持的属性*/
        initCompatibleIE5();
        /**数值拓展----开始*/
        var numberMethods = ["floor","round","ceil"];
        for(var i=0;i<numberMethods.length;i++){
            var field = numberMethods[i];
            (function(f){
                Number.prototype[f] = function(x){
                    if(x<0){
                        x = 0;
                    }
                    var pow = Math.pow(10,x);
                    var temp = Math[f](this*pow);
                    return temp/pow;
                }
            })(field);
        }
        /**数值拓展----结束*/
        /**精准计算拓展---开始*/
        var decimalMethods = ["add","subtract","multiply","divide"];
        for(var i=0;i<decimalMethods.length;i++){
            var field = decimalMethods[i];
            (function(f){
                Number.prototype[f] = function(x,maxJd,type){
                    if(isNaN(x)){
                        throw x+" is not a number";
                    }
                    if(typeof x != "number"){
                        x = x*1;
                    }
                    if(isNaN(maxJd)){
                        console.warn(maxJd+" is not a number,will be reset to 15");
                        maxJd = 15;
                    }
                    if((!maxJd && maxJd != 0) || maxJd>15){
                        maxJd = 15;
                    }
                    type = type || "round";
                    if(type != "floor" && type != "round" && type != "ceil"){
                        console.warn(type+" is not a number,will be reset to 'round'");
                        type = "round";
                    }
                    function getAssist(v){
                        var str = String(v);
                        var index = str.indexOf(".");
                        var res = index != -1?str.length - index -1:0;
                        if(res>maxJd){
                            res = maxJd;
                        }
                        var pow = Math.pow(10,res);
                        var num = v[type](res);
                        return {pow:pow,num:num};
                    }
                    var a = getAssist(this);
                    var b = getAssist(x);
                    var max = a.pow>b.pow?a.pow:b.pow;
                    var jg = NaN;
                    if(f=="add"){
                        jg = (a.num*max+b.num*max)/max;
                    }else if(f=="subtract"){
                        jg = (a.num*max-b.num*max)/max;
                    }else if(f=="multiply"){
                        jg = (a.num*a.pow)*(b.num*b.pow)/(a.pow*b.pow);
                    }else if(f=="divide"){
                        jg = (a.num*max)/(b.num*max);
                    }
                    return jg;
                }
            })(field);
        }
        /**精准计算拓展---结束*/
    }
    function initCompatibleIE5(){
        if(!Array.prototype.includes){
            Array.prototype.includes = function(n){
                for(var i=0;i<this.length;i++){
                    if(this[i] == n){
                        return true;
                    }
                }
                return false;
            }
        }
        if(!Object.entries){
            Object.entries = function (obj) {
                var keys = Object.keys(obj);
                var data = [];
                for(var i=0;i<keys.length;i++){
                    var key = keys[i];
                    data.push([key,obj[key]]);
                }
                return data;
            }
        }
        /*解决Promise问题*/
        if(!window.Promise){
            window.Promise = function(func){
                var that = this;
                that.status = "pending";
                try{
                    func(function(a){
                            if(that.status=="pending"){
                                that.status = "resolved";
                                that.value = a;
                            }
                        },
                        function(b){
                            if(that.status=="pending"){
                                that.status = "rejected";
                                that.value = b;
                            }
                        });
                }catch (e) {
                    if(that.status=="pending"){
                        that.status = "rejected";
                        that.value = e;
                    }
                }
                utils.delayAction(function(){
                    var flag = false;
                    if(that.status == "resolved" && that.resolve){
                        flag = true;
                    }
                    if(that.status == "rejected" && that.reject){
                        flag = true;
                    }
                    return flag;
                },function () {
                    if(that.status == "resolved" && that.resolve){
                        that.resolve(that.value);
                    }else if(that.status == "rejected" && that.reject){
                        that.reject(that.value);
                    }
                    if(that.finally){
                        that.finally();
                    }
                });
                return that;
            }
            Promise.prototype.then = function(func){
                this.resolve = func;
                return this;
            }
            Promise.prototype.catch = function(func){
                this.reject = func;
                return this;
            }
            Promise.prototype.finally = function(func){
                this.finally = func;
                return this;
            }
        }
        /*增加string的trim方法*/
        if(!String.prototype.trim) {
            String.prototype.trim = function() {
                return this.replace(/^\s+|\s+$/g, '');
            }
        }
        /*增加string的startsWith方法*/
        if(!String.prototype.startsWith) {
            String.prototype.startsWith = function(str) {
                return this.indexOf(str) == 0;
            }
        }
        /*增加Date的now方法*/
        if(!Date.now) {
            Date.now = function() {
                return new Date().getTime();
            }
        }
        /*增加深克隆方法*/
        if(!Object.assign){
            Object.assign = function(a,b){
                if(!b){
                    b = {};
                }
                for(var k in b){
                    a[k] = b[k];
                }
                return a;
            }
        }
        /*增加localStorage*/
        if(!window.localStorage){
            window.localStorage = {
                removeItem:function(key){
                    var exp = new Date();
                    exp.setTime(exp.getTime() - 1);
                    document.cookie= key + "=;expires="+exp.toGMTString();
                },
                setItem:function(key,val){
                    var Days = 30;
                    var exp  = new Date();
                    exp.setTime(exp.getTime() + Days*24*60*60*1000);
                    document.cookie = key + "="+ escape (val) + ";expires=" + exp.toGMTString();
                },
                getItem:function(key){
                    var arr = document.cookie.match(new RegExp("(^| )"+key+"=([^;]*)(;|$)"));
                    if(arr != null){
                        return unescape(arr[2]);
                    }else{
                        return null;
                    }
                }
            }
        }
        /*改变json格式化*/
        Date.prototype.toJSON = function () {
            var date = this;
            var y = date.getFullYear();
            var M = date.getMonth()+1;
            var d = date.getDate();
            var h = date.getHours();
            var m = date.getMinutes();
            var s = date.getSeconds();
            var ms = date.getMilliseconds();
            var str = y;
            str += "-";
            str += M>9?M:("0"+M);
            str += "-";
            str += d>9?d:("0"+d);
            str += " ";
            str += h>9?h:("0"+h);
            str += ":";
            str += m>9?m:("0"+m);
            str += ":";
            str += s>9?s:("0"+s);
            str += ".";
            str += ms>99?ms:(ms>9?("0"+ms):("00"+ms));
            return str;
        }
        if(!window.JSON){
            /*增加json*/
            window.JSON = {
                stringify:function(obj){
                    return jsonStrByData(obj);
                    function jsonStrByData(data){
                        var type = Object.prototype.toString.call(data);
                        if(type =="[object Array]"){
                            var result = "[";
                            for(var i=0;i<data.length;i++){
                                if(i>0){
                                    result += ",";
                                }
                                result += jsonStrByData(data[i]);
                            }
                            result += "]";
                            return result;
                        }else if(type == "[object Date]"){
                            return '"'+data.toJSON()+'"';
                        }else if(type == "[object Object]"){
                            if(!data){
                                var res = "undefined";
                                if(data === null){
                                    res = "null";
                                }
                                return res;
                            }
                            var result = "{";
                            var isFirst=true;
                            for(var key in data){
                                var str = jsonStrByData(data[key]);
                                if(str == "undefined"){
                                    continue;
                                }
                                if(!isFirst){
                                    result += ",";
                                }
                                result += "\""+key+"\":"+str;
                                isFirst = false;
                            }
                            result+="}";
                            return result;
                        }else if(type == "[object String]"){
                            return '"'+data+'"';
                        }else if(type == "[object Number]" || type == "[object Boolean]" || type == "[object Null]"){
                            return String(data);
                        }else{
                            return "undefined";
                        }
                    }
                },
                parse:function(str){
                    if(typeof str == "object"){
                        return str;
                    }
                    var map = {data:eval("("+str+")")};
                    parseDateDg(map);
                    function parseDateDg(data){
                        if(!data){
                            return;
                        }
                        var type = Object.prototype.toString.call(data);
                        if(type =="[object Array]"){
                            for(var i=0;i<data.length;i++){
                                setDate(data,i);
                            }
                        }else if(type == "[object Object]"){
                            for(var key in data){
                                setDate(data,key);
                            }
                        }else{
                            return;
                        }
                    }
                    function parseDate(str){
                        var y = str.substring(0,4)*1;
                        var M = str.substring(5,7)*1-1;
                        var d = str.substring(8,10)*1;
                        var h = str.substring(11,13)*1;
                        var m = str.substring(14,16)*1;
                        var s = str.substring(17,19)*1;
                        var ms = str.substring(20,23)*1;
                        return new Date(y,M,d,h,m,s,ms);
                    }
                    function setDate(data,key){
                        if(typeof data[key] == "string" && /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}/.test(data[key])){
                            data[key] = parseDate(data[key]);
                        }else{
                            parseDateDg(data[key]);
                        }
                    }
                    return map.data;
                }
            }
        }else{
            var strToObj = JSON.parse;
            JSON.parse = function (text, reviver) {
                if(!reviver){
                    reviver = function(key,val){
                        var type = Object.prototype.toString.call(val);
                        if(type == "[object String]"){
                            return toDate(val);
                        }else{
                            return val;
                        }
                        function toDate(data) {
                            if(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}/.test(data)){
                                function parseDate(str){
                                    var y = str.substring(0,4)*1;
                                    var M = str.substring(5,7)*1-1;
                                    var d = str.substring(8,10)*1;
                                    var h = str.substring(11,13)*1;
                                    var m = str.substring(14,16)*1;
                                    var s = str.substring(17,19)*1;
                                    var ms = str.substring(20,23)*1;
                                    return new Date(y,M,d,h,m,s,ms);
                                }
                                return parseDate(data);
                            }else{
                                return data;
                            }
                        }
                    }
                }
                return strToObj(text,reviver);
            }
        }
    }
})()