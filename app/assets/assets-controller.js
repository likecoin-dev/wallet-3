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

angular.module('assets').controller('AssetsMainCtrl',
    ['$scope', 'AssetsService', 'amountTQTFilter', 'timestampFilter', 'DTOptionsBuilder', 'DTColumnBuilder',
        '$uibModal', '$compile', 'baseConfig', 'supplyFilter', 'searchTermFilter', '$state',
        function ($scope, AssetsService, amountTQTFilter, timestampFilter, DTOptionsBuilder, DTColumnBuilder,
                  $uibModal, $compile, baseConfig, supplyFilter, searchTermFilter, $state) {

            $scope.openIssueAssetModal = function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'assets/modals/issue-asset-form.html',
                    size: 'lg',
                    controller: 'AssetsFormCtrl',
                    resolve: {
                        params: function () {
                            return {};
                        }
                    }
                });
            };

            $scope.openDeleteAssetModal = function (assetId, decimals) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'assets/modals/delete-asset-form.html',
                    size: 'lg',
                    controller: 'AssetsFormCtrl',
                    resolve: {
                        params: function () {
                            return {
                                'assetId': assetId,
                                'decimals': decimals,
                            };
                        }
                    }
                });
            };

            $scope.openPlaceOrderModal = function (assetId) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'assets/modals/place-order-form.html',
                    size: 'lg',
                    controller: 'AssetsFormCtrl',
                    resolve: {
                        params: function () {
                            return {
                                'assetId': assetId,
                            };
                        }
                    }
                });
            };

            $scope.openTradeDeskModal = function (assetId, decimals) {
                $state.go('client.signedin.assets.trade', {assetId: assetId});
            };

            $scope.openSearchAssetModal = function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'assets/modals/search-asset-form.html',
                    size: 'lg',
                    controller: 'AssetsFormCtrl',
                    resolve: {
                        params: function () {
                            return {};
                        }
                    }
                });
            };

            $scope.openExpectedOrderModal = function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'assets/modals/expected-order-form.html',
                    size: 'lg',
                    controller: 'AssetsFormCtrl',
                    resolve: {
                        params: function () {
                            return {};
                        }
                    }
                });
            };

            $scope.openOrderTradesModal = function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'assets/modals/order-trades-form.html',
                    size: 'lg',
                    controller: 'AssetsFormCtrl',
                    resolve: {
                        params: function () {
                            return {};
                        }
                    }
                });
            };

            $scope.openExpectedTransfersModal = function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'assets/modals/expected-transfers-form.html',
                    size: 'lg',
                    controller: 'AssetsFormCtrl',
                    resolve: {
                        params: function () {
                            return {};
                        }
                    }
                });
            };

            $scope.openExpectedDeletesModal = function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'assets/modals/expected-deletes-form.html',
                    size: 'lg',
                    controller: 'AssetsFormCtrl',
                    resolve: {
                        params: function () {
                            return {};
                        }
                    }
                });
            };

            $scope.openExpectedBidModal = function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'assets/modals/expected-bid-form.html',
                    size: 'lg',
                    controller: 'AssetsFormCtrl',
                    resolve: {
                        params: function () {
                            return {};
                        }
                    }
                });
            };

            $scope.openExpectedCancellationsModal = function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'assets/modals/expected-cancellations-form.html',
                    size: 'lg',
                    controller: 'AssetsFormCtrl',
                    resolve: {
                        params: function () {
                            return {};
                        }
                    }
                });
            };

            $scope.openCancelOrderModal = function (orderId, assetId, quantity, price, decimals, type) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'assets/modals/cancel-order-form.html',
                    size: 'lg',
                    controller: 'AssetsFormCtrl',
                    resolve: {
                        params: function () {
                            return {
                                'orderId': orderId,
                                'assetId': assetId,
                                'quantity': quantity,
                                'price': price,
                                'decimals': decimals,
                                'type': type

                            };
                        }
                    }
                });
            };

            $scope.openTransferAssetModal = function (assetId, decimals) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'assets/modals/transfer-asset-form.html',
                    size: 'lg',
                    controller: 'AssetsFormCtrl',
                    resolve: {
                        params: function () {
                            return {
                                'assetId': assetId,
                                'decimals': decimals,
                            };
                        }
                    }
                });
            };

            $scope.openSendAssetModal = function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'assets/modals/send-asset-form.html',
                    size: 'lg',
                    controller: 'AssetsFormCtrl',
                    resolve: {
                        params: function () {
                            return {};
                        }
                    }
                });
            };

            $scope.openDividendPaymentModal = function (assetId, decimals) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'assets/modals/dividend-payment-form.html',
                    size: 'lg',
                    controller: 'AssetsFormCtrl',
                    resolve: {
                        params: function () {
                            return {
                                'assetId': assetId,
                                'decimals': decimals,
                            };
                        }
                    }
                });
            };

            $scope.openAssetDetailsModal = function (assetId) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'assets/modals/asset-details.html',
                    size: 'lg',
                    controller: 'AssetDetailsCtrl',
                    resolve: {
                        params: function () {
                            return {
                                'assetId': assetId,
                            };
                        }
                    }
                });
            };

            $scope.openDividendsDetailsModal = function (assetId) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'assets/modals/dividends-details.html',
                    size: 'lg',
                    controller: 'DividendsDetailsCtrl',
                    resolve: {
                        params: function () {
                            return {
                                'assetId': assetId,
                            };
                        }
                    }
                });
            };


        }]);

