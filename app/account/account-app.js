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


angular.module('account',
    ['baseClient', 'crypto', 'login', 'node', 'ui.router', 'ui.bootstrap', 'multiStepForm', 'node', 'clientAlert',
        'datatables.scroller', 'ja.qr', 'options','assets','currencies']);

angular.module('account').constant('accountConfig', {
    'accountEndPoint': 'api'
});

angular.module('account')
    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

        $stateProvider.state('client.signedin.account', {
            url: '^/accounts',
            templateUrl: './account/views/main.html',
            abstract: true
        }).state('client.signedin.account.details', {
            url: '^/accounts/details',
            templateUrl: './account/views/details.html',
            controller: 'AccountMainCtrl'
        }).state('client.signedin.account.transactions', {
            url: '^/accounts/transactions',
            templateUrl: './account/views/transactions.html',
            controller: 'AccountTransactionsCtrl'
        }).state('client.signedin.account.pending', {
            url: '^/accounts/pending',
            templateUrl: './account/views/unconfirmed.html',
            controller: 'AccountUnconfirmedTransactionsCtrl'
        }).state('client.signedin.account.lessors', {
            url: '^/accounts/lessors',
            templateUrl: './account/views/lessors.html',
            controller: 'AccountLessorCtrl'
        }).state('client.signedin.account.control', {
            url: '^/accounts/control',
            templateUrl: './account/views/control.html',
            controller: 'ControlMainCtrl'
        }).state('client.signedin.account.properties', {
            url: '^/accounts/properties',
            templateUrl: './account/views/properties.html',
            controller: 'AccountPropertiesCtrl'
        });

    }]);
