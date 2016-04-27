/* global angular */

'use strict';
/* Controllers */
var appControllers = angular.module('appControllers', []);
appControllers.controller('StandardReportController', function($scope,DHIS2URL,$http,$sce,$timeout,$location) {

    $scope.data ={
        //selectedOrgUnit:{},
        dataSets:[],
        period:"",
        periodTypes: {
            "Monthly": {
                name: "Monthly", value: "Monthly", list: [],
                populateList: function (date) {
                    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                    if(!date){
                        date = new Date();
                    }
                    this.list = [];
                    var that = this;
                    monthNames.forEach(function (monthName) {
                        that.list.push({name: monthName + " " + date.getFullYear()})
                    });
                }
            },
            "Quarterly": {
                name: "Quarterly", value: "Quarterly", list: [],
                populateList: function (date) {
                    var quarters = ["January - March" ,"April - June" ,"July - September" ,"October - December"];
                    if(!date){
                        date = new Date();
                    }
                    this.list = [];
                    var that = this;
                    quarters.forEach(function (quarter,index) {
                        that.list.push({name: quarter + " " + date.getFullYear(),value: date.getFullYear() +"Q" + index})
                    });
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
                    for (var i = date.getFullYear() - 5; i < date.getFullYear() + 5; i++) {
                        this.list.push({name: "July " + i + " - June " + (i + 1),value: i + "July"});
                    }
                }
            }
        }
    };
    $scope.currentDate = new Date();
    $scope.displayPreviousPeriods = function(){
        $scope.currentDate = new Date($scope.currentDate.getFullYear() - 1,$scope.currentDate.getMonth(),$scope.currentDate.getDate());
        $scope.data.periodTypes[$scope.data.dataSet.periodType].populateList($scope.currentDate);
    };
    $scope.displayNextPeriods = function(){
        $scope.currentDate = new Date($scope.currentDate.getFullYear() + 1,$scope.currentDate.getMonth(),$scope.currentDate.getDate());
        $scope.data.periodTypes[$scope.data.dataSet.periodType].populateList($scope.currentDate);
    };
    $scope.getPeriodType = function(name){
        var retPeriodType;
        $scope.data.periodTypes.forEach(function(periodType){
            if(name == periodType.name){
                retPeriodType = periodType;
            }
        });
        console.log(name,JSON.stringify(retPeriodType));
        return retPeriodType;
    }
    $scope.$watch("data.dataSet",function(value){
        if(value){
            $scope.currentDate = new Date();
            $scope.data.periodTypes[value.periodType].populateList();

        }
    });
    $scope.sortOrganisationUnits = function(orgUnit){
        if(orgUnit.children){
            orgUnit.children.sort(function(child1,child2){
                return  orgUnitFunction(child1).localeCompare(orgUnitFunction(child2));
            });
            orgUnit.children.forEach(function(child){
                $scope.sortOrganisationUnits(child);
            })
        }
    };
    $http.get(DHIS2URL +"api/dataSets.json?fields=id,name,periodType").then(function(results){
        $scope.data.dataSets = results.data.dataSets;
        $http.get(DHIS2URL +"api/organisationUnits.json?filter=level:eq:1&fields=id,name,children[id,name,children[id,name,children[id,name,children[id,name,children]]]]")
            .then(function(results){
            $scope.data.organisationUnits = results.data.organisationUnits;
                $scope.sortOrganisationUnits($scope.data.organisationUnits[0]);
        });
    });
    $scope.removeTrustedHtml = function(){
        $scope.trustedHtml = false;
    }
    $scope.generateDataSetReport = function(){
        $location.path("/report/" + $scope.data.dataSet.id +"/" + $scope.data.selectedOrgUnit.id +"/"+$scope.data.period);

    };
}).controller("ReportController",function($scope,$http,$routeParams,$sce,$q,DHIS2URL,$timeout,$compile,$location){
    $scope.data ={

    }
    $scope.trustedHtml = undefined;
    $scope.loadingReport = false;
    $scope.getReport = function(){
        $scope.loadingReport = true;
        $scope.trustedHtml = undefined;
        var deffered = $q.defer();
        var promises = [];
        $scope.dataElementsData = {};
        $http.get(DHIS2URL +"api/dataSets/"+$routeParams.dataSet+".json?fields=:all,dataEntryForm[htmlCode],dataElements[id,valueType]").then(function(results){
            $scope.data.dataSetForm = results.data;
            var trustedHtml = $scope.renderHtml(results.data.dataEntryForm.htmlCode,results.data.dataElements);

            var common = 50;
            for(var i = 0;i < Math.ceil($scope.dataElements.length / common); i++) {
                promises.push($http.get(DHIS2URL + "api/analytics.json?dimension=dx:" + $scope.dataElements.slice(i * 10, i * 10 + common).join(";") + "&dimension=pe:" + $routeParams.period + "&filter=ou:" + $routeParams.orgUnit + "&displayProperty=NAME")
                    .then(function (analyticsResults) {
                        analyticsResults.data.rows.forEach(function (row) {
                            $scope.dataElementsData[row[0]] = row[2];
                        });
                    }));
            }
            $q.all(promises).then(function(){
                $scope.trustedHtml = trustedHtml;
                $scope.loadingReport = false;
                $timeout(function(){

                    deffered.resolve();
                },1000);
            });
        });
        return deffered.promise;
    }
    $scope.back = function(){
        $location.path("/standardReport");
    }
    $scope.dataElements = [];
    $scope.renderHtml = function( html,dataElements){
        var inputRegEx = /<input (.*?)>/g;
        var match = null;
        $scope.dataElements = [];
        var newHtml = html;
        while(true){
            match = inputRegEx.exec(html);
            if(match != null){
                var idRegEx = /id="(.*?)-(.*?)-val"/g;

                var idMacth = idRegEx.exec(match[0]);

                if(idMacth != null){
                    var isValidAggregate = true;
                    dataElements.forEach(function(dataElement){
                        if(dataElement.id == idMacth[1] && (dataElement.valueType == "DATE" || dataElement.valueType == "TEXT")){
                            isValidAggregate = false;
                        }
                    });
                    if(isValidAggregate){
                        newHtml = newHtml.replace(match[0],"<label>{{dataElementsData['" + idMacth[1] +"." + idMacth[2]+ "']}}</label>");
                        $scope.dataElements.push(idMacth[1]+"." + idMacth[2]);
                    }
                }else{
                    idRegEx = /id="indicator(.*?)"/g;
                    idMacth = idRegEx.exec(match[0]);
                    if(idMacth != null){
                        newHtml = newHtml.replace(match[0],"<label> {{dataElementsData['" + idMacth[1] + "']}}</label>");
                        $scope.dataElements.push(idMacth[1]);
                    }else{

                        idRegEx = /dataelementid="(.*?)"/g;
                        idMacth = idRegEx.exec(match[0]);
                        if(idMacth != null){
                            newHtml = newHtml.replace(match[0],"<label>{{dataElementsData['" + idMacth[1] + "']}}</label>");
                            $scope.dataElements.push(idMacth[1]);
                        }else{
                            console.log(match);
                            console.log(idMacth);
                        }
                    }
                }


            }else{
                break;
            }
        }
        return $sce.trustAsHtml(newHtml);
    }
    $scope.getReport().then(function(){
        var reportElement = document.getElementById("report");
        $compile(reportElement.children)($scope);
    });
});
