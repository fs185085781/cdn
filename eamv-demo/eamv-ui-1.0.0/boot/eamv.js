(function () {
    window.config ={
        env:"prod",
        configType:"local"
    }
    window.reqHook = function(data){
        var res = {flag:false,msg:"请修改config.js的reqHook方法",data:data};
        return res;
    }
    window.uploadUrlHook = function(){
        return "请修改config.js的uploadUrlHook方法";
    }
    window.getJsPath=function(js, length) {
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
    var bootPath = getJsPath("eamv.js",1);
    document.write('<script src="' + bootPath + '/'+config.configType+'-path.js" type="text/javascript"></sc' + 'ript>');
    document.write('<script src="' + bootPath + '/utils.js" type="text/javascript"></sc' + 'ript>');
})()