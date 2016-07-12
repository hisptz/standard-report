/* global angular */

'use strict';

/* Services */

var appServices = angular.module('appServices', ['ngResource'])
    .factory("ReportService", function ($http, DHIS2URL, $location, $q) {
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
            dhis2:{
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
                    "organisationUnit": {

                    },
                    "organisationUnitHierarchy": [
                    ],
                    "organisationUnitChildren": [],
                    "date": "2016-01-01",
                    "periods": []
                }
            },
            prepareOrganisationUnit: function (selectedOrgUnit) {
                var template = {"id":selectedOrgUnit.id ,"name":selectedOrgUnit.name ,"code":"" };
                dhis2.report.organisationUnit = template;
                dhis2.report.organisationUnitChildren = selectedOrgUnit.children;
            },
            getPeriodName:function(period){
                if(period.indexOf("July") > -1){

                    return "July " + period.substr(0,4) + " - June " + (parseInt(period.substr(0,4)) + 1);
                }else if(period.indexOf("Q") > -1){
                    var quarter = period.substr(period.indexOf("Q") + 1);
                    var name = "";
                    if(quarter == "3"){
                        name = "July - September";
                    }else if(quarter == "4"){
                        name = "October - December";
                    }else if(quarter == "1"){
                        name = "January - March";
                    }else if(quarter == "2"){
                        name = "April - June";
                    }
                    return name +  " " + (parseInt(period.substr(0,4)));
                }else{
                    var month = period.substr(4);
                    var name = "";
                    if(month == "01"){
                        name = "January";
                    }else if(month == "02"){
                        name = "February";
                    }else if(month == "03"){
                        name = "March";
                    }else if(month == "04"){
                        name = "April";
                    }else if(month == "05"){
                        name = "May";
                    }else if(month == "06"){
                        name = "June";
                    }else if(month == "07"){
                        name = "July";
                    }else if(month == "08"){
                        name = "August";
                    }else if(month == "09"){
                        name = "September";
                    }else if(month == "10"){
                        name = "October";
                    }else if(month == "11"){
                        name = "November";
                    }else if(month == "12"){
                        name = "December";
                    }
                    return name +  " " + (parseInt(period.substr(0,4)));
                }
            },
            prepareOrganisationUnitHierarchy: function (selectedOrgUnit,organisationUnits) {
                var hierarchy = [];
                var selectedOrgUniLevel = selectedOrgUnit.level;

                var first_parent  = null;
                var second_parent  = null;
                var third_parent  = null;

                first_parent = {"id":organisationUnits[0].id ,"name":organisationUnits[0].name ,"code":"" };

                if ( selectedOrgUniLevel == 1 ) {


                }


                if ( selectedOrgUniLevel == 2 ) {


                    hierarchy.push({"id":selectedOrgUnit.id ,"name":selectedOrgUnit.name ,"code":"" });
                    hierarchy.push(first_parent);


                }


                if ( selectedOrgUniLevel == 3 ) {


                    angular.forEach( organisationUnits[0].children , function ( child , childIndex ) {
                        angular.forEach( child.children , function ( glandChild , glandChildIndex ) {

                            if( glandChild.id == selectedOrgUnit.id ) {

                                hierarchy.push({"id":glandChild.id ,"name":glandChild.name ,"code":"" });
                                hierarchy.push({"id":child.id ,"name":child.name ,"code":"" });
                                hierarchy.push(first_parent);

                            }

                        } );
                    } );


                }


                if ( selectedOrgUniLevel == 4 ) {


                    angular.forEach( organisationUnits[0].children , function ( child , childIndex ) {
                        angular.forEach( child.children , function ( glandChild , glandChildIndex ) {

                            angular.forEach( glandChild.children , function ( superGlandChild , superGlandChildIndex ) {

                                if( superGlandChild.id == selectedOrgUnit.id ) {

                                    hierarchy.push({"id":superGlandChild.id ,"name":superGlandChild.name ,"code":"" });
                                    hierarchy.push({"id":glandChild.id ,"name":glandChild.name ,"code":"" });
                                    hierarchy.push({"id":child.id ,"name":child.name ,"code":"" });
                                    hierarchy.push(first_parent);

                                }

                            } );

                        } );
                    } );


                }


                dhis2.report.organisationUnitHierarchy = hierarchy;
            },
            getRenderedReport: function ( reportUid ){
                return eval('('+localStorage.getItem(reportUid)+')');
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
            getLastDateOfMonth:function(year,month){
                var date = new Date(parseInt(year),parseInt(month),1);
                date.setTime(date.getTime() - 1000*60*60*24*1);
                var monthString = (date.getMonth() + 1);
                if(monthString < 10){
                    monthString = "0" + monthString;
                }
                var dayString = parseInt(date.getDate());
                if(dayString < 10){
                    dayString = "0" + dayString;
                }
                return date.getFullYear() +"-" + monthString + "-" + dayString;
            },
            getPeriodDate: function (period) {
                var returnDate = {};
                if (period.indexOf("July") != -1) {
                    returnDate.startDate = period.substr(0, 4) + "-07-01";
                    returnDate.endDate = this.getLastDateOfMonth(parseInt(period.substr(0, 4)) + 1,"6");
                } else if (period.indexOf("Q") != -1) {
                    var lastMonth = parseInt(period.substr(5)) * 3;
                    var firstMonthString = lastMonth - 2;
                    if(firstMonthString < 10){
                        firstMonthString = "0" + firstMonthString;
                    }
                    returnDate.startDate = period.substr(0, 4) + "-" + firstMonthString +"-01";
                    returnDate.endDate = this.getLastDateOfMonth(period.substr(0, 4),lastMonth);
                } else {
                    /*var monthVal = parseInt(period.substr(5));
                     if(monthVal < 10){
                     monthVal = "0" + monthVal;
                     }*/
                    returnDate.startDate = period.substr(0, 4) + "-" + period.substr(4) + "-01";
                    returnDate.endDate = this.getLastDateOfMonth(period.substr(0, 4),period.substr(4));
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
    .factory("DebugService", function ($compile,$timeout,$q){
        var WFOO1 = {consolidation:"Formula (Sum), No Estimation",source:"WF00"};
        var debugProcess = {
            compile:function(element,scope){
                var deffered = $q.defer();
                $compile(element)(scope);
                /*$timeout(function () {
                    console.log("Timing Out")
                    var childsToRemove = [];
                    var existingRows = []
                    element.forEach(function (child, rowIndex) {
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
                    deffered.resolve();
                });*/
                deffered.promise;
            },
            count:0,
            elements:[],
            addCompileElements: function(element,scope){
                //this.compile(element,scope);
                this.elements.push({element:element,scope:scope});
                //console.log("Element:",this.elements.length);
            },
            finishCompileElements: function(element,scope){
                this.count++;
                if(this.count == this.elements.length){
                    console.log("Awesome start compiling");
                    this.elements.forEach(function(element){
                        console.log("Here");
                        $compile(element.element)(element.scope);
                        console.log("Here1");
                    })
                }
                //this.compile(element,scope);
                /*this.elements.push(element);
                 console.log("Element:",this.elements.length);*/
            }
        }
        return {
            debugProcess:debugProcess,
            "DR01":{
                "NK6MyHADqBo.WgIlmdIhlpD":{consolidation:"Formula (Average)",source:"WF01"},
                "xBxqNNV8jLR.BktmzfgqCjX": WFOO1,
                "xBxqNNV8jLR.Z0LtVda8wAo": WFOO1,
                "xBxqNNV8jLR.J6W3kbELkGw": WFOO1,
                "xBxqNNV8jLR.mlpia7QBdqY": WFOO1,
                "xBxqNNV8jLR.oS2Oq1evsaK": WFOO1,
                "xBxqNNV8jLR.bBKFyBvoo34": WFOO1,
                "xBxqNNV8jLR.zSS1gwkIIu8": WFOO1,
                "naRYicVv8Dp.ql8bSsHEnUN": WFOO1,
                "naRYicVv8Dp.pcsiYqIW4kJ": WFOO1,
                "naRYicVv8Dp.YwRiKDxpYON": WFOO1,
                "naRYicVv8Dp.YkeweM90DZt": WFOO1,
                "naRYicVv8Dp.pjXHRQQXIhg": WFOO1,
                "hCLl9rGfYpb.wJIxAhejWKY": WFOO1,
                "hCLl9rGfYpb.R5DIMqSCTA5": WFOO1,
                "hCLl9rGfYpb.xCnCQxpSTUJ": WFOO1,
                "hCLl9rGfYpb.iBa5lgXgvwk": WFOO1,
                "hCLl9rGfYpb.v3Eq35RuqEA": WFOO1,
                "hCLl9rGfYpb.bltcOiiZeO5": WFOO1,
                "hCLl9rGfYpb.uMeEFdAzqKS": WFOO1,
                "hCLl9rGfYpb.AqholFtHhlg": WFOO1,
                "ZLsVcUh3yWM.jjfebeJ6pbV": WFOO1,
                "ZLsVcUh3yWM.BYTuIQ47dnS": WFOO1,
                "ZLsVcUh3yWM.lJ9Cv8ISZRT": WFOO1,
                "ZLsVcUh3yWM.xLi4aE2hf45": WFOO1,
                "ZLsVcUh3yWM.eHhQeZB29hz": WFOO1,
                "ZLsVcUh3yWM.b5D4IKJFDJH": WFOO1,
                "Ivu48nkpIw2.MT4SwuoV2pQ": WFOO1,
                "Ivu48nkpIw2.Y1zhvDQTe5e": WFOO1,
                "Ivu48nkpIw2.Efwc5ipDSTk": WFOO1,
                "Ivu48nkpIw2.WAl6t24Jpzt": WFOO1,
                "Ivu48nkpIw2.uQqzzomp9tc": WFOO1,
                "Ivu48nkpIw2.ICiTJsU1Vec": WFOO1,
                "Ivu48nkpIw2.TZJQRkPRJm4": WFOO1,
                "Ivu48nkpIw2.jC7AWcjBkJ3": WFOO1,
                "Ivu48nkpIw2.BPGkOcPjPS7": WFOO1,
                "Ivu48nkpIw2.nMMaTQxdPJG": WFOO1,
                "Ivu48nkpIw2.HdPaWqoDpdZ": WFOO1,
                "I9MjFl6Y5hl.tPbRcvnWxkS": WFOO1,
                "I9MjFl6Y5hl.fXZ1QJJJ9wp": WFOO1,
                "I9MjFl6Y5hl.Z4bVJVRPKjl": WFOO1,
                "I9MjFl6Y5hl.pAB6StXtLU8": WFOO1,
                "I9MjFl6Y5hl.BEi0yw6WwBa": WFOO1,
                "I9MjFl6Y5hl.w30fA5rFeRV": WFOO1,
                "I9MjFl6Y5hl.Bkz2vXNsYke": WFOO1,
                "I9MjFl6Y5hl.Heme7D8HT30": WFOO1,
                "I9MjFl6Y5hl.VIPqyvWbwDU": WFOO1,
                "I9MjFl6Y5hl.dUIkQFWg2qm": WFOO1,
                "I9MjFl6Y5hl.H9p6YVxG7zJ": WFOO1,
                "I9MjFl6Y5hl.JIeF7OCEt6D": WFOO1,
                "I9MjFl6Y5hl.bSNT1r88kIC": WFOO1,
                "I9MjFl6Y5hl.i9b5kFnGOkF": WFOO1,
                "I9MjFl6Y5hl.hkdaOo9ZpB2": WFOO1,
                "I9MjFl6Y5hl.rwsWnkaJ5HR": WFOO1,
                "I9MjFl6Y5hl.wTlpU2TaHiz": WFOO1,
                "U7ep9MxtQ1z.fuzYIcfLZN2": WFOO1,
                "U7ep9MxtQ1z.HquzVesvM2Z": WFOO1,
                "U7ep9MxtQ1z.BJuZMglWlTz": WFOO1,
                "U7ep9MxtQ1z.GmO6g98S4G9": WFOO1,
                "U7ep9MxtQ1z.wfxDF7iGY3f": WFOO1,
                "U7ep9MxtQ1z.QlQ95KGkgR6": WFOO1,
                "U7ep9MxtQ1z.nrQIoh49aGU": WFOO1,
                "U7ep9MxtQ1z.ZbmI2XtXHIS": WFOO1,
                "U7ep9MxtQ1z.dUwc6pkKgmM": WFOO1,
                "U7ep9MxtQ1z.drXDRIxLVzv": WFOO1,
                "U7ep9MxtQ1z.dqChjQjl0ZH": WFOO1,
                "U7ep9MxtQ1z.oplxxXgoehP": WFOO1,
                "U7ep9MxtQ1z.SyDcaTOW0JP": WFOO1,
                "U7ep9MxtQ1z.XckkuoyUldR": WFOO1,
                "U7ep9MxtQ1z.GtUrKU93piR": WFOO1,
                "U7ep9MxtQ1z.Hmz6lySVDCN": WFOO1,
                "gAS04LMK9UX.zPf9YtxdJJH": WFOO1,
                "gAS04LMK9UX.D4phPJP6u9V": WFOO1,
                "gAS04LMK9UX.MvHtsSwbho2": WFOO1,
                "gAS04LMK9UX.e27Rj8LSYQV": WFOO1,
                "gAS04LMK9UX.pq1B5YRvk3w": WFOO1,
                "gAS04LMK9UX.hOj19H7Vodn": WFOO1,
                "gAS04LMK9UX.mQjKnpOz1I8": WFOO1,
                "ZLsVcUh3yWM.FxOzFSqMVd2": WFOO1,
                "ZLsVcUh3yWM.vXOb5h9Rxqs": WFOO1,
                "U7ep9MxtQ1z.QDSfLpYNZ3l": WFOO1,
                "ZLsVcUh3yWM.OEoQ7kif63L": WFOO1

            }
        }
    })

