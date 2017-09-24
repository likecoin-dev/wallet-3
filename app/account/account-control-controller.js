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

angular.module('account').controller('ControlMainCtrl',
    ['$scope', 'SessionStorageService', 'NodeService', 'loginConfig', 'nodeConfig', 'DTOptionsBuilder',
        'DTColumnBuilder', 'AccountService', 'timestampFilter', 'amountTQTFilter', '$compile', 'controlConfig',
        'transactionConfFilter', 'transactionTypeFilter', 'searchTermFilter', '$uibModal', 'isMessageFilter',
        'transactionIconSubTypeFilter',
        function ($scope, SessionStorageService, NodeService, loginConfig, nodeConfig, DTOptionsBuilder,
                  DTColumnBuilder, AccountService, timestampFilter, amountTQTFilter, $compile, controlConfig,
                  transactionConfFilter, transactionTypeFilter, searchTermFilter, $uibModal, isMessageFilter,
                  transactionIconSubTypeFilter) {


            $scope.openClaimSecretModal = function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'account/modals/claim-secret-form.html',
                    size: 'lg',
                    controller: 'ControlStepFormCtrl',
                    resolve: {
                        params: function () {
                            return {};
                        }
                    }
                });
            };

            $scope.openSendReferencedModal = function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'account/modals/send-reference-form.html',
                    size: 'lg',
                    controller: 'ControlStepFormCtrl',
                    resolve: {
                        params: function () {
                            return {};
                        }
                    }
                });
            };

            $scope.openSendDeferredModal = function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'account/modals/send-deferred-form.html',
                    size: 'lg',
                    controller: 'ControlStepFormCtrl',
                    resolve: {
                        params: function () {
                            return {};
                        }
                    }
                });
            };

            $scope.openSendSecretModal = function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'account/modals/send-secret-form.html',
                    size: 'lg',
                    controller: 'ControlStepFormCtrl',
                    resolve: {
                        params: function () {
                            return {};
                        }
                    }
                });
            };

            $scope.openApproveControlModal = function (row) {
                var modalInstance = $uibModal.open({
                    animation: false,
                    templateUrl: 'account/modals/control-approve-form.html',
                    controller: 'ControlStepFormCtrl',
                    resolve: {
                        params: function () {
                            return {
                                approve: $scope.data[row],
                            };
                        }
                    }
                });
            };

            $scope.openRemoveControlModal = function () {
                var modalInstance = $uibModal.open({
                    animation: false,
                    templateUrl: 'account/modals/control-remove-form.html',
                    controller: 'ControlStepFormCtrl',
                    resolve: {
                        params: function () {
                            return '';
                        }
                    }
                });
            };

            $scope.openSetAccountControlModal = function (row) {
                var modalInstance = $uibModal.open({
                    animation: false,
                    templateUrl: 'account/modals/set-account-control-form.html',
                    controller: 'ControlStepFormCtrl',
                    resolve: {
                        params: function () {
                            return {};
                        }
                    }
                });
            };

            $scope.openSetAssetControlModal = function (row) {
                var modalInstance = $uibModal.open({
                    animation: false,
                    templateUrl: 'account/modals/control-asset-form.html',
                    controller: 'ControlStepFormCtrl',
                    resolve: {
                        params: function () {
                            return $scope.data[row];
                        }
                    }
                });
            };

            $scope.openSetCurrencyControlModal = function (row) {
                var modalInstance = $uibModal.open({
                    animation: false,
                    templateUrl: 'account/modals/control-currency-form.html',
                    controller: 'ControlStepFormCtrl',
                    resolve: {
                        params: function () {
                            return $scope.data[row];
                        }
                    }
                });
            };

            $scope.dtOptionsControl = DTOptionsBuilder.newOptions().withPaginationType('full_numbers')
                .withDOM('frtip')
                .withOption('info', false)
                .withOption('serverSide', true)
                .withDataProp('data')
                .withOption('responsive', true)
                .withOption('processing', true)
                .withOption('paging', true)
                .withOption('ordering', false)
                .withOption('bFilter', false)
                .withOption('fnRowCallback',
                    function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                        $compile(nRow)($scope);
                    })
                .withOption('ajax', function (data, callback, settings) {
                    var endIndex = data.start + data.length - 1;
                    var accountId = AccountService.getAccountDetailsFromSession('accountId');
                    AccountService.getVoterPhasedTransactions(accountId, data.start, endIndex)
                        .then(function (response) {

                            $scope.data = response.transactions;

                            callback({
                                'iTotalRecords': 1000,
                                'iTotalDisplayRecords': 1000,
                                'data': response.transactions
                            });

                        });
                })
                .withDisplayLength(10).withBootstrap();

            $scope.dtColumnsControl = [

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

                DTColumnBuilder.newColumn('confirmations').withTitle('Conf.').notSortable()
                    .renderWith(function (data, type, row, meta) {
                            return transactionConfFilter(data);
                        }
                    ),

                DTColumnBuilder.newColumn('confirmations').withTitle('Message').notSortable()
                    .renderWith(function (data, type, row, meta) {
                            return isMessageFilter(row.type, row.subtype);
                        }
                    ),

                DTColumnBuilder.newColumn('attachment.phasingFinishHeight').withTitle('Height').notSortable()
                    .renderWith(function (data, type, row, meta) {
                            return data;
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
                        return '<button type="button" class="btn btn-success btn-xs" ng-controller="SearchCtrl"' +
                            ' ng-click="searchValue(\'' + row.fullHash + '\')">' +
                            '<i class="fa fa-list-ul" aria-hidden="true"></i>' + '</button>';

                    }),

                DTColumnBuilder.newColumn('transaction').withTitle('Action').notSortable()
                    .renderWith(function (data, type, row, meta) {

                        return '<button type="button" class="btn btn-danger btn-xs" ng-controller="ControlMainCtrl"' +
                            ' ng-click="openApproveControlModal(\'' + meta.row + '\')">' +
                            '<i class="fa fa-unlock" aria-hidden="true"></i>' + '</button>';
                    }),

            ];

            $scope.reloadControl = function () {
                if ($scope.dtInstanceControl) {
                    $scope.dtInstanceControl._renderer.rerender();
                }

            };

            $scope.dtInstanceCallbackControl = function (_dtInstance) {
                $scope.dtInstanceControl = _dtInstance;
            };

            $scope.hasControl =
                SessionStorageService.getFromSession(controlConfig.SESSION_ACCOUNT_CONTROL_HASCONTROL_KEY);

        }]);

