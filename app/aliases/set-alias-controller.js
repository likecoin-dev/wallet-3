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

angular.module('aliases').controller('SetAliasFormController',
    ['$scope', 'AliasService', 'SessionStorageService', '$state', 'CryptoService', 'loginConfig',
        'AlertService', 'alertConfig', '$validation', '$uibModal', 'multiStepFormScope', 'FeeService', '$rootScope',
        'CommonsService',
        function ($scope, AliasService, SessionStorageService, $state, CryptoService,
                  loginConfig, AlertService, alertConfig, $validation, $uibModal, multiStepFormScope, FeeService,
                  $rootScope, CommonsService) {

            $scope.setAliasForm = angular.copy(multiStepFormScope.setAliasForm);

            $scope.disableFields={};

            $scope.validBytes = false;

            $scope.initStep1=function(){
                var data = $scope.$getActiveStep().data;
                if (data) {
                    if(data.name){
                        $scope.setAliasForm.name=data.name;
                        $scope.disableFields.name=true;
                    }
                }

                $scope.prefixes = [
                  {name:'Account', value:'acct:',placeholder:'XIN______-____-______'},
                  {name:'URL', value:'url:',placeholder:'http://'},
                  {name:'BTC', value:'btc:',placeholder:''},
                  // {name:"Torrent", value:"trnt:"},
                  // {name:"Magnet", value:"magnet:"},
                  // {name:"Mail", value:"mailto::"},
                  // {name:'Zeronet', value:'zero:'},
                  // {name:'IPFS', value:'ipfs:'},
                  {name:'Other', value: '' }

                ];

                $scope.setAliasForm.prefix = $scope.prefixes[0];

            };

            $scope.$on('$destroy', function () {
                multiStepFormScope.setAliasForm = angular.copy($scope.setAliasForm);
            });

            $scope.hasPrivateKeyInSession = function () {
                if (SessionStorageService.getFromSession(loginConfig.SESSION_ACCOUNT_PRIVATE_KEY)) {
                    return true;
                }
                return false;
            };

            $scope.formFinalAlias=function(){
                var setAliasForm = multiStepFormScope.setAliasForm;

                var aliasUri = setAliasForm.uri;
                var aliasPrefix = setAliasForm.prefix.value;
                var aliasSuffix = '@xin';
                var aliasFinal = aliasPrefix+aliasUri;
                if (aliasPrefix !== '') { aliasFinal = aliasFinal + aliasSuffix; }

                if (!aliasUri) { aliasFinal = ''; }

                return aliasFinal;
            };

            $scope.setAlias= function () {
                var setAliasForm = multiStepFormScope.setAliasForm;
                var name = setAliasForm.name;
                var alias= $scope.formFinalAlias();
                var fee = setAliasForm.fee;
                var publicKey = CommonsService.getAccountDetailsFromSession('publicKey');
                var secret=setAliasForm.secretPhrase;
                var secretPhraseHex;
                if (secret) {
                    secretPhraseHex = CryptoService.secretPhraseToPrivateKey(secret);
                } else {
                    secretPhraseHex =
                        SessionStorageService.getFromSession(loginConfig.SESSION_ACCOUNT_PRIVATE_KEY);
                }
                if (!fee) {
                    fee = 2;
                }
                $scope.setAliasPromise=AliasService.setAlias(publicKey, name, alias, fee)
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
                                }, alertConfig.setAliasModalAlert
                            );
                        }
                    },  function (error) {
                        AlertService.addAlert(AlertService.getNoConnectionMessage(error),
                            alertConfig.setAliasModalAlert);
                    });

            };

            $scope.broadcastTransaction = function (transactionBytes) {
                $scope.setAliasPromise=CommonsService.broadcastTransaction(transactionBytes).then(function (success) {
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
                        alertConfig.setAliasModalAlert);
                });
            };

        }]);
