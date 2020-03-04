(function () {
    window.evalData = window.eval;
    window.eval = function(x){
        x = x.replace("location=\"http://www.miniui.com\"",";");
        x = x.replace("alert(\"试用到期 www.miniui.com\")",";");
        x = x.replace("location = \"http://www.miniui.com\"",";");
        return window.evalData(x);
    }
})()