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

angular.module('subscription').controller('SubscriptionsMainCtrl',
    ['$scope', 'SubscriptionService', 'amountTQTFilter', 'timestampFilter', 'DTOptionsBuilder', 'DTColumnBuilder',
        '$uibModal', '$compile', 'baseConfig', 'supplyFilter', 'searchTermFilter',
        function ($scope, SubscriptionService, amountTQTFilter, timestampFilter, DTOptionsBuilder, DTColumnBuilder,
                  $uibModal, $compile, baseConfig, supplyFilter, searchTermFilter) {

          $scope.openCreateSubscriptionModal = function () {

              var modalInstance = $uibModal.open({
                  animation: true,
                  templateUrl: 'subscriptions/modals/create-subscription-form.html',
                  size: 'lg',
                  controller: 'SubscriptionFormCtrl',
                  resolve: {
                      params: function () {
                          return {};
                      }
                  }
              });
          };

          $scope.openCancelSubscriptionModal = function (id, account) {

              var modalInstance = $uibModal.open({
                  animation: true,
                  templateUrl: 'subscriptions/modals/cancel-subscription-form.html',
                  size: 'lg',
                  controller: 'SubscriptionFormCtrl',
                  resolve: {
                      params: function () {
                          return {
                            'id': id,
                            'account': account
                          };
                      }
                  }
              });
          };

}]);

angular.module('subscription').controller('SubscriptionFormCtrl',
    ['$scope', '$uibModalInstance', 'params', function ($scope, $uibModalInstance, params) {

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.$on('close-modal', function () {
            $uibModalInstance.dismiss('cancel');
        });

        var createSubscriptionSteps = [
            {
                templateUrl: 'subscriptions/modals/create-subscription-details.html',
                title: 'Create Subscription Details',
                controller: 'CreateSubscriptionCtrl',
                isolatedScope: true,
                data: params,
            },
            {
                templateUrl: 'subscriptions/modals/create-subscription-confirm.html',
                title: 'Create Subscription Confirmation',
                controller: 'CreateSubscriptionCtrl',
                isolatedScope: true,
            },
        ];

        var cancelSubscriptionSteps = [
            {
                templateUrl: 'subscriptions/modals/cancel-subscription-confirm.html',
                title: 'Cancel Subscription Confirmation',
                controller: 'CancelSubscriptionCtrl',
                isolatedScope: true,
                data: params,
            },
        ];


        $scope.steps = {};

        $scope.steps.createSubscriptionSteps = createSubscriptionSteps;
        $scope.steps.cancelSubscriptionSteps = cancelSubscriptionSteps;

    }]);

