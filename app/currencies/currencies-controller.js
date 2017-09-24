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

angular.module('currencies').controller('CurrenciesMainCtrl',
    ['$scope', 'CurrenciesService', 'amountTQTFilter', 'timestampFilter', 'DTOptionsBuilder', 'DTColumnBuilder',
        '$uibModal', '$compile', 'baseConfig', 'supplyFilter', 'searchTermFilter', '$state',
        function ($scope, CurrenciesService, amountTQTFilter, timestampFilter, DTOptionsBuilder, DTColumnBuilder,
                  $uibModal, $compile, baseConfig, supplyFilter, searchTermFilter, $state) {

            $scope.openIssueCurrencyModal = function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'currencies/modals/issue-currency-form.html',
                    size: 'lg',
                    controller: 'CurrenciesFormCtrl',
                    resolve: {
                        params: function () {
                            return {};
                        }
                    }
                });
            };

            $scope.openDeleteCurrencyModal = function (currencyId, decimals, ticker) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'currencies/modals/delete-currency-form.html',
                    size: 'lg',
                    controller: 'CurrenciesFormCtrl',
                    resolve: {
                        params: function () {
                            return {
                                'currencyId': currencyId,
                                'decimals': decimals,
                                'ticker': ticker,
                            };
                        }
                    }
                });
            };

            $scope.openPublishExchangeOfferModal = function (currencyId, decimals, ticker) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'currencies/modals/publish-exchange-offer-form.html',
                    size: 'lg',
                    controller: 'CurrenciesFormCtrl',
                    resolve: {
                        params: function () {
                            return {
                                'currencyId': currencyId,
                                'decimals': decimals,
                                'ticker': ticker,
                            };
                        }
                    }
                });
            };

            $scope.openPublishExchangeBuyOfferModal = function (currencyId, decimals, ticker) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'currencies/modals/publish-exchange-buy-offer-form.html',
                    size: 'lg',
                    controller: 'CurrenciesFormCtrl',
                    resolve: {
                        params: function () {
                            return {
                                'currencyId': currencyId,
                                'decimals': decimals,
                                'ticker': ticker,
                            };
                        }
                    }
                });
            };

            $scope.openPublishExchangeSellOfferModal = function (currencyId, decimals, ticker) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'currencies/modals/publish-exchange-sell-offer-form.html',
                    size: 'lg',
                    controller: 'CurrenciesFormCtrl',
                    resolve: {
                        params: function () {
                            return {
                                'currencyId': currencyId,
                                'decimals': decimals,
                                'ticker': ticker,
                            };
                        }
                    }
                });
            };

            $scope.openCancelExchangeOfferModal = function (currencyId, typeOnly) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'currencies/modals/cancel-exchange-offer-form.html',
                    size: 'lg',
                    controller: 'CurrenciesFormCtrl',
                    resolve: {
                        params: function () {
                            return {
                                'currencyId': currencyId,
                                'typeOnly': typeOnly
                            };
                        }
                    }
                });
            };

            $scope.openCurrencyReserveClaimModal = function (currencyId, decimals, ticker) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'currencies/modals/currency-reserve-claim-form.html',
                    size: 'lg',
                    controller: 'CurrenciesFormCtrl',
                    resolve: {
                        params: function () {
                            return {
                                'currencyId': currencyId,
                                'decimals': decimals,
                                'ticker': ticker,
                            };
                        }
                    }
                });
            };

            $scope.openCurrencyReserveIncreaseModal = function (currencyId, decimals, ticker) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'currencies/modals/currency-reserve-increase-form.html',
                    size: 'lg',
                    controller: 'CurrenciesFormCtrl',
                    resolve: {
                        params: function () {
                            return {
                                'currencyId': currencyId,
                                'decimals': decimals,
                                'ticker': ticker,
                            };
                        }
                    }
                });
            };

            $scope.openBuyCurrencyModal = function (currencyId, decimals, ticker) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'currencies/modals/buy-currency-form.html',
                    size: 'lg',
                    controller: 'CurrenciesFormCtrl',
                    resolve: {
                        params: function () {
                            return {
                                'currencyId': currencyId,
                                'decimals': decimals
                            };
                        }
                    }
                });
            };

            $scope.openSellCurrencyModal = function (currencyId, decimals, ticker) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'currencies/modals/sell-currency-form.html',
                    size: 'lg',
                    controller: 'CurrenciesFormCtrl',
                    resolve: {
                        params: function () {
                            return {
                                'currencyId': currencyId,
                                'decimals': decimals
                            };
                        }
                    }
                });
            };

            $scope.openSearchCurrencyModal = function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'currencies/modals/search-currency-form.html',
                    size: 'lg',
                    controller: 'CurrenciesFormCtrl',
                    resolve: {
                        params: function () {
                            return {};
                        }
                    }
                });
            };

            $scope.openTransferCurrencyModal = function (currencyId, decimals, ticker) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'currencies/modals/transfer-currency-form.html',
                    size: 'lg',
                    controller: 'CurrenciesFormCtrl',
                    resolve: {
                        params: function () {
                            return {
                                'currencyId': currencyId,
                                'decimals': decimals,
                                'ticker': ticker,
                            };
                        }
                    }
                });
            };

            $scope.openSendCurrencyModal = function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'currencies/modals/send-currency-form.html',
                    size: 'lg',
                    controller: 'CurrenciesFormCtrl',
                    resolve: {
                        params: function () {
                            return {};
                        }
                    }
                });
            };

            $scope.openCurrencyDetailsModal = function (currencyId, decimals, ticker) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'currencies/modals/currency-details.html',
                    size: 'lg',
                    controller: 'CurrencyDetailsCtrl',
                    resolve: {
                        params: function () {
                            return {
                                'currencyId': currencyId,
                                'decimals': decimals,
                                'ticker': ticker,
                            };
                        }
                    }
                });
            };

            $scope.openTradeDesk = function (currencyId) {
                $state.go('client.signedin.currencies.trade', {currencyId: currencyId});
            };

        }]);

