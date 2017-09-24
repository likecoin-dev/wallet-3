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

angular.module('chain-viewer').controller('ChainViewerBlocksCtrl',
    ['$scope', 'ChainViewerService', 'baseConfig', 'timestampFilter', 'amountTQTFilter', 'DTOptionsBuilder',
        'DTColumnBuilder', '$interval', '$uibModal', '$compile', 'transactionConfFilter', 'searchTermFilter',
        'blockTransactionsFilter',
        function ($scope, ChainViewerService, baseConfig, timestampFilter, amountTQTFilter, DTOptionsBuilder,
                  DTColumnBuilder, $interval, $uibModal, $compile, transactionConfFilter, searchTermFilter,
                  blockTransactionsFilter) {

            $scope.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers')
                .withDOM('frtip')
                .withOption('info', false)
                .withOption('ordering', false)
                .withOption('serverSide', true)
                .withDataProp('blocks')
                .withOption('paging', true)
                .withOption('info', false)
                .withOption('processing', true)
                .withOption('bFilter', false)
                .withOption('fnRowCallback',
                    function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                        $compile(nRow)($scope);
                    })
                .withOption('ajax', function (data, callback, settings) {
                    var endIndex = data.start + data.length - 1;
                    ChainViewerService.getBlocks(data.start, endIndex).then(function (response) {
                        callback({
                            'iTotalRecords': 1000,
                            'iTotalDisplayRecords': 1000,
                            'blocks': response.blocks
                        });
                    });
                })
                .withDisplayLength(10).withBootstrap();

            $scope.dtColumns = [
                DTColumnBuilder.newColumn('height').withTitle('Details').withOption('bSortable', false).notSortable()
                    .renderWith(function (data, type, row, meta) {
                        var details = '<a type="button" class="btn btn-infinity btn-xs" ng-controller="SearchCtrl"' +
                            ' ng-click="searchValue(\'' + data + '\')">' + data + '</a>';
                        return details;
                    }),

                DTColumnBuilder.newColumn('block').withTitle('Id').notSortable(),

                DTColumnBuilder.newColumn('numberOfTransactions').withTitle('Txs').notSortable()
                    .renderWith(function (data, type, row, meta) {
                            return blockTransactionsFilter(data);
                        }
                    ),
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
                        return searchTermFilter(data);
                    }),
                DTColumnBuilder.newColumn('timestamp').withTitle('Date').notSortable()
                    .renderWith(function (data, type, row, meta) {
                            return timestampFilter(data);
                        }
                    ),
            ];

            $scope.dtInstanceCallback = function (_dtInstance) {
                $scope.dtInstance = _dtInstance;
            };

            $scope.reloadBlocks = function () {
                if ($scope.dtInstance) {
                    $scope.dtInstance._renderer.rerender();
                }
            };


        }]);

angular.module('chain-viewer').controller('ChainViewerTransactionsCtrl',
    ['$scope', 'ChainViewerService', 'baseConfig', 'amountTQTFilter',
        'timestampFilter', 'DTOptionsBuilder', 'DTColumnBuilder', '$interval', '$uibModal', '$compile',
        'searchTermFilter', 'transactionTypeFilter', 'transactionConfFilter', 'transactionIconSubTypeFilter',
        function ($scope, ChainViewerService, baseConfig, amountTQTFilter, timestampFilter,
                  DTOptionsBuilder, DTColumnBuilder, $interval, $uibModal, $compile, searchTermFilter,
                  transactionTypeFilter, transactionConfFilter, transactionIconSubTypeFilter) {

            $scope.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers')
                .withDOM('frtip')
                .withOption('info', false)
                .withOption('ordering', false)
                .withOption('serverSide', true)
                .withDataProp('transactions')
                .withOption('processing', true)
                .withOption('bFilter', false)
                .withOption('fnRowCallback',
                    function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                        $compile(nRow)($scope);
                    })
                .withOption('ajax', function (data, callback, settings) {
                    var endIndex = data.start + data.length - 1;
                    ChainViewerService.getTransactions(data.start, endIndex)
                        .then(function (response) {
                            callback({
                                'iTotalRecords': 1000,
                                'iTotalDisplayRecords': 1000,
                                'transactions': response.transactions
                            });
                        });
                })
                .withDisplayLength(10).withBootstrap();

            $scope.dtColumns = [
                DTColumnBuilder.newColumn('Id').withTitle('Details').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        var details = '<a type="button" class="btn btn-infinity btn-xs" ng-controller="SearchCtrl"' +
                            ' ng-click="searchValue(\'' + data + '\')">' + '<i class="fa fa-list-ul" aria-hidden="true" style="width:15px;"></i>' + '</a>';
                        return details;
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
                    .renderWith(function (data, type, row, meta) {
                        return searchTermFilter(data);
                    }),
                DTColumnBuilder.newColumn('recipientRS').withTitle('Recipient').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return searchTermFilter(data);
                    })
            ];

            $scope.dtInstanceCallback = function (_dtInstance) {
                $scope.dtInstance = _dtInstance;
            };

            $scope.reloadTransactions = function () {
                if ($scope.dtInstance) {
                    $scope.dtInstance._renderer.rerender();
                }
            };

        }]);

