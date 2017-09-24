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

angular.module('exchanges').controller('BlockrMainController', ['$scope', 'BlockrService', '$uibModal',
    function ($scope, BlockrService, $uibModal) {

        $scope.openBtcDetailsModal = function (address) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'exchanges/modals/btc-details.html',
                size: 'lg',
                controller: 'BlockrController',
                resolve: {
                    params: function () {
                        return {
                            address: address,
                        };
                    }
                }
            });
        };
    }]);

angular.module('exchanges').controller('BlockrController',
    ['$scope', 'BlockrService', '$uibModalInstance', 'params', 'DTColumnBuilder', 'DTOptionsBuilder', '$compile',
        function ($scope, BlockrService, $uibModalInstance, params, DTColumnBuilder, DTOptionsBuilder, $compile) {

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };

            $scope.getBtcAdressBalance = function () {
                BlockrService.getAddressBalance(params.address).then(function (success) {
                    $scope.balance = success.data.balance;
                }, function (error) {

                });
            };

            $scope.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers')
                .withDOM('frtip')
                .withOption('info', false)
                .withOption('serverSide', false)
                .withDataProp('transactions')
                .withOption('responsive', true)
                .withOption('paging', true)
                .withOption('ordering', false)
                .withOption('processing', false)
                .withOption('bFilter', false).withOption('fnRowCallback',
                    function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                        $compile(nRow)($scope);
                    })
                .withOption('ajax', function (data, callback, settings) {
                    BlockrService.getAccountTransactions(params.address).then(function (response) {
                        callback({
                            'iTotalRecords': response.data.limit_txs,
                            'iTotalDisplayRecords': response.data.nb_txs_displayed,
                            'transactions': response.data.txs
                        });
                    });
                })
                .withDisplayLength(5).withBootstrap();

            $scope.dtColumns = [
                DTColumnBuilder.newColumn('time_utc').withTitle('Date').notSortable(),
                DTColumnBuilder.newColumn('confirmations').withTitle('Confirmations').notSortable(),
                DTColumnBuilder.newColumn('amount').withTitle('Amount').notSortable()
            ];

            $scope.dtInstanceCallback = function (_dtInstance) {
                $scope.dtInstance = _dtInstance;
            };


        }]);
