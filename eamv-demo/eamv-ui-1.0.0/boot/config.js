(function(){
    var c ={
        env:"prod",
        configType:"local"
    }
    window.reqHook = function(data){
        var res = {flag:false,msg:"请修改config.js的reqHook方法",data:data};
        return res;
    }
    window.uploadUrlHook = function(){
        return "请修改config.js的uploadUrlHook方法";
    }
    window.config = c;
})()