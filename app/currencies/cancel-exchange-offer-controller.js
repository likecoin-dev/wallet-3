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

angular.module('currencies').controller('CancelExchangeOfferFormController',
    ['$scope', 'CurrenciesService', 'SessionStorageService', '$state', 'CryptoService', 'loginConfig',
        'AlertService', 'alertConfig', '$validation', '$uibModal', 'multiStepFormScope', 'FeeService', '$rootScope',
        'CommonsService', 'shareToQuantiyFilter', 'amountToQuantFilter',
        function ($scope, CurrenciesService, SessionStorageService, $state, CryptoService,
                  loginConfig, AlertService, alertConfig, $validation, $uibModal, multiStepFormScope, FeeService,
                  $rootScope, CommonsService, shareToQuantiyFilter, amountToQuantFilter) {


            $scope.cancelExchangeOfferForm = angular.copy(multiStepFormScope.cancelExchangeOfferForm) || {};
            $scope.cancelExchangeOfferForm.buyRate = 0.00000001;
            $scope.cancelExchangeOfferForm.buyLimit = 1;
            $scope.cancelExchangeOfferForm.initialBuySupply = 1;
            $scope.cancelExchangeOfferForm.sellLimit = 1;
            $scope.cancelExchangeOfferForm.initialSellSupply = 1;

            $scope.initStep1 = function () {
                var data = $scope.$getActiveStep().data;
                if (data) {
                    $scope.cancelExchangeOfferForm.currencyId = data.currencyId;
                    $scope.cancelExchangeOfferForm.typeOnly = data.typeOnly;
                    CurrenciesService.getCurrencyById(data.currencyId).then(function (success) {
                        $scope.cancelExchangeOfferForm.code = success.code;
                        $scope.cancelExchangeOfferForm.name = success.name;
                        $scope.cancelExchangeOfferForm.decimals = success.decimals;
                    });
                }
            };

            $scope.$on('$destroy', function () {
                multiStepFormScope.cancelExchangeOfferForm = angular.copy($scope.cancelExchangeOfferForm);
            });

            $scope.hasPrivateKeyInSession = function () {
                if (SessionStorageService.getFromSession(loginConfig.SESSION_ACCOUNT_PRIVATE_KEY)) {
                    return true;
                }
                return false;
            };

            $scope.getBlockChainStatus = function () {
                CurrenciesService.getBlockChainStatus().then(function (success) {
                    $scope.cancelExchangeOfferForm.currentHeight = success.numberOfBlocks;
                });
            };

            $scope.cancelExchangeOffer = function () {

                var cancelExchangeOfferForm = $scope.cancelExchangeOfferForm;
                var currency = cancelExchangeOfferForm.currencyId;

                var limits = {};

                cancelExchangeOfferForm.sellRate = cancelExchangeOfferForm.buyRate;
                if (cancelExchangeOfferForm.typeOnly === 'BUY') {
                    cancelExchangeOfferForm.sellLimit = 0;
                    cancelExchangeOfferForm.initialSellSupply = 0;
                }
                if (cancelExchangeOfferForm.typeOnly === 'SELL') {
                    cancelExchangeOfferForm.buyLimit = 0;
                    cancelExchangeOfferForm.initialBuySupply = 0;
                }

                limits.buyRate = 1;
                limits.sellRate = 1;

                limits.totalBuy = parseFloat(
                    cancelExchangeOfferForm.buyLimit * Math.pow(10, cancelExchangeOfferForm.decimals));
                limits.totalSell = parseFloat(
                    cancelExchangeOfferForm.sellLimit * Math.pow(10, cancelExchangeOfferForm.decimals));

                var supply = {};

                supply.initialBuy = parseFloat(
                    cancelExchangeOfferForm.initialBuySupply * Math.pow(10, cancelExchangeOfferForm.decimals));
                supply.initialSell = parseFloat(
                    cancelExchangeOfferForm.initialSellSupply * Math.pow(10, cancelExchangeOfferForm.decimals));

                var fee = 1;

                var publicKey = CommonsService.getAccountDetailsFromSession('publicKey');
                var secret = cancelExchangeOfferForm.secretPhrase;
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
                $scope.cancelExchangeOfferPromise = CurrenciesService.getBlockChainStatus().then(function (success) {
                    var expirationHeight = success.numberOfBlocks + 2;
                    $scope.cancelExchangeOfferPromise = CurrenciesService.publishExchangeOffer(publicKey, currency,
                        limits, supply, expirationHeight, fee)
                        .then(function (success) {
                            if (!success.errorCode) {

                                var unsignedBytes = success.unsignedTransactionBytes;
                                var signatureHex = CryptoService.signatureHex(unsignedBytes, secretPhraseHex);
                                $scope.transactionBytes =
                                    CryptoService.signTransactionHex(unsignedBytes, signatureHex);
                                $scope.broadcastTransaction($scope.transactionBytes);
                                $scope.validBytes = true;

                                $scope.tx_fee = success.transactionJSON.feeTQT / 100000000;
                                $scope.tx_amount = success.transactionJSON.amountTQT / 100000000;
                                $scope.tx_total = $scope.tx_fee + $scope.tx_amount;
                            } else {
                                AlertService.addAlert(
                                    {
                                        type: 'danger',
                                        msg: 'Sorry, an error occured! Reason: ' + success.errorDescription
                                    }, alertConfig.publishExchangeOfferModalAlert
                                );
                            }
                        }, function (error) {
                            AlertService.addAlert(AlertService.getNoConnectionMessage(error),
                                alertConfig.publishExchangeOfferModalAlert);
                        });
                });


            };

            $scope.broadcastTransaction = function (transactionBytes) {
                $scope.cancelExchangeOfferPromise = CommonsService.broadcastTransaction(transactionBytes)
                    .then(function (success) {
                        $scope.$emit('close-modal');
                        $rootScope.$broadcast('reload-dashboard');
                        $rootScope.$broadcast('order-placed');
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
                            alertConfig.publishExchangeOfferModalAlert);
                    });
            };

        }]);
