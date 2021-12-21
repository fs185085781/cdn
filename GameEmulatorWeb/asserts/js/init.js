(function(){
    //引本ui之前,请将当前init.js移动到自己的项目中(切记:是移动,不是复制)(嘻嘻,主要是怕后面的开发弄混淆了)
    var script = getCurrentScript();
    //根据init.js所在的位置,调整入参2,保证rootPath是一个合适的值,主要用于获取项目路径,将相对路径转绝对路径
    var rootPath = getHost(script.src,3);
    /*相对host,使用灵活,无论怎么修改目录发布都不出问题,适合前后端混合开发,需要自行调整入参2的值*/
    //var ajaxHost = getHost(script.src,3)+"/php";
    /*动态绝对host,当在二级目录发布项目会出问题,适合前后端混合开发*/
    //var ajaxHost = window.location.origin;
    /*静态绝对host,每次后台更换地方发布,此处需要改配置,适合前后端分离开发*/
    var ajaxHost = "https://www.tenfell.cn/php-file/game-emulator";
    var search = script.src.substring(script.src.indexOf("?"));
    //拦截配置信息,方便自行拓展配置信息
    window.smartInitHook=function(config){
        config.versionUrl=rootPath+"/asserts/js/version.js";
        config.debug = true;
        //这里md5是一个自定义的插件
        config.plugins.md5 = [{js:rootPath+"/asserts/plugins/md5/md5.js"}];
        config.plugins.emulator = [
            {js:rootPath+"/asserts/plugins/emulator/emu-utils.js"}
            ];
        config.plugins.user = [{js:rootPath+"/asserts/plugins/user/user.js"}];
        utils.rootPath=rootPath;
        utils.ajaxHost=ajaxHost;
    }
    /*堡垒机动态选择cdn----开始*/
    window.fortress = function(path){
        var utiljs = path + "/smart-ui/boot/utils.js"+search;
        document.write("<script src='"+utiljs+"'></script>");
    }
    document.write("<script src='https://fs185085781.gitee.io/cdn/fortress.js'></script>");
    /*堡垒机动态选择cdn----结束*/
    //全局axios配置,配置信息请参考axios官网
    window.reqOptionsHook=function(url,method,data){
        //此处是json的例子---开始
        var tempUrl = utils.ajaxHost + url;
        if(url.startsWith("http")){
            tempUrl = url;
        }else if(url.startsWith("file")){
            tempUrl = url;
        }else if(url.startsWith("//")){
            tempUrl = window.location.protocol+url;
        }
        var config = {
            headers:{
                'Content-Type': 'text/plain'
            },
            url:tempUrl,
            method:method,
            responseType:"text"
        };
        if(method == "get" || method == "delete"){
            config.params = data;
        }else{
            config.data = JSON.stringify(data);
        }
        //此处是json的例子---结束
        //此处是表单的例子---开始
        /*var config = {
            headers:{
                'Content-Type': 'application/x-www-form-urlencoded',
                "token":"123456"
            },
            url:ajaxHost + url,
            method:method,
            responseType:"text"
        };
        if(method == "get" || method == "delete"){
            config.params = data;
        }else{
            config.data = data;
        }
        config.transformRequest=[function (data) {
            var str = "";
            var isFirst = true;
            for(var key in data){
                if(isFirst){
                    isFirst = false;
                }else{
                    str += '&';
                }
                str += encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
            }
            return str;
        }];*/
        //此处是表单的例子---结束
        return config;
    }
    //全局axios返回拦截,主要为了数据统一,对于utils.$.get|post|put|del|req最后一个参数有奇效
    window.reqResultHook = function(res){
        /*var temp = {flag:false,msg:"操作失败"};
        if(res.status == "SUCCESS"){
            temp.flag = true;
            if(res.data){
                temp.data = res.data;
            }
        }
        if(res.msg){
            temp.msg = res.msg;
        }
        return temp;
        */
        return res;
    }
    //全局配置上传链接,主要是上传插件的使用
    window.uploadUrlHook = function(){
        return ajaxHost+"/selevt/webService/upload";
    }
    //全局拦截上传返回数据,主要为了数据统一
    window.uploadResHook = function(res){
        var temp ={flag:false,msg:"上传失败"};
        if(res.status == 200){
            var json = res.data;
            if(json && json.status == "SUCCESS"){
                temp.flag = true;
                temp.msg = "上传成功";
                temp.fileId = json.data.fileId;
                temp.fileIds = json.data.fileIds;
            }
        }
        return temp;
    }
    //根据路径进行按深度截取
    function getHost(src,length){
        var ss = src.split("/");
        ss.length = ss.length - length;
        var path = ss.join("/");
        return path;
    }
    //获取当前init.js的上下文,如果想对init.js改名,建议此处也改一下
    //虽然新版浏览器支持从document.currentScript读取上下文,
    //但是老版浏览器还是不支持,此处做一下兼容
    function getCurrentScript() {
        var js = "init.js";
        var script = document.currentScript;
        if(!script && document.querySelector){
            script = document.querySelector("script[src*='"+js+"']");
        }
        if(!script){
            var scripts = document.getElementsByTagName("script");
            for (var i = 0, l = scripts.length; i < l; i++) {
                var src = scripts[i].src;
                if (src.indexOf(js) != -1) {
                    script = scripts[i];
                    break;
                }
            }
        }
        return script;
    }
})()
