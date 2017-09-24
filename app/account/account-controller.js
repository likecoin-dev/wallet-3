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

angular.module('account').controller('AccountMainCtrl',
    ['$scope', '$uibModal', 'SessionStorageService', 'NodeService', 'loginConfig', 'nodeConfig', 'DTOptionsBuilder',
        'DTColumnBuilder', 'AccountService', 'timestampFilter', 'amountTQTFilter', '$compile', 'controlConfig',
        'CommonsService', 'quantToAmountFilter', 'quantityToShareFilter', 'numericalStringFilter', 'AssetsService',
        'CurrenciesService', '$timeout', 'numberStringFilter','PeerService',
        function ($scope, $uibModal, SessionStorageService, NodeService, loginConfig, nodeConfig, DTOptionsBuilder,
                  DTColumnBuilder, AccountService, timestampFilter, amountTQTFilter, $compile, controlConfig,
                  CommonsService, quantToAmountFilter, quantityToShareFilter, numericalStringFilter, AssetsService,
                  CurrenciesService, $timeout, numberStringFilter,PeerService) {

            $scope.openSendTokenModal = function (recipient) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'account/modals/send-token-form.html',
                    size: 'lg',
                    controller: 'StepFormCtrl',
                    resolve: {
                        params: function () {
                            return {
                                recipient: recipient,
                            };
                        }
                    }
                });
            };

            $scope.openSearchAccountModal = function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'account/modals/search-account-form.html',
                    size: 'lg',
                    controller: 'StepFormCtrl',
                    resolve: {
                        params: function () {
                            return {};
                        }
                    }
                });
            };

            $scope.openSetAccountModal = function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'account/modals/set-account-form.html',
                    controller: 'StepFormCtrl',
                    resolve: {
                        params: function () {
                            return {};
                        }
                    }
                });
            };

            $scope.openTransactionTypeModal = function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'account/modals/transaction-types.html',
                    size: 'lg',
                    controller: 'AccountMainCtrl',
                    resolve: {
                        params: function () {
                            return {};
                        }
                    }
                });
            };

            $scope.openBalanceLeasingModal = function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'account/modals/balance-leasing-form.html',
                    size: 'lg',
                    controller: 'BalanceLeasingCtrl',
                    resolve: {
                        params: function () {
                            return {};
                        }
                    }
                });
            };

            $scope.openBlockGenerationModal = function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'account/modals/block-generation.html',
                    size: 'lg',
                    controller: 'BlockGenerationCtrl',
                    resolve: {
                        params: function () {
                            return {};
                        }
                    }
                });
            };

            $scope.openWelcomeFaucetModal = function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'account/modals/welcome-faucet-form.html',
                    size: 'lg',
                    controller: 'StepFormCtrl',
                    resolve: {
                        params: function () {
                            return {};
                        }
                    }
                });
            };

            $scope.openSetAccountPropertyModal = function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'account/modals/properties-form.html',
                    size: 'lg',
                    controller: 'StepFormCtrl',
                    resolve: {
                        params: function () {
                            return {};
                        }
                    }
                });
            };

            $scope.openDeleteAccountPropertyModal = function (account, property, mode) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'account/modals/properties-delete-form.html',
                    size: 'lg',
                    controller: 'StepFormCtrl',
                    resolve: {
                        params: function () {
                            return {
                              account: account,
                              property: property,
                              mode: mode
                            };
                        }
                    }
                });
            };

            $scope.getAccountFromSession = function () {
                $scope.accountDetails = SessionStorageService.getFromSession(loginConfig.SESSION_ACCOUNT_DETAILS_KEY);
                $scope.privateKey = SessionStorageService.getFromSession(loginConfig.SESSION_ACCOUNT_PRIVATE_KEY);
                $scope.activePeer = NodeService.getNode(false);
                $scope.localPeer = SessionStorageService.getFromSession(nodeConfig.SESSION_LOCAL_NODE);
            };

            $scope.getAccountDetails = function () {

                $scope.getAssetsXmcValue();
                $scope.getCurrenciesXmcValue();
                var accountRS = AccountService.getAccountDetailsFromSession('accountRs');
                AccountService.getAccountDetails(accountRS).then(function (success) {

                    if (success.errorCode === 5) {
                        success.publicKey = AccountService.getAccountDetailsFromSession('publicKey');

                        if (!success.balanceTQT) {
                            success.balanceTQT = 0;
                        }
                        if (!success.unconfirmedBalanceTQT) {
                            success.unconfirmedBalanceTQT = 0;
                        }
                        if (!success.forgedBalanceTQT) {
                            success.forgedBalanceTQT = 0;
                        }
                        if (!success.effectiveBalance) {
                            success.effectiveBalance = 0;
                        }

                        // show welcome and faucet modal only if unknown and balance 0

                        if (success.balanceTQT === 0) {

                          $scope.publicKey = success.publicKey;
                          $scope.accountRs = accountRS;
                          // $scope.openWelcomeFaucetModal();
                        }

                    }

                    $scope.multisig =
                        ' <span class="label label-success label-md" style="margin-top:-3px;"> STANDARD </span> ';

                    AccountService.getPhasingOnlyControl(accountRS).then(function (success) {
                        if (success.account) {
                            $scope.multisig =
                                ' <span class="label label-danger label-md" style="margin-top:-3px;"> CONTROLLED </span> ';

                            $scope.controlDetected = true;
                            $scope.multisigModel = JSON.stringify(success);
                            $scope.controlVotingModel = success.votingModel;
                            $scope.controlQuorum = success.quorum;
                            $scope.accountRS = success.accountRS;
                            $scope.maxFees = success.maxFees;
                            $scope.minBalance = success.minBalance;
                            $scope.WhitelistAccountRS = success.whitelist.length;

                            SessionStorageService.saveToSession(controlConfig.SESSION_ACCOUNT_CONTROL_HASCONTROL_KEY,
                                true);
                            SessionStorageService.saveToSession(controlConfig.SESSION_ACCOUNT_CONTROL_JSONCONTROL_KEY,
                                success);

                        } else {

                            SessionStorageService.saveToSession(controlConfig.SESSION_ACCOUNT_CONTROL_HASCONTROL_KEY,
                                false);
                            SessionStorageService.saveToSession(controlConfig.SESSION_ACCOUNT_CONTROL_JSONCONTROL_KEY,
                                '');

                        }
                    }, function (error) {


                    });

                    $scope.leasesDetected = false;

                    if (success.currentLesseeRS) {  $scope.leasesDetected = true; }

                    $scope.account = success;

                }, function (error) {

                });
            };

            $scope.labels = ['Assets', 'Currencies', 'Account'];

            $scope.getChart = function () {
                $timeout(function () {
                    $scope.holdingData =
                        [$scope.accountAssetXmcValue, $scope.accountCurrencyXmcValue,
                            quantToAmountFilter($scope.account ? $scope.account.balanceTQT : 0)];
                    var graphData = [];
                    var sum = 0;
                    for (var i = 0; i < $scope.labels.length; i++) {
                        var currentData = {};
                        currentData.key = $scope.labels[i];
                        currentData.value = $scope.holdingData[i];
                        sum = sum + currentData.value;
                        graphData.push(currentData);
                    }

                    $scope.accountHoldingData = graphData;
                    $scope.total = sum;

                }, 2000);
            };

            $scope.chartOptions =
            {
                'chart': {
                    'type': 'pieChart',
                      'responsive': true,
                    'height': 225,
                     'width': 175,


                    'showLegend': true,
                    'noData': 'Holding data not avilable',

                    x: function (d) {
                        return d.key;
                    },
                    y: function (d) {
                        return d.value;
                    },
                    tooltip: {
                        valueFormatter: function (d) {
                            return numberStringFilter((d * 100 / $scope.total)) + ' %';
                        }
                    }

                }
            };

            $scope.getAssetsXmcValue = function () {
                var accountRs = CommonsService.getAccountDetailsFromSession('accountRs');
                AssetsService.getAccountAssets(accountRs).then(function (success) {

                    var assets = success.accountAssets;
                    var assetsInfos = {};
                    var assetsIds = [];
                    for (var i = 0; i < assets.length; i++) {
                        var assetId = assets[i].asset;
                        assetsInfos[assetId] = assets[i];
                        assetsIds.push(assetId);
                    }
                    AssetsService.getMultipleAssetLastTrades(assetsIds).then(function (success) {
                        var sum = 0;
                        var trades = success.trades || [];
                        for (var i = 0; i < trades.length; i++) {
                            var trade = trades[i];
                            var currentAsset = assetsInfos[trade.asset];
                            var price = trade.priceTQT;
                            var units = currentAsset.quantityQNT;

                            var amount = ( price * units ) / 100000000;

                            sum = sum + amount;

                        }
                        $scope.accountAssetXmcValue = sum;
                    }, function (error) {

                    });
                }, function (error) {

                });
            };

            $scope.getCurrenciesXmcValue = function () {
                var accountRs = CommonsService.getAccountDetailsFromSession('accountRs');
                CurrenciesService.getAccountCurrencies(accountRs).then(function (success) {

                    var currencies = success.accountCurrencies;
                    var currenciesInfos = {};
                    var currencyIds = [];
                    for (var i = 0; i < currencies.length; i++) {
                        var currencyId = currencies[i].currency;
                        currenciesInfos[currencyId] = currencies[i];
                        currencyIds.push(currencyId);
                    }

                    CurrenciesService.getMultipleCurrenctLastExchanges(currencyIds).then(function (success) {

                        var sum = 0;
                        var currencies = success.exchanges || [];
                        for (var i = 0; i < currencies.length; i++) {
                            var exchange = currencies[i];
                            var currentCurrency = currenciesInfos[exchange.currency];
                            var price = quantToAmountFilter(exchange.rateTQT);
                            var units = currentCurrency.units;
                            sum = sum + (units * price );
                        }
                        $scope.accountCurrencyXmcValue = sum;
                    }, function (error) {

                    });
                }, function (error) {

                });
            };

        }]);

