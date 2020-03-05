(function () {
    var c = {
        miniui:"/miniui3.9.2/boot.js",
        vant:"/vant2.5.1/boot.js",
        antd:"/antd1.4.12/boot.js",
        mint:"/mint2.2.13/boot.js",
        element:"/element2.13.0/boot.js",
        plugins:{
            md5:[{js:"/plugins/md5/md5.js"}],
            eruda:[{js:"/plugins/eruda/eruda.js"}]
        },
        debug:true
    };
    utils.host = getHost(utils.uihost);
    //全局axios配置
    window.reqOptionsHook=function(url,method){
        var config = {
            headers:{
                'Content-Type': 'application/json'
            },
            url:"http://localhost:8080" + url,
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
        return "http://localhost:8080/selevt/webService/upload";
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