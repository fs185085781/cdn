(function(){
    "use strict";
    /**时间拓展----开始*/
    var dateUtils = {
        formatDate:function(date,format){
            if(!date || !(date instanceof Date)){
                return "";
            }
            if(!format){
                format = "yyyy-MM-dd HH:mm:ss";
            }
            var fields = ["yyyy","yy","y","MM","M","dd","d","HH","H","hh","h","mm","m","ss","s","fff","ff","f"];
            var yyyy = date.getFullYear();
            var data = {
                y:yyyy - parseInt(yyyy/100)*100,
                M:date.getMonth()+1,
                d:date.getDate(),
                H:date.getHours(),
                h:date.getHours()>12?date.getHours()-12:date.getHours(),
                m:date.getMinutes(),
                s:date.getSeconds(),
                f:date.getMilliseconds()
            };
            for(var key in data){
                data[key+key] = data[key]<10?"0"+data[key]:""+data[key];
            }
            data.yyyy = yyyy;
            data.fff = data.f<100?(data.f<10?"00"+data.f:"0"+data.f):data.f;
            for(var i=0;i<fields.length;i++){
                var field = fields[i];
                format = format.replace(new RegExp(field,"g"),data[field]);
            }
            return format;
        },
        parseDate:function(str, ignoreTimeZone){
            try {
                var date = eval(str);
                if(date && date.getFullYear){
                    return date;
                }
            }catch(e){}
            if(typeof str == "object"){
                return isNaN(str) ? null : str;
            }
            if (typeof str == "number") {
                var date = new Date(str);
                if (date.getTime() != str){
                    return null;
                }
                return isNaN(date) ? null : date;
            }
            if (typeof str == "string") {
                var m = str.match(/^([0-9]{4})([0-9]{2})([0-9]{0,2})$/);
                if (m) {
                    var date = new Date(parseInt(m[1], 10), parseInt(m[2], 10) - 1);
                    if (m[3]){
                        date.setDate(m[3]);
                    }
                    return date;
                }
                m = str.match(/^([0-9]{4}).([0-9]*)$/);
                if (m) {
                    var date = new Date(m[1], m[2] - 1);
                    return date;
                }
                if (str.match(/^\d+(\.\d+)?$/)) {
                    var ms = parseInt(str);
                    var date = new Date(ms);
                    if(date.getTime() != ms) {
                        return null;
                    }
                    return isNaN(date) ? null : date;
                }
                if (ignoreTimeZone === undefined){
                    ignoreTimeZone = true;
                }
                var date = this.parseISO8601(str,ignoreTimeZone) || (str ? new Date(str) : null);
                return isNaN(date) ? null : date;
            }
            return null;
        },parseISO8601:function(str, ignoreTimeZone) {
            var m = str.match(/^([0-9]{4})([-\/]([0-9]{1,2})([-\/]([0-9]{1,2})([T ]([0-9]{1,2}):([0-9]{1,2})(:([0-9]{1,2})(\.([0-9]+))?)?(Z|(([-+])([0-9]{2})(:?([0-9]{2}))?))?)?)?)?$/);
            if (!m) {
                m = str.match(/^([0-9]{4})[-\/]([0-9]{2})[-\/]([0-9]{2})[T ]([0-9]{1,2})/);
                if (m) {
                    var date = new Date(m[1], m[2] - 1, m[3], m[4]);
                    return date;
                }
                m = str.match(/^([0-9]{4}).([0-9]*)$/);
                if (m) {
                    var date = new Date(m[1], m[2] - 1);
                    return date;
                }
                m = str.match(/^([0-9]{4}).([0-9]*).([0-9]*)/);
                if (m) {
                    var date = new Date(m[1], m[2] - 1, m[3]);
                    return date;
                }
                m = str.match(/^([0-9]{2})-([0-9]{2})-([0-9]{4})$/);
                if (!m) {
                    return null;
                }else {
                    var date = new Date(m[3], m[1] - 1, m[2]);
                    return date;
                }
            }
            var date = new Date(m[1], 0, 1);
            if (ignoreTimeZone || !m[14]) {
                var tempDate = new Date(m[1], 0, 1, 9, 0);
                if (m[3]) {
                    date.setMonth(m[3] - 1);
                    tempDate.setMonth(m[3] - 1);
                }
                if (m[5]) {
                    date.setDate(m[5]);
                    tempDate.setDate(m[5]);
                }
                this.fixDate(date, tempDate);
                if (m[7]){ date.setHours(m[7]);}
                if (m[8]){ date.setMinutes(m[8]);}
                if (m[10]){ date.setSeconds(m[10]);}
                if (m[12]){ date.setMilliseconds(Number("0." + m[12]) * 1000);}
                this.fixDate(date, tempDate);
            } else {
                date.setUTCFullYear(m[1], m[3] ? m[3] - 1 : 0, m[5] || 1);
                date.setUTCHours(m[7] || 0, m[8] || 0, m[10] || 0, m[12] ? Number("0." + m[12]) * 1000 : 0);
                var num = Number(m[16]) * 60 + (m[18] ? Number(m[18]) : 0);
                num *= m[15] == "-" ? 1 : -1;
                date = new Date(+date + (num * 60 * 1000))
            }
            return date;
        },
        fixDate:function(date, tempDate) {
            if (!(+date)){
                return;
            }
            while (date.getDate() != tempDate.getDate()){
                date.setTime(+date + (date < tempDate ? 1 : -1) * 3600000);
            }
        }
    };
    Date.prototype.addMilliseconds = function(x){
        var v = this.getTime() + x;
        return new Date(v);
    };
    Date.prototype.addMonths = function(x){
        var months = this.getFullYear()*12+this.getMonth()+x+1;
        var date = this.getDate();
        var year = parseInt(months/12);
        var temp = new Date(year,months-year*12,1,this.getHours(),this.getMinutes(),this.getSeconds(),this.getMilliseconds());
        var data = temp.addDays(-1);
        if(date<data.getDate()){
            data.setDate(date);
        }
        return data;
    };
    var dateMethods = [
        {prop:"addSeconds",parentProp:"addMilliseconds",pow:1000},
        {prop:"addMinutes",parentProp:"addSeconds",pow:60},
        {prop:"addHours",parentProp:"addMinutes",pow:60},
        {prop:"addDays",parentProp:"addHours",pow:24},
        {prop:"addYears",parentProp:"addMonths",pow:12}];
    for(var i=0;i<dateMethods.length;i++){
        var temp = dateMethods[i];
        (function(map){
            Date.prototype[map.prop] = function(x){
                return this[map.parentProp](x*map.pow);
            }
        })(temp);
    }
    Date.prototype.formatDate = function(format){
        return dateUtils.formatDate(this,format);
    };
    Date.parseDate = function(str,ignoreTimeZone){
        return dateUtils.parseDate(str,ignoreTimeZone);
    };
    /**时间拓展----结束*/
    /*改变json格式化--开始*/
    Date.prototype.toJSON = function () {
        return this.formatDate("yyyy-MM-dd HH:mm:ss.fff");
    };
    if(!window.JSON){
        /*增加json*/
        window.JSON = {
            stringify:function(obj){
                return jsonStrByData(obj);
                function jsonStrByData(data){
                    var type = Object.prototype.toString.call(data);
                    if(type =="[object Array]"){
                        var result = "[";
                        for(var i=0;i<data.length;i++){
                            if(i>0){
                                result += ",";
                            }
                            result += jsonStrByData(data[i]);
                        }
                        result += "]";
                        return result;
                    }else if(type == "[object Date]"){
                        return '"'+data.toJSON()+'"';
                    }else if(type == "[object Object]"){
                        if(!data){
                            var res = "undefined";
                            if(data === null){
                                res = "null";
                            }
                            return res;
                        }
                        var result = "{";
                        var isFirst=true;
                        for(var key in data){
                            var str = jsonStrByData(data[key]);
                            if(str == "undefined"){
                                continue;
                            }
                            if(!isFirst){
                                result += ",";
                            }
                            result += "\""+key+"\":"+str;
                            isFirst = false;
                        }
                        result+="}";
                        return result;
                    }else if(type == "[object String]"){
                        return '"'+data+'"';
                    }else if(type == "[object Number]" || type == "[object Boolean]" || type == "[object Null]"){
                        return String(data);
                    }else{
                        return "undefined";
                    }
                }
            },
            parse:function(str){
                if(typeof str == "object"){
                    return str;
                }
                var map = {data:eval("("+str+")")};
                parseDateDg(map);
                function parseDateDg(data){
                    if(!data){
                        return;
                    }
                    var type = Object.prototype.toString.call(data);
                    if(type =="[object Array]"){
                        for(var i=0;i<data.length;i++){
                            setDate(data,i);
                        }
                    }else if(type == "[object Object]"){
                        for(var key in data){
                            setDate(data,key);
                        }
                    }else{
                        return;
                    }
                }
                function setDate(data,key){
                    if(typeof data[key] == "string" && /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}/.test(data[key])){
                        data[key] = Date.parseDate(data[key]);
                    }else{
                        parseDateDg(data[key]);
                    }
                }
                return map.data;
            }
        };
    }else{
        var strToObj = JSON.parse;
        JSON.parse = function (text, reviver) {
            if(!reviver){
                reviver = function(key,val){
                    var type = Object.prototype.toString.call(val);
                    if(type == "[object String]"){
                        return toDate(val);
                    }else{
                        return val;
                    }
                    function toDate(data) {
                        if(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}/.test(data)){
                            return Date.parseDate(data);
                        }else{
                            return data;
                        }
                    }
                }
            }
            return strToObj(text,reviver);
        };
    }
    /*改变json格式化--结束*/
    /*增加localStorage实体形式--开始*/
    if(!window.Storage && !window.localStorage){
        window.Storage = function () {
        };
        window.Storage.prototype.removeItem=function(key){
            var exp = new Date();
            exp.setTime(exp.getTime() - 1);
            document.cookie= key + "=;expires="+exp.toGMTString();
        };
        window.Storage.prototype.setItem=function(key,val){
            var Days = 30;
            var exp  = new Date();
            exp.setTime(exp.getTime() + Days*24*60*60*1000);
            document.cookie = key + "="+ escape (val) + ";expires=" + exp.toGMTString();
        };
        window.Storage.prototype.getItem=function(key){
            var arr = document.cookie.match(new RegExp("(^| )"+key+"=([^;]*)(;|$)"));
            if(arr != null){
                return unescape(arr[2]);
            }else{
                return null;
            }
        };
        window.localStorage = new Storage();
    }
    Storage.prototype.getObject = function(key){
        var mapStr = this.getItem(key);
        if(!mapStr){
            mapStr = "{}";
        }
        var map = JSON.parse(mapStr);
        return map[key];
    };
    Storage.prototype.setObject = function(key,val){
        var map = {};
        map[key] = val;
        this.setItem(key,JSON.stringify(map));
    };
    /*增加localStorage实体形式--结束*/
    /**数值拓展----开始*/
    var numberMethods = ["floor","round","ceil"];
    for(var i=0;i<numberMethods.length;i++){
        var field = numberMethods[i];
        (function(f){
            Number.prototype[f] = function(x){
                if(x<0){
                    x = 0;
                }
                var pow = Math.pow(10,x);
                var temp = Math[f](this*pow);
                return temp/pow;
            }
        })(field);
    }
    /**数值拓展----结束*/
    /**精准计算拓展---开始*/
    var decimalMethods = ["add","subtract","multiply","divide"];
    for(var i=0;i<decimalMethods.length;i++){
        var field = decimalMethods[i];
        (function(f){
            Number.prototype[f] = function(x,maxJd,type){
                if(isNaN(x)){
                    throw x+" is not a number";
                }
                if(typeof x != "number"){
                    x = x*1;
                }
                if(isNaN(maxJd)){
                    console.warn(maxJd+" is not a number,will be reset to 15");
                    maxJd = 15;
                }
                if((!maxJd && maxJd != 0) || maxJd>15){
                    maxJd = 15;
                }
                type = type || "round";
                if(type != "floor" && type != "round" && type != "ceil"){
                    console.warn(type+" is not a number,will be reset to 'round'");
                    type = "round";
                }
                function getAssist(v){
                    var str = String(v);
                    var index = str.indexOf(".");
                    var res = index != -1?str.length - index -1:0;
                    if(res>maxJd){
                        res = maxJd;
                    }
                    var pow = Math.pow(10,res);
                    var num = v[type](res);
                    return {pow:pow,num:num};
                }
                var a = getAssist(this);
                var b = getAssist(x);
                var max = a.pow>b.pow?a.pow:b.pow;
                var jg = NaN;
                if(f=="add"){
                    jg = (a.num*max+b.num*max)/max;
                }else if(f=="subtract"){
                    jg = (a.num*max-b.num*max)/max;
                }else if(f=="multiply"){
                    jg = (a.num*a.pow)*(b.num*b.pow)/(a.pow*b.pow);
                }else if(f=="divide"){
                    jg = (a.num*max)/(b.num*max);
                }
                return jg;
            }
        })(field);
    }
    /**精准计算拓展---结束*/
})()