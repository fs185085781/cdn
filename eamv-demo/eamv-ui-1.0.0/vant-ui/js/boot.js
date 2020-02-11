(function(){
    var uiPath = getJsPath("boot.js",2);
    /*手机适应*/
    document.write('<meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no" />');
    /*加载vant*/
    document.write('<script src="'+config.vant[config.env+"JsPath"]+'" type="text/javascript"></sc' + 'ript>');
    /*加载皮肤*/
    document.write('<link href="'+config.vant[config.env+"CssPath"]+'" rel="stylesheet" type="text/css" />');
})()