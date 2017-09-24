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

angular.module('dashboard').controller('DashboardCtrl',
    ['$scope', 'SessionStorageService', '$state', '$uibModal', '$stateParams', 'DashboardService',
        'informativeCountFilter', 'loginConfig', 'arrayCountFilter', 'balanceStylerFilter', 'amountTQTFilter',
        function ($scope, SessionStorageService, $state, $uibModal, $stateParams, DashboardService,
                  informativeCountFilter, loginConfig, arrayCountFilter, balanceStylerFilter, amountTQTFilter) {

            $scope.closeAllDashboards=false;

            $scope.getAccountPollsCount = function () {
                var accountId = getAccountDetails('accountRs');
                DashboardService.getAccountPolls(accountId, 0, 100).then(function (success) {
                    $scope.pollsCount = informativeCountFilter(success.polls, 100);
                }, function (error) {

                });
            };

            $scope.getAccountAliasesCount = function () {
                var accountId = getAccountDetails('accountId');
                DashboardService.getAccountAliases(accountId, 0, 100).then(function (success) {
                    $scope.aliasesCount = informativeCountFilter(success.aliases, 100);
                }, function (error) {

                });
            };

            $scope.getAccountMessagesCount = function () {
                var accountId = getAccountDetails('accountRs');
                DashboardService.getAccountBlockChainTransactions(accountId, 0, 100).then(function (success) {
                    $scope.messagesCount = informativeCountFilter(success.transactions, 100);
                }, function (error) {

                });
            };

            $scope.getAccountAssetsAndBalances = function () {
                var accountId = getAccountDetails('accountRs');
                DashboardService.getAccountAssetsAndBalances(accountId).then(function (success) {
                    $scope.currenciesCount = arrayCountFilter(success.accountCurrencies);
                    $scope.assetsCount = arrayCountFilter(success.assetBalances);
                    $scope.accountBalance = amountTQTFilter(success.balanceTQT);
                }, function (error) {

                });
            };

            function getAccountDetails(keyName) {
                var accountDetails = SessionStorageService.getFromSession(loginConfig.SESSION_ACCOUNT_DETAILS_KEY);
                if (keyName) {
                    return accountDetails[keyName];
                }
                return accountDetails;
            }

            function reloadDashboard() {
                $scope.getAccountPollsCount();
                $scope.getAccountAliasesCount();
                $scope.getAccountAssetsAndBalances();
                $scope.getAccountMessagesCount();
            }

            $scope.reloadDashboard = reloadDashboard;

            $scope.$on('reload-dashboard', reloadDashboard);


        }]);
