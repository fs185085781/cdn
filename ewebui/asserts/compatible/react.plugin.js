(function(){
    class MiniUi extends React.Component {
        constructor(props) {
            var clazz = props.class;
            if(!clazz){
                clazz = props.className;
            }
            if(!clazz){
                throw "EwebUiError:not find the class";
            }
            if(!props.options){
                props.options={className:clazz}
            }else{
                props.options.className=clazz;
            }
            super(props);
            this.oldComponentDidMount = this.componentDidMount;
            this.componentDidMount =function(a,b){
                this.lastProps = getPropsByReact(this.props.options);
                initMountDom(this);
                if(this.oldComponentDidMount){
                    this.oldComponentDidMount(a,b);
                }
            }
            this.oldComponentDidUpdate = this.componentDidUpdate;
            this.componentDidUpdate =function(a,b){
                var that = this;
                copatible.updateComponent(that.el.current,that.lastProps,that.props.options);
                that.lastProps = getPropsByReact(that.props.options);
                if(this.oldComponentDidUpdate){
                    this.oldComponentDidUpdate(a,b);
                }
            }
            this.el = React.createRef();
        }
        render() {
            this.props.options.ref = this.el;
            return React.createElement('div',this.props.options,null);
        }
    }
    window.MiniUi = MiniUi;
    function getPropsByReact(options){
        var map = {};
        $.each(options,function(key,val){
            map[key] = val;
        });
        return map;
    }
    window.createReactMap = function(that,key){
        if(!window.reactParentMap){
            window.reactParentMap = {};
        }
        var id = guid();
        window.reactParentMap[id] = {app:that,valueKey:key};
        function guid() {
            function S4() {
                return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            }
            return S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4();
        }
        return id;
    }
    function initMountDom(that){
        if(!that.props || !that.props.options || !that.props.options.className){
            throw "EwebUiError:not find the class";
        }
        var className = that.props.options.className;
        var ele = that.el.current;
        copatible.changeOneClass(className,ele,function(){
            copatible.parseMiniOne(className,ele,function(){
                var eventMap = {};
                $.each(that.props.options,function (key,val) {
                    if(typeof val != "string"){
                        return true;
                    }
                    var event = that[val];
                    if(!event){
                        return true;
                    }
                    if(typeof event != "function"){
                        return true;
                    }
                    eventMap[key] = event;
                })
                copatible.bindEvent(ele,eventMap,function(e){
                    if(that.props && that.props.options && that.props.options.value_update){
                        var appMap = reactParentMap[that.props.options.value_update];
                        var app = appMap.app;
                        var valueKey = appMap.valueKey;
                        var state = app.state;
                        eval("state."+valueKey+".value=e.value;");
                        app.setState(state);
                    }
                });
            });
        });
    }
})()