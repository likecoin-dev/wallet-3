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

angular.module('escrow', ['baseClient', 'crypto', 'ui.router', 'ui.bootstrap', 'multiStepForm', 'node','options']);

angular.module('escrow').constant('escrowConfig', {
    'escrowEndPoint':'api'
});

angular.module('escrow').config(
  ['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

    $stateProvider.state('client.signedin.escrow', {
        url: '^/escrow',
        templateUrl: './escrow/views/main.html',
        abstract: true
    }).state('client.signedin.escrow.myescrow', {
        url: '^/escrow/myescrow',
        templateUrl: './escrow/views/myescrow.html',
        controller: 'MyEscrowCtrl'
    });

}]);
