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

angular.module('escrow').controller('EscrowMainCtrl',
    ['$scope', 'EscrowService', 'amountTQTFilter', 'timestampFilter', 'DTOptionsBuilder', 'DTColumnBuilder',
        '$uibModal', '$compile', 'baseConfig', 'supplyFilter', 'searchTermFilter',
        function ($scope, EscrowService, amountTQTFilter, timestampFilter, DTOptionsBuilder, DTColumnBuilder,
                  $uibModal, $compile, baseConfig, supplyFilter, searchTermFilter) {

                  $scope.openCreateEscrowModal = function () {

                      var modalInstance = $uibModal.open({
                          animation: true,
                          templateUrl: 'escrow/modals/create-escrow-form.html',
                          size: 'lg',
                          controller: 'EscrowFormCtrl',
                          resolve: {
                              params: function () {
                                  return {};
                              }
                          }
                      });
                  };

                  $scope.openSignEscrowModal = function (escrowId) {

                      var modalInstance = $uibModal.open({
                          animation: true,
                          templateUrl: 'escrow/modals/sign-escrow-form.html',
                          size: 'lg',
                          controller: 'EscrowFormCtrl',
                          resolve: {
                              params: function () {
                                  return {
                                  'escrowId' :  escrowId
                                  };
                              }
                          }
                      });
                  };

                  $scope.openStatusEscrowModal = function (escrowId) {
                      var modalInstance = $uibModal.open({
                          animation: true,
                          templateUrl: 'escrow/modals/status-escrow-details.html',
                          size: 'lg',
                          controller: 'EscrowStatusCtrl',
                          resolve: {
                              params: function () {
                                  return {
                                  'escrowId' :  escrowId
                                  };
                              }
                          }
                      });
                  };

}]);

angular.module('escrow').controller('EscrowFormCtrl',
    ['$scope', '$uibModalInstance', 'params', function ($scope, $uibModalInstance, params) {

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.$on('close-modal', function () {
            $uibModalInstance.dismiss('cancel');
        });

        var createEscrowSteps = [
            {
                templateUrl: 'escrow/modals/create-escrow-details.html',
                title: 'Create Escrow Details',
                controller: 'CreateEscrowCtrl',
                isolatedScope: true,
                data: params,
            },
            {
                templateUrl: 'escrow/modals/create-escrow-confirm.html',
                title: 'Create Escrow Confirmation',
                controller: 'CreateEscrowCtrl',
                isolatedScope: true,
            },
        ];

        var signEscrowSteps = [
            {
                templateUrl: 'escrow/modals/sign-escrow-details.html',
                title: 'Sign Escrow Details',
                controller: 'SignEscrowCtrl',
                isolatedScope: true,
                data: params,
            },
            {
                templateUrl: 'escrow/modals/sign-escrow-confirm.html',
                title: 'Sign Escrow Confirmation',
                controller: 'SignEscrowCtrl',
                isolatedScope: true,
            },
        ];


        $scope.steps = {};

        $scope.steps.createEscrowSteps = createEscrowSteps;
        $scope.steps.signEscrowSteps = signEscrowSteps;


    }]);