angular.module('account').controller('ControlStepFormCtrl',
    ['$scope', '$uibModalInstance', 'params', function ($scope, $uibModalInstance, params) {

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.$on('close-modal', function () {
            $uibModalInstance.dismiss('cancel');
        });

        var controlApproveSteps = [
            {
                templateUrl: 'account/modals/control-approve-details.html',
                title: 'Approve Controlled Transaction Details',
                controller: 'ControlApproveCtrl',
                isolatedScope: true,
                data: params
            },
            {
                templateUrl: 'account/modals/control-approve-confirm.html',
                title: 'Approve Controlled Transaction Confirm',
                controller: 'ControlApproveCtrl',
                isolatedScope: true,
                data: params
            },
        ];

        var removeAccountControlSteps = [
            {
                templateUrl: 'account/modals/control-remove-details.html',
                title: 'Remove Account Control Details',
                controller: 'RemoveAccountControlCtrl',
                isolatedScope: true,
                data: params
            },
            {
                templateUrl: 'account/modals/control-remove-confirm.html',
                title: 'Remove Account Control Confirmation',
                controller: 'RemoveAccountControlCtrl',
                isolatedScope: true,
                data: params
            },
        ];

        var setAccountControlSteps = [
            {
                templateUrl: 'account/modals/set-account-control-details.html',
                title: 'Set Account Control Details',
                controller: 'SetAccountControlCtrl',
                isolatedScope: true,
                data: params
            },
            {
                templateUrl: 'account/modals/set-account-control-confirm.html',
                title: 'Set Account Control Confirmation',
                controller: 'SetAccountControlCtrl',
                isolatedScope: true,
                data: params
            },
        ];

        var controlAssetSteps = [
            {
                templateUrl: 'account/modals/control-asset-details.html',
                title: 'Set Asset Control Details',
                controller: 'ControlAssetCtrl',
                isolatedScope: true,
                data: params
            },
            {
                templateUrl: 'account/modals/control-asset-confirm.html',
                title: 'Set Asset Control Confirmation',
                controller: 'ControlAssetCtrl',
                isolatedScope: true,
                data: params
            },
        ];

        var controlCurrencySteps = [
            {
                templateUrl: 'account/modals/control-currency-details.html',
                title: 'Set Currency Control Details',
                controller: 'ControlCurrencyCtrl',
                isolatedScope: true,
                data: params
            },
            {
                templateUrl: 'account/modals/control-currency-confirm.html',
                title: 'Set Currency Control Confirmation',
                controller: 'ControlCurrencyCtrl',
                isolatedScope: true,
                data: params
            },
        ];

        var sendDeferredSteps = [
            {
                templateUrl: 'account/modals/send-deferred-details.html',
                title: 'Send Deferred Token Details',
                controller: 'SendDeferredController',
                isolatedScope: true,
                data: params,
            },
            {
                templateUrl: 'account/modals/send-deferred-confirm.html',
                title: 'Send Deferred Token Confirmation',
                controller: 'SendDeferredController',
                isolatedScope: true,
            },
        ];

        var sendReferencedSteps = [
            {
                templateUrl: 'account/modals/send-reference-details.html',
                title: 'Send Reference Token Details',
                controller: 'SendReferencedController',
                isolatedScope: true,
                data: params,
            },
            {
                templateUrl: 'account/modals/send-reference-confirm.html',
                title: 'Send Reference Token Confirmation',
                controller: 'SendReferencedController',
                isolatedScope: true,
            },
        ];

        var sendSecretSteps = [
            {
                templateUrl: 'account/modals/send-secret-details.html',
                title: 'Send Secret Token Details',
                controller: 'SendSecretController',
                isolatedScope: true,
                data: params,
            },
            {
                templateUrl: 'account/modals/send-secret-confirm.html',
                title: 'Send Secret Token Confirmation',
                controller: 'SendSecretController',
                isolatedScope: true,
            },
        ];

        var claimSecretSteps = [
            {
                templateUrl: 'account/modals/claim-secret-details.html',
                title: 'Claim Secret Token Details',
                controller: 'ClaimSecretController',
                isolatedScope: true,
                data: params,
            },
            {
                templateUrl: 'account/modals/claim-secret-confirm.html',
                title: 'Claim Secret Token Confirmation',
                controller: 'ClaimSecretController',
                isolatedScope: true,
            },
        ];


        $scope.steps = {};

        $scope.steps.controlApproveSteps = controlApproveSteps;
        $scope.steps.removeAccountControlForm = removeAccountControlSteps;
        $scope.steps.setAccountControlForm = setAccountControlSteps;
        $scope.steps.controlAssetSteps = controlAssetSteps;
        $scope.steps.controlCurrencySteps = controlCurrencySteps;

        $scope.steps.sendReferencedSteps = sendReferencedSteps;
        $scope.steps.sendDeferredSteps = sendDeferredSteps;
        $scope.steps.sendSecretSteps = sendSecretSteps;
        $scope.steps.claimSecretSteps = claimSecretSteps;


    }]);

