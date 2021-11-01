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
            var y = "top";
            if(window.innerHeight>window.innerWidth){
                y = "bottom";
            }
            mini.showTips({
                content:text,
                state:type=="error"?"danger":type,
                x:"center",
                y:y,
                timeout:3000
            });
        },
        loading:function(text){
            var that = this;
            if(!text){
                text = "";
            }
            that.cancelLoading();
            that.attrs.loading = mini.loading(text);
        },
        cancelLoading:function(){
            var that = this;
            if(that.attrs.loading){
                mini.hideMessageBox(that.attrs.loading);
                utils.removeProp(that.attrs,"loading");
            }
        },
        alert:function(text,callback){
            var that = this;
            mini.alert(text,"提示",function(action){
                if(!callback){
                    return;
                }
                if(action == "ok"){
                    callback();
                }
            });
        },
        confirm:function(text,callback){
            var that = this;
            mini.confirm(text,"提示",function(action){
                if(!callback){
                    return;
                }
                if(action == "ok"){
                    callback(1);
                }else if(action == "cancel"){
                    callback(0);
                }
            });
        },
        prompt:function(text,callback){
            var that = this;
            mini.prompt(text,"提示",function(action,value){
                if(!callback){
                    return;
                }
                if(action == "ok"){
                    callback(1,value);
                }else if(action == "cancel"){
                    callback(0);
                }
            },true);
        }
    }
})();