(function () {
    var createHtmlMethodKey = "";
    $.each(mini.DataGrid.prototype,function(key,val){
        if(typeof val == "function" && val.toString().indexOf("mini-grid-cell-nowrap")!=-1){
            createHtmlMethodKey = key;
            return false;
        }
    });
    if(!createHtmlMethodKey){
        return;
    }
    mini.DataGrid.prototype.createHtmlMethod = mini.DataGrid.prototype[createHtmlMethodKey];
    mini.DataGrid.prototype._miniCreateColumnsHTML = mini.DataGrid.prototype._createColumnsHTML;
    mini.DataGrid.prototype._createColumnsHTML = function(a,b,c){
        var html = "";
        if(this.isExporting){
            //导出状态
            $.each(a,function(i,d){
                $.each(d,function(n,item){
                    console.log(item);
                });
            });
        }else{
            //非导出状态
            html = this._miniCreateColumnsHTML(a,b,c);
        }
        return html;
    }
    mini.DataGrid.prototype[createHtmlMethodKey] = function(a,b,c,d,e){
        if(this.isExporting){
            //导出状态
            for (var i = 0, l = c.length; i < l; i++) {
                var item = c[i];
                var m = this._OnDrawCell(a, item, b, item._index);
                console.log(m);
            }
        }else{
            //非导出状态
            this.createHtmlMethod(a,b,c,d,e);
        }
    }
    mini.DataGrid.prototype.exportToExecl = function(options){
        this.setData([]);
        this.set({
            frozenStartColumn:-1,
            frozenEndColumn:-1,
            pageIndex:0,
            pageSize:999999,
            virtualScroll:false,
            virtualColumns:false,
        });
        //this.reload();
        //this.isExporting = true;
        //console.log("doUpdate")

        //this.reload();
        //console.log("测试");

    }
})()