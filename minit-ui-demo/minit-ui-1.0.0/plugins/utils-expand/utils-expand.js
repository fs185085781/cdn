(function (tools) {
    tools.$ = {
        successMsg:function(text){
            this.msg(text,"success");
        },
        msg:function(text,type){
            var that = this;
            if(tools.from != "m" && tools.from != "pc"){
                return;
            }
            if(tools.from == "m"){
                msgM(text,type);
            }else{
                msgPc(text,type);
            }
            function msgM(text,type){
                if(!that.vue){
                    that.vue = new Vue();
                }
                that.vue.$toast({
                    message:text,
                    duration:-1,
                    className:type
                });
            }
            function msgPc(text,type){

            }
        }
    }
    var path = tools.getJsPath("utils-expand.js",1);
    document.write('<link href="' + path + '/utils-expand.css" rel="stylesheet" type="text/css" />');
})(utils);