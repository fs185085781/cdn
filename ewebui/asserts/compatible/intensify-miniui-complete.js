(function () {
    window.eval = utils.evalData;
    utils.removeProp(utils,"evalData");
    /**
     * 增加JSON
     */
    if(typeof JSON == "undefined"){
        JSON = {};
    }
    JSON.stringify=mini.encode;
    JSON.encode=JSON.stringify;
    JSON.parse=mini.decode;
    JSON.decode=JSON.parse;
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
     * 页面加载完毕更新皮肤
     */
    utils.setModeAndSkin = function(){
        if(document.readyState == "complete"){
            var mode = mini.getMode() || 'medium';
            var skin = mini.getSkin() || 'cupertino';
            mini.setMode(mode);
            mini.setSkin(skin);
            utils.removeProp(utils,"setModeAndSkin");
        }else{
            setTimeout(utils.setModeAndSkin,300);
        }
    }
    utils.setModeAndSkin();
})()