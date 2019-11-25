(function(win){
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
            jsPath:rp()+"/../miniui3.9.1/boot.js"
        },
        otherLibs:{
            jsxPath:rp()+"/../libs/babel.min.js"
        }
    }
    function rp(){
        return utils.getRelativePath();
    }
    win.config = c;
})(window)