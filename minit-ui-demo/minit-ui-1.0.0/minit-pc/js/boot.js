(function(){
    var uiPath = getJsPath("boot.js",2);
    /*加载jquery*/
    document.write('<script src="' + uiPath + '/js/jquery.min.js" type="text/javascript"></sc' + 'ript>');
    /*加载miniui*/
    document.write('<script src="' + uiPath + '/js/minijs-before.js" type="text/javascript"></sc' + 'ript>');
    document.write('<script src="' + uiPath + '/js/miniui.js" type="text/javascript"></sc' + 'ript>');
    document.write('<script src="' + uiPath + '/js/minijs-after.js" type="text/javascript"></sc' + 'ript>');
    document.write('<script src="' + uiPath + '/js/export-execl.js" type="text/javascript"></sc' + 'ript>');
    document.write('<script src="' + uiPath + '/js/miniextend.js" type="text/javascript"></sc' + 'ript>');
    document.write('<script src="' + uiPath + '/js/base.js" type="text/javascript"></sc' + 'ript>');
    document.write('<script src="' + uiPath + '/js/vue.plugin.js" type="text/javascript"></sc' + 'ript>');
    /*加载皮肤*/
    document.write('<link href="' + uiPath + '/css/font-awesome/css/font-awesome.css" rel="stylesheet" type="text/css" />');
    document.write('<link href="' + uiPath + '/css/miniuiskin/miniui.css" rel="stylesheet" type="text/css" />');
    document.write('<link href="' + uiPath + '/css/miniuiskin/miniuiextend.css" rel="stylesheet" type="text/css" />');
    document.write('<link href="' + uiPath + '/css/miniuiskin/skin.css" rel="stylesheet" type="text/css" />');
    document.write('<link href="' + uiPath + '/../plugins/light-year/bootstrap.min.css" rel="stylesheet" type="text/css" />');
    document.write('<link href="' + uiPath + '/../plugins/light-year/materialdesignicons.min.css" rel="stylesheet" type="text/css" />');
    document.write('<link href="' + uiPath + '/../plugins/light-year/style.min.css" rel="stylesheet" type="text/css" />');
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