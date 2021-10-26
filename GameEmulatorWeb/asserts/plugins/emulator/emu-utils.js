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
        pojieJs: function () {
            var that = this;
            Element.prototype.insertBeforeTemp = Element.prototype.insertBefore;
            Element.prototype.insertBefore = function (a, b) {
                if (a && a.src && a.src.indexOf("emulator.js") != -1) {
                    a.src = emuHost + "/js/emulator.js";
                } else {
                    //console.log(a);
                }
                this.insertBeforeTemp(a, b);
            }
            Element.prototype.appendChildTemp = Element.prototype.appendChild;
            Element.prototype.appendChild = function (a) {
                if (a && a.src && a.src.indexOf("webrtc-adapter.js") != -1) {
                    a.src = emuHost + "/js/webrtc-adapter.js";
                } else if (a && a.src && a.src.indexOf("ad.html") != -1) {
                    a.src = emuHost + "/data/ad.html"
                } else {
                    //console.log(a);
                }
                this.appendChildTemp(a);
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
                        console.log(b);
                    }
                } else {
                    console.log(b);
                }
                return this.openTemp(a, b, c);
            }
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
        initGame: function (options) {
            window.EJS_player = options.player;
            window.EJS_biosUrl = options.bios;
            window.EJS_gameUrl = options.gameUrl;
            window.EJS_gameID = options.id;
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
    });
    //加载默认的按键配置
    if (!localStorage.getItem("ejs_nes_settings")) {
        var keyMap = {"controllers":{"0":{"0":{"value":"72","value2":"1"},"1":{"value":"89","value2":"3"},"2":{"value":"70","value2":"8"},"3":{"value":"71","value2":"9"},"4":{"value":"87","value2":"12"},"5":{"value":"83","value2":"13"},"6":{"value":"65","value2":"14"},"7":{"value":"68","value2":"15"},"8":{"value":"74","value2":"0"},"9":{"value":"85","value2":"2"}}}};
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
