(function(win){
    "use strict";
    var ui = win[win.uiprefix];
    /*文本框*/
    var textbox = {
        init:function(){
            var that = this;
            jQuery(that.el).addClass("input-group");
            /*插入输入框*/
            jQuery(that.el).append("<input style=\"width:100%;\" class=\"form-control\" type=\"text\" placeholder=\"\" />");
            that._inputEl = jQuery(that.el).find(":input")[0];
            /*插入错误提示*/
            var errorSpanEl = jQuery("<span class=\"simple-error-span fa fa-exclamation-circle\" style=\"display:none;\"></span>");
            jQuery(that._inputEl).after(errorSpanEl[0]);
            that._ErrorSpanEl =errorSpanEl[0];
            /*插入后置文本*/
            var afterSpanEl = jQuery("<span class=\"input-group-addon\" style=\"display:none;\"></span>");
            jQuery(that._inputEl).after(afterSpanEl[0]);
            that._AfterSpanEl =afterSpanEl[0];
            /*插入前置文本*/
            var beforeSpanEl = jQuery("<span class=\"input-group-addon\" style=\"display:none;\"></span>");
            jQuery(that._inputEl).before(beforeSpanEl[0]);
            that._BeforeSpanEl =beforeSpanEl[0];
            jQuery(that._inputEl).on("focus",function(e){
                that.setIsValid(true);
                if(that.getSelectOnFocus()){
                    this.selectionStart = 0;
                    this.selectionEnd = this.value.length;
                }
                that.fire("focus");
            });
            jQuery(that._inputEl).on("change",function(e){
                that.setValue(this.value);
                if(that.getValidateOnChanged()){
                    that.validate();
                }
            });
            jQuery(that._inputEl).on("input",function(e){
                var length = that.getMaxLength();
                if(this.value.length>length){
                    this.value = this.value.substring(0,length);
                }
            });
            jQuery(that._inputEl).on("keydown",function(e){
                var data = {keyCode:e.keyCode,key:e.key};
                if(e.keyCode == 13){
                    that.fire("enter");
                }
                that.fire("keydown",data);
            });
            jQuery(that._inputEl).on("keyup",function(e){
                var data = {keyCode:e.keyCode,key:e.key};
                that.fire("keyup",data);
            });
            jQuery(that._inputEl).on("blur",function(e){
                if(that.getValidateOnLeave()){
                    that.validate();
                }
                that.fire("blur");
            });
        },
        validate:function(){
            var that = this;
            if(!that.getForceValidate() && !that.getVisible()){
                /*元素不可见 且 不强制校验*/
                that.vtypeMsg = null;
                that.setIsValid(true);
                that.fire("validation",{flag:true});
                return true;
            }
            var vtype = that.getVtype();
            var vtypeErrorText = that.getVtypeErrorText();
            if(!vtypeErrorText){
                vtypeErrorText = "";
            }
            if(!vtype){
                that.vtypeMsg = null;
                that.setIsValid(true);
                that.fire("validation",{flag:true});
                return true;
            }
            var vtypeSz = vtype.split(";");
            var vtypeMsgSz = vtypeErrorText.split(";");
            var value = that.getValue();
            for(var i=0;i<vtypeSz.length;i++){
                var tempVtype = vtypeSz[i];
                if(!tempVtype){
                    continue;
                }
                var tempVtypeMsg = null;
                if(i<vtypeMsgSz.length){
                    tempVtypeMsg = vtypeMsgSz[i];
                }
                var result = ui.validate(value,tempVtype,tempVtypeMsg);
                if(!result.flag){
                    that.vtypeMsg = result.msg;
                    that.setIsValid(false);
                    that.fire("validation",{flag:false,msg:that.vtypeMsg});
                    return false;
                }
            }
            that.vtypeMsg = null;
            that.setIsValid(true);
            that.fire("validation",{flag:true});
            return true;
        },
        isValid:function(){
            var that = this;
            if(that.valid == null){
                that.valid = true;
            }
            return that.valid;
        },
        setIsValid:function(val){
            this.valid = ui.parseBoolean(val);
            jQuery(this.el).css({"border":""});
            jQuery(this._ErrorSpanEl).hide();
            if(!this.valid){
                if(this.getValidateMode() == "title"){
                    jQuery(this.el).css({"border":"1px solid red"});
                    jQuery(this._ErrorSpanEl).attr("title",this.vtypeMsg);
                    jQuery(this._ErrorSpanEl).show();
                }else if(this.getValidateMode() == "border"){
                    jQuery(this.el).css({"border":"1px solid red"});
                }
            }
        },
        doValueChanged:function(){
            var that = this;
            that.fire("valuechanged",{oldValue:that.value,value:that.value});
        },
        setEmptyText:function(val){
            var that = this;
            that.emptyText = ui.parseString(val);
            jQuery(that._inputEl).attr("placeholder",that.emptyText);
        },
        getEmptyText:function(){
            return this.emptyText;
        },
        setName:function(val){
            var that = this;
            that.name = ui.parseString(val);
            jQuery(that._inputEl).attr("name",that.name);
        },
        getName:function(){
            return this.name;
        },
        setValue:function(val){
            var that = this;
            var newVal = ui.parseString(val);
            if(!newVal){
                newVal = "";
            }
            var length = that.getMaxLength();
            if(newVal.length>length){
                newVal = newVal.substring(0,length);
            }
            var oldVal = that.getValue();
            jQuery(that._inputEl).val(newVal);
            that.value = newVal;
            if(oldVal != newVal){
                that.fire("valuechanged",{oldValue:oldVal,value:newVal});
            }
        },
        getValue:function(){
            if(this.value == null){
                this.value = "";
            }
            return this.value;
        },
        setAllowInput:function(val){
            var that = this;
            that.allowInput = ui.parseBoolean(val);
            if(that.allowInput){
                jQuery(that._inputEl).removeAttr("readonly");
            }else{
                jQuery(that._inputEl).attr("readonly","readonly");
            }
        },
        getAllowInput:function(){
            var that = this;
            if(that.allowInput == null){
                that.allowInput = true;
            }
            return that.allowInput;
        },
        setSelectOnFocus:function(val){
            var that = this;
            that.selectOnFocus = ui.parseBoolean(val);
        },
        getSelectOnFocus:function(){
            var that = this;
            if(that.selectOnFocus == null){
                that.selectOnFocus = false;
            }
            return that.selectOnFocus;
        },
        getMaxLength:function(){
            var that = this;
            if(that.maxLength == null){
                that.maxLength = 1024;
            }
            return that.maxLength;
        },
        setMaxLength:function(val){
            var that = this;
            that.maxLength = ui.parseNumber(val);
            that.setValue(that.getValue());
        },
        getValidateOnChanged:function(){
            var that = this;
            if(that.validateOnChanged == null){
                that.validateOnChanged = true;
            }
            return that.validateOnChanged;
        },
        setValidateOnChanged:function(val){
            var that = this;
            that.validateOnChanged = ui.parseBoolean(val);
        },
        getValidateOnLeave:function(){
            var that = this;
            if(that.validateOnLeave == null){
                that.validateOnLeave = true;
            }
            return that.validateOnLeave;
        },
        setValidateOnLeave:function(val){
            var that = this;
            that.validateOnLeave = ui.parseBoolean(val);
        },
        getForceValidate:function(){
            var that = this;
            if(that.forceValidate == null){
                that.forceValidate = false;
            }
            return that.forceValidate;
        },
        setForceValidate:function(val){
            var that = this;
            that.forceValidate = ui.parseBoolean(val);
        },
        getVtype:function(){
            var that = this;
            return that.vtype;
        },
        setVtype:function(val){
            var that = this;
            that.vtype = ui.parseString(val);
        },
        getVtypeErrorText:function(){
            var that = this;
            return that.vtypeErrorText;
        },
        setVtypeErrorText:function(val){
            var that = this;
            that.vtypeErrorText = ui.parseString(val);
        },
        setBeforeText:function(val){
            this.beforeText = ui.parseString(val);
            jQuery(this._BeforeSpanEl).html(this.beforeText);
            if(this.beforeText){
                jQuery(this._BeforeSpanEl).show();
            }else{
                jQuery(this._BeforeSpanEl).hide();
            }
        },
        getBeforeText:function(){
            return ui.parseString(this.beforeText);
        },
        setAfterText:function(val){
            this.afterText = ui.parseString(val);
            jQuery(this._AfterSpanEl).html(this.afterText);
            if(this.afterText){
                jQuery(this._AfterSpanEl).show();
            }else{
                jQuery(this._AfterSpanEl).hide();
            }
        },
        getAfterText:function(){
            return ui.parseString(this.afterText);
        },
        getValidateMode:function(){
            if(!this.validateMode){
                this.validateMode = "title";
            }
            return this.validateMode;
        },
        setValidateMode:function(val){
            this.validateMode = ui.parseString(val);
        }
    };
    ui.TextBox = function(){};
    ui.regModule({
        clazz:ui.TextBox,
        useClass:ui.prefix+"-textbox",
        fields:["emptyText","name","value","allowInput","selectOnFocus","maxLength","validateMode","validateOnChanged","validateOnLeave","forceValidate","vtype","vtypeErrorText","beforeText","afterText"],
        events:["valuechanged","validation","enter","keydown","keyup","focus","blur"],
        parentClass:ui.BaseModule,
        thisClass:textbox,
        init:textbox.init
    });
    /*滑块*/
    var slider = {
        init:function(){
            var that = this;
            /*插入输入框*/
            jQuery(that.el).append("<input class=\"form-control\" type=\"text\" placeholder=\"\" />");
            that._inputEl = jQuery(that.el).find(":input")[0];
            jQuery(that._inputEl).hide();
            jQuery(that.el).append("<div class=\"progress-bar\" style=\"width:100%\"><span class=\"slider-tip\" ></span><span class=\"slider-btn fa fa-circle-o\"></span></div>");
            that._sliderBarEl = jQuery(that.el).find(".progress-bar")[0];
            that._sliderBtnEl = jQuery(that._sliderBarEl).find(".slider-btn")[0];
            that._sliderTipEl = jQuery(that._sliderBarEl).find(".slider-tip")[0];
            jQuery(that.el).append("<div class=\"slider-rule\"></div>");
            that._sliderRuleEl = jQuery(that.el).find(".slider-rule")[0];
            jQuery(that.el).append("<div class=\"slider-rulelabel\"></div>");
            that._sliderRuleLabelEl = jQuery(that.el).find(".slider-rulelabel")[0];
            jQuery(that.el).on("mousedown",".slider-btn",function(e){
                that.isDrag = true;
                that.fire("sliderstart");
            });
            jQuery(that.el).on("selectstart",function(e){
                return !that.isDrag;
            });
            ui.pushBodyMouseup(that.uikey,function(e){
                if(!that.isDrag){
                    return;
                }
                that.isDrag = false;
                var left;
                var transform = jQuery(that.el).css("transform");
                if(transform == null){
                    transform = "";
                }
                if(transform.indexOf("matrix") != -1){
                    left =jQuery(that._sliderBarEl).width()+ jQuery(that._sliderBarEl).offset().top - e.clientY;
                }else{
                    left= e.clientX - jQuery(that._sliderBarEl).offset().left;
                }
                if(left<0){
                    left = 0;
                }
                if(left > jQuery(that._sliderBarEl).width()){
                    left = jQuery(that._sliderBarEl).width();
                }
                var allWidth = jQuery(that._sliderBarEl).width();
                var val = left/allWidth*(that.getMax()-that.getMin())+that.getMin();
                that.setValue(val.toFixed(0));
                that.fire("sliderend");
            });
            ui.pushBodyMousemove(that.uikey,function(e){
                if(!that.isDrag){
                    return;
                }
                var left;
                var transform = jQuery(that.el).css("transform");
                if(transform == null){
                    transform = "";
                }
                if(transform.indexOf("matrix") != -1){
                    left =jQuery(that._sliderBarEl).width()+ jQuery(that._sliderBarEl).offset().top - e.clientY;
                }else{
                    left= e.clientX - jQuery(that._sliderBarEl).offset().left;
                }
                if(left<0){
                    left = 0;
                }
                if(left > jQuery(that._sliderBarEl).width()){
                    left = jQuery(that._sliderBarEl).width();
                }
                jQuery(that._sliderBtnEl).css("left",left+"px");
                jQuery(that._sliderTipEl).css("left",left+"px");
                var allWidth = jQuery(that._sliderBarEl).width();
                var val = left/allWidth*(that.getMax()-that.getMin())+that.getMin();
                val = val.toFixed(0);
                jQuery(that._sliderTipEl).css("margin-left","-"+(val.length*4)+"px");
                jQuery(that._sliderTipEl).html(val);
            });
        },
        setName:function(val){
            var that = this;
            that.name = ui.parseString(val);
            jQuery(that._inputEl).attr("name",that.name);
        },
        getName:function(){
            return this.name;
        },
        setValue:function(val){
            var that = this;
            var newVal = ui.parseNumber(val);
            if(!newVal){
                newVal = 0;
            }
            var oldVal = that.getValue();
            if(newVal<that.getMin()){
                newVal = that.getMin()*1;
            }
            if(newVal>that.getMax()){
                newVal = that.getMax()*1;
            }
            jQuery(that._inputEl).val(newVal);
            that.value = newVal;
            var str =newVal+"";
            jQuery(that._sliderTipEl).css("margin-left","-"+(str.length*4)+"px");
            jQuery(that._sliderTipEl).html(str);
            if(that._hasUpdateRuleData){
                var allWidth = jQuery(that._sliderBarEl).width();
                var left = (that.value-that.getMin())*allWidth/(that.getMax()-that.getMin());
                jQuery(that._sliderBtnEl).css("left",left+"px");
                jQuery(that._sliderTipEl).css("left",left+"px");
            }
            if(oldVal != newVal){
                that.fire("valuechanged",{oldValue:oldVal,value:newVal});
            }
        },
        getValue:function(){
            if(this.value == null){
                this.value = "";
            }
            return this.value;
        },
        setMode:function(val){
            this.mode = ui.parseString(val);
            if(this.mode != "landscape" && this.mode != "portrait"){
                this.mode= "landscape";
            }
            if(this.mode == "portrait"){
                jQuery(this.el).addClass("simple-slider-portrait");
            }else{
                jQuery(this.el).removeClass("simple-slider-portrait");
            }
        },
        getMode:function(){
            if(this.mode == null){
                this.mode = "landscape";
            }
            return this.mode;
        },
        setShowTip:function(val){
            this.showTip = ui.parseBoolean(val);
            if(this.showTip){
                jQuery(this._sliderTipEl).show();
            }else{
                jQuery(this._sliderTipEl).hide();
            }
        },
        getShowTip:function(){
            if(this.showTip == null){
                this.showTip = true;
            }
            return this.showTip;
        },
        setMin:function(val){
            this.min = ui.parseNumber(val);
            this.updateRuleData();
        },
        getMin:function(){
            if(this.min == null){
                this.min = 0;
            }
            return this.min;
        },
        setMax:function(val){
            this.max = ui.parseNumber(val);
            this.updateRuleData();
        },
        getMax:function(){
            if(this.max == null){
                this.max = 100;
            }
            return this.max;
        },
        setRules:function(val){
            this.rules = ui.parseNumber(val);
            this.updateRuleData();
        },
        getRules:function(){
            if(this.rules == null){
                this.rules = 4;
            }
            return this.rules;
        },
        updateRuleData:function(){
            var that = this;
            var rules = that.getRules();
            var min = that.getMin();
            var max = that.getMax();
            var stepLabel = (max-min)/rules;
            var stepPerc = 100/rules;
            stepPerc = stepPerc.toFixed(2);
            var rspans = "";
            var rspansLabel = "";
            for(var i=0;i<=rules;i++){
                rspans +="<span style=\"left:"+(i*stepPerc)+"%;\"></span>";
                if(rules%2 == 0 && i!=rules){
                    rspans += "<span style=\"left:"+((i+0.5)*stepPerc)+"%;\"></span>";
                }
                var label = (min+i*stepLabel).toFixed(0)*1;
                if(label>max){
                    label = max*1;
                }
                if(label<min){
                    label = min*1;
                }
                label = label +"";
                rspansLabel +="<span style=\"left:"+(i*stepPerc)+"%;margin-left:-"+(label.length*4)+"px;\">"+label+"</span>";
            }
            jQuery(that._sliderRuleEl).html(rspans);
            jQuery(that._sliderRuleLabelEl).html(rspansLabel);
            that._hasUpdateRuleData = true;
        }
    }
    ui.Slider = function(){};
    ui.regModule({
        clazz:ui.Slider,
        useClass:ui.prefix+"-slider",
        fields:["name","mode","showTip","min","max","rules","value"],
        events:["valuechanged","sliderstart","sliderend"],
        parentClass:ui.BaseModule,
        thisClass:slider,
        init:slider.init
    });
    /*隐藏框*/
    var hiddenbox = {
        init:function(){
            var that = this;
            /*插入输入框*/
            jQuery(that.el).append("<input class=\"form-control\" type=\"hidden\" placeholder=\"\" />");
            that._inputEl = jQuery(that.el).find(":input")[0];
        },
        setName:function(val){
            var that = this;
            that.name = ui.parseString(val);
            jQuery(that._inputEl).attr("name",that.name);
        },
        getName:function(){
            return this.name;
        },
        setValue:function(val){
            var that = this;
            var newVal = ui.parseString(val);
            if(!newVal){
                newVal = "";
            }
            var oldVal = that.getValue();
            jQuery(that._inputEl).val(newVal);
            that.value = newVal;
            if(oldVal != newVal){
                that.fire("valuechanged",{oldValue:oldVal,value:newVal});
            }
        },
        getValue:function(){
            if(this.value == null){
                this.value = "";
            }
            return this.value;
        }
    }
    ui.HiddenBox = function(){};
    ui.regModule({
        clazz:ui.HiddenBox,
        useClass:ui.prefix+"-hidden",
        fields:["value","name"],
        events:["valuechanged"],
        parentClass:ui.BaseModule,
        thisClass:hiddenbox,
        init:hiddenbox.init
    });
    /*实体框,由两个输入框完成,一个是外界显示,一个是真实的值*/
    var entitybox = {
        init:function(){
            var that = this;
            /*插入输入框*/
            jQuery(that.el).append("<input class=\"form-control\" type=\"text\" placeholder=\"\" /><input class=\"form-control\" type=\"hidden\" />");
            that._textInputEl = jQuery(that.el).find(":input[type='text']")[0];
            that._valueInputEl = jQuery(that.el).find(":input[type='hidden']")[0];
        },
        setName:function(val){
            var that = this;
            that.name = ui.parseString(val);
            jQuery(that._valueInputEl).attr("name",that.name);
        },
        getName:function(){
            return this.name;
        },
        setValue:function(val){
            var that = this;
            var newVal = ui.parseString(val);
            if(!newVal){
                newVal = "";
            }
            var oldVal = that.getValue();
            jQuery(that._valueInputEl).val(newVal);
            that.value = newVal;
            if(oldVal != newVal){
                that.fire("valuechanged",{oldValue:oldVal,value:newVal});
            }
        },
        getValue:function(){
            if(this.value == null){
                this.value = "";
            }
            return this.value;
        },
        setText:function(val){
            var that = this;
            that.text = ui.parseString(val);
            jQuery(that._textInputEl).val(that.text);
        },
        getText:function(){
            return this.text;
        }
    }
    ui.EntityBox = function(){};
    ui.regModule({
        clazz:ui.EntityBox,
        useClass:ui.prefix+"-entitybox",
        /*fields:["value","text","name"],
        events:["valuechanged"],*/
        fields:["emptyText","name","value","allowInput","selectOnFocus","maxLength","validateMode","validateOnChanged","validateOnLeave","forceValidate","vtype","vtypeErrorText","beforeText","afterText"],
        events:["valuechanged","validation","enter","keydown","keyup","focus","blur"],
        parentClass:ui.BaseModule,
        thisClass:entitybox,
        init:entitybox.init
    });
    /*掩码框*/
    var maskbox = {
        init:function(){
            var that = this;
            jQuery(that._inputEl).on("keydown",function(e){
                var keyCode = e.keyCode;
                var target = e.currentTarget;
                if(target.value.length != that.getFormat().length){
                    that.setValue("");
                    setCursorPos(target, 0);
                }
                var noNeedBtns = [9, 13,16, 35, 36, 37, 39];
                if (jQuery.inArray(keyCode, noNeedBtns) != -1) {
                    return true;
                }
                /*数值键盘码转换一下*/
                if (keyCode >= 96 && keyCode <= 105) {
                    keyCode -= 48;
                }
                var c = String.fromCharCode(keyCode);
                if (keyCode >= 65 && keyCode <= 90 && !e.shiftKey) {
                    c = c.toLowerCase();
                } else {
                    if (keyCode == 189 || keyCode == 187 || keyCode == 190) {
                        var map = {"189":"-","187":"+","190":"."}
                        c = map[keyCode+""];
                    }
                }
                var addDataFlag = false;
                if (keyCode == 8) {
                    addDataFlag=deleteData(target, true);
                }else {
                    if (keyCode == 46) {
                        addDataFlag=deleteData(target, false);
                    } else {
                        if("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-+.".indexOf(c) != -1){
                            var pos = getCursorPos(target);
                            addDataFlag=addData(pos,target, c,false);
                        }
                    }
                }
                if(addDataFlag){
                    var format = that.getFormat();
                    var val = "";
                    for(var i=0;i<format.length;i++){
                        var str = format.substring(i,i+1);
                        if(str=="#"){
                            val += that.currentValue.substring(i,i+1);
                        }
                    }
                    that.setValue(val);
                    setCursorPos(target, that.currentPos);
                }
                function deleteData(target,isLeft){
                    var pos = getCursorPos(target);
                    if(isLeft){
                        pos -=1;
                    }
                    if(isLeft && pos==-1){
                        return false;
                    }
                    return addData(pos,target,"_",isLeft);
                }
                function addData(pos,target,str,isLeft){
                    var flag = false;
                    if(pos == null){
                        return flag;
                    }
                    if(!that.formatArray){
                        that.formatArray = [];
                    }
                    if(!isLeft){
                        while(true){
                            if(jQuery.inArray(pos, that.formatArray) != -1 || pos>=that.getFormat().length) {
                                break;
                            }else{
                                pos +=1;
                            }
                        }
                    }
                    if(jQuery.inArray(pos, that.formatArray) != -1) {
                        var tempValue =target.value;
                        tempValue = tempValue.substring(0,pos)+str+tempValue.substring(pos+1,tempValue.length);
                        that.currentValue =tempValue;
                        flag = true;
                    }
                    if(!isLeft){
                        pos += 1;
                    }else {
                        flag = true;
                    }
                    that.currentPos = pos;
                    return flag;
                }
                function getCursorPos(input){
                    var pos;
                    if("selectionStart" in input) {
                        pos = input.selectionStart;
                    }else if(document.selection){
                        var range = document.selection.createRange();
                        var range_all = input.createTextRange();
                        for (pos=0; range_all.compareEndPoints("StartToStart", range) < 0; pos++){
                            range_all.moveStart('character', 1);
                        }
                    }
                    return pos;
                }
                function setCursorPos(input, pos) {
                    if(input.setSelectionRange) {
                        input.setSelectionRange(pos, pos);
                    } else if(input.createTextRange) {
                        var range = input.createTextRange();
                        range.collapse(true);
                        range.moveEnd('character', pos);
                        range.moveStart('character', pos);
                        range.select();
                    }
                }
                return false;
            });
            jQuery(that._inputEl).on("keyup",function(e){
                if(/[\u4e00-\u9fa5]/g.test(this.value)){
                    this.value=this.value.replace(/[\u4e00-\u9fa5]/g,'');
                }
            });
        },
        setFormat:function(val){
            var that = this;
            that.format = ui.parseString(val);
            that.formatArray = [];
            if(that.format){
                for(var i=0;i<that.format.length;i++){
                    var str = that.format.substring(i,i+1);
                    if(str=="#"){
                        that.formatArray[that.formatArray.length] = i;
                    }
                }
            }
            that.updateInputByValOrFormat();
        },
        getFormat:function(){
            if(this.format == null){
                this.format = "";
            }
            return this.format;
        },
        getFormatValue:function(){
            return jQuery(this._inputEl).val();
        },
        getValue:function(){
            if(this.value == null){
                this.value = "";
            }
            return this.value;
        },
        setValue:function(val){
            var that = this;
            var newVal = ui.parseString(val);
            if(!newVal){
                newVal = "";
            }
            var length = that.getMaxLength();
            if(newVal.length>length){
                newVal = newVal.substring(0,length);
            }
            var oldVal = that.getValue();
            that.value = newVal;
            if(oldVal != newVal){
                that.fire("valuechanged",{oldValue:oldVal,value:newVal});
                that.updateInputByValOrFormat();
            }
        },
        updateInputByValOrFormat:function(){
            var that = this;
            var format = that.getFormat();
            if(!format){
                that.format="";
                jQuery(that._inputEl).val(that.getValue());
                return;
            }
            var val = that.getValue();
            var tempVal = "";
            var length = format.length;
            var count = 0;
            for(var i=0;i<length;i++){
                var str = format.substring(i,i+1);
                if(str=="#"){
                    var temp = val.substring(count,count+1);
                    count++;
                    if(temp){
                        tempVal +=temp;
                    }else{
                        tempVal +="_";
                    }
                }else{
                    tempVal += str;
                }
            }
            jQuery(that._inputEl).val(tempVal);
        }
    }
    ui.MaskBox = function(){};
    ui.regModule({
        clazz:ui.MaskBox,
        useClass:ui.prefix+"-maskbox",
        fields:["format"],
        events:[],
        parentClass:ui.TextBox,
        thisClass:maskbox,
        init:maskbox.init
    });
    var buttonedit = {
        init:function(){

        }
    };
    ui.ButtonEdit = function(){};
    ui.regModule({
        clazz:ui.ButtonEdit,
        useClass:ui.prefix+"-buttonedit",
        fields:[],
        events:[],
        parentClass:ui.TextBox,
        thisClass:buttonedit,
        init:buttonedit.init
    });
})(window);
