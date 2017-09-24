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

angular.module('account').service('FaucetService',
    ['nodeConfig', 'SessionStorageService', 'NodeService', 'baseConfig', 'accountConfig', 'Restangular', 'loginConfig',
        'CryptoService', 'TransactionService', '$rootScope', 'OptionsService',
        function (nodeConfig, SessionStorageService, NodeService, baseConfig, accountConfig, Restangular, loginConfig,
                  CryptoService, TransactionService, $rootScope, OptionsService) {

            var FAUCET_URL = 'http://185.103.75.217:8890/api/v1';

            this.welcomeFaucetCall = function (email, publicKey, accountRs, ip) {
                Restangular.setBaseUrl(FAUCET_URL);
                ip = ip || '127.0.0.5';
                var params = {
                    'ip': ip,
                    'email': email,
                    'publickey': publicKey,
                    'account': accountRs,
                };
                return Restangular.all('faucet').customPOST(params, '', '');
            };


        }]);