angular.module('assets').controller('AssetsCtrl',
    ['$scope', 'AssetsService', 'amountTQTFilter', 'timestampFilter', 'DTOptionsBuilder', 'DTColumnBuilder',
        '$uibModal', '$compile', 'baseConfig', 'supplyFilter', 'searchTermFilter',
        function ($scope, AssetsService, amountTQTFilter, timestampFilter, DTOptionsBuilder, DTColumnBuilder,
                  $uibModal, $compile, baseConfig, supplyFilter, searchTermFilter) {

            $scope.sort_order = 'desc';
            $scope.sort_orderColumn = 'height';

            $scope.sort_default = function () {
              $scope.sort_order = 'desc';
              $scope.sort_orderColumn = 'height';
              $scope.reloadAssets();
            };

            $scope.sort_supply = function () {
                $scope.sort_orderColumn = 'quantity';
                $scope.reloadAssets();
            };

            $scope.sort_height = function () {
                $scope.sort_orderColumn = 'height';
                $scope.reloadAssets();
            };

            $scope.sort_decimals = function () {
                $scope.sort_orderColumn = 'decimals';
                $scope.reloadAssets();
            };

            $scope.sort_name = function () {
                $scope.sort_orderColumn = 'name';
                $scope.reloadAssets();
            };

            $scope.sort_toggle = function () {
                if ($scope.sort_order === 'desc') {
                    $scope.sort_order = 'asc';
                } else if ($scope.sort_order === 'asc') {
                    $scope.sort_order = 'desc';
                }
                $scope.reloadAssets();
            };

            $scope.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers')
                .withDOM('frtip')
                .withOption('info', false)
                .withOption('ordering', false)
                .withOption('serverSide', true)
                .withDataProp('assets')
                .withOption('processing', true)
                .withOption('bFilter', false)
                .withOption('fnRowCallback',
                    function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                        $compile(nRow)($scope);
                    })
                .withOption('ajax', function (data, callback, settings) {
                    var endIndex = data.start + data.length - 1;
                    AssetsService.getAssets(
                        data.start,
                        endIndex,
                        $scope.sort_order,
                        $scope.sort_orderColumn
                      ).then(function (response) {

                        callback({
                            'iTotalRecords': 1000,
                            'iTotalDisplayRecords': 1000,
                            'assets': response.assets
                        });
                    });
                })
                .withDisplayLength(10).withBootstrap();

            $scope.dtColumns = [

                DTColumnBuilder.newColumn('asset').withTitle('Details').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return '<button type="button" class="btn btn-success btn-xs" ng-controller="SearchCtrl"' +
                            ' ng-click="searchValue(\'' + data + '\')">' +
                            '<i class="fa fa-list-ul" aria-hidden="true" style="width:15px;"></i>' + '</button>';

                    }),
                DTColumnBuilder.newColumn('name').withTitle('Name').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return '<a ng-click="openAssetDetailsModal(\'' + row.asset +
                            '\')" ng-controller="AssetsMainCtrl"> ' + data + '</a>';

                    }),
                DTColumnBuilder.newColumn('accountRS').withTitle('Issuer').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return searchTermFilter(data);
                    }),
                DTColumnBuilder.newColumn('quantityQNT').withTitle('Current Supply').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return supplyFilter(data, row.decimals);
                    }),
                DTColumnBuilder.newColumn('numberOfAccounts').withTitle('Shareholders').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return data;
                    }),

                DTColumnBuilder.newColumn('numberOfTrades').withTitle('Trades').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return data;
                    }),

                DTColumnBuilder.newColumn('numberOfTransfers').withTitle('Transfers').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return data;
                    }),

                DTColumnBuilder.newColumn('asset').withTitle('Action').notSortable()
                    .renderWith(function (data, type, row, meta) {

                        var tt_desk = ' popover-placement="left" popover-trigger="\'mouseenter\'" uib-popover=' +
                            ' "TradeDesk"';

                        var tt_divih = ' popover-placement="left" popover-trigger="\'mouseenter\'" uib-popover=' +
                            ' "Dividends History"';

                        var trade = '<button type="button" class="btn btn-default btn-xs"  ' + tt_desk + ' ng-controller="AssetsMainCtrl"' +
                            ' ng-click="openTradeDeskModal(\'' + data +
                            '\',\'' + row.decimals + '\')">' +
                            ' <i class="fa fa-bar-chart" aria-hidden="true" style="width:15px;"></i> ' + '</button>';

                        var divih = '<button type="button" class="btn btn-default btn-xs"  ' + tt_divih + ' ng-controller="AssetsMainCtrl"' +
                            ' ng-click="openDividendsDetailsModal(\'' + data +
                            '\',\'' + row.decimals + '\')">' +
                            ' <i class="fa fa-usd" aria-hidden="true" style="width:15px;"></i> ' + '</button>';

                        return trade + ' ' + divih ;
                    })
            ];

            $scope.dtInstanceCallback = function (_dtInstance) {
                $scope.dtInstance = _dtInstance;
            };

            $scope.reloadAssets = function () {
                if ($scope.dtInstance) {
                    $scope.dtInstance._renderer.rerender();
                }
            };


        }]);

