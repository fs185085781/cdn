(function(){
    var script = getCurrentScript();
    var uiHost = getHost(script.src,3);
    /*使用相对host*/
    //var ajaxHost = getHost(script.src,4);
    /*使用绝对host*/
    var ajaxHost = "http://localhost:8080";
    var search = script.src.substring(script.src.indexOf("?"));
    /*使用远程cdn*/
    var utiljs = "http://fs185085781.gitee.io/cdn/smart-ui-1.0.0/boot/utils.js"+search;
    /*使用本地引入*/
    //var utiljs = uiHost + "/../smart-ui-1.0.0/boot/utils.js"+search;
    window.smartInitHook=function(config){
        config.debug = true;
        config.plugins.md5 = [{js:uiHost+"/asserts/plugins/md5/md5.js"}];
        utils.uiHost=uiHost;
        utils.ajaxHost=ajaxHost;
    }
    document.write("<script src='"+utiljs+"'></script>");
    //全局axios配置
    window.reqOptionsHook=function(url,method){
        var config = {
            headers:{
                'Content-Type': 'application/json'
            },
            url:ajaxHost + url,
            method:method,
            responseType:"text"
        };
        return config;
    }
    //全局axios返回拦截
    window.reqResultHook = function(res){
        var temp = {flag:false,msg:"操作失败"};
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
    }
    //全局配置上传链接
    window.uploadUrlHook = function(){
        return ajaxHost+"/selevt/webService/upload";
    }
    //全局拦截上传返回数据
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
    function getHost(src,length){
        var ss = src.split("/");
        ss.length = ss.length - length;
        var path = ss.join("/");
        return path;
    }
    function getCurrentScript() {
        var js = "init.js";
        var script = document.currentScript;
        if(!script){
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