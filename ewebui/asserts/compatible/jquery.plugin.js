(function(){
    document.onreadystatechange=function(){
        if(this.readyState == "interactive" || this.readyState =="complete"){
            mini.parse();
        }
    }
})()