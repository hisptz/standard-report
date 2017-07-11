/* global angular */

'use strict';

/* Services */

var appServices = angular.module('appServices', ['ngResource'])
    .factory("ReportService", function ($http, DHIS2URL, $location, $q,$timeout,Excel) {
        var userDeffered = $q.defer();
        var user = undefined;
        $http.get(DHIS2URL + "api/me.json?fields=:all,userCredentials[:all,userRoles[:all]]").then(function (results) {
            user = results.data;
            userDeffered.resolve(user);
        });
        return {
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
            },
            dhis2: {
                "util": {},
                "commons": {},
                "array": {},
                "select": {},
                "period": {
                    "DEFAULT_DATE_FORMAT": "yyyy-mm-dd",
                    "format": "yyyy-mm-dd",
                    "calendar": {
                        "local": {
                            "name": "Gregorian",
                            "epochs": [
                                "BCE",
                                "CE"
                            ],
                            "monthNames": [
                                "January",
                                "February",
                                "March",
                                "April",
                                "May",
                                "June",
                                "July",
                                "August",
                                "September",
                                "October",
                                "November",
                                "December"
                            ],
                            "monthNamesShort": [
                                "Jan",
                                "Feb",
                                "Mar",
                                "Apr",
                                "May",
                                "Jun",
                                "Jul",
                                "Aug",
                                "Sep",
                                "Oct",
                                "Nov",
                                "Dec"
                            ],
                            "dayNames": [
                                "Sunday",
                                "Monday",
                                "Tuesday",
                                "Wednesday",
                                "Thursday",
                                "Friday",
                                "Saturday"
                            ],
                            "dayNamesShort": [
                                "Sun",
                                "Mon",
                                "Tue",
                                "Wed",
                                "Thu",
                                "Fri",
                                "Sat"
                            ],
                            "dayNamesMin": [
                                "Su",
                                "Mo",
                                "Tu",
                                "We",
                                "Th",
                                "Fr",
                                "Sa"
                            ],
                            "dateFormat": "mm/dd/yyyy",
                            "firstDay": 0,
                            "isRTL": false
                        },
                        "_validateLevel": 0
                    },
                    "generator": {
                        "calendar": {
                            "local": {
                                "name": "Gregorian",
                                "epochs": [
                                    "BCE",
                                    "CE"
                                ],
                                "monthNames": [
                                    "January",
                                    "February",
                                    "March",
                                    "April",
                                    "May",
                                    "June",
                                    "July",
                                    "August",
                                    "September",
                                    "October",
                                    "November",
                                    "December"
                                ],
                                "monthNamesShort": [
                                    "Jan",
                                    "Feb",
                                    "Mar",
                                    "Apr",
                                    "May",
                                    "Jun",
                                    "Jul",
                                    "Aug",
                                    "Sep",
                                    "Oct",
                                    "Nov",
                                    "Dec"
                                ],
                                "dayNames": [
                                    "Sunday",
                                    "Monday",
                                    "Tuesday",
                                    "Wednesday",
                                    "Thursday",
                                    "Friday",
                                    "Saturday"
                                ],
                                "dayNamesShort": [
                                    "Sun",
                                    "Mon",
                                    "Tue",
                                    "Wed",
                                    "Thu",
                                    "Fri",
                                    "Sat"
                                ],
                                "dayNamesMin": [
                                    "Su",
                                    "Mo",
                                    "Tu",
                                    "We",
                                    "Th",
                                    "Fr",
                                    "Sa"
                                ],
                                "dateFormat": "mm/dd/yyyy",
                                "firstDay": 0,
                                "isRTL": false
                            },
                            "_validateLevel": 0
                        },
                        "format": "yyyy-mm-dd",
                        "generators": {
                            "Daily": {
                                "name": "Daily",
                                "calendar": {
                                    "local": {
                                        "name": "Gregorian",
                                        "epochs": [
                                            "BCE",
                                            "CE"
                                        ],
                                        "monthNames": [
                                            "January",
                                            "February",
                                            "March",
                                            "April",
                                            "May",
                                            "June",
                                            "July",
                                            "August",
                                            "September",
                                            "October",
                                            "November",
                                            "December"
                                        ],
                                        "monthNamesShort": [
                                            "Jan",
                                            "Feb",
                                            "Mar",
                                            "Apr",
                                            "May",
                                            "Jun",
                                            "Jul",
                                            "Aug",
                                            "Sep",
                                            "Oct",
                                            "Nov",
                                            "Dec"
                                        ],
                                        "dayNames": [
                                            "Sunday",
                                            "Monday",
                                            "Tuesday",
                                            "Wednesday",
                                            "Thursday",
                                            "Friday",
                                            "Saturday"
                                        ],
                                        "dayNamesShort": [
                                            "Sun",
                                            "Mon",
                                            "Tue",
                                            "Wed",
                                            "Thu",
                                            "Fri",
                                            "Sat"
                                        ],
                                        "dayNamesMin": [
                                            "Su",
                                            "Mo",
                                            "Tu",
                                            "We",
                                            "Th",
                                            "Fr",
                                            "Sa"
                                        ],
                                        "dateFormat": "mm/dd/yyyy",
                                        "firstDay": 0,
                                        "isRTL": false
                                    },
                                    "_validateLevel": 0
                                },
                                "format": "yyyy-mm-dd"
                            },
                            "Weekly": {
                                "name": "Weekly",
                                "calendar": {
                                    "local": {
                                        "name": "Gregorian",
                                        "epochs": [
                                            "BCE",
                                            "CE"
                                        ],
                                        "monthNames": [
                                            "January",
                                            "February",
                                            "March",
                                            "April",
                                            "May",
                                            "June",
                                            "July",
                                            "August",
                                            "September",
                                            "October",
                                            "November",
                                            "December"
                                        ],
                                        "monthNamesShort": [
                                            "Jan",
                                            "Feb",
                                            "Mar",
                                            "Apr",
                                            "May",
                                            "Jun",
                                            "Jul",
                                            "Aug",
                                            "Sep",
                                            "Oct",
                                            "Nov",
                                            "Dec"
                                        ],
                                        "dayNames": [
                                            "Sunday",
                                            "Monday",
                                            "Tuesday",
                                            "Wednesday",
                                            "Thursday",
                                            "Friday",
                                            "Saturday"
                                        ],
                                        "dayNamesShort": [
                                            "Sun",
                                            "Mon",
                                            "Tue",
                                            "Wed",
                                            "Thu",
                                            "Fri",
                                            "Sat"
                                        ],
                                        "dayNamesMin": [
                                            "Su",
                                            "Mo",
                                            "Tu",
                                            "We",
                                            "Th",
                                            "Fr",
                                            "Sa"
                                        ],
                                        "dateFormat": "mm/dd/yyyy",
                                        "firstDay": 0,
                                        "isRTL": false
                                    },
                                    "_validateLevel": 0
                                },
                                "format": "yyyy-mm-dd"
                            },
                            "Monthly": {
                                "name": "Monthly",
                                "calendar": {
                                    "local": {
                                        "name": "Gregorian",
                                        "epochs": [
                                            "BCE",
                                            "CE"
                                        ],
                                        "monthNames": [
                                            "January",
                                            "February",
                                            "March",
                                            "April",
                                            "May",
                                            "June",
                                            "July",
                                            "August",
                                            "September",
                                            "October",
                                            "November",
                                            "December"
                                        ],
                                        "monthNamesShort": [
                                            "Jan",
                                            "Feb",
                                            "Mar",
                                            "Apr",
                                            "May",
                                            "Jun",
                                            "Jul",
                                            "Aug",
                                            "Sep",
                                            "Oct",
                                            "Nov",
                                            "Dec"
                                        ],
                                        "dayNames": [
                                            "Sunday",
                                            "Monday",
                                            "Tuesday",
                                            "Wednesday",
                                            "Thursday",
                                            "Friday",
                                            "Saturday"
                                        ],
                                        "dayNamesShort": [
                                            "Sun",
                                            "Mon",
                                            "Tue",
                                            "Wed",
                                            "Thu",
                                            "Fri",
                                            "Sat"
                                        ],
                                        "dayNamesMin": [
                                            "Su",
                                            "Mo",
                                            "Tu",
                                            "We",
                                            "Th",
                                            "Fr",
                                            "Sa"
                                        ],
                                        "dateFormat": "mm/dd/yyyy",
                                        "firstDay": 0,
                                        "isRTL": false
                                    },
                                    "_validateLevel": 0
                                },
                                "format": "yyyy-mm-dd"
                            },
                            "BiMonthly": {
                                "name": "BiMonthly",
                                "calendar": {
                                    "local": {
                                        "name": "Gregorian",
                                        "epochs": [
                                            "BCE",
                                            "CE"
                                        ],
                                        "monthNames": [
                                            "January",
                                            "February",
                                            "March",
                                            "April",
                                            "May",
                                            "June",
                                            "July",
                                            "August",
                                            "September",
                                            "October",
                                            "November",
                                            "December"
                                        ],
                                        "monthNamesShort": [
                                            "Jan",
                                            "Feb",
                                            "Mar",
                                            "Apr",
                                            "May",
                                            "Jun",
                                            "Jul",
                                            "Aug",
                                            "Sep",
                                            "Oct",
                                            "Nov",
                                            "Dec"
                                        ],
                                        "dayNames": [
                                            "Sunday",
                                            "Monday",
                                            "Tuesday",
                                            "Wednesday",
                                            "Thursday",
                                            "Friday",
                                            "Saturday"
                                        ],
                                        "dayNamesShort": [
                                            "Sun",
                                            "Mon",
                                            "Tue",
                                            "Wed",
                                            "Thu",
                                            "Fri",
                                            "Sat"
                                        ],
                                        "dayNamesMin": [
                                            "Su",
                                            "Mo",
                                            "Tu",
                                            "We",
                                            "Th",
                                            "Fr",
                                            "Sa"
                                        ],
                                        "dateFormat": "mm/dd/yyyy",
                                        "firstDay": 0,
                                        "isRTL": false
                                    },
                                    "_validateLevel": 0
                                },
                                "format": "yyyy-mm-dd"
                            },
                            "Quarterly": {
                                "name": "Quarterly",
                                "calendar": {
                                    "local": {
                                        "name": "Gregorian",
                                        "epochs": [
                                            "BCE",
                                            "CE"
                                        ],
                                        "monthNames": [
                                            "January",
                                            "February",
                                            "March",
                                            "April",
                                            "May",
                                            "June",
                                            "July",
                                            "August",
                                            "September",
                                            "October",
                                            "November",
                                            "December"
                                        ],
                                        "monthNamesShort": [
                                            "Jan",
                                            "Feb",
                                            "Mar",
                                            "Apr",
                                            "May",
                                            "Jun",
                                            "Jul",
                                            "Aug",
                                            "Sep",
                                            "Oct",
                                            "Nov",
                                            "Dec"
                                        ],
                                        "dayNames": [
                                            "Sunday",
                                            "Monday",
                                            "Tuesday",
                                            "Wednesday",
                                            "Thursday",
                                            "Friday",
                                            "Saturday"
                                        ],
                                        "dayNamesShort": [
                                            "Sun",
                                            "Mon",
                                            "Tue",
                                            "Wed",
                                            "Thu",
                                            "Fri",
                                            "Sat"
                                        ],
                                        "dayNamesMin": [
                                            "Su",
                                            "Mo",
                                            "Tu",
                                            "We",
                                            "Th",
                                            "Fr",
                                            "Sa"
                                        ],
                                        "dateFormat": "mm/dd/yyyy",
                                        "firstDay": 0,
                                        "isRTL": false
                                    },
                                    "_validateLevel": 0
                                },
                                "format": "yyyy-mm-dd"
                            },
                            "SixMonthly": {
                                "name": "SixMonthly",
                                "calendar": {
                                    "local": {
                                        "name": "Gregorian",
                                        "epochs": [
                                            "BCE",
                                            "CE"
                                        ],
                                        "monthNames": [
                                            "January",
                                            "February",
                                            "March",
                                            "April",
                                            "May",
                                            "June",
                                            "July",
                                            "August",
                                            "September",
                                            "October",
                                            "November",
                                            "December"
                                        ],
                                        "monthNamesShort": [
                                            "Jan",
                                            "Feb",
                                            "Mar",
                                            "Apr",
                                            "May",
                                            "Jun",
                                            "Jul",
                                            "Aug",
                                            "Sep",
                                            "Oct",
                                            "Nov",
                                            "Dec"
                                        ],
                                        "dayNames": [
                                            "Sunday",
                                            "Monday",
                                            "Tuesday",
                                            "Wednesday",
                                            "Thursday",
                                            "Friday",
                                            "Saturday"
                                        ],
                                        "dayNamesShort": [
                                            "Sun",
                                            "Mon",
                                            "Tue",
                                            "Wed",
                                            "Thu",
                                            "Fri",
                                            "Sat"
                                        ],
                                        "dayNamesMin": [
                                            "Su",
                                            "Mo",
                                            "Tu",
                                            "We",
                                            "Th",
                                            "Fr",
                                            "Sa"
                                        ],
                                        "dateFormat": "mm/dd/yyyy",
                                        "firstDay": 0,
                                        "isRTL": false
                                    },
                                    "_validateLevel": 0
                                },
                                "format": "yyyy-mm-dd"
                            },
                            "SixMonthlyApril": {
                                "name": "SixMonthlyApril",
                                "calendar": {
                                    "local": {
                                        "name": "Gregorian",
                                        "epochs": [
                                            "BCE",
                                            "CE"
                                        ],
                                        "monthNames": [
                                            "January",
                                            "February",
                                            "March",
                                            "April",
                                            "May",
                                            "June",
                                            "July",
                                            "August",
                                            "September",
                                            "October",
                                            "November",
                                            "December"
                                        ],
                                        "monthNamesShort": [
                                            "Jan",
                                            "Feb",
                                            "Mar",
                                            "Apr",
                                            "May",
                                            "Jun",
                                            "Jul",
                                            "Aug",
                                            "Sep",
                                            "Oct",
                                            "Nov",
                                            "Dec"
                                        ],
                                        "dayNames": [
                                            "Sunday",
                                            "Monday",
                                            "Tuesday",
                                            "Wednesday",
                                            "Thursday",
                                            "Friday",
                                            "Saturday"
                                        ],
                                        "dayNamesShort": [
                                            "Sun",
                                            "Mon",
                                            "Tue",
                                            "Wed",
                                            "Thu",
                                            "Fri",
                                            "Sat"
                                        ],
                                        "dayNamesMin": [
                                            "Su",
                                            "Mo",
                                            "Tu",
                                            "We",
                                            "Th",
                                            "Fr",
                                            "Sa"
                                        ],
                                        "dateFormat": "mm/dd/yyyy",
                                        "firstDay": 0,
                                        "isRTL": false
                                    },
                                    "_validateLevel": 0
                                },
                                "format": "yyyy-mm-dd"
                            },
                            "Yearly": {
                                "name": "Yearly",
                                "calendar": {
                                    "local": {
                                        "name": "Gregorian",
                                        "epochs": [
                                            "BCE",
                                            "CE"
                                        ],
                                        "monthNames": [
                                            "January",
                                            "February",
                                            "March",
                                            "April",
                                            "May",
                                            "June",
                                            "July",
                                            "August",
                                            "September",
                                            "October",
                                            "November",
                                            "December"
                                        ],
                                        "monthNamesShort": [
                                            "Jan",
                                            "Feb",
                                            "Mar",
                                            "Apr",
                                            "May",
                                            "Jun",
                                            "Jul",
                                            "Aug",
                                            "Sep",
                                            "Oct",
                                            "Nov",
                                            "Dec"
                                        ],
                                        "dayNames": [
                                            "Sunday",
                                            "Monday",
                                            "Tuesday",
                                            "Wednesday",
                                            "Thursday",
                                            "Friday",
                                            "Saturday"
                                        ],
                                        "dayNamesShort": [
                                            "Sun",
                                            "Mon",
                                            "Tue",
                                            "Wed",
                                            "Thu",
                                            "Fri",
                                            "Sat"
                                        ],
                                        "dayNamesMin": [
                                            "Su",
                                            "Mo",
                                            "Tu",
                                            "We",
                                            "Th",
                                            "Fr",
                                            "Sa"
                                        ],
                                        "dateFormat": "mm/dd/yyyy",
                                        "firstDay": 0,
                                        "isRTL": false
                                    },
                                    "_validateLevel": 0
                                },
                                "format": "yyyy-mm-dd"
                            },
                            "FinancialApril": {
                                "name": "FinancialApril",
                                "calendar": {
                                    "local": {
                                        "name": "Gregorian",
                                        "epochs": [
                                            "BCE",
                                            "CE"
                                        ],
                                        "monthNames": [
                                            "January",
                                            "February",
                                            "March",
                                            "April",
                                            "May",
                                            "June",
                                            "July",
                                            "August",
                                            "September",
                                            "October",
                                            "November",
                                            "December"
                                        ],
                                        "monthNamesShort": [
                                            "Jan",
                                            "Feb",
                                            "Mar",
                                            "Apr",
                                            "May",
                                            "Jun",
                                            "Jul",
                                            "Aug",
                                            "Sep",
                                            "Oct",
                                            "Nov",
                                            "Dec"
                                        ],
                                        "dayNames": [
                                            "Sunday",
                                            "Monday",
                                            "Tuesday",
                                            "Wednesday",
                                            "Thursday",
                                            "Friday",
                                            "Saturday"
                                        ],
                                        "dayNamesShort": [
                                            "Sun",
                                            "Mon",
                                            "Tue",
                                            "Wed",
                                            "Thu",
                                            "Fri",
                                            "Sat"
                                        ],
                                        "dayNamesMin": [
                                            "Su",
                                            "Mo",
                                            "Tu",
                                            "We",
                                            "Th",
                                            "Fr",
                                            "Sa"
                                        ],
                                        "dateFormat": "mm/dd/yyyy",
                                        "firstDay": 0,
                                        "isRTL": false
                                    },
                                    "_validateLevel": 0
                                },
                                "format": "yyyy-mm-dd",
                                "monthOffset": 4,
                                "monthShortName": "April"
                            },
                            "FinancialJuly": {
                                "name": "FinancialJuly",
                                "calendar": {
                                    "local": {
                                        "name": "Gregorian",
                                        "epochs": [
                                            "BCE",
                                            "CE"
                                        ],
                                        "monthNames": [
                                            "January",
                                            "February",
                                            "March",
                                            "April",
                                            "May",
                                            "June",
                                            "July",
                                            "August",
                                            "September",
                                            "October",
                                            "November",
                                            "December"
                                        ],
                                        "monthNamesShort": [
                                            "Jan",
                                            "Feb",
                                            "Mar",
                                            "Apr",
                                            "May",
                                            "Jun",
                                            "Jul",
                                            "Aug",
                                            "Sep",
                                            "Oct",
                                            "Nov",
                                            "Dec"
                                        ],
                                        "dayNames": [
                                            "Sunday",
                                            "Monday",
                                            "Tuesday",
                                            "Wednesday",
                                            "Thursday",
                                            "Friday",
                                            "Saturday"
                                        ],
                                        "dayNamesShort": [
                                            "Sun",
                                            "Mon",
                                            "Tue",
                                            "Wed",
                                            "Thu",
                                            "Fri",
                                            "Sat"
                                        ],
                                        "dayNamesMin": [
                                            "Su",
                                            "Mo",
                                            "Tu",
                                            "We",
                                            "Th",
                                            "Fr",
                                            "Sa"
                                        ],
                                        "dateFormat": "mm/dd/yyyy",
                                        "firstDay": 0,
                                        "isRTL": false
                                    },
                                    "_validateLevel": 0
                                },
                                "format": "yyyy-mm-dd",
                                "monthOffset": 7,
                                "monthShortName": "July"
                            },
                            "FinancialOct": {
                                "name": "FinancialOct",
                                "calendar": {
                                    "local": {
                                        "name": "Gregorian",
                                        "epochs": [
                                            "BCE",
                                            "CE"
                                        ],
                                        "monthNames": [
                                            "January",
                                            "February",
                                            "March",
                                            "April",
                                            "May",
                                            "June",
                                            "July",
                                            "August",
                                            "September",
                                            "October",
                                            "November",
                                            "December"
                                        ],
                                        "monthNamesShort": [
                                            "Jan",
                                            "Feb",
                                            "Mar",
                                            "Apr",
                                            "May",
                                            "Jun",
                                            "Jul",
                                            "Aug",
                                            "Sep",
                                            "Oct",
                                            "Nov",
                                            "Dec"
                                        ],
                                        "dayNames": [
                                            "Sunday",
                                            "Monday",
                                            "Tuesday",
                                            "Wednesday",
                                            "Thursday",
                                            "Friday",
                                            "Saturday"
                                        ],
                                        "dayNamesShort": [
                                            "Sun",
                                            "Mon",
                                            "Tue",
                                            "Wed",
                                            "Thu",
                                            "Fri",
                                            "Sat"
                                        ],
                                        "dayNamesMin": [
                                            "Su",
                                            "Mo",
                                            "Tu",
                                            "We",
                                            "Th",
                                            "Fr",
                                            "Sa"
                                        ],
                                        "dateFormat": "mm/dd/yyyy",
                                        "firstDay": 0,
                                        "isRTL": false
                                    },
                                    "_validateLevel": 0
                                },
                                "format": "yyyy-mm-dd",
                                "monthOffset": 10,
                                "monthShortName": "Oct"
                            }
                        }
                    },
                    "picker": {
                        "calendar": {
                            "local": {
                                "name": "Gregorian",
                                "epochs": [
                                    "BCE",
                                    "CE"
                                ],
                                "monthNames": [
                                    "January",
                                    "February",
                                    "March",
                                    "April",
                                    "May",
                                    "June",
                                    "July",
                                    "August",
                                    "September",
                                    "October",
                                    "November",
                                    "December"
                                ],
                                "monthNamesShort": [
                                    "Jan",
                                    "Feb",
                                    "Mar",
                                    "Apr",
                                    "May",
                                    "Jun",
                                    "Jul",
                                    "Aug",
                                    "Sep",
                                    "Oct",
                                    "Nov",
                                    "Dec"
                                ],
                                "dayNames": [
                                    "Sunday",
                                    "Monday",
                                    "Tuesday",
                                    "Wednesday",
                                    "Thursday",
                                    "Friday",
                                    "Saturday"
                                ],
                                "dayNamesShort": [
                                    "Sun",
                                    "Mon",
                                    "Tue",
                                    "Wed",
                                    "Thu",
                                    "Fri",
                                    "Sat"
                                ],
                                "dayNamesMin": [
                                    "Su",
                                    "Mo",
                                    "Tu",
                                    "We",
                                    "Th",
                                    "Fr",
                                    "Sa"
                                ],
                                "dateFormat": "mm/dd/yyyy",
                                "firstDay": 0,
                                "isRTL": false
                            },
                            "_validateLevel": 0
                        },
                        "format": "yyyy-mm-dd",
                        "defaults": {
                            "calendar": {
                                "local": {
                                    "name": "Gregorian",
                                    "epochs": [
                                        "BCE",
                                        "CE"
                                    ],
                                    "monthNames": [
                                        "January",
                                        "February",
                                        "March",
                                        "April",
                                        "May",
                                        "June",
                                        "July",
                                        "August",
                                        "September",
                                        "October",
                                        "November",
                                        "December"
                                    ],
                                    "monthNamesShort": [
                                        "Jan",
                                        "Feb",
                                        "Mar",
                                        "Apr",
                                        "May",
                                        "Jun",
                                        "Jul",
                                        "Aug",
                                        "Sep",
                                        "Oct",
                                        "Nov",
                                        "Dec"
                                    ],
                                    "dayNames": [
                                        "Sunday",
                                        "Monday",
                                        "Tuesday",
                                        "Wednesday",
                                        "Thursday",
                                        "Friday",
                                        "Saturday"
                                    ],
                                    "dayNamesShort": [
                                        "Sun",
                                        "Mon",
                                        "Tue",
                                        "Wed",
                                        "Thu",
                                        "Fri",
                                        "Sat"
                                    ],
                                    "dayNamesMin": [
                                        "Su",
                                        "Mo",
                                        "Tu",
                                        "We",
                                        "Th",
                                        "Fr",
                                        "Sa"
                                    ],
                                    "dateFormat": "mm/dd/yyyy",
                                    "firstDay": 0,
                                    "isRTL": false
                                },
                                "_validateLevel": 0
                            },
                            "dateFormat": "yyyy-mm-dd",
                            "showAnim": "",
                            "maxDate": {
                                "_calendar": {
                                    "local": {
                                        "name": "Gregorian",
                                        "epochs": [
                                            "BCE",
                                            "CE"
                                        ],
                                        "monthNames": [
                                            "January",
                                            "February",
                                            "March",
                                            "April",
                                            "May",
                                            "June",
                                            "July",
                                            "August",
                                            "September",
                                            "October",
                                            "November",
                                            "December"
                                        ],
                                        "monthNamesShort": [
                                            "Jan",
                                            "Feb",
                                            "Mar",
                                            "Apr",
                                            "May",
                                            "Jun",
                                            "Jul",
                                            "Aug",
                                            "Sep",
                                            "Oct",
                                            "Nov",
                                            "Dec"
                                        ],
                                        "dayNames": [
                                            "Sunday",
                                            "Monday",
                                            "Tuesday",
                                            "Wednesday",
                                            "Thursday",
                                            "Friday",
                                            "Saturday"
                                        ],
                                        "dayNamesShort": [
                                            "Sun",
                                            "Mon",
                                            "Tue",
                                            "Wed",
                                            "Thu",
                                            "Fri",
                                            "Sat"
                                        ],
                                        "dayNamesMin": [
                                            "Su",
                                            "Mo",
                                            "Tu",
                                            "We",
                                            "Th",
                                            "Fr",
                                            "Sa"
                                        ],
                                        "dateFormat": "mm/dd/yyyy",
                                        "firstDay": 0,
                                        "isRTL": false
                                    },
                                    "_validateLevel": 0
                                },
                                "_year": 2016,
                                "_month": 6,
                                "_day": 24
                            },
                            "yearRange": "c-100:c+100",
                            "altFormat": "yyyy-mm-dd"
                        }
                    }
                },
                "comparator": {},
                "availability": {
                    "_isAvailable": -1,
                    "_isLoggedIn": -1,
                    "_availableTimeoutHandler": -1
                },
                "trigger": {
                    "funcs": {}
                },
                "sharing": {},
                "validation": {
                    "INT_MAX_VALUE": 2147483647
                },
                "storage": {
                    "DATABASE_IS_NOT_OPEN": "Database is not open, please call .open() on your store before using it.",
                    "INVALID_KEY": "No valid key was provided.",
                    "INVALID_OBJECT": "No valid object was provided"
                },
                "contextmenu": {
                    "utils": {},
                    "defaultOptions": {
                        "listId": "list",
                        "menuId": "menu",
                        "menuItemActiveClass": "menuItemActive",
                        "listItemProps": [
                            "id",
                            "uid",
                            "name",
                            "type"
                        ]
                    },
                    "config": {
                        "listId": "list",
                        "menuId": "menu",
                        "menuItemActiveClass": "menuItemActive",
                        "listItemProps": [
                            "id",
                            "uid",
                            "name",
                            "type"
                        ]
                    }
                },
                "appcache": {},
                "translate": {},
                "settings": {},
                "leftBar": {},
                "report": {
                    "organisationUnit": {},
                    "organisationUnitHierarchy": [],
                    "organisationUnitChildren": [],
                    "date": "2016-01-01",
                    "periods": []
                }
            },
            prepareOrganisationUnit: function (selectedOrgUnit) {
                var template = {"id": selectedOrgUnit.id, "name": selectedOrgUnit.name, "code": ""};
                dhis2.report.organisationUnit = template;
                dhis2.report.organisationUnitChildren = selectedOrgUnit.children;
            },
            getPeriodName: function (period) {
                if (period.indexOf("July") > -1) {

                    return "July " + period.substr(0, 4) + " - June " + (parseInt(period.substr(0, 4)) + 1);
                } else if (period.indexOf("Q") > -1) {
                    var quarter = period.substr(period.indexOf("Q") + 1);
                    var name = "";
                    if (quarter == "3") {
                        name = "July - September";
                    } else if (quarter == "4") {
                        name = "October - December";
                    } else if (quarter == "1") {
                        name = "January - March";
                    } else if (quarter == "2") {
                        name = "April - June";
                    }
                    return name + " " + (parseInt(period.substr(0, 4)));
                } else {
                    var month = period.substr(4);
                    var name = "";
                    if (month == "01") {
                        name = "January";
                    } else if (month == "02") {
                        name = "February";
                    } else if (month == "03") {
                        name = "March";
                    } else if (month == "04") {
                        name = "April";
                    } else if (month == "05") {
                        name = "May";
                    } else if (month == "06") {
                        name = "June";
                    } else if (month == "07") {
                        name = "July";
                    } else if (month == "08") {
                        name = "August";
                    } else if (month == "09") {
                        name = "September";
                    } else if (month == "10") {
                        name = "October";
                    } else if (month == "11") {
                        name = "November";
                    } else if (month == "12") {
                        name = "December";
                    }
                    return name + " " + (parseInt(period.substr(0, 4)));
                }
            },
            prepareOrganisationUnitHierarchy: function (selectedOrgUnit, organisationUnits) {
                var hierarchy = [];
                var selectedOrgUniLevel = selectedOrgUnit.level;

                var first_parent = null;
                var second_parent = null;
                var third_parent = null;

                first_parent = {"id": organisationUnits[0].id, "name": organisationUnits[0].name, "code": ""};

                if (selectedOrgUniLevel == 1) {


                }


                if (selectedOrgUniLevel == 2) {


                    hierarchy.push({"id": selectedOrgUnit.id, "name": selectedOrgUnit.name, "code": ""});
                    hierarchy.push(first_parent);


                }


                if (selectedOrgUniLevel == 3) {


                    angular.forEach(organisationUnits[0].children, function (child, childIndex) {
                        angular.forEach(child.children, function (glandChild, glandChildIndex) {

                            if (glandChild.id == selectedOrgUnit.id) {

                                hierarchy.push({"id": glandChild.id, "name": glandChild.name, "code": ""});
                                hierarchy.push({"id": child.id, "name": child.name, "code": ""});
                                hierarchy.push(first_parent);

                            }

                        });
                    });


                }


                if (selectedOrgUniLevel == 4) {


                    angular.forEach(organisationUnits[0].children, function (child, childIndex) {
                        angular.forEach(child.children, function (glandChild, glandChildIndex) {

                            angular.forEach(glandChild.children, function (superGlandChild, superGlandChildIndex) {

                                if (superGlandChild.id == selectedOrgUnit.id) {

                                    hierarchy.push({
                                        "id": superGlandChild.id,
                                        "name": superGlandChild.name,
                                        "code": ""
                                    });
                                    hierarchy.push({"id": glandChild.id, "name": glandChild.name, "code": ""});
                                    hierarchy.push({"id": child.id, "name": child.name, "code": ""});
                                    hierarchy.push(first_parent);

                                }

                            });

                        });
                    });


                }


                dhis2.report.organisationUnitHierarchy = hierarchy;
            },
            getRenderedReport: function (reportUid) {
                return eval('(' + localStorage.getItem(reportUid) + ')');
            },
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
            getLastDateOfMonth: function (year, month) {
                var date = new Date(parseInt(year), parseInt(month), 1);
                date.setTime(date.getTime() - 1000 * 60 * 60 * 24 * 1);
                var monthString = (date.getMonth() + 1);
                if (monthString < 10) {
                    monthString = "0" + monthString;
                }
                var dayString = parseInt(date.getDate());
                if (dayString < 10) {
                    dayString = "0" + dayString;
                }
                return date.getFullYear() + "-" + monthString + "-" + dayString;
            },
            getPeriodDate: function (period) {
                var returnDate = {};
                if (period.indexOf("July") != -1) {
                    returnDate.startDate = period.substr(0, 4) + "-07-01";
                    returnDate.endDate = this.getLastDateOfMonth(parseInt(period.substr(0, 4)) + 1, "6");
                } else if (period.indexOf("Q") != -1) {
                    var lastMonth = parseInt(period.substr(5)) * 3;
                    var firstMonthString = lastMonth - 2;
                    if (firstMonthString < 10) {
                        firstMonthString = "0" + firstMonthString;
                    }
                    returnDate.startDate = period.substr(0, 4) + "-" + firstMonthString + "-01";
                    returnDate.endDate = this.getLastDateOfMonth(period.substr(0, 4), lastMonth);
                } else {
                    /*var monthVal = parseInt(period.substr(5));
                     if(monthVal < 10){
                     monthVal = "0" + monthVal;
                     }*/
                    returnDate.startDate = period.substr(0, 4) + "-" + period.substr(4) + "-01";
                    returnDate.endDate = this.getLastDateOfMonth(period.substr(0, 4), period.substr(4));
                }
                return returnDate;
            },
            createDataSetReport: function (data) {
                var deffered = $q.defer();
                this.getUser().then(function (user) {
                    var notExecuted = {
                        name: user.name,
                        creationDate: new Date()
                    }
                    $http.post(DHIS2URL + "api/dataStore/notExecuted/" + data.dataSet + "_" + data.orgUnit + "_" + data.period, notExecuted)
                        .then(function (results) {
                            deffered.resolve();
                        }, function (error) {
                            deffered.reject(error);
                        });
                }, function (error) {
                    deffered.reject(error);
                })
                return deffered.promise;
            },
            undoDataSetReport: function (data) {
                var deffered = $q.defer();
                var that = this;
                $http.get(DHIS2URL + "api/dataSets.json?fields=id,periodType&filter=attributeValues.value:like:" + data.dataSet)
                    .then(function (dataSetsResults) {
                        console.log(dataSetsResults.data.dataSets);
                        $http.get(DHIS2URL + "api/organisationUnits/" + data.orgUnit + ".json?fields=id,ancestors")
                            .then(function (orgUnitResults) {
                                var promises = [];
                                promises.push(that.delete(data.dataSet, data.orgUnit, data.period));
                                var periods = [];
                                if (data.period.indexOf("July") > -1) {
                                    periods.push(data.period);
                                } else if (data.period.indexOf("Q") > -1) {
                                    periods.push(data.period);
                                    var year = parseInt(data.period.substr(0, 4));
                                    if (parseInt(data.period.substr(5)) < 3) {
                                        year--;
                                    }
                                    periods.push("July" + year);
                                } else {
                                    periods.push(data.period);
                                    var year = parseInt(data.period.substr(0, 4));
                                    var month = parseInt(data.period.substr(4));
                                    var quarter = Math.ceil(month / 3);
                                    periods.push(year + "Q" + quarter);
                                    if (month < 7) {
                                        year--;
                                    }
                                    periods.push("July" + year);
                                }
                                periods.forEach(function (period) {
                                    dataSetsResults.data.dataSets.forEach(function (dataSet) {
                                        //promises.push($http.delete(DHIS2URL + "api/dataStore/executed/" + dataSet.id + "_" + orgUnitResults.data.id + "_" + period));
                                        promises.push(that.delete(dataSet.id, orgUnitResults.data.id, period));


                                        orgUnitResults.data.ancestors.forEach(function (ancestor) {
                                            //promises.push($http.delete(DHIS2URL + "api/dataStore/executed/" + dataSet.id + "_" + ancestor.id + "_" + period));
                                            promises.push(that.delete(dataSet.id, ancestor.id, period));
                                        })
                                    })
                                })
                                $q.all(promises).then(function (result) {
                                    deffered.resolve(result);
                                }, function (result) {
                                    deffered.reject(result);
                                })
                            }, function () {
                                deffered.reject();
                            });
                    }, function () {
                        deffered.reject();
                    });
                return deffered.promise;
            },
            delete: function (dataSet, orgUnit, period) {
                var deffered = $q.defer();
                $http.delete(DHIS2URL + "api/dataStore/executed/" + dataSet + "_" + orgUnit + "_" + period).then(function () {
                    deffered.resolve();
                }, function (error) {
                    console.log(error);
                    if (error.data.httpStatusCode == 404) {
                        deffered.resolve(error.data);
                    } else {
                        deffered.reject(error);
                    }
                })
                return deffered.promise;
            },
            cancelCreateDataSetReport: function (data) {
                var deffered = $q.defer();
                $http.delete(DHIS2URL + "api/dataStore/notExecuted/" + data.dataSet + "_" + data.orgUnit + "_" + data.period).then(function () {
                    deffered.resolve();
                }, function (error) {
                    console.log(error);
                    if (error.data.httpStatusCode == 404) {
                        deffered.resolve(error.data);
                    } else {
                        deffered.reject(error);
                    }
                })
                return deffered.promise;
            },
            organisationUnitLevels:[],
            getOrganisationUnitLevels: function () {
                var deffered = $q.defer();
                if(this.organisationUnitLevels.length > 0){
                    deffered.resolve(this.organisationUnitLevels);
                }else{
                    var that = this;
                    $http.get(DHIS2URL + "api/organisationUnitLevels.json?fields=id,level,name").then(function (results) {
                        that.organisationUnitLevels = results.data.organisationUnitLevels;
                        deffered.resolve(that.organisationUnitLevels);
                    }, function (error) {
                        deffered.reject(error);
                    })
                }
                return deffered.promise;
            },
            getUser: function () {
                if (user) {
                    userDeffered.resolve(user);
                }
                return userDeffered.promise;
            },
            downloadExcel:function(dataSetName,organisationUnitName,period){
                var date = new Date();
                var dateStr = date.getDate();
                if(dateStr < 10){
                    dateStr = "0" + dateStr;
                }
                var monthStr = date.getMonth() + 1;
                if(monthStr < 10){
                    monthStr = "0" + monthStr;
                }
                var exportHref=Excel.tableToExcel();
                $timeout(function(){
                    var link = document.createElement('a');
                    link.download = dataSetName + " " + organisationUnitName + " " + period + " " + dateStr + "-" + monthStr + "-" + date.getFullYear() +".xls";
                    link.href = exportHref;
                    link.click();},100);
            }
        }

    })
    .factory("DebugService", function () {
        return {
            debugProcess: {},
        }
    })
    .factory('myHttpInterceptor', function ($q, $window) {
        return {
            response: function (response) {
                // do something on success
                if (response.headers()['content-type'] === "text/html;charset=UTF-8") {

                    if (response.data.indexOf("loginPage") != -1) {
                        $window.location.href = "../../../"
                        return $q.reject(response);
                    }
                }
                return response;
            },
            responseError: function (response) {
                // do something on error
                return $q.reject(response);
            }
        };
    })
    .factory('Excel', function ($window) {
        var uri = 'data:application/vnd.ms-excel;base64,',
            template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table border="1">{table}</table><br /><table border="1">{table}</table></body></html>',
            base64 = function (s) {
                return $window.btoa(unescape(encodeURIComponent(s)));
            },
            format = function (s, c) {
                return s.replace(/{(\w+)}/g, function (m, p) {
                    return c[p];
                })
            };
        return {
            tableToExcel: function () {
                var tables = $(".excel-table");
                var ctx = {worksheet: "Sheet 1"};
                var str = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body>';
                tables.each(function(index){
                    ($(this).find("td.hidden").each(function(index2){
                        this.remove();
                    }));
                    ($(this).find("td").each(function(index2){
                        if($(this).css('display') == 'none'){
                            this.remove();
                        }
                    }));
                    ctx["table" + index] = this.innerHTML;
                    if(this.title == "no-border"){
                        str += '<table>{' + "table" + index+'}</table><br />';
                    }else{
                        str += '<table border="1">{' + "table" + index+'}</table><br />';
                    }
                })
                str += '</body></html>';
                var href = uri + base64(format(str, ctx));
                return href;
            }
        };
    })

