/*function formateDatetest($, D, F){
    if (!$ || !$.getFullYear || isNaN($)) return "";
    var M = $.toString(),
        _ = mini.dateInfo;
    if (!_) _ = mini.dateInfo;
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
        M = M.replace(/MMMM/g, mini._escapeDateTimeTokens(_.monthsLong[I]));
        M = M.replace(/MMM/g, mini._escapeDateTimeTokens(_.monthsShort[I]));
        M = M.replace(/MM/g, I + 1 < 10 ? "0" + (I + 1) : I + 1);
        M = M.replace(/(\\)?M/g, function($, _) {
            return _ ? $ : I + 1
        });
        var H = $.getDay();
        M = M.replace(/dddd/g, mini._escapeDateTimeTokens(_.daysLong[H]));
        M = M.replace(/ddd/g, mini._escapeDateTimeTokens(_.daysShort[H]));
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
}*/
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
        parseDate:function(str,format){
            var that = this;
            if(!format){
                return that.parseDate(str,"yyyy-MM-dd HH:mm:ss");
            }
            var y,M,d,H,m,s,f,t;
            var fields = ["yyyy","yy","hy","y","Q","q","MMMM","MMM","MM","M","dddd","ddd","dd","d","HH","H","hh","h","mm","m","ss","s","fff","ff","f","tt","t"];
            var regs = ["\\d{4}","\\d{2}","(上|下)半年","\\d{1,2}","(一|二|三|四)季度","(Q1|Q2|Q3|Q4)","[一-四]{1,2}月","[0-9]{1,2}月","\\d{2}","\\d{1,2}","星期([一-四]|日)","([一-四]|日)","\\d{2}","\\d{1,2}","\\d{2}","\\d{1,2}","\\d{2}","\\d{1,2}","\\d{2}","\\d{1,2}","\\d{2}","\\d{1,2}","\\d{3}","\\d{2,3}","\\d{1,3}","(上|下)午","(A|P)M"];
            var dataReg = format;
            for(var i=0;i<fields.length;i++){
                var field = fields[i];
                console.log(new RegExp(regs[i],"g"))
                dataReg = dataReg.replace(fields[i],regs[i]);
            }
            var allReg = new RegExp(dataReg);
            console.log(allReg);
            return "11";


        }
    }
    if(!window.utils){
        window.utils = {};
    }
    for(var key in dateUtils){
        window.utils[key] = dateUtils[key];
    }
})()
