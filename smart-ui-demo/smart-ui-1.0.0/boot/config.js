(function () {
    var c = {
        miniui:"/miniui3.9.2/boot.js",
        vant:"/vant2.5.1/boot.js",
        antd:"/antd1.4.12/boot.js",
        mint:"/mint2.2.13/boot.js",
        element:"/element2.13.0/boot.js",
        plugins:{
            md5:[{js:"/plugins/md5/md5.js"}]
        }
    };
    utils.host = getHost(utils.uihost);
    window.reqOptionsHook=function(url,method){
        var config = {
            headers:{
                'Content-Type': 'application/json'
            },
            url:utils.host + url,
            method:method,
            responseType:"text"
        };
        return config;
    }
    window.reqResultHook = function(res){
        console.log(res);
        return res;
    }
    window.uploadUrlHook = function(){
        return utils.host+"/json/uploadService/upload";
    }
    function getHost(uihost){
        var ss = uihost.split("/");
        ss.length = ss.length - 1;
        var path = ss.join("/");
        return path;
    }
    if(window.initConfig){
        window.initConfig(c);
    }
})()