
(function(win){
    /*表单组件*/
    var button = {
        init:function(that){
            var btn = iBase("<a class='btn btn-default' style='width:100%;height:100%'></a>");
            btn.appendTo(iBase(that.el));
            that._buttonEl = iBase(btn)[0];
            that.setWidth(120);
            that.setHeight(38);
        },
        getText:function(){
            return this.text;
        },
        setText:function(val){
            iBase(this._buttonEl).html(val);
            this.text = val;
            this.fire("xixi");
        },
        getHref:function(){
            return this.href;
        },
        setHref:function(val){
            if(!val){
                val = null;
                console.log("触发删除");
                iBase(this._buttonEl).removeAttr("href");
            }else{
                console.log("触发覆盖");
                iBase(this._buttonEl).attr("href",val);
            }
            this.href = val;
        },

    }
    simple.regModule({
        className:"Button",
        useClass:"simple-button",
        fields:["text","iconCls","iconStyle","href","plain","checked","checkOnClick","groupName"],
        events:["click","xixi"],
        parentClass:simple.BaseModule,
        thisClass:button,
        init:button.init
    });
})(window);
