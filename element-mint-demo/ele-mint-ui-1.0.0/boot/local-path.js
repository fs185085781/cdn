(function(){
    var c = {
        vue:{
            testPath:rp()+"/plugins/vue/vue.js",
            prodPath:rp()+"/plugins/vue/vue.min.js"
        },
        axios:{
            testPath:rp()+"/plugins/axios/axios.js",
            prodPath:rp()+"/plugins/axios/axios.min.js"
        },
        mint:{
            testJsPath:rp()+"/mint-ui/index.js",
            prodJsPath:rp()+"/mint-ui/index.js",
            testCssPath:rp()+"/mint-ui/style.css",
            prodCssPath:rp()+"/mint-ui/style.min.css"
        },
        vant:{
            testJsPath:rp()+"/vant-ui/vant.js",
            prodJsPath:rp()+"/vant-ui/vant.min.js",
            testCssPath:rp()+"/vant-ui/index.css",
            prodCssPath:rp()+"/vant-ui/index.css"
        },
        element:{
            testJsPath:rp()+"/element-ui/index.js",
            prodJsPath:rp()+"/element-ui/index.js",
            testCssPath:rp()+"/element-ui/index.css",
            prodCssPath:rp()+"/element-ui/index.css"
        },
        antd:{
            testJsPath:rp()+"/ant-design/antd.js",
            prodJsPath:rp()+"/ant-design/antd.min.js",
            testCssPath:rp()+"/ant-design/antd.css",
            prodCssPath:rp()+"/ant-design/antd.min.css"
        }
    }
    function rp(){
        return utils.getRelativePath();
    }
    window.config = c;
})()