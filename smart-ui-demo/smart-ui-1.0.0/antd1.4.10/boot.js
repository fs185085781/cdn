(function(){
    var path = getJsPath("boot.js",1);
    document.write('<script src="' + path + '/vue.min.js" type="text/javascript"></sc' + 'ript>');
    document.write('<script src="' + path + '/antd.min.js" type="text/javascript" ></sc' + 'ript>');
    document.write('<link href="' + path + '/antd.min.css" rel="stylesheet" type="text/css" />');
    document.write('<script src="' + path + '/dialog-drag.js" type="text/javascript" ></sc' + 'ript>');
    document.write('<link href="' + path + '/dialog-drag.css" rel="stylesheet" type="text/css" />');
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

