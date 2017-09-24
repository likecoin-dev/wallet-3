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

angular.module('aliases').controller('AliasesMainCtrl',
    ['$scope', 'AliasService', 'amountTQTFilter', 'timestampFilter', 'DTOptionsBuilder', 'DTColumnBuilder',
        '$uibModal', '$compile', 'baseConfig', 'supplyFilter', 'searchTermFilter',
        function ($scope, AliasService, amountTQTFilter, timestampFilter, DTOptionsBuilder, DTColumnBuilder,
                  $uibModal, $compile, baseConfig, supplyFilter, searchTermFilter) {

            $scope.openSetAliasModal = function (name) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'aliases/modals/set-alias-form.html',
                    size: 'lg',
                    controller: 'AliasesFormCtrl',
                    resolve: {
                        params: function () {
                            return {
                                name: name,
                            };
                        }
                    }
                });
            };

            $scope.openSellAliasModal = function (name, aliasURI) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'aliases/modals/sell-alias-form.html',
                    size: 'lg',
                    controller: 'AliasesFormCtrl',
                    resolve: {
                        params: function () {
                            return {
                                name: name,
                                uri: aliasURI
                            };
                        }
                    }
                });
            };

            $scope.openBuyAliasModal = function (name, price) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'aliases/modals/buy-alias-form.html',
                    size: 'lg',
                    controller: 'AliasesFormCtrl',
                    resolve: {
                        params: function () {
                            return {
                                name: name,
                                amount: price,
                            };
                        }
                    }
                });
            };

            $scope.openSearchAliasModal = function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'aliases/modals/search-alias-form.html',
                    size: 'lg',
                    controller: 'AliasesFormCtrl',
                    resolve: {
                        params: function () {
                            return {};
                        }
                    }
                });
            };

            $scope.openDeleteAliasModal = function (aliasName, aliasURI) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'aliases/modals/delete-alias-form.html',
                    size: 'lg',
                    controller: 'AliasesFormCtrl',
                    resolve: {
                        params: function () {
                            return {
                                name: aliasName,
                                uri: aliasURI
                            };
                        }
                    }
                });
            };

            $scope.openTransferAliasModal = function (aliasName, aliasURI) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'aliases/modals/transfer-alias-form.html',
                    size: 'lg',
                    controller: 'AliasesFormCtrl',
                    resolve: {
                        params: function () {
                            return {
                                name: aliasName,
                                uri: aliasURI
                            };
                        }
                    }
                });
            };

            $scope.openCancelAliasModal = function (aliasName, price, aliasURI) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'aliases/modals/cancel-alias-form.html',
                    size: 'lg',
                    controller: 'AliasesFormCtrl',
                    resolve: {
                        params: function () {
                            return {
                                name: aliasName,
                                price: price,
                                uri: aliasURI
                            };
                        }
                    }
                });
            };

            $scope.openEditAliasModal = function (aliasName, aliasURI) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'aliases/modals/edit-alias-form.html',
                    size: 'lg',
                    controller: 'AliasesFormCtrl',
                    resolve: {
                        params: function () {
                            return {
                                name: aliasName,
                                uri: aliasURI
                            };
                        }
                    }
                });
            };


        }]);

