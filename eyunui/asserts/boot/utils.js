(function () {
    /*拓展工具类*/
    initExpand();
    /*初始化utils工具*/
    window.utils = initUtils();
    var jsSearch = getJsSearch("utils.js");
    if(jsSearch.from != "m"){
        jsSearch.from = "pc";
    }
    if(jsSearch.env != "test"){
        jsSearch.env = "prod";
    }
    if(jsSearch.lib != "vue" && jsSearch.lib != "react" && jsSearch.lib != "angular" && jsSearch.lib != "angular2"){
        jsSearch.lib = "jquery";
    }
    var jspath = utils.getRelativePath();
    var config = initConfig(jspath+"/config.js");
    /*加载插件*/
    initPlugins(jsSearch.plugins,config.plugins);
    /**
     * 加载jquery底包
     */
    document.write('<script src="' + config.jquery[jsSearch.env+"Path"] + '" type="text/javascript"></sc' + 'ript>');
    /*如果是angular2 加载angular2的基础文件*/
    if(jsSearch.lib == "angular2"){
        document.write('<script src="' + config.angular2.es6ShimPath + '" type="text/javascript"></sc' + 'ript>');
        document.write('<script src="' + config.angular2.polyfillsPath + '" type="text/javascript"></sc' + 'ript>');
        document.write('<script src="' + config.angular2.rxUmdPath + '" type="text/javascript"></sc' + 'ript>');
    }
    /**
     * 加载环境
     */
    if(jsSearch.lib != "jquery"){
        document.write('<script src="' + config[jsSearch.lib][jsSearch.env+"Path"] + '" type="text/javascript"></sc' + 'ript>');
    }
    /*如果是react 加载react的必备文件*/
    if(jsSearch.lib == "react"){
        document.write('<script src="' + config[jsSearch.lib][jsSearch.env+"DomPath"] + '" type="text/javascript"></sc' + 'ript>');
    }
    if(jsSearch.from == "pc"){
        /**加载兼容层底包*/
        loadLayUi(config.layui);
    }
    function getJsSearch(js){
        var scripts = document.getElementsByTagName("script");
        var map = {};
        var c;
        for (var i = 0, l = scripts.length; i < l; i++) {
            var src = scripts[i].src;
            if ((c = src.indexOf(js) ) != -1) {
                map = utils.getSearchByStr(src.substring(c+js.length));
                break;
            }
        }
        return map;
    }
    function loadLayUi(layuiConfig){
        //document.write('<script src="' + layuiConfig.layuiAllPath+ '" type="text/javascript"></sc' + 'ript>');
        document.write('<script src="' + layuiConfig.layuiPath+ '" type="text/javascript"></sc' + 'ript>');
    }
    function initCompatibleIE5(){
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
        /*增加json*/
        if(!window.JSON){
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
                            return '"'+dateFormat(data)+'"';
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
                            return "undefined"
                        }
                    }
                    function dateFormat(date){
                        var y = date.getFullYear();
                        var M = date.getMonth()+1;
                        var d = date.getDate();
                        var h = date.getHours();
                        var m = date.getMinutes();
                        var s = date.getSeconds();
                        var v = date.getMilliseconds();
                        var str = y;
                        str += "-";
                        str += M>9?M:("0"+M);
                        str += "-";
                        str += d>9?d:("0"+d);
                        str += "T";
                        str += h>9?h:("0"+h);
                        str += ":";
                        str += m>9?m:("0"+m);
                        str += ":";
                        str += s>9?s:("0"+s);
                        return str;
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
                        return new Date(y,M,d,h,m,s,0);
                    }
                    function setDate(data,key){
                        if(typeof data[key] == "string" && /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(data[key])){
                            data[key] = parseDate(data[key]);
                        }else{
                            parseDateDg(data[key]);
                        }
                    }
                    return map.data;
                }
            }

        }
    }
    function initExpand(){
        /*兼容低版本浏览器不支持的属性*/
        initCompatibleIE5();
        /**时间拓展----开始*/
        Date.prototype.addMilliseconds = function(x){
            var v = this.getTime() + x;
            return new Date(v);
        }
        Date.prototype.addMonths = function(x){
            var months = this.getFullYear()*12+this.getMonth()+x+1;
            var date = this.getDate();
            var year = parseInt(months/12);
            var temp = new Date(year,months-year*12,1,this.getHours(),this.getMinutes(),this.getSeconds(),this.getMilliseconds());
            var data = temp.addDays(-1);
            if(date<data.getDate()){
                data.setDate(date);
            }
            return data;
        }
        var dateMethods = [
            {prop:"addSeconds",parentProp:"addMilliseconds",pow:1000},
            {prop:"addMinutes",parentProp:"addSeconds",pow:60},
            {prop:"addHours",parentProp:"addMinutes",pow:60},
            {prop:"addDays",parentProp:"addHours",pow:24},
            {prop:"addYears",parentProp:"addMonths",pow:12}];
        for(var i=0;i<dateMethods.length;i++){
            var temp = dateMethods[i];
            (function(map){
                Date.prototype[map.prop] = function(x){
                    return this[map.parentProp](x*map.pow);
                }
            })(temp);
        }
        /**时间拓展----结束*/
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
    function initUtils(){
        return {
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
            getRelativePath:function(){
                return this.getJsPath("utils.js",1);
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
            init:function(callback){
                if(!utils.initData || !utils.initData.status){
                    utils.initData = {callback:callback,status:1};
                }
                if(utils.initData.status == 1){
                    var map = utils.getLocalStorage("layuiModeCache");
                    if(!map){
                        var iframe = document.createElement("iframe");
                        iframe.style = "display:none;";
                        document.body.append(iframe);
                        var srcipt = iframe.contentWindow.document.createElement("script");
                        srcipt.src = config.layui.layuiAllPath;
                        iframe.contentWindow.document.body.append(srcipt);
                        utils.initData.iframe = iframe;
                        utils.initData.status = 2;
                        setTimeout(utils.init,10);
                    }
                }else if(utils.initData.status == 2){
                    if(!utils.initData.iframe.contentWindow.layui){
                        setTimeout(utils.init,10);
                    }else{
                        var allLayui = utils.initData.iframe.contentWindow.layui;
                        var map = {};
                        for(var key in allLayui){
                            if(!allLayui.hasOwnProperty(key)){
                                continue;
                            }
                            if(key =="$"){
                                continue;
                            }
                            if(typeof allLayui[key] == "string"){
                                continue;
                            }
                            if(typeof allLayui[key] == "function"){
                                map[key] = [key];
                            }else if(typeof allLayui[key] == "object"){
                                var mode = allLayui[key];
                                var list = [];
                                for(var key2 in mode){
                                    if(!mode.hasOwnProperty(key2)){
                                        continue;
                                    }
                                    if(typeof mode[key2] != "function"){
                                        continue;
                                    }
                                    list.push(key2);
                                }
                                map[key] = list;
                            }
                        }
                        console.log(map);

                    }
                }else if(utils.initData.status == 3){

                }else if(utils.initData.status == 4){

                }else if(utils.initData.status == 5){

                }else if(utils.initData.status == 6){

                }else if(utils.initData.status == 7){

                }
                /*try{
                    callback(window.layui);
                }catch (e) {
                    console.log(e.message);
                }*/
            }
        }
    }
    function initConfig(url){
        var c;
        url += "?_="+new Date().getTime();
        utils.getRemoteData(url,false,function(res){
            if(res.status == 1){
                eval(res.text);
                c = window.config;
                utils.removeProp(window,"config");
            }
        });
        return c;
    }
    function initPlugins(plugins,configPathMap){
        if(!plugins){
            return;
        }
        if(!configPathMap){
            return;
        }
        var alls = plugins.split(",");
        for(var i=0;i<alls.length;i++){
            var url = configPathMap[alls[i]];
            if(!url){
                continue;
            }
            document.write('<script src="' + url + '" type="text/javascript"></sc' + 'ript>');
        }
    }
})()