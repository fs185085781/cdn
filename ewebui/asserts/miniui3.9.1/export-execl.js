(function () {
    var exportMap = {};
    var templateMap = {
        xml:{
            TABLE:"Table",
            ROW:"Row",
            CELL:"Cell",
            DATA:"Data",
            ROWSPAN:"ss:MergeDown",
            COLSPAN:"ss:MergeAcross",
            TDSTYLE:"",
            SHEETSTART:"<?xml version=\"1.0\" encoding=\"utf-8\"?><?mso-application progid=\"Excel.Sheet\"?><Workbook xmlns=\"urn:schemas-microsoft-com:office:spreadsheet\" xmlns:o=\"urn:schemas-microsoft-com:office:office\" xmlns:x=\"urn:schemas-microsoft-com:office:excel\" xmlns:ss=\"urn:schemas-microsoft-com:office:spreadsheet\" xmlns:html=\"http://www.w3.org/TR/REC-html40\"><Styles><Style ss:ID=\"border_line\"><Alignment ss:Horizontal=\"Center\"/><Borders><Border ss:Position=\"Bottom\" ss:LineStyle=\"Continuous\" ss:Weight=\"1\" /><Border ss:Position=\"Left\" ss:LineStyle=\"Continuous\" ss:Weight=\"1\" /><Border ss:Position=\"Right\" ss:LineStyle=\"Continuous\" ss:Weight=\"1\" /><Border ss:Position=\"Top\" ss:LineStyle=\"Continuous\" ss:Weight=\"1\" /></Borders></Style><Style ss:ID=\"time_format\"><Alignment ss:Horizontal=\"Center\"/><Borders><Border ss:Position=\"Bottom\" ss:LineStyle=\"Continuous\" ss:Weight=\"1\" /><Border ss:Position=\"Left\" ss:LineStyle=\"Continuous\" ss:Weight=\"1\" /><Border ss:Position=\"Right\" ss:LineStyle=\"Continuous\" ss:Weight=\"1\" /><Border ss:Position=\"Top\" ss:LineStyle=\"Continuous\" ss:Weight=\"1\" /></Borders><NumberFormat ss:Format=\"yyyy/mm/dd\ hh:mm:ss\"/></Style></Styles><Worksheet ss:Name=\"$0\">",
            SHEETEND:"</Worksheet></Workbook>",
            FILETYPE:".xls"
        },
        html:{
            TABLE:"tbody",
            ROW:"tr",
            CELL:"td",
            DATA:"span",
            ROWSPAN:"rowspan",
            COLSPAN:"colspan",
            TDSTYLE:" style=\"text-align:center;border:0.5px solid #000000;\"",
            SHEETSTART:"<html xmlns:x=\"urn:schemas-microsoft-com:office:excel\"><head><meta  http-equiv=\"content-type\" content=\"application/vnd.ms-excel;charset=UTF-8\"/></head><body><table  border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"border-collapse:collapse;\">",
            SHEETEND:"</table></body></html>",
            FILETYPE:".xls"
        },
        csv:{
            FILETYPE:".csv"
        }
    };
    var miniUpdate = function(e){
        var that = e.sender;
        var t = templateMap[exportMap[that.uid].exportType];
        if(exportMap[that.uid].exportType == "xml" || exportMap[that.uid].exportType == "html"){
            exportMap[that.uid].exportTableStr += getTemplateStr("<$0>",[t.TABLE]);
        }
        var data = exportMap[that.uid].exportTableStr;
        var fileName = exportMap[that.uid].fileName;
        var fileStr = data;
        if(exportMap[that.uid].exportType == "xml" || exportMap[that.uid].exportType == "html"){
            fileStr = getTemplateStr(t.SHEETSTART,[fileName])+ data + t.SHEETEND;
        }
        var blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]),fileStr], {type: "application/vnd.ms-excel"});
        var link = window.URL.createObjectURL(blob);
        if(window.navigator && window.navigator.msSaveOrOpenBlob){
            window.navigator.msSaveOrOpenBlob(blob,fileName+t.FILETYPE);
        }else if(true){
            var a = document.createElement('a');
            a.download = fileName+t.FILETYPE;
            a.href = link;
            document.body.appendChild(a).click();
        }
        that.un("update",miniUpdate);
        exportMap[that.uid].exportStatus = false;
        that.set(exportMap[that.uid].beforeExportOptions);
        that.setData(exportMap[that.uid].beforeExportData);
        delete exportMap[that.uid];
    }
    var createRowsHtmlMethodKey = "";
    var createColumnsHtmlMethodKey = "";
    var count = 0;
    $.each(mini.DataGrid.prototype,function(key,val){
        if(typeof val == "function" && val.toString().indexOf("mini-grid-cell-nowrap")!=-1){
            createRowsHtmlMethodKey = key;
            count++;
            return count != 2;
        }
        if(typeof val == "function" && val.toString().indexOf("mini-grid-headerCell-nowrap")!=-1){
            createColumnsHtmlMethodKey = key;
            count++;
            return count != 2;
        }
    });
    if(!createRowsHtmlMethodKey || !createColumnsHtmlMethodKey){
        return;
    }
    mini.DataGrid.prototype.createColumnsHtmlMethod = mini.DataGrid.prototype[createColumnsHtmlMethodKey];
    mini.DataGrid.prototype.createRowsHtmlMethod = mini.DataGrid.prototype[createRowsHtmlMethodKey];
    mini.DataGrid.prototype[createColumnsHtmlMethodKey] = function(a,b,c){
        var that = this;
        var html = "";
        if(exportMap[that.uid] && exportMap[that.uid].exportStatus){
            if(a && a.length>0){
                var t = templateMap[exportMap[that.uid].exportType];
                if(exportMap[that.uid].exportType == "xml" || exportMap[that.uid].exportType == "html"){
                    exportMap[that.uid].exportTableStr = getTemplateStr("<$0>",[t.TABLE]);
                }else{
                    exportMap[that.uid].exportTableStr = "";
                }
                var trsStr = "";
                //导出状态
                if(exportMap[that.uid].exportType == "xml" || exportMap[that.uid].exportType == "html"){
                    $.each(a,function(i,d){
                        trsStr += getTemplateStr("<$0>",[t.ROW]);
                        $.each(d,function(n,item){
                            if(!item.rowspan){
                                item.rowspan = 1;
                            }
                            if(!item.colspan){
                                item.colspan = 1;
                            }
                            if(exportMap[that.uid].exportType == "xml"){
                                item.colspan -=1;
                                item.rowspan -=1;
                            }
                            if(!item.header){
                                item.header = "";
                            }
                            var index = getIndexByColumn(item);
                            var obj = toTransformationData(item.header,that);
                            trsStr += getCellStrByType(exportMap[that.uid].exportType,[t.CELL,index,obj.style,t.COLSPAN,item.colspan,t.ROWSPAN,item.rowspan,t.TDSTYLE,t.DATA,obj.type,obj.value],item.visible);
                        });
                        trsStr += getTemplateStr("</$0>",[t.ROW]);
                    });
                }else{
                    var allColumns = [];
                    $.each(a,function(i,d){
                        $.each(d,function(n,item){
                            if(item.visible && item._index != undefined){
                                allColumns[allColumns.length] = item;
                            }
                        });
                    });
                    allColumns.sort(function (a,b) {
                        return a._index - b._index;
                    });
                    $.each(allColumns,function (i,item) {
                        if(!item.header){
                            item.header = "";
                        }
                        var obj = toTransformationData(item.header,that);
                        trsStr += ",\""+obj.value+"\"";
                    });
                    trsStr = trsStr.substring(1)+"\r\n";
                }
                exportMap[that.uid].exportTableStr += trsStr;
            }
        }else{
            //非导出状态
            html = that.createColumnsHtmlMethod(a,b,c);
        }
        return html;
    }
    mini.DataGrid.prototype[createRowsHtmlMethodKey] = function(a,b,c,d,e){
        var that = this;
        if(exportMap[that.uid] && exportMap[that.uid].exportStatus){
            var t = templateMap[exportMap[that.uid].exportType];
            //导出状态
            var trsStr = "";
            if(exportMap[that.uid].exportType == "xml" || exportMap[that.uid].exportType == "html"){
                trsStr = getTemplateStr("<$0>",[t.ROW])
            }
            for (var i = 0, l = c.length; i < l; i++) {
                var item = c[i];
                var m = that._OnDrawCell(a, item, b, item._index);
                if(!m.rowSpan){
                    m.rowSpan = 1;
                }
                if(!m.colSpan){
                    m.colSpan = 1;
                }
                if(exportMap[that.uid].exportType == "xml"){
                    m.rowSpan -=1;
                    m.colSpan -=1;
                }
                if(m.cellHtml.indexOf("div")!=-1){
                    var dataStr = $(m.cellHtml).text();
                    if(dataStr){
                        m.cellHtml = dataStr;
                    }
                }
                var obj = toTransformationData(m.cellHtml,that);
                trsStr += getCellStrByType(exportMap[that.uid].exportType,[t.CELL,m.columnIndex+1,obj.style,t.COLSPAN,m.colSpan,t.ROWSPAN,m.rowSpan,t.TDSTYLE,t.DATA,obj.type,obj.value],m.visible);
            }
            if(exportMap[that.uid].exportType == "xml" || exportMap[that.uid].exportType == "html"){
                trsStr += getTemplateStr("</$0>",[t.ROW]);
            }else{
                trsStr = trsStr.substring(1)+"\r\n";
            }
            exportMap[that.uid].exportTableStr += trsStr;
        }else{
            //非导出状态
            that.createRowsHtmlMethod(a,b,c,d,e);
        }
    }
    mini.DataGrid.prototype.exportToExecl = function(options){
        if(!options){
            options = {};
        }
        var that = this;
        mini.showMessageBox({
            title: "提示",
            message: "请选择导出模式",
            buttons: ["xml模式", "html模式","csv模式"],
            iconCls: "mini-messagebox-question",
            callback: function(action){
                if(action == "xml模式"){
                    options.exportType = "xml";
                }else if(action == "html模式"){
                    options.exportType = "html";
                }else if(action == "csv模式"){
                    options.exportType = "csv";
                }else{
                    return;
                }
                that.exportToExeclByType(options);
            }
        });
    }
    mini.DataGrid.prototype.exportToExeclByType = function(options){
        if(!options){
            options = {};
        }
        if(!options.exportType){
            options.exportType = "xml";
        }
        if(!options.fileName){
            options.fileName = "Execl数据导出";
        }
        if(options.needTimeFormat == undefined){
            options.needTimeFormat = true;
        }
        var that = this;
        exportMap[that.uid] = {
            beforeExportData:that.getData(),
            beforeExportOptions:mini.clone({
                frozenStartColumn:that.getFrozenStartColumn(),
                frozenEndColumn:that.getFrozenEndColumn(),
                pageIndex:that.pageIndex,
                pageSize:that.pageSize,
                virtualScroll:that.virtualScroll,
                virtualColumns:that.virtualColumns
            }),
            exportType:options.exportType,
            fileName:options.fileName,
            needTimeFormat:options.needTimeFormat
        };
        that.setData([]);
        that.set({
            frozenStartColumn:-1,
            frozenEndColumn:-1,
            pageIndex:0,
            pageSize:999999,
            virtualScroll:false,
            virtualColumns:false
        });
        exportMap[that.uid].exportStatus = true;
        that.on("update",miniUpdate);
        if(that.showPager){
            //有分页
            that.reload();
        }else{
            //无分页
            that.setData(exportMap[that.uid].beforeExportData);
            if(options.mergeColumnsMethod && (exportMap[that.uid].exportType == "xml" || exportMap[that.uid].exportType == "html")){
                options.mergeColumnsMethod();
            }
        }

    }
    function getTemplateStr(str,list){
        for(var i=list.length-1;i>=0;i--){
            str = replaceAll(str,"$"+[i],list[i]);
        }
        return str;
    }
    function replaceAll(str,source,target) {
        while(str.indexOf(source) != -1){
            str = str.replace(source,target);
        }
        return str;
    }
    function getIndexByColumn(column){
        if(column._index == undefined){
            return getIndexByColumn(column.columns[0]);
        }else{
            return column._index+1;
        }
    }
    function toTransformationData(text,that){
        text = text.trim();
        text = replaceAll(text,"&nbsp;","");
        var obj = {type:"String",value:text,style:"border_line"};
        if(text == ""){
            return obj;
        }
        if(exportMap[that.uid].exportType == "html" || exportMap[that.uid].exportType == "csv"){
            //html和csv模式不用格式化时间
            return obj;
        }
        var timePatten = /[0-9]{4}-[0-9]{1,2}-[0-9]{1,2} [0-9]{1,2}:[0-9]{1,2}:[0-9]{1,2}/;
        var datePatten = /[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}/;
        if(exportMap[that.uid].needTimeFormat && (timePatten.test(text) || datePatten.test(text))){
            if(!timePatten.test(text)){
                var temp = text.replace(datePatten,"");
                text = text.replace(temp,"") + " 00:00:00";
            }
            var date = new Date(text);
            if(date == "Invalid Date"){
                return obj;
            }
            function date2execl2(oneDate) {
                var returnDateTime = 25569.0 + ((oneDate.getTime() - (oneDate.getTimezoneOffset() * 60 * 1000)) / (1000 * 60 * 60 * 24));
                return returnDateTime;
            }
            var value = date2execl2(date);
            obj.type = "Number";
            obj.value = value;
            obj.style = "time_format";
            return obj;
        }
        var numText = text.replace(/,/g,"");
        if(!isNaN(numText)){
            obj.value = numText;
            obj.type = "Number";
        }
        return obj;
    }
    function getCellStrByType(type,list,show){
        if(type == "csv"){
            return ",\""+list[10]+"\"";
        }else{
            if(show){
                return getTemplateStr("<$0 ss:Index='$1' ss:StyleID='$2' $3='$4' $5='$6'$7><$8 ss:Type='$9'>$10</$8></$0>",list);
            }else{
                return "";
            }
        }
    }
})()