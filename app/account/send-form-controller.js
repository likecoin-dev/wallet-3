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

angular.module('account').controller('SendTokenFormController',
    ['$scope', 'AccountService', 'SessionStorageService', '$state', 'CryptoService', 'loginConfig',
        'AlertService', 'alertConfig', '$validation', '$uibModal', 'multiStepFormScope', 'FeeService', '$rootScope',
        'amountToQuantFilter',
        function ($scope, AccountService, SessionStorageService, $state, CryptoService,
                  loginConfig, AlertService, alertConfig, $validation, $uibModal, multiStepFormScope, FeeService,
                  $rootScope, amountToQuantFilter) {

            $scope.sendTokenForm = angular.copy(multiStepFormScope.sendTokenForm);
            $scope.validForm = false;
            $scope.validBytes = false;
            $scope.hasPublicKeyAdded = false;
            $scope.hasMessageAdded = false;

            $scope.$on('$destroy', function () {
                multiStepFormScope.sendTokenForm = angular.copy($scope.sendTokenForm);
            });

            $scope.initStep1 = function () {
                var data = $scope.$getActiveStep().data || {};
                if (data.recipient) {
                    $scope.sendTokenForm.recipientRS = data.recipient;
                }
            };

            $scope.openAddressBookModal = function () {
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
                    $scope.sendTokenForm.recipientRS = result.accountRS;
                });
            };

            $scope.hasPrivateKeyInSession = function () {
                if (SessionStorageService.getFromSession(loginConfig.SESSION_ACCOUNT_PRIVATE_KEY)) {
                    return true;
                }
                return false;
            };

            var createAndSignTransaction = function (transactionOptions, secretPhraseHex) {
                $scope.sendTokenPromise =AccountService.createTransaction(
                    transactionOptions.senderPublicKey,
                    transactionOptions.recipientRS,
                    transactionOptions.amount,
                    1,
                    transactionOptions.data,
                    transactionOptions.nonce,
                    transactionOptions.recipientPublicKey
                ).then(function (success) {



                    if (!success.errorCode) {
                        var unsignedBytes = success.unsignedTransactionBytes;
                        var signatureHex = CryptoService.signatureHex(unsignedBytes, secretPhraseHex);
                        var transactionBytes = CryptoService.signTransactionHex(unsignedBytes, signatureHex);

                        $scope.transactionBytes = transactionBytes;
                        $scope.validBytes = true;

                        $scope.tx_fee = success.transactionJSON.feeTQT / 100000000;
                        $scope.tx_amount = success.transactionJSON.amountTQT / 100000000;
                        $scope.tx_total = $scope.tx_fee + $scope.tx_amount;

                        return transactionBytes;
                    } else {
                        AlertService.addAlert(
                            {
                                type: 'danger',
                                msg: 'Sorry, an error occured! Reason: ' + success.errorDescription
                            }, alertConfig.sendTokenModalAlert
                        );
                    }
                }, function (error) {
                    AlertService.addAlert(AlertService.getNoConnectionMessage(error),
                        alertConfig.sendTokenModalAlert);
                });
            };

            $scope.getAndVerifyAccount = function (sendTokenForm) {

                var sendForm = multiStepFormScope.sendTokenForm;

                var recipientRS = sendForm.recipientRS;
                var amount = amountToQuantFilter(sendForm.amount);

                var fee = sendForm.fee;
                var secret = sendForm.secretPhrase;

                var message = sendForm.message;
                var pubkey = sendForm.pubkey;

                var hasPublicKeyAdded = false;
                var hasMessageAdded = false;
                var hasSecretAdded = false;

                if (pubkey && pubkey.length > 0) {
                    hasPublicKeyAdded = true;
                }
                if (message && message.length > 0) {
                    hasMessageAdded = true;
                }
                if (secret && secret.length > 0) {
                    hasSecretAdded = true;
                }

                if (!fee) {
                    fee = 1;
                }

                $scope.hasPublicKeyAdded = hasPublicKeyAdded;
                $scope.hasMessageAdded = hasMessageAdded;

                var senderPublicKey = AccountService.getAccountDetailsFromSession('publicKey');
                var secretPhraseHex;

                if (hasSecretAdded) {
                    secretPhraseHex = CryptoService.secretPhraseToPrivateKey(secret);
                } else {
                    secretPhraseHex = SessionStorageService.getFromSession(loginConfig.SESSION_ACCOUNT_PRIVATE_KEY);
                }

                $scope.sendTokenPromise = AccountService.getAccountDetails(recipientRS).then(function (success) {

                    var recipientPublicKey = success.publicKey;

                    if (!recipientPublicKey && hasPublicKeyAdded) {
                        recipientPublicKey = pubkey;
                    }

                    if (!success.errorCode || success.errorCode === 5) {

                        $scope.accountDetails = success;

                        if (!recipientPublicKey && !hasPublicKeyAdded && hasMessageAdded) {
                            AlertService.addAlert(
                                {
                                    type: 'danger',
                                    msg: 'Sorry, an error occured! Reason: This account has no visible public key because it never had any outbound transaction. Encrypted messages are not available without a public key. Ask the account holder for his public key and add the key on the former page to this transaction'
                                }, alertConfig.sendTokenModalAlert
                            );
                            return;
                        }

                        if (!recipientPublicKey && !hasPublicKeyAdded) {
                            AlertService.addAlert(
                                {
                                    type: 'info',
                                    msg: 'Note: This account never had an outbound transaction. Make sure this account is the right one. In doubt, ask the account holder for his public key and add it on the former page to this transaction.'
                                }, alertConfig.sendTokenModalAlert
                            );
                        }

                        var encrypted = {data: '', nonce: ''};
                        if (hasMessageAdded) {
                            if (!recipientPublicKey) {
                                recipientPublicKey = pubkey;
                            }
                            encrypted = CryptoService.encryptMessage(message, secretPhraseHex, recipientPublicKey);
                            $scope.encrypted = JSON.stringify(encrypted);
                        } else {
                            $scope.encrypted = encrypted;
                        }

                        var transactionOptions = {
                            'senderPublicKey': senderPublicKey,
                            'recipientRS': recipientRS,
                            'amount': amount,
                            'fee': fee,
                            'data': encrypted.data,
                            'nonce': encrypted.nonce,
                            'recipientPublicKey': recipientPublicKey,
                        };

                        createAndSignTransaction(transactionOptions, secretPhraseHex);

                        if ($scope.encrypted.data === '') {
                            $scope.encrypted = '';
                        }

                    } else {
                        AlertService.addAlert(
                            {
                                type: 'danger',
                                msg: 'Sorry, an error occured! Reason: ' + success.errorDescription
                            }, alertConfig.sendTokenModalAlert
                        );
                    }
                },function (error) {
                    AlertService.addAlert(AlertService.getNoConnectionMessage(error),
                        alertConfig.sendTokenModalAlert);
                });
            };

            $scope.broadcastTransaction = function (transactionBytes) {
                $scope.sendTokenPromise =AccountService.broadcastTransaction(transactionBytes).then(function (success) {


                    if (!success.errorCode) {
                        AlertService.addAlert(
                            {
                                type: 'success',
                                msg: 'Transaction succesfull broadcasted with Id : ' + success.transaction +
                                ''
                            });

                        $scope.$emit('close-modal');
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
                        alertConfig.sendTokenModalAlert);
                });
            };

        }]);