angular.module('account').controller('ControlApproveCtrl',
    ['$scope', 'SessionStorageService', 'NodeService', 'loginConfig', 'nodeConfig', 'DTOptionsBuilder',
        'DTColumnBuilder', 'AccountService', '$compile', '$uibModal',
        '$q', 'AlertService', 'alertConfig', 'CryptoService', '$state', '$rootScope', 'multiStepFormScope',
        function ($scope, SessionStorageService, NodeService, loginConfig, nodeConfig, DTOptionsBuilder,
                  DTColumnBuilder, AccountService, $compile, $uibModal,
                  $q, AlertService, alertConfig, CryptoService, $state, $rootScope, multiStepFormScope) {


            $scope.initStep1 = function () {
                var data = $scope.$getActiveStep().data;
                $scope.transaction = data.approve.transaction;
                $scope.fullhash = data.approve.fullHash;
                $scope.sender = data.approve.senderRS;
                $scope.recipient = data.approve.recipientRS;
                $scope.amount = data.approve.amountTQT;
                $scope.timestamp = data.approve.timestamp;
                $scope.type = data.approve.type;
                $scope.subtype = data.approve.subtype;
                $scope.transaction = data.approve.transaction;
                $scope.setApproveTransaction = {};
            };

            $scope.hasPrivateKeyInSession = function () {
                if (SessionStorageService.getFromSession(loginConfig.SESSION_ACCOUNT_PRIVATE_KEY)) {
                    return true;
                }
                return false;
            };

            $scope.confirmControlledTransaction = function () {

                var secret = $scope.setApproveTransaction.secretPhrase;
                var fullhash = $scope.fullhash;
                var fee = 1;

                var accountPublicKey = AccountService.getAccountDetailsFromSession('publicKey');
                var secretPhraseHex;

                if (secret) {
                    secretPhraseHex = CryptoService.secretPhraseToPrivateKey(secret);
                } else {
                    secretPhraseHex =
                        SessionStorageService.getFromSession(loginConfig.SESSION_ACCOUNT_PRIVATE_KEY);
                }

                $scope.controlApprovePromise=AccountService.approveTransactions(accountPublicKey, fullhash, fee).then(function (success) {

                    if (!success.errorCode) {
                        var unsignedBytes = success.unsignedTransactionBytes;
                        var signatureHex = CryptoService.signatureHex(unsignedBytes, secretPhraseHex);
                        $scope.transactionBytes = CryptoService.signTransactionHex(unsignedBytes, signatureHex);
                        $scope.transactionJSON = success.transactionJSON;
                        $scope.validBytes = true;

                    } else {
                        AlertService.addAlert(
                            {
                                type: 'danger',
                                msg: 'Sorry, an error occured! Reason: ' + success.errorDescription
                            }, alertConfig.controlApproveModalAlert
                        );
                    }
                }, function (error) {
                    AlertService.addAlert(AlertService.getNoConnectionMessage(error),
                        alertConfig.controlApproveModalAlert);
                });

                $scope.broadcastTransaction = function (transactionBytes) {
                    $scope.controlApprovePromise=AccountService.broadcastTransaction(transactionBytes).then(function (success) {
                        if (!success.errorCode) {
                            AlertService.addAlert(
                                {
                                    type: 'success',
                                    msg: 'Transaction succesfull broadcasted with id : ' + success.transaction
                                });

                            $scope.$emit('close-modal');
                            // $state.go('client.signedin.account.pending');
                            $rootScope.$broadcast('reload-dashboard');

                        } else {
                            AlertService.addAlert(
                                {
                                    type: 'danger',
                                    msg: 'Unable to broadcast transaction. Reason : ' + success.errorDescription
                                });
                        }
                    }, function (error) {
                        AlertService.addAlert(AlertService.getNoConnectionMessage(error),
                            alertConfig.controlApproveModalAlert);
                    });
                };
            };
        }]);

angular.module('account').controller('ControlAccountCtrl',
    ['$scope', 'SessionStorageService', 'NodeService', 'loginConfig', 'nodeConfig', 'DTOptionsBuilder',
        'DTColumnBuilder', 'AccountService', '$compile', '$uibModal',
        '$q', 'AlertService', 'alertConfig', 'CryptoService', '$state', '$rootScope',
        function ($scope, SessionStorageService, NodeService, loginConfig, nodeConfig, DTOptionsBuilder,
                  DTColumnBuilder, AccountService, $compile, $uibModal,
                  $q, AlertService, alertConfig, CryptoService, $state, $rootScope) {


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

            $scope.hasPrivateKeyInSession = function () {
                if (SessionStorageService.getFromSession(loginConfig.SESSION_ACCOUNT_PRIVATE_KEY)) {
                    return true;
                }
                return false;
            };


        }]);

