(function(win){
    "use strict";
    var ui = win.simple;
    class SimpleUi extends React.Component {
        constructor(props) {
            super(props);
            this.myRef = React.createRef();
        }
        componentDidMount(){
            updateUiByReactNode(this);
            if(this.didMount){
                this.didMount();
            }
        }
        componentDidUpdate(){
            updateUiByReactNode(this);
            if(this.didUpdate){
                this.didUpdate();
            }
        }
        render() {
            this.props.options.ref = this.myRef;
            return React.createElement('div',this.props.options,null);
        }
    }
    win.SimpleUi = SimpleUi;
    function updateUiByReactNode(that){
        if(!that.hasParse){
            var uiEl = that.myRef.current;
            ui.parse(uiEl);
            uiObj = ui.getBySelect(uiEl);
            that.ui = uiObj;
            that.hasParse = true;
            if(!that.ui){
                return
            }
            that.ui.react = that;
            //绑定事件
            var eventMap = uiObj.eventMap;
            for(var event in eventMap){
                var val = that.props.options["el"+event];
                if(!val){
                    continue;
                }
                var hasBindMap = uiObj.allBindEventMap;
                if(!hasBindMap){
                    hasBindMap = {};
                }
                if(hasBindMap[event]){
                    continue;
                }
                uiObj.on(event,that[val]);
            }
        }
        if(!that.ui){
            return
        }
        var uiObj = that.ui;
        var fieldMap = uiObj.fieldMap;
        var newData = that.props.options;
        if(!that.oldData){
            that.oldData = {};
        }
        var oldData = that.oldData;
        for(var field in fieldMap){
            if(!oldData[field] && !newData[field]){
                continue;
            }
            if(oldData[field] == newData[field]){
                continue;
            }
            var value = newData[field];
            oldData[field] = value;
            var setFunctionName = "set"+ui.firstToUpperCase(field);
            if(uiObj[setFunctionName]){
                eval("uiObj."+setFunctionName+"(value)");
            }else{
                uiObj[field] = value;
            }
        }
    }
})(window)