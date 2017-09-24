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

angular.module('messages',
    ['baseClient', 'crypto', 'ui.router', 'ui.bootstrap', 'multiStepForm', 'node','options']);

angular.module('messages').constant('messagesConfig', {
    'messagesEndPoint': 'api'
});
angular.module('messages').config(['RestangularProvider', 'messagesConfig', '$stateProvider', '$urlRouterProvider',
    function (RestangularProvider, messagesConfig, $stateProvider, $urlRouterProvider) {

        RestangularProvider.setRestangularFields({
            options: '_options'
        });

        $stateProvider.state('client.signedin.messages', {
            url: '^/messages',
            templateUrl: './messages/views/main.html',
            abstract:true
        }).state('client.signedin.messages.mymessages', {
            url: '^/messages/mymessages',
            templateUrl: './messages/views/mymessages.html',
            controller: 'MessagesCtrl'
        });
    }]);
