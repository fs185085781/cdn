(function(win){
    "use strict";
    var ui = win[win.uiprefix];
    var lang = {
        formatDate:{
            MMMMS:["January","February","March","April","May","June","July","August","September","October","November","December"],
            MMMS:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"],
            dddds:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
            ddds:["Sun","Mon","Tues","Wed","Thur","Fri","Sat"]
        },
        validate:{
            email:"请输入正确的邮箱",
            url:"请输入正确的网址",
            int:"请输入整数",
            float:"请输入小数",
            chinese:"请输入中文",
            pocode:"请输入正确的邮编",
            idcard:"请输入正确的身份证号",
            phone:"请输入正确的手机号",
            english:"请输入英文",
            required:"不能为空",
            isNaN:"不是数字",
            noVtype:"未找到正则表达式或错误信息",
            vtypeError:"正则表达式不合法",
            maxLength:"不能超过$1个字符串",
            minLength:"不能少于$1个字符串",
            rangeLength:"字符串长度必须在$1到$2之间",
            rangeChar:"字符个数必须在$1到$2之间",
            range:"数值范围必须在$1到$2之间"
        }
    }
    ui.lang = lang;
})(window);