(function () {
    var c = {
        miniui:{version:"3.9.2",boot:"/miniui/boot.js"},
        vant:{version:"2.5.1",boot:"/vant/boot.js"},
        antd:{version:"1.4.12",boot:"/antd/boot.js"},
        mint:{version:"2.2.13",boot:"/mint/boot.js"},
        element:{version:"2.13.0",boot:"/element/boot.js"},
        layui:{version:"2.5.6",boot:"/layui/boot.js"},
        plugins:{
            eruda:[{js:utils.uihost+"/plugins/eruda/eruda.js"}]
        },
        debug:false
    };
    if(window.initConfig){
        window.initConfig(c);
    }
})()