angular.module('subscription').controller('MySubscriptionsCtrl',
    ['$scope', 'SubscriptionService', 'amountTQTFilter', 'timestampFilter', 'DTOptionsBuilder', 'DTColumnBuilder',
        '$uibModal', '$compile', 'baseConfig', 'supplyFilter', 'searchTermFilter', 'CommonsService', 'SessionStorageService',
        'pollDaysFilter', 'AccountService',
        function ($scope, SubscriptionService, amountTQTFilter, timestampFilter, DTOptionsBuilder, DTColumnBuilder,
                  $uibModal, $compile, baseConfig, supplyFilter, searchTermFilter, CommonsService, SessionStorageService,
                  pollDaysFilter, AccountService) {

                    $scope.dtMySubscriptionsOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers')
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

                            var account = AccountService.getAccountDetailsFromSession('accountId');
                            SubscriptionService.getAccountSubscriptions(account, data.start, endIndex ).then(function (response) {
                                if (!response.subscriptions) { response.subscriptions = {}; }
                                callback({
                                    'iTotalRecords': 1000,
                                    'iTotalDisplayRecords': 1000,
                                    'data': response.subscriptions
                                });
                            });
                        })
                        .withDisplayLength(10).withBootstrap();

                    $scope.dtMySubscriptionsColumns = [

                        DTColumnBuilder.newColumn('id').withTitle('Details').notSortable()
                            .renderWith(function (data, type, row, meta) {
                                return '<button type="button" class="btn btn-success btn-xs" ng-controller="SearchCtrl"' +
                                    ' ng-click="searchValue(\'' + data + '\')">' +
                                    '<i class="fa fa-list-ul" aria-hidden="true" style="width:15px;"></i>' + '</button>';

                            }),

                        DTColumnBuilder.newColumn('frequency').withTitle('Interval (D)').notSortable()
                            .renderWith(function (data, type, row, meta) {

                                var interval_day = data / 86400;
                                return  interval_day.toFixed(4);
                            }),

                        DTColumnBuilder.newColumn('timeNext').withTitle('Next Payment').notSortable()
                            .renderWith(function (data, type, row, meta) {
                                return timestampFilter(data);
                            }),

                        DTColumnBuilder.newColumn('amountTQT').withTitle('Amount').notSortable()
                            .renderWith(function (data, type, row, meta) {
                                return amountTQTFilter(data);
                            }),

                        DTColumnBuilder.newColumn('recipientRS').withTitle('Recipient').notSortable()
                            .renderWith(function (data, type, row, meta) {
                              if (data) {
                                  return searchTermFilter(data);
                              }
                              return data;
                            }),

                        DTColumnBuilder.newColumn('id').withTitle('Action').notSortable()
                            .renderWith(function (data, type, row, meta) {

                              var cancel_tag = false;
                              var tt_cancel = ' popover-placement="left" popover-trigger="\'mouseenter\'" uib-popover=' +
                                  ' "Cancel Subscription"';

                              var cancel_subscription = '<button type="button" class="btn btn-default btn-xs"  ' + tt_cancel + ' ng-controller="SubscriptionsMainCtrl"' +
                                  'ng-disabled="' + cancel_tag + '"' + ' ng-click="openCancelSubscriptionModal(\'' + data + '\',\'' + row.recipientRS + '\')">' +
                                  ' <i class="fa fa-times" aria-hidden="true" style="width:15px;"></i> ' + '</button>';

                              return cancel_subscription ;

                            })

                    ];

                    $scope.dtMySubscriptionsInstanceCallback = function (_dtInstance) {
                        $scope.dtInstance = _dtInstance;
                    };
                    $scope.reloadMySubscriptions = function () {
                        if ($scope.dtInstance) {
                            $scope.dtInstance._renderer.rerender();
                        }
                    };


}]);

angular.module('subscription').controller('CreateSubscriptionCtrl',
    ['$scope', 'SubscriptionService', 'SessionStorageService', '$state', 'CryptoService', 'loginConfig',
        'AlertService', 'alertConfig', '$validation', '$uibModal', 'multiStepFormScope', '$rootScope',
        'CommonsService', 'AccountService', 'amountToQuantFilter',
        function ($scope, SubscriptionService, SessionStorageService, $state, CryptoService,
                  loginConfig, AlertService, alertConfig, $validation, $uibModal, multiStepFormScope,
                  $rootScope, CommonsService, AccountService, amountToQuantFilter) {

                    $scope.$on('$destroy', function () {
                        multiStepFormScope.createSubscription = angular.copy($scope.createSubscription);
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
                            $scope.createSubscription.recipientRS = result.accountRS;
                        });
                    };

                    $scope.hasPrivateKeyInSession = function () {
                        if (SessionStorageService.getFromSession(loginConfig.SESSION_ACCOUNT_PRIVATE_KEY)) {
                            return true;
                        }
                        return false;
                    };

                    $scope.createSubscription = function () {

                        var sendForm = multiStepFormScope.createSubscription;

                        $scope.createSubscription.recipientRS = sendForm.recipientRS;
                        $scope.createSubscription.amount = sendForm.amount;
                        $scope.createSubscription.interval = sendForm.interval;

                        var recipientRS = sendForm.recipientRS;
                        var amountTQT = amountToQuantFilter(sendForm.amount);
                        var frequency = parseInt(sendForm.interval * 86400);

                        var fee = 1;

                        var senderPublicKey = AccountService.getAccountDetailsFromSession('publicKey');
                        var secretPhraseHex = SessionStorageService.getFromSession(loginConfig.SESSION_ACCOUNT_PRIVATE_KEY);

                        $scope.setCreateSubscriptionPromise = AccountService.getAccountDetails(recipientRS).then(function (success) {

                            var recipientPublicKey = success.publicKey;

                            if (!success.errorCode || success.errorCode === 5) {

                                $scope.accountDetails = success;

                                if (!recipientPublicKey) {
                                    AlertService.addAlert(
                                        {
                                            type: 'info',
                                            msg: 'Note: This account never had an outbound transaction. Make sure this account is the right one. In doubt, ask the account holder for his public key and add it on the former page to this transaction.'
                                        }, alertConfig.createSubscriptionAlert
                                    );
                                }

                                $scope.setCreateSubscriptionPromise = SubscriptionService.createSubscription(
                                    senderPublicKey,
                                    recipientRS,
                                    amountTQT,
                                    frequency,
                                    fee
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
                                              }, alertConfig.createSubscriptionAlert
                                          );
                                      }

                                    }, function (error) {
                                        AlertService.addAlert(AlertService.getNoConnectionMessage(error),
                                            alertConfig.createSubscriptionAlert);
                                    });

                            } else {
                                AlertService.addAlert(
                                    {
                                        type: 'danger',
                                        msg: 'Sorry, an error occured! Reason: ' + success.errorDescription
                                    }, alertConfig.createSubscriptionAlert
                                );
                            }
                        },function (error) {
                            AlertService.addAlert(AlertService.getNoConnectionMessage(error),
                                alertConfig.createSubscriptionAlert);
                        });
                    };

                    $scope.broadcastTransaction = function (transactionBytes) {
                      $scope.sendTokenPromise =AccountService.broadcastTransaction(transactionBytes).then(function (success) {

                        if (!success.errorCode) {
                            AlertService.addAlert(
                                {
                                    type: 'success',
                                    msg: 'Transaction succesfull broadcasted with Id : ' + success.transaction +
                                    ''
                                });

                            $scope.$emit('close-modal');
                        } else {
                            AlertService.addAlert(
                                {
                                    type: 'danger',
                                    msg: 'Unable to broadcast transaction. Reason: ' + success.errorDescription
                                });
                        }

                      }, function (error) {
                          AlertService.addAlert(AlertService.getNoConnectionMessage(error),
                              alertConfig.createSubscriptionAlert);
                      });
                    };


}]);

