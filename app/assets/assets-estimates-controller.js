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

angular.module('assets').controller('ExpectedOrderFormCtrl',
    ['$scope', 'AssetsService', 'SessionStorageService', '$state', 'DTOptionsBuilder',
        'DTColumnBuilder', 'searchTermFilter', '$compile', 'multiStepFormScope', '$validation', 'supplyFilter',
        'numericalStringFilter', 'quantToAmountFilter', 'quantityToShareFilter', '$q', 'AlertService', 'alertConfig',
        function ($scope, AssetsService, SessionStorageService, $state, DTOptionsBuilder,
                  DTColumnBuilder, searchTermFilter, $compile, multiStepFormScope, $validation, supplyFilter,
                  numericalStringFilter, quantToAmountFilter, quantityToShareFilter, $q, AlertService, alertConfig) {

            $scope.expectedOrderForm = {};

            var addedUnknown = false;

            $scope.onSubmit = function () {
                $validation.validate($scope.expectedOrderForm);

                if ($scope.expectedOrderForm.$valid) {
                    $scope.nextStep();
                }
            };

            $scope.nextStep = function () {
                var assetId = $scope.expectedOrderForm.asset;
                AssetsService.getAsset(assetId).then(function (success) {
                    if (success.asset) {
                        $scope.$nextStep();
                    } else {
                        if (!addedUnknown) {
                            addAlert(success);
                            addedUnknown = true;
                        }
                    }
                }, function (error) {
                    addAlert(error);
                });
            };

            function addAlert(errorResponse) {
                AlertService.addAlert(
                    {
                        type: 'danger',
                        msg: 'Sorry, an error occured! Reason: ' + errorResponse.errorDescription
                    }, alertConfig.expectedAssetOrderModalAlert
                );
            }

            $scope.expectedOrderForm = angular.copy(multiStepFormScope.expectedOrderForm);

            $scope.$on('$destroy', function () {
                multiStepFormScope.expectedOrderForm = angular.copy($scope.expectedOrderForm);
            });

            $scope.dtAskOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers')
                .withDOM('frtip')
                .withOption('serverSide', false)
                .withDataProp('askOrders')
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
                    var asset = $scope.expectedOrderForm.asset;
                    var assetDetailsPromise = AssetsService.getAsset(asset, true);
                    var expectedAskOrdersPromise = AssetsService.getExpectedAskOrders(asset);
                    $q.all([assetDetailsPromise, expectedAskOrdersPromise]).then(function (response) {
                        $scope.decimals = response[0].decimals;
                        callback({
                            'iTotalRecords': response[1].askOrders.length,
                            'iTotalDisplayRecords': response[1].askOrders.length,
                            'askOrders': response[1].askOrders
                        });

                    });
                })
                .withDisplayLength(5).withBootstrap();

            $scope.dtAskColumns = [
                DTColumnBuilder.newColumn('priceTQT').withTitle('Price per share').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return numericalStringFilter(Math.pow(10, $scope.decimals) * quantToAmountFilter(data));
                    }),

                DTColumnBuilder.newColumn('quantityQNT').withTitle('Quantity').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return numericalStringFilter(quantityToShareFilter(data, $scope.decimals));
                    }),

                DTColumnBuilder.newColumn('priceTQT').withTitle('Sum').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return numericalStringFilter(quantToAmountFilter(data) * (row.quantityQNT));
                    }),

            ];

            $scope.dtAskInstanceCallback = function (_dtInstance) {
                $scope.dtInstance = _dtInstance;
            };

            $scope.dtBidOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers')
                .withDOM('frtip')
                .withOption('serverSide', false)
                .withDataProp('bidOrders')
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
                    var asset = $scope.expectedOrderForm.asset;
                    var assetDetailsPromise = AssetsService.getAsset(asset, true);
                    var expectedBidOrdersPromise = AssetsService.getExpectedBidOrders(asset);
                    $q.all([assetDetailsPromise, expectedBidOrdersPromise]).then(function (response) {
                        $scope.decimals = response[0].decimals;
                        callback({
                            'iTotalRecords': response[1].bidOrders.length,
                            'iTotalDisplayRecords': response[1].bidOrders.length,
                            'bidOrders': response[1].bidOrders
                        });
                    });
                })
                .withDisplayLength(10).withBootstrap();

            $scope.dtBidColumns = [
                DTColumnBuilder.newColumn('priceTQT').withTitle('Price per share').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return numericalStringFilter(Math.pow(10, $scope.decimals) * quantToAmountFilter(data));
                    }),

                DTColumnBuilder.newColumn('quantityQNT').withTitle('Quantity').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return numericalStringFilter(quantityToShareFilter(data, $scope.decimals));
                    }),

                DTColumnBuilder.newColumn('priceTQT').withTitle('Sum').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return numericalStringFilter(quantToAmountFilter(data) * (row.quantityQNT));
                    }),

            ];

            $scope.dtBidInstanceCallback = function (_dtInstance) {
                $scope.dtInstance = _dtInstance;
            };

        }]);

