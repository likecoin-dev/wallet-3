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

angular.module('aliases').controller('SearchAliasFormCtrl',
    ['$scope', 'AliasService', 'SessionStorageService', '$state', 'DTOptionsBuilder',
        'DTColumnBuilder', 'searchTermFilter', '$compile', 'multiStepFormScope', '$validation','supplyFilter','currencyModelFilter',
        function ($scope, AliasService, SessionStorageService, $state, DTOptionsBuilder,
                  DTColumnBuilder, searchTermFilter, $compile, multiStepFormScope, $validation,supplyFilter,currencyModelFilter) {

            $scope.searchAliasForm = {};

            $scope.onSubmit = function () {
                $validation.validate($scope.searchAliasForm);
                if ($scope.searchAliasForm.$valid) {
                    $scope.$nextStep();
                }
            };

            $scope.searchAliasForm = angular.copy(multiStepFormScope.searchAliasForm);

            $scope.$on('$destroy', function () {
                multiStepFormScope.searchAliasForm = angular.copy($scope.searchAliasForm);
            });

            $scope.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers')
                .withDOM('frtip')
                .withOption('info', false)
                .withOption('serverSide', true)
                .withDataProp('aliases')
                .withOption('processing', true)
                .withOption('bFilter', false)
                .withOption('ordering', false)
                .withOption('fnRowCallback',
                    function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                        $compile(nRow)($scope);
                    })
                .withOption('ajax', function (data, callback, settings) {
                    var query = $scope.searchAliasForm.query;
                    var endIndex = data.start + data.length - 1;

                    AliasService.searchAlias(query, data.start, endIndex).then(function (response) {
                        callback({
                            'iTotalRecords': 1000,
                            'iTotalDisplayRecords': 1000,
                            'aliases': response.aliases
                        });
                    });
                })
                .withDisplayLength(10).withBootstrap();

            $scope.dtColumns = [
                DTColumnBuilder.newColumn('aliasName').withTitle('Name').notSortable(),

                DTColumnBuilder.newColumn('aliasURI').withTitle('URI').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        var aliasType=data.split(':')[0];
                        if(aliasType==='acct'){
                            var accountId=data.substring(data.lastIndexOf(':')+1,data.lastIndexOf('@'));
                            return '<a  ng-controller="AccountMainCtrl"' +
                                ' ' +
                                'ng-click="openSendTokenModal(\'' + accountId + '\')">' +data + '</a>';
                        }else if(aliasType==='url'){
                            var url=data.substring(data.lastIndexOf(':')+1,data.lastIndexOf('@'));
                            if (!/^https?:\/\//i.test(url)) {
                                url = 'http://' + url;
                            }
                            return '<a href="'+url+'" target="_blank">'+data+'</a>';
                        }else if(aliasType==='btc'){
                            var address=data.substring(data.lastIndexOf(':')+1,data.lastIndexOf('@'));
                            return '<a  ng-controller="BlockrMainController"' +
                                ' ' +
                                'ng-click="openBtcDetailsModal(\'' + address+ '\')">' +data + '</a>';
                        }
                        return data;
                    }),

                DTColumnBuilder.newColumn('accountRS').withTitle('Owner').notSortable()
                    .renderWith(function (data, type, row, meta) {
                    return '<button type="button" class="btn btn-success btn-xs" ng-controller="SearchCtrl"' +
                        ' ' +
                        'ng-click="searchValue(\'' + data + '\')">' +
                        '<i class="fa fa-list-ul" aria-hidden="true"></i>' + '</button>';

                    }),
            ];

            $scope.dtInstanceCallback = function (_dtInstance) {
                $scope.dtInstance = _dtInstance;
            };
        }]);