angular.module('assets').controller('MyAssetsCtrl',
    ['$scope', 'AssetsService', 'amountTQTFilter', 'timestampFilter', 'DTOptionsBuilder', 'DTColumnBuilder',
        '$uibModal', '$compile', 'baseConfig', 'supplyFilter', 'searchTermFilter', 'CommonsService',
        function ($scope, AssetsService, amountTQTFilter, timestampFilter, DTOptionsBuilder, DTColumnBuilder,
                  $uibModal, $compile, baseConfig, supplyFilter, searchTermFilter, CommonsService) {

            $scope.accountRS = CommonsService.getAccountDetailsFromSession('accountRs');

            $scope.dtOptionsAssets = DTOptionsBuilder.newOptions().withPaginationType('full_numbers')
                .withDOM('frtip')
                .withOption('info', false)
                .withOption('ordering', false)
                .withOption('serverSide', false)
                .withDataProp('accountAssets')
                .withOption('paging', true)
                .withOption('ordering', false)
                .withOption('processing', false)
                .withOption('bFilter', false).withOption('fnRowCallback',
                    function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                        $compile(nRow)($scope);
                    })
                .withOption('ajax', function (data, callback, settings) {
                    var accountId = CommonsService.getAccountDetailsFromSession('accountId');
                    AssetsService.getAccountAssets(accountId).then(function (response) {
                        callback({
                            'iTotalRecords': response.accountAssets.length,
                            'iTotalDisplayRecords': response.accountAssets.length,
                            'accountAssets': response.accountAssets
                        });
                    });
                })
                .withDisplayLength(10).withBootstrap();

            $scope.dtColumnsAssets = [

                DTColumnBuilder.newColumn('asset').withTitle('Details').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return '<button type="button" class="btn btn-success btn-xs" ng-controller="SearchCtrl"' +
                            ' ng-click="searchValue(\'' + data + '\')">' +
                            '<i class="fa fa-list-ul" aria-hidden="true" style="width:15px;"></i>' + '</button>';

                    }),
                DTColumnBuilder.newColumn('name').withTitle('Name').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return '<a ng-click="openAssetDetailsModal(\'' + row.asset +
                            '\')" ng-controller="AssetsMainCtrl"> ' + data + '</a>';
                    }),

                DTColumnBuilder.newColumn('quantityQNT').withTitle('Quantity').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return supplyFilter(data, row.decimals);
                    }),

                DTColumnBuilder.newColumn('currentQuantityQNT').withTitle('Holding').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        var p = (row.quantityQNT * 100) / row.currentQuantityQNT;
                        return p.toLocaleString('en-US', {minimumFractionDigits: 2}) + '%';
                    }),
                DTColumnBuilder.newColumn('numberOfAccounts').withTitle('Shareholders').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return data;
                    }),
                DTColumnBuilder.newColumn('numberOfTrades').withTitle('Trades').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return data;
                    }),
                DTColumnBuilder.newColumn('numberOfTransfers').withTitle('Transfers').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return data;
                    }),
                DTColumnBuilder.newColumn('asset').withTitle('Actions').notSortable()
                    .renderWith(function (data, type, row, meta) {

                        var divi_tag = true;

                        if ($scope.accountRS === row.issuerAccountRS) {
                            divi_tag = false;
                        }

                        var tt_del = ' popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover=' +
                            ' "Delete Shares"';

                        var tt_transfer = ' popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover=' +
                            ' "Transfer Assets"';

                        var tt_trade = ' popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover=' +
                            ' "Trade Desk"';

                        var tt_divi = ' popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover=' +
                            ' "Divident Payments"';

                        var del = '<button class="btn btn-default btn-xs" ' + tt_del +
                            ' ng-click="openDeleteAssetModal(\'' + data + '\',\'' + row.decimals + '\')" ng-controller="AssetsMainCtrl">' +
                            ' <i class="fa fa-times" aria-hidden="true" style="width:15px;"></i> </button>';

                        var transfer = '<button class="btn btn-default btn-xs" ' + tt_transfer +
                            ' ng-click="openTransferAssetModal(\'' + data + '\',\''  +
                            row.decimals + '\')" ng-controller="AssetsMainCtrl">' +
                            ' <i class="fa fa-user" aria-hidden="true" style="width:15px;"></i> </button>';

                        var trade = '<button class="btn btn-default btn-xs" ' + tt_trade +
                            ' ng-click="openTradeDeskModal(\'' + data + '\')" ng-controller="AssetsMainCtrl">' +
                            ' <i class="fa fa-bar-chart" aria-hidden="true" style="width:15px;"></i> </button>';

                        var divi = '<button class="btn btn-default btn-xs" ' + tt_divi +
                            ' ng-click="openDividendPaymentModal(\'' + data + '\',\'' +
                            row.decimals + '\')" ng-controller="AssetsMainCtrl" ng-disabled="' + divi_tag + '">' +
                            ' <i class="fa fa-dollar" aria-hidden="true" style="width:15px;"></i> </button>';

                        return trade + '&nbsp' + transfer + '&nbsp' + divi + '&nbsp' + del;

                    }),

            ];

            $scope.dtInstanceCallbackAssets = function (_dtInstance) {
                $scope.dtInstance = _dtInstance;
            };
            $scope.reloadAssets = function () {
                if ($scope.dtInstance) {
                    $scope.dtInstance._renderer.rerender();
                }
            };

        }]);

