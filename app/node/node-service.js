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

angular.module('node').service('NodeService',
    ['nodeConfig', 'SessionStorageService', 'PeerService', 'OptionsService', '$rootScope', 'LocalHostService',
        function (nodeConfig, SessionStorageService, PeerService, OptionsService, $rootScope, LocalHostService) {

            function getLocalNode() {
                var node = SessionStorageService.getFromSession(nodeConfig.SESSION_LOCAL_NODE);
                if (!node) {
                    return OptionsService.getOption('USER_NODE_URL');
                }
                return node;
            }

            function hasLocal() {
                return SessionStorageService.getFromSession(nodeConfig.SESSION_HAS_LOCAL);
            }

            function getPeerNode(i) {
                var peerNodes = SessionStorageService.getFromSession(nodeConfig.SESSION_PEER_NODES);
                if (!peerNodes) {
                    return PeerService.getPeers().then(function (response) {
                        SessionStorageService.saveToSession(nodeConfig.SESSION_PEER_NODES, response);
                        return response[i];
                    });
                }
                return peerNodes[i];
            }

            this.getNodesCount = function () {
                var total = SessionStorageService.getFromSession(nodeConfig.SESSION_PEER_NODES) || [];
                return total.length;
            };

            this.getNode = function (connectionMode, selectRandom) {

                if (connectionMode === 'AUTO' || connectionMode === 0) {
                    var i = 0;

                    if (selectRandom) {
                        i = Math.floor(Math.random() * this.getNodesCount());
                    }

                    return getPeerNode(i);
                } else if (connectionMode === 'HTTPS') {

                  return OptionsService.getOption('USER_NODE_URL');

                } else if (connectionMode === 'FOUNDATION') {

                  return OptionsService.getOption('USER_NODE_URL');

                } else if (connectionMode === 'MANUAL') {

                  return OptionsService.getOption('USER_NODE_URL');

                }

                return getLocalNode();

            };

            this.getNodeUrl = function (connectionMode, selectRandom) {

                var node = this.getNode(connectionMode, selectRandom);

                if (typeof node === 'string') {
                    return node;
                }

                var url = node._id + ':' + node.apiServerPort;

                if ( connectionMode === 'HTTPS') {  url = 'https://' + node._id;  }

                if (!/^https?:\/\//i.test(url)) {
                    url = 'http://' + url;
                }

                return url;
            };

            function appendPortIfNotPresent(url, port) {

                var parser = new URL(url);

                if (!parser.port) {
                    return url + ':' + port;
                }

                return url;
            }

            this.hasLocal = function () {
                return hasLocal();
            };

            this.getLocalNodeUrl = function () {
                var node = this.getNode(true);

                if (node) {
                    var port = node.apiServerPort;
                    return 'http://localhost:' + port;
                }
                throw new Error('Local node not available');
            };

        }]);
