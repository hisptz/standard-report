/* global angular */

'use strict';

/* Services */

var appServices = angular.module('appServices', ['ngResource'])
    .factory("ReportService", function ($http, DHIS2URL, $location, $q) {
        var userDeffered = $q.defer();
        var user = undefined;
        $http.get(DHIS2URL + "api/me.json").then(function (results) {
            user = results.data;
            userDeffered.resolve(user);
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
                    returnDate.endDate = (parseInt(period.substr(0, 4)) + 1) + "-06-30";
                } else {
                    /*var monthVal = parseInt(period.substr(5));
                    if(monthVal < 10){
                        monthVal = "0" + monthVal;
                    }*/
                    returnDate.startDate = period.substr(0, 4) + "-" + period.substr(4) + "-01";
                    returnDate.endDate = period.substr(0, 4) + "-" + period.substr(4) + "-31";
                }
                return returnDate;
            },
            createDataSetReport: function (data) {
                var deffered = $q.defer();
                $http.post(DHIS2URL + "api/dataStore/notExecuted/" + data.dataSet + "_" + data.orgUnit + "_" + data.period, {})
                    .then(function (results) {
                        deffered.resolve();
                    });
                return deffered.promise;
            },
            undoDataSetReport: function (data) {
                var deffered = $q.defer();
                var that = this;
                $http.delete(DHIS2URL + "api/dataStore/executed/" + data.dataSet + "_" + data.orgUnit + "_" + data.period)
                    .then(function (results) {
                        deffered.resolve();
                        /*that.createDataSetReport(data).then(function () {
                            deffered.resolve();
                        });*/
                    });
                return deffered.promise;
            },
            getUser:function(){
                if(user){
                    userDeffered.resolve(user);
                }
                return userDeffered.promise;
            }
        }

    })
    .factory("DebugService", function (){
        return {
            "DR01":{"NK6MyHADqBo.WgIlmdIhlpD":{consolidation:"Formula (Average)",source:"WF01"}}
        }
    });