angular.module('account').controller('ControlAssetCtrl',
    ['$scope', 'SessionStorageService', 'NodeService', 'loginConfig', 'nodeConfig', 'DTOptionsBuilder',
        'DTColumnBuilder', 'AccountService', '$compile', '$uibModal',
        '$q', 'AlertService', 'alertConfig', 'CryptoService', '$state', '$rootScope',
        function ($scope, SessionStorageService, NodeService, loginConfig, nodeConfig, DTOptionsBuilder,
                  DTColumnBuilder, AccountService, $compile, $uibModal,
                  $q, AlertService, alertConfig, CryptoService, $state, $rootScope) {


            $scope.hasPrivateKeyInSession = function () {
                if (SessionStorageService.getFromSession(loginConfig.SESSION_ACCOUNT_PRIVATE_KEY)) {
                    return true;
                }
                return false;
            };


        }]);

angular.module('account').controller('ControlCurrencyCtrl',
    ['$scope', 'SessionStorageService', 'NodeService', 'loginConfig', 'nodeConfig', 'DTOptionsBuilder',
        'DTColumnBuilder', 'AccountService', '$compile', '$uibModal',
        '$q', 'AlertService', 'alertConfig', 'CryptoService', '$state', '$rootScope',
        function ($scope, SessionStorageService, NodeService, loginConfig, nodeConfig, DTOptionsBuilder,
                  DTColumnBuilder, AccountService, $compile, $uibModal,
                  $q, AlertService, alertConfig, CryptoService, $state, $rootScope) {


            $scope.hasPrivateKeyInSession = function () {
                if (SessionStorageService.getFromSession(loginConfig.SESSION_ACCOUNT_PRIVATE_KEY)) {
                    return true;
                }
                return false;
            };


        }]);