angular.module('account').controller('AccountUnconfirmedTransactionsCtrl',
    ['$scope', 'SessionStorageService', 'NodeService', 'loginConfig', 'nodeConfig', 'DTOptionsBuilder',
        'DTColumnBuilder', 'AccountService', 'timestampFilter', 'amountTQTFilter', '$compile',
        'transactionConfFilter', 'transactionTypeFilter', 'searchTermFilter', 'baseConfig',
        'transactionIconSubTypeFilter',
        function ($scope, SessionStorageService, NodeService, loginConfig, nodeConfig, DTOptionsBuilder,
                  DTColumnBuilder, AccountService, timestampFilter, amountTQTFilter, $compile,
                  transactionConfFilter, transactionTypeFilter, searchTermFilter, baseConfig,
                  transactionIconSubTypeFilter) {

            $scope.dtUnconfirmedOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers')
                .withDOM('frtip')
                .withOption('serverSide', false)
                .withDataProp('unconfirmedTransactions')
                .withOption('processing', true)
                .withOption('info', false)
                .withOption('paging', true)
                .withOption('ordering', false)
                .withOption('processing', true)
                .withOption('bFilter', false)
                .withOption('fnRowCallback',
                    function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                        $compile(nRow)($scope);
                    })
                .withOption('ajax', function (data, callback, settings) {
                    var account = AccountService.getAccountDetailsFromSession('accountId');
                    AccountService.getAccountUnconfirmedTransactions(account)
                        .then(function (response) {
                            callback({
                                'iTotalRecords': response.unconfirmedTransactions.length,
                                'iTotalDisplayRecords': response.unconfirmedTransactions.length,
                                'unconfirmedTransactions': response.unconfirmedTransactions
                            });
                        });
                })
                .withDisplayLength(10).withBootstrap();

            $scope.dtUnconfirmedColumns = [

                DTColumnBuilder.newColumn('timestamp').withTitle('Date').notSortable()
                    .renderWith(function (data, type, row, meta) {
                            return timestampFilter(data);
                        }
                    ),

                DTColumnBuilder.newColumn('type').withTitle('Type').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return transactionIconSubTypeFilter(data, row.subtype);
                    }),

                DTColumnBuilder.newColumn('senderRS').withTitle('Sender').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return searchTermFilter(data);
                    }),

                DTColumnBuilder.newColumn('recipientRS').withTitle('Recipient').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return ( data || '');
                    }),

                DTColumnBuilder.newColumn('feeTQT').withTitle('Fee').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return amountTQTFilter(data);
                    }),
                DTColumnBuilder.newColumn('amountTQT').withTitle('Amount').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return amountTQTFilter(data);
                    }),

                DTColumnBuilder.newColumn('transaction').withTitle('Details').notSortable()

                    .renderWith(function (data, type, row, meta) {
                        return '<button type="button" class="btn btn-success btn-xs" ng-controller="SearchCtrl"' +
                            ' ' +
                            'ng-click="searchValue(\'' + data + '\')">' +
                            '<i class="fa fa-list-ul" aria-hidden="true" style="width:15px;"></i>' + '</button>';
                    })

            ];

            $scope.reloadUnconfirmedTransactions = function () {
                if ($scope.dtInstanceUnconfirmedTransactions) {
                    $scope.dtInstanceUnconfirmedTransactions._renderer.rerender();
                }
            };

            $scope.dtInstanceUnconfirmedTransactionsCallback = function (_dtInstance) {
                $scope.dtInstanceUnconfirmedTransactions = _dtInstance;
            };

        }]);

