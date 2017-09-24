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

angular.module('macap-viewer', ['baseClient', 'node', 'options']);

angular.module('macap-viewer').constant('macapViewerConfig', {

    'macapUrl':'http://185.103.75.217:8892',
    'macapEndPoint': 'api/v1/get',

});

angular.module('macap-viewer').config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

    $stateProvider.state('client.signedin.macapviewer', {
        url: '^/macapviewer',
        templateUrl: './extensions/macap-viewer/views/main.html',
        abstract: true
    }).state('client.signedin.macapviewer.macap', {
        url: '^/macapviewer/macap',
        templateUrl: './extensions/macap-viewer/views/macap.html',
        controller:'MaCapViewerMainCtrl'
    });

}]);
