(function(){
    var c = {
        vue:{
            testPath:"https://unpkg.com/vue@2.6.11/dist/vue.js",
            prodPath:"https://unpkg.com/vue@2.6.11/dist/vue.min.js"
        },
        axios:{
            testPath:"https://unpkg.com/axios@0.19.2/dist/axios.js",
            prodPath:"https://unpkg.com/axios@0.19.2/dist/axios.min.js"
        },
        mint:{
            testJsPath:"https://unpkg.com/mint-ui@2.2.13/lib/index.js",
            prodJsPath:"https://unpkg.com/mint-ui@2.2.13/lib/index.js",
            testCssPath:"https://unpkg.com/mint-ui@2.2.13/lib/style.css",
            prodCssPath:"https://unpkg.com/mint-ui@2.2.13/lib/style.min.css"
        },
        vant:{
            testJsPath:"https://unpkg.com/vant@2.4.7/lib/vant.js",
            prodJsPath:"https://unpkg.com/vant@2.4.7/lib/vant.min.js",
            testCssPath:"https://unpkg.com/vant@2.4.7/lib/index.css",
            prodCssPath:"https://unpkg.com/vant@2.4.7/lib/index.css"
        },
        element:{
            testJsPath:"https://unpkg.com/element-ui@2.13.0/lib/index.js",
            prodJsPath:"https://unpkg.com/element-ui@2.13.0/lib/index.js",
            testCssPath:"https://unpkg.com/element-ui@2.13.0/lib/theme-chalk/index.css",
            prodCssPath:"https://unpkg.com/element-ui@2.13.0/lib/theme-chalk/index.css"
        },
        antd:{
            testJsPath:"https://unpkg.com/ant-design-vue@1.4.10/dist/antd.js",
            prodJsPath:"https://unpkg.com/ant-design-vue@1.4.10/dist/antd.min.js",
            testCssPath:"https://unpkg.com/ant-design-vue@1.4.10/dist/antd.css",
            prodCssPath:"https://unpkg.com/ant-design-vue@1.4.10/dist/antd.min.css"
        }
    }
    function rp(){
        return utils.getRelativePath();
    }
    window.config = c;
})()