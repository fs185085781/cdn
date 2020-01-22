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
        parseDate:function(A, $){
            var str = A;
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
                m = str.match(/^([0-9]{4})([0-9]{2})([0-9]{0,2})$/);
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
                C = this.parseISO8601(A, $) || (A ? new Date(A) : null);
                return isNaN(C) ? null : C
            }
            return null
        },parseISO8601:function(A, $) {
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
                mini.fixDate(_, C);
                if (D[7]) _.setHours(D[7]);
                if (D[8]) _.setMinutes(D[8]);
                if (D[10]) _.setSeconds(D[10]);
                if (D[12]) _.setMilliseconds(Number("0." + D[12]) * 1000);
                mini.fixDate(_, C)
            } else {
                _.setUTCFullYear(D[1], D[3] ? D[3] - 1 : 0, D[5] || 1);
                _.setUTCHours(D[7] || 0, D[8] || 0, D[10] || 0, D[12] ? Number("0." + D[12]) * 1000 : 0);
                var B = Number(D[16]) * 60 + (D[18] ? Number(D[18]) : 0);
                B *= D[15] == "-" ? 1 : -1;
                _ = new Date(+_ + (B * 60 * 1000))
            }
            return _
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
    Date.parseDate = function(str,format){
        return dateUtils.parseDate(str,format);
    }
    /**时间拓展----结束*/
})()