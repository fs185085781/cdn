﻿(function(win){
    "use strict";
    var ui = win[win.uiprefix];
    var lang = {
        formatDate:{
            MMMMS:["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],
            MMMS:["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
            dddds:["星期日","星期一","星期二","星期三","星期四","星期五","星期六"],
            ddds:["日","一","二","三","四","五","六"]
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