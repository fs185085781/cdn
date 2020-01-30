(function(){
    function numToMonth(m,flag){
        function numToStr(i){
            switch (i) {
                case 1:return "一";
                case 2:return "二";
                case 3:return "三";
                case 4:return "四";
                case 5:return "五";
                case 6:return "六";
                case 7:return "七";
                case 8:return "八";
                case 9:return "九";
                case 10:return "十";
                case 11:return "十一";
                case 12:return "十二";
            }
            return "NaN";
        }
        if(flag){
            return numToStr(m)+"月";
        }else{
            return m+"月";
        }
    }
    function numToWeek(w,flag){
        function numToStr(i){
            switch (i) {
                case 0:return "日";
                case 1:return "一";
                case 2:return "二";
                case 3:return "三";
                case 4:return "四";
                case 5:return "五";
                case 6:return "六";
            }
            return "NaN";
        }
        var r = numToStr(w);
        if(flag){
            r = "星期"+r;
        }
        return r;
    }
    function numToQuarter(m,flag){
        if(m>9){
            return flag?"四季度":"Q4";
        }else if(m>6){
            return flag?"三季度":"Q3";
        }else if(m>3){
            return flag?"二季度":"Q2";
        }else{
            return flag?"一季度":"Q1";
        }
    }
    function numToHealthyYear(m){
        return m>6?"下半年":"上半年";
    }
    var dateUtils = {
        formatDate:function(date,format){
            if(!date || !(date instanceof Date)){
                return "";
            }
            if(!format){
                format = "yyyy-MM-dd HH:mm:ss";
            }
            var fields = ["yyyy","yy","hy","y","Q","q","MMMM","MMM","MM","M","dddd","ddd","dd","d","HH","H","hh","h","mm","m","ss","s","fff","ff","f","tt","t"];
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
            }
            for(var key in data){
                data[key+key] = data[key]<10?"0"+data[key]:""+data[key];
            }
            data.MMM = numToMonth(data.M);
            data.MMMM = numToMonth(data.M,true);
            data.ddd = numToWeek(date.getDay());
            data.dddd = numToWeek(date.getDay(),true);
            data.yyyy = yyyy;
            data.fff = data.f<100?(data.f<10?"00"+data.f:"0"+data.f):data.f;
            data.tt = data.H>=12?"下午":"上午";
            data.t = data.H>=12?"PM":"AM";
            data.Q=numToQuarter(data.M,true);
            data.q=numToQuarter(data.M);
            data.hy=numToHealthyYear(data.M);
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
    }
    /**时间拓展----开始*/
    Date.prototype.addMilliseconds = function(x){
        var v = this.getTime() + x;
        return new Date(v);
    }
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
    }
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
    }
    Date.parseDate = function(str,ignoreTimeZone){
        return dateUtils.parseDate(str,ignoreTimeZone);
    }
    Date.UTC()
    /**时间拓展----结束*/
})()