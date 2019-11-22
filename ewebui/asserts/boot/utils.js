(function (win) {
    var utils = {
        loadJs:function(path,id){
            if(!path){
                return;
            }
            if(id && document.getElementById(id)){
                return;
            }
            var script = document.createElement("script");
            script.src = path;
            if(id){
                script.id = id;
            }
            document.head.appendChild(script);
        },
        loadCss:function(path,id,rel){
            if(!path){
                return;
            }
            if(id && document.getElementById(id)){
                return;
            }
            var link = document.createElement("link");
            link.href = path;
            if(id){
                link.id = id;
            }
            if(id){
                link.rel = rel;
            }
            document.head.appendChild(link);
        },
        //获取页面指定key值的参数值
        getParamer: function (key) {
            var map = this.getSearch();
            return map[key];
        },
        //获取页面所有key的参数值的集合
        getSearch: function () {
            var search = decodeURIComponent(win.location.search);
            return getSearchByStr(search);
        },
        setLocalStorage:function(key,obj){
			var map = {};
			map[key] = obj;
            localStorage.setItem(key,JSON.stringify(map));
        },
        getLocalStorage:function(key){
			var map = JSON.parse(localStorage.getItem(key));
			if(!map){
				map = {};
			}
            return map[key];
        },
        delLocalStorage:function(key){
            localStorage.removeItem(key);
        },
        delAllLocalStorage:function(){
            localStorage.clear();
        },
        initFileUpload: function (accept, fileCallBack, url) {
            var that = this;
            accept = accept || "";
            if (!fileCallBack) {
                throw "回调函数不可为空";
                return;
            }
            var form = $("form[utils='file-upload-form']");
            if (form.length > 0) {
                throw "请先销毁后控件后重新初始化";
                return;
            }
            that.url = url;
            that.destroyFileUpload = function () {
                $("form[utils='file-upload-form']").remove();
                that.uploadFileAction = undefined;
                that.selectFile = undefined;
                that.destroyFileUpload = undefined;
            }
            that.uploadFileAction = function () {
                var input = $("form[utils='file-upload-form'] input[input='file-upload-input']");
                var fileValue = input.val();
                if (fileValue == "") {
                    return;
                }
                var fileName = input[0].files[0].name;
                var accept = input.attr("file-accept");
                if (accept) {
                    var pattern = new RegExp("\\.(" + accept + ")$", "gi");
                    if (!pattern.test(fileValue)) {
                        fileCallBack({flag: false, msg: "当前上传的文件不支持(仅支持" + accept + "上传)"});
                        return;
                    }
                }
                var formData = new FormData($("form[utils='file-upload-form']")[0]);
                that.uploadStatus = 1;
                $.ajax({
                    url: utils.host + (url || "/json/fileUploadService/upload"),
                    type: 'POST',
                    data: formData,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function (ret) {
                        if (ret.status == "SUCCESS") {
                            var retData = {flag:true,uploadId:that.uploadId,msg:ret.msg,fileName:fileName,url:ret.data};
                            fileCallBack(retData);
                        } else {
                            fileCallBack({flag: false, msg: ret.msg});
                        }
                        that.uploadStatus = 0;
                    },
                    error: function (res) {
                        if (res.responseJSON && res.responseJSON.msg) {
                            fileCallBack({flag: false, msg: res.responseJSON.msg});
                        } else {
                            fileCallBack({flag: false, msg: "请求异常"});
                        }
                        that.uploadStatus = 0;
                    }
                });
            }
            that.selectFile = function (id) {
                var that = this;
                if (that.uploadStatus == 1) {
                    fileCallBack({flag: false, msg: "上一文件还未上传完毕"});
                    return;
                }
                var input = $("form[utils='file-upload-form'] input[input='file-upload-input']");
                input.val('');
                input.click();
                that.uploadId = id;
            }
            $("body").append("<form utils=\"file-upload-form\" enctype=\"multipart/form-data\" style=\"display: none;\"><input file-accept=\"" + accept + "\" input=\"file-upload-input\" type=\"file\" name=\"file\" onchange=\"utils.uploadFileAction()\"/></form>");
        },
        getRemoteData:function(url,callBack){
            var xmlhttp;
            if (win.XMLHttpRequest){
                xmlhttp=new XMLHttpRequest();
            }else{
                xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
            }
            xmlhttp.onreadystatechange=function(){
                if(xmlhttp.readyState==4 && xmlhttp.status==200){
                    callBack(xmlhttp.responseText);
                }
            }
            xmlhttp.open("GET",url,false);
            xmlhttp.send();
        },
		getJsPath:function(js, length) {
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
    }
	function initConfig(){
		var path = utils.getJsPath("utils.js",1);
		utils.getRemoteData(path+"/config.js",function(text){
			eval(text);
		});
	}
    function getSearchByStr(search){
        if (search) {
            search = search.substring(1);
        } else {
            return {};
        }
        var strsz = search.split("&");
        var map = {};
        for (var i=0; i<strsz.length; i++){
            var strs = strsz[i];
            if (strs.indexOf("=") != -1) {
                var tempsz = strs.split("=");
                var tempkey = tempsz[0];
                var tempvalue = tempsz[1];
                map[tempkey] = tempvalue;
            }
        }
        return map;
    }
    function getJsSearch(js){
        var scripts = document.getElementsByTagName("script");
        var map = {};
        var c;
        for (var i = 0, l = scripts.length; i < l; i++) {
            var src = scripts[i].src;
            if ((c = src.indexOf(js) ) != -1) {
                map = getSearchByStr(src.substring(c+js.length));
                break;
            }
        }
        return map;
    }
    function initJquery(){
		utils.getRemoteData(utils.htmlHost+"/asserts/compatible/jquery.min.js",function(text){
			eval(text);
		});
		function getTokenMap(){
			var map = {};
			map[utils.config.tokenKey] = utils.config.getUserToken();
			return map;
		}
        jQuery.ajaxSetup({
            global: true,
            headers:getTokenMap(),
            beforeSend:function(xhr){
                xhr.setRequestHeader(utils.config.tokenKey, utils.config.getUserToken());
                if(!this.noLoading && win.Vue){
                    xhr.loading = utils.msgVue.$loading({
                        lock: true,
                        text: '加载中',
                        spinner: 'el-icon-loading',
                        background: '#ffffff'
                    });
                }
            },
            complete:function(xhr,status){
                if(xhr.loading != null && win.Vue){
                    xhr.loading.close();
                }
            },
            error:function(xhr,status, error){
                if(xhr.loading != null && win.Vue){
                    xhr.loading.close();
                }
            }
        });
    }
	win.utils = utils;
	initConfig();
    initJquery();
    var jsSearch = getJsSearch("utils.js");
    if(!jsSearch.from){
        jsSearch.from = "pc";
    }
    utils.login = jsSearch.login == "true";
    utils.from = jsSearch.from;
    var debugStr = utils.getParamer("debug");
    utils.loadJs(utils.htmlHost + '/assets/js/const.js?_='+new Date().getTime(),"const_config");
    if(!utils.initJquery ){
        utils.loadJs(utils.htmlHost+"/assets/spaui/assets/libs/jquery/jquery-3.2.1.min.js","jquery");
    }
    utils.loadJs(utils.htmlHost+"/assets/js/user.js","user_utils");
    if(jsSearch.from == "pc"){
        utils.loadCss(utils.htmlHost + '/assets/images/favicon.ico',"shortcut_link",'shortcut icon');
        utils.loadCss(utils.htmlHost + '/assets/images/favicon.ico',"bookmark_link",'bookmark');
    }else if(jsSearch.from == "m"){
        utils.loadJs(utils.htmlHost + '/assets/mui-3.7.1/js/mui.min.js');
        utils.loadCss(utils.htmlHost + '/assets/mui-3.7.1/css/mui.min.css');
        utils.loadCss(utils.htmlHost + '/assets/mui-3.7.1/css/icons-extra.css');
        if(debugStr=="true"){
            utils.loadJs(utils.htmlHost + '/assets/eruda/eruda.js');
            //eruda.init();
        }
    }
    var plugins= jsSearch.plugins;
    if(plugins){
        if(plugins.indexOf("muipoppicker") != -1){
            utils.loadJs(utils.htmlHost + '/assets/mui-3.7.1/js/mui.poppicker.js');
            utils.loadCss(utils.htmlHost + '/assets/mui-3.7.1/css/mui.poppicker.css');
        }
        if(plugins.indexOf("indexedlist") != -1){
            utils.loadJs(utils.htmlHost + '/assets/mui-3.7.1/js/mui.indexedlist.js');
            utils.loadCss(utils.htmlHost + '/assets/mui-3.7.1/css/mui.indexedlist.css');
        }
        if(plugins.indexOf("mtimepicker") != -1){
            utils.loadJs(utils.htmlHost + '/assets/mui-3.7.1/js/mui.picker.min.js');
            utils.loadCss(utils.htmlHost + '/assets/mui-3.7.1/css/mui.picker.min.css');
        }
    }
})(window)