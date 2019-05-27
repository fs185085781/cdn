(function(win){
    "use strict";
    var ui = win.simple;
    win.SimpleUiComponent = ng.core.Component({
        selector: '[simpleUi]',
        inputs: ['simpleUi'],
        template: '<div style="width:200px;height:200px;">嘻嘻</div>',
        providers: [ng.core.ElementRef]
    }).Class({
        constructor: [ng.core.ElementRef, function(ref) {
            console.log(ref);
            //this.ref.nativeElement.style.backgroundColor = "yellow";
            this.data = pageData;
        }],
        ngAfterViewChecked:function(){
            console.log("组件",this);
        }
    });
})(window)