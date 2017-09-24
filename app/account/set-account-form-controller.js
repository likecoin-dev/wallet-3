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

angular.module('account').controller('SetAccountFormCtrl',
    ['$scope', 'AccountService', 'SessionStorageService', '$state', 'CryptoService', 'loginConfig',
        'AlertService', 'alertConfig', 'FeeService', 'multiStepFormScope', '$rootScope',
        function ($scope, AccountService, SessionStorageService, $state, CryptoService,
                  loginConfig, AlertService, alertConfig, FeeService, multiStepFormScope, $rootScope) {

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };

            $scope.setAccountInfoForm = angular.copy(multiStepFormScope.setAccountInfoForm);

            $scope.$on('$destroy', function () {
                multiStepFormScope.setAccountInfoForm = angular.copy($scope.setAccountInfoForm);
            });

            $scope.hasPrivateKeyInSession = function () {
                if (SessionStorageService.getFromSession(loginConfig.SESSION_ACCOUNT_PRIVATE_KEY)) {
                    return true;
                }
                return false;
            };

            $scope.$watchCollection('setAccountInfoForm', function (setAccountInfoForm) {
                var totalFee = FeeService.getSetAccountFee(setAccountInfoForm.accountName,
                    setAccountInfoForm.accountDescription);

                if (!$scope.setAccountInfoForm.fee || $scope.setAccountInfoForm.fee < totalFee) {
                    $scope.setAccountInfoForm.fee = totalFee;
                }
            });

            $scope.createSetAccountInfoTransaction = function () {

                var setAccountInfoForm = multiStepFormScope.setAccountInfoForm;
                var name = setAccountInfoForm.accountName;
                var description = setAccountInfoForm.accountDescription;

                var fee = 1;
                var secret = setAccountInfoForm.secretPhrase;

                var accountPublicKey = AccountService.getAccountDetailsFromSession('publicKey');
                var secretPhraseHex;
                if (secret) {
                    secretPhraseHex = CryptoService.secretPhraseToPrivateKey(secret);
                } else {
                    secretPhraseHex =
                        SessionStorageService.getFromSession(loginConfig.SESSION_ACCOUNT_PRIVATE_KEY);
                }
                $scope.setAccountPromise = AccountService.setAccountInfo(accountPublicKey, name, description, fee)
                    .then(function (success) {
                        if (!success.errorCode) {
                            var unsignedBytes = success.unsignedTransactionBytes;
                            var signatureHex = CryptoService.signatureHex(unsignedBytes, secretPhraseHex);
                            $scope.transactionBytes =
                                CryptoService.signTransactionHex(unsignedBytes, signatureHex);
                            //$scope.transactionJSON = success.transactionJSON;
                            $scope.validBytes = true;

                            $scope.tx_fee = success.transactionJSON.feeTQT / 100000000;
                            $scope.tx_amount = success.transactionJSON.amountTQT / 100000000;
                            $scope.tx_total = $scope.tx_fee + $scope.tx_amount;

                        } else {
                            AlertService.addAlert(
                                {
                                    type: 'danger',
                                    msg: 'Sorry, an error occured! Reason: ' + success.errorDescription
                                }, alertConfig.setInfoModalAlert
                            );
                        }
                    }, function (error) {
                        AlertService.addAlert(AlertService.getNoConnectionMessage(error),
                            alertConfig.setInfoModalAlert);
                    });
            };

            $scope.broadcastTransaction = function (transactionBytes) {
                $scope.setAccountPromise = AccountService.broadcastTransaction(transactionBytes)
                    .then(function (success) {
                        $scope.$emit('close-modal');
                        if (!success.errorCode) {
                            AlertService.addAlert(
                                {
                                    type: 'success',
                                    msg: 'Transaction succesfull broadcasted with id ' + success.transaction
                                });
                            // $state.go('client.signedin.account.pending');
                            $rootScope.$broadcast('reload-dashboard');
                        } else {
                            AlertService.addAlert(
                                {
                                    type: 'danger',
                                    msg: 'Unable to broadcast transaction. Reason: ' + success.errorDescription
                                });
                        }

                    }, function (error) {
                        AlertService.addAlert(AlertService.getNoConnectionMessage(error),
                            alertConfig.setInfoModalAlert);
                    });
            };

        }]);
