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
            jqueryPath:rp()+"/../miniui3.9.1/jquery.min.js",
            jsPath:rp()+"/../miniui3.9.1/miniui/miniui.js",
            themesPath:rp()+"/../miniui3.9.1/miniui/themes",
            localePath:rp()+"/../miniui3.9.1/miniui/locale",
            fontAwesomePath:rp()+"/../miniui3.9.1/res/fonts/font-awesome/css/font-awesome.min.css",
            cssPath:rp()+"/../miniui3.9.1/miniui/themes/default/miniui.css"
        },
        otherLibs:{
            jsxPath:rp()+"/../libs/babel.min.js"
        }
    }
    function rp(){
        return utils.getRelativePath();
    }
    window.config = c;
})()