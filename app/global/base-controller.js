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

angular.module('baseClient').controller('BaseCtrl',
        ['$scope', '$uibModal', 'CommonsService', '$injector', function ($scope, $uibModal, CommonsService, $injector) {

            $scope.openAddressBookModal = function (accountRS, tag) {
                var modalInstance = $uibModal.open({
                    animation: false,
                    templateUrl: 'addressbook/views/addressbook.html',
                    controller: 'AddressBookCtrl',
                    resolve: {
                        params: function () {
                            return {
                                'accountRS': accountRS,
                                'tag': tag
                            };
                        }
                    }
                });
            };

            $scope.openOptionsModal = function () {
                var modalInstance = $uibModal.open({
                    animation: false,
                    templateUrl: 'options/views/options.html',
                    controller: 'OptionsCtrl',
                    resolve: {
                        params: function () {
                            return {};
                        }
                    },
                });
            };

            $scope.searchAliases = function (searchTerm, form,value) {
                var AliasService = $injector.get('AliasService');
                return AliasService.searchAlias(searchTerm).then(function (success) {
                    var aliases = success.aliases ||[];
                    for (var i = 0; i < aliases.length; i++) {
                        var alias = aliases[i];
                        if (alias.aliasName.toUpperCase() === searchTerm.toUpperCase()) {
                            var aliasURI = alias.aliasURI;
                            var aliasType = aliasURI.split(':');
                            if (aliasType[0] === 'acct') {
                                var accountRS = aliasType[1].split('@')[0];
                                form[value]= accountRS;
                                break;

                            }
                        }
                    }
                }, function (error) {

                });
            };

        }]);

angular.module('baseClient').controller('GlobalErrorModalCtrl', ['$scope', '$uibModalInstance', '$q', 'params',
    function ($scope, $uibModalInstance, $q, params) {
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.showResult = function () {
            $scope.message = params.message;
        };
    }]);

angular.module('baseClient').run(['$rootScope','$uibModal',function ($rootScope,$uibModal) {

    $rootScope.openErrorModal=function (errorMessage) {
        $uibModal.open({
            animation: true,
            templateUrl: 'global/views/error-modal.html',
            size: 'sm',
            controller: 'GlobalErrorModalCtrl',
            resolve: {
                params: function () {
                    return {
                        message: errorMessage
                    };
                }
            }
        });
    };

}]);

angular.module('baseClient').controller('GlobalNavbar', ['$rootScope', '$q', '$scope', 'OptionsService',
    function ($rootScope, $q, $scope, OptionsService) {

      $scope.setTestNet = function () {

        var testnet = OptionsService.getOption('TESTNET') || false;

        return testnet;

      };

    }]);