angular.module('assets').controller('AssetsOpenOrdersCtrl',
    ['$scope', 'AssetsService', 'amountTQTFilter', 'timestampFilter', 'DTOptionsBuilder', 'DTColumnBuilder',
        '$uibModal', '$compile', 'baseConfig', 'supplyFilter', 'searchTermFilter', 'CommonsService',
        'numberStringFilter',
        function ($scope, AssetsService, amountTQTFilter, timestampFilter, DTOptionsBuilder, DTColumnBuilder,
                  $uibModal, $compile, baseConfig, supplyFilter, searchTermFilter, CommonsService, numberStringFilter) {

            $scope.dtBidOrdersOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers')
                .withDOM('frtip')
                .withOption('info', false)
                .withOption('ordering', false)
                .withOption('serverSide', true)
                .withDataProp('bidOrders')
                .withOption('processing', true)
                .withOption('bFilter', false)
                .withOption('fnRowCallback',
                    function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                        $compile(nRow)($scope);
                    })
                .withOption('ajax', function (data, callback, settings) {
                    var accountId = CommonsService.getAccountDetailsFromSession('accountRs');
                    var endIndex = data.start + data.length - 1;
                    AssetsService.getAccountCurrentBidOrders(accountId, data.start, endIndex).then(function (response) {
                        callback({
                            'iTotalRecords': 1000,
                            'iTotalDisplayRecords': 1000,
                            'bidOrders': response.bidOrders
                        });
                    });
                })
                .withDisplayLength(10).withBootstrap();

            $scope.dtBidOrdersColumns = [

                DTColumnBuilder.newColumn('order').withTitle('Order').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return '<button type="button" class="btn btn-success btn-xs" ng-controller="SearchCtrl"' +
                            ' ng-click="searchValue(\'' + data + '\')">' +
                            '<i class="fa fa-list-ul" aria-hidden="true" style="width:15px;"></i>' + '</button>';

                    }),
                DTColumnBuilder.newColumn('name').withTitle('Asset').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return '<a ng-click="openAssetDetailsModal(\'' + row.asset +
                            '\')" ng-controller="AssetsMainCtrl"> ' + data + '</a>';
                    }),
                DTColumnBuilder.newColumn('priceTQT').withTitle('Price').notSortable()
                    .renderWith(function (data, type, row, meta) {

                        var price = data * Math.pow(10, row.decimals) / 100000000;
                        return price.toLocaleString('en-US', {minimumFractionDigits: row.decimals});

                    }),

                DTColumnBuilder.newColumn('quantityQNT').withTitle('Quantity').notSortable()
                    .renderWith(function (data, type, row, meta) {

                        var quantity = parseInt(data) / Math.pow(10, row.decimals);
                        return quantity.toLocaleString('en-US', {minimumFractionDigits: row.decimals});

                    }),


                DTColumnBuilder.newColumn('order').withTitle('Action').notSortable()
                    .renderWith(function (data, type, row, meta) {

                        var tt_desk = ' popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover=' +
                            ' "TradeDesk"';

                        var tt_cancel = ' popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover=' +
                            ' "Cancel"';

                        var cancel = '<button class="btn btn-default btn-xs"  ' + tt_cancel + ' ng-click="openCancelOrderModal(' +
                            '\'' + data + '\',' +
                            '\'' + row.asset + '\',' +
                            '\'' + row.quantityQNT + '\',' +
                            '\'' + row.priceTQT + '\',' +
                            '\'' + row.decimals + '\',' +
                            '\'bid\'' +
                            ')" ng-controller="AssetsMainCtrl"> <i class="fa fa-times" aria-hidden="true"></i> </button>';

                        var trade = '<button type="button" class="btn btn-default btn-xs"  ' + tt_desk + ' ng-controller="AssetsMainCtrl"' +
                            ' ng-click="openTradeDeskModal(\'' + row.asset +
                            '\',\'' + row.decimals + '\')">' +
                            ' <i class="fa fa-bar-chart" aria-hidden="true" style="width:15px;"></i> ' + '</button>';


                        return cancel + ' ' + trade;

                    }),
            ];

            $scope.dtBidOrdersInstanceCallback = function (_dtInstance) {
                $scope.dtInstanceBidOrder = _dtInstance;
            };

            $scope.reloadBidOrders = function () {
                if ($scope.dtInstanceBidOrder) {
                    $scope.dtInstanceBidOrder._renderer.rerender();
                }
            };


            $scope.dtAskOrdersOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers')
                .withDOM('frtip')
                .withOption('info', false)
                .withOption('ordering', false)
                .withOption('serverSide', true)
                .withDataProp('askOrders')
                .withOption('processing', true)
                .withOption('bFilter', false)
                .withOption('fnRowCallback',
                    function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                        $compile(nRow)($scope);
                    })
                .withOption('ajax', function (data, callback, settings) {
                    var accountId = CommonsService.getAccountDetailsFromSession('accountRs');
                    var endIndex = data.start + data.length - 1;
                    AssetsService.getAccountCurrentAskOrders(accountId, data.start, endIndex).then(function (response) {

                        callback({
                            'iTotalRecords': 1000,
                            'iTotalDisplayRecords': 1000,
                            'askOrders': response.askOrders
                        });
                    });
                })
                .withDisplayLength(10).withBootstrap();

            $scope.dtAskOrdersColumns = [
                DTColumnBuilder.newColumn('order').withTitle('Order').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return '<button type="button" class="btn btn-success btn-xs" ng-controller="SearchCtrl"' +
                            ' ng-click="searchValue(\'' + data + '\')">' +
                            '<i class="fa fa-list-ul" aria-hidden="true" style="width:15px;"></i>' + '</button>';

                    }),
                DTColumnBuilder.newColumn('name').withTitle('Asset').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return '<a ng-click="openAssetDetailsModal(\'' + row.asset +
                            '\')" ng-controller="AssetsMainCtrl"> ' + data + '</a>';
                    }),

                DTColumnBuilder.newColumn('priceTQT').withTitle('Price').notSortable()
                    .renderWith(function (data, type, row, meta) {

                        var price = data * Math.pow(10, row.decimals) / 100000000;
                        return price.toLocaleString('en-US', {minimumFractionDigits: row.decimals});

                    }),

                DTColumnBuilder.newColumn('quantityQNT').withTitle('Quantity').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        var quantity = parseInt(data) / Math.pow(10, row.decimals);
                        return quantity.toLocaleString('en-US', {minimumFractionDigits: row.decimals});
                    }),

                DTColumnBuilder.newColumn('order').withTitle('Action').notSortable()
                    .renderWith(function (data, type, row, meta) {


                        var tt_desk = ' popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover=' +
                            ' "TradeDesk"';

                        var tt_cancel = ' popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover=' +
                            ' "Cancel"';


                        var cancel = '<button class="btn btn-default btn-xs"  ' + tt_cancel + ' ng-click="openCancelOrderModal(' +
                            '\'' + data + '\',' +
                            '\'' + row.asset + '\',' +
                            '\'' + row.quantityQNT + '\',' +
                            '\'' + row.priceTQT + '\',' +
                            '\'' + row.decimals + '\',' +
                            '\'ask\'' +
                            ')" ng-controller="AssetsMainCtrl"> <i class="fa fa-times" aria-hidden="true" style="width:15px;"></i> </button>';

                        var trade = '<button type="button" class="btn btn-default btn-xs"  ' + tt_desk + ' ng-controller="AssetsMainCtrl"' +
                            ' ng-click="openTradeDeskModal(\'' + row.asset +
                            '\',\'' + row.decimals + '\')">' +
                            ' <i class="fa fa-bar-chart" aria-hidden="true" style="width:15px;"></i> ' + '</button>';


                        return cancel + ' ' + trade;


                    }),
            ];

            $scope.dtAskOrdersInstanceCallback = function (_dtInstance) {
                $scope.dtInstanceAskOrder = _dtInstance;
            };

            $scope.reloadAskOrders = function () {
                if ($scope.dtInstanceAskOrder) {
                    $scope.dtInstanceAskOrder._renderer.rerender();
                }
            };


        }]);

