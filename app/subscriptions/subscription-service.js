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

angular.module('subscription').service('SubscriptionService',
    ['nodeConfig', 'SessionStorageService', 'NodeService', 'baseConfig', 'Restangular', 'loginConfig',
        'CryptoService', 'TransactionService', '$rootScope', 'OptionsService', 'subscriptionConfig',
        function (nodeConfig, SessionStorageService, NodeService, baseConfig, Restangular, loginConfig,
                  CryptoService, TransactionService, $rootScope, OptionsService, subscriptionConfig) {

        this.createSubscription =
            function (
              publicKey,
              recipient,
              amountTQT,
              frequency,
              fee
            ) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                    OptionsService.getOption('RANDOMIZE_NODES')));
                var params = {
                    'publicKey': publicKey,
                    'requestType': 'sendMoneySubscription',
                    'recipient': recipient,
                    'amountTQT': amountTQT,
                    'frequency': frequency,
                    'feeTQT': parseInt(fee * baseConfig.TOKEN_QUANTS, 10),
                    'broadcast': 'false',
                    'deadline': OptionsService.getOption('DEADLINE')
                };
                return TransactionService.createTransaction(params);
            };

        this.subscriptionCancel = function (publicKey, subscription, fee ) {
            Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                OptionsService.getOption('RANDOMIZE_NODES')));
            var params = {
                'requestType': 'subscriptionCancel',
                'publicKey': publicKey,
                'subscription': subscription,
                'feeTQT': parseInt(fee * baseConfig.TOKEN_QUANTS, 10),
                'broadcast': 'false',
                'deadline': OptionsService.getOption('DEADLINE')
            };
            return Restangular.all(subscriptionConfig.subscriptionEndPoint).customPOST('', '', params, '');


        };

        this.getSubscription = function (subscription, firstIndex, lastIndex   ) {
            Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE')));
            var params = {
                'requestType': 'getSubscription',
                'subscription': subscription,
                'firstIndex': firstIndex,
                'lastIndex': lastIndex,
            };
            return Restangular.all(subscriptionConfig.subscriptionEndPoint).customGET('', params);
        };

        this.getAccountSubscriptions = function (account, firstIndex, lastIndex   ) {
            Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE')));
            var params = {
                'requestType': 'getAccountSubscriptions',
                'account': account,
                'firstIndex': firstIndex,
                'lastIndex': lastIndex,
            };
            return Restangular.all(subscriptionConfig.subscriptionEndPoint).customGET('', params);
        };

        this.getSubscriptionsToAccount = function (account, firstIndex, lastIndex   ) {
            Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE')));
            var params = {
                'requestType': 'getSubscriptionsToAccount',
                'account': account,
                'firstIndex': firstIndex,
                'lastIndex': lastIndex,
            };
            return Restangular.all(subscriptionConfig.subscriptionEndPoint).customGET('', params);
        };

        }]);
