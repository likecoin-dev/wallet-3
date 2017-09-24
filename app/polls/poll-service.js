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

angular.module('poll').service('PollService',
    ['nodeConfig', 'SessionStorageService', 'NodeService', 'baseConfig', 'pollConfig', 'Restangular',
        'TransactionService', '$rootScope', 'OptionsService',
        function (nodeConfig, SessionStorageService, NodeService, baseConfig, pollConfig, Restangular,
                  TransactionService, $rootScope, OptionsService) {

            this.getPolls = function (firstIndex, lastIndex, includeFinished) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                    OptionsService.getOption('RANDOMIZE_NODES')));
                var params = {
                    'requestType': 'getAllPolls',
                    'firstIndex': firstIndex,
                    'lastIndex': lastIndex,
                    'includeFinished': includeFinished
                };
                return Restangular.all(pollConfig.pollEndPoint).customGET('', params);

            };

            this.getAccountPolls = function (account, firstIndex, lastIndex, includeFinished) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                    OptionsService.getOption('RANDOMIZE_NODES')));
                var params = {
                    'requestType': 'getPolls',
                    'account': account,
                    'firstIndex': firstIndex,
                    'lastIndex': lastIndex,
                    'includeFinished': includeFinished
                };
                return Restangular.all(pollConfig.pollEndPoint).customGET('', params);
            };

            this.getPoll = function (poll) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                    OptionsService.getOption('RANDOMIZE_NODES')));
                var params = {
                    'requestType': 'getPoll',
                    'poll': poll
                };
                return Restangular.all(pollConfig.pollEndPoint).customGET('', params);
            };

            this.getPollData = function (pollId) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                    OptionsService.getOption('RANDOMIZE_NODES')));
                var params = {
                    'requestType': 'getPollResult',
                    'poll': pollId
                };
                return Restangular.all(pollConfig.pollEndPoint).customGET('', params);
            };

            this.searchPolls = function (query, firstIndex, lastIndex) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                    OptionsService.getOption('RANDOMIZE_NODES')));
                var params = {
                    'requestType': 'searchPolls',
                    'query': query,
                    'includeFinished': true,
                    'firstIndex': firstIndex,
                    'lastIndex': lastIndex

                };
                return TransactionService.createTransaction(params);
            };

            this.castVote = function (publicKey, pollId, optionNames, fee) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                    OptionsService.getOption('RANDOMIZE_NODES')));
                var params = {
                    'publicKey': publicKey,
                    'requestType': 'castVote',
                    'poll': pollId,
                    'feeTQT': parseInt(fee * baseConfig.TOKEN_QUANTS, 10),
                    'broadcast': 'false',
                    'deadline': OptionsService.getOption('DEADLINE'),
                };
                for (var i = 0; i < optionNames.length; i++) {
                    params[optionNames[i]] = '1';
                }
                return TransactionService.createTransaction(params);
            };

            this.getOptionName = getOptionName;

            this.createPoll = function (pollJson) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                    OptionsService.getOption('RANDOMIZE_NODES')));
                var params = {
                    'requestType': 'createPoll',
                    'publicKey': pollJson.publicKey,
                    'name': pollJson.name,
                    'description': pollJson.description,
                    'feeTQT': parseInt(pollJson.fee * baseConfig.TOKEN_QUANTS, 10),
                    'deadline': OptionsService.getOption('DEADLINE'), 
                    'broadcast': 'false',
                    'minNumberOfOptions': pollJson.minNumberOfOptions,
                    'maxNumberOfOptions': pollJson.maxNumberOfOptions,
                    'minRangeValue': pollJson.minRangeValue,
                    'maxRangeValue': pollJson.maxRangeValue,
                    'minBalanceModel': pollJson.minBalanceModel,
                    'holding': pollJson.holding,
                    'minBalance': pollJson.minBalance,
                    'finishHeight': pollJson.finishHeight,
                    'votingModel': pollJson.votingModel
                };
                params = fillOptionsToJson(params, pollJson.options);
                return TransactionService.createTransaction(params);
            };

            this.getPollVotes = function (poll, firstIndex, lastIndex) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                    OptionsService.getOption('RANDOMIZE_NODES')));
                var params = {
                    'requestType': 'getPollVotes',
                    'poll': poll,
                    'includeWeights': 'true',
                    'firstIndex': firstIndex,
                    'lastIndex': lastIndex,
                    'includeFinished': true
                };
                return Restangular.all(pollConfig.pollEndPoint).customGET('', params);

            };

            function fillOptionsToJson(pollJson, pollOptions) {
                var optionString = 'option';
                if (pollOptions) {
                    var length = pollOptions.length;
                    for (var i = 0; i < length; i++) {
                        pollJson[getOptionName(i)] = pollOptions[i];
                    }
                }
                return pollJson;
            }

            function getOptionName(number) {

                return number > 9 ? 'option' + number : 'option0' + number;

            }

        }]);