angular.module('account').controller('SendDeferredController',
    ['$scope', 'AccountService', 'SessionStorageService', '$state', 'CryptoService', 'loginConfig',
        'AlertService', 'alertConfig', '$validation', '$uibModal', 'multiStepFormScope', 'FeeService', '$rootScope',
        'amountToQuantFilter', 'CurrenciesService', 'OptionsService',
        function ($scope, AccountService, SessionStorageService, $state, CryptoService,
                  loginConfig, AlertService, alertConfig, $validation, $uibModal, multiStepFormScope, FeeService,
                  $rootScope, amountToQuantFilter, CurrenciesService, OptionsService) {

            $scope.sendDeferredForm = angular.copy(multiStepFormScope.sendDeferredForm);
            $scope.validForm = false;
            $scope.validBytes = false;
            $scope.hasPublicKeyAdded = false;
            $scope.hasMessageAdded = false;

            $scope.$on('$destroy', function () {
                multiStepFormScope.sendDeferredForm = angular.copy($scope.sendDeferredForm);
            });

            $scope.initStep1 = function () {
                var data = $scope.$getActiveStep().data || {};
                if (data.recipient) {
                    $scope.sendDeferredForm.recipientRS = data.recipient;
                }
            };

            $scope.getBlockChainStatus = function () {
                CurrenciesService.getBlockChainStatus().then(function (success) {
                    $scope.sendDeferredForm.currentHeight = success.numberOfBlocks;
                });
            };

            $scope.deferredHeight = 1440;
            $scope.days = 1;

            $scope.increment = function () {
                if ($scope.deferredHeight >= 14400) {
                    $scope.deferredHeight = 14400;
                    return;
                } else {
                    $scope.deferredHeight = $scope.deferredHeight + 1440;
                }

                $scope.sendDeferredForm.deferredHeight = $scope.deferredHeight;
                $scope.days = parseInt($scope.deferredHeight / 1440);
            };

            $scope.decrement = function () {
                if ($scope.deferredHeight <= 1440) {
                    $scope.deferredHeight = 1440;
                    return;
                } else {
                    $scope.deferredHeight = $scope.deferredHeight - 1440;
                }

                $scope.sendDeferredForm.deferredHeight = $scope.deferredHeight;
                $scope.days = parseInt($scope.deferredHeight / 1440);
            };

            $scope.max = function () {
                $scope.deferredHeight = 14400;
                $scope.sendDeferredForm.deferredHeight = 14400;

                $scope.days = parseInt($scope.deferredHeight / 1440);

            };

            $scope.min = function () {
                $scope.deferredHeight = 1440;
                $scope.sendDeferredForm.deferredHeight = 1440;
                $scope.days = parseInt($scope.deferredHeight / 1440);
            };

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
                    $scope.sendDeferredForm.recipientRS = result.accountRS;
                });
            };

            $scope.hasPrivateKeyInSession = function () {
                if (SessionStorageService.getFromSession(loginConfig.SESSION_ACCOUNT_PRIVATE_KEY)) {
                    return true;
                }
                return false;
            };

            var createAndSignTransaction = function (transactionOptions, secretPhraseHex) {
                $scope.sendDeferedPromise=AccountService.createPhasedTransaction(
                    transactionOptions
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
                            }, alertConfig.sendTokenModalAlert
                        );
                    }
                }, function (error) {
                    AlertService.addAlert(AlertService.getNoConnectionMessage(error),
                        alertConfig.sendTokenModalAlert);
                });
            };

            $scope.getAndVerifyAccount = function (sendTokenForm) {

                var sendForm = multiStepFormScope.sendDeferredForm;

                var recipientRS = sendForm.recipientRS;
                var amount = amountToQuantFilter(sendForm.amount);
                var fee = 1; //sendForm.fee;
                var secret = sendForm.secretPhrase;

                var message = sendForm.message;
                var pubkey = sendForm.pubkey;

                var cuurHeight = parseInt(sendForm.currentHeight);
                var defOffset = parseInt(sendForm.deferredHeight);
                var deferredBlocks = cuurHeight + defOffset;

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

                $scope.sendDeferedPromise=AccountService.getAccountDetails(recipientRS).then(function (success) {

                    var recipientPublicKey = success.publicKey;

                    if (!recipientPublicKey && hasPublicKeyAdded) {
                        recipientPublicKey = pubkey;
                    }

                    if (!success.errorCode || success.errorCode === 5) {

                        $scope.accountDetails = success;

                        if (!recipientPublicKey && !hasPublicKeyAdded && hasMessageAdded) {
                            AlertService.addAlert(
                                {
                                    type: 'danger',
                                    msg: 'Sorry, an error occured! Reason: This account has no visible public key because it never had any outbound transaction. Encrypted messages are not available without a public key. Ask the account holder for his public key and add the key on the former page to this transaction.'
                                }, alertConfig.sendTokenModalAlert
                            );
                            return;
                        }

                        if (!recipientPublicKey && !hasPublicKeyAdded) {
                            AlertService.addAlert(
                                {
                                    type: 'info',
                                    msg: 'Note: This account never had an outbound transaction. Make sure this account is the right one. In doubt, ask the account holder for his public key and add it on the former page to this transaction.'
                                }, alertConfig.sendTokenModalAlert
                            );
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
                            'requestType': 'sendToken',
                            'publicKey': senderPublicKey,
                            'recipient': recipientRS,
                            'amountTQT': amount,
                            'feeTQT': fee,
                            'deadline': OptionsService.getOption('DEADLINE'), // $rootScope.options.DEADLINE,
                            'broadcast': false,
                            'recipientPublicKey': recipientPublicKey,

                            'messageToEncryptIsText': 'true',
                            'compressMessageToEncrypt': 'true',
                            'encryptedMessageIsPrunable': false,
                            'encryptedMessageData': encrypted.data,
                            'encryptedMessageNonce': encrypted.nonce,

                            'phased': true,
                            'phasingFinishHeight': deferredBlocks,
                            'phasingVotingModel': -1,
                            'phasingQuorum': 0,

                            'phasingMinBalance': 0,
                            'phasingMinBalanceModel': 0,
                            'phasingHolding': null,
                            'phasingLinkedFullHash': null,
                            'phasingHashedSecret': null,
                            'phasingHashedSecretAlgorithm': null


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
                            }, alertConfig.sendTokenModalAlert
                        );
                    }
                }, function (error) {
                    AlertService.addAlert(AlertService.getNoConnectionMessage(error),
                        alertConfig.sendTokenModalAlert);
                });
            };

            $scope.broadcastTransaction = function (transactionBytes) {
                $scope.sendDeferedPromise=AccountService.broadcastTransaction(transactionBytes).then(function (success) {
                    if (!success.errorCode) {
                        AlertService.addAlert(
                            {
                                type: 'success',
                                msg: 'Transaction succesfull broadcasted with Id : ' + success.transaction +
                                ''
                            });
                        $scope.$emit('close-modal');
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
                        alertConfig.sendTokenModalAlert);
                });
            };

        }]);