angular.module('currencies').controller('CurrenciesCtrl',
    ['$scope', 'CurrenciesService', 'amountTQTFilter', 'timestampFilter', 'DTOptionsBuilder', 'DTColumnBuilder',
        '$uibModal', '$compile', 'baseConfig', 'supplyFilter', 'searchTermFilter',
        function ($scope, CurrenciesService, amountTQTFilter, timestampFilter, DTOptionsBuilder, DTColumnBuilder,
                  $uibModal, $compile, baseConfig, supplyFilter, searchTermFilter) {

            $scope.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers')
                .withDOM('frtip')
                .withOption('info', false)
                .withOption('ordering', false)
                .withOption('serverSide', true)
                .withDataProp('currencies')
                .withOption('processing', true)
                .withOption('bFilter', false)
                .withOption('fnRowCallback',
                    function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                        $compile(nRow)($scope);
                    })
                .withOption('ajax', function (data, callback, settings) {
                    var endIndex = data.start + data.length - 1;
                    CurrenciesService.getCurrencies(data.start, endIndex).then(function (response) {
                        callback({
                            'iTotalRecords': 1000,
                            'iTotalDisplayRecords': 1000,
                            'currencies': response.currencies
                        });
                    });
                })
                .withDisplayLength(10).withBootstrap();

            $scope.dtColumns = [


                DTColumnBuilder.newColumn('currency').withTitle('Details').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return '<button type="button" class="btn btn-success btn-xs" ng-controller="SearchCtrl"' +
                            ' ng-click="searchValue(\'' + data + '\')">' +
                            '<i class="fa fa-list-ul" aria-hidden="true" style="width:15px;"></i>' + '</button>';

                    }),

                DTColumnBuilder.newColumn('code').withTitle('Ticker').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return '<a ng-click="openCurrencyDetailsModal(\'' + row.code +
                            '\')" ng-controller="CurrenciesMainCtrl"> ' + data + '</a>';
                    }),

                DTColumnBuilder.newColumn('name').withTitle('Name').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return data;
                    }),

                DTColumnBuilder.newColumn('accountRS').withTitle('Issuer').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return searchTermFilter(data);
                    }),

                DTColumnBuilder.newColumn('currentSupply').withTitle('Supply').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return supplyFilter(data, row.decimals);
                    }),

                DTColumnBuilder.newColumn('numberOfExchanges').withTitle('Exchanges').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return data;
                    }),

                DTColumnBuilder.newColumn('numberOfTransfers').withTitle('Transfers').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return data;
                    }),

                DTColumnBuilder.newColumn('currency').withTitle('Action').notSortable()
                    .renderWith(function (data, type, row, meta) {

                        var tt_desk = ' popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover=' +
                            ' "TradeDesk"';

                        var trade_tag = false;

                        if ( parseInt(row.currentSupply) === 0) { trade_tag = true; }

                        return '<button type="button" class="btn btn-default btn-xs"  ' + tt_desk + ' ng-controller="CurrenciesMainCtrl"' +
                            'ng-disabled="' + trade_tag + '"' + ' ng-click="openTradeDesk(\'' + data +
                            '\',\'' + row.decimals + '\')">' +
                            ' <i class="fa fa-bar-chart" aria-hidden="true" style="width:15px;"></i> ' + '</button>';

                    })

            ];

            $scope.dtInstanceCallback = function (_dtInstance) {
                $scope.dtInstance = _dtInstance;
            };
            $scope.reloadCurrencies = function () {
                if ($scope.dtInstance) {
                    $scope.dtInstance._renderer.rerender();
                }
            };


        }]);

