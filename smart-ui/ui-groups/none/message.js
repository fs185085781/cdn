(function(){
    utils.message = {
        attrs:{
            loadingDivs:[]
        },
        msg:function(text,type){
            //错误 #f5222d
            //告警 #faad14
            //信息 #1890ff
            //成功 #52c41a
            //默认 #666666
            var color = "#666666";
            if(type == "success"){
                color = "#52c41a";
            }else if(type == "info"){
                color = "#1890ff";
            }else if(type == "warning"){
                color = "#faad14";
            }else if(type == "error"){
                color = "#f5222d";
            }
            var div = addMessageDiv(color,text);
            setTimeout(function (){
                delDiv(div);
            },3000);
        },
        loading:function(text){
            var div = addMessageDiv("#666666",text);
            this.attrs.loadingDivs.push(div);
        },
        cancelLoading:function(){
            var div;
            while((div = this.attrs.loadingDivs.shift()) != null){
                delDiv(div);
            }
        },
        alert:function(text,callback){
            window.alert(text);
            if(!callback){
                return;
            }
            callback();
        },
        confirm:function(text,callback){
            var value = window.confirm(text)?1:0;
            if(!callback){
                return;
            }
            callback(value);
        },
        prompt:function(text,callback){
            var value = window.prompt(text);
            if(!callback){
                return;
            }
            if(value !== null){
                callback(1,value);
            }else{
                callback(0);
            }
        }
    }
    function addMessageDiv(color,text){
        var div = document.createElement("div");
        div.className = "";
        div.innerHTML = "<div class=\"none-message-div\">\n" +
            "    <div class=\"none-message-div-text\" style=\"color:"+color+";\">"+text+"</div>\n" +
            "</div>";
        document.body.appendChild(div);
        return div;
    }
    function delDiv(div){
        document.body.removeChild(div);
    }
})();