(function(){
    function isOwnOrChildren(target,sources){
        var flag = false;
        for(var i=0;i<sources.length;i++){
            if(target == sources[i]){
                flag = true;
                break;
            }
        }
        if(flag){
            return flag;
        }
        for(var i=0;i<sources.length;i++){
            var temp = isOwnOrChildren(target,sources[i].children);
            if(temp){
                return temp;
            }
        }
        return false;
    }
    /*事件委托*/
    function on(ele,type,selector,fn,key){
        (function(ele,type,selector,fn,key){
            var eles = getEles(ele);
            if(!key){
                key = "";
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
                        if(isOwnOrChildren(e.target ,[temp])){
                            if(fn){
                                temp["toOn"+type] = fn;
                                temp["toOn"+type](e);
                            }
                        }
                    }
                }
                var propName = "toOn"+key+type;
                if(one[propName]){
                    one.removeEventListener(type,one[propName]);
                    one[propName] = undefined;
                }
                one[propName] = oneEvent;
                one.addEventListener(type,one[propName]);
            }
        })(ele,type,selector,fn,key);
    }
    function off(ele,type,key) {
        (function(ele,type,key){
            var eles = getEles(ele);
            if(!key){
                key = "";
            }
            if(eles.length == 0){
                throw "ele is not a element";
            }
            for(var i=0;i<eles.length;i++){
                var one = eles[i];
                var propName = "toOn"+key+type;
                if(one[propName]){
                    one.removeEventListener(type,one[propName]);
                    one[propName] = undefined;
                }
            }
        })(ele,type,key);
    }
    function getEles(ele) {
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
        return eles;
    }
    var tool = {
        attr:{},
        on:on,
        off:off,
        bindDrag:function(attr,selector,nums){
            (function(attr,selector,nums){
                if(!tool.attr[attr]){
                    tool.attr[attr] = {};
                }
                var bodys = document.getElementsByTagName("body");
                var body = bodys[0];
                tool.on(body,"mousedown",selector,function(e){
                    this.style["-webkit-user-select"]="none";
                    var temp = this;
                    for(var i=0;i<nums;i++){
                        temp = temp.parentElement;
                    }
                    tool.attr[attr].dragele = temp;
                    var dialog = tool.attr[attr].dragele;
                    dialog.style["left"]=(dialog.offsetLeft)+"px";
                    dialog.style["top"]=(dialog.offsetTop)+"px";
                    tool.attr[attr].startX = e.clientX;
                    tool.attr[attr].startY = e.clientY;
                    tool.attr[attr].eleX = dialog.offsetLeft;
                    tool.attr[attr].eleY = dialog.offsetTop;
                    tool.attr[attr].dragstatus = "start";
                },attr);
                body.addEventListener("mouseup",function(){
                    tool.attr[attr].dragstatus = "end";
                });
                body.addEventListener("mousemove",function(e){
                    if(tool.attr[attr].dragstatus == "start"){
                        var dialog = tool.attr[attr].dragele;
                        var left = (e.clientX-tool.attr[attr].startX+tool.attr[attr].eleX);
                        if(left < 0 ){
                            left = 0;
                        }
                        if(left > window.innerWidth-dialog.clientWidth){
                            left = window.innerWidth-dialog.clientWidth;
                        }
                        var top = (e.clientY-tool.attr[attr].startY+tool.attr[attr].eleY);
                        if(top<0){
                            top = 0;
                        }
                        if(top > window.innerHeight-dialog.clientHeight){
                            top = window.innerHeight-dialog.clientHeight;
                        }
                        dialog.style["left"]=left+"px";
                        dialog.style["top"]=top+"px";
                    }
                });
            })(attr,selector,nums);
        },
        init:function(){
            var bodys = document.getElementsByTagName("body");
            if(bodys && bodys.length>0){
                tool.bindDrag("elDialog",".ant-modal .ant-modal-header",2);
                tool.bindDrag("elMessageBox",".ant-modal-confirm .ant-modal-content",1);
            }else{
                setTimeout(function(){
                    tool.init();
                },300);
            }
        }
    }
    tool.init();
    window.dialogToCenter=function(){
        function toCenter(dialog){
            if(!dialog){
                return;
            }
            var left = (window.innerWidth-dialog.clientWidth)/2;
            var top = (window.innerHeight-dialog.clientHeight)/3;
            dialog.style["left"]=left+"px";
            //dialog.style["top"]=top+"px";
        }
        setTimeout(function () {
            var dialog1s = document.querySelectorAll(".ant-modal");
            var dialog2s = document.querySelectorAll(".ant-modal-confirm");
            for(var i=0;i<dialog1s.length;i++){
                var dialog = dialog1s[i];
                toCenter(dialog);
            }
            for(var i=0;i<dialog2s.length;i++){
                var dialog = dialog2s[i];
                toCenter(dialog);
            }
        },10);
    }
})();
