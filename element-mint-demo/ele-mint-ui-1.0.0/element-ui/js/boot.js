(function(){
    var uiPath = getJsPath("boot.js",2);
    /*加载mint*/
    document.write('<script src="' + uiPath + '/index.js" type="text/javascript"></sc' + 'ript>');
    /*加载皮肤*/
    document.write('<link href="' + uiPath + '/index.css" rel="stylesheet" type="text/css" />');
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