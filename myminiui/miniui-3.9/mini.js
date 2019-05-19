var basePath = getJsPath("mini.js");
/*必引文件==========start*/
document.write('<script src="' + basePath + '/core/js/jquery.min.js" type="text/javascript"></sc' + 'ript>');
document.write('<script src="' + basePath + '/core/js/miniui.js" type="text/javascript" ></sc' + 'ript>');
document.write('<script src="' + basePath + '/core/js/miniextend.js" type="text/javascript" ></sc' + 'ript>');
document.write('<link href="' + basePath + '/core/css/miniui.css" rel="stylesheet" type="text/css" />');
document.write('<link href="' + basePath + '/core/css/miniuiextend.css" rel="stylesheet" type="text/css" />');
/*语言包====默认提供zh_CN,en_US=======start*/
var miniLanguage = getParamer("el");
if(!miniLanguage){
	miniLanguage = "zh_CN";
}
document.write('<script src="' + basePath + '/language/'+miniLanguage+'.js" type="text/javascript" ></sc' + 'ript>');
/*语言包===========stop*/
/*必引文件==========stop*/

/*皮肤文件==========start*/
var miniSkin = getParamer("sk");
if(!miniSkin){
	miniSkin = "flat-blue";
}
if(miniSkin != "off"){
	document.write('<link href="' + basePath + '/skin/'+miniSkin+'/skin.css" rel="stylesheet" type="text/css" />');
	document.write('<link href="' + basePath + '/fonts/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css" />');
}
/*皮肤文件==========start*/
function getJsPath(js) {
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
	ss.length = ss.length - 1;
	path = ss.join("/");
	return path;
}
function getParamer(key) {
	var map = getSearch();
	return map[key];
}
function getSearch() {
	var search = decodeURIComponent(window.location.search);
	if (search != "") {
		search = search.substring(1);
	} else {
		return {};
	}
	var strsz = search.split("&");
	var map = {};
	for (var i=0; i<strsz.length; i++){
		var strs = strsz[i];
		if (strs.indexOf("=") != -1) {
			var tempsz = strs.split("=");
			var tempkey = tempsz[0];
			var tempvalue = tempsz[1];
			map[tempkey] = tempvalue;
		}
	}
	return map;
}
