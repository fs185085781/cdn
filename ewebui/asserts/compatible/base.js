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
    var copatible = {};
    window.ctrlMap = ctrlMap;
    /**
     * 所有兼容层的实现原理均为以下步骤
     * 1.替换所有miniui的class
     * 2.准备双向绑定素材
     * 3.对mini进行外包一层,并调用mini初始化
     * 4.当有数据更新的时候,同步更新文档
     */
})()