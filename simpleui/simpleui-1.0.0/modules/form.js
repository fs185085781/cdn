(function(win){
    "use strict";
    var ui = win[win.uiprefix];
    /*输入框*/
    var textbox = {
        init:function(){
            var that = this;
            jQuery(that.el).append("<input style=\"width:100%;height:100%\" class=\"form-control\" type=\"text\" placeholder=\"\" />");
            that._inputEl = jQuery(that.el).find(":input")[0];
            jQuery(that.el).on("focus",":input",function(e){
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
            jQuery(that.el).on("enter",":input",function(e){
                that.fire("enter");
            });
            jQuery(that.el).on("keydown",":input",function(e){
                that.fire("keydown");
            });
            jQuery(that.el).on("keyup",":input",function(e){
                that.fire("keyup");
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
            if(!that.getForceValidate()){
                if(!that.getVisible()){
                    /*元素不可见 且 不强制校验*/
                    that.vtypeMsg = null;
                    that.setIsValid(true);
                    that.fire("validation",{flag:true});
                    return true;
                }
            }
            var vtype = that.getVtype();
            var vtypeErrorText = that.getVtypeErrorText();
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
            if(this.valid){

            }else{

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
            if(oldVal != newVal){
                that.fire("valuechanged",{oldValue:oldVal,value:newVal});
            }
        },
        getValue:function(){
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
        }
    };
    ui.TextBox = function(){};
    ui.regModule({
        clazz:ui.TextBox,
        useClass:ui.prefix+"-textbox",
        fields:["emptyText","value","allowInput","selectOnFocus","maxLength","validateOnChanged","validateOnLeave","forceValidate","vtype","vtypeErrorText"],
        events:["valuechanged","validation","enter","keydown","keyup","focus","blur"],
        parentClass:ui.BaseModule,
        thisClass:textbox,
        init:textbox.init
    });
})(window);
