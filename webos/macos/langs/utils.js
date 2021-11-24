(function (){
    var langUtils={
        init:function (){
            function syncLoadData(url,fn){
                var xmlhttp;
                if (window.XMLHttpRequest){
                    xmlhttp=new XMLHttpRequest();
                }else{
                    xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
                }
                xmlhttp.onreadystatechange=function(){
                    if(xmlhttp.readyState==4){
                        try{
                            fn(xmlhttp.responseText);
                        }catch (e) {
                            console.warn(e);
                        }
                    }
                }
                xmlhttp.open("GET",url,false);
                xmlhttp.send();
            }
            syncLoadData("./langs/zh-cn.json",function (res){
                window.lang = JSON.parse(res);
            });
        }
    }
    langUtils.init();
})()