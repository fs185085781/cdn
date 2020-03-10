(function(){
    var path = utils.getCurrentBootScriptPath();
    document.write('<script src="' + path + '/vue.min.js" type="text/javascript"></sc' + 'ript>');
    document.write('<script src="' + path + '/index.js" type="text/javascript" ></sc' + 'ript>');
    document.write('<script src="' + path + '/message.js" type="text/javascript" ></sc' + 'ript>');
    document.write('<link href="' + path + '/index.css" rel="stylesheet" type="text/css" />');
    document.write('<script src="' + path + '/dialog-drag.js" type="text/javascript" ></sc' + 'ript>');
    document.write('<link href="' + path + '/dialog-drag.css" rel="stylesheet" type="text/css" />');
    document.write('<link href="' + path + '/fonts.css" rel="stylesheet" type="text/css" />');
})()

