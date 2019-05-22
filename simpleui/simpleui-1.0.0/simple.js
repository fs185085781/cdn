(function(win){
    win.simple={
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
    var htmlSearch = simple.getSearch();
    var jsSearch = simple.getJsSearch("simple.js");
    var jsPath = simple.getJsPath("simple.js");
    if(!jsSearch.mode){
        return;
    }
    /*加载简版jquery*/
    document.write('<script src="' + jsPath + '/base/js/base.js" type="text/javascript"></sc' + 'ript>');
    if(jsSearch.mode != "jquery" && jsSearch.mode != "vue" && jsSearch.mode != "react" && jsSearch.mode != "angular"){
        return;
    }
    /*加载mode文件 4种之一 jquery  vue  react  angular*/
    simple.mode = jsSearch.mode;
    document.write('<script src="' + jsPath + '/base/js/'+simple.mode+'.min.js" type="text/javascript"></sc' + 'ript>');
    /*加载核心文件*/
    document.write('<script src="' + jsPath + '/base/js/simple.base.js" type="text/javascript"></sc' + 'ript>');
    /*加载模块和皮肤*/
    simple.skin = htmlSearch.skin;
    if(!simple.skin){
        simple.skin = jsSearch.skin;
    }
    if(!jsSearch.modules){
        return;
    }
    /*核心样式文件bootstrap*/
    document.write('<link href="' + jsPath + '/base/css/bootstrap.min.css" rel="stylesheet" type="text/css" />');
    document.write('<link href="' + jsPath + '/base/css/simple.css" rel="stylesheet" type="text/css" />');
    var modules = jsSearch.modules.split(",");
    for(var i=0;i<modules.length;i++){
        var module = modules[i];
        document.write('<script src="' + jsPath + '/modules/simple.'+module+'.js" type="text/javascript"></sc' + 'ript>');
        document.write('<link href="' + jsPath + '/skin/default/'+module+'.css" rel="stylesheet" type="text/css" />');
        if(simple.skin){
            document.write('<link href="' + jsPath + '/skin/'+simple.skin+'/'+module+'.css" rel="stylesheet" type="text/css" />');
        }
    }
    /*初始化语言包*/
    simple.lang = htmlSearch.lang;
    if(!simple.lang){
        simple.lang = jsSearch.lang;
    }
    if(!simple.lang){
        simple.lang = "zh_CN";
    }
    document.write('<script src="' + jsPath + '/lang/'+simple.lang+'.js" type="text/javascript"></sc' + 'ript>');
})(window);
