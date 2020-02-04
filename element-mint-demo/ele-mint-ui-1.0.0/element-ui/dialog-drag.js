(function(){
    /*事件委托*/
    function on(ele,type,selector,fn){
        (function(ele,type,selector,fn){
            var eles = [];
            var typeName = Object.prototype.toString.call(ele);
            if(typeName == "[object Array]" || typeName == "[object HTMLCollection]"){
                for(var i=0;i<ele.length;i++){
                    var temp = ele[i];
                    if(temp instanceof HTMLElement){
                        eles.push(temp);
                    }else{
                        throw "ele is not a element";
                    }
                }
            }else if(ele instanceof HTMLElement){
                eles.push(ele);
            }else if(typeof ele == "string"){
                eles = document.querySelectorAll(ele);
            }else{
                throw "ele is not a element";
            }
            if(eles.length == 0){
                throw "ele is not a element";
            }
            for(var i=0;i<eles.length;i++){
                var one = eles[i];
                var oneEvent = function(e){
                    var oneEle = this;
                    var list = oneEle.querySelectorAll(selector);
                    for(var n=0;n<list.length;n++){
                        var temp = list[n];
                        if(e.target == temp){
                            if(fn){
                                temp["toOn"+type] = fn;
                                temp["toOn"+type](e);
                            }
                        }
                    }
                }
                if(one["toOn"+type]){
                    one.removeEventListener(type,one["toOn"+type]);
                    one["toOn"+type] = undefined;
                }
                one["toOn"+type] = oneEvent;
                one.addEventListener(type,one["toOn"+type]);
            }
        })(ele,type,selector,fn);
    }
    function off(ele,type) {
        (function(ele,type){
            var eles = [];
            var typeName = Object.prototype.toString.call(ele);
            if(typeName == "[object Array]" || typeName == "[object HTMLCollection]"){
                for(var i=0;i<ele.length;i++){
                    var temp = ele[i];
                    if(temp instanceof HTMLElement){
                        eles.push(temp);
                    }else{
                        throw "ele is not a element";
                    }
                }
            }else if(ele instanceof HTMLElement){
                eles.push(ele);
            }else if(typeof ele == "string"){
                eles = document.querySelectorAll(ele);
            }else{
                throw "ele is not a element";
            }
            if(eles.length == 0){
                throw "ele is not a element";
            }
            for(var i=0;i<eles.length;i++){
                var one = eles[i];
                if(one["toOn"+type]){
                    one.removeEventListener(type,one["toOn"+type]);
                    one["toOn"+type] = undefined;
                }
            }
        })(ele,type);
    }
    var tool = {
        on:on,
        off:off,
        init:function(){
            var bodys = document.getElementsByTagName("body");
            if(bodys && bodys.length>0){
                var body = bodys[0];
                tool.on(body,"mousedown",".el-dialog .el-dialog__header",function(e){
                    tool.dragele = this.parentElement;
                    var dialog = tool.dragele;
                    dialog.style["left"]=(dialog.offsetLeft)+"px";
                    dialog.style["top"]=(dialog.offsetTop)+"px";
                    tool.startX = e.clientX;
                    tool.startY = e.clientY;
                    tool.eleX = dialog.offsetLeft;
                    tool.eleY = dialog.offsetTop;
                    tool.dragstatus = "start";
                });
                body.addEventListener("mouseup",function(){
                    tool.dragstatus = "end";
                });
                body.addEventListener("mousemove",function(e){
                    if(tool.dragstatus == "start"){
                        var dialog = tool.dragele;
                        dialog.style["left"]=(e.clientX-tool.startX+tool.eleX)+"px";
                        dialog.style["top"]=(e.clientY-tool.startY+tool.eleY)+"px";
                    }
                });
            }else{
                setTimeout(function(){
                    tool.init();
                },300);
            }
        }
    }
    tool.init();
})();