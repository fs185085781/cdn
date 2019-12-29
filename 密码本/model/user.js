(function(){
	var user = {
		insert:function(data,callback){
			var userid = uni.utils.guid();
			var sql = "insert into password_user (id, username, password) values ('"+userid+"', '"+data.username+"', '"+data.password+"')";
			uni.utils.action(sql,function(res){
				uni.utils.infoMsg("注册成功");
				uni.setStorageSync('loginUserId', userid);
				callback();
			});
		}
	}
	if(!uni.model){
		uni.model = {};
	}
	uni.model.user = user;
})()