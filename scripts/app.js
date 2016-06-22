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
        'd2HeaderBar', 'FileManagerApp', 'toaster'
    ])

    .value('DHIS2URL', '../../../')
    .config(function ($translateProvider, $routeProvider, fileManagerConfigProvider) {
        var defaults = fileManagerConfigProvider.$get();
        fileManagerConfigProvider.set({
            appName: 'Report Archive Manager',
            allowedActions: angular.extend(defaults.allowedActions, {
                remove: true
            })
        });
        $routeProvider.when('/', {
            templateUrl: 'views/home.html'
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
        }).when('/dataSetReport/reportRequest/dataSet/:dataSet/orgUnit/:orgUnit/period/:period', {
            controller: 'ReportRequestController',
            templateUrl: 'views/reportRequest.html'
        }).when('/dataSetReport/archive', {
            templateUrl: 'views/archive.html'
        }).otherwise({
            redirectTo: '/'
        });

        $translateProvider.preferredLanguage('en');
        $translateProvider.useSanitizeValueStrategy('escaped');
        $translateProvider.useLoader('i18nLoader');
    });