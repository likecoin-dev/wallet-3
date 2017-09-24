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

angular.module('messages').controller('MessagesCtrl',
    ['$scope', 'SessionStorageService', 'NodeService', 'loginConfig', 'nodeConfig', 'DTOptionsBuilder',
        'DTColumnBuilder', 'MessageService', 'timestampFilter', 'amountTQTFilter', '$compile',
        'transactionIconSubTypeFilter',
        'transactionConfFilter', 'transactionTypeFilter', 'searchTermFilter', 'baseConfig', 'isEnabledFilter',
        'isMessageFilter', 'hasMessageFilter', 'CommonsService', 'hasMessageDirectionFilter', '$uibModal',
        function ($scope, SessionStorageService, NodeService, loginConfig, nodeConfig, DTOptionsBuilder,
                  DTColumnBuilder, MessageService, timestampFilter, amountTQTFilter, $compile,
                  transactionIconSubTypeFilter,
                  transactionConfFilter, transactionTypeFilter, searchTermFilter, baseConfig, isEnabledFilter,
                  isMessageFilter, hasMessageFilter, CommonsService, hasMessageDirectionFilter, $uibModal) {


            $scope.filter_type = '';
            $scope.filter_subtype = '';

            $scope.filterMessage = function () {
                $scope.filter_type = '1';
                $scope.filter_subtype = '0';
                $scope.reloadMessages();
            };

            $scope.filterPayment = function () {
                $scope.filter_type = '0';
                $scope.filter_subtype = '';
                $scope.reloadMessages();
            };

            $scope.filterNone = function () {
                $scope.filter_type = '';
                $scope.filter_subtype = '';
                $scope.reloadMessages();
            };

            $scope.dtOptionsMessages = DTOptionsBuilder.newOptions().withPaginationType('full_numbers')
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
                    var account = CommonsService.getAccountDetailsFromSession('accountId');
                    MessageService.getMessages(
                        account,
                        data.start,
                        endIndex,
                        $scope.filter_type,
                        $scope.filter_subtype
                    )
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

            $scope.dtColumnsMessages = [

                DTColumnBuilder.newColumn('transaction').withTitle('Details').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return '<button type="button" class="btn btn-success btn-xs" ng-controller="SearchCtrl"' +
                            ' ng-click="searchValue(\'' + row.fullHash + '\')">' +
                            '<i class="fa fa-list-ul" aria-hidden="true" style="width:15px;"></i>' + '</button>';

                    }),

                DTColumnBuilder.newColumn('timestamp').withTitle('Date').notSortable()
                    .renderWith(function (data, type, row, meta) {
                            return timestampFilter(data);
                        }
                    ),

                DTColumnBuilder.newColumn('type').withTitle('Type').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return transactionIconSubTypeFilter(data, row.subtype);
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

                DTColumnBuilder.newColumn('phased').withTitle('Send').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        var accountRS = CommonsService.getAccountDetailsFromSession('accountRs');
                        return hasMessageDirectionFilter(row, accountRS);
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

                DTColumnBuilder.newColumn('recipientRS').withTitle('Action').notSortable()
                    .renderWith(function (data, type, row, meta) {

                        var accountRS = CommonsService.getAccountDetailsFromSession('accountRs');

                        var reply_tag = false;
                        var replyAddress = data;

                        if (accountRS === row.senderRS) {
                            reply_tag = true;
                        } else {
                            replyAddress = row.senderRS;
                        }

                        var tt_read = ' popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover=' +
                            ' "Open Message"';

                        var tt_reply = ' popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover=' +
                            ' "Reply"';

                        var action1 = '<button class="btn btn-success btn-xs" ' + tt_read + ' ng-controller="MessagesCtrl"' +
                            ' ng-click="openReadMessageModal(\'' + meta.row + '\')">' +
                            ' <i class="fa fa-envelope-open-o" aria-hidden="true" style="width:15px;"></i>' + '</button>' + '&nbsp;';

                        var action2 = '&nbsp;' +
                            '<button  class="btn btn-default btn-xs" ' + tt_reply + ' ng-controller="MessagesCtrl" ng-disabled="' + reply_tag + '"' +
                            ' ng-click="openSendMessageModal(\'' + replyAddress + '\')">' +
                            ' <i class="fa fa-reply" aria-hidden="true" style="width:15px;"></i> ' + '</button>';

                        return action1 + action2;

                    }),
            ];

            $scope.openSendMessageModal = function (data) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'messages/modals/send-message-form.html',
                    size: 'lg',
                    controller: 'StepMessageFormCtrl',
                    resolve: {
                        params: function () {
                            return {
                                'recipientRS': data
                            };
                        }
                    }
                });
            };

            $scope.openReadMessageModal = function (row) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'messages/modals/read-message-form.html',
                    size: 'lg',
                    controller: 'StepMessageFormCtrl',
                    resolve: {
                        params: function () {
                            return $scope.data[row];
                        }
                    }
                });
            };

            $scope.reloadMessages = function () {
                if ($scope.dtInstanceMessages) {
                    $scope.dtInstanceMessages._renderer.rerender();
                }
            };

            $scope.dtInstanceMessagesCallback = function (_dtInstance) {
                $scope.dtInstanceMessages = _dtInstance;
            };


        }]);