angular.module('currencies').controller('MyCurrenciesCtrl',
    ['$scope', 'CurrenciesService', 'amountTQTFilter', 'timestampFilter', 'DTOptionsBuilder', 'DTColumnBuilder',
        '$uibModal', '$compile', 'baseConfig', 'supplyFilter', 'searchTermFilter', 'CommonsService',
        'currencyModelFilter',
        function ($scope, CurrenciesService, amountTQTFilter, timestampFilter, DTOptionsBuilder, DTColumnBuilder,
                  $uibModal, $compile, baseConfig, supplyFilter, searchTermFilter, CommonsService,
                  currencyModelFilter) {

            $scope.dtOptionsCurrencies = DTOptionsBuilder.newOptions().withPaginationType('full_numbers')
                .withDOM('frtip')
                .withOption('info', false)
                .withOption('serverSide', false)
                .withDataProp('accountCurrencies')
                .withOption('paging', true)
                .withOption('ordering', false)
                .withOption('processing', false)
                .withOption('bFilter', false).withOption('fnRowCallback',
                    function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                        $compile(nRow)($scope);
                    })
                .withOption('ajax', function (data, callback, settings) {
                    var accountId = CommonsService.getAccountDetailsFromSession('accountId');
                    CurrenciesService.getAccountCurrencies(accountId).then(function (response) {
                        callback({
                            'iTotalRecords': response.accountCurrencies.length,
                            'iTotalDisplayRecords': response.accountCurrencies.length,
                            'accountCurrencies': response.accountCurrencies
                        });
                    });
                })
                .withDisplayLength(10).withBootstrap();

            $scope.dtColumnsCurrencies = [

                DTColumnBuilder.newColumn('currency').withTitle('Details').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return '<button type="button" class="btn btn-success btn-xs" ng-controller="SearchCtrl"' +
                            ' ng-click="searchValue(\'' + data + '\')">' +
                            '<i class="fa fa-list-ul" aria-hidden="true" style="width:15px;"></i>' + '</button>';

                    }),

                DTColumnBuilder.newColumn('code').withTitle('Ticker').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return '<a ng-click="openCurrencyDetailsModal(\'' + row.code +
                            '\')" ng-controller="CurrenciesMainCtrl"> ' + data + '</a>';
                    }),

                DTColumnBuilder.newColumn('name').withTitle('Name').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return data;
                    }),

                DTColumnBuilder.newColumn('units').withTitle('Units').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return supplyFilter(data, row.decimals);
                    }),

                DTColumnBuilder.newColumn('numberOfExchanges').withTitle('Exchanges').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return data;
                    }),

                DTColumnBuilder.newColumn('numberOfTransfers').withTitle('Transfers').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return data;
                    }),

                DTColumnBuilder.newColumn('currency').withTitle('Action').notSortable()
                    .renderWith(function (data, type, row, meta) {

                        var tt_desk = ' popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover=' +
                            ' "TradeDesk"';

                        var tt_exchange = ' popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover=' +
                            ' "Exchange"';

                        var tt_transfer = ' popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover=' +
                            ' "Transfer"';

                        var tt_delete = ' popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover=' +
                            ' "Delete"';


                        var trade = '<button type="button" class="btn btn-default btn-xs" ' + tt_desk + ' ng-controller="CurrenciesMainCtrl"' +
                            ' ng-click="openTradeDesk(\'' + data +
                            '\',\'' + row.decimals + '\',\'' + row.code + '\')">' +
                            ' <i class="fa fa-bar-chart" aria-hidden="true" style="width:15px;"></i> ' + '</button>';

                        var transfer = '<button type="button" class="btn btn-default btn-xs" ' + tt_transfer + ' ng-controller="CurrenciesMainCtrl"' +
                            ' ng-click="openTransferCurrencyModal(\'' + data +
                            '\',\'' + row.decimals + '\',\'' + row.code + '\')">' +
                            ' <i class="fa fa-user" aria-hidden="true" style="width:15px;"></i> ' + '</button>';

                        var del = '<button type="button" class="btn btn-default btn-xs" ' + tt_delete + ' ng-controller="CurrenciesMainCtrl"' +
                            ' ng-click="openDeleteCurrencyModal(\'' + data +
                            '\',\'' + row.decimals + '\',\'' + row.code + '\')">' +
                            ' <i class="fa fa-times" aria-hidden="true" style="width:15px;"></i> ' + '</button>';

                        var exchange = '<button type="button" class="btn btn-default btn-xs" ' + tt_exchange + ' ng-controller="CurrenciesMainCtrl"' +
                            ' ng-click="openPublishExchangeOfferModal(\'' + data +
                            '\',\'' + row.decimals + '\',\'' + row.code +  '\')">' +
                            ' <i class="fa fa-usd" aria-hidden="true" style="width:15px;"></i> ' + '</button>';

                        var claim = '<button type="button" class="btn btn-default btn-xs" ng-controller="CurrenciesMainCtrl"' +
                            ' ng-click="openCurrencyReserveClaimModal(\'' + data +
                            '\',\'' + row.decimals + '\',\'' + row.code + '\')">' +
                            ' <i class="fa fa-hand-paper-o" aria-hidden="true" style="width:15px;"></i> ' + '</button>';

                        var increase = '<button type="button" class="btn btn-default btn-xs" ng-controller="CurrenciesMainCtrl"' +
                            ' ng-click="openCurrencyReserveIncreaseModal(\'' + data +
                            '\',\'' + row.decimals + '\',\'' + row.code + '\')">' +
                            ' <i class="fa fa-arrow-up" aria-hidden="true" style="width:15px;"></i> ' + '</button>';

                        var founder = '<button type="button" class="btn btn-default btn-xs" ng-controller="CurrenciesMainCtrl"' +
                            ' ng-click="openCurrencyFoundersModal(\'' + data +
                            '\',\'' + row.decimals + '\',\'' + row.code + '\')">' +
                            ' <i class="fa fa-diamond" aria-hidden="true" style="width:15px;"></i> ' + '</button>';


                        return trade + ' ' + exchange + ' ' + transfer + ' ' + del;

                    })

            ];

            $scope.dtInstanceCallbackCurrencies = function (_dtInstance) {
                $scope.dtInstance = _dtInstance;
            };
            $scope.reloadCurrencies = function () {
                if ($scope.dtInstance) {
                    $scope.dtInstance._renderer.rerender();
                }
            };


        }]);

