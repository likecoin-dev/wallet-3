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

angular.module('dashboard')
    .service('DashboardService',
        ['SessionStorageService', 'Restangular', 'baseConfig', 'dashboardConfig', 'NodeService', '$rootScope',
            'OptionsService',
            function (SessionStorageService, Restangular, baseConfig, dashboardConfig, NodeService, $rootScope,
                      OptionsService) {

                this.getAccountPolls = function (accountRS, firstIndex, lastIndex) {
                    Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                        OptionsService.getOption('RANDOMIZE_NODES')));
                    var params = {
                        'requestType': 'getPolls',
                        'account': accountRS,
                        'firstIndex': firstIndex,
                        'lastIndex': lastIndex,
                        'includeFinished': true

                    };
                    return Restangular.all(dashboardConfig.apiEndPoint).customGET('', params);
                };

                this.getAccountAliases = function (accountId, firstIndex, lastIndex) {
                    Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                        OptionsService.getOption('RANDOMIZE_NODES')));
                    var params = {
                        'requestType': 'getAliases',
                        'firstIndex': firstIndex,
                        'lastIndex': lastIndex,
                        'includeFinished': true,
                        'account': accountId
                    };
                    return Restangular.all(dashboardConfig.apiEndPoint).customGET('', params);
                };

                this.getAccountAssetsAndBalances = function (accountRS) {
                    Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                        OptionsService.getOption('RANDOMIZE_NODES')));
                    var params = {
                        'requestType': 'getAccount',
                        'includeAssets': 'true', 'includeCurrencies': 'true', 'includeEffectiveBalance': 'true',
                        'includeLessors': 'true',
                        'account': accountRS
                    };
                    return Restangular.all(dashboardConfig.apiEndPoint).customGET('', params);
                };

                this.getAccountBlockChainTransactions = function (accountRS, firstIndex, lastIndex) {
                    Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                        OptionsService.getOption('RANDOMIZE_NODES')));
                    var params = {
                        'requestType': 'getBlockchainTransactions',
                        'account': accountRS,
                        'firstIndex': firstIndex,
                        'lastIndex': lastIndex,
                        'withMessage': true
                    };
                    return Restangular.all(dashboardConfig.apiEndPoint).customGET('', params);
                };

            }]);
