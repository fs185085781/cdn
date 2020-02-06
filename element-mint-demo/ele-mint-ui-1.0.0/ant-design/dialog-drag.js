(function(){
    function isOwnOrChildren(target,sources){
        for(var i=0;i<sources.length;i++){
            if(target == sources[i]){
                return true;
            }else{
                return isOwnOrChildren(target,sources[i].children);
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
        bindDrag:function(attr,selector){
            (function(attr,selector){
                if(!tool.attr[attr]){
                    tool.attr[attr] = {};
                }
                var bodys = document.getElementsByTagName("body");
                var body = bodys[0];
                tool.on(body,"mousedown",selector,function(e){
                    this.style["-webkit-user-select"]="none";
                    tool.attr[attr].dragele = this.parentElement.parentElement;
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
                        dialog.style["left"]=(e.clientX-tool.attr[attr].startX+tool.attr[attr].eleX)+"px";
                        dialog.style["top"]=(e.clientY-tool.attr[attr].startY+tool.attr[attr].eleY)+"px";
                    }
                });
            })(attr,selector);
        },
        init:function(){
            var bodys = document.getElementsByTagName("body");
            if(bodys && bodys.length>0){
                tool.bindDrag("elDialog",".ant-modal .ant-modal-header");
                //tool.bindDrag("elMessageBox",".el-message-box .el-message-box__header");
            }else{
                setTimeout(function(){
                    tool.init();
                },300);
            }
        }
    }
    tool.init();
})();