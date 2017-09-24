/******************************************************************************
 * Copyright © 2017 XIN Community                                             *
 *                                                                            *
 * See the DEVELOPER-AGREEMENT.txt and LICENSE.txt files at  the top-level    *
 * directory of this distribution for the individual copyright  holder        *
 * information and the developer policies on copyright and licensing.         *
 *                                                                            *
 * Unless otherwise agreed in a custom licensing agreement, no part of the    *
 * XIN software, including this file, may be copied, modified, propagated,    *
 * or distributed except according to the terms contained in the LICENSE.txt  *
 * file.                                                                      *
 *                                                                            *
 * Removal or modification of this copyright notice is prohibited.            *
 *                                                                            *
 ******************************************************************************/

angular.module('poll').controller('PollsMainCtrl',
    ['$scope', 'PollService', 'amountTQTFilter', 'timestampFilter', 'DTOptionsBuilder', 'DTColumnBuilder',
        '$uibModal', '$compile', 'baseConfig', 'supplyFilter', 'searchTermFilter',
        function ($scope, PollService, amountTQTFilter, timestampFilter, DTOptionsBuilder, DTColumnBuilder,
                  $uibModal, $compile, baseConfig, supplyFilter, searchTermFilter) {

            $scope.openCreatePollModal = function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'polls/modals/create-poll-form.html',
                    size: 'lg',
                    controller: 'PollsFormCtrl',
                    resolve: {
                        params: function () {
                            return {};
                        }
                    }
                });
            };

            $scope.openPollDetailsModal = function (poll) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'polls/modals/poll.html',
                    size: 'lg',
                    controller: 'PollCtrl',
                    windowClass: 'poll-modal-window',
                    resolve: {
                        params: function () {
                            return {
                                'pollId': poll,
                            };
                        }
                    }

                });
            };

            $scope.openPollVotesModal = function (poll) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'polls/modals/poll-votes.html',
                    size: 'lg',
                    controller: 'PollVotesCtrl',
                    windowClass: 'poll-modal-window',
                    resolve: {
                        params: function () {
                            return {
                                'pollId': poll,
                            };
                        }
                    }

                });
            };

            $scope.openPollData = function (pollId) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'polls/modals/poll-chart.html',
                    size: 'sm',
                    controller: 'PollChartCtrl',
                    windowClass: 'poll-result-modal-window',
                    resolve: {
                        params: function () {
                            return {
                                'pollId': pollId,
                            };
                        }
                    }

                });
            };

            $scope.openCastVoteModal = function (pollId) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'polls/modals/cast-vote-form.html',
                    size: 'lg',
                    controller: 'PollsFormCtrl',
                    resolve: {
                        params: function () {
                            return {
                                'pollId': pollId,
                            };
                        }
                    }
                });
            };

            $scope.openSearchPollModal = function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'polls/modals/search-poll-form.html',
                    size: 'lg',
                    controller: 'PollsFormCtrl',
                    resolve: {
                        params: function () {
                            return {};
                        }
                    }
                });
            };

        }]);