angular.module('assets').controller('AssetsFormCtrl',
    ['$scope', '$uibModalInstance', 'params', function ($scope, $uibModalInstance, params) {

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.$on('close-modal', function () {
            $uibModalInstance.dismiss('cancel');
        });

        var issueAssetSteps = [
            {
                templateUrl: 'assets/modals/issue-asset-details.html',
                title: 'Issue Asset Details',
                controller: 'IssueAssetFormController',
                isolatedScope: true,
            },
            {
                templateUrl: 'assets/modals/issue-asset-confirm.html',
                title: 'Issue Asset Confirmation',
                controller: 'IssueAssetFormController',
                isolatedScope: true,
            },
        ];

        var deleteAssetSteps = [
            {
                templateUrl: 'assets/modals/delete-asset-details.html',
                title: 'Delete Asset Details',
                controller: 'DeleteAssetFormController',
                isolatedScope: true,
                data: params,
            },
            {
                templateUrl: 'assets/modals/delete-asset-confirm.html',
                title: 'Delete Asset Confirmation',
                controller: 'DeleteAssetFormController',
                isolatedScope: true,
            },
        ];

        var placeOrderSteps = [
            {
                templateUrl: 'assets/modals/place-order-confirm.html',
                title: 'Place Order Confirmation',
                controller: 'PlaceOrderFormController',
                isolatedScope: true,
                data: params,
            },
        ];

        var tradeDeskSteps = [
            {
                templateUrl: 'assets/modals/trade-desk-details.html',
                title: 'PLace Order Details',
                controller: 'TradeDeskInputController',
                isolatedScope: true,
                data: params,
            }
        ];

        var searchAssetSteps = [
            {
                templateUrl: 'assets/modals/search-asset-details.html',
                title: 'Search Asset Details',
                controller: 'SearchAssetFormCtrl',
                isolatedScope: true,
                data: params,
            },
            {
                templateUrl: 'assets/modals/search-asset-confirm.html',
                title: 'Search Asset Results',
                controller: 'SearchAssetFormCtrl',
                isolatedScope: true,
            },
        ];

        var expectedOrderSteps = [
            {
                templateUrl: 'assets/modals/expected-order-details.html',
                title: 'Expected Order Details',
                controller: 'ExpectedOrderFormCtrl',
                isolatedScope: true,
                data: params,
            },
            {
                templateUrl: 'assets/modals/expected-order-confirm.html',
                title: 'Expected Order Results',
                controller: 'ExpectedOrderFormCtrl',
                isolatedScope: true,
            },
        ];


        var expectedTransfersSteps = [
            {
                templateUrl: 'assets/modals/expected-transfers-confirm.html',
                title: 'Expected Asset Transfers',
                controller: 'ExpectedAssetTransfersFormCtrl',
                isolatedScope: true,
            },
        ];

        var orderTradesSteps = [
            {
                templateUrl: 'assets/modals/order-trades-details.html',
                title: 'Order Trade Details',
                controller: 'OrderTradesFormCtrl',
                isolatedScope: true,
                data: params,
            },
            {
                templateUrl: 'assets/modals/order-trades-confirm.html',
                title: 'Order Trade  Results',
                controller: 'OrderTradesFormCtrl',
                isolatedScope: true,
            },
        ];

        var expectedDeletesSteps = [
            {
                templateUrl: 'assets/modals/expected-deletes-confirm.html',
                title: 'Expected Asset Deletes',
                controller: 'ExpectedAssetDeletesFormCtrl',
                isolatedScope: true,
            },
        ];

        var expectedCancellationsSteps = [
            {
                templateUrl: 'assets/modals/expected-cancellations-confirm.html',
                title: 'Expected Order Cancellation',
                controller: 'ExpectedOrderCancellationFormCtrl',
                isolatedScope: true,
            },
        ];

        var cancelOrderSteps = [
            {
                templateUrl: 'assets/modals/cancel-order-confirm.html',
                title: 'Cancel Order Confirmation',
                controller: 'CancelOrderFormController',
                isolatedScope: true,
                data: params
            },
        ];

        var transferAssetSteps = [
            {
                templateUrl: 'assets/modals/transfer-asset-details.html',
                title: 'Transfer Asset Details',
                controller: 'TransferAssetFormController',
                isolatedScope: true,
                data: params,
            },
            {
                templateUrl: 'assets/modals/transfer-asset-confirm.html',
                title: 'Transfer Asset Confirmation',
                controller: 'TransferAssetFormController',
                isolatedScope: true,
            },
        ];

        var sendAssetSteps = [
            {
                templateUrl: 'assets/modals/send-asset-details.html',
                title: 'Send Asset Details',
                controller: 'TransferAssetFormController',
                isolatedScope: true,
                data: params,
            },
            {
                templateUrl: 'assets/modals/send-asset-confirm.html',
                title: 'Send Asset Confirmation',
                controller: 'TransferAssetFormController',
                isolatedScope: true,
            },
        ];

        var dividendPaymentSteps = [
            {
                templateUrl: 'assets/modals/dividend-payment-details.html',
                title: 'Dividend Payment Details',
                controller: 'DividendPaymentFormController',
                isolatedScope: true,
                data: params,
            },
            {
                templateUrl: 'assets/modals/dividend-payment-confirm.html',
                title: 'Dividend Payment Confirmation',
                controller: 'DividendPaymentFormController',
                isolatedScope: true,
            },
        ];


        $scope.steps = {};

        $scope.steps.issueAssetForm = issueAssetSteps;
        $scope.steps.deleteAssetForm = deleteAssetSteps;
        $scope.steps.placeOrderForm = placeOrderSteps;
        $scope.steps.tradeDeskForm = tradeDeskSteps;
        $scope.steps.searchAssetForm = searchAssetSteps;
        $scope.steps.expectedOrderForm = expectedOrderSteps;
        $scope.steps.expectedCancellationForm = expectedCancellationsSteps;
        $scope.steps.expectedTransfersForm = expectedTransfersSteps;
        $scope.steps.orderTradesForm = orderTradesSteps;
        $scope.steps.expectedDeletesForm = expectedDeletesSteps;
        $scope.steps.cancelOrderForm = cancelOrderSteps;
        $scope.steps.transferAssetForm = transferAssetSteps;
        $scope.steps.sendAssetForm = sendAssetSteps;
        $scope.steps.dividendPaymentForm = dividendPaymentSteps;

    }]);

