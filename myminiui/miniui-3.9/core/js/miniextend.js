(function(win){
    //修正滚动条功能
	mini.getScrollOffset = function(){
        if (!mini._scrollOffset) {
            var el = document.createElement('div');
            el.style.cssText = 'width:100px;background:#eee;height:50px;overflow:scroll;padding:1px;position:absolute;left:-1000px;top:0;box-sizing:content-box;-moz-box-sizing:content-box;';
            el.setAttribute("class", "mini-grid-rows-view");
            document.body.appendChild(el);
            mini._scrollOffset = el.offsetWidth - el.clientWidth;
            el.parentNode.removeChild(el);
        }
        return mini._scrollOffset;
    }
    //拓展year
    mini.YearPicker = function () {
        mini.YearPicker.superclass.constructor.call(this);
        this.init();
    }
    mini.extend(mini.YearPicker, mini.PopupEdit, {
        uiCls: 'mini-yearpicker',
        allowInput:false,
		startValue:0,
		popupWidth:"auto",
		pageSize:20,
		showToyearButton:true,
		showOkButton:false,
		showClearButton:true,
		setShowToyearButton:function(flag){
			var that = this;
			that.showToyearButton = flag;
			that.createPanel();
		},
		getShowToyearButton:function(){
			var that = this;
			return that.showToyearButton;
		},
		setShowOkButton:function(flag){
			var that = this;
			that.showOkButton = flag;
			that.createPanel();
		},
		getShowOkButton:function(){
			var that = this;
			return that.showOkButton;
		},
		setShowClearButton:function(flag){
			var that = this;
			that.showClearButton = flag;
			that.createPanel();
		},
		getShowClearButton:function(){
			var that = this;
			return that.showClearButton;
		},
		createPanel:function(){
			var that = this;
			//创建面板
			/*面板div*/
			var html = '<div name="panel" class="mini-panel mini-yearpicker-panel" style=\"width:218px;\" iconCls="icon-add" borderStyle="border:none;" showHeader="false" showToolbar="true" showFooter="true">';
			/*toolbar div*/
			html += '<div property="toolbar">';
			html += '<div class="mini-col-12 mini-yearpicker-header">';
			html += '<div class="mini-col-2">';
			html += '<span class="mini-icon mini-yearpicker-header-prev"></span>';
			html += '</div>';
			html += '<div class="mini-col-8">';
			html += '<div><span class="mini-yearpicker-header-set"></span>年</div>';
			html += '</div>';
			html += '<div class="mini-col-2">';
			html += '<span class="mini-icon mini-yearpicker-header-next"></span>';
			html += '</div>';
			html += '</div>';
			html += '</div>';
			/*footer div*/
			html += '<div property="footer">';
			html += '<div class="mini-col-12 mini-yearpicker-footer">';
			if(that.showToyearButton){
				html += '<input name="yearpicker-button" groupName="toyear" class="mini-button mini-yearpicker-button" text="'+mini.YearPicker.prototype.nowYearButton+'"/>';
			}
			if(that.showClearButton){
				html += '<input name="yearpicker-button" groupName="clear" class="mini-button mini-yearpicker-button" text="'+mini.YearPicker.prototype.clearButton+'"/>';
			}
			if(that.showOkButton){
				html += '<input name="yearpicker-button" groupName="commit" class="mini-button mini-yearpicker-button" text="'+mini.YearPicker.prototype.commitButton+'"/>';
			}
			html += '</div">';
			html += '</div>';
			/*面板div*/
			html += '</div>';
			$(that.popup._contentEl).empty().append(html);
			mini.parse(that.popup._contentEl);
			that.panel = mini.getByName("panel",that.popup._contentEl);
			var buttons = mini.getsByName("yearpicker-button",that.popup._contentEl);
			$.each(buttons,function(i,button){
				button.on("click",function(e){
					if(e.sender.groupName == "toyear"){
						that.tempValue = mini.formatDate(new Date(),"yyyy");
					}else if(e.sender.groupName == "clear"){
						that.tempValue = "";
					}else if(e.sender.groupName == "commit"){
						that.commitValue();
						return;
					}
					if(!that.showOkButton){
						that.commitValue();
					}else{
						var toYear = mini.formatDate(new Date(),"yyyy")*1;
						that.startValue = toYear-toYear%that.pageSize+1;
						that.updatePopupHtml();
					}
				});
			});
			that.panel.setBody("<div class=\"mini-yearpicker-body\"></div>");
			that.updatePopupHtml();
		},
		commitValue:function(){
			var that = this;
			var oldValue = that.value;
			var tempValue = 0;
			if(!that.tempValue){
				tempValue = mini.formatDate(new Date(),"yyyy")*1;
			}else{
				if(that.tempValue>2300 || that.tempValue<1901){
					that.tempValue = mini.formatDate(new Date(),"yyyy");
				}
				tempValue = that.tempValue*1;
			}
			if(tempValue%that.pageSize != 0){
				that.startValue = tempValue-tempValue%that.pageSize+1;
			}
			that.setValue(that.tempValue);
			that._textEl.value = that.value;
			that.hidePopup();
			that.updatePopupHtml();
			if(oldValue != that.value){
				var e = {oldValue:oldValue,sender:that,value:that.value};
				that.fire("valuechanged",e);
			}

		},
        init: function () {
			var that = this;
			$(that.popup._contentEl).on("click","a.mini-yearpicker-cell",function(e){
				var val = $(e.target).attr("data-val");
				that.tempValue = val;
				if(!that.showOkButton){
					that.commitValue();
				}else{
					that.updatePopupHtml();
				}
            });
			$(that.popup._contentEl).on("click","span.mini-yearpicker-header-prev",function(e){
				if(that.startValue >= 1901 + that.pageSize){
					that.startValue = that.startValue - that.pageSize;
					that.updatePopupHtml();
				}
            });
			$(that.popup._contentEl).on("click","span.mini-yearpicker-header-next",function(e){
				if(that.startValue < 2300 - that.pageSize){
					that.startValue = that.startValue + that.pageSize;
					that.updatePopupHtml();
				}
            });
            setTimeout(function () {
				that.createPanel();
				var tempStartValue = 0;
				if(!that.value || isNaN(that.value) || that.value>2300 || that.value<1901){
					that.value = "";
					tempStartValue = mini.formatDate(new Date(),"yyyy")*1;
				}
				if(tempStartValue == 0){
					tempStartValue = that.value*1;
				}
				that.tempValue = that.value;
				that.startValue = tempStartValue-tempStartValue%20+1;
				that._textEl.value = that.value;
				that.updatePopupHtml();
            }, 100); 
        },
		updatePopupHtml:function(){
			var that = this;
			var nowYear = mini.formatDate(new Date(),"yyyy");
			var body = $(that.panel._contentEl).find("div.mini-yearpicker-body");
			var html = "<div>";
			for(var i=0;i<that.pageSize;i++){
				var year = i+that.startValue;
				year = year+"";
				var nowYearHtml = "";
				if(nowYear == year){
					nowYearHtml = " mini-yearpicker-cell-now";
				}
				var valYearHtml = "";
				if(that.tempValue == year){
					valYearHtml = " mini-yearpicker-cell-select";
				}
                html +="<a class='mini-yearpicker-cell"+nowYearHtml+valYearHtml+"' href='javascript:void(0)' data-val='"+year+"'>"+year+"</a>";
            }
			html +="</div>";
			body.html(html);
			var headerSet = $(that.panel.getToolbarEl()).find("span.mini-yearpicker-header-set");
			headerSet.html(that.startValue+"-"+(that.startValue+that.pageSize-1));
		},
		getAttrs: function (el) {
			var attrs = mini.YearPicker.superclass.getAttrs.call(this,el);
			mini._ParseBool(el,attrs,["showToyearButton","showOkButton","showClearButton"]);
			return attrs;
		}
    });
    mini.regClass(mini.YearPicker, "yearPicker");
	/*时间日历 ============= 开始**/
    mini.TimeCalendar = function () {
        mini.TimeCalendar.superclass.constructor.call(this);
		var e = {
			currentObject:this,
			currentClass:"mini.TimeCalendar",
			fields:["showHeader","showFooter","format","value","showNowButton","showClearButton"],
			events:["valuechanged"]
		};
		mini.createGetSetMethod(e);
    }
    mini.extend(mini.TimeCalendar, mini.Control, {
        uiCls: 'mini-time-calendar',
		value:new Date(),
		format:"HH:mm:ss",
		showHeader:true,
		showFooter:true,
		getDrawValue:function(){
			var that = this;
			var hourLi = $(that._mainEl).find("ol.main-hour li.select-this");
			var minuteLi = $(that._mainEl).find("ol.main-minute li.select-this");
			var secondLi = $(that._mainEl).find("ol.main-second li.select-this");
			if(hourLi.length>0 && minuteLi.length>0 && secondLi.length>0){
				var hour = $(hourLi).attr("data-val")*1;
				var minute = $(minuteLi).attr("data-val")*1;
				var second = $(secondLi).attr("data-val")*1;
				var date = new Date();
				date.setHours(hour);
				date.setMinutes(minute);
				date.setSeconds(second);
				return date;
			}else{
				return null;
			}
		},
		getFieldValue:function(field){
			var that = this;
			return that[field];
		},
		setFieldValue:function(field,value){
			var that = this;
			that._init();
			var booleanFields = ["showHeader","showFooter","showNowButton","showClearButton"];
			var dateFields = ["value"];
			var stringFields = ["format"];
			$.each(booleanFields,function(i,booleanField){
				if(booleanField != field){
					return true;
				}
				that[field]=mini.parseData(value,"boolean");
				if(field == "showNowButton"){
					that.nowBtn.setVisible(that[field]);
				}else if(field == "showClearButton"){
					that.clearBtn.setVisible(that[field]);
				}else if(field == "showHeader"){
					that._headerEl.style.display=that[field]?"":"none";
				}else if(field == "showFooter"){
					that._footerEl.style.display=that[field]?"":"none";
					if(that[field]){
						$(that._tableEl).removeClass("no-border-bottom");
					}else{
						$(that._tableEl).addClass("no-border-bottom");
					}
				}
				return false;
			});
			$.each(dateFields,function(i,dateField){
				if(dateField != field){
					return true;
				}
				if(field == "value"){
					var oldValue = that.getValue();
					that[field]=mini.parseData(value,"date",that.format);
					if(value && !that[field]){
						//此时可能是格式化符号和当前value不一致,暂存
						that._textValue = value;
					}else{
						delete that._textValue;
					}
					if(that[field]){
						that[field].setFullYear(1900);
						that[field].setMonth(0);
						that[field].setDate(1);
					}
					that.draw();
					var nowValue = that.getValue();
					if(String(oldValue) != String(nowValue)){
						that.fire("valuechanged",{oldValue:oldValue,value:nowValue});
					}
				}
				return false;
			});
			$.each(stringFields,function(i,stringField){
				if(stringField != field){
					return true;
				}
				that[field]=mini.parseData(value,"string");
				if(field == "format"){
					if(!value){
						that[field] = "HH:mm:ss";
					}
					if(that._textValue){
						var tempDate = mini.parseData(that._textValue,"date",that[field]);
						if(tempDate){
							that.setValue(tempDate);
						}
						delete that._textValue;	
					}
					that.draw();

				}
				return false;
			});
		},
		getFormattedValue:function(){
			return mini.parseData(this.value,"string",this.format);
		},
		getFormValue:function(){
			return this.getFormattedValue();
		},
		draw:function(){
			var that = this;
			$(that._mainEl).find("li").removeClass("select-this");
			if(that.format.indexOf("H") == -1){
				$(that._mainEl).find("ol.main-hour").addClass("mini-disabled");
			}else{
				$(that._mainEl).find("ol.main-hour").removeClass("mini-disabled");
			}
			if(that.format.indexOf("m") == -1){
				$(that._mainEl).find("ol.main-minute").addClass("mini-disabled");
			}else{
				$(that._mainEl).find("ol.main-minute").removeClass("mini-disabled");
			}
			if(that.format.indexOf("s") == -1){
				$(that._mainEl).find("ol.main-second").addClass("mini-disabled");
			}else{
				$(that._mainEl).find("ol.main-second").removeClass("mini-disabled");
			}
			var hour=0,minute=0,second=0;
			if(that.value){
				if(that.format.indexOf("H") != -1){
					hour = that.value.getHours();
				}
				if(that.format.indexOf("m") != -1){
					minute = that.value.getMinutes();
				}
				if(that.format.indexOf("s") != -1){
					second = that.value.getSeconds();
				}
			}
			if(hour!=0 || minute!=0 || second!=0){
				$(that._mainEl).find("ol.main-hour li[data-val='"+hour+"']").addClass("select-this");
				$(that._mainEl).find("ol.main-minute li[data-val='"+minute+"']").addClass("select-this");
				$(that._mainEl).find("ol.main-second li[data-val='"+second+"']").addClass("select-this");
			}
			var liHeight = $(that._mainEl).find("ol li")[0].clientHeight;
			var hourOl = $(that._mainEl).find("ol.main-hour")[0];
			var minuteOl = $(that._mainEl).find("ol.main-minute")[0];
			var secondOl = $(that._mainEl).find("ol.main-second")[0];
			if(hour- hourOl.scrollTop/liHeight > 6 || hourOl.scrollTop/liHeight- hour >6){
				hourOl.scrollTop = liHeight*hour;
			}
			if(minute- minuteOl.scrollTop/liHeight > 6 || minuteOl.scrollTop/liHeight- minute >6){
				minuteOl.scrollTop = liHeight*minute;
			}
			if(second- secondOl.scrollTop/liHeight > 6 || secondOl.scrollTop/liHeight- second >6){
				secondOl.scrollTop = liHeight*second;
			}
		},
		_init:function(){
			var that = this;
			//_tableEl
			if(!that.hasInit){
				var tableHtml = "<table class=\"mini-time-calendar-table\" cellpadding=\"0\" cellspacing=\"0\">";
				tableHtml += "<tbody>";
				tableHtml +="<tr class=\"mini-time-calendar-header\"><td class=\"time-calendar-first-td\"><div class=\"time-calendar-inner\">"+mini.TimeCalendar.prototype.hourText+"</div></td><td><div class=\"time-calendar-inner\">"+mini.TimeCalendar.prototype.minuteText+"</div></td><td><div class=\"time-calendar-inner\">"+mini.TimeCalendar.prototype.secondText+"</div></td></tr>";
				var hourHtml = "<ol class=\"main-hour\">";
				for(var i=0;i<24;i++){
					hourHtml +="<li data-val=\""+i+"\">"+i+"</li>"
				}
				hourHtml +="</ol>";
				var minuHtml = "<ol class=\"main-minute\">";
				for(var i=0;i<60;i++){
					minuHtml +="<li data-val=\""+i+"\">"+i+"</li>"
				}
				minuHtml +="</ol>";
				var secHtml = "<ol class=\"main-second\">";
				for(var i=0;i<60;i++){
					secHtml +="<li data-val=\""+i+"\">"+i+"</li>"
				}
				secHtml +="</ol>";
				tableHtml +="<tr class=\"mini-time-calendar-main\"><td class=\"time-calendar-first-td\"><div class=\"time-calendar-inner\">"+hourHtml+"</div></td><td><div class=\"time-calendar-inner\">"+minuHtml+"</div></td><td><div class=\"time-calendar-inner\">"+secHtml+"</div></td></tr>";
				tableHtml +="<tr class=\"mini-time-calendar-footer\"><td colSpan=\"3\"><div class=\"time-calendar-inner\"><input name=\"mini-time-calendar-now\" class=\"mini-button\" text=\""+mini.TimeCalendar.prototype.nowButton+"\"/><input name=\"mini-time-calendar-clear\" class=\"mini-button\" text=\""+mini.TimeCalendar.prototype.clearButton+"\"/></div></td></tr>";
				$(that.el).html(tableHtml);
				that._tableEl = $(that.el).find("table.mini-time-calendar-table")[0];
				that._headerEl = $(that.el).find("tr.mini-time-calendar-header")[0];
				that._mainEl = $(that.el).find("tr.mini-time-calendar-main")[0];
				that._footerEl = $(that.el).find("tr.mini-time-calendar-footer")[0];
				mini.parse(that._footerEl);
				that.nowBtn = mini.getByName("mini-time-calendar-now",that._footerEl);
				that.clearBtn = mini.getByName("mini-time-calendar-clear",that._footerEl);
				$(that._mainEl).on("click","li",function(e){
					var parent = $(this).parent();
					if(!parent.hasClass("mini-disabled")){
						parent.find("li").removeClass("select-this");
						$(this).addClass("select-this");
					}
					var tempDate = that.getDrawValue();
					if(tempDate){
						that.setValue(tempDate);
					}

				});
				that.nowBtn.on("click",function(e){
					that.setValue(new Date());
				});
				that.clearBtn.on("click",function(e){
					that.setValue(null);
				});
				that.hasInit = true;
			}
		}
	});
	mini.regClass(mini.TimeCalendar, "timeCalendar");
	/**时间日历=======================结束**/
	/**时间控件=======================开始**/
    mini.Timepicker = function () {
        mini.Timepicker.superclass.constructor.call(this);
		var e = {
			currentObject:this,
			currentClass:"mini.Timepicker",
			fields:["isCover"],
			events:[]
		};
		mini.createGetSetMethod(e);
    }
    mini.extend(mini.Timepicker, mini.DatePicker, {
        uiCls: 'mini-timepicker',
		isCover:true,
		getFieldValue:function(field){
			var that = this;
			return that[field];
		},
		setFieldValue:function(field,value){
			var that = this;
			if(field == "isCover"){
				value = mini.parseData(value,"boolean");
			}
			that[field] = value;
		},
		_init:function(){
			var that = this;
			that.on("beforeshowpopup",function(e){
				e.sender.setShowOkButton(true);
			});
			that.on("hidepopup",function(e){
			    if(getParamer("mode") != "debug"){
                    that.datecalendar.destroy();
                    delete that.datecalendar;
                    that.timecalendar.destroy();
                    delete that.timecalendar;
                }
			});
			that.on("showpopup",function(e){
				var popup = e.sender.popup;
				that.timespinner = mini.get($(popup._contentEl).find(".mini-timespinner")[0]);
				//处理时间选择框
				if(that.timespinner){
					if(!that.timespinner._hasInit){
						//处理timespinner的按钮
						$(that.timespinner._buttonsEl).html("<span class=\"mini-timepicker-select mini-buttonedit-down\"><span class=\"mini-icon\"></span></span>");
						$(that.timespinner._buttonsEl).on("click","span.mini-timepicker-select",function(e){
							//隐藏日历
							$(that.datecalendar.el).hide();
							$(that.timecalendar.el).show();
							that.timecalendar.setValue(that.timespinner.getValue());
							that.timecalendar.lastTime = that.timecalendar.getValue();
						});
						$(that.timespinner._buttonsEl).on("mouseover","span.mini-timepicker-select",function(e){
							$(this).addClass("mini-buttonedit-button-pressed");
						});
						$(that.timespinner._buttonsEl).on("mouseout","span.mini-timepicker-select",function(e){
							$(this).removeClass("mini-buttonedit-button-pressed");
						});
						that.timespinner.setAllowInput(false);
						that.timespinner._hasInit = true;
					}
				}
				//创建时间日历
				if(!that.timecalendar){
					var html = "";
					html += "<div name=\"mini-time-calendar\" class=\"mini-time-calendar\"></div>";
					$(popup._contentEl).append(html);
					mini.parse(popup._contentEl);
					that.timecalendar = mini.getByName("mini-time-calendar",popup._contentEl);
					$(that.timecalendar._footerEl).find("div.time-calendar-inner").append("<input name=\"calendar-button\" groupName=\"commit\" class=\"mini-button\" text=\""+mini.Timepicker.prototype.commitButton+"\"/><input name=\"calendar-button\" groupName=\"return\" class=\"mini-button\" text=\""+mini.Timepicker.prototype.returnButton+"\"/>");
					mini.parse(that.timecalendar._footerEl);
					var btns = mini.getsByName("calendar-button",that.timecalendar._footerEl);
					that.timecalendarBtns = btns;
					$.each(btns,function(i,btn){
						btn.on("click",function(e){
							var groupName = e.sender.groupName;
							if(groupName == "commit"){
								that.timecalendar.lastTime = that.timecalendar.getDrawValue();
							}else if(groupName == "return"){
								
							}
							that.timecalendar.setValue(that.timecalendar.lastTime);
							that.timespinner.setValue(that.timecalendar.lastTime);
							$(that.datecalendar.el).show();
							$(that.timecalendar.el).hide();
							$(that.timecalendar.el).find(".mini-time-calendar-table").css("border",null);
						});
					});
					that.timecalendar.setFormat(that.getTimeFormat());
					var date = mini.parseData(that.getValue(),"date",that.getFormat());
					that.timecalendar.setValue(date);
				}
				that.timecalendar.draw();
				if(!that.datecalendar){
					that.datecalendar = mini.get($(popup._contentEl).find(".mini-calendar")[0]);
					var tempDate = mini.parseData(that.getText(),"date",that.getFormat());
					that.datecalendar.setViewDate(tempDate);
					that.datecalendar.setValue(tempDate);
					$(that.datecalendar.okButtonEl).replaceWith("<input name=\"commit-calendar-button\" class=\"mini-button mini-timepicker-commit-button\" text=\""+mini.Timepicker.prototype.commitButton+"\"/>");
					mini.parse(that.datecalendar.el);
					var btn = mini.getByName("commit-calendar-button",that.datecalendar.el);
					btn.on("click",function(e){
						var date = that.datecalendar.getValue();
						var time = that.timecalendar.getDrawValue();
						var hasDate = $(that.datecalendar._innerEl).find(".mini-calendar-selected.mini-calendar-date").length>0;
						if(hasDate){
							var val = new Date();
							val.setFullYear(date.getFullYear());
							val.setMonth(date.getMonth());
							val.setDate(date.getDate());
							if(time){
								val.setHours(time.getHours());
								val.setMinutes(time.getMinutes());
								val.setSeconds(time.getSeconds());
							}else{
								val.setHours(0);
								val.setMinutes(0);
								val.setSeconds(0);
							}
							that.setValue(val);
							that.popup.setVisible(false);
						}else if(!hasDate && !time){
							that.setValue(null);
							that.popup.setVisible(false);
						}
					});
					$(that.datecalendar.todayButtonEl).text(mini.Timepicker.prototype.nowButton);
					$(that.datecalendar.todayButtonEl).click(function(e){
						setTimeout(function(){
							that.timecalendar.setValue(that.datecalendar.getValue());
						},100);
					});
					$(that.datecalendar.closeButtonEl).click(function(e){
						setTimeout(function(){
							that.timecalendar.setValue(null);
						},100);
					});
				}
				//控制日历是并列还是覆盖
				$(that.datecalendar.el).show();
				$(that.timecalendar.el).find(".mini-time-calendar-table").css("border","none");
				if(e.sender.isCover){
					//覆盖关系
					$(that.timecalendar.el).hide();
					$(that.timespinner.el).show();
					$(that.datecalendar.el).css("float",null);
					$(that.timecalendar.el).css("float",null);
					that.timecalendar.setShowNowButton(that.getShowTodayButton());
					that.timecalendar.setShowClearButton(that.getShowClearButton());
					$(that.timecalendar.el).find(".mini-time-calendar-table .time-calendar-first-td").css("border-left-width",null);
				}else{
					//并列关系
					$(that.timecalendar.el).show();
					$(that.timespinner.el).hide();
					$(that.datecalendar.el).css("float","left");
					$(that.timecalendar.el).css("float","left");
					that.timecalendar.setShowNowButton(false);
					that.timecalendar.setShowClearButton(false);
					$(that.timecalendar.el).find(".mini-time-calendar-table .time-calendar-first-td").css("border-left-width","1px");
				}
				//隐藏确认和返回
				$.each(that.timecalendarBtns,function(i,btn){
					btn.setVisible(e.sender.isCover);
				});
				//根据是否有时间框调整布局
				var hasTimeDiv = $(popup._contentEl).find(".mini-calendar-hastime");
				if(hasTimeDiv.length>0){
					if(e.sender.isCover){
						hasTimeDiv.css("text-align",null);
					}else{
						hasTimeDiv.css("text-align","center");
					}
				}
			});
		}
	});
	mini.regClass(mini.Timepicker, "timepicker");
	/**时间控件=======================结束**/
	mini.firstToUpperCase = function(str){
		if(!str){
			return str;
		}
		str = str+"";
		str = str.substring(0,1).toUpperCase()+str.substring(1);
		return str;
	};
	mini.createGetSetMethod=function(e){
		var that = e.currentObject;
		var fields = e.fields;
		var events = e.events;
		var currentClass = e.currentClass;
		if(!that._hasInitGetSet){
			$.each(fields,function(i,field){
				var firstToUpperCaseField = mini.firstToUpperCase(field);
				that["get"+firstToUpperCaseField] = new Function("return this.getFieldValue(\""+field+"\");");
				that["set"+firstToUpperCaseField] = new Function("obj","this.setFieldValue(\""+field+"\",obj);");
			});
			that._hasInitGetSet = true;
		}
		if(!that._hasInitGetAttrs){
			var cloneFields = mini.clone(fields);
			$.each(events,function(i,event){
				cloneFields[cloneFields.length] = "on"+event;
			});
			that.getAttrs = new Function("el","var attrs = "+currentClass+".superclass.getAttrs.call(this,el);mini._ParseString(el,attrs,"+mini.encode(cloneFields)+");return attrs;");
			that._hasInitGetAttrs = true;
		}
		if(that._init){
			that._init();
		}
	}
	mini.parseDateTime=function(str,format){
		if(!str){
			return null;
		}
		if(str instanceof Date){
			return str;
		}else if(typeof str == "number" || !isNaN(str)){
			str = str*1;
			return new Date(str);
		}
		if(!format){
			return mini.parseDate(str);
		}
		//仅支持yyyy MM dd HH mm ss相互组合
		var date = new Date();
		date.setFullYear(1900);
		date.setMonth(0);
		date.setDate(1);
		var formatMaps = [{id:"yyyy",name:"FullYear"},{id:"MM",name:"Month"},{id:"dd",name:"Date"},{id:"HH",name:"Hours"},{id:"mm",name:"Minutes"},{id:"ss",name:"Seconds"}];
		var flag = true;
		var c;
		$.each(formatMaps,function(i,formatMap){
			if((c = format.indexOf(formatMap.id)) != -1){
				var val = str.substring(c,c+formatMap.id.length);
				if(isNaN(val)){
					flag = false;
					return false;
				}
				val = val*1;
				if(formatMap.id == "MM"){
					val = val -1;
				}
				eval("date.set"+formatMap.name+"("+val+")");
			}
		});
		if(flag){
			return date;
		}else{
			return mini.parseDate(str);
		}
	}
	mini.parseData = function(data,type,format){
		if(type == "number"){
			var num = Number(data);
			if(String(num) != "NaN"){
				return num;
			}
			throw "data is not a number";
		}else if(type == "boolean"){
			if(typeof data == "boolean"){
				return data;
			}if(data == "true" || data == "false"){
				return eval(data);
			}if(data == "1" || data =="0"){
				return Boolean(Number(data));
			}else if(data == null){
				return false;
			}
			throw "data is not a boolean";
		}else if(type == "string"){
			if(data == null){
				return "";
			}else if(typeof data == "string"){
				return data;
			}else if(typeof data == "number" || typeof data == "boolean"){
				return String(data);
			}else if(data instanceof Date){
				var tempFormat = "yyyy-MM-dd HH:mm:ss";
				if(format){
					tempFormat = format;
				}
				return mini.formatDate(data,tempFormat);
			}
			throw "data is not a string";
		}else if(type == "date"){
			if(data == null){
				return null;
			}
			return mini.parseDateTime(data,format);
		}else{
			throw "can not change data type";
		}
	}
})(window);