angular.module('aliases').controller('MyAliasesCtrl',
    ['$scope', 'AliasService', 'amountTQTFilter', 'timestampFilter', 'DTOptionsBuilder', 'DTColumnBuilder',
        '$uibModal', '$compile', 'baseConfig', 'supplyFilter', 'searchTermFilter', 'CommonsService',
        function ($scope, AliasService, amountTQTFilter, timestampFilter, DTOptionsBuilder, DTColumnBuilder,
                  $uibModal, $compile, baseConfig, supplyFilter, searchTermFilter, CommonsService) {

            $scope.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers')
                .withDOM('frtip')
                .withOption('info', false)
                .withOption('serverSide', false)
                .withDataProp('aliases')
                .withOption('responsive', true)
                .withOption('paging', true)
                .withOption('ordering', false)
                .withOption('processing', false)
                .withOption('bFilter', false).withOption('fnRowCallback',
                    function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                        $compile(nRow)($scope);
                    })
                .withOption('ajax', function (data, callback, settings) {
                    var accountId = CommonsService.getAccountDetailsFromSession('accountId');
                    var endIndex = data.start + data.length - 1;
                    AliasService.getAccountAliases(accountId, data.start, endIndex).then(function (response) {
                        callback({
                            'iTotalRecords': response.aliases.length,
                            'iTotalDisplayRecords': response.aliases.length,
                            'aliases': response.aliases
                        });
                    });
                })
                .withDisplayLength(10).withBootstrap();

            $scope.dtColumns = [

                DTColumnBuilder.newColumn('alias').withTitle('Details').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return '<button class="btn btn-success btn-xs" ng-controller="SearchCtrl"' +
                            ' ' +
                            'ng-click="searchValue(\'' + data + '\')">' +
                            '<i class="fa fa-list-ul" aria-hidden="true" style="width:15px;"></i>' + '</button>';
                    }),

                DTColumnBuilder.newColumn('aliasName').withTitle('Name').notSortable(),
                DTColumnBuilder.newColumn('aliasURI').withTitle('URI').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        var aliasType = data.split(':')[0];
                        if (aliasType === 'acct') {
                            var accountId = data.substring(data.lastIndexOf(':') + 1, data.lastIndexOf('@'));
                            return '<a  ng-controller="AccountMainCtrl"' +
                                ' ' +
                                'ng-click="openSendTokenModal(\'' + accountId + '\')">' + data + '</a>';
                        } else if (aliasType === 'url') {
                            var url = data.substring(data.lastIndexOf(':') + 1, data.lastIndexOf('@'));
                            if (!/^https?:\/\//i.test(url)) {
                                url = 'http://' + url;
                            }
                            return '<a href="' + url + '" target="_blank">' + data + '</a>';
                        } else if (aliasType === 'btc') {
                            var address = data.substring(data.lastIndexOf(':') + 1, data.lastIndexOf('@'));
                            return '<a  ng-controller="BlockrMainController"' +
                                ' ' +
                                'ng-click="openBtcDetailsModal(\'' + address + '\')">' + data + '</a>';
                        }
                        if (data === '') {
                          return 'Not Set';
                        } else {
                        return data;
                        }


                    }),
                DTColumnBuilder.newColumn('aliasName').withTitle('Action').notSortable()
                    .renderWith(function (data, type, row, meta) {

                        var tt_edit = ' popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover=' +
                            ' "Edit"';

                        var tt_transfer = ' popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover=' +
                            ' "Transfer"';

                        var tt_sell = ' popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover=' +
                            ' "Sell"';

                        var tt_delete = ' popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover=' +
                            ' "Delete"';

                        var edit = '<button class="btn btn-default btn-xs"  ' + tt_edit + ' ng-click="openEditAliasModal(\'' + data +
                            '\',\'' + row.aliasURI +
                            '\')" ng-controller="AliasesMainCtrl"> <i class="fa fa-pencil" aria-hidden="true" style="width:15px;height:15px;"></i> </button>';

                        var sell = '<button class="btn btn-default btn-xs"  ' + tt_sell + ' ng-click="openSellAliasModal(\'' + data +
                            '\',\'' + row.aliasURI +
                            '\')" ng-controller="AliasesMainCtrl"> <i class="fa fa-dollar" aria-hidden="true" style="width:15px;"></i> </button>';

                        var transfer = '<button class="btn btn-default btn-xs"  ' + tt_transfer + ' ng-click="openTransferAliasModal(\'' +
                            data +
                            '\',\'' + row.aliasURI +
                            '\')" ng-controller="AliasesMainCtrl"> <i class="fa fa-user" aria-hidden="true" style="width:15px;"></i> </button>';

                        var del = '<button class="btn btn-default btn-xs"  ' + tt_delete + ' ng-click="openDeleteAliasModal(\'' + data +
                            '\',\'' + row.aliasURI +
                            '\')" ng-controller="AliasesMainCtrl"> <i class="fa fa-times" aria-hidden="true" style="width:15px;"></i> </button>';

                        var action = edit + ' ' + transfer + ' ' + sell + ' ' + del;

                        return action;

                    }),

            ];

            $scope.dtInstanceCallback = function (_dtInstance) {
                $scope.dtInstance = _dtInstance;
            };
            $scope.reloadAliases = function () {
                if ($scope.dtInstance) {
                    $scope.dtInstance._renderer.rerender();
                }
            };
        }]);

