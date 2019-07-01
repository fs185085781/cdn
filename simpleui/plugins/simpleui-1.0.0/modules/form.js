(function(win){
    "use strict";
    var ui = win[win.uiprefix];
    /*输入框*/
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
            jQuery(that.el).on("focus",":input",function(e){
                that.setIsValid(true);
                if(that.getSelectOnFocus()){
                    this.selectionStart = 0;
                    this.selectionEnd = this.value.length;
                }
                that.fire("focus");
            });
            jQuery(that.el).on("change",":input",function(e){
                that.setValue(this.value);
                if(that.getValidateOnChanged()){
                    that.validate();
                }
            });
            jQuery(that.el).on("input",":input",function(e){
                var length = that.getMaxLength();
                if(this.value.length>length){
                    this.value = this.value.substring(0,length);
                }
            });
            jQuery(that.el).on("keydown",":input",function(e){
                var data = {keyCode:e.keyCode,key:e.key};
                if(e.keyCode == 13){
                    that.fire("enter");
                }
                that.fire("keydown",data);
            });
            jQuery(that.el).on("keyup",":input",function(e){
                var data = {keyCode:e.keyCode,key:e.key};
                that.fire("keyup",data);
            });
            jQuery(that.el).on("blur",":input",function(e){
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
    var hiddenbox = {
        init:function(){
            var that = this;
            /*插入输入框*/
            jQuery(that.el).append("<input class=\"form-control\" type=\"text\" placeholder=\"\" />");
            that._inputEl = jQuery(that.el).find(":input")[0];
            jQuery(that.el).hide();
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

})(window);
