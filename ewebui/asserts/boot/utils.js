(function () {
    /*兼容IE5不支持的方法*/
    initCompatibleIE5();
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
    /**
     * 加载miniui
     */
    loadMiniUi(config.miniui);
    if(jsSearch.jsx == "true"){
        /*加载jsx*/
        document.write('<script src="' + config.otherLibs.jsxPath + '" type="text/javascript"></sc' + 'ript>');
    }
    /*如果是angular2 加载angular2的基础文件*/
    if(jsSearch.lib == "angular2"){
        document.write('<script src="' + config.angular2.es6ShimPath + '" type="text/javascript"></sc' + 'ript>');
        document.write('<script src="' + config.angular2.polyfillsPath + '" type="text/javascript"></sc' + 'ript>');
        document.write('<script src="' + config.angular2.rxUmdPath + '" type="text/javascript"></sc' + 'ript>');
    }
    /**
     * 加载环境
     */
    document.write('<script src="' + config[jsSearch.lib][jsSearch.env+"Path"] + '" type="text/javascript"></sc' + 'ript>');
    /*如果是react 加载react的必备文件*/
    if(jsSearch.lib == "react"){
        document.write('<script src="' + config.react[jsSearch.env+"DomPath"] + '" type="text/javascript"></sc' + 'ript>');
    }
    /**
     * 加载插件
     */
    if(jsSearch.from == "pc"){
        /**加载兼容层底包,jquery兼容层不依赖此底包*/
        if(jsSearch.lib != "jquery"){
            document.write('<script src="' + jspath + '/../compatible/base.js" type="text/javascript"></sc' + 'ript>');
        }
        /** 加载兼容层 */
        document.write('<script src="' + jspath + '/../compatible/'+jsSearch.lib+'.plugin.js" type="text/javascript"></sc' + 'ript>');
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
    function loadMiniUi(miniui){
        /**
         * 加载jquery底包
         */
        utils.getRemoteData(miniui.jqueryPath,false,function(res){
            if(res.status == 1){
                eval(res.text);
            }else{
                console.warn(miniui.jqueryPath+", js加载出现问题,将以标签形式加载");
                document.write('<script src="' + miniui.jqueryPath + '" type="text/javascript" ></sc' + 'ript>');
            }
        });
        var miniUtils = {
            setMode:function(mode){
                var key = "miniuiMode";
                utils.setLocalStorage(key,mode);
                var ele = document.getElementById(key);
                if(mode == "default"){
                    jQuery(ele).remove();
                }else{
                    var url = miniui.themesPath + '/default/' + mode + '-mode.css';
                    if(ele){
                        ele.href = url;
                    }else{
                        utils.loadCss(url,key);
                    }
                }
                mini.layout();
            },
            getMode:function(){
                return utils.getLocalStorage("miniuiMode");
            },
            setSkin:function(skin){
                var key = "miniuiSkin";
                utils.setLocalStorage(key,skin);
                var ele = document.getElementById(key);
                if(skin == "default"){
                    jQuery(ele).remove();
                }else{
                    var url = miniui.themesPath + '/' + skin + '/skin.css';
                    if(ele){
                        ele.href = url;
                    }else{
                        utils.loadCss(url,key);
                    }

                }
                mini.layout();
            },
            getSkin:function(){
                return utils.getLocalStorage("miniuiSkin");
            },
            setLange:function(mode){
                utils.setLocalStorage("miniuiLanguage",mode);
                window.location.reload();
            },
            getLange:function(){
                return utils.getLocalStorage("miniuiLanguage");
            }
        }
        window.miniUtils = miniUtils;
        /*破解miniui 准备*/
        document.write('<script src="'+jspath+'/../compatible/minijs-before.js" type="text/javascript" ></sc' + 'ript>');
        /*miniui*/
        document.write('<script src="' + miniui.jsPath + '" type="text/javascript" ></sc' + 'ript>');
        /*将配置项外露,为加载语言包做准备*/
        window.miniuiConfig = miniui;
        /*破解miniui 结束*/
        document.write('<script src="'+jspath+'/../compatible/minijs-after.js" type="text/javascript" ></sc' + 'ript>');
        /*datagrid导出*/
        document.write('<script src="' + miniui.exportJsPath + '" type="text/javascript" ></sc' + 'ript>');
        document.write('<link href="' + miniui.fontAwesomePath + '" rel="stylesheet" type="text/css" />');
        document.write('<link href="' + miniui.cssPath + '" rel="stylesheet" type="text/css" />');
        /*icon*/
        document.write('<link href="' + miniui.themesPath + '/icons.css" rel="stylesheet" type="text/css" />');
    }
    function initCompatibleIE5(){
        /*兼容IE5不支持的属性 -- 开始*/
        /*重写string的trim方法*/
        if(!String.prototype.trim) {
            String.prototype.trim = function() {
                return this.replace(/^\s+|\s+$/g, '');
            }
        }
        /*重写string的startsWith方法*/
        if(!String.prototype.startsWith) {
            String.prototype.startsWith = function(str) {
                return this.indexOf(str) == 0;
            }
        }
        /*增加localStorage*/
        if(typeof window.localStorage == "undefined"){
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
        /*兼容IE5不支持的属性 -- 结束*/
    }
    function initExpand(){
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
            //获取页面指定key值的参数值
            getParamer: function (key) {
                var map = this.getSearch();
                return map[key];
            },
            //获取页面所有key的参数值的集合
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
})()