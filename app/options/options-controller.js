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

angular.module('options').controller('OptionsCtrl',
    ['$scope', 'OptionsService', '$uibModalInstance', '$compile', 'params', '$rootScope', 'DEFAULT_OPTIONS',
        'CommonsService', 'NodeService', 'LocalHostService', '$validation', 'AlertService', 'alertConfig',
        'SessionStorageService', 'baseConfig', '$state',
        function ($scope, OptionsService, $uibModalInstance, $compile, params, $rootScope, DEFAULT_OPTIONS,
                  CommonsService, NodeService, LocalHostService, $validation, AlertService, alertConfig,
                  SessionStorageService, baseConfig, $state) {

            $scope.$watchCollection('optionsForm', function (optionsForm) {
                //$validation.validate(optionsForm);
            });

            $scope.loadOptions = function () {
                var publicKey = CommonsService.getAccountDetailsFromSession('publicKey');
                OptionsService.loadOptions(publicKey, function (optionsObject) {
                    copyJson(optionsObject, $scope.optionsForm);
                    $rootScope.options = optionsObject;
                    SessionStorageService.saveToSession(baseConfig.SESSION_APP_OPTIONS, optionsObject);
                }, function (e) {
                    console.log(e);
                    $rootScope.options = DEFAULT_OPTIONS;
                    SessionStorageService.saveToSession(baseConfig.SESSION_APP_OPTIONS, DEFAULT_OPTIONS);
                });
            };

            function cloneJson(json) {
                return JSON.parse(JSON.stringify(json));
            }

            function copyJson(fromJson, toJson) {
                fromJson = fromJson || {};
                toJson = toJson || {};
                for (var key in fromJson) {
                    if (fromJson.hasOwnProperty(key)) {
                        if (!isNaN(fromJson[key])) {
                            fromJson[key] = parseInt(fromJson[key]);
                        }
                        toJson[key] = fromJson[key];
                    }
                }
                return toJson;
            }

            function getOptionsJsonObject(options) {
                var finalJson = {};
                for (var key in DEFAULT_OPTIONS) {
                    if (DEFAULT_OPTIONS.hasOwnProperty(key)) {
                        finalJson[key] = options[key];
                    }
                }
                return finalJson;
            }

            $scope.getOption = function (key) {
                return OptionsService.getOption(key);
            };

            $scope.validateForm = function () {
                var connectionMode = $scope.optionsForm.CONNECTION_MODE;
                if (isRequired) {
                    return $scope.isValidUrl();
                } else {
                    return Promise.reject('Form is not valid');
                }

            };

            $scope.validateAndUpdate = function (form) {
                var url = form.USER_NODE_URL;
                var connectionMode = form.CONNECTION_MODE;

                if (connectionMode === 'AUTO') {
                    $scope.updateOptions(form);
                }
                else if (url) {
                    LocalHostService.getPeerState(url).then(function (success) {
                        $scope.updateOptions(form);
                    }, function (error) {
                        console.log('error');
                        AlertService.addAlert(
                            {
                                type: 'danger',
                                msg: 'Sorry, an error occured! Reason: This node URL is not valid'
                            }, alertConfig.optionModalAlert
                        );
                    });
                }
            };

            $scope.updateOptions = function (form) {
                var publicKey = CommonsService.getAccountDetailsFromSession('publicKey');
                var options = getOptionsJsonObject($scope.optionsForm);
                var finalOptions = [];
                for (var key in options) {
                    if (options.hasOwnProperty(key)) {
                        var option = {'publicKey': publicKey, 'optionName': key, 'value': options[key]};
                        finalOptions.push(option);
                    }
                }
                OptionsService.updateOptions(finalOptions, function (success) {
                    $rootScope.$broadcast('reload-options');
                    var publicKey = CommonsService.getAccountDetailsFromSession('publicKey');
                    OptionsService.loadOptions(publicKey, function (optionsObject) {
                        $rootScope.options = optionsObject;
                        SessionStorageService.saveToSession(baseConfig.SESSION_APP_OPTIONS, optionsObject);

                        $scope.cancel();
                        $state.reload();

                    }, function (e) {
                        console.log(e);
                        $rootScope.options = DEFAULT_OPTIONS;
                        SessionStorageService.saveToSession(baseConfig.SESSION_APP_OPTIONS, DEFAULT_OPTIONS);
                        $scope.cancel();
                        $state.reload();
                    });

                }, function (e) {
                    $scope.cancel();
                });

            };

            $scope.validateForm = function (form) {
                $validation.validate(form);
            };

            $scope.CONNECTION_MODES = ['AUTO', 'HTTPS', 'FOUNDATION', 'MANUAL', 'LOCAL_HOST', 'TESTNET'];

            $scope.updateConnectionMode = function (form) {

                var connectionMode = form.CONNECTION_MODE;

                if (connectionMode === 'LOCAL_HOST') {
                  form.USER_NODE_URL = 'http://localhost:23457';
                  form.RANDOMIZE_NODES = 0;
                  form.TESTNET = false;
                }
                else if (connectionMode === 'MANUAL') {
                  form.USER_NODE_URL = 'http://localhost:23457';
                  form.RANDOMIZE_NODES = 0;
                  form.TESTNET = false;
                }
                else if (connectionMode === 'HTTPS') {
                  form.USER_NODE_URL = 'https://ssl.infinity-economics.org';
                  form.RANDOMIZE_NODES = 0;
                  form.TESTNET = false;
                }
                else if (connectionMode === 'AUTO') {
                  form.RANDOMIZE_NODES = 1;
                  form.TESTNET = false;
                }
                else if (connectionMode === 'FOUNDATION') {
                  form.USER_NODE_URL = 'http://46.244.20.41:23457';
                  form.RANDOMIZE_NODES = 0;
                  form.TESTNET = false;
                }
                else if (connectionMode === 'TESTNET') {
                  form.USER_NODE_URL = 'http://185.35.138.140:9876';
                  form.RANDOMIZE_NODES = 0;
                  form.TESTNET = true;
                }

                $scope.validateForm(form);
            };

            $scope.isValidUrl = function () {
                var url = $scope.optionsForm.USER_NODE_URL;
                if (url) {
                    return LocalHostService.isValidUrl(url);
                } else {
                    return false;
                }
            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };

        }]);
