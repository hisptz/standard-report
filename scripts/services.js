/* global angular */

'use strict';

/* Services */

var appServices = angular.module('appServices', ['ngResource'])
    .factory("ReportService", function ($http, DHIS2URL, $location, $q) {
        var archiveProgram = undefined;
        $http.get(DHIS2URL + "api/programs/UZjKG3b3nwV.json?fields=id,programStages[programStageDataElements[dataElement[:all]]]")
            .then(function (results) {
                archiveProgram = results.data;
            });
        return {
            sortOrganisationUnits: function (orgUnit) {
                var that = this;
                if (orgUnit.children) {
                    orgUnit.children.sort(function (child1, child2) {
                        return orgUnitFunction(child1).localeCompare(orgUnitFunction(child2));
                    });
                    orgUnit.children.forEach(function (child) {
                        that.sortOrganisationUnits(child);
                    })
                }
            },
            getPeriodDate: function (period) {
                var returnDate = {};
                if (period.indexOf("July") != -1) {
                    returnDate.startDate = period.substr(0, 4) + "-07-01";
                    returnDate.endDate = (parseInt(period.substr(0, 4)) + 1) + "-06-30";
                } else if (period.indexOf("Q") != -1) {
                    returnDate.startDate = period.substr(0, 4) + "-07-01";
                    returnDate.startDate = (parseInt(period.substr(0, 4)) + 1) + "-06-30";
                } else {
                    returnDate.startDate = period.substr(0, 4) + "-" + period.substr(5) + "-01";
                    returnDate.endDate = period.substr(0, 4) + "-" + period.substr(5) + "-31";
                }
                return returnDate;
            },
            createDataSetReport: function (data) {
                var deffered = $q.defer();
                $http.post(DHIS2URL + "api/dataStore/notExecuted/" + data.orgUnit + "_" + data.dataSet + "_" + data.period,{})
                    .then(function (results) {
                        console.log(results);
                        deffered.resolve();
                    });
                return deffered.promise;
            },
            undoDataSetReport:function(data){
                var deffered = $q.defer();
                var that = this;
                $http.delete(DHIS2URL + "api/dataStore/executed/" + data.orgUnit + "_" + data.dataSet + "_" + data.period)
                    .then(function (results) {
                        that.createDataSetReport(data).then(function(){
                            deffered.resolve();
                        });
                    });
                return deffered.promise;
            }
        }

    });

