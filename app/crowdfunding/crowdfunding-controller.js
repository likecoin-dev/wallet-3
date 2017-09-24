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

angular.module('crowdfunding').controller('CrowdfundingMainCtrl',
    ['$scope', 'CrowdfundingService', 'amountTQTFilter', 'timestampFilter', 'DTOptionsBuilder', 'DTColumnBuilder',
        '$uibModal', '$compile', 'baseConfig', 'supplyFilter', 'searchTermFilter',
        function ($scope, CrowdfundingService, amountTQTFilter, timestampFilter, DTOptionsBuilder, DTColumnBuilder,
                  $uibModal, $compile, baseConfig, supplyFilter, searchTermFilter) {

          $scope.openCreateCampaignModal = function () {

              var modalInstance = $uibModal.open({
                  animation: true,
                  templateUrl: 'crowdfunding/modals/create-campaign-form.html',
                  size: 'lg',
                  controller: 'CampaignFormCtrl',
                  resolve: {
                      params: function () {
                          return {};
                      }
                  }
              });
          };

          $scope.openReserveCampaignModal = function (currency, decimals, minReservePerUnitTQT, code, reserveSupply) {

              var modalInstance = $uibModal.open({
                  animation: true,
                  templateUrl: 'crowdfunding/modals/reserve-campaign-form.html',
                  size: 'lg',
                  controller: 'CampaignFormCtrl',
                  resolve: {
                      params: function () {
                          return {
                            currency : currency,
                            decimals : decimals,
                            minReservePerUnitTQT : minReservePerUnitTQT,
                            code : code,
                            reserveSupply : reserveSupply

                          };
                      }
                  }
              });
          };

          $scope.openFoundersCampaignModal = function (currency) {

              var modalInstance = $uibModal.open({
                  animation: true,
                  templateUrl: 'crowdfunding/modals/founders-campaign-details.html',
                  size: 'lg',
                  controller: 'FoundersCampaignsCtrl',
                  resolve: {
                      params: function () {
                          return {
                            currency : currency
                          };
                      }
                  }
              });
          };

}]);

angular.module('crowdfunding').controller('CampaignFormCtrl',
    ['$scope', '$uibModalInstance', 'params', function ($scope, $uibModalInstance, params) {

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.$on('close-modal', function () {
            $uibModalInstance.dismiss('cancel');
        });

        var createCampaignSteps = [
            {
                templateUrl: 'crowdfunding/modals/create-campaign-details.html',
                title: 'Create Campaign Details 1',
                controller: 'CreateCampaignsCtrl',
                isolatedScope: true,
                data: params,
            },
            {
                templateUrl: 'crowdfunding/modals/create-campaign-details-2.html',
                title: 'Create Campaign Details 2',
                controller: 'CreateCampaignsCtrl',
                isolatedScope: true,
                data: params,
            },
            {
                templateUrl: 'crowdfunding/modals/create-campaign-confirm.html',
                title: 'Create Campaign Confirmation',
                controller: 'CreateCampaignsCtrl',
                isolatedScope: true,
            },
        ];

        var reserveCampaignSteps = [
            {
                templateUrl: 'crowdfunding/modals/reserve-campaign-details.html',
                title: 'Reserve Campaign Details',
                controller: 'ReserveCampaignsCtrl',
                isolatedScope: true,
                data: params,
            },
            {
                templateUrl: 'crowdfunding/modals/reserve-campaign-confirm.html',
                title: 'Reserve Campaign Confirmation',
                controller: 'ReserveCampaignsCtrl',
                isolatedScope: true,
            },
        ];

        $scope.steps = {};

        $scope.steps.createCampaignSteps = createCampaignSteps;
        $scope.steps.reserveCampaignSteps = reserveCampaignSteps;


    }]);

