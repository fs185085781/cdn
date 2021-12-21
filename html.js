(function () {
    var hp = flhostPath();
    var fileUrl = hp.host + hp.path;
    var filePathSz = fileUrl.split("/");
    filePathSz.length = filePathSz.length - 1;
    var filePath = filePathSz.join("/") + "/";

    function syncLoadData(url, fn) {
        var xmlhttp;
        if (window.XMLHttpRequest) {
            xmlhttp = new XMLHttpRequest();
        } else {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4) {
                try {
                    fn(xmlhttp.responseText);
                } catch (e) {
                    console.warn(e);
                }
            }
        }
        xmlhttp.open("GET", url, false);
        xmlhttp.send();
    }

    function flhostPath() {
        var src = new URL(document.currentScript.src);
        var url = src.origin + src.pathname;
        var search = src.search ? src.search : "?";
        search = search.substring(1);
        var urlsz = url.split("/");
        urlsz.length = urlsz.length - 1;
        var host = urlsz.join("/");
        var strsz = search.split("&");
        var map = {};
        for (var i = 0; i < strsz.length; i++) {
            var strs = strsz[i];
            if (strs.indexOf("=") != -1) {
                var tempsz = strs.split("=");
                var tempkey = tempsz[0];
                var tempvalue = tempsz[1];
                map[tempkey] = decodeURIComponent(tempvalue);
            }
        }
        var res = {host: host, path: map.path};
        return res;
    }

    function clurl(str, reg) {
        var index = 0;
        while (true) {
            var i = str.indexOf(reg, index);
            var yh = "'";
            if (reg.substring(reg.length - 1) == "'") {
                yh = "\"";
            }
            //http开头不替换
            var hi = str.indexOf(reg + "http", index);
            //java开头不替换
            var ji = str.indexOf(reg + "javascript", index);
            //变量开头不替换
            var yi = str.indexOf(reg + yh, index);
            if (i == -1 && hi == -1 && ji == -1 && yi == -1) {
                break;
            }
            if (i == hi || i == ji || i == yi) {
                index = i + 1;
                continue;
            }
            str = str.substring(0, i) + reg + filePath + str.substring(i + reg.length);
            index = i + 1;
        }
        return str;
    }
    try{
        syncLoadData(fileUrl, function (res) {
            res = clurl(res, " src=\"");
            res = clurl(res, " href=\"");
            res = clurl(res, " src='");
            res = clurl(res, " href='");
            document.write(res);
        });
    }catch (e){
        window.location.href = fileUrl + window.location.search;
    }
})()