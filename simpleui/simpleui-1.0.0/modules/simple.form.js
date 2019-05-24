
(function(win){
    /*表单组件*/
    /*按钮*/
    var button = {
        init:function(){
            var that = this;
            var btn = iBase("<a class='btn btn-default' style='width:100%;height:100%'></a>");
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
            iBase(this._buttonEl).html(val);
            this.text = val;
            if(oldText != val){
                this.fire("textchange",{oldText:oldText,text:val});
            }
        },
        getHref:function(){
            return this.href;
        },
        setHref:function(val){
            if(!val){
                val = null;
                iBase(this._buttonEl).removeAttr("href");
            }else{
                iBase(this._buttonEl).attr("href",val);
            }
            this.href = val;
        }

    }
    simple.regModule({
        className:"Button",
        useClass:"simple-button",
        fields:["text","iconCls","iconStyle","href","plain","checked","checkOnClick","groupName"],
        events:["click","textchange"],
        parentClass:simple.BaseModule,
        thisClass:button,
        init:button.init
    });
})(window);