angular.module('assets').controller('ExpectedOrderCancellationFormCtrl',
    ['$scope', 'AssetsService', 'SessionStorageService', '$state', 'DTOptionsBuilder',
        'DTColumnBuilder', 'searchTermFilter', '$compile', 'multiStepFormScope', '$validation', 'supplyFilter',
        'numericalStringFilter', 'quantToAmountFilter', 'quantityToShareFilter', '$q',
        function ($scope, AssetsService, SessionStorageService, $state, DTOptionsBuilder,
                  DTColumnBuilder, searchTermFilter, $compile, multiStepFormScope, $validation, supplyFilter,
                  numericalStringFilter, quantToAmountFilter, quantityToShareFilter, $q) {

            $scope.expectedOrderCancellationForm = {};

            $scope.onSubmit = function () {
                $validation.validate($scope.expectedOrderCancellationForm);
                if ($scope.expectedOrderCancellationForm.$valid) {
                    $scope.$nextStep();
                }
            };

            $scope.expectedOrderCancellationForm = angular.copy(multiStepFormScope.expectedOrderCancellationForm);

            $scope.$on('$destroy', function () {
                multiStepFormScope.expectedOrderCancellationForm = angular.copy($scope.expectedOrderCancellationForm);
            });

            $scope.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers')
                .withDOM('frtip')
                .withOption('serverSide', false)
                .withDataProp('orderCancellations')
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
                    var expectedAskOrdersPromise = AssetsService.getExpectedOrderCancellations();
                    $q.all([expectedAskOrdersPromise]).then(function (response) {
                        callback({
                            'iTotalRecords': response[0].orderCancellations.length,
                            'iTotalDisplayRecords': response[0].orderCancellations.length,
                            'orderCancellations': response[0].orderCancellations
                        });
                    });
                })
                .withDisplayLength(10).withBootstrap();

            $scope.dtColumns = [
                DTColumnBuilder.newColumn('accountRS').withTitle('Account').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return searchTermFilter(data);
                    }),

                DTColumnBuilder.newColumn('order').withTitle('Order').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return searchTermFilter(data);
                    }),


            ];

            $scope.dtInstanceCallback = function (_dtInstance) {
                $scope.dtInstance = _dtInstance;
            };
        }]);

angular.module('assets').controller('ExpectedAssetTransfersFormCtrl',
    ['$scope', 'AssetsService', 'SessionStorageService', '$state', 'DTOptionsBuilder',
        'DTColumnBuilder', 'searchTermFilter', '$compile', 'multiStepFormScope', '$validation', 'supplyFilter',
        'numericalStringFilter', 'quantToAmountFilter', 'quantityToShareFilter', '$q', '$uibModal', 'timestampFilter',
        function ($scope, AssetsService, SessionStorageService, $state, DTOptionsBuilder,
                  DTColumnBuilder, searchTermFilter, $compile, multiStepFormScope, $validation, supplyFilter,
                  numericalStringFilter, quantToAmountFilter, quantityToShareFilter, $q, $uibModal, timestampFilter) {

            $scope.expectedTransfersForm = {};

            $scope.onSubmit = function () {
                $validation.validate($scope.expectedTransfersForm);
                if ($scope.expectedTransfersForm.$valid) {
                    $scope.$nextStep();
                }
            };

            $scope.expectedTransfersForm = angular.copy(multiStepFormScope.expectedTransfersForm);

            $scope.$on('$destroy', function () {
                multiStepFormScope.expectedTransfersForm = angular.copy($scope.expectedTransfersForm);
            });

            $scope.openAddressBookModal = function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'addressbook/views/addressbook-light.html',
                    controller: 'AddressBookCtrl',
                    resolve: {
                        params: function () {
                            return {
                                'closeOnClick': true
                            };
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    $scope.expectedTransfersForm.recipientRS = result.accountRS;
                });
            };


            $scope.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers')
                .withDOM('frtip')
                .withOption('serverSide', false)
                .withDataProp('transfers')
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

                    AssetsService.getExpectedAssetTransfers().then(function (response) {
                        callback({
                            'iTotalRecords': response.transfers.length,
                            'iTotalDisplayRecords': response.transfers.length,
                            'transfers': response.transfers
                        });
                    });
                })
                .withDisplayLength(10).withBootstrap();

            $scope.dtColumns = [

                DTColumnBuilder.newColumn('name').withTitle('Asset').notSortable()
                .renderWith(function (data, type, row, meta) {
                    return '<a ng-click="openAssetDetailsModal(\'' + row.asset +
                        '\')" ng-controller="AssetsMainCtrl"> ' + data + '</a>';
                }),

                DTColumnBuilder.newColumn('senderRS').withTitle('Sender').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return searchTermFilter(data);
                    }),
                DTColumnBuilder.newColumn('recipientRS').withTitle('Recipient').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return searchTermFilter(data);
                    }),


                DTColumnBuilder.newColumn('quantityQNT').withTitle('Quantity').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return numericalStringFilter(quantityToShareFilter(data, row.decimals));
                    }),


            ];

            $scope.dtInstanceCallback = function (_dtInstance) {
                $scope.dtInstance = _dtInstance;
            };
        }]);