angular.module('aliases').controller('AliasesOpenOffersCtrl',
    ['$scope', 'AliasService', 'amountTQTFilter', 'timestampFilter', 'DTOptionsBuilder', 'DTColumnBuilder',
        '$uibModal', '$compile', 'baseConfig', 'supplyFilter', 'searchTermFilter', 'CommonsService',
        function ($scope, AliasService, amountTQTFilter, timestampFilter, DTOptionsBuilder, DTColumnBuilder,
                  $uibModal, $compile, baseConfig, supplyFilter, searchTermFilter, CommonsService) {

            $scope.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers')
                .withDOM('frtip')
                .withOption('info', false)
                .withOption('serverSide', true)
                .withDataProp('aliases')
                .withOption('paging', true)
                .withOption('ordering', false)
                .withOption('processing', true)
                .withOption('bFilter', false).withOption('fnRowCallback',
                    function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                        $compile(nRow)($scope);
                    })
                .withOption('ajax', function (data, callback, settings) {
                    var accountId = CommonsService.getAccountDetailsFromSession('accountRs');
                    var endIndex = data.start + data.length - 1;
                    AliasService.getAliasesOpenOffers(accountId, data.start, endIndex).then(function (response) {
                        callback({
                            'iTotalRecords': 1000,
                            'iTotalDisplayRecords': 1000,
                            'aliases': response.aliases
                        });
                    });
                })
                .withDisplayLength(10).withBootstrap();

            $scope.dtColumns = [

                DTColumnBuilder.newColumn('aliasId').withTitle('Details').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return '<button type="button" class="btn btn-success btn-xs" ng-controller="SearchCtrl"' +
                            ' ' +
                            'ng-click="searchValue(\'' + data + '\')">' +
                            '<i class="fa fa-list-ul" aria-hidden="true" style="width:15px;"></i>' + '</button>';
                    }),

                DTColumnBuilder.newColumn('aliasName').withTitle('Name').notSortable(),

                DTColumnBuilder.newColumn('recipientRS').withTitle('Recipient').notSortable()
                    .renderWith(function (data, type, row, meta) {

                        if (row.recipientId === '0') {
                            return 'Public Offer';
                        } else {
                            return searchTermFilter(data);
                        }


                    }),
                DTColumnBuilder.newColumn('priceTQT').withTitle('Price').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return amountTQTFilter(data);
                    }),
                DTColumnBuilder.newColumn('aliasName').withTitle('Action').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        var accountId = CommonsService.getAccountDetailsFromSession('accountRs');


                        var tt_cancel = ' popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover=' +
                            ' "Cancel"';

                        return '<button type="button" class="btn btn-default btn-xs"  ' + tt_cancel + '  ng-controller="AliasesMainCtrl"' +
                            ' ' +
                            'ng-click="openCancelAliasModal(\'' + data +
                            '\',\'' + amountTQTFilter(row.priceTQT) +
                            '\',\'' + row.aliasURI + '\')">' +
                            '<i class="fa fa-times" aria-hidden="true" style="width:15px;"></i>' + '</button>';
                    }),
            ];

            $scope.dtInstanceCallback = function (_dtInstance) {
                $scope.dtInstance = _dtInstance;
            };
            $scope.reloadAliases = function () {
                if ($scope.dtInstance) {
                    $scope.dtInstance._renderer.rerender();
                }
            };
        }]);

