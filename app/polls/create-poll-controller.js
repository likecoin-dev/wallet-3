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

angular.module('poll').controller('CreatePollFormController',
    ['$scope', 'PollService', 'SessionStorageService', '$state', 'CryptoService', 'loginConfig',
        'AlertService', 'alertConfig', '$validation', '$uibModal', 'multiStepFormScope', 'FeeService', '$rootScope',
        'CommonsService', 'AssetsService', 'CurrenciesService',
        function ($scope, PollService, SessionStorageService, $state, CryptoService,
                  loginConfig, AlertService, alertConfig, $validation, $uibModal, multiStepFormScope, FeeService,
                  $rootScope, CommonsService, AssetsService, CurrenciesService) {


            $scope.createPollForm = angular.copy(multiStepFormScope.createPollForm);
            $scope.createPollForm2 = angular.copy(multiStepFormScope.createPollForm2);

            $scope.$on('$destroy', function () {
                multiStepFormScope.createPollForm = angular.copy($scope.createPollForm);
                multiStepFormScope.createPollForm2 = angular.copy($scope.createPollForm2);
            });

            $scope.finishHeight = 1440;

            $scope.increment = function () {
                if ($scope.finishHeight >= 20000) {
                    $scope.finishHeight = 20000;
                    return;
                } else {
                    $scope.finishHeight = $scope.finishHeight + 1440;
                }

                $scope.createPollForm2.finishHeight = $scope.finishHeight;
            };

            $scope.decrement = function () {
                if ($scope.finishHeight <= 1440) {
                    $scope.finishHeight = 1440;
                    return;
                } else {
                    $scope.finishHeight = $scope.finishHeight - 1440;
                }

                $scope.createPollForm2.finishHeight = $scope.finishHeight;
            };

            $scope.max = function () {
                $scope.finishHeight = 20000;
                $scope.createPollForm2.finishHeight = 20000;
            };

            $scope.min = function () {
                $scope.finishHeight = 1440;
                $scope.createPollForm2.finishHeight = 1440;
            };

            $scope.addNewOption = function () {
                $scope.createPollForm2.pollOptions = $scope.createPollForm2.pollOptions || [];
                if ($scope.createPollForm2.pollOptions.length >= 10) {
                    AlertService.addAlert(
                        {
                            type: 'danger',
                            msg: 'You can add maximum 10 options'
                        }, alertConfig.createPollModalAlert
                    );
                } else {
                    $scope.createPollForm2.pollOptions.push({});
                }
            };

            $scope.getAsset = function (assetId) {
                AssetsService.getAsset(assetId).then(function (success) {
                    $scope.createPollForm.asset = success;
                });
            };

            $scope.getCurrency = function (currencyCode) {
                CurrenciesService.getCurrency(currencyCode).then(function (success) {
                    $scope.createPollForm.currency = success;
                });
            };

            $scope.getBlockChainStatus = function () {
                CurrenciesService.getBlockChainStatus().then(function (success) {
                    $scope.createPollForm2.currentHeight = success.numberOfBlocks;
                });
            };

            $scope.hasPrivateKeyInSession = function () {
                if (SessionStorageService.getFromSession(loginConfig.SESSION_ACCOUNT_PRIVATE_KEY)) {
                    return true;
                }
                return false;
            };

            $scope.votingOptions = [
               { label: 'Account', value: '0' },
               { label: 'Balance', value: '1' },
               { label: 'Asset', value: '2' },
               { label: 'Currency', value: '3' }
             ];


            $scope.createPoll = function () {
                var createPollForm = multiStepFormScope.createPollForm;
                var createPollForm2 = multiStepFormScope.createPollForm2;
                var pollJson = {};
                pollJson.name = createPollForm.name;
                pollJson.description = createPollForm.description;
                pollJson.votingModel = createPollForm.votingModel;
                pollJson.holding = createPollForm.holding;
                if (pollJson.votingModel === '3') {
                    pollJson.holding = createPollForm.currency.currency;
                }

                pollJson.minBalanceModel = createPollForm.votingModel;
                pollJson.minBalance = parseInt(createPollForm.minbalance * 100000000);



                pollJson.minNumberOfOptions = createPollForm2.minNumberOfOptions;
                pollJson.maxNumberOfOptions = createPollForm2.maxNumberOfOptions;
                pollJson.minRangeValue = 0;
                pollJson.maxRangeValue = createPollForm2.maxNumberOfOptions;
                pollJson.fee = 1;


                pollJson.options = [];
                for (var i = 0; i < createPollForm2.pollOptions.length; i++) {
                    pollJson.options[i] = createPollForm2.pollOptions[i].value;
                }
                pollJson.publicKey = CommonsService.getAccountDetailsFromSession('publicKey');

                pollJson.finishHeight = $scope.createPollForm2.currentHeight + createPollForm2.finishHeight;

                var secret = createPollForm.secretPhrase;
                var secretPhraseHex;
                if (secret) {
                    secretPhraseHex = CryptoService.secretPhraseToPrivateKey(secret);
                } else {
                    secretPhraseHex =
                        SessionStorageService.getFromSession(loginConfig.SESSION_ACCOUNT_PRIVATE_KEY);
                }

                $scope.createPollPromise = PollService.createPoll(pollJson)
                    .then(function (success) {
                        if (!success.errorCode) {
                            var unsignedBytes = success.unsignedTransactionBytes;
                            var signatureHex = CryptoService.signatureHex(unsignedBytes, secretPhraseHex);

                            $scope.transactionBytes = CryptoService.signTransactionHex(unsignedBytes, signatureHex);

                            $scope.tx_fee    = success.transactionJSON.feeTQT / 100000000;
                            $scope.tx_amount = success.transactionJSON.amountTQT / 100000000;
                            $scope.tx_total  = $scope.tx_fee + $scope.tx_amount;

                            $scope.validBytes = true;


                        } else {
                            AlertService.addAlert(
                                {
                                    type: 'danger',
                                    msg: 'Sorry, an error occured! Reason: ' + success.errorDescription
                                }, alertConfig.createPollModalAlert
                            );
                        }
                    },   function (error) {
                        AlertService.addAlert(AlertService.getNoConnectionMessage(error),
                            alertConfig.createPollModalAlert);
                    });

            };

            $scope.broadcastTransaction = function (transactionBytes) {
                $scope.createPollPromise =CommonsService.broadcastTransaction(transactionBytes).then(function (success) {
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

                },   function (error) {
                    AlertService.addAlert(AlertService.getNoConnectionMessage(error),
                        alertConfig.createPollModalAlert);
                });
            };

        }]);
