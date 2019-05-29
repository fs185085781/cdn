(function(win){
    "use strict";
    var ui = win[win.uiprefix];
    /*表单组件*/
    /*菜单*/
    var menu={
        init:function(){
            var that = this;
            var menu = iBase("<ul></ul>");
            menu.appendTo(iBase(that.el));
            that._menuEl = iBase(menu)[0];
        },
        setVertical:function(val){
            var that = this;
            that.vertical = ui.parseBoolean(val);
            if(that.vertical){
                iBase(that._menuEl).removeClass("simple-landscape");
            }else{
                iBase(that._menuEl).addClass("simple-landscape");
            }
        },
        getVertical:function(){
            var that = this;
            if(that.vertical == null){
                that.vertical = true;
            }
            return that.vertical;
        },
        setAllowSelectItem:function(val){
            var that = this;
            that.allowSelectItem = ui.parseBoolean(val);
        },
        getAllowSelectItem:function(){
            var that = this;
            if(that.allowSelectItem == null){
                that.allowSelectItem = false;
            }
            return that.allowSelectItem;
        },
        getUrl:function(){
            return this.url;
        },
        setUrl:function(url){
            var that = this;
            that.url = url;
            if(!that.url){
                iBase(that._menuEl).html("");
                return;
            }
            that.reload();
        },
        reload:function(){
            this.loadUrl(this.getUrl(),this.getResultAsTree());
        },
        loadList:function(url){
            this.loadUrl(url,false);
        },
        loadTree:function(url){
            this.loadUrl(url,true);
        },
        loadUrl:function(url,flag){
            var that = this;
            if(!url){
                return;
            }
            iBase.ajax({
                url:url,
                type:"get",
                dataType:"text",
                success:function(ret){
                    var obj = ui.decode(ret.responseText);
                    that.resultAsTree = flag;
                    that.data = obj;
                    if(flag){
                        that.loadTreeData(obj);
                    }else{
                        that.loadListData(obj,that.getIdField(),that.getParentField());
                    }
                }
            });
        },
        loadListData:function(list,idField,parentField){
            this.loadTreeData(ui.list2tree(list,idField,parentField));
        },
        loadTreeData:function(tree){
            if(!(tree instanceof Array)){
                return;
            }
            console.log(tree);
            function createTreeByData(){

            }
            var ul = "<ul>";

            ul+="</ul>";

        },
        getResultAsTree:function(){
            if(this.resultAsTree == null){
                this.resultAsTree = true;
            }
            return this.resultAsTree;
        },
        setResultAsTree:function(val){
            var that = this;
            that.resultAsTree = ui.parseBoolean(val);
            that.reload();
        },
        getData:function(){
            return this.data;
        },
        setData:function(data){
            var that = this;
            if(!data){
                return;
            }
            that.data = ui.parseObject(data);
            if(that.getResultAsTree()){
                that.loadTreeData(that.getData());
            }else{
                that.loadListData(that.getData(),that.getIdField(),that.getParentField());
            }
        },
        getTextField:function(){

        },
        setTextField:function(){

        },
        getIdField:function(){
            return "id";
        },
        setIdField:function(){

        },
        getParentField:function(){
            return "pid";
        },
        setParentField:function(){

        }


    }
    ui.Menu = function(){}
    ui.regModule({
        clazz:ui.Menu,
        useClass:ui.prefix+"-menu",
        fields:["vertical","allowSelectItem","resultAsTree","url","data","textField","idField","parentField","dataField","iconClsField"],
        events:["itemclick","itemselect"],
        parentClass:ui.BaseModule,
        thisClass:menu,
        init:menu.init
    });
    /*按钮*/
    var button = {
        init:function(){
            var that = this;
            var group = iBase("<div class=\"btn-group\"></div>");
            group.appendTo(iBase(that.el));
            that._groupEl = iBase(group)[0];
            var btn = iBase("<button class=\"btn btn-default\" style=\"width:100%;\"><label><i></i></label><span></span><ul class=\"dropdown-menu\"></ul></button>");
            btn.appendTo(iBase(that._groupEl));
            that._buttonEl = iBase(btn)[0];
            that._menuEl = iBase(that._buttonEl).find("ul");
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
        },
        setMoldType:function(val){
            var that = this;
            var map = {"0":"btn-default","1":"btn-primary","2":"btn-success","3":"btn-info","4":"btn-warning","5":"btn-danger","6":"btn-secondary","7":"btn-dark","8":"btn-purple","9":"btn-pink","10":"btn-cyan","11":"btn-yellow","12":"btn-brown","13":"btn-link"}
            if(!val){
                val = "0";
            }
            val = val.trim();
            var newClass = map[val];
            if(!newClass){
                return;
            }
            var oldClass = map[that.getMoldType()];
            iBase(that._buttonEl).removeClass(oldClass);
            iBase(that._buttonEl).addClass(newClass);
            that.moldType = val;
        },
        getMoldType:function(){
            var that = this;
            if(!that.moldType){
                that.moldType = "0";
            }
            return that.moldType;
        },
        doClick:function(){
            this.fire("click");
        },
        getPlain:function(){
            var that = this;
            if(!that.plain){
                that.plain = false;
            }
            return that.plain;
        },
        setPlain:function(val){
            var that = this;
            that.plain = ui.parseBoolean(val);
            if(that.plain){
                iBase(that._buttonEl).css({border:"none",background:"none"});
            }else{
                iBase(that._buttonEl).css({border:"",background:""});
            }
        }
    }
    ui.Button = function(){}
    ui.regModule({
        clazz:ui.Button,
        useClass:ui.prefix+"-button",
        fields:["text","iconCls","moldType","plain",],
        events:["click","textchange"],
        parentClass:ui.BaseModule,
        thisClass:button,
        init:button.init
    });
})(window);