angular.module('poll').controller('PollsCtrl',
    ['$scope', 'PollService', 'DTOptionsBuilder', 'DTColumnBuilder', '$interval', '$uibModal', '$compile',
        'votingModelFilter', 'amountTQTFilter', 'isEnabledFilter', 'baseConfig', 'searchTermFilter', 'replaceQuotesFilter',
        'votingModelLabelFilter', 'SessionStorageService', 'pollDaysFilter',
        function ($scope, PollService, DTOptionsBuilder, DTColumnBuilder, $interval, $uibModal, $compile,
                  votingModelFilter, amountTQTFilter, isEnabledFilter, baseConfig, searchTermFilter, replaceQuotesFilter,
                  votingModelLabelFilter, SessionStorageService, pollDaysFilter) {


            $scope.includeFinished = true;

            $scope.activePolls = function () {
                $scope.includeFinished = false;
                $scope.reloadPolls();
            };

            $scope.allPolls = function () {
                $scope.includeFinished = true;
                $scope.reloadPolls();
            };

            $scope.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers')
                .withDOM('frtip')
                .withOption('info', false)
                .withOption('ordering', false)
                .withOption('serverSide', true)
                .withDataProp('polls')
                .withOption('processing', true)
                .withOption('ordering', false)
                .withOption('bFilter', false)
                .withOption('fnRowCallback',
                    function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                        $compile(nRow)($scope);
                    })
                .withOption('ajax', function (data, callback, settings) {
                    var endIndex = data.start + data.length - 1;
                    PollService.getPolls(data.start, endIndex, $scope.includeFinished).then(function (response) {
                        callback({
                            'iTotalRecords': 1000,
                            'iTotalDisplayRecords': 1000,
                            'polls': response.polls
                        });
                    });
                })
                .withDisplayLength(10).withBootstrap();

            $scope.dtColumns = [

                DTColumnBuilder.newColumn('poll').withTitle('Details').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return '<button type="button" class="btn btn-success btn-xs" ng-controller="PollsMainCtrl"' +
                            ' ng-click="openPollDetailsModal(\'' + data +
                            '\')"> <i class="fa fa-reorder" aria-hidden="true" style="width:15px;"></i> </button>';

                    }),

                DTColumnBuilder.newColumn('name').withTitle('Name').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return data;
                    }),
                DTColumnBuilder.newColumn('votingModel').withTitle('Model').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return votingModelLabelFilter(data);
                    }),
                DTColumnBuilder.newColumn('options').withTitle('Options').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return data.length;
                    }),
                DTColumnBuilder.newColumn('finished').withTitle('Finished').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return isEnabledFilter(data);
                    }),
                DTColumnBuilder.newColumn('finishHeight').withTitle('Height').notSortable(),

                DTColumnBuilder.newColumn('finishHeight').withTitle('Days').notSortable()
                    .renderWith(function (data, type, row, meta) {

                      var currentHeight = SessionStorageService.getFromSession(baseConfig.SESSION_CURRENT_BLOCK);
                      var days = 0;

                      if ( currentHeight && currentHeight <  data ) {
                        days =(parseInt(data) - currentHeight) / 1440;
                      } else {
                        days = 0;
                      }

                      if(days < 0){
                        days = 0;
                      }

                      return pollDaysFilter( days.toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}));
                    }),

                DTColumnBuilder.newColumn('poll').withTitle('Actions').notSortable()
                    .renderWith(function (data, type, row, meta) {

                        var finished = false;

                        if (row.finished) {
                            finished = true;

                        }

                        var tt_vote = ' popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover=' +
                            ' "Vote"';

                        var tt_result = ' popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover=' +
                            ' "Result"';

                        var tt_voter = ' popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover=' +
                            ' "Voters"';

                        var cast = '<button type="button" class="btn btn-default btn-xs"  ' + tt_vote + ' ng-controller="PollsMainCtrl"' +
                            ' ng-click="openCastVoteModal(\'' + data +
                            '\')" ng-disabled="' + finished + '"> <i class="fa fa-signal" aria-hidden="true" style="width:15px;"></i> </button>';

                        var chart = '<button type="button" class="btn btn-default btn-xs"  ' + tt_result + '  ng-controller="PollsMainCtrl"' +
                            ' ng-click="openPollData(\'' + data +
                            '\')"> <i class="fa fa-area-chart" aria-hidden="true" style="width:15px;"></i> </button>';

                        var votes = '<button type="button" class="btn btn-default btn-xs"  ' + tt_voter + ' ng-controller="PollsMainCtrl"' +
                            ' ng-click="openPollVotesModal(\'' + data +
                            '\')" ng-disabled="' + finished + '"> <i class="fa fa-user" aria-hidden="true" style="width:15px;"></i> </button>';

                        return chart + '&nbsp;' + cast + '&nbsp;' + votes;

                    }),

            ];

            $scope.dtInstanceCallback = function (_dtInstance) {
                $scope.dtInstance = _dtInstance;
            };
            $scope.reloadPolls = function () {
                if ($scope.dtInstance) {
                    $scope.dtInstance._renderer.rerender();
                }
            };

        }]);

