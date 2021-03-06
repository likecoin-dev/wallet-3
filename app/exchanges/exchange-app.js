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

angular.module('exchanges', ['baseClient']);

angular.module('exchanges').constant('exchangesConfig', {
    'BLOCKR_URL_END_POINT': 'http://btc.blockr.io/api/v1/',
    'BLOCKR_ADDRESS_END_POINT': 'address',
});

angular.module('exchanges')
    .factory('BlockrRestangular', ['Restangular', 'exchangesConfig', function (Restangular, exchangesConfig) {
        return Restangular.withConfig(function (RestangularConfigurer) {
            RestangularConfigurer.setBaseUrl(exchangesConfig.BLOCKR_URL_END_POINT);
        });
    }]);
