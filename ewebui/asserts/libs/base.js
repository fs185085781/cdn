(function(){
    "use strict";
    var ctrlMap = {};
    jQuery.each(mini,function(key,val){
        if(!mini[key]){
            return true;
        }
        if(!mini[key].prototype){
            return true;
        }
        if(!mini[key].prototype.uiCls){
            return true;
        }
        if(mini[key].prototype.uiCls == "mini-gridview"){
            return true;
        }
        if(!mini[key].prototype.isControl){
            return true;
        }
        var clazz = mini[key].prototype.uiCls;
        var prototype = mini[key].prototype;
        var propMap = {};
        jQuery.each(prototype,function(key2,val2){
            var key2Low = key2.toLowerCase();
           if(propMap[key2Low]===undefined){
               propMap[key2Low] = {real:key2,type:typeof val2};
           }
        });
        ctrlMap[clazz] = propMap;
    });
    window.ctrlMap = ctrlMap;
})()