angular.module('assets').controller('OrderTradesFormCtrl',
    ['$scope', 'AssetsService', 'SessionStorageService', '$state', 'DTOptionsBuilder',
        'DTColumnBuilder', 'searchTermFilter', '$compile', 'multiStepFormScope', '$validation', 'supplyFilter',
        'numericalStringFilter', 'quantToAmountFilter', 'quantityToShareFilter', '$q', '$uibModal', 'timestampFilter',
        'buysellFilter',
        function ($scope, AssetsService, SessionStorageService, $state, DTOptionsBuilder,
                  DTColumnBuilder, searchTermFilter, $compile, multiStepFormScope, $validation, supplyFilter,
                  numericalStringFilter, quantToAmountFilter, quantityToShareFilter, $q, $uibModal, timestampFilter,
                  buysellFilter) {

            $scope.orderTradesForm = {};

            $scope.onSubmit = function () {
                $validation.validate($scope.orderTradesForm);
                if ($scope.orderTradesForm.$valid) {
                    $scope.$nextStep();
                }
            };

            $scope.orderTradesForm = angular.copy(multiStepFormScope.orderTradesForm);

            $scope.$on('$destroy', function () {
                multiStepFormScope.orderTradesForm = angular.copy($scope.orderTradesForm);
            });

            $scope.openAddressBookModal = function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'addressbook/views/addressbook-light.html',
                    controller: 'AddressBookCtrl',
                    resolve: {
                        params: function () {
                            return {
                                'closeOnClick': true
                            };
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    $scope.orderTradesForm.recipientRS = result.accountRS;
                });
            };


            $scope.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers')
                .withDOM('frtip')
                .withOption('serverSide', false)
                .withDataProp('trades')
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
                    var orderid = $scope.orderTradesForm.orderid;
                    var bidOrderTrades = AssetsService.getBidOrderTrades(orderid);
                    var askOrderTrades = AssetsService.getAskOrderTrades(orderid);
                    $q.all([bidOrderTrades, askOrderTrades]).then(function (success) {
                        var bidOrders = success[0];
                        var askOrders = success[1];
                        var allTrades = {};
                        allTrades.trades = [];
                        if (!bidOrders.errorCode && bidOrders.trades.length > 0) {
                            allTrades.trades = allTrades.trades.concat(bidOrders.trades);
                        }
                        if (!askOrders.errorCode && askOrders.trades.length > 0) {
                            allTrades.trades = allTrades.trades.concat(askOrders.trades);
                        }
                        callback({
                            'iTotalRecords': allTrades.trades.length,
                            'iTotalDisplayRecords': allTrades.trades.length,
                            'trades': allTrades.trades
                        });
                    });

                })
                .withDisplayLength(5).withBootstrap();

            $scope.dtColumns = [
                DTColumnBuilder.newColumn('askOrder').withTitle('Details').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        var orderType = row.askOrder;
                        if (row.tradeType === 'buy') {
                            orderType = row.bidOrder;
                        }
                        return '<button type="button" class="btn btn-success btn-xs" ng-controller="SearchCtrl"' +
                            ' ng-click="searchValue(\'' + orderType + '\')">' +
                            '<i class="fa fa-list-ul" aria-hidden="true"></i>' + '</button>';
                    }),

                DTColumnBuilder.newColumn('timestamp').withTitle('Date').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return timestampFilter(data);
                    }),

                DTColumnBuilder.newColumn('quantityQNT').withTitle('Quantity').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        var quantity = parseInt(data) / Math.pow(10, row.decimals);
                        return quantity.toLocaleString('en-US', {minimumFractionDigits: row.decimals});
                    }),
                DTColumnBuilder.newColumn('priceTQT').withTitle('Price').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        var price = parseInt(data) * Math.pow(10, row.decimals) / 100000000;
                        return price.toLocaleString('en-US', {minimumFractionDigits: row.decimals});
                    }),


                DTColumnBuilder.newColumn('tradeType').withTitle('Type').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return buysellFilter(data);
                    }),
            ];

            $scope.dtInstanceCallback = function (_dtInstance) {
                $scope.dtInstance = _dtInstance;
            };
        }]);

