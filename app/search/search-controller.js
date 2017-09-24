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

angular.module('search').controller('SearchCtrl',
    ['$scope', 'SearchService', 'DTOptionsBuilder', 'DTColumnBuilder', '$interval', '$uibModal', '$compile',
        'searchConfig', '$q',
        function ($scope, SearchService, DTOptionsBuilder, DTColumnBuilder, $interval, $uibModal, $compile,
                  searchConfig, $q) {

            var errorHandler = function (errorMessage) {
                $uibModal.open({
                    animation: true,
                    templateUrl: 'search/search-error.html',
                    size: 'sm',
                    controller: 'ErrorSearchCtrl',

                    resolve: {
                        params: function () {
                            return {
                                message: errorMessage
                            };
                        }
                    }
                });
            };

            $scope.searchValue = function (searchTerm, row) {

                if (searchTerm) {
                    if (searchTerm.startsWith(searchConfig.searchAccountString)) {
                        SearchService.searchAccounts(searchTerm).then(function (response) {
                                if (!response.errorCode) {
                                    var result = $uibModal.open({
                                        animation: true,
                                        templateUrl: 'search/search-account-result.html',
                                        size: 'lg',
                                        controller: 'AccountSearchCtrl',
                                        windowClass: 'block-modal-window',
                                        resolve: {
                                            params: function () {
                                                return {
                                                    account: response,
                                                    accountId: searchTerm
                                                };
                                            }
                                        },

                                    });
                                } else {
                                    errorHandler(searchTerm + ' account doesn\'t exists ');
                                }
                            }
                        );
                    } else if (!isNaN(searchTerm)) {
                        var blockHeightSearch = SearchService.searchBlocks(searchTerm);
                        var blockIdSearch = SearchService.searchBlockById(searchTerm);
                        var transactionSearch = SearchService.searchTransactionById(searchTerm);

                        $q.all([blockHeightSearch, blockIdSearch, transactionSearch]).then(function (results) {
                            var resultSize = results.length;
                            for (var i = 0; i < resultSize; i++) {
                                var response = results[i];
                                if (!response.errorCode) {
                                    if (!response.transaction) {
                                        $uibModal.open({
                                            animation: true,
                                            templateUrl: 'search/block.html',
                                            size: 'lg',
                                            controller: 'SearchBlockCtrl',
                                            windowClass: 'block-modal-window',
                                            resolve: {
                                                /* jshint ignore:start */
                                                params: function () {
                                                    return {
                                                        'block': response,
                                                    };
                                                }
                                                /* jshint ignore:end */
                                            }
                                        });
                                        break;
                                    } else {
                                        $uibModal.open({
                                            animation: true,
                                            templateUrl: 'search/search-transaction-result.html',
                                            size: 'lg',
                                            controller: 'TransactionSearchCtrl',
                                            windowClass: 'block-modal-window',
                                            resolve: {
                                                /* jshint ignore:start */
                                                params: function () {
                                                    return {
                                                        'transaction': response
                                                    };
                                                }
                                                /* jshint ignore:end */
                                            }
                                        });
                                        break;
                                    }
                                }
                            }
                            if (resultSize === 0) {
                                errorHandler(searchTerm + ' Block or transaction doesn\'t exists ');
                            }
                        });
                    } else if (validateIPaddress(searchTerm)) {
                        SearchService.searchIp(searchTerm).then(function (response) {
                                if (response._id) {
                                    $uibModal.open({
                                        animation: true,
                                        templateUrl: 'search/search-peer.html',
                                        size: 'lg',
                                        controller: 'SearchIpCtrl',
                                        windowClass: 'block-modal-window',
                                        resolve: {
                                            params: function () {
                                                return {
                                                    node: response
                                                };
                                            }
                                        }
                                    });
                                } else {
                                    errorHandler(searchTerm + ' ip doesn\'t exists ');
                                }
                            }
                        );
                    }
                    else {
                        SearchService.searchTransactions(searchTerm).then(function (response) {
                            if (!response.errorCode) {

                                $uibModal.open({
                                    animation: true,
                                    templateUrl: 'search/search-transaction-result.html',
                                    size: 'lg',
                                    controller: 'TransactionSearchCtrl',
                                    windowClass: 'block-modal-window ',
                                    resolve: {
                                        params: function () {
                                            return {
                                                'transaction': response
                                            };
                                        }
                                    }
                                });
                            } else {
                                errorHandler(searchTerm + ' is not a valid account, block or transaction');
                            }
                        });
                    }
                }

            };

            function validateIPaddress(ipaddress) {
                if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
                        ipaddress)) {
                    return true;
                }
                return (false);
            }

            $scope.search = function () {
                var searchTerm = $scope.searchTerm;
                $scope.searchValue(searchTerm);
            };
        }]
);