angular.module('aliases').controller('AliasesPrivateOffersCtrl',
    ['$scope', 'AliasService', 'amountTQTFilter', 'timestampFilter', 'DTOptionsBuilder', 'DTColumnBuilder',
        '$uibModal', '$compile', 'baseConfig', 'supplyFilter', 'searchTermFilter', 'CommonsService',
        function ($scope, AliasService, amountTQTFilter, timestampFilter, DTOptionsBuilder, DTColumnBuilder,
                  $uibModal, $compile, baseConfig, supplyFilter, searchTermFilter, CommonsService) {

            $scope.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers')
                .withDOM('frtip')
                .withOption('info', false)
                .withOption('serverSide', true)
                .withDataProp('aliases')
                .withOption('paging', true)
                .withOption('ordering', false)
                .withOption('processing', true)
                .withOption('bFilter', false).withOption('fnRowCallback',
                    function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                        $compile(nRow)($scope);
                    })
                .withOption('ajax', function (data, callback, settings) {
                    var accountId = CommonsService.getAccountDetailsFromSession('accountRs');
                    var endIndex = data.start + data.length - 1;
                    AliasService.getAliasesPrivateOffers(accountId, data.start, endIndex).then(function (response) {
                        callback({
                            'iTotalRecords': 1000,
                            'iTotalDisplayRecords': 1000,
                            'aliases': response.aliases
                        });
                    });
                })
                .withDisplayLength(10).withBootstrap();

            $scope.dtColumns = [

                DTColumnBuilder.newColumn('aliasId').withTitle('Details').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return '<button type="button" class="btn btn-success btn-xs" ng-controller="SearchCtrl"' +
                            ' ' +
                            'ng-click="searchValue(\'' + data + '\')">' +
                            '<i class="fa fa-list-ul" aria-hidden="true" style="width:15px;"></i>' + '</button>';
                    }),

                DTColumnBuilder.newColumn('aliasName').withTitle('Name').notSortable(),
                DTColumnBuilder.newColumn('aliasId').withTitle('ID').notSortable(),
                DTColumnBuilder.newColumn('senderRS').withTitle('Sender').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return searchTermFilter(data);
                    }),
                DTColumnBuilder.newColumn('priceTQT').withTitle('Amount').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return amountTQTFilter(data);
                    }),
                DTColumnBuilder.newColumn('aliasName').withTitle('Action').notSortable()
                    .renderWith(function (data, type, row, meta) {

                        var tt_buy = ' popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover=' +
                            ' "Buy"';

                        var buy = '<button class="btn btn-default btn-xs" ' + tt_buy + ' ng-click="openBuyAliasModal(\'' + data +
                            '\',\'' + row.priceTQT +
                            '\')" ng-controller="AliasesMainCtrl"> <i class="fa fa-shopping-cart" aria-hidden="true" style="width:15px;"></i> </button>';

                        return buy;

                    }),

            ];

            $scope.dtInstanceCallback = function (_dtInstance) {
                $scope.dtInstance = _dtInstance;
            };
            $scope.reloadAliases = function () {
                if ($scope.dtInstance) {
                    $scope.dtInstance._renderer.rerender();
                }
            };
        }]);