angular.module('messages').controller('StepMessageFormCtrl',
    ['$scope', '$uibModalInstance', 'params', function ($scope, $uibModalInstance, params) {

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.$on('close-modal', function () {
            $uibModalInstance.dismiss('cancel');
        });

        var sendMessageSteps = [
            {
                templateUrl: 'messages/modals/send-message-details.html',
                title: 'Send Message Details',
                controller: 'SendMessageFormCtrl',
                isolatedScope: true,
                data: params
            },
            {
                templateUrl: 'messages/modals/send-message-confirm.html',
                title: 'Send Message Confirmation',
                controller: 'SendMessageFormCtrl',
                isolatedScope: true,
            },
        ];

        var readMessageSteps = [
            {
                templateUrl: 'messages/modals/read-message-details.html',
                title: 'Read Message Details',
                controller: 'ReadMessageFormCtrl',
                isolatedScope: true,
                data: params
            },
            {
                templateUrl: 'messages/modals/read-message-confirm.html',
                title: 'Reply Message Confirmation',
                controller: 'ReadMessageFormCtrl',
                isolatedScope: true,
            },
        ];

        $scope.steps = {};

        $scope.steps.sendMessageForm = sendMessageSteps;
        $scope.steps.readMessageForm = readMessageSteps;

    }]);

angular.module('messages').controller('SendMessageFormCtrl',
    ['$scope', 'MessageService', 'SessionStorageService', '$state', 'CryptoService', 'loginConfig',
        'AlertService', 'alertConfig', '$validation', '$uibModal', 'multiStepFormScope', 'FeeService', '$rootScope',
        function ($scope, MessageService, SessionStorageService, $state, CryptoService, loginConfig,
                  AlertService, alertConfig, $validation, $uibModal, multiStepFormScope, FeeService, $rootScope) {

            $scope.sendMessageForm = angular.copy(multiStepFormScope.sendMessageForm);
            $scope.validForm = false;
            $scope.validBytes = false;
            $scope.hasPublicKeyAdded = false;
            $scope.hasMessageAdded = false;

            $scope.initStep1 = function () {
                var data = $scope.$getActiveStep().data;
                if (data.recipientRS) {
                    $scope.sendMessageForm.recipientRS = data.recipientRS;
                }
            };

            $scope.$on('$destroy', function () {
                multiStepFormScope.sendMessageForm = angular.copy($scope.sendMessageForm);
            });

            $scope.$watchCollection('sendMessageForm', function (sendMessageForm) {
                var totalFee = FeeService.getSetAccountFee(sendMessageForm.message);
                if (!$scope.sendMessageForm.fee || $scope.sendMessageForm.fee < totalFee) {
                    $scope.sendMessageForm.fee = totalFee;
                }
            });

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
                    $scope.sendMessageForm.recipientRS = result.accountRS;
                });
            };

            $scope.hasPrivateKeyInSession = function () {
                if (SessionStorageService.getFromSession(loginConfig.SESSION_ACCOUNT_PRIVATE_KEY)) {
                    return true;
                }
                return false;
            };

            var createAndSignTransaction = function (transactionOptions, secretPhraseHex) {
                $scope.sendMessagePromise = MessageService.sendMessage(
                    transactionOptions.senderPublicKey,
                    transactionOptions.recipientRS,
                    1,
                    transactionOptions.data,
                    transactionOptions.nonce,
                    transactionOptions.recipientPublicKey
                ).then(function (success) {
                    if (!success.errorCode) {
                        var unsignedBytes = success.unsignedTransactionBytes;
                        var signatureHex = CryptoService.signatureHex(unsignedBytes, secretPhraseHex);
                        var transactionBytes = CryptoService.signTransactionHex(unsignedBytes, signatureHex);

                        $scope.transactionBytes = transactionBytes;

                        $scope.tx_fee = success.transactionJSON.feeTQT / 100000000;
                        $scope.tx_amount = success.transactionJSON.amountTQT / 100000000;
                        $scope.tx_total = $scope.tx_fee + $scope.tx_amount;

                        $scope.validBytes = true;

                        return transactionBytes;
                    } else {
                        AlertService.addAlert(
                            {
                                type: 'danger',
                                msg: 'Sorry, an error occured! Reason: ' + success.errorDescription
                            }, alertConfig.sendMessageModalAlert
                        );
                    }
                }, function (error) {
                    AlertService.addAlert(AlertService.getNoConnectionMessage(error),
                        alertConfig.sendMessageModalAlert);
                });
            };

            $scope.getAndVerifyAccount = function (sendTokenForm) {

                var sendForm = multiStepFormScope.sendMessageForm;
                var recipientRS = sendForm.recipientRS;
                var fee = sendForm.fee;
                var secret = sendForm.secretPhrase;

                var message = sendForm.message;
                var pubkey = sendForm.pubkey;

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

                var senderPublicKey = MessageService.getAccountDetailsFromSession('publicKey');
                var secretPhraseHex;
                if (hasSecretAdded) {
                    secretPhraseHex = CryptoService.secretPhraseToPrivateKey(secret);
                } else {
                    secretPhraseHex = SessionStorageService.getFromSession(loginConfig.SESSION_ACCOUNT_PRIVATE_KEY);
                }

                $scope.sendMessagePromise = MessageService.getAccountDetails(recipientRS).then(function (success) {

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
                                }, alertConfig.sendMessageModalAlert
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
                            }, alertConfig.sendMessageModalAlert
                        );
                    }
                }, function (error) {
                    AlertService.addAlert(AlertService.getNoConnectionMessage(error),
                        alertConfig.sendMessageModalAlert);
                });
            };

            $scope.broadcastMessage = function (transactionBytes) {
                $scope.sendMessagePromise = MessageService.broadcastMessage(transactionBytes).then(function (success) {
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
                        alertConfig.sendMessageModalAlert);
                });
            };

        }]);

