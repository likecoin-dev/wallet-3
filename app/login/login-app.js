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

angular.module('login',
    ['baseClient', 'crypto', 'ui.router', 'ui.bootstrap', 'multiStepForm', 'node', 'addressbook', 'options']);

angular.module('login').config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

    $stateProvider.state('client.welcome', {
        url: '^/welcome',
        templateUrl: './login/views/welcome.html',
        controller: 'LoginCtrl'
    }).state('client.login', {
        url: '^/login',
        templateUrl: './login/views/login.html',
        controller: 'LoginCtrl'
    }).state('client.signedin.dashboard', {
        url: '^/dashboard',
        templateUrl: './commons/signedin.html',
        controller: 'LoginCtrl'
    }).state('client.logout', {
        url: '^/logout',
        templateUrl: './login/views/welcome.html',
        controller: 'LoginCtrl',
        params: {
            sessionCleared: false,
            localCleared: false
        }
    });

}]);
