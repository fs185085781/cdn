/**
 * Created by fansheng on 2017/9/11.123123
 */
var utils = {
    //消息队列
    //队列实现
    Queue:function Queue() {
        var items = [];
        //队列插入数据
        this.offer = function(obj) {
            items.push(obj);
        };
        //队列取出数据
        this.poll=function(){
            return items.shift();
        };
        //清空队列
        this.empty = function(){
            items = [];
        };
    },
    //ArrayBuffer转Hex
    buff2hex:function(buff){
        return Array.prototype.map.call(new Uint8Array(buff),function(x){return ('00' + x.toString(16)).slice(-2)}).join('').toUpperCase();
    },
    //Hex转ArrayBuffer
    hex2buff:function(hex){
        var typedArray = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) {
            return parseInt(h, 16)
        }));
        return typedArray.buffer;
    },
    //获取页面指定key值的参数值
    getParamer: function (key) {
        var map = this.getSearch();
        return map[key];
    },
    //获取页面所有key的参数值的集合
    getSearch: function () {
        var search = decodeURIComponent(window.location.search);
        if (search != "") {
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
    },
    //获取当前网址的host地址 相对深度
    getHost: function () {
        var js="utils.js";
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
        ss.length = ss.length - 3;
        path = ss.join("/");
        return path;
    },
    //获取utils对应script的自定义属性
    getAttr: function(name) {
        var js="utils.js";
        var scripts = document.getElementsByTagName("script");
        var val = null;
        for (var i = 0, l = scripts.length; i < l; i++) {
            var src = scripts[i].src;
            if (src.indexOf(js) != -1) {
                path = src;
                val = scripts[i].getAttribute(name);
                break;
            }
        }
        return val;
    },
    //设置cookie
    setCookie: function (name, value) {
        var Days = 30;
        var exp = new Date();
        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
        document.cookie = name + "=" + encodeURIComponent(value) + ";expires=" + exp.toGMTString() + ";path=/";
    },
    //获取指定key值的cookie值
    getCookie: function (name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg)) {
            return decodeURIComponent(arr[2]);
        } else {
            return null;
        }
    },
    //删除指定key值的cookie
    delCookie: function (name) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = this.getCookie(name);
        if (cval != null) {
            document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString() + ";path=/";
        }
    },
    //获取指定key值的本地缓存
    getLocalStorage:function(name){
        var mapStr = localStorage.utils;
        if(mapStr==null){
            mapStr = "{}";
        }
        var map = JSON.parse(mapStr);
        return map[name];
    },
    //设置指定key值的本地缓存
    setLocalStorage:function(name,val){
        var mapStr = localStorage.utils;
        if(mapStr==null){
            mapStr = "{}";
        }
        var map = JSON.parse(mapStr);
        map[name] = val;
        localStorage.utils = JSON.stringify(map);
    },
    //删除指定key值的本地缓存
    delLocalStorage:function(name){
        var mapStr = localStorage.utils;
        if(mapStr==null){
            mapStr = "{}";
        }
        var map = JSON.parse(mapStr);
        delete map[name];
        localStorage.utils = JSON.stringify(map);
    },
    //生成UUID
    guid: function () {
        function S4() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }
        return S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4();
    },
    copyText:function(text){
        var clipboardData = window.clipboardData; //for IE
        if (clipboardData) {
            clipboardData.setData('Text', text);
            utils.messageTips("已经复制")
        }else{
            prompt("当前浏览器不支持复制,请使用Ctrl+C复制",text);
        }
    },
    getUserInfo:function(){
        if(typeof config != "undefined" && config != null){
            return config.getUserInfo();
        }else{
            return null;
        }
    },
    setUserKey:function(key){
        utils.setLocalStorage("authorization",key);
        var url = this.getParamer("url");
        if(url){
            window.location.href = url;
        }
    },
    getUserKey:function(){
        var userKey = utils.getLocalStorage("authorization");
        if(userKey){
            return userKey
        }else{
            return "";
        }
    },
    //加载指定js
    loadJS:function(url){
        var xmlhttp;
        if (window.XMLHttpRequest){
            xmlhttp=new XMLHttpRequest();
        }else{
            xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange=function(){
            if(xmlhttp.readyState==4 && xmlhttp.status==200){
                eval(xmlhttp.responseText);
            }
        }
        xmlhttp.open("GET",url,false);
        xmlhttp.send();
    },
    divLoading:function(){
        var id = "";
        if(typeof mini != "undefined" && mini != null){
            id = mini.loading("请稍候");
            return id;
        }
        if(typeof Vue != "undefined" && Vue != null){
            if(!utils.loadingVue){
                utils.loadingVue = new Vue();
                utils.loadingVueMap = {};
            }
            if(utils.loadingVue.$loading){
                var vueLoading = utils.loadingVue.$loading({
                    text: '请稍候',
                    lock: true,
                    fullscreen:true,
                    spinner: 'el-icon-loading',
                    background:"#eee"
                });
                id = utils.guid();
                utils.loadingVueMap[id] = vueLoading;
                return id;
            }
        }
        return id;
    },
    divClose:function(id){
        if(typeof mini != "undefined" && mini != null){
            mini.hideMessageBox(id);
            return;
        }
        if(typeof Vue != "undefined" && Vue != null && utils.loadingVueMap){
            if(utils.loadingVue.$loading){
                var vueLoading = utils.loadingVueMap[id];
                if(vueLoading){
                    vueLoading.close();
                    delete utils.loadingVueMap[id];
                }
                return;
            }
        }
    }
};
//取得系统路径
utils.host = utils.getHost();
var simpleui = utils.getAttr("simpleui");
if(simpleui){
    document.write("<script src=\""+utils.host+"/plugins/simpleui-1.0.0/boot.js?"+simpleui+"\"></script>");
}
var plugins = utils.getAttr("plugins");
if(plugins.indexOf("element") != -1){
    document.write("<link rel=\"stylesheet\" href=\""+utils.host+"/plugins/element-ui-2.6.1/index.css\">");
}else if(plugins.indexOf("swiper") != -1){
    document.write("<link rel=\"stylesheet\" href=\""+utils.host+"/plugins/swiper-3.4.2/swiper.css\">");
    document.write("<script src=\""+utils.host+"/plugins/swiper-3.4.2/swiper.js\"></script>");
}


