(function(){
    var c = {
        vue:{
            testPath:rp()+"/../libs/vue.js",
            prodPath:rp()+"/../libs/vue.min.js"
        },
        react:{
            testPath:rp()+"/../libs/react.js",
            prodPath:rp()+"/../libs/react.min.js",
            testDomPath:rp()+"/../libs/react-dom.js",
            prodDomPath:rp()+"/../libs/react-dom.min.js"
        },
        angular:{
            testPath:rp()+"/../libs/angular.js",
            prodPath:rp()+"/../libs/angular.min.js"
        },
        angular2:{
            testPath:rp()+"/../libs/angular2.js",
            prodPath:rp()+"/../libs/angular2.min.js",
            es6ShimPath:rp()+"/../libs/es6-shim.js",
            polyfillsPath:rp()+"/../libs/angular2-polyfills.js",
            rxUmdPath:rp()+"/../libs/Rx.umd.js"
        },
        jquery:{
            testPath:rp()+"/../libs/jquery.js",
            prodPath:rp()+"/../libs/jquery.min.js"
        },
        miniui:{
            jqueryPath:rp()+"/../miniui3.9.2/js/jquery.min.js",
            jsPath:rp()+"/../miniui3.9.2/js/miniui.js",
            exportJsPath:rp()+"/../miniui3.9.2/js/export-execl.js",
            localePath:rp()+"/../miniui3.9.2/js/locale",
            cssPath:rp()+"/../miniui3.9.2/css"
        },
        plugins:{
            md5:rp()+"/../compatible/md5.js",
            jsx:rp()+"/../libs/babel.min.js"
        }
    }
    function rp(){
        return utils.getRelativePath();
    }
    window.config = c;
})()