angular.module('aliases').controller('AliasesPublicOffersCtrl',
    ['$scope', 'AliasService', 'amountTQTFilter', 'timestampFilter', 'DTOptionsBuilder', 'DTColumnBuilder',
        '$uibModal', '$compile', 'baseConfig', 'supplyFilter', 'searchTermFilter', 'CommonsService',
        function ($scope, AliasService, amountTQTFilter, timestampFilter, DTOptionsBuilder, DTColumnBuilder,
                  $uibModal, $compile, baseConfig, supplyFilter, searchTermFilter, CommonsService) {


            $scope.sort_order = 'desc';
            $scope.sort_orderColumn = 'height';

            $scope.sort_price = function () {
                $scope.sort_orderColumn = 'price';
                $scope.reloadAliases();
            };
            $scope.sort_height = function () {
                $scope.sort_orderColumn = 'height';
                $scope.reloadAliases();
            };

            $scope.sort_name = function () {
                $scope.sort_orderColumn = 'name';
                $scope.reloadAliases();
            };

            $scope.sort_toggle = function () {
                if ($scope.sort_order === 'desc') {
                    $scope.sort_order = 'asc';
                } else if ($scope.sort_order === 'asc') {
                    $scope.sort_order = 'desc';
                }
                $scope.reloadAliases();
            };

            $scope.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers')
                .withDOM('frtip')
                .withOption('info', false)
                .withOption('serverSide', true)
                .withDataProp('aliases')
                .withOption('paging', true)
                .withOption('ordering', false)
                .withOption('processing', true)
                .withOption('bFilter', false).withOption('fnRowCallback',
                    function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                        $compile(nRow)($scope);
                    })
                .withOption('ajax', function (data, callback, settings) {
                    var accountId = CommonsService.getAccountDetailsFromSession('accountRs');
                    var endIndex = data.start + data.length - 1;
                    AliasService.getAliasesPublicOffers(
                        accountId,
                        data.start,
                        endIndex,
                        $scope.sort_order,
                        $scope.sort_orderColumn
                      ).then(function (response) {

                        callback({
                            'iTotalRecords': 1000,
                            'iTotalDisplayRecords': 1000,
                            'aliases': response.aliases
                        });
                    });
                })
                .withDisplayLength(10).withBootstrap();

            $scope.dtColumns = [

                DTColumnBuilder.newColumn('aliasId').withTitle('Details').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return '<button type="button" class="btn btn-success btn-xs" ng-controller="SearchCtrl"' +
                            ' ' +
                            'ng-click="searchValue(\'' + data + '\')">' +
                            '<i class="fa fa-list-ul" aria-hidden="true" style="width:15px;"></i>' + '</button>';
                    }),

                DTColumnBuilder.newColumn('aliasName').withTitle('Name').notSortable(),
                DTColumnBuilder.newColumn('aliasId').withTitle('ID').notSortable(),
                DTColumnBuilder.newColumn('senderRS').withTitle('Sender').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return searchTermFilter(data);
                    }),

                DTColumnBuilder.newColumn('priceTQT').withTitle('Price').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return amountTQTFilter(data);
                    }),
                DTColumnBuilder.newColumn('aliasName').withTitle('Action').notSortable()
                    .renderWith(function (data, type, row, meta) {


                        var tt_buy = ' popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover=' +
                            ' "Buy"';

                        var buy = '<button class="btn btn-default btn-xs" ' + tt_buy + ' ng-click="openBuyAliasModal(\'' + data +
                            '\',\'' + row.priceTQT +
                            '\')" ng-controller="AliasesMainCtrl"> <i class="fa fa-shopping-cart" aria-hidden="true" style="width:15px;"></i> </button>';

                        return buy;

                    }),
            ];

            $scope.dtInstanceCallback = function (_dtInstance) {
                $scope.dtInstance = _dtInstance;
            };
            $scope.reloadAliases = function () {
                if ($scope.dtInstance) {
                    $scope.dtInstance._renderer.rerender();
                }
            };
        }]);

