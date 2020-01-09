(function(){
	var user = {
		reg:function(data,callback){
			var userid = uni.utils.guid();
			var checkSql = "select * from password_user where username='"+data.username+"'";
			uni.utils.action(checkSql,function(res){
				if(res.flag){
					//已经被注册
					uni.utils.infoMsg("此账号已经被人注册");
					return;
				}
				if(res.isError){
					uni.utils.infoMsg("网络出错");
					return;
				}
				var sql = "insert into password_user (id, username, password) values ('"+userid+"', '"+data.username+"', '"+data.password+"')";
				uni.utils.action(sql,function(res){
					uni.utils.infoMsg("注册成功");
					uni.setStorageSync('loginUser', {userid:userid,status:"login",username:data.username});
					callback();
				});
			},true);	
		},
		login:function(data,callback){
			var sql = "select * from password_user where username='"+data.username+"' and password='"+data.password+"'";
			uni.utils.action(sql,function(res){
				if(res.isError){
					uni.utils.infoMsg("网络出错");
					return;
				}
				if(!res.flag){
					//登录成功
					uni.utils.infoMsg("账号或密码错误");
					return;
				}
				uni.utils.infoMsg("登录成功");
				uni.setStorageSync('loginUser', {userid:res.data[0].id,status:"login",username:data.username});
				callback();
			},true);
		}
	}
	if(!uni.model){
		uni.model = {};
	}
	uni.model.user = user;
})()