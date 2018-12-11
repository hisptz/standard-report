'use strict';

/* App Module */

angular.module('app',
        ['ui.bootstrap',
            'ngRoute',
            'ngCookies',
            'ngSanitize',
            'appDirectives',
            'appControllers',
            'appServices',
            'appFilters',
            'd2Services',
            'd2Controllers',
            'pascalprecht.translate',
            'd2HeaderBar', 'toaster'
        ])

    .value('DHIS2URL', '../../../')
    .config(function ($translateProvider, $routeProvider, $httpProvider) {
        $routeProvider.when('/', {
            templateUrl: 'views/home.html'
        }).when('/Aggregation', {
            controller: 'AggregationController',
            templateUrl: 'views/aggregation.html'
        }).when('/dataSetReport', {
            controller: 'StandardReportController',
            templateUrl: 'views/standardReport.html'
        }).when('/dataSetReport/report/:dataSet/:orgUnit/:period', {
            controller: 'ReportController',
            templateUrl: 'views/report.html'
        }).when('/dataSetReport/report/:dataSet/:orgUnit/:period/preview', {
            controller: 'ReportController',
            templateUrl: 'views/report.html'
        }).when('/dataSetReport/reportRequest/:dataSet/:orgUnit/:period', {
            controller: 'ReportRequestController',
            templateUrl: 'views/reportRequest.html'
        }).when('/dataSetReport/report/dataSet/:dataSet/orgUnit/:orgUnit/period/:period', {
            controller: 'ReportController',
            templateUrl: 'views/report.html'
        }).when('/dataSetReport/report/dataSet/:dataSet/orgUnit/:orgUnit/period/:period/:preview', {
            controller: 'ReportController',
            templateUrl: 'views/report.html'
        }).when('/dataSetReport/report/dataSet/:dataSet/orgUnit/:orgUnit/period/:period/:preview/:objectId', {
            controller: 'ReportController',
            templateUrl: 'views/report.html'
        }).when('/dataSetReport/reportRequest/dataSet/:dataSet/orgUnit/:orgUnit/period/:period', {
            controller: 'ReportRequestController',
            templateUrl: 'views/reportRequest.html'
        }).when('/dataSetReport/archive', {
            templateUrl: 'views/archive.html'
        }).when('/customReport', {
            templateUrl: 'views/customReport/customReport.html',
            controller: 'CustomReportController'
        }).when('/customReport/:uid/create', {
            templateUrl: 'views/customReport/createCustomReport.html',
            controller: 'CreateCustomReportController'
        }).when('/customReport/:uid/render', {
            templateUrl: 'views/customReport/renderCustomReport.html',
            controller: 'CreateCustomReportController'
        }).when('/customReport/new', {
            templateUrl: 'views/customReport/newCustomReport.html',
            controller: 'NewCustomReportController'
        }).when('/submissionStatus', {
            templateUrl: 'views/submissionStatus/submissionStatus.html',
            controller: 'SubmissionStatusReportController'
        }).when('/dataApproval', {
            templateUrl: 'views/dataApproval/dataApproval.html',
            controller: 'DataApprovalController'
        }).when('/staticTable', {
            templateUrl: 'views/staticTable/staticTable.html',
            controller: 'StaticTableController'
        }).when('/static-table-debug', {
            templateUrl: 'views/staticTable/staticTableDebug.html',
            controller: 'StaticTableDebugController'
        }).otherwise({
            redirectTo: '/'
        });

        $translateProvider.preferredLanguage('en');
        $translateProvider.useSanitizeValueStrategy('escaped');
        $translateProvider.useLoader('i18nLoader');
        $httpProvider.interceptors.push('myHttpInterceptor');
    });