(function (){
    var aliyundriveController = "http://hm35658.j.h57.site/editer-service/aliyundrive.php";
    window.thirdSdk={
        getConfig:function(fn){
            var config = {
                sv:5, //每隔多少秒执行一次保存
                save:true, //是否开启自动保存
                canEdit:false //是否可以编辑
            };
            fn(config);
        },
        getAliFileId:function (options,fn){
            //获取阿里云文件id
            //options = {url:'',name:''}
            //后端自行实现,步骤如下
            //1.根据options.url获取文件流
            //2.将该文件流上传到阿里云盘拿到文件id
            //3.使用fn进行回调  fn(file_id)
            //示例如下:
            utils.$.post(aliyundriveController+"?type=1",options,function (res){
                fn(res.data.file_id);
            });
        },
        getAliPreviewDataByFid:function(file_id,fn){
            //获取阿里云盘预览链接
            //后端自行实现,步骤如下
            //1.根据file_id调用接口获取预览链接
            //2.包装成预览数据对象并回调 fn({"flag":true,"msg":"获取预览链接成功","data":{"preview_url":"","access_token":""}})
            //示例如下
            utils.$.post(aliyundriveController+"?type=2",{file_id:file_id},function (res){
                console.log(JSON.stringify(res))
                fn(res);
            },true);
        },
        getAliEditDataByFid:function(file_id,fn){
            //获取阿里云盘编辑链接
            //后端自行实现,步骤如下
            //1.根据file_id调用接口获取编辑链接
            //2.包装成编辑数据对象并回调 fn({"flag":true,"msg":"获取编辑链接成功","data":{"edit_url":"","office_access_token":"","office_refresh_token":""}})
            //示例如下
            utils.$.post(aliyundriveController+"?type=3",{file_id:file_id},function (res){
                console.log(JSON.stringify(res))
                fn(res);
            },true);
        },
        aliSaveFile:function(file_id,fn){
            //保存文件
            //后端自行实现,步骤如下
            //1.根据file_id调用接口获取文件流
            //2.将文件流推送到指定的地方
            //3.使用fn进行回调  fn({"flag":true,"msg":"保存成功"})
            fn({flag:true,msg:"保存成功"});
        }
    }
})()