angular.module('currencies').controller('CurrenciesExchangesCtrl',
    ['$scope', 'CurrenciesService', 'amountTQTFilter', 'timestampFilter', 'DTOptionsBuilder', 'DTColumnBuilder',
        '$uibModal', '$compile', 'baseConfig', 'supplyFilter', 'searchTermFilter', 'quantToAmountFilter',
        'numericalStringFilter',
        function ($scope, CurrenciesService, amountTQTFilter, timestampFilter, DTOptionsBuilder, DTColumnBuilder,
                  $uibModal, $compile, baseConfig, supplyFilter, searchTermFilter, quantToAmountFilter,
                  numericalStringFilter) {

            $scope.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers')
                .withDOM('frtip')
                .withOption('info', false)
                .withOption('ordering', false)
                .withOption('serverSide', true)
                .withDataProp('exchanges')
                .withOption('processing', true)
                .withOption('bFilter', false)
                .withOption('fnRowCallback',
                    function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                        $compile(nRow)($scope);
                    })
                .withOption('ajax', function (data, callback, settings) {
                    var endIndex = data.start + data.length - 1;
                    CurrenciesService.getAllExchanges(data.start, endIndex).then(function (response) {
                        callback({
                            'iTotalRecords': 1000,
                            'iTotalDisplayRecords': 1000,
                            'exchanges': response.exchanges
                        });
                    });
                })
                .withDisplayLength(10).withBootstrap();

            $scope.dtColumns = [

                DTColumnBuilder.newColumn('offer').withTitle('Offer').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return '<button type="button" class="btn btn-success btn-xs" ng-controller="SearchCtrl"' +
                            ' ng-click="searchValue(\'' + data + '\')">' +
                            '<i class="fa fa-list-ul" aria-hidden="true" style="width:15px;"></i>' + '</button>';

                    }),

                DTColumnBuilder.newColumn('timestamp').withTitle('Date').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return timestampFilter(data);
                    }),

                DTColumnBuilder.newColumn('code').withTitle('Ticker').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return '<a ng-click="openCurrencyDetailsModal(\'' + row.code +
                            '\')" ng-controller="CurrenciesMainCtrl"> ' + data + '</a>';
                    }),


                DTColumnBuilder.newColumn('rateTQT').withTitle('Rate').notSortable()
                    .renderWith(function (data, type, row, meta) {

                        var price = data * Math.pow(10, row.decimals) / 100000000;
                        return price.toLocaleString('en-US', {minimumFractionDigits: row.decimals});

                    }),

                DTColumnBuilder.newColumn('units').withTitle('Units').notSortable()
                    .renderWith(function (data, type, row, meta) {

                        var quantity = parseInt(data) / Math.pow(10, row.decimals);
                        return quantity.toLocaleString('en-US', {minimumFractionDigits: row.decimals});

                    }),

                DTColumnBuilder.newColumn('sellerRS').withTitle('Seller').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return searchTermFilter(data);
                    }),

                DTColumnBuilder.newColumn('buyerRS').withTitle('Buyer').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return searchTermFilter(data);
                    }),

                DTColumnBuilder.newColumn('transaction').withTitle('Details').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return '<button type="button" class="btn btn-default btn-xs" ng-controller="SearchCtrl"' +
                            ' ng-click="searchValue(\'' + data + '\')">' +
                            '<i class="fa fa-list-ul" aria-hidden="true" style="width:15px;"></i>' + '</button>';

                    }),
            ];

            $scope.dtInstanceCallback = function (_dtInstance) {
                $scope.dtInstance = _dtInstance;
            };
            $scope.reloadCurrencies = function () {
                if ($scope.dtInstance) {
                    $scope.dtInstance._renderer.rerender();
                }
            };


        }]);

