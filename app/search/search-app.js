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

var searchApp = angular.module('search',
    ['baseClient', 'restangular', 'datatables', 'datatables.bootstrap', 'ui.bootstrap', 'ui.router', 'ja.qr']);

angular.module('search').constant('searchConfig', {
    'searchEndPoint': 'api',
    'searchAccountString': 'XIN',
    'searchPeerUrl': 'http://185.103.75.217:8888/api/nodes',
    'searchPeerEndPoint': 'api/nodes',
});

angular.module('search').config(['RestangularProvider', 'searchConfig', '$stateProvider', '$urlRouterProvider',
    function (RestangularProvider, searchConfig, $stateProvider, $urlRouterProvider) {
        RestangularProvider.setRestangularFields({
            options: '_options'
        });

    }]);

angular.module('search').filter('gateways', ['$sce', function ($sce) {
    return function (toolTip, val) {
        switch (toolTip) {
            case 'TenderMint':

                if (val) {
                    return '<span tooltip-placement="top" uib-tooltip="' + toolTip + '">   <span class="label label-default" >TM</span>  </span>';
                } else {
                    return '<span tooltip-placement="top" uib-tooltip="' + toolTip + '">  <span class="label label-default" >TM</span>   </span>';
                }
                break;

            case 'ZeroNet':

                if (val) {
                    return '<span tooltip-placement="top" uib-tooltip="' + toolTip + '">  <span class="label label-default" >ZN</span>  </span>';
                } else {
                    return '<span tooltip-placement="top" uib-tooltip="' + toolTip + '">  <span class="label label-default" >ZN</span>  </span>';
                }
                break;
            case 'IPFS':

                if (val) {
                    return '<span tooltip-placement="top" uib-tooltip="' + toolTip + '">  <span class="label label-warning" >IPFS</span>  </span>';
                } else {
                    return '<span tooltip-placement="top" uib-tooltip="' + toolTip + '">  <span class="label label-default" >IPFS</span>  </span>';
                }
                break;

            default:
                return '<small> <span class="glyphicon glyphicon-remove" style="color:red"></span> </small>';
        }
    };
}]);

angular.module('search').filter('proxies', ['$sce', function ($sce) {
    return function (toolTip, val) {

        switch (toolTip) {
            case 'BTC':

                if (val) {
                    return '<span tooltip-placement="top" uib-tooltip="' + toolTip + '">   <span class="label label-warning" >BTC</span>  </span>';
                } else {
                    return '<span tooltip-placement="top" uib-tooltip="' + toolTip + '">  <span class="label label-default" >BTC</span>   </span>';
                }
                break;

            case 'ETH':

                if (val) {
                    return '<span tooltip-placement="top" uib-tooltip="' + toolTip + '">  <span class="label label-default" >ETH</span>  </span>';
                } else {
                    return '<span tooltip-placement="top" uib-tooltip="' + toolTip + '">  <span class="label label-default" >ETH</span>  </span>';
                }
                break;
            case 'LTC':

                if (val) {
                    return '<span tooltip-placement="top" uib-tooltip="' + toolTip + '">  <span class="label label-default" >LTC</span>  </span>';
                } else {
                    return '<span tooltip-placement="top" uib-tooltip="' + toolTip + '">  <span class="label label-default" >LTC</span>  </span>';
                }
                break;

            case 'XRP':

                if (val) {
                    return '<span tooltip-placement="top" uib-tooltip="' + toolTip + '">  <span class="label label-default" >XRP</span>  </span>';
                } else {
                    return '<span tooltip-placement="top" uib-tooltip="' + toolTip + '">  <span class="label label-default" >XRP</span>  </span>';
                }
                break;

            case 'MKT':

                if (val) {
                    return '<span tooltip-placement="top" uib-tooltip="' + toolTip + '">  <span class="label label-default" >MKT</span>  </span>';
                } else {
                    return '<span tooltip-placement="top" uib-tooltip="' + toolTip + '">  <span class="label label-default" >MKT</span>  </span>';
                }
                break;

            default:
                return '<small> <span class="glyphicon glyphicon-remove" style="color:red"></span> </small>';
        }


    };
}]);

angular.module('search').filter('storage', ['$sce', function ($sce) {
    return function (toolTip, val) {

        switch (toolTip) {
            case 'PostgreSQL':

                if (val) {
                    return '<span tooltip-placement="top" uib-tooltip="' + toolTip + '">   <span class="label label-default" >PS</span>  </span>';
                } else {
                    return '<span tooltip-placement="top" uib-tooltip="' + toolTip + '">  <span class="label label-default" >PS</span>   </span>';
                }
                break;

            case 'RethinkDB':

                if (val) {
                    return '<span tooltip-placement="top" uib-tooltip="' + toolTip + '">  <span class="label label-default" >RT</span>  </span>';
                } else {
                    return '<span tooltip-placement="top" uib-tooltip="' + toolTip + '">  <span class="label label-default" >RT</span>  </span>';
                }
                break;
            case 'MySQL':

                if (val) {
                    return '<span tooltip-placement="top" uib-tooltip="' + toolTip + '">  <span class="label label-default" >MY</span>  </span>';
                } else {
                    return '<span tooltip-placement="top" uib-tooltip="' + toolTip + '">  <span class="label label-default" >MY</span>  </span>';
                }
                break;

            case 'Mongodb':

                if (val) {
                    return '<span tooltip-placement="top" uib-tooltip="' + toolTip + '">  <span class="label label-warning" >MO</span>  </span>';
                } else {
                    return '<span tooltip-placement="top" uib-tooltip="' + toolTip + '">  <span class="label label-default" >MO</span>  </span>';
                }
                break;


            default:
                return '<small> <span class="glyphicon glyphicon-remove" style="color:red"></span> </small>';
        }


    };
}]);
