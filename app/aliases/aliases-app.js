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

angular.module('aliases', ['baseClient', 'crypto', 'ui.router', 'ui.bootstrap', 'multiStepForm', 'node','options']);

angular.module('aliases').constant('aliasesConfig', {
    'aliasesEndPoint':'api'
});

angular.module('aliases').config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

    $stateProvider.state('client.signedin.aliases', {
        url: '^/aliases',
        templateUrl: './aliases/views/main.html',
        abstract:true
    }).state('client.signedin.aliases.myaliases', {
        url: '^/aliases/myaliases',
        templateUrl: './aliases/views/myaliases.html',
        controller: 'MyAliasesCtrl'
    }).state('client.signedin.aliases.openoffers', {
        url: '^/aliases/openoffers',
        templateUrl: './aliases/views/openoffers.html',
        controller: 'AliasesOpenOffersCtrl'
    }).state('client.signedin.aliases.privateoffers', {
        url: '^/aliases/privateoffers',
        templateUrl: './aliases/views/privateoffers.html',
        controller: 'AliasesPrivateOffersCtrl'
    }).state('client.signedin.aliases.publicoffers', {
        url: '^/aliases/publicoffers',
        templateUrl: './aliases/views/publicoffers.html',
        controller: 'AliasesPublicOffersCtrl'
    });

}]);