angular.module('poll').controller('MyPollsCtrl',
    ['$scope', 'PollService', 'DTOptionsBuilder', 'DTColumnBuilder', '$interval', '$uibModal', '$compile',
        'votingModelFilter', 'amountTQTFilter', 'isEnabledFilter', 'baseConfig', 'CommonsService', 'searchTermFilter',
        'votingModelLabelFilter', 'pollDaysFilter', 'SessionStorageService',
        function ($scope, PollService, DTOptionsBuilder, DTColumnBuilder, $interval, $uibModal, $compile,
                  votingModelFilter, amountTQTFilter, isEnabledFilter, baseConfig, CommonsService, searchTermFilter,
                  votingModelLabelFilter, pollDaysFilter, SessionStorageService) {

            $scope.includeFinished = true;

            $scope.activePolls = function () {
                $scope.includeFinished = false;
                $scope.reloadPolls();
            };

            $scope.allPolls = function () {
                $scope.includeFinished = true;
                $scope.reloadPolls();
            };

            $scope.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers')
                .withDOM('frtip')
                .withOption('info', false)
                .withOption('serverSide', true)
                .withDataProp('polls')
                .withOption('processing', true)
                .withOption('ordering', false)
                .withOption('bFilter', false)
                .withOption('fnRowCallback',
                    function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                        $compile(nRow)($scope);
                    })
                .withOption('ajax', function (data, callback, settings) {
                    var endIndex = data.start + data.length - 1;
                    var account = CommonsService.getAccountDetailsFromSession('accountId');



                    PollService.getAccountPolls(account, data.start, endIndex, $scope.includeFinished).then(
                        function (response) {
                            callback({
                                'iTotalRecords': 1000,
                                'iTotalDisplayRecords': 1000,
                                'polls': response.polls
                            });
                        });
                })
                .withDisplayLength(10).withBootstrap();

            $scope.dtColumns = [

                DTColumnBuilder.newColumn('poll').withTitle('Details').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return '<button type="button" class="btn btn-success btn-xs" ng-controller="PollsMainCtrl"' +
                            ' ng-click="openPollDetailsModal(\'' + data +
                            '\')"> <i class="fa fa-reorder" aria-hidden="true" style="width:15px;"></i> </button>';
                    }),

                DTColumnBuilder.newColumn('name').withTitle('Name').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return data;
                    }),

                DTColumnBuilder.newColumn('votingModel').withTitle('Model').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return votingModelLabelFilter(data);
                    }),

                DTColumnBuilder.newColumn('options').withTitle('Options').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return data.length;
                    }),

                DTColumnBuilder.newColumn('finished').withTitle('Finished').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return isEnabledFilter(data);
                    }),

                DTColumnBuilder.newColumn('finishHeight').withTitle('Height').notSortable(),

                DTColumnBuilder.newColumn('finishHeight').withTitle('Days').notSortable()
                    .renderWith(function (data, type, row, meta) {

                      var currentHeight = SessionStorageService.getFromSession(baseConfig.SESSION_CURRENT_BLOCK);
                      var days = 0;

                      if ( currentHeight && currentHeight <  data ) {
                        days =(parseInt(data) - currentHeight) / 1440;
                      } else {
                        days = 0;
                      }

                      if(days < 0){
                        days = 0;
                      }

                      return pollDaysFilter( days.toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}));
                    }),




                DTColumnBuilder.newColumn('poll').withTitle('Actions').notSortable()
                    .renderWith(function (data, type, row, meta) {

                        var finished = false;

                        if (row.finished) {
                            finished = true;

                        }

                        var tt_vote = ' popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover=' +
                            ' "Vote"';

                        var tt_result = ' popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover=' +
                            ' "Result"';

                        var tt_voter = ' popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover=' +
                            ' "Voters"';

                        var cast = '<button type="button" class="btn btn-default btn-xs"  ' + tt_vote + ' ng-controller="PollsMainCtrl"' +
                            ' ng-click="openCastVoteModal(\'' + data +
                            '\')" ng-disabled="' + finished + '"> <i class="fa fa-signal" aria-hidden="true" style="width:15px;"></i> </button>';

                        var chart = '<button type="button" class="btn btn-default btn-xs"  ' + tt_result + ' ng-controller="PollsMainCtrl"' +
                            ' ng-click="openPollData(\'' + data +
                            '\')"> <i class="fa fa-area-chart" aria-hidden="true" style="width:15px;"></i> </button>';

                        var votes = '<button type="button" class="btn btn-default btn-xs"  ' + tt_voter + ' ng-controller="PollsMainCtrl"' +
                            ' ng-click="openPollVotesModal(\'' + data +
                            '\')" ng-disabled="' + finished + '"> <i class="fa fa-user" aria-hidden="true" style="width:15px;"></i> </button>';

                        return chart + '&nbsp;' + cast + '&nbsp;' + votes;

                    }),

            ];

            $scope.dtInstanceCallback = function (_dtInstance) {
                $scope.dtInstance = _dtInstance;
            };
            $scope.reloadPolls = function () {
                if ($scope.dtInstance) {
                    $scope.dtInstance._renderer.rerender();
                }
            };

        }]);

