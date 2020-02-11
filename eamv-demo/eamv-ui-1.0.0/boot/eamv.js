(function () {
    window.config ={
        env:"prod",
        configType:"local",
        uiPath:getJsPath("eamv.js",2)
    }
    window.reqHook = function(data){
        var res = {flag:false,msg:"请修改config.js的reqHook方法",data:data};
        return res;
    }
    window.uploadUrlHook = function(){
        return "请修改config.js的uploadUrlHook方法";
    }
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
    window.getJsPath = getJsPath;
    var bootPath = config.uiPath+"/boot";
    document.write('<script src="' + bootPath + '/'+config.configType+'-path.js" type="text/javascript"></sc' + 'ript>');
    document.write('<script src="' + bootPath + '/utils.js" type="text/javascript"></sc' + 'ript>');
    //document.write('<script src="' + 'http://fs185085781.gitee.io/pages/eamv-demo/eamv-ui-1.0.0/boot/utils.js" type="text/javascript"></sc' + 'ript>');
})()