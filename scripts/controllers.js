/* global angular */

'use strict';
/* Controllers */
var appControllers = angular.module('appControllers', [])
    .controller('StandardReportController', function ($scope, DHIS2URL, $http, $sce, $timeout, $location, ReportService) {

        $scope.data = {
            selectedOrgUnit: undefined,
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
                        monthNames.forEach(function (monthName, index) {
                            var monthVal = index;
                            if (monthVal < 10) {
                                monthVal = "0" + monthVal;
                            }
                            that.list.push({
                                name: monthName + " " + date.getFullYear(),
                                value: date.getFullYear() + "" + monthVal
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
                        quarters.forEach(function (quarter, index) {
                            that.list.push({
                                name: quarter + " " + date.getFullYear(),
                                value: date.getFullYear() + "Q" + index
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
                        for (var i = date.getFullYear() - 5; i < date.getFullYear() + 5; i++) {
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
            console.log(name, JSON.stringify(retPeriodType));
            return retPeriodType;
        }
        $scope.$watch("data.dataSet", function (value) {
            if (value) {
                $scope.currentDate = new Date();
                $scope.data.periodTypes[value.periodType].populateList();
            }
        });
        $scope.loadingArchive = false;

        $scope.completeDataSetRegistrations = undefined;

        $scope.archiveDataElements = [];
        $scope.loadTracker = "Loading Data Sets";
        $http.get(DHIS2URL + "api/dataSets.json?fields=id,name,periodType&filter=name:like:Report").then(function (results) {
            $scope.data.dataSets = results.data.dataSets;
            $scope.loadTracker = "Loading Organisation Units";
            $http.get(DHIS2URL + "api/organisationUnits.json?filter=level:eq:1&fields=id,name,children[id,name,children[id,name,children[id,name,children[id,name,children]]]]")
                .then(function (results) {
                    $scope.data.organisationUnits = results.data.organisationUnits;
                    ReportService.sortOrganisationUnits($scope.data.organisationUnits[0]);
                    $scope.loadTracker = undefined;
                });
        });
        $scope.removeTrustedHtml = function () {
            $scope.trustedHtml = false;
        }
        $scope.generateDataSetReport = function () {
            $location.path("/reportRequest/" + $scope.data.dataSet.id + "/" + $scope.data.selectedOrgUnit.id + "/" + $scope.data.period);

        };
    })
    .controller("MainController", function ($scope, DHIS2URL, $http) {
        $scope.user = {};
        $http.get(DHIS2URL + "api/me.json").then(function (results) {
            $scope.user = results.data;
        })
    })
    .controller("ReportRequestController", function ($scope, $routeParams, $http, DHIS2URL, ReportService, $location,$sce) {

        $scope.data = {};
        $scope.load = function(url){
            $location.path(url);
        };

        $scope.generateDataSetReport = function () {
            $location.path("/report/" + $routeParams.dataSet + "/" + $routeParams.orgUnit + "/" + $routeParams.period);

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
            ReportService.undoDataSetReport({
                orgUnit: $routeParams.orgUnit,
                period: $routeParams.period,
                dataSet: $routeParams.dataSet
            }).then(function () {
                $scope.generateDataSetReport();
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
                        })
                    },function(error){
                        if(error.data.httpStatusCode == 404){
                            $scope.reportStatus = "Starting";
                            $scope.loadingArchive = false;
                            if (!$scope.data.archive) {
                                $scope.completeDataSetRegistrationsLoading = true;
                                var periodDate = ReportService.getPeriodDate($routeParams.period);
                                $http.get(DHIS2URL + "api/completeDataSetRegistrations.json?dataSet=" + $routeParams.dataSet + "&orgUnit=" + $routeParams.orgUnit + "&startDate=" + periodDate.startDate + "&endDate=" + periodDate.endDate + "&children=true").then(function (results) {
                                    /*results.data = {
                                     completeDataSetRegistrations: [
                                     {
                                     dataSet: {
                                     name: "Lars: Mod2",
                                     created: "2016-01-15T14:29:22.282+0000",
                                     lastUpdated: "2016-04-21T13:01:55.611+0000",
                                     externalAccess: false,
                                     publicAccess: "rw------",
                                     user: {
                                     name: "John Francis Mukulu",
                                     created: "2013-04-17T03:14:31.327+0000",
                                     lastUpdated: "2016-02-23T11:53:02.937+0000",
                                     externalAccess: false,
                                     displayName: "John Francis Mukulu",
                                     id: "I9adYOw0VBL"
                                     },
                                     displayName: "Lars: Mod2",
                                     id: "KXIWDEtpS8F"
                                     },
                                     period: {
                                     code: "2015Q2",
                                     name: "2015Q2",
                                     externalAccess: false,
                                     displayName: "2015Q2",
                                     id: "2015Q2"
                                     },
                                     attributeOptionCombo: {
                                     name: "default",
                                     created: "2012-01-15T04:01:25.683+0000",
                                     lastUpdated: "2015-07-19T17:20:04.363+0000",
                                     externalAccess: false,
                                     displayName: "default",
                                     id: "uGIJ6IdkP7Q"
                                     },
                                     date: "2016-04-20T12:14:12.022+0000",
                                     storedBy: "Training",
                                     organisationUnit: {
                                     code: "100642-8",
                                     name: "Buzuruga Health Center",
                                     created: "2012-03-02T08:00:19.035+0000",
                                     lastUpdated: "2016-03-04T16:06:19.355+0000",
                                     externalAccess: false,
                                     displayName: "Buzuruga Health Center",
                                     id: "wardId99184"
                                     }
                                     },
                                     {
                                     dataSet: {
                                     name: "Lars: Mod2",
                                     created: "2016-01-15T14:29:22.282+0000",
                                     lastUpdated: "2016-04-21T13:01:55.611+0000",
                                     externalAccess: false,
                                     publicAccess: "rw------",
                                     user: {
                                     name: "John Francis Mukulu",
                                     created: "2013-04-17T03:14:31.327+0000",
                                     lastUpdated: "2016-02-23T11:53:02.937+0000",
                                     externalAccess: false,
                                     displayName: "John Francis Mukulu",
                                     id: "I9adYOw0VBL"
                                     },
                                     displayName: "Lars: Mod2",
                                     id: "wardId99189"
                                     },
                                     period: {
                                     code: "2015Q4",
                                     name: "2015Q4",
                                     externalAccess: false,
                                     displayName: "2015Q4",
                                     id: "2015Q4"
                                     },
                                     attributeOptionCombo: {
                                     name: "default",
                                     created: "2012-01-15T04:01:25.683+0000",
                                     lastUpdated: "2015-07-19T17:20:04.363+0000",
                                     externalAccess: false,
                                     displayName: "default",
                                     id: "uGIJ6IdkP7Q"
                                     },
                                     date: "2016-04-28T10:15:38.105+0000",
                                     storedBy: "Training",
                                     organisationUnit: {
                                     code: "103662-3",
                                     name: "Luhanga Dispensary",
                                     created: "2012-03-02T08:00:19.047+0000",
                                     lastUpdated: "2016-03-04T16:03:14.570+0000",
                                     externalAccess: false,
                                     displayName: "Luhanga Dispensary",
                                     id: "wardId99195"
                                     }
                                     },
                                     {
                                     dataSet: {
                                     name: "Lars: Mod2",
                                     created: "2016-01-15T14:29:22.282+0000",
                                     lastUpdated: "2016-04-21T13:01:55.611+0000",
                                     externalAccess: false,
                                     publicAccess: "rw------",
                                     user: {
                                     name: "John Francis Mukulu",
                                     created: "2013-04-17T03:14:31.327+0000",
                                     lastUpdated: "2016-02-23T11:53:02.937+0000",
                                     externalAccess: false,
                                     displayName: "John Francis Mukulu",
                                     id: "I9adYOw0VBL"
                                     },
                                     displayName: "Lars: Mod2",
                                     id: "KXIWDEtpS8F"
                                     },
                                     period: {
                                     code: "2015Q4",
                                     name: "2015Q4",
                                     externalAccess: false,
                                     displayName: "2015Q4",
                                     id: "2015Q4"
                                     },
                                     attributeOptionCombo: {
                                     name: "default",
                                     created: "2012-01-15T04:01:25.683+0000",
                                     lastUpdated: "2015-07-19T17:20:04.363+0000",
                                     externalAccess: false,
                                     displayName: "default",
                                     id: "uGIJ6IdkP7Q"
                                     },
                                     date: "2016-04-28T18:16:15.228+0000",
                                     storedBy: "Training",
                                     organisationUnit: {
                                     code: "107276-8",
                                     name: "Sangabuye Health Center",
                                     created: "2012-03-02T08:00:19.049+0000",
                                     lastUpdated: "2016-03-04T15:47:21.395+0000",
                                     externalAccess: false,
                                     displayName: "Sangabuye Health Center",
                                     id: "wardId99190"
                                     }
                                     }
                                     ]
                                     };*/
                                    if(results.data.completeDataSetRegistrations){
                                        $scope.completeDataSetRegistrations = results.data.completeDataSetRegistrations;
                                    }else{
                                        $scope.completeDataSetRegistrations = [];
                                    }

                                    $scope.completeDataSetRegistrationsLoading = false;

                                });
                            }
                        }
                    });
                }
            });

        };
        $scope.user = {};
        $http.get(DHIS2URL + "api/me.json?fields=:all,organisationUnits[level]").then(function (results) {
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
    .controller("ReportController", function ($scope, $http, $routeParams, $sce, $q, DHIS2URL, $timeout, $compile, $location, ReportService,$window) {
        $scope.load = function(url){
            $location.path(url);
        }
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
                    for (var i = 0; i < Math.ceil($scope.nonAggregatedDataElements.length / common); i++) {
                        promises.push($http.get(DHIS2URL + "api/analytics.json?nag&dimension=dx:" + $scope.nonAggregatedDataElements.slice(i * 10, i * 10 + common).join(";") + "&dimension=pe:" + $routeParams.period + "&filter=ou:" + $routeParams.orgUnit + ";"+children.join(";")+"&displayProperty=NAME")
                            .then(function (analyticsResults) {
                                //console.log(analyticsResults);
                                analyticsResults.data.rows.forEach(function (row) {
                                    $scope.dataElementsData[row[0]] = row[2];
                                });
                                $scope.progressValue = $scope.progressValue + progressFactor;
                            },function(error){
                                console.log(error);
                            }));
                    }
                    for (var i = 0; i < Math.ceil($scope.nonAggregatedDataElementsDate.length / common); i++) {
                        promises.push($http.get(DHIS2URL + "api/analytics.json?nag&dimension=dx:" + $scope.nonAggregatedDataElementsDate.slice(i * 10, i * 10 + common).join(";") + "&dimension=pe:" + $routeParams.period + "&filter=ou:" + $routeParams.orgUnit + ";"+children.join(";")+"&displayProperty=NAME")
                            .then(function (analyticsResults) {
                                //console.log(analyticsResults);
                                analyticsResults.data.rows.forEach(function (row) {
                                    $scope.dataElementsData[row[0]] = row[2];
                                });

                            },function(error){
                                //console.log(error);
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
                                            if(program.id == "Do2HI9tvLGC"){
                                                console.log($scope.autogrowingPrograms[program.id]);
                                            }
                                            //console.log($scope.autogrowingPrograms[program.id]);
                                        })
                                    });
                                    $timeout(function () {
                                        deffered.resolve();
                                    });
                                },function(error){
                                    console.log(error);
                                })
                            //$scope.loadingReport = false;

                        });
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
                    console.log(error);
                })
        }
        $scope.back = function () {
            $location.path("/standardReport");
        }
        $scope.dataElements = [];
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

                        newHtml = newHtml.replace(match[0], "<label>{{dataElementsData['" + idMacth[1] + "." + idMacth[2] + "']}}</label>");
                        $scope.dataElements.push(idMacth[1] + "." + idMacth[2]);
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
                } else {
                    //console.log(match);
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
                        $scope.autogrowingPrograms[config.programId] = {
                            dataElements:config.dataElements,
                            dataElementsDetails:[],
                            data:[]
                        }
                    }
                    //console.log(autogrowingMacth[0],"<autogrowing "+autogrowingMacth[0]+" config='autogrowingPrograms[" + config.programId + "]'></autogrowing>");
                    newHtml = newHtml.replace(match[0], "<tbody autogrowing config='autogrowingPrograms[\"" + config.programId + "\"]'></tbody>");
                }
            };
            console.log($scope.autogrowingPrograms);
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
        });
        $scope.createDataSetReport = function () {
            ReportService.createDataSetReport({
                orgUnit: $scope.data.selectedOrgUnit.id,
                period: $scope.data.period,
                dataSet: $scope.data.dataSet.id
            }).then(function () {

            });
        };
    });