angular.module('currencies').controller('CurrenciesFormCtrl',
    ['$scope', '$uibModalInstance', 'params', function ($scope, $uibModalInstance, params) {

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.$on('close-modal', function () {
            $uibModalInstance.dismiss('cancel');
        });

        var issueCurrencySteps = [
            {
                templateUrl: 'currencies/modals/issue-currency-details.html',
                title: 'Issue Currency Details',
                controller: 'IssueCurrencyFormController',
                isolatedScope: true,
                data: params,
            },
            {
                templateUrl: 'currencies/modals/issue-currency-details-2.html',
                title: 'Issue Currency Details 2',
                controller: 'IssueCurrencyFormController',
                isolatedScope: true,
                data: params,
            },
            {
                templateUrl: 'currencies/modals/issue-currency-confirm.html',
                title: 'Issue Currency Confirmation',
                controller: 'IssueCurrencyFormController',
                isolatedScope: true,
            },
        ];

        var deleteCurrencySteps = [
            {
                templateUrl: 'currencies/modals/delete-currency-details.html',
                title: 'Delete Currency Details',
                controller: 'DeleteCurrencyFormController',
                isolatedScope: true,
                data: params,
            },
            {
                templateUrl: 'currencies/modals/delete-currency-confirm.html',
                title: 'Delete Currency Confirmation',
                controller: 'DeleteCurrencyFormController',
                isolatedScope: true,
            },
        ];

        var searchCurrenciesSteps = [
            {
                templateUrl: 'currencies/modals/search-currency-details.html',
                title: 'Search Currency Query',
                controller: 'SearchCurrencyFormCtrl',
                isolatedScope: true,
                data: params,
            },
            {
                templateUrl: 'currencies/modals/search-currency-confirm.html',
                title: 'Search Currency Results',
                controller: 'SearchCurrencyFormCtrl',
                isolatedScope: true,
            },
        ];

        var transferCurrencySteps = [
            {
                templateUrl: 'currencies/modals/transfer-currency-details.html',
                title: 'Transfer Currency Details',
                controller: 'TransferCurrencyFormController',
                isolatedScope: true,
                data: params,
            },
            {
                templateUrl: 'currencies/modals/transfer-currency-confirm.html',
                title: 'Transfer Currency Confirmation',
                controller: 'TransferCurrencyFormController',
                isolatedScope: true,
            },
        ];

        var sendCurrencySteps = [
            {
                templateUrl: 'currencies/modals/send-currency-details.html',
                title: 'Send Currency Details',
                controller: 'TransferCurrencyFormController',
                isolatedScope: true,
                data: params,
            },
            {
                templateUrl: 'currencies/modals/send-currency-confirm.html',
                title: 'Send Currency Confirmation',
                controller: 'TransferCurrencyFormController',
                isolatedScope: true,
            },
        ];

        var publishExchangeOfferSteps = [
            {
                templateUrl: 'currencies/modals/publish-exchange-offer-details.html',
                title: 'Exchange Offer Details',
                controller: 'PublishExchangeOrderFormController',
                isolatedScope: true,
                data: params,
            },
            {
                templateUrl: 'currencies/modals/publish-exchange-offer-confirm.html',
                title: 'Exchange Offer Confirmation',
                controller: 'PublishExchangeOrderFormController',
                isolatedScope: true,
            },
        ];

        var cancelExchangeOfferSteps = [
            {
                templateUrl: 'currencies/modals/cancel-exchange-offer-confirm.html',
                title: 'Exchange Offer Details',
                controller: 'CancelExchangeOfferFormController',
                isolatedScope: true,
                data: params,
            },
        ];

        var publishExchangeBuyOfferSteps = [
            {
                templateUrl: 'currencies/modals/publish-exchange-buy-offer-details.html',
                title: 'Currency Buy Offer Details',
                controller: 'PublishExchangeOrderFormController',
                isolatedScope: true,
                data: params,
            },
            {
                templateUrl: 'currencies/modals/publish-exchange-buy-offer-confirm.html',
                title: 'Currency Buy Offer Confirmation',
                controller: 'PublishExchangeOrderFormController',
                isolatedScope: true,
            },
        ];

        var publishExchangeSellOfferSteps = [
            {
                templateUrl: 'currencies/modals/publish-exchange-sell-offer-details.html',
                title: 'Currency Sell Offer Details',
                controller: 'PublishExchangeOrderFormController',
                isolatedScope: true,
                data: params,
            },
            {
                templateUrl: 'currencies/modals/publish-exchange-sell-offer-confirm.html',
                title: 'Currency Sell Offer Confirmation',
                controller: 'PublishExchangeOrderFormController',
                isolatedScope: true,
            },
        ];

        var currencyReserveClaimSteps = [
            {
                templateUrl: 'currencies/modals/currency-reserve-claim-details.html',
                title: 'Reserve Claim Details',
                controller: 'CurrencyReserveClaimFormController',
                isolatedScope: true,
                data: params,
            },
            {
                templateUrl: 'currencies/modals/currency-reserve-claim-confirm.html',
                title: 'Reserve Claim Confirmation',
                controller: 'CurrencyReserveClaimFormController',
                isolatedScope: true,
            },
        ];

        var currencyReserveIncreaseSteps = [
            {
                templateUrl: 'currencies/modals/currency-reserve-increase-details.html',
                title: 'Reserve Increase Details',
                controller: 'CurrencyReserveIncreaseFormController',
                isolatedScope: true,
                data: params,
            },
            {
                templateUrl: 'currencies/modals/currency-reserve-increase-confirm.html',
                title: 'Reserve Increase Confirmation',
                controller: 'CurrencyReserveIncreaseFormController',
                isolatedScope: true,
            },
        ];

        var buyCurrencySteps = [

            {
                templateUrl: 'currencies/modals/buy-currency-confirm.html',
                title: 'Buy Currency Confirmation',
                controller: 'BuyCurrencyFormController',
                isolatedScope: true,
                data: params,
            },
        ];

        var sellCurrencySteps = [

            {
                templateUrl: 'currencies/modals/sell-currency-confirm.html',
                title: 'Sell Currency Confirmation',
                controller: 'SellCurrencyFormController',
                isolatedScope: true,
                data: params,
            },
        ];


        $scope.steps = {};

        $scope.steps.issueCurrencyForm = issueCurrencySteps;
        $scope.steps.deleteCurrencyForm = deleteCurrencySteps;
        $scope.steps.searchCurrencyForm = searchCurrenciesSteps;
        $scope.steps.transferCurrencyForm = transferCurrencySteps;
        $scope.steps.sendCurrencyForm = sendCurrencySteps;
        $scope.steps.publishExchangeOfferForm = publishExchangeOfferSteps;
        $scope.steps.publishExchangeBuyOfferForm = publishExchangeBuyOfferSteps;
        $scope.steps.publishExchangeSellOfferForm = publishExchangeSellOfferSteps;
        $scope.steps.cancelExchangeOfferForm = cancelExchangeOfferSteps;
        $scope.steps.currencyReserveClaimForm = currencyReserveClaimSteps;
        $scope.steps.currencyReserveIncreaseForm = currencyReserveIncreaseSteps;
        $scope.steps.buyCurrencyForm = buyCurrencySteps;
        $scope.steps.sellCurrencyForm = sellCurrencySteps;

    }]);

