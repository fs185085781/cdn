(function(){
    var path = utils.getCurrentBootScriptPath();
    var version = utils.config.version;
    /*手机适应*/
    document.write('<meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no" />');
    document.write('<link href="' + path + '/ydui.rem.css?jsv='+version+'" rel="stylesheet" type="text/css" />');
    document.write('<script src="' + path + '/ydui.flexible.js?jsv='+version+'" type="text/javascript"></sc' + 'ript>');
    document.write('<script src="' + path + '/vue.min.js?jsv='+version+'" type="text/javascript" ></sc' + 'ript>');
    document.write('<script src="' + path + '/ydui.rem.js?jsv='+version+'" type="text/javascript" ></sc' + 'ript>');
    document.write('<script src="' + path + '/message.js?jsv='+version+'" type="text/javascript" ></sc' + 'ript>');
})()

