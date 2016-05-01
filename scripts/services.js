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
                console.log(returnDate);
                return returnDate;
            },
            createDataSetReport: function (data) {
                var deffered = $q.defer();
                $http.get(DHIS2URL + "api/me.json")
                    .then(function (results) {

                        var event = {
                            "program": archiveProgram.id,
                            "orgUnit": data.orgUnit,
                            "eventDate": new Date(),
                            "status": "COMPLETED",
                            "storedBy": results.data.displayName,
                            "dataValues": []
                        };
                        console.log(archiveProgram);
                        archiveProgram.programStages[0].programStageDataElements.forEach(function (dataElement) {
                            dataElement = dataElement.dataElement;
                            console.log(dataElement);
                            if (dataElement.name == "Data Set") {
                                event.dataValues.push({"dataElement": dataElement.id, "value": data.dataSet})
                            } else if (dataElement.name == "Organisation Unit") {
                                event.dataValues.push({
                                    "dataElement": dataElement.id,
                                    "value": data.orgUnit
                                })
                            } else if (dataElement.name == "Period") {
                                event.dataValues.push({"dataElement": dataElement.id, "value": data.period})
                            } else if (dataElement.name == "Executed") {
                                event.dataValues.push({"dataElement": dataElement.id, "value": "false"})
                            }
                        });
                        console.log(event);
                        $http.post(DHIS2URL + "api/events", event)
                            .then(function (results) {
                                deffered.resolve();
                                $location.path("/report/" + data.dataSet + "/" + data.orgUnit + "/" + data.period);
                            });
                    });
                return deffered.promise;
            }
        }

    });

