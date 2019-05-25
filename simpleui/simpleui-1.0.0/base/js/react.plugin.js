(function(win){
    "use strict";
    class SimpleUi extends React.Component {
        constructor(props) {
            super(props);
            this.myRef = React.createRef();
        }
        componentDidMount(){
            var el = this.myRef.current;
            simple.parse(el);
            updateSimpleUiByReactNode(this,el);
            if(this.simpleUiDidMount){
                this.simpleUiDidMount();
            }
        }
        componentDidUpdate(){
            var el = this.myRef.current;
            updateSimpleUiByReactNode(this,el);
            if(this.simpleUiDidUpdate){
                this.simpleUiDidUpdate();
            }
        }
        render() {
            this.props.options.ref = this.myRef;
            return React.createElement('div',this.props.options,null);
        }
    }
    win.SimpleUi = SimpleUi;
    function updateSimpleUiByReactNode(that,el){
        var simpleObj = simple.getBySelect(el);
        if(!simpleObj){
            return;
        }
        that.simple = simpleObj;
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
            if(!simpleObj.fieldMap[field] && !hasEvent){
                continue;
            }
            if(simpleObj.fieldMap[field]){
                var value = map[field];
                var setFunctionName = "set"+simple.firstToUpperCase(field);
                if(simpleObj[setFunctionName]){
                    eval("simpleObj."+setFunctionName+"(value)");
                }else{
                    simpleObj[field] = value;
                }
            }else if(hasEvent && simpleObj.eventMap[eventType]){
                var eventName = map[field];
                if(!that[eventName]){
                    continue;
                }
                if(!simpleObj.allBindEventMap){
                    simpleObj.allBindEventMap = {};
                }
                if(simpleObj.allBindEventMap[eventType]){
                    continue;
                }
                simpleObj.react = that;
                simpleObj.on(eventType,that[eventName]);
            }
        }
    }
})(window)