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

angular.module('account').controller('WelcomeFaucetFormCtrl',
    ['$scope', 'FaucetService', 'SessionStorageService', '$state', 'CryptoService', 'loginConfig',
        'AlertService', 'alertConfig', 'FeeService', 'multiStepFormScope', '$rootScope', 'CommonsService',
        function ($scope, FaucetService, SessionStorageService, $state, CryptoService,
                  loginConfig, AlertService, alertConfig, FeeService, multiStepFormScope, $rootScope, CommonsService) {

            $scope.publicKey = CommonsService.getAccountDetailsFromSession('publicKey');
            $scope.accountRs = CommonsService.getAccountDetailsFromSession('accountRs');

            $scope.makeWelcomFaucetCall = function (form) {
                var email = form.email;
                FaucetService.welcomeFaucetCall(email, $scope.publicKey, $scope.accountRs).then(function (success) {
                    $scope.$emit('close-modal');
                }, function (error) {
                    AlertService.addAlert(
                        {
                            type: 'danger',
                            msg: 'Unable to add new user'
                        }, alertConfig.welcomeFaucetModalAlert
                    );
                });
            };

            $scope.closeForm=function(){
                $scope.$emit('close-modal');
            };

        }]);
