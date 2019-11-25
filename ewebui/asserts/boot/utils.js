(function (win) {
    var utils = {
        //获取页面指定key值的参数值
        getParamer: function (key) {
            var map = this.getSearch();
            return map[key];
        },
        //获取页面所有key的参数值的集合
        getSearch: function () {
            var search = decodeURIComponent(win.location.search);
            return getSearchByStr(search);
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
        delAllLocalStorage:function(){
            localStorage.clear();
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
        }
    }
    function getSearchByStr(search){
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
    }
    function getJsSearch(js){
        var scripts = document.getElementsByTagName("script");
        var map = {};
        var c;
        for (var i = 0, l = scripts.length; i < l; i++) {
            var src = scripts[i].src;
            if ((c = src.indexOf(js) ) != -1) {
                map = getSearchByStr(src.substring(c+js.length));
                break;
            }
        }
        return map;
    }
    function getRemoteData(url,callBack){
        var xmlhttp;
        if (win.XMLHttpRequest){
            xmlhttp=new XMLHttpRequest();
        }else{
            xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange=function(){
            if(xmlhttp.readyState==4 && xmlhttp.status==200){
                callBack(xmlhttp.responseText);
            }
        }
        xmlhttp.open("GET",url,false);
        xmlhttp.send();
    }
	win.utils = utils;
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
    var envStr = "";
    if(jsSearch.env == "prod"){
        envStr = ".min";
    }
    var jspath = utils.getJsPath("utils.js",1);
    var config;
    getRemoteData(jspath+"/config.js",function(text){
        eval(text);
        config = window.config;
        window.config = undefined;
    });
    if(jsSearch.from == "pc"){
        /**当前是PC环境,加载miniui*/
        document.write('<script src="' + config.miniui.jsPath + '" type="text/javascript"></sc' + 'ript>');
    }else if(jsSearch.from == "m"){
        /**当前是手机环境*/
    }

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
    if(jsSearch.lib != "jquery" || jsSearch.from != "pc"){
        document.write('<script src="' + config[jsSearch.lib][jsSearch.env+"Path"] + '" type="text/javascript"></sc' + 'ript>');
    }
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
})(window)