angular.module('account').controller('SendReferencedController',
    ['$scope', 'AccountService', 'SessionStorageService', '$state', 'CryptoService', 'loginConfig',
        'AlertService', 'alertConfig', '$validation', '$uibModal', 'multiStepFormScope', 'FeeService', '$rootScope',
        'amountToQuantFilter', 'CurrenciesService', 'OptionsService',
        function ($scope, AccountService, SessionStorageService, $state, CryptoService,
                  loginConfig, AlertService, alertConfig, $validation, $uibModal, multiStepFormScope, FeeService,
                  $rootScope, amountToQuantFilter, CurrenciesService, OptionsService) {

            $scope.sendReferencedForm = angular.copy(multiStepFormScope.sendReferencedForm);
            $scope.validForm = false;
            $scope.validBytes = false;
            $scope.hasPublicKeyAdded = false;
            $scope.hasMessageAdded = false;

            $scope.$on('$destroy', function () {
                multiStepFormScope.sendReferencedForm = angular.copy($scope.sendReferencedForm);
            });

            $scope.initStep1 = function () {
                var data = $scope.$getActiveStep().data || {};
                if (data.recipient) {
                    $scope.sendReferencedForm.recipientRS = data.recipient;
                }
            };

            $scope.getBlockChainStatus = function () {
                CurrenciesService.getBlockChainStatus().then(function (success) {
                    $scope.sendReferencedForm.currentHeight = success.numberOfBlocks;
                });
            };

            $scope.deferredHeight = 1440;
            $scope.days = 1;

            $scope.increment = function () {
                if ($scope.deferredHeight >= 14400) {
                    $scope.deferredHeight = 14400;
                    return;
                } else {
                    $scope.deferredHeight = $scope.deferredHeight + 1440;
                }

                $scope.sendReferencedForm.deferredHeight = $scope.deferredHeight;
                $scope.days = parseInt($scope.deferredHeight / 1440);
            };

            $scope.decrement = function () {
                if ($scope.deferredHeight <= 1440) {
                    $scope.deferredHeight = 1440;
                    return;
                } else {
                    $scope.deferredHeight = $scope.deferredHeight - 1440;
                }

                $scope.sendReferencedForm.deferredHeight = $scope.deferredHeight;
                $scope.days = parseInt($scope.deferredHeight / 1440);
            };

            $scope.max = function () {
                $scope.deferredHeight = 14400;
                $scope.sendReferencedForm.deferredHeight = 14400;

                $scope.days = parseInt($scope.deferredHeight / 1440);

            };

            $scope.min = function () {
                $scope.deferredHeight = 1440;
                $scope.sendReferencedForm.deferredHeight = 1440;
                $scope.days = parseInt($scope.deferredHeight / 1440);
            };

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
                    $scope.sendReferencedForm.recipientRS = result.accountRS;
                });
            };

            $scope.hasPrivateKeyInSession = function () {
                if (SessionStorageService.getFromSession(loginConfig.SESSION_ACCOUNT_PRIVATE_KEY)) {
                    return true;
                }
                return false;
            };

            var createAndSignTransaction = function (transactionOptions, secretPhraseHex) {
                $scope.sendReferencePromise=AccountService.createPhasedTransaction(
                    transactionOptions
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
                            }, alertConfig.sendTokenModalAlert
                        );
                    }
                }, function (error) {
                    AlertService.addAlert(AlertService.getNoConnectionMessage(error),
                        alertConfig.sendTokenModalAlert);
                });
            };

            $scope.getAndVerifyAccount = function (sendTokenForm) {

                var sendForm = multiStepFormScope.sendReferencedForm;

                var recipientRS = sendForm.recipientRS;
                var amount = amountToQuantFilter(sendForm.amount);
                var fee = 1;
                var secret = sendForm.secretPhrase;

                var fullHash = sendForm.fullHash;

                var message = sendForm.message;
                var pubkey = sendForm.pubkey;

                var cuurHeight = parseInt(sendForm.currentHeight);
                var defOffset = parseInt(sendForm.deferredHeight);
                var deferredBlocks = cuurHeight + defOffset;

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

                $scope.sendReferencePromise=AccountService.getAccountDetails(recipientRS).then(function (success) {

                    var recipientPublicKey = success.publicKey;

                    if (!recipientPublicKey && hasPublicKeyAdded) {
                        recipientPublicKey = pubkey;
                    }

                    if (!success.errorCode || success.errorCode === 5) {

                        $scope.accountDetails = success;

                        if (!recipientPublicKey && !hasPublicKeyAdded && hasMessageAdded) {
                            AlertService.addAlert(
                                {
                                    type: 'danger',
                                    msg: 'Sorry, an error occured! Reason: This account has no visible public key because it never had any outbound transaction. Encrypted messages are not available without a public key. Ask the account holder for his public key and add the key on the former page to this transaction'
                                }, alertConfig.sendTokenModalAlert
                            );
                            return;
                        }

                        if (!recipientPublicKey && !hasPublicKeyAdded) {
                            AlertService.addAlert(
                                {
                                    type: 'info',
                                    msg: 'Note: This account never had an outbound transaction. Make sure this account is the right one. In doubt, ask the account holder for his public key and add it on the former page to this transaction.'
                                }, alertConfig.sendTokenModalAlert
                            );
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
                            'requestType': 'sendToken',
                            'publicKey': senderPublicKey,
                            'recipient': recipientRS,
                            'amountTQT': amount,
                            'feeTQT': fee,
                            'deadline': OptionsService.getOption('DEADLINE'),
                            'broadcast': false,
                            'recipientPublicKey': recipientPublicKey,

                            'messageToEncryptIsText': 'true',
                            'compressMessageToEncrypt': 'true',
                            'encryptedMessageIsPrunable': false,
                            'encryptedMessageData': encrypted.data,
                            'encryptedMessageNonce': encrypted.nonce,

                            'phased': true,
                            'phasingFinishHeight': deferredBlocks,
                            'phasingVotingModel': 4,
                            'phasingQuorum': 1,

                            'phasingMinBalance': 0,
                            'phasingMinBalanceModel': 0,
                            'phasingHolding': null,
                            'phasingLinkedFullHash': fullHash,
                            'phasingHashedSecret': null,
                            'phasingHashedSecretAlgorithm': null

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
                            }, alertConfig.sendTokenModalAlert
                        );
                    }
                }, function (error) {
                    AlertService.addAlert(AlertService.getNoConnectionMessage(error),
                        alertConfig.sendTokenModalAlert);
                });
            };

            $scope.broadcastTransaction = function (transactionBytes) {
                $scope.sendReferencePromise=AccountService.broadcastTransaction(transactionBytes).then(function (success) {
                    if (!success.errorCode) {
                        AlertService.addAlert(
                            {
                                type: 'success',
                                msg: 'Transaction succesfull broadcasted with Id : ' + success.transaction +
                                ''
                            });
                        $scope.$emit('close-modal');
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
                        alertConfig.sendTokenModalAlert);
                });
            };

        }]);

