(function(){
    var router = {
        init:function(options){
            var that = this;
            that.allNodePath = {};
            that.allPathNode = {};
            that.tree = options.tree;
            that.tabs = options.tabs;
            that.htmlHost = options.htmlHost;
            that.tree.set({
                textField:options.textField,
                expandOnLoad:true,
                showTreeIcon:false,
                expandOnDblClick:false,
                expandOnNodeClick:false
            });
            that.tree.loadList(options.data,options.idField,options.pidField);
            that.tree.cascadeChild(that.tree.getRootNode(),function (node) {
                if(that.tree.isLeaf(node)){
                    that.allNodePath[node.id] = node[options.menuField];
                    that.allPathNode[node[options.menuField]] = node.id;
                }
            });
            that.tree.on("nodeclick",function(e){
                var node = e.node;
                var isLeaf = e.isLeaf;
                if (isLeaf) {
                    that.routerPageId(node.id);
                }
            });
            that.tree.on("beforeexpand",function(e){
                e.cancel = true;
            });
            that.tree.on("beforecollapse",function(e){
                e.cancel = true;
            });
            that.tabs.on("activechanged",function (e) {
                var tabs = e.sender;
                var tab = tabs.getActiveTab();
                if (tab) {
                    that.routerPageUrl(tab._url);
                }
            });
        },
        routerPageUrl:function(url){
            var id = this.allPathNode[url];
            if(id){
                this.routerPageId(id);
            }else{
                utils.$.errorMsg(url+"没有在路由中注册");
            }
        },
        routerPageId:function(id){
            var that = this;
            var tabs = that.tabs;
            var tab = tabs.getTab(id);
            var url = that.allNodePath[id];
            var node = that.tree.getNode(id);
            if (!tab) {
                tab = {};
                tab.name = id;
                tab.title = node.text;
                tab.showCloseButton = true;
                tab.url = that.htmlHost + url;
                tab._url = url;
                tabs.addTab(tab);
            }
            var activeTab = tabs.getActiveTab();
            if(!activeTab || activeTab.name != tab.name){
                tabs.activeTab(tab);
            }else{
                if (node && !that.tree.isSelectedNode(node)) {
                    that.tree.selectNode(node);
                }
                history.pushState({status: 0} ,'' ,'#'+url);
            }
        }
    }
    window.router = router;
})()