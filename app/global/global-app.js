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

angular.module('client',
    ['login', 'baseClient', 'node', 'account', 'assets', 'ui.router', 'dashboard', 'clientAlert', 'search',
        'addressbook', 'currencies', 'poll', 'messages', 'aliases', 'options', 'exchanges', 'extensions',
        'tools', 'crowdfunding', 'subscription', 'escrow' ]);

angular.module('client').config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('client', {
        abstract: true,
        url: '/',
        template: '<div ui-view></div>'
    }).state('client.signedin', {
        abstract: true,
        url: '/',
        templateUrl: './commons/signedin.html'
    });

    $urlRouterProvider.otherwise('/welcome');
}]);

angular.module('client').service('OptionsConfigurationService',
    ['StateAuthService', '$rootScope', 'OptionsService', 'OptionsConfigureService', 'CommonsService', 'AccountService',
        'controlConfig', 'SessionStorageService', 'PeerService', 'nodeConfig', 'baseConfig',
        function (StateAuthService, $rootScope, OptionsService, OptionsConfigureService, CommonsService, AccountService,
                  controlConfig, SessionStorageService, PeerService, nodeConfig, baseConfig) {

            this.loadOptions = loadOptions;

            function loadOptions() {
                if (!$rootScope.options) {
                    var publicKey = CommonsService.getAccountDetailsFromSession('publicKey');
                    OptionsService.loadOptions(publicKey, function (optionsObject) {
                        $rootScope.options = optionsObject;
                        SessionStorageService.saveToSession(baseConfig.SESSION_APP_OPTIONS, optionsObject);
                        getPhasingDetails();
                    }, function (e) {
                        $rootScope.options = DEFAULT_OPTIONS;
                        SessionStorageService.saveToSession(baseConfig.SESSION_APP_OPTIONS, DEFAULT_OPTIONS);
                        getPhasingDetails();
                    }, function (error) {
                        alert('Unable to get active nodes');
                    });

                }
            }

            function getPhasingDetails() {
                var accountRS = CommonsService.getAccountDetailsFromSession('accountRs');
                AccountService.getPhasingOnlyControl(accountRS).then(function (success) {
                    if (success.account) {
                        SessionStorageService.saveToSession(controlConfig.SESSION_ACCOUNT_CONTROL_HASCONTROL_KEY, true);
                        SessionStorageService.saveToSession(controlConfig.SESSION_ACCOUNT_CONTROL_JSONCONTROL_KEY,
                            success);
                    } else {
                        SessionStorageService.saveToSession(controlConfig.SESSION_ACCOUNT_CONTROL_HASCONTROL_KEY,
                            false);
                        SessionStorageService.saveToSession(controlConfig.SESSION_ACCOUNT_CONTROL_JSONCONTROL_KEY,
                            undefined);
                    }
                });
            }

        }]);

angular.module('client').run(
    ['StateAuthService', '$rootScope', 'OptionsService', 'OptionsConfigureService', 'CommonsService', 'AccountService',
        'controlConfig', 'SessionStorageService', 'PeerService', 'nodeConfig', 'baseConfig',
        function (StateAuthService, $rootScope, OptionsService, OptionsConfigureService, CommonsService, AccountService,
                  controlConfig, SessionStorageService, PeerService, nodeConfig, baseConfig) {
            $rootScope.$on('$stateChangeStart', function (event, nextState) {
                StateAuthService.authenticate(event, nextState);
                if (!SessionStorageService.getFromSession(nodeConfig.SESSION_PEER_NODES)) {
                    PeerService.getPeers().then(function (response) {
                        SessionStorageService.saveToSession(nodeConfig.SESSION_PEER_NODES, response);
                        loadOptions();
                    }, function (error) {
                        window.alert('Unable to get Active nodes');
                    });
                }
                loadOptions();


            });

            function loadOptions() {
                if (!$rootScope.options) {
                    var publicKey = CommonsService.getAccountDetailsFromSession('publicKey');
                    OptionsService.loadOptions(publicKey, function (optionsObject) {
                        $rootScope.options = optionsObject;
                        SessionStorageService.saveToSession(baseConfig.SESSION_APP_OPTIONS, optionsObject);
                        getPhasingDetails();
                    }, function (e) {
                        $rootScope.options = DEFAULT_OPTIONS;
                        SessionStorageService.saveToSession(baseConfig.SESSION_APP_OPTIONS, DEFAULT_OPTIONS);
                        getPhasingDetails();
                    }, function (error) {
                        alert('Unable to get active nodes');
                    });

                }
            }

            function getPhasingDetails() {
                var accountRS = CommonsService.getAccountDetailsFromSession('accountRs');
                AccountService.getPhasingOnlyControl(accountRS).then(function (success) {
                    if (success.account) {
                        SessionStorageService.saveToSession(controlConfig.SESSION_ACCOUNT_CONTROL_HASCONTROL_KEY, true);
                        SessionStorageService.saveToSession(controlConfig.SESSION_ACCOUNT_CONTROL_JSONCONTROL_KEY,
                            success);
                    } else {
                        SessionStorageService.saveToSession(controlConfig.SESSION_ACCOUNT_CONTROL_HASCONTROL_KEY,
                            false);
                        SessionStorageService.saveToSession(controlConfig.SESSION_ACCOUNT_CONTROL_JSONCONTROL_KEY,
                            undefined);
                    }
                });
            }

        }]);
