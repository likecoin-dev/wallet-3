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


angular.module('addressbook', ['baseClient', 'ui.router', 'ui.bootstrap', 'indexedDB']);

angular.module('addressbook').constant('addressBookConfig', {
    'tableAddressBook': 'addressBook'
});

angular.module('addressbook')
    .config(['$indexedDBProvider', 'addressBookConfig', function ($indexedDBProvider, addressBookConfig) {
        $indexedDBProvider
            .connection('clientIndexedDB')
            .upgradeDatabase(1, function (event, db, tx) {
                var objStore = db.createObjectStore(addressBookConfig.tableAddressBook,
                    {keyPath: ['publicKey', 'accountRS']});
                objStore.createIndex('tag_idx', 'tags', {unique: false});
                objStore.createIndex('public_key_idx', 'publicKey', {unique: false});
                objStore.createIndex('account_rs_idx', 'accountRS', {unique: false});
            });
    }]);


angular.module('addressbook')
    .service('AddressService', ['$indexedDB', 'addressBookConfig', 'SessionStorageService', 'loginConfig',
        function ($indexedDB, addressBookConfig, SessionStorageService, loginConfig) {

            this.createAddress = function (publicKey, accountRS, tag, successCallBack, errorCallBack) {
                var bookStore = $indexedDB.openStore(addressBookConfig.tableAddressBook, function (store) {
                    store.insert({'publicKey': publicKey, 'accountRS': accountRS, 'tags': tag})
                        .then(successCallBack, errorCallBack);
                });
            };

            this.getAllContacts = function (publicKey, successCallBack, errorCallBack) {
                $indexedDB.openStore(addressBookConfig.tableAddressBook, function (contacts) {

                    var find = contacts.query();
                    find = find.$eq(publicKey);
                    find = find.$index('public_key_idx');
                    contacts.eachWhere(find).then(successCallBack, errorCallBack);

                });
            };

            this.clearContacts = function (successCallback, errorCallback) {
                $indexedDB.openStore(addressBookConfig.tableAddressBook, function (contacts) {
                    contacts.clear().then(successCallback, errorCallback);
                });
            };

            this.getContactsCount = function (successCallBack, errorCallBack) {
                $indexedDB.openStore(addressBookConfig.tableAddressBook, function (store) {
                    store.count().then(function (e) {
                        successCallBack(e);
                    });
                });
            };

            this.getAccountDetailsFromSession = function (keyName) {
                var accountDetails = SessionStorageService.getFromSession(loginConfig.SESSION_ACCOUNT_DETAILS_KEY);
                if (keyName) {
                    return accountDetails[keyName];
                }
                return accountDetails;
            };

            this.deleteContact = function (publicKey, accountRS, successCallback, errorCallback) {
                $indexedDB.openStore(addressBookConfig.tableAddressBook, function (contacts) {
                    var object = [publicKey, accountRS];
                    contacts.delete(object).then(successCallback, errorCallback);
                });
            };

        }]);
