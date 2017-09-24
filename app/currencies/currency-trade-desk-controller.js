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

angular.module('currencies').controller('CurrencyTradeDeskInputController',
    ['$scope', 'CurrenciesService', 'SessionStorageService', '$state', 'CryptoService', 'loginConfig',
        'AlertService', 'alertConfig', '$validation', '$uibModal', 'FeeService', '$rootScope',
        'CommonsService', 'DTOptionsBuilder', 'DTColumnBuilder', 'amountTQTFilter', 'searchTermFilter', '$compile',
        'quantityToShareFilter', 'shareToQuantiyFilter', '$stateParams', 'timestampFilter', 'numericalStringFilter',
        'quantToAmountFilter', 'buysellFilter', 'numberStringFilter', 'amountToDecimalFilter', '$q',
        function ($scope, CurrenciesService, SessionStorageService, $state, CryptoService,
                  loginConfig, AlertService, alertConfig, $validation, $uibModal, FeeService,
                  $rootScope, CommonsService, DTOptionsBuilder, DTColumnBuilder, amountTQTFilter, searchTermFilter,
                  $compile, quantityToShareFilter, shareToQuantiyFilter, $stateParams, timestampFilter,
                  numericalStringFilter, quantToAmountFilter, buysellFilter, numberStringFilter, amountToDecimalFilter,
                  $q) {

            $scope.hasBuyOffers = function () {
                if ($scope.bidLength > 0) {
                    return true;
                } else {
                    return false;
                }
            };

            $scope.hasSellOffers = function () {
                if ($scope.askLength > 0) {
                    return true;
                } else {
                    return false;
                }
            };


            $scope.getCurrency = function () {
                var currencyId = $stateParams.currencyId;
                $scope.currencyId = currencyId;
                CurrenciesService.getCurrencyById(currencyId).then(function (success) {

                    $scope.currencyDetails = success;
                    $scope.decimals = success.decimals;

                    var accountRs = CommonsService.getAccountDetailsFromSession('accountRs');

                    CurrenciesService.getSingleAccountCurrency(accountRs, currencyId).then(function (success) {
                        $scope.accountDetails = success;
                        $scope.units = success.units;
                        $scope.unconfirmedUnits = success.unconfirmedUnits;
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

                if (buyOrderForm.price && buyOrderForm.quantity && $scope.askLength) {
                    $scope.enableBuy = true;
                }
            });

            $scope.$watchCollection('askOrderForm', function (askOrderForm) {

                $scope.askOrderForm.totalPrice = numericalStringFilter(
                    parseFloat(( (askOrderForm.quantity * askOrderForm.price) )));

                if (askOrderForm.price && askOrderForm.quantity && $scope.bidLength) {
                    $scope.enableSell = true;
                }
            });

            $scope.$on('buy-form', function (event, data) {
                $scope.buyOrderForm.price = data.rateTQT * Math.pow(10, $scope.decimals) / 100000000;
                $scope.buyOrderForm.quantity = quantityToShareFilter(data.supply, $scope.decimals);
            });

            $scope.$on('ask-form', function (event, data) {
                $scope.askOrderForm.price = data.rateTQT * Math.pow(10, $scope.decimals) / 100000000;
                $scope.askOrderForm.quantity = quantityToShareFilter(data.supply, $scope.decimals);
            });


            $scope.placeOrderClick = function (buyOrderForm, type) {
                var templateUrl;
                if (type === 'ask') {
                    templateUrl = 'currencies/modals/sell-currency-form.html';
                } else {
                    templateUrl = 'currencies/modals/buy-currency-form.html';
                }
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: templateUrl,
                    size: 'lg',
                    controller: 'CurrenciesFormCtrl',
                    resolve: {
                        params: function () {
                            return {
                                'currencyId': $scope.currencyId,
                                'rate': buyOrderForm.price,
                                'shares': buyOrderForm.quantity,
                                'requestType': type,
                                'decimals': $scope.decimals,
                                'currency': $scope.currencyDetails.name
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
                .withOption('serverSide', false)
                .withDataProp('offers')
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
                    var currencyOrdersPromise = CurrenciesService.getSellOffers(null, $scope.currencyId);
                    var currencyDetailsPromise = CurrenciesService.getCurrencyById($scope.currencyId);
                    promisesArray.push(currencyOrdersPromise);
                    if (!$scope.decimals) {
                        promisesArray.push(currencyDetailsPromise);
                    }

                    $q.all(promisesArray).then(function (response) {
                        var offersResponse = response[0];
                        var currencyDetailsResponse = response[1];
                        if (currencyDetailsResponse) {
                            $scope.decimals = currencyDetailsResponse.decimals;
                        }
                        $scope.askLength = offersResponse.offers.length;
                        callback({
                            'iTotalRecords': 100,
                            'iTotalDisplayRecords': 100,
                            'offers': offersResponse.offers
                        });
                    });
                })
                .withDisplayLength(5).withBootstrap();

            $scope.fireFormFillEvent = function (eventName) {
                $rootScope.$broadcast(eventName);
            };

            $scope.dtAskOrdersColumns = [

                DTColumnBuilder.newColumn('rateTQT').withTitle('Price per share').notSortable()
                    .renderWith(function (data, type, row, meta) {

                        return numericalStringFilter(Math.pow(10, $scope.decimals) * quantToAmountFilter(data));

                    }),

                DTColumnBuilder.newColumn('supply').withTitle('Quantity').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return numericalStringFilter(quantityToShareFilter(data, $scope.decimals));
                    }),

                DTColumnBuilder.newColumn('rateTQT').withTitle('Sum').notSortable()
                    .renderWith(function (data, type, row, meta) {

                        var sum = ( row.rateTQT * row.supply) / 100000000;
                        return numericalStringFilter(sum, $scope.decimals);

                    }),

                DTColumnBuilder.newColumn('rateTQT').withTitle('Actions').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return '<button type="button" class="btn btn-default btn-sm"> <i class="fa fa-check-circle" aria-hidden="true"></i> </button>';
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
                .withOption('serverSide', false)
                .withDataProp('offers')
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
                    var currencyOrdersPromise = CurrenciesService.getBuyOffers(null, $scope.currencyId);
                    var currencyDetailsPromise = CurrenciesService.getCurrencyById($scope.currencyId);
                    promisesArray.push(currencyOrdersPromise);
                    if (!$scope.decimals) {
                        promisesArray.push(currencyDetailsPromise);
                    }

                    $q.all(promisesArray).then(function (response) {
                        var offersResponse = response[0];
                        var currencyDetailsResponse = response[1];
                        if (currencyDetailsResponse) {
                            $scope.decimals = currencyDetailsResponse.decimals;
                        }
                        $scope.bidLength = offersResponse.offers.length;
                        callback({
                            'iTotalRecords': 100,
                            'iTotalDisplayRecords': 100,
                            'offers': offersResponse.offers
                        });
                    });
                })
                .withDisplayLength(5).withBootstrap();

            $scope.dtBidOrdersColumns = [

                DTColumnBuilder.newColumn('rateTQT').withTitle('Price per share').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return numericalStringFilter(Math.pow(10, $scope.decimals) * quantToAmountFilter(data));
                    }),

                DTColumnBuilder.newColumn('supply').withTitle('Quantity').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return numericalStringFilter(quantityToShareFilter(data, $scope.decimals));

                    }),

                DTColumnBuilder.newColumn('rateTQT').withTitle('Sum').notSortable()
                    .renderWith(function (data, type, row, meta) {

                        var sum = ( row.rateTQT * row.supply) / 100000000;
                        return numericalStringFilter(sum, $scope.decimals);



                    }),

                DTColumnBuilder.newColumn('rateTQT').withTitle('Actions').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return '<button type="button" class="btn btn-default btn-sm"> <i class="fa fa-check-circle" aria-hidden="true"></i> </button>';
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
                .withDataProp('exchanges')
                .withOption('paging', true)
                .withOption('processing', false)
                .withOption('bFilter', false).withOption('fnRowCallback',
                    function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                        $compile(nRow)($scope);
                    })
                .withOption('ajax', function (data, callback, settings) {
                    var endIndex = data.start + data.length - 1;
                    CurrenciesService.getDeskExchanges($scope.currencyId, data.start, endIndex)
                        .then(function (response) {
                            $scope.tradeData = getTradeData(response.exchanges);
                            $scope.labels = Array.apply(null, {length: response.exchanges.length})
                                .map(Number.call, Number);
                            $scope.lastTrade = response.exchanges[0];

                            callback({
                                'iTotalRecords': 1000,
                                'iTotalDisplayRecords': 1000,
                                'exchanges': response.exchanges
                            });
                        });
                })
                .withDisplayLength(10).withBootstrap();

            $scope.dtTradeColumns = [

                DTColumnBuilder.newColumn('transaction').withTitle('Details').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return '<button type="button" class="btn btn-success btn-xs" ng-controller="SearchCtrl"' +
                            ' ng-click="searchValue(\'' + data + '\')">' +
                            '<i class="fa fa-list-ul" aria-hidden="true"></i>' + '</button>';
                    }),

                DTColumnBuilder.newColumn('timestamp').withTitle('Date').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return timestampFilter(data);
                    }),

                DTColumnBuilder.newColumn('units').withTitle('Quantity').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        var quantity = parseInt(data) / Math.pow(10, $scope.decimals);
                        return quantity.toLocaleString('en-US', {minimumFractionDigits: $scope.decimals});
                    }),
                DTColumnBuilder.newColumn('rateTQT').withTitle('Price').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        var price = parseInt(data) * Math.pow(10, $scope.decimals) / 100000000;
                        return price.toLocaleString('en-US', {minimumFractionDigits: $scope.decimals});
                    }),

                DTColumnBuilder.newColumn('rateTQT').withTitle('Sum').notSortable()
                    .renderWith(function (data, type, row, meta) {
                      var quantity = parseInt(row.units) / Math.pow(10, $scope.decimals);
                      var price = parseInt(data) * Math.pow(10, $scope.decimals) ;
                      var sum = quantity * price / 100000000;
                        return sum.toLocaleString('en-US', {minimumFractionDigits: $scope.decimals});
                    }),


                DTColumnBuilder.newColumn('buyerRS').withTitle('Buyer').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return searchTermFilter(data);
                    }),

                DTColumnBuilder.newColumn('sellerRS').withTitle('Seller').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return searchTermFilter(data);
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
                var optionSize = trades.length;
                var resultPriceArray = [];
                var resultQuantityArray = [];
                for (var i = 0; i < optionSize; i++) {
                    var resultObject = {};
                    var priceObject = {};
                    var quantityObject = {};

                    priceObject.key = optionSize - i;
                    priceObject.value = quantToAmountFilter(shareToQuantiyFilter(trades[i].rateTQT, $scope.decimals));
                    quantityObject.key = optionSize - i;
                    quantityObject.value = quantityToShareFilter(trades[i].units, $scope.decimals);
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
                    height: 230,
                    margin: {
                        top: 30,
                        right: 75,
                        bottom: 50,
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
                            return d.toLocaleString('en-US', {minimumFractionDigits: 4});
                        },
                    },
                    y2Axis: {

                        axisLabelDistance: 3,
                        tickFormat: function (d) {
                            return d.toLocaleString('en-US', {minimumFractionDigits: 2});
                        },
                    },

                }
            };


        }]);
