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

angular.module('currencies').service('CurrenciesService',
    ['nodeConfig', 'SessionStorageService', 'NodeService', 'baseConfig', 'currenciesConfig', 'Restangular',
        'TransactionService', '$rootScope', 'OptionsService',
        function (nodeConfig, SessionStorageService, NodeService, baseConfig, currenciesConfig, Restangular,
                  TransactionService, $rootScope, OptionsService) {

            this.getCurrencies = function (firstIndex, lastIndex) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                    OptionsService.getOption('RANDOMIZE_NODES')));
                var params = {
                    'requestType': 'getAllCurrencies',
                    'firstIndex': firstIndex,
                    'lastIndex': lastIndex,
                    'includeCounts': true
                };
                return Restangular.all(currenciesConfig.currenciesEndPoint).customGET('', params);

            };

            this.getCurrency = function (currencyCode) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                    OptionsService.getOption('RANDOMIZE_NODES')));
                var params = {
                    'requestType': 'getCurrency',
                    'code': currencyCode,
                    'includeCounts': true
                };
                return Restangular.all(currenciesConfig.currenciesEndPoint).customGET('', params);
            };

            this.getCurrencyById = function (currencyId) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                    OptionsService.getOption('RANDOMIZE_NODES')));
                var params = {
                    'requestType': 'getCurrency',
                    'currency': currencyId,
                    'includeCounts': true
                };
                return Restangular.all(currenciesConfig.currenciesEndPoint).customGET('', params);
            };

            this.getAccountCurrencies = function (account) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                    OptionsService.getOption('RANDOMIZE_NODES')));
                var params = {
                    'requestType': 'getAccountCurrencies',
                    'account': account,
                    'includeCurrencyInfo': true,
                    'includeCounts': true,
                };
                return Restangular.all(currenciesConfig.currenciesEndPoint).customGET('', params);
            };

            this.getSingleAccountCurrency = function (account, currency) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                    OptionsService.getOption('RANDOMIZE_NODES')));
                var params = {
                    'requestType': 'getAccountCurrencies',
                    'account': account,
                    'currency': currency,
                };
                return Restangular.all(currenciesConfig.currenciesEndPoint).customGET('', params);
            };

            this.getMultipleCurrenctLastExchanges = function (currency) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                    OptionsService.getOption('RANDOMIZE_NODES')));
                var params = {
                    'requestType': 'getLastExchanges',
                    'currencies': currency,
                };
                return Restangular.all(currenciesConfig.currenciesEndPoint).customGET('', params);
            };

            this.issueCurrency =
                function (publicKey, name, code, description, type, initialSupply, maxSupply, decimals, fee,
                          minCurrencyAmount, activHeight, reserveSupply) {
                    Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                        OptionsService.getOption('RANDOMIZE_NODES')));
                    var params = {
                        'publicKey': publicKey,
                        'requestType': 'issueCurrency',
                        'name': name,
                        'code': code,
                        'description': description,
                        'type': type,
                        'initialSupply': parseInt(initialSupply),
                        'maxSupply': parseInt(maxSupply),
                        'decimals': parseInt(decimals),
                        'feeTQT': parseInt(fee * baseConfig.TOKEN_QUANTS, 10),
                        'broadcast': 'false',
                        'deadline': OptionsService.getOption('DEADLINE'),
                        'minReservePerUnitTQT': minCurrencyAmount,
                        'reserveSupply': reserveSupply,
                        'issuanceHeight': parseInt(activHeight)

                    };
                    return TransactionService.createTransaction(params);
                };

            this.canDeleteCurrency = function (currency, accountRS) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'), OptionsService.getOption('RANDOMIZE_NODES')));
                var params = {
                    'requestType': 'canDeleteCurrency',
                    'account': accountRS,
                    'currency': currency,
                };
                return Restangular.all(currenciesConfig.currenciesEndPoint).customPOST('', '', params, '');
            };

            this.deleteCurrency = function (currency, fee, publicKey) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'), OptionsService.getOption('RANDOMIZE_NODES')));
                var params = {
                    'requestType': 'deleteCurrency',
                    'publicKey': publicKey,
                    'currency': currency,
                    'feeTQT': parseInt(fee * baseConfig.TOKEN_QUANTS, 10),
                    'deadline': OptionsService.getOption('DEADLINE'),
                    'broadcast': 'false',
                };
                return TransactionService.createTransaction(params);
            };

            this.searchCurrencies = function (query) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'), OptionsService.getOption('RANDOMIZE_NODES')));
                var params = {
                    'requestType': 'searchCurrencies',
                    'query': query,
                    'includeCounts': true
                };
                return Restangular.all(currenciesConfig.currenciesEndPoint).customGET('', params);
            };

            this.transferCurrency = function (publicKey, recipientRS, currency, units, fee) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'), OptionsService.getOption('RANDOMIZE_NODES')));
                var params = {
                    'requestType': 'transferCurrency',
                    'recipient': recipientRS,
                    'currency': currency,
                    'publicKey': publicKey,
                    'feeTQT': parseInt(fee * baseConfig.TOKEN_QUANTS, 10),
                    'deadline': OptionsService.getOption('DEADLINE'),
                    'broadcast': 'false',
                    'units': parseInt(units),
                };
                return TransactionService.createTransaction(params);
            };

            this.getBlockChainStatus = function () {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'), OptionsService.getOption('RANDOMIZE_NODES')));
                var params = {
                    'requestType': 'getBlockchainStatus',
                };
                return Restangular.all(currenciesConfig.currenciesEndPoint).customGET('', params);
            };

            this.publishExchangeOffer = function (publicKey, currency, limits, supply, expirationHeight, fee) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'), OptionsService.getOption('RANDOMIZE_NODES')));
                var params = {
                    'requestType': 'publishExchangeOffer',
                    'currency': currency,
                    'publicKey': publicKey,
                    'feeTQT': parseInt(fee * baseConfig.TOKEN_QUANTS, 10),
                    'deadline': OptionsService.getOption('DEADLINE'),
                    'broadcast': 'false',
                    'buyRateTQT': parseInt(limits.buyRate),
                    'sellRateTQT': parseInt(limits.sellRate),
                    'totalBuyLimit': parseInt(limits.totalBuy),
                    'totalSellLimit': parseInt(limits.totalSell),
                    'initialBuySupply': parseInt(supply.initialBuy),
                    'initialSellSupply': parseInt(supply.initialSell),
                    'expirationHeight': parseInt(expirationHeight)
                };
                return TransactionService.createTransaction(params);
            };

            this.getAllExchanges = function (firstIndex, lastIndex) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'), OptionsService.getOption('RANDOMIZE_NODES')));
                var params = {
                    'requestType': 'getAllExchanges',
                    'firstIndex': firstIndex,
                    'lastIndex': lastIndex,
                    'includeCurrencyInfo': true
                };
                return Restangular.all(currenciesConfig.currenciesEndPoint).customGET('', params);
            };

            this.currencyReserveClaim = function (publicKey, currency, units, fee) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'), OptionsService.getOption('RANDOMIZE_NODES')));
                var params = {
                    'requestType': 'currencyReserveClaim',
                    'currency': currency,
                    'units': units,
                    'publicKey': publicKey,
                    'feeTQT': parseInt(fee * baseConfig.TOKEN_QUANTS, 10),
                    'deadline': OptionsService.getOption('DEADLINE'),
                    'broadcast': 'false',
                };
                return TransactionService.createTransaction(params);
            };

            this.currencyReserveIncrease = function (publicKey, currency, amountPerUnit, fee) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'), OptionsService.getOption('RANDOMIZE_NODES')));
                var params = {
                    'requestType': 'currencyReserveIncrease',
                    'currency': currency,
                    'amountPerUnitTQT': parseInt(amountPerUnit),
                    'publicKey': publicKey,
                    'feeTQT': parseInt(fee * baseConfig.TOKEN_QUANTS, 10),
                    'deadline': OptionsService.getOption('DEADLINE'),
                    'broadcast': 'false',
                };
                return TransactionService.createTransaction(params);
            };

            this.buyCurrency = function (publicKey, currency, rateTQT, units, fee) {

                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'), OptionsService.getOption('RANDOMIZE_NODES')));
                var params = {
                    'requestType': 'currencyBuy',
                    'currency': currency,
                    'rateTQT': parseInt(rateTQT),
                    'units': parseInt(units),
                    'publicKey': publicKey,
                    'feeTQT': parseInt(fee * baseConfig.TOKEN_QUANTS, 10),
                    'deadline': OptionsService.getOption('DEADLINE'),
                    'broadcast': 'false',
                };

                return TransactionService.createTransaction(params);
            };

            this.sellCurrency = function (publicKey, currency, rateTQT, units, fee) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'), OptionsService.getOption('RANDOMIZE_NODES')));
                var params = {
                    'requestType': 'currencySell',
                    'currency': currency,
                    'rateTQT': parseInt(rateTQT),
                    'units': parseInt(units),
                    'publicKey': publicKey,
                    'feeTQT': parseInt(fee * baseConfig.TOKEN_QUANTS, 10),
                    'deadline': OptionsService.getOption('DEADLINE'),
                    'broadcast': 'false',
                };
                return TransactionService.createTransaction(params);
            };

            this.getAvailableToBuy = function (currency, units  ) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE')));
                var params = {
                    'requestType': 'getAvailableToBuy',
                    'currency': accountRs,
                    'units': units
                };
                return Restangular.all(currenciesConfig.currenciesEndPoint).customGET('', params);
            };

            this.getAvailableToSell = function (currency, units  ) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE')));
                var params = {
                    'requestType': 'getAvailableToSell',
                    'currency': currency,
                    'units': units
                };
                return Restangular.all(currenciesConfig.currenciesEndPoint).customGET('', params);
            };

            this.getBuyOffers = function ( account, currency, firstIndex, lastIndex   ) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE')));
                var params = {
                    'requestType': 'getBuyOffers',
                    'account': account,
                    'currency': currency,
                    'availableOnly': true,
                    'sortByRate': true,
                    'firstIndex': firstIndex,
                    'lastIndex': lastIndex
                };
                return Restangular.all(currenciesConfig.currenciesEndPoint).customGET('', params);
            };

            this.getSellOffers = function (account, currency, firstIndex, lastIndex   ) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE')));
                var params = {
                    'requestType': 'getSellOffers',
                    'account': account,
                    'currency': currency,
                    'availableOnly': true,
                    'sortByRate': true,
                    'firstIndex': firstIndex,
                    'lastIndex': lastIndex
                };
                return Restangular.all(currenciesConfig.currenciesEndPoint).customGET('', params);
            };

            this.getCurrencyAccounts = function (currency, firstIndex, lastIndex   ) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE')));
                var params = {
                    'requestType': 'getCurrencyAccounts',
                    'currency': currency,
                    'availableOnly': true,
                    'firstIndex': firstIndex,
                    'lastIndex': lastIndex,
                };
                return Restangular.all(currenciesConfig.currenciesEndPoint).customGET('', params);
            };

            this.getCurrencyFounders = function (currency, firstIndex, lastIndex   ) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE')));
                var params = {
                    'requestType': 'getCurrencyFounders',
                    'currency': currency,
                    'firstIndex': firstIndex,
                    'lastIndex': lastIndex,
                };
                return Restangular.all(currenciesConfig.currenciesEndPoint).customGET('', params);
            };

            this.getCurrencyTransfers = function (currency, account, firstIndex, lastIndex   ) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE')));
                var params = {
                    'requestType': 'getCurrencyTransfers',
                    'currency': currency,
                    'account': account,
                    'firstIndex': firstIndex,
                    'lastIndex': lastIndex,
                    'includeCurrencyInfo': true
                };
                return Restangular.all(currenciesConfig.currenciesEndPoint).customGET('', params);
            };

            this.getExchanges = function (currency, account, firstIndex, lastIndex   ) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE')));
                var params = {
                    'requestType': 'getExchanges',
                    'currency': currency,
                    'account': account,
                    'firstIndex': firstIndex,
                    'lastIndex': lastIndex,
                    'includeCurrencyInfo': true
                };
                return Restangular.all(currenciesConfig.currenciesEndPoint).customGET('', params);
            };

            this.getDeskExchanges = function (currency, firstIndex, lastIndex   ) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE')));
                var params = {
                    'requestType': 'getExchanges',
                    'currency': currency,
                    'firstIndex': firstIndex,
                    'lastIndex': lastIndex,
                    'includeCurrencyInfo': true
                };
                return Restangular.all(currenciesConfig.currenciesEndPoint).customGET('', params);
            };

            this.getAccountExchangeRequests = function (accountRs, currency, firstIndex, lastIndex ) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE')));
                var params = {
                    'requestType': 'getAccountExchangeRequests',
                    'account': accountRs,
                    'currency': accountRs,
                    'firstIndex': firstIndex,
                    'lastIndex': lastIndex,
                    'includeCurrencyInfo': true,
                };
                return Restangular.all(currenciesConfig.currenciesEndPoint).customGET('', params);
            };

            this.getExpectedCurrencyTransfers = function (currency, account, firstIndex, lastIndex   ) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE')));
                var params = {
                    'requestType': 'getExpectedCurrencyTransfers',
                    'currency': currency,
                    'account': account,
                    'firstIndex': firstIndex,
                    'lastIndex': lastIndex,
                    'includeCurrencyInfo': true
                };
                return Restangular.all(currenciesConfig.currenciesEndPoint).customGET('', params);
            };

            this.getExpectedExchangeRequests = function (currency, account, firstIndex, lastIndex   ) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE')));
                var params = {
                    'requestType': 'getExpectedExchangeRequests',
                    'currency': currency,
                    'account': account,
                    'firstIndex': firstIndex,
                    'lastIndex': lastIndex,
                    'includeCurrencyInfo': true
                };
                return Restangular.all(currenciesConfig.currenciesEndPoint).customGET('', params);
            };

            this.getExpectedSellOffers = function (currency, account, firstIndex, lastIndex   ) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE')));
                var params = {
                    'requestType': 'getExpectedSellOffers',
                    'currency': currency,
                    'account': account,
                    'firstIndex': firstIndex,
                    'lastIndex': lastIndex,
                    'sortByRate': true
                };
                return Restangular.all(currenciesConfig.currenciesEndPoint).customGET('', params);
            };

            this.getAvailableToSell = function (currency, units   ) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE')));
                var params = {
                    'requestType': 'getAvailableToSell',
                    'currency': currency,
                    'units': units
                };
                return Restangular.all(currenciesConfig.currenciesEndPoint).customGET('', params);
            };

            this.getAvailableToBuy = function (currency, units   ) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE')));
                var params = {
                    'requestType': 'getAvailableToBuy',
                    'currency': currency,
                    'units': units
                };
                return Restangular.all(currenciesConfig.currenciesEndPoint).customGET('', params);
            };



        }]);
