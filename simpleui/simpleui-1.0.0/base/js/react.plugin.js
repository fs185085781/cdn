(function(win){
    "use strict";
    var ui = win.simple;
    class SimpleUi extends React.Component {
        constructor(props) {
            super(props);
            this.myRef = React.createRef();
        }
        componentDidMount(){
            var el = this.myRef.current;
            ui.parse(el);
            updateUiByReactNode(this,el);
            if(this.didMount){
                this.didMount();
            }
        }
        componentDidUpdate(){
            var el = this.myRef.current;
            updateUiByReactNode(this,el);
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
    function updateUiByReactNode(that,el){
        var uiObj = ui.getBySelect(el);
        if(!uiObj){
            return;
        }
        that.ui = uiObj;
        var map = that.props.options;
        for(var field in map){
            if(field == "ref"){
                continue;
            }
            var hasEvent = true;
            var eventType = "";
            if(field.length <= 2){
                //一定不是事件
                hasEvent = false;
            }else{
                eventType = field.substring(2);
            }
            if(!uiObj.fieldMap[field] && !hasEvent){
                continue;
            }
            if(uiObj.fieldMap[field]){
                var value = map[field];
                var setFunctionName = "set"+ui.firstToUpperCase(field);
                if(uiObj[setFunctionName]){
                    eval("uiObj."+setFunctionName+"(value)");
                }else{
                    uiObj[field] = value;
                }
            }else if(hasEvent && uiObj.eventMap[eventType]){
                var eventName = map[field];
                if(!that[eventName]){
                    continue;
                }
                if(!uiObj.allBindEventMap){
                    uiObj.allBindEventMap = {};
                }
                if(uiObj.allBindEventMap[eventType]){
                    continue;
                }
                uiObj.react = that;
                uiObj.on(eventType,that[eventName]);
            }
        }
    }
})(window)