angular.module('aliases').controller('AliasesFormCtrl',
    ['$scope', '$uibModalInstance', 'params', function ($scope, $uibModalInstance, params) {

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.$on('close-modal', function () {
            $uibModalInstance.dismiss('cancel');
        });

        var setAliasSteps = [
            {
                templateUrl: 'aliases/modals/set-alias-details.html',
                title: 'Register Alias Details',
                controller: 'SetAliasFormController',
                isolatedScope: true,
                data: params,
            },
            {
                templateUrl: 'aliases/modals/set-alias-confirm.html',
                title: 'Register Alias Confirmation',
                controller: 'SetAliasFormController',
                isolatedScope: true,

            },
        ];

        var sellAliasSteps = [
            {
                templateUrl: 'aliases/modals/sell-alias-details.html',
                title: 'Sell Alias Details',
                controller: 'SellAliasFormController',
                isolatedScope: true,
                data: params,
            },
            {
                templateUrl: 'aliases/modals/sell-alias-confirm.html',
                title: 'Sell Alias Confirmation',
                controller: 'SellAliasFormController',
                isolatedScope: true,

            },
        ];

        var buyAliasSteps = [
            {
                templateUrl: 'aliases/modals/buy-alias-details.html',
                title: 'Buy Alias Details',
                controller: 'BuyAliasFormController',
                isolatedScope: true,
                data: params,
            },
            {
                templateUrl: 'aliases/modals/buy-alias-confirm.html',
                title: 'Buy Alias Confirmation',
                controller: 'BuyAliasFormController',
                isolatedScope: true,

            },
        ];

        var deleteAliasSteps = [
            {
                templateUrl: 'aliases/modals/delete-alias-details.html',
                title: 'Delete Alias Details',
                controller: 'DeleteAliasFormController',
                isolatedScope: true,
                data: params,
            },
            {
                templateUrl: 'aliases/modals/delete-alias-confirm.html',
                title: 'Delete Alias Confirmation',
                controller: 'DeleteAliasFormController',
                isolatedScope: true,

            },
        ];

        var searchAliasesSteps = [
            {
                templateUrl: 'aliases/modals/search-alias-details.html',
                title: 'Search Alias Details',
                controller: 'SearchAliasFormCtrl',
                isolatedScope: true,
                data: params,
            },
            {
                templateUrl: 'aliases/modals/search-alias-confirm.html',
                title: 'Search Alias Results',
                controller: 'SearchAliasFormCtrl',
                isolatedScope: true,
            },
        ];

        var transferAliasSteps = [
            {
                templateUrl: 'aliases/modals/transfer-alias-details.html',
                title: 'Transfer Alias Details',
                controller: 'TransferAliasFormController',
                isolatedScope: true,
                data: params,
            },
            {
                templateUrl: 'aliases/modals/transfer-alias-confirm.html',
                title: 'Transfer Alias Confirmation',
                controller: 'TransferAliasFormController',
                isolatedScope: true,
            },
        ];

        var editAliasSteps = [
            {
                templateUrl: 'aliases/modals/edit-alias-details.html',
                title: 'Edit Alias Details',
                controller: 'EditAliasFormController',
                isolatedScope: true,
                data: params,
            },
            {
                templateUrl: 'aliases/modals/edit-alias-confirm.html',
                title: 'Edit Alias Confirmation',
                controller: 'EditAliasFormController',
                isolatedScope: true,
            },
        ];

        var cancelAliasSteps = [
            {
                templateUrl: 'aliases/modals/cancel-alias-details.html',
                title: 'Cancel Alias Sell Details',
                controller: 'CancelAliasFormController',
                isolatedScope: true,
                data: params,
            },
            {
                templateUrl: 'aliases/modals/cancel-alias-confirm.html',
                title: 'Cancel Alias Sell Confirmation',
                controller: 'CancelAliasFormController',
                isolatedScope: true,

            },
        ];

        $scope.steps = {};

        $scope.steps.setAliasForm = setAliasSteps;
        $scope.steps.sellAliasSteps = sellAliasSteps;
        $scope.steps.buyAliasForm = buyAliasSteps;
        $scope.steps.deleteAliasForm = deleteAliasSteps;
        $scope.steps.searchAliasForm = searchAliasesSteps;
        $scope.steps.transferAliasSteps = transferAliasSteps;
        $scope.steps.editAliasSteps = editAliasSteps;
        $scope.steps.cancelAliasSteps = cancelAliasSteps;

    }]);

