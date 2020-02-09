(function(){
    var uiPath = getJsPath("boot.js",2);
    /*手机适应*/
    document.write('<meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no" />');
    /*加载mint*/
    document.write('<script src="'+config.mint[config.env+"JsPath"]+'" type="text/javascript"></sc' + 'ript>');
    /*加载皮肤*/
    document.write('<link href="'+config.mint[config.env+"CssPath"]+'" rel="stylesheet" type="text/css" />');
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