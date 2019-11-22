(function(win){
	var config = {
		/*接口地址host*/
		host:utils.getJsPath("utils.js",3),
		/*页面地址host*/
		htmlHost:utils.getJsPath("utils.js",3),
		/*用户token串,ajax会提交此串*/
		getUserToken:function(){
			return "f14eb808b37a444bb75e62c04d88a344";
		},
		/*用户token串的key,ajax会以此值提交token串*/,
		tokenKey:"token"
	};
	utils.config = config;
})(window)