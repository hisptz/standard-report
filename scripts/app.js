'use strict';

/* App Module */

var app = angular.module('app',
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
                     'd2HeaderBar','FileManagerApp'
                    ])
              
.value('DHIS2URL', '../../../');
app.config(function($translateProvider,$routeProvider,fileManagerConfigProvider) {
    var defaults = fileManagerConfigProvider.$get();
    fileManagerConfigProvider.set({
        appName: 'Report Archive Manager',
        allowedActions: angular.extend(defaults.allowedActions, {
            remove: true
        })
    });
	$routeProvider.when('/', {
        templateUrl: 'views/home.html'
    }).when('/standardReport', {
        controller: 'StandardReportController',
        templateUrl: 'views/standardReport.html'
    }).when('/report/:dataSet/:orgUnit/:period', {
        controller: 'ReportController',
        templateUrl: 'views/report.html'
    }).when('/report/:dataSet/:orgUnit/:period/preview', {
        controller: 'ReportController',
        templateUrl: 'views/report.html'
    }).when('/reportRequest/:dataSet/:orgUnit/:period', {
        controller: 'ReportRequestController',
        templateUrl: 'views/reportRequest.html'
    }).when('/archive', {
        templateUrl: 'views/archive.html'
    }).otherwise({
        redirectTo : '/'
    });
     
    $translateProvider.preferredLanguage('en');
    $translateProvider.useSanitizeValueStrategy('escaped');
    $translateProvider.useLoader('i18nLoader');
});