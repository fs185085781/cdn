(function (){
    /*堡垒机,用于识别使用哪个cdn的,以后所有的情况改这里就行,由七牛云负责主加载*/
    if(window.fortressAction){
        return;
    }
    window.fortressAction = true;
    var path = currentPath();
    if(path.indexOf("cdn.jsdelivr.net") != -1){
        /*当前是cdn.jsdelivr.net,增加版本号*/
        var version = getUrlData("https://static.tenfell.cn/cdn/version.txt?_="+new Date().getTime());
        if(version){
            path += "@"+version;
        }
    }
    if(window.fortress){
        window.fortress(path);
    }
    function getUrlData(url){
        var data = null;
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange=function(){
            if(xmlhttp.readyState===4 && xmlhttp.status===200){
                data = xmlhttp.responseText;
            }
        }
        xmlhttp.open("GET",url,false);
        xmlhttp.send();
        return data;
    }
    function currentPath(){
        var src = document.currentScript.src;
        var ss = src.split("/");
        ss.length = ss.length - 1;
        return ss.join("/");
    }
})()