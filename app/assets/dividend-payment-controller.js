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

angular.module('assets').controller('DividendPaymentFormController',
    ['$scope', 'AssetsService', 'SessionStorageService', '$state', 'CryptoService', 'loginConfig',
        'AlertService', 'alertConfig', '$validation', '$uibModal', 'multiStepFormScope', 'FeeService', '$rootScope',
        'CommonsService', 'shareToQuantiyFilter', 'amountToQuantFilter', 'CurrenciesService',
        function ($scope, AssetsService, SessionStorageService, $state, CryptoService,
                  loginConfig, AlertService, alertConfig, $validation, $uibModal, multiStepFormScope, FeeService,
                  $rootScope, CommonsService, shareToQuantiyFilter, amountToQuantFilter, CurrenciesService) {


            $scope.dividendPaymentForm = angular.copy(multiStepFormScope.dividendPaymentForm);

            $scope.initStep1 = function () {
                var data = $scope.$getActiveStep().data;
                if (data) {
                    $scope.dividendPaymentForm.assetId = data.assetId;
                    $scope.dividendPaymentForm.decimals = data.decimals;
                    AssetsService.getAsset(data.assetId).then(function (success) {
                        $scope.dividendPaymentForm.asset = success.name;
                    });
                }

                CurrenciesService.getBlockChainStatus().then(function (success) {
                    $scope.dividendPaymentForm.height = success.numberOfBlocks;
                    $scope.dividendPaymentForm.height = $scope.dividendPaymentForm.height - 1;
                });


            };

            $scope.$on('$destroy', function () {
                multiStepFormScope.dividendPaymentForm = angular.copy($scope.dividendPaymentForm);
            });

            $scope.hasPrivateKeyInSession = function () {
                if (SessionStorageService.getFromSession(loginConfig.SESSION_ACCOUNT_PRIVATE_KEY)) {
                    return true;
                }
                return false;
            };

            $scope.dividendPayment = function () {
                var dividendPaymentForm = multiStepFormScope.dividendPaymentForm;
                var assetId = dividendPaymentForm.assetId;

                var amountPerQuant = amountToQuantFilter(dividendPaymentForm.amountPerQuant);

                amountPerQuant = parseInt(amountPerQuant / Math.pow(10, parseInt(dividendPaymentForm.decimals)));

                if (amountPerQuant < 1) {
                  AlertService.addAlert(
                      {
                          type: 'danger',
                          msg: 'Sorry, an error occured! Reason: ' + 'Amount per share less than asset decimals: (' + dividendPaymentForm.decimals + '). Dividend would be (0) per smallest asset unit.'
                      }, alertConfig.dividendPaymentModalAlert
                  );
                  return;
                }

                var fee = 1;
                var height = dividendPaymentForm.height;
                var publicKey = CommonsService.getAccountDetailsFromSession('publicKey');
                var secret = dividendPaymentForm.secretPhrase;
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
                $scope.dividendPaymentPromise=AssetsService.dividendPayment(publicKey, assetId, height, amountPerQuant, fee)
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
                                }, alertConfig.dividendPaymentModalAlert
                            );
                        }
                    }, function (error) {
                        AlertService.addAlert(AlertService.getNoConnectionMessage(error),
                            alertConfig.dividendPaymentModalAlert
                        );
                    });

            };

            $scope.broadcastTransaction = function (transactionBytes) {
                $scope.dividendPaymentPromise=CommonsService.broadcastTransaction(transactionBytes).then(function (success) {
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
                        alertConfig.dividendPaymentModalAlert
                    );
                });
            };

        }]);
