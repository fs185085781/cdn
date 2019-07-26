(function (win) {
    win.totipUi = {
        firstToUpperCase: function (str) {
            if (!str) {
                return str;
            }
            str = str + "";
            str = str.substring(0, 1).toUpperCase() + str.substring(1);
            return str;
        },
        getRealValue: function (val) {
            try {
                /*IE浏览器下eval执行到不包含的变量不会抛异常返回undefined*/
                if (eval(val) == eval(eval(val))) {
                    /*当前是数值或是对象*/
                } else {
                    try {
                        val = eval(val);
                    } catch (e2) {
                        /*无法使用eval的不处理*/
                    }
                }
            } catch (e) {
                /*谷歌浏览器下eval执行到不包含的变量会抛异常进这里*/
                try {
                    val = eval(val);
                } catch (e2) {
                    /*无法使用eval的不处理*/
                }
            }
            return val;
        },
        parse: function () {
            var that = this;
            if (that.lastKeyId == null) {
                that.lastKeyId = 1;
            }
            if (that.uiMap == null) {
                that.uiMap = {};
            }
            var fields = ["progressbar", "textbox", "combobox", "textboxlist", "button", "listbox", "checkboxlist", "radiobuttonlist", "calendar", "buttonedit", "filteredit", "password", "textarea", "datepicker", "monthpicker", "spinner", "timespinner", "treeselect", "lookup", "htmlfile", "hidden", "datagrid", "tree", "treegrid", "fit", "panel", "window", "splitter", "pager", "outlookbar", "outlookmenu", "outlooktree", "tabs", "menu", "menubar", "toolbar"];
            jQuery.each(fields, function (i, field) {
                jQuery(".totipotent-" + field).each(function (n, item) {
                    if (item.getAttribute("uikey")) {
                        return true;
                    }
                    jQuery(item).html("<div class='mini-" + field + "'></div>");
                });
            });
            mini.parse();
            jQuery.each(fields, function (i, field) {
                jQuery(".totipotent-" + field).each(function (n, item) {
                    if (item.getAttribute("uikey")) {
                        return true;
                    }
                    var el = jQuery(item).find(":first-child")[0];
                    var obj = mini.get(el);
                    if (obj == null) {
                        return true;
                    }
                    var key = "totipkey-" + (that.lastKeyId++);
                    jQuery(item).attr("uikey", key);
                    obj.totipUiEl = item;
                    that.uiMap[key] = obj;
                    var options = {};
                    var events = {};
                    jQuery.each(item.attributes, function (i, attr) {
                        if (!attr.specified) {
                            return true;
                        }
                        if (attr.name.indexOf("sizzle") != -1) {
                            return true;
                        }
                        if (attr.name == "class" || attr.name == "uikey" || attr.name == "id") {
                            return true;
                        }
                        if (attr.name.length > 2 && attr.name.substring(0, 2) == "el") {
                            events[attr.name.substring(2)] = attr.value;
                        } else {
                            options[attr.name] = that.getRealValue(attr.value);
                        }
                    });
                    obj.allBindEventMap = {};
                    jQuery.each(events, function (key, value) {
                        value = value.trim();
                        if (win[value]) {
                            obj.on(key, win[value]);
                        } else if (value.startsWith("function")) {
                            if (that.lastEventId == null) {
                                that.lastEventId = 1;
                            }
                            var eventName = "totip_event_" + (that.lastEventId++);
                            eval("win." + eventName + "=" + value);
                            obj.on(key, eval(eventName));
                        } else if (value.indexOf("(") != -1 && value.indexOf(")") != -1) {
                            var z = value.indexOf("(");
                            var m = value.indexOf(":");
                            var method;
                            if (m != -1 && m < z) {
                                method = value.substring(m + 1, z);
                            } else {
                                method = value.substring(0, z);
                            }
                            if (method && win[method]) {
                                obj.on(key, win[method]);
                            }
                        }else{
                            return true;
                        }
                        obj.allBindEventMap[key] = key;
                    });
                    obj.set(options);
                });
            });
        },
        getBySelect:function(el){
            var key = jQuery(el).attr("uikey");
            if(!key){
                return null;
            }
            return this.uiMap[key];
        }
    }
})(window);