angular.module('account').controller('AccountTransactionsCtrl',
    ['$scope', 'SessionStorageService', 'NodeService', 'loginConfig', 'nodeConfig', 'DTOptionsBuilder',
        'DTColumnBuilder', 'AccountService', 'timestampFilter', 'amountTQTFilter', '$compile',
        'transactionIconSubTypeFilter',
        'transactionConfFilter', 'transactionTypeFilter', 'searchTermFilter', 'baseConfig', 'isEnabledFilter',
        'isMessageFilter', 'hasMessageFilter', 'txDirectionFilter',
        function ($scope, SessionStorageService, NodeService, loginConfig, nodeConfig, DTOptionsBuilder,
                  DTColumnBuilder, AccountService, timestampFilter, amountTQTFilter, $compile,
                  transactionIconSubTypeFilter,
                  transactionConfFilter, transactionTypeFilter, searchTermFilter, baseConfig, isEnabledFilter,
                  isMessageFilter, hasMessageFilter, txDirectionFilter) {


            $scope.filter_type = '';
            $scope.filter_subtype = '';
            $scope.filter_phasedOnly = '';
            $scope.filter_nonPhasedOnly = '';
            $scope.filter_withMessage = false;
            $scope.filter_includePhasingResult = false;
            $scope.filter_numberOfConfirmations = '';

            $scope.includeFinished = true;

            $scope.filterAsset = function () {

                $scope.filter_type = 2;
                $scope.filter_subtype = '';
                $scope.filter_phasedOnly = '';
                $scope.filter_nonPhasedOnly = '';
                $scope.filter_withMessage = false;
                $scope.filter_includePhasingResult = false;
                $scope.filter_numberOfConfirmations = '';

                $scope.reloadTransactions();
            };

            $scope.filterPayment = function () {

                $scope.filter_type = 0;
                $scope.filter_subtype = '';
                $scope.filter_phasedOnly = '';
                $scope.filter_nonPhasedOnly = '';
                $scope.filter_withMessage = false;
                $scope.filter_includePhasingResult = false;
                $scope.filter_numberOfConfirmations = '';

                $scope.reloadTransactions();
            };

            $scope.filterCurrency = function () {

                $scope.filter_type = 5;
                $scope.filter_subtype = '';
                $scope.filter_phasedOnly = '';
                $scope.filter_nonPhasedOnly = '';
                $scope.filter_withMessage = false;
                $scope.filter_includePhasingResult = false;
                $scope.filter_numberOfConfirmations = '';

                $scope.reloadTransactions();
            };

            $scope.filterNone = function () {

                $scope.filter_type = '';
                $scope.filter_subtype = '';
                $scope.filter_phasedOnly = '';
                $scope.filter_nonPhasedOnly = '';
                $scope.filter_withMessage = false;
                $scope.filter_includePhasingResult = false;
                $scope.filter_numberOfConfirmations = '';

                $scope.reloadTransactions();
            };

            $scope.filterAccount = function () {

                $scope.filter_type = 4;
                $scope.filter_subtype = '';
                $scope.filter_phasedOnly = '';
                $scope.filter_nonPhasedOnly = '';
                $scope.filter_withMessage = false;
                $scope.filter_includePhasingResult = false;
                $scope.filter_numberOfConfirmations = '';

                $scope.reloadTransactions();
            };

            $scope.filterMessages = function () {

                $scope.filter_type = 1;
                $scope.filter_subtype = 0;
                $scope.filter_phasedOnly = '';
                $scope.filter_nonPhasedOnly = '';
                $scope.filter_withMessage = false;
                $scope.filter_includePhasingResult = false;
                $scope.filter_numberOfConfirmations = '';

                $scope.reloadTransactions();
            };

            $scope.filterAlias = function () {

                $scope.filter_type = 1;
                $scope.filter_subtype = 1;
                $scope.filter_phasedOnly = '';
                $scope.filter_nonPhasedOnly = '';
                $scope.filter_withMessage = false;
                $scope.filter_includePhasingResult = false;
                $scope.filter_numberOfConfirmations = '';

                $scope.reloadTransactions();
            };

            $scope.filterVoting = function () {

                $scope.filter_type = 1;
                $scope.filter_subtype = 3;
                $scope.filter_phasedOnly = '';
                $scope.filter_nonPhasedOnly = '';
                $scope.filter_withMessage = false;
                $scope.filter_includePhasingResult = false;
                $scope.filter_numberOfConfirmations = '';

                $scope.reloadTransactions();
            };

            $scope.filterMultiSig = function () {

                $scope.filter_type = 1;
                $scope.filter_subtype = 9;
                $scope.filter_phasedOnly = '';
                $scope.filter_nonPhasedOnly = '';
                $scope.filter_withMessage = false;
                $scope.filter_includePhasingResult = false;
                $scope.filter_numberOfConfirmations = '';

                $scope.reloadTransactions();
            };

            $scope.dtOptionsTransactions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers')
                .withDOM('frtip')
                .withOption('serverSide', true)
                .withDataProp('data')
                .withOption('responsive', true)
                .withOption('processing', true)
                .withOption('paging', true)
                .withOption('ordering', false)
                .withOption('info', false)
                .withOption('bFilter', false)
                .withOption('fnRowCallback',
                    function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                        $compile(nRow)($scope);
                    })
                .withOption('ajax', function (data, callback, settings) {
                    var endIndex = data.start + data.length - 1;
                    var accountId = AccountService.getAccountDetailsFromSession('accountId');
                    AccountService.getAccountTransaction(
                        accountId,
                        data.start,
                        endIndex,
                        $scope.filter_type,
                        $scope.filter_subtype
                    )
                        .then(function (response) {
                            callback({
                                'iTotalRecords': 1000,
                                'iTotalDisplayRecords': 1000,
                                'data': response.transactions
                            });
                        });
                })
                .withDisplayLength(10).withBootstrap();

            $scope.dtColumnsTransactions = [

                DTColumnBuilder.newColumn('timestamp').withTitle('Date').notSortable()
                    .renderWith(function (data, type, row, meta) {
                            return timestampFilter(data);
                        }
                    ),

                DTColumnBuilder.newColumn('type').withTitle('Type').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return transactionIconSubTypeFilter(data, row.subtype);
                    }),

                DTColumnBuilder.newColumn('amountTQT').withTitle('Amount').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return amountTQTFilter(data);
                    }),

                DTColumnBuilder.newColumn('senderRS').withTitle('').notSortable()
                    .renderWith(function (data, type, row, meta) {
                      var accountRS = AccountService.getAccountDetailsFromSession('accountRs');
                        return txDirectionFilter(accountRS, row);
                    }),

                    DTColumnBuilder.newColumn('feeTQT').withTitle('Fee').notSortable()
                        .renderWith(function (data, type, row, meta) {
                            return amountTQTFilter(data);
                        }),

                DTColumnBuilder.newColumn('confirmations').withTitle('Conf.').notSortable()
                    .renderWith(function (data, type, row, meta) {
                            return transactionConfFilter(data);
                        }
                    ),

                DTColumnBuilder.newColumn('senderRS').withTitle('Sender').notSortable()
                    .withOption('defaultContent', ' ')
                    .renderWith(function (data, type, row, meta) {
                        if (data) {
                            return searchTermFilter(data);
                        }
                        return data;
                    }),

                DTColumnBuilder.newColumn('phased').withTitle('Msg').notSortable()
                    .renderWith(function (data, type, row, meta) {
                            var accountRS = AccountService.getAccountDetailsFromSession('accountRs');
                            return hasMessageFilter(row, accountRS);
                        }
                    ),

                DTColumnBuilder.newColumn('recipientRS').withTitle('Recipient').notSortable()
                    .withOption('defaultContent', ' ').renderWith(function (data, type, row, meta) {
                    if (data) {
                        return searchTermFilter(data);
                    } else {
                        return '';
                    }
                    return data;
                }),

                DTColumnBuilder.newColumn('transaction').withTitle('Details').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return '<button class="btn btn-success btn-xs" ng-controller="SearchCtrl"' +
                            ' ng-click="searchValue(\'' + row.fullHash + '\')">' +
                            '<i class="fa fa-list-ul" aria-hidden="true" style="width:15px;"></i>' + '</button>';

                    })];

            $scope.reloadTransactions = function () {

                if ($scope.dtInstanceTransactions) {
                    $scope.dtInstanceTransactions._renderer.rerender();
                }
            };

            $scope.dtInstanceTransactionsCallback = function (_dtInstance) {
                $scope.dtInstanceTransactions = _dtInstance;
            };
        }]);

