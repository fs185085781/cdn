(function(win){
    "use strict";
    var ui = win[win.uiprefix];
    /*表单组件*/
    /*菜单*/
    var menu={
        init:function(){
            var that = this;
            jQuery(that.el).on("click","li",function(e){
                e.stopPropagation();
                var liid = jQuery(e.currentTarget).attr("data-id");
                that.fire("itemclick",that.dataMap[liid]);
            });
            jQuery(that.el).on("mouseover","li",function(e){
                if(jQuery(e.currentTarget).find("i.fa").length>0){
                    var ul = jQuery(jQuery(e.currentTarget).find("ul")[0]);
                    var top = e.currentTarget.offsetTop;
                    var left = e.currentTarget.clientWidth;
                    if(top == 0 && left == 0){
                        return;
                    }
                    ul.show();
                    ul.css({top:top+"px",left:left+"px"});
                }
            });
            jQuery(that.el).on("mouseout","li",function(e){
                e.stopPropagation();
                if(jQuery(e.currentTarget).find("i.fa").length>0){
                    var ul = jQuery(jQuery(e.currentTarget).find("ul")[0]);
                    ul.hide();
                }
            });
        },
        getUrl:function(){
            return this.url;
        },
        setUrl:function(url){
            var that = this;
            url = ui.parseString(url);
            that.url = url;
            if(!that.url){
                jQuery(that.el).html("");
                return;
            }
            that.reload();
        },
        reload:function(){
            this.loadUrl(this.getUrl(),this.getResultAsTree());
        },
        loadList:function(url){
            url=ui.parseString(url);
            this.loadUrl(url,false);
        },
        loadTree:function(url){
            url=ui.parseString(url);
            this.loadUrl(url,true);
        },
        loadUrl:function(url,flag){
            var that = this;
            function loadData(){
                if(that.getResultAsTree()){
                    that.loadTreeData(that.getData(),that.getIdField(),that.getTextField());
                }else{
                    that.loadListData(that.getData(),that.getIdField(),that.getParentField(),that.getTextField());
                }
            }
            if(!url){
                if(that.getData() && (that.getData() instanceof Array )){
                    loadData();
                }
                return;
            }
            jQuery.ajax({
                url:url,
                dataType:"text",
                success:function(ret){
                    ret = ui.decode(ret);
                    var obj;
                    if(that.getDataField()){
                        obj = ret[that.getDataField()];
                    }else{
                        obj = ret;
                    }
                    that.resultAsTree = flag;
                    that.data = obj;
                    loadData();
                }
            });
        },
        loadListData:function(list,idField,parentField,textField){
            this.loadTreeData(ui.list2tree(list,idField,parentField),idField,textField);
        },
        loadTreeData:function(tree,idField,textField){
            var that = this;
            if(!(tree instanceof Array)){
                return;
            }
            if(!that.dataMap){
                that.dataMap = {};
            }
            function createLevelByData(tree,index){
                for(var i=0;i<tree.length;i++){
                    tree[i]._level = index;
                    that.dataMap[tree[i][idField]] = tree[i];
                    if(tree[i].children && (tree[i].children instanceof Array)){
                        createLevelByData(tree[i].children,index+1);
                    }
                }
            }
            createLevelByData(tree,1);
            function createTreeByData(list,map,idField,textField){
                map.str +="<ul class=\"dropdown-menu\">";
                for(var i=0;i<list.length;i++){
                    var one = list[i];
                    map.str +="<li data-id=\""+one[idField]+"\">";
                    var icon = "";
                    if(that.getIconClsField() && one[that.getIconClsField()]){
                        icon = "fa "+one[that.getIconClsField()];
                    }
                    map.str +="<a><i class=\""+icon+"\" style=\"float:left;\"></i>"+one[textField];
                    var children = one.children;
                    if(children && children instanceof Array){
                        map.str += "<i class=\"fa fa-chevron-right\" style=\"float:right;\"></i></a>";
                        createTreeByData(children,map,idField,textField);
                    }else{
                        map.str += "</a>";
                    }
                    map.str +="</li>";
                }
                map.str += "</ul>";
            }
            var map = {str:""};
            createTreeByData(tree,map,idField,textField);
            jQuery(that.el).html(map.str);
            that.menuEl = jQuery(that.el).find("ul")[0];
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
            var tempData = ui.parseObject(data);
            that.data = tempData;
            if(that.getResultAsTree()){
                that.loadTreeData(tempData,that.getIdField(),that.getTextField());
            }else{
                that.loadListData(tempData,that.getIdField(),that.getParentField(),that.getTextField());
            }
        },
        getTextField:function(){
            if(!this.textField){
                this.textField = "text";
            }
            return this.textField;
        },
        setTextField:function(val){
            val=ui.parseString(val);
            this.textField = val;
            this.reload();
        },
        getIdField:function(){
            if(!this.idField){
                this.idField = "id";
            }
            return this.idField;
        },
        setIdField:function(val){
            val=ui.parseString(val);
            this.idField = val;
            this.reload();
        },
        getParentField:function(){
            if(!this.parentField){
                this.parentField = "pid";
            }
            return this.parentField;
        },
        setParentField:function(val){
            val=ui.parseString(val);
            this.parentField = val;
            this.reload();
        },
        getDataField:function(){
            return this.dataField;
        },
        setDataField:function(val){
            val=ui.parseString(val);
            this.dataField = val;
            this.reload();
        },
        getIconClsField:function(){
            return this.iconClsField;
        },
        setIconClsField:function(val){
            this.iconClsField = val;
            this.reload();
        },
        openMenu:function(){
            var that = this;
            jQuery(that.menuEl).show();
        },
        closeMenu:function(){
            var that = this;
            jQuery(that.menuEl).hide();
        }
    }
    ui.Menu = function(){}
    ui.regModule({
        clazz:ui.Menu,
        useClass:ui.prefix+"-menu",
        fields:["resultAsTree","url","data","textField","idField","parentField","dataField","iconClsField"],
        events:["itemclick"],
        parentClass:ui.BaseModule,
        thisClass:menu,
        init:menu.init
    });
    /*按钮*/
    var button = {
        init:function(){
            var that = this;
            var btn = jQuery("<button class=\"btn btn-default\" style=\"width:100%;height:100%;\"><label><i></i></label><span></span></button>");
            btn.appendTo(jQuery(that.el));
            that._buttonEl = jQuery(btn)[0];
            jQuery(that._buttonEl).click(function(e){
                e.stopPropagation();
                that.fire("click");
            });
        },
        getText:function(){
            return this.text;
        },
        setText:function(val){
            val=ui.parseString(val);
            var oldText = this.text;
            jQuery(this._buttonEl).find("span").html(val);
            this.text = val;
            if(oldText != val){
                this.fire("textchange",{oldText:oldText,text:val});
            }
        },
        getIconCls:function(){
            return this.iconCls;
        },
        setIconCls:function(val){
            val=ui.parseString(val);
            var that = this;
            if(!val){
                jQuery(that._buttonEl).removeClass("btn-label");
                jQuery(that._buttonEl).find("i").attr("class","");
            }else{
                jQuery(that._buttonEl).addClass("btn-label");
                jQuery(that._buttonEl).find("i").addClass("fa "+val);
            }
            that.iconCls = val;
        },
        setMoldType:function(val){
            val=ui.parseString(val);
            var that = this;
            var map = {"0":"btn-default","1":"btn-primary","2":"btn-success","3":"btn-info","4":"btn-warning","5":"btn-danger","6":"btn-secondary","7":"btn-dark","8":"btn-purple","9":"btn-pink","10":"btn-cyan","11":"btn-yellow","12":"btn-brown","13":"btn-link"}
            if(!val){
                val = "0";
            }
            var newClass = map[val];
            if(!newClass){
                return;
            }
            var oldClass = map[that.getMoldType()];
            jQuery(that._buttonEl).removeClass(oldClass);
            jQuery(that._buttonEl).addClass(newClass);
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
                jQuery(that._buttonEl).css({border:"none",background:"none"});
            }else{
                jQuery(that._buttonEl).css({border:"",background:""});
            }
        }
    };
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
    /*按钮组*/
    var buttongroup={
        init:function(){
            /**/
            var that = this;
            var group = jQuery("<div class=\"btn-group\" style=\"height:100%;width:100%;\"></div>");
            group.appendTo(jQuery(that.el));
            that._groupEl = jQuery(group)[0];
            jQuery(that._groupEl).on("click","button",function(e){
                e.stopPropagation();
                var btnId=jQuery(e.currentTarget).attr("data-id");
                if(btnId){
                    that.fire("click",that.buttonMap[btnId]);
                }else{
                    if(jQuery(e.currentTarget).hasClass("dropdown-toggle")){
                        that.menu.openMenu();
                    }
                }
            });
        },
        getData:function(){
            return this.data;
        },
        setData:function(val){
            this.data = ui.parseObject(val);
            this.reload();
        },
        getIdField:function(){
            if(!this.idField){
                this.idField = "id";
            }
            return this.idField;
        },
        setIdField:function(val){
            val=ui.parseString(val);
            this.idField = val;
            this.reload();
        },
        getTextField:function(){
            if(!this.textField){
                this.textField = "text";
            }
            return this.textField;
        },
        setTextField:function(val){
            val=ui.parseString(val);
            this.textField = val;
            this.reload();
        },
        getMoldTypeField:function(){
            if(!this.moldTypeField){
                this.moldTypeField = "moldType";
            }
            return this.moldTypeField;
        },
        setMoldTypeField:function(val){
            val=ui.parseString(val);
            this.moldTypeField = val;
            this.reload();
        },
        getMoldTypeClass:function(moldType){
            var map = {"0":"btn-default","1":"btn-primary","2":"btn-success","3":"btn-info","4":"btn-warning","5":"btn-danger","6":"btn-secondary","7":"btn-dark","8":"btn-purple","9":"btn-pink","10":"btn-cyan","11":"btn-yellow","12":"btn-brown","13":"btn-link"};
            return map[moldType];
        },
        getMenuTreeData:function(){
            return this.menuTreeData;
        },
        setMenuTreeData:function(val){
            this.menuTreeData = ui.parseObject(val);
            this.reload();
            this.reloadMenu();
        },
        reload:function(){
            var that = this;
            var data = that.getData();
            if(!data || !(data instanceof Array)){
                return;
            }
            var str = "";
            var lastBtn ="";
            if(!that.buttonMap){
                that.buttonMap = {}
            }
            if(data.length == 0){
                return;
            }
            var width = (90/data.length).toFixed(0);
            for(var i=0;i<data.length;i++){
                var mtc = "";
                if(that.getMoldTypeField()){
                    var moldType = data[i][that.getMoldTypeField()];
                    if(moldType){
                        mtc = that.getMoldTypeClass(moldType);
                        if(mtc){
                            mtc=" "+mtc;
                        }else{
                            mtc = "";
                        }
                    }
                }
                that.buttonMap[data[i][that.getIdField()]] = data[i];
                str += "<button style=\"width:"+width+"%;height:100%;\" type=\"button\" data-id=\""+data[i][that.getIdField()]+"\" class=\"btn"+mtc+"\">"+data[i][that.getTextField()]+"</button>";
                if(i==data.length-1){
                    lastBtn = "<button style=\"width:"+(95-width*data.length)+"%;height:100%\" type=\"button\" class=\"btn"+mtc+" dropdown-toggle\"><span class=\"caret\"></span></button>";
                }
            }
            var menuData = that.getMenuTreeData();
            if(menuData && (menuData instanceof Array)){
                var menuConfig = "";
                if(that.getMenuIdField()){
                    menuConfig += " idField=\""+that.getMenuIdField()+"\"";
                }
                if(that.getMenuTextField()){
                    menuConfig += " textField=\""+that.getMenuTextField()+"\"";
                }
                if(that.getMenuIconField()){
                    menuConfig += " iconClsField=\""+that.getMenuIconField()+"\"";
                }
                str +=lastBtn+"<div class=\"simple-menu\""+menuConfig+"></div>";
            }
            jQuery(that._groupEl).html(str);
            if(menuData && (menuData instanceof Array)){
                ui.parse(jQuery(that._groupEl).find(".simple-menu")[0]);
                var menu = ui.getBySelect(jQuery(that._groupEl).find(".simple-menu")[0]);
                if(menu){
                    that.menu = menu;
                    menu.setData(menuData);
                    menu.on("itemclick",function(e){
                        that.fire("menuItemClick",e.data);
                    });
                    ui.pushHidePopup(menu.uikey,function(){
                        menu.closeMenu();
                    });
                }
            }else{
               delete that.menu;
            }
        },
        getMenuIdField:function(){
            if(!this.menuIdField){
                this.menuIdField = "id";
            }
            return this.menuIdField;
        },
        setMenuIdField:function(val){
            val=ui.parseString(val);
            this.menuIdField = val;
            this.reloadMenu();
        },
        getMenuTextField:function(){
            if(!this.menuTextField){
                this.menuTextField = "text";
            }
            return this.menuTextField;
        },
        setMenuTextField:function(val){
            val=ui.parseString(val);
            this.menuTextField = val;
            this.reloadMenu();
        },
        getMenuIconField:function(){
            return this.menuIconField;
        },
        setMenuIconField:function(val){
            val=ui.parseString(val);
            this.textField = val;
            this.reloadMenu();
        },
        reloadMenu:function(){
            var that = this;
            if(that.menu){
                that.menu.reload();
            }
        }
    }
    ui.ButtonGroup = function(){};
    ui.regModule({
        clazz:ui.ButtonGroup,
        useClass:ui.prefix+"-buttongroup",
        fields:["data","idField","textField","moldTypeField","menuTreeData","menuIdField","menuTextField","menuIconField"],
        events:["click","menuItemClick"],
        parentClass:ui.BaseModule,
        thisClass:buttongroup,
        init:buttongroup.init
    });
})(window);
