(function () {
    var c = {
        miniui:"/miniui3.9.2/boot.js",
        vant:"/vant2.5.1/boot.js",
        antd:"/antd1.4.12/boot.js",
        mint:"/mint2.2.13/boot.js",
        element:"/element2.13.0/boot.js",
        plugins:{
            eruda:[{js:utils.uihost+"/plugins/eruda/eruda.js"}]
        },
        debug:false
    };
    if(window.initConfig){
        window.initConfig(c);
    }
})()