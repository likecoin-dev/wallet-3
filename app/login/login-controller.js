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

angular.module('login').controller('LoginCtrl',
    ['$scope', 'LoginService', 'SessionStorageService', 'loginConfig', '$state', '$uibModal', 'peerConfig',
        'nodeConfig', 'NodeService', '$stateParams', 'OptionsService', 'CommonsService', '$rootScope',
        'OptionsConfigureService', 'baseConfig','LocalHostService',
        function ($scope, LoginService, SessionStorageService, loginConfig, $state, $uibModal, peerConfig, nodeConfig,
                  NodeService, $stateParams, OptionsService, CommonsService, $rootScope, OptionsConfigureService,
                  baseConfig,LocalHostService) {

            $scope.loginToAccount = function (secret, rememberSecret) {
                rememberSecret=true;//We are making it default now

                LoginService.calculateAccountDetailsFromSecret(secret, true);

                if (rememberSecret) {
                  LoginService.calculatePrivateKeyFromSecret(secret, true);
                }

                $state.go('client.signedin.account.details');
            };

            $scope.accountDetails = {};

            $scope.getAccountFromSession = function () {
                $scope.accountDetails = SessionStorageService.getFromSession(loginConfig.SESSION_ACCOUNT_DETAILS_KEY);
                $scope.privateKey = SessionStorageService.getFromSession(loginConfig.SESSION_ACCOUNT_PRIVATE_KEY);
                $scope.activePeer = NodeService.getNode(false);
                $scope.localPeer = SessionStorageService.getFromSession(nodeConfig.SESSION_LOCAL_NODE);
            };

            $scope.openSignUpModal = function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'login/views/signup-form.html',
                    size: 'lg',
                    controller: 'SignUpCtrl',
                    resolve: {
                        params: function () {
                            return {};
                        }
                    }

                });
            };

            $scope.openSignOutModal = function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'login/views/modals/logout-confirm.html',
                    size: 'lg',
                    controller: 'SignOutCtrl',
                });
            };

            $scope.postLogOut = function () {
                $scope.sessionCleared = $stateParams.sessionCleared;
                $scope.localCleared = $stateParams.localCleared;
            };

            $scope.$on('reload-options', function () {
                var publicKey = CommonsService.getAccountDetailsFromSession('publicKey');
                LocalHostService.getPeerState(OptionsService.getOption('USER_NODE_URL'))
                    .then(function (response) {
                        var uri = new URL(OptionsService.getOption('USER_NODE_URL'));
                        response._id = uri.hostname;
                        SessionStorageService.saveToSession(nodeConfig.SESSION_LOCAL_NODE, response);
                        SessionStorageService.saveToSession(nodeConfig.SESSION_HAS_LOCAL, true);

                    }, function (error) {
                        SessionStorageService.saveToSession(nodeConfig.SESSION_HAS_LOCAL, false);
                        //$state.reload();
                    });
            });


        }]);

angular.module('login').controller('SignUpCtrl',
    ['$scope', 'LoginService', 'SessionStorageService', 'loginConfig', '$state', '$uibModalInstance',
        function ($scope, LoginService, SessionStorageService, loginConfig, $state, $uibModalInstance) {

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };

            $scope.steps = [
                {
                    templateUrl: 'login/views/signup-disclaimer.html',
                    title: 'Step 1/3 - Accept Disclaimer'
                },
                {
                    templateUrl: 'login/views/signup-passphrase.html',
                    title: 'Step 2/3 - Generate Passphrase'
                },
                {
                    templateUrl: 'login/views/signup-confirm.html',
                    title: 'Step 3/3 - Confirm PassPhrase and Sign In'
                }

            ];

            $scope.createNewAccount = function () {
                $scope.secret = LoginService.generatePassPhrase();
                $scope.accountDetails = LoginService.calculateAccountDetailsFromSecret($scope.secret, false);
            };

            $scope.confirmAndLogin = function (confirmPassPhrase,rememberSecret) {
                rememberSecret = true;//We are making it default now

                if (confirmPassPhrase === $scope.secret) {

                    LoginService.calculateAccountDetailsFromSecret(confirmPassPhrase, true);

                    if (rememberSecret) {
                        LoginService.calculatePrivateKeyFromSecret($scope.secret, true);
                    }

                    $scope.cancel();
                    $state.go('client.signedin.account.details');
                } else {
                    $scope.error = 'Invalid pass phrase';
                }
            };

        }]);

angular.module('login').controller('SignOutCtrl',
    ['$scope', 'LoginService', 'SessionStorageService', 'loginConfig', '$state', '$uibModalInstance', 'AddressService',
        'OptionsService',
        function ($scope, LoginService, SessionStorageService, loginConfig, $state, $uibModalInstance, AddressService,
                  OptionsService) {

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };

            $scope.logout = function (clearLocal) {
                SessionStorageService.resetSession();
                if (clearLocal) {
                    AddressService.clearContacts();
                    OptionsService.clearOptions();
                }
                $uibModalInstance.dismiss('cancel');
                $state.go('client.logout', {'sessionCleared': true, 'localCleared': clearLocal});
            };


        }]);