angular.module('account').controller('AccountLessorCtrl',
    ['$scope', 'SessionStorageService', 'NodeService', 'loginConfig', 'nodeConfig', 'DTOptionsBuilder',
        'DTColumnBuilder', 'AccountService', 'timestampFilter', 'amountTKNFilter', '$compile', 'baseConfig',
        'searchTermFilter', 'amountTQTFilter',
        function ($scope, SessionStorageService, NodeService, loginConfig, nodeConfig, DTOptionsBuilder,
                  DTColumnBuilder, AccountService, timestampFilter, amountTKNFilter, $compile, baseConfig,
                  searchTermFilter, amountTQTFilter) {

            $scope.dtAccountLessorsOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers')
                .withDOM('frtip')
                .withOption('serverSide', false)
                .withDataProp('lessors')
                .withOption('processing', true)
                .withOption('info', false)
                .withOption('paging', true)
                .withOption('ordering', false)
                .withOption('processing', true)
                .withOption('bFilter', false)
                .withOption('fnRowCallback',
                    function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                        $compile(nRow)($scope);
                    })
                .withOption('ajax', function (data, callback, settings) {
                    var account = AccountService.getAccountDetailsFromSession('accountId');
                    AccountService.getAccountLessors(account)
                        .then(function (response) {

                            if (!response.accountLeases) {
                                response.accountLeases = {};
                            }

                            $scope.currentHeight = response.height;

                            callback({
                                'iTotalRecords': 1000,
                                'iTotalDisplayRecords': 1000,
                                'lessors': response.accountLeases
                            });
                        });
                })
                .withDisplayLength(10).withBootstrap();

            $scope.dtAccountLessorsColumns = [

                DTColumnBuilder.newColumn('lessorRS').withTitle('Account').notSortable()
                    .withOption('defaultContent', ' ').renderWith(function (data, type, row, meta) {
                    if (data) {
                        return searchTermFilter(data);
                    }
                    return data;
                }),

                DTColumnBuilder.newColumn('effectiveBalance').withTitle('Balance <small> XIN </small>').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return amountTKNFilter(data);
                    }),

                DTColumnBuilder.newColumn('currentHeightFrom').withTitle('Height From').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return (data);
                    }),

                DTColumnBuilder.newColumn('currentHeightTo').withTitle('Height To').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return (data);
                    }),

                DTColumnBuilder.newColumn('currentHeightTo').withTitle('Blocks Left').notSortable()
                    .renderWith(function (data, type, row, meta) {

                        if (row.currentHeightFrom) {

                            var range = ( data - row.currentHeightFrom );
                            var diff = ( data - $scope.currentHeight );
                            var value = diff * 100 / range;
                            var days = diff / 1440;

                            var col = diff;

                            return col;

                        } else {
                            return '';
                        }


                    }),

                DTColumnBuilder.newColumn('currentHeightTo').withTitle('Days Left').notSortable()
                    .renderWith(function (data, type, row, meta) {

                        var range = ( data - row.currentHeightFrom );
                        var diff = ( data - $scope.currentHeight );
                        var value = diff * 100 / range;
                        var days = diff / 1440;

                        var col = days.toFixed(2);

                        return days.toFixed(2);

                    }),

                DTColumnBuilder.newColumn('currentHeightTo').withTitle('Percentage').notSortable()
                    .renderWith(function (data, type, row, meta) {

                        var range = ( data - row.currentHeightFrom );
                        var diff = ( data - $scope.currentHeight );
                        var value = 100 - ( diff * 100 / range);
                        var days = diff / 1440;

                        var col = value.toFixed(2) + '%';

                        return col;

                    }),

            ];

            $scope.currentHeight = 0;

            $scope.reloadLessors = function () {
                if ($scope.dtInstanceLessors) {
                    $scope.dtInstanceLessors._renderer.rerender();
                }
            };

            $scope.dtInstanceLessorsCallback = function (_dtInstance) {
                $scope.dtInstanceLessors = _dtInstance;
            };

        }]);

