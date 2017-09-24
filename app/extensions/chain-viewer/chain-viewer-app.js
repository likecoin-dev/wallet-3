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

angular.module('chain-viewer', ['baseClient', 'node', 'options']);

angular.module('chain-viewer').constant('chainViewerConfig', {
    'apiUrl': 'http://199.127.137.169:23457',
    'peerUrl':'http://199.127.137.169:8888',
    'peerEndPoint': 'api/nodes',
    'endPoint': 'api',
});

angular.module('chain-viewer').config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

    $stateProvider.state('client.signedin.chainviewer', {
        url: '^/chainviewer',
        templateUrl: './extensions/chain-viewer/views/main.html',
        abstract: true
    }).state('client.signedin.chainviewer.blocks', {
        url: '^/chainviewer/blocks',
        templateUrl: './extensions/chain-viewer/views/blocks.html',
        controller:'ChainViewerBlocksCtrl'
    }).state('client.signedin.chainviewer.transactions', {
        url: '^/chainviewer/transactions',
        templateUrl: './extensions/chain-viewer/views/transactions.html',
        controller:'ChainViewerTransactionsCtrl'
    }).state('client.signedin.chainviewer.peers', {
        url: '^/chainviewer/peers',
        templateUrl: './extensions/chain-viewer/views/peers.html',
        controller:'ChainViewerPeersCtrl'
    }).state('client.signedin.chainviewer.unconfirmed', {
        url: '^/chainviewer/unconfirmed',
        templateUrl: './extensions/chain-viewer/views/unconfirmed.html',
        controller:'ChainViewerUnconfirmedTransactionsCtrl'
    });

}]);
