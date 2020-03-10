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
            that.attrs.vue.$toast.loading({
                message: text,
                forbidClick: true,
                duration:0
            });
        },
        cancelLoading:function(){
            var that = this;
            that.attrs.vue.$toast.clear();
        },
        alert:function(text,callback){
            var that = this;
            that.attrs.vue.$dialog.alert({
                title: '提示',
                message: text
            }).then(function(){
                if(!callback){
                    return;
                }
                callback();
            });
        },
        confirm:function(text,callback){
            var that = this;
            that.attrs.vue.$dialog.confirm({
                title: '提示',
                message: text
            }).then(function(){
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
            var id = "vant-prompt-"+Date.now()+parseInt(Math.random()*10000);
            var input = '\n<input id="'+id+'" class="vant-prompt-input"/>';
            that.attrs.vue.$dialog({
                title:"提示",
                message:text + input,
                showCancelButton:true
            }).then(function(){
                var value = document.getElementById(id).value;
                if(!value){
                    value = null;
                }
                if(callback){
                    callback(1,value);
                }
            }).catch(function () {
                if(callback){
                    callback(0);
                }
            });

        }
    }
})();