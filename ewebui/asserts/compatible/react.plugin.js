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
            this.el = React.createRef();
        }
        componentDidMount(){
            initMountDom(this);
            if(this.miniuiDidMount){
                this.miniuiDidMount();
            }
        }
        componentDidUpdate(prevProps, prevState){
           copatible.updateComponent(this.el.current,prevProps.options,this.props.options);
            if(this.miniuiDidUpdate){
                this.miniuiDidUpdate();
            }
        }
        render() {
            this.props.options.ref = this.el;
            return React.createElement('div',this.props.options,null);
        }
    }
    window.MiniUi = MiniUi;
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
                    if(that.props.inputEvent){
                        that.props.inputEvent(e.value);
                    }
                });
            });
        });
    }
})()