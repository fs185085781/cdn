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
            var map = {
                error:2,
                success:1,
                warning:0,
                default:-1,
                info:4
            }
            layui.layer.msg(text, {
                icon: map[type]
            });
        },
        loading:function(text){
            var that = this;
            if(!text){
                text = "";
            }
            that.cancelLoading();
            that.attrs.loading = layui.layer.load(2, {
                shade: [0.2, '#ccc'],
                content:text,
                success: function (layerContentStyle) {
                    layerContentStyle.find('.layui-layer-content').css({
                        'padding-top': '35px',
                        'text-align': 'left',
                        'width': 'auto'
                    });
                }
            });
        },
        cancelLoading:function(){
            var that = this;
            if(that.attrs.loading != undefined){
                layui.layer.close(that.attrs.loading);
            }
        },
        alert:function(text,callback){
            return layui.layer.alert(text, {
                title: '提示'
            }, function(index){
                layui.layer.close(index);
                if(callback){
                    callback();
                }
            });
        },
        confirm:function(text,callback){
            return layui.layer.confirm(text, {
                title: '提示'
            }, function(index){
                layui.layer.close(index);
                if(callback){
                    callback(1);
                }
            }, function(){
                if(callback){
                    callback(0);
                }
            });

        },
        prompt:function(text,callback){
            return layui.layer.prompt({
                title: text,
                formType: 2
            }, function(value, index){
                layui.layer.close(index);
                if(callback){
                    callback(1,value);
                }
            });
        }
    }
})();