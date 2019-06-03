(function(win){
    "use strict";
    var ui = win[win.uiprefix];
    /*输入框*/
    var textbox = {
        init:function(){
            var that = this;
            jQuery(that.el).append("<input style=\"width:100%;height:100%\" class=\"form-control\" type=\"text\" placeholder=\"\">");
            that._inputEl = jQuery(that.el).find(":input")[0];

        },
        validate:function(){
            //测试易
        },
        isValid:function(){
            //测试为
        },
        setIsValid:function(){

        },
        doValueChanged:function(){

        },
        setEmptyText:function(val){

        }
    };
    ui.TextBox = function(){};
    ui.regModule({
        clazz:ui.TextBox,
        useClass:ui.prefix+"-textbox",
        fields:["emptyText","value","allowInput","selectOnFocus","maxLength","errorMode","validateOnChanged","validateOnLeave","forceValidate","required","requiredErrorText","vtype","vtypeErrorText"],
        events:["valuechanged","validation","enter","keydown","keyup","focus","blur"],
        parentClass:ui.BaseModule,
        thisClass:textbox,
        init:textbox.init
    });
})(window);