angular.module('search').controller('SearchIpCtrl',
        ['$scope', 'DTOptionsBuilder', 'DTColumnBuilder', '$compile', '$uibModalInstance', '$q', 'params',
            function ($scope, DTOptionsBuilder, DTColumnBuilder, $compile, $uibModalInstance, $q, params) {

                $scope.chartOptions = {
                    chart: {
                        type: 'discreteBarChart',
                        height: 100,
                        margin : {
                            top: 0,
                            right: 0,
                            bottom: 0,
                            left: 0
                        },
                        x: function(d){return d.label;},
                        y: function(d){return d.value;},
                        showValues: false,
                        valueFormat: function(d){
                            return d3.format(',.2f')(d);
                        },
                        duration: 500,
                        xAxis: {
                            axisLabel: '',
                            ticks: 8
                        },
                        yAxis: {
                            axisLabel: '',
                            axisLabelDistance: 0,
                            ticks: 8
                        },

                        color: function(){
                            return '#9e9e9e';
                        },


                    },

                };

                function buildChartDataArray(data){
                    var obj = {
                        key: 'SystemLoad',
                        values: []
                    };

                    for (var i = 0; i < data.length; i++) {
                        obj.values.push( { label: i, value: data[i] } );
                    }

                    return [obj];

                }

                function buildChartSystemLoadAverage(data){
                    var obj = {
                        key: 'SystemLoad',
                        values: []
                    };

                    for (var i = 0; i < data.length; i++) {

                        var loadAvg = parseFloat( data[i] );
                        var loadPct  = (loadAvg * 100 /  (1 * 100) ) * 100;
                        obj.values.push( { label: i, value: loadPct } );
                    
                    }
                    return [obj];

                }

                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };

                $scope.showResult = function () {
                    $scope.nodes = [params.node];
                    $scope.chartOptions = $scope.chartOptions;
                    $scope.chartData1 =  buildChartSystemLoadAverage(  params.node.history_SystemLoadAverage );
                    $scope.chartData2 =  buildChartDataArray(  params.node.history_freeMemory );
                    $scope.chartData3 =  buildChartDataArray(  params.node.history_requestProcessingTime );
                    $scope.chartData4 =  buildChartDataArray(  params.node.history_numberOfActivePeers );
                };


            }]);

angular.module('search').controller('AccountSearchCtrl',
    ['$scope', 'DTOptionsBuilder', 'timestampFilter', 'amountTQTFilter', 'amountTKNFilter',
        'isEmptyFilter', 'DTColumnBuilder', '$compile', '$uibModalInstance', '$q', 'params',
        'supplyFilter', 'currencyModelFilter',
        function ($scope, DTOptionsBuilder, timestampFilter, amountTQTFilter, amountTKNFilter,
                  isEmptyFilter, DTColumnBuilder, $compile, $uibModalInstance, $q, params,
                  supplyFilter, votingModelFilter, currencyModelFilter) {


            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };

            $scope.showResult = function () {
                $scope.account = params.account;
                $scope.accountRs = params.account.accountRS;
            };

            $scope.qrCode = function () {
                $scope.accountRs = params.account.accountRS;
            };

        }]);

