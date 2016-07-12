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
Element.prototype.remove = function () {
    if (this.parentElement)
        this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function () {
    for (var i = this.length - 1; i >= 0; i--) {
        if (this[i] && this[i].parentElement) {
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
                $scope.expand = function (data, bool) {
                    if (bool != undefined) {
                        data.expanded = bool;
                        return;
                    }
                    if (data.expanded) {
                        data.expanded = false;
                    } else {
                        data.expanded = true;
                    }
                }
                $scope.expandParent = function (node, orgUnit) {
                    if (node.children)
                        node.children.some(function (childLevel2) {
                            if (childLevel2.selected && childLevel2.id == orgUnit.id) {
                                $scope.expand(node, true);
                                return true;
                            }
                            if (childLevel2.children) {
                                childLevel2.children.some(function (childLevel3) {
                                    if (childLevel3.selected && childLevel3.id == orgUnit.id) {
                                        $scope.expand(node, true);
                                        $scope.expand(childLevel2, true);
                                        return true;
                                    }
                                    if (childLevel3.children) {
                                        childLevel3.children.some(function (childLevel4) {
                                            if (childLevel4.selected && childLevel4.id == orgUnit.id) {
                                                $scope.expand(node, true);
                                                $scope.expand(childLevel2, true);
                                                $scope.expand(childLevel3, true);
                                                return true;
                                            }
                                        })
                                    }
                                })
                            }
                        })
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
                    $scope.treeModal.forEach(function (node) {
                        $scope.expandParent(node, data);
                    })

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
                $timeout(function () {
                    if (elem[0].innerHTML != "") {
                        elem[0].innerHTML = parseInt(elem[0].innerHTML);
                    }

                })
            }
        }
    })
    .directive("criteria", function () {
        return {
            scope: {},
            restrict: 'E',
            controller: "StandardReportController",
            templateUrl: 'views/dataCriteria.html'
        }
    })
    .directive("listByWard", function () {
        return {
            scope: {
                listByWard: '=',
                orgUnit: '='
            },
            replace: true,
            controller: function ($scope) {
                $scope.data = [];
                $scope.listByWard.forEach(function (value) {
                    //value[]
                    $scope.orgUnit.children.forEach(function (orgUnit) {
                        if (orgUnit.id == value.orgUnit) {
                            $scope.data.push({name: orgUnit.name, value: value.value});
                        }
                    })
                })
            },
            templateUrl: 'views/listByWard.html'
        }
    })
    .directive("debug", function () {
        return {
            scope: {
                config: "=",
                aDebug: "=",
                dgId: "@",
                type: "@",
                dgOrgUnit: "@",
                event: "=",
                special: "@",
                report: "=",
                autoData: "=",
                innerHtml: "@"
            },
            replace: true,
            controller: function ($scope, $modal, DHIS2URL, $http, $routeParams) {
                $scope.show = function () {
                    var modalInstance = $modal.open({
                        animation: true,
                        size: 'lg',
                        templateUrl: 'myModalContent.html',
                        controller: function ($scope, parentScope, $modalInstance, DebugService, ReportService, $q) {

                            $scope.param = $routeParams;
                            $scope.data = {
                                data: []
                            };
                            $scope.getDateName = function(){
                                return ReportService.getPeriodName($routeParams.period);
                            }
                            $scope.objectType = parentScope.type;
                            $scope.estimation = "Not Applicable";
                            $scope.id = parentScope.dgId;
                            $scope.parentScope = parentScope;
                            var object = parentScope.dgId;
                            if (object.indexOf(".") > -1) {
                                object = object.substr(0, object.indexOf("."));
                            }
                            $scope.getFormulaDescription = function (formular) {
                                var value = formular;
                                if (formular.match(/#\{.+?\}/g) != null)
                                    formular.match(/#\{.+?\}/g).forEach(function (dx) {
                                        value = value.replace(dx, "(" + $scope.getDXName(dx.replace("#{", "").replace("}", "")) + ")");
                                    });
                                return value;
                            }
                            $scope.getDXName = function (dx) {
                                var name = "";
                                $scope.dataElements.forEach(function (dataElement) {
                                    if (dx.indexOf(dataElement.id) > -1) {
                                        name += dataElement.name;
                                        dataElement.categoryCombo.categoryOptionCombos.forEach(function (combo) {
                                            if (dx.indexOf(combo.id) > -1) {
                                                name += " " + combo.name;
                                            }
                                        })
                                    }
                                })
                                return name;
                            }
                            $scope.getDXId = function (dx) {
                                var id = "";
                                $scope.dataElements.forEach(function (dataElement) {
                                    if (dx.indexOf(dataElement.id) > -1) {
                                        id += dataElement.id;
                                        dataElement.categoryCombo.categoryOptionCombos.forEach(function (combo) {
                                            if (dx.indexOf(combo.id) > -1) {
                                                id += "." + combo.name;
                                            }
                                        })
                                    }
                                })
                                return id;
                            }
                            $scope.dataElements = [];
                            var periods = ReportService.getPeriodDate($routeParams.period);
                            var promises = [];
                            $scope.loading = true;
                            var counter = 0;
                            $scope.getDataValueData = function (url, objectId, orgUnit, dataSet) {
                                promises.push($http.get(url).then(function (results) {
                                    if (!orgUnit.data[objectId]) {
                                        orgUnit.data[objectId] = {};
                                    }
                                    var categoryOptionIndex = 1;
                                    var dataIndex = 3;
                                    var periodIndex = 2;
                                    results.data.headers.forEach(function (header, index) {
                                        if (header.column == "Data Dimension") {
                                            categoryOptionIndex = index;
                                        } else if (header.column == "Value") {
                                            dataIndex = index;
                                        } else if (header.column == "Period") {
                                            periodIndex = index;
                                        }
                                    })
                                    if (!orgUnit.data[objectId][dataSet.id]) {
                                        orgUnit.data[objectId][dataSet.id] = {}
                                    }
                                    results.data.rows.forEach(function (row) {
                                        dataSet.categoryCombo.categories[0].categoryCombos.forEach(function (categoryCombo) {
                                            categoryCombo.categoryOptionCombos.forEach(function (categoryOptionCombo, index) {

                                                if (categoryOptionCombo.categoryOptions[0].id == row[categoryOptionIndex]) {
                                                    if ($scope.parentScope.special) {
                                                        if (orgUnit.data[objectId][dataSet.id][categoryOptionCombo.name]) {
                                                            orgUnit.data[objectId][dataSet.id][categoryOptionCombo.name].push({
                                                                period: row[periodIndex],
                                                                value: row[dataIndex]
                                                            });
                                                        } else {
                                                            orgUnit.data[objectId][dataSet.id][categoryOptionCombo.name] = [{
                                                                period: row[periodIndex],
                                                                value: row[dataIndex]
                                                            }];
                                                        }
                                                    } else {
                                                        orgUnit.data[objectId][dataSet.id][categoryOptionCombo.name] = row[dataIndex];
                                                    }
                                                }else{
                                                    orgUnit.data[objectId][dataSet.id]["default"] = row[dataIndex];
                                                }

                                            })
                                        })
                                    })

                                }, function () {

                                }));
                                promises.push($http.get(DHIS2URL + "api/completeDataSetRegistrations.json?dataSet=" + dataSet.id + "&orgUnit=" + orgUnit.id + "&startDate=" + periodDate.startDate + "&endDate=" + periodDate.endDate).then(function (results) {
                                    orgUnit[dataSet.id] = {};
                                    if (results.data.completeDataSetRegistrations) {
                                        orgUnit[dataSet.id].completeDataSetRegistrations = results.data.completeDataSetRegistrations;
                                    } else {
                                        orgUnit[dataSet.id].completeDataSetRegistrations = [];
                                    }
                                }))
                            };
                            $scope.getPeriod = function () {
                                var period = $routeParams.period;
                                if ($scope.parentScope.special) {
                                    if ($scope.parentScope.special == "cumulativeToDate") {
                                        var year = parseInt($routeParams.period.substr(0, 4));
                                        var quarter = parseInt($routeParams.period.substr(5, 6));
                                        while (quarter != 3) {
                                            quarter--;
                                            if (quarter == 0) {
                                                quarter = 4;
                                                year--;
                                            }
                                            period += ";" + year + "Q" + quarter;
                                        }
                                    } else if ($scope.parentScope.special == "lastMonthOfQuarter") {
                                        var year = parseInt($routeParams.period.substr(0, 4));
                                        var quarter = parseInt($routeParams.period.substr(5, 6));
                                        if (quarter == 1) {
                                            period = year + "03"
                                        } else if (quarter == 2) {
                                            period = year + "06"
                                        } else if (quarter == 3) {
                                            period = year + "09"
                                        } else if (quarter == 4) {
                                            period = year + "12"
                                        }
                                    } else if ($scope.parentScope.special == "fourthQuarter") {
                                        var year = parseInt($routeParams.period.substr(0, 4));
                                        var quarter = parseInt($routeParams.period.substr(5, 6));
                                        if (quarter == 1 || quarter == 2) {
                                            period = year + "Q2"
                                        } else if (quarter == 3 || quarter == 4) {
                                            period = (year + 1) + "Q2"
                                        }
                                    }
                                }
                                return period;
                            }
                            var calculatedPeriod = $scope.getPeriod();
                            var periodDate = ReportService.getPeriodDate($routeParams.period);
                            $scope.fetchOrgUnitData = function (objectId, orgUnit, type, dataSet) {
                                if (type == "indicator") {
                                    $scope.matcher.forEach(function (id) {
                                        $scope.fetchOrgUnitData(id, orgUnit, "dataElement", dataSet);
                                    });
                                } else {

                                    if (parentScope.aDebug) {

                                    } else {
                                        if ($scope.orgUnit.level == orgUnit.level || ($scope.organisationUnitLevels + $scope.orgUnit.level == orgUnit.level ) || $scope.dataSetOrganisationUnit.level == orgUnit.level) {
                                            var objectRequest = "";
                                            if (objectId.indexOf(".") > -1) {
                                                objectRequest = "de=" + objectId.substr(0, objectId.indexOf(".")) + "&co=" + objectId.substr(objectId.indexOf(".") + 1);
                                            } else {
                                                objectRequest = "de=" + objectId;
                                            }
                                            var url = DHIS2URL + "api/analytics.json?dimension=dx:" + objectId + "&dimension=pe:" + calculatedPeriod + "&filter=ou:" + orgUnit.id + "&displayProperty=NAME";
                                            dataSet.categoryCombo.categories.forEach(function (category) {
                                                if(category.name == "default"){
                                                    category.categoryCombos.forEach(function (categoryCombo) {
                                                        url += "&dimension=" + category.id + ":";
                                                        categoryCombo.categoryOptionCombos.forEach(function (categoryOptionCombo, index) {
                                                            if (index != 0) {
                                                                url += ";"
                                                            }
                                                            url += categoryOptionCombo.categoryOptions[0].id;

                                                        })
                                                    })
                                                }
                                            })
                                            $scope.getDataValueData(url, objectId, orgUnit, dataSet);
                                        }
                                    }
                                }
                                if (orgUnit.children) {
                                    orgUnit.children.forEach(function (child) {
                                        child.data = {};
                                        $scope.fetchOrgUnitData(objectId, child, type, dataSet);
                                    })
                                }
                            };
                            $http.get(DHIS2URL + "api/categories.json?fields=:all,categoryOptions[:all]&filter=name:eq:Data Dimension").then(function (result) {
                                $scope.category = result.data.categories[0];
                                var url = DHIS2URL + "api/" + parentScope.type + "s/" + object + ".json?fields=:all,categoryCombo[categoryOptionCombos[id,name]],dataSets[categoryCombo[categories[id,categoryCombos[id,name,categoryOptionCombos[id,name,categoryOptions]]]],organisationUnits[id,path,level],id,name,attributeValues[:all,attribute[:all],periodType,dataEntryForm],attributeValues[:all,attribute[:all]]";
                                $http.get(url).then(function (results) {

                                    $scope.data.object = results.data;

                                    $scope.loaded = true;
                                    $scope.data.object.attributeValues.forEach(function (attributeValue) {
                                        if (attributeValue.attribute.name == "Estimation") {
                                            $scope.estimation = attributeValue.value;
                                        }
                                    });
                                    console.log($scope.data.object.dataSets);
                                    if ($scope.parentScope.special) {
                                        if ($scope.parentScope.special == "cumulativeToDate") {
                                            $scope.data.object.aggregationType = "CUMULATIVE TO DATE";
                                        } else if ($scope.parentScope.special == "lastMonthOfQuarter") {
                                            $scope.data.object.aggregationType = "LAST MONTH OF QUARTER";
                                        } else if ($scope.parentScope.special == "fourthQuarter") {
                                            $scope.data.object.aggregationType = "FOURTH QUARTER";
                                        }
                                    }
                                    var topLevel = 0, lowLevel = 0;
                                    $scope.data.object.dataSets.forEach(function (dataSet) {
                                        dataSet.organisationUnits.forEach(function (organisationUnit) {
                                            if (organisationUnit.path.indexOf($routeParams.orgUnit) > -1) {
                                                if (organisationUnit.path.endsWith($routeParams.orgUnit)) {
                                                    topLevel = organisationUnit.level;
                                                } else {
                                                    lowLevel = organisationUnit.level;
                                                }
                                                $scope.dataSetId = dataSet.id;
                                                $scope.dataSetOrganisationUnit = organisationUnit;
                                            }
                                        })
                                    })
                                    if (parentScope.type == "indicator") {
                                        $scope.matcher = [];
                                        $scope.data.object.numerator.match(/#\{.+?\}/g).forEach(function (dx) {
                                            $scope.matcher.push(dx.replace("#{", "").replace("}", ""));
                                        });
                                        var dataElementIds = [];
                                        $scope.matcher.forEach(function (dx) {
                                            var dataElementId = dx;
                                            if (dataElementId.indexOf(".") > -1) {
                                                dataElementId = dataElementId.substr(0, dataElementId.indexOf("."));
                                            }
                                            dataElementIds.push(dataElementId);
                                        })
                                        var url = DHIS2URL + "api/dataElements.json?filter=id:in:[" + dataElementIds.join(",") + "]&fields=:all,categoryCombo[categoryOptionCombos[id,name]],dataSets[name,attributeValues,periodType,dataEntryForm],attributeValues[:all,attribute[:all]]";
                                        $http.get(url).then(function (results) {
                                            $scope.dataElements = (results.data.dataElements);

                                        })
                                    }
                                    $scope.data.object.dataSets.forEach(function (dataSet) {
                                        dataSet.isReport = function () {
                                            var returnVal = false;
                                            this.attributeValues.forEach(function (attributeValue) {
                                                if (attributeValue.attribute.name == "Is Report") {
                                                    returnVal = true;
                                                }
                                            })
                                            return returnVal;
                                        }
                                        if (dataSet.name.indexOf("DR01") > -1) {
                                            $scope.TOR = DebugService["DR01"][parentScope.dgId]
                                        }
                                    });
                                    if (parentScope.aDebug) {

                                    } else {
                                        var period = $scope.getPeriod();
                                        promises.push($http.get(DHIS2URL + "api/analytics.json?dimension=dx:" + parentScope.dgId + "&dimension=pe:" + period + "&filter=ou:" + $routeParams.orgUnit).then(function (results) {
                                            results.data.rows.forEach(function (row) {
                                                $scope.data.data.push(row[2]);

                                            });
                                        }));
                                    }
                                    $scope.organisationUnitLevels = lowLevel - topLevel;
                                    var childrenUrl = ",{}";
                                    for (var i = 0; i < lowLevel - topLevel; i++) {
                                        childrenUrl = childrenUrl.replace("{}", "children[id,level,name,{}]")
                                    }
                                    childrenUrl = childrenUrl.replace(",{}", "")
                                    function getEstimation(dataSet) {
                                        $http.get(DHIS2URL + "api/apps/archive/estimation/" + dataSet.id + "_" + $routeParams.orgUnit + "_" + $routeParams.period +".json").then(function(results){
                                            console.log(results);
                                            dataSet.estimation = results.data;
                                            console.log(dataSet.estimation)
                                        });
                                    }
                                    $http.get(DHIS2URL + "api/organisationUnits/" + $routeParams.orgUnit + ".json?fields=:all" + childrenUrl).then(function (results) {
                                        $scope.orgUnit = results.data;
                                        /*$scope.orgUnit.children.forEach(function (child) {
                                         child.data = {};
                                         $scope.fetchOrgUnitData(parentScope.dgId, child, parentScope.type);
                                         })*/
                                        $scope.orgUnit.data = {};
                                        $scope.data.object.dataSets.forEach(function (dataSet) {
                                            if (!dataSet.isReport()) {
                                                $scope.fetchOrgUnitData(parentScope.dgId, $scope.orgUnit, parentScope.type, dataSet);
                                                if($scope.data.object.domainType == "AGGREGATE"){
                                                    getEstimation(dataSet);
                                                }
                                            }
                                        });

                                        $q.all(promises).then(function () {
                                            $scope.loading = false;
                                        })
                                    });
                                });
                            })

                            $scope.ok = function () {
                                $modalInstance.close();
                            };

                            $scope.cancel = function () {
                                $modalInstance.dismiss('cancel');
                            };
                            try {
                                new Clipboard('.btn', {
                                    target: function (trigger) {
                                        return document.getElementById("copyTable");
                                    }
                                });
                            } catch (e) {

                            }
                        },
                        resolve: {
                            parentScope: function () {
                                return $scope;
                            }
                        }
                    });
                }
            },
            templateUrl: 'views/debug.html'
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
    .directive("autogrowing", function ($timeout, $compile) {
        return {
            scope: {
                config: '='
            },
            link: function (scope, elem, attrs, controller) {
                if (scope.config.groupBy) {

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
                                if (obj1.children[property].innerHTML == "") {
                                    return 1;
                                }
                                if (obj2.children[property].innerHTML == "") {
                                    return -1;
                                }
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
                            for (var i1 = 0; i1 < elem[0].children.length; i1++) {
                                var checkingIndex = i1;
                                var child = elem[0].children[i1];
                                if (elem[0].children[checkingIndex + 1]) {
                                    if (child.children[group].innerHTML == elem[0].children[checkingIndex + 1].children[group].innerHTML) {
                                        var isInTheSameRow = true;
                                        var loopIndex = checkingIndex + 1;
                                        while (isInTheSameRow) {
                                            dataElementIndexes.forEach(function (dataElementIndex, index3) {
                                                if (elem[0].children[loopIndex]) {
                                                    if (index3 <= index && child.children[index3].innerHTML != elem[0].children[loopIndex].children[index3].innerHTML) {
                                                        isInTheSameRow = false;
                                                    }
                                                } else {
                                                    isInTheSameRow = false;
                                                }

                                            });
                                            if (isInTheSameRow) {

                                                for (var i = group + 1; i >= 0; i++) {
                                                    if (dataElementIndexes.indexOf(i) > -1 || !child.children[i]) {
                                                        break;
                                                    }

                                                    if (isInt(child.children[i].innerHTML)) {
                                                        child.children[i].innerHTML = (parseInt(child.children[i].innerHTML) + parseInt(elem[0].children[loopIndex].children[i].innerHTML)).toFixed(1);
                                                        //elem[0].children[checkingIndex + 1].children[i].innerHTML = "+";
                                                    } else if (isFloat(child.children[i].innerHTML)) {
                                                        child.children[i].innerHTML = (parseFloat(child.children[i].innerHTML) + parseFloat(elem[0].children[loopIndex].children[i].innerHTML)).toFixed(1);
                                                        elementsToDelete.push(elem[0].children[loopIndex].children[i]);
                                                        if (child.children[i].toRowSpan) {
                                                            child.children[i].toRowSpan++;
                                                        } else {
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
                        //Look for cells to row span
                        dataElementIndexes.forEach(function (group, index) {
                            for (var i1 = 0; i1 < elem[0].children.length; i1++) {
                                var checkingIndex = i1;
                                var child = elem[0].children[i1];
                                if (elem[0].children[checkingIndex + 1]) {
                                    if (child.children[group].innerHTML == elem[0].children[checkingIndex + 1].children[group].innerHTML) {
                                        var isInTheSameRow = true;
                                        var loopIndex = checkingIndex + 1;
                                        while (isInTheSameRow) {
                                            //Check whether the cell is valid for grouping
                                            dataElementIndexes.forEach(function (dataElementIndex, index3) {
                                                if (elem[0].children[loopIndex]) {
                                                    if (index3 <= index && child.children[index3].innerHTML != elem[0].children[loopIndex].children[index3].innerHTML) {
                                                        isInTheSameRow = false;
                                                    }
                                                } else {
                                                    isInTheSameRow = false;
                                                }

                                            });
                                            if (isInTheSameRow) {
                                                //Set the rows to span
                                                if (child.children[group].toRowSpan) {
                                                    child.children[group].toRowSpan++;
                                                } else {
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
                        elem[0].children.forEach(function (child, rowIndex) {
                            child.children.forEach(function (child2, colIndex) {
                                if (child2.toRowSpan) {
                                    child2.rowSpan = child2.toRowSpan;
                                }
                            });
                        });
                        //Delete unrequired cells
                        elementsToDelete.forEach(function (element) {
                            element.remove();
                        })

                    });

                }
            },
            replace: true,
            controller: function ($scope, $routeParams) {
                $scope.data = {
                    dataElements: [],
                    events: []
                };

                $scope.config.dataElements.forEach(function (dataElementId) {
                    if ($scope.config.dataElementsDetails) {
                        $scope.config.dataElementsDetails.forEach(function (dataElement) {
                            if (dataElement.id == dataElementId) {
                                $scope.data.dataElements.push(dataElement);
                            }
                        });
                    }

                });
                if ($scope.config.groupBy) {//If grouping is required
                    //$scope.data.groupedEvents = [];
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
    .directive("autogrowingDebug", function ($timeout, $compile,DebugService) {
        return {
            scope: {
                aDebug: "=",
                config: '='
            },
            link: function (scope, elem, attrs, controller) {
                if (scope.config.groupBy) {

                    var arr = Array.prototype.slice.call(elem[0].rows);
                    DebugService.debugProcess.addCompileElements(elem[0].children,scope);
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
                                if (obj1.children[property].children[0].innerHTML == "") {
                                    return 1;
                                }
                                if (obj2.children[property].children[0].innerHTML == "") {
                                    return -1;
                                }
                                return obj1.children[property].children[0].innerHTML > obj2.children[property].children[0].innerHTML ? 1
                                    : obj1.children[property].children[0].innerHTML < obj2.children[property].children[0].innerHTML ? -1 : 0;
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
                            for (var i1 = 0; i1 < elem[0].children.length; i1++) {
                                var checkingIndex = i1;
                                var child = elem[0].children[i1];
                                if (elem[0].children[checkingIndex + 1]) {
                                    if (child.children[group].children[0].innerHTML == elem[0].children[checkingIndex + 1].children[group].children[0].innerHTML) {
                                        var isInTheSameRow = true;
                                        var loopIndex = checkingIndex + 1;
                                        while (isInTheSameRow) {
                                            dataElementIndexes.forEach(function (dataElementIndex, index3) {
                                                if (elem[0].children[loopIndex]) {
                                                    if (index3 <= index && child.children[index3].children[0].innerHTML != elem[0].children[loopIndex].children[index3].children[0].innerHTML) {
                                                        isInTheSameRow = false;
                                                    }
                                                } else {
                                                    isInTheSameRow = false;
                                                }

                                            });
                                            if (isInTheSameRow) {

                                                for (var i = group + 1; i >= 0; i++) {
                                                    if (dataElementIndexes.indexOf(i) > -1 || !child.children[i]) {
                                                        break;
                                                    }

                                                    if (isInt(child.children[i].children[0].innerHTML)) {
                                                        child.children[i].children[0].innerHTML = (parseInt(child.children[i].children[0].innerHTML) + parseInt(elem[0].children[loopIndex].children[i].children[0].innerHTML)).toFixed(1);
                                                        //elem[0].children[checkingIndex + 1].children[i].innerHTML = "+";
                                                    } else if (isFloat(child.children[i].children[0].innerHTML)) {
                                                        child.children[i].children[0].innerHTML = (parseFloat(child.children[i].children[0].innerHTML) + parseFloat(elem[0].children[loopIndex].children[i].children[0].innerHTML)).toFixed(1);
                                                        elementsToDelete.push(elem[0].children[loopIndex].children[i]);
                                                        if (child.children[i].toRowSpan) {
                                                            child.children[i].toRowSpan++;
                                                        } else {
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
                        //Look for cells to row span
                        dataElementIndexes.forEach(function (group, index) {
                            for (var i1 = 0; i1 < elem[0].children.length; i1++) {
                                var checkingIndex = i1;
                                var child = elem[0].children[i1];
                                if (elem[0].children[checkingIndex + 1]) {
                                    if (child.children[group].children[0].innerHTML == elem[0].children[checkingIndex + 1].children[group].children[0].innerHTML) {
                                        var isInTheSameRow = true;
                                        var loopIndex = checkingIndex + 1;
                                        while (isInTheSameRow) {
                                            //Check whether the cell is valid for grouping
                                            dataElementIndexes.forEach(function (dataElementIndex, index3) {
                                                if (elem[0].children[loopIndex]) {
                                                    if (index3 <= index && child.children[index3].children[0].innerHTML != elem[0].children[loopIndex].children[index3].children[0].innerHTML) {
                                                        isInTheSameRow = false;
                                                    }
                                                } else {
                                                    isInTheSameRow = false;
                                                }

                                            });
                                            if (isInTheSameRow) {
                                                //Set the rows to span
                                                if (child.children[group].toRowSpan) {
                                                    child.children[group].toRowSpan++;
                                                } else {
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
                        elem[0].children.forEach(function (child, rowIndex) {
                            child.children.forEach(function (child2, colIndex) {
                                if (child2.toRowSpan) {
                                    child2.rowSpan = child2.toRowSpan;
                                }
                            });
                        });
                        //Delete unrequired cells
                        elementsToDelete.forEach(function (element) {
                            element.remove();
                        })
                    });

                }
                /*var arr = Array.prototype.slice.call(elem[0].rows);
                DebugService.debugProcess.addCompileElements(elem[0].children);
                $timeout(function () {
                    elem[0].children.forEach(function (child, rowIndex) {
                        child.children.forEach(function (child2, colIndex) {
                            child2.id = scope.config.dataElements[colIndex];
                        });
                    });
                    function dynamicSort(property) {
                        return function (obj1, obj2) {
                            if (obj1.children[property].innerHTML == "") {
                                return 1;
                            }
                            if (obj2.children[property].innerHTML == "") {
                                return -1;
                            }
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

                    if (scope.config.groupBy) {

                        var dataElementIndexes = [];
                        scope.config.groupBy.forEach(function (group, index) {
                            scope.data.dataElements.forEach(function (dataElement, cindex) {
                                if (scope.config.groupBy[index] == dataElement.id) {
                                    dataElementIndexes.push(cindex);
                                }
                            });
                        });
                        elem[0].children.sort(dynamicSortMultiple(dataElementIndexes));
                        var elementsToDelete = [];
                        //Merge number values depending on group
                        dataElementIndexes.forEach(function (group, index) {
                            for (var i1 = 0; i1 < elem[0].children.length; i1++) {
                                var checkingIndex = i1;
                                var child = elem[0].children[i1];
                                if (elem[0].children[checkingIndex + 1]) {
                                    if (child.children[group].innerHTML == elem[0].children[checkingIndex + 1].children[group].innerHTML) {
                                        var isInTheSameRow = true;
                                        var loopIndex = checkingIndex + 1;
                                        while (isInTheSameRow) {
                                            dataElementIndexes.forEach(function (dataElementIndex, index3) {
                                                if (elem[0].children[loopIndex]) {
                                                    if (index3 <= index && child.children[index3].innerHTML != elem[0].children[loopIndex].children[index3].innerHTML) {
                                                        isInTheSameRow = false;
                                                    }
                                                } else {
                                                    isInTheSameRow = false;
                                                }

                                            });
                                            if (isInTheSameRow) {

                                                for (var i = group + 1; i >= 0; i++) {
                                                    if (dataElementIndexes.indexOf(i) > -1 || !child.children[i]) {
                                                        break;
                                                    }

                                                    if (isInt(child.children[i].innerHTML)) {
                                                        child.children[i].innerHTML = (parseInt(child.children[i].innerHTML) + parseInt(elem[0].children[loopIndex].children[i].innerHTML)).toFixed(1);
                                                        //elem[0].children[checkingIndex + 1].children[i].innerHTML = "+";
                                                    } else if (isFloat(child.children[i].innerHTML)) {
                                                        child.children[i].innerHTML = (parseFloat(child.children[i].innerHTML) + parseFloat(elem[0].children[loopIndex].children[i].innerHTML)).toFixed(1);
                                                        elementsToDelete.push(elem[0].children[loopIndex].children[i]);
                                                        if (child.children[i].toRowSpan) {
                                                            child.children[i].toRowSpan++;
                                                        } else {
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
                        //Look for cells to row span
                        dataElementIndexes.forEach(function (group, index) {
                            for (var i1 = 0; i1 < elem[0].children.length; i1++) {
                                var checkingIndex = i1;
                                var child = elem[0].children[i1];
                                if (elem[0].children[checkingIndex + 1]) {
                                    if (child.children[group].innerHTML == elem[0].children[checkingIndex + 1].children[group].innerHTML) {
                                        var isInTheSameRow = true;
                                        var loopIndex = checkingIndex + 1;
                                        while (isInTheSameRow) {
                                            //Check whether the cell is valid for grouping
                                            dataElementIndexes.forEach(function (dataElementIndex, index3) {
                                                if (elem[0].children[loopIndex]) {
                                                    if (index3 <= index && child.children[index3].innerHTML != elem[0].children[loopIndex].children[index3].innerHTML) {
                                                        isInTheSameRow = false;
                                                    }
                                                } else {
                                                    isInTheSameRow = false;
                                                }

                                            });
                                            if (isInTheSameRow) {
                                                //Set the rows to span
                                                if (child.children[group].toRowSpan) {
                                                    child.children[group].toRowSpan++;
                                                } else {
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
                        elem[0].children.forEach(function (child, rowIndex) {
                            child.children.forEach(function (child2, colIndex) {
                                if (child2.toRowSpan) {
                                    child2.rowSpan = child2.toRowSpan;
                                }
                            });
                        });
                        //Delete unrequired cells
                        elementsToDelete.forEach(function (element) {
                            element.remove();
                        })
                    }
                    elem[0].children.forEach(function (child, rowIndex) {
                        child.children.forEach(function (child2, colIndex) {
                            child2.id = scope.config.dataElements[colIndex];
                            //child2.innerHTML = child2.innerHTML + "<debug a-debug='aDebug' inner-html='" + child2.innerHTML + "' report='dataSet' auto-data='data' event='event' dg-id='" + child2.id + "' type='dataElement'></debug>";
                            //$compile(child2)(scope);
                        });
                    });
                    $compile(elem[0].children)(scope);
                    $timeout(function () {
                        var childsToRemove = [];
                        var existingRows = []
                        elem[0].children.forEach(function (child, rowIndex) {
                            if (existingRows.indexOf(child.getAttribute('event')) > -1) {
                                childsToRemove.push(child);
                            } else {
                                existingRows.push(child.getAttribute('event'));
                            }
                            var dataElements = [];
                            child.children.forEach(function (child2, colIndex) {
                                //child2.id = scope.config.dataElements[colIndex];
                                if (dataElements.indexOf(child2.id) > -1) {
                                    childsToRemove.push(child2);
                                } else {
                                    dataElements.push(child2.id);
                                }

                                //child2.removeAttribute("ng-repeat");
                                //$compile(child2)(scope);
                            });
                        });
                        childsToRemove.forEach(function (element) {
                            element.remove();
                        })
                    })
                });*/

            },
            replace: true,
            controller: function ($scope, $routeParams) {
                $scope.data = {
                    dataElements: [],
                    events: []
                };
                $scope.config.dataElements.forEach(function (dataElementId) {
                    if ($scope.config.dataElementsDetails) {
                        $scope.config.dataElementsDetails.forEach(function (dataElement) {
                            if (dataElement.id == dataElementId) {
                                $scope.data.dataElements.push(dataElement);
                            }
                        });
                    }

                });
                if ($scope.config.groupBy) {//If grouping is required
                    //$scope.data.groupedEvents = [];
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
            templateUrl: 'views/autogrowingDebug.html'
        }
    })