angular.module('account').controller('StepFormCtrl',
    ['$scope', '$uibModalInstance', 'params', function ($scope, $uibModalInstance, params) {

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.$on('close-modal', function () {
            $uibModalInstance.dismiss('cancel');
        });

        var sendTokenSteps = [
            {
                templateUrl: 'account/modals/send-token-details.html',
                title: 'Send Token Details',
                controller: 'SendTokenFormController',
                isolatedScope: true,
                data: params
            },
            {
                templateUrl: 'account/modals/send-token-confirm.html',
                title: 'Send Token Confirmation',
                controller: 'SendTokenFormController',
                isolatedScope: true,
            },
        ];

        var setAccountInfoSteps = [
            {
                templateUrl: 'account/modals/set-account-details.html',
                title: 'Set Account Info Details',
                controller: 'SetAccountFormCtrl',
                isolatedScope: true,
            },
            {
                templateUrl: 'account/modals/set-account-confirm.html',
                title: 'Set Account Info Confirmation',
                controller: 'SetAccountFormCtrl',
                isolatedScope: true,
            }
        ];

        var searchAccountSteps = [
            {
                templateUrl: 'account/modals/search-account-details.html',
                title: 'Search Account Details',
                controller: 'SearchAccountFormCtrl',
                isolatedScope: true,
            },
            {
                templateUrl: 'account/modals/search-account-confirm.html',
                title: 'Search Account Results',
                controller: 'SearchAccountFormCtrl',
                isolatedScope: true,
            },
        ];

        var setControlAccountSteps = [
            {
                templateUrl: 'account/modals/control-account-details.html',
                title: 'Set Account Control Details',
                controller: 'AccountControlSetAccountCtrl',
                isolatedScope: true,
            },
            {
                templateUrl: 'account/modals/control-account-confirm.html',
                title: 'Set Account Control Confirmation',
                controller: 'AccountControlSetAccountCtrl',
                isolatedScope: true,
            },
        ];

        var welcomeFaucetSteps = [
            {
                templateUrl: 'account/modals/welcome-faucet-details.html',
                title: 'Welcome',
                controller: 'WelcomeFaucetFormCtrl',
                isolatedScope: true,
                data: params,
            },
            {
                templateUrl: 'account/modals/welcome-faucet-confirm.html',
                title: 'Get Free Token',
                controller: 'WelcomeFaucetFormCtrl',
                isolatedScope: true,
            },
        ];

        var setAccountPropertiesForm = [
            {
                templateUrl: 'account/modals/properties-details.html',
                title: 'Set Account Property Details',
                controller: 'SetPropertiesFormCtrl',
                isolatedScope: true,
            },
            {
                templateUrl: 'account/modals/properties-confirm.html',
                title: 'Set Account Property Confirmation',
                controller: 'SetPropertiesFormCtrl',
                isolatedScope: true,
            }
        ];

        var deleteAccountPropertiesForm = [
            {
                templateUrl: 'account/modals/properties-delete-confirm.html',
                title: 'Delete Account Property Confirmation',
                controller: 'DeletePropertiesFormCtrl',
                isolatedScope: true,
                data: params

            }
        ];



        $scope.steps = {};

        $scope.steps.sendTokenForm = sendTokenSteps;
        $scope.steps.setAccountInfoForm = setAccountInfoSteps;
        $scope.steps.searchAccountSteps = searchAccountSteps;
        $scope.steps.setControlAccountSteps = setControlAccountSteps;
        $scope.steps.welcomeFaucetForm = welcomeFaucetSteps;
        $scope.steps.setAccountPropertiesForm = setAccountPropertiesForm;
        $scope.steps.deleteAccountPropertiesForm = deleteAccountPropertiesForm;


    }]);

