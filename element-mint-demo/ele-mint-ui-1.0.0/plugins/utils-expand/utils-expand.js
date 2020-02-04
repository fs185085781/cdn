(function (tools) {
    tools.$ = {
        attrs:{vue:new Vue({})},
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
            var that = this;
            if(!type){
                type = "default";
            }
            if(tools.from == "m" || tools.from == "m2"){
                that.attrs.vue.$toast({
                    message:text,
                    duration:3000,
                    className:type,
                    position:"bottom"
                });
            }else if(tools.from == "pc"){
                that.attrs.vue.$message({
                    message: text,
                    type: type
                });
            }
        },
        loading:function(text){
            if(!text){
                text = "";
            }
            var that = this;
            that.cancelLoading();
            if(tools.from == "m"){
                that.attrs.vue.$indicator.open({
                    text:text
                });
            }else if(tools.from == "pc"){
                var loading = that.attrs.vue.$loading({
                    lock: true,
                    text: text,
                    spinner: 'el-icon-loading'
                });
                that.attrs.loading = loading;
            }else if(tools.from == "m2"){
                that.attrs.vue.$toast.loading({
                    message: text,
                    forbidClick: true,
                    duration:0
                });
            }
        },
        cancelLoading:function(){
            var that = this;
            if(tools.from == "m"){
                that.attrs.vue.$indicator.close();
            }else if(tools.from == "pc"){
                if(that.attrs.loading){
                    that.attrs.loading.close();
                    tools.removeProp(that.attrs,"loading");
                }
            }else if(tools.from == "m2"){
                that.attrs.vue.$toast.clear();
            }
        },
        alert:function(text,callback){
            var that = this;
            if(tools.from == "m"){
                that.attrs.vue.$messagebox.alert(text).then(function(){
                    if(!callback){
                        return;
                    }
                    callback(1);
                });
            }else if(tools.from == "pc"){
                that.attrs.vue.$alert(text, '提示', {
                    confirmButtonText: '确定',
                    callback:function(action){
                        if(!callback){
                            return;
                        }
                        if(action == "confirm"){
                            callback(1);
                        }else{
                            callback(0);
                        }
                    }
                });
            }else if(tools.from == "m2"){
                that.attrs.vue.$dialog.alert({
                    title: '提示',
                    message: text
                }).then(function(){
                    if(!callback){
                        return;
                    }
                    callback(1);
                });
            }
        },
        confirm:function(text,callback){
            var that = this;
            if(tools.from == "m"){
                that.attrs.vue.$messagebox.confirm(text).then(function(){
                    if(callback){
                        callback(1);
                    }
                }).catch(function () {
                    if(callback){
                        callback(0);
                    }
                });
            }else if(tools.from == "pc"){
                that.attrs.vue.$confirm(text, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function(){
                    if(callback){
                        callback(1);
                    }
                }).catch(function(){
                    if(callback){
                        callback(0);
                    }
                });
            }else if(tools.from == "m2"){
                that.attrs.vue.$dialog.confirm({
                    title: '提示',
                    message: text
                }).then(function(){
                    if(callback){
                        callback(1);
                    }
                }).catch(function () {
                    if(callback){
                        callback(0);
                    }
                });
            }
        },
        prompt:function(text,callback){
            var that = this;
            if(tools.from == "m"){
                that.attrs.vue.$messagebox.prompt(text).then(function(data){
                    if(callback){
                        callback(1,data.value);
                    }
                }).catch(function () {
                    if(callback){
                        callback(0);
                    }
                });
            }else if(tools.from == "pc"){
                that.attrs.vue.$prompt(text, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then(function(data){
                    if(callback){
                        callback(1,data.value);
                    }
                }).catch(function () {
                    if(callback){
                        callback(0);
                    }
                });
            }else if(tools.from == "m2"){
                var id = "vant-prompt-"+Date.now()+parseInt(Math.random()*10000);
                var input = '\n<input id="'+id+'" class="vant-prompt-input"/>';
                that.attrs.vue.$dialog({
                    title:"提示",
                    message:text + input,
                    showCancelButton:true
                }).then(function(){
                    var value = document.getElementById(id).value;
                    if(!value){
                        value = null;
                    }
                    if(callback){
                        callback(1,value);
                    }
                }).catch(function () {
                    if(callback){
                        callback(0);
                    }
                });
            }
        },
        jsonp:function(url,callback,callbackName,jsonp){
            var map = {};
            var index = url.indexOf("?");
            var urlHost = url;
            if(index!=-1){
                map = tools.getSearchByStr(url.substring(index));
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
            (function (fname) {
                window[fname] = function(res){
                    tools.removeProp(window,fname);
                    callback(res);
                };
            })(callbackName);
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
            var config = {
                headers: {
                    'Content-Type': 'application/json'
                },
                url:url,
                method:type,
                responseType:"text"
            }
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
                /*
                * 此处可以根据实际情况灵活运用
                * */
                callback({status:xhr.status,data:xhr.data});
            }).catch(function(error){
                if(callBackError && callback){
                    callback({status:0,msg:error});
                }else{
                    that.dangerMsg(error);
                }
            });
            return http;
        },
        initFileUpload: function (fileCallBack,accept) {
            var that = this;
            accept = accept || "";
            accept = accept.toLowerCase();
            if (!fileCallBack) {
                throw "回调函数不可为空";
                return;
            }
            var form = document.querySelector("form[utils='file-upload-form']");
            if (form) {
                throw "请先销毁后控件后重新初始化";
                return;
            }
            that.destroyFileUpload = function () {
                document.querySelector("form[utils='file-upload-form']").parentElement.remove();
                tools.removeProp(that,"uploadFileAction");
                tools.removeProp(that,"selectFile");
                tools.removeProp(that,"destroyFileUpload");
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
                axios.post("http://localhost:8080/selevt/webService/uploadFile",
                    formData, config).then(function(res){
                    that.attrs.uploadStatus = 0;
                    that.cancelLoading();
                    var data = res.data;
                    if (data.status == "SUCCESS") {
                        data.uploadId = that.attrs.uploadId;
                        var retData = data.data || {};
                        retData.flag = true;
                        retData.uploadId = that.attrs.uploadId;
                        retData.msg = data.msg;
                        retData.fileName = fileName;
                        fileCallBack(retData);
                    } else {
                        fileCallBack({flag: false, msg: data.msg});
                    }

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
            formDivEle.innerHTML = "<form utils=\"file-upload-form\" enctype=\"multipart/form-data\"><input file-accept=\"" + accept + "\" input=\"file-upload-input\" type=\"file\" name=\"file\" onchange=\"utils.$.uploadFileAction()\"/></form>";
            document.querySelector("body").append(formDivEle);
        }
    }
    var path = tools.getJsPath("utils-expand.js",1);
    document.write('<link href="' + path + '/utils-expand.css" rel="stylesheet" type="text/css" />');
})(utils);