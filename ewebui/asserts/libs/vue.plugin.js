(function(){
    console.log("加载vue兼容层");
    console.log("mini",mini);
    console.log("vue",Vue);
    mini.OldControl = mini.Control;
    mini.Control = function(a){
        console.log(a);
        return this.OldControl(a);
    }
})()