angular.module('assets').controller('AllTradesCtrl',
    ['$scope', 'AssetsService', 'amountTQTFilter', 'timestampFilter', 'DTOptionsBuilder', 'DTColumnBuilder',
        '$uibModal', '$compile', 'baseConfig', 'supplyFilter', 'searchTermFilter', 'CommonsService', 'buysellFilter',
        'numericalStringFilter', 'numberStringFilter',
        function ($scope, AssetsService, amountTQTFilter, timestampFilter, DTOptionsBuilder, DTColumnBuilder,
                  $uibModal, $compile, baseConfig, supplyFilter, searchTermFilter, CommonsService, buysellFilter,
                  numericalStringFilter, numberStringFilter) {

            $scope.dtOptionsLastTrades = DTOptionsBuilder.newOptions().withPaginationType('full_numbers')
                .withDOM('frtip')
                .withOption('info', false)
                .withOption('ordering', false)
                .withOption('serverSide', false)
                .withDataProp('lastTrades')
                .withOption('paging', true)
                .withOption('processing', false)
                .withOption('bFilter', false).withOption('fnRowCallback',
                    function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                        $compile(nRow)($scope);
                    })
                .withOption('ajax', function (data, callback, settings) {
                    var endIndex = data.start + data.length - 1;
                    AssetsService.getAllTrades(data.start, endIndex).then(function (response) {
                        callback({
                            'iTotalRecords': response.trades.length,
                            'iTotalDisplayRecords': response.trades.length,
                            'lastTrades': response.trades
                        });
                    });
                })
                .withDisplayLength(10).withBootstrap();

            $scope.dtColumnsLastTrades = [

                DTColumnBuilder.newColumn('askOrder').withTitle('Details').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        var orderType = row.askOrder;
                        if (row.tradeType === 'buy') {
                            orderType = row.bidOrder;
                        }
                        return '<button type="button" class="btn btn-success btn-xs" ng-controller="SearchCtrl"' +
                            ' ng-click="searchValue(\'' + orderType + '\')">' +
                            '<i class="fa fa-list-ul" aria-hidden="true" style="width:15px;"></i>' + '</button>';
                    }),

                DTColumnBuilder.newColumn('name').withTitle('Name').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return '<a ng-click="openAssetDetailsModal(\'' + row.asset +
                            '\')" ng-controller="AssetsMainCtrl"> ' + data + '</a>';

                    }),

                DTColumnBuilder.newColumn('timestamp').withTitle('Date').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return timestampFilter(data);
                    }),

                DTColumnBuilder.newColumn('tradeType').withTitle('Type').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return buysellFilter(data);
                    }),

                DTColumnBuilder.newColumn('buyerRS').withTitle('Buyer').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return searchTermFilter(data);
                    }),

                DTColumnBuilder.newColumn('sellerRS').withTitle('Seller').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return searchTermFilter(data);
                    }),

                DTColumnBuilder.newColumn('priceTQT').withTitle('Price').notSortable()
                    .renderWith(function (data, type, row, meta) {

                        var price = data * Math.pow(10, row.decimals) / 100000000;
                        return price.toLocaleString('en-US', {minimumFractionDigits: row.decimals});

                    }),

                DTColumnBuilder.newColumn('quantityQNT').withTitle('Quantity').notSortable()
                    .renderWith(function (data, type, row, meta) {

                        var quantity = parseInt(data) / Math.pow(10, row.decimals);
                        return quantity.toLocaleString('en-US', {minimumFractionDigits: row.decimals});

                    }),

                DTColumnBuilder.newColumn('asset').withTitle('Action').notSortable()
                    .renderWith(function (data, type, row, meta) {

                        var tt_desk = ' popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover=' +
                            ' "TradeDesk"';

                        return '<button type="button" class="btn btn-default btn-xs"  ' + tt_desk + ' ng-controller="AssetsMainCtrl"' +
                            ' ng-click="openTradeDeskModal(\'' + data +
                            '\',\'' + row.decimals + '\')">' +
                            ' <i class="fa fa-bar-chart" aria-hidden="true" style="width:15px;"></i> ' + '</button>';
                    })


            ];

            $scope.dtInstanceCallbackLastTrades = function (_dtInstance) {
                $scope.dtInstance = _dtInstance;
            };
            $scope.reloadLastTrades = function () {
                if ($scope.dtInstance) {
                    $scope.dtInstance._renderer.rerender();
                }
            };

        }]);

