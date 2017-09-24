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

angular.module('exchanges').service('BlockrService', ['BlockrRestangular', 'exchangesConfig',
    function (BlockrRestangular, exchangesConfig) {

        this.getAddressBalance = function (address) {
            return BlockrRestangular.all(exchangesConfig.BLOCKR_ADDRESS_END_POINT).one('balance').one(address).get();
        };

        this.getAccountTransactions = function (address) {
            return BlockrRestangular.all(exchangesConfig.BLOCKR_ADDRESS_END_POINT).one('txs').one(address).get();
        };
    }]);
