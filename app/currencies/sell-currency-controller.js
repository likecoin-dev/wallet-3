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

angular.module('currencies').controller('SellCurrencyFormController',
    ['$scope', 'CurrenciesService', 'SessionStorageService', '$state', 'CryptoService', 'loginConfig',
        'AlertService', 'alertConfig', '$validation', '$uibModal', 'multiStepFormScope', 'FeeService', '$rootScope',
        'CommonsService', 'multiStepFormInstance', 'shareToQuantiyFilter', 'amountToQuantFilter',
        function ($scope, CurrenciesService, SessionStorageService, $state, CryptoService,
                  loginConfig, AlertService, alertConfig, $validation, $uibModal, multiStepFormScope, FeeService,
                  $rootScope, CommonsService, multiStepFormInstance, shareToQuantiyFilter, amountToQuantFilter) {


            $scope.sellCurrencyForm = angular.copy(multiStepFormScope.sellCurrencyForm);

            $scope.initStep1 = function () {
                var data = $scope.$getActiveStep().data;
                if (data) {
                    $scope.sellCurrencyForm.currency = data.currency;
                    $scope.sellCurrencyForm.currencyId = data.currencyId;
                    $scope.sellCurrencyForm.decimals = data.decimals;
                }
            };

            $scope.$on('$destroy', function () {
                multiStepFormScope.sellCurrencyForm = angular.copy($scope.sellCurrencyForm);
            });

            $scope.hasPrivateKeyInSession = function () {
                if (SessionStorageService.getFromSession(loginConfig.SESSION_ACCOUNT_PRIVATE_KEY)) {
                    return true;
                }
                return false;
            };

            $scope.sellCurrency = function () {
                var data = $scope.$getActiveStep().data;
                $scope.sellCurrencyForm = $scope.sellCurrencyForm || {};

                if (data) {
                    $scope.sellCurrencyForm.currency = data.currency;
                    $scope.sellCurrencyForm.currencyId = data.currencyId;
                    $scope.sellCurrencyForm.currency = data.currency;
                    $scope.sellCurrencyForm.shares = data.shares;
                    $scope.sellCurrencyForm.rate = data.rate;
                    $scope.sellCurrencyForm.decimals = data.decimals;
                    $scope.sellCurrencyForm.fee = 1;
                }
                var sellCurrencyForm = $scope.sellCurrencyForm;
                var currency = sellCurrencyForm.currencyId;
                var fee = 1;
                var publicKey = CommonsService.getAccountDetailsFromSession('publicKey');

                var units = parseInt(shareToQuantiyFilter(sellCurrencyForm.shares, sellCurrencyForm.decimals));
                var rateTQT = parseInt(
                    amountToQuantFilter(sellCurrencyForm.rate) / Math.pow(10, sellCurrencyForm.decimals));


                var secret = sellCurrencyForm.secretPhrase;
                var secretPhraseHex;
                if (secret) {
                    secretPhraseHex = CryptoService.secretPhraseToPrivateKey(secret);
                } else {
                    secretPhraseHex =
                        SessionStorageService.getFromSession(loginConfig.SESSION_ACCOUNT_PRIVATE_KEY);
                }
                $scope.sellCurrencyPromise=CurrenciesService.sellCurrency(publicKey, currency, rateTQT, units, fee).then(function (success) {
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
                            }, alertConfig.sellCurrencyModalAlert
                        );
                    }
                }, function (error) {
                    AlertService.addAlert(AlertService.getNoConnectionMessage(error),
                        alertConfig.sellCurrencyModalAlert);
                });


            };

            $scope.broadcastTransaction = function (transactionBytes) {
                $scope.sellCurrencyPromise=CommonsService.broadcastTransaction(transactionBytes).then(function (success) {
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
                        alertConfig.sellCurrencyModalAlert);
                });
            };

        }]);