angular.module('assets').controller('AssetDetailsCtrl',
    ['$scope', 'AssetsService', 'amountTQTFilter', 'timestampFilter', 'DTOptionsBuilder', 'DTColumnBuilder',
        '$uibModal', '$compile', 'baseConfig', 'supplyFilter', 'searchTermFilter', 'CommonsService', 'params',
        '$uibModalInstance',
        function ($scope, AssetsService, amountTQTFilter, timestampFilter, DTOptionsBuilder, DTColumnBuilder,
                  $uibModal, $compile, baseConfig, supplyFilter, searchTermFilter, CommonsService, params,
                  $uibModalInstance) {

            $scope.initAssetDetails = function () {
                AssetsService.getAsset(params.assetId, true).then(function (success) {
                    $scope.assetDetails = success;
                }, function (error) {
                });
            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };

        }]);

angular.module('assets').controller('MyTransfersCtrl',
    ['$scope', 'AssetsService', 'amountTQTFilter', 'timestampFilter', 'DTOptionsBuilder', 'DTColumnBuilder',
        '$uibModal', '$compile', 'baseConfig', 'supplyFilter', 'searchTermFilter', 'CommonsService', 'buysellFilter',
        'numericalStringFilter', 'numberStringFilter', 'AccountService',
        function ($scope, AssetsService, amountTQTFilter, timestampFilter, DTOptionsBuilder, DTColumnBuilder,
                  $uibModal, $compile, baseConfig, supplyFilter, searchTermFilter, CommonsService, buysellFilter,
                  numericalStringFilter, numberStringFilter, AccountService) {

            $scope.dtOptionsLastTransfers = DTOptionsBuilder.newOptions().withPaginationType('full_numbers')
                .withDOM('frtip')
                .withOption('info', false)
                .withOption('ordering', false)
                .withOption('serverSide', false)
                .withDataProp('lastTransfers')
                .withOption('paging', true)
                .withOption('processing', false)
                .withOption('bFilter', false).withOption('fnRowCallback',
                    function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                        $compile(nRow)($scope);
                    })
                .withOption('ajax', function (data, callback, settings) {
                    var accountRS = AccountService.getAccountDetailsFromSession('accountRs');
                    var endIndex = data.start + data.length - 1;
                    AssetsService.getAllLastTransfers(accountRS, data.start, endIndex).then(function (response) {
                        callback({
                            'iTotalRecords': response.transfers.length,
                            'iTotalDisplayRecords': response.transfers.length,
                            'lastTransfers': response.transfers
                        });
                    });
                })
                .withDisplayLength(10).withBootstrap();

            $scope.dtColumnsLastTransfers = [

                DTColumnBuilder.newColumn('assetTransfer').withTitle('Details').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return '<button type="button" class="btn btn-success btn-xs" ng-controller="SearchCtrl"' +
                            ' ng-click="searchValue(\'' + data + '\')">' +
                            '<i class="fa fa-list-ul" aria-hidden="true" style="width:15px;"></i>' + '</button>';
                    }),
                DTColumnBuilder.newColumn('timestamp').withTitle('Date').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return timestampFilter(data);
                    }),
                DTColumnBuilder.newColumn('name').withTitle('Name').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return '<a ng-click="openAssetDetailsModal(\'' + row.asset +
                            '\')" ng-controller="AssetsMainCtrl"> ' + data + '</a>';

                    }),
                DTColumnBuilder.newColumn('quantityQNT').withTitle('Quantity').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return supplyFilter(data, row.decimals);
                    }),
                DTColumnBuilder.newColumn('recipientRS').withTitle('Recipient').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return searchTermFilter(data);
                    }),


                DTColumnBuilder.newColumn('asset').withTitle('Action').notSortable()
                    .renderWith(function (data, type, row, meta) {

                        var tt_desk = ' popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover=' +
                            ' "TradeDesk"';

                        return '<button type="button" class="btn btn-default btn-xs"  ' + tt_desk + ' ng-controller="AssetsMainCtrl"' +
                            ' ng-click="openTradeDeskModal(\'' + data +
                            '\',\'' + row.decimals + '\')">' +
                            ' <i class="fa fa-bar-chart" aria-hidden="true" style="width:15px;"></i> ' + '</button>';
                    })
            ];

            $scope.dtInstanceCallbackLastTransfers = function (_dtInstance) {
                $scope.dtInstance = _dtInstance;
            };
            $scope.reloadLastTransfers = function () {
                if ($scope.dtInstance) {
                    $scope.dtInstance._renderer.rerender();
                }
            };

        }]);