angular.module('aliases').controller('EditAliasFormController',
    ['$scope', 'AliasService', 'SessionStorageService', '$state', 'CryptoService', 'loginConfig',
        'AlertService', 'alertConfig', '$validation', '$uibModal', 'multiStepFormScope', 'FeeService', '$rootScope',
        'CommonsService', 'amountToQuantFilter',
        function ($scope, AliasService, SessionStorageService, $state, CryptoService,
                  loginConfig, AlertService, alertConfig, $validation, $uibModal, multiStepFormScope, FeeService,
                  $rootScope, CommonsService, amountToQuantFilter) {


            $scope.editAliasForm = angular.copy(multiStepFormScope.editAliasForm);

            $scope.disableFields = {};


            $scope.formFinalAlias = function () {
                var editAliasForm = multiStepFormScope.editAliasForm;

                var aliasUri = editAliasForm.uri || '';
                var aliasPrefix = editAliasForm.prefix.value;
                var aliasSuffix = '@xin';
                var aliasFinal = aliasPrefix + aliasUri;
                if (aliasPrefix !== '') {
                    aliasFinal = aliasFinal + aliasSuffix;
                }

                if (!aliasUri) {
                    aliasFinal = '';
                }

                return aliasFinal;
            };

            $scope.validBytes = false;

            $scope.initStep1 = function () {
                var data = $scope.$getActiveStep().data;
                $scope.editAliasForm.name = data.name;
                $scope.editAliasForm.uriold = data.uri;

                $scope.prefixes = [
                    {name: 'Account', value: 'acct:'},
                    {name: 'URL', value: 'url:'},
                    {name: 'BTC', value: 'btc:'},
                    // {name:"Torrent", value:"trnt:"},
                    // {name:"Magnet", value:"magnet:"},
                    // {name:"Mail", value:"mailto::"},
                    // {name:'Zeronet', value:'zero:'},
                    // {name:'IPFS', value:'ipfs:'},
                    {name: 'Other', value: ''}

                ];

                $scope.editAliasForm.prefix = $scope.prefixes[0];

            };

            $scope.$on('$destroy', function () {
                multiStepFormScope.editAliasForm = angular.copy($scope.editAliasForm);
            });

            $scope.hasPrivateKeyInSession = function () {
                if (SessionStorageService.getFromSession(loginConfig.SESSION_ACCOUNT_PRIVATE_KEY)) {
                    return true;
                }
                return false;
            };

            $scope.editAlias = function () {
                var editAliasForm = multiStepFormScope.editAliasForm;
                var name = editAliasForm.name;
                var alias = $scope.formFinalAlias();
                var fee = editAliasForm.fee;
                var publicKey = CommonsService.getAccountDetailsFromSession('publicKey');
                var secret = editAliasForm.secretPhrase;
                var secretPhraseHex;
                if (secret) {
                    secretPhraseHex = CryptoService.secretPhraseToPrivateKey(secret);
                } else {
                    secretPhraseHex =
                        SessionStorageService.getFromSession(loginConfig.SESSION_ACCOUNT_PRIVATE_KEY);
                }
                if (!fee) {
                    fee = 1;
                }
                $scope.editAliasPromise=AliasService.setAlias(publicKey, name, alias, fee)
                    .then(function (success) {
                        if (!success.errorCode) {
                            var unsignedBytes = success.unsignedTransactionBytes;
                            var signatureHex = CryptoService.signatureHex(unsignedBytes, secretPhraseHex);
                            $scope.transactionBytes =
                                CryptoService.signTransactionHex(unsignedBytes, signatureHex);

                            $scope.validBytes = true;

                            $scope.tx_fee = success.transactionJSON.feeTQT / 100000000;
                            $scope.tx_amount = success.transactionJSON.amountTQT / 100000000;
                            $scope.tx_total = $scope.tx_fee + $scope.tx_amount;

                        } else {
                            AlertService.addAlert(
                                {
                                    type: 'danger',
                                    msg: 'Sorry, an error occured! Reason: ' + success.errorDescription
                                }, alertConfig.editAliasModalAlert
                            );
                        }
                    }, function (error) {
                        AlertService.addAlert(AlertService.getNoConnectionMessage(error),
                            alertConfig.editAliasModalAlert);
                    });

            };

            $scope.broadcastTransaction = function (transactionBytes) {
                $scope.editAliasPromise=CommonsService.broadcastTransaction(transactionBytes).then(function (success) {
                    $scope.$emit('close-modal');
                    $rootScope.$broadcast('reload-dashboard');
                    if (!success.errorCode) {
                        AlertService.addAlert(
                            {
                                type: 'success',
                                msg: 'Transaction succesfull broadcasted with Id : ' + success.transaction +
                                ''
                            });
                        // $state.go('client.signedin.account.pending');
                    } else {
                        AlertService.addAlert(
                            {
                                type: 'danger',
                                msg: 'Unable to broadcast transaction. Reason: ' + success.errorDescription
                            });
                    }

                }, function (error) {
                    AlertService.addAlert(AlertService.getNoConnectionMessage(error),
                        alertConfig.editAliasModalAlert);
                });
            };

        }]);

