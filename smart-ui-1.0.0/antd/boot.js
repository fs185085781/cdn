(function(){
    var path = utils.getCurrentBootScriptPath();
    document.write('<script src="' + path + '/vue.min.js" type="text/javascript"></sc' + 'ript>');
    document.write('<script src="' + path + '/antd.min.js" type="text/javascript" ></sc' + 'ript>');
    document.write('<link href="' + path + '/antd.min.css" rel="stylesheet" type="text/css" />');
    document.write('<script src="' + path + '/dialog-drag.js" type="text/javascript" ></sc' + 'ript>');
    document.write('<link href="' + path + '/dialog-drag.css" rel="stylesheet" type="text/css" />');
})()

