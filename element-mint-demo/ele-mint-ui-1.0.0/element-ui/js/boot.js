(function(){
    var uiPath = getJsPath("boot.js",2);
    /*加载element*/
    document.write('<script src="'+config.element[config.env+"JsPath"]+'" type="text/javascript"></sc' + 'ript>');
    /*让模态窗口支持拖拽*/
    document.write('<script src="' + uiPath + '/dialog-drag.js" type="text/javascript"></sc' + 'ript>');
    /*加载皮肤*/
    document.write('<link href="'+config.element[config.env+"CssPath"]+'" rel="stylesheet" type="text/css" />');
    /*拖拽所需样式*/
    document.write('<link href="' + uiPath + '/dialog-drag.css" rel="stylesheet" type="text/css" />');
    function getJsPath(js, length) {
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
})()