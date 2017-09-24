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

angular.module('addressbook').controller('AddressBookCtrl',
    ['$scope', 'AddressService', 'DTOptionsBuilder', 'DTColumnBuilder', 'searchTermFilter', '$uibModalInstance',
        '$compile', 'params',
        function ($scope, AddressService, DTOptionsBuilder, DTColumnBuilder, searchTermFilter, $uibModalInstance,
                  $compile, params) {

            var handler = $scope.$on('reload-address-book', reloadData);

            $scope.$on('$destroy', handler);

            $scope.contact = {};
            $scope.contact.account = params.accountRS;
            $scope.contact.tag = params.tag;

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };


            function rowCallback(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                // Unbind first in order to avoid any duplicate handler (see
                // https://github.com/l-lin/angular-datatables/issues/87)
                $('td', nRow).unbind('click');
                $('td', nRow).bind('click', function () {
                    $scope.$apply(function () {
                        if (params.closeOnClick) {
                            $uibModalInstance.close(aData);
                        }
                    });
                });
                return nRow;
            }

            $scope.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers')
                .withDOM('frtip')
                .withOption('serverSide', false)
                .withDataProp('accounts')
                .withOption('processing', true)
                .withOption('info', false)
                .withOption('paging', true)
                .withOption('ordering', false)
                .withOption('processing', true)
                .withOption('bFilter', false)
                .withOption('rowCallback', rowCallback)
                .withOption('fnRowCallback',
                    function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                        $compile(nRow)($scope);
                        rowCallback(nRow, aData, iDisplayIndex, iDisplayIndexFull);
                    })
                .withOption('ajax', function (data, callback, settings) {

                    var publicKey = AddressService.getAccountDetailsFromSession('publicKey');
                    AddressService.getAllContacts(publicKey, function (success) {
                        if (!success) {
                            success = [];
                        }
                        var accounts = {'accounts': success};
                        callback({
                            'iTotalRecords': accounts.accounts.length,
                            'iTotalDisplayRecords': accounts.accounts.length,
                            'accounts': accounts.accounts || []
                        });
                    }, function (error) {
                    });

                })
                .withDisplayLength(5).withBootstrap();

            $scope.dtColumns = [
                DTColumnBuilder.newColumn('accountRS').withTitle('Account').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return searchTermFilter(data);
                    }),
                DTColumnBuilder.newColumn('tags').withTitle('Tag').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return data;
                    }),
                DTColumnBuilder.newColumn('accountRS').withTitle('Action').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return '<a href ng-click="deleteContact(\'' + data +
                            '\')" ng-controller="AddressBookEditCtrl"> <button ng-disabled="" class="btn btn-danger btn-xs"> <i class="fa fa-close" aria-hidden="true"></i> </button> </a>';
                    })
            ];

            $scope.dtColumnsLite = [
                DTColumnBuilder.newColumn('accountRS').withTitle('Account').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return searchTermFilter(data);
                    }),
                DTColumnBuilder.newColumn('tags').withTitle('Tag').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return data;
                    }),

                DTColumnBuilder.newColumn('accountRS').withTitle('Actions').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return '<button ng-disabled="" class="btn btn-success btn-xs" autofocus> <i class="fa fa-plus" aria-hidden="true"></i> </button>';
                    })

            ];

            function reloadData() {
                $scope.dtInstance._renderer.rerender();
            }

            $scope.dtInstanceCallback = function (_dtInstance) {
                $scope.dtInstance = _dtInstance;
            };

        }]);


angular.module('addressbook').controller('AddressBookEditCtrl',
    ['$scope', 'AddressService', '$rootScope',
        function ($scope, AddressService, $rootScope) {

            $scope.createNewContact = function (accountRs, tag) {
                var publicKey = AddressService.getAccountDetailsFromSession('publicKey');
                AddressService.createAddress(publicKey, accountRs, tag, function () {
                    $rootScope.$broadcast('reload-address-book');
                }, function (e) {
                    console.log('error ' + e);
                });
            };

            $scope.deleteContact = function (accountRS) {
                var publicKey = AddressService.getAccountDetailsFromSession('publicKey');
                AddressService.deleteContact(publicKey, accountRS, function () {
                    $rootScope.$broadcast('reload-address-book');
                }, function () {
                    console.log('error');
                });
            };

        }]);
