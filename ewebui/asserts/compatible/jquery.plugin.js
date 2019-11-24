(function(){
    document.onreadystatechange=function(){
        console.log("111",this.readyState);
        if(this.readyState == "interactive" || this.readyState =="complete"){
            mini.parse();
        }
    }
})()