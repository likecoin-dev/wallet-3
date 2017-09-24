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

angular.module('node').controller('NodeController',
        ['NodeService', 'OptionsService', '$scope', function (NodeService, OptionsService, $scope) {

            $scope.init=function(){
                $scope.connectedURL=NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE'));
                $scope.totalNodes=NodeService.getNodesCount();
            };

        }]);
