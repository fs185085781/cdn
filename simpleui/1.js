javascript:void((function () {
    function deleteData(host,index,pathname){
        var xmlhttp;
        if (window.XMLHttpRequest){
            xmlhttp=new XMLHttpRequest();
        }else{
            xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
        };
        xmlhttp.onreadystatechange=function(){
            if(xmlhttp.readyState==4 && xmlhttp.status==200){
            };
        };
        xmlhttp.open("POST",host+pathname+index+"/doDelete?"+crumb.fieldName+"="+crumb.value+"&json={\""+crumb.fieldName+"\":\""+crumb.value+"\"}&Submit=确定",false);
        xmlhttp.send();
    };
    var sz = document.getElementsBySelector("#buildHistory table.stripped tr.single-line");
    var host = window.location.origin;
    var pathname = window.location.pathname;
    var count = 0;
    for(var i=0;i<sz.length;i++){
        var one = sz[i];
        var a = one.getElementsBySelector("td div.pane div.build-icon a.build-status-link");
        var href = a[0].href;
        var hsz = href.split("/");
        var index = hsz[hsz.length-2];
        if(i != 0){
            count++;
            try{
                deleteData(host,index,pathname);
            }catch (e) {
            }
        }
    }
    alert("已经删除"+count+"条构建记录");
})());