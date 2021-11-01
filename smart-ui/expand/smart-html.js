(function(){
    /**
    * 智能html
    * 1.撑满屏组件
    * 2.移动端键盘弹起处理
    * 3.破解防盗链组件
    * */
    /**
   拓展撑满屏组件
   原理fit的高度 = 父级的高度(不包含border,padding) - 同级其他的高度(包含margin) - 自身的padding,margin,border值
    */
    var smartFit = {
        layout:function(){
            var that = this;
            var divs = document.querySelectorAll(".smart-fit");
            if(!divs || divs.length == 0){
                return;
            }
            for(var i=0;i<divs.length;i++){
                var div = divs[i];
                var heightHe = 0;
                var next = div;
                while((next = next.nextElementSibling) != null){
                    heightHe += that.getEleHeight(next,0)+that.getEleHeight(next,1);
                }
                var prev = div;
                while((prev = prev.previousElementSibling) != null){
                    heightHe += that.getEleHeight(prev,0)+that.getEleHeight(prev,1);
                }
                var parentHeight = that.getEleHeight(div.parentElement,0)-that.getEleHeight(div.parentElement,2);
                var height = parentHeight-heightHe-that.getEleHeight(div,1)-that.getEleHeight(div,2);
                if(height<0){
                    height = 0;
                }
                div.style.height = height+"px";
                div.style["overflow-y"] = "auto";
                div.style["overflow-x"] = "hidden";
            }
        },
        getEleHeight:function(ele,type){
            //0读取height 1读取margin 2读取border+padding
            type = type || 0;
            var map = {};
            try{
                map = window.getComputedStyle(ele);
            }catch(e){
            }
            var eHeight = 0;
            var addFields = ["height"];
            if(type == 1){
                addFields=["margin-top","margin-bottom"];
            }else if(type == 2){
                addFields = ["border-bottom-width","border-top-width","padding-top","padding-bottom"];
            }
            for(var i=0;i<addFields.length;i++){
                var field = addFields[i];
                var height = 0;
                try{
                    height = parseFloat(map[field]);
                }catch (e) {
                }
                if(isNaN(height)){
                    height = 0;
                }
                eHeight += height;
            }
            return eHeight;
        }
    }
    /**窗口改变时执行撑满屏调整*/
    window.addEventListener("resize",function(){
        smartFit.layout();
    });
    utils.layout = function(){
        smartFit.layout();
    }
    utils.repeatLayout = function(time){
        if(!time){
            time = 1000;
        }
        return setInterval(function () {
            smartFit.layout();
        },time);
    }
    utils.repeatLayout();
    /**移动端键盘弹起处理*/
    window.addEventListener("resize", function() {
        if(document.activeElement.tagName == "INPUT" || document.activeElement.tagName == "TEXTAREA") {
            window.setTimeout(function() {
                document.activeElement.scrollIntoView();
            }, 1);
        }
    });
    /**破解防盗链组件---开始*/
    utils.fdlImgMap = {};
    function actionFdl() {
        var list = document.querySelectorAll("imgfdl");
        for(var i=0;i<list.length;i++){
            var imgfdl = list[i];
            var src = imgfdl.getAttribute("src");
            var saveAble = imgfdl.getAttribute("save-able");
            if(!saveAble){
                saveAble = "1";
            }
            if(src == imgfdl.srcUrl && saveAble == imgfdl.saveAble){
                continue;
            }
            imgfdl.srcUrl = src;
            imgfdl.saveAble = saveAble;
            var iframeId = "iframe"+utils.uuid();
            var clickVal = saveAble == "1" ? "none":"block";
            utils.fdlImgMap[iframeId] = "<div style=\"display:"+clickVal+";\" onclick=\"parent.document.getElementById('"+iframeId+"').click()\"></div><img onclick=\"parent.document.getElementById('"+iframeId+"').click()\" src=\""+imgfdl.srcUrl+"\" /> <style>html,body,img,div{width:100%;height:100%;margin:0;}div{position:fixed;z-index:999;}</style>";
            imgfdl.innerHTML = "<iframe id=\""+iframeId+"\" src=\"javascript:parent.utils.fdlImgMap."+iframeId+"\" frameBorder=\"0\" scrolling=\"no\" width='100%' height='100%'></iframe>";
        }
        setTimeout(actionFdl,300);
    }
    actionFdl();
    var imgFdlStyle = "<style>imgfdl{display:inline-block;}</style>";
    document.write(imgFdlStyle);
    /**破解防盗链组件---结束*/
})()
