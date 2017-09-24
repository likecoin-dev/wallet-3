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

angular.module('tools').service('ToolsService',
    ['nodeConfig', 'SessionStorageService', 'NodeService', 'baseConfig', 'toolsConfig', 'Restangular', 'loginConfig',
        'TransactionService', '$rootScope', 'OptionsService',
        function (nodeConfig, SessionStorageService, NodeService, baseConfig, messagesConfig, Restangular, loginConfig,
                  TransactionService, $rootScope, OptionsService) {

            this.decodeToken = function (token, website) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                    OptionsService.getOption('RANDOMIZE_NODES')));
                var params = {
                    'requestType': 'decodeToken',
                    'website': website,
                    'token': token
                };
                return Restangular.all(messagesConfig.messagesEndPoint).customGET('', params);
            };

            this.parseTransaction = function (transactionBytes) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                    OptionsService.getOption('RANDOMIZE_NODES')));
                var params = {
                    'requestType': 'parseTransaction',
                    'transactionBytes': transactionBytes

                };
                return Restangular.all(messagesConfig.messagesEndPoint).customGET('', params);
            };

            this.broadcastTransaction = function (transactionBytes) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                    OptionsService.getOption('RANDOMIZE_NODES')));
                var params = {
                    'requestType': 'broadcastTransaction',
                    'transactionBytes': transactionBytes
                };
                return Restangular.all(messagesConfig.messagesEndPoint).customPOST('', '', params, '');
            };

            this.calculateHash = function (hashAlgorithm, secret) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                    OptionsService.getOption('RANDOMIZE_NODES')));
                var params = {
                    'requestType': 'hash',
                    'hashAlgorithm': hashAlgorithm,
                    'secret' : secret,
                    'secretIsText' : true
                };
                return Restangular.all(messagesConfig.messagesEndPoint).customGET('', params);
            };

            this.getChainStats = function () {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                    OptionsService.getOption('RANDOMIZE_NODES')));
                var params = {
                    'requestType': 'getStatistics',
                };
                return Restangular.all(messagesConfig.messagesEndPoint).customGET('', params);
            };

}]);
