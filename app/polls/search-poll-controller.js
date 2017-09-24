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

angular.module('poll').controller('SearchPollFormCtrl',
    ['$scope', 'PollService', 'SessionStorageService', '$state', 'DTOptionsBuilder', 'isEnabledFilter',
        'DTColumnBuilder', 'searchTermFilter', '$compile', 'multiStepFormScope', '$validation', 'supplyFilter',
        'votingModelFilter', 'amountTQTFilter', '$q',
        function ($scope, PollService, SessionStorageService, $state, DTOptionsBuilder, isEnabledFilter,
                  DTColumnBuilder, searchTermFilter, $compile, multiStepFormScope, $validation, supplyFilter,
                  votingModelFilter, amountTQTFilter, $q) {

            $scope.searchPollForm = {};

            $scope.onSubmit = function () {
                $validation.validate($scope.searchPollForm);
                if ($scope.searchPollForm.$valid) {
                    $scope.$nextStep();
                }
            };

            $scope.searchPollForm = angular.copy(multiStepFormScope.searchPollForm);

            $scope.$on('$destroy', function () {
                multiStepFormScope.searchPollForm = angular.copy($scope.searchPollForm);
            });

            $scope.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers')
                .withDOM('frtip')
                .withOption('info', false)
                .withOption('ordering', false)
                .withOption('serverSide', true)
                .withDataProp('polls')
                .withOption('processing', true)
                .withOption('bFilter', false)
                .withOption('fnRowCallback',
                    function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                        $compile(nRow)($scope);
                    })
                .withOption('ajax', function (data, callback, settings) {
                    var query = $scope.searchPollForm.query;
                    var nameSearch = PollService.searchPolls(query);
                    var idSearch = PollService.getPoll(query);
                    $q.all([nameSearch, idSearch]).then(function (response) {
                        if (response[1].poll) {
                            response[0].polls = response[0].polls || [];
                            response[0].polls.push(response[1]);
                        }
                        callback({
                            'iTotalRecords': response[0].polls.length,
                            'iTotalDisplayRecords': response[0].polls.length,
                            'polls': response[0].polls
                        });
                    });
                })
                .withDisplayLength(10).withBootstrap();

            $scope.dtColumns = [

                DTColumnBuilder.newColumn('poll').withTitle('Details').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return '<button type="button" class="btn btn-success btn-sm" ng-controller="PollsMainCtrl"' +
                            ' ng-click="openPollDetailsModal(\'' + data +
                            '\')"> <i class="fa fa-reorder" aria-hidden="true"></i> </button>';

                    }),


                DTColumnBuilder.newColumn('name').withTitle('Name').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return data;
                    }),

                DTColumnBuilder.newColumn('votingModel').withTitle('Model').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return votingModelFilter(data);
                    }),

                DTColumnBuilder.newColumn('finished').withTitle('Finished').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return isEnabledFilter(data);
                    }),


                DTColumnBuilder.newColumn('poll').withTitle('Action').notSortable()
                    .renderWith(function (data, type, row, meta) {

                        var finished = false;

                        if (row.finished) {
                            finished = true;

                        }

                        var cast = '<button type="button" class="btn btn-default btn-sm" ng-controller="PollsMainCtrl"' +
                            ' ng-click="openCastVoteModal(\'' + data +
                            '\')" ng-disabled="' + finished + '"> <i class="fa fa-signal" aria-hidden="true"></i> </button>';

                        var result = '<button type="button" class="btn btn-default btn-sm" ng-controller="PollsMainCtrl"' +
                            ' ng-click="openPollData(\'' + data +
                            '\')"> <i class="fa fa-area-chart" aria-hidden="true"></i> </button>';

                        var votes = '<button type="button" class="btn btn-default btn-sm" ng-controller="PollsMainCtrl"' +
                            ' ng-click="openPollVotesModal(\'' + data +
                            '\')"  ng-disabled="' + finished + '"> <i class="fa fa-server" aria-hidden="true"></i> </button>';

                        return result + '&nbsp;' + cast + '&nbsp;' + votes;

                    }),


            ];

            $scope.dtInstanceCallback = function (_dtInstance) {
                $scope.dtInstance = _dtInstance;
            };
        }
    ])
;
