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
                     'd2HeaderBar'
                    ])
              
.value('DHIS2URL', '../../../');
app.config(function($translateProvider,$routeProvider) {
	
	$routeProvider.when('/', {
        templateUrl: 'views/home.html'
    }).when('/standardReport', {
        controller: 'ReportController',
        templateUrl: 'views/standardReport.html'
    }).otherwise({
        redirectTo : '/'
    });
     
    $translateProvider.preferredLanguage('en');
    $translateProvider.useSanitizeValueStrategy('escaped');
    $translateProvider.useLoader('i18nLoader');
});
