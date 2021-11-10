(function (){
    var aliyundriveController = "http://hm35658.j.h57.site/editer-service/aliyundrive.php";
    window.aliyundrive = {
        getConfig:function(fn){
            var config = {
                sv:1000, //每隔多少秒执行一次保存
                save:false, //是否开启自动保存
                canEdit:true //是否可以编辑
            };
            if(window.thirdSdk && window.thirdSdk.getConfig){
                window.thirdSdk.getConfig(function (tmpConfig){
                    if(tmpConfig){
                        config = tmpConfig;
                    }
                    fn(config);
                });
            }else{
                fn(config);
            }
        },
        getFileId:function(options,fn){
            //负责将文件保存到阿里云,并返回fileId
            if(window.thirdSdk && window.thirdSdk.getAliFileId){
                window.thirdSdk.getAliFileId(options,function (fileId){
                    fn(fileId);
                });
            }else{
                utils.$.post(aliyundriveController+"?type=1",options,function (res){
                    fn(res.data.file_id);
                });
            }
        },
        getPreviewDataByFid:function (fileId,fn){
            //根据阿里云盘文件id获取预览数据
            if(window.thirdSdk && window.thirdSdk.getAliPreviewDataByFid){
                window.thirdSdk.getAliPreviewDataByFid(fileId,function (res){
                    fn(res);
                });
            }else{
                utils.$.post(aliyundriveController+"?type=2",{file_id:fileId},function (res){
                    fn(res);
                },true);
            }
        },
        getEditDataByFid:function (fileId,fn){
            //根据阿里云盘文件id获取编辑数据
            if(window.thirdSdk && window.thirdSdk.getAliEditDataByFid){
                window.thirdSdk.getAliEditDataByFid(fileId,function (res){
                    fn(res);
                });
            }else{
                utils.$.post(aliyundriveController+"?type=3",{file_id:fileId},function (res){
                    fn(res);
                },true);
            }
        }
    }
})()