(function(win){
    "use strict";
    var ui = win[win.uiprefix];
    /*输入框*/
    var textbox = {
        init:function(){
            var that = this;
            jQuery(that.el).append("<input style=\"width:100%;height:100%\" class=\"form-control\" type=\"text\" placeholder=\"\">");
            that._inputEl = jQuery(that.el).find(":input")[0];
            jQuery(that.el).on("focus",":input",function(e){
                if(that.getSelectOnFocus()){
                    this.selectionStart = 0;
                    this.selectionEnd = this.value.length;
                }
                that.fire("focus");
            });
            jQuery(that.el).on("change",":input",function(e){
                var length = that.getMaxLength();
                if(this.value.length>length){
                    this.value = this.value.substring(0,length);
                }
            });
            jQuery(that.el).on("input",":input",function(e){
                var length = that.getMaxLength();
                if(this.value.length>length){
                    this.value = this.value.substring(0,length);
                }
            });
        },
        validate:function(){
            return true;
        },
        isValid:function(){
        },
        setIsValid:function(){

        },
        doValueChanged:function(){

        },
        setEmptyText:function(val){
            var that = this;
            that.emptyText = ui.parseString(val);
            if(!that.emptyText){
                that.emptyText = "";
            }
            jQuery(that._inputEl).attr("placeholder",that.emptyText);
        },
        getEmptyText:function(){
            return this.emptyText;
        },
        setValue:function(val){
            var that = this;
            that.value = ui.parseString(val);
            if(!that.value){
                that.value = "";
            }
            jQuery(that._inputEl).val(that.value);
        },
        getValue:function(){
            return this.value;
        },
        setAllowInput:function(val){
            var that = this;
            that.allowInput = ui.parseBoolean(val);
            if(that.allowInput == null){
                that.allowInput = true;
            }
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
            if(that.selectOnFocus == null){
                that.selectOnFocus = false;
            }
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
        }
    };
    ui.TextBox = function(){};
    ui.regModule({
        clazz:ui.TextBox,
        useClass:ui.prefix+"-textbox",
        fields:["emptyText","value","allowInput","selectOnFocus","maxLength","validateOnChanged","validateOnLeave","forceValidate","required","requiredErrorText","vtype","vtypeErrorText"],
        events:["valuechanged","validation","enter","keydown","keyup","focus","blur"],
        parentClass:ui.BaseModule,
        thisClass:textbox,
        init:textbox.init
    });
})(window);
