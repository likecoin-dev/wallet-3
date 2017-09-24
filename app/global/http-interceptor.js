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

angular.module('baseClient').factory('httpResponseErrorInterceptor',
    ['$q', '$injector', 'baseConfig', 'peerEndpoints', function ($q, $injector, baseConfig, peerEndpoints) {
        return {
            'response': function (response) {
                var url = response.config.url;
                if (url.indexOf('/api/nodes') !== -1 && Array.isArray(response.data) && response.data.length === 0) {
                    var $http = $injector.get('$http');
                    var SessionStorageService = $injector.get('SessionStorageService');
                    var PeerService = $injector.get('PeerService');


                    //This means peer call. See if there is a better identification.
                    var endPoints = SessionStorageService.getFromSession(baseConfig.SESSION_PEER_ENDPOINTS) ||
                        peerEndpoints;
                    var index = endPoints.indexOf(url);
                    if (endPoints[index + 1]) {
                        response.config.url = endPoints[index + 1];
                        return $http(response.config).then(function (success) {
                            return success;
                        },function (error) {
                            return error;
                        });
                    } else {
                        return response;
                    }
                }
                return response;
            },
            'responseError': function (response) {
                var $http = $injector.get('$http');
                var SessionStorageService = $injector.get('SessionStorageService');
                var PeerService = $injector.get('PeerService');
                var url = response.config.url;
                if (url.indexOf('/api/nodes') !== -1 && response.status === -1) {
                    //This means peer call. See if there is a better identification.
                    var endPoints = SessionStorageService.getFromSession(baseConfig.SESSION_PEER_ENDPOINTS) ||
                        peerEndpoints;
                    var index = endPoints.indexOf(url);
                    if (endPoints[index + 1]) {
                        response.config.url = endPoints[index + 1];
                        return $http(response.config);
                    } else {
                        return $q.reject(response);
                    }
                }
                if (url.indexOf(
                        'api') !== -1 && response.config.params && response.config.params.requestType && response.config.params.requestType !== 'getPeerState' && response.status === -1) {
                    var OptionsConfigurationService = $injector.get('OptionsConfigurationService');
                    var NodeService = $injector.get('NodeService');
                    var currentTry = SessionStorageService.getFromSession(baseConfig.SESSION_CURRENT_TRY) || 0;
                    var maxTries = baseConfig.SESSION_MAX_RETRIES;
                    if (currentTry > maxTries) {
                        SessionStorageService.saveToSession(baseConfig.SESSION_CURRENT_TRY, 0);
                        return $q.reject(response);
                    } else {
                        SessionStorageService.saveToSession(baseConfig.SESSION_CURRENT_TRY, currentTry + 1);
                        return PeerService.getPeers().then(function (success) {
                            OptionsConfigurationService.loadOptions();
                            response.config.url = NodeService.getNodeUrl('AUTO',false) + '/api';

                            return $http(response.config);

                        }, function (error) {
                            return $q.reject(response);
                        });
                    }
                }
                // give up
                return $q.reject(response);
            }
        };
    }]);

angular.module('baseClient').config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('httpResponseErrorInterceptor');
}]);
