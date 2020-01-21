(function(){
    var i18n = {
        init:function(){
            var language = this.getLange();
            this.setLange(language);
        },
        getLange:function(){
            var language = "";
            if(typeof mini != "undefined" && mini.getLange){
                language = mini.getLange();
            }else{
                language = utils.getLocalStorage("i18nLange") || 'zh_CN';
            }
            return language;
        },
        setLange:function(language){
            if(typeof mini != "undefined" && mini.setLange && mini.getLange){
                if(language != mini.getLange()){
                    mini.setLange(language);
                    return;
                }
            }else{
                utils.setLocalStorage("i18nLange",language);
            }
            var url = utils.getRelativePath() + '/../language/'+language+'.properties';
            utils.getRemoteData(url,false,function(res){
                if(res.status){
                    var map = dataFilter(res.text);
                    $("[data-text-key]").each(function(i,item){
                        var key = $(item).attr("data-text-key");
                        var val = map[key];
                        if(val){
                            $(item).text(val);
                        }else{
                            $(item).text("");
                        }
                    });

                }
            });
        }
    }
    function dataFilter(text){
        var list = text.split("\n");
        var map = {};
        $.each(list,function(i,item){
            if(!item){
                return true;
            }
            var matchList = item.match(/=/gi);
            if(!matchList || matchList.length > 1){
                return true;
            }
            var strs = item.split("=");
            map[strs[0]] = strs[1];
        });
        return map;
    }
    window.i18n = i18n;
    utils.setDefaultLanguage = function(){
        if(document.readyState == "complete"){
            window.i18n.init();
            utils.removeProp(utils,"setDefaultLanguage");
        }else{
            setTimeout(utils.setDefaultLanguage,200);
        }
    }
    utils.setDefaultLanguage();
})()