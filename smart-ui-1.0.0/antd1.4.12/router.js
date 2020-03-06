(function(){
    var router = {
        init:function(options){
            var that = this;
            that.attr = options;
            that.attr.menumap = {};
            that.attr.urlmap = {};
            eval("router.attr.vm."+that.attr.openKeysField+"=[]");
            var data = that.attr.menus;
            for(var i=0;i<data.length;i++){
                var menu = data[i];
                if(!menu[that.attr.menuUrlField]){
                    var openKeys = eval("router.attr.vm."+that.attr.openKeysField);
                    openKeys.push(menu[that.attr.menuIdField]);
                    continue;
                }
                that.attr.urlmap[menu[that.attr.menuUrlField]]=menu;
                that.attr.menumap[menu[that.attr.menuIdField]] = menu;
            }
            eval("router.attr.vm."+that.attr.menusField+"=listToTree(data)");
            if(window.location.hash){
                router.attr.vm.$nextTick(function(){
                    that.routerPageUrl(window.location.hash.substring(1));
                });
            }
        },
        routerPageUrl:function(url){
            var that = this;
            var menu = that.attr.urlmap[url];
            if(menu){
                that.routerPageId(menu[that.attr.menuIdField]);
            }else{
                utils.$.errorMsg(url+"没有在路由中注册");
            }
        },
        routerPageId:function(id){
            var that = this;
            var panes = eval("router.attr.vm."+that.attr.panesField);
            var has = false;
            for(var i=0;i<panes.length;i++){
                if(id == panes[i][that.attr.menuIdField]){
                    has = true;
                    break;
                }
            }
            var menu = that.attr.menumap[id];
            if(!has){
                panes.push(menu);
            }
            eval("router.attr.vm."+that.attr.selectKeyField+"=[id]");
            history.pushState({status: 0} ,'' ,'#'+menu[that.attr.menuUrlField]);
            if(that.attr.onRouter){
                that.attr.onRouter();
            }
        }
    };
    function listToTree(list){
        var trees = [];
        if(!list || list.length == 0){
            return trees;
        }
        for(var i=0;i<100;i++){
            var hasIn = true;
            for(var i=0;i<list.length;i++){
                var one = list[i];
                if(one.isIn){
                    continue;
                }
                one.children = [];
                if(!one[router.attr.menuPidField]){
                    //没有pid 说明是顶级
                    trees.push(JSON.parse(JSON.stringify(one)));
                }else{
                    //有pid 说明是子级
                    var pidObj = dgFindPidObject(one[router.attr.menuPidField],trees);
                    if(!pidObj){
                        hasIn = false;
                        continue;
                    }
                    pidObj.children.push(JSON.parse(JSON.stringify(one)));
                }
                one.isIn = true;
            }
            if(hasIn){
                break;
            }
        }
        return trees;
    }
    function dgFindPidObject(pid,tempTrees){
        for(var i=0;i<tempTrees.length;i++){
            var tempTree = tempTrees[i];
            if(tempTree[router.attr.menuIdField] == pid){
                return tempTree;
            }
        }
        for(var i=0;i<tempTrees.length;i++){
            var tempTree = tempTrees[i];
            if(tempTree.children && tempTree.children.length>0){
                return dgFindPidObject(pid,tempTree.children);
            }
        }
        return null;
    }
    window.router = router;
})()