angular.module('crowdfunding').controller('AllCampaignsCtrl',
    ['$scope', 'CrowdfundingService', 'amountTQTFilter', 'timestampFilter', 'DTOptionsBuilder', 'DTColumnBuilder',
        '$uibModal', '$compile', 'baseConfig', 'supplyFilter', 'searchTermFilter', 'CommonsService', 'SessionStorageService',
        'pollDaysFilter',
        function ($scope, CrowdfundingService, amountTQTFilter, timestampFilter, DTOptionsBuilder, DTColumnBuilder,
                  $uibModal, $compile, baseConfig, supplyFilter, searchTermFilter, CommonsService, SessionStorageService,
                  pollDaysFilter) {

                    $scope.dtAllCampaignsOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers')
                        .withDOM('frtip')
                        .withOption('info', false)
                        .withOption('ordering', false)
                        .withOption('serverSide', true)
                        .withDataProp('currencies')
                        .withOption('processing', true)
                        .withOption('bFilter', false)
                        .withOption('fnRowCallback',
                            function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                                $compile(nRow)($scope);
                            })
                        .withOption('ajax', function (data, callback, settings) {
                            var endIndex = data.start + data.length - 1;
                            CrowdfundingService.getAllCampaigns(data.start, endIndex).then(function (response) {

                                callback({
                                    'iTotalRecords': 1000,
                                    'iTotalDisplayRecords': 1000,
                                    'currencies': response.currencies
                                });
                            });
                        })
                        .withDisplayLength(10).withBootstrap();

                    $scope.dtAllCampaignsColumns = [

                        DTColumnBuilder.newColumn('currency').withTitle('Details').notSortable()
                            .renderWith(function (data, type, row, meta) {
                                return '<button type="button" class="btn btn-success btn-xs" ng-controller="SearchCtrl"' +
                                    ' ng-click="searchValue(\'' + data + '\')">' +
                                    '<i class="fa fa-list-ul" aria-hidden="true" style="width:15px;"></i>' + '</button>';

                            }),

                        DTColumnBuilder.newColumn('code').withTitle('Ticker').notSortable()
                            .renderWith(function (data, type, row, meta) {
                                return '<a ng-click="openCurrencyDetailsModal(\'' + row.code +
                                    '\')" ng-controller="CurrenciesMainCtrl"> ' + data + '</a>';
                            }),

                        DTColumnBuilder.newColumn('issuanceHeight').withTitle('Blocks').notSortable()
                            .renderWith(function (data, type, row, meta) {

                                var creationHeight = row.creationHeight;
                                var issuanceHeight = row.issuanceHeight;
                                var currentHeight = SessionStorageService.getFromSession(baseConfig.SESSION_CURRENT_BLOCK);
                                var diffHeight = issuanceHeight - currentHeight;
                                var days = 0;

                                if ( currentHeight && currentHeight <  data ) {
                                  days =(parseInt(data) - currentHeight) / 1440;
                                } else {
                                  days = 0;
                                }

                                if(days < 0){
                                  days = 0;
                                }

                                if(diffHeight < 0){
                                  diffHeight = 0;
                                }

                                return diffHeight;

                            }),

                        DTColumnBuilder.newColumn('issuanceHeight').withTitle('Days').notSortable()
                            .renderWith(function (data, type, row, meta) {

                                var creationHeight = row.creationHeight;
                                var issuanceHeight = row.issuanceHeight;
                                var currentHeight = SessionStorageService.getFromSession(baseConfig.SESSION_CURRENT_BLOCK);
                                var diffHeight = issuanceHeight - currentHeight;
                                var days = 0;

                                if ( currentHeight && currentHeight <  data ) {
                                  days =(parseInt(data) - currentHeight) / 1440;
                                } else {
                                  days = 0;
                                }

                                if(days < 0){
                                  days = 0;
                                }

                                if(diffHeight < 0){
                                  diffHeight = 0;
                                }

                                return pollDaysFilter( days.toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}));

                            }),



                        DTColumnBuilder.newColumn('reserveSupply').withTitle('Supply').notSortable()
                            .renderWith(function (data, type, row, meta) {
                                return supplyFilter(data, row.decimals);
                            }),

                        DTColumnBuilder.newColumn('decimals').withTitle('Status').notSortable()
                            .renderWith(function (data, type, row, meta) {

                              var color = 'danger';
                              var percentage = parseInt( row.currentReservePerUnitTQT * 100 / ( row.minReservePerUnitTQT ) );

                              if (percentage > 25 && percentage <= 50) {
                                color = 'danger';
                              } else if (percentage > 50 && percentage <= 75) {
                                color = 'warning';
                              } else if (percentage > 75) {
                                color = 'success';
                              }

                              var p = '<uib-progressbar class="progress-striped active" value="' + percentage + '" type="' + color + '" style="height:20px;margin-bottom:0px;background-color: #aaa;">' + percentage + '%</uib-progressbar>';

                              return p;
                            }),

                        DTColumnBuilder.newColumn('currentReservePerUnitTQT').withTitle('Raised').notSortable()
                            .renderWith(function (data, type, row, meta) {
                              var t_amount = ( row.reserveSupply  * data );

                              return amountTQTFilter(t_amount);
                            }),

                        DTColumnBuilder.newColumn('reserveSupply').withTitle('Goal').notSortable()
                            .renderWith(function (data, type, row, meta) {

                              var t_amount = ( data * row.minReservePerUnitTQT );

                              return amountTQTFilter(t_amount);
                            }),

                        DTColumnBuilder.newColumn('currency').withTitle('Action').notSortable()
                            .renderWith(function (data, type, row, meta) {

                              var reserve_tag = false;
                              var founders_tag = false;
                              var trade_tag = false;

                              var creationHeight = row.creationHeight;
                              var issuanceHeight = row.issuanceHeight;
                              var currentHeight = SessionStorageService.getFromSession(baseConfig.SESSION_CURRENT_BLOCK);
                              var diffHeight = issuanceHeight - currentHeight;

                              if (diffHeight > 0) {
                                  trade_tag = true;
                              }

                              if (diffHeight <= 0) {
                                  reserve_tag = true;
                              }

                              var tt_desk = ' popover-placement="left" popover-trigger="\'mouseenter\'" uib-popover=' +
                                  ' "TradeDesk"';

                              var tt_reserve = ' popover-placement="left" popover-trigger="\'mouseenter\'" uib-popover=' +
                                  ' "Reserve Units"';

                              var tt_founders = ' popover-placement="left" popover-trigger="\'mouseenter\'" uib-popover=' +
                                  ' "Reserve Founders"';

                              var trade_desk = '<button type="button" class="btn btn-default btn-xs"  ' + tt_desk + ' ng-controller="CurrenciesMainCtrl"' +
                                  'ng-disabled="' + trade_tag + '"' + ' ng-click="openTradeDesk(\'' + data +
                                  '\',\'' + row.decimals + '\')">' +
                                  ' <i class="fa fa-bar-chart" aria-hidden="true" style="width:15px;"></i> ' + '</button>';

                              var reserve_founders = '<button type="button" class="btn btn-default btn-xs"  ' + tt_founders + ' ng-controller="CrowdfundingMainCtrl"' +
                                  'ng-disabled="' + founders_tag + '"' + ' ng-click="openFoundersCampaignModal(\'' + data + '\')">' +
                                  ' <i class="fa fa-user" aria-hidden="true" style="width:15px;"></i> ' + '</button>';

                              var reserve_modal = '<button type="button" class="btn btn-default btn-xs"  ' + tt_reserve + ' ng-controller="CrowdfundingMainCtrl"' +
                                  'ng-disabled="' + reserve_tag + '"' + ' ng-click="openReserveCampaignModal(\'' + data +
                                  '\',\'' + row.decimals + '\',\'' + row.minReservePerUnitTQT + '\',\'' + row.code + '\',\'' + row.reserveSupply + '\')">' +
                                  ' <i class="fa fa-bus" aria-hidden="true" style="width:15px;"></i> ' + '</button>';

                              return trade_desk + ' ' + reserve_founders + ' ' + reserve_modal;

                            })

                    ];

                    $scope.dtAllCampaignsInstanceCallback = function (_dtInstance) {
                        $scope.dtInstance = _dtInstance;
                    };
                    $scope.reloadAllCampaigns = function () {
                        if ($scope.dtInstance) {
                            $scope.dtInstance._renderer.rerender();
                        }
                    };

}]);

