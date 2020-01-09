(function(){
	var pwd = {
		list:function(callback){
			var userid = (uni.utils.getUserData()).userid;
			var sql = "select * from password_pwd where user_id='"+userid+"' order by name asc";
			uni.utils.action(sql,function(res){
				var list = res.data;
				var data = [];
				var lastName = list[0].name;
				var tempList = [];
				for(var i=0;i<list.length;i++){
					var temp = list[i];
					if(temp.name == lastName){
						tempList.push(temp);
					}else{
						data.push({name:lastName,children:tempList,open:false});
						tempList = [temp];
						lastName = temp.name;
					}
				}
				data.push({name:lastName,children:tempList,open:false});
				callback(data);
			});
		},
		save:function(data,callback){
			var userid = (uni.utils.getUserData()).userid;
			if(!userid){
				uni.utils.infoMsg("用户未登录");
				return;
			}
			data.user_id = userid;
			var sql = "";
			if(data.id){
				//更新
				sql = "update password_pwd set account='"+data.account+"', pwd='"+data.pwd+"', name='"+data.name+"', remark='"+data.remark+"' where id='"+data.id+"' and user_id='"+data.user_id+"'";
			}else{
				//插入
				sql = "insert into password_pwd (id, account, pwd, name, remark, user_id) values ('"+uni.utils.guid()+"', '"+data.account+"', '"+data.pwd+"', '"+data.name+"', '"+data.remark+"', '"+data.user_id+"')";
			}
			uni.utils.action(sql,function(res){
				uni.utils.infoMsg("保存成功");
				callback();
			});
		}
	}
	if(!uni.model){
		uni.model = {};
	}
	uni.model.pwd = pwd;
})()