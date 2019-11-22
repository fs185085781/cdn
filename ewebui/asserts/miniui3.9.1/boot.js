(function(){
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
					ele.remove();
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
				if(ele){
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
			document.head.appendChild(link);
		}
	}
	var lang = miniUtils.getLange() || 'zh_CN';
	window.miniUtils = miniUtils;
	//miniui
	document.write('<script src="' + bootPATH + '/jquery.min.js" type="text/javascript"></sc' + 'ript>');
	document.write('<script src="' + bootPATH + '/miniui/miniui.js" type="text/javascript" ></sc' + 'ript>');
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


