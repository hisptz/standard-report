/* global angular */

'use strict';

function kendoPrint() {
  kendo.drawing
    .drawDOM($('#printablereport'), {
      avoidLinks: true,
      paperSize: 'A4',
      margin: '1cm',
      scale: 0.8
    })
    .then(function(group) {
      kendo.drawing.pdf.saveAs(group, 'Converted PDF.pdf');
    });
}

function browserPrint() {
  window.print();
  return true;
}

function browserPrint2() {
  var mywindow = window.open('', 'PRINT', 'height=400,width=600');
  mywindow.document.write('<html><head><title>' + document.title + '</title>');

  mywindow.document.write('</head><body >');
  mywindow.document.write(document.getElementById('printablereport').innerHTML);
  mywindow.document.write('</body></html>');

  setTimeout(function() {
    mywindow.print();
    //mywindow.close();
  }, 1000);
  return true;
}
/* Controllers */
var appControllers = angular
  .module('appControllers', [])
  .controller('StandardReportController', function(
    $scope,
    DHIS2URL,
    $http,
    $sce,
    $timeout,
    $location,
    ReportService,
    toaster,
    $routeParams
  ) {
    $scope.data = {
      selectedOrgUnit: undefined,
      config: {},
      archive: undefined,
      dataSets: [],
      period: '',
      periodTypes: {
        Monthly: {
          currentDate: new Date(),
          next: function() {
            this.currentDate = new Date(
              this.currentDate.getFullYear() + 1,
              this.currentDate.getMonth(),
              this.currentDate.getDate()
            );
            this.populateList();
          },
          previous: function() {
            this.currentDate = new Date(
              this.currentDate.getFullYear() - 1,
              this.currentDate.getMonth(),
              this.currentDate.getDate()
            );
            this.populateList();
          },
          name: 'Monthly',
          value: 'Monthly',
          allowNext: true,
          allowPrevious: true,
          list: [],
          populateList: function() {
            //this.allowNext = true;
            var monthNames = [
              'July',
              'August',
              'September',
              'October',
              'November',
              'December',
              'January',
              'February',
              'March',
              'April',
              'May',
              'June'
            ];
            /*if (!date) {
                         date = new Date();
                         }*/
            this.list = [];
            var that = this;
            var year = this.currentDate.getFullYear();
            monthNames.forEach(function(monthName, index) {
              var monthVal = index + 7;

              if (monthVal > 12) {
                monthVal = monthVal % 12;
              }
              if (monthVal == 1) {
                year++;
              }
              var testDate = new Date();
              if (
                (year == testDate.getFullYear() &&
                  monthVal > testDate.getMonth() + 1) ||
                year > testDate.getFullYear()
              ) {
                return;
              }
              if (monthVal < 10) {
                monthVal = '0' + monthVal;
              }
              if (
                !(
                  testDate.getMonth() + 1 == monthVal &&
                  testDate.getFullYear() == year
                )
              ) {
                that.allowNext = true;
                that.list.unshift({
                  name: monthName + ' ' + year,
                  value: year + '' + monthVal
                });
              }
            });
            if (this.list.length == 0) {
              this.currentDate = new Date(
                this.currentDate.getFullYear() - 1,
                this.currentDate.getMonth(),
                this.currentDate.getDate()
              );
              this.populateList();
              that.allowNext = false;
            }
          }
        },
        Quarterly: {
          currentDate: new Date(),
          next: function() {
            this.currentDate = new Date(
              this.currentDate.getFullYear() + 1,
              this.currentDate.getMonth(),
              this.currentDate.getDate()
            );
            this.populateList();
          },
          previous: function() {
            this.currentDate = new Date(
              this.currentDate.getFullYear() - 1,
              this.currentDate.getMonth(),
              this.currentDate.getDate()
            );
            this.populateList();
          },
          name: 'Quarterly',
          value: 'Quarterly',
          allowNext: true,
          allowPrevious: true,
          list: [],
          populateList: function() {
            var quarters = [
              'July - September',
              'October - December',
              'January - March',
              'April - June'
            ];
            this.list = [];
            var that = this;
            var year = this.currentDate.getFullYear();
            quarters.forEach(function(quarter, index) {
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
              if (
                year > testDate.getFullYear() ||
                (Math.ceil((testDate.getMonth() + 1) / 3) <= quarterVal &&
                  year == testDate.getFullYear())
              ) {
                return;
              }
              //if (!(Math.ceil((testDate.getMonth() + 1) / 3) < quarterVal && testDate.getFullYear() == year))
              {
                that.list.unshift({
                  name: quarter + ' ' + year,
                  value: year + 'Q' + quarterVal
                });
                that.allowNext = true;
              }
            });
            if (this.list.length == 0) {
              this.currentDate = new Date(
                this.currentDate.getFullYear() - 1,
                this.currentDate.getMonth(),
                this.currentDate.getDate()
              );
              this.populateList();
              that.allowNext = false;
            }
          }
        },
        Yearly: {
          name: 'Yearly',
          value: 'Yearly',
          list: [],
          populateList: function() {
            this.list = [];
            for (
              var i = this.currentDate.getFullYear() - 2;
              i < this.currentDate.getFullYear();
              i++
            ) {
              this.list.unshift({
                name: '' + i
              });
            }
          }
        },

        FinancialJuly: {
          currentDate: new Date(),
          next: function() {
            this.currentDate = new Date(
              this.currentDate.getFullYear() + 5,
              this.currentDate.getMonth(),
              this.currentDate.getDate()
            );
            this.populateList();
          },
          previous: function() {
            this.currentDate = new Date(
              this.currentDate.getFullYear() - 5,
              this.currentDate.getMonth(),
              this.currentDate.getDate()
            );
            this.populateList();
          },
          name: 'Financial-July',
          value: 'FinancialJuly',
          allowNext: false,
          allowPrevious: true,
          list: [],
          populateList: function() {
            var date = new Date();
            this.list = [];
            var testDate = new Date();

            for (
              var i = this.currentDate.getFullYear() - 4;
              i <= this.currentDate.getFullYear();
              i++
            ) {
              if (i == date.getFullYear() && date.getMonth() < 7) {
                continue;
              }
              this.list.unshift({
                name: 'July ' + i + ' - June ' + (i + 1),
                value: i + 'July'
              });
            }
            if (this.currentDate.getFullYear() == new Date().getFullYear()) {
              this.allowNext = false;
            } else {
              this.allowNext = true;
            }
          }
        }
      }
    };
    /*$scope.reportChange = function(){
            alert("Here");
        }*/
    $scope.displayPreviousPeriods = function() {
      $scope.data.periodTypes[$scope.data.dataSet.periodType].previous();
    };
    $scope.displayNextPeriods = function() {
      $scope.data.periodTypes[$scope.data.dataSet.periodType].next();
    };
    $scope.getPeriodType = function(name) {
      var retPeriodType;
      $scope.data.periodTypes.forEach(function(periodType) {
        if (name == periodType.name) {
          retPeriodType = periodType;
        }
      });
      return retPeriodType;
    };
    $scope.data.changeOrgUnit = false;
    $scope.$watch('data.dataSet', function(value) {
      if (value) {
        $scope.data.period = '';
        $scope.data.changeOrgUnit = !$scope.data.changeOrgUnit;
        $scope.data.periodTypes[value.periodType].populateList();
      }
    });
    $scope.loadingArchive = false;
    $scope.$watch('data.selectedOrgUnit', function(selectedOrgUnit) {
      if (selectedOrgUnit) {
        var found = false;
        if ($scope.data.dataSet) {
          $scope.data.dataSet.organisationUnits.forEach(function(orgUnt) {
            if (orgUnt.id == selectedOrgUnit.id) {
              found = true;
            }
          });
          if (!found) {
            toaster.pop(
              'warning',
              'Warning',
              'Please select a corresponding organisation for the report'
            );
            $scope.data.config.toggleSelection($scope.data.selectedOrgUnit);
            $scope.data.selectedOrgUnit = undefined;
          }
        } else {
          toaster.pop('warning', 'Warning', 'Please select a report');
          $scope.data.config.toggleSelection($scope.data.selectedOrgUnit);
          $scope.data.selectedOrgUnit = undefined;
        }
      }
    });
    $scope.archiveDataElements = [];
    $scope.loadTracker = 'Loading Data Sets';
    $scope.setOrganisationUnitSelection = function(orgUnit) {
      if (orgUnit.id == $routeParams.orgUnit) {
        $scope.data.config.toggleSelection(orgUnit);
      } else if (orgUnit.children) {
        orgUnit.children.forEach(function(child) {
          $scope.setOrganisationUnitSelection(child);
        });
      }
    };
    $scope.doesValueExist = function(period) {
      var returnVal = false;
      $scope.data.periodTypes[$scope.data.dataSet.periodType].list.forEach(
        function(p) {
          if (p.value == period) {
            returnVal = true;
          }
        }
      );
      return returnVal;
    };
    $http
      .get(
        DHIS2URL +
          'api/26/dataSets.json?fields=id,name,code,periodType,attributeValues[value,attribute[name]],organisationUnits[id]&filter=attributeValues.value:eq:true&filter=attributeValues.attribute.name:eq:Is Report'
      )
      .then(
        function(results) {
          $scope.data.dataSets = results.data.dataSets;
          $scope.loadTracker = undefined;

          $scope.data.dataSets.forEach(function(dataSet) {
            if ($routeParams.dataSet) {
              if (dataSet.id == $routeParams.dataSet) {
                $scope.data.dataSet = dataSet;
              }
            }
          });
          ReportService.getUser().then(function(results) {
            var orgUnitIds = [];
            results.dataViewOrganisationUnits.forEach(function(orgUnit) {
              orgUnitIds.push(orgUnit.id);
            });
            $http
              .get(
                DHIS2URL +
                  'api/26/organisationUnits.json?filter=id:in:[' +
                  orgUnitIds +
                  ']&fields=id,name,level,children[id,name,level,children[id,name,level,children[id,name,level,children[id,name,level,children]]]]'
              )
              .then(
                function(results) {
                  $scope.data.organisationUnits =
                    results.data.organisationUnits;
                  $scope.data.organisationUnits.forEach(function(orgUnit) {
                    ReportService.sortOrganisationUnits(orgUnit);
                  });
                  if ($routeParams.dataSet) {
                    $timeout(function() {
                      $scope.data.organisationUnits.forEach(function(orgUnit) {
                        $scope.setOrganisationUnitSelection(orgUnit);
                      });
                    });
                    while (!$scope.doesValueExist($routeParams.period)) {
                      if (
                        $scope.data.periodTypes[
                          $scope.data.dataSet.periodType
                        ].currentDate.getFullYear() < 2011
                      ) {
                        break;
                      }
                      $scope.data.periodTypes[
                        $scope.data.dataSet.periodType
                      ].previous();
                    }

                    $timeout(function() {
                      $scope.data.period = $routeParams.period;
                    });
                  }
                  $scope.loadTracker = undefined;
                },
                function(error) {
                  $scope.data.organisationUnits = [];
                  toaster.pop(
                    'error',
                    'Error' + error.status,
                    'Error Loading Organisation Units. Please try again'
                  );
                }
              );
          });
        },
        function(error) {
          $scope.loadTracker = undefined;
          toaster.pop(
            'error',
            'Error' + error.status,
            'Error Loading Data Sets. Please try again'
          );
        }
      );
    $scope.removeTrustedHtml = function() {
      $scope.trustedHtml = false;
    };
    $scope.generateDataSetReport = function() {
      sendEvent(
        'Report Download',
        $scope.data.dataSet.name,
        $location.$$absUrl
          .replace($location.$$protocol + '://', '')
          .replace($location.$$host, '')
          .replace(':' + $location.$$port, '')
          .replace('#' + $location.$$path, ''),
        $scope.data.selectedOrgUnit.id,
        $scope.data.period,
        ''
      );
      $location.path(
        '/dataSetReport/reportRequest/dataSet/' +
          $scope.data.dataSet.id +
          '/orgUnit/' +
          $scope.data.selectedOrgUnit.id +
          '/period/' +
          $scope.data.period
      );
    };
  })
  .controller('MainController', function(
    $scope,
    DHIS2URL,
    $http,
    ReportService
  ) {
    $scope.allowAnalytics = false;
    ReportService.getUser().then(function(user) {
      $scope.user = user;
      $scope.user.userCredentials.userRoles.forEach(function(role) {
        if (
          role.authorities.indexOf('F_DATA_MART_ADMIN') > -1 ||
          role.authorities.indexOf('ALL') > -1
        ) {
          $scope.user.organisationUnits.forEach(function(organisationUnit) {
            if (organisationUnit.level == 1) {
              $scope.allowAnalytics = true;
            }
          });
        }
      });
    });
  })
  .controller('ReportRequestController', function(
    $scope,
    $routeParams,
    $http,
    DHIS2URL,
    ReportService,
    $location,
    $sce,
    toaster,
    $route,
    $q
  ) {
    $scope.reloadPage = function() {
      window.location.reload();
    };

    $scope.downloadExcel = function() {
      ReportService.downloadExcel(
        $scope.dataSet,
        $scope.data.organisationUnit,
        $routeParams.period
      );
    };
    $scope.user = {};
    $scope.data = {};
    $scope.load = function(url) {
      $location.path(url);
    };
    $scope.download = function(url) {
      window.open(
        '../ARDS-Archive/' +
          $routeParams.dataSet +
          '_' +
          $routeParams.orgUnit +
          '_' +
          $routeParams.period +
          '.pdf',
        '_blank'
      );
      sendEvent(
        'Report Download',
        $scope.dataSet.name,
        $location.$$absUrl
          .replace($location.$$protocol + '://', '')
          .replace($location.$$host, '')
          .replace(':' + $location.$$port, '')
          .replace('#' + $location.$$path, ''),
        $routeParams.orgUnit,
        $routeParams.period,
        ''
      );
    };

    $scope.hasReports = function() {
      var hasReport = false;
      $scope.sourceDataSets.forEach(function(sourceDataSet) {
        if (sourceDataSet.isReport) {
          hasReport = true;
        }
      });
      return hasReport;
    };

    $scope.generateDataSetReport = function() {
      $location.path(
        '/dataSetReport/report/dataSet/' +
          $routeParams.dataSet +
          '/orgUnit/' +
          $routeParams.orgUnit +
          '/period/' +
          $routeParams.period +
          '/preview'
      );
    };
    $scope.generateDataSetReportInDebug = function() {
      $location.path(
        '/dataSetReport/report/dataSet/' +
          $routeParams.dataSet +
          '/orgUnit/' +
          $routeParams.orgUnit +
          '/period/' +
          $routeParams.period +
          '/debug'
      );
    };
    $scope.getOrgUnitStatus = function(
      completeDataSetRegistrations,
      id,
      period
    ) {
      var returnVal = 'Incomplete';
      completeDataSetRegistrations.forEach(function(dataSet) {
        if (dataSet.organisationUnit == id && period == dataSet.period) {
          returnVal = 'Complete';
        }
      });
      return returnVal;
    };
    $scope.statusReturn = {
      canCreate: true,
      create: false
    };
    $scope.onDone = function(statusReturn) {
      $scope.statusReturn.canCreate = statusReturn.canCreate;
    };
    $scope.afterAllReportCreated = function() {
      $scope.statusReturn.canCreate = true;
      $scope.createDataSetReport();
    };
    $scope.createDataSetReport = function() {
      $scope.statusReturn.create = true;
      $scope.createAllReports().then(function() {
        ReportService.createDataSetReport({
          orgUnit: $routeParams.orgUnit,
          period: $routeParams.period,
          dataSet: $routeParams.dataSet
        }).then(
          function() {
            $scope.reportStatus = 'Not Executed';
            $scope.statusReturn.create = false;
          },
          function() {
            toaster.pop(
              'error',
              'Error',
              'Error Loading Data. Please try again.'
            );
            $scope.statusReturn.create = false;
          }
        );
      });
      /*$scope.statusReturn.create = true;
            if($scope.statusReturn.canCreate){

            }else{
                toaster.pop('error', "Error", "Error creating Report. To create this reports make sure the previous reports have been created.");
            }*/
    };
    $scope.status = {};
    $scope.cancelAllReportCreation = function() {
      $scope.notCompleted = undefined;
    };
    $scope.control = {};

    function isReport(dataSet) {
      var ret = false;
      dataSet.attributeValues.forEach(function(attributeValue) {
        if (
          attributeValue.value === 'true' &&
          attributeValue.attribute.name === 'Is Report'
        ) {
          ret = true;
        }
      });
      return ret;
    }
    $scope.createAllReports = function() {
      var deffered = $q.defer();
      $scope.createAllReportLoading = true;
      var foundDistrictReports = false;
      var requests = [];
      $scope.sourceDataSets.forEach(function(sourceDataSet) {
        if (
          isReport(sourceDataSet) &&
          sourceDataSet.displayName.indexOf('Integrated') == -1
        ) {
          foundDistrictReports = true;
          $scope
            .getOrganisationUnitPeriods(sourceDataSet)
            .forEach(function(organisationUnitPeriod) {
              if (
                $scope.dataStore.executed.indexOf(
                  sourceDataSet.id +
                    '_' +
                    $scope.data.organisationUnit.id +
                    '_' +
                    organisationUnitPeriod
                ) == -1 &&
                $scope.dataStore.notExecuted.indexOf(
                  sourceDataSet.id +
                    '_' +
                    $scope.data.organisationUnit.id +
                    '_' +
                    organisationUnitPeriod
                ) == -1
              )
                requests.push({
                  orgUnit: $scope.data.organisationUnit.id,
                  source: sourceDataSet.id,
                  period: organisationUnitPeriod
                });
            });
          if (
            sourceDataSet.orgUnitLevel != $scope.data.organisationUnit.level
          ) {
            $scope.data.organisationUnit.children.forEach(function(child) {
              $scope
                .getOrganisationUnitPeriods(sourceDataSet)
                .forEach(function(organisationUnitPeriod) {
                  if (
                    $scope.dataStore.executed.indexOf(
                      sourceDataSet.id +
                        '_' +
                        child.id +
                        '_' +
                        organisationUnitPeriod
                    ) == -1 &&
                    $scope.dataStore.notExecuted.indexOf(
                      sourceDataSet.id +
                        '_' +
                        child.id +
                        '_' +
                        organisationUnitPeriod
                    ) == -1
                  )
                    requests.push({
                      orgUnit: child.id,
                      source: sourceDataSet.id,
                      period: organisationUnitPeriod
                    });
                });
            });
          }
        }
      });
      if (foundDistrictReports) {
        var promises = [];
        requests.forEach(function(request) {
          promises.push(
            $scope.createDataSetReportParams(
              request.orgUnit,
              request.period,
              request.source,
              'notExecuted'
            )
          );
        });
        $q.all(promises).then(
          function(result) {
            toaster.pop(
              'success',
              'Report Created',
              'District Reports creation has been scheduled successfully.'
            );

            $scope.createAllReportLoading = false;
            if ($scope.onReportsCreated) {
              $scope.onReportsCreated();
            }
            deffered.resolve();
          },
          function(result) {
            toaster.pop(
              'success',
              'Report Created',
              'District Reports creation has been scheduled successfully.'
            );
            $scope.createAllReportLoading = false;
            if ($scope.onReportsCreated) {
              $scope.onReportsCreated();
            }
            deffered.resolve();
          }
        );
      } else {
        $scope.notCompleted = {};
        $scope.reportCreation = [];
        $scope.idMapper = {};
        var dataSetIds = [];
        $scope.dataSet.attributeValues.forEach(function(attributeValue) {
          if (attributeValue.attribute.name == 'Source') {
            var json = eval('(' + attributeValue.value + ')');
            json.forEach(function(source) {
              if (source.level == 3) {
                source.sources.forEach(function(s) {
                  dataSetIds.push(s.dataSet);
                });
              }
            });
          }
        });
        $http
          .get(
            DHIS2URL +
              'api/26/dataSets.json?filter=id:in:[' +
              dataSetIds.join(',') +
              ']&fields=id,name,periodType,attributeValues[value,attribute[name]]'
          )
          .then(
            function(dataSetResults) {
              $http
                .get(
                  DHIS2URL +
                    'api/26/organisationUnits.json?fields=id,name&filter=level:eq:3&filter=path:like:' +
                    $routeParams.orgUnit
                )
                .then(
                  function(orgUnitResults) {
                    var districtIds = [];
                    orgUnitResults.data.organisationUnits.forEach(function(
                      organisationUnit
                    ) {
                      districtIds.push(organisationUnit.id);
                      $scope.idMapper[organisationUnit.id] = organisationUnit;
                    });
                    var formDataSets = [];
                    dataSetResults.data.dataSets.forEach(function(dataSet) {
                      var isReport = false;
                      dataSet.attributeValues.forEach(function(attributeValue) {
                        if (
                          attributeValue.attribute.name == 'Is Report' &&
                          attributeValue.value == 'true'
                        ) {
                          isReport = true;
                        }
                      });
                      if (!isReport) {
                        formDataSets.push(dataSet.id);
                        $scope.notCompleted[dataSet.id] = {};
                        $scope.idMapper[dataSet.id] = dataSet;
                        districtIds.forEach(function(id) {
                          $scope.notCompleted[dataSet.id][id] = true;
                        });
                      } else {
                        districtIds.forEach(function(id) {
                          $scope
                            .getOrganisationUnitPeriods(dataSet)
                            .forEach(function(organisationUnitPeriod) {
                              $scope.reportCreation.push({
                                orgUnit: id,
                                period: organisationUnitPeriod,
                                dataSet: dataSet.id
                              });
                            });
                        });
                      }
                    });
                    var startDate = periodDate.startDate;
                    if ($scope.dataSet.name.indexOf('DIR02') > -1) {
                      if (
                        $routeParams.period.indexOf('Q3') > -1 ||
                        $routeParams.period.indexOf('Q4') > -1
                      ) {
                        startDate = $routeParams.period.substr(0, 4) + '-07-01';
                      } else if (
                        $routeParams.period.indexOf('Q1') > -1 ||
                        $routeParams.period.indexOf('Q2') > -1
                      ) {
                        startDate =
                          parseInt($routeParams.period.substr(0, 4)) -
                          1 +
                          '-07-01';
                      }
                    }
                    $http
                      .get(
                        DHIS2URL +
                          'api/26/completeDataSetRegistrations.json?dataSet=' +
                          formDataSets.join('&orgUnit=') +
                          '&orgUnit=' +
                          districtIds.join('&orgUnit=') +
                          '&startDate=' +
                          startDate +
                          '&endDate=' +
                          periodDate.endDate
                      )
                      .then(
                        function(completenessResults) {
                          if (
                            completenessResults.data
                              .completeDataSetRegistrations
                          ) {
                            completenessResults.data.completeDataSetRegistrations.forEach(
                              function(completeDataSetRegistration) {
                                if (
                                  $scope.notCompleted[
                                    completeDataSetRegistration.dataSet
                                  ][
                                    completeDataSetRegistration.organisationUnit
                                  ]
                                ) {
                                  $scope.notCompleted[
                                    completeDataSetRegistration.dataSet
                                  ][
                                    completeDataSetRegistration.organisationUnit
                                  ] = undefined;
                                  if (
                                    Object.keys(
                                      $scope.notCompleted[
                                        completeDataSetRegistration.dataSet
                                      ]
                                    ).length == 0
                                  ) {
                                    $scope.notCompleted[
                                      completeDataSetRegistration.dataSet
                                    ] = undefined;
                                  }
                                }
                              }
                            );
                          }
                          if (Object.keys($scope.notCompleted).length == 0) {
                            $scope.createDistrictReports().then(
                              function() {
                                deffered.resolve();
                              },
                              function() {
                                deffered.resolve();
                              }
                            );
                          } else {
                            $scope.createAllReportLoading = false;
                            deffered.resolve();
                          }
                        },
                        function(error) {
                          $scope.createAllReportLoading = false;
                          deffered.resolve();
                        }
                      );
                  },
                  function(error) {
                    $scope.createAllReportLoading = false;
                    deffered.resolve();
                  }
                );
            },
            function(error) {
              $scope.createAllReportLoading = false;
              deffered.resolve();
            }
          );
      }
      return deffered.promise;
    };
    $scope.createDistrictReports = function() {
      var deffered = $q.defer();
      $scope.createAllReportLoading = true;
      var promises = [];
      $scope.reportCreation.forEach(function(data) {
        promises.push(
          $scope.createDataSetReportParams(
            data.orgUnit,
            data.period,
            data.dataSet,
            'notExecuted'
          )
        );
      });
      $q.all(promises).then(
        function(result) {
          toaster.pop(
            'success',
            'Report Created',
            'District Reports creation has been scheduled successfully.'
          );
          $scope.createAllReportLoading = false;
          deffered.resolve();
        },
        function(result) {
          toaster.pop(
            'success',
            'Report Created',
            'District Reports creation has been scheduled successfully.'
          );
          $scope.createAllReportLoading = false;
          deffered.resolve();
        }
      );
      return deffered.promise;
    };
    $scope.createDataSetReportParamsSingle = function(
      orgUnit,
      period,
      dataSet,
      st
    ) {
      var deffered = $q.defer();
      $scope.status[orgUnit + '_' + period + '_' + dataSet] = 'loading';
      ReportService.createDataSetReport({
        orgUnit: orgUnit,
        period: period,
        dataSet: dataSet
      }).then(
        function() {
          $scope.status[orgUnit + '_' + period + '_' + dataSet] = undefined;
          $scope.dataStore[st].push(dataSet + '_' + orgUnit + '_' + period);
          deffered.resolve();
        },
        function(error) {
          deffered.resolve();
        }
      );

      return deffered.promise;
    };
    $scope.createDataSetReportParams = function(orgUnit, period, dataSet, st) {
      var deffered = $q.defer();
      var promises = [];
      var requests = [
        {
          orgUnit: orgUnit,
          period: period,
          dataSet: dataSet
        }
      ];
      if (dataSet == 'cSC1VV8uMh9') {
        var year = parseInt(period.substr(0, 4));
        var month = parseInt(period.substr(4));
        if (
          $scope.dataStore.executed.indexOf(
            dataSet + '_' + orgUnit + '_' + period
          ) == -1 &&
          $scope.dataStore.notExecuted.indexOf(
            dataSet + '_' + orgUnit + '_' + period
          ) == -1
        ) {
          while (month != 7) {
            month--;
            if (month == 0) {
              month = 12;
              year--;
            }
            var monthStr = month;
            if (month < 10) {
              monthStr = '0' + month;
            }
            if (
              $scope.dataStore.executed.indexOf(
                dataSet + '_' + orgUnit + '_' + year + '' + monthStr
              ) == -1 &&
              $scope.dataStore.notExecuted.indexOf(
                dataSet + '_' + orgUnit + '_' + year + '' + monthStr
              ) == -1
            ) {
              if (
                !(
                  $scope.data.organisationUnit.id === orgUnit &&
                  $scope.data.organisationUnit.level < 3
                )
              ) {
                promises.push(
                  $scope.createDataSetReportParamsSingle(
                    orgUnit,
                    year + '' + monthStr,
                    dataSet,
                    st
                  )
                );
              }
            }
          }
        } else if (
          $scope.dataStore.notExecuted.indexOf(
            dataSet + '_' + orgUnit + '_' + period
          ) > -1
        ) {
          while (month != 6) {
            month++;
            if (month == 13) {
              month = 1;
              year++;
            }
            var monthStr = month;
            if (month < 10) {
              monthStr = '0' + month;
            }
            if (
              $scope.dataStore.notExecuted.indexOf(
                dataSet + '_' + orgUnit + '_' + year + '' + monthStr
              ) > -1
            ) {
              if (
                !(
                  $scope.data.organisationUnit.id === orgUnit &&
                  $scope.data.organisationUnit.level < 3
                )
              ) {
                promises.push(
                  $scope.createDataSetReportParamsSingle(
                    orgUnit,
                    year + '' + monthStr,
                    dataSet,
                    st
                  )
                );
              }
            }
          }
        }
      }
      requests.forEach(function(r) {
        if (
          !(
            $scope.data.organisationUnit.id === orgUnit &&
            $scope.data.organisationUnit.level < 3
          )
        ) {
          promises.push(
            $scope.createDataSetReportParamsSingle(
              orgUnit,
              r.period,
              dataSet,
              st
            )
          );
        }
      });
      $q.all(promises).then(
        function() {
          deffered.resolve();
        },
        function(error) {
          deffered.resolve();
        }
      );
      return deffered.promise;
    };
    $scope.cancelReport = function() {
      ReportService.cancelCreateDataSetReport({
        orgUnit: $routeParams.orgUnit,
        period: $routeParams.period,
        dataSet: $routeParams.dataSet
      }).then(function() {
        $route.reload();
      });
    };
    $scope.checkApproval = function() {
      var deffered = $q.defer();
      $http
        .get(
          DHIS2URL +
            'api/26/organisationUnits/' +
            $routeParams.orgUnit +
            '.json?fields=id,name,path,ancestors,level,parent,children[id,name]'
        )
        .then(function(results) {
          $scope.data.organisationUnit = results.data;
          var organisationUnitChecks = results.data.ancestors;
          organisationUnitChecks.push({
            id: $routeParams.orgUnit
          });
          var parentPeriods = [];
          if ($routeParams.period.indexOf('July') > -1) {
            parentPeriods.push($routeParams.period);
          } else if ($routeParams.period.indexOf('Q') > -1) {
            parentPeriods.push($routeParams.period);
            if (
              $routeParams.period.substr(5) == '1' ||
              $routeParams.period.substr(5) == '2'
            ) {
              parentPeriods.push(
                parseInt($routeParams.period.substr(0, 4)) - 1 + 'July'
              );
            } else {
              parentPeriods.push($routeParams.period.substr(0, 4) + 'July');
            }
          } else {
            parentPeriods.push($routeParams.period);
            if (
              (parseInt($routeParams.period.substr(4)) >= 1) &
              (parseInt($routeParams.period.substr(4)) <= 6)
            ) {
              parentPeriods.push(
                parseInt($routeParams.period.substr(0, 4)) - 1 + 'July'
              );
            } else {
              parentPeriods.push($routeParams.period.substr(0, 4) + 'July');
            }
            parentPeriods.push(
              $routeParams.period.substr(0, 4) +
                'Q' +
                Math.ceil($routeParams.period.substr(4) / 3)
            );
          }
          $http
            .get(
              DHIS2URL +
                'api/dataSets.json?fields=id,name&filter=attributeValues.value:like:' +
                $routeParams.dataSet /*+'&filter=id:ne:' + $routeParams.dataSet*/
            )
            .then(
              function(dataSetResult) {
                var promises = [];
                dataSetResult.data.dataSets.forEach(function(dataSet) {
                  promises.push(
                    $http.get(DHIS2URL + 'api/26/dataStore/approve').then(
                      function(approvalResult) {
                        approvalResult.data.forEach(function(approveUrl) {
                          organisationUnitChecks.forEach(function(orgUnitc) {
                            parentPeriods.forEach(function(p) {
                              //if(approveUrl == dataSet.id + "_" + orgUnitc.id +"_" + p && dataSet.name.indexOf("Integrated") > -1){
                              if (
                                approveUrl ==
                                dataSet.id + '_' + orgUnitc.id + '_' + p
                              ) {
                                $scope.parentApproved = true;
                              }
                            });
                          });
                        });
                      },
                      function(error) {}
                    )
                  );
                });
                $q.all(promises).then(
                  function(result) {
                    deffered.resolve(result);
                  },
                  function(result) {
                    deffered.resolve(result);
                  }
                );
              },
              function(error) {}
            );
        });
      return deffered.promise;
    };
    $scope.undoDataSetReport = function() {
      var theFile = $scope.loadFile;
      $scope.loadFile = undefined;
      $scope.checkApproval().then(function() {
        if ($scope.parentApproved) {
          toaster.pop(
            'error',
            'This report cannot be undone. It has been approved.'
          );
          $scope.loadFile = theFile;
        } else {
          ReportService.undoDataSetReport({
            orgUnit: $routeParams.orgUnit,
            period: $routeParams.period,
            dataSet: $routeParams.dataSet
          }).then(
            function() {
              toaster.pop(
                'success',
                'Report Undone',
                'Report was undone successfully.'
              );
              $route.reload();
            },
            function() {
              toaster.pop(
                'warning',
                'Error Undoing Reports',
                'Some reports could not be undone. Nothing to worry though. The server will take care of it in the background'
              );
              $route.reload();
            }
          );
        }
      });
    };
    $scope.params = $routeParams;
    $scope.dataStore = {};
    var periodDate = ReportService.getPeriodDate($routeParams.period);
    $scope.fetchCompleteness = function(dataSet, sourceLevels) {
      if (!dataSet.isReport) {
        dataSet.orgUnitLevel = dataSet.organisationUnits[0].level;
        var startDate = periodDate.startDate;
        if ('Wtzj9Chl3HW' == dataSet.id) {
          if (
            $routeParams.period.indexOf('Q3') > -1 ||
            $routeParams.period.indexOf('Q4') > -1
          ) {
            startDate = $routeParams.period.substr(0, 4) + '-07-01';
          } else if (
            $routeParams.period.indexOf('Q1') > -1 ||
            $routeParams.period.indexOf('Q2') > -1
          ) {
            startDate =
              parseInt($routeParams.period.substr(0, 4)) - 1 + '-07-01';
          }
        }
        $http
          .get(
            DHIS2URL +
              'api/26/completeDataSetRegistrations.json?dataSet=' +
              dataSet.id +
              '&orgUnit=' +
              $routeParams.orgUnit +
              '&startDate=' +
              startDate +
              '&endDate=' +
              periodDate.endDate +
              '&children=true'
          )
          .then(
            function(results) {
              if (results.data.completeDataSetRegistrations) {
                dataSet.completeDataSetRegistrations =
                  results.data.completeDataSetRegistrations;
              } else {
                dataSet.completeDataSetRegistrations = [];
              }
            },
            function(error) {
              //$scope.error = "heye";
              dataSet.completeDataSetRegistrations = [];
            }
          );
      } else {
      }
    };
    $scope.getLevelName = function(level) {
      var name = '';
      $scope.organisationUnitLevels.forEach(function(organisationUnitLevel) {
        if (organisationUnitLevel.level == level) {
          name = organisationUnitLevel.name;
        }
      });
      return name;
    };
    $http
      .get(DHIS2URL + 'api/26/organisationUnitLevels.json?fields=name,level')
      .then(
        function(results) {
          $scope.organisationUnitLevels = results.data.organisationUnitLevels;
        },
        function(error) {}
      );
    $scope.completeDataSetRegistrationsLoading = false;
    $scope.reportStatus = '';
    $scope.setPeriodTypeValues = function(dataSet) {
      if (dataSet.periodType == 'Quarterly') {
        dataSet.periodTypeValue = 4;
      } else if (
        dataSet.periodType == 'Yearly' ||
        dataSet.periodType == 'FinancialJuly'
      ) {
        dataSet.periodTypeValue = 1;
      } else if (dataSet.periodType == 'Monthly') {
        dataSet.periodTypeValue = 12;
      }
    };
    $scope.getOrganisationUnitPeriods = function(dataSet) {
      var returnValue = [];
      if (dataSet.periodType == 'Quarterly') {
        if ($routeParams.period.endsWith('July')) {
          returnValue = [
            $routeParams.period.substr(0, 4) + 'Q3',
            $routeParams.period.substr(0, 4) + 'Q4',
            parseInt($routeParams.period.substr(0, 4)) + 1 + 'Q1',
            parseInt($routeParams.period.substr(0, 4)) + 1 + 'Q2'
          ];
        } else if ($routeParams.period.indexOf('Q') > -1) {
          if (
            $scope.dataSet.name.indexOf('Quarterly Integrated Report') > -1 &&
            $scope.organisationUnit.level == 3
          ) {
            if ($routeParams.period.substr(5) == '1') {
              returnValue = [
                parseInt($routeParams.period.substr(0, 4)) - 1 + 'Q3',
                parseInt($routeParams.period.substr(0, 4)) - 1 + 'Q4',
                $routeParams.period.substr(0, 4) + 'Q1'
              ];
            } else if ($routeParams.period.substr(5) == '2') {
              returnValue = [
                parseInt($routeParams.period.substr(0, 4)) - 1 + 'Q3',
                parseInt($routeParams.period.substr(0, 4)) - 1 + 'Q4',
                $routeParams.period.substr(0, 4) + 'Q1',
                $routeParams.period.substr(0, 4) + 'Q2'
              ];
            } else if ($routeParams.period.substr(5) == '3') {
              returnValue = [$routeParams.period.substr(0, 4) + 'Q3'];
            } else if ($routeParams.period.substr(5) == '4') {
              returnValue = [
                $routeParams.period.substr(0, 4) + 'Q3',
                $routeParams.period.substr(0, 4) + 'Q4'
              ];
            }
          } else {
            returnValue = [$routeParams.period];
          }
        }
      } else if (dataSet.periodType == 'Monthly') {
        if ($routeParams.period.endsWith('July')) {
          returnValue = [
            $routeParams.period.substr(0, 4) + '07',
            $routeParams.period.substr(0, 4) + '08',
            $routeParams.period.substr(0, 4) + '09',
            $routeParams.period.substr(0, 4) + '10',
            $routeParams.period.substr(0, 4) + '11',
            $routeParams.period.substr(0, 4) + '12',
            parseInt($routeParams.period.substr(0, 4)) + 1 + '01',
            parseInt($routeParams.period.substr(0, 4)) + 1 + '02',
            parseInt($routeParams.period.substr(0, 4)) + 1 + '03',
            parseInt($routeParams.period.substr(0, 4)) + 1 + '04',
            parseInt($routeParams.period.substr(0, 4)) + 1 + '05',
            parseInt($routeParams.period.substr(0, 4)) + 1 + '06'
          ];
        } else if ($routeParams.period.indexOf('Q') > -1) {
          if (
            $scope.dataSet.name.indexOf('Quarterly Integrated Report') > -1 &&
            $scope.organisationUnit.level == 3
          ) {
            if ($routeParams.period.substr(5) == '1') {
              returnValue = returnValue.concat(
                $scope.getMonthsByQuarter(
                  parseInt($routeParams.period.substr(0, 4)) - 1 + 'Q3'
                )
              );
              returnValue = returnValue.concat(
                $scope.getMonthsByQuarter(
                  parseInt($routeParams.period.substr(0, 4)) - 1 + 'Q4'
                )
              );
            } else if ($routeParams.period.substr(5) == '2') {
              returnValue = returnValue.concat(
                $scope.getMonthsByQuarter(
                  parseInt($routeParams.period.substr(0, 4)) - 1 + 'Q3'
                )
              );
              returnValue = returnValue.concat(
                $scope.getMonthsByQuarter(
                  parseInt($routeParams.period.substr(0, 4)) - 1 + 'Q4'
                )
              );
              returnValue = returnValue.concat(
                $scope.getMonthsByQuarter(
                  $routeParams.period.substr(0, 4) + 'Q1'
                )
              );
            } else if ($routeParams.period.substr(5) == '4') {
              returnValue = returnValue.concat(
                $scope.getMonthsByQuarter(
                  $routeParams.period.substr(0, 4) + 'Q3'
                )
              );
            }
          }
          returnValue = returnValue.concat(
            $scope.getMonthsByQuarter($routeParams.period)
          );
        } else {
          if (
            dataSet.id == $routeParams.dataSet &&
            $routeParams.dataSet == 'cSC1VV8uMh9'
          ) {
            var month = $routeParams.period.substr(4);
            var year = $routeParams.period.substr(0, 4);
            while (month != 7) {
              month--;
              if (month == 0) {
                month = 12;
                year--;
              }
              var monthStr = month;
              if (monthStr < 10) {
                monthStr = '0' + monthStr;
              }
              returnValue.push(year + '' + monthStr);
            }
          } else {
            returnValue.push($routeParams.period);
          }
        }
      } else if (dataSet.periodType == 'FinancialJuly') {
        if ($routeParams.period.indexOf('Q') > -1) {
          returnValue.push($routeParams.period);
        } else if ($routeParams.period.endsWith('July')) {
          returnValue.push($routeParams.period);
        } else {
          returnValue.push($routeParams.period.substr(0, 4) + '07');
        }
      }
      return returnValue;
    };
    $scope.getMonthsByQuarter = function(period) {
      var returnValue = [];
      var quarterLastMonth = parseInt(period.substr(5)) * 3;
      for (var i = quarterLastMonth - 2; i <= quarterLastMonth; i++) {
        var monthVal = i;
        if (i < 10) {
          monthVal = '0' + i;
        }
        returnValue.push(period.substr(0, 4) + monthVal);
      }
      return returnValue;
    };
    //$scope.file = undefinde;
    $scope.parentApproved = false;
    $scope.watchParameters = function() {
      $scope.loadingArchive = true;
      $scope.data.archive = undefined;
      $scope.completeDataSetRegistrations = undefined;
      $http
        .get(
          DHIS2URL +
            'api/26/dataSets/' +
            $routeParams.dataSet +
            '.json?fields=id,name,periodType,attributeValues[value,attribute[name]],organisationUnits[id]'
        )
        .then(
          function(results) {
            $scope.dataSet = results.data;
            $scope.isNotAuthorized = function() {
              var returnValue = true;
              $scope.dataSet.organisationUnits.forEach(function(
                dataSetOrgUnit
              ) {
                $scope.user.organisationUnits.forEach(function(userOrgUnit) {
                  if (
                    dataSetOrgUnit.id == userOrgUnit.id &&
                    userOrgUnit.level == '3'
                  ) {
                    returnValue = false;
                  }
                });
              });
              if ($scope.isSuperUser()) {
                returnValue = false;
              }
              return returnValue;
            };

            function getFinancialPeriod(period) {
              if (period.indexOf('July') > -1) {
                return period;
              } else if (period.indexOf('Q') > -1) {
                if (['1', '2'].indexOf(period.substr(5)) > -1) {
                  return parseInt(period.substr(0, 4)) - 1 + 'July';
                } else {
                  return period.substr(0, 4) + 'July';
                }
              } else {
                if (
                  ['01', '02', '03', '04', '05', '06'].indexOf(
                    period.substr(4)
                  ) > -1
                ) {
                  return parseInt(period.substr(0, 4)) - 1 + 'July';
                } else {
                  return period.substr(0, 4) + 'July';
                }
              }
            }
            $http
              .get(
                DHIS2URL +
                  'api/26/dataStore/executed/' +
                  $routeParams.dataSet +
                  '_' +
                  $routeParams.orgUnit +
                  '_' +
                  $routeParams.period
              )
              .then(
                function(results) {
                  $scope.reportStatus = 'Executed';
                  $http
                    .get(
                        '../ARDS-Archive/' +
                        getFinancialPeriod($routeParams.period) +
                        '/' +
                        $routeParams.dataSet +
                        '_' +
                        $routeParams.orgUnit +
                        '_' +
                        $routeParams.period +
                        '.html',
                        {
                        headers: {
                          'Cache-Control': 'no-cache'
                        }
                      }
                    )
                    .then(
                      function(result) {

                        $scope.file = $sce.trustAsHtml(result.data.replace(/<script[>]*(.*)<\/script>|\n|<!--([\s\S]*?)-->/g, ""));

                        $scope.loadFile = true;
                      },
                      function(error) {
                        $scope.loadFile = true;
                        if (error.status) {
                          if (error.status == 404) {
                            toaster.pop(
                              'error',
                              'Error' + error.status,
                              'Archive not available.'
                            );
                          }
                        } else {
                          if (error.status == 403) {
                            toaster.pop(
                              'error',
                              'Error' + error.status,
                              'Access to archive is denied. Please contact Administrator for access.'
                            );
                          }
                        }
                      }
                    );
                },
                function(error) {
                  if (error.data.httpStatusCode == 404) {
                    $http
                      .get(
                        DHIS2URL +
                          'api/26/dataStore/notExecuted/' +
                          $routeParams.dataSet +
                          '_' +
                          $routeParams.orgUnit +
                          '_' +
                          $routeParams.period
                      )
                      .then(
                        function(results) {
                          $scope.reportStatus = 'Not Executed';
                        },
                        function(error) {
                          if (error.data.httpStatusCode == 404) {
                            //Check if the report is in the executed namespace
                            $scope.reportStatus = 'Starting';
                            $scope.loadingArchive = false;
                            if (!$scope.data.archive) {
                              $scope.completeDataSetRegistrationsLoading = true;

                              $scope.setPeriodTypeValues($scope.dataSet);
                              if (results.data.attributeValues.length > 0) {
                                var dataSetFound = false;
                                results.data.attributeValues.forEach(function(
                                  attributeValue
                                ) {
                                  if (
                                    attributeValue.attribute.name == 'Source'
                                  ) {
                                    var sourceArray = eval(
                                      '(' + attributeValue.value + ')'
                                    );

                                    sourceArray.forEach(function(source) {
                                      if (
                                        source.level ==
                                        $scope.data.organisationUnit.level
                                      ) {
                                        var sourceIds = [];
                                        var sourceLevels = {};
                                        source.sources.forEach(function(
                                          dataSource
                                        ) {
                                          sourceIds.push(dataSource.dataSet);
                                          sourceLevels[dataSource.dataSet] =
                                            dataSource.level;
                                        });

                                        $http
                                          .get(
                                            DHIS2URL +
                                              'api/26/dataSets.json?filter=id:in:[' +
                                              sourceIds +
                                              ']&fields=id,periodType,displayName,attributeValues[value,attribute[name]],organisationUnits[id,level]'
                                          )
                                          .then(
                                            function(results) {
                                              $scope.sourceDataSets =
                                                results.data.dataSets;
                                              $scope.consistsOfReport = false;
                                              $scope.sourceDataSets.forEach(
                                                function(dataSet) {
                                                  dataSet.orgUnitLevel =
                                                    sourceLevels[dataSet.id];

                                                  $scope.setPeriodTypeValues(
                                                    dataSet
                                                  );
                                                  var isReport = false;
                                                  if (
                                                    dataSet.id != 'cSC1VV8uMh9'
                                                  )
                                                    dataSet.attributeValues.forEach(
                                                      function(attributeValue) {
                                                        if (
                                                          attributeValue
                                                            .attribute.name ==
                                                          'Is Report'
                                                        ) {
                                                          if (
                                                            attributeValue.value ==
                                                            'true'
                                                          ) {
                                                            isReport = true;
                                                            $scope.consistsOfReport = true;
                                                          }
                                                        }
                                                      }
                                                    );
                                                  dataSet.isReport = isReport;
                                                  $scope.fetchCompleteness(
                                                    dataSet,
                                                    sourceLevels
                                                  );
                                                }
                                              );
                                            },
                                            function(error) {
                                              $scope.error = 'heye';
                                              $scope.completeDataSetRegistrationsLoading = false;
                                              toaster.pop(
                                                'error',
                                                'Error' + error.status,
                                                'Error Loading Archive. Please try again'
                                              );
                                            }
                                          );
                                      }
                                    });
                                  }
                                });
                                if (!dataSetFound) {
                                  $scope.completeDataSetRegistrations = [];
                                  $scope.completeDataSetRegistrationsLoading = false;
                                }
                              } else {
                                $scope.completeDataSetRegistrations = [];
                                $scope.completeDataSetRegistrationsLoading = false;
                              }
                            } else {
                              $scope.error = 'heye';
                              toaster.pop(
                                'error',
                                'Error' + error.status,
                                'Error Loading Archive. Please try again'
                              );
                            }
                          }
                        }
                      );
                  } else {
                    $scope.error = 'heye';
                    $scope.reportStatus = '';
                    toaster.pop(
                      'error',
                      'Error' + error.status,
                      'Error Loading Archive. Please try again'
                    );
                  }
                }
              );
            //Check if the report is in the not executed namespace
          },
          function(error) {
            $scope.error = 'error';
            $scope.completeDataSetRegistrationsLoading = false;
            toaster.pop(
              'error',
              'Error' + error.status,
              'Error Loading Data Set. Please try again'
            );
          }
        );
    };
    $scope.isNotApproved = function() {
      var returnValue = true;
      $scope.user.organisationUnits.forEach(function(orgUnit) {
        if ($scope.data.organisationUnit.parent) {
          if (orgUnit.id == $scope.data.organisationUnit.parent.id) {
            returnValue = false;
          }
        } else {
          if (orgUnit.level == 1) {
            returnValue = false;
          }
        }
      });
      $scope.user.userCredentials.userRoles.forEach(function(userRole) {
        if (
          userRole.authorities.indexOf('ALL') > -1 ||
          userRole.name == 'Superuser'
        ) {
          returnValue = false;
        }
      });
      return returnValue;
    };
    $scope.getPeriodName = function(period) {
      if (period) {
        return ReportService.getPeriodName(period);
      } else {
        return ReportService.getPeriodName($routeParams.period);
      }
    };
    $http
      .get(
        DHIS2URL +
          'api/26/me.json?fields=:all,organisationUnits[id,level],userCredentials[userRoles[:all]]'
      )
      .then(function(results) {
        $scope.user = results.data;
        $scope.isSuperUser = function() {
          var returnValue = false;
          $scope.user.userCredentials.userRoles.forEach(function(userRole) {
            if (
              userRole.authorities.indexOf('ALL') > -1 ||
              userRole.name == 'Superuser'
            ) {
              returnValue = true;
            }
          });
          return returnValue;
        };
        $scope.lockReports = true;

        function getFormattedDate(date) {
          date = new Date(date);
          var month = date.getMonth() + 1;
          var newDate =
            date.getFullYear() +
            '-' +
            (month > 9 ? month : '0' + month) +
            '-01';
          return new Date(newDate);
        }

        function getEndOfFinancialYearDate(date) {
          date = new Date(date);
          var year;
          if (date.getMonth() + 1 >= 7) {
            year = date.getFullYear() + 1;
          } else {
            year = date.getFullYear();
          }
          return new Date(year + '-06-30');
        }

        function getLastDate(period) {
          if (period.indexOf('July') > -1) {
            return new Date(parseInt(period.substr(0, 4)) + 1, 5, 30);
          } else if (period.indexOf('Q') > -1) {
            return new Date(
              parseInt(period.substr(0, 4)),
              parseInt(period.substr(5)) * 3,
              0
            );
          } else {
            return new Date(
              parseInt(period.substr(0, 4)),
              parseInt(period.substr(4)),
              0
            );
          }
        }
        $http.get(DHIS2URL + 'api/27/systemSettings').then(
          function(results) {
            if (
              parseInt(
                results.data
                  .numberOfMonthAfterEndOfFinancialYearToLockReportCreation
              ) < 0
            ) {
              $scope.lockReports = false;
            } else {
              var numberOfMonth = parseInt(
                results.data
                  .numberOfMonthAfterEndOfFinancialYearToLockReportCreation
              );
              var endOfFinancialYear = getEndOfFinancialYearDate(
                getLastDate($routeParams.period)
              );
              endOfFinancialYear.setMonth(
                endOfFinancialYear.getMonth() + (numberOfMonth + 1)
              );
              endOfFinancialYear = getFormattedDate(endOfFinancialYear);
              var blockingDateOfDataEntryForm = new Date();
              if (blockingDateOfDataEntryForm > endOfFinancialYear) {
                $scope.lockReports = true;
              } else {
                $scope.lockReports = false;
              }
            }
          },
          function() {
            $scope.lockReports = true;
          }
        );
        $http
          .get(
            DHIS2URL +
              'api/26/organisationUnits/' +
              $routeParams.orgUnit +
              '.json?fields=id,name,path,ancestors,level,parent,children[id,name]'
          )
          .then(function(results) {
            $scope.data.organisationUnit = results.data;
            var organisationUnitChecks = results.data.ancestors;
            organisationUnitChecks.push({
              id: $routeParams.orgUnit
            });
            var parentPeriods = [];
            if ($routeParams.period.indexOf('July') > -1) {
              parentPeriods.push($routeParams.period);
            } else if ($routeParams.period.indexOf('Q') > -1) {
              parentPeriods.push($routeParams.period);
              if (
                $routeParams.period.substr(5) == '1' ||
                $routeParams.period.substr(5) == '2'
              ) {
                parentPeriods.push(
                  parseInt($routeParams.period.substr(0, 4)) - 1 + 'July'
                );
              } else {
                parentPeriods.push($routeParams.period.substr(0, 4) + 'July');
              }
            } else {
              parentPeriods.push($routeParams.period);
              if (
                (parseInt($routeParams.period.substr(4)) >= 1) &
                (parseInt($routeParams.period.substr(4)) <= 6)
              ) {
                parentPeriods.push(
                  parseInt($routeParams.period.substr(0, 4)) - 1 + 'July'
                );
              } else {
                parentPeriods.push($routeParams.period.substr(0, 4) + 'July');
              }
              parentPeriods.push(
                $routeParams.period.substr(0, 4) +
                  'Q' +
                  Math.ceil($routeParams.period.substr(4) / 3)
              );
            }
            $http
              .get(
                DHIS2URL +
                  'api/dataSets.json?fields=id,name&filter=attributeValues.value:like:' +
                  $routeParams.dataSet /*+'&filter=id:ne:' + $routeParams.dataSet*/
              )
              .then(
                function(dataSetResult) {
                  dataSetResult.data.dataSets.forEach(function(dataSet) {
                    $http.get(DHIS2URL + 'api/26/dataStore/approve').then(
                      function(approvalResult) {
                        approvalResult.data.forEach(function(approveUrl) {
                          organisationUnitChecks.forEach(function(orgUnitc) {
                            parentPeriods.forEach(function(p) {
                              //if(approveUrl == dataSet.id + "_" + orgUnitc.id +"_" + p && dataSet.name.indexOf("Integrated") > -1){
                              if (
                                approveUrl ==
                                dataSet.id + '_' + orgUnitc.id + '_' + p
                              ) {
                                $scope.parentApproved = true;
                              }
                            });
                          });
                        });
                        /*result.data.forEach(function(dataSet){

                                 })*/
                      },
                      function(error) {}
                    );
                  });
                },
                function(error) {}
              );
            ReportService.sortOrganisationUnits($scope.data.organisationUnit);
            $http.get(DHIS2URL + 'api/26/dataStore/executed').then(
              function(results) {
                $scope.dataStore.executed = results.data;
                $http.get(DHIS2URL + 'api/26/dataStore/notExecuted').then(
                  function(results) {
                    $scope.dataStore.notExecuted = results.data;
                    $scope.watchParameters();
                  },
                  function() {
                    $scope.dataStore.notExecuted = [];
                    $scope.watchParameters();
                  }
                );
              },
              function() {
                $scope.dataStore.notExecuted = [];
                $scope.dataStore.executed = [];
                $scope.watchParameters();
              }
            );
            $scope.loadTracker = undefined;
          });
      });

    $scope.printReport = function() {
      browserPrint2();
      sendEvent(
        'Report Download',
        $scope.dataSet.name,
        '/api/apps/standardreport/index.html#/dataSetReport/reportRequest/dataSet/' +
          $routeParams.dataSet +
          '/orgUnit/' +
          $routeParams.orgUnit +
          '/period/' +
          $routeParams.period,
        $routeParams.orgUnit,
        $routeParams.period,
        ''
      );
    };

    $scope.approveData = {};
    $http
      .get(
        DHIS2URL +
          'api/26/dataStore/approve/' +
          $routeParams.dataSet +
          '_' +
          $routeParams.orgUnit +
          '_' +
          $routeParams.period
      )
      .then(
        function(results) {
          //$scope.savingComment = "";
          $scope.approveData = results.data;
        },
        function(error) {
          //$scope.savingComment = "";
          //toaster.pop('info', "Information", "No comments where found.");
        }
      );
    $scope.approvalStatus = '';
    $scope.approve = function() {
      $scope.approvalStatus = 'Approving Report..';
      $scope.approveData = {
        lastUpdated: new Date(),
        user: {
          name: $scope.user.name,
          id: $scope.user.id
        }
      };
      $http
        .post(
          DHIS2URL +
            'api/26/dataStore/approve/' +
            $routeParams.dataSet +
            '_' +
            $routeParams.orgUnit +
            '_' +
            $routeParams.period,
          $scope.approveData
        )
        .then(
          function(results) {
            //$scope.approveData.data = true;
            $scope.approvalStatus = '';
            toaster.pop('success', 'Success', 'Report Approved Successfully.');
          },
          function(error) {
            $scope.approvalStatus = '';
            toaster.pop(
              'error',
              'Failure',
              'Failed to approve report. Please Try again.'
            );
          }
        );
    };
    $scope.disApprove = function() {
      $scope.approvalStatus = 'Disapproving Report..';
      $http
        .delete(
          DHIS2URL +
            'api/26/dataStore/approve/' +
            $routeParams.dataSet +
            '_' +
            $routeParams.orgUnit +
            '_' +
            $routeParams.period
        )
        .then(
          function(results) {
            $scope.approveData = {};
            $scope.approvalStatus = '';
            toaster.pop(
              'success',
              'Success',
              'Report Disapproved Successfully.'
            );
          },
          function(error) {
            $scope.approvalStatus = '';
            toaster.pop(
              'error',
              'Failure',
              'Failed to disapprove report. Please Try again.'
            );
          }
        );
    };
  })
  .controller('ReportController', function(
    $scope,
    $http,
    $routeParams,
    $sce,
    $q,
    DHIS2URL,
    $timeout,
    $compile,
    $location,
    ReportService,
    $window,
    toaster,
    Excel
  ) {
    $scope.dataCriteria = false;
    $scope.changeCriteria = function() {
      $scope.dataCriteria = !$scope.dataCriteria;
    };
    $scope.downloadExcel = function() {

        ReportService.downloadExcel(
        $scope.dataSet,
        $scope.orgUnit,
        $routeParams.period
      );
    };
    $scope.getListByWardData = function(dataSet, newChildren) {
      var deffered = $q.defer();
      $http
        .get(
          DHIS2URL +
            'api/26/dataValueSets.json?dataSet=' +
            dataSet +
            '&orgUnit=' +
            $routeParams.orgUnit +
            ',' +
            newChildren.join(',') +
            '&children=true&period=' +
            $routeParams.period
        )
        .then(
          function(dataSetResults) {
            var organisationUnitList = '';
            if ($scope.orgUnit.level == 3 || $scope.orgUnit.level == 2) {
              organisationUnitList =
                '&orgUnit=' + newChildren.join('&orgUnit=');
            } else {
              organisationUnitList =
                '&orgUnit=' + newChildren.join('&orgUnit=') + '&children=true';
            }
            $http
              .get(
                DHIS2URL +
                  'api/26/completeDataSetRegistrations.json?dataSet=' +
                  dataSet +
                  '&orgUnit=' +
                  $routeParams.orgUnit +
                  organisationUnitList +
                  '&period=' +
                  $routeParams.period
              )
              .then(
                function(dataSetCompletenessResults) {
                  if (dataSetResults.data.dataValues) {
                    dataSetResults.data.dataValues.forEach(function(value) {
                      if (
                        dataSetCompletenessResults.data
                          .completeDataSetRegistrations
                      )
                        dataSetCompletenessResults.data.completeDataSetRegistrations.forEach(
                          function(completeDataSetRegistration) {
                            if (
                              $scope.listByWardData[
                                value.dataElement +
                                  '.' +
                                  value.categoryOptionCombo
                              ] &&
                              value.orgUnit ==
                                completeDataSetRegistration.organisationUnit
                            ) {
                              $scope.data.dataSetForm.dataSetElements.forEach(
                                function(dataSetElement) {
                                  if (
                                    dataSetElement.dataElement.id ==
                                    value.dataElement
                                  ) {
                                    $scope.listByWardData[
                                      value.dataElement +
                                        '.' +
                                        value.categoryOptionCombo
                                    ].name = dataSetElement.dataElement.name;
                                  }
                                }
                              );
                            }
                          }
                        );
                    });
                    dataSetResults.data.dataValues.forEach(function(value) {
                      if (
                        dataSetCompletenessResults.data
                          .completeDataSetRegistrations
                      )
                        dataSetCompletenessResults.data.completeDataSetRegistrations.forEach(
                          function(completeDataSetRegistration) {
                            var listID =
                              value.dataElement +
                              '.' +
                              value.categoryOptionCombo;
                            if (
                              $scope.listByWardData[listID] &&
                              $scope.listByWard.indexOf(listID) > -1 &&
                              value.orgUnit ==
                                completeDataSetRegistration.organisationUnit
                            ) {
                              var found = false;
                              $scope.listByWardData[listID].values.forEach(
                                function(value1) {
                                  if (
                                    value1.dataElement == value.dataElement &&
                                    value1.period == value.period &&
                                    value1.orgUnit == value.orgUnit &&
                                    value1.categoryOptionCombo ==
                                      value.categoryOptionCombo
                                  ) {
                                    found = true;
                                  }
                                }
                              );
                              if (!found) {
                                $scope.listByWardData[listID].values.push(
                                  value
                                );
                              }
                            }
                          }
                        );
                    });
                  }
                  deffered.resolve();
                },
                function(error) {
                  deffered.reject(error);
                }
              );
          },
          function(error) {
            deffered.reject(error);
          }
        );
      return deffered.promise;
    };
    $scope.createReport = false;
    $http
      .get(
        DHIS2URL +
          'api/26/dataStore/notExecuted/' +
          $routeParams.dataSet +
          '_' +
          $routeParams.orgUnit +
          '_' +
          $routeParams.period
      )
      .then(
        function(results) {},
        function(error) {
          if (error.data.httpStatusCode == 404) {
            //Check if the report is in the executed namespace
            $http
              .get(
                DHIS2URL +
                  'api/26/dataStore/executed/' +
                  $routeParams.dataSet +
                  '_' +
                  $routeParams.orgUnit +
                  '_' +
                  $routeParams.period
              )
              .then(
                function(results) {},
                function(error) {
                  $scope.createReport = true;
                }
              );
          }
        }
      );
    var common = 1;
    $scope.state = $routeParams.preview;
    $scope.showDebug = function() {
      $location.path(
        '/dataSetReport/report/dataSet/' +
          $routeParams.dataSet +
          '/orgUnit/' +
          $routeParams.orgUnit +
          '/period/' +
          $routeParams.period +
          '/debug'
      );
    };
    $scope.showPreview = function() {
      $location.path(
        '/dataSetReport/report/dataSet/' +
          $routeParams.dataSet +
          '/orgUnit/' +
          $routeParams.orgUnit +
          '/period/' +
          $routeParams.period +
          '/preview'
      );
    };
    $scope.reloadPage = function() {
      window.location.reload();
    };

    $scope.load = function(url) {
      $location.path(url);
    };
    $scope.generateDataSetReport = function() {
      $location.path(
        '/dataSetReport/reportRequest/dataSet/' +
          $routeParams.dataSet +
          '/orgUnit/' +
          $routeParams.orgUnit +
          '/period/' +
          $routeParams.period
      );
    };
    $scope.notArchive = $location.$$absUrl.indexOf('report.html') == -1;
    $scope.data = {};
    $scope.trustedHtml = undefined;
    $scope.loadingReport = false;
    $scope.preview = $routeParams.preview;
    $scope.getCumulativeToDatePeriod = function() {
      var periods = [];
      if ($routeParams.period.indexOf('Q') > -1) {
        var str = $routeParams.period.split('Q');
        var quarter = parseInt(str[1]);
        if (quarter == 3) {
          periods = [$routeParams.period];
        } else if (quarter == 4) {
          periods = [$routeParams.period, str[0] + 'Q3'];
        } else if (quarter == 1) {
          periods = [
            $routeParams.period,
            parseInt(str[0]) - 1 + 'Q4',
            parseInt(str[0]) - 1 + 'Q3'
          ];
        } else if (quarter == 2) {
          periods = [
            $routeParams.period,
            str[0] + 'Q1',
            parseInt(str[0]) - 1 + 'Q4',
            parseInt(str[0]) - 1 + 'Q3'
          ];
        }
      } else {
        var year = parseInt($routeParams.period.substr(0, 4));
        var month = parseInt($routeParams.period.substr(4));
        periods.push($routeParams.period);
        month--;
        while (month != 6) {
          if (month == 0) {
            month = 12;
            year--;
          }
          var monthStr = month;
          if (month < 10) {
            monthStr = '0' + month;
          }
          periods.push(year + '' + monthStr);
          month--;
        }
      }
      return periods;
    };
    $scope.getFourthQuarterPeriod = function() {
      return [parseInt($routeParams.period.substr(0, 4)) + 1 + 'Q2'];
    };
    var discendantDeffered;
    $scope.getDescendants = function() {
      if (discendantDeffered) {
        return discendantDeffered.promise;
      }
      discendantDeffered = $q.defer();
      $http
        .get(
          DHIS2URL +
            'api/26/organisationUnits.json?paging=false&fields=id,name&level=4&filter=path:like:' +
            $routeParams.orgUnit
        )
        .then(
          function(organisationUnits) {
            $scope.orgUnit.discendants =
              organisationUnits.data.organisationUnits;
            discendantDeffered.resolve();
          },
          function(error) {
            if (error.data.httpStatusCode == 404) {
              discendantDeffered.resolve(error.data);
            } else {
              discendantDeffered.reject(error);
            }
          }
        );
      return discendantDeffered.promise;
    };
    $scope.progressValue = 0;
    $scope.loadingStatus = 'Loading';
    //Loads data from the server
    $scope.getReport = function() {
      $scope.loadingReport = true;
      $scope.trustedHtml = undefined;
      var deffered = $q.defer();
      var promises = [];
      $scope.dataElementsData = {};
      $scope.lastDataElementsData = {};
      $scope.lastMonthOfQuarterData = {};
      $scope.cumulativeToDateData = {};
      $scope.fourthQuarterData = {};
      $scope.listByWardData = {};
      $scope.lastIndicatorData = {};
      $scope.lastMonthIndicatorData = {};
      $scope.districtIndicatorData = {};
      $scope.autogrowingOg = {};
      $scope.loadingStatus = 'Loading Organisation Units';

      var organisationUnit = $scope.orgUnit;
      var children = [];
      organisationUnit.children.forEach(function(child) {
        children.push(child.id);
      });
      $scope.loadingStatus = 'Loading Data Set';
      //Loading Report from the server
      $http
        .get(
          DHIS2URL +
            'api/26/dataSets/' +
            $routeParams.dataSet +
            '.json?fields=:all,dataEntryForm[htmlCode],dataSetElements[dataElement[id,name,aggregationType,valueType]],attributeValues[value,attribute[name]],organisationUnits[id]'
        )
        .then(
          function(results) {
            $scope.dataSet = results.data;
            $scope.data.dataSetForm = results.data;
            var dataElements = [];
            results.data.dataSetElements.forEach(function(dataSetElement) {
              dataElements.push(dataSetElement.dataElement);
            });
            var trustedHtml = $scope.renderHtml(
              results.data.dataEntryForm.htmlCode,
              dataElements
            );
            if ($scope.lastIndicator.length > 0) {
              $scope.orgUnit.children.forEach(function(child) {
                $scope.lastIndicatorData[child.id] = {};
              });
            }
            $scope.loadingStatus = 'Loading Data Values';
            $scope.progressValue = 10;
            var batch = 30;
            var progressFactor =
              60 /
              (($scope.dataElements.length +
                $scope.listByWard.length +
                $scope.lastMonthOfQuarter.length +
                $scope.nonAggregatedDataElements.length +
                $scope.cumulativeToDate.length +
                $scope.fourthQuarter.length +
                $scope.nonAggregatedDataElements.length +
                $scope.nonAggregatedDataElementsDate.length) /
                batch);
            var level4String = 'LEVEL-4;';
            if (
              $scope.orgUnit.level == 3 &&
              $scope.orgUnit.children.length == 0
            ) {
              level4String = '';
            }
            $scope.getMonthsByQuarter = function(period) {
              var returnValue = [];
              var quarterLastMonth = parseInt(period.substr(5)) * 3;
              for (var i = quarterLastMonth - 2; i <= quarterLastMonth; i++) {
                var monthVal = i;
                if (i < 10) {
                  monthVal = '0' + i;
                }
                returnValue.push(period.substr(0, 4) + monthVal);
              }
              return returnValue;
            };
            for (var i = 0; i < $scope.dataElements.length / 1; i++) {
              var wardLevel = [];
              var NotWardLevel = [];
              $scope.dataElements
                .slice(i * 1, i * 1 + 1)
                .forEach(function(dx) {
                  if ($scope.wardLevelIndicator.indexOf(dx) > -1) {
                    wardLevel.push(dx);
                  } else {
                    NotWardLevel.push(dx);
                  }
                });
              if (wardLevel.length > 0) {
                var periods = [];
                if ($routeParams.period.indexOf('Q') > -1) {
                  periods = periods.concat(
                    $scope.getMonthsByQuarter($routeParams.period)
                  );
                } else {
                  periods.push($routeParams.period);
                }
                promises.push(
                  $http
                    .get(
                      DHIS2URL +
                        'api/26/analytics.json?wacha&dimension=dx:' +
                        wardLevel.join(';') +
                        '&dimension=pe:' +
                        periods.join(';') +
                        '&dimension=ou:' +
                        level4String +
                        $routeParams.orgUnit +
                        '&skipRounding=true'
                    )
                    .then(
                      function(analyticsResults) {
                        analyticsResults.data.rows.forEach(function(row) {
                          if ($scope.dataElementsData[row[0]]) {
                            $scope.dataElementsData[row[0]] =
                              '' +
                              (parseFloat($scope.dataElementsData[row[0]]) +
                                parseFloat(row[3])); // + ".0";
                          } else {
                            $scope.dataElementsData[row[0]] = row[3];
                          }
                        });
                        $scope.progressValue =
                          $scope.progressValue + progressFactor;
                        /*wardLevel.forEach(function(id) {
                          if ($scope.dataElementsData[id]) {
                            if (parseFloat($scope.dataElementsData[id]) == 0) {
                              $scope.dataElementsData[id] = '';
                            }
                          }
                            if(id === 'slgLjDrb3sM'){
                                console.log('slgLjDrb3sM', $scope.dataElementsData[id]);
                            }
                        });*/
                      },
                      function() {
                        
                      }
                    )
                );
              }
              if (NotWardLevel.length > 0) {
                promises.push(
                  $http
                    .get(
                      DHIS2URL +
                        'api/26/analytics.json?dimension=dx:' +
                        NotWardLevel.join(';') +
                        '&dimension=pe:' +
                        $routeParams.period +
                        '&filter=ou:' +
                        $routeParams.orgUnit+'&skipRounding=true'
                    )
                    .then(function(analyticsResults) {
                      analyticsResults.data.rows.forEach(function(row) {
                        var isNotSet = true;
                        $scope.data.dataSetForm.dataSetElements.forEach(
                          function(dataSetElement) {
                            var dataElement = dataSetElement.dataElement;
                            if (
                              row[0].indexOf(dataElement.id) > -1 &&
                              dataElement.aggregationType == 'LAST'
                            ) {
                              if ($scope.dataElementsData[row[0]]) {
                                $scope.dataElementsData[row[0]] =
                                  '' +
                                  (
                                    parseFloat(
                                      $scope.dataElementsData[row[0]]
                                    ) + parseFloat(row[2])
                                  ); // + ".0";
                              } else {
                                $scope.dataElementsData[row[0]] = row[2];
                              }
                              isNotSet = true;
                            }
                          }
                        );
                        if (isNotSet) {
                          if (parseFloat(row[2]).toFixed(1) == 'NaN') {
                            $scope.dataElementsData[row[0]] = row[2];
                          } else {
                            $scope.dataElementsData[row[0]] = parseFloat(
                              row[2]
                            );
                          }
                        }
                      });
                      $scope.progressValue =
                        $scope.progressValue + progressFactor;
                    })
                );
              }
            }

            //Dealing with Last Month Indicators
            if ($scope.lastMonthIndicator.length > 0) {
              var period = $routeParams.period;
              if (period.substr(5) == '3') {
                period = period.substr(0, 4) + '09';
              }
              for (var i = 0; i < $scope.lastMonthIndicator.length; i++) {
                promises.push(
                  $http
                    .get(
                      DHIS2URL +
                        'api/26/analytics.json?dimension=dx:' +
                        $scope.lastMonthIndicator[i] +
                        '&dimension=pe:' +
                        period +
                        '&filter=ou:' +
                        $routeParams.orgUnit
                    )
                    .then(function(analyticsResults) {
                      analyticsResults.data.rows.forEach(function(row) {
                        $scope.lastMonthIndicatorData[row[0]] = row[2];
                      });
                      $scope.progressValue =
                        $scope.progressValue + progressFactor;
                    })
                );
              }
            }
            //Dealing with last data elements
            for (var i = 0; i < $scope.lastDataElements.length; i += batch) {
              promises.push(
                $http
                  .get(
                    DHIS2URL +
                      'api/26/analytics.json?dimension=dx:' +
                      $scope.lastDataElements.slice(i, i + batch).join(';') +
                      '&dimension=pe:' +
                      $routeParams.period +
                      '&dimension=ou:' +
                      level4String +
                      $routeParams.orgUnit
                  )
                  .then(
                    function(analyticsResults) {
                      analyticsResults.data.rows.forEach(function(row) {
                        if ($scope.lastDataElementsData[row[0]]) {
                          $scope.lastDataElementsData[row[0]] =
                            '' +
                            (
                              parseFloat($scope.lastDataElementsData[row[0]]) +
                              parseFloat(row[3])
                            ).toFixed(1);
                        } else {
                          $scope.lastDataElementsData[row[0]] = row[3];
                        }
                        if ($scope.lastIndicator.length > 0) {
                          if ($scope.lastIndicatorData[row[2]]) {
                            $scope.lastIndicatorData[row[2]][row[0]] = row[3];
                          } else {
                            $scope.lastIndicatorData[row[2]] = {};
                            $scope.lastIndicatorData[row[2]][row[0]] = row[3];
                          }
                        }

                        $scope.progressValue =
                          $scope.progressValue + progressFactor;
                      });
                    },
                    function() {
                      
                    }
                  )
              );
            }
            //Dealing with tables for listing by wards
            if ($scope.listByWardChoice.length > 0) {
              promises.push(
                $http
                  .get(
                    DHIS2URL +
                      'api/26/analytics.json?dimension=dx:' +
                      $scope.listByWardChoice.join(';') +
                      '&dimension=pe:' +
                      $routeParams.period +
                      '&dimension=ou:LEVEL-3;' +
                      $routeParams.orgUnit
                  )
                  .then(function(analyticsResults) {
                    analyticsResults.data.rows.forEach(function(row) {
                      $scope.listByWardData[row[0]] = {
                        values: []
                      };
                    });
                    analyticsResults.data.rows.forEach(function(row) {
                      $scope.listByWardData[row[0]].values.push({
                        value: row[3]
                      });
                    });
                    $scope.progressValue =
                      $scope.progressValue + progressFactor;
                  })
              );
            }
            if ($scope.listByWard.length > 0) {
              var loadedDataset = [];
              if ($scope.dataSet.attributeValues.length > 0) {
                var dataSetFound = false;
                $scope.listByWard.forEach(function(dx) {
                  $scope.listByWardData[dx] = {
                    values: []
                  };
                });
                $scope.dataSet.attributeValues.forEach(function(
                  attributeValue
                ) {
                  if (attributeValue.attribute.name == 'Source') {
                    var sources = eval('(' + attributeValue.value + ')');
                    sources.forEach(function(source) {
                      if (source.level == 3)
                        source.sources.forEach(function(source2) {
                          //hLCbwDwbNYr
                          if (
                            loadedDataset.indexOf(
                              source2.dataSet +
                                $routeParams.orgUnit +
                                $routeParams.period
                            ) == -1
                          ) {
                            var newChildren = [];
                            if ($scope.orgUnit.level == 3) {
                              $scope.orgUnit.children.forEach(function(child) {
                                newChildren.push(child.id);
                              });
                            } else if (
                              $scope.orgUnit.level == 2 ||
                              $scope.orgUnit.level == 1
                            ) {
                              $scope.orgUnit.discendants.forEach(function(
                                child
                              ) {
                                newChildren.push(child.id);
                              });
                            }
                            loadedDataset.push(
                              source2.dataSet +
                                $routeParams.orgUnit +
                                $routeParams.period
                            );
                            promises.push(
                              $scope.getListByWardData(
                                source2.dataSet,
                                newChildren
                              )
                            );
                          }
                        });
                    });
                    dataSetFound = true;
                  }
                });
              }
            }
            //Dealing with last Month of Quarter data elements
            if ($scope.lastMonthOfQuarter.length > 0) {
              var str = $routeParams.period.split('Q');
              var month = 3 * parseInt(str[1]);
              if (month < 10) {
                month = '0' + month;
              }
              for (
                var i = 0;
                i < $scope.lastMonthOfQuarter.length / batch;
                i++
              ) {
                var wardLevel = [];
                var NotWardLevel = [];
                $scope.lastMonthOfQuarter
                  .slice(i * batch, i * batch + batch)
                  .forEach(function(dx) {
                    if ($scope.wardLevelIndicator.indexOf(dx) > -1) {
                      wardLevel.push(dx);
                    } else {
                      NotWardLevel.push(dx);
                    }
                  });
                if (wardLevel.length > 0) {
                  promises.push(
                    $http
                      .get(
                        DHIS2URL +
                          'api/26/analytics.json?dimension=dx:' +
                          wardLevel.join(';') +
                          '&dimension=pe:' +
                          str[0] +
                          month +
                          '&dimension=ou:' +
                          level4String +
                          $routeParams.orgUnit
                      )
                      .then(function(analyticsResults) {
                        analyticsResults.data.rows.forEach(function(row) {
                          //$scope.lastMonthOfQuarterData[row[0]] = row[3];
                          if ($scope.lastMonthOfQuarterData[row[0]]) {
                            $scope.lastMonthOfQuarterData[row[0]] =
                              '' +
                              (
                                parseFloat(
                                  $scope.lastMonthOfQuarterData[row[0]]
                                ) + parseFloat(row[3])
                              ).toFixed(1);
                          } else {
                            $scope.lastMonthOfQuarterData[row[0]] = row[3];
                          }
                        });
                        $scope.progressValue =
                          $scope.progressValue + progressFactor;
                      })
                  );
                }
                if (NotWardLevel.length > 0) {
                  promises.push(
                    $http
                      .get(
                        DHIS2URL +
                          'api/26/analytics.json?dimension=dx:' +
                          NotWardLevel.join(';') +
                          '&dimension=pe:' +
                          str[0] +
                          month +
                          '&filter=ou:' +
                          $routeParams.orgUnit
                      )
                      .then(function(analyticsResults) {
                        analyticsResults.data.rows.forEach(function(row) {
                          $scope.lastMonthOfQuarterData[row[0]] = row[2];
                        });
                        $scope.progressValue =
                          $scope.progressValue + progressFactor;
                      })
                  );
                }
              }
            }
            //Dealing with cumulative to date data elements
            if ($scope.cumulativeToDate.length > 0) {
              var periods = $scope.getCumulativeToDatePeriod();
              var level = '';
              if ($scope.dataSet.id == 'cSC1VV8uMh9') {
                level = 'LEVEL-4;';
                for (
                  var i = 0;
                  i < $scope.cumulativeToDate.length;
                  i += 1
                ) {
                    promises.push(
                        $http
                            .get(
                                DHIS2URL +
                                'api/26/analytics.json?skhkjshdf&dimension=dx:' +
                                $scope.cumulativeToDate
                                    .slice(i, i + 1)
                                    .join(';') +
                                '&dimension=pe:' +
                                periods.join(';') +
                                '&dimension=ou:' +
                                level +
                                $routeParams.orgUnit + '&skipRounding=true'
                            )
                            .then(function(analyticsResults) {
                                analyticsResults.data.rows.forEach(function(row) {
                                    if ($scope.cumulativeToDateData[row[0]]) {
                                        $scope.cumulativeToDateData[row[0]] = new Decimal(parseFloat($scope.cumulativeToDateData[row[0]])).plus(parseFloat(row[3]));
                                    } else {
                                        $scope.cumulativeToDateData[row[0]] =
                                            '' + parseFloat(row[3]);
                                    }
                                });
                                $scope.progressValue =
                                    $scope.progressValue + progressFactor;
                            })
                    );
                }
              } else {
                for (
                  var i = 0;
                  i < $scope.cumulativeToDate.length;
                  i += batch
                ) {
                    promises.push(
                        $http
                            .get(
                                DHIS2URL +
                                'api/26/analytics.json?dimension=dx:' +
                                $scope.cumulativeToDate
                                    .slice(i, i + 1)
                                    .join(';') +
                                '&dimension=pe:' + periods.join(';') +
                                '&filter=ou:' +
                                level +
                                $routeParams.orgUnit + '&skipRounding=true'
                            )
                            .then(function(analyticsResults) {
                                analyticsResults.data.rows.forEach(function(row) {
                                    if ($scope.cumulativeToDateData[row[0]]) {
                                        $scope.cumulativeToDateData[row[0]] = new Decimal(parseFloat($scope.cumulativeToDateData[row[0]])).plus(parseFloat(row[2]));
                                    } else {
                                        $scope.cumulativeToDateData[row[0]] =
                                            '' + parseFloat(row[2]);
                                    }
                                });
                                $scope.progressValue =
                                    $scope.progressValue + progressFactor;
                            })
                    );
                }
              }
            }
            if ($scope.cumulativeToDateWardLevel.length > 0) {
              var periods = $scope.getCumulativeToDatePeriod();
              var level = 'LEVEL-4;';
              for (
                var i = 0;
                i < $scope.cumulativeToDateWardLevel.length;
                i += batch
              ) {
                periods.forEach(function(period) {
                  var pes = $scope.getMonthsByQuarter(period);
                  promises.push(
                    $http
                      .get(
                        DHIS2URL +
                          'api/26/analytics.json?dimension=dx:' +
                          $scope.cumulativeToDateWardLevel
                            .slice(i, i + batch)
                            .join(';') +
                          '&dimension=pe:' +
                          pes.join(';') +
                          '&dimension=ou:' +
                          level +
                          $routeParams.orgUnit + '&skipRounding=true'
                      )
                      .then(function(analyticsResults) {
                        analyticsResults.data.rows.forEach(function(row) {
                          if ($scope.cumulativeToDateData[row[0]]) {
                            $scope.cumulativeToDateData[row[0]] = new Decimal(parseFloat($scope.cumulativeToDateData[row[0]])).plus(parseFloat(row[3]));
                          } else {
                            $scope.cumulativeToDateData[row[0]] =
                              '' + parseFloat(row[3]);
                          }
                        });
                        $scope.progressValue =
                          $scope.progressValue + progressFactor;
                      })
                  );
                });
              }
            }
            //Dealing with fourth Quarter
            if ($scope.districtIndicator.length > 0) {
              promises.push(
                $http
                  .get(
                    DHIS2URL +
                      'api/26/analytics.json?dimension=dx:' +
                      $scope.districtIndicator.join(';') +
                      '&dimension=pe:' +
                      $routeParams.period +
                      '&dimension=ou:LEVEL-3;' +
                      $routeParams.orgUnit
                  )
                  .then(function(analyticsResults) {
                    analyticsResults.data.rows.forEach(function(row) {
                      if ($scope.districtIndicatorData[row[0]]) {
                        $scope.districtIndicatorData[row[0]] =
                          '' +
                          (parseFloat($scope.districtIndicatorData[row[0]]) +
                            parseFloat(row[3]));
                      } else {
                        $scope.districtIndicatorData[row[0]] = row[3];
                      }
                    });
                  })
              );
            }
            //Dealing with fourth Quarter
            if ($scope.fourthQuarter.length > 0) {
              for (var i = 0; i < $scope.fourthQuarter.length; i += batch) {
                promises.push(
                  $http
                    .get(
                      DHIS2URL +
                        'api/26/analytics.json?dimension=dx:' +
                        $scope.fourthQuarter.slice(i, i + batch).join(';') +
                        '&dimension=pe:' +
                        (parseInt($routeParams.period.replace('July', '')) +
                          1) +
                        'Q2&filter=ou:' +
                        $routeParams.orgUnit
                    )
                    .then(function(analyticsResults) {
                      analyticsResults.data.rows.forEach(function(row) {
                        $scope.fourthQuarterData[row[0]] = row[2];
                      });
                    })
                );
                $scope.progressValue = $scope.progressValue + progressFactor;
              }
            }
            //Dealing with Non Aggregation Data Elements which are text
            for (
              var i = 0;
              i < $scope.nonAggregatedDataElements.length;
              i += batch
            ) {
              promises.push(
                $http
                  .get(
                    DHIS2URL +
                      'api/26/analytics.json?dimension=dx:' +
                      $scope.nonAggregatedDataElements
                        .slice(i, i + batch)
                        .join(';') +
                      '&dimension=pe:' +
                      $routeParams.period +
                      '&filter=ou:' +
                      $routeParams.orgUnit +
                      ';' +
                      children.join(';')
                  )
                  .then(function(analyticsResults) {
                    analyticsResults.data.rows.forEach(function(row) {
                      $scope.dataElementsData[row[0]] = row[2];
                    });
                    $scope.progressValue =
                      $scope.progressValue + progressFactor;
                  })
              );
            }
            //Dealing with Non Aggregation Data Elements which are dates
            for (
              var i = 0;
              i < $scope.nonAggregatedDataElementsDate.length;
              i += batch
            ) {
              promises.push(
                $http
                  .get(
                    DHIS2URL +
                      'api/26/analytics.json?dimension=dx:' +
                      $scope.nonAggregatedDataElementsDate
                        .slice(i, i + batch)
                        .join(';') +
                      '&dimension=pe:' +
                      $routeParams.period +
                      '&filter=ou:' +
                      $routeParams.orgUnit +
                      ';' +
                      children.join(';')
                  )
                  .then(function(analyticsResults) {
                    analyticsResults.data.rows.forEach(function(row) {
                      $scope.dataElementsData[row[0]] = row[2];
                    });
                    $scope.progressValue =
                      $scope.progressValue + progressFactor;
                  })
              );
            }
            //Wait for data to be loaded
            $q.all(promises).then(
              function() {
                $scope.trustedHtml = trustedHtml;
                //$scope.loadingReport = false;
                promises = [];
                $scope.loadingStatus = 'Loading Autogrowing';
                var programIds = [];
                if (Object.keys($scope.autogrowingPrograms).length == 0) {
                  $scope.progressValue = $scope.progressValue + 20;
                }
                //Fetching each autogrowing table
                for (var programId in $scope.autogrowingPrograms) {
                  programIds.push(programId);
                  if ($scope.autogrowingPrograms[programId].cumulativeToDate) {
                    $scope
                      .getCumulativeToDatePeriod()
                      .forEach(function(period) {
                        promises.push(
                          $scope.fetchEventAnalytics(
                            programId,
                            Object.keys($scope.autogrowingPrograms).length,
                            $routeParams.period,
                            true
                          )
                        );
                      });
                    promises.push(
                      $scope.fetchEventAnalytics(
                        programId,
                        Object.keys($scope.autogrowingPrograms).length,
                        $routeParams.period
                      )
                    );
                  } else if (
                    $scope.autogrowingPrograms[programId].fourthQuarter
                  ) {
                    $scope.getFourthQuarterPeriod().forEach(function(period) {
                      promises.push(
                        $scope.fetchEventAnalytics(
                          programId,
                          Object.keys($scope.autogrowingPrograms).length,
                          period,
                          true
                        )
                      );
                    });
                  } else {
                    /*else if ($scope.autogrowingPrograms[programId].lastMonthOfQuarter) {
                                                    var month = parseInt($routeParams.period.substr(5)) * 3;
                                                    if(month < 10){
                                                        month = "0" + month;
                                                    }
                                                    promises.push($scope.fetchEventAnalytics(programId, Object.keys($scope.autogrowingPrograms).length, $routeParams.period.substr(0,4) + "" + month));
                                                }*/
                    promises.push(
                      $scope.fetchEventAnalytics(
                        programId,
                        Object.keys($scope.autogrowingPrograms).length,
                        $routeParams.period
                      )
                    );
                  }
                }

                //Further calculation from loaded Last Indicator data
                if ($scope.lastIndicator.length > 0) {
                  Object.keys($scope.lastIndicatorData).forEach(function(key) {
                    $scope.lastIndicator.forEach(function(indicator) {
                      $scope.lastIndicatorData[key][indicator] = indicator;
                      Object.keys($scope.lastIndicatorData[key]).forEach(
                        function(indicatorInObject) {
                          $scope.lastIndicatorData[key][
                            indicator
                          ] = $scope.lastIndicatorData[key][indicator].replace(
                            indicatorInObject,
                            $scope.lastIndicatorData[key][indicatorInObject]
                          );
                        }
                      );
                      try {
                        $scope.lastIndicatorData[key][indicator] = eval(
                          '(' + $scope.lastIndicatorData[key][indicator] + ')'
                        );
                      } catch (e) {
                        $scope.lastIndicatorData[key][indicator] = 0;
                      }
                    });
                  });
                  $scope.lastIndicator.forEach(function(indicator) {
                    $scope.lastIndicatorData[indicator] = 0;
                    Object.keys($scope.lastIndicatorData).forEach(function(
                      key
                    ) {
                      if ($scope.lastIndicatorData[key][indicator]) {
                        $scope.lastIndicatorData[indicator] +=
                          $scope.lastIndicatorData[key][indicator];
                      }
                    });
                    $scope.lastIndicatorData[
                      indicator
                    ] = $scope.lastIndicatorData[indicator].toFixed(1);
                  });
                  $scope.lastIndicator.forEach(function(indicator) {
                    if ($scope.lastIndicatorData[indicator] == '0.0') {
                      $scope.lastIndicatorData[indicator] = '';
                    }
                  });
                }
                $q.all(promises).then(function() {
                  //Loading autogrowing meta data
                  $http
                    .get(
                      DHIS2URL +
                        'api/26/programs.json?fields=id,programIndicators[:all],programStages[programStageDataElements[sortOrder,dataElement[:all]]]&filter=id:in:[' +
                        programIds +
                        ']'
                    )
                    .then(
                      function(results) {
                        results.data.programs.forEach(function(program) {
                          program.programStages[0].programStageDataElements.forEach(
                            function(programStageDataElement) {
                              var dataElement =
                                programStageDataElement.dataElement;
                              dataElement.sortOrder =
                                programStageDataElement.sortOrder;
                              $scope.autogrowingPrograms[
                                program.id
                              ].dataElementsDetails.push(dataElement);
                            }
                          );
                          program.programIndicators.forEach(function(
                            programIndicator
                          ) {
                            $scope.autogrowingPrograms[
                              program.id
                            ].dataElementsDetails.push(programIndicator);
                          });
                        });
                        Object.keys($scope.dataElementsData).forEach(function(key){
                            if(key === 'logO2vQOnbP' || key === 'IIHbOOcMu7K.dUIkQFWg2qm'){
                                console.log('dataElementsData Checking:',key, $scope.dataElementsData[key])
                            }
                        })
                          /*Object.keys($scope.cumulativeToDateData).forEach(function(key){
                              //$scope.cumulativeToDateData[key] = parseFloat($scope.cumulativeToDateData[key]).toFixed(1);
                              if(key === 'eUnKO1JEZYW.ql8bSsHEnUN'){
                                console.log('cumulativeToDateData', key, $scope.cumulativeToDateData[key])
                              }
                          })*/
                        $timeout(function() {
                          deffered.resolve();
                        });
                      },
                      function(error) {
                        $scope.error = true;
                        toaster.pop(
                          'error',
                          'Error',
                          'Error Loading Autogrowing Meta-Data. Please try again'
                        );
                      }
                    );
                  //$scope.loadingReport = false;
                });
              },
              function(error) {
                $scope.error = true;
                toaster.pop(
                  'error',
                  'Error' + error.status,
                  'Error Loading Data from Server. Please try again'
                );
              }
            );
          },
          function(error) {
            $scope.error = true;
            toaster.pop(
              'error',
              'Error' + error.status,
              'Error Loading Data from Server. Please try again'
            );
          }
        );
      return deffered.promise;
    };
    var periodDate = ReportService.getPeriodDate($routeParams.period);
    var loadedAutogrowing = [];
    $scope.fetchWithCache = function(url) {
      var promise;
      loadedAutogrowing.forEach(function(l) {
        if (l.url == url) {
          promise = l.promise;
        }
      });
      if (promise) {
        return promise;
      } else {
        var obj = {
          url: url,
          promise: $http.get(url)
        };
        loadedAutogrowing.push(obj);
        return obj.promise;
      }
    };
    $scope.fetchEventAnalytics = function(programId, length, period, other) {
      var url =
        DHIS2URL +
        'api/26/analytics/events/query/' +
        programId +
        '?dimension=pe:' +
        period +
        '&dimension=ou:' +
        $routeParams.orgUnit +
        '&dimension=' +
        $scope.autogrowingPrograms[programId].dataElements.join('&dimension=');
      return $http.get(url).then(
        function(analyticsResults) {
          analyticsResults.data.rows.forEach(function(row) {
            var object = {};
            analyticsResults.data.headers.forEach(function(header, index) {
              object[header.column] = row[index];
            });
            if (other) {
              $scope.autogrowingPrograms[programId].otherData.push(object);
            } else {
              $scope.autogrowingPrograms[programId].data.push(object);
            }
          });
          $scope.progressValue = $scope.progressValue + 20 / length;
        },
        function() {
          $scope.error = true;
          toaster.pop(
            'error',
            'Error' + error.status,
            'Error Loading Data from Server. Please try again'
          );
        }
      );
    };
    $scope.back = function() {
      $location.path(
        '/dataSetReport/reportRequest/dataSet/' +
          $routeParams.dataSet +
          '/orgUnit/' +
          $routeParams.orgUnit +
          '/period/' +
          $routeParams.period
      );
    };
    $scope.dataElements = [];
    $scope.lastDataElements = [];
    $scope.lastMonthOfQuarter = [];
    $scope.cumulativeToDate = [];
    $scope.cumulativeToDateWardLevel = [];
    $scope.listByWard = [];
    $scope.listByWardChoice = [];
    $scope.fourthQuarter = [];
    $scope.nonAggregatedDataElements = [];
    $scope.nonAggregatedDataElementsDate = [];
    $scope.autogrowingPrograms = {};
    $scope.lastIndicator = [];
    $scope.lastMonthIndicator = [];
    $scope.wardLevelIndicator = [];
    $scope.lastMonthOfQuarterWardLevel = [];
    $scope.districtIndicator = [];

    //Replacement for debug purpose;
    $scope.getElementReplacment = function(content, type) {
      var processed = content
        .replace("lastDataElementsData['", '')
        .replace("dataElementsData['", '')
        .replace("list-by-ward='listByWardData['", '')
        .replace("dataElementsData['", '')
        .replace("lastMonthOfQuarterData['", '')
        .replace("cumulativeToDateData['", '')
        .replace("fourthQuarterData['", '')
        .replace("']", '');
     
      var div = "<div gid='" + processed + "'>{{" + content + ' |comma}}';
      if ($routeParams.preview == 'debug') {
        var addition = '';
        if (content.indexOf("dataElementsData['") > -1) {
          addition = "type='" + type + "'";
        } else if (content.indexOf("lastMonthOfQuarterData['") > -1) {
          addition = "type='" + type + "' special='lastMonthOfQuarter'";
        } else if (content.indexOf("cumulativeToDateData['") > -1) {
          addition = "type='" + type + "' special='cumulativeToDate'";
        } else if (content.indexOf("fourthQuarterData['") > -1) {
          addition = "type='" + type + "' special='fourthQuarter'";
        } else if (content.indexOf("fourthQuarterData['") > -1) {
          addition = "type='" + type + "' special='fourthQuarter'";
        } else {
        }
        div +=
          "<debug report='dataSet' dg-id='" +
          processed +
          "' " +
          addition +
          '></debug>';
      }
      div += '</div>';
      return div;
    };
    $scope.getDebugId = function(id) {
      return $scope.debugData[id];
    };
    $scope.Int = function(val) {
      return parseFloat(val).toFixed(0);
    };
    //Renders html report to with the coded data elements and setting up for downloading data
    function performRender(html, dataElements) {
      var inputRegEx = /<input (.*?)>/g;
      var match = null;
      var newHtml = html;
      //Render inputs
      while ((match = inputRegEx.exec(html)) !== null) {
        //var idRegEx = /id="(.*?)-(.*?)-val"/;

        var idMacth = null;
        if ((idMacth = /id="(.*?)-(.*?)-val"/.exec(match[0])) !== null) {
          var isValidAggregate = true;
          var isDate = false;
          var isLast = false;
          var isAverage = false;
          dataElements.forEach(function(dataElement) {
            if (
              dataElement.id == idMacth[1] &&
              (dataElement.valueType == 'DATE' ||
                dataElement.valueType == 'TEXT' ||
                dataElement.aggregationType == 'LAST')
            ) {
              isValidAggregate = false;
              if (dataElement.valueType == 'DATE') {
                isDate = true;
              } else if (dataElement.aggregationType == 'AVERAGE') {
                isAverage = true;
              } else if (dataElement.aggregationType == 'LAST') {
                isLast = true;
              }
            }
            if (
              dataElement.id == idMacth[1] &&
              dataElement.aggregationType == 'AVERAGE' &&
              $scope.orgUnit.level != 3
            ) {
              isValidAggregate = false;
              isAverage = true;
            }
          });
          if (isValidAggregate) {
            if (match[0].indexOf('lastMonthOfQuarter') > -1) {
              //If it is last month of quarter
              newHtml = newHtml.replace(
                match[0],
                $scope.getElementReplacment(
                  "lastMonthOfQuarterData['" +
                    idMacth[1] +
                    '.' +
                    idMacth[2] +
                    "']",
                  'dataElement'
                )
              );
              $scope.lastMonthOfQuarter.push(idMacth[1] + '.' + idMacth[2]);
            } else if (match[0].indexOf('fourthQuarter') > -1) {
              //If it is last month of quarter
              var label = '<div>';
              if (match[0].indexOf('integer') > -1) {
                //label = "<label integer >";
              }
              newHtml = newHtml.replace(
                match[0],
                $scope.getElementReplacment(
                  "fourthQuarterData['" + idMacth[1] + '.' + idMacth[2] + "']",
                  'dataElement'
                )
              );
              $scope.fourthQuarter.push(idMacth[1] + '.' + idMacth[2]);
            } else if (match[0].indexOf('cumulative-to-date') > -1) {
              //If it is last month of quarter
              var label = '<div>';
              /*newHtml = newHtml.replace(
                match[0],
                $scope.getElementReplacment(
                  "cumulativeToDateData['" +
                    idMacth[1] +
                    '.' +
                    idMacth[2] +
                    "']",
                  'dataElement'
                )
              );*/
                newHtml = newHtml.replace(
                    match[0],
                    "<div>{{cumulativeToDateData['" +
                    idMacth[1] +
                    '.' +
                    idMacth[2] +
                    "'] | toDecimal  | removeNaN |comma}}</div>"
                );
              $scope.cumulativeToDate.push(idMacth[1] + '.' + idMacth[2]);
            } else if (match[0].indexOf('list-by-ward') > -1) {
              //If it is last month of quarter
              newHtml = newHtml.replace(
                match[0],
                '<div list-by-ward=\'listByWardData["' +
                  idMacth[1] +
                  '.' +
                  idMacth[2] +
                  "\"]' org-unit='orgUnit'></div>"
              );
              $scope.listByWard.push(idMacth[1] + '.' + idMacth[2]);
            } else {
              //newHtml = newHtml.replace(match[0], $scope.getElementReplacment("dataElementsData['" + idMacth[1] + "." + idMacth[2] + "']", "dataElement"));
              if (match[0].indexOf('integer') > -1) {
                newHtml = newHtml.replace(
                  match[0],
                  '<div>{{dataElementsData["' +
                    idMacth[1] +
                    '.' +
                    idMacth[2] +
                    '"] |toDecimal |comma}}</div>'
                );
              } else {
                newHtml = newHtml.replace(
                  match[0],
                  '<div>{{dataElementsData["' +
                    idMacth[1] +
                    '.' +
                    idMacth[2] +
                    '"] |toDecimal |comma}}</div>'
                );
              }
              $scope.dataElements.push(idMacth[1] + '.' + idMacth[2]);
            }
          } else {
            if (isDate) {
              $scope.nonAggregatedDataElementsDate.push(
                idMacth[1] + '.' + idMacth[2]
              );
            } else if (isLast) {
              $scope.lastDataElements.push(idMacth[1] + '.' + idMacth[2]);
              newHtml = newHtml.replace(
                match[0],
                $scope.getElementReplacment(
                  "lastDataElementsData['" +
                    idMacth[1] +
                    '.' +
                    idMacth[2] +
                    "']",
                  'dataElement'
                )
              );
            } else if (match[0].indexOf('list-by-ward-choice') > -1) {
              //If it is last month of quarter
              var label =
                '<div list-by-ward=\'listByWardData["' +
                idMacth[1] +
                '.' +
                idMacth[2] +
                "\"]' org-unit='orgUnit'>";
              //
              if (match[0].indexOf('count') > -1) {
                newHtml = newHtml.replace(
                  match[0],
                  '<div list-by-ward=\'listByWardData["' +
                    idMacth[1] +
                    '.' +
                    idMacth[2] +
                    "\"]' count='true' org-unit='orgUnit'></div>"
                );
              } else {
                if (match[0].indexOf('choice') > -1) {
                  newHtml = newHtml.replace(
                    match[0],
                    '<div list-by-ward=\'listByWardData["' +
                      idMacth[1] +
                      '.' +
                      idMacth[2] +
                      "\"]' choice='true' org-unit='orgUnit'></div>"
                  );
                } else {
                  newHtml = newHtml.replace(
                    match[0],
                    '<div list-by-ward=\'listByWardData["' +
                      idMacth[1] +
                      '.' +
                      idMacth[2] +
                      "\"]' org-unit='orgUnit'></div>"
                  );
                }
              }
              $scope.listByWardChoice.push(idMacth[1] + '.' + idMacth[2]);
            } else if (match[0].indexOf('list-by-ward') > -1) {
              //If it is last month of quarter
              var label =
                '<div list-by-ward=\'listByWardData["' +
                idMacth[1] +
                '.' +
                idMacth[2] +
                "\"]' org-unit='orgUnit'>";
              //
              if (match[0].indexOf('count') > -1) {
                newHtml = newHtml.replace(
                  match[0],
                  '<div list-by-ward=\'listByWardData["' +
                    idMacth[1] +
                    '.' +
                    idMacth[2] +
                    "\"]' count='true' org-unit='orgUnit'></div>"
                );
              } else {
                if (match[0].indexOf('choice') > -1) {
                  newHtml = newHtml.replace(
                    match[0],
                    '<div list-by-ward=\'listByWardData["' +
                      idMacth[1] +
                      '.' +
                      idMacth[2] +
                      "\"]' choice='true' org-unit='orgUnit'></div>"
                  );
                } else {
                  newHtml = newHtml.replace(
                    match[0],
                    "<div style='display:none'>Yey</div><div list-by-ward='listByWardData[\"" +
                      idMacth[1] +
                      '.' +
                      idMacth[2] +
                      "\"]' org-unit='orgUnit'></div>"
                  );
                }
              }
              $scope.listByWard.push(idMacth[1] + '.' + idMacth[2]);
            } else {
              $scope.nonAggregatedDataElements.push(
                idMacth[1] + '.' + idMacth[2]
              );
            }
            newHtml = newHtml.replace(
              match[0],
              $scope.getElementReplacment(
                "dataElementsData['" + idMacth[1] + '.' + idMacth[2] + "']",
                'dataElement'
              )
            );
          }
        } else if (
          (idMacth = /id="indicator(.*?)"/.exec(match[0])) !== null ||
          (idMacth = /id="(.*?)-val"/.exec(match[0])) !== null
        ) {
          if (match[0].indexOf('fourthQuarter') > -1) {
            //If it is last month of quarter
            var label = '<div>';
            if (match[0].indexOf('integer') > -1) {
              label = '<label integer >';
            }
            newHtml = newHtml.replace(
              match[0],
              $scope.getElementReplacment(
                "fourthQuarterData['" + idMacth[1] + "']",
                'indicator'
              )
            );
            $scope.fourthQuarter.push(idMacth[1]);
          } else if (match[0].indexOf('lastMonthOfQuarter') > -1) {
            //If it is last month of quarter
            newHtml = newHtml.replace(
              match[0],
              $scope.getElementReplacment(
                "lastMonthOfQuarterData['" + idMacth[1] + "']",
                'dataElement'
              )
            );
            if (match[0].indexOf('ward-level') > -1) {
              $scope.wardLevelIndicator.push(idMacth[1]);
            }
            $scope.lastMonthOfQuarter.push(idMacth[1]);
          } else if (match[0].indexOf('cumulative-to-date') > -1) {
            //If it is last month of quarter
            if (
              match[0].indexOf('ward-level') > -1 &&
              ($scope.dataSet.id == 'QLoyT2aHGes' ||
                $scope.dataSet.id == 'oRJJ4PtC7M8')
            ) {
              newHtml = newHtml.replace(
                match[0],
                "<div>{{cumulativeToDateData['" +
                  idMacth[1] +
                  "'] | toDecimal | removeNaN |comma}}</div>"
              );
              $scope.cumulativeToDateWardLevel.push(idMacth[1]);
            } else {
              newHtml = newHtml.replace(
                match[0],
                "<div>{{cumulativeToDateData['" +
                  idMacth[1] +
                  "'] | toDecimal  | removeNaN |comma}}</div>"
              );
              $scope.cumulativeToDate.push(idMacth[1]);
            }
          } else if (match[0].indexOf('districtIndicator') > -1) {
            //If it is last month of quarter
            newHtml = newHtml.replace(
              match[0],
              "<div>{{districtIndicatorData['" +
                idMacth[1] +
                "'] | removeNaN |comma}}</div>"
            );
            $scope.districtIndicator.push(idMacth[1]);
          } else {
            if (match[0].indexOf('ward-level') > -1) {
              $scope.wardLevelIndicator.push(idMacth[1]);
            }
            if (match[0].indexOf('integer') > -1) {
              newHtml = newHtml.replace(
                match[0],
                '<div>{{dataElementsData["' +
                  idMacth[1] +
                  '"]| toDecimal |comma}}</div>'
              );
            } else {
              newHtml = newHtml.replace(
                match[0],
                '<div>{{dataElementsData["' +
                  idMacth[1] +
                  '"] |toDecimal |comma}}</div>'
              );
            }
            $scope.dataElements.push(idMacth[1]);
          }
        } else if (
          (idMacth = /dataelementid="(.*?)"/.exec(match[0])) !== null
        ) {
          if (match[0].indexOf('fourthQuarter') > -1) {
            //If it is last month of quarter
            var label = '<div>';
            if (match[0].indexOf('integer') > -1) {
              label = '<label integer >';
            }
            newHtml = newHtml.replace(
              match[0],
              $scope.getElementReplacment(
                "fourthQuarterData['" + idMacth[1] + "']",
                'dataElement'
              )
            );
            $scope.fourthQuarter.push(idMacth[1]);
          } else {
            if (match[0].indexOf('integer') > -1) {
              newHtml = newHtml.replace(
                match[0],
                '<div>{{Int(dataElementsData["' +
                  idMacth[1] +
                  '"])  | removeNaN |comma}}</div>'
              );
            } else {
              newHtml = newHtml.replace(
                match[0],
                '<div>{{dataElementsData["' +
                  idMacth[1] +
                  '"] |toDecimal | removeNaN |comma}}</div>'
              );
            }

            $scope.dataElements.push(idMacth[1]);
          }
        } else if (
          (idMacth = /lastindicator="(.*?)"/.exec(match[0])) !== null
        ) {
          $scope.lastIndicator.push(idMacth[1]);
          newHtml = newHtml.replace(
            match[0],
            "{{lastIndicatorData['" + idMacth[1] + "'] |comma}}"
          );
        } else if (
          (idMacth = /lastmonthindicator="(.*?)"/.exec(match[0])) !== null
        ) {
          $scope.lastMonthIndicator.push(idMacth[1]);
          newHtml = newHtml.replace(
            match[0],
            "{{lastMonthIndicatorData['" + idMacth[1] + "'] |comma}}"
          );
        } else {
          
        }
      }
      //Render autogrowing taables
      var autogrowingRegEx = /<tbody autogrowing(.*?)>/g;
      match = null;
      //Render inputs

      while ((match = autogrowingRegEx.exec(html)) !== null) {
        var autogrowingMacth = null;
        if ((autogrowingMacth = /config="(.*?)"/.exec(match[0])) !== null) {
          var config = eval('(' + autogrowingMacth[1] + ')');
          if (config.level) {
            if (config.level.indexOf($scope.orgUnit.level) > -1) {
              if ($scope.autogrowingPrograms[config.programId]) {
                $scope.autogrowingPrograms[
                  config.programId
                ].dataElements = $scope.autogrowingPrograms[
                  config.programId
                ].dataElements.concat(config.dataElements);
              } else {
                $scope.autogrowingPrograms[config.programId] = config;
                $scope.autogrowingPrograms[
                  config.programId
                ].dataElementsDetails = [];
                $scope.autogrowingPrograms[config.programId].data = [];
              }
              if (config.cumulativeToDate || config.fourthQuarter) {
                $scope.autogrowingPrograms[config.programId].otherData = [];
              }
              var directive = 'autogrowing';
              if ($routeParams.preview == 'debug') {
                directive =
                  "autogrowing-debug a-debug= '" + JSON.stringify(config) + "'";
              }
              newHtml = newHtml.replace(
                match[0],
                '<tbody ' +
                  directive +
                  ' config=\'autogrowingPrograms["' +
                  config.programId +
                  '"]\'></tbody>'
              );
            } else {
              newHtml = newHtml.replace(match[0], '');
            }
          } else {
            if ($scope.autogrowingPrograms[config.programId]) {
              $scope.autogrowingPrograms[
                config.programId
              ].dataElements = $scope.autogrowingPrograms[
                config.programId
              ].dataElements.concat(config.dataElements);
            } else {
              $scope.autogrowingPrograms[config.programId] = config;
              $scope.autogrowingPrograms[
                config.programId
              ].dataElementsDetails = [];
              $scope.autogrowingPrograms[config.programId].data = [];
            }
            if (config.cumulativeToDate || config.fourthQuarter) {
              $scope.autogrowingPrograms[config.programId].otherData = [];
            }
            var directive = 'autogrowing';
            if ($routeParams.preview == 'debug') {
              directive =
                "autogrowing-debug a-debug= '" + JSON.stringify(config) + "'";
            }
            var original = '';
            if (match[0].indexOf('original') > -1) {
              var og = 'og' + (Object.keys($scope.autogrowingOg).length + 1);
              $scope.autogrowingOg[og] = Object.assign({}, config);
              original = ' original=\'autogrowingOg["' + og + '"]\' ';
              directive = 'autogrowingsplit';
            }
            newHtml = newHtml.replace(
              match[0],
              '<tbody ' +
                directive +
                original +
                ' config=\'autogrowingPrograms["' +
                config.programId +
                '"]\'></tbody>'
            );
          }
        }
      }
      return newHtml;
    }
    //Rendering html to view
    $scope.renderHtml = function(html, dataElements) {
      $scope.dataElements = [];
      var newHtml = performRender(html, dataElements);
      return $sce.trustAsHtml(newHtml);
    };
    //Load dataset informatioin
    $scope.getPeriodName = function() {
      return ReportService.getPeriodName($routeParams.period);
    };

    //User fetching for access integrity
    $scope.user = {};
    $scope.finishDone = {
      completeness: false,
      rendering: false
    };
    $scope.completenessDone = function() {
      $scope.finishDone.completeness = true;
      $scope.checkFinish();
    };
    $scope.checkFinish = function() {
      if ($scope.finishDone.completeness && $scope.finishDone.rendering) {
        $timeout(function() {
          $window.document.title = 'Report Loaded';
        }, 1000);
      }
    };
    $http
      .get(
        DHIS2URL +
          'api/26/me.json?fields=:all,organisationUnits[id,level],userCredentials[userRoles[:all]]'
      )
      .then(function(results) {
        $scope.progressValue = 5;
        $scope.user = results.data;
        $http
          .get(
            DHIS2URL +
              'api/26/organisationUnits/' +
              $routeParams.orgUnit +
              '.json?fields=id,name,level,children[id,name,children[id,children[id]]]'
          )
          .then(
            function(results) {
              $scope.progressValue = 10;
              $scope.orgUnit = results.data;
              $scope.getDescendants().then(function(organisationUnits) {
                $scope.getReport().then(
                  function() {
                    var reportElement = document.getElementById('report');
                    $compile(reportElement.children)($scope);
                    $timeout(function() {
                      $scope.progressValue = 100;
                      $scope.loadingReport = false;
                      $.each($('td'), function() {
                        if (
                          !isNaN(
                            $(this)
                              .text()
                              .split(',')
                              .join('')
                          )
                        ) {
                          var text = $(this)
                            .text()
                            .toString();
                          var parts = text.split('.');
                          if (parts.length > 1) {
                            $(this).text(
                              parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
                                '.' +
                                parts[1]
                            );
                          } else {
                            $(this).text(
                              $(this)
                                .text()
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                            );
                          }
                          $(this).css('text-align', 'right');
                        }
                      });
                      $timeout(function() {
                        $scope.finishDone.rendering = true;
                        $scope.checkFinish();
                      }, 1000);
                    });
                  },
                  function(error) {
                    $scope.error = 'Hey';
                    toaster.pop(
                      'error',
                      'Error',
                      'Error Loading Data. Please try again.'
                    );
                  }
                );
              });
            },
            function(error) {
              toaster.pop(
                'error',
                'Error' + error.status,
                'Error Loading Organisation Unit.'
              );
            }
          );
      });

    //Request report creation
    $scope.createDataSetReport = function() {
      ReportService.createDataSetReport({
        orgUnit: $routeParams.orgUnit,
        period: $routeParams.period,
        dataSet: $routeParams.dataSet
      }).then(
        function() {
          toaster.pop(
            'success',
            'Report',
            'Report will be created during the night.'
          );
          $location.path(
            '/dataSetReport/reportRequest/dataSet/' +
              $routeParams.dataSet +
              '/orgUnit/' +
              $routeParams.orgUnit +
              '/period/' +
              $routeParams.period
          );
        },
        function() {
          toaster.pop(
            'error',
            'Error',
            'Error Loading Data. Please try again.'
          );
        }
      );
    };
    $scope.printReport = function() {
      browserPrint();
      //kendoPrint();
    };
  })
  .controller('CoverController', function(
    $scope,
    $location,
    $http,
    DHIS2URL,
    ReportService
  ) {
    var url = $location.$$url
      .replace('/dataSetReport', '')
      .replace('/report/', '')
      .replace('dataSet/', '')
      .replace('/orgUnit/', '/')
      .replace('/period/', '/')
      .split('/');
    $scope.dataSet = url[0];
    $scope.orgUnit = url[1];
    $scope.period = url[2];
    $scope.dataSetDetails = {};
    $scope.getPeriodName = function() {
      if ($scope.period.indexOf('July') > -1) {
        if ($scope.dataSet == 'OBnVfEenAuW') {
          return 'ANNUAL REPORT '; //(DR03) ";
        }
        if ($scope.dataSet == 'HhyM40b8ma1' || $scope.dataSet == 'VTDXKC9lwqZ') {
          return 'ANNUAL INTEGRATED REPORT ';
        }
      } else if ($scope.period.indexOf('Q') > -1) {
        if ($scope.dataSet == 'Znn30Q67yDO') {
          return 'QUARTERLY REPORT '; //(DR02) ";
        }
        if ($scope.dataSet == 'QLoyT2aHGes' || $scope.dataSet == 'oRJJ4PtC7M8') {
          return 'QUARTERLY INTEGRATED REPORT ';
        }
      } else {
        return 'MONTHLY REPORT '; //(DR01) ";
      }
    };
    $http
      .get(DHIS2URL + 'api/26/dataSets/' + $scope.dataSet + '.json')
      .then(function(result) {
        $scope.dataSetDetails = result.data;
        if ($scope.dataSetDetails.periodType == 'FinancialJuly') {
          if ($scope.period.indexOf('July') > -1) {
            $scope.periodString =
              'July ' +
              $scope.period.substr(0, 4) +
              ' - June ' +
              (parseInt($scope.period.substr(0, 4)) + 1);
          }
        } else if ($scope.dataSetDetails.periodType == 'Quarterly') {
          $scope.periodString = ReportService.getPeriodName($scope.period);
        } else if ($scope.dataSetDetails.periodType == 'Monthly') {
          $scope.periodString = ReportService.getPeriodName($scope.period);
        }
      });
    $scope.organisationUnit = {};
    $http
      .get(
        DHIS2URL +
          'api/26/organisationUnits/' +
          $scope.orgUnit +
          '.json?fields=name,level,parent[name,level]'
      )
      .then(function(result) {
        $scope.organisationUnit = result.data;
        $http
          .get(
            DHIS2URL +
              'api/26/organisationUnitLevels.json?filter=level:eq:' +
              result.data.level
          )
          .then(function(result) {
            $scope.organisationUnit.organisationUnitLevel =
              result.data.organisationUnitLevels[0];
          });
      });
    $scope.periodString = '';
  })
  .controller('CustomReportController', function(
    $scope,
    DHIS2URL,
    $http,
    $sce,
    $timeout,
    $location,
    ReportService,
    toaster
  ) {
    $scope.reportList = {};

    $scope.pageNumber = 1;
    $scope.pageSize = 50;
    $scope.pageCount = 0;

    $scope.alter = 'listAlternateRow';
    $scope.hover = [];
    $scope.click = [];

    $scope.goPrevPage = function(pageNumber, pageSize) {
      pageNumber -= 1;
      if (pageNumber < 1) {
        pageNumber = 1;
      }
      $scope.pageNumber = pageNumber;
      $scope.loadReports(pageNumber, pageSize);
    };

    $scope.goFirstPage = function() {
      $scope.pageNumber = 1;
      $scope.loadReports($scope.pageNumber, $scope.pageSize);
    };

    $scope.goNextPage = function(pageNumber, pageSize) {
      pageNumber += 1;
      if (pageNumber > $scope.pageCount) {
        pageNumber = $scope.pageCount;
      }
      $scope.pageNumber = pageNumber;
      $scope.loadReports(pageNumber, pageSize);
    };

    $scope.goLastPage = function() {
      $scope.pageNumber = $scope.pageCount;
      $scope.loadReports($scope.pageNumber, $scope.pageSize);
    };

    $scope.loadReports = function(pageNumber, pageSize) {
      $http
        .get(
          DHIS2URL +
            '/api/reports.json?fields=*&page=' +
            pageNumber +
            '&pageSize=' +
            pageSize
        )
        .then(function(result) {
          $scope.reportList = $scope.prepareReports(result);
        });
    };

    $scope.loadFilteredReports = function(filterName) {
      $http
        .get(
          DHIS2URL +
            '/api/reports.json?filter=name:ilike:' +
            filterName +
            '&fields=*'
        )
        .then(function(result) {
          $scope.reportList = $scope.prepareReports(result);
        });
    };

    $scope.filterReport = function(reportName) {
      if (reportName && reportName != '') {
        $scope.loadFilteredReports(reportName);
      } else {
        $scope.loadReports($scope.pageNumber, $scope.pageSize);
      }
    };

    $scope.clearFilter = function() {
      $scope.reportName = null;
    };

    $scope.addNewReport = function() {
      console.log('Adding new Report');
    };

    $scope.prepareReports = function(results) {
      $scope.pageCount = results.data.pager.pageCount;
      var data = results.data.reports;

      return data;
    };

    $scope.getClass = function(index) {
      if (index % 2 === 0) {
      } else {
        return '';
      }
      return $scope.alter;
    };

    /**
     * Change State of the table row on hover
     * */

    $scope.getHover = function(index) {
      $scope.hover = [];
      $scope.hover[index] = 'listHoverRow';
      return $scope.hover;
    };

    $scope.getClick = function(event, index) {
      localStorage.setItem(
        $scope.reportList[index].id,
        JSON.stringify($scope.reportList[index])
      );
      $scope.read = $scope.reportList[index].access.read;
      $scope.manage = $scope.reportList[index].access.manage;
      $scope.write = $scope.reportList[index].access.write;
      $scope.update = $scope.reportList[index].access.update;
      $scope.delete = $scope.reportList[index].access.delete;
      $scope.externalize = $scope.reportList[index].access.externalize;
      $scope.currentReport = $scope.reportList[index];
      dhis2.contextmenu.makeContextMenu({
        menuId: 'contextMenu',
        menuItemActiveClass: 'contextMenuItemActive',
        listItemProps: ['id', 'uid', 'name', 'type', 'report-type']
      });

      return $scope.click;
    };

    $scope.loadGetReportParamForm = function(currentReport) {
      console.log(currentReport);
    };

    $scope.loadReports($scope.pageNumber, $scope.pageSize);
  })
  .controller('CreateCustomReportController', function(
    $scope,
    DHIS2URL,
    $http,
    $sce,
    $timeout,
    $routeParams,
    $location,
    ReportService,
    toaster
  ) {
    $scope.reportUid = $routeParams.uid;
    $scope.report = localStorage.getItem($scope.reportUid)
      ? eval('(' + localStorage.getItem($scope.reportUid) + ')')
      : null;
    $scope.reportPeriod = null;
    dhis2.report = ReportService.dhis2.report;

    $scope.data = {
      selectedOrgUnit: undefined,
      config: {},
      archive: undefined,
      report: [],
      period: '',
      periodTypes: ReportService.periodTypes
    };

    $scope.currentDate = new Date();

    $scope.loadingArchive = false;

    $scope.getReportPeriodType = function() {
      var periodType = 'FinancialJuly';
      if ($scope.report) {
        var relativePeriods = $scope.report.relativePeriods;

        angular.forEach(relativePeriods, function(periodStatus, periodTypes) {
          if (periodStatus) {
            periodType = periodTypes;
          }
        });
      }

      if (periodType == 'thisYear') {
        periodType = 'FinancialJuly';
      }

      if (periodType == 'thisMonth') {
        periodType = 'Monthly';
      }
      if (periodType == 'thisQuarter') {
        periodType = 'Quarterly';
      }

      return periodType;
    };

    $scope.renderCustomReport = function(reportUid) {
      $location.path('/customReport/' + reportUid + '/render');
    };

    $scope.periodType = $scope.getReportPeriodType();

    $scope.data.periodTypes[$scope.periodType].populateList();

    $scope.$watch('data.selectedOrgUnit', function(selectedOrgUnit) {
      if (selectedOrgUnit) {
        ReportService.prepareOrganisationUnit(selectedOrgUnit);
        ReportService.prepareOrganisationUnitHierarchy(
          selectedOrgUnit,
          $scope.data.organisationUnits
        );

        dhis2.report = ReportService.dhis2.report;

        localStorage.setItem('dhis2', JSON.stringify(dhis2));
      }
    });

    ReportService.getUser().then(function(results) {
      var orgUnitIds = [];
      results.organisationUnits.forEach(function(orgUnit) {
        orgUnitIds.push(orgUnit.id);
      });
      $http
        .get(
          DHIS2URL +
            'api/26/organisationUnits.json?filter=id:in:[' +
            orgUnitIds +
            ']&fields=id,name,level,children[id,name,level,children[id,name,level,children[id,name,level,children[id,name,level,children]]]]'
        )
        .then(
          function(results) {
            $scope.data.organisationUnits = results.data.organisationUnits;
            $scope.data.organisationUnits.forEach(function(orgUnit) {
              ReportService.sortOrganisationUnits(orgUnit);
            });
          },
          function(error) {
            $scope.data.organisationUnits = [];
            toaster.pop(
              'error',
              'Error' + error.status,
              'Error Loading Organisation Units. Please try again'
            );
          }
        );
    });

    if ($location.path().indexOf('render') >= 0) {
      $scope.$on('$viewContentLoaded', function(event) {
        dhis2 = eval('(' + localStorage.getItem('dhis2') + ')');
        var renderedReport = ReportService.getRenderedReport($scope.reportUid);
        $scope.renderedReport = $sce.trustAsHtml(renderedReport.designContent);
      });
    }
  })
  .controller('NewCustomReportController', function(
    $scope,
    DHIS2URL,
    $http,
    $sce,
    $timeout,
    $location,
    ReportService,
    toaster
  ) {
    ///customReport/new
  })
  .controller('SubmissionStatusReportController', function(
    $scope,
    DHIS2URL,
    $http,
    $sce,
    $timeout,
    $location,
    ReportService,
    toaster
  ) {
    //
    //$scope.reportUid = $routeParams.uid;
    //$scope.report  = localStorage.getItem($scope.reportUid)?eval('('+localStorage.getItem($scope.reportUid)+')'):null;
    //$scope.reportPeriod = null;
    //dhis2.report = ReportService.dhis2.report;

    $scope.data = {
      selectedOrgUnit: undefined,
      config: {},
      archive: undefined,
      report: [],
      period: '',
      periodTypes: ReportService.periodTypes
    };

    $scope.$watch('data.selectedOrgUnit', function(selectedOrgUnit) {
      if (selectedOrgUnit) {
      }
    });

    ReportService.getUser().then(function(results) {
      var orgUnitIds = [];
      results.organisationUnits.forEach(function(orgUnit) {
        orgUnitIds.push(orgUnit.id);
      });
      $http
        .get(
          DHIS2URL +
            'api/26/organisationUnits.json?filter=id:in:[' +
            orgUnitIds +
            ']&fields=id,name,level,children[id,name,level,children[id,name,level,children[id,name,level,children[id,name,level,children]]]]'
        )
        .then(
          function(results) {
            $scope.data.organisationUnits = results.data.organisationUnits;
            $scope.data.organisationUnits.forEach(function(orgUnit) {
              ReportService.sortOrganisationUnits(orgUnit);
            });
          },
          function(error) {
            $scope.data.organisationUnits = [];
            toaster.pop(
              'error',
              'Error' + error.status,
              'Error Loading Organisation Units. Please try again'
            );
          }
        );
    });

    //
    //if ( $location.path().indexOf('render') >=0 ) {
    //
    //    $scope.$on('$viewContentLoaded', function(event) {
    //        dhis2 = eval('('+localStorage.getItem('dhis2')+')');
    //        var renderedReport  = ReportService.getRenderedReport($scope.reportUid);
    //        console.log(renderedReport.designContent);
    //        $scope.renderedReport  = $sce.trustAsHtml(renderedReport.designContent);
    //    });
    //
    //
    //}
  })
  .controller('DataApprovalController', function(
    $scope,
    DHIS2URL,
    $http,
    $sce,
    $timeout,
    $location,
    ReportService,
    toaster
  ) {
    //
    //$scope.reportUid = $routeParams.uid;
    //$scope.report  = localStorage.getItem($scope.reportUid)?eval('('+localStorage.getItem($scope.reportUid)+')'):null;
    //$scope.reportPeriod = null;
    //dhis2.report = ReportService.dhis2.report;

    $scope.data = {
      selectedOrgUnit: undefined,
      config: {},
      archive: undefined,
      report: [],
      period: '',
      periodTypes: ReportService.periodTypes
    };

    $scope.$watch('data.selectedOrgUnit', function(selectedOrgUnit) {
      if (selectedOrgUnit) {
      }
    });

    ReportService.getUser().then(function(results) {
      var orgUnitIds = [];
      results.organisationUnits.forEach(function(orgUnit) {
        orgUnitIds.push(orgUnit.id);
      });
      $http
        .get(
          DHIS2URL +
            'api/26/organisationUnits.json?filter=id:in:[' +
            orgUnitIds +
            ']&fields=id,name,level,children[id,name,level,children[id,name,level,children[id,name,level,children[id,name,level,children]]]]'
        )
        .then(
          function(results) {
            $scope.data.organisationUnits = results.data.organisationUnits;
            $scope.data.organisationUnits.forEach(function(orgUnit) {
              ReportService.sortOrganisationUnits(orgUnit);
            });
          },
          function(error) {
            $scope.data.organisationUnits = [];
            toaster.pop(
              'error',
              'Error' + error.status,
              'Error Loading Organisation Units. Please try again'
            );
          }
        );
    });

    //
    //if ( $location.path().indexOf('render') >=0 ) {
    //
    //    $scope.$on('$viewContentLoaded', function(event) {
    //        dhis2 = eval('('+localStorage.getItem('dhis2')+')');
    //        var renderedReport  = ReportService.getRenderedReport($scope.reportUid);
    //        console.log(renderedReport.designContent);
    //        $scope.renderedReport  = $sce.trustAsHtml(renderedReport.designContent);
    //    });
    //
    //
    //}
  })
  .controller('AggregationController', function(
    $scope,
    $interval,
    DHIS2URL,
    $http,
    $sce,
    $timeout,
    $location,
    ReportService,
    toaster
  ) {
    //get the data estimation status
    $scope.show_estimation_box = false;
    $scope.pull_updates = true;
    $scope.agrigation_is_run = false;
    $scope.reports_done = 'no';
    //$http.get(DHIS2URL + 'api/dataStore/estimation/status').success(function(analytics_response){
    //    if(analytics_response.is_running = "Yes"){
    //        $scope.show_estimation_box = true;
    //        $scope.pull_updates = true;
    //        $interval(function() {
    //            if($scope.pull_updates) {
    //                $http.get(DHIS2URL + 'api/dataStore/estimation/status').success(function (analytics_result) {
    //                    $scope.activities = analytics_result;
    //                    if(analytics_result.is_running = "No"){
    //                        $scope.pull_updates = false;
    //                    }
    //                })
    //
    //                $http.get(DHIS2URL + 'api/system/tasks/ANALYTICSTABLE_UPDATE').success(function (analytics_status) {
    //                    $scope.analytics_activities = analytics_status;
    //                })
    //            }
    //        }, 2000);
    //    }else{
    //        $scope.show_estimation_box = false;
    //        $scope.pull_updates = false;
    //    }
    //});

    $scope.startAggregation = function() {
      $scope.agrigation_is_run = true;
      $scope.reports_done = 'yes';
      var today = new Date();
      var date =
        today.getFullYear() +
        '-' +
        (today.getMonth() + 1) +
        '-' +
        today.getDate();
      var time =
        today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
      var dateTime = date + ' ' + time;
      var status_response = {
        is_running: 'No',
        is_needed: 'Yes',
        status: 'waiting',
        activities: [
          {
            date: dateTime,
            action: 'Starting Agregation process'
          }
        ]
      };

      //if($scope.show_estimation_box){
      //
      //}else{
      $http
        .put(DHIS2URL + 'api/26/dataStore/estimation/status', status_response)
        .then(function(results) {
          $http
            .get(DHIS2URL + 'api/dataStore/estimation/status')
            .success(function(analytics_response) {
              $scope.activities = analytics_response;
            });
          $interval(function() {
            $http
              .get(
                DHIS2URL +
                  'api/dataStore/estimation/status?' +
                  Math.floor(Math.random() * 10000000000 + 1)
              )
              .success(function(analytics_response) {
                $scope.activities = analytics_response;
                if ((analytics_response.is_running = 'No')) {
                  $scope.pull_updates = false;
                }
                if ((analytics_response.status = 'done')) {
                  $scope.agrigation_fineshed = true;
                }
              });

            $http
              .get(
                DHIS2URL +
                  'api/system/tasks/ANALYTICS_TABLE?' +
                  Math.floor(Math.random() * 10000000000 + 1)
              )
              .success(function(analytics_status) {
                $scope.analytics_activities = analytics_status;
              });
          }, 2000);
        });
    };

    //}
  })
  .controller('StaticTableDebugController', function(
    $scope,
    DHIS2URL,
    $http,
    $window
  ) {
    var subscription;
    $scope.logs = [];
    $scope.isProcessActive = true;
    $scope.periods = [];
    $scope.reportPeriod = `${new Date().getFullYear() - 1}July`;
    var subscription = subscription || null;

    $http
      .get(DHIS2URL + 'api/dataStore/ardsStaticTable/status')
      .success(function(response) {
        $scope.logs = response.logs;
        $scope.isProcessActive = response.isProcessActive;
        var startPeriod = response.startPeriod;
        getPeriods(startPeriod);
        checkingStatus();
      });

    function getPeriods(startPeriod) {
      $scope.periods = [];
      var maxIterationCount = new Date().getFullYear() - startPeriod;
      var periods = [];
      for (var i = 0; i < maxIterationCount; i++) {
        var year = startPeriod + i;
        periods = [
          ...periods,
          { name: `${year} July - ${year + 1} June`, value: `${year}July` }
        ];
      }
      $scope.periods = periods.reverse();
    }

    $scope.cancelStaticTableGeneration = function() {
      $scope.isProcessActive = false;
      $http
        .get(DHIS2URL + 'api/dataStore/ardsStaticTable/status')
        .success(function(response) {
          $scope.isProcessActive = false;
          response = {
            ...response,
            reportPeriod: '',
            shouldStart: false,
            isProcessActive: $scope.isProcessActive
          };
          if (subscription) {
            clearInterval(subscription);
          }
          $http
            .put(DHIS2URL + 'api/dataStore/ardsStaticTable/status', response)
            .then(function(results) {});
        });
    };

    $scope.startStaticTableGeneration = function() {
      $http
        .get(DHIS2URL + 'api/dataStore/ardsStaticTable/status')
        .success(function(response) {
          response = {
            ...response,

            reportPeriod: $scope.reportPeriod,
            shouldStart: true
          };
          startProcess(response);
        });
    };

    function checkingStatus() {
      subscription = setInterval(function() {
        $http
          .get(DHIS2URL + 'api/dataStore/ardsStaticTable/status')
          .success(function(response) {
            $scope.logs = response.logs;
            $scope.isProcessActive = response.isProcessActive;
          });
      }, 2000);
    }

    $scope.backToStatictTableList = function() {
      if (subscription) {
        clearInterval(subscription);
      }
      $window.location.href = '#/staticTable';
    };

    function startProcess(data) {
      $http
        .put(DHIS2URL + 'api/dataStore/ardsStaticTable/status', data)
        .then(function(results) {
          if (!subscription) {
            checkingStatus();
          }
        });
    }
  })

  .controller('StaticTableController', function(
    $scope,
    $interval,
    DHIS2URL,
    $http,
    $window
  ) {
    $scope.showCrops = false;
    $scope.showLivestock = false;
    $scope.showAnimalProducts = false;
    $scope.cropsList = [
      {
        name: '1.1 Cereals',
        groupItems: [
          {
            name: 'Maize',
            url: 'crop-production'
          },
          {
            name: 'Paddy',
            url: 'crop-production'
          },
          {
            name: 'Sorghum',
            url: 'crop-production'
          },
          {
            name: 'Bulrush Millet',
            url: 'crop-production'
          },
          {
            name: 'Finger Millet',
            url: 'crop-production'
          },
          {
            name: 'Wheat',
            url: 'crop-production'
          },
          {
            name: 'Barley',
            url: 'crop-production'
          }
        ]
      },
      {
        name: '1.2 Roots and Tubers',
        groupItems: [
          {
            name: 'Cassava',
            url: 'crop-production'
          },
          {
            name: 'Sweet Potato',
            url: 'crop-production'
          },
          {
            name: 'Irish Potato',
            url: 'crop-production'
          },
          {
            name: 'Yam',
            url: 'crop-production'
          },
          {
            name: 'Coco Yam',
            url: 'crop-production'
          }
        ]
      },
      {
        name: '1.3 Industrial Crops',
        groupItems: [
          {
            name: 'Seed Cotton',
            url: 'crop-production'
          },
          {
            name: 'Tobacco',
            url: 'crop-production'
          },
          {
            name: 'Coffee',
            url: 'crop-production'
          },
          {
            name: 'Tea',
            url: 'crop-production'
          },
          {
            name: 'Pyrethrum',
            url: 'crop-production'
          },
          {
            name: 'Cocoa',
            url: 'crop-production'
          },
          {
            name: 'Rubber',
            url: 'crop-production'
          },
          {
            name: 'Wattle',
            url: 'crop-production'
          },
          {
            name: 'Sugar Cane',
            url: 'crop-production'
          },
          {
            name: 'Jute',
            url: 'crop-production'
          },
          {
            name: 'Sisal',
            url: 'crop-production'
          },
          {
            name: 'Cashewnut',
            url: 'crop-production'
          }
        ]
      },
      {
        name: '1.4 Oil Crops',
        groupItems: [
          {
            name: 'Sunflower',
            url: 'crop-production'
          },
          {
            name: 'Simsim/ Sesame',
            url: 'crop-production'
          },
          {
            name: 'Groundnut',
            url: 'crop-production'
          },
          {
            name: 'Palm oil',
            url: 'crop-production'
          },
          {
            name: 'Coconut',
            url: 'crop-production'
          },
          {
            name: 'Soya Bean',
            url: 'crop-production'
          },
          {
            name: 'Castor Oil Seed',
            url: 'crop-production'
          },
          {
            name: 'Jatropha',
            url: 'crop-production'
          }
        ]
      },
      {
        name: '1.5 Pulse',
        groupItems: [
          {
            name: 'Cow Pea (Kunde)',
            url: 'crop-production'
          },
          {
            name: 'Green/Black (Choroko)',
            url: 'crop-production'
          },
          {
            name: 'Garden Pea (Njegere)',
            url: 'crop-production'
          },
          {
            name: 'Chick Pea/ Lenti (Dengu)',
            url: 'crop-production'
          },
          {
            name: 'Bambara Nut (Njugu mawe)',
            url: 'crop-production'
          },
          {
            name: 'Bean (Maharage)',
            url: 'crop-production'
          },
          {
            name: 'Pigeon Pea (Mbaazi)',
            url: 'crop-production'
          },
          {
            name: 'Gwara (Lablab bean)',
            url: 'crop-production'
          }
        ]
      },
      {
        name: '1.6 Spices',
        groupItems: [
          {
            name: 'Ginger (Tangawizi)',
            url: 'crop-production'
          },
          {
            name: 'Black pepper (Pilipili manga)',
            url: 'crop-production'
          },
          {
            name: 'Coriander (Giligilani)',
            url: 'crop-production'
          },
          {
            name: 'Cinnamon (Mdalasini)',
            url: 'crop-production'
          },
          {
            name: 'Turmeric (Binzari)',
            url: 'crop-production'
          },
          {
            name: 'Vanilla',
            url: 'crop-production'
          },
          {
            name: 'Chili pepper (Pilipili kali)',
            url: 'crop-production'
          },
          {
            name: 'Clove (Karafuu)',
            url: 'crop-production'
          },
          {
            name: 'Garlic (Vitunguu swaumu)',
            url: 'crop-production'
          },
          {
            name: 'Cardamon (Iliki)',
            url: 'crop-production'
          },
          {
            name: 'Paprika',
            url: 'crop-production'
          }
        ]
      },
      {
        name: '1.7 Vegetables',
        groupItems: [
          {
            name: 'Amaranthus (Mchicha)',
            url: 'crop-production'
          },
          {
            name: 'Mashroom (Uyoga)',
            url: 'crop-production'
          },
          {
            name: 'Cauliflower',
            url: 'crop-production'
          },
          {
            name: 'Cabbage',
            url: 'crop-production'
          },
          {
            name: 'Spinach',
            url: 'crop-production'
          },
          {
            name: 'Chinese cabbage',
            url: 'crop-production'
          },
          {
            name: 'Tomato',
            url: 'crop-production'
          },
          {
            name: 'Eggplant (Biringanya)',
            url: 'crop-production'
          },
          {
            name: 'Onion',
            url: 'crop-production'
          },
          {
            name: 'Sweet pepper (Pilipili hoho)',
            url: 'crop-production'
          },
          {
            name: 'Carrot',
            url: 'crop-production'
          },
          {
            name: 'African eggplant (Nyanya Chungu)',
            url: 'crop-production'
          },
          {
            name: 'Black night shade (Mnafu)',
            url: 'crop-production'
          },
          {
            name: 'Kale (Figiri)',
            url: 'crop-production'
          },
          {
            name: 'Leek',
            url: 'crop-production'
          },
          {
            name: 'Swiss chard (Saladi)',
            url: 'crop-production'
          },
          {
            name: 'Okra (Bamia)',
            url: 'crop-production'
          },
          {
            name: 'Cucumber (Matango)',
            url: 'crop-production'
          }
        ]
      },
      {
        name: '1.8 Fruits',
        groupItems: [
          {
            name: 'Sweet banana',
            url: 'crop-production'
          },
          {
            name: 'Banana (Plaintain)',
            url: 'crop-production'
          },
          {
            name: 'Mango',
            url: 'crop-production'
          },
          {
            name: 'Pawpaw',
            url: 'crop-production'
          },
          {
            name: 'Orange',
            url: 'crop-production'
          },
          {
            name: 'Tangerine (Machenza)',
            url: 'crop-production'
          },
          {
            name: 'Guava (Mapera)',
            url: 'crop-production'
          },
          {
            name: 'Apple',
            url: 'crop-production'
          },
          {
            name: 'Pineapple',
            url: 'crop-production'
          },
          {
            name: 'Avocado(Parachichi)',
            url: 'crop-production'
          },
          {
            name: 'Water melon (Tikiti maji)',
            url: 'crop-production'
          },
          {
            name: 'Lemon (Limau)',
            url: 'crop-production'
          },
          {
            name: 'Lime (Ndimu)',
            url: 'crop-production'
          },
          {
            name: 'Plum (Tunda damu)',
            url: 'crop-production'
          },
          {
            name: 'Pear',
            url: 'crop-production'
          },
          {
            name: 'Passion fruit',
            url: 'crop-production'
          },
          {
            name: 'Grape (Zabibu)',
            url: 'crop-production'
          }
        ]
      },
      {
        name: '1.9 Flowers',
        groupItems: [
          {
            name: 'Rose',
            url: 'crop-production'
          },
          {
            name: 'Chrysanthemum',
            url: 'crop-production'
          },
          {
            name: 'Carnation',
            url: 'crop-production'
          },
          {
            name: 'Aster',
            url: 'crop-production'
          },
          {
            name: 'Gypsophyla',
            url: 'crop-production'
          },
          {
            name: 'Ginger rose',
            url: 'crop-production'
          },
          {
            name: 'Helianthus',
            url: 'crop-production'
          }
        ]
      },
      {
        name: '1.10 Others',
        groupItems: [
          {
            name: 'Rozella',
            url: 'crop-production'
          }
        ]
      }
    ];

    $scope.livestockList = [
      {
        name: 'Livestock',
        groupItems: [
          {
            name: 'Livestock Population',
            url: ''
          },
          {
            name: 'Livestock Slaughtered',
            url: ''
          }
        ]
      }
    ];

    $scope.animalProductsList = [
      {
        name: 'Animal Products',
        groupItems: [
          {
            name: 'Eggs',
            url: ''
          },
          {
            name: 'Milk',
            url: ''
          },
          {
            name: 'Hide and Skin',
            url: ''
          }
        ]
      }
    ];

    $scope.onToggleCropsVisibility = function(e) {
      if (e) {
        e.stopPropagation();
      }
      if ($scope.showCrops == true) {
        $scope.showCrops = false;
      } else {
        $scope.showCrops = true;
      }
    };

    $scope.onToggleLivestockVisibility = function(e) {
      if (e) {
        e.stopPropagation();
      }
      if ($scope.showLivestock == true) {
        $scope.showLivestock = false;
      } else {
        $scope.showLivestock = true;
      }
    };

    $scope.onToggleAnimalProductsVisibility = function(e) {
      if (e) {
        e.stopPropagation();
      }
      if ($scope.showAnimalProducts == true) {
        $scope.showAnimalProducts = false;
      } else {
        $scope.showAnimalProducts = true;
      }
    };

    $scope.downloadExcel = function(itemName, url) {
      if (url == '') {
        window.open(
          '../ards-report-archive/out-put-file/' +
            itemName
              .toLocaleLowerCase()
              .split(' ')
              .join('-') +
            '.xlsx',
          '_blank'
        );
      } else if (url !== '') {
        window.open(
          '../ards-report-archive/out-put-file/' +
            itemName
              .replace(/\//g, '-')
              .replace(/\)/g, '-')
              .replace(/\(/g, '-') +
            '.xlsx',
          '_blank'
        );
      }
    };

    $scope.date = new Date();

    $scope.currentYear = $scope.date.getFullYear();
  });
