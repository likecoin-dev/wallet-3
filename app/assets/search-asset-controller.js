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

angular.module('assets').controller('SearchAssetFormCtrl',
    ['$scope', 'AssetsService', 'SessionStorageService', '$state', 'DTOptionsBuilder',
        'DTColumnBuilder', 'searchTermFilter', '$compile', 'multiStepFormScope', '$validation', 'supplyFilter','$q',
        function ($scope, AssetsService, SessionStorageService, $state, DTOptionsBuilder,
                  DTColumnBuilder, searchTermFilter, $compile, multiStepFormScope, $validation, supplyFilter,$q) {

            $scope.searchAssetForm = {};

            $scope.onSubmit = function () {
                $validation.validate($scope.searchAssetForm);
                if ($scope.searchAssetForm.$valid) {
                    $scope.$nextStep();
                }
            };

            $scope.searchAssetForm = angular.copy(multiStepFormScope.searchAssetForm);

            $scope.$on('$destroy', function () {
                multiStepFormScope.searchAssetForm = angular.copy($scope.searchAssetForm);
            });

            $scope.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers')
                .withDOM('frtip')
                .withOption('serverSide', false)
                .withDataProp('assets')
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
                    var query = $scope.searchAssetForm.query;
                    var nameSearch=AssetsService.serachAssets(query);
                    var idSearch=AssetsService.getAsset(query);
                    $q.all([nameSearch,idSearch]).then(function (response) {
                        if(response[1].asset){
                            response[0].assets=response[0].assets||[];
                            response[0].assets.push(response[1]);
                        }
                        callback({
                            'iTotalRecords': 1000,
                            'iTotalDisplayRecords': 1000,
                            'assets': response[0].assets
                        });
                    });
                })
                .withDisplayLength(10).withBootstrap();

            $scope.dtColumns = [
                DTColumnBuilder.newColumn('name').withTitle('Name').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return data;
                    }),

                DTColumnBuilder.newColumn('accountRS').withTitle('Issuer').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return searchTermFilter(data);
                    }),

                DTColumnBuilder.newColumn('asset').withTitle('Action').notSortable()
                    .renderWith(function (data, type, row, meta) {

                        var details = '<button type="button" class="btn btn-default btn-sm" ng-controller="AssetsMainCtrl"' +
                            ' ng-click="openAssetDetailsModal(\'' + row.asset + '\')">' +
                            ' <i class="fa fa-info-circle" aria-hidden="true"></i> ' + '</button>';


                        var trade = '<button type="button" class="btn btn-default btn-sm" ng-controller="AssetsMainCtrl"' +
                            ' ng-click="openTradeDeskModal(\'' + data +
                            '\',\'' + row.decimals + '\')">' +
                            ' <i class="fa fa-bar-chart" aria-hidden="true"></i> ' + '</button>';

                        return details + '&nbsp;' + trade;

                    }),


            ];

            $scope.dtInstanceCallback = function (_dtInstance) {
                $scope.dtInstance = _dtInstance;
            };
        }]);
