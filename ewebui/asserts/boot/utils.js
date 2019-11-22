(function (win) {
    var utils = {
        loadJs:function(path,id,type){
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
            document.head.appendChild(link);
        },
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
    var jspath = utils.getJsPath("utils.js",2);
    if(jsSearch.from == "pc"){
        /**
         * 优先加载miniui
         */
        document.write('<script src="' + jspath + '/miniui3.9.1/boot.js" type="text/javascript"></sc' + 'ript>');
    }
    /*加载jsx*/
    if(jsSearch.jsx == "true"){
        document.write('<script src="' + jspath + '/libs/babel.min.js" type="text/javascript"></sc' + 'ript>');
    }
    /*如果是angular2 加载angular2的基础文件*/
    if(jsSearch.lib == "angular2"){
        document.write('<script src="' + jspath + '/libs/es6-shim.js" type="text/javascript"></sc' + 'ript>');
        document.write('<script src="' + jspath + '/libs/angular2-polyfills.js" type="text/javascript"></sc' + 'ript>');
        document.write('<script src="' + jspath + '/libs/Rx.umd.js" type="text/javascript"></sc' + 'ript>');
    }
    /**
     * 加载环境
     */
    document.write('<script src="' + jspath + '/compatible/'+jsSearch.lib+envStr+'.js" type="text/javascript"></sc' + 'ript>');
    /*如果是react 加载react的必备文件*/
    if(jsSearch.lib == "react"){
        document.write('<script src="' + jspath + '/compatible/react-dom'+envStr+'.js" type="text/javascript"></sc' + 'ript>');
    }
    /**
     * 加载插件
     */
    if(jsSearch.lib != "jquery"){
        document.write('<script src="' + jspath + '/libs/'+jsSearch.lib+'.plugin.js" type="text/javascript"></sc' + 'ript>');
    }
})(window)