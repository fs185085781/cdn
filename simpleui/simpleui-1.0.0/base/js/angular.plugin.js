(function(win){
    "use strict";
    alert("实在抱歉,暂时还不能支持angular");
   var module = angular.module;
    angular.module = function(name, requires, configFn){
        var app = module(name, requires, configFn);
        var controller = app.controller;
        app.controller = function(recipeName, factoryFunction){
            var tempFunction = factoryFunction;
            factoryFunction = function($scope){
                return tempFunction($scope);
            }
            return controller(recipeName,factoryFunction);
        }
        return app;
    }
})(window)