angular.module('assets').controller('ExpectedAssetDeletesFormCtrl',
    ['$scope', 'AssetsService', 'SessionStorageService', '$state', 'DTOptionsBuilder',
        'DTColumnBuilder', 'searchTermFilter', '$compile', 'multiStepFormScope', '$validation', 'supplyFilter',
        'numericalStringFilter', 'quantToAmountFilter', 'quantityToShareFilter', '$q', '$uibModal', 'timestampFilter',
        function ($scope, AssetsService, SessionStorageService, $state, DTOptionsBuilder,
                  DTColumnBuilder, searchTermFilter, $compile, multiStepFormScope, $validation, supplyFilter,
                  numericalStringFilter, quantToAmountFilter, quantityToShareFilter, $q, $uibModal, timestampFilter) {

            $scope.expectedDeletesForm = {};

            $scope.onSubmit = function () {
                $validation.validate($scope.expectedDeletesForm);
                if ($scope.expectedDeletesForm.$valid) {
                    $scope.$nextStep();
                }
            };

            $scope.expectedDeletesForm = angular.copy(multiStepFormScope.expectedDeletesForm);

            $scope.$on('$destroy', function () {
                multiStepFormScope.expectedDeletesForm = angular.copy($scope.expectedDeletesForm);
            });

            $scope.openAddressBookModal = function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'addressbook/views/addressbook-light.html',
                    controller: 'AddressBookCtrl',
                    resolve: {
                        params: function () {
                            return {
                                'closeOnClick': true
                            };
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    $scope.expectedDeletesForm.recipientRS = result.accountRS;
                });
            };

            $scope.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers')
                .withDOM('frtip')
                .withOption('serverSide', false)
                .withDataProp('deletes')
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
                    AssetsService.getExpectedAssetDeletes().then(function (response) {
                        callback({
                            'iTotalRecords': response.deletes.length,
                            'iTotalDisplayRecords': response.deletes.length,
                            'deletes': response.deletes
                        });
                    });
                })
                .withDisplayLength(10).withBootstrap();

            $scope.dtColumns = [

                DTColumnBuilder.newColumn('name').withTitle('Name').notSortable()
                .renderWith(function (data, type, row, meta) {
                    return '<a ng-click="openAssetDetailsModal(\'' + row.asset +
                        '\')" ng-controller="AssetsMainCtrl"> ' + data + '</a>';
                }),

                DTColumnBuilder.newColumn('accountRS').withTitle('Account').notSortable()
                  .renderWith(function (data, type, row, meta) {
                      return searchTermFilter(data);
                  }),
                DTColumnBuilder.newColumn('assetDelete').withTitle('Transaction').notSortable()
                  .renderWith(function (data, type, row, meta) {
                      return searchTermFilter(data);
                  }),

                DTColumnBuilder.newColumn('quantityQNT').withTitle('Quantity').notSortable()
                  .renderWith(function (data, type, row, meta) {
                      return numericalStringFilter(quantityToShareFilter(data, row.decimals));
                  }),




            ];

            $scope.dtInstanceCallback = function (_dtInstance) {
                $scope.dtInstance = _dtInstance;
            };
        }]);