angular.module('crowdfunding').controller('MyCampaignsCtrl',
    ['$scope', 'CrowdfundingService', 'amountTQTFilter', 'timestampFilter', 'DTOptionsBuilder', 'DTColumnBuilder',
        '$uibModal', '$compile', 'baseConfig', 'supplyFilter', 'searchTermFilter', 'CommonsService', 'SessionStorageService',
        'pollDaysFilter', 'AccountService',
        function ($scope, CrowdfundingService, amountTQTFilter, timestampFilter, DTOptionsBuilder, DTColumnBuilder,
                  $uibModal, $compile, baseConfig, supplyFilter, searchTermFilter, CommonsService, SessionStorageService,
                  pollDaysFilter, AccountService) {

                    $scope.dtMyCampaignsOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers')
                        .withDOM('frtip')
                        .withOption('info', false)
                        .withOption('ordering', false)
                        .withOption('serverSide', true)
                        .withDataProp('currencies')
                        .withOption('processing', true)
                        .withOption('bFilter', false)
                        .withOption('fnRowCallback',
                            function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                                $compile(nRow)($scope);
                            })
                        .withOption('ajax', function (data, callback, settings) {
                            var endIndex = data.start + data.length - 1;

                            var account = AccountService.getAccountDetailsFromSession('accountId');
                            CrowdfundingService.getAllCampaigns(data.start, endIndex, account).then(function (response) {
                                if (!response.currencies) { response.currencies = {}; }
                                callback({
                                    'iTotalRecords': 1000,
                                    'iTotalDisplayRecords': 1000,
                                    'currencies': response.currencies
                                });
                            });
                        })
                        .withDisplayLength(10).withBootstrap();

                    $scope.dtMyCampaignsColumns = [

                        DTColumnBuilder.newColumn('currency').withTitle('Details').notSortable()
                            .renderWith(function (data, type, row, meta) {
                                return '<button type="button" class="btn btn-success btn-xs" ng-controller="SearchCtrl"' +
                                    ' ng-click="searchValue(\'' + data + '\')">' +
                                    '<i class="fa fa-list-ul" aria-hidden="true" style="width:15px;"></i>' + '</button>';

                            }),

                        DTColumnBuilder.newColumn('code').withTitle('Ticker').notSortable()
                            .renderWith(function (data, type, row, meta) {
                                return '<a ng-click="openCurrencyDetailsModal(\'' + row.code +
                                    '\')" ng-controller="CurrenciesMainCtrl"> ' + data + '</a>';
                            }),

                        DTColumnBuilder.newColumn('issuanceHeight').withTitle('Blocks').notSortable()
                            .renderWith(function (data, type, row, meta) {

                                var creationHeight = row.creationHeight;
                                var issuanceHeight = row.issuanceHeight;
                                var currentHeight = SessionStorageService.getFromSession(baseConfig.SESSION_CURRENT_BLOCK);
                                var diffHeight = issuanceHeight - currentHeight;
                                var days = 0;

                                if ( currentHeight && currentHeight <  data ) {
                                  days =(parseInt(data) - currentHeight) / 1440;
                                } else {
                                  days = 0;
                                }

                                if(days < 0){
                                  days = 0;
                                }

                                if(diffHeight < 0){
                                  diffHeight = 0;
                                }

                                return diffHeight;

                            }),

                        DTColumnBuilder.newColumn('issuanceHeight').withTitle('Days').notSortable()
                            .renderWith(function (data, type, row, meta) {

                                var creationHeight = row.creationHeight;
                                var issuanceHeight = row.issuanceHeight;
                                var currentHeight = SessionStorageService.getFromSession(baseConfig.SESSION_CURRENT_BLOCK);
                                var diffHeight = issuanceHeight - currentHeight;
                                var days = 0;

                                if ( currentHeight && currentHeight <  data ) {
                                  days =(parseInt(data) - currentHeight) / 1440;
                                } else {
                                  days = 0;
                                }

                                if(days < 0){
                                  days = 0;
                                }

                                if(diffHeight < 0){
                                  diffHeight = 0;
                                }

                                return pollDaysFilter( days.toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}));

                            }),

                        DTColumnBuilder.newColumn('reserveSupply').withTitle('Supply').notSortable()
                            .renderWith(function (data, type, row, meta) {
                                return supplyFilter(data, row.decimals);
                            }),

                        DTColumnBuilder.newColumn('decimals').withTitle('Status').notSortable()
                            .renderWith(function (data, type, row, meta) {

                              var color = 'danger';
                              var percentage = parseInt( row.currentReservePerUnitTQT * 100 / ( row.minReservePerUnitTQT ) );

                              if (percentage > 25 && percentage <= 50) {
                                color = 'danger';
                              } else if (percentage > 50 && percentage <= 75) {
                                color = 'warning';
                              } else if (percentage > 75) {
                                color = 'success';
                              }

                              var p = '<uib-progressbar class="progress-striped active" value="' + percentage + '" type="' + color + '" style="height:20px;margin-bottom:0px;background-color: #aaa;">' + percentage + '%</uib-progressbar>';

                              return p;
                            }),

                        DTColumnBuilder.newColumn('currentReservePerUnitTQT').withTitle('Raised').notSortable()
                            .renderWith(function (data, type, row, meta) {
                              var t_amount = ( row.reserveSupply  * data );

                              return amountTQTFilter(t_amount);
                            }),

                        DTColumnBuilder.newColumn('reserveSupply').withTitle('Goal').notSortable()
                            .renderWith(function (data, type, row, meta) {

                              var t_amount = ( data * row.minReservePerUnitTQT );

                              return amountTQTFilter(t_amount);
                            }),

                        DTColumnBuilder.newColumn('currency').withTitle('Action').notSortable()
                            .renderWith(function (data, type, row, meta) {

                              var reserve_tag = false;
                              var founders_tag = false;
                              var trade_tag = false;

                              var creationHeight = row.creationHeight;
                              var issuanceHeight = row.issuanceHeight;
                              var currentHeight = SessionStorageService.getFromSession(baseConfig.SESSION_CURRENT_BLOCK);
                              var diffHeight = issuanceHeight - currentHeight;

                              if (diffHeight > 0) {
                                  trade_tag = true;
                              }

                              if (diffHeight <= 0) {
                                  reserve_tag = true;
                              }

                              var tt_desk = ' popover-placement="left" popover-trigger="\'mouseenter\'" uib-popover=' +
                                  ' "TradeDesk"';

                              var tt_reserve = ' popover-placement="left" popover-trigger="\'mouseenter\'" uib-popover=' +
                                  ' "Reserve Units"';

                              var tt_founders = ' popover-placement="left" popover-trigger="\'mouseenter\'" uib-popover=' +
                                  ' "Reserve Founders"';

                              var trade_desk = '<button type="button" class="btn btn-default btn-xs"  ' + tt_desk + ' ng-controller="CurrenciesMainCtrl"' +
                                  'ng-disabled="' + trade_tag + '"' + ' ng-click="openTradeDesk(\'' + data +
                                  '\',\'' + row.decimals + '\')">' +
                                  ' <i class="fa fa-bar-chart" aria-hidden="true" style="width:15px;"></i> ' + '</button>';

                              var reserve_founders = '<button type="button" class="btn btn-default btn-xs"  ' + tt_founders + ' ng-controller="CrowdfundingMainCtrl"' +
                                  'ng-disabled="' + founders_tag + '"' + ' ng-click="openFoundersCampaignModal(\'' + data + '\')">' +
                                  ' <i class="fa fa-user" aria-hidden="true" style="width:15px;"></i> ' + '</button>';


                              var reserve_modal = '<button type="button" class="btn btn-default btn-xs"  ' + tt_reserve + ' ng-controller="CrowdfundingMainCtrl"' +
                                  'ng-disabled="' + reserve_tag + '"' + ' ng-click="openReserveCampaignModal(\'' + data +
                                  '\',\'' + row.decimals + '\',\'' + row.minReservePerUnitTQT + '\',\'' + row.code + '\',\'' + row.reserveSupply + '\')">' +
                                  ' <i class="fa fa-bus" aria-hidden="true" style="width:15px;"></i> ' + '</button>';

                              return trade_desk + ' ' + reserve_founders + ' ' + reserve_modal;

                            })

                    ];

                    $scope.dtMyCampaignsInstanceCallback = function (_dtInstance) {
                        $scope.dtInstance = _dtInstance;
                    };
                    $scope.reloadMyCampaigns = function () {
                        if ($scope.dtInstance) {
                            $scope.dtInstance._renderer.rerender();
                        }
                    };


}]);

