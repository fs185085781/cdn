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
            var formatMap ={};
            var MMMMS = ["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"];
            var MMMS = ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];
            var dddds = ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];
            var ddds = ["日","一","二","三","四","五","六"];
            //mini.formatDate(new Date(),"yyyy-yy-y-MMMM-MMM-MM-M-dddd-ddd-dd-d-HH-H-hh-h-mm-m-ss-s-SSS-SS-S-a");
            var year = date.getFullYear();//yyyy
            var month = date.getMonth();
            var day = date.getDate();
            var hour = date.getHours();
            var minutes = date.getMinutes();
            var seconds = date.getSeconds();
            var misec = date.getMilliseconds();
            var week = date.getDay();
            formatMap.yyyy = String(year);
            formatMap.yy =  formatMap.yyyy.substring(2);
            formatMap.y =  formatMap.yy;
            if( formatMap.y<10){
                formatMap.y = String( formatMap.y*1);
            }
            formatMap.MMMM = MMMMS[month];
            formatMap.MMM = MMMS[month];
            formatMap.M = String(month+1);
            formatMap.MM =  formatMap.M;
            if( formatMap.MM < 10){
                formatMap.MM = "0"+ formatMap.MM;
            }
            formatMap.dddd = dddds[week];
            formatMap.ddd = ddds[week];
            formatMap.d = String(day);
            formatMap.dd =  formatMap.d;
            if( formatMap.dd < 10){
                formatMap.dd = "0"+ formatMap.dd;
            }
            formatMap.H = String(hour);
            formatMap.HH =  formatMap.H;
            if( formatMap.HH < 10){
                formatMap.HH = "0"+ formatMap.HH;
            }
            formatMap.H = String(hour);
            formatMap.HH =  formatMap.H;
            if( formatMap.HH < 10){
                formatMap.HH = "0"+ formatMap.HH;
            }
            formatMap.m = String(minutes);
            formatMap.mm =  formatMap.m;
            if( formatMap.mm < 10){
                formatMap.mm = "0"+ formatMap.mm;
            }
            formatMap.s = String(seconds);
            formatMap.ss = formatMap.s;
            if(formatMap.ss < 10){
                formatMap.ss = "0"+formatMap.ss;
            }
            formatMap.S = String(misec);
            formatMap.SSS = formatMap.S;
            if(formatMap.SSS < 100){
                formatMap.SSS = "0"+formatMap.SSS;
            }
            if(formatMap.SSS < 10){
                formatMap.SSS = "0"+formatMap.SSS;
            }
            formatMap.aa = "AM";
            formatMap.h = String(hour);
            if(hour>=12){
                formatMap.aa = "PM";
                formatMap.h = String(hour-12);
            }
            formatMap.hh =  formatMap.h;
            if( formatMap.hh < 10){
                formatMap.hh = "0"+ formatMap.hh;
            }
            var arrs = ["yyyy","yy","y","MMMM","MMM","MM","M","dddd","ddd","dd","d","HH","H","hh","h","mm","m","ss","s","SSS","S","aa"];
            for(var i=0;i<arrs.length;i++){
                var arr = arrs[i];
                var c;
                while((c = format.indexOf(arr)) !=-1){
                    format = format.substring(0,c)+formatMap[arr]+format.substring(c+arr.length);
                }
            }
            return format;
        },
        parseDate:function(str,format){
            if(!str){
                return null;
            }
            if(str instanceof Date){
                return str;
            }
            /*format 为yyyy MM dd HH hh mm ss SSS aa的随意组合*/
            if(format){
                if(str.length != format.length){
                    return null;
                }
                var date = new Date();
                date.setFullYear(1900);
                date.setMonth(0);
                date.setDate(1);
                date.setHours(0);
                date.setMinutes(0);
                date.setSeconds(0);
                date.setMilliseconds(0);
                var formatMaps = [{id:"yyyy",name:"FullYear"},{id:"MM",name:"Month"},{id:"dd",name:"Date"},{id:"HH",name:"Hours"},{id:"hh",name:"Hours"},{id:"mm",name:"Minutes"},{id:"ss",name:"Seconds"},{id:"SSS",name:"Milliseconds"}];
                var flag = true;
                var c;
                var hourPlus=0;
                if((c = format.indexOf("aa")) != -1 && str.substring(c,c+2).toLowerCase() == "pm"){
                    hourPlus = 12;
                }
                for(var i=0;i<formatMaps.length;i++){
                    var formatMap = formatMaps[i];
                    if((c = format.indexOf(formatMap.id)) == -1){
                        continue;
                    }
                    var val = str.substring(c,c+formatMap.id.length);
                    if(!val || isNaN(val)){
                        flag = false;
                        break;
                    }
                    val = val*1;
                    if(formatMap.id == "MM"){
                        val = val -1;
                    }else if(formatMap.id == "hh"){
                        val = val + hourPlus;
                    }
                    eval("date.set"+formatMap.name+"("+val+")");
                }
                if(flag){
                    return date;
                }
            }else{
                var formats = ["yyyy-MM-dd HH:mm:ss.SSS","yyyy-MM-dd HH:mm:ss","yyyy-MM-dd HH:mm","yyyy-MM-dd","MM-dd-yyyy"];
                for(var i=0;i<formats.length;i++){
                    var tempDate = this.parseDate(str,formats[i]);
                    if(tempDate){
                        return tempDate;
                    }
                }
            }
            var tempDate = new Date(str);
            if(!isNaN(tempDate)){
                return tempDate;
            }
            return null;
        }
    };
    for(var key in simplePlus){
        win.simple[key] = simplePlus[key];
    }
})(window);