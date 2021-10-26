(function () {
    utils.user = {
        isLogin:function(){
            return this.getUserInfo()!=null;
        },
        getUserInfo:function(){
            var user = utils.getLocalStorage("user");
            if(user){
                return user;
            }else{
                return null;
            }
        },
        loginByUsername:function(data){
            utils.$.post("/user.php?type=login",data,function (res) {
                utils.setLocalStorage("user",res.data); //密码登录
                window.location.reload();
            });
        },
        regUser:function(data){
            utils.$.post("/user.php?type=reg",data,function (res) {
                utils.setLocalStorage("user",res.data); //用户注册
                window.location.reload();
            });
        },
        loginOut:function () {
            utils.delLocalStorage("user");
            return true;
        },
        loginById:function(id,callback){
            utils.$.post("/user.php?type=login",{id:id},function (res) {
                utils.setLocalStorage("user",res.data); //id自动登录
                if(callback){
                    callback();
                }
            });
        }
    }
})()
