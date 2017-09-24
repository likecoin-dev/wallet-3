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

angular.module('account').controller('RemoveAccountControlCtrl',
    ['$scope', 'SessionStorageService', 'NodeService', 'loginConfig', 'nodeConfig', 'DTOptionsBuilder',
        'DTColumnBuilder', 'AccountService', '$compile', '$uibModal', 'controlConfig',
        '$q', 'AlertService', 'alertConfig', 'CryptoService', '$state', '$rootScope', 'multiStepFormScope',
        'CommonsService',
        function ($scope, SessionStorageService, NodeService, loginConfig, nodeConfig, DTOptionsBuilder,
                  DTColumnBuilder, AccountService, $compile, $uibModal, controlConfig,
                  $q, AlertService, alertConfig, CryptoService, $state, $rootScope, multiStepFormScope,
                  CommonsService) {

            $scope.removeAccountControlForm = angular.copy(multiStepFormScope.removeAccountControlForm);

            $scope.$on('$destroy', function () {
                try { $scope.removeAccountControlForm.jsonControl = $scope.jsonControl; } catch (e) {}
                multiStepFormScope.removeAccountControlForm = angular.copy($scope.removeAccountControlForm);
            });

            $scope.initStep1 = function () {

              $scope.removeAccountControlForm = {};

                $scope.jsonControl =
                    SessionStorageService.getFromSession(controlConfig.SESSION_ACCOUNT_CONTROL_JSONCONTROL_KEY);

                $scope.removeAccountControlForm.jsonControl = $scope.jsonControl;

            };

            $scope.removeAccountControl = function () {
                var removeAccountControlForm = multiStepFormScope.removeAccountControlForm;
                var fee = 1;
                var publicKey = CommonsService.getAccountDetailsFromSession('publicKey');
                var secret = removeAccountControlForm.secretPhrase;
                var secretPhraseHex;
                if (secret) {
                    secretPhraseHex = CryptoService.secretPhraseToPrivateKey(secret);
                } else {
                    secretPhraseHex =
                        SessionStorageService.getFromSession(loginConfig.SESSION_ACCOUNT_PRIVATE_KEY);
                }
                $scope.removeAccountControlPromise=AccountService.removeAccountControl(publicKey, fee)
                    .then(function (success) {
                        if (!success.errorCode) {
                            var unsignedBytes = success.unsignedTransactionBytes;
                            var signatureHex = CryptoService.signatureHex(unsignedBytes, secretPhraseHex);
                            $scope.transactionBytes =
                                CryptoService.signTransactionHex(unsignedBytes, signatureHex);

                                $scope.validBytes = true;
                                $scope.tx_fee = success.transactionJSON.feeTQT / 100000000;

                        } else {
                            AlertService.addAlert(
                                {
                                    type: 'danger',
                                    msg: 'Sorry, an error occured! Reason: ' + success.errorDescription
                                }, alertConfig.controlRemoveModalAlert
                            );
                        }
                    }, function (error) {
                        AlertService.addAlert(AlertService.getNoConnectionMessage(error),
                            alertConfig.controlRemoveModalAlert);
                    });
            };

            $scope.hasPrivateKeyInSession = function () {
                if (SessionStorageService.getFromSession(loginConfig.SESSION_ACCOUNT_PRIVATE_KEY)) {
                    return true;
                }
                return false;
            };

            $scope.broadcastTransaction = function (transactionBytes) {
                $scope.removeAccountControlPromise=CommonsService.broadcastTransaction(transactionBytes).then(function (success) {
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
                        alertConfig.controlRemoveModalAlert);
                });
            };


        }]);
