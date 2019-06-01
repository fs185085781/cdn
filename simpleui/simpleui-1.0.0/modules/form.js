(function(win){
    "use strict";
    var ui = win[win.uiprefix];
    /*输入框*/
    var textbox = {
        init:function(){

        },
        validate:function(){

        },
        isValid:function(){

        },
        setIsValid:function(){

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