angular.module('chain-viewer').controller('ChainViewerPeersCtrl',
    ['$scope', 'ChainViewerService', 'DTOptionsBuilder', 'DTColumnBuilder', '$interval', '$uibModal', '$compile',
        'searchTermFilter', 'numericalStringFilter',
        function ($scope, ChainViewerService, DTOptionsBuilder, DTColumnBuilder, $interval, $uibModal, $compile,
                  searchTermFilter, numericalStringFilter) {

            $scope.chartOptions = {
                chart: {
                    type: 'discreteBarChart',
                    height: 20,
                    margin: {
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0
                    },
                    x: function (d) {
                        return d.label;
                    },
                    y: function (d) {
                        return d.value;
                    },
                    showValues: false,
      
                    duration: 500,
                    xAxis: {
                        axisLabel: '',
                        axisLabelDistance: 0,
                        ticks: 0
                    },
                    yAxis: {
                        axisLabel: '',
                        axisLabelDistance: 0,
                        ticks: 0
                    },

                    color: function () {
                        return '#9e9e9e';
                    },


                },

            };

            $scope.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers')
                .withDOM('frtip')
                .withOption('info', false)
                .withOption('ordering', false)
                .withOption('info', false)
                .withOption('serverSide', true)
                .withDataProp('peers')
                .withOption('processing', true)
                .withOption('bFilter', false)
                .withOption('fnRowCallback',
                    function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                        $compile(nRow)($scope);
                    })
                .withOption('ajax', function (data, callback, settings) {
                    var pageNum = (data.start / data.length) + 1;
                    ChainViewerService.getPeers(pageNum, data.length).then(function (response) {
                        var data = {'peers': response};
                        callback({
                            'iTotalRecords': 1000,
                            'iTotalDisplayRecords': 1000,
                            'peers': data.peers
                        });
                    });
                })
                .withDisplayLength(10).withBootstrap()
                .withOption('rank', [1, 'desc'])
                .withOption('rowReordering', true);

            $scope.dtColumns = [
                DTColumnBuilder.newColumn('rank').withTitle('Rank').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return numericalStringFilter(data);
                    }),


                DTColumnBuilder.newColumn('_id').withTitle('Node Details').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        var details = '<a type="button" class="btn btn-infinity btn-xs" style="width:75%;" ng-controller="SearchCtrl"' +
                            ' ng-click="searchValue(\'' + data + '\')">' + data + '</a>';
                        return details;
                    }),

                DTColumnBuilder.newColumn('numberOfActivePeers').withTitle('Peers').notSortable(),

                DTColumnBuilder.newColumn('SystemLoadAverage').withTitle('CPU').notSortable()
                    .renderWith(function (data, type, row, meta) {

                      var numCPU = parseInt(row.availableProcessors);
                      var loadAvg = parseFloat(row.SystemLoadAverage);
                      var loadPct = (loadAvg * 100 / (numCPU * 100) ) * 100;

                      return (loadPct.toFixed(2) + ' %');
                    }),

                DTColumnBuilder.newColumn('history_SystemLoadAverage').withTitle('CPU Load History').notSortable()
                    .renderWith(function (data, type, row, meta) {

                        var tmpArr = [];

                        for (var i = 0; i < data.length - 30; i++) {

                            var loadAvg = parseFloat(data[i]);
                            var loadPct = (loadAvg * 100 / (1 * 100) ) * 100;

                            tmpArr.push({label: i, value: loadPct});

                        }

                        var dd = [{values: []}];
                        dd[0].values = tmpArr;

                        return '<nvd3 options="chartOptions" data=' + JSON.stringify(dd) + '></nvd3>';

                    }),

                DTColumnBuilder.newColumn('lastBlockchainFeeder').withTitle('Last Feeder').notSortable(),

                DTColumnBuilder.newColumn('numberOfBlocks').withTitle('Blocks').notSortable(),

                DTColumnBuilder.newColumn('version').withTitle('Version').notSortable(),

                DTColumnBuilder.newColumn('superNodeEnable').withTitle('Services').notSortable()
                    .renderWith(function (data, type, row, meta) {

                        return getTickMarkUiModel(row.superNodeEnable, 'SuperNode Services Enabled');
                    }),



                DTColumnBuilder.newColumn('apiServerEnable').withTitle('API').notSortable()
                    .renderWith(function (data, type, row, meta) {

                        return getTickMarkUiModel(row.apiServerEnable, 'API Enabled');
                    }),


            ];

            $scope.dtInstanceCallback = function (_dtInstance) {
                $scope.dtInstance = _dtInstance;
            };

            $scope.reloadPeers = function () {
                if ($scope.dtInstance) {
                    $scope.dtInstance._renderer.rerender();
                }
            };


            function getTickMarkUiModel(value, toolTipText) {
                if (value === true) {
                    return '<small> <span tooltip-placement="top" uib-tooltip="' + toolTipText +
                        '" class="glyphicon glyphicon-ok" style="color:black"></span></small>';
                } else {
                    return '<small> <span tooltip-placement="top" uib-tooltip="' + toolTipText +
                        '" class="glyphicon glyphicon-remove" style="color:black"></span></small>';
                }
            }

        }]);

