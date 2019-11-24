(function(){
	/**
	 * 兼容IE5
	 */
	var jsonUtils={
		stringify:function(jsonObj) {
			var that = this;
			var result = '',
				curVal;
			if (jsonObj === null) {
				return String(jsonObj);
			}
			switch (typeof jsonObj) {
				case 'number':
				case 'boolean':
					return String(jsonObj);
				case 'string':
					return '"' + jsonObj + '"';
				case 'undefined':
				case 'function':
					return undefined;
			}
			switch (Object.prototype.toString.call(jsonObj)) {
				case '[object Array]':
					result += '[';
					for (var i = 0, len = jsonObj.length; i < len; i++) {
						curVal = that.stringify(jsonObj[i]);
						result += (curVal === undefined ? null : curVal) + ",";
					}
					if (result !== '[') {
						result = result.slice(0, -1);
					}
					result += ']';
					return result;
				case '[object Date]':
					return '"' + that.formatDate(jsonObj,"yyyy-MM-dd HH:mm:ss") + '"';
				case '[object RegExp]':
					return "{}";
				case '[object Object]':
					result += '{';
					for (i in jsonObj) {
						console.log(jsonObj);
						if (jsonObj.hasOwnProperty(i)) {
							curVal = that.stringify(jsonObj[i]);
							if (curVal !== undefined) {
								result += '"' + i + '":' + curVal + ',';
							}
						}
					}
					if (result !== '{') {
						result = result.slice(0, -1);
					}
					result += '}';
					return result;

				case '[object String]':
					return '"' + jsonObj.toString() + '"';
				case '[object Number]':
				case '[object Boolean]':
					return jsonObj.toString();
			}
		},
		parse:function(str){
			if(typeof str == "object"){
				return str;
			}
			return eval("("+str+")");
		}
	}
	if(typeof JSON == "undefined"){
		JSON = jsonUtils;
	}
	var bootPATH = __CreateJSPath("boot.js",1);
	var miniUtils = {
	    setLocalStorage:function(key,val){
	        var map = {};
	        map[key] = val;
	        localStorage.setItem(key,JSON.stringify(map));
	    },
	    getLocalStorage:function(key){
	        var mapStr = localStorage.getItem(key);
	        if(!mapStr){
	            mapStr = "{}";
	        }
	        var map = JSON.parse(mapStr);
	        return map[key];
	    },
	    delLocalStorage:function(key){
	        localStorage.removeItem(key);
	    },
	    setMode:function(mode){
			var key = "miniuiMode";
			this.setLocalStorage(key,mode);
			var ele = document.getElementById(key);
			if(mode == "default"){
				if(ele){
					if(jQuery){
						jQuery(ele).remove();
					}else{
						ele.remove();
					}
				}
			}else{
				var url = bootPATH + '/miniui/themes/default/' + mode + '-mode.css';
				if(ele){
					ele.href = url;
				}else{
					this.loadCss(url,key);
				}
				
			}
			mini.layout();
	    },
	    getMode:function(){
	        return this.getLocalStorage("miniuiMode");
	    },
	    setSkin:function(skin){
			var key = "miniuiSkin";
	        this.setLocalStorage(key,skin);
			var ele = document.getElementById(key);
			if(skin == "default"){
				if(jQuery){
					jQuery(ele).remove();
				}else{
					ele.remove();
				}
			}else{
				var url = bootPATH + '/miniui/themes/' + skin + '/skin.css';
				if(ele){
					ele.href = url;
				}else{
					this.loadCss(url,key);
				}
				
			}
			mini.layout();
	    },
	    getSkin:function(){
	        return this.getLocalStorage("miniuiSkin");
	    },
	    setLange:function(mode){
	        this.setLocalStorage("miniuiLanguage",mode);
	        window.location.reload();
	    },
	    getLange:function(){
	        return this.getLocalStorage("miniuiLanguage");
	    },
		loadJs:function(path,id,type){
			if(!path){
				return;
			}
			if(id && document.getElementById(id)){
				document.getElementById(id).remove();
			}
			var script = document.createElement("script");
			script.src = path;
			if(id){
				script.id = id;
			}
			if(!type){
				type = "text/javascript";
			}
			script.type = type;
			if(!document.head){
				document.head = document.getElementsByTagName("head")[0];
			}
			document.head.appendChild(script);
		},
		loadCss:function(path,id,rel,type){
			if(!path){
				return;
			}
			if(id && document.getElementById(id)){
				document.getElementById(id).remove();
			}
			var link = document.createElement("link");
			link.href = path;
			if(id){
				link.id = id;
			}
			if(!rel){
				rel = "stylesheet";
			}
			link.rel = rel;
			if(!type){
				type = "text/css";
			}
			link.type = type;
			if(!document.head){
				document.head = document.getElementsByTagName("head")[0];
			}
			document.head.appendChild(link);
		}
	}
	window.miniUtils = miniUtils;
	//miniui
	document.write('<script src="' + bootPATH + '/jquery.min.js" type="text/javascript"></sc' + 'ript>');
	document.write('<script src="' + bootPATH + '/miniui/miniui.js" type="text/javascript" ></sc' + 'ript>');
	var lang = miniUtils.getLange() || 'zh_CN';
	document.write('<script src="' + bootPATH + '/miniui/locale/'+lang+'.js" type="text/javascript" ></sc' + 'ript>');
	document.write('<link href="' + bootPATH + '/res/fonts/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css" />');
	document.write('<link href="' + bootPATH + '/miniui/themes/default/miniui.css" rel="stylesheet" type="text/css" />');
	//icon
	document.write('<link href="' + bootPATH + '/miniui/themes/icons.css" rel="stylesheet" type="text/css" />');
	function __CreateJSPath(js, length) {
		var scripts = document.getElementsByTagName("script");
		var path = "";
		for (var i = 0, l = scripts.length; i < l; i++) {
			var src = scripts[i].src;
			if (src.indexOf(js) != -1) {
				path = src;
				break;
			}
		}
		var ss = path.split("/");
		ss.length = ss.length - length;
		path = ss.join("/");
		return path;
	}
	document.onreadystatechange=function(e){
		if(this.readyState == "complete"){
			var mode = miniUtils.getMode() || 'medium';
			var skin = miniUtils.getSkin() || 'cupertino';
			miniUtils.setMode(mode);
			miniUtils.setSkin(skin);
		}
	}
})()