angular.module('currencies').controller('CurrencyDetailsCtrl',
    ['$scope', 'CurrenciesService', 'amountTQTFilter', 'timestampFilter', 'DTOptionsBuilder', 'DTColumnBuilder',
        '$uibModal', '$compile', 'baseConfig', 'supplyFilter', 'searchTermFilter', 'CommonsService', 'params',
        '$uibModalInstance',
        function ($scope, CurrenciesService, amountTQTFilter, timestampFilter, DTOptionsBuilder, DTColumnBuilder,
                  $uibModal, $compile, baseConfig, supplyFilter, searchTermFilter, CommonsService, params,
                  $uibModalInstance) {

            $scope.initCurrencyDetails = function () {
                CurrenciesService.getCurrency(params.currencyId, true).then(function (success) {
                    $scope.currencyDetails = success;
                }, function (error) {
                });
            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };

        }]);

angular.module('currencies').controller('CurrenciesMyExchangesCtrl',
    ['$scope', 'CurrenciesService', 'amountTQTFilter', 'timestampFilter', 'DTOptionsBuilder', 'DTColumnBuilder',
        '$uibModal', '$compile', 'baseConfig', 'supplyFilter', 'searchTermFilter', 'quantToAmountFilter',
        'numericalStringFilter', 'AccountService', 'numberStringFilter',
        function ($scope, CurrenciesService, amountTQTFilter, timestampFilter, DTOptionsBuilder, DTColumnBuilder,
                  $uibModal, $compile, baseConfig, supplyFilter, searchTermFilter, quantToAmountFilter,
                  numericalStringFilter, AccountService, numberStringFilter) {

            $scope.dtMyExchangesOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers')
                .withDOM('frtip')
                .withOption('info', false)
                .withOption('ordering', false)
                .withOption('serverSide', true)
                .withDataProp('myexchanges')
                .withOption('processing', true)
                .withOption('bFilter', false)
                .withOption('fnRowCallback',
                    function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                        $compile(nRow)($scope);
                    })
                .withOption('ajax', function (data, callback, settings) {
                    var endIndex = data.start + data.length - 1;
                    var accountRS = AccountService.getAccountDetailsFromSession('accountRs');
                    CurrenciesService.getExchanges('', accountRS, data.start, endIndex).then(function (response) {
                        callback({
                            'iTotalRecords': 1000,
                            'iTotalDisplayRecords': 1000,
                            'myexchanges': response.exchanges
                        });
                    });
                })
                .withDisplayLength(10).withBootstrap();

            $scope.dtMyExchangesColumns = [


                DTColumnBuilder.newColumn('offer').withTitle('Offer').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return '<button type="button" class="btn btn-success btn-xs" ng-controller="SearchCtrl"' +
                            ' ng-click="searchValue(\'' + data + '\')">' +
                            '<i class="fa fa-list-ul" aria-hidden="true" style="width:15px;"></i>' + '</button>';

                    }),

                DTColumnBuilder.newColumn('timestamp').withTitle('Date').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return timestampFilter(data);
                    }),

                DTColumnBuilder.newColumn('code').withTitle('Ticker').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return '<a ng-click="openCurrencyDetailsModal(\'' + row.code +
                            '\')" ng-controller="CurrenciesMainCtrl"> ' + data + '</a>';
                    }),

                DTColumnBuilder.newColumn('rateTQT').withTitle('Rate').notSortable()
                    .renderWith(function (data, type, row, meta) {


                        var price = data * Math.pow(10, row.decimals) / 100000000;
                        return price.toLocaleString('en-US', {minimumFractionDigits: row.decimals});


                    }),

                DTColumnBuilder.newColumn('units').withTitle('Units').notSortable()
                    .renderWith(function (data, type, row, meta) {

                        var quantity = parseInt(data) / Math.pow(10, row.decimals);
                        return quantity.toLocaleString('en-US', {minimumFractionDigits: row.decimals});

                    }),


                DTColumnBuilder.newColumn('sellerRS').withTitle('Seller').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return searchTermFilter(data);
                    }),

                DTColumnBuilder.newColumn('buyerRS').withTitle('Buyer').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return searchTermFilter(data);
                    }),

                DTColumnBuilder.newColumn('transaction').withTitle('Details').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return '<button type="button" class="btn btn-default btn-xs" ng-controller="SearchCtrl"' +
                            ' ng-click="searchValue(\'' + data + '\')">' +
                            '<i class="fa fa-list-ul" aria-hidden="true" style="width:15px;"></i>' + '</button>';

                    }),

            ];

            $scope.dtMyExchangesInstanceCallback = function (_dtInstance) {
                $scope.dtInstance = _dtInstance;
            };
            $scope.reloadMyExchanges = function () {
                if ($scope.dtInstance) {
                    $scope.dtInstance._renderer.rerender();
                }
            };


        }]);