angular.module('assets').controller('MytradesCtrl',
    ['$scope', 'AssetsService', 'amountTQTFilter', 'timestampFilter', 'DTOptionsBuilder', 'DTColumnBuilder',
        '$uibModal', '$compile', 'baseConfig', 'supplyFilter', 'searchTermFilter', 'CommonsService', 'buysellFilter',
        'numericalStringFilter', 'numberStringFilter', 'AccountService',
        function ($scope, AssetsService, amountTQTFilter, timestampFilter, DTOptionsBuilder, DTColumnBuilder,
                  $uibModal, $compile, baseConfig, supplyFilter, searchTermFilter, CommonsService, buysellFilter,
                  numericalStringFilter, numberStringFilter, AccountService) {

            $scope.dtOptionsMyTrades = DTOptionsBuilder.newOptions().withPaginationType('full_numbers')
                .withDOM('frtip')
                .withOption('info', false)
                .withOption('ordering', false)
                .withOption('serverSide', false)
                .withDataProp('mytrades')
                .withOption('paging', true)
                .withOption('processing', false)
                .withOption('bFilter', false).withOption('fnRowCallback',
                    function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                        $compile(nRow)($scope);
                    })
                .withOption('ajax', function (data, callback, settings) {
                    var accountRS = AccountService.getAccountDetailsFromSession('accountRs');
                    var endIndex = data.start + data.length - 1;
                    AssetsService.getMyTrades(accountRS, data.start, endIndex).then(function (response) {

                        callback({
                            'iTotalRecords': response.trades.length,
                            'iTotalDisplayRecords': response.trades.length,
                            'mytrades': response.trades
                        });
                    });
                })
                .withDisplayLength(10).withBootstrap();

            $scope.dtColumnsMyTrades = [

                DTColumnBuilder.newColumn('askOrder').withTitle('Details').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        var orderType = row.askOrder;
                        if (row.tradeType === 'buy') {
                            orderType = row.bidOrder;
                        }
                        return '<button type="button" class="btn btn-success btn-xs" ng-controller="SearchCtrl"' +
                            ' ng-click="searchValue(\'' + orderType + '\')">' +
                            '<i class="fa fa-list-ul" aria-hidden="true" style="width:15px;"></i>' + '</button>';
                    }),

                DTColumnBuilder.newColumn('name').withTitle('Name').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return '<a ng-click="openAssetDetailsModal(\'' + row.asset +
                            '\')" ng-controller="AssetsMainCtrl"> ' + data + '</a>';

                    }),

                DTColumnBuilder.newColumn('timestamp').withTitle('Date').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return timestampFilter(data);
                    }),

                DTColumnBuilder.newColumn('tradeType').withTitle('Type').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return buysellFilter(data);
                    }),


                DTColumnBuilder.newColumn('buyerRS').withTitle('Buyer').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return searchTermFilter(data);
                    }),

                DTColumnBuilder.newColumn('sellerRS').withTitle('Seller').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return searchTermFilter(data);
                    }),

                DTColumnBuilder.newColumn('priceTQT').withTitle('Price').notSortable()
                    .renderWith(function (data, type, row, meta) {

                        var price = data * Math.pow(10, row.decimals) / 100000000;
                        return price.toLocaleString('en-US', {minimumFractionDigits: row.decimals});

                    }),

                DTColumnBuilder.newColumn('quantityQNT').withTitle('Quantity').notSortable()
                    .renderWith(function (data, type, row, meta) {

                        var quantity = parseInt(data) / Math.pow(10, row.decimals);
                        return quantity.toLocaleString('en-US', {minimumFractionDigits: row.decimals});

                    }),

                DTColumnBuilder.newColumn('asset').withTitle('Action').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return '<button type="button" class="btn btn-default btn-xs" ng-controller="AssetsMainCtrl"' +
                            ' ng-click="openTradeDeskModal(\'' + data +
                            '\',\'' + row.decimals + '\')">' +
                            ' <i class="fa fa-bar-chart" aria-hidden="true" style="width:15px;"></i> ' + '</button>';
                    })


            ];

            $scope.dtInstanceCallbackMyTrades = function (_dtInstance) {
                $scope.dtInstance = _dtInstance;
            };
            $scope.reloadMyTrades = function () {
                if ($scope.dtInstance) {
                    $scope.dtInstance._renderer.rerender();
                }
            };

        }]);

angular.module('assets').controller('DividendsDetailsCtrl',
    ['$scope', 'AssetsService', 'amountTQTFilter', 'timestampFilter', 'DTOptionsBuilder', 'DTColumnBuilder',
        '$uibModal', '$compile', 'baseConfig', 'supplyFilter', 'searchTermFilter', 'CommonsService', 'buysellFilter',
        'numericalStringFilter', 'numberStringFilter', 'AccountService', 'params', '$uibModalInstance',
        function ($scope, AssetsService, amountTQTFilter, timestampFilter, DTOptionsBuilder, DTColumnBuilder,
                  $uibModal, $compile, baseConfig, supplyFilter, searchTermFilter, CommonsService, buysellFilter,
                  numericalStringFilter, numberStringFilter, AccountService, params, $uibModalInstance) {

            $scope.dtOptionsDividendsDetails = DTOptionsBuilder.newOptions().withPaginationType('full_numbers')
                .withDOM('frtip')
                .withOption('info', false)
                .withOption('ordering', false)
                .withOption('serverSide', false)
                .withDataProp('data')
                .withOption('paging', true)
                .withOption('processing', false)
                .withOption('bFilter', false).withOption('fnRowCallback',
                    function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                        $compile(nRow)($scope);
                    })
                .withOption('ajax', function (data, callback, settings) {
                    var endIndex = data.start + data.length - 1;
                    AssetsService.getDividendsHistory(params.assetId, data.start, endIndex,'').then(function (response) {

                        callback({
                            'iTotalRecords': response.dividends.length,
                            'iTotalDisplayRecords': response.dividends.length,
                            'data': response.dividends
                        });
                    });
                })
                .withDisplayLength(5).withBootstrap();

            $scope.dtColumnsDividendsDetails = [

              DTColumnBuilder.newColumn('assetDividend').withTitle('Details').notSortable()
                  .renderWith(function (data, type, row, meta) {
                      return '<button type="button" class="btn btn-success btn-xs" ng-controller="SearchCtrl"' +
                          ' ng-click="searchValue(\'' + data + '\')">' +
                          '<i class="fa fa-list-ul" aria-hidden="true" style="width:15px;"></i>' + '</button>';

                  }),

              DTColumnBuilder.newColumn('dividendHeight').withTitle('Height').notSortable()
                  .renderWith(function (data, type, row, meta) {
                      return  data;

                  }),

              DTColumnBuilder.newColumn('timestamp').withTitle('Date').notSortable()
                  .renderWith(function (data, type, row, meta) {
                      return  timestampFilter(data);

                  }),

              DTColumnBuilder.newColumn('numberOfAccounts').withTitle('Accounts').notSortable()
                  .renderWith(function (data, type, row, meta) {
                      return  data;

                  }),

              DTColumnBuilder.newColumn('totalDividend').withTitle('Amount').notSortable()
                  .renderWith(function (data, type, row, meta) {
                      return  parseInt(data / 100000000);

                  }),

            ];

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };

            $scope.dtInstanceCallbackDividendsDetails = function (_dtInstance) {
                $scope.dtInstance = _dtInstance;
            };


        }]);
