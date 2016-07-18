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
                orgUnit: '=',
                count:'='
            },
            replace: true,
            controller: function ($scope,$routeParams) {
                $scope.params = $routeParams;
                if($scope.count){
                    $scope.data = {};
                }else{
                    $scope.data = [];
                }
                $scope.listByWard.forEach(function (value) {
                    //value[]
                    $scope.orgUnit.children.forEach(function (orgUnit) {
                        if (orgUnit.id == value.orgUnit) {
                            if($scope.count){
                                if($scope.data[value.value]){
                                    $scope.data[value.value]++;
                                }else{
                                    $scope.data[value.value] = 1;
                                }
                            }else{
                                $scope.data.push({name: orgUnit.name, value: value.value});
                            }

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
                listWard:"=",
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
                            $scope.estimateDataElement = {};
                            $scope.getDataElementName = function(dataElement){

                            }
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
                                                if(category.name != "default"){
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
                                var url = DHIS2URL + "api/" + parentScope.type + "s/" + object + ".json?fields=:all,attributeValues[:all,attribute[id,name]],categoryCombo[categoryOptionCombos[id,name]],dataSets[categoryCombo[categories[id,categoryCombos[id,name,categoryOptionCombos[id,name,categoryOptions]]]],organisationUnits[id,path,level],id,name,attributeValues[:all,attribute[:all],periodType,dataEntryForm]";
                                $http.get(url).then(function (results) {
                                    $scope.data.object = results.data;

                                    $scope.loaded = true;
                                    $scope.data.object.attributeValues.forEach(function (attributeValue) {
                                        if (attributeValue.attribute.name == "Estimation") {
                                            $scope.estimation = attributeValue.value;
                                        }
                                    });
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

                                        if($scope.matcher){
                                            dataSet.matcher = [];
                                            var combos = dataSet.categoryCombo.categories[0].categoryCombos[0].categoryOptionCombos;
                                            combos.sort(function(a,b){
                                                if (a.name < b.name) {
                                                    return -1;
                                                }
                                                if (a.name > b.name) {
                                                    return 1;
                                                }
                                            });
                                            console.log("Combos:",combos);
                                            $scope.matcher.forEach(function(mat){
                                                combos.forEach(function(combo){
                                                    dataSet.matcher.push(combo);
                                                })
                                            })
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
                                            dataSet.estimation = {"qRvbTVEmI6C_WAl6t24Jpzt": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "WAl6t24Jpzt", "target": "2.0", "target_dataelement": "dGATcuqhXtk.WAl6t24Jpzt", "completed": true, "de": "qRvbTVEmI6C", "target_period": "2014July", "value": "2", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "WAl6t24Jpzt", "target": "4.0", "target_period": "2014July", "completed": false, "de": "qRvbTVEmI6C", "old_value": "4", "target_dataelement": "dGATcuqhXtk.WAl6t24Jpzt", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "WAl6t24Jpzt", "target": "4.0", "target_dataelement": "dGATcuqhXtk.WAl6t24Jpzt", "completed": true, "de": "qRvbTVEmI6C", "target_period": "2014July", "value": "2", "ou": "iH7LSuDKBxU"}}}, "YSRj2rXWC0f_fXZ1QJJJ9wp": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "fXZ1QJJJ9wp", "target": "2.0", "target_dataelement": "I9MjFl6Y5hl.fXZ1QJJJ9wp", "completed": true, "de": "YSRj2rXWC0f", "target_period": "2014July", "value": "4", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "fXZ1QJJJ9wp", "target": "2.0", "target_period": "2014July", "completed": false, "de": "YSRj2rXWC0f", "old_value": "4", "target_dataelement": "I9MjFl6Y5hl.fXZ1QJJJ9wp", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "fXZ1QJJJ9wp", "target": "2.0", "target_dataelement": "I9MjFl6Y5hl.fXZ1QJJJ9wp", "completed": true, "de": "YSRj2rXWC0f", "target_period": "2014July", "value": "4", "ou": "iH7LSuDKBxU"}}}, "xpXXurlwbNM_dUIkQFWg2qm": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "dUIkQFWg2qm", "target": "4.0", "target_dataelement": "BnsXYKt6iu6.dUIkQFWg2qm", "completed": true, "de": "xpXXurlwbNM", "target_period": "2014July", "value": "2", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "dUIkQFWg2qm", "target": "3.0", "target_period": "2014July", "completed": false, "de": "xpXXurlwbNM", "old_value": "4", "target_dataelement": "BnsXYKt6iu6.dUIkQFWg2qm", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "dUIkQFWg2qm", "target": "3.0", "target_dataelement": "BnsXYKt6iu6.dUIkQFWg2qm", "completed": true, "de": "xpXXurlwbNM", "target_period": "2014July", "value": "4", "ou": "iH7LSuDKBxU"}}}, "lcdIDgumilv_ZbmI2XtXHIS": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "ZbmI2XtXHIS", "target": "3.0", "target_dataelement": "A4BPhZhOrzc.ZbmI2XtXHIS", "completed": true, "de": "lcdIDgumilv", "target_period": "2014July", "value": "4", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "ZbmI2XtXHIS", "target": "2.0", "target_period": "2014July", "completed": false, "de": "lcdIDgumilv", "old_value": "4", "target_dataelement": "A4BPhZhOrzc.ZbmI2XtXHIS", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "ZbmI2XtXHIS", "target": "2.0", "target_dataelement": "A4BPhZhOrzc.ZbmI2XtXHIS", "completed": true, "de": "lcdIDgumilv", "target_period": "2014July", "value": "4", "ou": "iH7LSuDKBxU"}}}, "cf9SaENrA27_WpsmWKDTfdX": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "WpsmWKDTfdX", "target": "4.0", "target_dataelement": "KnfVAOcnV26.WpsmWKDTfdX", "completed": true, "de": "cf9SaENrA27", "target_period": "2014July", "value": "3", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "WpsmWKDTfdX", "target": "2.0", "target_period": "2014July", "completed": false, "de": "cf9SaENrA27", "old_value": "4", "target_dataelement": "KnfVAOcnV26.WpsmWKDTfdX", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "WpsmWKDTfdX", "target": "2.0", "target_dataelement": "KnfVAOcnV26.WpsmWKDTfdX", "completed": true, "de": "cf9SaENrA27", "target_period": "2014July", "value": "4", "ou": "iH7LSuDKBxU"}}}, "bJ84f27rqDB_WAl6t24Jpzt": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "WAl6t24Jpzt", "target": "4.0", "target_dataelement": "Ivu48nkpIw2.WAl6t24Jpzt", "completed": true, "de": "bJ84f27rqDB", "target_period": "2014July", "value": "2", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "WAl6t24Jpzt", "target": "2.0", "target_period": "2014July", "completed": false, "de": "bJ84f27rqDB", "old_value": "4", "target_dataelement": "Ivu48nkpIw2.WAl6t24Jpzt", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "WAl6t24Jpzt", "target": "2.0", "target_dataelement": "Ivu48nkpIw2.WAl6t24Jpzt", "completed": true, "de": "bJ84f27rqDB", "target_period": "2014July", "value": "2", "ou": "iH7LSuDKBxU"}}}, "FyJxMp5u7WP_pcsiYqIW4kJ": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"ou": "AsgiIABsA69", "de": "FyJxMp5u7WP", "co": "pcsiYqIW4kJ", "completed": true, "value": "2"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "pcsiYqIW4kJ", "completed": false, "de": "FyJxMp5u7WP", "old_value": "4", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"ou": "iH7LSuDKBxU", "de": "FyJxMp5u7WP", "co": "pcsiYqIW4kJ", "completed": true, "value": "3"}}}, "YSRj2rXWC0f_Bkz2vXNsYke": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "Bkz2vXNsYke", "target": "3.0", "target_dataelement": "I9MjFl6Y5hl.Bkz2vXNsYke", "completed": true, "de": "YSRj2rXWC0f", "target_period": "2014July", "value": "3", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "Bkz2vXNsYke", "target": "3.0", "target_period": "2014July", "completed": false, "de": "YSRj2rXWC0f", "old_value": "4", "target_dataelement": "I9MjFl6Y5hl.Bkz2vXNsYke", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "Bkz2vXNsYke", "target": "3.0", "target_dataelement": "I9MjFl6Y5hl.Bkz2vXNsYke", "completed": true, "de": "YSRj2rXWC0f", "target_period": "2014July", "value": "3", "ou": "iH7LSuDKBxU"}}}, "rNaeaP69Ml0_MvHtsSwbho2": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "MvHtsSwbho2", "target": "2.0", "target_dataelement": "l7yZ1DOmYbU.MvHtsSwbho2", "completed": true, "de": "rNaeaP69Ml0", "target_period": "2014July", "value": "3", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "MvHtsSwbho2", "target": "4.0", "target_period": "2014July", "completed": false, "de": "rNaeaP69Ml0", "old_value": "4", "target_dataelement": "l7yZ1DOmYbU.MvHtsSwbho2", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "MvHtsSwbho2", "target": "4.0", "target_dataelement": "l7yZ1DOmYbU.MvHtsSwbho2", "completed": true, "de": "rNaeaP69Ml0", "target_period": "2014July", "value": "3", "ou": "iH7LSuDKBxU"}}}, "xpXXurlwbNM_VIPqyvWbwDU": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "VIPqyvWbwDU", "target": "3.0", "target_dataelement": "BnsXYKt6iu6.VIPqyvWbwDU", "completed": true, "de": "xpXXurlwbNM", "target_period": "2014July", "value": "2", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "VIPqyvWbwDU", "target": "4.0", "target_period": "2014July", "completed": false, "de": "xpXXurlwbNM", "old_value": "4", "target_dataelement": "BnsXYKt6iu6.VIPqyvWbwDU", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "VIPqyvWbwDU", "target": "4.0", "target_dataelement": "BnsXYKt6iu6.VIPqyvWbwDU", "completed": true, "de": "xpXXurlwbNM", "target_period": "2014July", "value": "3", "ou": "iH7LSuDKBxU"}}}, "QnFeukGopwx_N6TVFtK0jJ5": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "N6TVFtK0jJ5", "target": "4.0", "target_dataelement": "zDMxdyL6JWq.N6TVFtK0jJ5", "completed": true, "de": "QnFeukGopwx", "target_period": "2014July", "value": "3", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "N6TVFtK0jJ5", "target": "4.0", "target_period": "2014July", "completed": false, "de": "QnFeukGopwx", "old_value": "4", "target_dataelement": "zDMxdyL6JWq.N6TVFtK0jJ5", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "N6TVFtK0jJ5", "target": "4.0", "target_dataelement": "zDMxdyL6JWq.N6TVFtK0jJ5", "completed": true, "de": "QnFeukGopwx", "target_period": "2014July", "value": "4", "ou": "iH7LSuDKBxU"}}}, "xpXXurlwbNM_w30fA5rFeRV": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "w30fA5rFeRV", "target": "4.0", "target_dataelement": "BnsXYKt6iu6.w30fA5rFeRV", "completed": true, "de": "xpXXurlwbNM", "target_period": "2014July", "value": "2", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "w30fA5rFeRV", "target": "4.0", "target_period": "2014July", "completed": false, "de": "xpXXurlwbNM", "old_value": "4", "target_dataelement": "BnsXYKt6iu6.w30fA5rFeRV", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "w30fA5rFeRV", "target": "4.0", "target_dataelement": "BnsXYKt6iu6.w30fA5rFeRV", "completed": true, "de": "xpXXurlwbNM", "target_period": "2014July", "value": "2", "ou": "iH7LSuDKBxU"}}}, "qRvbTVEmI6C_HdPaWqoDpdZ": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "HdPaWqoDpdZ", "target": "4.0", "target_dataelement": "dGATcuqhXtk.HdPaWqoDpdZ", "completed": true, "de": "qRvbTVEmI6C", "target_period": "2014July", "value": "3", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "HdPaWqoDpdZ", "target": "3.0", "target_period": "2014July", "completed": false, "de": "qRvbTVEmI6C", "old_value": "4", "target_dataelement": "dGATcuqhXtk.HdPaWqoDpdZ", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "HdPaWqoDpdZ", "target": "3.0", "target_dataelement": "dGATcuqhXtk.HdPaWqoDpdZ", "completed": true, "de": "qRvbTVEmI6C", "target_period": "2014July", "value": "2", "ou": "iH7LSuDKBxU"}}}, "ngDrfoi85Oy_BktmzfgqCjX": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "BktmzfgqCjX", "target": "2.0", "target_dataelement": "tIW07Zp3vnv.BktmzfgqCjX", "completed": true, "de": "ngDrfoi85Oy", "target_period": "2014July", "value": "4", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "BktmzfgqCjX", "target": "3.0", "target_period": "2014July", "completed": false, "de": "ngDrfoi85Oy", "old_value": "4", "target_dataelement": "tIW07Zp3vnv.BktmzfgqCjX", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "BktmzfgqCjX", "target": "3.0", "target_dataelement": "tIW07Zp3vnv.BktmzfgqCjX", "completed": true, "de": "ngDrfoi85Oy", "target_period": "2014July", "value": "2", "ou": "iH7LSuDKBxU"}}}, "mVwNk3foz3v_hRHZBt0hok2": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"ou": "AsgiIABsA69", "de": "mVwNk3foz3v", "co": "hRHZBt0hok2", "completed": true, "value": "2"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "hRHZBt0hok2", "completed": false, "de": "mVwNk3foz3v", "old_value": "4", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"ou": "iH7LSuDKBxU", "de": "mVwNk3foz3v", "co": "hRHZBt0hok2", "completed": true, "value": "2"}}}, "lcdIDgumilv_dqChjQjl0ZH": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "dqChjQjl0ZH", "target": "4.0", "target_dataelement": "A4BPhZhOrzc.dqChjQjl0ZH", "completed": true, "de": "lcdIDgumilv", "target_period": "2014July", "value": "2", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "dqChjQjl0ZH", "target": "2.0", "target_period": "2014July", "completed": false, "de": "lcdIDgumilv", "old_value": "4", "target_dataelement": "A4BPhZhOrzc.dqChjQjl0ZH", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "dqChjQjl0ZH", "target": "2.0", "target_dataelement": "A4BPhZhOrzc.dqChjQjl0ZH", "completed": true, "de": "lcdIDgumilv", "target_period": "2014July", "value": "4", "ou": "iH7LSuDKBxU"}}}, "uWPWKJp8XPG_FE4pu3Sbksc": {"formula": "PriorEstimate", "data": {"AsgiIABsA69": {"ou": "AsgiIABsA69", "de": "uWPWKJp8XPG", "co": "FE4pu3Sbksc", "completed": true, "value": "3"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "FE4pu3Sbksc", "completed": false, "de": "uWPWKJp8XPG", "old_value": "4", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"ou": "iH7LSuDKBxU", "de": "uWPWKJp8XPG", "co": "FE4pu3Sbksc", "completed": true, "value": "3"}}}, "xpXXurlwbNM_i9b5kFnGOkF": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "i9b5kFnGOkF", "target": "3.0", "target_dataelement": "BnsXYKt6iu6.i9b5kFnGOkF", "completed": true, "de": "xpXXurlwbNM", "target_period": "2014July", "value": "3", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "i9b5kFnGOkF", "target": "2.0", "target_period": "2014July", "completed": false, "de": "xpXXurlwbNM", "old_value": "4", "target_dataelement": "BnsXYKt6iu6.i9b5kFnGOkF", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "i9b5kFnGOkF", "target": "2.0", "target_dataelement": "BnsXYKt6iu6.i9b5kFnGOkF", "completed": true, "de": "xpXXurlwbNM", "target_period": "2014July", "value": "3", "ou": "iH7LSuDKBxU"}}}, "gbvUDbZWxUS_bltcOiiZeO5": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "bltcOiiZeO5", "target": "2.0", "target_dataelement": "hCLl9rGfYpb.bltcOiiZeO5", "completed": true, "de": "gbvUDbZWxUS", "target_period": "2014July", "value": "2", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "bltcOiiZeO5", "target": "3.0", "target_period": "2014July", "completed": false, "de": "gbvUDbZWxUS", "old_value": "4", "target_dataelement": "hCLl9rGfYpb.bltcOiiZeO5", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "bltcOiiZeO5", "target": "3.0", "target_dataelement": "hCLl9rGfYpb.bltcOiiZeO5", "completed": true, "de": "gbvUDbZWxUS", "target_period": "2014July", "value": "2", "ou": "iH7LSuDKBxU"}}}, "YSRj2rXWC0f_bSNT1r88kIC": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "bSNT1r88kIC", "target": "4.0", "target_dataelement": "I9MjFl6Y5hl.bSNT1r88kIC", "completed": true, "de": "YSRj2rXWC0f", "target_period": "2014July", "value": "2", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "bSNT1r88kIC", "target": "4.0", "target_period": "2014July", "completed": false, "de": "YSRj2rXWC0f", "old_value": "4", "target_dataelement": "I9MjFl6Y5hl.bSNT1r88kIC", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "bSNT1r88kIC", "target": "4.0", "target_dataelement": "I9MjFl6Y5hl.bSNT1r88kIC", "completed": true, "de": "YSRj2rXWC0f", "target_period": "2014July", "value": "4", "ou": "iH7LSuDKBxU"}}}, "mW1g85YGrA5_PU9spo0qvll": {"formula": "PriorEstimate", "data": {"AsgiIABsA69": {"ou": "AsgiIABsA69", "de": "mW1g85YGrA5", "co": "PU9spo0qvll", "completed": true, "value": "4"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "PU9spo0qvll", "completed": false, "de": "mW1g85YGrA5", "old_value": "4", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"ou": "iH7LSuDKBxU", "de": "mW1g85YGrA5", "co": "PU9spo0qvll", "completed": true, "value": "2"}}}, "xpXXurlwbNM_H9p6YVxG7zJ": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "H9p6YVxG7zJ", "target": "4.0", "target_dataelement": "BnsXYKt6iu6.H9p6YVxG7zJ", "completed": true, "de": "xpXXurlwbNM", "target_period": "2014July", "value": "2", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "H9p6YVxG7zJ", "target": "3.0", "target_period": "2014July", "completed": false, "de": "xpXXurlwbNM", "old_value": "4", "target_dataelement": "BnsXYKt6iu6.H9p6YVxG7zJ", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "H9p6YVxG7zJ", "target": "3.0", "target_dataelement": "BnsXYKt6iu6.H9p6YVxG7zJ", "completed": true, "de": "xpXXurlwbNM", "target_period": "2014July", "value": "2", "ou": "iH7LSuDKBxU"}}}, "mVwNk3foz3v_nxsGR3eo7aj": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"ou": "AsgiIABsA69", "de": "mVwNk3foz3v", "co": "nxsGR3eo7aj", "completed": true, "value": "3"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "nxsGR3eo7aj", "completed": false, "de": "mVwNk3foz3v", "old_value": "4", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"ou": "iH7LSuDKBxU", "de": "mVwNk3foz3v", "co": "nxsGR3eo7aj", "completed": true, "value": "2"}}}, "rBstKKNXmYA_OEoQ7kif63L": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "OEoQ7kif63L", "target": "2.0", "target_dataelement": "ZLsVcUh3yWM.OEoQ7kif63L", "completed": true, "de": "rBstKKNXmYA", "target_period": "2014July", "value": "4", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "OEoQ7kif63L", "target": "3.0", "target_period": "2014July", "completed": false, "de": "rBstKKNXmYA", "old_value": "4", "target_dataelement": "ZLsVcUh3yWM.OEoQ7kif63L", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "OEoQ7kif63L", "target": "3.0", "target_dataelement": "ZLsVcUh3yWM.OEoQ7kif63L", "completed": true, "de": "rBstKKNXmYA", "target_period": "2014July", "value": "4", "ou": "iH7LSuDKBxU"}}}, "gbvUDbZWxUS_AqholFtHhlg": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "AqholFtHhlg", "target": "3.0", "target_dataelement": "hCLl9rGfYpb.AqholFtHhlg", "completed": true, "de": "gbvUDbZWxUS", "target_period": "2014July", "value": "3", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "AqholFtHhlg", "target": "4.0", "target_period": "2014July", "completed": false, "de": "gbvUDbZWxUS", "old_value": "4", "target_dataelement": "hCLl9rGfYpb.AqholFtHhlg", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "AqholFtHhlg", "target": "4.0", "target_dataelement": "hCLl9rGfYpb.AqholFtHhlg", "completed": true, "de": "gbvUDbZWxUS", "target_period": "2014July", "value": "3", "ou": "iH7LSuDKBxU"}}}, "FwpCBGQvYdL_bBKFyBvoo34": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "bBKFyBvoo34", "target": "2.0", "target_dataelement": "xBxqNNV8jLR.bBKFyBvoo34", "completed": true, "de": "FwpCBGQvYdL", "target_period": "2014July", "value": "3", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "bBKFyBvoo34", "target": "4.0", "target_period": "2014July", "completed": false, "de": "FwpCBGQvYdL", "old_value": "4", "target_dataelement": "xBxqNNV8jLR.bBKFyBvoo34", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "bBKFyBvoo34", "target": "4.0", "target_dataelement": "xBxqNNV8jLR.bBKFyBvoo34", "completed": true, "de": "FwpCBGQvYdL", "target_period": "2014July", "value": "2", "ou": "iH7LSuDKBxU"}}}, "nc1E1TyiGhG_MvHtsSwbho2": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "MvHtsSwbho2", "target": "3.0", "target_dataelement": "gAS04LMK9UX.MvHtsSwbho2", "completed": true, "de": "nc1E1TyiGhG", "target_period": "2014July", "value": "2", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "MvHtsSwbho2", "target": "3.0", "target_period": "2014July", "completed": false, "de": "nc1E1TyiGhG", "old_value": "4", "target_dataelement": "gAS04LMK9UX.MvHtsSwbho2", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "MvHtsSwbho2", "target": "3.0", "target_dataelement": "gAS04LMK9UX.MvHtsSwbho2", "completed": true, "de": "nc1E1TyiGhG", "target_period": "2014July", "value": "2", "ou": "iH7LSuDKBxU"}}}, "qRvbTVEmI6C_jC7AWcjBkJ3": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "jC7AWcjBkJ3", "target": "2.0", "target_dataelement": "dGATcuqhXtk.jC7AWcjBkJ3", "completed": true, "de": "qRvbTVEmI6C", "target_period": "2014July", "value": "2", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "jC7AWcjBkJ3", "target": "3.0", "target_period": "2014July", "completed": false, "de": "qRvbTVEmI6C", "old_value": "4", "target_dataelement": "dGATcuqhXtk.jC7AWcjBkJ3", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "jC7AWcjBkJ3", "target": "3.0", "target_dataelement": "dGATcuqhXtk.jC7AWcjBkJ3", "completed": true, "de": "qRvbTVEmI6C", "target_period": "2014July", "value": "3", "ou": "iH7LSuDKBxU"}}}, "QnFeukGopwx_BYTuIQ47dnS": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "BYTuIQ47dnS", "target": "2.0", "target_dataelement": "zDMxdyL6JWq.BYTuIQ47dnS", "completed": true, "de": "QnFeukGopwx", "target_period": "2014July", "value": "4", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "BYTuIQ47dnS", "target": "3.0", "target_period": "2014July", "completed": false, "de": "QnFeukGopwx", "old_value": "4", "target_dataelement": "zDMxdyL6JWq.BYTuIQ47dnS", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "BYTuIQ47dnS", "target": "3.0", "target_dataelement": "zDMxdyL6JWq.BYTuIQ47dnS", "completed": true, "de": "QnFeukGopwx", "target_period": "2014July", "value": "3", "ou": "iH7LSuDKBxU"}}}, "sS5OudDzXC2_pjXHRQQXIhg": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"ou": "AsgiIABsA69", "de": "sS5OudDzXC2", "co": "pjXHRQQXIhg", "completed": true, "value": "2"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "pjXHRQQXIhg", "completed": false, "de": "sS5OudDzXC2", "old_value": "4", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"ou": "iH7LSuDKBxU", "de": "sS5OudDzXC2", "co": "pjXHRQQXIhg", "completed": true, "value": "4"}}}, "rNaeaP69Ml0_e27Rj8LSYQV": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "e27Rj8LSYQV", "target": "2.0", "target_dataelement": "l7yZ1DOmYbU.e27Rj8LSYQV", "completed": true, "de": "rNaeaP69Ml0", "target_period": "2014July", "value": "4", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "e27Rj8LSYQV", "target": "2.0", "target_period": "2014July", "completed": false, "de": "rNaeaP69Ml0", "old_value": "4", "target_dataelement": "l7yZ1DOmYbU.e27Rj8LSYQV", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "e27Rj8LSYQV", "target": "2.0", "target_dataelement": "l7yZ1DOmYbU.e27Rj8LSYQV", "completed": true, "de": "rNaeaP69Ml0", "target_period": "2014July", "value": "3", "ou": "iH7LSuDKBxU"}}}, "bJ84f27rqDB_nMMaTQxdPJG": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "nMMaTQxdPJG", "target": "2.0", "target_dataelement": "Ivu48nkpIw2.nMMaTQxdPJG", "completed": true, "de": "bJ84f27rqDB", "target_period": "2014July", "value": "4", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "nMMaTQxdPJG", "target": "3.0", "target_period": "2014July", "completed": false, "de": "bJ84f27rqDB", "old_value": "4", "target_dataelement": "Ivu48nkpIw2.nMMaTQxdPJG", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "nMMaTQxdPJG", "target": "3.0", "target_dataelement": "Ivu48nkpIw2.nMMaTQxdPJG", "completed": true, "de": "bJ84f27rqDB", "target_period": "2014July", "value": "2", "ou": "iH7LSuDKBxU"}}}, "lcdIDgumilv_XckkuoyUldR": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "XckkuoyUldR", "target": "3.0", "target_dataelement": "A4BPhZhOrzc.XckkuoyUldR", "completed": true, "de": "lcdIDgumilv", "target_period": "2014July", "value": "3", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "XckkuoyUldR", "target": "4.0", "target_period": "2014July", "completed": false, "de": "lcdIDgumilv", "old_value": "4", "target_dataelement": "A4BPhZhOrzc.XckkuoyUldR", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "XckkuoyUldR", "target": "4.0", "target_dataelement": "A4BPhZhOrzc.XckkuoyUldR", "completed": true, "de": "lcdIDgumilv", "target_period": "2014July", "value": "4", "ou": "iH7LSuDKBxU"}}}, "lcdIDgumilv_GtUrKU93piR": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "GtUrKU93piR", "target": "2.0", "target_dataelement": "A4BPhZhOrzc.GtUrKU93piR", "completed": true, "de": "lcdIDgumilv", "target_period": "2014July", "value": "3", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "GtUrKU93piR", "target": "2.0", "target_period": "2014July", "completed": false, "de": "lcdIDgumilv", "old_value": "4", "target_dataelement": "A4BPhZhOrzc.GtUrKU93piR", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "GtUrKU93piR", "target": "2.0", "target_dataelement": "A4BPhZhOrzc.GtUrKU93piR", "completed": true, "de": "lcdIDgumilv", "target_period": "2014July", "value": "2", "ou": "iH7LSuDKBxU"}}}, "s4DGaCo3ZcW_WgIlmdIhlpD": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"ou": "AsgiIABsA69", "de": "s4DGaCo3ZcW", "co": "WgIlmdIhlpD", "completed": true, "value": "1"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "WgIlmdIhlpD", "completed": false, "de": "s4DGaCo3ZcW", "old_value": "4", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"ou": "iH7LSuDKBxU", "de": "s4DGaCo3ZcW", "co": "WgIlmdIhlpD", "completed": true, "value": "1"}}}, "WoUIOUcej6W_PLhI6ueimwn": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "PLhI6ueimwn", "target": "2.0", "target_dataelement": "U7ep9MxtQ1z.PLhI6ueimwn", "completed": true, "de": "WoUIOUcej6W", "target_period": "2014July", "value": "4", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "PLhI6ueimwn", "target": "4.0", "target_period": "2014July", "completed": false, "de": "WoUIOUcej6W", "old_value": "4", "target_dataelement": "U7ep9MxtQ1z.PLhI6ueimwn", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "PLhI6ueimwn", "target": "4.0", "target_dataelement": "U7ep9MxtQ1z.PLhI6ueimwn", "completed": true, "de": "WoUIOUcej6W", "target_period": "2014July", "value": "4", "ou": "iH7LSuDKBxU"}}}, "WoUIOUcej6W_SyDcaTOW0JP": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "SyDcaTOW0JP", "target": "3.0", "target_dataelement": "U7ep9MxtQ1z.SyDcaTOW0JP", "completed": true, "de": "WoUIOUcej6W", "target_period": "2014July", "value": "3", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "SyDcaTOW0JP", "target": "4.0", "target_period": "2014July", "completed": false, "de": "WoUIOUcej6W", "old_value": "4", "target_dataelement": "U7ep9MxtQ1z.SyDcaTOW0JP", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "SyDcaTOW0JP", "target": "4.0", "target_dataelement": "U7ep9MxtQ1z.SyDcaTOW0JP", "completed": true, "de": "WoUIOUcej6W", "target_period": "2014July", "value": "2", "ou": "iH7LSuDKBxU"}}}, "bJ84f27rqDB_jC7AWcjBkJ3": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "jC7AWcjBkJ3", "target": "3.0", "target_dataelement": "Ivu48nkpIw2.jC7AWcjBkJ3", "completed": true, "de": "bJ84f27rqDB", "target_period": "2014July", "value": "2", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "jC7AWcjBkJ3", "target": "3.0", "target_period": "2014July", "completed": false, "de": "bJ84f27rqDB", "old_value": "4", "target_dataelement": "Ivu48nkpIw2.jC7AWcjBkJ3", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "jC7AWcjBkJ3", "target": "3.0", "target_dataelement": "Ivu48nkpIw2.jC7AWcjBkJ3", "completed": true, "de": "bJ84f27rqDB", "target_period": "2014July", "value": "4", "ou": "iH7LSuDKBxU"}}}, "qRvbTVEmI6C_nMMaTQxdPJG": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "nMMaTQxdPJG", "target": "2.0", "target_dataelement": "dGATcuqhXtk.nMMaTQxdPJG", "completed": true, "de": "qRvbTVEmI6C", "target_period": "2014July", "value": "4", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "nMMaTQxdPJG", "target": "2.0", "target_period": "2014July", "completed": false, "de": "qRvbTVEmI6C", "old_value": "4", "target_dataelement": "dGATcuqhXtk.nMMaTQxdPJG", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "nMMaTQxdPJG", "target": "2.0", "target_dataelement": "dGATcuqhXtk.nMMaTQxdPJG", "completed": true, "de": "qRvbTVEmI6C", "target_period": "2014July", "value": "2", "ou": "iH7LSuDKBxU"}}}, "rNaeaP69Ml0_D4phPJP6u9V": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "D4phPJP6u9V", "target": "4.0", "target_dataelement": "l7yZ1DOmYbU.D4phPJP6u9V", "completed": true, "de": "rNaeaP69Ml0", "target_period": "2014July", "value": "4", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "D4phPJP6u9V", "target": "3.0", "target_period": "2014July", "completed": false, "de": "rNaeaP69Ml0", "old_value": "4", "target_dataelement": "l7yZ1DOmYbU.D4phPJP6u9V", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "D4phPJP6u9V", "target": "3.0", "target_dataelement": "l7yZ1DOmYbU.D4phPJP6u9V", "completed": true, "de": "rNaeaP69Ml0", "target_period": "2014July", "value": "3", "ou": "iH7LSuDKBxU"}}}, "cf9SaENrA27_JnGowCNPR09": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "JnGowCNPR09", "target": "2.0", "target_dataelement": "KnfVAOcnV26.JnGowCNPR09", "completed": true, "de": "cf9SaENrA27", "target_period": "2014July", "value": "4", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "JnGowCNPR09", "target": "3.0", "target_period": "2014July", "completed": false, "de": "cf9SaENrA27", "old_value": "4", "target_dataelement": "KnfVAOcnV26.JnGowCNPR09", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "JnGowCNPR09", "target": "3.0", "target_dataelement": "KnfVAOcnV26.JnGowCNPR09", "completed": true, "de": "cf9SaENrA27", "target_period": "2014July", "value": "3", "ou": "iH7LSuDKBxU"}}}, "xpXXurlwbNM_Bkz2vXNsYke": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "Bkz2vXNsYke", "target": "3.0", "target_dataelement": "BnsXYKt6iu6.Bkz2vXNsYke", "completed": true, "de": "xpXXurlwbNM", "target_period": "2014July", "value": "3", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "Bkz2vXNsYke", "target": "3.0", "target_period": "2014July", "completed": false, "de": "xpXXurlwbNM", "old_value": "4", "target_dataelement": "BnsXYKt6iu6.Bkz2vXNsYke", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "Bkz2vXNsYke", "target": "3.0", "target_dataelement": "BnsXYKt6iu6.Bkz2vXNsYke", "completed": true, "de": "xpXXurlwbNM", "target_period": "2014July", "value": "4", "ou": "iH7LSuDKBxU"}}}, "xpXXurlwbNM_pAB6StXtLU8": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "pAB6StXtLU8", "target": "4.0", "target_dataelement": "BnsXYKt6iu6.pAB6StXtLU8", "completed": true, "de": "xpXXurlwbNM", "target_period": "2014July", "value": "3", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "pAB6StXtLU8", "target": "2.0", "target_period": "2014July", "completed": false, "de": "xpXXurlwbNM", "old_value": "4", "target_dataelement": "BnsXYKt6iu6.pAB6StXtLU8", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "pAB6StXtLU8", "target": "2.0", "target_dataelement": "BnsXYKt6iu6.pAB6StXtLU8", "completed": true, "de": "xpXXurlwbNM", "target_period": "2014July", "value": "3", "ou": "iH7LSuDKBxU"}}}, "mVwNk3foz3v_nxSBayfWRix": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"ou": "AsgiIABsA69", "de": "mVwNk3foz3v", "co": "nxSBayfWRix", "completed": true, "value": "4"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "nxSBayfWRix", "completed": false, "de": "mVwNk3foz3v", "old_value": "4", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"ou": "iH7LSuDKBxU", "de": "mVwNk3foz3v", "co": "nxSBayfWRix", "completed": true, "value": "4"}}}, "rBstKKNXmYA_FxOzFSqMVd2": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "FxOzFSqMVd2", "target": "4.0", "target_dataelement": "ZLsVcUh3yWM.FxOzFSqMVd2", "completed": true, "de": "rBstKKNXmYA", "target_period": "2014July", "value": "4", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "FxOzFSqMVd2", "target": "3.0", "target_period": "2014July", "completed": false, "de": "rBstKKNXmYA", "old_value": "4", "target_dataelement": "ZLsVcUh3yWM.FxOzFSqMVd2", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "FxOzFSqMVd2", "target": "3.0", "target_dataelement": "ZLsVcUh3yWM.FxOzFSqMVd2", "completed": true, "de": "rBstKKNXmYA", "target_period": "2014July", "value": "3", "ou": "iH7LSuDKBxU"}}}, "mW1g85YGrA5_JltmCaChBl0": {"formula": "PriorEstimate", "data": {"AsgiIABsA69": {"ou": "AsgiIABsA69", "de": "mW1g85YGrA5", "co": "JltmCaChBl0", "completed": true, "value": "3"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "JltmCaChBl0", "completed": false, "de": "mW1g85YGrA5", "old_value": "4", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"ou": "iH7LSuDKBxU", "de": "mW1g85YGrA5", "co": "JltmCaChBl0", "completed": true, "value": "4"}}}, "dozTSGrBvVj_AqholFtHhlg": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "AqholFtHhlg", "target": "2.0", "target_dataelement": "lf7gU0lfEJt.AqholFtHhlg", "completed": true, "de": "dozTSGrBvVj", "target_period": "2014July", "value": "4", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "AqholFtHhlg", "target": "2.0", "target_period": "2014July", "completed": false, "de": "dozTSGrBvVj", "old_value": "4", "target_dataelement": "lf7gU0lfEJt.AqholFtHhlg", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "AqholFtHhlg", "target": "2.0", "target_dataelement": "lf7gU0lfEJt.AqholFtHhlg", "completed": true, "de": "dozTSGrBvVj", "target_period": "2014July", "value": "3", "ou": "iH7LSuDKBxU"}}}, "sS5OudDzXC2_pcsiYqIW4kJ": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"ou": "AsgiIABsA69", "de": "sS5OudDzXC2", "co": "pcsiYqIW4kJ", "completed": true, "value": "4"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "pcsiYqIW4kJ", "completed": false, "de": "sS5OudDzXC2", "old_value": "4", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"ou": "iH7LSuDKBxU", "de": "sS5OudDzXC2", "co": "pcsiYqIW4kJ", "completed": true, "value": "4"}}}, "rBstKKNXmYA_Jc1jxBG2eal": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "Jc1jxBG2eal", "target": "2.0", "target_dataelement": "ZLsVcUh3yWM.Jc1jxBG2eal", "completed": true, "de": "rBstKKNXmYA", "target_period": "2014July", "value": "3", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "Jc1jxBG2eal", "target": "2.0", "target_period": "2014July", "completed": false, "de": "rBstKKNXmYA", "old_value": "4", "target_dataelement": "ZLsVcUh3yWM.Jc1jxBG2eal", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "Jc1jxBG2eal", "target": "2.0", "target_dataelement": "ZLsVcUh3yWM.Jc1jxBG2eal", "completed": true, "de": "rBstKKNXmYA", "target_period": "2014July", "value": "4", "ou": "iH7LSuDKBxU"}}}, "rBstKKNXmYA_N6TVFtK0jJ5": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "N6TVFtK0jJ5", "target": "4.0", "target_dataelement": "ZLsVcUh3yWM.N6TVFtK0jJ5", "completed": true, "de": "rBstKKNXmYA", "target_period": "2014July", "value": "2", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "N6TVFtK0jJ5", "target": "4.0", "target_period": "2014July", "completed": false, "de": "rBstKKNXmYA", "old_value": "4", "target_dataelement": "ZLsVcUh3yWM.N6TVFtK0jJ5", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "N6TVFtK0jJ5", "target": "4.0", "target_dataelement": "ZLsVcUh3yWM.N6TVFtK0jJ5", "completed": true, "de": "rBstKKNXmYA", "target_period": "2014July", "value": "3", "ou": "iH7LSuDKBxU"}}}, "qRvbTVEmI6C_uQqzzomp9tc": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "uQqzzomp9tc", "target": "3.0", "target_dataelement": "dGATcuqhXtk.uQqzzomp9tc", "completed": true, "de": "qRvbTVEmI6C", "target_period": "2014July", "value": "4", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "uQqzzomp9tc", "target": "3.0", "target_period": "2014July", "completed": false, "de": "qRvbTVEmI6C", "old_value": "4", "target_dataelement": "dGATcuqhXtk.uQqzzomp9tc", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "uQqzzomp9tc", "target": "3.0", "target_dataelement": "dGATcuqhXtk.uQqzzomp9tc", "completed": true, "de": "qRvbTVEmI6C", "target_period": "2014July", "value": "4", "ou": "iH7LSuDKBxU"}}}, "nc1E1TyiGhG_D4phPJP6u9V": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "D4phPJP6u9V", "target": "2.0", "target_dataelement": "gAS04LMK9UX.D4phPJP6u9V", "completed": true, "de": "nc1E1TyiGhG", "target_period": "2014July", "value": "3", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "D4phPJP6u9V", "target": "2.0", "target_period": "2014July", "completed": false, "de": "nc1E1TyiGhG", "old_value": "4", "target_dataelement": "gAS04LMK9UX.D4phPJP6u9V", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "D4phPJP6u9V", "target": "2.0", "target_dataelement": "gAS04LMK9UX.D4phPJP6u9V", "completed": true, "de": "nc1E1TyiGhG", "target_period": "2014July", "value": "4", "ou": "iH7LSuDKBxU"}}}, "WoUIOUcej6W_Hmz6lySVDCN": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "Hmz6lySVDCN", "target": "3.0", "target_dataelement": "U7ep9MxtQ1z.Hmz6lySVDCN", "completed": true, "de": "WoUIOUcej6W", "target_period": "2014July", "value": "4", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "Hmz6lySVDCN", "target": "3.0", "target_period": "2014July", "completed": false, "de": "WoUIOUcej6W", "old_value": "4", "target_dataelement": "U7ep9MxtQ1z.Hmz6lySVDCN", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "Hmz6lySVDCN", "target": "3.0", "target_dataelement": "U7ep9MxtQ1z.Hmz6lySVDCN", "completed": true, "de": "WoUIOUcej6W", "target_period": "2014July", "value": "2", "ou": "iH7LSuDKBxU"}}}, "gbvUDbZWxUS_v3Eq35RuqEA": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "v3Eq35RuqEA", "target": "4.0", "target_dataelement": "hCLl9rGfYpb.v3Eq35RuqEA", "completed": true, "de": "gbvUDbZWxUS", "target_period": "2014July", "value": "3", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "v3Eq35RuqEA", "target": "2.0", "target_period": "2014July", "completed": false, "de": "gbvUDbZWxUS", "old_value": "4", "target_dataelement": "hCLl9rGfYpb.v3Eq35RuqEA", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "v3Eq35RuqEA", "target": "2.0", "target_dataelement": "hCLl9rGfYpb.v3Eq35RuqEA", "completed": true, "de": "gbvUDbZWxUS", "target_period": "2014July", "value": "2", "ou": "iH7LSuDKBxU"}}}, "dozTSGrBvVj_R5DIMqSCTA5": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "R5DIMqSCTA5", "target": "2.0", "target_dataelement": "lf7gU0lfEJt.R5DIMqSCTA5", "completed": true, "de": "dozTSGrBvVj", "target_period": "2014July", "value": "3", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "R5DIMqSCTA5", "target": "3.0", "target_period": "2014July", "completed": false, "de": "dozTSGrBvVj", "old_value": "4", "target_dataelement": "lf7gU0lfEJt.R5DIMqSCTA5", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "R5DIMqSCTA5", "target": "3.0", "target_dataelement": "lf7gU0lfEJt.R5DIMqSCTA5", "completed": true, "de": "dozTSGrBvVj", "target_period": "2014July", "value": "2", "ou": "iH7LSuDKBxU"}}}, "dozTSGrBvVj_wJIxAhejWKY": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "wJIxAhejWKY", "target": "3.0", "target_dataelement": "lf7gU0lfEJt.wJIxAhejWKY", "completed": true, "de": "dozTSGrBvVj", "target_period": "2014July", "value": "4", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "wJIxAhejWKY", "target": "2.0", "target_period": "2014July", "completed": false, "de": "dozTSGrBvVj", "old_value": "4", "target_dataelement": "lf7gU0lfEJt.wJIxAhejWKY", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "wJIxAhejWKY", "target": "2.0", "target_dataelement": "lf7gU0lfEJt.wJIxAhejWKY", "completed": true, "de": "dozTSGrBvVj", "target_period": "2014July", "value": "4", "ou": "iH7LSuDKBxU"}}}, "YSRj2rXWC0f_pAB6StXtLU8": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "pAB6StXtLU8", "target": "2.0", "target_dataelement": "I9MjFl6Y5hl.pAB6StXtLU8", "completed": true, "de": "YSRj2rXWC0f", "target_period": "2014July", "value": "2", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "pAB6StXtLU8", "target": "2.0", "target_period": "2014July", "completed": false, "de": "YSRj2rXWC0f", "old_value": "4", "target_dataelement": "I9MjFl6Y5hl.pAB6StXtLU8", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "pAB6StXtLU8", "target": "2.0", "target_dataelement": "I9MjFl6Y5hl.pAB6StXtLU8", "completed": true, "de": "YSRj2rXWC0f", "target_period": "2014July", "value": "2", "ou": "iH7LSuDKBxU"}}}, "qRvbTVEmI6C_ICiTJsU1Vec": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "ICiTJsU1Vec", "target": "2.0", "target_dataelement": "dGATcuqhXtk.ICiTJsU1Vec", "completed": true, "de": "qRvbTVEmI6C", "target_period": "2014July", "value": "3", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "ICiTJsU1Vec", "target": "4.0", "target_period": "2014July", "completed": false, "de": "qRvbTVEmI6C", "old_value": "4", "target_dataelement": "dGATcuqhXtk.ICiTJsU1Vec", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "ICiTJsU1Vec", "target": "4.0", "target_dataelement": "dGATcuqhXtk.ICiTJsU1Vec", "completed": true, "de": "qRvbTVEmI6C", "target_period": "2014July", "value": "2", "ou": "iH7LSuDKBxU"}}}, "YSRj2rXWC0f_wTlpU2TaHiz": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "wTlpU2TaHiz", "target": "3.0", "target_dataelement": "I9MjFl6Y5hl.wTlpU2TaHiz", "completed": true, "de": "YSRj2rXWC0f", "target_period": "2014July", "value": "4", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "wTlpU2TaHiz", "target": "2.0", "target_period": "2014July", "completed": false, "de": "YSRj2rXWC0f", "old_value": "4", "target_dataelement": "I9MjFl6Y5hl.wTlpU2TaHiz", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "wTlpU2TaHiz", "target": "2.0", "target_dataelement": "I9MjFl6Y5hl.wTlpU2TaHiz", "completed": true, "de": "YSRj2rXWC0f", "target_period": "2014July", "value": "2", "ou": "iH7LSuDKBxU"}}}, "rBstKKNXmYA_b5D4IKJFDJH": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "b5D4IKJFDJH", "target": "2.0", "target_dataelement": "ZLsVcUh3yWM.b5D4IKJFDJH", "completed": true, "de": "rBstKKNXmYA", "target_period": "2014July", "value": "2", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "b5D4IKJFDJH", "target": "4.0", "target_period": "2014July", "completed": false, "de": "rBstKKNXmYA", "old_value": "4", "target_dataelement": "ZLsVcUh3yWM.b5D4IKJFDJH", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "b5D4IKJFDJH", "target": "4.0", "target_dataelement": "ZLsVcUh3yWM.b5D4IKJFDJH", "completed": true, "de": "rBstKKNXmYA", "target_period": "2014July", "value": "2", "ou": "iH7LSuDKBxU"}}}, "qRvbTVEmI6C_Y1zhvDQTe5e": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "Y1zhvDQTe5e", "target": "2.0", "target_dataelement": "dGATcuqhXtk.Y1zhvDQTe5e", "completed": true, "de": "qRvbTVEmI6C", "target_period": "2014July", "value": "3", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "Y1zhvDQTe5e", "target": "2.0", "target_period": "2014July", "completed": false, "de": "qRvbTVEmI6C", "old_value": "4", "target_dataelement": "dGATcuqhXtk.Y1zhvDQTe5e", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "Y1zhvDQTe5e", "target": "2.0", "target_dataelement": "dGATcuqhXtk.Y1zhvDQTe5e", "completed": true, "de": "qRvbTVEmI6C", "target_period": "2014July", "value": "3", "ou": "iH7LSuDKBxU"}}}, "nc1E1TyiGhG_e27Rj8LSYQV": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "e27Rj8LSYQV", "target": "4.0", "target_dataelement": "gAS04LMK9UX.e27Rj8LSYQV", "completed": true, "de": "nc1E1TyiGhG", "target_period": "2014July", "value": "2", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "e27Rj8LSYQV", "target": "3.0", "target_period": "2014July", "completed": false, "de": "nc1E1TyiGhG", "old_value": "4", "target_dataelement": "gAS04LMK9UX.e27Rj8LSYQV", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "e27Rj8LSYQV", "target": "3.0", "target_dataelement": "gAS04LMK9UX.e27Rj8LSYQV", "completed": true, "de": "nc1E1TyiGhG", "target_period": "2014July", "value": "3", "ou": "iH7LSuDKBxU"}}}, "WoUIOUcej6W_GmO6g98S4G9": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "GmO6g98S4G9", "target": "3.0", "target_dataelement": "U7ep9MxtQ1z.GmO6g98S4G9", "completed": true, "de": "WoUIOUcej6W", "target_period": "2014July", "value": "4", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "GmO6g98S4G9", "target": "2.0", "target_period": "2014July", "completed": false, "de": "WoUIOUcej6W", "old_value": "4", "target_dataelement": "U7ep9MxtQ1z.GmO6g98S4G9", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "GmO6g98S4G9", "target": "2.0", "target_dataelement": "U7ep9MxtQ1z.GmO6g98S4G9", "completed": true, "de": "WoUIOUcej6W", "target_period": "2014July", "value": "4", "ou": "iH7LSuDKBxU"}}}, "rBstKKNXmYA_BYTuIQ47dnS": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "BYTuIQ47dnS", "target": "2.0", "target_dataelement": "ZLsVcUh3yWM.BYTuIQ47dnS", "completed": true, "de": "rBstKKNXmYA", "target_period": "2014July", "value": "3", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "BYTuIQ47dnS", "target": "4.0", "target_period": "2014July", "completed": false, "de": "rBstKKNXmYA", "old_value": "4", "target_dataelement": "ZLsVcUh3yWM.BYTuIQ47dnS", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "BYTuIQ47dnS", "target": "4.0", "target_dataelement": "ZLsVcUh3yWM.BYTuIQ47dnS", "completed": true, "de": "rBstKKNXmYA", "target_period": "2014July", "value": "2", "ou": "iH7LSuDKBxU"}}}, "sS5OudDzXC2_YwRiKDxpYON": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"ou": "AsgiIABsA69", "de": "sS5OudDzXC2", "co": "YwRiKDxpYON", "completed": true, "value": "4"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "YwRiKDxpYON", "completed": false, "de": "sS5OudDzXC2", "old_value": "4", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"ou": "iH7LSuDKBxU", "de": "sS5OudDzXC2", "co": "YwRiKDxpYON", "completed": true, "value": "3"}}}, "NctvTchh3EF_WgIlmdIhlpD": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"ou": "AsgiIABsA69", "de": "NctvTchh3EF", "co": "WgIlmdIhlpD", "completed": true, "value": "1"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "WgIlmdIhlpD", "completed": false, "de": "NctvTchh3EF", "old_value": "4", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"ou": "iH7LSuDKBxU", "de": "NctvTchh3EF", "co": "WgIlmdIhlpD", "completed": true, "value": "1"}}}, "YSRj2rXWC0f_TkxAyok9vQZ": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "TkxAyok9vQZ", "target": "2.0", "target_dataelement": "I9MjFl6Y5hl.TkxAyok9vQZ", "completed": true, "de": "YSRj2rXWC0f", "target_period": "2014July", "value": "3", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "TkxAyok9vQZ", "target": "2.0", "target_period": "2014July", "completed": false, "de": "YSRj2rXWC0f", "old_value": "4", "target_dataelement": "I9MjFl6Y5hl.TkxAyok9vQZ", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "TkxAyok9vQZ", "target": "2.0", "target_dataelement": "I9MjFl6Y5hl.TkxAyok9vQZ", "completed": true, "de": "YSRj2rXWC0f", "target_period": "2014July", "value": "3", "ou": "iH7LSuDKBxU"}}}, "cf9SaENrA27_nxsGR3eo7aj": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "nxsGR3eo7aj", "target": "2.0", "target_dataelement": "KnfVAOcnV26.nxsGR3eo7aj", "completed": true, "de": "cf9SaENrA27", "target_period": "2014July", "value": "2", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "nxsGR3eo7aj", "target": "2.0", "target_period": "2014July", "completed": false, "de": "cf9SaENrA27", "old_value": "4", "target_dataelement": "KnfVAOcnV26.nxsGR3eo7aj", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "nxsGR3eo7aj", "target": "2.0", "target_dataelement": "KnfVAOcnV26.nxsGR3eo7aj", "completed": true, "de": "cf9SaENrA27", "target_period": "2014July", "value": "2", "ou": "iH7LSuDKBxU"}}}, "mVwNk3foz3v_UbXIA05jKZB": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"ou": "AsgiIABsA69", "de": "mVwNk3foz3v", "co": "UbXIA05jKZB", "completed": true, "value": "4"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "UbXIA05jKZB", "completed": false, "de": "mVwNk3foz3v", "old_value": "4", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"ou": "iH7LSuDKBxU", "de": "mVwNk3foz3v", "co": "UbXIA05jKZB", "completed": true, "value": "2"}}}, "FwpCBGQvYdL_J6W3kbELkGw": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "J6W3kbELkGw", "target": "3.0", "target_dataelement": "xBxqNNV8jLR.J6W3kbELkGw", "completed": true, "de": "FwpCBGQvYdL", "target_period": "2014July", "value": "4", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "J6W3kbELkGw", "target": "2.0", "target_period": "2014July", "completed": false, "de": "FwpCBGQvYdL", "old_value": "4", "target_dataelement": "xBxqNNV8jLR.J6W3kbELkGw", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "J6W3kbELkGw", "target": "2.0", "target_dataelement": "xBxqNNV8jLR.J6W3kbELkGw", "completed": true, "de": "FwpCBGQvYdL", "target_period": "2014July", "value": "4", "ou": "iH7LSuDKBxU"}}}, "nc1E1TyiGhG_pq1B5YRvk3w": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "pq1B5YRvk3w", "target": "4.0", "target_dataelement": "gAS04LMK9UX.pq1B5YRvk3w", "completed": true, "de": "nc1E1TyiGhG", "target_period": "2014July", "value": "2", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "pq1B5YRvk3w", "target": "3.0", "target_period": "2014July", "completed": false, "de": "nc1E1TyiGhG", "old_value": "4", "target_dataelement": "gAS04LMK9UX.pq1B5YRvk3w", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "pq1B5YRvk3w", "target": "3.0", "target_dataelement": "gAS04LMK9UX.pq1B5YRvk3w", "completed": true, "de": "nc1E1TyiGhG", "target_period": "2014July", "value": "4", "ou": "iH7LSuDKBxU"}}}, "QnFeukGopwx_vXOb5h9Rxqs": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "vXOb5h9Rxqs", "target": "2.0", "target_dataelement": "zDMxdyL6JWq.vXOb5h9Rxqs", "completed": true, "de": "QnFeukGopwx", "target_period": "2014July", "value": "2", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "vXOb5h9Rxqs", "target": "2.0", "target_period": "2014July", "completed": false, "de": "QnFeukGopwx", "old_value": "4", "target_dataelement": "zDMxdyL6JWq.vXOb5h9Rxqs", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "vXOb5h9Rxqs", "target": "2.0", "target_dataelement": "zDMxdyL6JWq.vXOb5h9Rxqs", "completed": true, "de": "QnFeukGopwx", "target_period": "2014July", "value": "3", "ou": "iH7LSuDKBxU"}}}, "YSRj2rXWC0f_i9b5kFnGOkF": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "i9b5kFnGOkF", "target": "4.0", "target_dataelement": "I9MjFl6Y5hl.i9b5kFnGOkF", "completed": true, "de": "YSRj2rXWC0f", "target_period": "2014July", "value": "3", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "i9b5kFnGOkF", "target": "2.0", "target_period": "2014July", "completed": false, "de": "YSRj2rXWC0f", "old_value": "4", "target_dataelement": "I9MjFl6Y5hl.i9b5kFnGOkF", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "i9b5kFnGOkF", "target": "2.0", "target_dataelement": "I9MjFl6Y5hl.i9b5kFnGOkF", "completed": true, "de": "YSRj2rXWC0f", "target_period": "2014July", "value": "2", "ou": "iH7LSuDKBxU"}}}, "nc1E1TyiGhG_IOE274vPmm1": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "IOE274vPmm1", "target": "3.0", "target_dataelement": "gAS04LMK9UX.IOE274vPmm1", "completed": true, "de": "nc1E1TyiGhG", "target_period": "2014July", "value": "3", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "IOE274vPmm1", "target": "2.0", "target_period": "2014July", "completed": false, "de": "nc1E1TyiGhG", "old_value": "4", "target_dataelement": "gAS04LMK9UX.IOE274vPmm1", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "IOE274vPmm1", "target": "2.0", "target_dataelement": "gAS04LMK9UX.IOE274vPmm1", "completed": true, "de": "nc1E1TyiGhG", "target_period": "2014July", "value": "3", "ou": "iH7LSuDKBxU"}}}, "lcdIDgumilv_wfxDF7iGY3f": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "wfxDF7iGY3f", "target": "3.0", "target_dataelement": "A4BPhZhOrzc.wfxDF7iGY3f", "completed": true, "de": "lcdIDgumilv", "target_period": "2014July", "value": "4", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "wfxDF7iGY3f", "target": "4.0", "target_period": "2014July", "completed": false, "de": "lcdIDgumilv", "old_value": "4", "target_dataelement": "A4BPhZhOrzc.wfxDF7iGY3f", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "wfxDF7iGY3f", "target": "4.0", "target_dataelement": "A4BPhZhOrzc.wfxDF7iGY3f", "completed": true, "de": "lcdIDgumilv", "target_period": "2014July", "value": "2", "ou": "iH7LSuDKBxU"}}}, "AG0rLmFA5Vf_BBhkAajcJwT": {"formula": "PriorEstimate", "data": {"AsgiIABsA69": {"ou": "AsgiIABsA69", "de": "AG0rLmFA5Vf", "co": "BBhkAajcJwT", "completed": true, "value": "3"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "BBhkAajcJwT", "completed": false, "de": "AG0rLmFA5Vf", "old_value": "4", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"ou": "iH7LSuDKBxU", "de": "AG0rLmFA5Vf", "co": "BBhkAajcJwT", "completed": true, "value": "4"}}}, "WoUIOUcej6W_XckkuoyUldR": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "XckkuoyUldR", "target": "3.0", "target_dataelement": "U7ep9MxtQ1z.XckkuoyUldR", "completed": true, "de": "WoUIOUcej6W", "target_period": "2014July", "value": "2", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "XckkuoyUldR", "target": "3.0", "target_period": "2014July", "completed": false, "de": "WoUIOUcej6W", "old_value": "4", "target_dataelement": "U7ep9MxtQ1z.XckkuoyUldR", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "XckkuoyUldR", "target": "3.0", "target_dataelement": "U7ep9MxtQ1z.XckkuoyUldR", "completed": true, "de": "WoUIOUcej6W", "target_period": "2014July", "value": "3", "ou": "iH7LSuDKBxU"}}}, "YSRj2rXWC0f_Heme7D8HT30": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "Heme7D8HT30", "target": "3.0", "target_dataelement": "I9MjFl6Y5hl.Heme7D8HT30", "completed": true, "de": "YSRj2rXWC0f", "target_period": "2014July", "value": "3", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "Heme7D8HT30", "target": "2.0", "target_period": "2014July", "completed": false, "de": "YSRj2rXWC0f", "old_value": "4", "target_dataelement": "I9MjFl6Y5hl.Heme7D8HT30", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "Heme7D8HT30", "target": "2.0", "target_dataelement": "I9MjFl6Y5hl.Heme7D8HT30", "completed": true, "de": "YSRj2rXWC0f", "target_period": "2014July", "value": "4", "ou": "iH7LSuDKBxU"}}}, "FwpCBGQvYdL_mlpia7QBdqY": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "mlpia7QBdqY", "target": "3.0", "target_dataelement": "xBxqNNV8jLR.mlpia7QBdqY", "completed": true, "de": "FwpCBGQvYdL", "target_period": "2014July", "value": "2", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "mlpia7QBdqY", "target": "4.0", "target_period": "2014July", "completed": false, "de": "FwpCBGQvYdL", "old_value": "4", "target_dataelement": "xBxqNNV8jLR.mlpia7QBdqY", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "mlpia7QBdqY", "target": "4.0", "target_dataelement": "xBxqNNV8jLR.mlpia7QBdqY", "completed": true, "de": "FwpCBGQvYdL", "target_period": "2014July", "value": "3", "ou": "iH7LSuDKBxU"}}}, "xpXXurlwbNM_wTlpU2TaHiz": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "wTlpU2TaHiz", "target": "3.0", "target_dataelement": "BnsXYKt6iu6.wTlpU2TaHiz", "completed": true, "de": "xpXXurlwbNM", "target_period": "2014July", "value": "2", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "wTlpU2TaHiz", "target": "3.0", "target_period": "2014July", "completed": false, "de": "xpXXurlwbNM", "old_value": "4", "target_dataelement": "BnsXYKt6iu6.wTlpU2TaHiz", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "wTlpU2TaHiz", "target": "3.0", "target_dataelement": "BnsXYKt6iu6.wTlpU2TaHiz", "completed": true, "de": "xpXXurlwbNM", "target_period": "2014July", "value": "4", "ou": "iH7LSuDKBxU"}}}, "xpXXurlwbNM_hkdaOo9ZpB2": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "hkdaOo9ZpB2", "target": "4.0", "target_dataelement": "BnsXYKt6iu6.hkdaOo9ZpB2", "completed": true, "de": "xpXXurlwbNM", "target_period": "2014July", "value": "4", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "hkdaOo9ZpB2", "target": "4.0", "target_period": "2014July", "completed": false, "de": "xpXXurlwbNM", "old_value": "4", "target_dataelement": "BnsXYKt6iu6.hkdaOo9ZpB2", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "hkdaOo9ZpB2", "target": "4.0", "target_dataelement": "BnsXYKt6iu6.hkdaOo9ZpB2", "completed": true, "de": "xpXXurlwbNM", "target_period": "2014July", "value": "3", "ou": "iH7LSuDKBxU"}}}, "QnFeukGopwx_FxOzFSqMVd2": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "FxOzFSqMVd2", "target": "4.0", "target_dataelement": "zDMxdyL6JWq.FxOzFSqMVd2", "completed": true, "de": "QnFeukGopwx", "target_period": "2014July", "value": "4", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "FxOzFSqMVd2", "target": "3.0", "target_period": "2014July", "completed": false, "de": "QnFeukGopwx", "old_value": "4", "target_dataelement": "zDMxdyL6JWq.FxOzFSqMVd2", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "FxOzFSqMVd2", "target": "3.0", "target_dataelement": "zDMxdyL6JWq.FxOzFSqMVd2", "completed": true, "de": "QnFeukGopwx", "target_period": "2014July", "value": "3", "ou": "iH7LSuDKBxU"}}}, "GxSEsnCVmuh_WgIlmdIhlpD": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"ou": "AsgiIABsA69", "de": "GxSEsnCVmuh", "co": "WgIlmdIhlpD", "completed": true, "value": "3"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "WgIlmdIhlpD", "completed": false, "de": "GxSEsnCVmuh", "old_value": "4", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"ou": "iH7LSuDKBxU", "de": "GxSEsnCVmuh", "co": "WgIlmdIhlpD", "completed": true, "value": "2"}}}, "ngDrfoi85Oy_bBKFyBvoo34": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "bBKFyBvoo34", "target": "4.0", "target_dataelement": "tIW07Zp3vnv.bBKFyBvoo34", "completed": true, "de": "ngDrfoi85Oy", "target_period": "2014July", "value": "4", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "bBKFyBvoo34", "target": "4.0", "target_period": "2014July", "completed": false, "de": "ngDrfoi85Oy", "old_value": "4", "target_dataelement": "tIW07Zp3vnv.bBKFyBvoo34", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "bBKFyBvoo34", "target": "4.0", "target_dataelement": "tIW07Zp3vnv.bBKFyBvoo34", "completed": true, "de": "ngDrfoi85Oy", "target_period": "2014July", "value": "3", "ou": "iH7LSuDKBxU"}}}, "WoUIOUcej6W_oplxxXgoehP": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "oplxxXgoehP", "target": "4.0", "target_dataelement": "U7ep9MxtQ1z.oplxxXgoehP", "completed": true, "de": "WoUIOUcej6W", "target_period": "2014July", "value": "2", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "oplxxXgoehP", "target": "4.0", "target_period": "2014July", "completed": false, "de": "WoUIOUcej6W", "old_value": "4", "target_dataelement": "U7ep9MxtQ1z.oplxxXgoehP", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "oplxxXgoehP", "target": "4.0", "target_dataelement": "U7ep9MxtQ1z.oplxxXgoehP", "completed": true, "de": "WoUIOUcej6W", "target_period": "2014July", "value": "3", "ou": "iH7LSuDKBxU"}}}, "lcdIDgumilv_PLhI6ueimwn": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "PLhI6ueimwn", "target": "2.0", "target_dataelement": "A4BPhZhOrzc.PLhI6ueimwn", "completed": true, "de": "lcdIDgumilv", "target_period": "2014July", "value": "3", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "PLhI6ueimwn", "target": "4.0", "target_period": "2014July", "completed": false, "de": "lcdIDgumilv", "old_value": "4", "target_dataelement": "A4BPhZhOrzc.PLhI6ueimwn", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "PLhI6ueimwn", "target": "4.0", "target_dataelement": "A4BPhZhOrzc.PLhI6ueimwn", "completed": true, "de": "lcdIDgumilv", "target_period": "2014July", "value": "4", "ou": "iH7LSuDKBxU"}}}, "SXvP3NECeFk_deTgGupUgr3": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "deTgGupUgr3", "target": "3.0", "target_dataelement": "zRnFbI3MLRr.deTgGupUgr3", "completed": true, "de": "SXvP3NECeFk", "target_period": "2014July", "value": "4", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "deTgGupUgr3", "target": "4.0", "target_period": "2014July", "completed": false, "de": "SXvP3NECeFk", "old_value": "4", "target_dataelement": "zRnFbI3MLRr.deTgGupUgr3", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "deTgGupUgr3", "target": "4.0", "target_dataelement": "zRnFbI3MLRr.deTgGupUgr3", "completed": true, "de": "SXvP3NECeFk", "target_period": "2014July", "value": "2", "ou": "iH7LSuDKBxU"}}}, "nc1E1TyiGhG_zPf9YtxdJJH": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "zPf9YtxdJJH", "target": "2.0", "target_dataelement": "gAS04LMK9UX.zPf9YtxdJJH", "completed": true, "de": "nc1E1TyiGhG", "target_period": "2014July", "value": "3", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "zPf9YtxdJJH", "target": "4.0", "target_period": "2014July", "completed": false, "de": "nc1E1TyiGhG", "old_value": "4", "target_dataelement": "gAS04LMK9UX.zPf9YtxdJJH", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "zPf9YtxdJJH", "target": "4.0", "target_dataelement": "gAS04LMK9UX.zPf9YtxdJJH", "completed": true, "de": "nc1E1TyiGhG", "target_period": "2014July", "value": "3", "ou": "iH7LSuDKBxU"}}}, "bJ84f27rqDB_uQqzzomp9tc": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "uQqzzomp9tc", "target": "2.0", "target_dataelement": "Ivu48nkpIw2.uQqzzomp9tc", "completed": true, "de": "bJ84f27rqDB", "target_period": "2014July", "value": "4", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "uQqzzomp9tc", "target": "2.0", "target_period": "2014July", "completed": false, "de": "bJ84f27rqDB", "old_value": "4", "target_dataelement": "Ivu48nkpIw2.uQqzzomp9tc", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "uQqzzomp9tc", "target": "2.0", "target_dataelement": "Ivu48nkpIw2.uQqzzomp9tc", "completed": true, "de": "bJ84f27rqDB", "target_period": "2014July", "value": "3", "ou": "iH7LSuDKBxU"}}}, "YSRj2rXWC0f_rwsWnkaJ5HR": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "rwsWnkaJ5HR", "target": "2.0", "target_dataelement": "I9MjFl6Y5hl.rwsWnkaJ5HR", "completed": true, "de": "YSRj2rXWC0f", "target_period": "2014July", "value": "4", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "rwsWnkaJ5HR", "target": "4.0", "target_period": "2014July", "completed": false, "de": "YSRj2rXWC0f", "old_value": "4", "target_dataelement": "I9MjFl6Y5hl.rwsWnkaJ5HR", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "rwsWnkaJ5HR", "target": "4.0", "target_dataelement": "I9MjFl6Y5hl.rwsWnkaJ5HR", "completed": true, "de": "YSRj2rXWC0f", "target_period": "2014July", "value": "4", "ou": "iH7LSuDKBxU"}}}, "nc1E1TyiGhG_hOj19H7Vodn": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "hOj19H7Vodn", "target": "2.0", "target_dataelement": "gAS04LMK9UX.hOj19H7Vodn", "completed": true, "de": "nc1E1TyiGhG", "target_period": "2014July", "value": "4", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "hOj19H7Vodn", "target": "3.0", "target_period": "2014July", "completed": false, "de": "nc1E1TyiGhG", "old_value": "4", "target_dataelement": "gAS04LMK9UX.hOj19H7Vodn", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "hOj19H7Vodn", "target": "3.0", "target_dataelement": "gAS04LMK9UX.hOj19H7Vodn", "completed": true, "de": "nc1E1TyiGhG", "target_period": "2014July", "value": "2", "ou": "iH7LSuDKBxU"}}}, "xpXXurlwbNM_tPbRcvnWxkS": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "tPbRcvnWxkS", "target": "3.0", "target_dataelement": "BnsXYKt6iu6.tPbRcvnWxkS", "completed": true, "de": "xpXXurlwbNM", "target_period": "2014July", "value": "4", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "tPbRcvnWxkS", "target": "4.0", "target_period": "2014July", "completed": false, "de": "xpXXurlwbNM", "old_value": "4", "target_dataelement": "BnsXYKt6iu6.tPbRcvnWxkS", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "tPbRcvnWxkS", "target": "4.0", "target_dataelement": "BnsXYKt6iu6.tPbRcvnWxkS", "completed": true, "de": "xpXXurlwbNM", "target_period": "2014July", "value": "4", "ou": "iH7LSuDKBxU"}}}, "rBstKKNXmYA_vXOb5h9Rxqs": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "vXOb5h9Rxqs", "target": "3.0", "target_dataelement": "ZLsVcUh3yWM.vXOb5h9Rxqs", "completed": true, "de": "rBstKKNXmYA", "target_period": "2014July", "value": "4", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "vXOb5h9Rxqs", "target": "3.0", "target_period": "2014July", "completed": false, "de": "rBstKKNXmYA", "old_value": "4", "target_dataelement": "ZLsVcUh3yWM.vXOb5h9Rxqs", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "vXOb5h9Rxqs", "target": "3.0", "target_dataelement": "ZLsVcUh3yWM.vXOb5h9Rxqs", "completed": true, "de": "rBstKKNXmYA", "target_period": "2014July", "value": "4", "ou": "iH7LSuDKBxU"}}}, "rNaeaP69Ml0_mQjKnpOz1I8": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "mQjKnpOz1I8", "target": "4.0", "target_dataelement": "l7yZ1DOmYbU.mQjKnpOz1I8", "completed": true, "de": "rNaeaP69Ml0", "target_period": "2014July", "value": "4", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "mQjKnpOz1I8", "target": "4.0", "target_period": "2014July", "completed": false, "de": "rNaeaP69Ml0", "old_value": "4", "target_dataelement": "l7yZ1DOmYbU.mQjKnpOz1I8", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "mQjKnpOz1I8", "target": "4.0", "target_dataelement": "l7yZ1DOmYbU.mQjKnpOz1I8", "completed": true, "de": "rNaeaP69Ml0", "target_period": "2014July", "value": "3", "ou": "iH7LSuDKBxU"}}}, "rBstKKNXmYA_lJ9Cv8ISZRT": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "lJ9Cv8ISZRT", "target": "4.0", "target_dataelement": "ZLsVcUh3yWM.lJ9Cv8ISZRT", "completed": true, "de": "rBstKKNXmYA", "target_period": "2014July", "value": "3", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "lJ9Cv8ISZRT", "target": "3.0", "target_period": "2014July", "completed": false, "de": "rBstKKNXmYA", "old_value": "4", "target_dataelement": "ZLsVcUh3yWM.lJ9Cv8ISZRT", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "lJ9Cv8ISZRT", "target": "3.0", "target_dataelement": "ZLsVcUh3yWM.lJ9Cv8ISZRT", "completed": true, "de": "rBstKKNXmYA", "target_period": "2014July", "value": "2", "ou": "iH7LSuDKBxU"}}}, "cf9SaENrA27_D116dzscO4G": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "D116dzscO4G", "target": "4.0", "target_dataelement": "KnfVAOcnV26.D116dzscO4G", "completed": true, "de": "cf9SaENrA27", "target_period": "2014July", "value": "2", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "D116dzscO4G", "target": "4.0", "target_period": "2014July", "completed": false, "de": "cf9SaENrA27", "old_value": "4", "target_dataelement": "KnfVAOcnV26.D116dzscO4G", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "D116dzscO4G", "target": "4.0", "target_dataelement": "KnfVAOcnV26.D116dzscO4G", "completed": true, "de": "cf9SaENrA27", "target_period": "2014July", "value": "4", "ou": "iH7LSuDKBxU"}}}, "lcdIDgumilv_BJuZMglWlTz": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "BJuZMglWlTz", "target": "3.0", "target_dataelement": "A4BPhZhOrzc.BJuZMglWlTz", "completed": true, "de": "lcdIDgumilv", "target_period": "2014July", "value": "3", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "BJuZMglWlTz", "target": "2.0", "target_period": "2014July", "completed": false, "de": "lcdIDgumilv", "old_value": "4", "target_dataelement": "A4BPhZhOrzc.BJuZMglWlTz", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "BJuZMglWlTz", "target": "2.0", "target_dataelement": "A4BPhZhOrzc.BJuZMglWlTz", "completed": true, "de": "lcdIDgumilv", "target_period": "2014July", "value": "3", "ou": "iH7LSuDKBxU"}}}, "lcdIDgumilv_SyDcaTOW0JP": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "SyDcaTOW0JP", "target": "4.0", "target_dataelement": "A4BPhZhOrzc.SyDcaTOW0JP", "completed": true, "de": "lcdIDgumilv", "target_period": "2014July", "value": "2", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "SyDcaTOW0JP", "target": "4.0", "target_period": "2014July", "completed": false, "de": "lcdIDgumilv", "old_value": "4", "target_dataelement": "A4BPhZhOrzc.SyDcaTOW0JP", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "SyDcaTOW0JP", "target": "4.0", "target_dataelement": "A4BPhZhOrzc.SyDcaTOW0JP", "completed": true, "de": "lcdIDgumilv", "target_period": "2014July", "value": "3", "ou": "iH7LSuDKBxU"}}}, "mVwNk3foz3v_r5YXWoMvsX4": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"ou": "AsgiIABsA69", "de": "mVwNk3foz3v", "co": "r5YXWoMvsX4", "completed": true, "value": "2"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "r5YXWoMvsX4", "completed": false, "de": "mVwNk3foz3v", "old_value": "4", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"ou": "iH7LSuDKBxU", "de": "mVwNk3foz3v", "co": "r5YXWoMvsX4", "completed": true, "value": "3"}}}, "ngDrfoi85Oy_mlpia7QBdqY": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "mlpia7QBdqY", "target": "4.0", "target_dataelement": "tIW07Zp3vnv.mlpia7QBdqY", "completed": true, "de": "ngDrfoi85Oy", "target_period": "2014July", "value": "2", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "mlpia7QBdqY", "target": "2.0", "target_period": "2014July", "completed": false, "de": "ngDrfoi85Oy", "old_value": "4", "target_dataelement": "tIW07Zp3vnv.mlpia7QBdqY", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "mlpia7QBdqY", "target": "2.0", "target_dataelement": "tIW07Zp3vnv.mlpia7QBdqY", "completed": true, "de": "ngDrfoi85Oy", "target_period": "2014July", "value": "4", "ou": "iH7LSuDKBxU"}}}, "YSRj2rXWC0f_JIeF7OCEt6D": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "JIeF7OCEt6D", "target": "3.0", "target_dataelement": "I9MjFl6Y5hl.JIeF7OCEt6D", "completed": true, "de": "YSRj2rXWC0f", "target_period": "2014July", "value": "2", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "JIeF7OCEt6D", "target": "2.0", "target_period": "2014July", "completed": false, "de": "YSRj2rXWC0f", "old_value": "4", "target_dataelement": "I9MjFl6Y5hl.JIeF7OCEt6D", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "JIeF7OCEt6D", "target": "2.0", "target_dataelement": "I9MjFl6Y5hl.JIeF7OCEt6D", "completed": true, "de": "YSRj2rXWC0f", "target_period": "2014July", "value": "3", "ou": "iH7LSuDKBxU"}}}, "qRvbTVEmI6C_MT4SwuoV2pQ": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "MT4SwuoV2pQ", "target": "2.0", "target_dataelement": "dGATcuqhXtk.MT4SwuoV2pQ", "completed": true, "de": "qRvbTVEmI6C", "target_period": "2014July", "value": "2", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "MT4SwuoV2pQ", "target": "4.0", "target_period": "2014July", "completed": false, "de": "qRvbTVEmI6C", "old_value": "4", "target_dataelement": "dGATcuqhXtk.MT4SwuoV2pQ", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "MT4SwuoV2pQ", "target": "4.0", "target_dataelement": "dGATcuqhXtk.MT4SwuoV2pQ", "completed": true, "de": "qRvbTVEmI6C", "target_period": "2014July", "value": "4", "ou": "iH7LSuDKBxU"}}}, "WoUIOUcej6W_wfxDF7iGY3f": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "wfxDF7iGY3f", "target": "3.0", "target_dataelement": "U7ep9MxtQ1z.wfxDF7iGY3f", "completed": true, "de": "WoUIOUcej6W", "target_period": "2014July", "value": "2", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "wfxDF7iGY3f", "target": "4.0", "target_period": "2014July", "completed": false, "de": "WoUIOUcej6W", "old_value": "4", "target_dataelement": "U7ep9MxtQ1z.wfxDF7iGY3f", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "wfxDF7iGY3f", "target": "4.0", "target_dataelement": "U7ep9MxtQ1z.wfxDF7iGY3f", "completed": true, "de": "WoUIOUcej6W", "target_period": "2014July", "value": "3", "ou": "iH7LSuDKBxU"}}}, "FwpCBGQvYdL_oS2Oq1evsaK": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "oS2Oq1evsaK", "target": "3.0", "target_dataelement": "xBxqNNV8jLR.oS2Oq1evsaK", "completed": true, "de": "FwpCBGQvYdL", "target_period": "2014July", "value": "3", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "oS2Oq1evsaK", "target": "3.0", "target_period": "2014July", "completed": false, "de": "FwpCBGQvYdL", "old_value": "4", "target_dataelement": "xBxqNNV8jLR.oS2Oq1evsaK", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "oS2Oq1evsaK", "target": "3.0", "target_dataelement": "xBxqNNV8jLR.oS2Oq1evsaK", "completed": true, "de": "FwpCBGQvYdL", "target_period": "2014July", "value": "4", "ou": "iH7LSuDKBxU"}}}, "mVwNk3foz3v_ystqt8VT4Tp": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"ou": "AsgiIABsA69", "de": "mVwNk3foz3v", "co": "ystqt8VT4Tp", "completed": true, "value": "3"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "ystqt8VT4Tp", "completed": false, "de": "mVwNk3foz3v", "old_value": "4", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"ou": "iH7LSuDKBxU", "de": "mVwNk3foz3v", "co": "ystqt8VT4Tp", "completed": true, "value": "4"}}}, "mVwNk3foz3v_JnGowCNPR09": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"ou": "AsgiIABsA69", "de": "mVwNk3foz3v", "co": "JnGowCNPR09", "completed": true, "value": "3"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "JnGowCNPR09", "completed": false, "de": "mVwNk3foz3v", "old_value": "4", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"ou": "iH7LSuDKBxU", "de": "mVwNk3foz3v", "co": "JnGowCNPR09", "completed": true, "value": "4"}}}, "cf9SaENrA27_bkfyCurKXWV": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "bkfyCurKXWV", "target": "2.0", "target_dataelement": "KnfVAOcnV26.bkfyCurKXWV", "completed": true, "de": "cf9SaENrA27", "target_period": "2014July", "value": "2", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "bkfyCurKXWV", "target": "3.0", "target_period": "2014July", "completed": false, "de": "cf9SaENrA27", "old_value": "4", "target_dataelement": "KnfVAOcnV26.bkfyCurKXWV", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "bkfyCurKXWV", "target": "3.0", "target_dataelement": "KnfVAOcnV26.bkfyCurKXWV", "completed": true, "de": "cf9SaENrA27", "target_period": "2014July", "value": "2", "ou": "iH7LSuDKBxU"}}}, "lcdIDgumilv_QDSfLpYNZ3l": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "QDSfLpYNZ3l", "target": "3.0", "target_dataelement": "A4BPhZhOrzc.QDSfLpYNZ3l", "completed": true, "de": "lcdIDgumilv", "target_period": "2014July", "value": "4", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "QDSfLpYNZ3l", "target": "2.0", "target_period": "2014July", "completed": false, "de": "lcdIDgumilv", "old_value": "4", "target_dataelement": "A4BPhZhOrzc.QDSfLpYNZ3l", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "QDSfLpYNZ3l", "target": "2.0", "target_dataelement": "A4BPhZhOrzc.QDSfLpYNZ3l", "completed": true, "de": "lcdIDgumilv", "target_period": "2014July", "value": "4", "ou": "iH7LSuDKBxU"}}}, "xpXXurlwbNM_Z4bVJVRPKjl": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "Z4bVJVRPKjl", "target": "4.0", "target_dataelement": "BnsXYKt6iu6.Z4bVJVRPKjl", "completed": true, "de": "xpXXurlwbNM", "target_period": "2014July", "value": "2", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "Z4bVJVRPKjl", "target": "3.0", "target_period": "2014July", "completed": false, "de": "xpXXurlwbNM", "old_value": "4", "target_dataelement": "BnsXYKt6iu6.Z4bVJVRPKjl", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "Z4bVJVRPKjl", "target": "3.0", "target_dataelement": "BnsXYKt6iu6.Z4bVJVRPKjl", "completed": true, "de": "xpXXurlwbNM", "target_period": "2014July", "value": "4", "ou": "iH7LSuDKBxU"}}}, "FyJxMp5u7WP_ql8bSsHEnUN": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"ou": "AsgiIABsA69", "de": "FyJxMp5u7WP", "co": "ql8bSsHEnUN", "completed": true, "value": "2"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "ql8bSsHEnUN", "completed": false, "de": "FyJxMp5u7WP", "old_value": "4", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"ou": "iH7LSuDKBxU", "de": "FyJxMp5u7WP", "co": "ql8bSsHEnUN", "completed": true, "value": "3"}}}, "WoUIOUcej6W_QDSfLpYNZ3l": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "QDSfLpYNZ3l", "target": "3.0", "target_dataelement": "U7ep9MxtQ1z.QDSfLpYNZ3l", "completed": true, "de": "WoUIOUcej6W", "target_period": "2014July", "value": "4", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "QDSfLpYNZ3l", "target": "2.0", "target_period": "2014July", "completed": false, "de": "WoUIOUcej6W", "old_value": "4", "target_dataelement": "U7ep9MxtQ1z.QDSfLpYNZ3l", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "QDSfLpYNZ3l", "target": "2.0", "target_dataelement": "U7ep9MxtQ1z.QDSfLpYNZ3l", "completed": true, "de": "WoUIOUcej6W", "target_period": "2014July", "value": "4", "ou": "iH7LSuDKBxU"}}}, "mVwNk3foz3v_bkfyCurKXWV": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"ou": "AsgiIABsA69", "de": "mVwNk3foz3v", "co": "bkfyCurKXWV", "completed": true, "value": "3"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "bkfyCurKXWV", "completed": false, "de": "mVwNk3foz3v", "old_value": "4", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"ou": "iH7LSuDKBxU", "de": "mVwNk3foz3v", "co": "bkfyCurKXWV", "completed": true, "value": "3"}}}, "G8OZbMTgCQ6_WgIlmdIhlpD": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"ou": "AsgiIABsA69", "de": "G8OZbMTgCQ6", "co": "WgIlmdIhlpD", "completed": true, "value": "2"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "WgIlmdIhlpD", "completed": false, "de": "G8OZbMTgCQ6", "old_value": "4", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"ou": "iH7LSuDKBxU", "de": "G8OZbMTgCQ6", "co": "WgIlmdIhlpD", "completed": true, "value": "2"}}}, "xpXXurlwbNM_Heme7D8HT30": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "Heme7D8HT30", "target": "3.0", "target_dataelement": "BnsXYKt6iu6.Heme7D8HT30", "completed": true, "de": "xpXXurlwbNM", "target_period": "2014July", "value": "3", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "Heme7D8HT30", "target": "3.0", "target_period": "2014July", "completed": false, "de": "xpXXurlwbNM", "old_value": "4", "target_dataelement": "BnsXYKt6iu6.Heme7D8HT30", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "Heme7D8HT30", "target": "3.0", "target_dataelement": "BnsXYKt6iu6.Heme7D8HT30", "completed": true, "de": "xpXXurlwbNM", "target_period": "2014July", "value": "2", "ou": "iH7LSuDKBxU"}}}, "AG0rLmFA5Vf_LiOZqC8R4y0": {"formula": "PriorEstimate", "data": {"AsgiIABsA69": {"ou": "AsgiIABsA69", "de": "AG0rLmFA5Vf", "co": "LiOZqC8R4y0", "completed": true, "value": "2"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "LiOZqC8R4y0", "completed": false, "de": "AG0rLmFA5Vf", "old_value": "4", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"ou": "iH7LSuDKBxU", "de": "AG0rLmFA5Vf", "co": "LiOZqC8R4y0", "completed": true, "value": "4"}}}, "lcdIDgumilv_dUwc6pkKgmM": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "dUwc6pkKgmM", "target": "3.0", "target_dataelement": "A4BPhZhOrzc.dUwc6pkKgmM", "completed": true, "de": "lcdIDgumilv", "target_period": "2014July", "value": "3", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "dUwc6pkKgmM", "target": "3.0", "target_period": "2014July", "completed": false, "de": "lcdIDgumilv", "old_value": "4", "target_dataelement": "A4BPhZhOrzc.dUwc6pkKgmM", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "dUwc6pkKgmM", "target": "3.0", "target_dataelement": "A4BPhZhOrzc.dUwc6pkKgmM", "completed": true, "de": "lcdIDgumilv", "target_period": "2014July", "value": "3", "ou": "iH7LSuDKBxU"}}}, "tndqO9qdPtg_WgIlmdIhlpD": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"ou": "AsgiIABsA69", "de": "tndqO9qdPtg", "co": "WgIlmdIhlpD", "completed": true, "value": "1"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "WgIlmdIhlpD", "completed": false, "de": "tndqO9qdPtg", "old_value": "4", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"ou": "iH7LSuDKBxU", "de": "tndqO9qdPtg", "co": "WgIlmdIhlpD", "completed": true, "value": "1"}}}, "cf9SaENrA27_r5YXWoMvsX4": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "r5YXWoMvsX4", "target": "3.0", "target_dataelement": "KnfVAOcnV26.r5YXWoMvsX4", "completed": true, "de": "cf9SaENrA27", "target_period": "2014July", "value": "2", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "r5YXWoMvsX4", "target": "3.0", "target_period": "2014July", "completed": false, "de": "cf9SaENrA27", "old_value": "4", "target_dataelement": "KnfVAOcnV26.r5YXWoMvsX4", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "r5YXWoMvsX4", "target": "3.0", "target_dataelement": "KnfVAOcnV26.r5YXWoMvsX4", "completed": true, "de": "cf9SaENrA27", "target_period": "2014July", "value": "3", "ou": "iH7LSuDKBxU"}}}, "YSRj2rXWC0f_VIPqyvWbwDU": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "VIPqyvWbwDU", "target": "4.0", "target_dataelement": "I9MjFl6Y5hl.VIPqyvWbwDU", "completed": true, "de": "YSRj2rXWC0f", "target_period": "2014July", "value": "4", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "VIPqyvWbwDU", "target": "4.0", "target_period": "2014July", "completed": false, "de": "YSRj2rXWC0f", "old_value": "4", "target_dataelement": "I9MjFl6Y5hl.VIPqyvWbwDU", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "VIPqyvWbwDU", "target": "4.0", "target_dataelement": "I9MjFl6Y5hl.VIPqyvWbwDU", "completed": true, "de": "YSRj2rXWC0f", "target_period": "2014July", "value": "3", "ou": "iH7LSuDKBxU"}}}, "bJ84f27rqDB_ICiTJsU1Vec": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "ICiTJsU1Vec", "target": "4.0", "target_dataelement": "Ivu48nkpIw2.ICiTJsU1Vec", "completed": true, "de": "bJ84f27rqDB", "target_period": "2014July", "value": "2", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "ICiTJsU1Vec", "target": "3.0", "target_period": "2014July", "completed": false, "de": "bJ84f27rqDB", "old_value": "4", "target_dataelement": "Ivu48nkpIw2.ICiTJsU1Vec", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "ICiTJsU1Vec", "target": "3.0", "target_dataelement": "Ivu48nkpIw2.ICiTJsU1Vec", "completed": true, "de": "bJ84f27rqDB", "target_period": "2014July", "value": "4", "ou": "iH7LSuDKBxU"}}}, "WoUIOUcej6W_dqChjQjl0ZH": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "dqChjQjl0ZH", "target": "4.0", "target_dataelement": "U7ep9MxtQ1z.dqChjQjl0ZH", "completed": true, "de": "WoUIOUcej6W", "target_period": "2014July", "value": "4", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "dqChjQjl0ZH", "target": "3.0", "target_period": "2014July", "completed": false, "de": "WoUIOUcej6W", "old_value": "4", "target_dataelement": "U7ep9MxtQ1z.dqChjQjl0ZH", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "dqChjQjl0ZH", "target": "3.0", "target_dataelement": "U7ep9MxtQ1z.dqChjQjl0ZH", "completed": true, "de": "WoUIOUcej6W", "target_period": "2014July", "value": "4", "ou": "iH7LSuDKBxU"}}}, "qRvbTVEmI6C_TZJQRkPRJm4": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "TZJQRkPRJm4", "target": "2.0", "target_dataelement": "dGATcuqhXtk.TZJQRkPRJm4", "completed": true, "de": "qRvbTVEmI6C", "target_period": "2014July", "value": "3", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "TZJQRkPRJm4", "target": "2.0", "target_period": "2014July", "completed": false, "de": "qRvbTVEmI6C", "old_value": "4", "target_dataelement": "dGATcuqhXtk.TZJQRkPRJm4", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "TZJQRkPRJm4", "target": "2.0", "target_dataelement": "dGATcuqhXtk.TZJQRkPRJm4", "completed": true, "de": "qRvbTVEmI6C", "target_period": "2014July", "value": "4", "ou": "iH7LSuDKBxU"}}}, "uNGeyGIsN7W_deTgGupUgr3": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "deTgGupUgr3", "target": "3.0", "target_dataelement": "giYw5xsn6Hu.deTgGupUgr3", "completed": true, "de": "uNGeyGIsN7W", "target_period": "2014July", "value": "4", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "deTgGupUgr3", "target": "2.0", "target_period": "2014July", "completed": false, "de": "uNGeyGIsN7W", "old_value": "4", "target_dataelement": "giYw5xsn6Hu.deTgGupUgr3", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "deTgGupUgr3", "target": "2.0", "target_dataelement": "giYw5xsn6Hu.deTgGupUgr3", "completed": true, "de": "uNGeyGIsN7W", "target_period": "2014July", "value": "2", "ou": "iH7LSuDKBxU"}}}, "WoUIOUcej6W_fuzYIcfLZN2": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "fuzYIcfLZN2", "target": "2.0", "target_dataelement": "U7ep9MxtQ1z.fuzYIcfLZN2", "completed": true, "de": "WoUIOUcej6W", "target_period": "2014July", "value": "4", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "fuzYIcfLZN2", "target": "2.0", "target_period": "2014July", "completed": false, "de": "WoUIOUcej6W", "old_value": "4", "target_dataelement": "U7ep9MxtQ1z.fuzYIcfLZN2", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "fuzYIcfLZN2", "target": "2.0", "target_dataelement": "U7ep9MxtQ1z.fuzYIcfLZN2", "completed": true, "de": "WoUIOUcej6W", "target_period": "2014July", "value": "4", "ou": "iH7LSuDKBxU"}}}, "WoUIOUcej6W_nrQIoh49aGU": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "nrQIoh49aGU", "target": "4.0", "target_dataelement": "U7ep9MxtQ1z.nrQIoh49aGU", "completed": true, "de": "WoUIOUcej6W", "target_period": "2014July", "value": "2", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "nrQIoh49aGU", "target": "4.0", "target_period": "2014July", "completed": false, "de": "WoUIOUcej6W", "old_value": "4", "target_dataelement": "U7ep9MxtQ1z.nrQIoh49aGU", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "nrQIoh49aGU", "target": "4.0", "target_dataelement": "U7ep9MxtQ1z.nrQIoh49aGU", "completed": true, "de": "WoUIOUcej6W", "target_period": "2014July", "value": "2", "ou": "iH7LSuDKBxU"}}}, "nc1E1TyiGhG_mQjKnpOz1I8": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "mQjKnpOz1I8", "target": "2.0", "target_dataelement": "gAS04LMK9UX.mQjKnpOz1I8", "completed": true, "de": "nc1E1TyiGhG", "target_period": "2014July", "value": "2", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "mQjKnpOz1I8", "target": "4.0", "target_period": "2014July", "completed": false, "de": "nc1E1TyiGhG", "old_value": "4", "target_dataelement": "gAS04LMK9UX.mQjKnpOz1I8", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "mQjKnpOz1I8", "target": "4.0", "target_dataelement": "gAS04LMK9UX.mQjKnpOz1I8", "completed": true, "de": "nc1E1TyiGhG", "target_period": "2014July", "value": "4", "ou": "iH7LSuDKBxU"}}}, "bJ84f27rqDB_TZJQRkPRJm4": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "TZJQRkPRJm4", "target": "2.0", "target_dataelement": "Ivu48nkpIw2.TZJQRkPRJm4", "completed": true, "de": "bJ84f27rqDB", "target_period": "2014July", "value": "2", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "TZJQRkPRJm4", "target": "2.0", "target_period": "2014July", "completed": false, "de": "bJ84f27rqDB", "old_value": "4", "target_dataelement": "Ivu48nkpIw2.TZJQRkPRJm4", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "TZJQRkPRJm4", "target": "2.0", "target_dataelement": "Ivu48nkpIw2.TZJQRkPRJm4", "completed": true, "de": "bJ84f27rqDB", "target_period": "2014July", "value": "4", "ou": "iH7LSuDKBxU"}}}, "lcdIDgumilv_QlQ95KGkgR6": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "QlQ95KGkgR6", "target": "3.0", "target_dataelement": "A4BPhZhOrzc.QlQ95KGkgR6", "completed": true, "de": "lcdIDgumilv", "target_period": "2014July", "value": "3", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "QlQ95KGkgR6", "target": "2.0", "target_period": "2014July", "completed": false, "de": "lcdIDgumilv", "old_value": "4", "target_dataelement": "A4BPhZhOrzc.QlQ95KGkgR6", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "QlQ95KGkgR6", "target": "2.0", "target_dataelement": "A4BPhZhOrzc.QlQ95KGkgR6", "completed": true, "de": "lcdIDgumilv", "target_period": "2014July", "value": "3", "ou": "iH7LSuDKBxU"}}}, "rNaeaP69Ml0_zPf9YtxdJJH": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "zPf9YtxdJJH", "target": "2.0", "target_dataelement": "l7yZ1DOmYbU.zPf9YtxdJJH", "completed": true, "de": "rNaeaP69Ml0", "target_period": "2014July", "value": "4", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "zPf9YtxdJJH", "target": "2.0", "target_period": "2014July", "completed": false, "de": "rNaeaP69Ml0", "old_value": "4", "target_dataelement": "l7yZ1DOmYbU.zPf9YtxdJJH", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "zPf9YtxdJJH", "target": "2.0", "target_dataelement": "l7yZ1DOmYbU.zPf9YtxdJJH", "completed": true, "de": "rNaeaP69Ml0", "target_period": "2014July", "value": "4", "ou": "iH7LSuDKBxU"}}}, "cf9SaENrA27_syxO1e4huIX": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "syxO1e4huIX", "target": "4.0", "target_dataelement": "KnfVAOcnV26.syxO1e4huIX", "completed": true, "de": "cf9SaENrA27", "target_period": "2014July", "value": "3", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "syxO1e4huIX", "target": "4.0", "target_period": "2014July", "completed": false, "de": "cf9SaENrA27", "old_value": "4", "target_dataelement": "KnfVAOcnV26.syxO1e4huIX", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "syxO1e4huIX", "target": "4.0", "target_dataelement": "KnfVAOcnV26.syxO1e4huIX", "completed": true, "de": "cf9SaENrA27", "target_period": "2014July", "value": "4", "ou": "iH7LSuDKBxU"}}}, "WoUIOUcej6W_ZbmI2XtXHIS": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "ZbmI2XtXHIS", "target": "4.0", "target_dataelement": "U7ep9MxtQ1z.ZbmI2XtXHIS", "completed": true, "de": "WoUIOUcej6W", "target_period": "2014July", "value": "3", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "ZbmI2XtXHIS", "target": "2.0", "target_period": "2014July", "completed": false, "de": "WoUIOUcej6W", "old_value": "4", "target_dataelement": "U7ep9MxtQ1z.ZbmI2XtXHIS", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "ZbmI2XtXHIS", "target": "2.0", "target_dataelement": "U7ep9MxtQ1z.ZbmI2XtXHIS", "completed": true, "de": "WoUIOUcej6W", "target_period": "2014July", "value": "2", "ou": "iH7LSuDKBxU"}}}, "AG0rLmFA5Vf_WLpVc8qwm57": {"formula": "PriorEstimate", "data": {"AsgiIABsA69": {"ou": "AsgiIABsA69", "de": "AG0rLmFA5Vf", "co": "WLpVc8qwm57", "completed": true, "value": "4"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "WLpVc8qwm57", "completed": false, "de": "AG0rLmFA5Vf", "old_value": "4", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"ou": "iH7LSuDKBxU", "de": "AG0rLmFA5Vf", "co": "WLpVc8qwm57", "completed": true, "value": "2"}}}, "ngDrfoi85Oy_zSS1gwkIIu8": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "zSS1gwkIIu8", "target": "4.0", "target_dataelement": "tIW07Zp3vnv.zSS1gwkIIu8", "completed": true, "de": "ngDrfoi85Oy", "target_period": "2014July", "value": "2", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "zSS1gwkIIu8", "target": "2.0", "target_period": "2014July", "completed": false, "de": "ngDrfoi85Oy", "old_value": "4", "target_dataelement": "tIW07Zp3vnv.zSS1gwkIIu8", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "zSS1gwkIIu8", "target": "2.0", "target_dataelement": "tIW07Zp3vnv.zSS1gwkIIu8", "completed": true, "de": "ngDrfoi85Oy", "target_period": "2014July", "value": "4", "ou": "iH7LSuDKBxU"}}}, "xpXXurlwbNM_TkxAyok9vQZ": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "TkxAyok9vQZ", "target": "3.0", "target_dataelement": "BnsXYKt6iu6.TkxAyok9vQZ", "completed": true, "de": "xpXXurlwbNM", "target_period": "2014July", "value": "4", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "TkxAyok9vQZ", "target": "3.0", "target_period": "2014July", "completed": false, "de": "xpXXurlwbNM", "old_value": "4", "target_dataelement": "BnsXYKt6iu6.TkxAyok9vQZ", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "TkxAyok9vQZ", "target": "3.0", "target_dataelement": "BnsXYKt6iu6.TkxAyok9vQZ", "completed": true, "de": "xpXXurlwbNM", "target_period": "2014July", "value": "3", "ou": "iH7LSuDKBxU"}}}, "bJ84f27rqDB_BPGkOcPjPS7": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "BPGkOcPjPS7", "target": "4.0", "target_dataelement": "Ivu48nkpIw2.BPGkOcPjPS7", "completed": true, "de": "bJ84f27rqDB", "target_period": "2014July", "value": "4", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "BPGkOcPjPS7", "target": "2.0", "target_period": "2014July", "completed": false, "de": "bJ84f27rqDB", "old_value": "4", "target_dataelement": "Ivu48nkpIw2.BPGkOcPjPS7", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "BPGkOcPjPS7", "target": "2.0", "target_dataelement": "Ivu48nkpIw2.BPGkOcPjPS7", "completed": true, "de": "bJ84f27rqDB", "target_period": "2014July", "value": "4", "ou": "iH7LSuDKBxU"}}}, "gbvUDbZWxUS_xCnCQxpSTUJ": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "xCnCQxpSTUJ", "target": "4.0", "target_dataelement": "hCLl9rGfYpb.xCnCQxpSTUJ", "completed": true, "de": "gbvUDbZWxUS", "target_period": "2014July", "value": "4", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "xCnCQxpSTUJ", "target": "3.0", "target_period": "2014July", "completed": false, "de": "gbvUDbZWxUS", "old_value": "4", "target_dataelement": "hCLl9rGfYpb.xCnCQxpSTUJ", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "xCnCQxpSTUJ", "target": "3.0", "target_dataelement": "hCLl9rGfYpb.xCnCQxpSTUJ", "completed": true, "de": "gbvUDbZWxUS", "target_period": "2014July", "value": "2", "ou": "iH7LSuDKBxU"}}}, "FwpCBGQvYdL_BktmzfgqCjX": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "BktmzfgqCjX", "target": "3.0", "target_dataelement": "xBxqNNV8jLR.BktmzfgqCjX", "completed": true, "de": "FwpCBGQvYdL", "target_period": "2014July", "value": "2", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "BktmzfgqCjX", "target": "2.0", "target_period": "2014July", "completed": false, "de": "FwpCBGQvYdL", "old_value": "4", "target_dataelement": "xBxqNNV8jLR.BktmzfgqCjX", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "BktmzfgqCjX", "target": "2.0", "target_dataelement": "xBxqNNV8jLR.BktmzfgqCjX", "completed": true, "de": "FwpCBGQvYdL", "target_period": "2014July", "value": "3", "ou": "iH7LSuDKBxU"}}}, "FwpCBGQvYdL_zSS1gwkIIu8": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "zSS1gwkIIu8", "target": "3.0", "target_dataelement": "xBxqNNV8jLR.zSS1gwkIIu8", "completed": true, "de": "FwpCBGQvYdL", "target_period": "2014July", "value": "3", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "zSS1gwkIIu8", "target": "3.0", "target_period": "2014July", "completed": false, "de": "FwpCBGQvYdL", "old_value": "4", "target_dataelement": "xBxqNNV8jLR.zSS1gwkIIu8", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "zSS1gwkIIu8", "target": "3.0", "target_dataelement": "xBxqNNV8jLR.zSS1gwkIIu8", "completed": true, "de": "FwpCBGQvYdL", "target_period": "2014July", "value": "4", "ou": "iH7LSuDKBxU"}}}, "AG0rLmFA5Vf_Ac77OfQEK7D": {"formula": "PriorEstimate", "data": {"AsgiIABsA69": {"ou": "AsgiIABsA69", "de": "AG0rLmFA5Vf", "co": "Ac77OfQEK7D", "completed": true, "value": "3"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "Ac77OfQEK7D", "completed": false, "de": "AG0rLmFA5Vf", "old_value": "4", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"ou": "iH7LSuDKBxU", "de": "AG0rLmFA5Vf", "co": "Ac77OfQEK7D", "completed": true, "value": "3"}}}, "WoUIOUcej6W_BJuZMglWlTz": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "BJuZMglWlTz", "target": "2.0", "target_dataelement": "U7ep9MxtQ1z.BJuZMglWlTz", "completed": true, "de": "WoUIOUcej6W", "target_period": "2014July", "value": "2", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "BJuZMglWlTz", "target": "3.0", "target_period": "2014July", "completed": false, "de": "WoUIOUcej6W", "old_value": "4", "target_dataelement": "U7ep9MxtQ1z.BJuZMglWlTz", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "BJuZMglWlTz", "target": "3.0", "target_dataelement": "U7ep9MxtQ1z.BJuZMglWlTz", "completed": true, "de": "WoUIOUcej6W", "target_period": "2014July", "value": "3", "ou": "iH7LSuDKBxU"}}}, "xpXXurlwbNM_rwsWnkaJ5HR": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "rwsWnkaJ5HR", "target": "3.0", "target_dataelement": "BnsXYKt6iu6.rwsWnkaJ5HR", "completed": true, "de": "xpXXurlwbNM", "target_period": "2014July", "value": "4", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "rwsWnkaJ5HR", "target": "3.0", "target_period": "2014July", "completed": false, "de": "xpXXurlwbNM", "old_value": "4", "target_dataelement": "BnsXYKt6iu6.rwsWnkaJ5HR", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "rwsWnkaJ5HR", "target": "3.0", "target_dataelement": "BnsXYKt6iu6.rwsWnkaJ5HR", "completed": true, "de": "xpXXurlwbNM", "target_period": "2014July", "value": "4", "ou": "iH7LSuDKBxU"}}}, "mW1g85YGrA5_X24qB0Zknnm": {"formula": "PriorEstimate", "data": {"AsgiIABsA69": {"ou": "AsgiIABsA69", "de": "mW1g85YGrA5", "co": "X24qB0Zknnm", "completed": true, "value": "3"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "X24qB0Zknnm", "completed": false, "de": "mW1g85YGrA5", "old_value": "4", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"ou": "iH7LSuDKBxU", "de": "mW1g85YGrA5", "co": "X24qB0Zknnm", "completed": true, "value": "3"}}}, "mVwNk3foz3v_syxO1e4huIX": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"ou": "AsgiIABsA69", "de": "mVwNk3foz3v", "co": "syxO1e4huIX", "completed": true, "value": "4"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "syxO1e4huIX", "completed": false, "de": "mVwNk3foz3v", "old_value": "4", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"ou": "iH7LSuDKBxU", "de": "mVwNk3foz3v", "co": "syxO1e4huIX", "completed": true, "value": "4"}}}, "QnFeukGopwx_jjfebeJ6pbV": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "jjfebeJ6pbV", "target": "3.0", "target_dataelement": "zDMxdyL6JWq.jjfebeJ6pbV", "completed": true, "de": "QnFeukGopwx", "target_period": "2014July", "value": "4", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "jjfebeJ6pbV", "target": "4.0", "target_period": "2014July", "completed": false, "de": "QnFeukGopwx", "old_value": "4", "target_dataelement": "zDMxdyL6JWq.jjfebeJ6pbV", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "jjfebeJ6pbV", "target": "4.0", "target_dataelement": "zDMxdyL6JWq.jjfebeJ6pbV", "completed": true, "de": "QnFeukGopwx", "target_period": "2014July", "value": "4", "ou": "iH7LSuDKBxU"}}}, "FPISNWdoGb1_kOqXqu9iOHV": {"formula": "PriorEstimate", "data": {"AsgiIABsA69": {"ou": "AsgiIABsA69", "de": "FPISNWdoGb1", "co": "kOqXqu9iOHV", "completed": true, "value": "3"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "kOqXqu9iOHV", "completed": false, "de": "FPISNWdoGb1", "old_value": "4", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"ou": "iH7LSuDKBxU", "de": "FPISNWdoGb1", "co": "kOqXqu9iOHV", "completed": true, "value": "4"}}}, "ngDrfoi85Oy_J6W3kbELkGw": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "J6W3kbELkGw", "target": "3.0", "target_dataelement": "tIW07Zp3vnv.J6W3kbELkGw", "completed": true, "de": "ngDrfoi85Oy", "target_period": "2014July", "value": "4", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "J6W3kbELkGw", "target": "3.0", "target_period": "2014July", "completed": false, "de": "ngDrfoi85Oy", "old_value": "4", "target_dataelement": "tIW07Zp3vnv.J6W3kbELkGw", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "J6W3kbELkGw", "target": "3.0", "target_dataelement": "tIW07Zp3vnv.J6W3kbELkGw", "completed": true, "de": "ngDrfoi85Oy", "target_period": "2014July", "value": "4", "ou": "iH7LSuDKBxU"}}}, "cf9SaENrA27_UbXIA05jKZB": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "UbXIA05jKZB", "target": "2.0", "target_dataelement": "KnfVAOcnV26.UbXIA05jKZB", "completed": true, "de": "cf9SaENrA27", "target_period": "2014July", "value": "2", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "UbXIA05jKZB", "target": "4.0", "target_period": "2014July", "completed": false, "de": "cf9SaENrA27", "old_value": "4", "target_dataelement": "KnfVAOcnV26.UbXIA05jKZB", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "UbXIA05jKZB", "target": "4.0", "target_dataelement": "KnfVAOcnV26.UbXIA05jKZB", "completed": true, "de": "cf9SaENrA27", "target_period": "2014July", "value": "4", "ou": "iH7LSuDKBxU"}}}, "xpXXurlwbNM_JIeF7OCEt6D": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "JIeF7OCEt6D", "target": "4.0", "target_dataelement": "BnsXYKt6iu6.JIeF7OCEt6D", "completed": true, "de": "xpXXurlwbNM", "target_period": "2014July", "value": "3", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "JIeF7OCEt6D", "target": "2.0", "target_period": "2014July", "completed": false, "de": "xpXXurlwbNM", "old_value": "4", "target_dataelement": "BnsXYKt6iu6.JIeF7OCEt6D", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "JIeF7OCEt6D", "target": "2.0", "target_dataelement": "BnsXYKt6iu6.JIeF7OCEt6D", "completed": true, "de": "xpXXurlwbNM", "target_period": "2014July", "value": "2", "ou": "iH7LSuDKBxU"}}}, "rBstKKNXmYA_eHhQeZB29hz": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "eHhQeZB29hz", "target": "2.0", "target_dataelement": "ZLsVcUh3yWM.eHhQeZB29hz", "completed": true, "de": "rBstKKNXmYA", "target_period": "2014July", "value": "4", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "eHhQeZB29hz", "target": "3.0", "target_period": "2014July", "completed": false, "de": "rBstKKNXmYA", "old_value": "4", "target_dataelement": "ZLsVcUh3yWM.eHhQeZB29hz", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "eHhQeZB29hz", "target": "3.0", "target_dataelement": "ZLsVcUh3yWM.eHhQeZB29hz", "completed": true, "de": "rBstKKNXmYA", "target_period": "2014July", "value": "3", "ou": "iH7LSuDKBxU"}}}, "gbvUDbZWxUS_iBa5lgXgvwk": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "iBa5lgXgvwk", "target": "4.0", "target_dataelement": "hCLl9rGfYpb.iBa5lgXgvwk", "completed": true, "de": "gbvUDbZWxUS", "target_period": "2014July", "value": "2", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "iBa5lgXgvwk", "target": "4.0", "target_period": "2014July", "completed": false, "de": "gbvUDbZWxUS", "old_value": "4", "target_dataelement": "hCLl9rGfYpb.iBa5lgXgvwk", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "iBa5lgXgvwk", "target": "4.0", "target_dataelement": "hCLl9rGfYpb.iBa5lgXgvwk", "completed": true, "de": "gbvUDbZWxUS", "target_period": "2014July", "value": "4", "ou": "iH7LSuDKBxU"}}}, "mVwNk3foz3v_D116dzscO4G": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"ou": "AsgiIABsA69", "de": "mVwNk3foz3v", "co": "D116dzscO4G", "completed": true, "value": "3"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "D116dzscO4G", "completed": false, "de": "mVwNk3foz3v", "old_value": "4", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"ou": "iH7LSuDKBxU", "de": "mVwNk3foz3v", "co": "D116dzscO4G", "completed": true, "value": "2"}}}, "rNaeaP69Ml0_pq1B5YRvk3w": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "pq1B5YRvk3w", "target": "3.0", "target_dataelement": "l7yZ1DOmYbU.pq1B5YRvk3w", "completed": true, "de": "rNaeaP69Ml0", "target_period": "2014July", "value": "2", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "pq1B5YRvk3w", "target": "4.0", "target_period": "2014July", "completed": false, "de": "rNaeaP69Ml0", "old_value": "4", "target_dataelement": "l7yZ1DOmYbU.pq1B5YRvk3w", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "pq1B5YRvk3w", "target": "4.0", "target_dataelement": "l7yZ1DOmYbU.pq1B5YRvk3w", "completed": true, "de": "rNaeaP69Ml0", "target_period": "2014July", "value": "2", "ou": "iH7LSuDKBxU"}}}, "xpXXurlwbNM_a4OM9bKggAT": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "a4OM9bKggAT", "target": "4.0", "target_dataelement": "BnsXYKt6iu6.a4OM9bKggAT", "completed": true, "de": "xpXXurlwbNM", "target_period": "2014July", "value": "2", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "a4OM9bKggAT", "target": "3.0", "target_period": "2014July", "completed": false, "de": "xpXXurlwbNM", "old_value": "4", "target_dataelement": "BnsXYKt6iu6.a4OM9bKggAT", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "a4OM9bKggAT", "target": "3.0", "target_dataelement": "BnsXYKt6iu6.a4OM9bKggAT", "completed": true, "de": "xpXXurlwbNM", "target_period": "2014July", "value": "4", "ou": "iH7LSuDKBxU"}}}, "dozTSGrBvVj_bltcOiiZeO5": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "bltcOiiZeO5", "target": "2.0", "target_dataelement": "lf7gU0lfEJt.bltcOiiZeO5", "completed": true, "de": "dozTSGrBvVj", "target_period": "2014July", "value": "3", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "bltcOiiZeO5", "target": "4.0", "target_period": "2014July", "completed": false, "de": "dozTSGrBvVj", "old_value": "4", "target_dataelement": "lf7gU0lfEJt.bltcOiiZeO5", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "bltcOiiZeO5", "target": "4.0", "target_dataelement": "lf7gU0lfEJt.bltcOiiZeO5", "completed": true, "de": "dozTSGrBvVj", "target_period": "2014July", "value": "3", "ou": "iH7LSuDKBxU"}}}, "mW1g85YGrA5_RKIzrSFCqLg": {"formula": "PriorEstimate", "data": {"AsgiIABsA69": {"ou": "AsgiIABsA69", "de": "mW1g85YGrA5", "co": "RKIzrSFCqLg", "completed": true, "value": "3"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "RKIzrSFCqLg", "completed": false, "de": "mW1g85YGrA5", "old_value": "4", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"ou": "iH7LSuDKBxU", "de": "mW1g85YGrA5", "co": "RKIzrSFCqLg", "completed": true, "value": "3"}}}, "xpXXurlwbNM_BEi0yw6WwBa": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "BEi0yw6WwBa", "target": "3.0", "target_dataelement": "BnsXYKt6iu6.BEi0yw6WwBa", "completed": true, "de": "xpXXurlwbNM", "target_period": "2014July", "value": "4", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "BEi0yw6WwBa", "target": "2.0", "target_period": "2014July", "completed": false, "de": "xpXXurlwbNM", "old_value": "4", "target_dataelement": "BnsXYKt6iu6.BEi0yw6WwBa", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "BEi0yw6WwBa", "target": "2.0", "target_dataelement": "BnsXYKt6iu6.BEi0yw6WwBa", "completed": true, "de": "xpXXurlwbNM", "target_period": "2014July", "value": "3", "ou": "iH7LSuDKBxU"}}}, "WoUIOUcej6W_drXDRIxLVzv": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "drXDRIxLVzv", "target": "4.0", "target_dataelement": "U7ep9MxtQ1z.drXDRIxLVzv", "completed": true, "de": "WoUIOUcej6W", "target_period": "2014July", "value": "2", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "drXDRIxLVzv", "target": "3.0", "target_period": "2014July", "completed": false, "de": "WoUIOUcej6W", "old_value": "4", "target_dataelement": "U7ep9MxtQ1z.drXDRIxLVzv", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "drXDRIxLVzv", "target": "3.0", "target_dataelement": "U7ep9MxtQ1z.drXDRIxLVzv", "completed": true, "de": "WoUIOUcej6W", "target_period": "2014July", "value": "4", "ou": "iH7LSuDKBxU"}}}, "mW1g85YGrA5_Fy6rX1T25xH": {"formula": "PriorEstimate", "data": {"AsgiIABsA69": {"ou": "AsgiIABsA69", "de": "mW1g85YGrA5", "co": "Fy6rX1T25xH", "completed": true, "value": "2"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "Fy6rX1T25xH", "completed": false, "de": "mW1g85YGrA5", "old_value": "4", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"ou": "iH7LSuDKBxU", "de": "mW1g85YGrA5", "co": "Fy6rX1T25xH", "completed": true, "value": "3"}}}, "bJ84f27rqDB_Efwc5ipDSTk": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "Efwc5ipDSTk", "target": "3.0", "target_dataelement": "Ivu48nkpIw2.Efwc5ipDSTk", "completed": true, "de": "bJ84f27rqDB", "target_period": "2014July", "value": "4", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "Efwc5ipDSTk", "target": "4.0", "target_period": "2014July", "completed": false, "de": "bJ84f27rqDB", "old_value": "4", "target_dataelement": "Ivu48nkpIw2.Efwc5ipDSTk", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "Efwc5ipDSTk", "target": "4.0", "target_dataelement": "Ivu48nkpIw2.Efwc5ipDSTk", "completed": true, "de": "bJ84f27rqDB", "target_period": "2014July", "value": "4", "ou": "iH7LSuDKBxU"}}}, "rBstKKNXmYA_jjfebeJ6pbV": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "jjfebeJ6pbV", "target": "4.0", "target_dataelement": "ZLsVcUh3yWM.jjfebeJ6pbV", "completed": true, "de": "rBstKKNXmYA", "target_period": "2014July", "value": "4", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "jjfebeJ6pbV", "target": "3.0", "target_period": "2014July", "completed": false, "de": "rBstKKNXmYA", "old_value": "4", "target_dataelement": "ZLsVcUh3yWM.jjfebeJ6pbV", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "jjfebeJ6pbV", "target": "3.0", "target_dataelement": "ZLsVcUh3yWM.jjfebeJ6pbV", "completed": true, "de": "rBstKKNXmYA", "target_period": "2014July", "value": "3", "ou": "iH7LSuDKBxU"}}}, "dozTSGrBvVj_uMeEFdAzqKS": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "uMeEFdAzqKS", "target": "2.0", "target_dataelement": "lf7gU0lfEJt.uMeEFdAzqKS", "completed": true, "de": "dozTSGrBvVj", "target_period": "2014July", "value": "4", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "uMeEFdAzqKS", "target": "3.0", "target_period": "2014July", "completed": false, "de": "dozTSGrBvVj", "old_value": "4", "target_dataelement": "lf7gU0lfEJt.uMeEFdAzqKS", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "uMeEFdAzqKS", "target": "3.0", "target_dataelement": "lf7gU0lfEJt.uMeEFdAzqKS", "completed": true, "de": "dozTSGrBvVj", "target_period": "2014July", "value": "3", "ou": "iH7LSuDKBxU"}}}, "lcdIDgumilv_oplxxXgoehP": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "oplxxXgoehP", "target": "4.0", "target_dataelement": "A4BPhZhOrzc.oplxxXgoehP", "completed": true, "de": "lcdIDgumilv", "target_period": "2014July", "value": "4", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "oplxxXgoehP", "target": "2.0", "target_period": "2014July", "completed": false, "de": "lcdIDgumilv", "old_value": "4", "target_dataelement": "A4BPhZhOrzc.oplxxXgoehP", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "oplxxXgoehP", "target": "2.0", "target_dataelement": "A4BPhZhOrzc.oplxxXgoehP", "completed": true, "de": "lcdIDgumilv", "target_period": "2014July", "value": "2", "ou": "iH7LSuDKBxU"}}}, "mVwNk3foz3v_WpsmWKDTfdX": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"ou": "AsgiIABsA69", "de": "mVwNk3foz3v", "co": "WpsmWKDTfdX", "completed": true, "value": "4"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "WpsmWKDTfdX", "completed": false, "de": "mVwNk3foz3v", "old_value": "4", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"ou": "iH7LSuDKBxU", "de": "mVwNk3foz3v", "co": "WpsmWKDTfdX", "completed": true, "value": "2"}}}, "YSRj2rXWC0f_a4OM9bKggAT": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "a4OM9bKggAT", "target": "2.0", "target_dataelement": "I9MjFl6Y5hl.a4OM9bKggAT", "completed": true, "de": "YSRj2rXWC0f", "target_period": "2014July", "value": "2", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "a4OM9bKggAT", "target": "3.0", "target_period": "2014July", "completed": false, "de": "YSRj2rXWC0f", "old_value": "4", "target_dataelement": "I9MjFl6Y5hl.a4OM9bKggAT", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "a4OM9bKggAT", "target": "3.0", "target_dataelement": "I9MjFl6Y5hl.a4OM9bKggAT", "completed": true, "de": "YSRj2rXWC0f", "target_period": "2014July", "value": "3", "ou": "iH7LSuDKBxU"}}}, "lcdIDgumilv_nrQIoh49aGU": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "nrQIoh49aGU", "target": "3.0", "target_dataelement": "A4BPhZhOrzc.nrQIoh49aGU", "completed": true, "de": "lcdIDgumilv", "target_period": "2014July", "value": "3", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "nrQIoh49aGU", "target": "3.0", "target_period": "2014July", "completed": false, "de": "lcdIDgumilv", "old_value": "4", "target_dataelement": "A4BPhZhOrzc.nrQIoh49aGU", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "nrQIoh49aGU", "target": "3.0", "target_dataelement": "A4BPhZhOrzc.nrQIoh49aGU", "completed": true, "de": "lcdIDgumilv", "target_period": "2014July", "value": "2", "ou": "iH7LSuDKBxU"}}}, "QnFeukGopwx_lJ9Cv8ISZRT": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "lJ9Cv8ISZRT", "target": "3.0", "target_dataelement": "zDMxdyL6JWq.lJ9Cv8ISZRT", "completed": true, "de": "QnFeukGopwx", "target_period": "2014July", "value": "2", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "lJ9Cv8ISZRT", "target": "2.0", "target_period": "2014July", "completed": false, "de": "QnFeukGopwx", "old_value": "4", "target_dataelement": "zDMxdyL6JWq.lJ9Cv8ISZRT", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "lJ9Cv8ISZRT", "target": "2.0", "target_dataelement": "zDMxdyL6JWq.lJ9Cv8ISZRT", "completed": true, "de": "QnFeukGopwx", "target_period": "2014July", "value": "4", "ou": "iH7LSuDKBxU"}}}, "lcdIDgumilv_fuzYIcfLZN2": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "fuzYIcfLZN2", "target": "2.0", "target_dataelement": "A4BPhZhOrzc.fuzYIcfLZN2", "completed": true, "de": "lcdIDgumilv", "target_period": "2014July", "value": "2", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "fuzYIcfLZN2", "target": "3.0", "target_period": "2014July", "completed": false, "de": "lcdIDgumilv", "old_value": "4", "target_dataelement": "A4BPhZhOrzc.fuzYIcfLZN2", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "fuzYIcfLZN2", "target": "3.0", "target_dataelement": "A4BPhZhOrzc.fuzYIcfLZN2", "completed": true, "de": "lcdIDgumilv", "target_period": "2014July", "value": "3", "ou": "iH7LSuDKBxU"}}}, "bJ84f27rqDB_HdPaWqoDpdZ": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "HdPaWqoDpdZ", "target": "4.0", "target_dataelement": "Ivu48nkpIw2.HdPaWqoDpdZ", "completed": true, "de": "bJ84f27rqDB", "target_period": "2014July", "value": "4", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "HdPaWqoDpdZ", "target": "3.0", "target_period": "2014July", "completed": false, "de": "bJ84f27rqDB", "old_value": "4", "target_dataelement": "Ivu48nkpIw2.HdPaWqoDpdZ", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "HdPaWqoDpdZ", "target": "3.0", "target_dataelement": "Ivu48nkpIw2.HdPaWqoDpdZ", "completed": true, "de": "bJ84f27rqDB", "target_period": "2014July", "value": "2", "ou": "iH7LSuDKBxU"}}}, "mVwNk3foz3v_g8e3yoakYec": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"ou": "AsgiIABsA69", "de": "mVwNk3foz3v", "co": "g8e3yoakYec", "completed": true, "value": "2"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "g8e3yoakYec", "completed": false, "de": "mVwNk3foz3v", "old_value": "4", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"ou": "iH7LSuDKBxU", "de": "mVwNk3foz3v", "co": "g8e3yoakYec", "completed": true, "value": "4"}}}, "cf9SaENrA27_CL9bLTJRESL": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "CL9bLTJRESL", "target": "4.0", "target_dataelement": "KnfVAOcnV26.CL9bLTJRESL", "completed": true, "de": "cf9SaENrA27", "target_period": "2014July", "value": "2", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "CL9bLTJRESL", "target": "2.0", "target_period": "2014July", "completed": false, "de": "cf9SaENrA27", "old_value": "4", "target_dataelement": "KnfVAOcnV26.CL9bLTJRESL", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "CL9bLTJRESL", "target": "2.0", "target_dataelement": "KnfVAOcnV26.CL9bLTJRESL", "completed": true, "de": "cf9SaENrA27", "target_period": "2014July", "value": "4", "ou": "iH7LSuDKBxU"}}}, "QnFeukGopwx_Jc1jxBG2eal": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "Jc1jxBG2eal", "target": "3.0", "target_dataelement": "zDMxdyL6JWq.Jc1jxBG2eal", "completed": true, "de": "QnFeukGopwx", "target_period": "2014July", "value": "3", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "Jc1jxBG2eal", "target": "3.0", "target_period": "2014July", "completed": false, "de": "QnFeukGopwx", "old_value": "4", "target_dataelement": "zDMxdyL6JWq.Jc1jxBG2eal", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "Jc1jxBG2eal", "target": "3.0", "target_dataelement": "zDMxdyL6JWq.Jc1jxBG2eal", "completed": true, "de": "QnFeukGopwx", "target_period": "2014July", "value": "4", "ou": "iH7LSuDKBxU"}}}, "FPISNWdoGb1_FE4pu3Sbksc": {"formula": "PriorEstimate", "data": {"AsgiIABsA69": {"ou": "AsgiIABsA69", "de": "FPISNWdoGb1", "co": "FE4pu3Sbksc", "completed": true, "value": "2"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "FE4pu3Sbksc", "completed": false, "de": "FPISNWdoGb1", "old_value": "4", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"ou": "iH7LSuDKBxU", "de": "FPISNWdoGb1", "co": "FE4pu3Sbksc", "completed": true, "value": "2"}}}, "lcdIDgumilv_GmO6g98S4G9": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "GmO6g98S4G9", "target": "3.0", "target_dataelement": "A4BPhZhOrzc.GmO6g98S4G9", "completed": true, "de": "lcdIDgumilv", "target_period": "2014July", "value": "3", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "GmO6g98S4G9", "target": "3.0", "target_period": "2014July", "completed": false, "de": "lcdIDgumilv", "old_value": "4", "target_dataelement": "A4BPhZhOrzc.GmO6g98S4G9", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "GmO6g98S4G9", "target": "3.0", "target_dataelement": "A4BPhZhOrzc.GmO6g98S4G9", "completed": true, "de": "lcdIDgumilv", "target_period": "2014July", "value": "4", "ou": "iH7LSuDKBxU"}}}, "lcdIDgumilv_HquzVesvM2Z": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "HquzVesvM2Z", "target": "2.0", "target_dataelement": "A4BPhZhOrzc.HquzVesvM2Z", "completed": true, "de": "lcdIDgumilv", "target_period": "2014July", "value": "3", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "HquzVesvM2Z", "target": "4.0", "target_period": "2014July", "completed": false, "de": "lcdIDgumilv", "old_value": "4", "target_dataelement": "A4BPhZhOrzc.HquzVesvM2Z", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "HquzVesvM2Z", "target": "4.0", "target_dataelement": "A4BPhZhOrzc.HquzVesvM2Z", "completed": true, "de": "lcdIDgumilv", "target_period": "2014July", "value": "2", "ou": "iH7LSuDKBxU"}}}, "YSRj2rXWC0f_w30fA5rFeRV": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "w30fA5rFeRV", "target": "3.0", "target_dataelement": "I9MjFl6Y5hl.w30fA5rFeRV", "completed": true, "de": "YSRj2rXWC0f", "target_period": "2014July", "value": "2", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "w30fA5rFeRV", "target": "2.0", "target_period": "2014July", "completed": false, "de": "YSRj2rXWC0f", "old_value": "4", "target_dataelement": "I9MjFl6Y5hl.w30fA5rFeRV", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "w30fA5rFeRV", "target": "2.0", "target_dataelement": "I9MjFl6Y5hl.w30fA5rFeRV", "completed": true, "de": "YSRj2rXWC0f", "target_period": "2014July", "value": "4", "ou": "iH7LSuDKBxU"}}}, "gbvUDbZWxUS_wJIxAhejWKY": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "wJIxAhejWKY", "target": "4.0", "target_dataelement": "hCLl9rGfYpb.wJIxAhejWKY", "completed": true, "de": "gbvUDbZWxUS", "target_period": "2014July", "value": "4", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "wJIxAhejWKY", "target": "3.0", "target_period": "2014July", "completed": false, "de": "gbvUDbZWxUS", "old_value": "4", "target_dataelement": "hCLl9rGfYpb.wJIxAhejWKY", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "wJIxAhejWKY", "target": "3.0", "target_dataelement": "hCLl9rGfYpb.wJIxAhejWKY", "completed": true, "de": "gbvUDbZWxUS", "target_period": "2014July", "value": "4", "ou": "iH7LSuDKBxU"}}}, "dozTSGrBvVj_iBa5lgXgvwk": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "iBa5lgXgvwk", "target": "4.0", "target_dataelement": "lf7gU0lfEJt.iBa5lgXgvwk", "completed": true, "de": "dozTSGrBvVj", "target_period": "2014July", "value": "3", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "iBa5lgXgvwk", "target": "4.0", "target_period": "2014July", "completed": false, "de": "dozTSGrBvVj", "old_value": "4", "target_dataelement": "lf7gU0lfEJt.iBa5lgXgvwk", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "iBa5lgXgvwk", "target": "4.0", "target_dataelement": "lf7gU0lfEJt.iBa5lgXgvwk", "completed": true, "de": "dozTSGrBvVj", "target_period": "2014July", "value": "4", "ou": "iH7LSuDKBxU"}}}, "uWPWKJp8XPG_kOqXqu9iOHV": {"formula": "PriorEstimate", "data": {"AsgiIABsA69": {"ou": "AsgiIABsA69", "de": "uWPWKJp8XPG", "co": "kOqXqu9iOHV", "completed": true, "value": "2"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "kOqXqu9iOHV", "completed": false, "de": "uWPWKJp8XPG", "old_value": "4", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"ou": "iH7LSuDKBxU", "de": "uWPWKJp8XPG", "co": "kOqXqu9iOHV", "completed": true, "value": "2"}}}, "sS5OudDzXC2_ql8bSsHEnUN": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"ou": "AsgiIABsA69", "de": "sS5OudDzXC2", "co": "ql8bSsHEnUN", "completed": true, "value": "4"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "ql8bSsHEnUN", "completed": false, "de": "sS5OudDzXC2", "old_value": "4", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"ou": "iH7LSuDKBxU", "de": "sS5OudDzXC2", "co": "ql8bSsHEnUN", "completed": true, "value": "3"}}}, "bJ84f27rqDB_MT4SwuoV2pQ": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "MT4SwuoV2pQ", "target": "4.0", "target_dataelement": "Ivu48nkpIw2.MT4SwuoV2pQ", "completed": true, "de": "bJ84f27rqDB", "target_period": "2014July", "value": "2", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "MT4SwuoV2pQ", "target": "3.0", "target_period": "2014July", "completed": false, "de": "bJ84f27rqDB", "old_value": "4", "target_dataelement": "Ivu48nkpIw2.MT4SwuoV2pQ", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "MT4SwuoV2pQ", "target": "3.0", "target_dataelement": "Ivu48nkpIw2.MT4SwuoV2pQ", "completed": true, "de": "bJ84f27rqDB", "target_period": "2014July", "value": "3", "ou": "iH7LSuDKBxU"}}}, "qRvbTVEmI6C_BPGkOcPjPS7": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "BPGkOcPjPS7", "target": "4.0", "target_dataelement": "dGATcuqhXtk.BPGkOcPjPS7", "completed": true, "de": "qRvbTVEmI6C", "target_period": "2014July", "value": "4", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "BPGkOcPjPS7", "target": "2.0", "target_period": "2014July", "completed": false, "de": "qRvbTVEmI6C", "old_value": "4", "target_dataelement": "dGATcuqhXtk.BPGkOcPjPS7", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "BPGkOcPjPS7", "target": "2.0", "target_dataelement": "dGATcuqhXtk.BPGkOcPjPS7", "completed": true, "de": "qRvbTVEmI6C", "target_period": "2014July", "value": "2", "ou": "iH7LSuDKBxU"}}}, "mW1g85YGrA5_RI7hGnsTPHz": {"formula": "PriorEstimate", "data": {"AsgiIABsA69": {"ou": "AsgiIABsA69", "de": "mW1g85YGrA5", "co": "RI7hGnsTPHz", "completed": true, "value": "2"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "RI7hGnsTPHz", "completed": false, "de": "mW1g85YGrA5", "old_value": "4", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"ou": "iH7LSuDKBxU", "de": "mW1g85YGrA5", "co": "RI7hGnsTPHz", "completed": true, "value": "3"}}}, "cf9SaENrA27_g8e3yoakYec": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "g8e3yoakYec", "target": "4.0", "target_dataelement": "KnfVAOcnV26.g8e3yoakYec", "completed": true, "de": "cf9SaENrA27", "target_period": "2014July", "value": "2", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "g8e3yoakYec", "target": "4.0", "target_period": "2014July", "completed": false, "de": "cf9SaENrA27", "old_value": "4", "target_dataelement": "KnfVAOcnV26.g8e3yoakYec", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "g8e3yoakYec", "target": "4.0", "target_dataelement": "KnfVAOcnV26.g8e3yoakYec", "completed": true, "de": "cf9SaENrA27", "target_period": "2014July", "value": "2", "ou": "iH7LSuDKBxU"}}}, "WoUIOUcej6W_QlQ95KGkgR6": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "QlQ95KGkgR6", "target": "4.0", "target_dataelement": "U7ep9MxtQ1z.QlQ95KGkgR6", "completed": true, "de": "WoUIOUcej6W", "target_period": "2014July", "value": "4", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "QlQ95KGkgR6", "target": "2.0", "target_period": "2014July", "completed": false, "de": "WoUIOUcej6W", "old_value": "4", "target_dataelement": "U7ep9MxtQ1z.QlQ95KGkgR6", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "QlQ95KGkgR6", "target": "2.0", "target_dataelement": "U7ep9MxtQ1z.QlQ95KGkgR6", "completed": true, "de": "WoUIOUcej6W", "target_period": "2014July", "value": "2", "ou": "iH7LSuDKBxU"}}}, "rNaeaP69Ml0_hOj19H7Vodn": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "hOj19H7Vodn", "target": "3.0", "target_dataelement": "l7yZ1DOmYbU.hOj19H7Vodn", "completed": true, "de": "rNaeaP69Ml0", "target_period": "2014July", "value": "2", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "hOj19H7Vodn", "target": "3.0", "target_period": "2014July", "completed": false, "de": "rNaeaP69Ml0", "old_value": "4", "target_dataelement": "l7yZ1DOmYbU.hOj19H7Vodn", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "hOj19H7Vodn", "target": "3.0", "target_dataelement": "l7yZ1DOmYbU.hOj19H7Vodn", "completed": true, "de": "rNaeaP69Ml0", "target_period": "2014July", "value": "3", "ou": "iH7LSuDKBxU"}}}, "lcdIDgumilv_drXDRIxLVzv": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "drXDRIxLVzv", "target": "2.0", "target_dataelement": "A4BPhZhOrzc.drXDRIxLVzv", "completed": true, "de": "lcdIDgumilv", "target_period": "2014July", "value": "2", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "drXDRIxLVzv", "target": "4.0", "target_period": "2014July", "completed": false, "de": "lcdIDgumilv", "old_value": "4", "target_dataelement": "A4BPhZhOrzc.drXDRIxLVzv", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "drXDRIxLVzv", "target": "4.0", "target_dataelement": "A4BPhZhOrzc.drXDRIxLVzv", "completed": true, "de": "lcdIDgumilv", "target_period": "2014July", "value": "4", "ou": "iH7LSuDKBxU"}}}, "cf9SaENrA27_nxSBayfWRix": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "nxSBayfWRix", "target": "4.0", "target_dataelement": "KnfVAOcnV26.nxSBayfWRix", "completed": true, "de": "cf9SaENrA27", "target_period": "2014July", "value": "3", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "nxSBayfWRix", "target": "3.0", "target_period": "2014July", "completed": false, "de": "cf9SaENrA27", "old_value": "4", "target_dataelement": "KnfVAOcnV26.nxSBayfWRix", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "nxSBayfWRix", "target": "3.0", "target_dataelement": "KnfVAOcnV26.nxSBayfWRix", "completed": true, "de": "cf9SaENrA27", "target_period": "2014July", "value": "3", "ou": "iH7LSuDKBxU"}}}, "AG0rLmFA5Vf_gLzw9ub3Au7": {"formula": "PriorEstimate", "data": {"AsgiIABsA69": {"ou": "AsgiIABsA69", "de": "AG0rLmFA5Vf", "co": "gLzw9ub3Au7", "completed": true, "value": "4"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "gLzw9ub3Au7", "completed": false, "de": "AG0rLmFA5Vf", "old_value": "4", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"ou": "iH7LSuDKBxU", "de": "AG0rLmFA5Vf", "co": "gLzw9ub3Au7", "completed": true, "value": "4"}}}, "WoUIOUcej6W_HquzVesvM2Z": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "HquzVesvM2Z", "target": "4.0", "target_dataelement": "U7ep9MxtQ1z.HquzVesvM2Z", "completed": true, "de": "WoUIOUcej6W", "target_period": "2014July", "value": "4", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "HquzVesvM2Z", "target": "2.0", "target_period": "2014July", "completed": false, "de": "WoUIOUcej6W", "old_value": "4", "target_dataelement": "U7ep9MxtQ1z.HquzVesvM2Z", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "HquzVesvM2Z", "target": "2.0", "target_dataelement": "U7ep9MxtQ1z.HquzVesvM2Z", "completed": true, "de": "WoUIOUcej6W", "target_period": "2014July", "value": "2", "ou": "iH7LSuDKBxU"}}}, "YSRj2rXWC0f_Z4bVJVRPKjl": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "Z4bVJVRPKjl", "target": "3.0", "target_dataelement": "I9MjFl6Y5hl.Z4bVJVRPKjl", "completed": true, "de": "YSRj2rXWC0f", "target_period": "2014July", "value": "3", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "Z4bVJVRPKjl", "target": "2.0", "target_period": "2014July", "completed": false, "de": "YSRj2rXWC0f", "old_value": "4", "target_dataelement": "I9MjFl6Y5hl.Z4bVJVRPKjl", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "Z4bVJVRPKjl", "target": "2.0", "target_dataelement": "I9MjFl6Y5hl.Z4bVJVRPKjl", "completed": true, "de": "YSRj2rXWC0f", "target_period": "2014July", "value": "3", "ou": "iH7LSuDKBxU"}}}, "mVwNk3foz3v_CL9bLTJRESL": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"ou": "AsgiIABsA69", "de": "mVwNk3foz3v", "co": "CL9bLTJRESL", "completed": true, "value": "3"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "CL9bLTJRESL", "completed": false, "de": "mVwNk3foz3v", "old_value": "4", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"ou": "iH7LSuDKBxU", "de": "mVwNk3foz3v", "co": "CL9bLTJRESL", "completed": true, "value": "3"}}}, "sS5OudDzXC2_YkeweM90DZt": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"ou": "AsgiIABsA69", "de": "sS5OudDzXC2", "co": "YkeweM90DZt", "completed": true, "value": "2"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "YkeweM90DZt", "completed": false, "de": "sS5OudDzXC2", "old_value": "4", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"ou": "iH7LSuDKBxU", "de": "sS5OudDzXC2", "co": "YkeweM90DZt", "completed": true, "value": "2"}}}, "FwpCBGQvYdL_Z0LtVda8wAo": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "Z0LtVda8wAo", "target": "4.0", "target_dataelement": "xBxqNNV8jLR.Z0LtVda8wAo", "completed": true, "de": "FwpCBGQvYdL", "target_period": "2014July", "value": "2", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "Z0LtVda8wAo", "target": "2.0", "target_period": "2014July", "completed": false, "de": "FwpCBGQvYdL", "old_value": "4", "target_dataelement": "xBxqNNV8jLR.Z0LtVda8wAo", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "Z0LtVda8wAo", "target": "2.0", "target_dataelement": "xBxqNNV8jLR.Z0LtVda8wAo", "completed": true, "de": "FwpCBGQvYdL", "target_period": "2014July", "value": "4", "ou": "iH7LSuDKBxU"}}}, "rNaeaP69Ml0_IOE274vPmm1": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "IOE274vPmm1", "target": "3.0", "target_dataelement": "l7yZ1DOmYbU.IOE274vPmm1", "completed": true, "de": "rNaeaP69Ml0", "target_period": "2014July", "value": "2", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "IOE274vPmm1", "target": "4.0", "target_period": "2014July", "completed": false, "de": "rNaeaP69Ml0", "old_value": "4", "target_dataelement": "l7yZ1DOmYbU.IOE274vPmm1", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "IOE274vPmm1", "target": "4.0", "target_dataelement": "l7yZ1DOmYbU.IOE274vPmm1", "completed": true, "de": "rNaeaP69Ml0", "target_period": "2014July", "value": "2", "ou": "iH7LSuDKBxU"}}}, "QnFeukGopwx_OEoQ7kif63L": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "OEoQ7kif63L", "target": "2.0", "target_dataelement": "zDMxdyL6JWq.OEoQ7kif63L", "completed": true, "de": "QnFeukGopwx", "target_period": "2014July", "value": "3", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "OEoQ7kif63L", "target": "2.0", "target_period": "2014July", "completed": false, "de": "QnFeukGopwx", "old_value": "4", "target_dataelement": "zDMxdyL6JWq.OEoQ7kif63L", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "OEoQ7kif63L", "target": "2.0", "target_dataelement": "zDMxdyL6JWq.OEoQ7kif63L", "completed": true, "de": "QnFeukGopwx", "target_period": "2014July", "value": "3", "ou": "iH7LSuDKBxU"}}}, "QnFeukGopwx_xLi4aE2hf45": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "xLi4aE2hf45", "target": "4.0", "target_dataelement": "zDMxdyL6JWq.xLi4aE2hf45", "completed": true, "de": "QnFeukGopwx", "target_period": "2014July", "value": "3", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "xLi4aE2hf45", "target": "2.0", "target_period": "2014July", "completed": false, "de": "QnFeukGopwx", "old_value": "4", "target_dataelement": "zDMxdyL6JWq.xLi4aE2hf45", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "xLi4aE2hf45", "target": "2.0", "target_dataelement": "zDMxdyL6JWq.xLi4aE2hf45", "completed": true, "de": "QnFeukGopwx", "target_period": "2014July", "value": "2", "ou": "iH7LSuDKBxU"}}}, "SKvpXr1Eysu_WgIlmdIhlpD": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"ou": "AsgiIABsA69", "de": "SKvpXr1Eysu", "co": "WgIlmdIhlpD", "completed": true, "value": "2"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "WgIlmdIhlpD", "completed": false, "de": "SKvpXr1Eysu", "old_value": "4", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"ou": "iH7LSuDKBxU", "de": "SKvpXr1Eysu", "co": "WgIlmdIhlpD", "completed": true, "value": "2"}}}, "FyJxMp5u7WP_YkeweM90DZt": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"ou": "AsgiIABsA69", "de": "FyJxMp5u7WP", "co": "YkeweM90DZt", "completed": true, "value": "4"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "YkeweM90DZt", "completed": false, "de": "FyJxMp5u7WP", "old_value": "4", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"ou": "iH7LSuDKBxU", "de": "FyJxMp5u7WP", "co": "YkeweM90DZt", "completed": true, "value": "2"}}}, "ZP9A3a39d2d_WgIlmdIhlpD": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"ou": "AsgiIABsA69", "de": "ZP9A3a39d2d", "co": "WgIlmdIhlpD", "completed": true, "value": "3"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "WgIlmdIhlpD", "completed": false, "de": "ZP9A3a39d2d", "old_value": "4", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"ou": "iH7LSuDKBxU", "de": "ZP9A3a39d2d", "co": "WgIlmdIhlpD", "completed": true, "value": "2"}}}, "xpXXurlwbNM_bSNT1r88kIC": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "bSNT1r88kIC", "target": "3.0", "target_dataelement": "BnsXYKt6iu6.bSNT1r88kIC", "completed": true, "de": "xpXXurlwbNM", "target_period": "2014July", "value": "3", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "bSNT1r88kIC", "target": "3.0", "target_period": "2014July", "completed": false, "de": "xpXXurlwbNM", "old_value": "4", "target_dataelement": "BnsXYKt6iu6.bSNT1r88kIC", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "bSNT1r88kIC", "target": "3.0", "target_dataelement": "BnsXYKt6iu6.bSNT1r88kIC", "completed": true, "de": "xpXXurlwbNM", "target_period": "2014July", "value": "3", "ou": "iH7LSuDKBxU"}}}, "lcdIDgumilv_Hmz6lySVDCN": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "Hmz6lySVDCN", "target": "2.0", "target_dataelement": "A4BPhZhOrzc.Hmz6lySVDCN", "completed": true, "de": "lcdIDgumilv", "target_period": "2014July", "value": "4", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "Hmz6lySVDCN", "target": "3.0", "target_period": "2014July", "completed": false, "de": "lcdIDgumilv", "old_value": "4", "target_dataelement": "A4BPhZhOrzc.Hmz6lySVDCN", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "Hmz6lySVDCN", "target": "3.0", "target_dataelement": "A4BPhZhOrzc.Hmz6lySVDCN", "completed": true, "de": "lcdIDgumilv", "target_period": "2014July", "value": "2", "ou": "iH7LSuDKBxU"}}}, "gbvUDbZWxUS_uMeEFdAzqKS": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "uMeEFdAzqKS", "target": "4.0", "target_dataelement": "hCLl9rGfYpb.uMeEFdAzqKS", "completed": true, "de": "gbvUDbZWxUS", "target_period": "2014July", "value": "3", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "uMeEFdAzqKS", "target": "3.0", "target_period": "2014July", "completed": false, "de": "gbvUDbZWxUS", "old_value": "4", "target_dataelement": "hCLl9rGfYpb.uMeEFdAzqKS", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "uMeEFdAzqKS", "target": "3.0", "target_dataelement": "hCLl9rGfYpb.uMeEFdAzqKS", "completed": true, "de": "gbvUDbZWxUS", "target_period": "2014July", "value": "4", "ou": "iH7LSuDKBxU"}}}, "YSRj2rXWC0f_BEi0yw6WwBa": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "BEi0yw6WwBa", "target": "2.0", "target_dataelement": "I9MjFl6Y5hl.BEi0yw6WwBa", "completed": true, "de": "YSRj2rXWC0f", "target_period": "2014July", "value": "3", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "BEi0yw6WwBa", "target": "3.0", "target_period": "2014July", "completed": false, "de": "YSRj2rXWC0f", "old_value": "4", "target_dataelement": "I9MjFl6Y5hl.BEi0yw6WwBa", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "BEi0yw6WwBa", "target": "3.0", "target_dataelement": "I9MjFl6Y5hl.BEi0yw6WwBa", "completed": true, "de": "YSRj2rXWC0f", "target_period": "2014July", "value": "4", "ou": "iH7LSuDKBxU"}}}, "YSRj2rXWC0f_dUIkQFWg2qm": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "dUIkQFWg2qm", "target": "2.0", "target_dataelement": "I9MjFl6Y5hl.dUIkQFWg2qm", "completed": true, "de": "YSRj2rXWC0f", "target_period": "2014July", "value": "4", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "dUIkQFWg2qm", "target": "4.0", "target_period": "2014July", "completed": false, "de": "YSRj2rXWC0f", "old_value": "4", "target_dataelement": "I9MjFl6Y5hl.dUIkQFWg2qm", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "dUIkQFWg2qm", "target": "4.0", "target_dataelement": "I9MjFl6Y5hl.dUIkQFWg2qm", "completed": true, "de": "YSRj2rXWC0f", "target_period": "2014July", "value": "4", "ou": "iH7LSuDKBxU"}}}, "QnFeukGopwx_eHhQeZB29hz": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "eHhQeZB29hz", "target": "4.0", "target_dataelement": "zDMxdyL6JWq.eHhQeZB29hz", "completed": true, "de": "QnFeukGopwx", "target_period": "2014July", "value": "3", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "eHhQeZB29hz", "target": "2.0", "target_period": "2014July", "completed": false, "de": "QnFeukGopwx", "old_value": "4", "target_dataelement": "zDMxdyL6JWq.eHhQeZB29hz", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "eHhQeZB29hz", "target": "2.0", "target_dataelement": "zDMxdyL6JWq.eHhQeZB29hz", "completed": true, "de": "QnFeukGopwx", "target_period": "2014July", "value": "3", "ou": "iH7LSuDKBxU"}}}, "WoUIOUcej6W_dUwc6pkKgmM": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "dUwc6pkKgmM", "target": "4.0", "target_dataelement": "U7ep9MxtQ1z.dUwc6pkKgmM", "completed": true, "de": "WoUIOUcej6W", "target_period": "2014July", "value": "4", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "dUwc6pkKgmM", "target": "2.0", "target_period": "2014July", "completed": false, "de": "WoUIOUcej6W", "old_value": "4", "target_dataelement": "U7ep9MxtQ1z.dUwc6pkKgmM", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "dUwc6pkKgmM", "target": "2.0", "target_dataelement": "U7ep9MxtQ1z.dUwc6pkKgmM", "completed": true, "de": "WoUIOUcej6W", "target_period": "2014July", "value": "2", "ou": "iH7LSuDKBxU"}}}, "YSRj2rXWC0f_tPbRcvnWxkS": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "tPbRcvnWxkS", "target": "2.0", "target_dataelement": "I9MjFl6Y5hl.tPbRcvnWxkS", "completed": true, "de": "YSRj2rXWC0f", "target_period": "2014July", "value": "3", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "tPbRcvnWxkS", "target": "4.0", "target_period": "2014July", "completed": false, "de": "YSRj2rXWC0f", "old_value": "4", "target_dataelement": "I9MjFl6Y5hl.tPbRcvnWxkS", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "tPbRcvnWxkS", "target": "4.0", "target_dataelement": "I9MjFl6Y5hl.tPbRcvnWxkS", "completed": true, "de": "YSRj2rXWC0f", "target_period": "2014July", "value": "2", "ou": "iH7LSuDKBxU"}}}, "FyJxMp5u7WP_pjXHRQQXIhg": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"ou": "AsgiIABsA69", "de": "FyJxMp5u7WP", "co": "pjXHRQQXIhg", "completed": true, "value": "4"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "pjXHRQQXIhg", "completed": false, "de": "FyJxMp5u7WP", "old_value": "4", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"ou": "iH7LSuDKBxU", "de": "FyJxMp5u7WP", "co": "pjXHRQQXIhg", "completed": true, "value": "4"}}}, "bJ84f27rqDB_Y1zhvDQTe5e": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "Y1zhvDQTe5e", "target": "2.0", "target_dataelement": "Ivu48nkpIw2.Y1zhvDQTe5e", "completed": true, "de": "bJ84f27rqDB", "target_period": "2014July", "value": "4", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "Y1zhvDQTe5e", "target": "2.0", "target_period": "2014July", "completed": false, "de": "bJ84f27rqDB", "old_value": "4", "target_dataelement": "Ivu48nkpIw2.Y1zhvDQTe5e", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "Y1zhvDQTe5e", "target": "2.0", "target_dataelement": "Ivu48nkpIw2.Y1zhvDQTe5e", "completed": true, "de": "bJ84f27rqDB", "target_period": "2014July", "value": "4", "ou": "iH7LSuDKBxU"}}}, "ngDrfoi85Oy_Z0LtVda8wAo": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "Z0LtVda8wAo", "target": "3.0", "target_dataelement": "tIW07Zp3vnv.Z0LtVda8wAo", "completed": true, "de": "ngDrfoi85Oy", "target_period": "2014July", "value": "3", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "Z0LtVda8wAo", "target": "2.0", "target_period": "2014July", "completed": false, "de": "ngDrfoi85Oy", "old_value": "4", "target_dataelement": "tIW07Zp3vnv.Z0LtVda8wAo", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "Z0LtVda8wAo", "target": "2.0", "target_dataelement": "tIW07Zp3vnv.Z0LtVda8wAo", "completed": true, "de": "ngDrfoi85Oy", "target_period": "2014July", "value": "2", "ou": "iH7LSuDKBxU"}}}, "ngDrfoi85Oy_oS2Oq1evsaK": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "oS2Oq1evsaK", "target": "3.0", "target_dataelement": "tIW07Zp3vnv.oS2Oq1evsaK", "completed": true, "de": "ngDrfoi85Oy", "target_period": "2014July", "value": "2", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "oS2Oq1evsaK", "target": "2.0", "target_period": "2014July", "completed": false, "de": "ngDrfoi85Oy", "old_value": "4", "target_dataelement": "tIW07Zp3vnv.oS2Oq1evsaK", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "oS2Oq1evsaK", "target": "2.0", "target_dataelement": "tIW07Zp3vnv.oS2Oq1evsaK", "completed": true, "de": "ngDrfoi85Oy", "target_period": "2014July", "value": "3", "ou": "iH7LSuDKBxU"}}}, "dozTSGrBvVj_xCnCQxpSTUJ": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "xCnCQxpSTUJ", "target": "3.0", "target_dataelement": "lf7gU0lfEJt.xCnCQxpSTUJ", "completed": true, "de": "dozTSGrBvVj", "target_period": "2014July", "value": "3", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "xCnCQxpSTUJ", "target": "2.0", "target_period": "2014July", "completed": false, "de": "dozTSGrBvVj", "old_value": "4", "target_dataelement": "lf7gU0lfEJt.xCnCQxpSTUJ", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "xCnCQxpSTUJ", "target": "2.0", "target_dataelement": "lf7gU0lfEJt.xCnCQxpSTUJ", "completed": true, "de": "dozTSGrBvVj", "target_period": "2014July", "value": "2", "ou": "iH7LSuDKBxU"}}}, "cf9SaENrA27_hRHZBt0hok2": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "hRHZBt0hok2", "target": "2.0", "target_dataelement": "KnfVAOcnV26.hRHZBt0hok2", "completed": true, "de": "cf9SaENrA27", "target_period": "2014July", "value": "2", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "hRHZBt0hok2", "target": "3.0", "target_period": "2014July", "completed": false, "de": "cf9SaENrA27", "old_value": "4", "target_dataelement": "KnfVAOcnV26.hRHZBt0hok2", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "hRHZBt0hok2", "target": "3.0", "target_dataelement": "KnfVAOcnV26.hRHZBt0hok2", "completed": true, "de": "cf9SaENrA27", "target_period": "2014July", "value": "2", "ou": "iH7LSuDKBxU"}}}, "cf9SaENrA27_ystqt8VT4Tp": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "ystqt8VT4Tp", "target": "2.0", "target_dataelement": "KnfVAOcnV26.ystqt8VT4Tp", "completed": true, "de": "cf9SaENrA27", "target_period": "2014July", "value": "3", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "ystqt8VT4Tp", "target": "3.0", "target_period": "2014July", "completed": false, "de": "cf9SaENrA27", "old_value": "4", "target_dataelement": "KnfVAOcnV26.ystqt8VT4Tp", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "ystqt8VT4Tp", "target": "3.0", "target_dataelement": "KnfVAOcnV26.ystqt8VT4Tp", "completed": true, "de": "cf9SaENrA27", "target_period": "2014July", "value": "4", "ou": "iH7LSuDKBxU"}}}, "DhzOiIEKMGZ_ZlNa8Kxgc9w": {"formula": "PriorEstimate", "data": {"AsgiIABsA69": {"ou": "AsgiIABsA69", "de": "DhzOiIEKMGZ", "co": "ZlNa8Kxgc9w", "completed": true, "value": "4"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "ZlNa8Kxgc9w", "completed": false, "de": "DhzOiIEKMGZ", "old_value": "4", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"ou": "iH7LSuDKBxU", "de": "DhzOiIEKMGZ", "co": "ZlNa8Kxgc9w", "completed": true, "value": "3"}}}, "qRvbTVEmI6C_Efwc5ipDSTk": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "Efwc5ipDSTk", "target": "2.0", "target_dataelement": "dGATcuqhXtk.Efwc5ipDSTk", "completed": true, "de": "qRvbTVEmI6C", "target_period": "2014July", "value": "3", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "Efwc5ipDSTk", "target": "4.0", "target_period": "2014July", "completed": false, "de": "qRvbTVEmI6C", "old_value": "4", "target_dataelement": "dGATcuqhXtk.Efwc5ipDSTk", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "Efwc5ipDSTk", "target": "4.0", "target_dataelement": "dGATcuqhXtk.Efwc5ipDSTk", "completed": true, "de": "qRvbTVEmI6C", "target_period": "2014July", "value": "4", "ou": "iH7LSuDKBxU"}}}, "WoUIOUcej6W_GtUrKU93piR": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "GtUrKU93piR", "target": "2.0", "target_dataelement": "U7ep9MxtQ1z.GtUrKU93piR", "completed": true, "de": "WoUIOUcej6W", "target_period": "2014July", "value": "4", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "GtUrKU93piR", "target": "3.0", "target_period": "2014July", "completed": false, "de": "WoUIOUcej6W", "old_value": "4", "target_dataelement": "U7ep9MxtQ1z.GtUrKU93piR", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "GtUrKU93piR", "target": "3.0", "target_dataelement": "U7ep9MxtQ1z.GtUrKU93piR", "completed": true, "de": "WoUIOUcej6W", "target_period": "2014July", "value": "2", "ou": "iH7LSuDKBxU"}}}, "xpXXurlwbNM_fXZ1QJJJ9wp": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "fXZ1QJJJ9wp", "target": "4.0", "target_dataelement": "BnsXYKt6iu6.fXZ1QJJJ9wp", "completed": true, "de": "xpXXurlwbNM", "target_period": "2014July", "value": "3", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "fXZ1QJJJ9wp", "target": "2.0", "target_period": "2014July", "completed": false, "de": "xpXXurlwbNM", "old_value": "4", "target_dataelement": "BnsXYKt6iu6.fXZ1QJJJ9wp", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "fXZ1QJJJ9wp", "target": "2.0", "target_dataelement": "BnsXYKt6iu6.fXZ1QJJJ9wp", "completed": true, "de": "xpXXurlwbNM", "target_period": "2014July", "value": "2", "ou": "iH7LSuDKBxU"}}}, "YSRj2rXWC0f_hkdaOo9ZpB2": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "hkdaOo9ZpB2", "target": "3.0", "target_dataelement": "I9MjFl6Y5hl.hkdaOo9ZpB2", "completed": true, "de": "YSRj2rXWC0f", "target_period": "2014July", "value": "3", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "hkdaOo9ZpB2", "target": "2.0", "target_period": "2014July", "completed": false, "de": "YSRj2rXWC0f", "old_value": "4", "target_dataelement": "I9MjFl6Y5hl.hkdaOo9ZpB2", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "hkdaOo9ZpB2", "target": "2.0", "target_dataelement": "I9MjFl6Y5hl.hkdaOo9ZpB2", "completed": true, "de": "YSRj2rXWC0f", "target_period": "2014July", "value": "3", "ou": "iH7LSuDKBxU"}}}, "QnFeukGopwx_b5D4IKJFDJH": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "b5D4IKJFDJH", "target": "3.0", "target_dataelement": "zDMxdyL6JWq.b5D4IKJFDJH", "completed": true, "de": "QnFeukGopwx", "target_period": "2014July", "value": "2", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "b5D4IKJFDJH", "target": "2.0", "target_period": "2014July", "completed": false, "de": "QnFeukGopwx", "old_value": "4", "target_dataelement": "zDMxdyL6JWq.b5D4IKJFDJH", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "b5D4IKJFDJH", "target": "2.0", "target_dataelement": "zDMxdyL6JWq.b5D4IKJFDJH", "completed": true, "de": "QnFeukGopwx", "target_period": "2014July", "value": "3", "ou": "iH7LSuDKBxU"}}}, "FyJxMp5u7WP_YwRiKDxpYON": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"ou": "AsgiIABsA69", "de": "FyJxMp5u7WP", "co": "YwRiKDxpYON", "completed": true, "value": "4"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "YwRiKDxpYON", "completed": false, "de": "FyJxMp5u7WP", "old_value": "4", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"ou": "iH7LSuDKBxU", "de": "FyJxMp5u7WP", "co": "YwRiKDxpYON", "completed": true, "value": "4"}}}, "YSRj2rXWC0f_H9p6YVxG7zJ": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "H9p6YVxG7zJ", "target": "2.0", "target_dataelement": "I9MjFl6Y5hl.H9p6YVxG7zJ", "completed": true, "de": "YSRj2rXWC0f", "target_period": "2014July", "value": "4", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "H9p6YVxG7zJ", "target": "3.0", "target_period": "2014July", "completed": false, "de": "YSRj2rXWC0f", "old_value": "4", "target_dataelement": "I9MjFl6Y5hl.H9p6YVxG7zJ", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "H9p6YVxG7zJ", "target": "3.0", "target_dataelement": "I9MjFl6Y5hl.H9p6YVxG7zJ", "completed": true, "de": "YSRj2rXWC0f", "target_period": "2014July", "value": "3", "ou": "iH7LSuDKBxU"}}}, "gbvUDbZWxUS_R5DIMqSCTA5": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "R5DIMqSCTA5", "target": "2.0", "target_dataelement": "hCLl9rGfYpb.R5DIMqSCTA5", "completed": true, "de": "gbvUDbZWxUS", "target_period": "2014July", "value": "4", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "R5DIMqSCTA5", "target": "4.0", "target_period": "2014July", "completed": false, "de": "gbvUDbZWxUS", "old_value": "4", "target_dataelement": "hCLl9rGfYpb.R5DIMqSCTA5", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "R5DIMqSCTA5", "target": "4.0", "target_dataelement": "hCLl9rGfYpb.R5DIMqSCTA5", "completed": true, "de": "gbvUDbZWxUS", "target_period": "2014July", "value": "2", "ou": "iH7LSuDKBxU"}}}, "rBstKKNXmYA_xLi4aE2hf45": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "xLi4aE2hf45", "target": "3.0", "target_dataelement": "ZLsVcUh3yWM.xLi4aE2hf45", "completed": true, "de": "rBstKKNXmYA", "target_period": "2014July", "value": "2", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "xLi4aE2hf45", "target": "2.0", "target_period": "2014July", "completed": false, "de": "rBstKKNXmYA", "old_value": "4", "target_dataelement": "ZLsVcUh3yWM.xLi4aE2hf45", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "xLi4aE2hf45", "target": "2.0", "target_dataelement": "ZLsVcUh3yWM.xLi4aE2hf45", "completed": true, "de": "rBstKKNXmYA", "target_period": "2014July", "value": "2", "ou": "iH7LSuDKBxU"}}}, "DhzOiIEKMGZ_ZSnpCkAgmWc": {"formula": "PriorEstimate", "data": {"AsgiIABsA69": {"ou": "AsgiIABsA69", "de": "DhzOiIEKMGZ", "co": "ZSnpCkAgmWc", "completed": true, "value": "4"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "ZSnpCkAgmWc", "completed": false, "de": "DhzOiIEKMGZ", "old_value": "4", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"ou": "iH7LSuDKBxU", "de": "DhzOiIEKMGZ", "co": "ZSnpCkAgmWc", "completed": true, "value": "4"}}}, "dozTSGrBvVj_v3Eq35RuqEA": {"formula": "Based on Targerts", "data": {"AsgiIABsA69": {"co": "v3Eq35RuqEA", "target": "3.0", "target_dataelement": "lf7gU0lfEJt.v3Eq35RuqEA", "completed": true, "de": "dozTSGrBvVj", "target_period": "2014July", "value": "3", "ou": "AsgiIABsA69"}, "PwOdmPqofaP": {"old_value_period": "201407", "co": "v3Eq35RuqEA", "target": "2.0", "target_period": "2014July", "completed": false, "de": "dozTSGrBvVj", "old_value": "4", "target_dataelement": "lf7gU0lfEJt.v3Eq35RuqEA", "ou": "PwOdmPqofaP"}, "iH7LSuDKBxU": {"co": "v3Eq35RuqEA", "target": "2.0", "target_dataelement": "lf7gU0lfEJt.v3Eq35RuqEA", "completed": true, "de": "dozTSGrBvVj", "target_period": "2014July", "value": "4", "ou": "iH7LSuDKBxU"}}}};
                                            var dataElements = [];
                                            for(var key in dataSet.estimation){
                                                for(var key2 in dataSet.estimation[key].data){
                                                    if(dataSet.estimation[key].data[key2].target_dataelement){
                                                        dataElements.push(dataSet.estimation[key].data[key2].target_dataelement.substr(0,dataSet.estimation[key].data[key2].target_dataelement.indexOf(".")));
                                                    }
                                                }
                                            }
                                            $http.get(DHIS2URL + "api/dataElements.json?fields=id,name,categoryCombo[categoryOptionCombos[id,name]]&filter=id:in:[" + dataElements.join(",") +"]").then(function(results){
                                                console.log(results.data.dataElements);
                                                results.data.dataElements.forEach(function(dataElement){
                                                    $scope.estimateDataElement[dataElement.id] = dataElement;
                                                });
                                            });
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
                if($routeParams.objectId){
                    if($routeParams.objectId == $scope.dgId){
                        console.log($routeParams.objectId == $scope.dgId);
                        console.log(angular.element( ( '#myModalContent.html' ) ));
                        $scope.show();
                    }
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
                                                        var secondValue = parseInt(elem[0].children[loopIndex].children[i].innerHTML);
                                                        if(elem[0].children[loopIndex].children[i].innerHTML == ""){
                                                            secondValue = 0;
                                                        }
                                                        child.children[i].innerHTML = (parseInt(child.children[i].innerHTML) + secondValue).toFixed(1);
                                                        elementsToDelete.push(elem[0].children[loopIndex].children[i]);
                                                        if (child.children[i].toRowSpan) {
                                                            child.children[i].toRowSpan++;
                                                        } else {
                                                            child.children[i].toRowSpan = 2;
                                                        }
                                                    } else if (isFloat(child.children[i].innerHTML)) {
                                                        var secondValue = parseInt(elem[0].children[loopIndex].children[i].innerHTML);
                                                        if(elem[0].children[loopIndex].children[i].innerHTML == ""){
                                                            secondValue = 0.0;
                                                        }
                                                        child.children[i].innerHTML = (parseFloat(child.children[i].innerHTML) + secondValue).toFixed(1);
                                                        elementsToDelete.push(elem[0].children[loopIndex].children[i]);
                                                        if (child.children[i].toRowSpan) {
                                                            child.children[i].toRowSpan++;
                                                        } else {
                                                            child.children[i].toRowSpan = 2;
                                                        }
                                                    }else if ((child.children[i].innerHTML == "")) {
                                                        if(child.children[i].innerHTML == ""){
                                                            child.children[i].innerHTML = 0;
                                                        }else{
                                                            child.children[i].innerHTML = (parseFloat(child.children[i].innerHTML) + 0).toFixed(1);
                                                        }

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
                console.log($scope.config);
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
                        $scope.data.dataElements.splice(indicator.position, 0, "Inidicator" + index);
                        //$scope.data.dataElements.push({name: "Inidicator" + index});
                        $scope.data.events.forEach(function (event) {
                            var eventIndicator = "(" + indicator.numerator + ")/(" + indicator.denominator + ")";
                            //Get indcator dataelements
                            $scope.data.dataElements.forEach(function (dataElement) {
                                if (eventIndicator.indexOf(dataElement.id) > -1) {
                                    //Replace formula with data value
                                    var value = "0";
                                    if(event[dataElement.name]){
                                        value = event[dataElement.name];
                                    }
                                    eventIndicator = eventIndicator.replace("#{" + dataElement.id + "}", value);
                                }
                            });
                            //Evaluate Indicator

                            try{
                                if(indicator.position == 3){
                                    console.log(eventIndicator);
                                }
                                event["Inidicator" + index] = eval('(' + eventIndicator + ')');
                            }catch(e){

                            }
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

                                                    if (isInt(child.children[i].innerHTML)) {
                                                        var secondValue = parseInt(elem[0].children[loopIndex].children[i].innerHTML);
                                                        if(elem[0].children[loopIndex].children[i].innerHTML == ""){
                                                            secondValue = 0;
                                                        }
                                                        child.children[i].innerHTML = (parseInt(child.children[i].innerHTML) + secondValue).toFixed(1);
                                                        elementsToDelete.push(elem[0].children[loopIndex].children[i]);
                                                        if (child.children[i].toRowSpan) {
                                                            child.children[i].toRowSpan++;
                                                        } else {
                                                            child.children[i].toRowSpan = 2;
                                                        }
                                                    } else if (isFloat(child.children[i].innerHTML)) {
                                                        var secondValue = parseInt(elem[0].children[loopIndex].children[i].innerHTML);
                                                        if(elem[0].children[loopIndex].children[i].innerHTML == ""){
                                                            secondValue = 0.0;
                                                        }
                                                        child.children[i].innerHTML = (parseFloat(child.children[i].innerHTML) + secondValue).toFixed(1);
                                                        elementsToDelete.push(elem[0].children[loopIndex].children[i]);
                                                        if (child.children[i].toRowSpan) {
                                                            child.children[i].toRowSpan++;
                                                        } else {
                                                            child.children[i].toRowSpan = 2;
                                                        }
                                                    }else if ((child.children[i].innerHTML == "")) {
                                                        if(child.children[i].innerHTML == ""){
                                                            child.children[i].innerHTML = 0;
                                                        }else{
                                                            child.children[i].innerHTML = (parseFloat(child.children[i].innerHTML) + 0).toFixed(1);
                                                        }

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