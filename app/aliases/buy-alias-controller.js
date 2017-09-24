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

angular.module('aliases').controller('BuyAliasFormController',
    ['$scope', 'AliasService', 'SessionStorageService', '$state', 'CryptoService', 'loginConfig',
        'AlertService', 'alertConfig', '$validation', '$uibModal', 'multiStepFormScope', 'FeeService', '$rootScope',
        'CommonsService', 'amountToQuantFilter',
        function ($scope, AliasService, SessionStorageService, $state, CryptoService,
                  loginConfig, AlertService, alertConfig, $validation, $uibModal, multiStepFormScope, FeeService,
                  $rootScope, CommonsService, amountToQuantFilter) {


            $scope.buyAliasForm = angular.copy(multiStepFormScope.buyAliasForm);

            $scope.disableFields = {};

            $scope.initStep1 = function () {
                var data = $scope.$getActiveStep().data;
                $scope.buyAliasForm.name = data.name;
                $scope.buyAliasForm.amount = data.amount;

            };


            $scope.$on('$destroy', function () {
                multiStepFormScope.buyAliasForm = angular.copy($scope.buyAliasForm);
            });

            $scope.hasPrivateKeyInSession = function () {
                if (SessionStorageService.getFromSession(loginConfig.SESSION_ACCOUNT_PRIVATE_KEY)) {
                    return true;
                }
                return false;
            };

            $scope.buyAlias = function () {
                var buyAliasForm = multiStepFormScope.buyAliasForm;
                var name = buyAliasForm.name;
                var price = parseInt(buyAliasForm.amount);

                var fee = 1; 
                var publicKey = CommonsService.getAccountDetailsFromSession('publicKey');
                var secret = buyAliasForm.secretPhrase;
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
                $scope.buyAliasPromise = AliasService.buyAlias(publicKey, name, price, fee)
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
                                }, alertConfig.buyAliasModalAlert
                            );
                        }
                    }, function (error) {
                        AlertService.addAlert(AlertService.getNoConnectionMessage(error),
                            alertConfig.buyAliasModalAlert);
                    });

            };

            $scope.broadcastTransaction = function (transactionBytes) {
                $scope.buyAliasPromise = CommonsService.broadcastTransaction(transactionBytes).then(function (success) {
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
                        alertConfig.buyAliasModalAlert);
                });
            };

        }]);