angular.module('subscription').controller('CancelSubscriptionCtrl',
    ['$scope', 'SubscriptionService', 'SessionStorageService', '$state', 'CryptoService', 'loginConfig',
        'AlertService', 'alertConfig', '$validation', '$uibModal', 'multiStepFormScope', '$rootScope',
        'CommonsService', 'AccountService', 'amountToQuantFilter', 'multiStepFormInstance',
        function ($scope, SubscriptionService, SessionStorageService, $state, CryptoService,
                  loginConfig, AlertService, alertConfig, $validation, $uibModal, multiStepFormScope,
                  $rootScope, CommonsService, AccountService, amountToQuantFilter, multiStepFormInstance) {

                  $scope.$on('$destroy', function () {
                      multiStepFormScope.cancelSubscription = angular.copy($scope.cancelSubscription);
                  });

                  $scope.hasPrivateKeyInSession = function () {
                      if (SessionStorageService.getFromSession(loginConfig.SESSION_ACCOUNT_PRIVATE_KEY)) {
                          return true;
                      }
                      return false;
                  };

                  $scope.cancelSubscription = function () {

                    var data = $scope.$getActiveStep().data;

                    if (data) {
                        $scope.cancelSubscription.id = data.id;
                        $scope.cancelSubscription.recipientRS = data.account;

                    }

                    var publicKey = CommonsService.getAccountDetailsFromSession('publicKey');
                    var subscription = $scope.cancelSubscription.id;
                    var fee = 1;
                    var secretPhraseHex = SessionStorageService.getFromSession(loginConfig.SESSION_ACCOUNT_PRIVATE_KEY);

                    $scope.setCancelSubscriptionPromise = SubscriptionService.subscriptionCancel(publicKey, subscription, fee)
                        .then(function (success) {

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
                                    }, alertConfig.cancelSubscriptionAlert
                                );
                            }
                        }, function (error) {
                            AlertService.addAlert(AlertService.getNoConnectionMessage(error),
                                alertConfig.cancelSubscriptionAlert
                            );
                        });

                  };

                  $scope.broadcastTransaction = function (transactionBytes) {
                      $scope.cancelOrderPromise = CommonsService.broadcastTransaction(transactionBytes)
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
                              } else {
                                  AlertService.addAlert(
                                      {
                                          type: 'danger',
                                          msg: 'Unable to broadcast transaction. Reason: ' + success.errorDescription
                                      });
                              }

                          }, function (error) {
                              AlertService.addAlert(AlertService.getNoConnectionMessage(error),
                                  alertConfig.cancelBidOrderModalAlert);
                          });
                  };




}]);
