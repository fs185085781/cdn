(function (){
    var script = document.currentScript;
    var index = script.src.indexOf("?");
    var path = window.location.pathname;
    var pathSz = path.split("/");
    path = pathSz[pathSz.length - 1];
    var cdn = "https://cdn.jsdelivr.net/gh/fs185085781/cdn/editer";
    function syncLoadData(url,fn){
        var xmlhttp;
        if (window.XMLHttpRequest){
            xmlhttp=new XMLHttpRequest();
        }else{
            xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange=function(){
            if(xmlhttp.readyState==4){
                try{
                    fn(xmlhttp.responseText);
                }catch (e) {
                    console.warn(e);
                }
            }
        }
        xmlhttp.open("GET",url,false);
        xmlhttp.send();
    }
    syncLoadData(cdn+"/"+path,function (res){
        if(res.indexOf("src=\"asserts") != -1){
            res = res.replace("asserts/js/init.js",cdn+"/asserts/js/init.js");
        }else if(res.indexOf("src=\"./asserts") != -1){
            res = res.replace("./asserts/js/init.js",cdn+"/asserts/js/init.js");
        }
        document.write(res);
    });
})()