angular.module('poll').controller('PollsFormCtrl',
    ['$scope', '$uibModalInstance', 'params', function ($scope, $uibModalInstance, params) {

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.$on('close-modal', function () {
            $uibModalInstance.dismiss('cancel');
        });

        var createPollSteps = [
            {
                templateUrl: 'polls/modals/create-poll-details.html',
                title: 'Create Poll Step 1',
                controller: 'CreatePollFormController',
                isolatedScope: true,
                data: params,
            },
            {
                templateUrl: 'polls/modals/create-poll-details-2.html',
                title: 'Create Poll Step 2',
                controller: 'CreatePollFormController',
                isolatedScope: true,
                data: params,
            },

            {
                templateUrl: 'polls/modals/create-poll-confirm.html',
                title: 'Create Poll Confirmation',
                controller: 'CreatePollFormController',
                isolatedScope: true,
            },
        ];

        var castVoteSteps = [
            {
                templateUrl: 'polls/modals/cast-vote-details.html',
                title: 'Cast Vote Details',
                controller: 'CastVoteFormController',
                isolatedScope: true,
                data: params,
            },
            {
                templateUrl: 'polls/modals/cast-vote-confirm.html',
                title: 'Cast Vote Confirmation',
                controller: 'CastVoteFormController',
                isolatedScope: true,
            },
        ];

        var searchPollSteps = [
            {
                templateUrl: 'polls/modals/search-poll-details.html',
                title: 'Search Poll Details',
                controller: 'SearchPollFormCtrl',
                isolatedScope: true,
                data: params,
            },
            {
                templateUrl: 'polls/modals/search-poll-confirm.html',
                title: 'Search Poll Results',
                controller: 'SearchPollFormCtrl',
                isolatedScope: true,
            },
        ];

        $scope.steps = {};

        $scope.steps.createPollForm = createPollSteps;
        $scope.steps.castVoteForm = castVoteSteps;
        $scope.steps.searchPollForm = searchPollSteps;

    }]);

angular.module('poll').controller('PollCtrl',
    ['$scope', 'PollService', '$uibModalInstance', 'params',
        function ($scope, PollService, $uibModalInstance, params) {

            $scope.pollId = params.pollId;

            $scope.loadDetails = function () {
                PollService.getPoll($scope.pollId).then(function (response) {
                    $scope.poll = response;
                });
            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };

        }]
);

angular.module('poll').controller('PollVotesCtrl',
    ['$scope', 'PollService', 'DTOptionsBuilder', 'DTColumnBuilder', '$interval', '$uibModal', '$compile',
        'searchTermFilter', '$uibModalInstance', 'params',
        function ($scope, PollService, DTOptionsBuilder, DTColumnBuilder, $interval, $uibModal, $compile,
                  searchTermFilter,
                  $uibModalInstance, params) {

            $scope.pollId = params.pollId;

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };


            $scope.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers')
                .withDOM('frtip')
                .withOption('info', false)
                .withOption('serverSide', true)
                .withDataProp('votes')
                .withOption('processing', true)
                .withOption('ordering', false)
                .withOption('bFilter', false)
                .withOption('fnRowCallback',
                    function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                        $compile(nRow)($scope);
                    })
                .withOption('ajax', function (data, callback, settings) {
                    var endIndex = data.start + data.length - 1;
                    PollService.getPollVotes($scope.pollId, data.start, endIndex).then(function (response) {
                        callback({
                            'iTotalRecords': 1000,
                            'iTotalDisplayRecords': 1000,
                            'votes': response.votes
                        });
                    });
                })
                .withDisplayLength(5).withBootstrap();

            $scope.dtColumns = [

                DTColumnBuilder.newColumn('voterRS').withTitle('Voter').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return searchTermFilter(data);

                    }),
                DTColumnBuilder.newColumn('transaction').withTitle('Details').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return '<button type="button" class="btn btn-success btn-xs" ng-controller="SearchCtrl"' +
                            ' ng-click="searchValue(\'' + data + '\')">' +
                            '<i class="fa fa-list-ul" aria-hidden="true"></i>' + '</button>';
                    }),
            ];

        }]);

