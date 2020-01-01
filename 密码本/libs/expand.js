(function(){
	var utils = {
		action:function(sql,callback,isCallbackError){
			function splitSql(sql){
				var nums = parseInt(sql.length/100);
				if(sql.length%100 != 0){
					nums++;
				}
				var list = [];
				for(var i=0;i<nums;i++){
					var end = (i+1)*100;
					if(i==nums-1){
						end = sql.length;
					}
					list[i] = sql.substring(i*100,end);
				}
				return list;
			}
			var sqlList = splitSql(sql);
			var jiamiList = [];
			for(var i=0;i<sqlList.length;i++){
				jiamiList[i] = uni.dataJiami(sqlList[i]);
			}
			var lastSql = JSON.stringify(jiamiList);
			uni.request({
				url:"http://117937.vhost152.cloudvhost.top/post.php",
				method:"POST",
				header: {
				   'content-type': 'application/x-www-form-urlencoded'
				},
				data:{sql:lastSql},
				success:function(res){
					commonCallBack(res.data);
				},
				fail:function(){
					commonCallBack({flag:false,isError:true,msg:"调用出错"});
				}
			});
			function commonCallBack(d){
				if(!callback){
					return;
				}
				if(isCallbackError || d.flag){
					callback(d);
				}else{
					uni.utils.infoMsg(d.msg);
				}
			}
		},
		guid:function(){
			function S4() {
				return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
			}
			return S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4();
		},
		infoMsg:function(msg){
			uni.showToast({
			    icon: 'none',
			    title: msg
			});
		},
		isLogin:function(){
			var loginUser = uni.getStorageSync('loginUser');
			if(!loginUser){
				return false;
			}
			if(loginUser.status != "login"){
				return false;
			}
			return true;
		},
		logout:function(){
			uni.removeStorageSync("loginUser");
		},
		getUserData:function(){
			var loginUser = uni.getStorageSync('loginUser');
			if(!loginUser){
				return {};
			}
			if(loginUser.status != "login"){
				return {};
			}
			return loginUser;
		}
	}
	uni.utils = utils;
	/*拓展uni的功能 剪切板*/
	//#ifdef H5
	uni.setClipboardData = function(options){
		var text = options.data || "";
		navigator.clipboard.writeText(text)
		  .then(() => {
		    if(options.success){
		    	options.success();
		    }
		  })
		  .catch(err => {
		    if(options.fail){
		    	options.fail();
		    }
		  });
		  if(options.complete){
		  	options.complete();
		  }
	}
	uni.getClipboardData = function(options){
		navigator.clipboard.readText()
		  .then(text => {
		    if(options.success){
		    	options.success({data:text});
		    }
		  })
		  .catch(err => {
		    if(options.fail){
		    	options.fail();
		    }
		  });
		  if(options.complete){
		  	options.complete();
		  }
	}
	//#endif
})()