angular.module('currencies').controller('CurrenciesMyTransfersCtrl',
    ['$scope', 'CurrenciesService', 'amountTQTFilter', 'timestampFilter', 'DTOptionsBuilder', 'DTColumnBuilder',
        '$uibModal', '$compile', 'baseConfig', 'supplyFilter', 'searchTermFilter', 'quantToAmountFilter',
        'numericalStringFilter', 'AccountService',
        function ($scope, CurrenciesService, amountTQTFilter, timestampFilter, DTOptionsBuilder, DTColumnBuilder,
                  $uibModal, $compile, baseConfig, supplyFilter, searchTermFilter, quantToAmountFilter,
                  numericalStringFilter, AccountService) {

            $scope.dtMyTransfersOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers')
                .withDOM('frtip')
                .withOption('info', false)
                .withOption('ordering', false)
                .withOption('serverSide', true)
                .withDataProp('transfers')
                .withOption('processing', true)
                .withOption('bFilter', false)
                .withOption('fnRowCallback',
                    function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                        $compile(nRow)($scope);
                    })
                .withOption('ajax', function (data, callback, settings) {
                    var endIndex = data.start + data.length - 1;
                    var accountRS = AccountService.getAccountDetailsFromSession('accountRs');
                    CurrenciesService.getCurrencyTransfers('', accountRS, data.start, endIndex)
                        .then(function (response) {
                            callback({
                                'iTotalRecords': 1000,
                                'iTotalDisplayRecords': 1000,
                                'transfers': response.transfers
                            });
                        });
                })
                .withDisplayLength(10).withBootstrap();

            $scope.dtMyTransfersColumns = [


                DTColumnBuilder.newColumn('transfer').withTitle('Details').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return '<button type="button" class="btn btn-success btn-xs" ng-controller="SearchCtrl"' +
                            ' ng-click="searchValue(\'' + data + '\')">' +
                            '<i class="fa fa-list-ul" aria-hidden="true" style="width:15px;"></i>' + '</button>';

                    }),

                DTColumnBuilder.newColumn('timestamp').withTitle('Date').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return timestampFilter(data);
                    }),

                DTColumnBuilder.newColumn('code').withTitle('Ticker').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return '<a ng-click="openCurrencyDetailsModal(\'' + row.code +
                            '\')" ng-controller="CurrenciesMainCtrl"> ' + data + '</a>';
                    }),

                DTColumnBuilder.newColumn('units').withTitle('Units').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return supplyFilter(data, row.decimals);
                    }),

                DTColumnBuilder.newColumn('recipientRS').withTitle('Recipient').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return searchTermFilter(data);
                    }),


            ];

            $scope.dtMyTransfersInstanceCallback = function (_dtInstance) {
                $scope.dtInstance = _dtInstance;
            };
            $scope.reloadMyTransfers = function () {
                if ($scope.dtInstance) {
                    $scope.dtInstance._renderer.rerender();
                }
            };


        }]);