angular.module('account').controller('SendSecretController',
    ['$scope', 'AccountService', 'SessionStorageService', '$state', 'CryptoService', 'loginConfig',
        'AlertService', 'alertConfig', '$validation', '$uibModal', 'multiStepFormScope', 'FeeService', '$rootScope',
        'amountToQuantFilter', 'CurrenciesService', 'OptionsService',
        function ($scope, AccountService, SessionStorageService, $state, CryptoService,
                  loginConfig, AlertService, alertConfig, $validation, $uibModal, multiStepFormScope, FeeService,
                  $rootScope, amountToQuantFilter, CurrenciesService, OptionsService) {

            $scope.sendSecretForm = angular.copy(multiStepFormScope.sendSecretForm);
            $scope.validForm = false;
            $scope.validBytes = false;
            $scope.hasPublicKeyAdded = false;
            $scope.hasMessageAdded = false;

            $scope.$on('$destroy', function () {
                multiStepFormScope.sendSecretForm = angular.copy($scope.sendSecretForm);
            });

            $scope.initStep1 = function () {
                var data = $scope.$getActiveStep().data || {};
                if (data.recipient) {
                    $scope.sendSecretForm.recipientRS = data.recipient;
                }
            };

            $scope.getBlockChainStatus = function () {
                CurrenciesService.getBlockChainStatus().then(function (success) {
                    $scope.sendSecretForm.currentHeight = success.numberOfBlocks;
                });
            };

            $scope.deferredHeight = 1440;
            $scope.days = 1;

            $scope.increment = function () {
                if ($scope.deferredHeight >= 14400) {
                    $scope.deferredHeight = 14400;
                    return;
                } else {
                    $scope.deferredHeight = $scope.deferredHeight + 1440;
                }

                $scope.sendSecretForm.deferredHeight = $scope.deferredHeight;
                $scope.days = parseInt($scope.deferredHeight / 1440);
            };

            $scope.decrement = function () {
                if ($scope.deferredHeight <= 1440) {
                    $scope.deferredHeight = 1440;
                    return;
                } else {
                    $scope.deferredHeight = $scope.deferredHeight - 1440;
                }

                $scope.sendSecretForm.deferredHeight = $scope.deferredHeight;
                $scope.days = parseInt($scope.deferredHeight / 1440);
            };

            $scope.max = function () {
                $scope.deferredHeight = 14400;
                $scope.sendSecretForm.deferredHeight = 14400;

                $scope.days = parseInt($scope.deferredHeight / 1440);

            };

            $scope.min = function () {
                $scope.deferredHeight = 1440;
                $scope.sendSecretForm.deferredHeight = 1440;
                $scope.days = parseInt($scope.deferredHeight / 1440);
            };

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
                    $scope.sendSecretForm.recipientRS = result.accountRS;
                });
            };

            $scope.hasPrivateKeyInSession = function () {
                if (SessionStorageService.getFromSession(loginConfig.SESSION_ACCOUNT_PRIVATE_KEY)) {
                    return true;
                }
                return false;
            };

            var createAndSignTransaction = function (transactionOptions, secretPhraseHex) {
                $scope.sendSecretPromise=AccountService.createPhasedTransaction(
                    transactionOptions
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
                            }, alertConfig.sendTokenModalAlert
                        );
                    }
                }, function (error) {
                    AlertService.addAlert(AlertService.getNoConnectionMessage(error),
                        alertConfig.sendTokenModalAlert);
                });
            };

            $scope.getAndVerifyAccount = function (sendTokenForm) {

                var sendForm = multiStepFormScope.sendSecretForm;

                var recipientRS = sendForm.recipientRS;
                var amount = amountToQuantFilter(sendForm.amount);
                var fee = 1;
                var secret = sendForm.secretPhrase;

                var secretHash = sendForm.secretHash;

                var message = sendForm.message;
                var pubkey = sendForm.pubkey;

                var cuurHeight = parseInt(sendForm.currentHeight);
                var defOffset = parseInt(sendForm.deferredHeight);
                var deferredBlocks = cuurHeight + defOffset;

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

                $scope.sendSecretPromise=AccountService.getAccountDetails(recipientRS).then(function (success) {

                    var recipientPublicKey = success.publicKey;

                    if (!recipientPublicKey && hasPublicKeyAdded) {
                        recipientPublicKey = pubkey;
                    }

                    if (!success.errorCode || success.errorCode === 5) {

                        $scope.accountDetails = success;

                        if (!recipientPublicKey && !hasPublicKeyAdded && hasMessageAdded) {
                            AlertService.addAlert(
                                {
                                    type: 'danger',
                                    msg: 'Sorry, an error occured! Reason: This account has no visible public key because it never had any outbound transaction. Encrypted messages are not available without a public key. Ask the account holder for his public key and add the key on the former page to this transaction'
                                }, alertConfig.sendTokenModalAlert
                            );
                            return;
                        }

                        if (!recipientPublicKey && !hasPublicKeyAdded) {
                            AlertService.addAlert(
                                {
                                    type: 'info',
                                    msg: 'Note: This account never had an outbound transaction. Make sure this account is the right one. In doubt, ask the account holder for his public key and add it on the former page to this transaction.'
                                }, alertConfig.sendTokenModalAlert
                            );
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
                            'requestType': 'sendToken',
                            'publicKey': senderPublicKey,
                            'recipient': recipientRS,
                            'amountTQT': amount,
                            'feeTQT': fee,
                            'deadline': OptionsService.getOption('DEADLINE'), 
                            'broadcast': false,
                            'recipientPublicKey': recipientPublicKey,

                            'messageToEncryptIsText': 'true',
                            'compressMessageToEncrypt': 'true',
                            'encryptedMessageIsPrunable': false,
                            'encryptedMessageData': encrypted.data,
                            'encryptedMessageNonce': encrypted.nonce,

                            'phased': true,
                            'phasingFinishHeight': deferredBlocks,
                            'phasingVotingModel': 5,
                            'phasingQuorum': 1,

                            'phasingMinBalance': 0,
                            'phasingMinBalanceModel': 0,
                            'phasingHolding': null,
                            'phasingLinkedFullHash': null,
                            'phasingHashedSecret': secretHash,
                            'phasingHashedSecretAlgorithm': 2

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
                            }, alertConfig.sendTokenModalAlert
                        );
                    }
                }, function (error) {
                    AlertService.addAlert(AlertService.getNoConnectionMessage(error),
                        alertConfig.sendTokenModalAlert);
                });
            };

            $scope.broadcastTransaction = function (transactionBytes) {
                $scope.sendSecretPromise=AccountService.broadcastTransaction(transactionBytes).then(function (success) {
                    if (!success.errorCode) {
                        AlertService.addAlert(
                            {
                                type: 'success',
                                msg: 'Transaction succesfull broadcasted with Id : ' + success.transaction +
                                ''
                            });
                        $scope.$emit('close-modal');
                        //  $state.go('client.signedin.account.pending');

                    } else {
                        AlertService.addAlert(
                            {
                                type: 'danger',
                                msg: 'Unable to broadcast transaction. Reason: ' + success.errorDescription
                            });
                    }

                }, function (error) {
                    AlertService.addAlert(AlertService.getNoConnectionMessage(error),
                        alertConfig.deleteCurrencyModalAlert);
                });
            };

        }]);

