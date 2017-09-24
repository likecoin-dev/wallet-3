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

angular.module('currencies').controller('CurrencyReserveClaimFormController',
    ['$scope', 'CurrenciesService', 'SessionStorageService', '$state', 'CryptoService', 'loginConfig',
        'AlertService', 'alertConfig', '$validation', '$uibModal', 'multiStepFormScope', 'FeeService', '$rootScope',
        'CommonsService', 'multiStepFormInstance', 'shareToQuantiyFilter',
        function ($scope, CurrenciesService, SessionStorageService, $state, CryptoService,
                  loginConfig, AlertService, alertConfig, $validation, $uibModal, multiStepFormScope, FeeService,
                  $rootScope, CommonsService, multiStepFormInstance, shareToQuantiyFilter) {


            $scope.currencyReserveClaimForm = angular.copy(multiStepFormScope.currencyReserveClaimForm);

            $scope.initStep1 = function () {
                var data = $scope.$getActiveStep().data;
                if (data) {

                    $scope.currencyReserveClaimForm.currencyId = data.currencyId;
                    $scope.currencyReserveClaimForm.decimals = data.decimals;
                    $scope.currencyReserveClaimForm.ticker = data.ticker;

                }
            };

            $scope.$on('$destroy', function () {
                multiStepFormScope.currencyReserveClaimForm = angular.copy($scope.currencyReserveClaimForm);
            });

            $scope.hasPrivateKeyInSession = function () {
                if (SessionStorageService.getFromSession(loginConfig.SESSION_ACCOUNT_PRIVATE_KEY)) {
                    return true;
                }
                return false;
            };

            $scope.currencyReserveClaim = function () {
                var currencyReserveClaimForm = multiStepFormScope.currencyReserveClaimForm;
                var currency = currencyReserveClaimForm.currencyId;
                var fee = 1;
                var publicKey = CommonsService.getAccountDetailsFromSession('publicKey');

                var units = parseInt(
                    shareToQuantiyFilter(currencyReserveClaimForm.units, currencyReserveClaimForm.decimals));
                var secret = currencyReserveClaimForm.secretPhrase;
                var secretPhraseHex;
                if (secret) {
                    secretPhraseHex = CryptoService.secretPhraseToPrivateKey(secret);
                } else {
                    secretPhraseHex =
                        SessionStorageService.getFromSession(loginConfig.SESSION_ACCOUNT_PRIVATE_KEY);
                }
                if (!fee) {
                    fee = 1;
                }
                $scope.currencyReserveClaimPromse = CurrenciesService.currencyReserveClaim(publicKey, currency, units,
                    fee).then(function (success) {
                    if (!success.errorCode) {
                        var unsignedBytes = success.unsignedTransactionBytes;
                        var signatureHex = CryptoService.signatureHex(unsignedBytes, secretPhraseHex);
                        $scope.transactionBytes =
                            CryptoService.signTransactionHex(unsignedBytes, signatureHex);
                        $scope.validBytes = true;

                        $scope.tx_fee = success.transactionJSON.feeTQT / 100000000;
                        $scope.tx_amount = success.transactionJSON.amountTQT / 100000000;
                        $scope.tx_total = $scope.tx_fee + $scope.tx_amount;

                    } else {
                        AlertService.addAlert(
                            {
                                type: 'danger',
                                msg: 'Sorry, an error occured! Reason: ' + success.errorDescription
                            }, alertConfig.currencyReserveClaimModalAlert
                        );
                    }
                }, function (error) {
                    AlertService.addAlert(AlertService.getNoConnectionMessage(error),
                        alertConfig.currencyReserveClaimModalAlert);
                });


            };

            $scope.broadcastTransaction = function (transactionBytes) {
                $scope.currencyReserveClaimPromse = CommonsService.broadcastTransaction(transactionBytes)
                    .then(function (success) {
                        $scope.$emit('close-modal');
                        $rootScope.$broadcast('reload-dashboard');
                        if (!success.errorCode) {
                            AlertService.addAlert(
                                {
                                    type: 'success',
                                    msg: 'Transaction succesfull broadcasted with Id : ' + success.transaction +
                                    ''
                                });
                            // $state.go('client.signedin.account.pending');
                        } else {
                            AlertService.addAlert(
                                {
                                    type: 'danger',
                                    msg: 'Unable to broadcast transaction. Reason: ' + success.errorDescription
                                });
                        }

                    }, function (error) {
                        AlertService.addAlert(AlertService.getNoConnectionMessage(error),
                            alertConfig.currencyReserveClaimModalAlert);
                    });
            };

        }]);
