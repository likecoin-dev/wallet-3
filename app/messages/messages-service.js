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

angular.module('messages').service('MessageService',
    ['nodeConfig', 'SessionStorageService', 'NodeService', 'baseConfig', 'messagesConfig', 'Restangular', 'loginConfig',
        'TransactionService', '$rootScope', 'OptionsService',
        function (nodeConfig, SessionStorageService, NodeService, baseConfig, messagesConfig, Restangular, loginConfig,
                  TransactionService, $rootScope, OptionsService) {

            this.getAccountDetailsFromSession = function (keyName) {
                var accountDetails = SessionStorageService.getFromSession(loginConfig.SESSION_ACCOUNT_DETAILS_KEY);
                if (keyName) {
                    return accountDetails[keyName];
                }
                return accountDetails;
            };

            this.getMessages = function (account, firstIndex, lastIndex, type, subtype) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                    OptionsService.getOption('RANDOMIZE_NODES')));
                var params = {
                    'requestType': 'getBlockchainTransactions',
                    'account': account,
                    'firstIndex': firstIndex,
                    'lastIndex': lastIndex,
                    'type': type,
                    'subtype': subtype,
                    'withMessage': true
                };
                return Restangular.all(messagesConfig.messagesEndPoint).customGET('', params);
            };

            this.getAccountDetails = function (accountRS) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                    OptionsService.getOption('RANDOMIZE_NODES')));
                var params = {
                    'requestType': 'getAccount',
                    'account': accountRS
                };
                return Restangular.all(messagesConfig.messagesEndPoint).customGET('', params);
            };

            this.sendMessage = function (senderPublicKey, recipientRS, fee, data, nonce, recipientPublicKey) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                    OptionsService.getOption('RANDOMIZE_NODES')));

                var params = {
                    'requestType': 'sendMessage',
                    'publicKey': senderPublicKey,
                    'recipient': recipientRS,
                    'encryptedMessageData': data,
                    'encryptedMessageNonce': nonce,
                    'messageToEncryptIsText': 'true',
                    'compressMessageToEncrypt': 'true',
                    'encryptedMessageIsPrunable': 'false',
                    'feeTQT': parseInt(fee * baseConfig.TOKEN_QUANTS, 10),
                    'recipientPublicKey': recipientPublicKey,
                    'deadline': OptionsService.getOption('DEADLINE'), 
                    'broadcast': 'false',
                };
                return TransactionService.createTransaction(params);
            };

            this.broadcastMessage = function (transactionBytes) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                    OptionsService.getOption('RANDOMIZE_NODES')));
                var params = {
                    'requestType': 'broadcastTransaction',
                    'transactionBytes': transactionBytes
                };
                return Restangular.all(messagesConfig.messagesEndPoint).customPOST('', '', params, '');
            };

        }]);
