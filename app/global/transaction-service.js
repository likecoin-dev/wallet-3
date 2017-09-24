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

angular.module('node').service('TransactionService',
    ['SessionStorageService', 'baseConfig', 'Restangular', 'loginConfig', 'CryptoService', 'controlConfig',
        '$rootScope', 'NodeService', 'OptionsService',
        function (SessionStorageService, baseConfig, Restangular, loginConfig, CryptoService, controlConfig,
                  $rootScope, NodeService, OptionsService) {

            this.createTransaction = function (requestParameters, messageParameters, phasingParameters) {
                var finalJson = {};

                return this.getBlockChainStatus().then(function (success) {
                    SessionStorageService.saveToSession(baseConfig.SESSION_CURRENT_BLOCK, success.numberOfBlocks);
                    if (!phasingParameters) {
                        phasingParameters = createPhasingParameters();
                    }
                    finalJson = copyJson(phasingParameters, finalJson);
                    finalJson = copyJson(messageParameters, finalJson);
                    finalJson = copyJson(requestParameters, finalJson);
                    Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                        OptionsService.getOption('RANDOMIZE_NODES')));

                    return Restangular.all(baseConfig.apiEndPoint).customPOST('', '', finalJson, '');
                });

            };

            this.getBlockChainStatus = function () {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                    OptionsService.getOption('RANDOMIZE_NODES')));
                var params = {
                    'requestType': 'getBlockchainStatus',
                };
                return Restangular.all(baseConfig.apiEndPoint).customGET('', params);
            };

            function copyJson(fromJson, toJson) {
                fromJson = fromJson || {};
                toJson = toJson || {};
                for (var key in fromJson) {
                    if (fromJson.hasOwnProperty(key)) {
                        toJson[key] = fromJson[key];
                    }
                }
                return toJson;
            }

            function createPhasingParameters() {
                var hasPhasing = SessionStorageService.getFromSession(
                    controlConfig.SESSION_ACCOUNT_CONTROL_HASCONTROL_KEY);
                var phasingParams = {};
                if (hasPhasing) {
                    var accountPhasingOptions = SessionStorageService.getFromSession(
                        controlConfig.SESSION_ACCOUNT_CONTROL_JSONCONTROL_KEY);
                    phasingParams.phased = true;
                    phasingParams.phasingVotingModel = accountPhasingOptions.votingModel;
                    phasingParams.phasingQuorum = accountPhasingOptions.quorum;
                    phasingParams.phasingMinBalance = accountPhasingOptions.minBalance;
                    phasingParams.phasingMinBalanceModel = accountPhasingOptions.minBalanceModel;
                    phasingParams.phasingWhitelisted =
                        getWhitelistedAccountsFromPhasingJson(accountPhasingOptions.whitelist);
                    var blockHeight = SessionStorageService.getFromSession(baseConfig.SESSION_CURRENT_BLOCK) || 0;
                    phasingParams.phasingFinishHeight = blockHeight + $rootScope.options.TX_HEIGHT;
                }

                return phasingParams;
            }

            function getWhitelistedAccountsFromPhasingJson(controlWhiteListJson) {
                var accounts = [];
                for (var i = 0; i < controlWhiteListJson.length; i++) {
                    accounts[i] = controlWhiteListJson[i].whitelisted;
                }
                return accounts;
            }

        }
    ])
;