angular.module('crowdfunding').controller('CreateCampaignsCtrl',
    ['$scope', 'CrowdfundingService', 'SessionStorageService', '$state', 'CryptoService', 'loginConfig',
        'AlertService', 'alertConfig', '$validation', '$uibModal', 'multiStepFormScope', '$rootScope',
        'CommonsService', 'CurrenciesService',
        function ($scope, CrowdfundingService, SessionStorageService, $state, CryptoService,
                  loginConfig, AlertService, alertConfig, $validation, $uibModal, multiStepFormScope,
                  $rootScope, CommonsService, CurrenciesService) {


            $scope.createCampaignForm1 = angular.copy(multiStepFormScope.createCampaignForm1);
            $scope.createCampaignForm2 = angular.copy(multiStepFormScope.createCampaignForm2);

            $scope.$watchGroup(['createCampaignForm2.reserveSupply', 'createCampaignForm2.minReservePerUnitTQT'], function () {

                if ($scope.createCampaignForm2) {
                    $scope.createCampaignForm2.maxSupply = parseInt($scope.createCampaignForm2.reserveSupply);
                    $scope.createCampaignForm2.totalAmount = parseInt($scope.createCampaignForm2.reserveSupply) * $scope.createCampaignForm2.minReservePerUnitTQT;
                }

            });

            $scope.issuanceHeight = 1440;
            $scope.day = 1440;
            $scope.hmax = 43200;
            $scope.days = 1;

            $scope.increment = function () {
                if ($scope.issuanceHeight >= $scope.hmax) {
                    $scope.issuanceHeight = $scope.hmax;
                    return;
                } else {
                    $scope.issuanceHeight = $scope.issuanceHeight + $scope.day;
                }

                $scope.createCampaignForm2.issuanceHeight = $scope.issuanceHeight;
                $scope.days = parseInt($scope.issuanceHeight / $scope.day);
            };

            $scope.decrement = function () {
                if ($scope.issuanceHeight <= $scope.day) {
                    $scope.issuanceHeight = $scope.day;
                    return;
                } else {
                    $scope.issuanceHeight = $scope.issuanceHeight - $scope.day;
                }

                $scope.createCampaignForm2.issuanceHeight = $scope.issuanceHeight;
                $scope.days = parseInt($scope.issuanceHeight / $scope.day);
            };

            $scope.max = function () {
                $scope.issuanceHeight = $scope.hmax;
                $scope.createCampaignForm2.issuanceHeight = $scope.hmax;

                $scope.days = parseInt($scope.issuanceHeight / $scope.day);

            };

            $scope.min = function () {
                $scope.issuanceHeight = $scope.day;
                $scope.createCampaignForm2.issuanceHeight = $scope.day;
                $scope.days = parseInt($scope.issuanceHeight / $scope.day);
            };

            $scope.getBlockChainStatus = function () {
                CurrenciesService.getBlockChainStatus().then(function (success) {
                    $scope.createCampaignForm2.currentHeight = success.numberOfBlocks;
                });
            };

            $scope.$on('$destroy', function () {
                multiStepFormScope.createCampaignForm1 = angular.copy($scope.createCampaignForm1);
                multiStepFormScope.createCampaignForm2 = angular.copy($scope.createCampaignForm2);
            });

            $scope.hasPrivateKeyInSession = function () {
                if (SessionStorageService.getFromSession(loginConfig.SESSION_ACCOUNT_PRIVATE_KEY)) {
                    return true;
                }
                return false;
            };

            $scope.createCampaign = function () {

                var createCampaignForm1 = multiStepFormScope.createCampaignForm1;
                var createCampaignForm2 = multiStepFormScope.createCampaignForm2;

                var name = createCampaignForm1.name;
                var code = createCampaignForm1.code.toUpperCase();
                var desc = createCampaignForm1.desc;

                var decimals = 0;
                var initialSupply = parseInt(createCampaignForm2.initialSupply) * Math.pow(10, decimals);
                var issuanceHeight = parseInt(createCampaignForm2.issuanceHeight) +  parseInt(createCampaignForm2.currentHeight);
                var minReservePerUnitTQT = (createCampaignForm2.minReservePerUnitTQT) * 100000000;
                var reserveSupply = parseInt(createCampaignForm2.reserveSupply) * Math.pow(10, decimals);
                var maxSupply = reserveSupply;
                var type = 5;

                $scope.minReservePerUnitTotal = (maxSupply * minReservePerUnitTQT) / 100000000;

                var fee = 1;

                if (!fee) {
                    fee = 1;
                }

                var publicKey = CommonsService.getAccountDetailsFromSession('publicKey');
                var secret = createCampaignForm2.secretPhrase;
                var secretPhraseHex;
                if (secret) {
                    secretPhraseHex = CryptoService.secretPhraseToPrivateKey(secret);
                } else {
                    secretPhraseHex =
                        SessionStorageService.getFromSession(loginConfig.SESSION_ACCOUNT_PRIVATE_KEY);
                }

                $scope.createCampaignPromise = CrowdfundingService.createCampaign(
                  publicKey,
                  name,
                  code,
                  desc,
                  type,
                  initialSupply,
                  reserveSupply,
                  maxSupply,
                  decimals,
                  fee,
                  minReservePerUnitTQT,
                  issuanceHeight
                  ).then(function (success) {

                      if (!success.errorCode) {
                          var unsignedBytes = success.unsignedTransactionBytes;
                          var signatureHex = CryptoService.signatureHex(unsignedBytes, secretPhraseHex);
                          $scope.transactionBytes = CryptoService.signTransactionHex(unsignedBytes, signatureHex);
                          $scope.validBytes = true;

                          $scope.tx_fee = success.transactionJSON.feeTQT / 100000000;
                          $scope.tx_amount = success.transactionJSON.amountTQT / 100000000;
                          $scope.tx_total = $scope.tx_fee + $scope.tx_amount;

                      } else {
                          AlertService.addAlert(
                              {
                                  type: 'danger',
                                  msg: 'Sorry, an error occured! Reason: ' + success.errorDescription
                              }, alertConfig.createCampaignAlert
                          );
                      }

                    }, function (error) {
                        AlertService.addAlert(AlertService.getNoConnectionMessage(error),
                            alertConfig.createCampaignAlert);
                    });

            };

            $scope.broadcastTransaction = function (transactionBytes) {
                $scope.createCampaignPromise = CommonsService.broadcastTransaction(transactionBytes)
                    .then(function (success) {
                        $scope.$emit('close-modal');
                        $rootScope.$broadcast('reload-dashboard');
                        if (!success.errorCode) {
                            AlertService.addAlert(
                                {
                                    type: 'success',
                                    msg: 'Transaction succesfull broadcasted with Id : ' +
                                    success.transaction +
                                    ''
                                });
                        } else {
                            AlertService.addAlert(
                                {
                                    type: 'danger',
                                    msg: 'Unable to broadcast transaction. Reason: ' + success.errorDescription
                                });
                        }

                    }, function (error) {
                        AlertService.addAlert(AlertService.getNoConnectionMessage(error),
                            alertConfig.createCampaignAlert);
                    });
            };


}]);

