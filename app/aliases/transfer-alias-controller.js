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

angular.module('aliases').controller('TransferAliasFormController',
    ['$scope', 'AliasService', 'SessionStorageService', '$state', 'CryptoService', 'loginConfig',
        'AlertService', 'alertConfig', '$validation', '$uibModal', 'multiStepFormScope', 'FeeService', '$rootScope',
        'CommonsService', 'amountToQuantFilter',
        function ($scope, AliasService, SessionStorageService, $state, CryptoService,
                  loginConfig, AlertService, alertConfig, $validation, $uibModal, multiStepFormScope, FeeService,
                  $rootScope, CommonsService, amountToQuantFilter) {

            $scope.transferAliasForm = angular.copy(multiStepFormScope.transferAliasForm);

            $scope.disableFields = {};

            $scope.initStep1 = function () {
                var data = $scope.$getActiveStep().data;
                $scope.transferAliasForm.name = data.name;
                $scope.transferAliasForm.uri = data.uri;
            };

            $scope.$on('$destroy', function () {
                multiStepFormScope.transferAliasForm = angular.copy($scope.transferAliasForm);
            });

            $scope.hasPrivateKeyInSession = function () {
                if (SessionStorageService.getFromSession(loginConfig.SESSION_ACCOUNT_PRIVATE_KEY)) {
                    return true;
                }
                return false;
            };

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
                    $scope.transferAliasForm.recipientRS = result.accountRS;
                });
            };

            $scope.TransferAlias = function () {

                var transferAliasForm = multiStepFormScope.transferAliasForm;
                var name = transferAliasForm.name;
                var recipientRS = transferAliasForm.recipientRS;
                var price = amountToQuantFilter(transferAliasForm.price);
                var fee = transferAliasForm.fee;
                var publicKey = CommonsService.getAccountDetailsFromSession('publicKey');
                var secret = transferAliasForm.secretPhrase;
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

                $scope.transferAliasPromise=AliasService.sellAlias(publicKey, name, recipientRS, price, fee)
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
                                }, alertConfig.transferAliasModalAlert
                            );
                        }
                    }, function (error) {
                        AlertService.addAlert(AlertService.getNoConnectionMessage(error),
                            alertConfig.transferAliasModalAlert);
                    });

            };

            $scope.broadcastTransaction = function (transactionBytes) {
                $scope.transferAliasPromise=CommonsService.broadcastTransaction(transactionBytes).then(function (success) {
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
                        alertConfig.transferAliasModalAlert);
                });
            };

        }]);
