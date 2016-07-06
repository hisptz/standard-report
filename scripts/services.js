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


        Object.prototype.equals = function(x)
        {
            var p;
            for(p in this) {
                if(typeof(x[p])=='undefined') {return false;}
            }

            for(p in this) {
                if (this[p]) {
                    switch(typeof(this[p])) {
                        case 'object':
                            if (!this[p].equals(x[p])) { return false; } break;
                        case 'function':
                            if (typeof(x[p])=='undefined' ||
                                (p != 'equals' && this[p].toString() != x[p].toString()))
                                return false;
                            break;
                        default:
                            if (this[p] != x[p]) { return false; }
                    }
                } else {
                    if (x[p])
                        return false;
                }
            }

            for(p in x) {
                if(typeof(this[p])=='undefined') {return false;}
            }

            return true;
        }
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
                            this.list.push({name: "" + i,value: "" + i});
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
            getCompletenessSatus: function(dataCriteria){
                var deffered = $q.defer();
                $http.get(DHIS2URL + "api/completeDataSetRegistrations?dataSet=" + dataCriteria.dataSet + "&orgUnit=" + dataCriteria.orgUnit + "&startDate="+dataCriteria.period.startDate+"&endDate="+dataCriteria.period.endDate+"&children=true")
                    .then(function (results) {
                        deffered.resolve();
                    });
                return deffered.promise;
            },
            getApprovalStatus: function(dataCriteria){
                var deffered = $q.defer();
                $http.get(DHIS2URL + "api/dataApprovals?ds="+dataCriteria.dataset+"&pe="+dataCriteria.period+"&ou="+dataCriteria.orgUnit)
                    .then(function (results) {
                        deffered.resolve();
                    });
                return deffered.promise;
            },
            getDatasets: function(){
                return $http.get(DHIS2URL + "api/dataSets.json?fields=id,displayName,timelyDays,periodType,organisationUnits&paging=false")
            },
            hasObject:function (obj, list) {
                var found = 0;
                angular.forEach(list, function(value) {
                    if (value.equals(obj)) {
                        found++;
                                return true;
                    }

                });

                if(found>0){
                    return true;
                }

                return false;
            },
            getUser:function(){
                if(user){
                    userDeffered.resolve(user);
                }
                return userDeffered.promise;
            }
        }

    });

