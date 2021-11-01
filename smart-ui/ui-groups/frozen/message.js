(function(){
    var vueObj = {};
    if(window.Vue){
        vueObj = new Vue({});
    }
    function getMsgId(type) {
        var that = utils.message;
        if(!that.attrs[type]){
            that.attrs[type] = type+"_"+utils.uuid();
        }
        return that.attrs[type];
    }
    function appendStr(options){
        removeStr(options.type);
        jQuery("body").append(options.str);
        if(options.type == "msg"){
            var that = utils.message;
            if(that.attrs.msgTimeOut){
                clearTimeout(that.attrs.msgTimeOut);
            }
            that.attrs.msgTimeOut = setTimeout(function () {
                removeStr("msg");
            },3000);
        }
    }
    function removeStr(type){
        if(jQuery("#"+getMsgId(type)).length>0){
            jQuery("#"+getMsgId(type)).remove();
        }
    }
    utils.message = {
        attrs:{vue:vueObj},
        msg:function(text,type){
            var that = this;
            if(!type){
                type = "default";
            }
            var clazz = "";
            if(type == "info"){
                clazz = "ui-tooltips-guide";
            }else if(type == "error"){
                clazz = "ui-tooltips-error";
            }else if(type=="success"){
                clazz = "ui-tooltips-success";
            }else if(type=="warning"){
                clazz = "ui-tooltips-warn";
            }
            var istr = "";
            if(clazz){
                istr = "<i></i>";
            }
            var str = "<div id=\""+getMsgId("msg")+"\" class=\"ui-tooltips "+clazz+"\" style=\"\n" +
                "    position: fixed;\n" +
                "    top: 0px;\n" +
                "    left: 0px;\n" +
                "\">\n" +
                "        <div class=\"ui-tooltips-cnt ui-border-b\">"+istr+"\n" +
                "            "+text+"<a class=\"ui-icon-close\" onclick=\"utils.message.cancelLoading(\"msg\")\"></a>\n" +
                "        </div>\n" +
                "    </div>";
            appendStr({str:str,type:"msg"});
        },
        loading:function(text){
            if(!text){
                text = "";
            }
            var str = "<div id=\""+getMsgId("loading")+"\" class=\"ui-loading-block show\">\n" +
                "    <div class=\"ui-loading-cnt\">\n" +
                "        <i class=\"ui-loading-bright\"></i>\n" +
                "        <p>"+text+"</p>\n" +
                "    </div>\n" +
                "</div>";
            appendStr({str:str,type:"loading"});
        },
        cancelLoading:function(type){
            if(!type){
                type = "loading";
            }
            removeStr(type);
        },
        alert:function(text,callback){
            var fnname = "alert"+utils.uuid();
            window[fnname] = function () {
                utils.removeProp(window,fnname);
                removeStr("alert");
                if(callback){
                    callback();
                }
            }
            var str = "<div id=\""+getMsgId("alert")+"\" class=\"ui-dialog show\">\n" +
                "    <div class=\"ui-dialog-cnt\">\n" +
                "        <div class=\"ui-dialog-bd\">\n" +
                "            <h3>提示</h3>\n" +
                "            <p>"+text+"</p>\n" +
                "        </div>\n" +
                "        <div class=\"ui-dialog-ft\">\n" +
                "            <button type=\"button\" data-role=\"button\" onclick=\""+fnname+"()\">确定</button>\n" +
                "        </div>\n" +
                "    </div>\n" +
                "</div>";
            appendStr({str:str,type:"alert"});
        },
        confirm:function(text,callback){
            var fnname = "confirm"+utils.uuid();
            window[fnname] = function (val) {
                utils.removeProp(window,fnname);
                removeStr("confirm");
                if(callback){
                    callback(val);
                }
            }
            var str = "<div id=\""+getMsgId("confirm")+"\" class=\"ui-dialog show\">\n" +
                "    <div class=\"ui-dialog-cnt\">\n" +
                "        <div class=\"ui-dialog-bd\">\n" +
                "            <h3>提示</h3>\n" +
                "            <p>"+text+"</p>\n" +
                "        </div>\n" +
                "        <div class=\"ui-dialog-ft\">\n" +
                "            <button type=\"button\" data-role=\"button\" onclick=\""+fnname+"(1)\">确定</button>\n" +
                "            <button type=\"button\" data-role=\"button\" onclick=\""+fnname+"(0)\">取消</button>\n" +
                "        </div>\n" +
                "    </div>\n" +
                "</div>";
            appendStr({str:str,type:"confirm"});
        },
        prompt:function(text,callback){
            var fnname = "prompt"+utils.uuid();
            window[fnname] = function (val) {
                var inputVal = $("#"+getMsgId("prompt")+" input").val();
                utils.removeProp(window,fnname);
                removeStr("prompt");
                if(callback){
                    callback(val,inputVal);
                }
            }
            var str = "<div id=\""+getMsgId("prompt")+"\" class=\"ui-dialog show\">\n" +
                "    <div class=\"ui-dialog-cnt\">\n" +
                "        <div class=\"ui-dialog-bd\">\n" +
                "            <h3>提示</h3>\n" +
                "            <p>"+text+"</p>\n" +
                "<div class=\"ui-input ui-border-radius ui-input-text\">\n" +
                "        <input type=\"text\" name=\"\" value=\"\" placeholder=\"请输入内容\" style=\"border: 1px solid #ccc;\">\n" +
                "    </div>" +
                "        </div>\n" +
                "        <div class=\"ui-dialog-ft\">\n" +
                "            <button type=\"button\" data-role=\"button\" onclick=\""+fnname+"(1)\">确定</button>\n" +
                "            <button type=\"button\" data-role=\"button\" onclick=\""+fnname+"(0)\">取消</button>\n" +
                "        </div>\n" +
                "    </div>\n" +
                "</div>";
            appendStr({str:str,type:"prompt"});
        }
    }
})();