angular.module('currencies').controller('CurrenciesMyOffersCtrl',
    ['$scope', 'CurrenciesService', 'amountTQTFilter', 'timestampFilter', 'DTOptionsBuilder', 'DTColumnBuilder',
        '$uibModal', '$compile', 'baseConfig', 'supplyFilter', 'searchTermFilter', 'quantToAmountFilter',
        'numericalStringFilter', 'AccountService',
        function ($scope, CurrenciesService, amountTQTFilter, timestampFilter, DTOptionsBuilder, DTColumnBuilder,
                  $uibModal, $compile, baseConfig, supplyFilter, searchTermFilter, quantToAmountFilter,
                  numericalStringFilter, AccountService) {

            $scope.dtMyBuyOffersOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers')
                .withDOM('frtip')
                .withOption('info', false)
                .withOption('ordering', false)
                .withOption('serverSide', true)
                .withDataProp('buyoffers')
                .withOption('processing', true)
                .withOption('bFilter', false)
                .withOption('fnRowCallback',
                    function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                        $compile(nRow)($scope);
                    })
                .withOption('ajax', function (data, callback, settings) {
                    var endIndex = data.start + data.length - 1;
                    var accountRS = AccountService.getAccountDetailsFromSession('accountRs');
                    CurrenciesService.getBuyOffers(accountRS, '', data.start, endIndex).then(function (response) {
                        callback({
                            'iTotalRecords': 1000,
                            'iTotalDisplayRecords': 1000,
                            'buyoffers': response.offers
                        });
                    });
                })
                .withDisplayLength(10).withBootstrap();

            $scope.dtMyBuyOffersColumns = [

                DTColumnBuilder.newColumn('offer').withTitle('offer').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return '<button type="button" class="btn btn-success btn-xs" ng-controller="SearchCtrl"' +
                            ' ng-click="searchValue(\'' + data + '\')">' +
                            '<i class="fa fa-list-ul" aria-hidden="true" style="width:15px;"></i>' + '</button>';
                    }),

                DTColumnBuilder.newColumn('code').withTitle('Ticker').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return '<a ng-click="openCurrencyDetailsModal(\'' + row.code +
                            '\')" ng-controller="CurrenciesMainCtrl"> ' + data + '</a>';
                    }),


                DTColumnBuilder.newColumn('rateTQT').withTitle('price').notSortable()
                    .renderWith(function (data, type, row, meta) {

                        var price = data * Math.pow(10, row.decimals) / 100000000;
                        return price.toLocaleString('en-US', {minimumFractionDigits: row.decimals});

                    }),

                DTColumnBuilder.newColumn('limit').withTitle('Limit').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return supplyFilter(data, row.decimals);
                    }),

                DTColumnBuilder.newColumn('supply').withTitle('Supply').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return supplyFilter(data, row.decimals);
                    }),

                DTColumnBuilder.newColumn('expirationHeight').withTitle('Height').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return data;
                    }),
                DTColumnBuilder.newColumn('currency').withTitle('Actions').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return '<button type="button" class="btn btn-default btn-xs"  ' + ' ng-controller="CurrenciesMainCtrl"' +
                            ' ng-click="openCancelExchangeOfferModal(\'' + data + '\',\'BUY\')">' +
                            ' <i class="fa fa-times" aria-hidden="true" style="width:15px;"></i> ' + '</button>';

                    }),


            ];

            $scope.dtMySellOffersOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers')
                .withDOM('frtip')
                .withOption('info', false)
                .withOption('ordering', false)
                .withOption('serverSide', true)
                .withDataProp('buyoffers')
                .withOption('processing', true)
                .withOption('bFilter', false)
                .withOption('fnRowCallback',
                    function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                        $compile(nRow)($scope);
                    })
                .withOption('ajax', function (data, callback, settings) {
                    var endIndex = data.start + data.length - 1;
                    var accountRS = AccountService.getAccountDetailsFromSession('accountRs');
                    CurrenciesService.getSellOffers(accountRS, '', data.start, endIndex).then(function (response) {
                        callback({
                            'iTotalRecords': 1000,
                            'iTotalDisplayRecords': 1000,
                            'buyoffers': response.offers
                        });
                    });
                })
                .withDisplayLength(10).withBootstrap();

            $scope.dtMySellOffersColumns = [

                DTColumnBuilder.newColumn('offer').withTitle('offer').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return '<button type="button" class="btn btn-success btn-xs" ng-controller="SearchCtrl"' +
                            ' ng-click="searchValue(\'' + data + '\')">' +
                            '<i class="fa fa-list-ul" aria-hidden="true" style="width:15px;"></i>' + '</button>';
                    }),

                DTColumnBuilder.newColumn('code').withTitle('Ticker').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return '<a ng-click="openCurrencyDetailsModal(\'' + row.code +
                            '\')" ng-controller="CurrenciesMainCtrl"> ' + data + '</a>';
                    }),


                DTColumnBuilder.newColumn('rateTQT').withTitle('price').notSortable()
                    .renderWith(function (data, type, row, meta) {

                        var price = data * Math.pow(10, row.decimals) / 100000000;
                        return price.toLocaleString('en-US', {minimumFractionDigits: row.decimals});

                    }),

                DTColumnBuilder.newColumn('limit').withTitle('Limit').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return supplyFilter(data, row.decimals);
                    }),

                DTColumnBuilder.newColumn('supply').withTitle('Supply').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return supplyFilter(data, row.decimals);
                    }),

                DTColumnBuilder.newColumn('expirationHeight').withTitle('Height').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return data;
                    }),
                DTColumnBuilder.newColumn('currency').withTitle('Actions').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return '<button type="button" class="btn btn-default btn-xs"  ' + ' ng-controller="CurrenciesMainCtrl"' +
                            ' ng-click="openCancelExchangeOfferModal(\'' + data + '\',\'SELL\')">' +
                            ' <i class="fa fa-times" aria-hidden="true" style="width:15px;"></i> ' + '</button>';

                    }),


            ];

            $scope.dtMyBuyOffersInstanceCallback = function (_dtInstance) {
                $scope.dtInstanceBuyOffer = _dtInstance;
            };
            $scope.reloadMyBuyOffers = function () {
                if ($scope.dtInstanceBuyOffer) {
                    $scope.dtInstanceBuyOffer._renderer.rerender();
                }
            };

            $scope.dtMySellOffersInstanceCallback = function (_dtInstance) {
                $scope.dtInstanceSellOffer = _dtInstance;
            };
            $scope.reloadMySellOffers = function () {
                if ($scope.dtInstanceSellOffer) {
                    $scope.dtInstanceSellOffer._renderer.rerender();
                }
            };


        }]);