angular.module('account').controller('BalanceLeasingCtrl',
    ['$scope', 'AccountService', 'SessionStorageService', '$state', '$uibModalInstance', 'CryptoService', 'loginConfig',
        'AlertService', 'alertConfig', '$uibModal', 'CurrenciesService',
        function ($scope, AccountService, SessionStorageService, $state, $uibModalInstance, CryptoService,
                  loginConfig, AlertService, alertConfig, $uibModal, CurrenciesService) {


            $scope.blockheight = 1;

            $scope.initStep = function () {

              CurrenciesService.getBlockChainStatus().then(function (success) {
                  $scope.blockheight = parseInt(success.numberOfBlocks);
              });

            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };

            $scope.period = 1440;

            $scope.increment = function () {
                if ($scope.period >= 65535) {
                    $scope.period = 65535;
                    return;
                } else {
                    $scope.period = $scope.period + 1440;
                }

                $scope.leaseForm.period = $scope.period;
            };

            $scope.decrement = function () {
                if ($scope.period <= 1440) {
                    $scope.period = 1440;
                    return;
                } else {
                    $scope.period = $scope.period - 1440;
                }

                $scope.leaseForm.period = $scope.period;
            };

            $scope.max = function () {
                $scope.period = 65535;
                $scope.leaseForm.period = 65535;
            };

            $scope.min = function () {
                $scope.period = 1440;
                $scope.leaseForm.period = 1440;
            };

            $scope.$watchCollection('leaseForm', function (leaseForm) {
                if (leaseForm.recipientRS && leaseForm.period && (leaseForm.secret ||
                    SessionStorageService.getFromSession(loginConfig.SESSION_ACCOUNT_PRIVATE_KEY))) {
                    $scope.validForm = true;
                } else {
                    $scope.validForm = false;
                }
            });

            $scope.openAddressBookModal = function () {
                var modalInstance = $uibModal.open({
                    animation: false,
                    templateUrl: 'addressbook/views/addressbook-light.html',
                    controller: 'AddressBookCtrl',
                    resolve: {
                        params: function () {
                            return {
                                'closeOnClick': true
                            };
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    $scope.leaseForm.recipientRS = result.accountRS;
                });
            };

            $scope.leaseForm = {};

            $scope.validForm = false;
            $scope.validBytes = false;
            $scope.hasPublicKeyAdded = false;
            $scope.hasMessageAdded = false;

            $scope.hasPrivateKeyInSession = function () {
                if (SessionStorageService.getFromSession(loginConfig.SESSION_ACCOUNT_PRIVATE_KEY)) {
                    return true;
                }
                return false;
            };

            var createAndSignTransaction = function (transactionOptions, secretPhraseHex) {

                $scope.setBalanceLeasingPromise = AccountService.setBalanceLeasing(
                    transactionOptions.senderPublicKey,
                    transactionOptions.recipientRS,
                    transactionOptions.period,
                    transactionOptions.fee,
                    transactionOptions.data,
                    transactionOptions.nonce,
                    transactionOptions.recipientPublicKey
                ).then(function (success) {

                    if (!success.errorCode) {
                        var unsignedBytes = success.unsignedTransactionBytes;
                        var signatureHex = CryptoService.signatureHex(unsignedBytes, secretPhraseHex);
                        var transactionBytes = CryptoService.signTransactionHex(unsignedBytes, signatureHex);

                        $scope.transactionBytes = transactionBytes;

                        $scope.validBytes = true;

                        $scope.tx_fee = success.transactionJSON.feeTQT / 100000000;
                        $scope.tx_amount = success.transactionJSON.amountTQT / 100000000;
                        $scope.tx_total = $scope.tx_fee + $scope.tx_amount;


                        return transactionBytes;
                    } else {
                        AlertService.addAlert(
                            {
                                type: 'danger',
                                msg: 'Sorry, an error occured! Reason: ' + success.errorDescription
                            }, alertConfig.leaseBalanceModalAlert
                        );
                    }
                },function (error) {
                    AlertService.addAlert(AlertService.getNoConnectionMessage(error),
                        alertConfig.leaseBalanceModalAlert);
                });
            };

            $scope.getAndVerifyAccount = function (leaseForm) {

                if ($scope.blockheight  < 3000 ) {

                  AlertService.addAlert(
                      {
                          type: 'info',
                          msg: 'The balance leasing feature is available starting from block : 3\'000. This is about 2 days from genesis block creation date. Please try again as soon this block height is reached.'
                      }, alertConfig.leaseBalanceModalAlert
                  );

                  return;

                }

                var recipientRS = leaseForm.recipientRS;
                var period = leaseForm.period;
                var fee = leaseForm.fee;
                var secret = leaseForm.secretPhrase;

                var message = leaseForm.message;
                var pubkey = leaseForm.pubkey;

                var hasPublicKeyAdded = false;
                var hasMessageAdded = false;
                var hasSecretAdded = false;

                if (pubkey && pubkey.length > 0) {
                    hasPublicKeyAdded = true;
                }
                if (message && message.length > 0) {
                    hasMessageAdded = true;
                }
                if (secret && secret.length > 0) {
                    hasSecretAdded = true;
                }

                if (!fee) {
                    fee = 1;
                }

                $scope.hasPublicKeyAdded = hasPublicKeyAdded;
                $scope.hasMessageAdded = hasMessageAdded;

                var senderPublicKey = AccountService.getAccountDetailsFromSession('publicKey');
                var secretPhraseHex;
                if (hasSecretAdded) {
                    secretPhraseHex = CryptoService.secretPhraseToPrivateKey(secret);
                } else {
                    secretPhraseHex = SessionStorageService.getFromSession(loginConfig.SESSION_ACCOUNT_PRIVATE_KEY);
                }

                AccountService.getAccountDetails(recipientRS).then(function (success) {

                    var recipientPublicKey = success.publicKey;

                    if (!recipientPublicKey && hasPublicKeyAdded) {
                        recipientPublicKey = pubkey;
                    }

                    if (!success.errorCode || success.errorCode === 5) {

                        $scope.accountDetails = success;

                        if (!recipientPublicKey && !hasPublicKeyAdded) {
                            AlertService.addAlert(
                                {
                                    type: 'danger',
                                    msg: 'Sorry, an error occured! Reason: This account has no visible public key because it never had any outbound transaction. Encrypted messages or balance leasing is not available without a public key. Ask the account holder for his public key and add the key on the former page to this transaction'
                                }, alertConfig.leaseBalanceModalAlert
                            );
                            return;
                        }

                        var encrypted = {data: '', nonce: ''};
                        if (hasMessageAdded) {
                            if (!recipientPublicKey) {
                                recipientPublicKey = pubkey;
                            }
                            encrypted = CryptoService.encryptMessage(message, secretPhraseHex, recipientPublicKey);
                            $scope.encrypted = JSON.stringify(encrypted);
                        } else {
                            $scope.encrypted = encrypted;
                        }

                        var transactionOptions = {
                            'senderPublicKey': senderPublicKey,
                            'recipientRS': recipientRS,
                            'period': period,
                            'fee': fee,
                            'data': encrypted.data,
                            'nonce': encrypted.nonce,
                            'recipientPublicKey': recipientPublicKey,
                        };

                        createAndSignTransaction(transactionOptions, secretPhraseHex);

                        if ($scope.encrypted.data === '') {
                            $scope.encrypted = '';
                        }

                    } else {
                        AlertService.addAlert(
                            {
                                type: 'danger',
                                msg: 'Sorry, an error occured! Reason: ' + success.errorDescription
                            }, alertConfig.leaseBalanceModalAlert
                        );
                    }
                },function (error) {
                    AlertService.addAlert(AlertService.getNoConnectionMessage(error),
                        alertConfig.leaseBalanceModalAlert);
                });
            };

            $scope.broadcastTransaction = function (transactionBytes) {
                AccountService.broadcastTransaction(transactionBytes).then(function (success) {
                    $uibModalInstance.dismiss('cancel');
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

                },function (error) {
                    AlertService.addAlert(AlertService.getNoConnectionMessage(error),
                        alertConfig.leaseBalanceModalAlert);
                });
            };

            $scope.steps = [
                {
                    templateUrl: 'account/modals/balance-leasing-details.html',
                    title: 'Balance Leasing Details'
                },
                {
                    templateUrl: 'account/modals/balance-leasing-confirm.html',
                    title: 'Balance Leasing Confirm'
                },
            ];

        }]);

angular.module('account').controller('BlockGenerationCtrl',
    ['$scope', 'AccountService', 'SessionStorageService', '$state', '$uibModalInstance', 'CryptoService', 'loginConfig',
        'AlertService', 'alertConfig', '$uibModal', 'NodeService', '$timeout', 'OptionsService',
        function ($scope, AccountService, SessionStorageService, $state, $uibModalInstance, CryptoService,
                  loginConfig, AlertService, alertConfig, $uibModal, NodeService, $timeout, OptionsService) {

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };

            $scope.status = 'Unknown';

            $scope.hasLocal = OptionsService.getOption('CONNECTION_MODE') === 'LOCAL_HOST';

            $scope.displayNotificationAlert = function () {
                if (OptionsService.getOption('CONNECTION_MODE') === 'LOCAL_HOST') {
                    $timeout(function () {
                        AlertService.addAlert(
                            {
                                type: 'danger',
                                msg: 'Localhost (127.0.0.1) is not available. For security reasons localhost is mandatory for block generation'
                            }, alertConfig.blockGenerationModalAlert);
                    }, 2000);
                }
            };

            $scope.hasPrivateKeyInSession = function () {
                if (SessionStorageService.getFromSession(loginConfig.SESSION_ACCOUNT_PRIVATE_KEY)) {
                    return true;
                }
                return false;
            };

            $scope.generationStatus = '<span class="label label-warning">Unkown Account</span>';

            $scope.runBlockGeneration = function (mode) {
                AccountService.blockGeneration(mode, $scope.blockGenerationForm.secretPhrase).then(function (success) {

                    if (success.errorDescription) {
                        $scope.generationStatus = success.errorDescription;
                    }
                    if (typeof success.deadline !== 'undefined') {
                        $scope.generationStatus = '<span class="label label-success">Running</span>';
                    }
                    if (success.errorCode === 4) {
                        $scope.generationStatus = '<span class="label label-warning">Unkown Account</span>';
                    }
                    if (success.foundAndStopped === true) {
                        $scope.generationStatus = '<span class="label label-danger">Stopped</span>';
                    }
                    if (success.foundAndStopped === false) {
                        $scope.generationStatus = '<span class="label label-danger">Stopped</span>';
                    }

                });

            };


        }]);

angular.module('account').controller('WelcomeFaucetCtrl',
    ['$scope', 'SessionStorageService', 'NodeService', 'loginConfig', 'nodeConfig', 'DTOptionsBuilder',
        'DTColumnBuilder', 'AccountService', '$compile', '$uibModal',
        '$q', 'AlertService', 'alertConfig', 'CryptoService', '$state', '$rootScope','params',
        function ($scope, SessionStorageService, NodeService, loginConfig, nodeConfig, DTOptionsBuilder,
                  DTColumnBuilder, AccountService, $compile, $uibModal,
                  $q, AlertService, alertConfig, CryptoService, $state, $rootScope,params) {

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };

            $scope.$on('close-modal', function () {
                $uibModalInstance.dismiss('cancel');
            });

            var welcomeFaucetSteps = [
                {
                    templateUrl: 'account/modals/welcome-faucet-details.html',
                    title: 'Welcome To XIN',
                    controller: 'WelcomeFaucetFormCtrl',
                    isolatedScope: true,
                    data: params,
                },
                {
                    templateUrl: 'account/modals/welcome-faucet-confirm.html',
                    title: 'Confirm Email',
                    controller: 'WelcomeFaucetFormCtrl',
                    isolatedScope: true,
                },
            ];


            $scope.steps = {};
            $scope.steps.welcomeFaucetForm = welcomeFaucetSteps;

        }]);

