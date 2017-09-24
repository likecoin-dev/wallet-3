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

angular.module('currencies').controller('SearchCurrencyFormCtrl',
    ['$scope', 'CurrenciesService', 'SessionStorageService', '$state', 'DTOptionsBuilder',
        'DTColumnBuilder', 'searchTermFilter', '$compile', 'multiStepFormScope', '$validation', 'supplyFilter',
        'currencyModelFilter', '$q',
        function ($scope, CurrenciesService, SessionStorageService, $state, DTOptionsBuilder,
                  DTColumnBuilder, searchTermFilter, $compile, multiStepFormScope, $validation, supplyFilter,
                  currencyModelFilter, $q) {

            $scope.searchCurrencyForm = {};

            $scope.onSubmit = function () {
                $validation.validate($scope.searchCurrencyForm);
                if ($scope.searchCurrencyForm.$valid) {
                    $scope.$nextStep();
                }
            };

            $scope.searchCurrencyForm = angular.copy(multiStepFormScope.searchCurrencyForm);

            $scope.$on('$destroy', function () {
                multiStepFormScope.searchCurrencyForm = angular.copy($scope.searchCurrencyForm);
            });

            $scope.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers')
                .withDOM('frtip')
                .withOption('serverSide', false)
                .withDataProp('currencies')
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
                    var query = $scope.searchCurrencyForm.query;
                    var nameSearch = CurrenciesService.searchCurrencies(query);
                    var idSearch = CurrenciesService.getCurrencyById(query);
                    $q.all([nameSearch,idSearch]).then(function (response) {
                        if(response[1].currency){
                            response[0].currencies=response[0].currencies||[];
                            response[0].currencies.push(response[1]);
                        }
                        callback({
                            'iTotalRecords': response[0].currencies.length,
                            'iTotalDisplayRecords': response[0].currencies.length,
                            'currencies': response[0].currencies
                        });
                    });
                })
                .withDisplayLength(10).withBootstrap();

            $scope.dtColumns = [

                DTColumnBuilder.newColumn('code').withTitle('Ticker').notSortable()
                    .renderWith(function (data, type, row, meta) {

                        return data;
                    }),

                DTColumnBuilder.newColumn('accountRS').withTitle('Issuer').notSortable()
                    .renderWith(function (data, type, row, meta) {

                        return searchTermFilter(data);
                    }),

                DTColumnBuilder.newColumn('currency').withTitle('Action').notSortable()
                    .renderWith(function (data, type, row, meta) {

                        var details = '<button type="button" class="btn btn-default btn-sm" ng-controller="CurrenciesMainCtrl"' +
                            ' ng-click="openCurrencyDetailsModal(\'' + row.code + '\')">' +
                            ' <i class="fa fa-info-circle" aria-hidden="true"></i> ' + '</button>';


                        var trade = '<button type="button" class="btn btn-default btn-sm" ng-controller="CurrenciesMainCtrl"' +
                            ' ng-click="openTradeDesk(\'' + data +
                            '\',\'' + row.decimals + '\')">' +
                            ' <i class="fa fa-bar-chart" aria-hidden="true"></i> ' + '</button>';

                        return details + '&nbsp;' + trade;

                    }),

            ];

            $scope.dtInstanceCallback = function (_dtInstance) {
                $scope.dtInstance = _dtInstance;
            };
        }]);
