(function(win){
    "use strict";
    var ui = win.simple;
   var module = angular.module;
    angular.module = function(name, requires, configFn){
        var app = module(name, requires, configFn);
        app.directive('simpleUi', function($document,$compile) {
            return function($scope, parent, attr) {
                var clazz = attr.module;
                var module = ui.moduleMap[clazz];
                if(!module){
                    console.error(clazz +" no has the module");
                    return;
                }
                var moduleObj = new module();
                var fieldMap = moduleObj.fieldMap;
                var html = "<div";
                html +=" class=\""+clazz+"\"";
                for(var field in fieldMap){
                    html +=" "+field+"=\"{{"+attr.data+"."+field+"}}\"";
                }
                html +="></div>";
                var template = angular.element(html);
                var linkFn = $compile(template);
                var element = linkFn($scope);
                parent.append(element);
                if(!$scope.elMap){
                    $scope.elMap = {};
                }
                if(!$scope.uiMap){
                    $scope.uiMap = {};
                }
                $scope.elMap[attr.data] = element[0];
                $scope.$watch(attr.data, function (newValue, oldValue,$scope) {
                    var that = this;
                    if(!that.hasParse){
                        var uiEl = $scope.elMap[that.exp];
                        ui.parse(uiEl);
                        uiObj = ui.getBySelect(uiEl);
                        this.ui = uiObj;
                        this.hasParse = true;
                        if(!this.ui){
                            return
                        }
                        $scope.uiMap[that.exp] = this.ui;
                        var eventMap = this.ui.eventMap;
                        for(var event in eventMap){
                            var val = newValue["el"+event];
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
                            uiObj.on(event,$scope[val]);
                        }
                    }
                    if(!this.ui){
                        return
                    }
                    var uiObj = this.ui;
                    //处理数据变化
                    var fieldMap = uiObj.fieldMap;
                    for(var field in fieldMap){
                        if(!newValue[field] && !oldValue[field]){
                            continue;
                        }
                        if(newValue[field] == oldValue[field]){
                            continue;
                        }
                        var val = newValue[field];
                        var setFunctionName = "set"+ui.firstToUpperCase(field);
                        if(uiObj[setFunctionName]){
                            eval("uiObj."+setFunctionName+"(val)");
                        }else{
                            uiObj[field] = val;
                        }
                    }
                }, true);
            }
        });
        return app;
    }
})(window)