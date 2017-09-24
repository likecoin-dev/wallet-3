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

angular.module('options', ['baseClient', 'ui.router', 'ui.bootstrap', 'indexedDB', 'node', 'clientAlert']);

angular.module('options').constant('optionsConfig', {
    'tableOptions': 'options'
});

angular.module('options').constant('DEFAULT_OPTIONS', {
    'DEADLINE': '60',
    'REFRESH_INTERVAL_MILLI_SECONDS': '60000',
    'TX_HEIGHT': 7 * 1440,
    'USER_NODE_URL': 'http://localhost:23457',
    'USE_LOCAL_NODE': 0,
    'AUTO_UPDATE': 1,
    'CONNECTION_MODE':'AUTO',
    'VERSION':'0.5.1' + 'b',
    'RANDOMIZE_NODES': 1,
    'TESTNET': false,
});

angular.module('options')
    .config(['$indexedDBProvider', 'optionsConfig', function ($indexedDBProvider, optionsConfig) {
        $indexedDBProvider
            .connection('clientIndexedDB')
            .upgradeDatabase(2, function (event, db, tx) {
                var objStore = db.createObjectStore(optionsConfig.tableOptions,
                    {keyPath: ['publicKey', 'optionName']});
                objStore.createIndex('value_idx', 'value', {unique: false});
                objStore.createIndex('public_key_idx', 'publicKey', {unique: false});
                objStore.createIndex('option_name_idx', 'optionName', {unique: false});
            });
    }]);

angular.module('options')
    .service('OptionsService',
        ['$indexedDB', 'optionsConfig','SessionStorageService',  'DEFAULT_OPTIONS',
            '$rootScope', 'baseConfig',
            function ($indexedDB, optionsConfig, SessionStorageService, DEFAULT_OPTIONS,
                      $rootScope, baseConfig) {

                this.insertOption = function (publicKey, optionName, value, successCallBack, errorCallBack) {
                    var bookStore = $indexedDB.openStore(optionsConfig.tableOptions, function (store) {
                        store.insert({'publicKey': publicKey, 'optionName': optionName, 'value': value})
                            .then(successCallBack, errorCallBack);
                    });
                };

                this.insertOptions = function (values, successCallBack, errorCallBack) {
                    var bookStore = $indexedDB.openStore(optionsConfig.tableOptions, function (store) {
                        store.insert(values).then(successCallBack, errorCallBack);
                    });
                };

                this.updateOptions = function (values, successCallBack, errorCallBack) {
                    var bookStore = $indexedDB.openStore(optionsConfig.tableOptions, function (store) {
                        store.upsert(values).then(successCallBack, errorCallBack);
                    });
                };

                this.getAllOptions = function (publicKey, successCallBack, errorCallBack) {
                    if (publicKey) {
                        $indexedDB.openStore(optionsConfig.tableOptions, function (options) {
                            var find = options.query();
                            find = find.$eq(publicKey);
                            find = find.$index('public_key_idx');
                            options.eachWhere(find).then(successCallBack, errorCallBack);

                        });
                    }
                };

                this.clearOptions = function (successCallback, errorCallback) {
                    $indexedDB.openStore(optionsConfig.tableOptions, function (options) {
                        options.clear().then(successCallback, errorCallback);
                    });
                };

                this.getContactsCount = function (successCallBack, errorCallBack) {
                    $indexedDB.openStore(addressBookConfig.tableAddressBook, function (store) {
                        store.count().then(function (e) {
                            console.log(e);
                            successCallBack(e);
                        });
                    });
                };

                this.loadOptions = function (publicKey, successCallback, errorCallback) {
                    this.getAllOptions(publicKey, function (options) {
                        var finalOptions = JSON.parse(JSON.stringify(DEFAULT_OPTIONS));
                        for (var i = 0; i < options.length; i++) {
                            var optionObject = options[i];
                            finalOptions[optionObject.optionName] = optionObject.value;
                        }
                        SessionStorageService.saveToSession(baseConfig.SESSION_APP_OPTIONS, finalOptions);
                        successCallback(finalOptions);
                    }, function (e) {
                        errorCallback(e);
                    });
                };

                this.clearContacts = function (successCallback, errorCallback) {
                    $indexedDB.openStore(optionsConfig.tableOptions, function (options) {
                        options.clear().then(successCallback, errorCallback);
                    });
                };

                this.getOption = function (optionName, publicKey) {
                    var options = SessionStorageService.getFromSession(baseConfig.SESSION_APP_OPTIONS);
                    if (options) {
                        if(typeof options[optionName]==='undefined'){
                            return DEFAULT_OPTIONS[optionName];
                        }
                        return options[optionName];
                    }
                    return DEFAULT_OPTIONS[optionName];
                };

            }]);

angular.module('options').service('OptionsConfigureService', ['CommonsService', 'NodeService', 'SessionStorageService',
    'LocalHostService', 'nodeConfig', '$rootScope',

    function (CommonsService, NodeService, SessionStorageService, LocalHostService, nodeConfig, $rootScope) {
        this.setUserPeerNode = function () {

            if ($rootScope.options.CONNECTION_MODE !=='AUTO' && !isNodeSameAsInSession()) {
                LocalHostService.getPeerState($rootScope.options.USER_NODE_URL).then(function (response) {
                    var uri = new URL($rootScope.options.USER_NODE_URL);
                    response._id = uri.hostname;
                    SessionStorageService.saveToSession(nodeConfig.SESSION_LOCAL_NODE, response);
                    SessionStorageService.saveToSession(nodeConfig.SESSION_HAS_LOCAL, true);
                }, function (error) {
                    SessionStorageService.saveToSession(nodeConfig.SESSION_HAS_LOCAL, false);
                });

            }


        };

        function isNodeSameAsInSession() {
            var node = SessionStorageService.getFromSession(nodeConfig.SESSION_LOCAL_NODE);
            if (node) {
                var uri = new URL($rootScope.options.USER_NODE_URL);
                return uri.hostname === node._id;

            }
            return false;
        }

    }]);
