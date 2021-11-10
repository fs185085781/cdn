(function (){
    window.thirdSdk={
        getConfig:function(fn){
            var config = {
                sv:1000, //每隔多少秒执行一次保存
                save:false, //是否开启自动保存
                canEdit:true //是否可以编辑
            };
            fn(config);
        }
    }
})()