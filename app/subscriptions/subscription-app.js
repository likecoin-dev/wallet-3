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

angular.module('subscription', ['baseClient', 'crypto', 'ui.router', 'ui.bootstrap', 'multiStepForm', 'node','options']);

angular.module('subscription').constant('subscriptionConfig', {
    'subscriptionEndPoint':'api'
});

angular.module('subscription').config(
  ['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

    $stateProvider.state('client.signedin.subscription', {
        url: '^/subscriptions',
        templateUrl: './subscriptions/views/main.html',
        abstract: true
    }).state('client.signedin.subscription.mysubscriptions', {
        url: '^/subscriptions/mysubscriptions',
        templateUrl: './subscriptions/views/mysubscriptions.html',
        controller: 'MySubscriptionsCtrl'
    });

}]);
