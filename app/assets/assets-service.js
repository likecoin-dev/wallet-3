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

angular.module('assets').service('AssetsService',
    ['nodeConfig', 'SessionStorageService', 'NodeService', 'baseConfig', 'assetsConfig', 'Restangular', 'loginConfig',
        'CryptoService', 'TransactionService', '$rootScope', 'OptionsService',
        function (nodeConfig, SessionStorageService, NodeService, baseConfig, assetsConfig, Restangular, loginConfig,
                  CryptoService, TransactionService, $rootScope, OptionsService) {

            this.GET_ASSET_ORDERS = {
                'BID_ORDER': 'getBidOrders',
                'ASK_ORDER': 'getAskOrders'
            };

            this.getAssets = function (firstIndex, lastIndex, order, orderColumn) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                    OptionsService.getOption('RANDOMIZE_NODES')));
                var params = {
                    'requestType': 'getAllAssets',
                    'firstIndex': firstIndex,
                    'lastIndex': lastIndex,
                    'includeCounts': true,
                    'order' : order,
                    'orderColumn' : orderColumn
                };
                return Restangular.all(assetsConfig.assetsEndPoint).customGET('', params);

            };

            this.getAsset = function (asset, includeCounts) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                    OptionsService.getOption('RANDOMIZE_NODES')));
                var params = {
                    'requestType': 'getAsset',
                    'asset': asset,
                    'includeCounts': includeCounts
                };
                return Restangular.all(assetsConfig.assetsEndPoint).customGET('', params);
            };

            this.getAccountAssets = function (account) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                    OptionsService.getOption('RANDOMIZE_NODES')));
                var params = {
                    'requestType': 'getAccountAssets',
                    'account': account,
                    'includeAssetInfo': true,
                    'includeCounts': true,
                };
                return Restangular.all(assetsConfig.assetsEndPoint).customGET('', params);
            };

            this.getAccountSingleAsset = function (account, asset) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                    OptionsService.getOption('RANDOMIZE_NODES')));
                var params = {
                    'requestType': 'getAccountAssets',
                    'account': account,
                    'asset': asset,
                    'includeAssetInfo': true
                };
                return Restangular.all(assetsConfig.assetsEndPoint).customGET('', params);
            };

            this.getMultipleAssetLastTrades = function (assets) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                    OptionsService.getOption('RANDOMIZE_NODES')));
                var params = {
                    'requestType': 'getLastTrades',
                    'assets': assets,
                };
                return Restangular.all(assetsConfig.assetsEndPoint).customGET('', params);
            };

            this.getAccountCurrentBidOrders = function (accountRS, firstIndex, lastIndex) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                    OptionsService.getOption('RANDOMIZE_NODES')));
                var params = {
                    'requestType': 'getAccountCurrentBidOrders',
                    'account': accountRS,
                    'firstIndex': firstIndex,
                    'lastIndex': lastIndex
                };
                return Restangular.all(assetsConfig.assetsEndPoint).customGET('', params);
            };

            this.getAccountCurrentAskOrders = function (accountRS, firstIndex, lastIndex) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                    OptionsService.getOption('RANDOMIZE_NODES')));
                var params = {
                    'requestType': 'getAccountCurrentAskOrders',
                    'account': accountRS,
                    'firstIndex': firstIndex,
                    'lastIndex': lastIndex
                };
                return Restangular.all(assetsConfig.assetsEndPoint).customGET('', params);
            };

            this.issueAsset = function (name, description, quantity, decimals, publicKey, fee) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                    OptionsService.getOption('RANDOMIZE_NODES')));
                var params = {
                    'requestType': 'issueAsset',
                    'publicKey': publicKey,
                    'quantityQNT': parseInt(quantity),
                    'name': name,
                    'description': description,
                    'feeTQT': parseInt(fee * baseConfig.TOKEN_QUANTS, 10),
                    'deadline': OptionsService.getOption('DEADLINE'),
                    'broadcast': 'false',
                    'decimals': parseInt(decimals),
                };
                return TransactionService.createTransaction(params);
            };

            this.deleteAssetShares = function (asset, quantity, fee, publicKey) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                    OptionsService.getOption('RANDOMIZE_NODES')));
                var params = {
                    'requestType': 'deleteAssetShares',
                    'publicKey': publicKey,
                    'quantityQNT': parseInt(quantity),
                    'asset': asset,
                    'feeTQT': parseInt(fee * baseConfig.TOKEN_QUANTS, 10),
                    'deadline': OptionsService.getOption('DEADLINE'),
                    'broadcast': 'false',
                };
                return TransactionService.createTransaction(params);
            };

            this.serachAssets = function (query) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                    OptionsService.getOption('RANDOMIZE_NODES')));
                var params = {
                    'requestType': 'searchAssets',
                    'query': query
                };
                return Restangular.all(assetsConfig.assetsEndPoint).customGET('', params);
            };

            this.cancelOrder = function (order, fee, publicKey, type) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                    OptionsService.getOption('RANDOMIZE_NODES')));
                var requestType;
                if (type === 'bid') {
                    requestType = 'cancelBidOrder';
                } else if (type === 'ask') {
                    requestType = 'cancelAskOrder';
                }
                var params = {
                    'requestType': requestType,
                    'publicKey': publicKey,
                    'order': order,
                    'feeTQT': parseInt(fee * baseConfig.TOKEN_QUANTS, 10),
                    'deadline': OptionsService.getOption('DEADLINE'),
                    'broadcast': 'false',
                };
                return TransactionService.createTransaction(params);
            };

            this.transferAsset = function (publicKey, recipientRS, asset, quantity, fee) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                    OptionsService.getOption('RANDOMIZE_NODES')));
                var params = {
                    'requestType': 'transferAsset',
                    'recipient': recipientRS,
                    'asset': asset,
                    'publicKey': publicKey,
                    'feeTQT': parseInt(fee * baseConfig.TOKEN_QUANTS, 10),
                    'deadline': OptionsService.getOption('DEADLINE'),
                    'broadcast': 'false',
                    'quantityQNT': parseInt(quantity),
                };
                return TransactionService.createTransaction(params);
            };

            this.dividendPayment = function (publicKey, asset, height, amoountPerQNT, fee) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                    OptionsService.getOption('RANDOMIZE_NODES')));
                var params = {
                    'requestType': 'dividendPayment',
                    'asset': asset,
                    'publicKey': publicKey,
                    'feeTQT': parseInt(fee * baseConfig.TOKEN_QUANTS, 10),
                    'deadline': OptionsService.getOption('DEADLINE'),
                    'broadcast': 'false',
                    'amountTQTPerQNT': parseInt(amoountPerQNT),
                    'height': parseInt(height)
                };
                return TransactionService.createTransaction(params);
            };

            this.placeOrder = function (publicKey, price, asset, quantity, fee, requestType) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                    OptionsService.getOption('RANDOMIZE_NODES')));
                var request;
                if (requestType === 'bid') {
                    request = 'placeBidOrder';
                } else {
                    request = 'placeAskOrder';
                }
                var params = {
                    'requestType': request,
                    'priceTQT': parseInt(price),
                    'asset': asset,
                    'publicKey': publicKey,
                    'feeTQT': parseInt(fee * baseConfig.TOKEN_QUANTS, 10),
                    'deadline': OptionsService.getOption('DEADLINE'), 
                    'broadcast': 'false',
                    'quantityQNT': parseInt(quantity),
                };
                return TransactionService.createTransaction(params);
            };

            this.getAssetLastTrades = function (asset, firstIndex, lastIndex) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                    OptionsService.getOption('RANDOMIZE_NODES')));
                var params = {
                    'requestType': 'getTrades',
                    'asset': asset,
                    'includeAssetInfo': true,
                    'firstIndex': firstIndex,
                    'lastIndex': lastIndex
                };
                return Restangular.all(assetsConfig.assetsEndPoint).customGET('', params);
            };

            this.getAssetOrders = function (asset, orderType, firstIndex, lastIndex) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                    OptionsService.getOption('RANDOMIZE_NODES')));
                var params = {
                    'requestType': orderType,
                    'asset': asset,
                    'firstIndex': firstIndex,
                    'lastIndex': lastIndex
                };
                return Restangular.all(assetsConfig.assetsEndPoint).customGET('', params);
            };

            this.getAllTrades = function (firstIndex, lastIndex) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                    OptionsService.getOption('RANDOMIZE_NODES')));
                var params = {
                    'requestType': 'getAllTrades',
                    'includeAssetInfo': true,
                    'firstIndex': firstIndex,
                    'lastIndex': lastIndex
                };
                return Restangular.all(assetsConfig.assetsEndPoint).customGET('', params);
            };

            this.getAllOpenAskOrders = function (firstIndex, lastIndex) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                    OptionsService.getOption('RANDOMIZE_NODES')));
                var params = {
                    'requestType': 'getAllOpenAskOrders',
                    'firstIndex': firstIndex,
                    'lastIndex': lastIndex
                };
                return Restangular.all(assetsConfig.assetsEndPoint).customGET('', params);
            };

            this.getAllOpenBidOrders = function (firstIndex, lastIndex) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                    OptionsService.getOption('RANDOMIZE_NODES')));
                var params = {
                    'requestType': 'getAllOpenBidOrders',
                    'firstIndex': firstIndex,
                    'lastIndex': lastIndex
                };
                return Restangular.all(assetsConfig.assetsEndPoint).customGET('', params);
            };

            this.getAllLastTransfers = function (accountRs, firstIndex, lastIndex) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                    OptionsService.getOption('RANDOMIZE_NODES')));
                var params = {
                    'requestType': 'getAssetTransfers',
                    'account': accountRs,
                    'includeAssetInfo': true,
                    'firstIndex': firstIndex,
                    'lastIndex': lastIndex
                };
                return Restangular.all(assetsConfig.assetsEndPoint).customGET('', params);
            };

            this.getMyTrades = function (account, firstIndex, lastIndex) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'),
                    OptionsService.getOption('RANDOMIZE_NODES')));
                var params = {
                    'requestType': 'getTrades',
                    'account': account,
                    'includeAssetInfo': true,
                    'firstIndex': firstIndex,
                    'lastIndex': lastIndex
                };
                return Restangular.all(assetsConfig.assetsEndPoint).customGET('', params);
            };

            this.getExpectedAskOrders = function ( asset ) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE')));
                var params = {
                    'requestType': 'getExpectedAskOrders',
                    'asset': asset,
                    'sortByPrice': true
                };
                return Restangular.all(assetsConfig.assetsEndPoint).customGET('', params);
            };

            this.getExpectedBidOrders = function ( asset ) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE')));
                var params = {
                    'requestType': 'getExpectedBidOrders',
                    'asset': asset,
                    'sortByPrice': true
                };
                return Restangular.all(assetsConfig.assetsEndPoint).customGET('', params);
            };

            this.getExpectedAssetDeletes = function (asset, account  ) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE')));
                var params = {
                    'requestType': 'getExpectedAssetDeletes',
                    'includeAssetInfo': true
                };
                return Restangular.all(assetsConfig.assetsEndPoint).customGET('', params);
            };

            this.getExpectedAssetTransfers = function (asset, account  ) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE')));
                var params = {
                    'requestType': 'getExpectedAssetTransfers',
                    'includeAssetInfo': true
                };
                return Restangular.all(assetsConfig.assetsEndPoint).customGET('', params);
            };

            this.getExpectedOrderCancellations = function ( ) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE')));
                var params = {
                    'requestType': 'getExpectedOrderCancellations'
                };
                return Restangular.all(assetsConfig.assetsEndPoint).customGET('', params);
            };

            this.getBidOrderTrades = function ( orderid, firstIndex, lastIndex ) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE')));
                var params = {
                    'requestType': 'getOrderTrades',
                    'bidOrder': orderid,
                    'firstIndex': firstIndex,
                    'lastIndex': lastIndex,
                    'includeAssetInfo': true
                };
                return Restangular.all(assetsConfig.assetsEndPoint).customGET('', params);
            };

            this.getAskOrderTrades = function ( orderid, firstIndex, lastIndex ) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE')));
                var params = {
                    'requestType': 'getOrderTrades',
                    'askOrder': orderid,
                    'firstIndex': firstIndex,
                    'lastIndex': lastIndex,
                    'includeAssetInfo': true
                };
                return Restangular.all(assetsConfig.assetsEndPoint).customGET('', params);
            };

            this.getDividendsHistory = function ( asset, firstIndex, lastIndex, timestamp ) {
                Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE')));
                var params = {
                    'requestType': 'getAssetDividends',
                    'asset': asset,
                    'firstIndex': firstIndex,
                    'lastIndex': lastIndex,
                    'timestamp': timestamp
                };
                return Restangular.all(assetsConfig.assetsEndPoint).customGET('', params);
            };

        }]);
