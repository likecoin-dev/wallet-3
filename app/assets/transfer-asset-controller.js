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

angular.module('assets').controller('TransferAssetFormController',
    ['$scope', 'AssetsService', 'SessionStorageService', '$state', 'CryptoService', 'loginConfig',
        'AlertService', 'alertConfig', '$validation', '$uibModal', 'multiStepFormScope', 'FeeService', '$rootScope',
        'CommonsService', 'shareToQuantiyFilter',
        function ($scope, AssetsService, SessionStorageService, $state, CryptoService,
                  loginConfig, AlertService, alertConfig, $validation, $uibModal, multiStepFormScope, FeeService,
                  $rootScope, CommonsService, shareToQuantiyFilter) {

            $scope.transferAssetForm = angular.copy(multiStepFormScope.transferAssetForm);

            $scope.initStep1 = function () {
                var data = $scope.$getActiveStep().data;
                if (data) {
                    $scope.transferAssetForm.assetId = data.assetId;
                    $scope.transferAssetForm.decimals = data.decimals;
                    $scope.transferAssetForm.name = data.name;
                    if(data.assetId) {
                        AssetsService.getAsset(data.assetId).then(function (success) {
                            $scope.transferAssetForm.name = success.name;
                        });
                    }
                }
            };

            $scope.nextStep = function () {
                if ($scope.transferAssetForm.assetId && $scope.transferAssetForm.decimals !== undefined && $scope.transferAssetForm.name) {
                    $scope.$nextStep();
                } else {
                    var assetId = $scope.transferAssetForm.assetId;
                    AssetsService.getAsset(assetId, true).then(function (success) {
                        if (success.asset) {
                            $scope.transferAssetForm.assetId = success.asset;
                            $scope.transferAssetForm.decimals = success.decimals;
                            $scope.transferAssetForm.name = success.name;
                            $scope.$nextStep();
                        } else {
                            AlertService.addAlert(
                                {
                                    type: 'danger',
                                    msg: 'Sorry, an error occured! Reason: ' + success.errorDescription
                                }, alertConfig.transferAssetModalAlert
                            );
                        }
                    },  function (error) {
                        AlertService.addAlert(AlertService.getNoConnectionMessage(error),
                            alertConfig.transferAssetModalAlert
                        );
                    });
                }
            };

            $scope.$on('$destroy', function () {
                multiStepFormScope.transferAssetForm = angular.copy($scope.transferAssetForm);
            });

            $scope.openAddressBookModal = function () {
                var modalInstance = $uibModal.open({
                    animation: false,
                    templateUrl: 'addressbook/views/addressbook-light.html',
                    controller: 'AddressBookCtrl',
                    resolve: {
                        params: function () {
                            return {
                                'closeOnClick': true
                            };
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    $scope.transferAssetForm.recipient = result.accountRS;
                });
            };

            $scope.hasPrivateKeyInSession = function () {
                if (SessionStorageService.getFromSession(loginConfig.SESSION_ACCOUNT_PRIVATE_KEY)) {
                    return true;
                }
                return false;
            };

            $scope.transferAsset = function () {
                var transferAssetForm = multiStepFormScope.transferAssetForm;
                var asset = transferAssetForm.assetId;
                var quantity = shareToQuantiyFilter(transferAssetForm.quantity, $scope.transferAssetForm.decimals);
                var fee = transferAssetForm.fee;
                var recipientRS = transferAssetForm.recipient;
                var publicKey = CommonsService.getAccountDetailsFromSession('publicKey');





                var secret = transferAssetForm.secretPhrase;
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

                $scope.sendAssetPromise = AssetsService.transferAsset(publicKey, recipientRS, asset, quantity, fee)
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
                                }, alertConfig.transferAssetModalAlert
                            );
                        }
                    }, function (error) {
                        AlertService.addAlert(AlertService.getNoConnectionMessage(error),
                            alertConfig.transferAssetModalAlert
                        );
                    });

            };

            $scope.broadcastTransaction = function (transactionBytes) {
                $scope.sendAssetPromise = CommonsService.broadcastTransaction(transactionBytes)
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
                            alertConfig.transferAssetModalAlert
                        );
                    });
            };

        }]);
