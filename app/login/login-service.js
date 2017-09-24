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

angular.module('login').service('LoginService', ['CryptoService', 'loginConfig', 'SessionStorageService','$rootScope',
    function (CryptoService, loginConfig, SessionStorageService,$rootScope) {

        this.calculateAccountDetailsFromSecret = function (secret, storeToSession) {

            SessionStorageService.deleteFromSession(loginConfig.SESSION_ACCOUNT_DETAILS_KEY);
            SessionStorageService.deleteFromSession(loginConfig.SESSION_ACCOUNT_PRIVATE_KEY);

            var accountDetails = CryptoService.getAccountDetails(secret);

            if (storeToSession) {
                SessionStorageService.saveToSession(loginConfig.SESSION_ACCOUNT_DETAILS_KEY, accountDetails);
            }

            $rootScope.$broadcast('reload-options');

            return accountDetails;
        };

        this.calculatePrivateKeyFromSecret = function (secret, storeToSession) {

            SessionStorageService.deleteFromSession(loginConfig.SESSION_ACCOUNT_PRIVATE_KEY);

            var privateKey = CryptoService.secretPhraseToPrivateKey(secret);

            if (storeToSession) {
                SessionStorageService.saveToSession(loginConfig.SESSION_ACCOUNT_PRIVATE_KEY, privateKey);
            }

            return privateKey;
        };

        this.generatePassPhrase = function () {
            return CryptoService.generatePassPhrase();
        };

    }]);
