(function(win){
    "use strict";
    /*提供js的引入机制*/
    var t={
        getJsPath:function(js){
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
            ss.length = ss.length - 1;
            path = ss.join("/");
            return path;
        },
        getSearch:function(){
            var search = decodeURIComponent(win.location.search);
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
        getJsSearch:function(js){
            var scripts = document.getElementsByTagName("script");
            var map = {};
            var c;
            for (var i = 0, l = scripts.length; i < l; i++) {
                var src = scripts[i].src;
                if ((c = src.indexOf(js) ) != -1) {
                    map = this.getSearchByStr(src.substring(c+js.length));
                    break;
                }
            }
            return map;
        }
    }
    var htmlSearch = t.getSearch();
    var jsSearch = t.getJsSearch("boot.js");
    var jsPath = t.getJsPath("boot.js");
    /*加载jquery*/
    document.write('<script src="' + jsPath + '/base/jquery.min.js" type="text/javascript"></sc' + 'ript>');
    document.write('<script src="' + jsPath + '/base/base.js" type="text/javascript"></sc' + 'ript>');
    /**加载miniui*/
    document.write('<script src="' + jsPath + '/base/miniui.js" type="text/javascript"></sc' + 'ript>');
    /*加载默认样式*/
    document.write('<link href="' + jsPath + '/skin/default/miniui.css" rel="stylesheet" type="text/css" />');
    if(jsSearch.mode != "jquery" && jsSearch.mode != "vue" && jsSearch.mode != "react" && jsSearch.mode != "angular" && jsSearch.mode != "angular2"){
        return;
    }
    /*加载jsx*/
    if(jsSearch.jsx=="true"){
        document.write('<script src="' + jsPath + '/base/babel.min.js" type="text/javascript"></sc' + 'ript>');
    }
    if(!jsSearch.profile){
        jsSearch.profile = "product";
    }
    /*如果是angular2 加载angular2的基础文件*/
    if(jsSearch.mode == "angular2"){
        document.write('<script src="' + jsPath + '/base/'+jsSearch.profile+'/es6-shim.js" type="text/javascript"></sc' + 'ript>');
        document.write('<script src="' + jsPath + '/base/'+jsSearch.profile+'/angular2-polyfills.js" type="text/javascript"></sc' + 'ript>');
        document.write('<script src="' + jsPath + '/base/'+jsSearch.profile+'/Rx.umd.js" type="text/javascript"></sc' + 'ript>');
    }
    /*加载mode文件 4种之一 vue  react  angular angular2*/
    if(jsSearch.mode != "jquery"){
        document.write('<script src="' + jsPath + '/base/'+jsSearch.profile+'/'+jsSearch.mode+'.js" type="text/javascript"></sc' + 'ript>');
    }
    /*如果是react 加载react的必备文件*/
    if(jsSearch.mode == "react"){
        document.write('<script src="' + jsPath + '/base//'+jsSearch.profile+'/react-dom.js" type="text/javascript"></sc' + 'ript>');
    }
    /*加载模块和皮肤*/
    var skin = htmlSearch.skin;
    if(!skin){
        skin = jsSearch.skin;
    }
    if(skin){
        document.write('<link href="' + jsPath + '/skin/'+skin+'/skin.css" rel="stylesheet" type="text/css" />');
    }
    /*引入模块插件包,用于打通ui的中间件*/
    document.write('<script src="' + jsPath + '/base/'+jsSearch.mode+'.plugin.js" type="text/javascript"></sc' + 'ript>');
    /*初始化语言包*/
    var lang = htmlSearch.lang;
    if(!lang){
        lang = jsSearch.lang;
    }
    if(!lang){
        lang = "zh_CN";
    }
    document.write('<script src="' + jsPath + '/lang/'+lang+'.js" type="text/javascript"></sc' + 'ript>');
})(window);