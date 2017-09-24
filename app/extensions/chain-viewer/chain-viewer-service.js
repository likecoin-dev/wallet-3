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

angular.module('chain-viewer').service('ChainViewerService', ['Restangular', 'chainViewerConfig',
    function (Restangular, chainViewerConfig) {

        this.getBlocks = function (firstIndex, lastIndex) {
            Restangular.setBaseUrl(chainViewerConfig.apiUrl);
            var params = {
                'requestType': 'getBlocks',
                'firstIndex': firstIndex,
                'lastIndex': lastIndex
            };
            return Restangular.all(chainViewerConfig.endPoint).customGET('', params);

        };

        this.getTransactions = function (firstIndex, lastIndex) {
            Restangular.setBaseUrl(chainViewerConfig.apiUrl);
            var params = {
                'requestType': 'getTransactions',
                'firstIndex': firstIndex,
                'lastIndex': lastIndex
            };
            return Restangular.all(chainViewerConfig.endPoint).customGET('', params);
        };

        this.getPeers = function (page, results) {
            Restangular.setBaseUrl(chainViewerConfig.peerUrl);
            var params = {
                'page': page,
                'results': results,
                'filter': 'numberOfActivePeers',
                'order': 'desc'
            };
            return Restangular.all(chainViewerConfig.peerEndPoint).customGET('', params);


        };

        this.getUnconfirmedTransactions = function () {
            Restangular.setBaseUrl(chainViewerConfig.apiUrl);
            var params = {
                'requestType': 'getUnconfirmedTransactions'
            };
            return Restangular.all(chainViewerConfig.endPoint).customGET('', params);

        };


    }]);
