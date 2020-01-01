(function(){
	var utils = {
		jiami:function(text){
			var rsa = new uni.JSEncrypt();
			var pubkey = "MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgGEXlwVlT35/HrL7/fAQ+G0adwVZ1QB8KbszNwelyxdBdBcy9rcr0XU5+USnYROMJwCZOFMtBy/11q8DwCQmG6jW3Vvxw6tyeBbwnJbpMQ5L0aYgreTBk1R6/79u5AqfxduJW2KTb4aQySB2kRZdMl8uDkqJpLdT63Dateg7D0+RAgMBAAE=";
			rsa.setPublicKey(pubkey);
			var mima = rsa.encrypt(text);
			return mima;
		},
		jiemi:function(mima){
			var rsa = new uni.JSEncrypt();
			var prikey = "MIICWgIBAAKBgGEXlwVlT35/HrL7/fAQ+G0adwVZ1QB8KbszNwelyxdBdBcy9rcr0XU5+USnYROMJwCZOFMtBy/11q8DwCQmG6jW3Vvxw6tyeBbwnJbpMQ5L0aYgreTBk1R6/79u5AqfxduJW2KTb4aQySB2kRZdMl8uDkqJpLdT63Dateg7D0+RAgMBAAECgYBASyTAd/QKKhekImZoAHThmrLSIkiAh7gCtMluEQXJophDfIYPib6sR/We1s/b5+Uz6kJ4IcsuoTbGsk8cIPgTJCQq0CYFbknjYToK3gC18bYf0oNOTOMwsBVKtb9eRsv6k0HXgv2L1/c5Vmm/PP7WzjNl5nZc7ZAZy9DQxVLnOQJBALvNdMnGJ175saqWtJBR4k1yBMmvZz/OeHW/ivG9wj/8VzOoy4wBI0AxwbihlcXLulwfyQXvjsZjfmBJrofR9esCQQCEWX3rDMLZrUUnRQN2l8WiNXrB4BUkgrM0WP/RRGoCN60u5GtTPMwF4acrrxOicXasPI82aDSBIyaW6SkQgMVzAkAhoXFAkNOMFnrSaZp8Ha3A4KIq29ZJftfjfiGLmMeoXa/f+GI6+Bkv7bkbLxR7DziYNrjw7y1KKZb/9zHh8J9xAkAOZ6Mh2yC2CnrVXFiVJs226vUyds42TBdvIiStxTF4jlDGIsxfoeVe2oGUapjLfGf7NRgtRsg4KfhAQp5aknlrAkAfu9DVE1oREhpSov+mqFJlB6Kii4Ekbf8INTxoHnjZ9967XTWvldK6l0XDKvlxrJ2AlhjVyDk+RLAxyze/NhBU";
			rsa.setPrivateKey(prikey);
			var text = rsa.decrypt(mima);
			return text;
		},
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
				jiamiList[i] = uni.utils.jiami(sqlList[i]);
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