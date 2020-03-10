(function(){
    var vueObj = {};
    if(window.Vue){
        vueObj = new Vue({});
    }
    utils.message = {
        attrs:{vue:vueObj},
        msg:function(text,type){
            var that = this;
            if(!type){
                type = "default";
            }
            that.attrs.vue.$message.closeAll();
            var offset = "20";
            if(window.innerHeight>window.innerWidth){
                offset = window.innerHeight-50-32;
            }
            that.attrs.vue.$message({
                message: text,
                type: type,
                offset:offset
            });
        },
        loading:function(text){
            var that = this;
            if(!text){
                text = "";
            }
            that.cancelLoading();
            var loading = that.attrs.vue.$loading({
                lock: true,
                text: text,
                spinner: 'el-icon-loading'
            });
            that.attrs.loading = loading;
        },
        cancelLoading:function(){
            var that = this;
            if(that.attrs.loading){
                that.attrs.loading.close();
                utils.removeProp(that.attrs,"loading");
            }
        },
        alert:function(text,callback){
            var that = this;
            that.attrs.vue.$alert(text, '提示', {
                confirmButtonText: '确定',
                callback:function(action){
                    if(!callback){
                        return;
                    }
                    if(action == "confirm"){
                        callback();
                    }
                }
            });
            if(window.dialogToCenter){
                window.dialogToCenter();
            }
        },
        confirm:function(text,callback){
            var that = this;
            that.attrs.vue.$confirm(text, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function(){
                if(callback){
                    callback(1);
                }
            }).catch(function(){
                if(callback){
                    callback(0);
                }
            });
            if(window.dialogToCenter){
                window.dialogToCenter();
            }
        },
        prompt:function(text,callback){
            var that = this;
            that.attrs.vue.$prompt(text, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(function(data){
                if(callback){
                    callback(1,data.value);
                }
            }).catch(function () {
                if(callback){
                    callback(0);
                }
            });
            if(window.dialogToCenter){
                window.dialogToCenter();
            }
        }
    }
})();