angular.module('crowdfunding').controller('ReserveCampaignsCtrl',
  ['$scope', 'CrowdfundingService', 'SessionStorageService', '$state', 'CryptoService', 'loginConfig',
    'AlertService', 'alertConfig', '$validation', '$uibModal', 'multiStepFormScope', '$rootScope',
    'CommonsService', 'CurrenciesService', 'amountTQTFilter',
    function ($scope, CrowdfundingService, SessionStorageService, $state, CryptoService,
              loginConfig, AlertService, alertConfig, $validation, $uibModal, multiStepFormScope,
              $rootScope, CommonsService, CurrenciesService, amountTQTFilter) {

                $scope.form = $scope.$getActiveStep().data;

                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };

                $scope.$on('$destroy', function () {
                    multiStepFormScope.reserveCampaignForm = angular.copy($scope.reserveCampaignForm);
                });

                $scope.reserveCampaignForm = angular.copy(multiStepFormScope.reserveCampaignForm);

                $scope.initStep1 = function () {
                    var data = $scope.$getActiveStep().data || {};
                    if (data.currency) {

                      $scope.reserveCampaignForm.currency = data.currency;
                      $scope.reserveCampaignForm.decimals = data.decimals;
                      $scope.reserveCampaignForm.minReservePerUnitTQT = data.minReservePerUnitTQT;
                      $scope.reserveCampaignForm.code = data.code;
                      $scope.reserveCampaignForm.reserveSupply = data.reserveSupply;

                      $scope.reserveCampaignForm.goal   = amountTQTFilter( data.reserveSupply * data.minReservePerUnitTQT )  ;
                      $scope.reserveCampaignForm.raised = amountTQTFilter( data.reserveSupply * data.minReservePerUnitTQT ) ;

                    }
                };

                $scope.$watchCollection('reserveCampaignForm.amountTotal', function () {

                  $scope.reserveCampaignForm.amountUnit = parseFloat( $scope.reserveCampaignForm.amountTotal /$scope.reserveCampaignForm.reserveSupply );

                });

                $scope.reserveCampaign = function () {

                    var form = multiStepFormScope.reserveCampaignForm;

                    var currency = form.currency;
                    var decimals = form.decimals;
                    var amountPerUnitTQT = parseInt( form.amountUnit * 100000000);
                    var reserveSupply = form.reserveSupply * Math.pow(10, form.decimals);

                    var fee = 1;

                    if (!fee) {
                        fee = 1;
                    }

                    var publicKey = CommonsService.getAccountDetailsFromSession('publicKey');
                    var secret = form.secretPhrase;
                    var secretPhraseHex;
                    if (secret) {
                        secretPhraseHex = CryptoService.secretPhraseToPrivateKey(secret);
                    } else {
                        secretPhraseHex =
                            SessionStorageService.getFromSession(loginConfig.SESSION_ACCOUNT_PRIVATE_KEY);
                    }

                    $scope.reserveCampaignPromise = CrowdfundingService.setCampaignReserve(
                      currency,
                      amountPerUnitTQT,
                      publicKey
                      ).then(function (success) {

                          if (!success.errorCode) {
                              var unsignedBytes = success.unsignedTransactionBytes;
                              var signatureHex = CryptoService.signatureHex(unsignedBytes, secretPhraseHex);
                              $scope.transactionBytes = CryptoService.signTransactionHex(unsignedBytes, signatureHex);
                              $scope.validBytes = true;

                              $scope.tx_fee = success.transactionJSON.feeTQT / 100000000;
                              $scope.tx_amount = success.transactionJSON.amountTQT / 100000000;
                              $scope.tx_total = $scope.tx_fee + $scope.tx_amount;

                          } else {
                              AlertService.addAlert(
                                  {
                                      type: 'danger',
                                      msg: 'Sorry, an error occured! Reason: ' + success.errorDescription
                                  }, alertConfig.reserveCampaignAlert
                              );
                          }

                        }, function (error) {
                            AlertService.addAlert(AlertService.getNoConnectionMessage(error),
                                alertConfig.reserveCampaignAlert);
                        });

                };

                $scope.broadcastTransaction = function (transactionBytes) {
                    $scope.createCampaignPromise = CommonsService.broadcastTransaction(transactionBytes)
                        .then(function (success) {
                            $scope.$emit('close-modal');
                            $rootScope.$broadcast('reload-dashboard');
                            if (!success.errorCode) {
                                AlertService.addAlert(
                                    {
                                        type: 'success',
                                        msg: 'Transaction succesfull broadcasted with Id : ' +
                                        success.transaction +
                                        ''
                                    });
                            } else {
                                AlertService.addAlert(
                                    {
                                        type: 'danger',
                                        msg: 'Unable to broadcast transaction. Reason: ' + success.errorDescription
                                    });
                            }

                        }, function (error) {
                            AlertService.addAlert(AlertService.getNoConnectionMessage(error),
                                alertConfig.reserveCampaignAlert);
                        });
                };

}]);

