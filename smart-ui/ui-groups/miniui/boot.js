(function(){
    var ua = navigator.userAgent.toLowerCase();
    function check(str) {
        return ua.indexOf(str)!=-1;
    }
    var isIE = !check("opera") && check("msie");
    //是否IE8以下
    var ltIE8 = isIE && document.documentMode && document.documentMode < 8;
    var path = utils.getCurrentBootScriptPath();
    var version = utils.config.version;
    document.write('<meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no" />');
    if(!window.jQuery){
        document.write('<script src="' + path + '/jquery.min.js?jsv='+version+'" type="text/javascript"></sc' + 'ript>');
    }
    document.write('<script src="' + path + '/miniui/minijs-before.js?jsv='+version+'" type="text/javascript" ></sc' + 'ript>');
    document.write('<script src="' + path + '/miniui/miniui.js?jsv='+version+'" type="text/javascript" ></sc' + 'ript>');
    document.write('<script src="' + path + '/miniui/minijs-after.js?jsv='+version+'" type="text/javascript" ></sc' + 'ript>');
    document.write('<script src="' + path + '/message.js?jsv='+version+'" type="text/javascript" ></sc' + 'ript>');
    document.write('<script src="' + path + '/miniui/export-execl.js?jsv='+version+'" type="text/javascript" ></sc' + 'ript>');
    document.write('<link href="' + path + '/font-awesome/css/font-awesome.min.css?jsv='+version+'" rel="stylesheet" type="text/css" />');
    document.write('<link href="' + path + '/font-awesome/css/fonts.css?jsv='+version+'" rel="stylesheet" type="text/css" />');
    document.write('<link href="' + path + '/miniui/themes/default/miniui.css?jsv='+version+'" rel="stylesheet" type="text/css" />');
    if(ltIE8){
        document.write('<link href="' + path + '/miniui/themes/jqueryui-cupertino/skin.css?jsv='+version+'" rel="stylesheet" type="text/css" />');
    }else{
        document.write('<link href="' + path + '/miniui/themes/cupertino/skin.css?jsv='+version+'" rel="stylesheet" type="text/css" />');
    }
    document.write('<link href="' + path + '/miniui/themes/default/large-mode.css?jsv='+version+'" rel="stylesheet" type="text/css" />');
    document.write('<link href="' + path + '/miniui/themes/icons.css?jsv='+version+'" rel="stylesheet" type="text/css" />');
})()

