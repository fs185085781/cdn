(function (tools) {
    tools.$ = {
        vue:new Vue({}),
        successMsg:function(text){
            this.msg(text,"success");
        },
        infoMsg:function(text){
            this.msg(text,"info");
        },
        warningMsg:function(text){
            this.msg(text,"warning");
        },
        dangerMsg:function(text){
            this.msg(text,"danger");
        },
        msg:function(text,type){
            var that = this;
            if(!type){
                type = "default";
            }
            if(tools.from != "m" && tools.from != "pc"){
                return;
            }
            if(tools.from == "m"){
                that.vue.$toast({
                    message:text,
                    duration:3000,
                    className:type,
                    position:"bottom"
                });
            }else{
                mini.showTips({
                    content: text,
                    state: type,
                    x: "center",
                    y: "top",
                    timeout: 3000
                });
            }
        },
        loading:function(text){
            if(!text){
                text = "";
            }
            var that = this;
            if(tools.from != "m" && tools.from != "pc"){
                return;
            }
            if(tools.from == "m"){
                that.vue.$indicator.open({
                    text:text
                });
            }else{
                if(that.loadingId){
                    mini.hideMessageBox(that.loadingId);
                    tools.removeProp(that,"loadingId");
                }
                that.loadingId = mini.loading(text);
            }
        },
        cancelLoading:function(){
            var that = this;
            if(tools.from != "m" && tools.from != "pc"){
                return;
            }
            if(tools.from == "m"){
                that.vue.$indicator.close();
            }else{
                if(that.loadingId){
                    mini.hideMessageBox(that.loadingId);
                    tools.removeProp(that,"loadingId");
                }
            }
        },
        alert:function(text,callback){
            var that = this;
            if(tools.from != "m" && tools.from != "pc"){
                return;
            }
            if(tools.from == "m"){
                that.vue.$messagebox.alert(text).then(function(){
                    if(callback){
                        callback(1);
                    }
                });
            }else{
                mini.alert(text, "提示", function(action){
                    if(callback){
                        if(action == "ok"){
                            callback(1);
                        }else{
                            callback(-1);
                        }
                    }
                });
            }
        },
        confirm:function(text,callback){
            var that = this;
            if(tools.from != "m" && tools.from != "pc"){
                return;
            }
            if(tools.from == "m"){
                that.vue.$messagebox.confirm(text).then(function(){
                    if(callback){
                        callback(1);
                    }
                }).catch(function () {
                    if(callback){
                        callback(0);
                    }
                });
            }else{
                mini.confirm(text, "提示", function(action){
                    if(callback){
                        if(action == "ok"){
                            callback(1);
                        }else if(action == "cancel"){
                            callback(0);
                        }else{
                            callback(-1);
                        }
                    }
                });
            }
        },
        prompt:function(text,callback){
            var that = this;
            if(tools.from != "m" && tools.from != "pc"){
                return;
            }
            if(tools.from == "m"){
                that.vue.$messagebox.prompt(text).then(function(data){
                    if(callback){
                        callback(1,data.value);
                    }
                }).catch(function () {
                    if(callback){
                        callback(0);
                    }
                });
            }else{
                mini.prompt(text, "提示", function(action,val){
                    if(callback){
                        if(action == "ok"){
                            callback(1,val);
                        }else if(action == "cancel"){
                            callback(0);
                        }else{
                            callback(-1);
                        }
                    }
                });
            }
        }
    }
    var path = tools.getJsPath("utils-expand.js",1);
    document.write('<link href="' + path + '/utils-expand.css" rel="stylesheet" type="text/css" />');
})(utils);