angular.module('messages').controller('ReadMessageFormCtrl',
    ['$scope', '$state', '$rootScope', 'CommonsService', 'SessionStorageService',
        'loginConfig', 'MessageService', 'alertConfig', 'AlertService', 'CryptoService', 'multiStepFormScope',
        function ($scope, $state, $rootScope, CommonsService, SessionStorageService,
                  loginConfig, MessageService, alertConfig, AlertService, CryptoService, multiStepFormScope) {


            $scope.$on('$destroy', function () {
                multiStepFormScope.sendMessageForm = angular.copy($scope.sendMessageForm);
            });

            $scope.message = '';

            $scope.readMessage = function () {

                var params = $scope.$getActiveStep().data;

                $scope.params = params;

                try {

                    var encrpytedMessageData = params.attachment.encryptedMessage.data;
                    var encrpytedMessageNonce = params.attachment.encryptedMessage.nonce;

                    var accountRS = CommonsService.getAccountDetailsFromSession('accountRs');
                    var secretHex = SessionStorageService.getFromSession(loginConfig.SESSION_ACCOUNT_PRIVATE_KEY);

                    var senderRS = params.senderRS;
                    var recipientRS = params.recipientRS;

                    var senderPublicKey = params.senderPublicKey;
                    var recipientPublicKey = '';

                } catch (e) {
                    $scope.message = 'Sorry, an error has occurred: ' + e.message;
                    return;
                } finally {
                }

                $scope.readMessagePromise = MessageService.getAccountDetails(params.recipientRS)
                    .then(function (success) {
                        if (!success.errorCode) {

                            recipientPublicKey = success.publicKey;

                            var encrypted;

                            if (accountRS === senderRS) {

                                encrypted =
                                    CryptoService.decryptMessage(encrpytedMessageData, encrpytedMessageNonce, secretHex,
                                        recipientPublicKey);

                            } else {

                                encrypted =
                                    CryptoService.decryptMessage(encrpytedMessageData, encrpytedMessageNonce, secretHex,
                                        senderPublicKey);
                            }

                            if (typeof(encrypted) === 'string') {
                                $scope.message = encrypted;
                            } else {
                                $scope.message = 'Non readable message string.';
                            }

                        } else {
                            AlertService.addAlert(
                                {
                                    type: 'danger',
                                    msg: 'Sorry, an error occured! Reason: ' + success.errorDescription
                                }, alertConfig.readMessageModalAlert
                            );
                        }

                    }, function (error) {
                        AlertService.addAlert(AlertService.getNoConnectionMessage(error),
                            alertConfig.readMessageModalAlert);
                    });


            };


        }]);
