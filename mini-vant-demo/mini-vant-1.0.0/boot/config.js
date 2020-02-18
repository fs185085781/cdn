(function () {
    var c = {
        miniui:"/miniui3.9.2/boot.js",
        vant:"/vant2.5.1/boot.js",
        plugins:{
            md5:[{js:"/plugins/md5/md5.js"}]
        }
    };
    if(window.initConfig){
        window.initConfig(c);
    }
})()