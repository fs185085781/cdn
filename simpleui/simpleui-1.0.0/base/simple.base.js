(function(win){
    var simplePlus = {
        encode:function(jsonObj) {
            var that = this;
            var result = '',
                curVal;
            if (jsonObj === null) {
                return String(jsonObj);
            }
            switch (typeof jsonObj) {
                case 'number':
                case 'boolean':
                    return String(jsonObj);
                case 'string':
                    return '"' + jsonObj + '"';
                case 'undefined':
                case 'function':
                    return undefined;
            }
            switch (Object.prototype.toString.call(jsonObj)) {
                case '[object Array]':
                    result += '[';
                    for (var i = 0, len = jsonObj.length; i < len; i++) {
                        curVal = that.encode(jsonObj[i]);
                        result += (curVal === undefined ? null : curVal) + ",";
                    }
                    if (result !== '[') {
                        result = result.slice(0, -1);
                    }
                    result += ']';
                    return result;
                case '[object Date]':
                    return '"' + (jsonObj.toJSON ? jsonObj.toJSON() : jsonObj.toString()) + '"';
                case '[object RegExp]':
                    return "{}";
                case '[object Object]':
                    result += '{';
                    for (i in jsonObj) {
                        if (jsonObj.hasOwnProperty(i)) {
                            curVal = that.encode(jsonObj[i]);
                            if (curVal !== undefined) {
                                result += '"' + i + '":' + curVal + ',';
                            }
                        }
                    }
                    if (result !== '{') {
                        result = result.slice(0, -1);
                    }
                    result += '}';
                    return result;

                case '[object String]':
                    return '"' + jsonObj.toString() + '"';
                case '[object Number]':
                case '[object Boolean]':
                    return jsonObj.toString();
            }
        },
        decode:function(str){
            if(typeof str == "object"){
                return str;
            }
            return eval("("+str+")");
        },
        formatDate:function(date,format){
            if(!date){
                return null;
            }
            if(typeof date == "string"){
                return date;
            }
            if(!date instanceof Date){
                return null;
            }
            if(!format){
                format = "yyyy-MM-dd HH:mm:ss";
            }
            var MMMMS = ["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"];
            var MMMS = ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];
            var dddds = ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];
            var ddds = ["日","一","二","三","四","五","六"];
            //mini.formatDate(new Date(),"yyyy-yy-y-MMMM-MMM-MM-M-dddd-ddd-dd-d-HH-H-hh-h-mm-m-ss-s-WW-W-SSS-SS-S-a");
            var year = date.getFullYear();//yyyy
            var month = date.getMonth();
            var day = date.getDate();
            var hour = date.getHours();
            var minutes = date.getMinutes();
            var seconds = date.getSeconds();
            var misec = date.getMilliseconds();
            var week = date.getDay();
            var yyyy = String(year);
            var yy = yyyy.substring(2);
            var y = yy;
            if(y<10){
                y = String(y*1);
            }
            var MMMM = MMMMS[month];
            var MMM = MMMS[month];
            var M = String(month+1);
            var MM = M;
            if(MM < 10){
                MM = "0"+MM;
            }
            var dddd = dddds[week];
            var ddd = ddds[week];
            var d = String(day);
            var dd = d;
            if(dd < 10){
                dd = "0"+dd;
            }
            var H = String(hour);
            var HH = H;
            if(HH < 10){
                HH = "0"+HH;
            }
            var m = String(minutes);
            var mm = m;
            if(mm < 10){
                mm = "0"+mm;
            }
            var s = String(seconds);
            var ss = s;
            if(ss < 10){
                ss = "0"+ss;
            }
            var S = String(misec);
            var SSS = S;
            if(SSS < 100){
                SSS = "0"+SSS;
            }
            if(SSS < 10){
                SSS = "0"+SSS;
            }
            var SS = S;
            if(SS < 10){
                SS = "0"+SS;
            }
            var a = "AM";
            if(hour>=12){
                a = "PM";
            }






        }
    };
    for(var key in simplePlus){
        win.simple[key] = simplePlus[key];
    }
})(window);