angular.module('account').controller('AccountPropertiesCtrl',
    ['$scope', 'SessionStorageService', 'NodeService', 'loginConfig', 'nodeConfig', 'DTOptionsBuilder',
        'DTColumnBuilder', 'AccountService', 'timestampFilter', 'amountTQTFilter', '$compile',
        'transactionConfFilter', 'transactionTypeFilter', 'searchTermFilter', 'baseConfig',
        'transactionIconSubTypeFilter',
        function ($scope, SessionStorageService, NodeService, loginConfig, nodeConfig, DTOptionsBuilder,
                  DTColumnBuilder, AccountService, timestampFilter, amountTQTFilter, $compile,
                  transactionConfFilter, transactionTypeFilter, searchTermFilter, baseConfig,
                  transactionIconSubTypeFilter) {

            $scope.dtMyPropertiesOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers')
                .withDOM('frtip')
                .withOption('serverSide', false)
                .withDataProp('data')
                .withOption('processing', true)
                .withOption('info', false)
                .withOption('paging', true)
                .withOption('ordering', false)
                .withOption('processing', true)
                .withOption('bFilter', false)
                .withOption('fnRowCallback',
                    function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                        $compile(nRow)($scope);
                    })
                .withOption('ajax', function (data, callback, settings) {
                    var account = AccountService.getAccountDetailsFromSession('accountId');
                    var endIndex = data.start + data.length - 1;
                    AccountService.getAccountProperties(
                        account,
                        '',
                        '',
                        data.start,
                        endIndex
                      ).then(function (response) {
                            callback({
                                'iTotalRecords': response.properties.length,
                                'iTotalDisplayRecords': response.properties.length,
                                'data': response.properties
                            });
                        });
                })
                .withDisplayLength(5).withBootstrap();

            $scope.dtMyPropertiesColumns = [

                DTColumnBuilder.newColumn('setterRS').withTitle('Setter').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return searchTermFilter(data);
                    }),

                DTColumnBuilder.newColumn('property').withTitle('Key').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return ( data || '');
                    }),

                DTColumnBuilder.newColumn('value').withTitle('Value').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return ( data || '');
                    }),


                DTColumnBuilder.newColumn('setterRS').withTitle('Action').notSortable()
                    .renderWith(function (data, type, row, meta) {

                      var tt_delete = ' popover-placement="left" popover-trigger="\'mouseenter\'" uib-popover=' +
                          ' "Delete property"';

                      var mo_delete = '<button class="btn btn-default btn-xs" ' + tt_delete +
                          ' ng-click="openDeleteAccountPropertyModal(\'' + data + '\',\'' +
                          row.property + '\',\'' + 1 + '\')" ng-controller="AccountMainCtrl" ng-disabled="false">' +
                          ' <i class="fa fa-times" aria-hidden="true" style="width:15px;"></i> </button>';

                      return mo_delete;

                    })

            ];

            $scope.reloadMyProperties = function () {
                if ($scope.dtInstanceMyProperties) {
                    $scope.dtInstanceMyProperties._renderer.rerender();
                }
            };

            $scope.dtInstanceMyPropertiesCallback = function (_dtInstance) {
                $scope.dtInstanceMyProperties = _dtInstance;
            };

            $scope.dtForeignPropertiesOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers')
                .withDOM('frtip')
                .withOption('serverSide', false)
                .withDataProp('data')
                .withOption('processing', true)
                .withOption('info', false)
                .withOption('paging', true)
                .withOption('ordering', false)
                .withOption('processing', true)
                .withOption('bFilter', false)
                .withOption('fnRowCallback',
                    function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                        $compile(nRow)($scope);
                    })
                .withOption('ajax', function (data, callback, settings) {
                    var account = AccountService.getAccountDetailsFromSession('accountId');
                    var endIndex = data.start + data.length - 1;
                    AccountService.getAccountProperties(
                        '',
                        account,
                        '',
                        data.start,
                        endIndex
                      ).then(function (response) {

                            callback({
                                'iTotalRecords': response.properties.length,
                                'iTotalDisplayRecords': response.properties.length,
                                'data': response.properties
                            });
                        });
                })
                .withDisplayLength(5).withBootstrap();

            $scope.dtForeignPropertiesColumns = [

                DTColumnBuilder.newColumn('recipientRS').withTitle('Recipient').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return searchTermFilter(data);
                    }),

                DTColumnBuilder.newColumn('property').withTitle('Key').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return ( data || '');
                    }),

                DTColumnBuilder.newColumn('value').withTitle('Value').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return ( data || '');
                    }),

                DTColumnBuilder.newColumn('recipientRS').withTitle('Action').notSortable()

                    .renderWith(function (data, type, row, meta) {
                      var tt_delete = ' popover-placement="left" popover-trigger="\'mouseenter\'" uib-popover=' +
                          ' "Delete property"';

                      var mo_delete = '<button class="btn btn-default btn-xs" ' + tt_delete +
                          ' ng-click="openDeleteAccountPropertyModal(\'' + data + '\',\'' +
                          row.property + '\',\'' + 2 + '\')" ng-controller="AccountMainCtrl" ng-disabled="false">' +
                          ' <i class="fa fa-times" aria-hidden="true" style="width:15px;"></i> </button>';

                      return mo_delete;
                    })

            ];

            $scope.reloadForeignProperties = function () {
                if ($scope.dtInstanceForeignProperties) {
                    $scope.dtInstanceForeignProperties._renderer.rerender();
                }
            };

            $scope.dtInstanceForeignPropertiesCallback = function (_dtInstance) {
                $scope.dtInstanceForeignProperties = _dtInstance;
            };

        }]);

