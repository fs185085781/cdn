(function () {
    var script = getCurrentScript();
    var emuHost = getHost(script.src, 1);
    window.emuUtils = {
        removeAd: function () {
            var ds = setInterval(function () {
                var iframe = document.querySelector("iframe");
                if (!iframe) {
                    return;
                }
                var div = iframe.parentElement;
                if (!div) {
                    return;
                }
                div.remove();
                clearInterval(ds);
            }, 300);
        },
        i18nShader:function (options){
            if(options.normalOptions){
                if(options.normalOptions.shader){
                    options.normalOptions.shader.label = "着色器";
                    if(options.normalOptions.shader.options){
                        options.normalOptions.shader.options["2xScaleHQ.glslp"] = "2倍清晰";
                        options.normalOptions.shader.options["4xScaleHQ.glslp"] = "4倍清晰";
                        options.normalOptions.shader.options["crt-aperture.glslp"] = "光圈模式";
                        options.normalOptions.shader.options["crt-easymode.glslp"] = "简易模式";
                        options.normalOptions.shader.options["crt-geom.glslp"] = "几何模式";
                        options.normalOptions.shader.options["disabled"] = "禁用";
                    }
                }
            }
        },
        i18nCoreOptions:function(options){
            if(options.fceumm_nospritelimit){
                options.fceumm_nospritelimit.label = "无精灵限制";
                if(options.fceumm_nospritelimit.options){
                    options.fceumm_nospritelimit.options["disabled"] = "禁用";
                    options.fceumm_nospritelimit.options["enabled"] = "启用";
                }
            }
            if(options.fceumm_palette){
                options.fceumm_palette.label = "调色板";
                if(options.fceumm_palette.options){
                    options.fceumm_palette.options["default"] = "默认";
                }
            }
            if(options.fceumm_region){
                options.fceumm_region.label = "视频";
            }
            if(options.fceumm_sndquality){
                options.fceumm_sndquality.label = "音质";
                if(options.fceumm_sndquality.options){
                    options.fceumm_sndquality.options["High"] = "高";
                    options.fceumm_sndquality.options["Low"] = "低";
                    options.fceumm_sndquality.options["Very High"] = "非常高";
                }
            }
            if(options.fceumm_turbo_enable){
                options.fceumm_turbo_enable.label = "连发";
            }
            if(options.system_type){
                options.system_type.label = "4玩家支持";
                options.system_type.options["famicom"] = "磁碟机";
                options.system_type.options["nes"] = "红白机";
            }
            if(options["fba-aspect"]){
                options["fba-aspect"].label = "纵横比";
            }
            if(options["fba-frameskip"]){
                options["fba-frameskip"].label = "框架船";
            }
            if(options["fba-cpu-speed-adjust"]){
                options["fba-cpu-speed-adjust"].label = "CPU超频";
            }
            if(options["fba-diagnostic-input"]){
                options["fba-diagnostic-input"].label = "诊断输入";
            }
            if(options["fba-neogeo-mode"]){
                options["fba-neogeo-mode"].label = "强制Neo Geo模式";
            }
            if(options["fba-dipswitch-orlegend-Test_mode"]){
                options["fba-dipswitch-orlegend-Test_mode"].label = "测试模式";
            }
            if(options["fba-dipswitch-orlegend-Music"]){
                options["fba-dipswitch-orlegend-Music"].label = "背景音";
            }
            if(options["fba-dipswitch-orlegend-Voice"]){
                options["fba-dipswitch-orlegend-Voice"].label = "前景音";
            }
            if(options["fba-dipswitch-orlegend-Free_play"]){
                options["fba-dipswitch-orlegend-Free_play"].label = "免费玩";
            }
            if(options["fba-dipswitch-orlegend-Stop_mode"]){
                options["fba-dipswitch-orlegend-Stop_mode"].label = "停止模式";
            }
            if(options["fba-dipswitch-orlegend-Bios_select_(Fake)"]){
                options["fba-dipswitch-orlegend-Bios_select_(Fake)"].label = "BIOS选择(伪造)";
            }
            if(options["fba-dipswitch-orlegend-Disable_Ba-Chieh"]){
                options["fba-dipswitch-orlegend-Disable_Ba-Chieh"].label = "节";
            }
            if(options["fba-dipswitch-orlegend-Region_(Fake)"]){
                options["fba-dipswitch-orlegend-Region_(Fake)"].label = "区域(伪造)";
            }
            var hasStr = ",fba-dipswitch-orlegend-Region_(Fake),fba-dipswitch-orlegend-Disable_Ba-Chieh,fba-dipswitch-orlegend-Bios_select_(Fake),fba-dipswitch-orlegend-Stop_mode,fba-dipswitch-orlegend-Free_play,fba-dipswitch-orlegend-Voice,fba-dipswitch-orlegend-Music,fba-dipswitch-orlegend-Test_mode,fba-neogeo-mode,fba-diagnostic-input,fba-cpu-speed-adjust,fba-frameskip,fba-aspect,fceumm_nospritelimit,fceumm_palette,fceumm_region,fceumm_sndquality,fceumm_turbo_enable,system_type,";
            for(var key in options){
                if(hasStr.indexOf(","+key+",")!=-1){
                    continue;
                }
                console.log("."+key+".",options[key]);
            }
        },
        i18nHtml:function (){
            function setInnerText(select,val){
                utils.delayAction(function (){
                    var list = document.querySelectorAll(select);
                    return (window.emuUtils && window.emuUtils.emu && window.emuUtils.emu.currentFrameNum()>0) || (list && list.length > 0);
                },function (){
                    try{
                        var list = document.querySelectorAll(select);
                        for(var i=0;i<list.length;i++){
                            list[i].innerHTML = val;
                        }
                    }catch (e){
                    }
                });
            }
            //主界面
            setInnerText(".ejs--1acedc5ed6816abe96dd27d910fd74>button:first-child span.ejs--74c6d4176d27e37a19d2e9e61de8f4","重启");
            setInnerText("button[data-btn=\"play\"] span.ejs--ec731619062226d943da67f5d83009","暂停");
            setInnerText("button[data-btn=\"play\"] span.ejs--dc7068585e3d84fe0e676864c1439e","继续");
            document.querySelector("button[data-btn=\"save-state\"].ejs--8732295ca5c4902a060d34706a8146").remove();
            document.querySelector("button[data-btn=\"load-state\"].ejs--8732295ca5c4902a060d34706a8146").remove();
            setInnerText("button[data-btn=\"netplay\"] span.ejs--74c6d4176d27e37a19d2e9e61de8f4","联网");
            setInnerText("button[data-btn=\"gamepad\"] span.ejs--74c6d4176d27e37a19d2e9e61de8f4","控制器设置");
            setInnerText("button[data-btn=\"cheat\"] span.ejs--74c6d4176d27e37a19d2e9e61de8f4","金手指");
            setInnerText("button[data-btn=\"mute\"] span.ejs--ec731619062226d943da67f5d83009","音量");
            setInnerText("button[data-btn=\"mute\"] span.ejs--dc7068585e3d84fe0e676864c1439e","静音");
            setInnerText("button[data-btn=\"settings\"] span.ejs--74c6d4176d27e37a19d2e9e61de8f4","设置");
            setInnerText("button[data-btn=\"fullscreen\"] span.ejs--dc7068585e3d84fe0e676864c1439e","全屏");
            setInnerText("button[data-btn=\"fullscreen\"] span.ejs--ec731619062226d943da67f5d83009","退出全屏");
            //联网对战界面
            setInnerText("#modal-9de6c4e9ce2b9361-title","设置玩家名");
            setInnerText("#modal-9de6c4e9ce2b9361-content strong","玩家名");
            setInnerText("#modal-9de6c4e9ce2b9361 .ejs--319bcec5dee9444e1a2a53d6503b7c","提交");
            setInnerText(".ejs--158ea9dd34e3e7af2d837f8b05babb .ejs--b373c9d5029d49324fb8ac3ece96c1 h4","联网对战");
            setInnerText(".ejs--158ea9dd34e3e7af2d837f8b05babb .ejs--d6a46533fa6e510a571af5c28b440a strong","游戏房间");
            setInnerText(".ejs--158ea9dd34e3e7af2d837f8b05babb .ejs--eefdf28d69ed2d20f197308981bb61 strong","游戏房间");
            setInnerText(".ejs--158ea9dd34e3e7af2d837f8b05babb .ejs--d6a46533fa6e510a571af5c28b440a table thead td:nth-child(1)","房间名");
            setInnerText(".ejs--158ea9dd34e3e7af2d837f8b05babb .ejs--d6a46533fa6e510a571af5c28b440a table thead td:nth-child(2)","玩家名");
            setInnerText(".ejs--158ea9dd34e3e7af2d837f8b05babb .ejs--eefdf28d69ed2d20f197308981bb61 table thead td:nth-child(1)","房间名");
            setInnerText(".ejs--158ea9dd34e3e7af2d837f8b05babb .ejs--eefdf28d69ed2d20f197308981bb61 table thead td:nth-child(2)","玩家名");
            setInnerText(".ejs--158ea9dd34e3e7af2d837f8b05babb .ejs--eefdf28d69ed2d20f197308981bb61 table tbody","");
            setInnerText(".ejs--158ea9dd34e3e7af2d837f8b05babb .ejs--580e3c22e63f8a1eb29694fd0b141b a:nth-child(1)","退出房间");
            setInnerText(".ejs--158ea9dd34e3e7af2d837f8b05babb .ejs--580e3c22e63f8a1eb29694fd0b141b a:nth-child(2)","创建房间");
            setInnerText(".ejs--158ea9dd34e3e7af2d837f8b05babb .ejs--580e3c22e63f8a1eb29694fd0b141b a:nth-child(3)","关闭");
            setInnerText("#modal-85cd7a1c543a484a-title","创建房间");
            setInnerText("#modal-85cd7a1c543a484a-content strong:nth-child(2)","房间名");
            setInnerText("#modal-85cd7a1c543a484a-content strong:nth-child(6)","玩家数量");
            setInnerText("#modal-85cd7a1c543a484a-content strong:nth-child(10)","密码(可选)");
            setInnerText("#modal-85cd7a1c543a484a .ejs--ed44f59bb8cd49177586b140658c6c button:nth-child(1)","提交");
            setInnerText("#modal-85cd7a1c543a484a .ejs--ed44f59bb8cd49177586b140658c6c button:nth-child(2)","关闭");
            setInnerText("div[data-room-password]","");
            setInterval(function (){
                var list = document.querySelectorAll(".ejs--158ea9dd34e3e7af2d837f8b05babb .ejs--d6a46533fa6e510a571af5c28b440a table tbody tr");
                if(!list || list.length<1){
                    return;
                }
                try{
                    for(var i=0;i<list.length;i++){
                        var tr = list[i];
                        tr.querySelector("td:nth-child(3) span").innerHTML= "加入";
                    }
                }catch (e){

                }
            },500);
            //金手指界面
            setInnerText(".ejs__cheat__container .ejs--b373c9d5029d49324fb8ac3ece96c1 h4","金手指");
            setInnerText(".ejs__cheat__container .ejs--580e3c22e63f8a1eb29694fd0b141b a:nth-child(1)","添加");
            setInnerText(".ejs__cheat__container .ejs--580e3c22e63f8a1eb29694fd0b141b a:nth-child(2)","确定");
            setInnerText(".ejs__cheat__container .ejs--580e3c22e63f8a1eb29694fd0b141b a:nth-child(3)","关闭");
            setInnerText("#modal-85cd7a1c543a484b-title","添加金手指");
            setInnerText("#modal-85cd7a1c543a484b-content strong:nth-child(2)","代码");
            setInnerText("#modal-85cd7a1c543a484b-content strong:nth-child(6)","描述");
            setInnerText("#modal-85cd7a1c543a484b .ejs--ed44f59bb8cd49177586b140658c6c button:nth-child(1)","提交");
            setInnerText("#modal-85cd7a1c543a484b .ejs--ed44f59bb8cd49177586b140658c6c button:nth-child(2)","关闭");
            //控制器设置界面
            setInnerText(".ejs--3f0897a8158ba363a0ee0afe4da7c5 .ejs--b373c9d5029d49324fb8ac3ece96c1 h4","控制器设置");
            for(var i=0;i<4;i++){
                var n = i+1;
                setInnerText("#controls-tabs li:nth-child("+n+") a","玩家"+n);
                setInnerText("#controls-"+i+" .gamepad","");
                setInnerText("#controls-"+i+" div[data-label='SELECT'] div:nth-child(1) label","选择");
                setInnerText("#controls-"+i+" div[data-label='START'] div:nth-child(1) label","开始");
                setInnerText("#controls-"+i+" div[data-label='UP'] div:nth-child(1) label","上");
                setInnerText("#controls-"+i+" div[data-label='DOWN'] div:nth-child(1) label","下");
                setInnerText("#controls-"+i+" div[data-label='LEFT'] div:nth-child(1) label","左");
                setInnerText("#controls-"+i+" div[data-label='RIGHT'] div:nth-child(1) label","右");
                setInnerText("#controls-"+i+" div[data-label='A'] div:nth-child(1) label","A");
                setInnerText("#controls-"+i+" div[data-label='B'] div:nth-child(1) label","B");
                setInnerText("#controls-"+i+" div[data-label='X'] div:nth-child(1) label","X");
                setInnerText("#controls-"+i+" div[data-label='Y'] div:nth-child(1) label","Y");
                setInnerText("#controls-"+i+" .row div:nth-child(1)","手柄");
                setInnerText("#controls-"+i+" .row div:nth-child(2)","键盘");
                setInnerText("#controls-"+i+" a.ejs--6604c83041a275a78837c452a71dd8","设置");
            }
            setInnerText(".ejs--3f0897a8158ba363a0ee0afe4da7c5 .ejs--580e3c22e63f8a1eb29694fd0b141b a:nth-child(1)","更新");
            setInnerText(".ejs--3f0897a8158ba363a0ee0afe4da7c5 .ejs--580e3c22e63f8a1eb29694fd0b141b a:nth-child(2)","取消");
            //设置界面
            var hms = [
                {"key":"fba-dipswitch-orlegend-Test_mode","name":"测试模式"},
                {"key":"fba-dipswitch-orlegend-Music","name":"背景音"},
                {"key":"fba-dipswitch-orlegend-Voice","name":"前景音"},
                {"key":"fba-dipswitch-orlegend-Free_play","name":"免费玩"},
                {"key":"fba-dipswitch-orlegend-Stop_mode","name":"停止模式"},
                {"key":"fba-dipswitch-orlegend-Bios_select_(Fake)","name":"BIOS选择(伪造)"},
                {"key":"fba-dipswitch-orlegend-Disable_Ba-Chieh","name":"节"},
                {"key":"fba-dipswitch-orlegend-Region_(Fake)","name":"区域(伪造)"}
            ];
            for(var i=0;i<hms.length;i++){
                (function (n){
                    var hm = hms[n];
                    utils.delayAction(function (){
                        var doc = document.querySelector("button[item='"+hm.key+"'] > span span.ejs--f91e90fe7cabc875aff9a431bf5389");
                        return (window.emuUtils && window.emuUtils.emu && window.emuUtils.emu.currentFrameNum()>0) || (doc&&doc.innerHTML);
                    },function (){
                        try{
                            var val = document.querySelector("button[item='"+hm.key+"'] > span span.ejs--f91e90fe7cabc875aff9a431bf5389").innerHTML;
                            setInnerText("button[item='"+hm.key+"'] > span",hm.name+"<span class='ejs--f91e90fe7cabc875aff9a431bf5389'>"+val+"</span>");
                            setInnerText("div[data-pane='"+hm.key+"'] button.ejs--a7ad9de0cb0ca672b6703c50de7db9 span:nth-child(1)",hm.name);
                        }catch (e){
                        }
                    });
                })(i);
            }
        },
        pojieJs: function () {
            var that = this;
            Element.prototype.insertBeforeTemp = Element.prototype.insertBefore;
            Element.prototype.insertBefore = function (a, b) {
                if (a && a.src && a.src.indexOf("emulator.js") != -1) {
                    a.src = emuHost + "/js/emulator.js";
                } else {
                    //console.log("insertBefore",a);
                }
                return this.insertBeforeTemp(a, b);
            }
            Element.prototype.appendChildTemp = Element.prototype.appendChild;
            Element.prototype.appendChild = function (a) {
                if (a && a.src && a.src.indexOf("webrtc-adapter.js") != -1) {
                    a.src = emuHost + "/js/webrtc-adapter.js";
                } else if (a && a.src && a.src.indexOf("ad.html") != -1) {
                    a = document.createElement("iframe");
                } else {
                    //console.log("appendChild",a);
                }
                return this.appendChildTemp(a);
            }
            XMLHttpRequest.prototype.openTemp = XMLHttpRequest.prototype.open;
            XMLHttpRequest.prototype.open = function (a, b, c) {
                if (b.indexOf("/v.json") != -1) {
                    b = emuHost + "/data/v.json";
                } else if (b.indexOf("/extract7z.js") != -1) {
                    b = emuHost + "/js/extract7z.js";
                } else if (b.indexOf(".data") != -1) {
                    var asms = [
                        "32x-wasm.data",
                        "a2600-wasm.data",
                        "arcade-wasm.data",
                        "gb-asmjs.data",
                        "gba-wasm.data",
                        "n64-asmjs.data",
                        "nds-wasm.data",
                        "nes-wasm.data",
                        "saturn-asmjs.data",
                        "sega-wasm.data",
                        "segacd-asmjs.data",
                        "snes-wasm.data",
                        "vb-wasm.data",
                        "a7800-wasm.data",
                        "lynx-wasm.data",
                        "jaguar-wasm.data",
                        "ws-wasm.data",
                        "bluemsx-wasm.data",
                        "ngp-wasm.data",
                        "pce-wasm.data",
                        "psx-wasm.data"
                    ];
                    var has = false;
                    for (var i = 0; i < asms.length; i++) {
                        if (!asms[i]) {
                            continue;
                        }
                        if (b.indexOf("/" + asms[i]) == -1) {
                            continue;
                        }
                        b = emuHost + "/ams/" + asms[i];
                        has = true;
                        break;
                    }
                    if (!has) {
                        console.log("XMLHttpRequest!has",b);
                    }
                } else {
                    //console.log("XMLHttpRequest else",b);
                }
                return this.openTemp(a, b, c);
            }
            if(document.querySelector("meta[content='no-referrer']")){
                return;
            }
            var head = document.getElementsByTagName("head")[0];
            var meta=document.createElement("meta");
            meta.name="referrer";
            meta.content="no-referrer";
            head.append(meta);
        },
        saveState: function () {
            var that = this;
            return that.emu.saveState();
        },
        loadState: function (data) {
            var that = this;
            that.emu.loadState(data,0x0);
        },
        getImg: function () {
            var that = this;
            return "data:image/png;base64," + window.btoa(String.fromCharCode.apply(null, that.emu.getScreenData()));
        },
        delayAction: function (tjFn, acFn, maxDelay) {
            var that = this;
            if (!maxDelay) {
                maxDelay = 24 * 60 * 60 * 1000;
            }
            var key = "da" + Date.now() + parseInt(Math.random() * 10000);
            var timeKey = "time" + key;
            that[timeKey] = Date.now();
            that[key] = function () {
                if (Date.now() - that[timeKey] > maxDelay) {
                    that.removeProp(that, key);
                    that.removeProp(that, timeKey);
                } else {
                    if (tjFn()) {
                        that.removeProp(that, key);
                        that.removeProp(that, timeKey);
                        acFn();
                    } else {
                        setTimeout(that[key], 100);
                    }
                }
            }
            that[key]();
        },
        removeProp: function (obj, fieldName) {
            try {
                delete obj[fieldName];
            } catch (e) {
                obj[fieldName] = undefined;
            }
        },
        getIntId:function (id){
            var length = id.length;
            var str = "";
            for(var i=0;i<length;i++){
                str += id.charCodeAt(i);
            }
            return str;
        },
        initGame: function (options) {
            window.EJS_player = options.player;
            window.EJS_biosUrl = options.bios;
            window.EJS_gameUrl = options.gameUrl;
            window.EJS_gameID = this.getIntId(options.id);
            window.EJS_core = options.core;
            window.EJS_playerName = options.playerName;
        },
        fireKeyEvent: function (type, code) {
            function mnKeyEvent(evtType, keyCode) {
                var el = document.getElementsByTagName("body")[0];
                var evtObj;
                if (document.createEvent) {
                    if (window.KeyEvent) {//firefox 浏览器下模拟事件
                        evtObj = document.createEvent('KeyEvents');
                        evtObj.initKeyEvent(evtType, true, true, window, true, false, false, false, keyCode, 0);
                    } else {//chrome 浏览器下模拟事件
                        evtObj = document.createEvent('UIEvents');
                        evtObj.initUIEvent(evtType, true, true, window, 1);

                        delete evtObj.keyCode;
                        if (typeof evtObj.keyCode === "undefined") {//为了模拟keycode
                            Object.defineProperty(evtObj, "keyCode", {value: keyCode});
                        } else {
                            evtObj.key = String.fromCharCode(keyCode);
                        }

                        if (typeof evtObj.ctrlKey === 'undefined') {//为了模拟ctrl键
                            Object.defineProperty(evtObj, "ctrlKey", {value: true});
                        } else {
                            evtObj.ctrlKey = true;
                        }
                    }
                    el.dispatchEvent(evtObj);

                } else if (document.createEventObject) {//IE 浏览器下模拟事件
                    evtObj = document.createEventObject();
                    evtObj.keyCode = keyCode
                    el.fireEvent('on' + evtType, evtObj);
                }
            };
            if(type == "keypress"){
                mnKeyEvent("keydown",code);
                setTimeout(function () {
                    mnKeyEvent("keyup",code);
                },20);
            }else{
                mnKeyEvent(type,code);
            }
        },
        uint8ArrayToString: function (fileData) {
            var dataString = "";
            for (var i = 0; i < fileData.length; i++) {
                dataString += String.fromCharCode(fileData[i]);
            }
            return dataString;
        },
        stringToUint8Array: function (str) {
            var arr = [];
            for (var i = 0, j = str.length; i < j; ++i) {
                arr.push(str.charCodeAt(i));
            }
            var tmpUint8Array = new Uint8Array(arr);
            return tmpUint8Array
        },
        paused: function (flag) {
            //true 暂停 false继续
            if (flag ^ window.EJS_emulator.paused) {
                window.EJS_emulator.elements.buttons.play[0].click()
            }
        }

    };
    //加载游戏配置
    if (window.initGame) {
        window.initGame();
    }
    //破解js,使之无广告,不使用第三方js
    emuUtils.pojieJs();
    //删除广告的叉叉小图标
    emuUtils.removeAd();
    //页面加载完毕后直接进游戏
    emuUtils.delayAction(function () {
        return document.querySelector(".ejs--73f9b4e94a7a1fe74e11107d5ab2ef");
    }, function () {
        document.querySelector(".ejs--73f9b4e94a7a1fe74e11107d5ab2ef").click();
        emuUtils.i18nHtml();
    });
    //加载默认的按键配置
    if (!localStorage.getItem("ejs_nes_settings")) {
        var keyMap = {"controllers":{"0":{"0":{"value":"72"},"1":{"value":"89"},"2":{"value":"70"},"3":{"value":"71"},"4":{"value":"87"},"5":{"value":"83"},"6":{"value":"65"},"7":{"value":"68"},"8":{"value":"74"},"9":{"value":"85"}}}};
        localStorage.setItem("ejs_nes_settings", JSON.stringify(keyMap));
    }
    if (!localStorage.getItem("ejs_arcade_settings")) {
        var keyMap = {
            "controllers": {
                "0": {
                    "0": {"value": "72", "value2": "1"},
                    "1": {"value": "85", "value2": "3"},
                    "2": {"value": "70", "value2": "8"},
                    "3": {"value": "71", "value2": "9"},
                    "4": {"value": "87", "value2": "12"},
                    "5": {"value": "83", "value2": "13"},
                    "6": {"value": "65", "value2": "14"},
                    "7": {"value": "68", "value2": "15"},
                    "8": {"value": "74", "value2": "0"},
                    "9": {"value": "89", "value2": "2"},
                    "10": {"value": "81", "value2": "4"},
                    "11": {"value": "69", "value2": "5"},
                    "12": {"value": "82", "value2": "6"},
                    "13": {"value": "84", "value2": "7"},
                    "14": {},
                    "15": {},
                    "16": {"value": "72"},
                    "17": {"value": "70"},
                    "18": {"value": "71"},
                    "19": {"value": "84"},
                    "20": {},
                    "21": {},
                    "22": {},
                    "23": {}
                },
                "1": {
                    "0": {},
                    "1": {},
                    "2": {},
                    "3": {},
                    "4": {},
                    "5": {},
                    "6": {},
                    "7": {},
                    "8": {},
                    "9": {},
                    "10": {},
                    "11": {},
                    "12": {},
                    "13": {},
                    "14": {},
                    "15": {},
                    "16": {},
                    "17": {},
                    "18": {},
                    "19": {},
                    "20": {},
                    "21": {},
                    "22": {},
                    "23": {}
                },
                "2": {
                    "0": {},
                    "1": {},
                    "2": {},
                    "3": {},
                    "4": {},
                    "5": {},
                    "6": {},
                    "7": {},
                    "8": {},
                    "9": {},
                    "10": {},
                    "11": {},
                    "12": {},
                    "13": {},
                    "14": {},
                    "15": {},
                    "16": {},
                    "17": {},
                    "18": {},
                    "19": {},
                    "20": {},
                    "21": {},
                    "22": {},
                    "23": {}
                },
                "3": {
                    "0": {},
                    "1": {},
                    "2": {},
                    "3": {},
                    "4": {},
                    "5": {},
                    "6": {},
                    "7": {},
                    "8": {},
                    "9": {},
                    "10": {},
                    "11": {},
                    "12": {},
                    "13": {},
                    "14": {},
                    "15": {},
                    "16": {},
                    "17": {},
                    "18": {},
                    "19": {},
                    "20": {},
                    "21": {},
                    "22": {},
                    "23": {}
                }
            }
        };
        localStorage.setItem("ejs_arcade_settings", JSON.stringify(keyMap));
    }
    //加载loaderjs
    document.write("<script src='" + emuHost + "/js/loader.js'></script>");

    function getHost(src, length) {
        var ss = src.split("/");
        ss.length = ss.length - length;
        var path = ss.join("/");
        return path;
    }

    function getCurrentScript() {
        var js = "emu-utils.js";
        var script = document.currentScript;
        if (!script && document.querySelector) {
            script = document.querySelector("script[src*='" + js + "']");
        }
        if (!script) {
            var scripts = document.getElementsByTagName("script");
            for (var i = 0, l = scripts.length; i < l; i++) {
                var src = scripts[i].src;
                if (src.indexOf(js) != -1) {
                    script = scripts[i];
                    break;
                }
            }
        }
        return script;
    }
})()
