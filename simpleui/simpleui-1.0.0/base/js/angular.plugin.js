(function(win){
    "use strict";
   //alert("实在抱歉,暂时还不能支持angular");
   var module = angular.module;
    angular.module = function(name, requires, configFn){
        var app = module(name, requires, configFn);
        app.directive('simpleUi', function($document) {
            return function(scope, parent, attr) {
                console.log($document);
                var html = '<div name="{{buttons[0].name}}" text="{{buttons[0].text}}"></div>';
                var template = angular.element(html);
                var linkFn = $compile(template);
                var element = linkFn(scope);
                parent.appendChild(element);
            }
        });
        return app;
    }
})(window)