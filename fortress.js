(function (){
    /*堡垒机,用于识别使用哪个cdn的,以后所有的情况改这里就行,由七牛云负责主加载*/
    var tmpSz = [
        "https://fs185085781.gitee.io/cdn",
        "https://objective-kepler-55a6d4.netlify.app",
        "https://cdn.jsdelivr.net/gh/fs185085781/cdn@v1.1.26",
        currentPath()
    ];
    for(var i=0;i<tmpSz.length;i++){
        document.write('<script src="'+tmpSz[i]+'/fortress-action.js"></script>');
    }
    function currentPath(){
        var src = document.currentScript.src;
        var ss = src.split("/");
        ss.length = ss.length - 1;
        return ss.join("/");
    }
})()