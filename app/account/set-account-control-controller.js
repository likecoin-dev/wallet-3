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

angular.module('account').controller('SetAccountControlCtrl',
    ['$scope', 'SessionStorageService', 'NodeService', 'loginConfig', 'nodeConfig', 'DTOptionsBuilder',
        'DTColumnBuilder', 'AccountService', '$compile', '$uibModal',
        '$q', 'AlertService', 'alertConfig', 'CryptoService', '$state', '$rootScope', 'multiStepFormScope',
        'CommonsService', '$validation',
        function ($scope, SessionStorageService, NodeService, loginConfig, nodeConfig, DTOptionsBuilder,
                  DTColumnBuilder, AccountService, $compile, $uibModal,
                  $q, AlertService, alertConfig, CryptoService, $state, $rootScope, multiStepFormScope,
                  CommonsService, $validation) {

            $scope.setAccountControlForm = angular.copy(multiStepFormScope.setAccountControlForm);

            $scope.$on('$destroy', function () {
                multiStepFormScope.setAccountControlForm = angular.copy($scope.setAccountControlForm);
            });

            $scope.addNewAccount = function () {
                $scope.setAccountControlForm.approveAccounts = $scope.setAccountControlForm.approveAccounts || [];
                var form = $scope.setAccountControlForm;
                if (form.approveAccounts.length >= 10) {
                    AlertService.addAlert(
                        {
                            type: 'danger',
                            msg: 'You can add only maximum 10 accounts.'
                        }, alertConfig.setAccountControlModalAlert
                    );
                } else {
                    form.approveAccounts.push({});
                }

            };

            $scope.nextStep = function () {
                if (validateForm()) {

                    $scope.foo = $scope.setAccountControlForm.approveAccounts[0];

                    $scope.$nextStep();
                } else {
                    AlertService.addAlert(
                        {
                            type: 'danger',
                            msg: 'This control setup is not valid, please check quorum and number of approval accounts.'
                        }, alertConfig.setAccountControlModalAlert);
                }
            };

            function validateForm() {
                var form = $scope.setAccountControlForm;
                var quorum = form.quorum || 2;
                var totalAccounts = form.approveAccounts || [];
                if (totalAccounts.length > quorum) {
                    var totalLength = totalAccounts.length;
                    var totalValid = 0;
                    for (var i = 0; i < totalLength; i++) {
                        if (totalAccounts[i].value) {
                            totalValid++;
                        }
                    }

                    return totalValid > quorum;
                }
                return false;
            }

            $scope.openAddressBookModal = function (account) {
                var modalInstance = $uibModal.open({
                    animation: true,
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
                    account.value = result.accountRS;
                });
            };

            $scope.hasPrivateKeyInSession = function () {
                if (SessionStorageService.getFromSession(loginConfig.SESSION_ACCOUNT_PRIVATE_KEY)) {
                    return true;
                }
                return false;
            };

            $scope.setAccountControl = function () {
                var setAccountControlForm = multiStepFormScope.setAccountControlForm;
                var quorum = setAccountControlForm.quorum;
                var accounts = setAccountControlForm.approveAccounts;
                for (var i = 0; i < accounts.length; i++) {
                    accounts[i] = accounts[i].value;
                }

                var fee = 1;
                var publicKey = CommonsService.getAccountDetailsFromSession('publicKey');
                var secret = setAccountControlForm.secretPhrase;
                var secretPhraseHex;
                if (secret) {
                    secretPhraseHex = CryptoService.secretPhraseToPrivateKey(secret);
                } else {
                    secretPhraseHex =
                        SessionStorageService.getFromSession(loginConfig.SESSION_ACCOUNT_PRIVATE_KEY);
                }
                $scope.setAccountControlPromise = AccountService.setAccountControl(publicKey, quorum, accounts, fee)
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
                                }, alertConfig.setAccountControlModalAlert
                            );
                        }
                    }, function (error) {
                        AlertService.addAlert(AlertService.getNoConnectionMessage(error),
                            alertConfig.setAccountControlModalAlert);
                    });

            };

            $scope.broadcastTransaction = function (transactionBytes) {
                $scope.setAccountControlPromise = CommonsService.broadcastTransaction(transactionBytes)
                    .then(function (success) {
                        if (!success.errorCode) {
                            AlertService.addAlert(
                                {
                                    type: 'success',
                                    msg: 'Transaction succesfull broadcasted with id : ' + success.transaction
                                });

                            $scope.$emit('close-modal');
                            // $state.go('client.signedin.account.pending');
                            $rootScope.$broadcast('reload-dashboard');

                        } else {
                            AlertService.addAlert(
                                {
                                    type: 'danger',
                                    msg: 'Unable to broadcast transaction. Reason : ' + success.errorDescription
                                });
                        }
                    }, function (error) {
                        AlertService.addAlert(AlertService.getNoConnectionMessage(error),
                            alertConfig.setAccountControlModalAlert);
                    });
            };

        }]);
