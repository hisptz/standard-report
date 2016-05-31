/* global angular */

'use strict';
/* Controllers */
var appControllers = angular.module('appControllers', [])
    .controller('StandardReportController', function ($scope, DHIS2URL, $http, $sce, $timeout, $location, ReportService,toaster) {

        $scope.data = {
            selectedOrgUnit: undefined,
            config:{},
            archive: undefined,
            dataSets: [],
            period: "",
            periodTypes: {
                "Monthly": {
                    name: "Monthly", value: "Monthly", list: [],
                    populateList: function (date) {
                        var monthNames = ["July", "August", "September", "October", "November", "December", "January", "February", "March", "April", "May", "June"];
                        if (!date) {
                            date = new Date();
                        }
                        this.list = [];
                        var that = this;
                        var year = date.getFullYear();
                        monthNames.forEach(function (monthName, index) {

                            var monthVal = index + 7;

                            if(monthVal > 12){
                                monthVal = monthVal % 12;
                            }
                            if(monthVal == 1){
                                year++;
                            }
                            var testDate = new Date();
                            if((year == testDate.getFullYear() && monthVal > (testDate.getMonth() + 1)) || year > testDate.getFullYear() ){
                                return;
                            }
                            if (monthVal < 10) {
                                monthVal = "0" + monthVal;
                            }
                            that.list.push({
                                name: monthName + " " + year,
                                value: year + "" + monthVal
                            })
                        });
                    }
                },
                "Quarterly": {
                    name: "Quarterly", value: "Quarterly", list: [],
                    populateList: function (date) {
                        var quarters = ["July - September", "October - December", "January - March", "April - June"];
                        if (!date) {
                            date = new Date();
                        }
                        this.list = [];
                        var that = this;
                        var year = date.getFullYear();
                        quarters.forEach(function (quarter, index) {
                            var quarterVal = index + 3;
                            if(quarterVal == 5){
                                quarterVal = 1;
                            }
                            if(quarterVal == 6){
                                quarterVal = 2;
                            }
                            if(quarterVal == 1){
                                year++;
                            }
                            var testDate = new Date();
                            if((year == testDate.getFullYear() && quarterVal > ((testDate.getMonth() + 1) % 4)) || year > testDate.getFullYear() ){
                                return;
                            }
                            that.list.push({
                                name: quarter + " " + year,
                                value: year + "Q" + quarterVal
                            })
                        });
                    }
                },
                "Yearly": {
                    name: "Yearly", value: "Yearly", list: [],
                    populateList: function () {
                        var date = new Date();
                        this.list = [];
                        for (var i = date.getFullYear() - 5; i < date.getFullYear() + 5; i++) {
                            this.list.push({name: "" + i});
                        }
                    }
                },
                "FinancialJuly": {
                    name: "Financial-July", value: "FinancialJuly", list: [],
                    populateList: function () {
                        var date = new Date();
                        this.list = [];
                        var testDate = new Date();

                        for (var i = date.getFullYear() - 5; i < date.getFullYear() + 5; i++) {
                            if((i == testDate.getFullYear() && (testDate.getMonth() + 1) < 7) || (i == (testDate.getFullYear() - 1) && (testDate.getMonth() + 1) < 7) || i > testDate.getFullYear() ){
                                continue;
                            }
                            this.list.push({name: "July " + i + " - June " + (i + 1), value: i + "July"});
                        }
                    }
                }
            }
        };
        $scope.cancel = function(){

        };
        $scope.currentDate = new Date();
        $scope.displayPreviousPeriods = function () {
            $scope.currentDate = new Date($scope.currentDate.getFullYear() - 1, $scope.currentDate.getMonth(), $scope.currentDate.getDate());
            $scope.data.periodTypes[$scope.data.dataSet.periodType].populateList($scope.currentDate);
        };
        $scope.displayNextPeriods = function () {
            $scope.currentDate = new Date($scope.currentDate.getFullYear() + 1, $scope.currentDate.getMonth(), $scope.currentDate.getDate());
            $scope.data.periodTypes[$scope.data.dataSet.periodType].populateList($scope.currentDate);
        };
        $scope.getPeriodType = function (name) {
            var retPeriodType;
            $scope.data.periodTypes.forEach(function (periodType) {
                if (name == periodType.name) {
                    retPeriodType = periodType;
                }
            });
            return retPeriodType;
        }
        $scope.$watch("data.dataSet", function (value) {
            if (value) {
                $scope.currentDate = new Date();
                $scope.data.periodTypes[value.periodType].populateList();
            }
        });
        $scope.loadingArchive = false;
        $scope.$watch("data.selectedOrgUnit",function(selectedOrgUnit){
            if(selectedOrgUnit){
                var found = false;
                console.log("Selected OrgUnits",selectedOrgUnit);
                console.log("OrgUnits",$scope.data.dataSet);
                $scope.data.dataSet.organisationUnits.forEach(function(orgUnt){
                    if(orgUnt.id == selectedOrgUnit.id){
                        found = true;
                    }
                });
                if(!found){
                    toaster.pop('warning', "Warning", "Please select a corresponding organisation for the report");
                    $scope.data.config.toggleSelection($scope.data.selectedOrgUnit);
                    $scope.data.selectedOrgUnit = undefined;
                }
            }
        });
        $scope.archiveDataElements = [];
        $scope.loadTracker = "Loading Data Sets";
        $http.get(DHIS2URL + "api/dataSets.json?fields=id,name,periodType,attributeValues[value,attribute[name]],organisationUnits[id]&filter=attributeValues.value:eq:true&filter=attributeValues.attribute.name:eq:Is Report").then(function (results) {
            $scope.data.dataSets = results.data.dataSets;
            $scope.loadTracker = undefined;
            $http.get(DHIS2URL + "api/organisationUnits.json?filter=level:eq:1&fields=id,name,level,children[id,name,level,children[id,name,level,children[id,name,level,children[id,name,level,children]]]]")
                .then(function (results) {
                    $scope.data.organisationUnits = results.data.organisationUnits;
                    ReportService.sortOrganisationUnits($scope.data.organisationUnits[0]);
                    $scope.loadTracker = undefined;
                },function(error){
                    $scope.data.organisationUnits = [];
                    toaster.pop('error', "Error" + error.status, "Error Loading Organisation Units. Please try again");
                });
        },function(error){
            $scope.loadTracker = undefined;
            toaster.pop('error', "Error" + error.status, "Error Loading Data Sets. Please try again");
        });
        $scope.removeTrustedHtml = function () {
            $scope.trustedHtml = false;
        }
        $scope.generateDataSetReport = function () {
            $location.path("/reportRequest/dataSet/" + $scope.data.dataSet.id + "/orgUnit/" + $scope.data.selectedOrgUnit.id + "/period/" + $scope.data.period);

        };
    })
    .controller("MainController", function ($scope, DHIS2URL, $http) {

    })
    .controller("ReportRequestController", function ($scope, $routeParams, $http, DHIS2URL, ReportService, $location,$sce,toaster,$timeout) {
        $scope.reloadPage = function(){window.location.reload();}

        $scope.user = {};
        $scope.data = {};
        $scope.load = function(url){
            $location.path(url);
        };
        $scope.download = function(url){
            window.open('../archive/' + $routeParams.dataSet + '_' + $routeParams.orgUnit + '_' +$routeParams.period + '.pdf', '_blank');
        };

        $scope.generateDataSetReport = function () {
            $location.path("/report/dataSet/" + $routeParams.dataSet + "/orgUnit/" + $routeParams.orgUnit + "/period/" + $routeParams.period);

        };
        $scope.getOrgUnitStatus = function (id) {
            var returnVal = "Incomplete";
            $scope.completeDataSetRegistrations.forEach(function (dataSet) {
                if (dataSet.organisationUnit.id == id) {
                    returnVal = "Complete";
                }
            });
            return returnVal;
        };
        $scope.createDataSetReport = function () {
            ReportService.createDataSetReport({
                orgUnit: $routeParams.orgUnit,
                period: $routeParams.period,
                dataSet: $routeParams.dataSet
            }).then(function () {
                $scope.reportStatus = "Not Executed";
            });
        };
        $scope.undoDataSetReport = function () {
            $scope.loadFile = undefined;
            ReportService.undoDataSetReport({
                orgUnit: $routeParams.orgUnit,
                period: $routeParams.period,
                dataSet: $routeParams.dataSet
            }).then(function () {
                toaster.pop('success', "Report Undone", "Report was undone successfully.");
                $scope.reloadPage();
            });
        };
        $scope.completeDataSetRegistrationsLoading = false;
        $scope.reportStatus = "";
        //$scope.file = undefinde;
        $scope.watchParameters = function () {
            $scope.loadingArchive = true;
            $scope.data.archive = undefined;
            $scope.completeDataSetRegistrations = undefined;
            //Check if the report is in the not executed namespace
            $http.get(DHIS2URL + "api/dataStore/notExecuted/" + $routeParams.dataSet + "_" + $routeParams.orgUnit + "_" + $routeParams.period).then(function (results) {
                $scope.reportStatus = "Not Executed";
            },function(error){
                if(error.data.httpStatusCode == 404){
                    //Check if the report is in the executed namespace
                    $http.get(DHIS2URL + "api/dataStore/executed/" + $routeParams.dataSet + "_" + $routeParams.orgUnit + "_" + $routeParams.period).then(function (results) {

                        $scope.reportStatus = "Executed";
                        $http.get('../archive/' + $routeParams.dataSet + '_' + $routeParams.orgUnit + '_' +$routeParams.period + '.html').then(function(result){
                            $scope.file = $sce.trustAsHtml(result.data);
                            $scope.loadFile = true;

                        })
                    },function(error){
                        if(error.data.httpStatusCode == 404){
                            $scope.reportStatus = "Starting";
                            $scope.loadingArchive = false;
                            if (!$scope.data.archive) {
                                $scope.completeDataSetRegistrationsLoading = true;
                                var periodDate = ReportService.getPeriodDate($routeParams.period);
                                $http.get(DHIS2URL + "api/dataSets/"+$routeParams.dataSet+".json?fields=attributeValues[value,attribute[name]],organisationUnits[id]").then(function (results) {
                                    $scope.dataSet = results.data;
                                    $scope.isNotAuthorized = function(){
                                        var returnValue = true;
                                        $scope.dataSet.organisationUnits.forEach(function(dataSetOrgUnit){
                                            $scope.user.organisationUnits.forEach(function(userOrgUnit){
                                                if(dataSetOrgUnit.id == userOrgUnit.id){
                                                    returnValue = false;
                                                }
                                            });
                                        });
                                        return returnValue;
                                    }
                                    if(results.data.attributeValues.length > 0){
                                        var dataSetFound = false;
                                        results.data.attributeValues.forEach(function(attributeValue){
                                            if(attributeValue.attribute.name == "DataSet"){
                                                dataSetFound = true;
                                                $http.get(DHIS2URL + "api/completeDataSetRegistrations.json?dataSet=" + attributeValue.value + "&orgUnit=" + $routeParams.orgUnit + "&startDate=" + periodDate.startDate + "&endDate=" + periodDate.endDate + "&children=true").then(function (results) {
                                                    if(results.data.completeDataSetRegistrations){
                                                        $scope.completeDataSetRegistrations = results.data.completeDataSetRegistrations;
                                                    }else{
                                                        $scope.completeDataSetRegistrations = [];
                                                    }

                                                    $scope.completeDataSetRegistrationsLoading = false;

                                                },function(error){
                                                    $scope.error = "heye";
                                                    $scope.completeDataSetRegistrationsLoading = false;
                                                    toaster.pop('error', "Error" + error.status, "Error Loading Archive. Please try again");
                                                });
                                            }
                                        });
                                        if(!dataSetFound){
                                            $scope.completeDataSetRegistrations = [];
                                            $scope.completeDataSetRegistrationsLoading = false;
                                        }
                                    }else{
                                        $scope.completeDataSetRegistrations = [];
                                        $scope.completeDataSetRegistrationsLoading = false;
                                    }
                                },function(error){
                                    $scope.error = "heye";
                                    $scope.completeDataSetRegistrationsLoading = false;
                                    toaster.pop('error', "Error" + error.status, "Error Loading Data Set. Please try again");
                                });

                            }else{
                                $scope.error = "heye";
                                toaster.pop('error', "Error" + error.status, "Error Loading Archive. Please try again");
                            }
                        }
                        else{
                            $scope.error = "heye";
                            $scope.reportStatus = "";
                            toaster.pop('error', "Error" + error.status, "Error Loading Archive. Please try again");
                        }
                    });
                }
            });

        };
        $scope.user = {};
        $http.get(DHIS2URL + "api/me.json?fields=:all,organisationUnits[id,level]").then(function (results) {
            $scope.user = results.data;
            $http.get(DHIS2URL + "api/organisationUnits/" + $routeParams.orgUnit + ".json?fields=id,name,children[id,name]")
                .then(function (results) {
                    $scope.data.organisationUnit = results.data;
                    ReportService.sortOrganisationUnits($scope.data.organisationUnit);
                    $scope.watchParameters();
                    $scope.loadTracker = undefined;
                });
        })
    })
    .controller("ReportController", function ($scope, $http, $routeParams, $sce, $q, DHIS2URL, $timeout, $compile, $location, ReportService,$window,toaster) {
        $scope.reloadPage = function(){window.location.reload();}

        $scope.load = function(url){
            $location.path(url);
        }
        $scope.generateDataSetReport = function () {
            $location.path("/reportRequest/dataSet/" + $routeParams.dataSet + "/orgUnit/" + $routeParams.orgUnit + "/period/" + $routeParams.period);

        };
        $scope.notArchive = ($location.$$absUrl.indexOf("report.html") == -1)
        $scope.data = {}
        $scope.trustedHtml = undefined;
        $scope.loadingReport = false;
        $scope.preview = $routeParams.preview;

        $scope.progressValue = 0;
        $scope.loadingStatus = "Loading";
        $scope.getReport = function () {
            $scope.loadingReport = true;
            $scope.trustedHtml = undefined;
            var deffered = $q.defer();
            var promises = [];
            $scope.dataElementsData = {};
            $scope.lastMonthOfQuarterData = {};
            $scope.loadingStatus = "Loading Organisation Units";
            $http.get(DHIS2URL + "api/organisationUnits/" + $routeParams.orgUnit + ".json?fields=:all").then(function (results) {
                var organisationUnit = results.data;
                var children = [];
                organisationUnit.children.forEach(function(child){
                    children.push(child.id);
                });
                $scope.progressValue = 10;
                $scope.loadingStatus = "Loading Data Set";
                $http.get(DHIS2URL + "api/dataSets/" + $routeParams.dataSet + ".json?fields=:all,dataEntryForm[htmlCode],dataElements[id,valueType]").then(function (results) {
                    $scope.data.dataSetForm = results.data;
                    var trustedHtml = $scope.renderHtml(results.data.dataEntryForm.htmlCode, results.data.dataElements);

                    $scope.loadingStatus = "Loading Data";
                    var common = 50;
                    $scope.progressValue = 20;
                    var progressFactor = 60 / (($scope.dataElements.length + $scope.nonAggregatedDataElements.length)/common);
                    for (var i = 0; i < Math.ceil($scope.dataElements.length / common); i++) {
                        promises.push($http.get(DHIS2URL + "api/analytics.json?ag&dimension=dx:" + $scope.dataElements.slice(i * 10, i * 10 + common).join(";") + "&dimension=pe:" + $routeParams.period + "&filter=ou:" + $routeParams.orgUnit + "&displayProperty=NAME")
                            .then(function (analyticsResults) {
                                analyticsResults.data.rows.forEach(function (row) {
                                    $scope.dataElementsData[row[0]] = row[2];
                                });
                            }));
                        $scope.progressValue = $scope.progressValue + progressFactor;
                    }

                    if($scope.lastMonthOfQuarter.length > 0){
                        var str = $routeParams.period.split("Q");
                        var month = 3 * parseInt(str[1]);
                        if(month < 10){
                            month = "0" + month;
                        }
                        for (var i = 0; i < Math.ceil($scope.lastMonthOfQuarter.length / common); i++) {
                            promises.push($http.get(DHIS2URL + "api/analytics.json?ag&dimension=dx:" + $scope.lastMonthOfQuarter.slice(i * 10, i * 10 + common).join(";") + "&dimension=pe:" + str[0] + month + "&filter=ou:" + $routeParams.orgUnit + "&displayProperty=NAME")
                                .then(function (analyticsResults) {
                                    analyticsResults.data.rows.forEach(function (row) {
                                        $scope.lastMonthOfQuarterData[row[0]] = row[2];
                                    });
                                }));
                            $scope.progressValue = $scope.progressValue + progressFactor;
                        }
                    }
                    for (var i = 0; i < Math.ceil($scope.nonAggregatedDataElements.length / common); i++) {
                        promises.push($http.get(DHIS2URL + "api/analytics.json?dimension=dx:" + $scope.nonAggregatedDataElements.slice(i * 10, i * 10 + common).join(";") + "&dimension=pe:" + $routeParams.period + "&filter=ou:" + $routeParams.orgUnit + ";"+children.join(";")+"&displayProperty=NAME")
                            .then(function (analyticsResults) {
                                analyticsResults.data.rows.forEach(function (row) {
                                    $scope.dataElementsData[row[0]] = row[2];
                                });
                                $scope.progressValue = $scope.progressValue + progressFactor;
                            },function(error){
                                console.log(error);
                            }));
                    }
                    for (var i = 0; i < Math.ceil($scope.nonAggregatedDataElementsDate.length / common); i++) {
                        promises.push($http.get(DHIS2URL + "api/analytics.json?dimension=dx:" + $scope.nonAggregatedDataElementsDate.slice(i * 10, i * 10 + common).join(";") + "&dimension=pe:" + $routeParams.period + "&filter=ou:" + $routeParams.orgUnit + ";"+children.join(";")+"&displayProperty=NAME")
                            .then(function (analyticsResults) {
                                analyticsResults.data.rows.forEach(function (row) {
                                    $scope.dataElementsData[row[0]] = row[2];
                                });

                            },function(error){
                                console.log(error);
                            }));
                    }
                    $q.all(promises).then(function () {
                        $scope.trustedHtml = trustedHtml;
                        //$scope.loadingReport = false;
                        promises = [];

                        var programIds = [];
                        for(var programId in $scope.autogrowingPrograms){
                            programIds.push(programId);
                            promises.push($scope.fetchEventAnalytics(programId));
                        }
                        $q.all(promises).then(function () {
                            $http.get(DHIS2URL + "api/programs.json?fields=id,programStages[programStageDataElements[sortOrder,dataElement[:all]]]&filter=id:in:[" + programIds + "]")
                                .then(function (results) {
                                    results.data.programs.forEach(function(program){
                                        program.programStages[0].programStageDataElements.forEach(function(programStageDataElement){
                                            var dataElement = programStageDataElement.dataElement;
                                            dataElement.sortOrder = programStageDataElement.sortOrder;
                                            $scope.autogrowingPrograms[program.id].dataElementsDetails.push(dataElement);
                                        })
                                    });
                                    $timeout(function () {
                                        deffered.resolve();
                                    });
                                },function(error){
                                    $scope.error = "Hey";
                                    toaster.pop('error', "Error" + error.status, "Error Loading Data Set. Please try again");
                                })
                            //$scope.loadingReport = false;

                        });
                    },function(error){
                        $scope.error = "Hey";
                        toaster.pop('error', "Error" + error.status, "Error Loading Data from Server. Please try again");
                    });
                });
            });

            return deffered.promise;
        }
        var periodDate = ReportService.getPeriodDate($routeParams.period);
        $scope.fetchEventAnalytics = function(programId){
            $http.get(DHIS2URL + "api/analytics/events/query/"+programId+"?startDate="+periodDate.startDate+"&endDate="+periodDate.endDate+"&dimension=ou:"+$routeParams.orgUnit+"&dimension=" + $scope.autogrowingPrograms[programId].dataElements.join("&dimension="))
                .then(function (analyticsResults) {
                    analyticsResults.data.rows.forEach(function (row) {
                        var object = {};
                        analyticsResults.data.headers.forEach(function(header,index){
                            object[header.column] = row[index];
                        });
                        $scope.autogrowingPrograms[programId].data.push(object);
                    });

                },function(error){
                    $scope.error = "Hey";
                    toaster.pop('error', "Error" + error.status, "Error Loading Data Set. Please try again");
                })
        }
        $scope.back = function () {
            $location.path("/standardReport");
        }
        $scope.dataElements = [];
        $scope.lastMonthOfQuarter = [];
        $scope.nonAggregatedDataElements = [];
        $scope.nonAggregatedDataElementsDate = [];
        $scope.autogrowingPrograms = {};
        function performRender(html, dataElements) {
            var inputRegEx = /<input (.*?)>/g;
            var match = null;
            var newHtml = html;
            //Render inputs
            while ((match = inputRegEx.exec(html)) !== null) {
                //var idRegEx = /id="(.*?)-(.*?)-val"/;

                var idMacth = null;

                if ((idMacth = /id="(.*?)-(.*?)-val"/.exec(match[0])) !== null) {
                    var isValidAggregate = true;
                    var isDate = false;
                    dataElements.forEach(function (dataElement) {
                        if (dataElement.id == idMacth[1] && (dataElement.valueType == "DATE" || dataElement.valueType == "TEXT")) {
                            isValidAggregate = false;
                            if(dataElement.valueType == "DATE"){
                                isDate = true;
                            }
                        }
                    });
                    if (isValidAggregate) {
                        if(match[0].indexOf("lastMonthOfQuarter") > -1){//If it is last month of quarter
                            newHtml = newHtml.replace(match[0], "<label>{{lastMonthOfQuarterData['" + idMacth[1] + "." + idMacth[2] + "']}}</label>");
                            $scope.lastMonthOfQuarter.push(idMacth[1] + "." + idMacth[2]);
                        }else{
                            newHtml = newHtml.replace(match[0], "<label>{{dataElementsData['" + idMacth[1] + "." + idMacth[2] + "']}}</label>");
                            $scope.dataElements.push(idMacth[1] + "." + idMacth[2]);
                        }

                    } else {
                        if(isDate){
                            $scope.nonAggregatedDataElementsDate.push(idMacth[1] + "." + idMacth[2]);
                        }else{
                            $scope.nonAggregatedDataElements.push(idMacth[1] + "." + idMacth[2]);
                        }
                        newHtml = newHtml.replace(match[0], "<label id='" + idMacth[1] + "'>{{dataElementsData['" + idMacth[1] + "." + idMacth[2] + "']}}</label>");
                    }
                } else if ((idMacth = /id="indicator(.*?)"/.exec(match[0])) !== null) {
                    newHtml = newHtml.replace(match[0], "<label> {{dataElementsData['" + idMacth[1] + "']}}</label>");
                    $scope.dataElements.push(idMacth[1]);
                } else if ((idMacth = /id="indicator(.*?)"/.exec(match[0])) !== null) {
                    newHtml = newHtml.replace(match[0], "<label>{{dataElementsData['" + idMacth[1] + "']}}</label>");
                    $scope.dataElements.push(idMacth[1]);
                } else if ((idMacth = /dataelementid="(.*?)"/.exec(match[0])) !== null) {
                    newHtml = newHtml.replace(match[0], "<label>{{dataElementsData['" + idMacth[1] + "']}}</label>");
                    $scope.dataElements.push(idMacth[1]);
                }else {
                    console.log(match);
                }
            };
            //Render autogrowing
            var autogrowingRegEx = /<tbody autogrowing(.*?)>/g;
            match = null;
            //Render inputs
            while ((match = autogrowingRegEx.exec(html)) !== null) {
                var autogrowingMacth = null;
                if ((autogrowingMacth = /config="(.*?)"/.exec(match[0])) !== null) {
                    var config = eval('(' + autogrowingMacth[1] + ')');
                    if($scope.autogrowingPrograms[config.programId]){
                        $scope.autogrowingPrograms[config.programId].dataElements = $scope.autogrowingPrograms[config.programId].dataElements.concat(config.dataElements);
                    }else{
                        /*$scope.autogrowingPrograms[config.programId] = {
                            dataElements:config.dataElements,
                            dataElementsDetails:[],
                            data:[]
                        }*/
                        $scope.autogrowingPrograms[config.programId] = config;
                        $scope.autogrowingPrograms[config.programId].dataElementsDetails = [];
                        $scope.autogrowingPrograms[config.programId].data = [];
                    }
                    newHtml = newHtml.replace(match[0], "<tbody autogrowing config='autogrowingPrograms[\"" + config.programId + "\"]'></tbody>");
                }
            };
            return newHtml;
        }

        $scope.renderHtml = function (html, dataElements) {
            $scope.dataElements = [];
            var newHtml = performRender(html, dataElements);
            newHtml = performRender(newHtml, dataElements);
            return $sce.trustAsHtml(newHtml);
        }
        $scope.getReport().then(function () {
            var reportElement = document.getElementById("report");
            $compile(reportElement.children)($scope);
            $timeout(function () {
                $scope.progressValue = 100;
                $scope.loadingReport = false;
                $window.document.title = "Report Loaded";
            });
        },function (error) {
            $scope.error = "Hey";
            toaster.pop('error', "Error", "Error Loading Data. Please try again.");
        });
        $scope.createDataSetReport = function () {
            ReportService.createDataSetReport({
                orgUnit: $scope.data.selectedOrgUnit.id,
                period: $scope.data.period,
                dataSet: $scope.data.dataSet.id
            }).then(function () {

            },function (error) {
                $scope.error = "Hey";
                toaster.pop('error', "Error", "Error Loading Data. Please try again.");
            });
        };
    });
