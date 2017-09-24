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

angular.module('assets').controller('TradeDeskInputController',
    ['$scope', 'AssetsService', 'SessionStorageService', '$state', 'CryptoService', 'loginConfig',
        'AlertService', 'alertConfig', '$validation', '$uibModal', 'FeeService', '$rootScope',
        'CommonsService', 'DTOptionsBuilder', 'DTColumnBuilder', 'amountTQTFilter', 'searchTermFilter', '$compile',
        'quantityToShareFilter', 'shareToQuantiyFilter', '$stateParams', 'timestampFilter', 'numericalStringFilter',
        'quantToAmountFilter', 'buysellFilter', 'numberStringFilter', 'amountToDecimalFilter', '$q',
        function ($scope, AssetsService, SessionStorageService, $state, CryptoService,
                  loginConfig, AlertService, alertConfig, $validation, $uibModal, FeeService,
                  $rootScope, CommonsService, DTOptionsBuilder, DTColumnBuilder, amountTQTFilter, searchTermFilter,
                  $compile, quantityToShareFilter, shareToQuantiyFilter, $stateParams, timestampFilter,
                  numericalStringFilter, quantToAmountFilter, buysellFilter, numberStringFilter,
                  amountToDecimalFilter, $q) {

            $scope.getAsset = function () {
                var assetId = $stateParams.assetId;
                $scope.assetId = assetId;
                AssetsService.getAsset(assetId, true).then(function (success) {

                    $scope.assetDetails = success;
                    $scope.decimals = success.decimals;
                    var accountRs = CommonsService.getAccountDetailsFromSession('accountRs');

                    AssetsService.getAccountSingleAsset(accountRs, assetId).then(function (success) {

                        $scope.accountDetails = success;
                        $scope.quantityQNT = success.quantityQNT;
                        $scope.unconfirmedQuantityQNT = success.unconfirmedQuantityQNT;


                    }, function (error) {
                        console.log(error);
                    });


                }, function (error) {
                    console.log(error);
                });
            };

            $scope.$watchCollection('buyOrderForm', function (buyOrderForm) {

                $scope.buyOrderForm.totalPrice = numericalStringFilter(
                    parseFloat(( (buyOrderForm.quantity * buyOrderForm.price) )));

                if (buyOrderForm.price && buyOrderForm.quantity) {
                    var askQuantityQnt = shareToQuantiyFilter(buyOrderForm.quantity, $scope.decimals);
                    if (askQuantityQnt <= $scope.assetDetails.quantityQNT) {
                        $scope.enableBuy = true;
                    } else {
                        $scope.enableBuy = false;
                    }
                } else {
                    $scope.enableBuy = false;
                }
            });

            $scope.$watchCollection('askOrderForm', function (askOrderForm) {
                $scope.askOrderForm.totalPrice = numericalStringFilter(
                    parseFloat(( (askOrderForm.quantity * askOrderForm.price) )));

                if ($scope.unconfirmedQuantityQNT && askOrderForm.price && askOrderForm.quantity) {

                    var sellQuantityQnt = shareToQuantiyFilter(askOrderForm.quantity, $scope.decimals);
                    if (sellQuantityQnt <= $scope.unconfirmedQuantityQNT) {
                        $scope.enableSell = true;
                    } else {
                        $scope.enableSell = false;
                    }


                } else {
                    $scope.enableSell = false;
                }
            });

            $scope.$on('buy-form', function (event, data) {
                $scope.buyOrderForm.price = data.priceTQT * Math.pow(10, $scope.decimals) / 100000000;
                $scope.buyOrderForm.quantity = quantityToShareFilter(data.quantityQNT, $scope.decimals);
            });

            $scope.$on('ask-form', function (event, data) {
                $scope.askOrderForm.price = data.priceTQT * Math.pow(10, $scope.decimals) / 100000000;
                $scope.askOrderForm.quantity = quantityToShareFilter(data.quantityQNT, $scope.decimals);
            });

            $scope.placeOrderClick = function (buyOrderForm, type) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'assets/modals/place-order-form.html',
                    size: 'lg',
                    controller: 'AssetsFormCtrl',
                    resolve: {
                        params: function () {
                            return {
                                'assetId': $scope.assetId,
                                'price': buyOrderForm.price,
                                'quantity': buyOrderForm.quantity,
                                'requestType': type,
                                'decimals': $scope.decimals,
                                'asset': $scope.assetDetails.name
                            };
                        }
                    }
                });
            };

            $scope.hasPrivateKeyInSession = function () {
                if (SessionStorageService.getFromSession(loginConfig.SESSION_ACCOUNT_PRIVATE_KEY)) {
                    return true;
                }
                return false;
            };

            function rowCallback(nRow, aData, eventType) {
                // Unbind first in order to avoid any duplicate handler (see
                // https://github.com/l-lin/angular-datatables/issues/87)
                $('td', nRow).unbind('click');
                $('td', nRow).bind('click', function () {
                    $scope.$apply(function () {
                        $rootScope.$broadcast(eventType, aData);
                    });
                });
                return nRow;
            }

            $scope.dtAskOrdersOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers')
                .withDOM('frtip')
                .withOption('info', false)
                .withOption('ordering', false)
                .withOption('serverSide', true)
                .withDataProp('askOrders')
                .withOption('processing', true)
                .withOption('ordering', false)
                .withOption('bFilter', false)
                .withOption('fnRowCallback',
                    function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                        $compile(nRow)($scope);
                        rowCallback(nRow, aData, 'buy-form');
                    })
                .withOption('ajax', function (data, callback, settings) {

                    var endIndex = data.start + data.length - 1;
                    var promisesArray = [];
                    var assetOrdersPromise = AssetsService.getAssetOrders($scope.assetId,
                        AssetsService.GET_ASSET_ORDERS.ASK_ORDER, data.start,
                        endIndex);
                    var assetDetailsPromise = AssetsService.getAsset($scope.assetId, true);
                    promisesArray.push(assetOrdersPromise);
                    if (!$scope.decimals) {
                        promisesArray.push(assetDetailsPromise);
                    }
                    $q.all(promisesArray).then(function (response) {
                        var offersResponse = response[0];
                        var assetDetailsResponse = response[1];
                        if (assetDetailsResponse) {
                            $scope.decimals = assetDetailsResponse.decimals;
                        }
                        callback({
                            'iTotalRecords': 100,
                            'iTotalDisplayRecords': 100,
                            'askOrders': offersResponse.askOrders
                        });
                    });
                })
                .withDisplayLength(5).withBootstrap();

            $scope.fireFormFillEvent = function (eventName) {
                $rootScope.$broadcast(eventName);
            };

            $scope.dtAskOrdersColumns = [

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

                DTColumnBuilder.newColumn('priceTQT').withTitle('Actions').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return '<button type="button" class="btn btn-default btn-xs"> <i class="fa fa-check-circle" aria-hidden="true"></i> </button>';
                    }),

            ];

            $scope.dtAskOrdersInstanceCallback = function (_dtInstance) {
                $scope.dtAskOrderInstance = _dtInstance;
            };

            $scope.reloadAskOrders = function () {
                if ($scope.dtAskOrderInstance) {
                    $scope.dtAskOrderInstance._renderer.rerender();
                }
            };

            $scope.dtBidOrdersOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers')
                .withDOM('frtip')
                .withOption('info', false)
                .withOption('ordering', false)
                .withOption('serverSide', true)
                .withDataProp('bidOrders')
                .withOption('processing', true)
                .withOption('ordering', false)
                .withOption('bFilter', false)
                .withOption('fnRowCallback',
                    function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                        $compile(nRow)($scope);
                        rowCallback(nRow, aData, 'ask-form');
                    })
                .withOption('ajax', function (data, callback, settings) {
                    var endIndex = data.start + data.length - 1;
                    var promisesArray = [];
                    var assetOrdersPromise = AssetsService.getAssetOrders($scope.assetId,
                        AssetsService.GET_ASSET_ORDERS.BID_ORDER, data.start,
                        endIndex);
                    var assetDetailsPromise = AssetsService.getAsset($scope.assetId, true);
                    promisesArray.push(assetOrdersPromise);
                    if (!$scope.decimals) {
                        promisesArray.push(assetDetailsPromise);
                    }

                    $q.all(promisesArray).then(function (response) {
                        var offersResponse = response[0];
                        var assetDetailsResponse = response[1];
                        if (assetDetailsResponse) {
                            $scope.decimals = assetDetailsResponse.decimals;
                        }
                        callback({
                            'iTotalRecords': 100,
                            'iTotalDisplayRecords': 100,
                            'bidOrders': offersResponse.bidOrders
                        });
                    });
                })
                .withDisplayLength(5).withBootstrap();

            $scope.dtBidOrdersColumns = [

                DTColumnBuilder.newColumn('priceTQT').withTitle('Price per share').notSortable()
                    .renderWith(function (data, type, row, meta) {

                        return data * Math.pow(10, $scope.decimals) / 100000000;
                    }),

                DTColumnBuilder.newColumn('quantityQNT').withTitle('Quantity').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return numericalStringFilter(quantityToShareFilter(data, $scope.decimals));

                    }),

                DTColumnBuilder.newColumn('priceTQT').withTitle('Sum').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return numericalStringFilter(shareToQuantiyFilter(quantToAmountFilter(data), $scope.decimals) *
                            quantityToShareFilter(row.quantityQNT, $scope.decimals));
                    }),

                DTColumnBuilder.newColumn('priceTQT').withTitle('Actions').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return '<button type="button" class="btn btn-default btn-xs"> <i class="fa fa-check-circle" aria-hidden="true"></i> </button>';
                    }),

            ];

            $scope.dtBidOrdersInstanceCallback = function (_dtInstance) {
                $scope.dtBidOrderInstance = _dtInstance;
            };

            $scope.reloadBidOrders = function () {
                if ($scope.dtBidOrderInstance) {
                    $scope.dtBidOrderInstance._renderer.rerender();
                }
            };


            $scope.dtTradeOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers')
                .withDOM('frtip')
                .withOption('info', false)
                .withOption('ordering', false)
                .withOption('serverSide', false)
                .withDataProp('trades')
                .withOption('paging', true)
                .withOption('processing', false)
                .withOption('bFilter', false).withOption('fnRowCallback',
                    function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                        $compile(nRow)($scope);
                    })
                .withOption('ajax', function (data, callback, settings) {
                    var endIndex = data.start + data.length - 1;
                    AssetsService.getAssetLastTrades($scope.assetId, data.start, endIndex).then(function (response) {
                        $scope.tradeData = getTradeData(response.trades);
                        $scope.labels = Array.apply(null, {length: response.trades.length}).map(Number.call, Number);
                        $scope.lastTrade = response.trades[0];

                        callback({
                            'iTotalRecords': 1000,
                            'iTotalDisplayRecords': 1000,
                            'trades': response.trades
                        });
                    });
                })
                .withDisplayLength(10).withBootstrap();

            $scope.dtTradeColumns = [

                DTColumnBuilder.newColumn('askOrder').withTitle('Details').notSortable()
                    .renderWith(function (data, type, row, meta) {

                        var orderType = row.bidOrder;
                        if (row.tradeType === 'buy') {
                            orderType = row.askOrder;
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
                        return quantity.toLocaleString('en-US',
                            {maximumFractionDigits: row.decimals, minimumFractionDigits: row.decimals});
                    }),
                DTColumnBuilder.newColumn('priceTQT').withTitle('Price').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        var price = parseInt(data) * Math.pow(10, row.decimals) / 100000000;
                        return price.toLocaleString('en-US',
                            {maximumFractionDigits: row.decimals, minimumFractionDigits: row.decimals});
                    }),

                DTColumnBuilder.newColumn('priceTQT').withTitle('Sum').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        var quantity = parseInt(row.quantityQNT) / Math.pow(10, $scope.decimals);
                        var price = parseInt(data) * Math.pow(10, $scope.decimals);
                        var sum = quantity * price / 100000000;
                        return sum.toLocaleString('en-US',
                            {maximumFractionDigits: row.decimals, minimumFractionDigits: row.decimals});
                    }),


                DTColumnBuilder.newColumn('buyerRS').withTitle('Buyer').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return searchTermFilter(data);
                    }),

                DTColumnBuilder.newColumn('sellerRS').withTitle('Seller').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return searchTermFilter(data);
                    }),

                DTColumnBuilder.newColumn('tradeType').withTitle('Type').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return buysellFilter(data);
                    }),
            ];

            $scope.$on('order-placed', function () {
                $scope.dtAskOrderInstance._renderer.rerender();
                $scope.dtBidOrderInstance._renderer.rerender();
            });

            $scope.dtLastTradesInstanceCallback = function (_dtInstance) {
                $scope.dtLastTradesrInstance = _dtInstance;
            };

            $scope.reloadLastTrades = function () {
                if ($scope.dtLastTradesrInstance) {
                    $scope.dtLastTradesrInstance._renderer.rerender();
                }
            };

            function getTradeData(trades) {
                var maxSize = 50;
                var optionSize = trades.length;
                if (optionSize > maxSize) {
                    optionSize = maxSize;
                }
                var resultPriceArray = [];
                var resultQuantityArray = [];
                for (var i = 0; i < optionSize; i++) {
                    var resultObject = {};
                    var priceObject = {};
                    var quantityObject = {};
                    priceObject.key = optionSize - i;
                    priceObject.value = quantToAmountFilter(shareToQuantiyFilter(trades[i].priceTQT, $scope.decimals));
                    quantityObject.key = optionSize - i;
                    quantityObject.value = quantityToShareFilter(trades[i].quantityQNT, $scope.decimals);
                    resultPriceArray.push(priceObject);
                    resultQuantityArray.push(quantityObject);

                }
                return [{
                    'key': 'Quantity',
                    'bar': true,
                    'values': resultQuantityArray
                },
                    {
                        'key': 'Price',
                        'values': resultPriceArray
                    }].map(function (series) {
                    series.values = series.values.map(function (d) {
                        return {x: d.key, y: d.value};
                    });
                    return series;
                });
            }

            $scope.chartOptions = {
                chart: {
                    type: 'linePlusBarChart',
                    height: '245',
                    margin: {
                        top: 20,
                        right: 75,
                        bottom: 10,
                        left: 75
                    },
                    bars: {
                        forceY: [0]
                    },
                    bars2: {
                        forceY: [0]
                    },
                    focusEnable: false,
                    isArea: 'true',
                    color: ['#bdbdbd', '#00C851'],
                    xAxis: {
                        axisLabel: '',
                        showMaxMin: true,
                        show: false,
                        tickFormat: function (d) {
                            return null;
                        },

                    },
                    y1Axis: {
                        axisLabelDistance: 3,
                        tickFormat: function (d) {
                            return d.toLocaleString('en-US',
                                {maximumFractionDigits: $scope.decimals, minimumFractionDigits: $scope.decimals});
                        },
                    },
                    y2Axis: {
                        axisLabelDistance: 3,
                        tickFormat: function (d) {
                            return d.toLocaleString('en-US',
                                {maximumFractionDigits: $scope.decimals, minimumFractionDigits: $scope.decimals});
                        },
                    },

                }
            };

        }]);
