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
            that.attrs.vue.$toast({
                message:text,
                duration:3000,
                className:type,
                position:"bottom"
            });
        },
        loading:function(text){
            var that = this;
            if(!text){
                text = "";
            }
            that.cancelLoading();
            that.attrs.vue.$indicator.open({
                text:text
            });

        },
        cancelLoading:function(){
            var that = this;
            that.attrs.vue.$indicator.close();
        },
        alert:function(text,callback){
            var that = this;
            that.attrs.vue.$messagebox.alert(text).then(function(){
                if(!callback){
                    return;
                }
                callback();
            });
        },
        confirm:function(text,callback){
            var that = this;
            that.attrs.vue.$messagebox.confirm(text).then(function(){
                if(callback){
                    callback(1);
                }
            }).catch(function () {
                if(callback){
                    callback(0);
                }
            });
        },
        prompt:function(text,callback){
            var that = this;
            that.attrs.vue.$messagebox.prompt(text).then(function(data){
                if(callback){
                    callback(1,data.value);
                }
            }).catch(function () {
                if(callback){
                    callback(0);
                }
            });
        }
    }
})();