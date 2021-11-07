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
            var top = "16px";
            if(window.innerHeight>window.innerWidth){
                top = (window.innerHeight-50-32)+"px";
            }
            that.attrs.vue.$message.config({
                top:top,
                maxCount: 1
            });
            that.attrs.vue.$message.open({
                content: text,
                type: type,
                top:top
            });
        },
        loading:function(text){
            var that = this;
            if(!text){
                text = "";
            }
            that.cancelLoading();
            var body = document.getElementsByTagName("body")[0];
            var className = body.className+"";
            className = className.replace("ant-spin-nested-loading","");
            className = className.replace("  "," ").trim();
            if(className){
                className += " ";
            }
            className += "ant-spin-nested-loading";
            body.className = className;
            var div = document.createElement("div");
            that.attrs.loading = "antd-loading-"+Date.now()+parseInt(Math.random()*10000);
            div.id = that.attrs.loading;
            div.className = "ant-spin-body";
            div.innerHTML = "<div class=\"ant-spin ant-spin-spinning ant-spin-show-text\"><span class=\"ant-spin-dot ant-spin-dot-spin\"><i class=\"ant-spin-dot-item\"></i><i class=\"ant-spin-dot-item\"></i><i class=\"ant-spin-dot-item\"></i><i class=\"ant-spin-dot-item\"></i></span><div class=\"ant-spin-text\">"+text+"</div></div>";
            body.append(div);
        },
        cancelLoading:function(){
            var that = this;
            if(that.attrs.loading){
                var body = document.getElementsByTagName("body")[0];
                var className = body.className+"";
                className = className.replace("ant-spin-nested-loading","");
                className = className.replace("  "," ").trim();
                body.className = className;
                document.getElementById(that.attrs.loading).remove();
                utils.removeProp(that.attrs,"loading");
            }
        },
        alert:function(text,callback){
            var that = this;
            that.attrs.vue.$info({
                icon:"none",
                okText:"确定",
                title: '提示',
                content: text,
                onOk:function() {
                    if(callback){
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
            that.attrs.vue.$confirm({
                icon:"none",
                okText:"确定",
                cancelText:"取消",
                title: '提示',
                content: text,
                onOk:function() {
                    if(callback){
                        callback(1);
                    }
                },
                onCancel:function() {
                    if(callback){
                        callback(0);
                    }
                }
            });
            if(window.dialogToCenter){
                window.dialogToCenter();
            }

        },
        prompt:function(text,callback){
            var that = this;
            var id = "antd-prompt-"+Date.now()+parseInt(Math.random()*10000);
            var input = '<br/><input class="ant-input"/>';
            that.attrs.vue.$confirm({
                icon:"none",
                okText:"确定",
                cancelText:"取消",
                title: '提示',
                content: function(createElement){
                    return createElement("div",{
                        attrs:{id:id},
                        domProps:{
                            innerHTML:text+input
                        }
                    });
                },
                onOk:function() {
                    var value = document.getElementById(id).getElementsByTagName("input")[0].value;
                    if(!value){
                        value = null;
                    }
                    if(callback){
                        callback(1,value);
                    }
                },
                onCancel:function() {
                    if(callback){
                        callback(0);
                    }
                }
            });
            if(window.dialogToCenter){
                window.dialogToCenter();
            }
        }
    }
})();