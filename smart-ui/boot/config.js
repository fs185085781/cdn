(function () {
    var c = {
        miniui:{version:"3.9.7",boot:"/ui-groups/miniui/boot.js"},
        vant:{version:"2.10.6",boot:"/ui-groups/vant/boot.js",unpkg:"vant"},
        antd:{version:"1.6.5",boot:"/ui-groups/antd/boot.js",unpkg:"ant-design-vue"},
        mint:{version:"2.2.13",boot:"/ui-groups/mint/boot.js",unpkg:"mint-ui"},
        element:{version:"2.13.2",boot:"/ui-groups/element/boot.js",unpkg:"element-ui"},
        layui:{version:"2.5.6",boot:"/ui-groups/layui/boot.js"},
        frozen:{version:"2.0.0",boot:"/ui-groups/frozen/boot.js"},
        ydui:{version:"1.2.6",boot:"/ui-groups/ydui/boot.js",unpkg:"vue-ydui"},
        none:{version:"1.0.0",boot:"/ui-groups/none/boot.js"},
        plugins:{
            eruda:[{js:utils.uihost+"/plugins/eruda/eruda.js"}]
        },
        logo:utils.uihost+"/expand/logo_32.png",
        debug:false,
        versionUrl:utils.uihost+"/boot/version.js"
    };
    if(window.initConfig){
        window.initConfig(c);
    }
})()