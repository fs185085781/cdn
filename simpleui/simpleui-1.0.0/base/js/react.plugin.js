(function(win){
    /*var render = ReactDOM.render;
    ReactDOM.render = function(element, container, callback){
        render(element, container, callback);
    }*/
    class SimpleUi extends React.Component {
        constructor(props) {
            super(props);
            this.myRef = React.createRef();
            var map = simple.decode(simple.encode(props));
            delete map.className;
            this.state = map;
        }
        componentDidMount(){
            var el = this.myRef.current;
            simple.parse(el);
            console.log("父类加载完成");
            updateSimpleUiByReactNode(this,el);
            if(this.simpleUiDidMount){
                this.simpleUiDidMount();
            }
        }
        componentDidUpdate(){
            var el = this.myRef.current;
            console.log("父类更新完成");
            updateSimpleUiByReactNode(this,el);
            if(this.simpleUiDidUpdate){
                this.simpleUiDidUpdate();
            }
        }
        render() {
            var map = this.state;
            var config = {};
            for(var key in map){
                config[key] = map[key];
            }
            config.className = this.props.className;
            config.ref = this.myRef;
            win.aaa = this;
            return React.createElement('div',config,null);
        }
    }
    win.SimpleUi = SimpleUi;
    function updateSimpleUiByReactNode(that,el){

    }
})(window)