angular.module('chain-viewer').controller('ChainViewerUnconfirmedTransactionsCtrl',
    ['$scope', 'ChainViewerService', 'baseConfig', 'amountTQTFilter', 'timestampFilter', 'DTOptionsBuilder',
        'DTColumnBuilder', '$interval', '$uibModal', '$compile', 'searchTermFilter', 'transactionTypeFilter',
        'transactionConfFilter', 'transactionIconSubTypeFilter',
        function ($scope, ChainViewerService, baseConfig, amountTQTFilter, timestampFilter,
                  DTOptionsBuilder, DTColumnBuilder, $interval, $uibModal, $compile, searchTermFilter,
                  transactionTypeFilter, transactionConfFilter, transactionIconSubTypeFilter) {

            $scope.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers')
                .withDOM('frtip')
                .withOption('paging', true)
                .withOption('ordering', false)
                .withOption('info', false)
                .withOption('serverSide', false)
                .withDataProp('unconfirmedTransactions')
                .withOption('paging', true)
                .withOption('ordering', false)
                .withOption('processing', false)
                .withOption('bFilter', false)
                .withOption('fnRowCallback',
                    function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                        $compile(nRow)($scope);
                    })
                .withOption('ajax', function (data, callback, settings) {
                    ChainViewerService.getUnconfirmedTransactions()
                        .then(function (response) {
                            callback({
                                'iTotalRecords': response.unconfirmedTransactions.length,
                                'iTotalDisplayRecords': response.unconfirmedTransactions.length,
                                'unconfirmedTransactions': response.unconfirmedTransactions
                            });
                        });
                })
                .withDisplayLength(10).withBootstrap();

            $scope.dtColumns = [
                DTColumnBuilder.newColumn('transaction').withTitle('Details').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        var details = '<a type="button" class="btn btn-infinity btn-xs" ng-controller="SearchCtrl"' +
                            ' ng-click="searchValue(\'' + data + '\')">' + '<i class="fa fa-list-ul" aria-hidden="true" style="width:15px;"></i>' + '</a>';
                        return details;
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
                    .renderWith(function (data, type, row, meta) {
                        return searchTermFilter(data);
                    }),
                DTColumnBuilder.newColumn('recipientRS').withTitle('Recipient').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return searchTermFilter(data);
                    })

            ];

            $scope.dtInstanceCallback = function (_dtInstance) {
                $scope.dtInstance = _dtInstance;
            };

            $scope.reloadUnconfirmedTransactions = function () {
                if ($scope.dtInstance) {
                    $scope.dtInstance._renderer.rerender();
                }
            };
        }]);
