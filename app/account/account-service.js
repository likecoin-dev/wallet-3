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

angular.module('account').service('AccountService',
    ['nodeConfig', 'SessionStorageService', 'NodeService', 'baseConfig', 'accountConfig', 'Restangular', 'loginConfig',
        'CryptoService', 'TransactionService', '$rootScope', 'OptionsService',
        function (nodeConfig, SessionStorageService, NodeService, baseConfig, accountConfig, Restangular, loginConfig,
                  CryptoService, TransactionService, $rootScope, OptionsService) {

            this.getAccountTransaction = function (account, firstIndex, lastIndex, type, subtype) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                    OptionsService.getOption('RANDOMIZE_NODES')));
                var params = {
                    'requestType': 'getBlockchainTransactions',
                    'account': account,
                    'firstIndex': firstIndex,
                    'lastIndex': lastIndex,
                    'type': type,
                    'subtype': subtype,
                };
                return Restangular.all(accountConfig.accountEndPoint).customGET('', params);
            };

            this.getAccountUnconfirmedTransactions = function (account) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                    OptionsService.getOption('RANDOMIZE_NODES')));
                var params = {
                    'requestType': 'getUnconfirmedTransactions',
                    'account': account
                };
                return Restangular.all(accountConfig.accountEndPoint).customGET('', params);

            };

            this.getAccountDetails = function (accountRS) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                    OptionsService.getOption('RANDOMIZE_NODES')));
                var params = {
                    'requestType': 'getAccount',
                    'includeAssets': 'true', 'includeCurrencies': 'true', 'includeEffectiveBalance': 'true',
                    'includeLessors': 'true',
                    'account': accountRS
                };
                return Restangular.all(accountConfig.accountEndPoint).customGET('', params);
            };

            this.getAccountLessors = function (accountRS) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                    OptionsService.getOption('RANDOMIZE_NODES')));
                var params = {
                    'requestType': 'getAccount',
                    'includeLessors': 'true',
                    'includeCurrentHeight': 'true',
                    'includeEffectiveBalance': 'true',
                    'account': accountRS
                };
                return Restangular.all(accountConfig.accountEndPoint).customGET('', params);
            };

            this.getAccountDetailsFromSession = function (keyName) {
                var accountDetails = SessionStorageService.getFromSession(loginConfig.SESSION_ACCOUNT_DETAILS_KEY);
                if (keyName) {
                    return accountDetails[keyName];
                }
                return accountDetails;
            };

            this.createPhasedTransaction = function ( params ) {
                    return TransactionService.createTransaction(params);
                };

            this.createTransaction =
                function (senderPublicKey, recipientRS, amount, fee, data, nonce, recipientPublicKey) {

                    var params = {
                        'requestType': 'sendToken',
                        'recipient': recipientRS,
                        'amountTQT': parseInt(amount),
                        'publicKey': senderPublicKey,
                        'feeTQT': parseInt(fee * baseConfig.TOKEN_QUANTS, 10),
                        'deadline': OptionsService.getOption('DEADLINE'),
                        'broadcast': 'false',
                        'messageToEncryptIsText': 'true',
                        'compressMessageToEncrypt': 'true',
                        'encryptedMessageData': data,
                        'encryptedMessageNonce': nonce,
                        'encryptedMessageIsPrunable': 'false',
                        'recipientPublicKey': recipientPublicKey
                    };

                    return TransactionService.createTransaction(params);
                };

            this.broadcastTransaction = function (transactionBytes) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                    OptionsService.getOption('RANDOMIZE_NODES')));
                var params = {
                    'requestType': 'broadcastTransaction',
                    'transactionBytes': transactionBytes
                };
                return Restangular.all(accountConfig.accountEndPoint).customPOST('', '', params, '');
            };

            this.setAccountInfo = function (publicKey, name, description, fee) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                    OptionsService.getOption('RANDOMIZE_NODES')));
                var params = {
                    'requestType': 'setAccountInfo',
                    'publicKey': publicKey,
                    'name': name,
                    'description': description,
                    'feeTQT': parseInt(fee * baseConfig.TOKEN_QUANTS, 10),
                    'deadline': OptionsService.getOption('DEADLINE'),
                    'broadcast': 'false',
                };
                return TransactionService.createTransaction(params);
            };

            this.searchAccounts = function (query) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                    OptionsService.getOption('RANDOMIZE_NODES')));
                var params = {
                    'requestType': 'searchAccounts',
                    'query': query
                };
                return Restangular.all(accountConfig.accountEndPoint).customGET('', params);
            };

            this.setBalanceLeasing =
                function (senderPublicKey, recipientRS, period, fee, data, nonce, recipientPublicKey) {
                    Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                        OptionsService.getOption('RANDOMIZE_NODES')));
                    var params = {
                        'requestType': 'leaseBalance',
                        'recipient': recipientRS,
                        'period': parseInt(period),
                        'publicKey': senderPublicKey,
                        'feeTQT': parseInt(fee * baseConfig.TOKEN_QUANTS, 10),
                        'deadline': OptionsService.getOption('DEADLINE'),
                        'broadcast': 'false',
                        'messageToEncryptIsText': 'true',
                        'compressMessageToEncrypt': 'true',
                        'encryptedMessageData': data,
                        'encryptedMessageNonce': nonce,
                        'encryptedMessageIsPrunable': 'false',
                        'recipientPublicKey': recipientPublicKey
                    };
                    return Restangular.all(accountConfig.accountEndPoint).customPOST('', '', params, '');
                };

            this.blockGeneration = function (mode, secret) {
                Restangular.setBaseUrl(NodeService.getLocalNodeUrl());

                var command = 'getForging';
                switch (mode) {
                    case 0:
                        command = 'getForging';
                        break;
                    case 1:
                        command = 'startForging';
                        break;
                    case 2:
                        command = 'stopForging';
                        break;
                }

                var params = {
                    'requestType': command,
                    'secretPhrase': secret
                };
                return Restangular.all( accountConfig.accountEndPoint).customPOST('', '', params, '');
            };

            this.searchAlias = function (query) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                    OptionsService.getOption('RANDOMIZE_NODES')));
                var params = {
                    'requestType': 'getAliasesLike',
                    'aliasPrefix': query,
                };
                return Restangular.all(accountConfig.accountEndPoint).customGET('', params);
            };

            this.getVoterPhasedTransactions = function (account, firstIndex, lastIndex) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                    OptionsService.getOption('RANDOMIZE_NODES')));
                var params = {
                    'requestType': 'getVoterPhasedTransactions',
                    'account': account,
                    'firstIndex': firstIndex,
                    'lastIndex': lastIndex
                };
                return Restangular.all(accountConfig.accountEndPoint).customGET('', params);
            };

            this.approveTransactions = function (accountPublicKey, transactionFullHash, fee, revealedSecret) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                    OptionsService.getOption('RANDOMIZE_NODES')));
                var params = {
                    'requestType': 'approveTransaction',
                    'transactionFullHash': transactionFullHash,
                    'revealedSecret' : revealedSecret,
                    'revealedSecretIsText' : true,
                    'publicKey': accountPublicKey,
                    'feeTQT': parseInt(fee * baseConfig.TOKEN_QUANTS, 10),
                    'deadline': OptionsService.getOption('DEADLINE'),
                    'broadcast': 'false'
                };
                return Restangular.all(accountConfig.accountEndPoint).customPOST('', '', params, '');
            };

            this.getPhasingOnlyControl = function (account) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                    OptionsService.getOption('RANDOMIZE_NODES')));
                var params = {
                    'requestType': 'getPhasingOnlyControl',
                    'account': account,
                };
                return Restangular.all(accountConfig.accountEndPoint).customGET('', params);
            };

            this.setAccountControl = function (publicKey, quorum, accounts, fee) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                    OptionsService.getOption('RANDOMIZE_NODES')));
                var params = {
                    'requestType': 'setPhasingOnlyControl',
                    'controlQuorum': quorum,
                    'controlWhitelisted': accounts,
                    'publicKey': publicKey,
                    'feeTQT': parseInt(fee * baseConfig.TOKEN_QUANTS, 10),
                    'deadline': OptionsService.getOption('DEADLINE'),
                    'broadcast': 'false',
                    'controlVotingModel': '0'
                };
                return Restangular.all(accountConfig.accountEndPoint).customPOST('', '', params, '');
            };

            this.removeAccountControl = function (publicKey, fee) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                    OptionsService.getOption('RANDOMIZE_NODES')));
                var params = {
                    'requestType': 'setPhasingOnlyControl',
                    'publicKey': publicKey,
                    'feeTQT': parseInt(fee * baseConfig.TOKEN_QUANTS, 10),
                    'deadline': OptionsService.getOption('DEADLINE'),
                    'broadcast': 'false',
                    'controlVotingModel': '-1'
                };
                return TransactionService.createTransaction(params);
            };

            this.setPhasingOnlyControl = function (json) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                    OptionsService.getOption('RANDOMIZE_NODES')));
                var params = {
                    'requestType': 'setPhasingOnlyControl',
                    'controlVotingModel': json.controlVotingModel,
                    'controlQuorum': json.controlQuorum,
                    'controlMinBalance': json.controlMinBalance,
                    'controlMinBalanceModel': json.controlMinBalanceModel,
                    'controlHolding': json.controlHolding,
                    'controlWhitelisted': json.account,
                    'controlMaxFees': json.controlMaxFees,
                    'controlMinDuration': json.controlMinDuration,
                    'controlMaxDuration': json.controlMaxDuration,
                    'publicKey': json.publicKey,
                    'feeTQT': parseInt(fee * baseConfig.TOKEN_QUANTS, 10),
                    'deadline': OptionsService.getOption('DEADLINE'),
                    'broadcast': 'false',

                };
                return Restangular.all(accountConfig.accountEndPoint).customPOST('', '', params, '');
            };

            this.getAccountProperties = function (recipient, setter, property, firstIndex, lastIndex) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                    OptionsService.getOption('RANDOMIZE_NODES')));
                var params = {
                    'requestType': 'getAccountProperties',
                    'recipient': recipient,
                    'setter': setter,
                    'property' : property,
                    'firstIndex': firstIndex,
                    'lastIndex': lastIndex
                };
                return Restangular.all(accountConfig.accountEndPoint).customGET('', params);
            };

            this.setAccountProperty = function (recipient, property, value, senderPublicKey, fee) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                    OptionsService.getOption('RANDOMIZE_NODES')));
                var params = {
                    'requestType': 'setAccountProperty',
                    'publicKey': senderPublicKey,
                    'feeTQT': parseInt(fee * baseConfig.TOKEN_QUANTS, 10),
                    'deadline': OptionsService.getOption('DEADLINE'),
                    'broadcast': 'false',
                    'recipient': recipient,
                    'property' : property,
                    'value' : value
                };
                return Restangular.all(accountConfig.accountEndPoint).customPOST('', '', params, '');
            };

            this.deleteAccountProperty = function (recipient, property, setter, senderPublicKey, fee) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                    OptionsService.getOption('RANDOMIZE_NODES')));
                var params = {
                    'requestType': 'deleteAccountProperty',
                    'publicKey': senderPublicKey,
                    'feeTQT': parseInt(fee * baseConfig.TOKEN_QUANTS, 10),
                    'deadline': OptionsService.getOption('DEADLINE'),
                    'broadcast': 'false',
                    'property' : property,
                    'recipient': recipient,
                    'setter' : setter
                };
                return Restangular.all(accountConfig.accountEndPoint).customPOST('', '', params, '');
            };

        }]);
