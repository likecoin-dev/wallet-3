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

angular.module('account').controller('SearchAccountFormCtrl',
    ['$scope', 'AccountService', 'SessionStorageService', '$state', 'DTOptionsBuilder',
        'DTColumnBuilder', 'searchTermFilter', '$compile', 'multiStepFormScope', '$validation',
        function ($scope, AccountService, SessionStorageService, $state, DTOptionsBuilder,
                  DTColumnBuilder, searchTermFilter, $compile, multiStepFormScope, $validation) {

            $scope.searchAccountForm = {};

            $scope.onSubmit = function () {
                $validation.validate($scope.searchAccountForm);
                if ($scope.searchAccountForm.$valid) {
                    $scope.$nextStep();
                }
            };

            $scope.searchAccountForm = angular.copy(multiStepFormScope.searchAccountForm);

            $scope.$on('$destroy', function () {
                multiStepFormScope.searchAccountForm = angular.copy($scope.searchAccountForm);
            });

            $scope.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers')
                .withDOM('frtip')
                .withOption('serverSide', false)
                .withDataProp('accounts')
                .withOption('processing', true)
                .withOption('info', false)
                .withOption('paging', true)
                .withOption('ordering', false)
                .withOption('processing', true)
                .withOption('bFilter', false)
                .withOption('fnRowCallback',
                    function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                        $compile(nRow)($scope);
                    })
                .withOption('ajax', function (data, callback, settings) {

                    var query = multiStepFormScope.searchAccountForm.query;
                    AccountService.searchAccounts(query)
                        .then(function (response) {
                            callback({
                                'iTotalRecords': response.accounts.length,
                                'iTotalDisplayRecords': response.accounts.length,
                                'accounts': response.accounts
                            });
                        });
                })
                .withDisplayLength(10).withBootstrap();

            $scope.dtColumns = [

                DTColumnBuilder.newColumn('name').withTitle('Name').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return data;
                    }),

                DTColumnBuilder.newColumn('accountRS').withTitle('Account').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return searchTermFilter(data);
                    }),

                DTColumnBuilder.newColumn('accountRS').withTitle('Action').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return '<a href ng-click="openAddressBookModal(\'' + data + '\',\'' + row.name +
                            '\')" ng-controller="BaseCtrl">  <button ng-disabled="" class="btn btn-success btn-xs"> <i class="fa fa-plus" aria-hidden="true" style="width:15px;"></i> </button>   </a>';
                    }),

            ];
        }]);
