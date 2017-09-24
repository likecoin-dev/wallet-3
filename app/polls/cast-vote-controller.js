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

angular.module('poll').controller('CastVoteFormController',
    ['$scope', 'PollService', 'SessionStorageService', '$state', 'CryptoService', 'loginConfig',
        'AlertService', 'alertConfig', '$validation', '$uibModal', 'multiStepFormScope', 'FeeService', '$rootScope',
        'CommonsService',
        function ($scope, PollService, SessionStorageService, $state, CryptoService,
                  loginConfig, AlertService, alertConfig, $validation, $uibModal, multiStepFormScope, FeeService,
                  $rootScope, CommonsService) {

            $scope.castVoteForm = angular.copy(multiStepFormScope.castVoteForm);

            $scope.$on('$destroy', function () {
                multiStepFormScope.castVoteForm = angular.copy($scope.castVoteForm);
            });

            $scope.nextStep = function () {
                var poll = $scope.castVoteForm.poll;
                var votedOptions = $scope.castVoteForm.options;
                var votedOptionsLength = votedOptions.length;
                if (poll.minNumberOfOptions <= votedOptionsLength && poll.maxNumberOfOptions >= votedOptionsLength) {
                    $scope.$nextStep();
                } else {
                    AlertService.addAlert(
                        {
                            type: 'danger',
                            msg: 'You have to select at least min. ' + poll.minNumberOfOptions + ' and max. ' + poll.maxNumberOfOptions + ' options.'
                        }, alertConfig.castVoteModalAlert
                    );
                }
            };

            $scope.initStep1 = function () {
                var data = $scope.$getActiveStep().data;
                if (data) {
                    $scope.castVoteForm.pollId = data.pollId;
                    PollService.getPoll(data.pollId).then(function (success) {
                        $scope.options = success.options;
                        $scope.castVoteForm.poll = success;
                    });
                }

            };

            $scope.hasPrivateKeyInSession = function () {
                if (SessionStorageService.getFromSession(loginConfig.SESSION_ACCOUNT_PRIVATE_KEY)) {
                    return true;
                }
                return false;
            };

            function getOptionNames(votedOptions) {
                var options = $scope.castVoteForm.poll.options;

                var totalVoted = votedOptions.length || 0;
                var optionNames = [];
                for (var i = 0; i < totalVoted; i++) {
                    var index = options.indexOf(votedOptions[i]);
                    optionNames.push(getOptionNameFormat(index));
                }
                return optionNames;
            }

            function getOptionNameFormat(i) {
                if (i !== -1) {
                    return i > 9 ? 'vote' + i : 'vote0' + i;
                }
            }

            $scope.castVote = function () {
                var castVoteForm = multiStepFormScope.castVoteForm;

                var publicKey = CommonsService.getAccountDetailsFromSession('publicKey');
                var pollId = castVoteForm.pollId;
                var options = castVoteForm.options;
                var secret = castVoteForm.secretPhrase;
                var optionNames = getOptionNames(options);
                var fee = 1;
                var secretPhraseHex;
                if (secret) {
                    secretPhraseHex = CryptoService.secretPhraseToPrivateKey(secret);
                } else {
                    secretPhraseHex =
                        SessionStorageService.getFromSession(loginConfig.SESSION_ACCOUNT_PRIVATE_KEY);
                }
                $scope.castVotePromise = PollService.castVote(publicKey, pollId, optionNames, fee)
                    .then(function (success) {
                        if (!success.errorCode) {
                            var unsignedBytes = success.unsignedTransactionBytes;
                            var signatureHex = CryptoService.signatureHex(unsignedBytes, secretPhraseHex);

                            $scope.transactionBytes = CryptoService.signTransactionHex(unsignedBytes, signatureHex);
                            $scope.transactionJSON = success.transactionJSON;

                            $scope.tx_fee = success.transactionJSON.feeTQT / 100000000;
                            $scope.tx_amount = success.transactionJSON.amountTQT / 100000000;
                            $scope.tx_total = $scope.tx_fee + $scope.tx_amount;

                            $scope.validBytes = true;


                        } else {
                            AlertService.addAlert(
                                {
                                    type: 'danger',
                                    msg: 'Sorry, an error occured! Reason: ' + success.errorDescription
                                }, alertConfig.castVoteModalAlert
                            );
                        }
                    },  function (error) {
                        AlertService.addAlert(AlertService.getNoConnectionMessage(error),
                            alertConfig.castVoteModalAlert);
                    });

            };

            $scope.broadcastTransaction = function (transactionBytes) {
                $scope.castVotePromise=CommonsService.broadcastTransaction(transactionBytes).then(function (success) {
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

                },  function (error) {
                    AlertService.addAlert(AlertService.getNoConnectionMessage(error),
                        alertConfig.castVoteModalAlert);
                });
            };

        }]);
