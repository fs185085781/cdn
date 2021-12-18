(function (){
    var aliyundriveController = "https://hm50134.j.h57.site/editer-service/aliyundrive.php";
    window.aliyundrive = {
        getConfig:function(fn){
            var config = {
                sv:1000, //每隔多少秒执行一次保存
                save:false, //是否开启自动保存
                canEdit:true, //是否可以编辑
                canShow:true, //是否显示提示
            };
            if(window.thirdSdk && window.thirdSdk.getConfig){
                window.thirdSdk.getConfig(function (tmpConfig){
                    if(tmpConfig){
                        config = tmpConfig;
                    }
                    if(config.save){
                        if(!window.thirdSdk || !window.thirdSdk.aliSaveFile){
                            config.save = false;
                        }
                    }
                    fn(config);
                });
            }else{
                fn(config);
            }
        },
        getFileId:function(options,fn){
            //负责将文件保存到阿里云,并返回file_id
            if(window.thirdSdk && window.thirdSdk.getAliFileId){
                window.thirdSdk.getAliFileId(options,function (file_id){
                    fn(file_id);
                });
            }else{
                utils.$.post(aliyundriveController+"?type=1",options,function (res){
                    fn(res.data.file_id);
                });
            }
        },
        getPreviewDataByFid:function (file_id,fn){
            //根据阿里云盘文件id获取预览数据
            if(window.thirdSdk && window.thirdSdk.getAliPreviewDataByFid){
                window.thirdSdk.getAliPreviewDataByFid(file_id,function (res){
                    fn(res);
                });
            }else{
                utils.$.post(aliyundriveController+"?type=2",{file_id:file_id},function (res){
                    fn(res);
                },true);
            }
        },
        getEditDataByFid:function (file_id,fn){
            //根据阿里云盘文件id获取编辑数据
            if(window.thirdSdk && window.thirdSdk.getAliEditDataByFid){
                window.thirdSdk.getAliEditDataByFid(file_id,function (res){
                    fn(res);
                });
            }else{
                utils.$.post(aliyundriveController+"?type=3",{file_id:file_id},function (res){
                    fn(res);
                },true);
            }
        },
        saveFile:function (file_id,fn){
            //保存文件
            if(window.thirdSdk && window.thirdSdk.aliSaveFile){
                window.thirdSdk.aliSaveFile(file_id,function (res){
                    fn(res);
                });
            }else{
                fn({flag:false,msg:"当前未配置保存方法,将调用浏览器下载"});
                var a = document.createElement("a");
                a.href = aliyundriveController+"?type=5&file_id="+file_id+"&name="+utils.getParamer("name");
                a.target = "_blank";
                a.click();
            }
        },
        getPersons:function(fn){
            //获取在线人数
            if(window.thirdSdk && window.thirdSdk.getPersons){
                window.thirdSdk.getPersons(function (res){
                    fn(res);
                });
            }else{
                var sl = parseInt(Math.random()*10);
                var sz = [];
                for(var i=0;i<sl;i++){
                    sz.push({name:"人"+i,url:""});
                }
                fn({flag:true,data:sz});
            }
        },
        getDocConfig:function (password,fn){
            //获取文档配置
            if(window.thirdSdk && window.thirdSdk.getDocConfig){
                window.thirdSdk.getDocConfig(password,function (res){
                    fn(res);
                });
            }else{
                fn({flag:true,data:{needPass:false,checkPass:password==utils.getLocalStorage("docPassword"),needLogin:false,checkLogin:true}});
            }
        },
        toLogin:function (){
            //跳转到登录页面
            if(window.thirdSdk && window.thirdSdk.toLogin){
                window.thirdSdk.toLogin();
            }else{
                utils.$.alert("当前没有登录无法查看");
            }
        },
        setDocConfig:function (config,fn){
            //设置文档配置
            if(window.thirdSdk && window.thirdSdk.setDocConfig){
                window.thirdSdk.setDocConfig(config,fn);
            }else{
                fn({flag:true,msg:"设置文档成功"});
            }
        },
        hasSetDocConfigAuth:function(fn){
            //是否有设置文档配置权限
            if(window.thirdSdk && window.thirdSdk.hasSetDocConfigAuth){
                window.thirdSdk.hasSetDocConfigAuth(fn);
            }else{
                fn(false);
            }
        }
    }
})()