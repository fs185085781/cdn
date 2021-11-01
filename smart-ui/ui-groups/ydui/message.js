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
            that.attrs.vue.$dialog.toast({
                mes:text,
                timeout:3000,
                icon:type
            });
        },
        loading:function(text){
            var that = this;
            if(!text){
                text = "";
            }
            that.cancelLoading();
            that.attrs.vue.$dialog.loading.open(text);
        },
        cancelLoading:function(){
            var that = this;
            that.attrs.vue.$dialog.loading.close();
        },
        alert:function(text,callback){
            var that = this;
            that.attrs.vue.$dialog.alert({
                mes: text,
                callback:callback
            });
        },
        confirm:function(text,callback){
            var that = this;
            that.attrs.vue.$dialog.confirm({
                title: '提示',
                mes: text,
                opts:[
                    {
                        txt: "确定", //按钮文字
                        color:"green", //按钮颜色
                        stay: false, //是否保留提示框
                        callback:function () {
                            if(callback){
                                callback(1);
                            }
                        }
                    },
                    {
                        txt: "取消", //按钮文字
                        color:"#000000", //按钮颜色
                        stay: false, //是否保留提示框
                        callback:function () {
                            if(callback){
                                callback(0);
                            }
                        }
                    }
                ]
            });

        },
        prompt:function(text,callback){
            var that = this;
            var id = "vant-prompt-"+Date.now()+parseInt(Math.random()*10000);
            var input = '\n<input id="'+id+'" class="ydui-prompt-input"/>';
            that.attrs.vue.$dialog.confirm({
                title: '提示',
                mes: text+input,
                opts:[
                    {
                        txt: "确定", //按钮文字
                        color:"green", //按钮颜色
                        stay: false, //是否保留提示框
                        callback:function () {
                            var value = document.getElementById(id).value;
                            if(!value){
                                value = null;
                            }
                            if(callback){
                                callback(1,value);
                            }
                        }
                    },
                    {
                        txt: "取消", //按钮文字
                        color:"#000000", //按钮颜色
                        stay: false, //是否保留提示框
                        callback:function () {
                            if(callback){
                                callback(0);
                            }
                        }
                    }
                ]
            });

        }
    }
})();