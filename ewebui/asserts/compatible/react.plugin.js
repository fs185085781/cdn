(function(){
    class MiniUi extends React.Component {
        constructor(props) {
            if(!props.options){
                props.options={className:props.class}
            }else{
                props.options.className=props.class
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
        if(!that.props || !that.props.class){
            throw "EwebUiError:not find the miniui class";
        }
        var className = that.props.class;
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

                });
            });
        });
    }
})()