/* global angular */

'use strict';
/* Controllers */
var appControllers = angular.module('appControllers', [])
    .controller('StandardReportController', function ($scope, DHIS2URL, $http, $sce, $timeout, $location, ReportService, toaster) {

        $scope.data = {
            selectedOrgUnit: undefined,
            config: {},
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

                            if (monthVal > 12) {
                                monthVal = monthVal % 12;
                            }
                            if (monthVal == 1) {
                                year++;
                            }
                            var testDate = new Date();
                            if ((year == testDate.getFullYear() && monthVal > (testDate.getMonth() + 1)) || year > testDate.getFullYear()) {
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
                        if (this.list.length == 0) {
                            this.populateList(new Date(date.getFullYear() - 2, date.getMonth() + 1, date.getDate()))
                        }
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
                            if (quarterVal == 5) {
                                quarterVal = 1;
                            }
                            if (quarterVal == 6) {
                                quarterVal = 2;
                            }
                            if (quarterVal == 1) {
                                year++;
                            }
                            var testDate = new Date();
                            if ((year == testDate.getFullYear() && quarterVal > ((testDate.getMonth() + 1) % 4)) || year > testDate.getFullYear()) {
                                return;
                            }
                            that.list.push({
                                name: quarter + " " + year,
                                value: year + "Q" + quarterVal
                            })
                        });
                        if (this.list.length == 0) {
                            this.populateList(new Date(date.getFullYear() - 2, date.getMonth() + 1, date.getDate()))
                        }
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
                            if ((i == testDate.getFullYear() && (testDate.getMonth() + 1) < 7) || (i == (testDate.getFullYear() - 1) && (testDate.getMonth() + 1) < 7) || i > testDate.getFullYear()) {
                                continue;
                            }
                            this.list.push({name: "July " + i + " - June " + (i + 1), value: i + "July"});
                        }
                    }
                }
            }
        };
        $scope.cancel = function () {

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
        $scope.$watch("data.selectedOrgUnit", function (selectedOrgUnit) {
            if (selectedOrgUnit) {
                var found = false;
                if ($scope.data.dataSet) {
                    $scope.data.dataSet.organisationUnits.forEach(function (orgUnt) {
                        if (orgUnt.id == selectedOrgUnit.id) {
                            found = true;
                        }
                    });
                    if (!found) {
                        toaster.pop('warning', "Warning", "Please select a corresponding organisation for the report");
                        $scope.data.config.toggleSelection($scope.data.selectedOrgUnit);
                        $scope.data.selectedOrgUnit = undefined;
                    }
                } else {
                    toaster.pop('warning', "Warning", "Please select a report");
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
            ReportService.getUser().then(function (results) {
                var orgUnitIds = [];
                results.organisationUnits.forEach(function (orgUnit) {
                    orgUnitIds.push(orgUnit.id);
                });
                $http.get(DHIS2URL + "api/organisationUnits.json?filter=id:in:[" + orgUnitIds + "]&fields=id,name,level,children[id,name,level,children[id,name,level,children[id,name,level,children[id,name,level,children]]]]")
                    .then(function (results) {
                        $scope.data.organisationUnits = results.data.organisationUnits;
                        $scope.data.organisationUnits.forEach(function (orgUnit) {
                            ReportService.sortOrganisationUnits(orgUnit);
                        });
                        $scope.loadTracker = undefined;
                    }, function (error) {
                        $scope.data.organisationUnits = [];
                        toaster.pop('error', "Error" + error.status, "Error Loading Organisation Units. Please try again");
                    });
            })

        }, function (error) {
            $scope.loadTracker = undefined;
            toaster.pop('error', "Error" + error.status, "Error Loading Data Sets. Please try again");
        });
        $scope.removeTrustedHtml = function () {
            $scope.trustedHtml = false;
        }
        $scope.generateDataSetReport = function () {
            $location.path("/dataSetReport/reportRequest/dataSet/" + $scope.data.dataSet.id + "/orgUnit/" + $scope.data.selectedOrgUnit.id + "/period/" + $scope.data.period);

        };
    })
    .controller("MainController", function ($scope, DHIS2URL, $http) {

    })
    .controller("ReportRequestController", function ($scope, $routeParams, $http, DHIS2URL, ReportService, $location, $sce, toaster, $timeout) {
        $scope.reloadPage = function () {
            window.location.reload();
        }

        $scope.user = {};
        $scope.data = {};
        $scope.load = function (url) {
            $location.path(url);
        };
        $scope.download = function (url) {
            window.open('../archive/' + $routeParams.dataSet + '_' + $routeParams.orgUnit + '_' + $routeParams.period + '.pdf', '_blank');
        };

        $scope.generateDataSetReport = function () {
            $location.path("/dataSetReport/report/dataSet/" + $routeParams.dataSet + "/orgUnit/" + $routeParams.orgUnit + "/period/" + $routeParams.period + "/preview");

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
            }, function (error) {
                if (error.data.httpStatusCode == 404) {
                    //Check if the report is in the executed namespace
                    $http.get(DHIS2URL + "api/dataStore/executed/" + $routeParams.dataSet + "_" + $routeParams.orgUnit + "_" + $routeParams.period).then(function (results) {

                        $scope.reportStatus = "Executed";
                        $http.get('../archive/' + $routeParams.dataSet + '_' + $routeParams.orgUnit + '_' + $routeParams.period + '.html').then(function (result) {
                            $scope.file = $sce.trustAsHtml(result.data);
                            $scope.loadFile = true;

                        })
                    }, function (error) {
                        if (error.data.httpStatusCode == 404) {
                            $scope.reportStatus = "Starting";
                            $scope.loadingArchive = false;
                            if (!$scope.data.archive) {
                                $scope.completeDataSetRegistrationsLoading = true;
                                var periodDate = ReportService.getPeriodDate($routeParams.period);
                                $http.get(DHIS2URL + "api/dataSets/" + $routeParams.dataSet + ".json?fields=attributeValues[value,attribute[name]],organisationUnits[id]").then(function (results) {
                                    $scope.dataSet = results.data;
                                    $scope.isNotAuthorized = function () {
                                        var returnValue = true;
                                        $scope.dataSet.organisationUnits.forEach(function (dataSetOrgUnit) {
                                            $scope.user.organisationUnits.forEach(function (userOrgUnit) {
                                                if (dataSetOrgUnit.id == userOrgUnit.id && userOrgUnit.level == "3") {
                                                    returnValue = false;
                                                }
                                            });
                                        });
                                        return returnValue;
                                    }
                                    if (results.data.attributeValues.length > 0) {
                                        var dataSetFound = false;
                                        results.data.attributeValues.forEach(function (attributeValue) {
                                            if (attributeValue.attribute.name == "DataSet") {
                                                dataSetFound = true;
                                                $http.get(DHIS2URL + "api/completeDataSetRegistrations.json?dataSet=" + attributeValue.value + "&orgUnit=" + $routeParams.orgUnit + "&startDate=" + periodDate.startDate + "&endDate=" + periodDate.endDate + "&children=true").then(function (results) {
                                                    if (results.data.completeDataSetRegistrations) {
                                                        $scope.completeDataSetRegistrations = results.data.completeDataSetRegistrations;
                                                    } else {
                                                        $scope.completeDataSetRegistrations = [];
                                                    }

                                                    $scope.completeDataSetRegistrationsLoading = false;

                                                }, function (error) {
                                                    $scope.error = "heye";
                                                    $scope.completeDataSetRegistrationsLoading = false;
                                                    toaster.pop('error', "Error" + error.status, "Error Loading Archive. Please try again");
                                                });
                                            }
                                        });
                                        if (!dataSetFound) {
                                            $scope.completeDataSetRegistrations = [];
                                            $scope.completeDataSetRegistrationsLoading = false;
                                        }
                                    } else {
                                        $scope.completeDataSetRegistrations = [];
                                        $scope.completeDataSetRegistrationsLoading = false;
                                    }
                                }, function (error) {
                                    $scope.error = "heye";
                                    $scope.completeDataSetRegistrationsLoading = false;
                                    toaster.pop('error', "Error" + error.status, "Error Loading Data Set. Please try again");
                                });

                            } else {
                                $scope.error = "heye";
                                toaster.pop('error', "Error" + error.status, "Error Loading Archive. Please try again");
                            }
                        }
                        else {
                            $scope.error = "heye";
                            $scope.reportStatus = "";
                            toaster.pop('error', "Error" + error.status, "Error Loading Archive. Please try again");
                        }
                    });
                }
            });

        };
        $http.get(DHIS2URL + "api/me.json?fields=:all,organisationUnits[id,level]").then(function (results) {
            $scope.user = results.data;
            $http.get(DHIS2URL + "api/organisationUnits/" + $routeParams.orgUnit + ".json?fields=id,name,children[id,name]")
                .then(function (results) {
                    $scope.data.organisationUnit = results.data;
                    ReportService.sortOrganisationUnits($scope.data.organisationUnit);
                    $scope.watchParameters();
                    $scope.loadTracker = undefined;
                });
        });
        $scope.savingComment = "commentLoad";
        $http.get(DHIS2URL + "api/dataStore/comments/" + $routeParams.dataSet + "_" + $routeParams.orgUnit + "_" + $routeParams.period).then(function (results) {
            $scope.savingComment = "";
            $scope.commentData = results.data;
        }, function (error) {
            $scope.commentData = {};
            $scope.savingComment = "";
            toaster.pop('info', "Information", "No comments where found.");
        });
        $scope.showComment = function () {
            $scope.saveComment = function () {
                console.log(JSON.stringify($scope.commentData));
                $scope.savingComment = "savingLoad";
                if ($scope.commentData.lastCommenter) {
                    $http.put(DHIS2URL + "api/dataStore/comments/" + $routeParams.dataSet + "_" + $routeParams.orgUnit + "_" + $routeParams.period, $scope.commentData).then(function (results) {
                        $scope.savingComment = "";
                        toaster.pop('success', "Success", "Saved Comments Successfully.");
                    }, function (error) {
                        $scope.savingComment = "error";
                        toaster.pop('error', "Failure", "Failed to post the comment. Please Try again.");
                    });
                } else {
                    $scope.commentData = {
                        comment: $scope.commentData.comment,
                        lastUpdated: new Date(),
                        lastCommenter: $scope.user
                    };
                    $http.post(DHIS2URL + "api/dataStore/comments/" + $routeParams.dataSet + "_" + $routeParams.orgUnit + "_" + $routeParams.period, $scope.commentData).then(function (results) {
                        $scope.savingComment = "";
                        toaster.pop('success', "Success", "Saved Comments Successfully.");
                    }, function (error) {
                        $scope.savingComment = "error";
                        toaster.pop('error', "Failure", "Failed to post the comment. Please Try again.");
                    });
                }

            }
            $scope.closeComment = function(){
                $('#demo').collapse('toggle');
            }
        }
        $scope.approveData = {}
        $http.get(DHIS2URL + "api/dataStore/approve/" + $routeParams.dataSet + "_" + $routeParams.orgUnit + "_" + $routeParams.period).then(function (results) {
            //$scope.savingComment = "";
            $scope.approveData = results.data;
        }, function (error) {
            //$scope.savingComment = "";
            //toaster.pop('info', "Information", "No comments where found.");
        });
        $scope.approvalStatus = "";
        $scope.approve = function () {
            $scope.approvalStatus = "Approving Report..";
            $scope.approveData = {lastUpdated: new Date(), user: $scope.user};
            $http.post(DHIS2URL + "api/dataStore/approve/" + $routeParams.dataSet + "_" + $routeParams.orgUnit + "_" + $routeParams.period, $scope.approveData).then(function (results) {
                //$scope.approveData.data = true;
                $scope.approvalStatus = "";
                toaster.pop('success', "Success", "Report Approved Successfully.");
            }, function (error) {
                $scope.approvalStatus = "";
                toaster.pop('error', "Failure", "Failed to approve report. Please Try again.");
            });
        }
        $scope.disApprove = function () {
            $scope.approvalStatus = "Disapproving Report..";
            $http.delete(DHIS2URL + "api/dataStore/approve/" + $routeParams.dataSet + "_" + $routeParams.orgUnit + "_" + $routeParams.period).then(function (results) {
                $scope.approveData = {};
                $scope.approvalStatus = "";
                toaster.pop('success', "Success", "Report Disapproved Successfully.");
            }, function (error) {
                $scope.approvalStatus = "";
                toaster.pop('error', "Failure", "Failed to disapprove report. Please Try again.");
            });

        }
    })
    .controller("ReportController", function ($scope, $http, $routeParams, $sce, $q, DHIS2URL, $timeout, $compile, $location, ReportService, $window, toaster) {
        var common = 50;
        $scope.state = $routeParams.preview;
        $scope.showDebug = function(){
            $location.path("/dataSetReport/report/dataSet/" + $routeParams.dataSet + "/orgUnit/" + $routeParams.orgUnit + "/period/" + $routeParams.period + "/debug");
        };
        $scope.showPreview = function(){
            $location.path("/dataSetReport/report/dataSet/" + $routeParams.dataSet + "/orgUnit/" + $routeParams.orgUnit + "/period/" + $routeParams.period + "/preview");
        };
        $scope.reloadPage = function () {
            window.location.reload();
        }

        $scope.load = function (url) {
            $location.path(url);
        }
        $scope.generateDataSetReport = function () {
            $location.path("/dataSetReport/reportRequest/dataSet/" + $routeParams.dataSet + "/orgUnit/" + $routeParams.orgUnit + "/period/" + $routeParams.period);

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
            $scope.cumulativeToDateData = {};
            $scope.fourthQuarterData = {};
            $scope.listByWardData = {};
            $scope.loadingStatus = "Loading Organisation Units";
            $http.get(DHIS2URL + "api/organisationUnits/" + $routeParams.orgUnit + ".json?fields=:all").then(function (results) {
                var organisationUnit = results.data;
                var children = [];
                organisationUnit.children.forEach(function (child) {
                    children.push(child.id);
                });
                $scope.progressValue = 10;
                $scope.loadingStatus = "Loading Data Set";
                $http.get(DHIS2URL + "api/dataSets/" + $routeParams.dataSet + ".json?fields=:all,dataEntryForm[htmlCode],dataElements[id,valueType]").then(function (results) {
                    $scope.data.dataSetForm = results.data;
                    var trustedHtml = $scope.renderHtml(results.data.dataEntryForm.htmlCode, results.data.dataElements);
                    $scope.loadingStatus = "Loading Data Values";

                    $scope.progressValue = 20;
                    var progressFactor = 60 / (($scope.dataElements.length + $scope.nonAggregatedDataElements.length + $scope.lastMonthOfQuarter.length + $scope.fourthQuarter.length) / common);
                    for (var i = 0; i < $scope.dataElements.length; i += common) {
                        promises.push($http.get(DHIS2URL + "api/analytics.json?ag&dimension=dx:" + $scope.dataElements.slice(i, i + common).join(";") + "&dimension=pe:" + $routeParams.period + "&filter=ou:" + $routeParams.orgUnit + "&displayProperty=NAME")
                            .then(function (analyticsResults) {
                                analyticsResults.data.rows.forEach(function (row) {
                                    $scope.dataElementsData[row[0]] = row[2];
                                });
                            }));
                        $scope.progressValue = $scope.progressValue + progressFactor;
                    }
                    if ($scope.listByWard.length > 0) {
                        if ($scope.dataSet.attributeValues.length > 0) {
                            var dataSetFound = false;
                            $scope.dataSet.attributeValues.forEach(function (attributeValue) {
                                if (attributeValue.attribute.name == "DataSet") {
                                    dataSetFound = true;
                                    promises.push($http.get(DHIS2URL + "api/dataValueSets.json?dataSet=" + attributeValue.value + "&orgUnit=" + $routeParams.orgUnit + "&children=true&period=" + $routeParams.period)
                                        .then(function (dataSetResults) {
                                            $scope.listByWard.forEach(function (dx) {
                                                $scope.listByWardData[dx] = [];
                                            });
                                            if(dataSetResults.data.dataValues)
                                            dataSetResults.data.dataValues.forEach(function (value) {
                                                if ($scope.listByWardData[value.dataElement + "." + value.categoryOptionCombo]) {
                                                    $scope.listByWardData[value.dataElement + "." + value.categoryOptionCombo].push(value);
                                                }
                                            });
                                        }));
                                }
                            });

                        }
                    }
                    if ($scope.lastMonthOfQuarter.length > 0) {
                        var str = $routeParams.period.split("Q");
                        var month = 3 * parseInt(str[1]);
                        if (month < 10) {
                            month = "0" + month;
                        }
                        for (var i = 0; i < $scope.lastMonthOfQuarter.length; i += common) {
                            promises.push($http.get(DHIS2URL + "api/analytics.json?dimension=dx:" + $scope.lastMonthOfQuarter.slice(i, i + common).join(";") + "&dimension=pe:" + str[0] + month + "&filter=ou:" + $routeParams.orgUnit + "&displayProperty=NAME")
                                .then(function (analyticsResults) {
                                    analyticsResults.data.rows.forEach(function (row) {
                                        $scope.lastMonthOfQuarterData[row[0]] = row[2];
                                    });
                                }));
                            $scope.progressValue = $scope.progressValue + progressFactor;
                        }
                    }
                    if ($scope.cumulativeToDate.length > 0) {
                        var str = $routeParams.period.split("Q");
                        var quarter = parseInt(str[1]);
                        var periods = [];
                        if (quarter == 3) {
                            periods = [$routeParams.period];
                        } else if (quarter == 4) {
                            periods = [$routeParams.period, str[0] + "Q3"];
                        } else if (quarter == 1) {
                            periods = [$routeParams.period, (parseInt(str[0]) - 1) + "Q4", (parseInt(str[0]) - 1) + "Q3"];
                        } else if (quarter == 2) {
                            periods = [$routeParams.period, str[0] + "Q1", (parseInt(str[0]) - 1) + "Q4", (parseInt(str[0]) - 1) + "Q3"];
                        }
                        for (var i = 0; i < $scope.cumulativeToDate.length; i += common) {
                            periods.forEach(function (period) {
                                promises.push($http.get(DHIS2URL + "api/analytics.json?cumulative&dimension=dx:" + $scope.cumulativeToDate.slice(i, i + common).join(";") + "&dimension=pe:" + period + "&filter=ou:" + $routeParams.orgUnit + "&displayProperty=NAME")
                                    .then(function (analyticsResults) {
                                        analyticsResults.data.rows.forEach(function (row) {
                                            if ($scope.cumulativeToDateData[row[0]]) {
                                                $scope.cumulativeToDateData[row[0]] = (parseFloat($scope.cumulativeToDateData[row[0]]) + parseFloat(row[2])).toFixed(1) + 1;
                                            } else {
                                                $scope.cumulativeToDateData[row[0]] = row[2];
                                            }

                                        });
                                    }));
                                $scope.progressValue = $scope.progressValue + progressFactor;
                            });
                        }
                    }
                    if ($scope.fourthQuarter.length > 0) {
                        for (var i = 0; i < $scope.fourthQuarter.length; i += common) {
                            promises.push($http.get(DHIS2URL + "api/analytics.json?dimension=dx:" + $scope.fourthQuarter.slice(i, i + common).join(";") + "&dimension=pe:" + (parseInt($routeParams.period.replace("July", "")) + 1) + "Q2&filter=ou:" + $routeParams.orgUnit + "&displayProperty=NAME")
                                .then(function (analyticsResults) {
                                    analyticsResults.data.rows.forEach(function (row) {
                                        $scope.fourthQuarterData[row[0]] = row[2];
                                    });
                                }));
                            $scope.progressValue = $scope.progressValue + progressFactor;
                        }
                    }
                    for (var i = 0; i < $scope.nonAggregatedDataElements.length; i += common) {
                        promises.push($http.get(DHIS2URL + "api/analytics.json?dimension=dx:" + $scope.nonAggregatedDataElements.slice(i, i + common).join(";") + "&dimension=pe:" + $routeParams.period + "&filter=ou:" + $routeParams.orgUnit + ";" + children.join(";") + "&displayProperty=NAME")
                            .then(function (analyticsResults) {
                                analyticsResults.data.rows.forEach(function (row) {
                                    $scope.dataElementsData[row[0]] = row[2];
                                });
                                $scope.progressValue = $scope.progressValue + progressFactor;
                            }, function (error) {
                                console.log(error);
                            }));
                    }
                    for (var i = 0; i < $scope.nonAggregatedDataElementsDate.length; i += common) {
                        promises.push($http.get(DHIS2URL + "api/analytics.json?dimension=dx:" + $scope.nonAggregatedDataElementsDate.slice(i, i + common).join(";") + "&dimension=pe:" + $routeParams.period + "&filter=ou:" + $routeParams.orgUnit + ";" + children.join(";") + "&displayProperty=NAME")
                            .then(function (analyticsResults) {
                                analyticsResults.data.rows.forEach(function (row) {
                                    $scope.dataElementsData[row[0]] = row[2];
                                });

                            }, function (error) {
                                console.log(error);
                            }));
                    }
                    $q.all(promises).then(function () {
                        $scope.trustedHtml = trustedHtml;
                        //$scope.loadingReport = false;
                        promises = [];

                        var programIds = [];
                        for (var programId in $scope.autogrowingPrograms) {
                            programIds.push(programId);
                            promises.push($scope.fetchEventAnalytics(programId));
                        }
                        $q.all(promises).then(function () {
                            $scope.loadingStatus = "Loading Autogrowing";
                            $http.get(DHIS2URL + "api/programs.json?fields=id,programStages[programStageDataElements[sortOrder,dataElement[:all]]]&filter=id:in:[" + programIds + "]")
                                .then(function (results) {
                                    results.data.programs.forEach(function (program) {
                                        program.programStages[0].programStageDataElements.forEach(function (programStageDataElement) {
                                            var dataElement = programStageDataElement.dataElement;
                                            dataElement.sortOrder = programStageDataElement.sortOrder;
                                            $scope.autogrowingPrograms[program.id].dataElementsDetails.push(dataElement);
                                        })
                                    });
                                    $timeout(function () {
                                        deffered.resolve();
                                    });
                                }, function (error) {
                                    $scope.error = "Hey";
                                    toaster.pop('error', "Error" + error.status, "Error Loading Data Set. Please try again");
                                })
                            //$scope.loadingReport = false;

                        });
                    }, function (error) {
                        $scope.error = "Hey";
                        toaster.pop('error', "Error" + error.status, "Error Loading Data from Server. Please try again");
                    });
                });
            });

            return deffered.promise;
        }
        var periodDate = ReportService.getPeriodDate($routeParams.period);
        $scope.fetchEventAnalytics = function (programId) {
            return $http.get(DHIS2URL + "api/analytics/events/query/" + programId + "?startDate=" + periodDate.startDate + "&endDate=" + periodDate.endDate + "&dimension=ou:" + $routeParams.orgUnit + "&dimension=" + $scope.autogrowingPrograms[programId].dataElements.join("&dimension="))
                .then(function (analyticsResults) {
                    analyticsResults.data.rows.forEach(function (row) {
                        var object = {};
                        analyticsResults.data.headers.forEach(function (header, index) {
                            object[header.column] = row[index];
                        });
                        $scope.autogrowingPrograms[programId].data.push(object);
                    });

                }, function (error) {
                    $scope.error = "Hey";
                    toaster.pop('error', "Error" + error.status, "Error Loading Data Set. Please try again");
                })
        }
        $scope.back = function () {
            $location.path("/dataSetReport");
        }
        $scope.dataElements = [];
        $scope.lastMonthOfQuarter = [];
        $scope.cumulativeToDate = [];
        $scope.listByWard = [];
        $scope.fourthQuarter = [];
        $scope.nonAggregatedDataElements = [];
        $scope.nonAggregatedDataElementsDate = [];
        $scope.autogrowingPrograms = {};
        $scope.getElementReplacment = function (content, type) {
            var div = "<div>{{" + content + "}}";
            if ($routeParams.preview == "debug") {
                var processed = content.replace("dataElementsData['","").replace("']","");
                var addition ="";
                if(content.indexOf("dataElementsData['") > -1){
                    addition = "type='" +type +"'";
                }else{

                }
                div += "<debug dg-id='"+processed+"' "+addition+"></debug>";

            }
            div += "</div>";
            return div;
        }
        $scope.getDebugId = function(id){
            return $scope.debugData[id];
        }
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
                            if (dataElement.valueType == "DATE") {
                                isDate = true;
                            }
                        }
                    });
                    if (isValidAggregate) {
                        if (match[0].indexOf("lastMonthOfQuarter") > -1) {//If it is last month of quarter
                            newHtml = newHtml.replace(match[0], $scope.getElementReplacment("lastMonthOfQuarterData['" + idMacth[1] + "." + idMacth[2] + "']", "dataElement"));
                            $scope.lastMonthOfQuarter.push(idMacth[1] + "." + idMacth[2]);
                        } else if (match[0].indexOf("fourthQuarter") > -1) {//If it is last month of quarter
                            var label = "<div>";
                            if (match[0].indexOf("integer") > -1) {
                                //label = "<label integer >";
                            }
                            newHtml = newHtml.replace(match[0], $scope.getElementReplacment("fourthQuarterData['" + idMacth[1] + "." + idMacth[2] + "']", "dataElement"));
                            $scope.fourthQuarter.push(idMacth[1] + "." + idMacth[2]);
                        } else if (match[0].indexOf("cumulative-to-date") > -1) {//If it is last month of quarter
                            var label = "<div>";
                            newHtml = newHtml.replace(match[0], $scope.getElementReplacment("cumulativeToDateData['" + idMacth[1] + "." + idMacth[2] + "']", "dataElement"));
                            $scope.cumulativeToDate.push(idMacth[1] + "." + idMacth[2]);
                        } else if (match[0].indexOf("list-by-ward") > -1) {//If it is last month of quarter
                            var label = "<div list-by-ward='listByWardData[\"" + idMacth[1] + "." + idMacth[2] + "\"]' org-unit='orgUnit'>";
                            newHtml = newHtml.replace(match[0], "<div list-by-ward='listByWardData[\"" + idMacth[1] + "." + idMacth[2] + "\"]' org-unit='orgUnit'>");
                            $scope.listByWard.push(idMacth[1] + "." + idMacth[2]);
                        } else {
                            newHtml = newHtml.replace(match[0], $scope.getElementReplacment("dataElementsData['" + idMacth[1] + "." + idMacth[2] + "']", "dataElement"));
                            $scope.dataElements.push(idMacth[1] + "." + idMacth[2]);
                        }

                    } else {
                        if (isDate) {
                            $scope.nonAggregatedDataElementsDate.push(idMacth[1] + "." + idMacth[2]);
                        } else {
                            $scope.nonAggregatedDataElements.push(idMacth[1] + "." + idMacth[2]);
                        }
                        newHtml = newHtml.replace(match[0], $scope.getElementReplacment("dataElementsData['" + idMacth[1] + "." + idMacth[2] + "']", "dataElement"));
                    }
                } else if ((idMacth = /id="indicator(.*?)"/.exec(match[0])) !== null) {
                    if (match[0].indexOf("fourthQuarter") > -1) {//If it is last month of quarter
                        var label = "<div>";
                        if (match[0].indexOf("integer") > -1) {
                            label = "<label integer >";
                        }
                        newHtml = newHtml.replace(match[0], $scope.getElementReplacment("fourthQuarterData['" + idMacth[1] + "']", "indicator"));
                        $scope.fourthQuarter.push(idMacth[1]);
                    } else {
                        newHtml = newHtml.replace(match[0], $scope.getElementReplacment("dataElementsData['" + idMacth[1] + "']", "indicator"));
                        $scope.dataElements.push(idMacth[1]);
                    }

                } else if ((idMacth = /dataelementid="(.*?)"/.exec(match[0])) !== null) {
                    if (match[0].indexOf("fourthQuarter") > -1) {//If it is last month of quarter
                        var label = "<div>";
                        if (match[0].indexOf("integer") > -1) {
                            label = "<label integer >";
                        }
                        newHtml = newHtml.replace(match[0], $scope.getElementReplacment("fourthQuarterData['" + idMacth[1] + "']", "dataElement"));
                        $scope.fourthQuarter.push(idMacth[1]);
                    } else {
                        newHtml = newHtml.replace(match[0], $scope.getElementReplacment("dataElementsData['" + idMacth[1] + "']", "dataElement"));
                        $scope.dataElements.push(idMacth[1]);
                    }
                } else {
                    console.log(match);
                }
            }
            ;
            //Render autogrowing
            var autogrowingRegEx = /<tbody autogrowing(.*?)>/g;
            match = null;
            //Render inputs

            while ((match = autogrowingRegEx.exec(html)) !== null) {
                var autogrowingMacth = null;
                if ((autogrowingMacth = /config="(.*?)"/.exec(match[0])) !== null) {
                    var config = eval('(' + autogrowingMacth[1] + ')');
                    if ($scope.autogrowingPrograms[config.programId]) {
                        $scope.autogrowingPrograms[config.programId].dataElements = $scope.autogrowingPrograms[config.programId].dataElements.concat(config.dataElements);
                    } else {
                        /*$scope.autogrowingPrograms[config.programId] = {
                         dataElements:config.dataElements,
                         dataElementsDetails:[],
                         data:[]
                         }*/
                        $scope.autogrowingPrograms[config.programId] = config;
                        $scope.autogrowingPrograms[config.programId].dataElementsDetails = [];
                        $scope.autogrowingPrograms[config.programId].data = [];
                    }
                    var directive = "autogrowing";
                    if ($routeParams.preview == "debug") {
                        directive = "autogrowing-debug a-debug= '" + JSON.stringify(config) + "'";
                    }
                    newHtml = newHtml.replace(match[0], "<tbody "+directive+" config='autogrowingPrograms[\"" + config.programId + "\"]'></tbody>");
                }
            }
            ;
            return newHtml;
        }

        $scope.renderHtml = function (html, dataElements) {
            $scope.dataElements = [];
            var newHtml = performRender(html, dataElements);
            //newHtml = performRender(newHtml, dataElements);
            return $sce.trustAsHtml(newHtml);
        };
        //Load dataset informatioin

        $http.get(DHIS2URL + "api/dataSets/" + $routeParams.dataSet + ".json?fields=attributeValues[value,attribute[name]],organisationUnits[id]").then(function (results) {
            $scope.dataSet = results.data;
            //Load organisation Unit data
            $http.get(DHIS2URL + "api/organisationUnits/" + $routeParams.orgUnit + ".json?fields=id,name,children[id,name]").then(function (results) {
                $scope.orgUnit = results.data;
                $scope.getReport().then(function () {
                    var reportElement = document.getElementById("report");
                    $compile(reportElement.children)($scope);
                    $timeout(function () {
                        $scope.progressValue = 100;
                        $scope.loadingReport = false;
                        $window.document.title = "Report Loaded";

                    });
                }, function (error) {
                    $scope.error = "Hey";
                    toaster.pop('error', "Error", "Error Loading Data. Please try again.");
                });
            }, function (error) {
                toaster.pop('error', "Error" + error.status, "Error Loading Organisation Unit.");
            });
        }, function (error) {
            toaster.pop('error', "Error" + error.status, "Error Loading Data Set. Please try again");
        });
        $scope.user = {};
        $http.get(DHIS2URL + "api/me.json?fields=:all,organisationUnits[id,level]").then(function (results) {

            $scope.user = results.data;
        $http.get(DHIS2URL + "api/dataStore/notExecuted/" + $routeParams.dataSet + "_" + $routeParams.orgUnit + "_" + $routeParams.period).then(function (results) {
            $scope.reportStatus = "Not Executed";
        }, function (error) {
            if (error.data.httpStatusCode == 404) {
                //Check if the report is in the executed namespace
                $http.get(DHIS2URL + "api/dataStore/executed/" + $routeParams.dataSet + "_" + $routeParams.orgUnit + "_" + $routeParams.period).then(function (results) {

                    $scope.reportStatus = "Executed";
                    $http.get('../archive/' + $routeParams.dataSet + '_' + $routeParams.orgUnit + '_' + $routeParams.period + '.html').then(function (result) {
                        $scope.file = $sce.trustAsHtml(result.data);
                        $scope.loadFile = true;

                    })
                }, function (error) {
                    if (error.data.httpStatusCode == 404) {
                        $scope.reportStatus = "Starting";
                        $scope.loadingArchive = false;
                        if (!$scope.data.archive) {
                            $scope.completeDataSetRegistrationsLoading = true;
                            var periodDate = ReportService.getPeriodDate($routeParams.period);
                            $http.get(DHIS2URL + "api/dataSets/" + $routeParams.dataSet + ".json?fields=attributeValues[value,attribute[name]],organisationUnits[id]").then(function (results) {
                                $scope.dataSet = results.data;
                                $scope.isNotAuthorized = function () {
                                    var returnValue = true;
                                    $scope.dataSet.organisationUnits.forEach(function (dataSetOrgUnit) {
                                        $scope.user.organisationUnits.forEach(function (userOrgUnit) {
                                            if (dataSetOrgUnit.id == userOrgUnit.id && userOrgUnit.level == "3") {
                                                returnValue = false;
                                            }
                                        });
                                    });
                                    return returnValue;
                                }
                                if (results.data.attributeValues.length > 0) {
                                    var dataSetFound = false;
                                    results.data.attributeValues.forEach(function (attributeValue) {
                                        if (attributeValue.attribute.name == "DataSet") {
                                            dataSetFound = true;
                                            $http.get(DHIS2URL + "api/completeDataSetRegistrations.json?dataSet=" + attributeValue.value + "&orgUnit=" + $routeParams.orgUnit + "&startDate=" + periodDate.startDate + "&endDate=" + periodDate.endDate + "&children=true").then(function (results) {
                                                if (results.data.completeDataSetRegistrations) {
                                                    $scope.completeDataSetRegistrations = results.data.completeDataSetRegistrations;
                                                } else {
                                                    $scope.completeDataSetRegistrations = [];
                                                }

                                                $scope.completeDataSetRegistrationsLoading = false;

                                            }, function (error) {
                                                $scope.completeDataSetRegistrationsLoading = false;
                                                toaster.pop('error', "Error" + error.status, "Error Loading Archive. Please try again");
                                            });
                                        }
                                    });
                                    if (!dataSetFound) {
                                        $scope.completeDataSetRegistrations = [];
                                        $scope.completeDataSetRegistrationsLoading = false;
                                    }
                                } else {
                                    $scope.completeDataSetRegistrations = [];
                                    $scope.completeDataSetRegistrationsLoading = false;
                                }
                            }, function (error) {
                                $scope.error = "heye";
                                $scope.completeDataSetRegistrationsLoading = false;
                                toaster.pop('error', "Error" + error.status, "Error Loading Data Set. Please try again");
                            });

                        } else {
                            $scope.error = "heye";
                            toaster.pop('error', "Error" + error.status, "Error Loading Archive. Please try again");
                        }
                    }
                    else {
                        $scope.error = "heye";
                        $scope.reportStatus = "";
                        toaster.pop('error', "Error" + error.status, "Error Loading Archive. Please try again");
                    }
                });
            }
        });
        });
        $scope.createDataSetReport = function () {
            ReportService.createDataSetReport({
                orgUnit: $routeParams.orgUnit,
                period: $routeParams.period,
                dataSet: $routeParams.dataSet
            }).then(function () {
                toaster.pop('success', "Report", "Report will be created during the night.");
                $location.path("/dataSetReport/reportRequest/dataSet/" + $routeParams.dataSet + "/orgUnit/" + $routeParams.orgUnit + "/period/" + $routeParams.period);
            }, function () {
                toaster.pop('error', "Error", "Error Loading Data. Please try again.");
            });
        };
    })
    .controller("CoverController", function ($scope, $location, $http, DHIS2URL) {
        var url = $location.$$url.replace("/dataSetReport", "").replace("/report/", "").replace("dataSet/", "").replace("/orgUnit/", "/").replace("/period/", "/").split("/");
        $scope.dataSet = url[0];
        $scope.orgUnit = url[1];
        $scope.period = url[2];
        $scope.dataSetDetails = {};
        $http.get(DHIS2URL + "api/dataSets/" + $scope.dataSet + ".json").then(function (result) {
            console.log(result);
            $scope.dataSetDetails = result.data;
            if($scope.dataSetDetails.periodType == 'FinancialJuly'){
                if ($scope.period.indexOf("July") > -1) {
                    $scope.periodString = "July " + $scope.period.substr(0, 4) + " - June " + (parseInt($scope.period.substr(0, 4)) + 1);
                }
            }else if($scope.dataSetDetails.periodType == 'Quarterly'){
                $scope.periodString = parseInt($scope.period.substr(0, 4));
            }else if($scope.dataSetDetails.periodType == 'Monthly'){
                $scope.periodString = $scope.period.substr(4, 6) + " " + $scope.period.substr(0, 4);
            }
        });
        $http.get(DHIS2URL + "api/organisationUnits/" + $scope.orgUnit + ".json?fields=name,level,parent[name,level]").then(function (result) {
            console.log(result.data.level);
            if (result.data.level == 3) {
                $scope.district = result.data.name;
                $scope.region = result.data.parent.name;
            }else if (result.data.level == 2) {
                $scope.region = result.data.parent.name;
            }
        });
        $scope.periodString = ""
    })
    .controller('CustomReportController', function ($scope, DHIS2URL, $http, $sce, $timeout, $location, ReportService, toaster) {

        $scope.reportList = {};

        $scope.pageNumber = 1;
        $scope.pageSize = 50;
        $scope.pageCount = 0;

        $scope.alter = "listAlternateRow";
        $scope.hover = [];
        $scope.click = [];

        $scope.goPrevPage = function (  pageNumber, pageSize  ) {
            pageNumber-=1;
            if(pageNumber<1){
                pageNumber = 1;
            }
            $scope.pageNumber = pageNumber;
            $scope.loadReports( pageNumber, pageSize );
        }

        $scope.goFirstPage = function (    ) {
            $scope.pageNumber = 1;
            $scope.loadReports( $scope.pageNumber, $scope.pageSize );
        }

        $scope.goNextPage = function (  pageNumber, pageSize  ) {
            pageNumber+=1;
            if(pageNumber>$scope.pageCount){
                pageNumber = $scope.pageCount;
            }
            $scope.pageNumber = pageNumber;
            $scope.loadReports( pageNumber, pageSize );
        }

        $scope.goLastPage = function (   ) {
            $scope.pageNumber = $scope.pageCount;
            $scope.loadReports( $scope.pageNumber, $scope.pageSize );
        }


        $scope.loadReports = function ( pageNumber, pageSize ) {

            $http.get(DHIS2URL + "/api/reports.json?fields=*&page="+pageNumber+"&pageSize="+pageSize).then(function(result){

                $scope.reportList  = $scope.prepareReports(result);
            });

        }

        $scope.loadFilteredReports = function ( filterName ) {

            $http.get(DHIS2URL + "/api/reports.json?filter=name:ilike:"+filterName+"&fields=*").then(function(result){

                $scope.reportList  = $scope.prepareReports(result);
            });

        }



        $scope.filterReport = function ( reportName ) {

            if ( reportName && reportName != "" ) {
                $scope.loadFilteredReports( reportName );
            }else{

                $scope.loadReports( $scope.pageNumber,$scope.pageSize );
            }

        }

        $scope.clearFilter = function (  ) {

            $scope.reportName = null;

        }

        $scope.addNewReport = function (  ) {

            console.log("Adding new Report");

        }

        $scope.prepareReports = function ( results ) {
            $scope.pageCount = results.data.pager.pageCount;
            var data = results.data.reports;

            return data;

        }

        $scope.getClass = function (index) {
            if( index % 2  === 0) {

            }else{
                return "";
            }
            return $scope.alter;
        }

        /**
         * Change State of the table row on hover
         * */

        $scope.getHover = function (index) {
            $scope.hover = [];
            $scope.hover[index] = "listHoverRow";
            return $scope.hover;
        }

        $scope.getClick = function (event,index) {
            localStorage.setItem($scope.reportList[index].id,JSON.stringify($scope.reportList[index]));
            $scope.read      = $scope.reportList[index].access.read;
            $scope.manage    = $scope.reportList[index].access.manage;
            $scope.write     = $scope.reportList[index].access.write;
            $scope.update    = $scope.reportList[index].access.update;
            $scope.delete    = $scope.reportList[index].access.delete;
            $scope.externalize = $scope.reportList[index].access.externalize;
            $scope.currentReport = $scope.reportList[index];
            dhis2.contextmenu.makeContextMenu({
                menuId: 'contextMenu',
                menuItemActiveClass: 'contextMenuItemActive',
                listItemProps: ['id', 'uid', 'name', 'type', 'report-type']
            });

            return $scope.click;
        }

        $scope.loadGetReportParamForm = function (currentReport) {
            console.log(currentReport);
        }

        $scope.loadReports($scope.pageNumber,$scope.pageSize);

    })
    .controller('CreateCustomReportController', function ($scope, DHIS2URL, $http, $sce, $timeout,$routeParams, $location, ReportService, toaster) {

        $scope.reportUid = $routeParams.uid;
        $scope.report  = localStorage.getItem($scope.reportUid)?eval('('+localStorage.getItem($scope.reportUid)+')'):null;
        $scope.reportPeriod = null;
        dhis2.report = ReportService.dhis2.report;


        $scope.data = {
            selectedOrgUnit: undefined,
            config: {},
            archive: undefined,
            report: [],
            period: "",
            periodTypes:ReportService.periodTypes
        };

        $scope.currentDate = new Date();

        $scope.loadingArchive = false;


        $scope.getReportPeriodType = function () {
            var periodType = "FinancialJuly";
            if ( $scope.report ) {
                var relativePeriods = $scope.report.relativePeriods;

                angular.forEach( relativePeriods, function (periodStatus, periodTypes) {

                    if ( periodStatus ) {

                        periodType = periodTypes;
                    }

                } )
            }

            if( periodType == 'thisYear' ) {

                periodType = "FinancialJuly";
            }

            if( periodType == 'thisMonth' ) {

                periodType = "Monthly";
            }
            if( periodType == 'thisQuarter' ) {

                periodType = "Quarterly";
            }

            return periodType;
        }

        $scope.renderCustomReport = function ( reportUid ) {

            $location.path('/customReport/'+reportUid+'/render');
        }

        $scope.periodType = $scope.getReportPeriodType();

        $scope.data.periodTypes[$scope.periodType].populateList();

        $scope.$watch("data.selectedOrgUnit", function (selectedOrgUnit) {
            if (selectedOrgUnit) {

                ReportService.prepareOrganisationUnit(selectedOrgUnit);
                ReportService.prepareOrganisationUnitHierarchy(selectedOrgUnit,$scope.data.organisationUnits);

                dhis2.report = ReportService.dhis2.report;

                localStorage.setItem('dhis2',JSON.stringify(dhis2));

            }
        });


        ReportService.getUser().then(function (results) {
            var orgUnitIds = [];
            results.organisationUnits.forEach(function (orgUnit) {
                orgUnitIds.push(orgUnit.id);
            });
            $http.get(DHIS2URL + "api/organisationUnits.json?filter=id:in:[" + orgUnitIds + "]&fields=id,name,level,children[id,name,level,children[id,name,level,children[id,name,level,children[id,name,level,children]]]]")
                .then(function (results) {
                    $scope.data.organisationUnits = results.data.organisationUnits;
                    $scope.data.organisationUnits.forEach(function (orgUnit) {
                        ReportService.sortOrganisationUnits(orgUnit);
                    });
                }, function (error) {
                    $scope.data.organisationUnits = [];
                    toaster.pop('error', "Error" + error.status, "Error Loading Organisation Units. Please try again");
                });
        });
        console.log($location.path());

        if ( $location.path().indexOf('render') >=0 ) {

            $scope.$on('$viewContentLoaded', function(event) {
                dhis2 = eval('('+localStorage.getItem('dhis2')+')');
                var renderedReport  = ReportService.getRenderedReport($scope.reportUid);
                console.log(renderedReport.designContent);
                $scope.renderedReport  = $sce.trustAsHtml(renderedReport.designContent);
            });


        }

    })
    .controller('NewCustomReportController', function ($scope, DHIS2URL, $http, $sce, $timeout, $location, ReportService, toaster) {
        ///customReport/new

    })