'use strict';
HTMLCollection.prototype.sort = function (callback) {
    //this.slice(callback);
    var items = Array.prototype.slice.call(this);
// Now we can sort it.  Sort alphabetically
    items.sort(callback);
    for (var i = 0, len = items.length; i < len; i++) {
        // store the parent node so we can reatach the item
        var parent = items[i].parentNode;
        // detach it from wherever it is in the DOM
        var detatchedItem = parent.removeChild(items[i]);
        // reatach it.  This works because we are itterating
        // over the items in the same order as they were re-
        // turned from being sorted.
        parent.appendChild(detatchedItem);
    }
}
HTMLCollection.prototype.forEach = function (callback) {
    //this.slice(callback);
    var items = Array.prototype.slice.call(this);
// Now we can sort it.  Sort alphabetically
    items.forEach(callback);
    for (var i = 0, len = items.length; i < len; i++) {
        // store the parent node so we can reatach the item
        var parent = items[i].parentNode;
        // detach it from wherever it is in the DOM
        var detatchedItem = parent.removeChild(items[i]);
        // reatach it.  This works because we are itterating
        // over the items in the same order as they were re-
        // turned from being sorted.
        parent.appendChild(detatchedItem);
    }
}
Element.prototype.remove = function() {
    if(this.parentElement)
        this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}
function isFloat(val) {
    var floatRegex = /^-?\d+(?:[.,]\d*?)?$/;
    if (!floatRegex.test(val))
        return false;

    val = parseFloat(val);
    if (isNaN(val))
        return false;
    return true;
}

