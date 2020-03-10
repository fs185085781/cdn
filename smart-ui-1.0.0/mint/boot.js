(function(){
    var path = utils.getCurrentBootScriptPath();
    /*手机适应*/
    document.write('<meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no" />');
    document.write('<script src="' + path + '/vue.min.js" type="text/javascript"></sc' + 'ript>');
    document.write('<script src="' + path + '/index.js" type="text/javascript" ></sc' + 'ript>');
    document.write('<script src="' + path + '/message.js" type="text/javascript" ></sc' + 'ript>');
    document.write('<link href="' + path + '/style.css" rel="stylesheet" type="text/css" />');
})()

