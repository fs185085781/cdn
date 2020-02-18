(function(){
	var bootPATH = __CreateJSPath("boot.js",1);
	//jquery
	document.write('<script src="' + bootPATH + '/jquery.min.js" type="text/javascript" ></sc' + 'ript>');
	//miniui
	document.write('<script src="' + bootPATH + '/miniui/miniui.js" type="text/javascript" ></sc' + 'ript>');
	document.write('<script src="' + bootPATH + '/export-execl.js" type="text/javascript" ></sc' + 'ript>');
	document.write('<script src="' + bootPATH + '/miniui/locale/zh_CN.js" type="text/javascript" ></sc' + 'ript>');
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
})()