angular.module('escrow').controller('MyEscrowCtrl',
    ['$scope', 'EscrowService', 'amountTQTFilter', 'timestampFilter', 'DTOptionsBuilder', 'DTColumnBuilder',
        '$uibModal', '$compile', 'baseConfig', 'supplyFilter', 'searchTermFilter', 'AccountService',
        function ($scope, EscrowService, amountTQTFilter, timestampFilter, DTOptionsBuilder, DTColumnBuilder,
                  $uibModal, $compile, baseConfig, supplyFilter, searchTermFilter, AccountService) {

                  $scope.dtMyEscrowOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers')
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
                          EscrowService.getAccountEscrowTransactions(account, data.start, endIndex ).then(function (response) {

                              if (!response.escrows) { response.escrows = {}; }

                              callback({
                                  'iTotalRecords': 1000,
                                  'iTotalDisplayRecords': 1000,
                                  'data': response.escrows
                              });
                          });
                      })
                      .withDisplayLength(10).withBootstrap();

                  $scope.dtMyEscrowColumns = [

                      DTColumnBuilder.newColumn('id').withTitle('Details').notSortable()
                          .renderWith(function (data, type, row, meta) {
                              return '<button type="button" class="btn btn-success btn-xs" ng-controller="SearchCtrl"' +
                                  ' ng-click="searchValue(\'' + data + '\')">' +
                                  '<i class="fa fa-list-ul" aria-hidden="true" style="width:15px;"></i>' + '</button>';

                          }),

                      DTColumnBuilder.newColumn('id').withTitle('Role').notSortable()
                          .renderWith(function (data, type, row, meta) {

                            var account = AccountService.getAccountDetailsFromSession('accountRs');

                            var role = 'SENDER';
                            if (account === row.senderRS) {
                                role = 'SENDER';
                              } else if (account === row.recipientRS) {
                                role = 'RECIPIENT';
                              } else { role = 'SIGNER';  }

                              return  role;
                          }),


                      DTColumnBuilder.newColumn('deadline').withTitle('Expires').notSortable()
                          .renderWith(function (data, type, row, meta) {
                              return timestampFilter(data);
                          }),

                      DTColumnBuilder.newColumn('deadlineAction').withTitle('Deadline').notSortable()
                          .renderWith(function (data, type, row, meta) {
                              return data.toUpperCase();
                          }),

                      DTColumnBuilder.newColumn('senderRS').withTitle('Sender').notSortable()
                          .renderWith(function (data, type, row, meta) {
                            if (data) {
                                return searchTermFilter(data);
                            }
                            return data;
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

                            var account = AccountService.getAccountDetailsFromSession('accountRs');
                            var signTag = true;
                            var signColor = 'btn-default';
                            var statusTag = false;

                            for (i = 0; i < row.signers.length; i++) {


                                if (account === row.signers[i].idRS && row.signers[i].decision === 'undecided') {
                                  signTag = false;
                                  signColor = 'btn-success';
                                }
                            }

                            var signTooltip = ' popover-placement="left" popover-trigger="\'mouseenter\'" uib-popover=' +
                                ' "Sign Escrow"';

                            var signEscrow = '<button type="button" class="btn ' + signColor + ' btn-xs"  ' + signTooltip + ' ng-controller="EscrowMainCtrl"' +
                                'ng-disabled="' + signTag + '"' + ' ng-click="openSignEscrowModal(\'' + row.id + '\')">' +
                                ' <i class="fa fa-pencil-square-o" aria-hidden="true" style="width:15px;"></i> ' + '</button>';

                            var statusTooltip = ' popover-placement="left" popover-trigger="\'mouseenter\'" uib-popover=' +
                                ' "Escrow Status"';

                            var statusEscrow = '<button type="button" class="btn btn-default btn-xs"  ' + statusTooltip + ' ng-controller="EscrowMainCtrl"' +
                                'ng-disabled="' + statusTag + '"' + ' ng-click="openStatusEscrowModal(\'' + row.id + '\')">' +
                                ' <i class="fa fa-question-circle-o" aria-hidden="true" style="width:15px;"></i> ' + '</button>';

                            return statusEscrow + ' ' + signEscrow;

                          })

                  ];

                  $scope.dtMyEscrowInstanceCallback = function (_dtInstance) {
                      $scope.dtInstance = _dtInstance;
                  };
                  $scope.reloadMyEscrow = function () {
                      if ($scope.dtInstance) {
                          $scope.dtInstance._renderer.rerender();
                      }
                  };



}]);

