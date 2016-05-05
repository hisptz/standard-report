'use strict';

/* Directives */
function orgUnitFunction(child) {
    return child.name;
}
var appDirectives = angular.module('appDirectives', [])
    .directive("cTree", function () {
        return {
            scope: {
                treeModal: '=',
                config: '=',
                ngModel: '='
            },
            controller: function ($scope) {
                $scope.children = "children";
                $scope.expand = function (data) {
                    if (data.expanded) {
                        data.expanded = false;
                    } else {
                        data.expanded = true;
                    }
                }
                $scope.updateSingleSelection = function (data) {
                    if ($scope.ngModel == data) {
                        $scope.ngModel.selected = !$scope.ngModel.selected;
                    } else {
                        if ($scope.ngModel) {
                            $scope.ngModel.selected = false;
                        }
                        $scope.ngModel = data;
                        data.selected = true;
                    }
                }
                $scope.select = function (data, $event) {
                    $event.stopPropagation();
                    if ($scope.config.numberOfSelection != undefined) {
                        if ($scope.config.numberOfSelection == 1) {
                            $scope.updateSingleSelection(data);
                        } else {
                            if ($scope.ngModel.length <= $scope.config.numberOfSelection || $scope.config.numberOfSelection == 0) {

                                if (data.selected) {
                                    var idx = $scope.ngModel.indexOf(data);
                                    data.selected = false;
                                    if (idx != -1) $scope.ngModel.splice(idx, 1);
                                    //$scope.ngModel = {};
                                } else {
                                    $scope.ngModel.push(data);
                                }
                            } else {
                                return;
                            }
                        }
                    } else {
                        $scope.updateSingleSelection(data);
                    }

                }
            },
            templateUrl: 'views/tree.html'
        }
    })
    .directive("childrenOrganisationUnits", function () {
        return {
            scope: {
                config: '='
            },
            controller: function ($scope) {

            },
            templateUrl: 'views/tree.html'
        }
    })
    .directive("autogrowing", function () {
        return {
            scope: {
                config: '='
            },
            replace: true,
            controller: function ($scope) {
                $scope.data = {
                    dataElements:[]
                }
                console.log($scope.config);
                $scope.config.dataElements.forEach(function(dataElementId){
                    $scope.config.dataElementsDetails.forEach(function(dataElement){
                        if(dataElement.id == dataElementId){
                            dataElement.event = {};

                            $scope.config.data.forEach(function(eventData){
                                if(eventData[dataElement.name]){
                                    dataElement.event = eventData;
                                    $scope.data.dataElements.push(dataElement);
                                }
                            })
                        }
                    });
                });
            },
            templateUrl: 'views/autogrowing.html'
        }
    })