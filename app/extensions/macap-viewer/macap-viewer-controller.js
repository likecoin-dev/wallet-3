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

angular.module('macap-viewer').controller('MaCapViewerMainCtrl',
    ['$scope', 'MaCapViewerService', 'baseConfig', 'numericalStringFilter', 'DTOptionsBuilder',
        'DTColumnBuilder', '$interval', '$uibModal', '$compile', 'upDownFilter',
        function ($scope, MaCapViewerService, baseConfig, numericalStringFilter, DTOptionsBuilder,
                  DTColumnBuilder, $interval, $uibModal, $compile, upDownFilter) {

                    $scope.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers')
                        .withDOM('frtip')
                        .withOption('info', false)
                        .withOption('ordering', false)
                        .withOption('info', false)
                        .withOption('serverSide', true)
                        .withDataProp('macap')
                        .withOption('processing', true)
                        .withOption('bFilter', false)
                        .withOption('fnRowCallback',
                            function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                                $compile(nRow)($scope);
                            })
                        .withOption('ajax', function (data, callback, settings) {
                            var pageNum = (data.start / data.length) + 1;
                            MaCapViewerService.getMaCap(pageNum, data.length).then(function (response) {
                              var data = {'macap': response};
                              callback({
                                    'iTotalRecords': 1000,
                                    'iTotalDisplayRecords': 1000,
                                    'macap': data.macap
                                });
                            }, function (error) {
                                 callback({
                                     'iTotalRecords': 0,
                                     'iTotalDisplayRecords': 0,
                                     'macap': []
                                 });
                            });

                        })
                        .withDisplayLength(10).withBootstrap()
                        .withOption('rank', [1, 'desc'])
                        .withOption('rowReordering', true);

                    $scope.dtColumns = [
                        DTColumnBuilder.newColumn('rank').withTitle('Rank').notSortable()
                            .renderWith(function (data, type, row, meta) {
                      
                                return data ;
                            }),

                      DTColumnBuilder.newColumn('symbol').withTitle('Symbol').notSortable()
                          .renderWith(function (data, type, row, meta) {
                              return '<strong>' + data + '</strong>';
                          }),


                        DTColumnBuilder.newColumn('name').withTitle('Name').notSortable()
                            .renderWith(function (data, type, row, meta) {
                                return data;
                            }),

                        DTColumnBuilder.newColumn('price_usd').withTitle('Price USD').notSortable()
                            .renderWith(function (data, type, row, meta) {
                                return data.toLocaleString('en-US', {maximumFractionDigits: 4, minimumFractionDigits: 4});
                            }),


                        DTColumnBuilder.newColumn('price_btc').withTitle('Price BTC').notSortable()
                            .renderWith(function (data, type, row, meta) {
                                return data.toLocaleString('en-US', {maximumFractionDigits: 8, minimumFractionDigits: 8});
                            }),

                        DTColumnBuilder.newColumn('market_cap_usd').withTitle('Market Cap USD').notSortable()
                            .renderWith(function (data, type, row, meta) {
                                return data.toLocaleString('en-US', {maximumFractionDigits: 0, minimumFractionDigits: 0});
                            }),

                        DTColumnBuilder.newColumn('available_supply').withTitle('Supply').notSortable()
                            .renderWith(function (data, type, row, meta) {
                                return data.toLocaleString('en-US', {maximumFractionDigits: 0, minimumFractionDigits: 0});
                            }),

                        DTColumnBuilder.newColumn('percent_change_1h').withTitle('1 H').notSortable()
                            .renderWith(function (data, type, row, meta) {
                                return upDownFilter(data);
                            }),

                        DTColumnBuilder.newColumn('percent_change_24h').withTitle('24 H').notSortable()
                            .renderWith(function (data, type, row, meta) {
                                return upDownFilter(data);
                            }),

                        DTColumnBuilder.newColumn('percent_change_7d').withTitle('7 D').notSortable()
                            .renderWith(function (data, type, row, meta) {
                                return upDownFilter(data);
                            }),

                    ];

                    $scope.dtInstanceCallback = function (_dtInstance) {
                        $scope.dtInstance = _dtInstance;
                    };

                    $scope.reloadMaCap = function () {
                        if ($scope.dtInstance) {
                            $scope.dtInstance._renderer.rerender();
                        }
                    };



        }]);
