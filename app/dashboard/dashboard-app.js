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

angular.module('dashboard',
    ['baseClient', 'crypto', 'ui.router', 'ui.bootstrap', 'node', 'options']);

angular.module('dashboard').constant('dashboardConfig', {
    'apiEndPoint': 'api'
});

angular.module('dashboard')
    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    }]);

angular.module('dashboard').filter('informativeCount', ['$sce', function ($sce) {
    return function (array, maxLength) {
        if (array) {
            if (array.length === maxLength) {
                return '' + maxLength + '+';
            }
            return array.length;
        }
        return 0;
    };
}]);

angular.module('dashboard').filter('arrayCount', ['$sce', function ($sce) {
    return function (array) {
        if (array) {
            return array.length;
        }
        return 0;
    };
}]);

angular.module('dashboard').filter('balanceStyler', ['$sce', function ($sce) {
    return function (numeralString) {
        var decimal = '0';
        var fraction = '00';
        if (numeralString) {
            var splitString = numeralString.split('.');
            decimal = splitString[0];
            fraction = splitString[1];
        }
        return decimal + '<small>.' + fraction + '<small> XIN </small></small>';
    };
}]);