angular.module('account').controller('SetPropertiesFormCtrl',
    ['$scope', 'AccountService', 'SessionStorageService', '$state', 'CryptoService', 'loginConfig',
        'AlertService', 'alertConfig', 'FeeService', 'multiStepFormScope', '$rootScope', '$uibModal',
        function ($scope, AccountService, SessionStorageService, $state, CryptoService,
                  loginConfig, AlertService, alertConfig, FeeService, multiStepFormScope, $rootScope, $uibModal) {

            $scope.openAddressBookModal = function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'addressbook/views/addressbook-light.html',
                    controller: 'AddressBookCtrl',
                    resolve: {
                        params: function () {
                            return {
                                'closeOnClick': true
                            };
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    $scope.sendTokenForm.recipientRS = result.accountRS;
                });
            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };

            $scope.setAccountPropertyForm = angular.copy(multiStepFormScope.setAccountPropertyForm);

            $scope.$on('$destroy', function () {
                multiStepFormScope.setAccountPropertyForm = angular.copy($scope.setAccountPropertyForm);
            });

            $scope.setAccount = function () {
              $scope.setAccountPropertyForm.recipientRS = AccountService.getAccountDetailsFromSession('accountRs');

            };

            $scope.hasPrivateKeyInSession = function () {
                if (SessionStorageService.getFromSession(loginConfig.SESSION_ACCOUNT_PRIVATE_KEY)) {
                    return true;
                }
                return false;
            };

            $scope.createSetAccountPropertyTransaction = function () {

                var form = multiStepFormScope.setAccountPropertyForm;
                var account = form.recipientRS;
                var key = form.key;
                var value = form.value;

                var fee = 1;
                var secret = form.secretPhrase;

                var accountPublicKey = AccountService.getAccountDetailsFromSession('publicKey');
                var secretPhraseHex;
                if (secret) {
                    secretPhraseHex = CryptoService.secretPhraseToPrivateKey(secret);
                } else {
                    secretPhraseHex =
                        SessionStorageService.getFromSession(loginConfig.SESSION_ACCOUNT_PRIVATE_KEY);
                }
                $scope.setAccountPropertyPromise = AccountService.setAccountProperty(account, key, value, accountPublicKey, fee)
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
                                }, alertConfig.setInfoModalAlert
                            );
                        }
                    }, function (error) {
                        AlertService.addAlert(AlertService.getNoConnectionMessage(error),
                            alertConfig.setInfoModalAlert);
                    });
            };

            $scope.broadcastTransaction = function (transactionBytes) {
                $scope.setAccountPromise = AccountService.broadcastTransaction(transactionBytes)
                    .then(function (success) {
                        $scope.$emit('close-modal');
                        if (!success.errorCode) {
                            AlertService.addAlert(
                                {
                                    type: 'success',
                                    msg: 'Transaction succesfull broadcasted with id ' + success.transaction
                                });
                            // $state.go('client.signedin.account.pending');
                            $rootScope.$broadcast('reload-dashboard');
                        } else {
                            AlertService.addAlert(
                                {
                                    type: 'danger',
                                    msg: 'Unable to broadcast transaction. Reason: ' + success.errorDescription
                                });
                        }

                    }, function (error) {
                        AlertService.addAlert(AlertService.getNoConnectionMessage(error),
                            alertConfig.setInfoModalAlert);
                    });
            };

        }]);

angular.module('account').controller('DeletePropertiesFormCtrl',
    ['$scope', 'AccountService', 'SessionStorageService', '$state', 'CryptoService', 'loginConfig',
        'AlertService', 'alertConfig', 'FeeService', 'multiStepFormScope', '$rootScope', '$uibModal',
        function ($scope, AccountService, SessionStorageService, $state, CryptoService,
                  loginConfig, AlertService, alertConfig, FeeService, multiStepFormScope, $rootScope, $uibModal) {

            $scope.form = $scope.$getActiveStep().data;

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };

            $scope.$on('$destroy', function () {
                multiStepFormScope.setAccountPropertyForm = angular.copy($scope.setAccountPropertyForm);
            });

            $scope.hasPrivateKeyInSession = function () {
                if (SessionStorageService.getFromSession(loginConfig.SESSION_ACCOUNT_PRIVATE_KEY)) {
                    return true;
                }
                return false;
            };

            $scope.createDeleteAccountPropertyTransaction = function () {

                var form = $scope.$getActiveStep().data;

                var local = AccountService.getAccountDetailsFromSession('accountRs');
                var account = form.account;
                var property = form.property;
                var mode = parseInt(form.mode);
                var setter = '';

                if (mode === 1) {

                  if ( account === local ){
                    setter = local;
                    account = local;
                  } else {
                    setter = account;
                    account = local;
                  }

                } else if (mode === 2) {
                  setter = local;
                  account = account;
                }

                var fee = 1;
                var secret = form.secretPhrase;

                var accountPublicKey = AccountService.getAccountDetailsFromSession('publicKey');
                var secretPhraseHex;
                if (secret) {
                    secretPhraseHex = CryptoService.secretPhraseToPrivateKey(secret);
                } else {
                    secretPhraseHex =
                        SessionStorageService.getFromSession(loginConfig.SESSION_ACCOUNT_PRIVATE_KEY);
                }
                $scope.deletePropertyPromise = AccountService.deleteAccountProperty(account, property, setter, accountPublicKey, fee)
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
                                }, alertConfig.deletePropertyAlert
                            );
                        }
                    }, function (error) {
                        AlertService.addAlert(AlertService.getNoConnectionMessage(error),
                            alertConfig.deletePropertyAlert);
                    });
            };

            $scope.broadcastTransaction = function (transactionBytes) {
                $scope.setAccountPromise = AccountService.broadcastTransaction(transactionBytes)
                    .then(function (success) {
                        $scope.$emit('close-modal');
                        if (!success.errorCode) {
                            AlertService.addAlert(
                                {
                                    type: 'success',
                                    msg: 'Transaction succesfull broadcasted with id ' + success.transaction
                                });
                            // $state.go('client.signedin.account.pending');
                            $rootScope.$broadcast('reload-dashboard');
                        } else {
                            AlertService.addAlert(
                                {
                                    type: 'danger',
                                    msg: 'Unable to broadcast transaction. Reason: ' + success.errorDescription
                                });
                        }

                    }, function (error) {
                        AlertService.addAlert(AlertService.getNoConnectionMessage(error),
                            alertConfig.setInfoModalAlert);
                    });
            };

        }]);
