(function (){
    var aliyundriveController = "https://hm50134.j.h57.site/editer-service/aliyundrive.php";
    window.thirdSdk={
        getConfig:function(fn){
            var config = {
                sv:5, //每隔多少秒执行一次保存
                save:false, //是否开启自动保存
                canEdit:true, //是否可以编辑
                canShow:true, //是否显示提示
            };
            fn(config);
        },
        getAliFileId:function (options,fn){
            //获取阿里云文件id
            //options = {url:'',name:'',file_id:''}
            //后端自行实现,步骤如下
            //1.判断file_id是否存在或者被删除
            //2.如果没删除直接返回file_id 使用fn进行回调  fn(file_id)
            //3.如果删除根据options.url获取文件流
            //4.将该文件流上传到阿里云盘拿到文件id
            //5.使用fn进行回调  fn(file_id)
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
            fn({flag:true,msg:"即将开始下载"});
            var a = document.createElement("a");
            a.href = aliyundriveController+"?type=5&file_id="+file_id+"&name="+utils.getParamer("name");
            a.target = "_blank";
            a.click();
        },
        getPersons:function(fn){
            //获取在线人数
            //后端自行实现,步骤如下
            //1.获取用户信息,并提交到分享人列表
            //2.下载分享人列表
            //3.使用fn进行回调 fn({flag:true,data:sz});
            var sl = parseInt(Math.random()*10);
            var sz = [];
            for(var i=0;i<sl;i++){
                sz.push({name:"人"+i,url:""});
            }
            fn({flag:true,data:sz});
        },
        getDocConfig:function (password,fn){
            //获取文档配置
            //后端自行实现,步骤如下
            //1.根据文档地址或者文件id获取分享时候的配置
            //2.校验配置是否合法
            //3.使用fn进行回调 fn({flag:true,data:{needPass:false,checkPass:false,needLogin:false,checkLogin:true}});
            fn({flag:true,data:{needPass:false,checkPass:password==utils.getLocalStorage("docPassword"),needLogin:false,checkLogin:true}});
        },
        toLogin:function (){
            //跳转到登录页面
            //自行实现,建议如下
            //1.打印提示用户未登录
            //2.用户点击后跳转到登录页
            utils.$.alert("跳转到登录页")
        },
        setDocConfig:function (config,fn){
            //设置文档配置
            //后端自行实现,步骤如下
            //1.将config存起来  config = {
            //                     needPass:false,
            //                     needLogin:false,
            //                     password:""
            //                 }
            //2.使用fn回调  fn({flag:true,msg:"设置文档成功"});
            fn({flag:true,msg:"设置文档成功"});
        },
        hasSetDocConfigAuth:function(fn){
            //是否有设置文档配置权限
            //后端自行实现,步骤如下
            //1.获取用户信息
            //2.校验此用户是否是文档分享发起人
            //3.使用fn回调  fn(false);
            fn(false);
        },
        getShortUrl:function (url,fn){
            //获取短链接
            //前后端自行实现,步骤如下
            //1.后端将该链接存储,并返回一个id
            //2.前端拼接这个id作为分享链接 回调  fn(url)
            //3.前端访问这个链接的时候跳转到长连接
            fn(url);
        }
    }
})()