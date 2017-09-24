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

angular.module('currencies').controller('PublishExchangeOrderFormController',
    ['$scope', 'CurrenciesService', 'SessionStorageService', '$state', 'CryptoService', 'loginConfig',
        'AlertService', 'alertConfig', '$validation', '$uibModal', 'multiStepFormScope', 'FeeService', '$rootScope',
        'CommonsService', 'shareToQuantiyFilter', 'amountToQuantFilter',
        function ($scope, CurrenciesService, SessionStorageService, $state, CryptoService,
                  loginConfig, AlertService, alertConfig, $validation, $uibModal, multiStepFormScope, FeeService,
                  $rootScope, CommonsService, shareToQuantiyFilter, amountToQuantFilter) {


            $scope.publishExchangeOfferForm = angular.copy(multiStepFormScope.publishExchangeOfferForm);

            $scope.initStep1 = function () {
                var data = $scope.$getActiveStep().data;
                if (data) {
                    $scope.publishExchangeOfferForm.currencyId = data.currencyId;
                    $scope.publishExchangeOfferForm.decimals = data.decimals;
                    $scope.publishExchangeOfferForm.ticker = data.ticker;
                    CurrenciesService.getCurrencyById(data.currencyId).then(function (success) {
                        $scope.publishExchangeOfferForm.name = success.name;
                    });

                }
            };

            $scope.$on('$destroy', function () {
                multiStepFormScope.publishExchangeOfferForm = angular.copy($scope.publishExchangeOfferForm);
            });

            $scope.hasPrivateKeyInSession = function () {
                if (SessionStorageService.getFromSession(loginConfig.SESSION_ACCOUNT_PRIVATE_KEY)) {
                    return true;
                }
                return false;
            };

            $scope.getBlockChainStatus = function () {
                CurrenciesService.getBlockChainStatus().then(function (success) {
                    $scope.publishExchangeOfferForm.currentHeight = success.numberOfBlocks;
                });
            };

            $scope.expirationHeight = 1440;
            $scope.days = 1;

            $scope.increment = function () {
                if ($scope.expirationHeight >= 14400) {
                    $scope.expirationHeight = 14400;
                    return;
                } else {
                    $scope.expirationHeight = $scope.expirationHeight + 1440;
                }

                $scope.publishExchangeOfferForm.expirationHeight = $scope.expirationHeight;
                $scope.days = parseInt($scope.expirationHeight / 1440);
            };

            $scope.decrement = function () {
                if ($scope.expirationHeight <= 1440) {
                    $scope.expirationHeight = 1440;
                    return;
                } else {
                    $scope.expirationHeight = $scope.expirationHeight - 1440;
                }

                $scope.publishExchangeOfferForm.expirationHeight = $scope.expirationHeight;
                $scope.days = parseInt($scope.expirationHeight / 1440);
            };

            $scope.max = function () {
                $scope.expirationHeight = 14400;
                $scope.publishExchangeOfferForm.expirationHeight = 14400;

                $scope.days = parseInt($scope.expirationHeight / 1440);

            };

            $scope.min = function () {
                $scope.expirationHeight = 1440;
                $scope.publishExchangeOfferForm.expirationHeight = 1440;
                $scope.days = parseInt($scope.expirationHeight / 1440);
            };


            $scope.publishExchangeOffer = function () {

                var publishExchangeOfferForm = multiStepFormScope.publishExchangeOfferForm;
                var currency = publishExchangeOfferForm.currencyId;
                var limits = {};

                if (publishExchangeOfferForm.typeOnly === 'BUY') {

                    publishExchangeOfferForm.sellRate = publishExchangeOfferForm.buyRate;
                    publishExchangeOfferForm.sellLimit = 0;
                    publishExchangeOfferForm.initialSellSupply = 0;
                    publishExchangeOfferForm.buyLimit = publishExchangeOfferForm.initialBuySupply;

                }
                if (publishExchangeOfferForm.typeOnly === 'SELL') {
                    publishExchangeOfferForm.buyRate = publishExchangeOfferForm.sellRate;
                    publishExchangeOfferForm.buyLimit = 0;
                    publishExchangeOfferForm.initialBuySupply = 0;
                    publishExchangeOfferForm.sellLimit = publishExchangeOfferForm.initialSellSupply;


                }
                limits.buyRate = parseInt(amountToQuantFilter(publishExchangeOfferForm.buyRate) / Math.pow(10,
                        publishExchangeOfferForm.decimals));
                limits.sellRate = parseInt(amountToQuantFilter(publishExchangeOfferForm.sellRate) / Math.pow(10,
                        publishExchangeOfferForm.decimals));

                limits.totalBuy = parseInt(
                    publishExchangeOfferForm.buyLimit * Math.pow(10, publishExchangeOfferForm.decimals));
                limits.totalSell = parseInt(
                    publishExchangeOfferForm.sellLimit * Math.pow(10, publishExchangeOfferForm.decimals));

                var supply = {};

                supply.initialBuy = parseInt(
                    publishExchangeOfferForm.initialBuySupply * Math.pow(10, publishExchangeOfferForm.decimals));
                supply.initialSell = parseInt(
                    publishExchangeOfferForm.initialSellSupply * Math.pow(10, publishExchangeOfferForm.decimals));

                var expirationHeight = parseInt(publishExchangeOfferForm.expirationHeight) + parseInt(
                        publishExchangeOfferForm.currentHeight);

                $scope.publishExchangeOfferForm.expirationHeight = expirationHeight;

                var fee = 1;

                var publicKey = CommonsService.getAccountDetailsFromSession('publicKey');
                var secret = publishExchangeOfferForm.secretPhrase;
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
                $scope.publishExchangeOfferPromise = CurrenciesService.publishExchangeOffer(publicKey, currency, limits,
                    supply, expirationHeight, fee)
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
                                }, alertConfig.publishExchangeOfferModalAlert
                            );
                        }
                    }, function (error) {
                        AlertService.addAlert(AlertService.getNoConnectionMessage(error),
                            alertConfig.publishExchangeOfferModalAlert);
                    });

            };

            $scope.broadcastTransaction = function (transactionBytes) {
                $scope.publishExchangeOfferPromise = CommonsService.broadcastTransaction(transactionBytes)
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
