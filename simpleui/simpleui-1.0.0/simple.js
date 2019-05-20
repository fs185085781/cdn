(function(win){
    win.simple={
        getJsPath:function(js){
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
            ss.length = ss.length - 1;
            path = ss.join("/");
            return path;
        },
        getSearch:function(){
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
        getParamer:function(key){
            var map = this.getSearch();
            return map[key];
        }
    }


})(window);
/*皮肤文件==========start*/
function getJsPath(js) {
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
    ss.length = ss.length - 1;
    path = ss.join("/");
    return path;
}
function getParamer(key) {
    var map = getSearch();
    return map[key];
}
function getSearch() {
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
}
