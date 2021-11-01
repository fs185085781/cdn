(function(){
    function axiosConfigToAjaxConfig(config){
        var ajaxConfig = {};
        var tempUrl = config.url?config.url.toLowerCase():"";
        config.baseURL = config.baseURL || "";
        var url = tempUrl.startsWith("http")?config.url:config.baseURL+config.url;
        var params = config.params;
        if(params){
            var str = "";
            for(var key in params){
                str += "&"+key+"="+params[key];
            }
            if(url.indexOf("?")!=-1){
                url += str;
            }else{
                url += "?"+str.substring(1);
            }
        }
        ajaxConfig.url = url;
        /*返回true是json提交,返回false是表单提交*/
        function isReqJson(){
            if(!config.headers){
                return true;
            }
            var map = JSON.parse(JSON.stringify(config.headers).toLowerCase());
            var ct = map["content-type"];
            if(!ct){
                return true;
            }
            if(ct.indexOf("application/x-www-form-urlencoded") !=-1){
                return false;
            }else{
                return true;
            }
        }
        if(config.transformRequest && config.transformRequest.length>0){
            for(var i=0;i<config.transformRequest.length;i++){
                var transformRequestFn = config.transformRequest[i];
                config.data = transformRequestFn(config.data,config.headers);
            }
        }
        var isJson = isReqJson();
        if(config.data){
            if(isJson && typeof config.data != "string"){
                config.data = JSON.stringify(config.data);
            }
        }
        if(config.data){
            ajaxConfig.data = config.data;
        }
        if(config.headers){
            ajaxConfig.headers = config.headers;
        }
        if(config.auth){
            if(config.auth.username){
                ajaxConfig.username = config.auth.username;
            }
            if(config.auth.password){
                ajaxConfig.password = config.auth.password;
            }
        }
        if(config.method){
            ajaxConfig.type = config.method;
        }
        ajaxConfig.dataType = "text";
        if(config.timeout){
            ajaxConfig.timeout = config.timeout;
        }
        if(isJson){
            ajaxConfig.contentType = "application/json";
        }else{
            ajaxConfig.contentType = "application/x-www-form-urlencoded";
        }
        return ajaxConfig;
    }
    function commonReq(that,type,url,config,data){
        if(!config){
            config = {};
        }
        config.url = url;
        config.method = type;
        if(data){
            config.data = data;
        }
        return that.request(config);
    }
    function getAxiosConfig(that,config){
        //获取配置
        //配置分为2类 1.全局配置 2.参数配置
        var lastConfig = {};
        for(var key in that.defaults){
            lastConfig[key] = that.defaults[key];
        }
        for(var key in config){
            lastConfig[key] = config[key];
        }
        return lastConfig;
    }
    function getAxiosPromise(that,config){
        config = getAxiosConfig(that,config);
        var ajaxConfig = axiosConfigToAjaxConfig(config);
        var p = new Promise(function(resolved,rejected){
            ajaxConfig.success = function(res,status,xhr){
                var rphs = xhr.getAllResponseHeaders().split("\n");
                var rpMap = {};
                for(var i=0;i<rphs.length;i++){
                    var rph = rphs[i];
                    var rphsz = rph.split(":");
                    if(rphsz.length == 2){
                        rpMap[rphsz[0].trim()] = rphsz[1].trim();
                    }
                }
                function strToJson(str){
                    try{
                        return JSON.parse(str);
                    }catch (e) {
                        return null;
                    }
                }
                var data = null;
                if(config.responseType == "arraybuffer" || config.responseType == "blob" || config.responseType == "document" || config.responseType == "text" || config.responseType == "stream"){
                    /*因浏览器版本过低,不支持此类型,当text处理*/
                    xhr.response = res;
                    data = strToJson(res);
                    if(!data){
                        data = res;
                    }
                }else{
                    data = strToJson(res);
                    if(!data){
                        data = res;
                    }
                    xhr.response = data;
                }
                var resData = {config:config,data:data,headers:rpMap,request:xhr,status:xhr.status,statusText:xhr.statusText};
                if(config.transformResponse && config.transformResponse.length>0){
                    for(var i=0;i<config.transformResponse.length;i++){
                        var transformResponseFn = config.transformResponse[i];
                        resData = transformResponseFn(resData);
                    }
                }
                resolved(resData);
            }
            ajaxConfig.error=function(xhr, textStatus, error){
                rejected(error);
            }
            jQuery.ajax(ajaxConfig);
        });
        return p;
    }
    window.JqueryAxios = function(){
        this.defaults = {
            "transformRequest":[],
            "transformResponse":[],
            "timeout":0,
            "xsrfCookieName":"XSRF-TOKEN",
            "xsrfHeaderName":"X-XSRF-TOKEN",
            "maxContentLength":-1,
            "headers":{
                "common":{
                    "Accept":"application/json, text/plain, */*"
                },
                "delete":{},
                "get":{},
                "head":{},
                "post":{"Content-Type":"application/x-www-form-urlencoded"},
                "put":{"Content-Type":"application/x-www-form-urlencoded"},
                "patch":{"Content-Type":"application/x-www-form-urlencoded"}
            }
        };
    }
    JqueryAxios.prototype.request =function(config){
        return getAxiosPromise(this,config);
    }
    JqueryAxios.prototype.get = function (url,config) {
        return commonReq(this,"get",url,config);
    }
    JqueryAxios.prototype["delete"] = function (url,config) {
        return commonReq(this,"delete",url,config);
    }
    JqueryAxios.prototype.head=function (url,config) {
        return commonReq(this,"head",url,config);
    }
    JqueryAxios.prototype.options=function (url,data,config) {
        return commonReq(this,"options",url,config,data);
    }
    JqueryAxios.prototype.post=function (url,data,config) {
        return commonReq(this,"post",url,config,data);
    }
    JqueryAxios.prototype.put=function (url,data,config) {
        return commonReq(this,"put",url,config,data);
    }
    JqueryAxios.prototype.patch=function (url,data,config) {
        return commonReq(this,"patch",url,config,data);
    }
    window.axios = new JqueryAxios();
    axios.all = function(list){
        return Promise.all(list);
    }
    axios.spread = function(callback){
        return function(t){return callback.apply(null,t)};
    }
    axios.create = function(config){
        var a = new JqueryAxios();
        function setConfig(b,config) {
            for(var key in config){
                b.defaults[key] = config[key];
            }
        }
        try{
            if(config instanceof Object){
                setConfig(a,config);
            }
        }catch (e) {
            if(typeof config == "object"){
                setConfig(a,config);
            }
        }
        return a;
    }
})()