angular.module('crowdfunding').controller('FoundersCampaignsCtrl',
  ['$scope', 'CrowdfundingService', 'SessionStorageService', '$state', 'CryptoService', 'loginConfig',
    'AlertService', 'alertConfig', '$validation', '$uibModal', '$rootScope',
    'CommonsService', 'CurrenciesService', 'amountTQTFilter', '$uibModalInstance',
    'DTOptionsBuilder', 'DTColumnBuilder', 'params', '$compile', 'searchTermFilter',
    function ($scope, CrowdfundingService, SessionStorageService, $state, CryptoService,
              loginConfig, AlertService, alertConfig, $validation, $uibModal,
              $rootScope, CommonsService, CurrenciesService, amountTQTFilter, $uibModalInstance,
              DTOptionsBuilder, DTColumnBuilder, params, $compile, searchTermFilter ) {

                var currency = params.currency;

                $scope.dtFoundersCampaignsOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers')
                    .withDOM('frtip')
                    .withOption('info', false)
                    .withOption('ordering', false)
                    .withOption('serverSide', true)
                    .withDataProp('data')
                    .withOption('processing', true)
                    .withOption('bFilter', false)
                    .withOption('fnRowCallback',
                        function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                            $compile(nRow)($scope);
                        })
                    .withOption('ajax', function (data, callback, settings) {
                        var endIndex = data.start + data.length - 1;
                        CrowdfundingService.getCampaignFounders( currency, data.start, endIndex).then(function (response) {

                            callback({
                                'iTotalRecords': 1000,
                                'iTotalDisplayRecords': 1000,
                                'data': response.founders
                            });
                        });
                    })
                    .withDisplayLength(10).withBootstrap();

                    $scope.dtFoundersCampaignsColumns = [

                        DTColumnBuilder.newColumn('currency').withTitle('Details').notSortable()
                            .renderWith(function (data, type, row, meta) {
                                return searchTermFilter(data);
                            }),

                        DTColumnBuilder.newColumn('accountRS').withTitle('Account').notSortable()
                            .renderWith(function (data, type, row, meta) {
                                return searchTermFilter(data);
                            }),

                        DTColumnBuilder.newColumn('amountPerUnitTQT').withTitle('Amount per Unit').notSortable()
                            .renderWith(function (data, type, row, meta) {
                                return amountTQTFilter(data);
                            }),

                    ];

                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };

                $scope.dtFoundersInstanceCallback = function (_dtInstance) {
                    $scope.dtInstance = _dtInstance;
                };
                $scope.reloadFoundersCampaigns = function () {
                    if ($scope.dtInstance) {
                        $scope.dtInstance._renderer.rerender();
                    }
                };

}]);
