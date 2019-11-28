(function () {
    var exportMap = {};
    var miniUpdate = function(e){
        var that = e.sender;
        that.un("update",miniUpdate);
        exportMap[that.uid].isExporting = false;
        that.set(exportMap[that.uid].beforeExportOptions);
        that.setData(exportMap[that.uid].beforeExportData);
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
        if(exportMap[that.uid] && exportMap[that.uid].isExporting){
            exportMap[that.uid].exportTableStr = "<table><tbody>";
            var trsStr = "";
            //导出状态
            $.each(a,function(i,d){
                trsStr += "<tr>";
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
                    trsStr += "<td colspan='"+item.colspan+"' rowspan='"+item.rowspan+"'>"+item.header+"</td>";
                });
                trsStr += "</tr>";
            });
            exportMap[that.uid].exportTableStr += trsStr;
        }else{
            //非导出状态
            html = that.createColumnsHtmlMethod(a,b,c);
        }
        return html;
    }
    mini.DataGrid.prototype[createRowsHtmlMethodKey] = function(a,b,c,d,e){
        var that = this;
        if(exportMap[that.uid] && exportMap[that.uid].isExporting){
            //导出状态
            for (var i = 0, l = c.length; i < l; i++) {
                var item = c[i];
                var m = that._OnDrawCell(a, item, b, item._index);
                console.log(m);
            }
        }else{
            //非导出状态
            that.createRowsHtmlMethod(a,b,c,d,e);
        }
    }
    mini.DataGrid.prototype.exportToExecl = function(){
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
            })
        };
        /*that.beforeExportData = that.getData();
        that.beforeExportOptions = mini.clone({
            frozenStartColumn:that.getFrozenStartColumn(),
            frozenEndColumn:that.getFrozenEndColumn(),
            pageIndex:that.pageIndex,
            pageSize:that.pageSize,
            virtualScroll:that.virtualScroll,
            virtualColumns:that.virtualColumns
        });*/
        that.setData([]);
        that.set({
            frozenStartColumn:-1,
            frozenEndColumn:-1,
            pageIndex:0,
            pageSize:999999,
            virtualScroll:false,
            virtualColumns:false,
        });
        exportMap[that.uid].isExporting = true;
        that.on("update",miniUpdate);
        //that.isExporting = true;
        if(that.showPager){
            //有分页
            that.reload();
        }else{
            //无分页
            that.doUpdate();
        }

    }
})()