function isInt(val) {
    var intRegex = /^-?\d+$/;
    if (!intRegex.test(val))
        return false;

    var intVal = parseInt(val, 10);
    return parseFloat(val) == intVal && !isNaN(intVal);
}
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
                    if ($event) {
                        $event.stopPropagation();
                    }
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
                $scope.config.toggleSelection = $scope.select;
            },
            templateUrl: 'views/tree.html'
        }
    })
    .directive("integer", function ($timeout) {
        return {
            link: function (scope, elem) {
                $timeout(function(){
                    if(elem[0].innerHTML != ""){
                        elem[0].innerHTML = parseInt(elem[0].innerHTML);
                    }

                })
            }
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
    .directive("autogrowing", function ($timeout,$compile) {
        return {
            scope: {
                config: '='
            },
            link: function (scope, elem, attrs, controller) {
                if (scope.config.groupBy) {
                    console.log(elem);

                    var arr = Array.prototype.slice.call(elem[0].rows);
                    $timeout(function () {
                        var dataElementIndexes = [];
                        scope.config.groupBy.forEach(function (group, index) {
                            scope.data.dataElements.forEach(function (dataElement, cindex) {
                                if (scope.config.groupBy[index] == dataElement.id) {
                                    dataElementIndexes.push(cindex);
                                }
                            });
                        });
                        function dynamicSort(property) {
                            return function (obj1, obj2) {

                                return obj1.children[property].innerHTML > obj2.children[property].innerHTML ? 1
                                    : obj1.children[property].innerHTML < obj2.children[property].innerHTML ? -1 : 0;
                            }
                        }

                        function dynamicSortMultiple(indexes) {
                            //save the arguments object as it will be overwritten
                            //note that arguments object is an array-like object
                            //consisting of the names of the properties to sort by
                            return function (obj1, obj2) {
                                var i = 0, result = 0;
                                //try getting a different result from 0 (equal)
                                //as long as we have extra properties to compare
                                while (result === 0 && i < indexes.length) {
                                    result = dynamicSort(indexes[i])(obj1, obj2);
                                    i++;
                                }
                                return result;
                            }
                        }

                        elem[0].children.sort(dynamicSortMultiple(dataElementIndexes));
                        var elementsToDelete = [];
                        //Merge number values depending on group
                        dataElementIndexes.forEach(function (group, index) {
                            for(var i1 = 0; i1 < elem[0].children.length; i1++){
                                var checkingIndex = i1;
                                var child = elem[0].children[i1];
                                if (elem[0].children[checkingIndex + 1])
                                {
                                    if (child.children[group].innerHTML == elem[0].children[checkingIndex + 1].children[group].innerHTML) {
                                        var isInTheSameRow = true;
                                        var loopIndex = checkingIndex + 1;
                                        while(isInTheSameRow){
                                            dataElementIndexes.forEach(function (dataElementIndex, index3) {
                                                if (index3 <= index && child.children[index3].innerHTML != elem[0].children[loopIndex].children[index3].innerHTML) {
                                                    isInTheSameRow = false;
                                                }
                                            });
                                            if (isInTheSameRow) {

                                                for(var i = group + 1; i >= 0; i++)
                                                {
                                                    if(dataElementIndexes.indexOf(i) > -1 || !child.children[i]){
                                                        break;
                                                    }

                                                    if(isInt(child.children[i].innerHTML)){
                                                        child.children[i].innerHTML = (parseInt(child.children[i].innerHTML) + parseInt(elem[0].children[loopIndex].children[i].innerHTML)).toFixed(1);
                                                        //elem[0].children[checkingIndex + 1].children[i].innerHTML = "+";
                                                    }else if(isFloat(child.children[i].innerHTML)){
                                                        child.children[i].innerHTML = (parseFloat(child.children[i].innerHTML)  + parseFloat(elem[0].children[loopIndex].children[i].innerHTML)).toFixed(1) ;
                                                        elementsToDelete.push(elem[0].children[loopIndex].children[i]);
                                                        if(child.children[i].toRowSpan){
                                                            child.children[i].toRowSpan++;
                                                        }else{
                                                            child.children[i].toRowSpan = 2;
                                                        }
                                                    }
                                                }
                                                i1 = loopIndex;
                                                loopIndex++;
                                            }
                                        }
                                    }
                                }
                            }
                        });

                        var elementsWithRowSpan = {};
                        console.log(dataElementIndexes);
                        //Look for cells to row span
                        dataElementIndexes.forEach(function (group, index) {
                            for(var i1 = 0; i1 < elem[0].children.length; i1++){
                                var checkingIndex = i1;
                                var child = elem[0].children[i1];
                                if (elem[0].children[checkingIndex + 1])
                                {
                                    if (child.children[group].innerHTML == elem[0].children[checkingIndex + 1].children[group].innerHTML) {
                                        var isInTheSameRow = true;
                                        var loopIndex = checkingIndex + 1;
                                        while(isInTheSameRow){
                                            //Check whether the cell is valid for grouping
                                            dataElementIndexes.forEach(function (dataElementIndex, index3) {
                                                if (index3 <= index && child.children[index3].innerHTML != elem[0].children[loopIndex].children[index3].innerHTML) {
                                                    isInTheSameRow = false;
                                                }
                                            });
                                            if (isInTheSameRow) {
                                                //Set the rows to span
                                                if(child.children[group].toRowSpan){
                                                    child.children[group].toRowSpan++;
                                                }else{
                                                    child.children[group].toRowSpan = 2;
                                                }
                                                //Add for deletion later
                                                elementsToDelete.push(elem[0].children[loopIndex].children[group]);
                                                i1 = loopIndex;
                                                loopIndex++;
                                            }
                                        }
                                    }
                                }
                            }
                        });
                        //Set row span to the required cells.
                        elem[0].children.forEach(function (child,rowIndex) {
                            child.children.forEach(function (child2,colIndex) {
                                if(child2.toRowSpan){
                                    child2.rowSpan = child2.toRowSpan;
                                }
                            });
                        });
                        //Delete unrequired cells
                        elementsToDelete.forEach(function(element){
                            element.remove();
                        })

                    });

                }
            },
            replace: true,
            controller: function ($scope) {
                $scope.data = {
                    dataElements: [],
                    events: []
                };

                $scope.config.dataElements.forEach(function (dataElementId) {
                    if($scope.config.dataElementsDetails){
                        $scope.config.dataElementsDetails.forEach(function (dataElement) {
                            if (dataElement.id == dataElementId) {
                                $scope.data.dataElements.push(dataElement);
                            }
                        });
                    }else{
                        console.log("Else:",$scope.config);
                    }

                });
                if ($scope.config.groupBy) {//If grouping is required
                    //$scope.data.groupedEvents = [];
                    console.log("Config:", $scope.config);
                    $scope.foundDataValues = {};
                    $scope.config.groupBy.forEach(function (group, index) {
                        if (index == 0) {
                            $scope.config.data.forEach(function (eventData) {
                                $scope.data.events.push(eventData);
                            })
                        }

                    });
                    /*$scope.config.data.forEach(function(eventData){
                     $scope.data.events.push(eventData);
                     })*/

                } else {
                    $scope.data.events = [];
                    $scope.config.data.forEach(function (eventData) {
                        $scope.data.events.push(eventData);
                    })
                }
                //Evaluate indicators if there calculations that need to be made
                if ($scope.config.indicators) {
                    $scope.config.indicators.forEach(function (indicator, index) {

                        $scope.data.dataElements.push({name: "Inidicator" + index});
                        $scope.data.events.forEach(function (event) {
                            var eventIndicator = "(" + indicator.numerator + ")/(" + indicator.denominator + ")";
                            //Get indcator dataelements
                            $scope.data.dataElements.forEach(function (dataElement) {
                                if (eventIndicator.indexOf(dataElement.id) > -1) {
                                    //Replace formula with data value
                                    eventIndicator = eventIndicator.replace("#{" + dataElement.id + "}", event[dataElement.name]);
                                }
                            });
                            //Evaluate Indicator
                            event["Inidicator" + index] = eval('(' + eventIndicator + ')');
                        })
                    });

                }
            },
            templateUrl: 'views/autogrowing.html'
        }
    })