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

angular.module('currencies').controller('IssueCurrencyFormController',
    ['$scope', 'CurrenciesService', 'SessionStorageService', '$state', 'CryptoService', 'loginConfig',
        'AlertService', 'alertConfig', '$validation', '$uibModal', 'multiStepFormScope', 'FeeService', '$rootScope',
        'CommonsService',
        function ($scope, CurrenciesService, SessionStorageService, $state, CryptoService,
                  loginConfig, AlertService, alertConfig, $validation, $uibModal, multiStepFormScope, FeeService,
                  $rootScope, CommonsService) {


            $scope.issueCurrencyForm = angular.copy(multiStepFormScope.issueCurrencyForm);
            $scope.issueCurrencyForm2 = angular.copy(multiStepFormScope.issueCurrencyForm2);

            $scope.currencyTypes = [1, 2];



            $scope.$watchCollection('issueCurrencyForm2.initialSupply', function () {

                if ($scope.issueCurrencyForm2) {
                    $scope.issueCurrencyForm2.maxSupply = $scope.issueCurrencyForm2.initialSupply;
                }

            });


            $scope.$watchCollection('issueCurrencyForm2.types', function (currencyTypes) {

                if (currencyTypes) {
                    if (currencyTypes[1]) {
                        //Exchangeable
                    }
                    if (currencyTypes[2]) {
                        //controllable
                    }
                    if (currencyTypes[4]) {
                        //reservable
                        $scope.reservable = true;
                        currencyTypes[8] = true;

                    } else {
                        currencyTypes[8] = false;
                        $scope.reservable = false;
                    }
                    if (currencyTypes[8]) {
                        $scope.reservable = true;

                        if (!currencyTypes[4]) {
                            currencyTypes[4] = true;
                        }

                        $scope.issueCurrencyForm2.initialSupply = 0;

                    }
                }
            });

            $scope.getBlockChainStatus = function () {
                CurrenciesService.getBlockChainStatus().then(function (success) {
                    $scope.currentHeight = success.numberOfBlocks;
                });
            };

            function removeElementFromArray(array, elem) {
                if (array) {
                    var length = array.length;
                    for (var i = 0; i < length; i++) {
                        array[i].selected = false;
                    }
                }
            }

            function hasElement(array, value) {
                if (array) {
                    var length = array.length;
                    for (var i = 0; i < length; i++) {
                        return array[i].selected;
                    }
                }
                return false;
            }

            function sumArray(json) {
                var sum = 0;
                if (json) {
                    for (var key in json) {
                        if (json.hasOwnProperty(key) && json[key]) {
                            sum = sum + parseInt(key);
                        }
                    }

                }
                return sum;
            }

            $scope.validateAndMoveNextStep = function () {
                var issueCurrencyForm2 = $scope.issueCurrencyForm2;
                var typesArray = issueCurrencyForm2.types;
                var type = sumArray(issueCurrencyForm2.types);
                if (!(type > 0)) {
                    AlertService.addAlert(
                        {
                            type: 'danger',
                            msg: 'Form error. Atleast one currency type must be selected'
                        }, alertConfig.issueCurrencyModalAlert
                    );
                    return;
                }
                $scope.$nextStep();
            };

            $scope.$on('$destroy', function () {
                multiStepFormScope.issueCurrencyForm = angular.copy($scope.issueCurrencyForm);
                multiStepFormScope.issueCurrencyForm2 = angular.copy($scope.issueCurrencyForm2);
            });

            $scope.hasPrivateKeyInSession = function () {
                if (SessionStorageService.getFromSession(loginConfig.SESSION_ACCOUNT_PRIVATE_KEY)) {
                    return true;
                }
                return false;
            };

            $scope.issueCurrency = function () {
                var issueCurrencyForm = multiStepFormScope.issueCurrencyForm;
                var issueCurrencyForm2 = multiStepFormScope.issueCurrencyForm2;
                var name = issueCurrencyForm.name;
                var code = issueCurrencyForm.code.toUpperCase();
                var description = issueCurrencyForm.description;
                var decimals = parseInt(issueCurrencyForm2.decimals);
                var initialSupply = parseInt(issueCurrencyForm2.initialSupply) * Math.pow(10, decimals);
                var maxSupply = parseInt(issueCurrencyForm2.maxSupply) * Math.pow(10, decimals);
                var type = sumArray(issueCurrencyForm2.types);

                var activHeight = 0;
                var minAmount = '';
                var reserveSupply = '';

                if (parseInt(type) > 4) {
                    activHeight = parseInt(issueCurrencyForm2.activHeight);
                    minAmount = parseInt(issueCurrencyForm2.minAmount) * 100000000;
                    reserveSupply = parseInt(issueCurrencyForm2.reserveSupply) * Math.pow(10, decimals);
                }

                var fee = 1;

                if (!fee) {
                    fee = 1;
                }

                var publicKey = CommonsService.getAccountDetailsFromSession('publicKey');
                var secret = issueCurrencyForm.secretPhrase;
                var secretPhraseHex;
                if (secret) {
                    secretPhraseHex = CryptoService.secretPhraseToPrivateKey(secret);
                } else {
                    secretPhraseHex =
                        SessionStorageService.getFromSession(loginConfig.SESSION_ACCOUNT_PRIVATE_KEY);
                }

                $scope.issueCUrrencyPromise = CurrenciesService.issueCurrency(publicKey, name, code, description, type,
                    initialSupply, maxSupply,
                    decimals, fee, minAmount, activHeight, reserveSupply)
                    .then(function (success) {
                        if (!success.errorCode) {
                            var unsignedBytes = success.unsignedTransactionBytes;
                            var signatureHex = CryptoService.signatureHex(unsignedBytes, secretPhraseHex);
                            $scope.transactionBytes = CryptoService.signTransactionHex(unsignedBytes, signatureHex);
                            $scope.validBytes = true;

                            $scope.tx_fee = success.transactionJSON.feeTQT / 100000000;
                            $scope.tx_amount = success.transactionJSON.amountTQT / 100000000;
                            $scope.tx_total = $scope.tx_fee + $scope.tx_amount;

                        } else {
                            AlertService.addAlert(
                                {
                                    type: 'danger',
                                    msg: 'Sorry, an error occured! Reason: ' + success.errorDescription
                                }, alertConfig.issueCurrencyModalAlert
                            );
                        }
                    }, function (error) {
                        AlertService.addAlert(AlertService.getNoConnectionMessage(error),
                            alertConfig.issueCurrencyModalAlert);
                    });

            };

            $scope.broadcastTransaction = function (transactionBytes) {
                $scope.issueCUrrencyPromise = CommonsService.broadcastTransaction(transactionBytes)
                    .then(function (success) {
                        $scope.$emit('close-modal');
                        $rootScope.$broadcast('reload-dashboard');
                        if (!success.errorCode) {
                            AlertService.addAlert(
                                {
                                    type: 'success',
                                    msg: 'Transaction succesfull broadcasted with Id : ' +
                                    success.transaction +
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
                            alertConfig.issueCurrencyModalAlert);
                    });
            };

        }

    ]);
