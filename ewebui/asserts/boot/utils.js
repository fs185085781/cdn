(function () {
    /*兼容IE5不支持的方法*/
    initCompatibleIE5();
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
            if(res.status == 200){
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
        document.write('<script src="'+jspath+'/../compatible/intensify-miniui-ready.js" type="text/javascript" ></sc' + 'ript>');
        /*miniui*/
        document.write('<script src="' + miniui.jsPath + '" type="text/javascript" ></sc' + 'ript>');
        /*破解miniui 结束*/
        document.write('<script src="'+jspath+'/../compatible/intensify-miniui-complete.js" type="text/javascript" ></sc' + 'ript>');
        /*datagrid导出*/
        document.write('<script src="' + miniui.exportJsPath + '" type="text/javascript" ></sc' + 'ript>');
        var lang = miniUtils.getLange() || 'zh_CN';
        document.write('<script src="' + miniui.localePath + '/'+lang+'.js" type="text/javascript" ></sc' + 'ript>');
        document.write('<link href="' + miniui.fontAwesomePath + '" rel="stylesheet" type="text/css" />');
        document.write('<link href="' + miniui.cssPath + '" rel="stylesheet" type="text/css" />');
        //icon
        document.write('<link href="' + miniui.themesPath + '/icons.css" rel="stylesheet" type="text/css" />');
    }
    function initCompatibleIE5(){
        /*兼容IE5不支持的属性 -- 开始*/
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
        /*增加json*/
        if(typeof window.JSON == "undefined"){
            window.JSON = {
                stringify:function(jsonObj) {
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
                                curVal = that.stringify(jsonObj[i]);
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
                                console.log(jsonObj);
                                if (jsonObj.hasOwnProperty(i)) {
                                    curVal = that.stringify(jsonObj[i]);
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
                parse:function(str){
                    if(typeof str == "object"){
                        return str;
                    }
                    return eval("("+str+")");
                }
            }
        }
        /*兼容IE5不支持的属性 -- 结束*/
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
                            callback({text:xmlhttp.responseText,status:xmlhttp.status});
                        }
                    }
                    xmlhttp.open("GET",url,async);
                    xmlhttp.send();
                }catch (e) {
                    callback({status:500,text:e.toString()});
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
        utils.getRemoteData(url,false,function(res){
            if(res.status == 200){
                eval(res.text);
                c = window.config;
                utils.removeProp(window,"config");
            }
        });
        return c;
    }
})()