angular.module('escrow').controller('CreateEscrowCtrl',
    ['$scope', 'EscrowService', 'SessionStorageService', '$state', 'CryptoService', 'loginConfig',
        'AlertService', 'alertConfig', '$validation', '$uibModal', 'multiStepFormScope', '$rootScope',
        'CommonsService', 'AccountService', 'amountToQuantFilter', 'CurrenciesService',
        function ($scope, EscrowService, SessionStorageService, $state, CryptoService,
                  loginConfig, AlertService, alertConfig, $validation, $uibModal, multiStepFormScope,
                  $rootScope, CommonsService, AccountService, amountToQuantFilter, CurrenciesService) {

                    $scope.createEscrow = angular.copy(multiStepFormScope.createEscrow);

                    $scope.$on('$destroy', function () {
                        multiStepFormScope.createEscrow = angular.copy($scope.createEscrow);
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
                            $scope.createEscrow.recipientRS = result.accountRS;
                        });
                    };

                    $scope.hasPrivateKeyInSession = function () {
                        if (SessionStorageService.getFromSession(loginConfig.SESSION_ACCOUNT_PRIVATE_KEY)) {
                            return true;
                        }
                        return false;
                    };

                    $scope.escrowDeadline = 1;
                    $scope.day = 1;
                    $scope.hmax = 90;
                    $scope.days = 1;

                    $scope.increment = function () {
                        if ($scope.escrowDeadline >= $scope.hmax) {
                            $scope.escrowDeadline = $scope.hmax;
                            return;
                        } else {
                            $scope.escrowDeadline = $scope.escrowDeadline + $scope.day;
                        }

                        $scope.createEscrow.escrowDeadline = $scope.escrowDeadline;
                        $scope.days = parseInt($scope.escrowDeadline / $scope.day);
                    };

                    $scope.decrement = function () {
                        if ($scope.escrowDeadline <= $scope.day) {
                            $scope.escrowDeadline = $scope.day;
                            return;
                        } else {
                            $scope.escrowDeadline = $scope.escrowDeadline - $scope.day;
                        }

                        $scope.createEscrow.escrowDeadline = $scope.escrowDeadline;
                        $scope.days = parseInt($scope.escrowDeadline / $scope.day);
                    };

                    $scope.deadlineActionOptions = [
                      { label: 'Refund', value: 'refund' },
                       { label: 'Relase', value: 'release' },
                       { label: 'Split', value: 'Split' },
                     ];

                    $scope.createEscrow = function () {

                        var escrowForm = multiStepFormScope.createEscrow;

                        $scope.createEscrow.recipientRS = escrowForm.recipientRS;
                        $scope.createEscrow.amount = escrowForm.amount;
                        $scope.createEscrow.escrowDeadline = escrowForm.escrowDeadline;
                        $scope.createEscrow.deadlineAction = escrowForm.deadlineAction;
                        $scope.createEscrow.requiredSigners = escrowForm.requiredSigners;
                        $scope.createEscrow.signers = escrowForm.signers;

                        var recipientRS = escrowForm.recipientRS;
                        var amountTQT = amountToQuantFilter(escrowForm.amount);
                        var escrowDeadline = parseInt(escrowForm.escrowDeadline * 86400);
                        var deadlineAction = escrowForm.deadlineAction;
                        var requiredSigners = escrowForm.requiredSigners;
                        var signers = escrowForm.signers;

                        var fee = 1;

                        var senderPublicKey = AccountService.getAccountDetailsFromSession('publicKey');
                        var secretPhraseHex = SessionStorageService.getFromSession(loginConfig.SESSION_ACCOUNT_PRIVATE_KEY);

                        $scope.setCreateEscrowPromise = AccountService.getAccountDetails(recipientRS).then(function (success) {

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

                                $scope.setCreateEscrowPromise = EscrowService.createEscrow(
                                    senderPublicKey,
                                    recipientRS,
                                    amountTQT,
                                    escrowDeadline,
                                    deadlineAction,
                                    requiredSigners,
                                    signers,
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
                                              }, alertConfig.createEscrowAlert
                                          );
                                      }

                                    }, function (error) {
                                        AlertService.addAlert(AlertService.getNoConnectionMessage(error),
                                            alertConfig.createEscrowAlert);
                                    });

                            } else {
                                AlertService.addAlert(
                                    {
                                        type: 'danger',
                                        msg: 'Sorry, an error occured! Reason: ' + success.errorDescription
                                    }, alertConfig.createEscrowAlert
                                );
                            }
                        },function (error) {
                            AlertService.addAlert(AlertService.getNoConnectionMessage(error),
                                alertConfig.createEscrowAlert);
                        });
                    };

                    $scope.broadcastTransaction = function (transactionBytes) {
                      $scope.createEscrowPromise = AccountService.broadcastTransaction(transactionBytes).then(function (success) {

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
                              alertConfig.createEscrowAlert);
                      });
                    };


}]);