angular.module('search').controller('TransactionSearchCtrl',
    ['$scope', 'Restangular', 'DTOptionsBuilder', 'DTColumnBuilder', '$compile', '$uibModalInstance', '$q', 'params',
        function ($scope, Restangular, DTOptionsBuilder, DTColumnBuilder, $compile, $uibModalInstance, $q, params) {


            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };

            $scope.showResult = function () {
                $scope.transaction = Restangular.stripRestangular(params.transaction);
            };

            $scope.convertCamelToRegular = function (text) {
                var result = text.replace(/([A-Z])/g, ' $1');
                return result.charAt(0).toUpperCase() + result.slice(1);
            };

            $scope.generateSearchLink = function (searchTerm) {
                var accountHtml = '<a href="" ng-controller="SearchCtrl" ng-click="searchValue(\'' + searchTerm +
                    '\')">' +
                    searchTerm + '</a>';
                return accountHtml;
            };

        }]);

angular.module('search').controller('ErrorSearchCtrl', ['$scope', '$uibModalInstance', '$q', 'params',
    function ($scope, $uibModalInstance, $q, params) {
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.showResult = function () {
            $scope.message = params.message;
        };
    }]);

angular.module('search').controller('SearchBlockCtrl',
    ['$scope', 'timestampFilter', 'amountTQTFilter', 'DTOptionsBuilder', 'DTColumnBuilder', '$compile',
        '$uibModalInstance', 'params', '$uibModal', 'transactionConfFilter', 'transactionTypeFilter',
        'blockTransactionsFilter', 'SearchService','Restangular', 'transactionIconSubTypeFilter',
        function ($scope, timestampFilter, amountTQTFilter, DTOptionsBuilder, DTColumnBuilder, $compile,
                  $uibModalInstance, params, $uibModal, transactionConfFilter, transactionTypeFilter,
                  blockTransactionsFilter, SearchService,Restangular, transactionIconSubTypeFilter) {

            $scope.block = params.block;


            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };


            $scope.transactions = [];

            $scope.dtOptions = DTOptionsBuilder.newOptions()
                .withPaginationType('full_numbers')
                .withOption('serverSide', true)
                .withDataProp('data')
                .withOption('processing', true)
                .withOption('paging', false)
                .withOption('ordering', false)
                .withOption('info', false)
                .withOption('bFilter', false)
                .withOption('fnRowCallback',
                    function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                        $compile(nRow)($scope);
                    })
                .withOption('ajax', function (data, callback, settings) {
                    var convertedResponse = {'data': [$scope.block]};
                    callback({
                        'iTotalRecords': 1,
                        'iTotalDisplayRecords': 1,
                        'data': convertedResponse.data
                    });
                })
                .withDisplayLength(1)
                .withBootstrap();


            $scope.dtColumns = [
                DTColumnBuilder.newColumn('height').withTitle('Height').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return '<button type="button" class="btn btn-success btn-xs" ng-click="openDetailsModal(' +
                            data + ')">' + data + '</button>';
                    }),

                DTColumnBuilder.newColumn('block').withTitle('Block Id').notSortable(),
                DTColumnBuilder.newColumn('numberOfTransactions').withTitle('Transactions').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return blockTransactionsFilter(data);
                    }),
                DTColumnBuilder.newColumn('totalAmountTQT').withTitle('Amount').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return amountTQTFilter(data);
                    }),
                DTColumnBuilder.newColumn('totalFeeTQT').withTitle('Fee').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return amountTQTFilter(data);
                    }),
                DTColumnBuilder.newColumn('generatorRS').withTitle('Generator').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return '<a href="" ng-controller="SearchCtrl" ng-click="searchValue(\'' + data + '\')">' +
                            data + '</a>';
                    }),
                DTColumnBuilder.newColumn('payloadLength').withTitle('Payload').notSortable(),
                DTColumnBuilder.newColumn('timestamp').withTitle('Date').notSortable()
                    .renderWith(function (data, type, row, meta) {
                            return timestampFilter(data);
                        }
                    ),

                DTColumnBuilder.newColumn('previousBlock').withTitle('Previous Block').withOption('defaultContent', ' ')
                    .notSortable(),


            ];

            $scope.dtOptionsTransactions = DTOptionsBuilder.newOptions()
                .withDOM('frtip')
                .withPaginationType('full_numbers')
                .withOption('serverSide', false)
                .withDataProp('data')
                .withOption('processing', true)
                .withOption('paging', true)
                .withOption('ordering', false)
                .withOption('info', false)
                .withOption('bFilter', false)
                .withOption('fnRowCallback',
                    function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                        $compile(nRow)($scope);
                    })
                .withOption('ajax', function (data, callback, settings) {
                    var block = $scope.block;
                    callback({
                        'iTotalRecords': block.transactions.length,
                        'iTotalDisplayRecords': block.transactions.length,
                        'data': block.transactions
                    });
                })
                .withDisplayLength(5).withBootstrap();

            $scope.dtColumnsTransactions = [
                DTColumnBuilder.newColumn('transaction').withTitle('Details').notSortable()
                    .renderWith(function (data, type, row, meta) {

                      var details = '<a type="button" class="btn btn-success btn-xs" ng-controller="SearchCtrl"' +
                          ' ng-click="searchValue(\'' + row.fullHash  + '\')">' + '<i class="fa fa-list-ul" aria-hidden="true"></i>' + '</a>';
                      return  details;

                    }),

                DTColumnBuilder.newColumn('type').withTitle('Type').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return transactionIconSubTypeFilter(data, row.subtype);
                    }),

                DTColumnBuilder.newColumn('timestamp').withTitle('Date').notSortable()
                    .renderWith(function (data, type, row, meta) {
                            return timestampFilter(data);
                        }
                    ),
                DTColumnBuilder.newColumn('amountTQT').withTitle('Amount').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return amountTQTFilter(data);
                    }),
                DTColumnBuilder.newColumn('feeTQT').withTitle('Fee').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return amountTQTFilter(data);
                    }),
                DTColumnBuilder.newColumn('confirmations').withTitle('Conf.').notSortable()
                    .renderWith(function (data, type, row, meta) {
                            return transactionConfFilter(data);
                        }
                    ),
                DTColumnBuilder.newColumn('senderRS').withTitle('Sender').notSortable()
                    .withOption('defaultContent', ' ')
                    .renderWith(function (data, type, row, meta) {
                        if (data) {
                            return '<a href="" ng-controller="SearchCtrl" ng-click="searchValue(\'' + data + '\')">' +
                                data + '</a>';
                        }
                        return data;
                    }),
                DTColumnBuilder.newColumn('recipientRS').withTitle('Recipient').notSortable()
                    .withOption('defaultContent', ' ').renderWith(function (data, type, row, meta) {
                    if (data) {
                        return '<a href="" ng-controller="SearchCtrl" ng-click="searchValue(\'' + data + '\')">' +
                            data + '</a>';
                    }
                    return data;
                }),


            ];

            $scope.dtInstanceCallbackTransactions = {};

            $scope.showBlockDetails = function () {
                SearchService.searchBlocks(params.blockDetails, false)
                    .then(function (response) {
                        $scope.blockDetails = Restangular.stripRestangular(response);
                    });

            };

            $scope.convertCamelToRegular = function (text) {
                var result = text.replace(/([A-Z])/g, ' $1');
                return result.charAt(0).toUpperCase() + result.slice(1);
            };

            $scope.openDetailsModal = function (data) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'search/block-details.html',
                    size: 'lg',
                    controller: 'SearchBlockCtrl',
                    windowClass: 'block-modal-window',
                    resolve: {
                        params: function () {
                            return {
                                'blockDetails': data,
                            };
                        }
                    }
                });
            };

            $scope.generateSearchLink = function (searchTerm) {
                var accountHtml = '<a href="" ng-controller="SearchCtrl" ng-click="searchValue(\'' + searchTerm +
                    '\')">' +
                    searchTerm + '</a>';
                return accountHtml;
            };

            $scope.generateNumberOfTxsHtml = function (number) {
                return getBlocksTxs(number);
            };
        }]
);