angular.module('account').controller('ClaimSecretController',
    ['$scope', 'AccountService', 'SessionStorageService', '$state', 'CryptoService', 'loginConfig',
        'AlertService', 'alertConfig', '$validation', '$uibModal', 'multiStepFormScope', 'FeeService', '$rootScope',
        'amountToQuantFilter', 'CurrenciesService',
        function ($scope, AccountService, SessionStorageService, $state, CryptoService,
                  loginConfig, AlertService, alertConfig, $validation, $uibModal, multiStepFormScope, FeeService,
                  $rootScope, amountToQuantFilter, CurrenciesService) {

            $scope.validBytes = false;

            $scope.claimSeceretForm = {};

            $scope.hasPrivateKeyInSession = function () {
                if (SessionStorageService.getFromSession(loginConfig.SESSION_ACCOUNT_PRIVATE_KEY)) {
                    return true;
                }
                return false;
            };

            $scope.confirmControlledTransaction = function (fullHash, secretText) {

                var fee = 1;

                var accountPublicKey = AccountService.getAccountDetailsFromSession('publicKey');
                var secretPhraseHex = SessionStorageService.getFromSession(loginConfig.SESSION_ACCOUNT_PRIVATE_KEY);

                $scope.claimSecretPromise=AccountService.approveTransactions(accountPublicKey, fullHash, fee, secretText)
                    .then(function (success) {

                        if (!success.errorCode) {
                            var unsignedBytes = success.unsignedTransactionBytes;
                            var signatureHex = CryptoService.signatureHex(unsignedBytes, secretPhraseHex);
                            $scope.transactionBytes = CryptoService.signTransactionHex(unsignedBytes, signatureHex);
                            $scope.transactionJSON = success.transactionJSON;
                            $scope.validBytes = true;

                        } else {
                            AlertService.addAlert(
                                {
                                    type: 'danger',
                                    msg: 'Sorry, an error occured! Reason: ' + success.errorDescription
                                }, alertConfig.claimSecretTransaction
                            );
                        }
                    }, function (error) {
                        AlertService.addAlert(AlertService.getNoConnectionMessage(error),
                            alertConfig.claimSecretTransaction);
                    });

                $scope.broadcastTransaction = function (transactionBytes) {
                    $scope.claimSecretPromise= AccountService.broadcastTransaction(transactionBytes).then(function (success) {
                        if (!success.errorCode) {
                            AlertService.addAlert(
                                {
                                    type: 'success',
                                    msg: 'Transaction succesfull broadcasted with id : ' + success.transaction
                                });

                            $scope.$emit('close-modal');
                            //$state.go('client.signedin.account.pending');
                            $rootScope.$broadcast('reload-dashboard');

                        } else {
                            AlertService.addAlert(
                                {
                                    type: 'danger',
                                    msg: 'Unable to broadcast transaction. Reason : ' + success.errorDescription
                                });
                        }
                    }, function (error) {
                        AlertService.addAlert(AlertService.getNoConnectionMessage(error),
                            alertConfig.claimSecretTransaction);
                    });
                };
            };


        }]);