angular.module('aliases').controller('CancelAliasFormController',
    ['$scope', 'AliasService', 'SessionStorageService', '$state', 'CryptoService', 'loginConfig',
        'AlertService', 'alertConfig', '$validation', '$uibModal', 'multiStepFormScope', 'FeeService', '$rootScope',
        'CommonsService', 'amountToQuantFilter',
        function ($scope, AliasService, SessionStorageService, $state, CryptoService,
                  loginConfig, AlertService, alertConfig, $validation, $uibModal, multiStepFormScope, FeeService,
                  $rootScope, CommonsService, amountToQuantFilter) {

            $scope.cancelAliasForm = angular.copy(multiStepFormScope.cancelAliasForm);

            $scope.disableFields = {};

            $scope.initStep1 = function () {
                var data = $scope.$getActiveStep().data;
                $scope.cancelAliasForm.name = data.name;
                $scope.cancelAliasForm.price = data.price;
                $scope.cancelAliasForm.aliasURI = data.aliasURI;
            };

            $scope.$on('$destroy', function () {
                multiStepFormScope.cancelAliasForm = angular.copy($scope.cancelAliasForm);
            });

            $scope.hasPrivateKeyInSession = function () {
                if (SessionStorageService.getFromSession(loginConfig.SESSION_ACCOUNT_PRIVATE_KEY)) {
                    return true;
                }
                return false;
            };

            $scope.cancelAlias = function () {

                var cancelAliasForm = multiStepFormScope.cancelAliasForm;
                var name = cancelAliasForm.name;
                var recipientRS = cancelAliasForm.recipientRS || '';
                var price = cancelAliasForm.price;
                var fee = cancelAliasForm.fee;
                var publicKey = CommonsService.getAccountDetailsFromSession('publicKey');
                var secret = cancelAliasForm.secretPhrase;
                var accountRS = CommonsService.getAccountDetailsFromSession('accountRs');
                var secretPhraseHex;
                if (secret) {
                    secretPhraseHex = CryptoService.secretPhraseToPrivateKey(secret);
                } else {
                    secretPhraseHex =
                        SessionStorageService.getFromSession(loginConfig.SESSION_ACCOUNT_PRIVATE_KEY);
                }
                if (!fee) {
                    fee = 1;
                }
                $scope.cancelAliasPromise = AliasService.cancelAlias(publicKey, name, accountRS, fee)
                    .then(function (success) {
                        if (!success.errorCode) {
                            var unsignedBytes = success.unsignedTransactionBytes;
                            var signatureHex = CryptoService.signatureHex(unsignedBytes, secretPhraseHex);
                            $scope.transactionBytes =
                                CryptoService.signTransactionHex(unsignedBytes, signatureHex);
                            $scope.validBytes = true;

                            $scope.tx_fee = success.transactionJSON.feeTQT / 100000000;
                            $scope.tx_amount = success.transactionJSON.amountTQT / 100000000;
                            $scope.tx_total = $scope.tx_fee + $scope.tx_amount;


                        } else {
                            AlertService.addAlert(
                                {
                                    type: 'danger',
                                    msg: 'Sorry, an error occured! Reason: ' + success.errorDescription
                                }, alertConfig.cancelAliasModalAlert
                            );
                        }
                    }, function (error) {
                        AlertService.addAlert(AlertService.getNoConnectionMessage(error),
                            alertConfig.cancelAliasModalAlert);
                    });

            };

            $scope.broadcastTransaction = function (transactionBytes) {
                $scope.cancelAliasPromise = CommonsService.broadcastTransaction(transactionBytes)
                    .then(function (success) {
                        $scope.$emit('close-modal');
                        $rootScope.$broadcast('reload-dashboard');
                        if (!success.errorCode) {
                            AlertService.addAlert(
                                {
                                    type: 'success',
                                    msg: 'Transaction succesfull broadcasted with Id : ' + success.transaction +
                                    ''
                                });
                            // $state.go('client.signedin.account.pending');
                        } else {
                            AlertService.addAlert(
                                {
                                    type: 'danger',
                                    msg: 'Unable to broadcast transaction. Reason: ' + success.errorDescription
                                });
                        }

                    }, function (error) {
                        AlertService.addAlert(AlertService.getNoConnectionMessage(error),
                            alertConfig.cancelAliasModalAlert);
                    });
            };

        }]);
