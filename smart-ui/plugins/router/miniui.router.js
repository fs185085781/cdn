(function(){
    var router = {
        init:function(options){
            var that = this;
            that.attr = options;
            that.attr.allNodePath = {};
            that.attr.allPathNode = {};
            that.attr.tree.set({
                textField:options.textField,
                expandOnLoad:true,
                showTreeIcon:false,
                expandOnDblClick:false,
                expandOnNodeClick:false
            });
            that.attr.tree.loadList(options.data,options.idField,options.pidField);
            that.attr.tree.cascadeChild(that.attr.tree.getRootNode(),function (node) {
                if(that.attr.tree.isLeaf(node)){
                    that.attr.allNodePath[node.id] = node[options.menuField];
                    that.attr.allPathNode[node[options.menuField]] = node.id;
                }
            });
            that.attr.tree.on("nodeclick",function(e){
                var node = e.node;
                var isLeaf = e.isLeaf;
                if (isLeaf) {
                    that.routerPageId(node.id);
                }
            });
            that.attr.tree.on("beforeexpand",function(e){
                e.cancel = true;
            });
            that.attr.tree.on("beforecollapse",function(e){
                e.cancel = true;
            });
            that.attr.tabs.on("activechanged",function (e) {
                var tabs = e.sender;
                var tab = tabs.getActiveTab();
                if (tab) {
                    that.routerPageUrl(tab._url);
                }
            });
            if(window.location.hash){
                that.routerPageUrl(window.location.hash.substring(1));
            }
        },
        routerPageUrl:function(url){
            var id = this.attr.allPathNode[url];
            if(id){
                this.routerPageId(id);
            }else{
                utils.$.errorMsg(url+"没有在路由中注册");
            }
        },
        routerPageId:function(id){
            var that = this;
            var tabs = that.attr.tabs;
            var tab = tabs.getTab(id);
            var url = that.attr.allNodePath[id];
            var node = that.attr.tree.getNode(id);
            if (!tab) {
                tab = {};
                tab.name = id;
                tab.title = node.text;
                tab.showCloseButton = true;
                tab.url = that.attr.htmlHost + url;
                tab._url = url;
                tabs.addTab(tab);
            }
            var activeTab = tabs.getActiveTab();
            if(!activeTab || activeTab.name != tab.name){
                tabs.activeTab(tab);
            }else{
                if (node && !that.attr.tree.isSelectedNode(node)) {
                    that.attr.tree.selectNode(node);
                }
                history.pushState({status: 0} ,'' ,'#'+url);
                if(that.attr.onRouter){
                    that.attr.onRouter();
                }
            }

        }
    }
    window.router = router;
})()