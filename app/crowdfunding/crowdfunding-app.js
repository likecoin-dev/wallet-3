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

angular.module('crowdfunding', ['baseClient', 'crypto', 'ui.router', 'ui.bootstrap', 'multiStepForm', 'node','options']);

angular.module('crowdfunding').constant('crowdfundingConfig', {
    'crowdfundingEndPoint':'api'
});

angular.module('crowdfunding').config(
  ['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

    $stateProvider.state('client.signedin.crowdfunding', {
        url: '^/crowdfunding',
        templateUrl: './crowdfunding/views/main.html',
        abstract:true
    }).state('client.signedin.crowdfunding.mycampaigns', {
        url: '^/crowdfunding/mycampaigns',
        templateUrl: './crowdfunding/views/mycampaigns.html',
        controller: 'MyCampaignsCtrl'
    }).state('client.signedin.crowdfunding.allcampaigns', {
        url: '^/crowdfunding/allcampaigns',
        templateUrl: './crowdfunding/views/allcampaigns.html',
        controller: 'AllCampaignsCtrl'
    });

}]);
