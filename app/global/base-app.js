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

var baseClientApp = angular.module('baseClient',
    ['ngStorage', 'restangular', 'datatables', 'datatables.bootstrap', 'angularMoment', 'ngSanitize', 'ui.mask',
        'validation', 'validation.rule', 'cc.autorefresh', 'checklist-model', 'chart.js', 'nvd3',
        'pascalprecht.translate', 'cgBusy']);

angular.module('baseClient').constant('baseConfig', {
    'SESSION_STORAGE_NAMESPACE': 'com.client',
    'FALLBACK_HOST_URL': 'http://185.103.75.217:23457/',
    'AUTO_PAGE_REFRESH_INTERVAL': 60000,
    'TOKEN_QUANTS': 100000000,
    'TX_DEADLINE': 60,
    'apiEndPoint': 'api',
    'SESSION_CURRENT_BLOCK': 'current_block',
    'SESSION_APP_OPTIONS': 'app_options',
    'SESSION_PEER_ENDPOINTS': 'peerEndpoints',
    'SESSION_MAX_RETRIES': '2',
    'SESSION_CURRENT_TRY': '0',
    'EPOCH': 1484046000,
});

angular.module('baseClient')
    .config(['$localStorageProvider', 'baseConfig', function ($localStorageProvider, baseConfig) {
        $localStorageProvider.setKeyPrefix(baseConfig.SESSION_STORAGE_NAMESPACE);
    }]);

angular.module('baseClient').constant('peerConfig', {
    'apiUrl': 'http://185.103.75.217:8888',
    'peerEndPoint': 'api/nodes',
    'SESSION_PEER_URL_KEY': 'peerKey'
});

angular.module('baseClient').constant('localhostConfig', {
    'apiUrl': 'http://localhost:23457',
    'endPoint': 'api',
    'SESSION_PEER_URL_KEY': 'peerKey'
});

angular.module('baseClient').constant('peerEndpoints', [
  'http://185.35.137.7:8888/api/nodes',
  'http://185.35.139.102:8888/api/nodes',
  'http://185.35.139.103:8888/api/nodes',
  'http://185.35.139.104:8888/api/nodes',
  'http://185.35.139.105:8888/api/nodes',
  'http://46.244.20.41:8888/api/nodes',
  'http://185.35.139.101:8888/api/nodes',
  'http://208.95.1.177:8888/api/nodes',
  'http://199.127.137.169:8888/api/nodes',
  'http://185.103.75.217:8888/api/nodes'
]);

angular.module('baseClient').constant('nodeEndpoints', [
    'http://185.103.75.217:23457/',
    'http://185.35.137.7:23457/',
    'http://185.35.139.102:23457/',
    'http://185.35.139.103:23457/',
    'http://185.35.139.104:23457/',
    'http://185.35.139.105:23457/',
    'http://46.244.20.41:23457/',
    'http://185.35.139.101:23457/',
    'http://208.95.1.177:23457/',
    'http://199.127.137.169:23457/'
]);

angular.module('baseClient').constant('chainEndpoints', [
    'http://185.103.75.217:23457/',
    'http://185.35.137.7:23457/',
    'http://185.35.139.102:23457/',
    'http://185.35.139.103:23457/',
    'http://185.35.139.104:23457/',
    'http://185.35.139.105:23457/',
    'http://46.244.20.41:23457/',
    'http://185.35.139.101:23457/',
    'http://208.95.1.177:23457/',
    'http://199.127.137.169:23457/'
]);

angular.module('baseClient').constant('loginConfig', {
    SESSION_ACCOUNT_DETAILS_KEY: 'account_details',
    SESSION_ACCOUNT_PRIVATE_KEY: 'account_private_key'
});

angular.module('baseClient').constant('controlConfig', {
    SESSION_ACCOUNT_CONTROL_HASCONTROL_KEY: 'account_control_hascontrol',
    SESSION_ACCOUNT_CONTROL_JSONCONTROL_KEY: 'account_control_jsoncontrol'
});

angular.module('baseClient').factory('PeerRestangular', ['Restangular', 'peerConfig', function (Restangular, peerConfig) {
        return Restangular.withConfig(function (RestangularConfigurer) {
            RestangularConfigurer.setBaseUrl(peerConfig.apiUrl);
        });
    }]);

