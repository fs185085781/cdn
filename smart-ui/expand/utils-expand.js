(function () {
    /**
     * 1.消息通知,包含successMsg,infoMsg,warningMsg,errorMsg
     * 2.加载层,包含loading,cancelLoading
     * 3.弹窗通知,包含alert,confirm,prompt
     * 4.http提交,包含jsonp,post,get,del,put,req,nativeReq
     * 5.文件上传组件,initFileUpload
     */
    /**封装文档加载完毕才开始执行*/
    function asyncFunction(callback){
        utils.delayAction(function(){
            return document.readyState=="complete";
        },callback);
    }
    asyncFunction(function () {
        utils.$.attr.init = true;
    });
    try{
        if(window != window.top && window.top.utils && window.top.utils.message && window.top.utils.from == utils.from){
            utils.message = window.top.utils.message;
        }
    }catch (e){
    }
    /**封装消息通知,弹窗通知,加载框,jsonp提交,http提交,文件上传组件*/
    utils.$ = {
        attr:{
            init:false,
            mask:true,//全局ajax遮罩层
            tmpMask:true//临时ajax遮罩层
        },
        successMsg:function(text){
            this.msg(text,"success");
        },
        infoMsg:function(text){
            this.msg(text,"info");
        },
        warningMsg:function(text){
            this.msg(text,"warning");
        },
        errorMsg:function(text){
            this.msg(text,"error");
        },
        msg:function(text,type){
            asyncFunction(function () {
                utils.message.msg(text,type);
            });
        },
        loading:function(text){
            if(!this.attr.init){
                return;
            }
            utils.message.loading(text);
        },
        cancelLoading:function(){
            var that = this;
            that.attr.tmpMask = true;
            utils.message.cancelLoading();
        },
        alert:function(text,callback){
            asyncFunction(function () {
                utils.message.alert(text,callback);
            });
        },
        confirm:function(text,callback){
            asyncFunction(function () {
                utils.message.confirm(text,callback);
            });
        },
        prompt:function(text,callback){
            asyncFunction(function () {
                utils.message.prompt(text,callback);
            });
        },
        jsonp:function(url,callback,callbackName,jsonp){
            var that = this;
            var map = {};
            var index = url.indexOf("?");
            var urlHost = url;
            if(index!=-1){
                map = utils.getSearchByStr(url.substring(index));
                urlHost = url.substring(0,index);
            }
            if(!jsonp){
                jsonp = "callback";
            }
            if(map[jsonp]){
                callbackName = map[jsonp];
            }
            if(!callbackName){
                callbackName = "jsonp_"+Date.now()+parseInt(Math.random()*100000);
            }
            map[jsonp] = callbackName;
            var searchStr = "";
            for(var key in map){
                if(!searchStr){
                    searchStr += "?";
                }else{
                    searchStr +="&";
                }
                searchStr += key+"="+map[key];
            }
            var realUrl = urlHost+searchStr;
            var div = document.createElement("div");
            var body = document.body;
            window[callbackName] = function(res){
                try{
                    that.cancelLoading();
                    utils.removeProp(window,callbackName);
                    utils.removeProp(window,"html"+callbackName);
                    body.removeChild(div);
                }catch(e) {
                }
                callback(res);
            }
            window["html"+callbackName] = "<script>window['"+callbackName+"'] = parent['"+callbackName+"']</script><script src='"+realUrl+"'></script>";
            div.innerHTML = "<iframe src=\"javascript:parent.html"+callbackName+"\" style='display:none;'></iframe>";
            body.appendChild(div);
            if(getNeedMask()){
                that.loading("loading");
            }
            setTimeout(function () {
                that.cancelLoading();
            },3000);
        },
        post: function (url, data, callback, callBackError) {
            return this.req(url, callback, data, "post", callBackError);
        },
        get: function (url, callback, callBackError) {
            return this.req(url, callback, null, "get", callBackError);
        },
        del: function (url, callback, callBackError) {
            this.req(url, callback, null, "delete", callBackError);
        },
        put: function (url, data, callback, callBackError) {
            this.req(url, callback, data, "put", callBackError);
        },
        req:function(url, callback, reqData, type, callBackError){
            var that = this;
            if(!type){
                type = "get";
            }
            type = type.toLowerCase();
            if(type != "get" && type != "post" && type != "put" && type != "delete"){
                type = "get";
            }
            var data = reqData;
            if(!data){
                data = {};
            }
            if(typeof data == "string"){
                data = JSON.parse(data);
            }
            var config = window.reqOptionsHook(url,type,data);
            if(url.toLowerCase().startsWith("http")){
                config.url = url;
            }
            if(getNeedMask()){
                that.loading("loading");
            }
            var http = axios.request(config).then(function (xhr) {
                that.cancelLoading();
                if(!callback){
                    return;
                }
                if(typeof xhr.data == "string"){
                    throw "当前返回值非json数据";
                }
                var res = {flag:true,msg:"操作成功",data:xhr.data};
                if(window.reqResultHook){
                    /*此处是拦截器,用于过滤返回值,返回类型{flag:true,msg:"",data:{}}*/
                    res = window.reqResultHook(xhr.data);
                }
                if(res.flag || callBackError){
                    try{
                        callback(res);
                    }catch (e) {
                        console.error(e);
                    }
                }else{
                    that.errorMsg(res.msg);
                }
            })["catch"](function(error){
                that.cancelLoading();
                if(callBackError && callback){
                    callback({flag:false,msg:error.toString()});
                }else{
                    that.errorMsg(error);
                }
            });
            return http;
        },
        nativeReq:function(config,success,error){
            var that = this;
            if(getNeedMask()){
                that.loading("loading");
            }
            return axios.request(config).then(function (xhr) {
                that.cancelLoading();
                if(success){
                    success(xhr);
                }
            })["catch"](function(e){
                that.cancelLoading();
                if(error){
                    error(e);
                }
            });
        },
        initFileUpload: function (fileCallBack,options) {
            if(!options){
                options = {};
            }
            var accept=options.accept;
            var url=options.url;
            var multiple=options.multiple;
            var that = this;
            accept = accept || "";
            accept = accept.toLowerCase();
            if(!url){
                if(window.uploadUrlHook){
                    url = window.uploadUrlHook();
                }
            }
            if(!url){
                throw "请配置上传链接";
                return;
            }
            if (!fileCallBack) {
                throw "回调函数不可为空";
                return;
            }
            var input = document.querySelector("input[input='file-upload-input']");
            if (input) {
                throw "请先销毁后控件后重新初始化";
                return;
            }
            if(!that.attrs){
                that.attrs = {};
            }
            that.destroyFileUpload = function () {
                document.querySelector("input[input='file-upload-input']").parentElement.remove();
                utils.removeProp(that,"uploadFileAction");
                utils.removeProp(that,"selectFile");
                utils.removeProp(that,"destroyFileUpload");
                utils.removeProp(that,"uploadFiles");
            }
            that.uploadFiles = function(files){
                var formData = new FormData();
                for(var i=0;i<files.length;i++){
                    formData.append("file",files[i]);
                }
                that.attrs.uploadStatus = 1;
                var config = {
                    onUploadProgress:function(progressEvent){
                        var complete = (progressEvent.loaded / progressEvent.total * 100 | 0) + '%';
                        that.loading(complete+"...请稍后");
                    }
                }
                axios.post(url,
                    formData, config).then(function(res){
                    that.attrs.uploadStatus = 0;
                    that.cancelLoading();
                    if(window.uploadResHook){
                        res = window.uploadResHook(res);
                    }
                    res.uploadId = that.attrs.uploadId;
                    fileCallBack(res);
                })["catch"](function(){
                    that.attrs.uploadStatus = 0;
                    that.cancelLoading();
                    fileCallBack({flag: false, msg: "请求异常"});
                });
            }
            that.uploadFileAction = function () {
                var input = document.querySelector("input[input='file-upload-input']");
                var fileValue = input.value;
                if (fileValue == "") {
                    return;
                }
                var accept = input.attributes["file-accept"].value;
                if (accept) {
                    var pattern = new RegExp("\\.(" + accept + ")$", "gi");
                    if (!pattern.test(fileValue)) {
                        fileCallBack({flag: false, msg: "当前上传的文件不支持(仅支持" + accept + "上传)"});
                        return;
                    }
                }
                that.uploadFiles(input.files);
            }
            that.selectFile = function (id) {
                var that = this;
                if (that.attrs.uploadStatus == 1) {
                    fileCallBack({flag: false, msg: "上一文件还未上传完毕"});
                    return;
                }
                var input = document.querySelector("input[input='file-upload-input']");
                input.value = "";
                input.click();
                that.attrs.uploadId = id;
            }
            var formDivEle = document.createElement("div");
            formDivEle.style.display = "none";
            var multAttrs = "";
            if(multiple){
                multAttrs = "multiple ";
            }
            formDivEle.innerHTML = "<input file-accept=\"" + accept + "\" input=\"file-upload-input\" type=\"file\" name=\"file\" "+multAttrs+"onchange=\"utils.$.uploadFileAction()\"/>";
            document.querySelector("body").appendChild(formDivEle);
        }
    }
    function getNeedMask(){
        var flag = utils.$.attr.mask && utils.$.attr.tmpMask;
        return flag;
    }
    /**封装简化Vue写法*/
    if(window.Vue){
        Vue.app = function(options){
            if(window.vm){
                throw 'vm全局变量已经存在';
            }
            if(!options.el){
                options.el = "#app";
            }
            return window.vm = new Vue(options);
        }
    }
    /**Vue依赖原生JSON,在模拟IE5下跳过模拟JSON,还原JSON*/
    if(window.Vue && window.tmpJSON){
        window.JSON = window.tmpJSON;
        utils.removeProp(window,"tmpJSON");
    }
})();
