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

angular.module('assets').controller('IssueAssetFormController',
    ['$scope', 'AssetsService', 'SessionStorageService', '$state', 'CryptoService', 'loginConfig',
        'AlertService', 'alertConfig', '$validation', '$uibModal', 'multiStepFormScope', 'FeeService', '$rootScope',
        'CommonsService',
        function ($scope, AssetsService, SessionStorageService, $state, CryptoService,
                  loginConfig, AlertService, alertConfig, $validation, $uibModal, multiStepFormScope, FeeService,
                  $rootScope, CommonsService) {


            $scope.issueAssetForm = angular.copy(multiStepFormScope.issueAssetForm);


            $scope.$watchCollection('[issueAssetForm.shares,issueAssetForm.decimals ]', function () {
                $scope.issueAssetForm.units = $scope.issueAssetForm.shares * Math.pow(10,
                        $scope.issueAssetForm.decimals);
            });

            $scope.$on('$destroy', function () {
                multiStepFormScope.issueAssetForm = angular.copy($scope.issueAssetForm);
            });

            $scope.hasPrivateKeyInSession = function () {
                if (SessionStorageService.getFromSession(loginConfig.SESSION_ACCOUNT_PRIVATE_KEY)) {
                    return true;
                }
                return false;
            };

            $scope.issueAsset = function () {
                var issueAssetForm = multiStepFormScope.issueAssetForm;
                var name = issueAssetForm.name;
                var description = issueAssetForm.description;
                var shares = issueAssetForm.shares;
                var decimals = issueAssetForm.decimals;
                var fee = issueAssetForm.fee;
                var quantity = shares * (Math.pow(10, decimals));
                var publicKey = CommonsService.getAccountDetailsFromSession('publicKey');
                var secret = issueAssetForm.secretPhrase;

                if (shares === 1) {

                  AlertService.addAlert(
                      {
                          type: 'info',
                          msg: 'Note: ' + 'Singleton Assets are temporarily disabled. Please see forum for more informations.'
                      }, alertConfig.issueAssetModalAlert
                  );
                  return;

                }

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
                $scope.issueAssetPromise = AssetsService.issueAsset(name, description, quantity, decimals, publicKey,
                    fee).then(function (success) {
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
                            }, alertConfig.issueAssetModalAlert
                        );
                    }
                }, function (error) {
                    AlertService.addAlert(AlertService.getNoConnectionMessage(error),
                        alertConfig.issueAssetModalAlert
                    );
                });

            };

            $scope.broadcastTransaction = function (transactionBytes) {
                $scope.issueAssetPromise = CommonsService.broadcastTransaction(transactionBytes)
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
                            alertConfig.issueAssetModalAlert
                        );
                    });
            };

        }]);
