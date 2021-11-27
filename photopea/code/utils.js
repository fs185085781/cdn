(function (){
    var src = document.currentScript.src;
    var srcSz = src.split("/");
    srcSz.length = srcSz.length - 2;
    var host = srcSz.join("/");
    window.photopeaHost = host;
})()