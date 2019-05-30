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
    if(!jsSearch.mode){
        return;
    }
    if(!jsSearch.profile){
        jsSearch.profile = "product";
    }
    /*加载简版jquery*/
    document.write('<script src="' + jsPath + '/base/js/jquery.min.js" type="text/javascript"></sc' + 'ript>');
    if(jsSearch.mode != "jquery" && jsSearch.mode != "vue" && jsSearch.mode != "react" && jsSearch.mode != "angular" && jsSearch.mode != "angular2"){
        return;
    }
    /*加载jsx*/
    if(jsSearch.jsx=="true"){
        document.write('<script src="' + jsPath + '/base/js/babel.min.js" type="text/javascript"></sc' + 'ript>');
    }
    /*加载mode文件 5种之一 jquery  vue  react  angular angular2*/
    var ui = {prefix:"simple"};
    ui.mode = jsSearch.mode;
    if(ui.mode == "angular2"){
        document.write('<script src="' + jsPath + '/base/js/'+jsSearch.profile+'/es6-shim.js" type="text/javascript"></sc' + 'ript>');
        document.write('<script src="' + jsPath + '/base/js/'+jsSearch.profile+'/angular2-polyfills.js" type="text/javascript"></sc' + 'ript>');
        document.write('<script src="' + jsPath + '/base/js/'+jsSearch.profile+'/Rx.umd.js" type="text/javascript"></sc' + 'ript>');
    }
    if(ui.mode != "jquery"){
        document.write('<script src="' + jsPath + '/base/js/'+jsSearch.profile+'/'+ui.mode+'.js" type="text/javascript"></sc' + 'ript>');
    }
    if(ui.mode == "react"){
        document.write('<script src="' + jsPath + '/base/js/'+jsSearch.profile+'/react-dom.js" type="text/javascript"></sc' + 'ript>');
    }
    /*加载核心文件 提供基础组件和工具类*/
    document.write('<script src="' + jsPath + '/base/js/base.js" type="text/javascript"></sc' + 'ript>');
    /*加载模块和皮肤*/
    ui.skin = htmlSearch.skin;
    if(!ui.skin){
        ui.skin = jsSearch.skin;
    }
    if(!jsSearch.modules){
        return;
    }
    /*核心样式文件bootstrap*/
    document.write('<link href="' + jsPath + '/base/css/bootstrap.min.css" rel="stylesheet" type="text/css" />');
    document.write('<link href="' + jsPath + '/base/css/base.css" rel="stylesheet" type="text/css" />');
    /*加载字体*/
    document.write('<link href="' + jsPath + '/fonts/font-awesome/css/font-awesome.css" rel="stylesheet" type="text/css" />');
    /*引用皮肤基础包*/
    if(ui.skin){
        document.write('<link href="' + jsPath + '/skin/'+ui.skin+'/base.css" rel="stylesheet" type="text/css" />');
    }
    var modules = jsSearch.modules.split(",");
    for(var i=0;i<modules.length;i++){
        var module = modules[i];
        document.write('<script src="' + jsPath + '/modules/'+module+'.js" type="text/javascript"></sc' + 'ript>');
        document.write('<link href="' + jsPath + '/skin/default/'+module+'.css" rel="stylesheet" type="text/css" />');
        if(ui.skin){
            document.write('<link href="' + jsPath + '/skin/'+ui.skin+'/'+module+'.css" rel="stylesheet" type="text/css" />');
        }
    }
    /*引入模块插件包,用于打通ui的中间件*/
    document.write('<script src="' + jsPath + '/base/js/'+ui.mode+'.plugin.js" type="text/javascript"></sc' + 'ript>');
    /*初始化语言包*/
    ui.lang = htmlSearch.lang;
    if(!ui.lang){
        ui.lang = jsSearch.lang;
    }
    if(!ui.lang){
        ui.lang = "zh_CN";
    }
    document.write('<script src="' + jsPath + '/lang/'+ui.lang+'.js" type="text/javascript"></sc' + 'ript>');
    win[ui.prefix] = ui;
    win.uiprefix = ui.prefix;
})(window);
