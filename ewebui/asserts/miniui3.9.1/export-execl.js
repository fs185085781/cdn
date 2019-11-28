(function () {
    var exportMap = {};
    var templateMap = {
        xml:{
            TABLE:"Table",
            ROW:"Row",
            CELL:"Cell",
            DATA:"Data"
        },
        html:{
            TABLE:"tbody",
            ROW:"tr",
            CELL:"td",
            DATA:"span"
        }
    };
    var miniUpdate = function(e){
        var that = e.sender;
        var exportType = exportMap[that.uid].exportType;
        exportMap[that.uid].exportTableStr += getTemplateStr("<$0>",[templateMap[exportType].TABLE]);
        console.log(exportMap[that.uid].exportTableStr);
        console.log("注销数据")
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
                console.log("生成表头")
                var exportType = exportMap[that.uid].exportType;
                exportMap[that.uid].exportTableStr = getTemplateStr("<$0>",[templateMap[exportType].TABLE]);
                var trsStr = "";
                //导出状态
                $.each(a,function(i,d){
                    trsStr += getTemplateStr("<$0>",[templateMap[exportType].ROW]);
                    $.each(d,function(n,item){
                        if(!item.rowspan){
                            item.rowspan = 1;
                        }
                        if(!item.colspan){
                            item.colspan = 1;
                        }
                        if(!item.header){
                            item.header = "";
                        }
                        trsStr += getTemplateStr("<$0 colspan='$1' rowspan='$2'>$3</$0>",[templateMap[exportType].CELL,item.colspan,item.rowspan,item.header]);
                    });
                    trsStr += getTemplateStr("</$0>",[templateMap[exportType].ROW]);
                });
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
            console.log("生成表格")
            var exportType = exportMap[that.uid].exportType;
            //导出状态
            var trsStr = getTemplateStr("<$0>",[templateMap[exportType].ROW]);
            for (var i = 0, l = c.length; i < l; i++) {
                var item = c[i];
                var m = that._OnDrawCell(a, item, b, item._index);
                if(!m.rowSpan){
                    m.rowSpan = 1;
                }
                if(!m.colSpan){
                    m.colSpan = 1;
                }
                trsStr += getTemplateStr("<$0 colspan='$1' rowspan='$2'>$3</$0>",[templateMap[exportType].CELL,m.colSpan,m.rowSpan,m.cellHtml]);
            }
            trsStr += getTemplateStr("</$0>",[templateMap[exportType].ROW]);
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
            options.fileName = "Execl数据导出.xls";
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
            fileName:options.fileName
        };
        that.setData([]);
        that.set({
            frozenStartColumn:-1,
            frozenEndColumn:-1,
            pageIndex:0,
            pageSize:999999,
            virtualScroll:false,
            virtualColumns:false,
        });
        exportMap[that.uid].exportStatus = true;
        that.on("update",miniUpdate);
        console.log("开始生成")
        if(that.showPager){
            //有分页
            console.log("ajax加载数据导出")
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
        $.each(list,function(i,item){
            str = replaceAll(str,"$"+[i],item);
        });
        return str;
    }
    function replaceAll(str,source,target) {
        while(str.indexOf(source) != -1){
            str = str.replace(source,target);
        }
        return str;
    }
})()