angular.module('escrow').controller('EscrowStatusCtrl',
    ['$scope', 'EscrowService', 'amountTQTFilter', 'timestampFilter', 'DTOptionsBuilder', 'DTColumnBuilder',
        '$uibModal', '$compile', 'baseConfig', 'supplyFilter', 'searchTermFilter', 'AccountService', '$uibModalInstance', 'params',
        function ($scope, EscrowService, amountTQTFilter, timestampFilter, DTOptionsBuilder, DTColumnBuilder,
                  $uibModal, $compile, baseConfig, supplyFilter, searchTermFilter, AccountService, $uibModalInstance, params) {

                    $scope.escrowId = params.escrowId;

                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };

                    $scope.$on('close-modal', function () {
                        $uibModalInstance.dismiss('cancel');
                    });

                  $scope.dtStatusEscrowOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers')
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
                          EscrowService.getEscrowTransaction( $scope.escrowId, data.start, endIndex ).then(function (response) {

                              callback({
                                  'iTotalRecords': 10,
                                  'iTotalDisplayRecords': 10,
                                  'data': response.signers
                              });
                          });
                      })
                      .withDisplayLength(5).withBootstrap();

                  $scope.dtStatusEscrowColumns = [

                      DTColumnBuilder.newColumn('idRS').withTitle('Signer').notSortable()
                          .renderWith(function (data, type, row, meta) {
                              return searchTermFilter(data);
                          }),

                      DTColumnBuilder.newColumn('decision').withTitle('Decision').notSortable()
                          .renderWith(function (data, type, row, meta) {
                              return  data.toUpperCase();
                          }),
                  ];

                  $scope.dtStatusEscrowInstanceCallback = function (_dtInstance) {
                      $scope.dtInstance = _dtInstance;
                  };
                  $scope.reloadStatusEscrow = function () {
                      if ($scope.dtInstance) {
                          $scope.dtInstance._renderer.rerender();
                      }
                  };

}]);

angular.module('escrow').controller('SignEscrowCtrl',
    ['$scope', 'EscrowService', 'SessionStorageService', '$state', 'CryptoService', 'loginConfig',
        'AlertService', 'alertConfig', '$validation', '$uibModal', 'multiStepFormScope', '$rootScope',
        'CommonsService', 'AccountService', 'amountToQuantFilter', 'CurrenciesService',
        function ($scope, EscrowService, SessionStorageService, $state, CryptoService,
                  loginConfig, AlertService, alertConfig, $validation, $uibModal, multiStepFormScope,
                  $rootScope, CommonsService, AccountService, amountToQuantFilter, CurrenciesService) {

                  $scope.signEscrow = angular.copy(multiStepFormScope.signEscrow);

                  $scope.initStep1 = function () {
                      var data = $scope.$getActiveStep().data || {};
                      if (data.escrowId) {

                        $scope.signEscrow.ID = $scope.$getActiveStep().data.escrowId;

                      }
                  };


                  $scope.$on('$destroy', function () {
                      multiStepFormScope.signEscrow = angular.copy($scope.signEscrow);
                  });

                  $scope.decisionOptions = [
                    { label: 'Refund', value: 'refund' },
                    { label: 'Relase', value: 'release' },
                    { label: 'Split', value: 'split' },
                   ];

                   $scope.signEscrow = function () {

                       var escrowForm = multiStepFormScope.signEscrow;

                       $scope.signEscrow.ID = escrowForm.ID;
                       $scope.signEscrow.decision = escrowForm.decision;

                       var escrow = escrowForm.ID;
                       var decision = escrowForm.decision;
                       var fee = 1;

                       var senderPublicKey = AccountService.getAccountDetailsFromSession('publicKey');
                       var secretPhraseHex = SessionStorageService.getFromSession(loginConfig.SESSION_ACCOUNT_PRIVATE_KEY);

                       $scope.setSignEscrowPromise = EscrowService.escrowSign(
                           senderPublicKey,
                           escrow,
                           decision,
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
                                     }, alertConfig.signEscrowAlert
                                 );
                             }

                           }, function (error) {
                               AlertService.addAlert(AlertService.getNoConnectionMessage(error),
                                   alertConfig.signEscrowAlert);
                           });

                    };

                  $scope.broadcastTransaction = function (transactionBytes) {
                    $scope.setSignEscrowPromise = AccountService.broadcastTransaction(transactionBytes).then(function (success) {

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
                            alertConfig.signEscrowAlert);
                    });
                  };

}]);
