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

angular.module('assets', ['baseClient', 'crypto', 'ui.router', 'ui.bootstrap', 'multiStepForm', 'node','options']);

angular.module('assets').constant('assetsConfig', {
    'assetsEndPoint':'api'
});

angular.module('assets').config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

    $stateProvider.state('client.signedin.assets', {
        url: '^/assets',
        templateUrl: './assets/views/main.html',
        abstract:true
    }).state('client.signedin.assets.myassets', {
        url: '^/assets/myassets',
        templateUrl: './assets/views/myassets.html',
        controller: 'MyAssetsCtrl'
    }).state('client.signedin.assets.assets', {
        url: '^/assets/assets',
        templateUrl: './assets/views/assets.html',
        controller: 'AssetsCtrl'
    }).state('client.signedin.assets.openorders', {
        url: '^/assets/orders',
        templateUrl: './assets/views/openorders.html',
        controller: 'AssetsOpenOrdersCtrl'
    }).state('client.signedin.assets.trade', {
        url: '^/assets/{assetId}/trade',
        templateUrl: './assets/views/trade-desk.html',
        controller: 'TradeDeskInputController'
    }).state('client.signedin.assets.lasttrades', {
        url: '^/assets/lastrades',
        templateUrl: './assets/views/lasttrades.html',
        controller: 'AllTradesCtrl'
    }).state('client.signedin.assets.lasttransfers', {
        url: '^/assets/lasttransfers',
        templateUrl: './assets/views/lasttransfers.html',
        controller: 'MyTransfersCtrl'
    }).state('client.signedin.assets.mytrades', {
        url: '^/assets/mytrades',
        templateUrl: './assets/views/mytrades.html',
        controller: 'MytradesCtrl'
    });




}]);
