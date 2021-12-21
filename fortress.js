(function (){
    /*堡垒机,用于识别使用哪个cdn的,以后所有的情况改这里就行,由七牛云负责主加载*/
    var path;
    var tmpSz = [
        "https://cdn.jsdelivr.net/gh/fs185085781/cdn"
    ];
    for(var i=0;i<tmpSz.length;i++){
        var tmpPath = tmpSz[i];
        var url = tmpPath+"/fortress.js";
        try{
            if(hasData(url)){
                path = tmpPath;
                break;
            }
        }catch (e){
        }
    }
    var current = currentPath();
    if(!path){
        path = current;
    }
    if(path.indexOf("cdn.jsdelivr.net") != -1){
        /*当前是cdn.jsdelivr.net,增加版本号*/
        var version = getUrlData(current+"/version.txt?_="+new Date().getTime());
        if(version){
            path += "@"+version;
        }
    }
    window.fortressHost = path;
    if(window.fortress){
        window.fortress(path);
    }
    function hasData(url){
        var data = getUrlData(url);
        return !!data;
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