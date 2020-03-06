(function(){
    var path = getJsPath("boot.js",1);
    document.write('<script src="' + path + '/jquery.min.js" type="text/javascript"></sc' + 'ript>');
    document.write('<script src="' + path + '/miniui/minijs-before.js" type="text/javascript" ></sc' + 'ript>');
    document.write('<script src="' + path + '/miniui/miniui.js" type="text/javascript" ></sc' + 'ript>');
    document.write('<script src="' + path + '/miniui/minijs-after.js" type="text/javascript" ></sc' + 'ript>');
    document.write('<script src="' + path + '/miniui/export-execl.js" type="text/javascript" ></sc' + 'ript>');
    document.write('<link href="' + path + '/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css" />');
    document.write('<link href="' + path + '/miniui/themes/default/miniui.css" rel="stylesheet" type="text/css" />');
    document.write('<link href="' + path + '/miniui/themes/metro-green/skin.css" rel="stylesheet" type="text/css" />');
    document.write('<link href="' + path + '/miniui/themes/default/medium-mode.css" rel="stylesheet" type="text/css" />');
    document.write('<link href="' + path + '/miniui/themes/icons.css" rel="stylesheet" type="text/css" />');
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

