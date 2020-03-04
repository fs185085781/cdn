(function(){
    window.utils = initUtils();
    var path = getJsPath("utils.js",2);
    utils.uihost = path;
    window.initConfig=function(config){
        document.write("<script src='"+path+config[utils.from]+"'></script>");
        initPlugins(config.plugins,utils.plugins);
        document.write('<script src="'+path+'/expand/utils-expand.js"></script>');
        document.write('<link href="' + path+'/expand/utils-expand.css" rel="stylesheet" type="text/css" />');
    }
    document.write("<script src='"+path+"/plugins/axios/axios.js'></script>");
    document.write("<script src='"+path+"/expand/core-expand.js'></script>");
    document.write("<script src='"+path+"/boot/config.js'></script>");
    function initPlugins(pluginMap,plugins) {
        for(var i=0;i<plugins.length;i++){
            var arrs = pluginMap[plugins[i]];
            if(!arrs){
                continue;
            }
            for(var n=0;n<arrs.length;n++){
                var plugin = arrs[n];
                if(!plugin){
                    continue;
                }
                if(plugin.js){
                    document.write("<script src='"+path+plugin.js+"'></script>");
                }else if(plugin.css){
                    document.write('<link href="' + path+plugin.css + '" rel="stylesheet" type="text/css" />');
                }
            }
        }
    }
    function initUtils(){
        var tools = {
            getParamer: function (key) {
                var map = this.getSearch();
                return map[key];
            },
            getSearch: function () {
                var search = decodeURIComponent(location.search);
                return this.getSearchByStr(search);
            },
            getSearchByStr:function(search){
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
            },
            setLocalStorage:function(key,val){
                var map = {};
                map[key] = val;
                localStorage.setItem(key,JSON.stringify(map));
            },
            getLocalStorage:function(key){
                var mapStr = localStorage.getItem(key);
                if(!mapStr){
                    mapStr = "{}";
                }
                var map = JSON.parse(mapStr);
                return map[key];
            },
            delLocalStorage:function(key){
                localStorage.removeItem(key);
            },
            removeProp:function(obj,fieldName){
                try{
                    delete obj[fieldName];
                }catch (e) {
                    obj[fieldName] = undefined;
                }
            },
            delayAction:function(tjFn,acFn,maxDelay){
                var that = this;
                if(!maxDelay){
                    maxDelay = 24*60*60*1000;
                }
                var key = "da"+Date.now()+parseInt(Math.random()*10000);
                var timeKey = "time"+key;
                that[timeKey]=Date.now();
                that[key]=function () {
                    if(Date.now()-that[timeKey]>maxDelay){
                        that.removeProp(that,key);
                        that.removeProp(that,timeKey);
                    }else{
                        if(tjFn()){
                            that.removeProp(that,key);
                            that.removeProp(that,timeKey);
                            acFn();
                        }else{
                            setTimeout(that[key],100);
                        }
                    }
                }
                that[key]();
            }
        }
        var jsSearch = getJsSearch("utils.js");
        var plugins = [];
        if(jsSearch.plugins && jsSearch.plugins.trim()){
            plugins=jsSearch.plugins.trim().split(",");
        }
        jsSearch.plugins = plugins;
        for(var key in jsSearch){
            tools[key] = jsSearch[key];
        }
        function getJsSearch(js){
            var scripts = document.getElementsByTagName("script");
            var map = {};
            var c;
            for (var i = 0, l = scripts.length; i < l; i++) {
                var src = scripts[i].src;
                if ((c = src.indexOf(js) ) != -1) {
                    map = tools.getSearchByStr(src.substring(c+js.length));
                    break;
                }
            }
            return map;
        }
        return tools;
    }
    function getJsPath(js, length) {
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
})();