(function (){
    /*堡垒机,用于识别使用哪个cdn的,以后所有的情况改这里就行,由gitee pages负责主加载*/
    var src = document.currentScript.src;
    var url = new URL(src);
    var action = url.searchParams.get("type");
    var method = url.searchParams.get("method");
    if(action=="action"){
        if(window[method+"Init"]){
            return;
        }
        window[method+"Init"] = true;
        var path = currentPath(src);
        if(window[method]){
            window[method](path);
        }
        setTimeout(function (){
            window[method] = undefined;
            window[method+"Init"] = undefined;
        },20000);
        return;
    }
    var tmpSz = [
        "https://fs185085781.gitee.io/cdn",
        "https://cdn.jsdelivr.net/gh/fs185085781/cdn@v1.1.28",
        "https://objective-kepler-55a6d4.netlify.app",
    ];
    for(var i=0;i<tmpSz.length;i++){
        document.write('<script src="'+tmpSz[i]+'/fortress.js?type=action&method='+method+'"></script>');
    }
    function currentPath(src){
        var ss = src.split("/");
        ss.length = ss.length - 1;
        return ss.join("/");
    }
})()