angular.module('poll').controller('PollChartCtrl',
    ['$scope', 'PollService', 'DTOptionsBuilder', 'DTColumnBuilder', '$compile', '$uibModalInstance', 'params',
        'baseConfig', 'numberStringFilter', '$q',
        function ($scope, PollService, DTOptionsBuilder, DTColumnBuilder, $compile, $uibModalInstance, params,
                  baseConfig, numberStringFilter, $q) {

            $scope.pollId = params.pollId;

            $scope.loadPollResults = function () {
                var pollDetailsPromise = PollService.getPoll($scope.pollId);
                var pollDataPromise = PollService.getPollData($scope.pollId);
                $q.all([pollDetailsPromise, pollDataPromise]).then(function (success) {
                    var pollDetailsResponse = success[0];
                    var pollDataResponse = success[1];

                    $scope.pollName = pollDetailsResponse.name;
                    $scope.pollDescription = pollDetailsResponse.description;
                    $scope.pollResults = pollDataResponse;
                    $scope.pollLabels = pollDataResponse.options;
                    var divisor = 1;
                    if (pollDataResponse.votingModel !== 0) {
                        divisor = baseConfig.TOKEN_QUANTS;
                    }
                    $scope.pollData = getPollData(pollDataResponse.options, pollDataResponse.results,divisor);
                    $scope.total = sumResults(pollDataResponse.results, divisor);
                    $scope.pollResultTableDate =
                        buildPollDataArray(pollDataResponse.options, pollDataResponse.results,
                            pollDataResponse.votingModel);
                });
            };

            function sumResults(results, divisor) {
                var sum = 0;
                for (var i = 0; i < results.length; i++) {
                    sum = sum + (results[i].result / divisor );
                }
                return sum;
            }

            function buildPollDataArray(labels, results, votingModel) {

                var divisor = 1;
                if (votingModel !== 0) {
                    divisor = baseConfig.TOKEN_QUANTS;
                }
                var finalResults = [];
                var total = sumResults(results, divisor);
                for (var i = 0; i < labels.length; i++) {
                    var result = {};
                    var pollResult = results[i];
                    result.optionName = labels[i];
                    result.result = pollResult.result / divisor || 0;
                    result.weight = pollResult.weight / divisor;

                    if (total !== 0) {
                        result.percentage = (result.result * 100) / total;
                    } else {
                        result.percentage = 0;
                    }
                    finalResults.push(result);
                }
                return finalResults;
            }


            function getPollData(labels, results,divisor) {
                var optionSize = results.length;
                var resultArray = [];
                for (var i = 0; i < optionSize; i++) {
                    var resultObject = {};
                    resultObject.key = labels[i];
                    resultObject.value = results[i].result / divisor;
                    if (!resultObject.value) {
                        resultObject.value = 0;
                    }
                    resultArray[i] = resultObject;
                }
                return resultArray;
            }

            $scope.options = {
                'chart': {
                    'type': 'pieChart',
                    'height': 350,
                    'showLegend': true,
                    'noData': 'No Votes',
                    'margin': {
                        'top': 30,
                        'right': 75,
                        'bottom': 50,
                        'left': 75
                    },
                    'bars': {
                        'forceY': [
                            0
                        ]
                    },
                    'bars2': {
                        'forceY': [
                            0
                        ]
                    },
  
                    'xAxis': {
                        'axisLabel': 'X Axis'
                    },
                    'x2Axis': {
                        'showMaxMin': false
                    },
                    'y1Axis': {
                        'axisLabel': 'Y1 Axis',
                        'axisLabelDistance': 12
                    },
                    'y2Axis': {
                        'axisLabel': 'Y2 Axis'
                    },
                    x: function (d) {
                        return d.key;
                    },
                    y: function (d) {
                        return d.value;
                    },
                    tooltip: {
                        valueFormatter: function (d) {
                            return numberStringFilter((d * 100 / $scope.total)) + ' %';
                        }
                    }

                }
            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };

        }]);
