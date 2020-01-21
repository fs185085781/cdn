(function(){
    "use strict";
    var module = angular.module;
    angular.module = function(name, requires, configFn){
        var app = module(name, requires, configFn);
        app.directive('miniui', function($document,$compile) {
            return function($scope, parent, attr) {
                var clazz = attr.module;
                var options = eval("$scope."+attr.field);
                var div = createMiniDivByOptions(clazz,options);
                if(!div){
                    return;
                }
                var template = angular.element(div);
                var linkFn = $compile(template);
                var element = linkFn($scope);
                parent.append(element);
                var parentEle = $(element).parent()[0];
                $scope.$watch(attr.field, function (newValue, oldValue,$scope) {
                    var that = this;
                    if(!that.hasParse){
                        that.updateValue = function (val) {
                            $scope.$apply(function () {
                                var evalStr = "$scope."+attr.field+".value=val;";
                                eval(evalStr);
                            });
                        };
                        mini.parse(parentEle);
                        oldValue = {};
                        var miniEle = $(parentEle).find(":first-child");
                        if(miniEle.length == 0){
                            throw "EwebUiError:not find the element";
                        }
                        that.miniObj = mini.get($(miniEle)[0]);
                        var eventMap = {};
                        $.each(newValue,function(key,val){
                            if($scope[val] && typeof $scope[val] == "function"){
                                eventMap[key] = $scope[val];
                            }
                        });
                        copatible.bindEvent(parentEle,eventMap,function(e){
                            that.updateValue(e.value);
                        });
                        that.hasParse = true;
                    }
                    copatible.updateComponent(that.miniObj,oldValue,newValue);
                },true);
            }
        });
        return app;
    }
    function createMiniDivByOptions(clazz,options){
        var that = copatible;
        var ctrl = that.ctrlMap[clazz];
        if(!ctrl){
            return null;
        }
        var lowcaseOptions = {};
        $.each(options,function(key,val){
            lowcaseOptions[key.toLowerCase()] = val;
        });
        var div = "<div class='"+clazz+"'";
        $.each(lowcaseOptions,function(key,val){
            if(!ctrl[key]){
                return true;
            }
            var field = ctrl[key];
            if(field.type == "function"){
                return true;
            }
            if(field.type == "object"){
                return true;
            }
            div += " "+field.real+"='"+that.parseData(val,field.type)+"'";
        });
        div += "></div>";
        return div;
    }
})()