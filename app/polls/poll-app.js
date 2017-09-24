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

angular.module('poll',
    ['baseClient', 'crypto', 'ui.router', 'ui.bootstrap', 'multiStepForm', 'node', 'assets', 'currencies','options']);

angular.module('poll').constant('pollConfig', {
    'pollEndPoint': 'api'
});

angular.module('poll').config(['RestangularProvider', 'pollConfig', '$stateProvider', '$urlRouterProvider',
    function (RestangularProvider, pollConfig, $stateProvider, $urlRouterProvider) {

        RestangularProvider.setRestangularFields({
            options: '_options'
        });

        $stateProvider.state('client.signedin.polls', {
            url: '^/polls',
            templateUrl: './polls/views/main.html',
            abstract: true,
        }).state('client.signedin.polls.polls', {
            url: '^/polls/polls',
            templateUrl: './polls/views/polls.html',
            controller: 'PollsCtrl',
        }).state('client.signedin.polls.mypolls', {
            url: '^/polls/polls',
            templateUrl: './polls/views/mypolls.html',
            controller: 'MyPollsCtrl',
        });

    }]);
