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

angular.module('aliases').service('AliasService',
    ['nodeConfig', 'SessionStorageService', 'NodeService', 'baseConfig', 'aliasesConfig', 'Restangular', 'loginConfig',
        'CryptoService', 'TransactionService', '$rootScope', 'OptionsService',
        function (nodeConfig, SessionStorageService, NodeService, baseConfig, aliasesConfig, Restangular, loginConfig,
                  CryptoService, TransactionService, $rootScope, OptionsService) {

            this.getAccountAliases = function (account, firstIndex, lastIndex) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                    OptionsService.getOption('RANDOMIZE_NODES')));

                var params = {
                    'requestType': 'getAliases',
                    'account': account,
                    'firstIndex': firstIndex,
                    'lastIndex': lastIndex
                };
                return Restangular.all(aliasesConfig.aliasesEndPoint).customGET('', params);
            };

            this.setAlias = function (publicKey, aliasName, alias, fee) {

                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                    OptionsService.getOption('RANDOMIZE_NODES')));

                var aliasURI = alias;
                var params = {
                    'publicKey': publicKey,
                    'requestType': 'setAlias',
                    'aliasName': aliasName,
                    'aliasURI': aliasURI,
                    'feeTQT': parseInt(fee * baseConfig.TOKEN_QUANTS, 10),
                    'broadcast': 'false',
                    'deadline': OptionsService.getOption('DEADLINE'),
                };
                return TransactionService.createTransaction(params);
            };

            this.deleteAlias = function (publicKey, aliasName, fee) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                    OptionsService.getOption('RANDOMIZE_NODES')));
                var params = {
                    'publicKey': publicKey,
                    'requestType': 'deleteAlias',
                    'aliasName': aliasName,
                    'feeTQT': parseInt(fee * baseConfig.TOKEN_QUANTS, 10),
                    'broadcast': 'false',
                    'deadline': OptionsService.getOption('DEADLINE'),
                };
                return TransactionService.createTransaction(params);
            };

            this.searchAlias = function (query, firstIndex, lastIndex) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                    OptionsService.getOption('RANDOMIZE_NODES')));
                var params = {
                    'requestType': 'getAliasesLike',
                    'aliasPrefix': query,
                    'firstIndex': firstIndex,
                    'lastIndex': lastIndex
                };
                return Restangular.all(aliasesConfig.aliasesEndPoint).customGET('', params);
            };

            this.sellAlias = function (publicKey, aliasName, recipientRS, price, fee) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                    OptionsService.getOption('RANDOMIZE_NODES')));
                var params = {
                    'publicKey': publicKey,
                    'requestType': 'sellAlias',
                    'aliasName': aliasName,
                    'priceTQT': price,
                    'recipient': recipientRS,
                    'feeTQT': parseInt(fee * baseConfig.TOKEN_QUANTS, 10),
                    'broadcast': 'false',
                    'deadline': OptionsService.getOption('DEADLINE'),
                };
                return TransactionService.createTransaction(params);
            };

            this.cancelAlias = function (publicKey, aliasName, recipientRS, fee) {

                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                    OptionsService.getOption('RANDOMIZE_NODES')));

                var params = {
                    'publicKey': publicKey,
                    'requestType': 'sellAlias',
                    'aliasName': aliasName,
                    'priceTQT': '0',
                    'recipient': recipientRS,
                    'feeTQT': parseInt(fee * baseConfig.TOKEN_QUANTS, 10),
                    'broadcast': 'false',
                    'deadline': OptionsService.getOption('DEADLINE'),
                };
                return TransactionService.createTransaction(params);
            };

            this.buyAlias = function (publicKey, aliasName, price, fee) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                    OptionsService.getOption('RANDOMIZE_NODES')));

                var params = {
                    'publicKey': publicKey,
                    'requestType': 'buyAlias',
                    'aliasName': aliasName,
                    'amountTQT': parseInt(price),
                    'feeTQT': parseInt(fee * baseConfig.TOKEN_QUANTS, 10),
                    'broadcast': 'false',
                    'deadline': OptionsService.getOption('DEADLINE'), 
                };
                return TransactionService.createTransaction(params);
            };

            this.getAliasesOpenOffers = function (account, firstIndex, lastIndex) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                    OptionsService.getOption('RANDOMIZE_NODES')));
                var params = {
                    'requestType': 'getAliasesOpenOffers',
                    'account': account,
                    'firstIndex': firstIndex,
                    'lastIndex': lastIndex
                };
                return Restangular.all(aliasesConfig.aliasesEndPoint).customGET('', params);
            };

            this.getAliasesPrivateOffers = function (account, firstIndex, lastIndex) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                    OptionsService.getOption('RANDOMIZE_NODES')));

                var params = {
                    'requestType': 'getAliasesPrivateOffers',
                    'account': account,
                    'firstIndex': firstIndex,
                    'lastIndex': lastIndex
                };
                return Restangular.all(aliasesConfig.aliasesEndPoint).customGET('', params);
            };

            this.getAliasesPublicOffers = function (account, firstIndex, lastIndex, order, orderColumn) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                    OptionsService.getOption('RANDOMIZE_NODES')));
                var params = {
                    'requestType': 'getAliasesPublicOffers',
                    'firstIndex': firstIndex,
                    'lastIndex': lastIndex,
                    'order' : order,
                    'orderColumn': orderColumn
                };
                return Restangular.all(aliasesConfig.aliasesEndPoint).customGET('', params);
            };

        }]);
