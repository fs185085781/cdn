(function(win){
    "use strict";
    var ui = win[win.uiprefix];
    /*表单组件*/
    /*按钮*/
    var button = {
        init:function(){
            var that = this;
            var btn = iBase("<button class=\"btn btn-primary\"><label><i></i></label><span></span></button>");
            btn.appendTo(iBase(that.el));
            that._buttonEl = iBase(btn)[0];
            that.setWidth(120);
            that.setHeight(38);
            iBase(that._buttonEl).click(function(e){
                e.stopPropagation();
                that.fire("click");
            });
        },
        getText:function(){
            return this.text;
        },
        setText:function(val){
            var oldText = this.text;
            iBase(this._buttonEl).find("span").html(val);
            this.text = val;
            if(oldText != val){
                this.fire("textchange",{oldText:oldText,text:val});
            }
        },
        getIconCls:function(){
            return this.iconCls;
        },
        setIconCls:function(val){
            var that = this;
            if(!val){
                iBase(that._buttonEl).removeClass("btn-label");
                iBase(that._buttonEl).find("i").attr("class","");
            }else{
                iBase(that._buttonEl).addClass("btn-label");
                iBase(that._buttonEl).find("i").addClass("fa "+val);
            }
            that.iconCls = val;
        }

    }
    ui.Button = function(){}
    ui.regModule({
        clazz:ui.Button,
        useClass:ui.prefix+"-button",
        fields:["text","iconCls","moldType","plain","checked","checkOnClick","groupName"],
        events:["click","textchange"],
        parentClass:ui.BaseModule,
        thisClass:button,
        init:button.init
    });
})(window);
