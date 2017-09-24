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

angular.module('currencies').controller('BuyCurrencyFormController',
    ['$scope', 'CurrenciesService', 'SessionStorageService', '$state', 'CryptoService', 'loginConfig',
        'AlertService', 'alertConfig', '$validation', '$uibModal', 'multiStepFormScope', 'FeeService', '$rootScope',
        'CommonsService', 'multiStepFormInstance', 'shareToQuantiyFilter', 'amountToQuantFilter',
        function ($scope, CurrenciesService, SessionStorageService, $state, CryptoService,
                  loginConfig, AlertService, alertConfig, $validation, $uibModal, multiStepFormScope, FeeService,
                  $rootScope, CommonsService, multiStepFormInstance, shareToQuantiyFilter, amountToQuantFilter) {


            $scope.buyCurrencyForm = angular.copy(multiStepFormScope.buyCurrencyForm);

            $scope.initStep1 = function () {
                var data = $scope.$getActiveStep().data;
                if (data) {
                    $scope.buyCurrencyForm.currencyId = data.currencyId;
                    $scope.buyCurrencyForm.decimals = data.decimals;
                }
            };

            $scope.$on('$destroy', function () {
                multiStepFormScope.buyCurrencyForm = angular.copy($scope.buyCurrencyForm);
            });

            $scope.hasPrivateKeyInSession = function () {
                if (SessionStorageService.getFromSession(loginConfig.SESSION_ACCOUNT_PRIVATE_KEY)) {
                    return true;
                }
                return false;
            };

            $scope.buyCurrency = function () {
                var data = $scope.$getActiveStep().data;
                $scope.buyCurrencyForm = $scope.buyCurrencyForm || {};

                if (data) {
                    $scope.buyCurrencyForm.currency = data.currency;
                    $scope.buyCurrencyForm.currencyId = data.currencyId;
                    $scope.buyCurrencyForm.currency = data.currency;
                    $scope.buyCurrencyForm.shares = data.shares;
                    $scope.buyCurrencyForm.rate = data.rate;
                    $scope.buyCurrencyForm.decimals = data.decimals;
                    $scope.buyCurrencyForm.fee = 1;
                }

                var buyCurrencyForm = multiStepFormScope.buyCurrencyForm || $scope.buyCurrencyForm;
                var currency = buyCurrencyForm.currencyId;
                var fee = 1;
                var publicKey = CommonsService.getAccountDetailsFromSession('publicKey');

                var units = parseInt(shareToQuantiyFilter(buyCurrencyForm.shares, buyCurrencyForm.decimals));
                var rateTQT = parseInt(
                    amountToQuantFilter(buyCurrencyForm.rate) / Math.pow(10, buyCurrencyForm.decimals));


                var secret = buyCurrencyForm.secretPhrase;
                var secretPhraseHex;
                if (secret) {
                    secretPhraseHex = CryptoService.secretPhraseToPrivateKey(secret);
                } else {
                    secretPhraseHex =
                        SessionStorageService.getFromSession(loginConfig.SESSION_ACCOUNT_PRIVATE_KEY);
                }
                $scope.buyCurrencyPromise = CurrenciesService.buyCurrency(publicKey, currency, rateTQT, units, fee)
                    .then(function (success) {
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
                                }, alertConfig.buyCurrencyModalAlert
                            );
                        }
                    }, function (error) {
                        AlertService.addAlert(AlertService.getNoConnectionMessage(error),
                            alertConfig.buyCurrencyModalAlert);
                    });


            };

            $scope.broadcastTransaction = function (transactionBytes) {
                $scope.buyCurrencyPromise = CommonsService.broadcastTransaction(transactionBytes)
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
                            alertConfig.buyCurrencyModalAlert);
                    });
            };

        }]);
