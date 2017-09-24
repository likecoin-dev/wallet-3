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

angular.module('assets').controller('PlaceOrderFormController',
    ['$scope', 'AssetsService', 'SessionStorageService', '$state', 'CryptoService', 'loginConfig',
        'AlertService', 'alertConfig', '$validation', '$uibModal', 'multiStepFormScope', 'FeeService', '$rootScope',
        'CommonsService', 'shareToQuantiyFilter', 'amountToQuantFilter', 'quantityToShareFilter',
        function ($scope, AssetsService, SessionStorageService, $state, CryptoService,
                  loginConfig, AlertService, alertConfig, $validation, $uibModal, multiStepFormScope, FeeService,
                  $rootScope, CommonsService, shareToQuantiyFilter, amountToQuantFilter, quantityToShareFilter) {


            $scope.$on('$destroy', function () {
                multiStepFormScope.placeOrderForm = angular.copy($scope.placeOrderForm);
            });

            $scope.hasPrivateKeyInSession = function () {
                if (SessionStorageService.getFromSession(loginConfig.SESSION_ACCOUNT_PRIVATE_KEY)) {
                    return true;
                }
                return false;
            };

            $scope.placeOrder = function () {

                $scope.placeOrderForm = {};
                var data = $scope.$getActiveStep().data;
                if (data) {
                    $scope.placeOrderForm.assetId = data.assetId;
                    $scope.placeOrderForm.requestType = data.requestType;
                    $scope.placeOrderForm.asset = data.asset;
                    $scope.placeOrderForm.quantity = data.quantity;
                    $scope.placeOrderForm.price = data.price;
                    $scope.placeOrderForm.decimals = data.decimals;
                    $scope.placeOrderForm.fee = 1;
                    $scope.placeOrderForm.asset = data.asset;
                }

                var placeOrderForm = $scope.placeOrderForm;
                var asset = placeOrderForm.assetId;
                var fee = placeOrderForm.fee;

                var quantity = parseInt(shareToQuantiyFilter(placeOrderForm.quantity, placeOrderForm.decimals));

                var price = parseInt(placeOrderForm.price * 100000000 / Math.pow(10, placeOrderForm.decimals));

                var publicKey = CommonsService.getAccountDetailsFromSession('publicKey');
                var secret = placeOrderForm.secretPhrase;
                var requestType = placeOrderForm.requestType;

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
                $scope.placeAssetOrderPromise=AssetsService.placeOrder(publicKey, price, asset, quantity, fee, requestType)
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
                                }, alertConfig.placeAssertOrderModalAlert
                            );
                        }
                    }, function (error) {
                        AlertService.addAlert(AlertService.getNoConnectionMessage(error),
                            alertConfig.placeAssertOrderModalAlert
                        );
                    });

            };

            $scope.broadcastTransaction = function (transactionBytes) {
                $scope.placeAssetOrderPromise=CommonsService.broadcastTransaction(transactionBytes).then(function (success) {
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
                        alertConfig.placeAssertOrderModalAlert
                    );
                });
            };

        }]);
