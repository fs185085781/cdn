(function(){
    "use strict";
    /*拓展时间格式化*/
    var dateInfo = {
        monthsLong: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        monthsShort: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
        daysLong: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
        daysShort: ["日", "一", "二", "三", "四", "五", "六"],
        quarterLong: ["一季度", "二季度", "三季度", "四季度"],
        quarterShort: ["Q1", "Q2", "Q2", "Q4"],
        halfYearLong: ["上半年", "下半年"],
        patterns: {
            "d": "yyyy-MM-dd",
            "D": "yyyy年MM月dd日",
            "f": "yyyy年MM月dd日 HH:mm",
            "F": "yyyy年MM月dd日 HH:mm:ss",
            "g": "yyyy-MM-dd HH:mm",
            "G": "yyyy-MM-dd HH:mm:ss",
            "m": "MMMdd日",
            "o": "yyyy-MM-ddTHH:mm:ss.fff",
            "s": "yyyy-MM-ddTHH:mm:ss",
            "t": "HH:mm",
            "T": "HH:mm:ss",
            "U": "yyyy年MM月dd日 HH:mm:ss",
            "y": "yyyy年MM月"
        },
        tt: {
            "AM": "上午",
            "PM": "下午"
        },
        ten: {
            "Early": "上旬",
            "Mid": "中旬",
            "Late": "下旬"
        },
        today: "今天",
        clockType: 24
    };
    var DateUtils = {
        formatDate:function($, D) {
            if (!$ || !$.getFullYear || isNaN($)) return "";
            var M = $.toString(),
                _ = dateInfo;
            if (typeof(_) !== "undefined") {
                var E = typeof(_.patterns[D]) !== "undefined" ? _.patterns[D] : D,
                    A = $.getFullYear(),
                    I = $.getMonth(),
                    L = $.getDate();
                if (D == "yyyy-MM-dd") {
                    I = I + 1 < 10 ? "0" + (I + 1) : I + 1;
                    L = L < 10 ? "0" + L : L;
                    return A + "-" + I + "-" + L
                }
                if (D == "MM/dd/yyyy") {
                    I = I + 1 < 10 ? "0" + (I + 1) : I + 1;
                    L = L < 10 ? "0" + L : L;
                    return I + "/" + L + "/" + A
                }
                M = E.replace(/yyyy/g, A);
                M = M.replace(/yy/g, (A + "").substring(2));
                var C = $.getHalfYear();
                M = M.replace(/hy/g, _.halfYearLong[C]);
                var N = $.getQuarter();
                M = M.replace(/Q/g, _.quarterLong[N]);
                M = M.replace(/q/g, _.quarterShort[N]);
                M = M.replace(/MMMM/g, DateUtils._escapeDateTimeTokens(_.monthsLong[I]));
                M = M.replace(/MMM/g, DateUtils._escapeDateTimeTokens(_.monthsShort[I]));
                M = M.replace(/MM/g, I + 1 < 10 ? "0" + (I + 1) : I + 1);
                M = M.replace(/(\\)?M/g, function($, _) {
                    return _ ? $ : I + 1
                });
                var H = $.getDay();
                M = M.replace(/dddd/g, DateUtils._escapeDateTimeTokens(_.daysLong[H]));
                M = M.replace(/ddd/g, DateUtils._escapeDateTimeTokens(_.daysShort[H]));
                M = M.replace(/dd/g, L < 10 ? "0" + L : L);
                M = M.replace(/(\\)?d/g, function($, _) {
                    return _ ? $ : L
                });
                var J = $.getHours(),
                    K = J > 12 ? J - 12 : J;
                if (_.clockType == 12)
                    if (J > 12) J -= 12;
                M = M.replace(/HH/g, J < 10 ? "0" + J : J);
                M = M.replace(/(\\)?H/g, function($, _) {
                    return _ ? $ : J
                });
                M = M.replace(/hh/g, K < 10 ? "0" + K : K);
                M = M.replace(/(\\)?h/g, function($, _) {
                    return _ ? $ : K
                });
                var B = $.getMinutes();
                M = M.replace(/mm/g, B < 10 ? "0" + B : B);
                M = M.replace(/(\\)?m/g, function($, _) {
                    return _ ? $ : B
                });
                var G = $.getSeconds();
                M = M.replace(/ss/g, G < 10 ? "0" + G : G);
                M = M.replace(/(\\)?s/g, function($, _) {
                    return _ ? $ : G
                });
                M = M.replace(/fff/g, $.getMilliseconds());
                M = M.replace(/tt/g, $.getHours() > 12 || $.getHours() == 0 ? _.tt["PM"] : _.tt["AM"]);
                var $ = $.getDate(),
                    O = "";
                if ($ <= 10) O = _.ten["Early"];
                else if ($ <= 20) O = _.ten["Mid"];
                else O = _.ten["Late"];
                M = M.replace(/ten/g, O)
            }
            return M.replace(/\\/g, "")
        },
        parseDate:function(A, $) {
            try {
                var C = window["ev" + "al"](A);
                if (C && C.getFullYear) return C
            } catch (B) {}
            if (typeof A == "object") return isNaN(A) ? null : A;
            if (typeof A == "number") {
                C = new Date(A * 1000);
                if (C.getTime() != A) return null;
                return isNaN(C) ? null : C
            }
            if (typeof A == "string") {
                var  m = A.match(/^([0-9]{4})([0-9]{2})([0-9]{0,2})$/);
                if (m) {
                    var _ = new Date(parseInt(m[1], 10), parseInt(m[2], 10) - 1);
                    if (m[3]) _.setDate(m[3]);
                    return _
                }
                m = A.match(/^([0-9]{4}).([0-9]*)$/);
                if (m) {
                    _ = new Date(m[1], m[2] - 1);
                    return _
                }
                if (A.match(/^\d+(\.\d+)?$/)) {
                    C = new Date(parseFloat(A) * 1000);
                    if (C.getTime() != A) return null;
                    else return C
                }
                if ($ === undefined) $ = true;
                C = DateUtils.parseISO8601(A, $) || (A ? new Date(A) : null);
                return isNaN(C) ? null : C
            }
            return null
        },
        parseISO8601:function(A, $) {
            var D = A.match(/^([0-9]{4})([-\/]([0-9]{1,2})([-\/]([0-9]{1,2})([T ]([0-9]{1,2}):([0-9]{1,2})(:([0-9]{1,2})(\.([0-9]+))?)?(Z|(([-+])([0-9]{2})(:?([0-9]{2}))?))?)?)?)?$/);
            if (!D) {
                D = A.match(/^([0-9]{4})[-\/]([0-9]{2})[-\/]([0-9]{2})[T ]([0-9]{1,2})/);
                if (D) {
                    var _ = new Date(D[1], D[2] - 1, D[3], D[4]);
                    return _
                }
                D = A.match(/^([0-9]{4}).([0-9]*)$/);
                if (D) {
                    _ = new Date(D[1], D[2] - 1);
                    return _
                }
                D = A.match(/^([0-9]{4}).([0-9]*).([0-9]*)/);
                if (D) {
                    _ = new Date(D[1], D[2] - 1, D[3]);
                    return _
                }
                D = A.match(/^([0-9]{2})-([0-9]{2})-([0-9]{4})$/);
                if (!D) return null;
                else {
                    _ = new Date(D[3], D[1] - 1, D[2]);
                    return _
                }
            }
            _ = new Date(D[1], 0, 1);
            if ($ || !D[14]) {
                var C = new Date(D[1], 0, 1, 9, 0);
                if (D[3]) {
                    _.setMonth(D[3] - 1);
                    C.setMonth(D[3] - 1)
                }
                if (D[5]) {
                    _.setDate(D[5]);
                    C.setDate(D[5])
                }
                DateUtils.fixDate(_, C);
                if (D[7]) _.setHours(D[7]);
                if (D[8]) _.setMinutes(D[8]);
                if (D[10]) _.setSeconds(D[10]);
                if (D[12]) _.setMilliseconds(Number("0." + D[12]) * 1000);
                DateUtils.fixDate(_, C)
            } else {
                _.setUTCFullYear(D[1], D[3] ? D[3] - 1 : 0, D[5] || 1);
                _.setUTCHours(D[7] || 0, D[8] || 0, D[10] || 0, D[12] ? Number("0." + D[12]) * 1000 : 0);
                var B = Number(D[16]) * 60 + (D[18] ? Number(D[18]) : 0);
                B *= D[15] == "-" ? 1 : -1;
                _ = new Date(+_ + (B * 60 * 1000))
            }
            return _
        },fixDate:function($, _) {
            if (+$)
                while ($.getDate() != _.getDate()) $.setTime(+$ + ($ < _ ? 1 : -1) * HOUR_MS)
        },
        _escapeDateTimeTokens:function($) {
            return $.replace(/([dMyHmsft])/g, "\\$1")
        }
    }
    window.Date.prototype.format = function(formatStr){
        return DateUtils.formatDate(this,formatStr);
    };
    window.Date.prototype.getHalfYear = function() {
        if (!this.getMonth) return null;
        var $ = this.getMonth();
        if ($ < 6) return 0;
        return 1
    };
    window.Date.prototype.getQuarter = function() {
        if (!this.getMonth) return null;
        var $ = this.getMonth();
        if ($ < 3) return 0;
        if ($ < 6) return 1;
        if ($ < 9) return 2;
        return 3
    };
    /*让低版本浏览器支持JSON*/
    var JSONUtils = new(function() {
        var __js_dateRegEx = new RegExp("(^|[^\\\\])\\\"\\\\/Date\\((-?[0-9]+)(?:[a-zA-Z]|(?:\\+|-)[0-9]{4})?\\)\\\\/\\\"", "g");
        var __js_dateRegEx2 = new RegExp("[\"']/Date\\(([0-9]+)\\)/[\"']", "g");
        var E = [],
            B = null,
            F = !!{}.hasOwnProperty,
            D = function($, _) {
                var A = C[_];
                if (A) return A;
                A = _.charCodeAt();
                return "\\u00" + Math.floor(A / 16).toString(16) + (A % 16).toString(16)
            },
            A = function(M, G) {
                if (M === null) {
                    E[E.length] = "null";
                    return
                }
                var H = typeof M;
                if (H == "undefined") {
                    E[E.length] = "null";
                    return
                } else if (M.push) {
                    E[E.length] = "[";
                    var C, J, K = M.length,
                        I;
                    for (J = 0; J < K; J += 1) {
                        I = M[J];
                        H = typeof I;
                        if (H == "undefined" || H == "function" || H == "unknown");
                        else {
                            if (C) E[E.length] = ",";
                            A(I);
                            C = true
                        }
                    }
                    E[E.length] = "]";
                    return
                } else if (M.getFullYear) {
                    if (B) {
                        E[E.length] = "\"";
                        if (typeof B == "function") E[E.length] = B(M, G);
                        else E[E.length] = DateUtils.formatDate(M, B);
                        E[E.length] = "\""
                    } else {
                        var L;
                        E[E.length] = "\"";
                        E[E.length] = M.getFullYear();
                        E[E.length] = "-";
                        L = M.getMonth() + 1;
                        E[E.length] = L < 10 ? "0" + L : L;
                        E[E.length] = "-";
                        L = M.getDate();
                        E[E.length] = L < 10 ? "0" + L : L;
                        E[E.length] = " ";
                        L = M.getHours();
                        E[E.length] = L < 10 ? "0" + L : L;
                        E[E.length] = ":";
                        L = M.getMinutes();
                        E[E.length] = L < 10 ? "0" + L : L;
                        E[E.length] = ":";
                        L = M.getSeconds();
                        E[E.length] = L < 10 ? "0" + L : L;
                        E[E.length] = "\""
                    }
                    return
                } else if (H == "string") {
                    if ($.test(M)) {
                        E[E.length] = "\"";
                        E[E.length] = M.replace(_, D);
                        E[E.length] = "\"";
                        return
                    }
                    E[E.length] = "\"" + M + "\"";
                    return
                } else if (H == "number") {
                    E[E.length] = M;
                    return
                } else if (H == "boolean") {
                    E[E.length] = String(M);
                    return
                } else {
                    E[E.length] = "{";
                    C, J, I;
                    for (J in M)
                        if (!F || Object.prototype.hasOwnProperty.call(M, J)) {
                            I = M[J];
                            H = typeof I;
                            if (H == "undefined" || H == "function" || H == "unknown");
                            else {
                                if (C) E[E.length] = ",";
                                A(J);
                                E[E.length] = ":";
                                A(I, J);
                                C = true
                            }
                        }
                    E[E.length] = "}";
                    return
                }
            },
            C = {
                "\b": "\\b",
                "\t": "\\t",
                "\n": "\\n",
                "\f": "\\f",
                "\r": "\\r",
                "\"": "\\\"",
                "\\": "\\\\"
            },
            $=/["\\\x00-\x1f]/,_=/([\x00-\x1f\\"])/g;
        this.encode = function() {
            var $;
            return function(_, $) {
                E = [];
                B = $;
                A(_);
                B = null;
                return E.join("")
            }
        }();
        this.decode = function() {
            var A = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2}):(\d{2}(?:\.*\d*)?)Z*$/,
                _ = new RegExp("^/+Date\\((-?[0-9]+).*\\)/+$", "g"),
                $ = /[\"\'](\d{4})-(\d{1,2})-(\d{1,2})[T ](\d{1,2}):(\d{1,2}):(\d{1,2})(\.*\d*)[\"\']/g;
            return function(H, E) {
                if (H === "" || H === null || H === undefined) return H;
                if (typeof H == "object") H = this.encode(H);

                function B(_) {
                    if (E !== false) {
                        _ = _.replace(__js_dateRegEx, "$1new Date($2)");
                        _ = _.replace($, "new Date($1,$2-1,$3,$4,$5,$6)");
                        _ = _.replace(__js_dateRegEx2, "new Date($1)");
                    }
                    return window["ev" + "al"]("(" + _ + ")")
                }
                var F = null;
                if (window.JSON && window.JSON.parse) {
                    var G = function(C, B) {
                        if (typeof B === "string" && E !== false) {
                            A.lastIndex = 0;
                            var $ = A.exec(B);
                            if ($) {
                                B = new Date($[1], $[2] - 1, $[3], $[4], $[5], $[6]);
                                return B
                            }
                            _.lastIndex = 0;
                            $ = _.exec(B);
                            if ($) {
                                B = new Date(parseInt($[1]));
                                return B
                            }
                        }
                        return B
                    };
                    try {
                        var C = H.replace(__js_dateRegEx, "$1\"/Date($2)/\"");
                        F = window.JSON.parse(C, G)
                    } catch (D) {
                        F = B(H)
                    }
                } else F = B(H);
                return F
            }
        }()
    })();
    var utils = {
        jsonEncode:JSONUtils.encode,
        jsonDecode:JSONUtils.decode,
        formatDate:DateUtils.formatDate,
        parseDate:DateUtils.parseDate,
        setLocalStorage:function(key,val){
            var map = {};
            map[key] = val;
            localStorage.setItem(key,JSON.stringify(map));
        },
        getLocalStorage:function(key){
            var mapStr = localStorage.getItem(key);
            if(!mapStr){
                mapStr = "{}";
            }
            var map = JSON.parse(mapStr);
            return map[key];
        },
        delLocalStorage:function(key){
            localStorage.removeItem(key);
        }
    };
    window.utils = utils;
})()