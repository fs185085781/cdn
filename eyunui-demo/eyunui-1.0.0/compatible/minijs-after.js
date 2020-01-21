(function () {
    window.eval = utils.evalData;
    utils.removeProp(utils,"evalData");
    /*增加date格式化*/
    Date.prototype.format = function(format){
        return mini.formatDate(this,format);
    }
    /**
     * 增加JSON
     */
    if(typeof JSON == "undefined"){
        JSON = {};
    }
    JSON.stringify=mini.encode;
    JSON.encode=mini.encode;
    JSON.parse=mini.decode;
    JSON.decode=mini.decode;
    /**
     * 增加mini工具
     */
    if(window.miniUtils){
        for(var key in miniUtils){
            mini[key] = miniUtils[key];
        }
        utils.removeProp(window,"miniUtils");
    }
    /**
     * 加载语言包
     */
    var lang = mini.getLange() || 'zh_CN';
    document.write('<script src="' + miniuiConfig.localePath + '/'+lang+'.js" type="text/javascript" ></sc' + 'ript>');
    utils.removeProp(window,"miniuiConfig");
    /**
     * 页面加载完毕更新皮肤
     */
    utils.setModeAndSkin = function(){
        if(document.readyState == "complete"){
            var skin = mini.getSkin();
            mini.setSkin(skin);
            utils.removeProp(utils,"setModeAndSkin");
        }else{
            setTimeout(utils.setModeAndSkin,300);
        }
    }
    utils.setModeAndSkin();
})()