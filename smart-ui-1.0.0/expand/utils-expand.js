(function () {
    utils.$ = {
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
            utils.message.msg(text,type);
        },
        loading:function(text){
            utils.message.loading(text);
        },
        cancelLoading:function(){
            utils.message.cancelLoading();
        },
        alert:function(text,callback){
            utils.message.alert(text,callback);
        },
        confirm:function(text,callback){
            utils.message.confirm(text,callback);
        },
        prompt:function(text,callback){
            utils.message.prompt(text,callback);
        },
        jsonp:function(url,callback,callbackName,jsonp){
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
            window[callbackName] = function(res){
                utils.removeProp(window,callbackName);
                callback(res);
            };
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src=realUrl;
            var head = document.getElementsByTagName("head")[0];
            head.appendChild(script);
            setTimeout(function () {
                head.removeChild(script);
            },10);
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
            var config = window.reqOptionsHook(url,type);
            if(type == "get" || type == "delete"){
                config.params = data;
            }else{
                config.data = data;
            }
            var http = axios.request(config).then(function (xhr) {
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
                    callback(res);
                }else{
                    that.errorMsg(res.msg);
                }
            }).catch(function(error){
                if(callBackError && callback){
                    callback({flag:false,msg:error.toString()});
                }else{
                    that.errorMsg(error);
                }
            });
            return http;
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
            var form = document.querySelector("form[utils='file-upload-form']");
            if (form) {
                throw "请先销毁后控件后重新初始化";
                return;
            }
            if(!that.attrs){
                that.attrs = {};
            }
            that.destroyFileUpload = function () {
                document.querySelector("form[utils='file-upload-form']").parentElement.remove();
                that.removeProp(that,"uploadFileAction");
                that.removeProp(that,"selectFile");
                that.removeProp(that,"destroyFileUpload");
            }
            that.uploadFileAction = function () {
                var input = document.querySelector("form[utils='file-upload-form'] input[input='file-upload-input']");
                var fileValue = input.value;
                if (fileValue == "") {
                    return;
                }
                var fileName = input.files[0].name;
                var accept = input.attributes["file-accept"].value;
                if (accept) {
                    var pattern = new RegExp("\\.(" + accept + ")$", "gi");
                    if (!pattern.test(fileValue)) {
                        fileCallBack({flag: false, msg: "当前上传的文件不支持(仅支持" + accept + "上传)"});
                        return;
                    }
                }
                var formData = new FormData(document.querySelector("form[utils='file-upload-form']"));
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
                }).catch(function(){
                    that.attrs.uploadStatus = 0;
                    that.cancelLoading();
                    fileCallBack({flag: false, msg: "请求异常"});
                });
            }
            that.selectFile = function (id) {
                var that = this;
                if (that.attrs.uploadStatus == 1) {
                    fileCallBack({flag: false, msg: "上一文件还未上传完毕"});
                    return;
                }
                var input = document.querySelector("form[utils='file-upload-form'] input[input='file-upload-input']");
                input.value = "";
                input.click();
                that.attrs.uploadId = id;
            }
            var formDivEle = document.createElement("div");
            formDivEle.style = "display:none;";
            var multAttrs = "";
            if(multiple){
                multAttrs = "multiple ";
            }
            formDivEle.innerHTML = "<form utils=\"file-upload-form\" enctype=\"multipart/form-data\"><input file-accept=\"" + accept + "\" input=\"file-upload-input\" type=\"file\" name=\"file\" "+multAttrs+"onchange=\"utils.$.uploadFileAction()\"/></form>";
            document.querySelector("body").append(formDivEle);
        }
    }
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
})();