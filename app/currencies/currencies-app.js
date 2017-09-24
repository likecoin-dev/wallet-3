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

angular.module('currencies', ['baseClient', 'crypto', 'ui.router', 'ui.bootstrap', 'multiStepForm', 'node', 'options']);

angular.module('currencies').constant('currenciesConfig', {
    'currenciesEndPoint': 'api'
});

angular.module('currencies').config(
    ['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

        $stateProvider.state('client.signedin.currencies', {
            url: '^/currencies',
            templateUrl: './currencies/views/main.html',
            abstract: true
        }).state('client.signedin.currencies.currencies', {
            url: '^/currencies/currencies',
            templateUrl: './currencies/views/currencies.html',
            controller: 'CurrenciesCtrl'
        }).state('client.signedin.currencies.mycurrencies', {
            url: '^/currencies/mycurrencies',
            templateUrl: './currencies/views/mycurrencies.html',
            controller: 'MyCurrenciesCtrl'
        }).state('client.signedin.currencies.exchanges', {
            url: '^/currencies/exchanges',
            templateUrl: './currencies/views/exchanges.html',
            controller: 'CurrenciesExchangesCtrl'
        }).state('client.signedin.currencies.myexchanges', {
            url: '^/currencies/myexchanges',
            templateUrl: './currencies/views/myexchanges.html',
            controller: 'CurrenciesMyExchangesCtrl'
        }).state('client.signedin.currencies.mytransfers', {
            url: '^/currencies/mytransfers',
            templateUrl: './currencies/views/mytransfers.html',
            controller: 'CurrenciesMyTransfersCtrl'
        }).state('client.signedin.currencies.myoffers', {
            url: '^/currencies/myoffers',
            templateUrl: './currencies/views/myoffers.html',
            controller: 'CurrenciesMyOffersCtrl'
        }).state('client.signedin.currencies.trade', {
            url: '^/currencies/{currencyId}/trade',
            templateUrl: './currencies/views/trade.html',
            controller: 'CurrencyTradeDeskInputController'
        });

    }]);