angular.module('baseClient').service('PeerService', ['PeerRestangular', 'peerConfig', 'SessionStorageService', 'baseConfig', 'peerEndpoints',
        function (PeerRestangular, peerConfig, SessionStorageService, baseConfig, peerEndpoints) {

            this.getPeers = function () {
                PeerRestangular.setBaseUrl(peerEndpoints[0]);
                return PeerRestangular.all('').customGET('', {});
            };

            this.getStats = function () {
                PeerRestangular.setBaseUrl(peerEndpoints[0]);
                return PeerRestangular.all('getStats').customGET('', {});
            };

            this.searchIp = function (ip) {
                PeerRestangular.setBaseUrl(peerEndpoints[0]);
                var params = {
                    'ip': ip
                };
                return PeerRestangular.all('').customGET('', params);
            };
        }]);

angular.module('baseClient').service('PeerTestService', ['PeerRestangular', 'peerConfig', function (PeerRestangular, peerConfig) {

        var endPoints = ['http://localhost:1234', 'http://localhost:2345', peerConfig.peerEndPoint];
        this.getPeers = function () {
            return PeerRestangular.all(endPoints[0]).customGET('', {});
        };
    }]);

angular.module('baseClient').service('CommonsService', ['SessionStorageService', 'loginConfig', 'Restangular', 'baseConfig', 'NodeService',
        'OptionsService',
        function (SessionStorageService, loginConfig, Restangular, baseConfig, NodeService, OptionsService) {

            this.getAccountDetailsFromSession = function (keyName) {
                var accountDetails = SessionStorageService.getFromSession(loginConfig.SESSION_ACCOUNT_DETAILS_KEY);
                if (keyName && accountDetails) {
                    return accountDetails[keyName];
                }
                return accountDetails;
            };

            this.broadcastTransaction = function (transactionBytes) {

                // Restangular.setBaseUrl(baseConfig.FALLBACK_HOST_URL);

                // removed injection from -> OptionsService due to circular references
                // options-app.js / line 32

                Restangular.setBaseUrl(
                    NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                        OptionsService.getOption('RANDOMIZE_NODES'))
                );

                var params = {
                    'requestType': 'broadcastTransaction',
                    'transactionBytes': transactionBytes
                };
                return Restangular.all(baseConfig.apiEndPoint).customPOST('', '', params, '');
            };

        }]);

angular.module('baseClient').service('LocalHostService',
        ['Restangular', 'localhostConfig', function (Restangular, localhostConfig) {

            this.getPeerState = function (url) {
                var params = {
                    'requestType': 'getPeerState'
                };
                if (!url) {
                    url = localhostConfig.apiUrl;
                }
                Restangular.setBaseUrl(url);
                return Restangular.all(localhostConfig.endPoint).customGET('', params);
            };

            this.isValidUrl = function (url) {
                return this.getPeerState(url).then(function (success) {
                    return true;
                }, function (error) {
                    return false;
                });
            };
        }]);

angular.module('baseClient').service('SessionStorageService', ['$sessionStorage', function ($sessionStorage) {


        this.saveToSession = function (key, value) {
            $sessionStorage[key] = value;
        };

        this.getFromSession = function (key) {
            return $sessionStorage[key];
        };

        this.deleteFromSession = function (key) {
            try {
                delete $sessionStorage[key];
            } catch (e) {
                $sessionStorage[key] = undefined;
            }
        };

        this.resetSession = function () {
            $sessionStorage.$reset();
        };
    }]);

angular.module('baseClient').directive('stopccp', function () {
    return {
        scope: {
            alert: '@',
        },
        link: function (scope, element) {
            element.on('cut copy paste', function (event) {
                event.preventDefault();
                if (scope.alert === 'true') {
                    alert('Copy paste is disabled for security purpose');
                }

            });
        }
    };
});

angular.module('baseClient').directive('dynamic', ['$compile', function ($compile) {
    return {
        restrict: 'A',
        replace: true,
        link: function (scope, ele, attrs) {
            scope.$watch(attrs.dynamic, function (html) {
                ele.html(html);
                $compile(ele.contents())(scope);
            });
        }
    };
}]);

angular.module('baseClient').directive('focusInput', ['$timeout', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            $timeout(function () {
                element[0].focus();
            });

        }
    };
}]);



angular.module('baseClient').value('cgBusyDefaults', {
    message: 'Connecting...',
    backdrop: true,
     delay: 0, // 250,
     minDuration: 333,
});
