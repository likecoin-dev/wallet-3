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

angular.module('crowdfunding').service('CrowdfundingService',
    ['nodeConfig', 'SessionStorageService', 'NodeService', 'baseConfig', 'Restangular', 'loginConfig',
        'CryptoService', 'TransactionService', '$rootScope', 'OptionsService', 'crowdfundingConfig',
        function (nodeConfig, SessionStorageService, NodeService, baseConfig, Restangular, loginConfig,
                  CryptoService, TransactionService, $rootScope, OptionsService, crowdfundingConfig) {

        this.createCampaign =
            function (
              publicKey,
              name,
              code,
              desc,
              type,
              initialSupply,
              reserveSupply,
              maxSupply,
              decimals,
              fee,
              minReservePerUnitTQT,
              issuanceHeight
            ) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                    OptionsService.getOption('RANDOMIZE_NODES')));
                var params = {
                    'publicKey': publicKey,
                    'requestType': 'issueCurrency',
                    'name': name,
                    'code': code,
                    'description': desc,
                    'type': type,
                    'initialSupply': parseInt(initialSupply),
                    'reserveSupply': parseInt(reserveSupply),
                    'maxSupply': parseInt(maxSupply),
                    'minReservePerUnitTQT' : parseInt(minReservePerUnitTQT),
                    'issuanceHeight': parseInt(issuanceHeight),
                    'decimals': parseInt(decimals),
                    'feeTQT': parseInt(fee * baseConfig.TOKEN_QUANTS, 10),
                    'broadcast': 'false',
                    'deadline': OptionsService.getOption('DEADLINE')
                };
                return TransactionService.createTransaction(params);
            };

        this.getAllCampaigns = function (firstIndex, lastIndex, account) {
            Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                OptionsService.getOption('RANDOMIZE_NODES')));
            var params = {
                'requestType': 'getAllCrowdfundings',
                'firstIndex': firstIndex,
                'lastIndex': lastIndex,
                'includeCounts': false,
                'includeAmounts' : true,
                'account': account,
                'orderColumn' : 'issuance_height',
                'order': 'desc'
            };
            return Restangular.all(crowdfundingConfig.crowdfundingEndPoint).customGET('', params);

        };

        this.getCampaignFounders = function (currency, firstIndex, lastIndex   ) {
            Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE')));
            var params = {
                'requestType': 'getCurrencyFounders',
                'currency': currency,
                'firstIndex': firstIndex,
                'lastIndex': lastIndex,
            };
            return Restangular.all(crowdfundingConfig.crowdfundingEndPoint).customGET('', params);
        };

        this.setCampaignReserve = function (currency, amountPerUnitTQT, publicKey ) {
            Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE')));
            var params = {
                'requestType': 'currencyReserveIncrease',
                'publicKey': publicKey,
                'currency': currency,
                'amountPerUnitTQT': amountPerUnitTQT,
                'feeTQT': parseInt(1 * baseConfig.TOKEN_QUANTS, 10),
                'broadcast': 'false',
                'deadline': OptionsService.getOption('DEADLINE')


            };

            return Restangular.all(crowdfundingConfig.crowdfundingEndPoint).customPOST('', '', params, '');
        };

        this.getCampaignClaim = function (currency, units ) {
            Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE')));
            var params = {
                'requestType': 'currencyReserveClaim',
                'currency': currency,
                'units': units,
                'lastIndex': lastIndex,
            };
            return Restangular.all(crowdfundingConfig.crowdfundingEndPoint).customGET('', params);
        };

        }]);
