function utilsMessage(type){
    switch (type) {
        case 0:
            utils.$.msg('我是默认消息');
            break;
        case 1:
            utils.$.successMsg('我是成功消息');
            break;
        case 2:
            utils.$.infoMsg('我是信息消息');
            break;
        case 3:
            utils.$.warningMsg('我是告警消息');
            break;
        case 4:
            utils.$.errorMsg('我是错误消息');
            break;
        case 5:
            utils.$.alert('我是alert',function(){
                utils.$.msg('你点了确定');
            });
            break;
        case 6:
            utils.$.confirm('我是confirm',function(action){
                if(action == 1){
                    utils.$.msg('你点了确定');
                }else{
                    utils.$.msg('你点了取消');
                }
            });
            break;
        case 7:
            utils.$.prompt('我是prompt',function(action,value){
                if(action == 1){
                    utils.$.msg('你输入的值为:'+value);
                }else{
                    utils.$.msg('你点击了取消');
                }
            });
            break;
        case 8:
            utils.$.loading('我是loading,3秒后关闭');
            setTimeout(function(){
                utils.$.cancelLoading();
            },3000);
            break;
    }
}