(function(){
    var path = utils.getCurrentBootScriptPath();
    var version = utils.config.version;
    document.write('<meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no" />');
    document.write('<script src="' + path + '/layui.all.js?jsv='+version+'" type="text/javascript" ></sc' + 'ript>');
    document.write('<script src="' + path + '/message.js?jsv='+version+'" type="text/javascript" ></sc' + 'ript>');
    document.write('<link href="' + path + '/css/layui.css?jsv='+version+'" rel="stylesheet" type="text/css" />');
    document.write('<link href="' + path + '/css/fonts.css?jsv='+version+'" rel="stylesheet" type="text/css" />');
})()

