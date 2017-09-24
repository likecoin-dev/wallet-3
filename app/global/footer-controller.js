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

angular.module('client').controller('FooterController',
    ['NodeService', 'OptionsService', '$scope', 'TransactionService', 'PeerService', '$timeout', 'LocalHostService', 'SessionStorageService', 'baseConfig',
        function (NodeService, OptionsService, $scope, TransactionService, PeerService, $timeout, LocalHostService, SessionStorageService, baseConfig) {

            $scope.init = function () {
                $scope.connectionMode = OptionsService.getOption('CONNECTION_MODE');
                $scope.connectedURL = NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'));
                $scope.totalNodes = NodeService.getNodesCount();
                TransactionService.getBlockChainStatus().then(function (success) {
                    $scope.currentHeight = success.numberOfBlocks;

                    SessionStorageService.saveToSession(baseConfig.SESSION_CURRENT_BLOCK, success.numberOfBlocks);

                });
                $scope.AssignedDate = Date;
            };

            $scope.getState = function () {
                LocalHostService.getPeerState(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE')))
                    .then(function (success) {
                        $scope.peerState = success;
                    });
            };

        }]);
