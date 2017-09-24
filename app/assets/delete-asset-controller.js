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

angular.module('assets').controller('DeleteAssetFormController',
    ['$scope', 'AssetsService', 'SessionStorageService', '$state', 'CryptoService', 'loginConfig',
        'AlertService', 'alertConfig', '$validation', '$uibModal', 'multiStepFormScope', 'FeeService', '$rootScope',
        'CommonsService', 'multiStepFormInstance', 'shareToQuantiyFilter',
        function ($scope, AssetsService, SessionStorageService, $state, CryptoService,
                  loginConfig, AlertService, alertConfig, $validation, $uibModal, multiStepFormScope, FeeService,
                  $rootScope, CommonsService, multiStepFormInstance, shareToQuantiyFilter) {


            $scope.deleteAssetForm = angular.copy(multiStepFormScope.deleteAssetForm);

            $scope.initStep1 = function () {
                var data = $scope.$getActiveStep().data;
                if (data) {
                    $scope.deleteAssetForm.assetId = data.assetId;
                    $scope.deleteAssetForm.decimals = data.decimals;
                    AssetsService.getAsset(data.assetId).then(function (success) {
                        $scope.deleteAssetForm.asset = success.name;
                    });
                }
            };

            $scope.$on('$destroy', function () {
                multiStepFormScope.deleteAssetForm = angular.copy($scope.deleteAssetForm);
            });

            $scope.hasPrivateKeyInSession = function () {
                if (SessionStorageService.getFromSession(loginConfig.SESSION_ACCOUNT_PRIVATE_KEY)) {
                    return true;
                }
                return false;
            };

            $scope.deleteAsset = function () {
                var deleteAssetForm = multiStepFormScope.deleteAssetForm;
                var asset = deleteAssetForm.assetId;
                var fee = 1;
                var quantity = shareToQuantiyFilter(deleteAssetForm.quantity, $scope.deleteAssetForm.decimals);
                var publicKey = CommonsService.getAccountDetailsFromSession('publicKey');
                var secret = deleteAssetForm.secretPhrase;
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
                $scope.deleteAssetPromise = AssetsService.deleteAssetShares(asset, quantity, fee, publicKey)
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
                                }, alertConfig.deleteAssetModalAlert
                            );
                        }
                    }, function (error) {
                        AlertService.addAlert(AlertService.getNoConnectionMessage(error),
                            alertConfig.deleteAssetModalAlert
                        );
                    });

            };

            $scope.broadcastTransaction = function (transactionBytes) {
                $scope.deleteAssetPromise = CommonsService.broadcastTransaction(transactionBytes)
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
                            alertConfig.deleteAssetModalAlert);
                    });
            };

        }]);
