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

angular.module('tools').controller('ToolsMainCtrl',
    ['$scope', '$uibModal', 'SessionStorageService', 'NodeService', 'loginConfig', 'nodeConfig', 'DTOptionsBuilder',
        'DTColumnBuilder', 'AccountService', 'timestampFilter', 'amountTQTFilter', '$compile', 'controlConfig',
        'CommonsService', 'quantToAmountFilter', 'quantityToShareFilter', 'numericalStringFilter', 'AssetsService',
        'CurrenciesService', '$timeout', 'numberStringFilter',
        function ($scope, $uibModal, SessionStorageService, NodeService, loginConfig, nodeConfig, DTOptionsBuilder,
                  DTColumnBuilder, AccountService, timestampFilter, amountTQTFilter, $compile, controlConfig,
                  CommonsService, quantToAmountFilter, quantityToShareFilter, numericalStringFilter, AssetsService,
                  CurrenciesService, $timeout, numberStringFilter) {

            $scope.openTransactionTypeModal = function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'tools/modals/transaction-types.html',
                    size: 'lg',
                    controller: 'ToolsStepFormCtrl',
                    resolve: {
                        params: function () {
                            return {};
                        }
                    }
                });
            };

            $scope.openServiceFeesModal = function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'tools/modals/service-fees.html',
                    size: 'lg',
                    controller: 'ToolsStepFormCtrl',
                    resolve: {
                        params: function () {
                            return {};
                        }
                    }
                });
            };

            $scope.openGenerateTokenModal = function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'tools/modals/token-generate.html',
                    size: 'lg',
                    controller: 'GenerateTokenCtrl',
                    resolve: {
                        params: function () {
                            return {};
                        }
                    }
                });
            };

            $scope.openValidateTokenModal = function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'tools/modals/token-validate.html',
                    size: 'lg',
                    controller: 'ValidateTokenCtrl',
                    resolve: {
                        params: function () {
                            return {};
                        }
                    }
                });
            };

            $scope.openTransactionBroadcastModal = function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'tools/modals/transaction-broadcast.html',
                    size: 'lg',
                    controller: 'BroadcastTransactionCtrl',
                    resolve: {
                        params: function () {
                            return {};
                        }
                    }
                });
            };

            $scope.openTransactionParseModal = function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'tools/modals/transaction-parse.html',
                    size: 'lg',
                    controller: 'ParseTransactionCtrl',
                    resolve: {
                        params: function () {
                            return {};
                        }
                    }
                });
            };

            $scope.openCalculateHashModal = function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'tools/modals/hash-calculate.html',
                    size: 'lg',
                    controller: 'CalculateHashCtrl',
                    resolve: {
                        params: function () {
                            return {};
                        }
                    }
                });
            };

            $scope.openUserGuideModal = function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'tools/modals/user-guide.html',
                    size: 'lg',
                    controller: 'ToolsStepFormCtrl',
                    resolve: {
                        params: function () {
                            return {};
                        }
                    }
                });
            };

            $scope.openChainStatisticsModal = function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'tools/modals/chain-statistics.html',
                    size: 'lg',
                    controller: 'chainStatisticsCtrl',
                    resolve: {
                        params: function () {
                            return {};
                        }
                    }
                });
            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };

        }]);

angular.module('tools').controller('GenerateTokenCtrl',
    ['$scope', '$uibModalInstance', 'params', 'CryptoService', 'baseConfig', 'AccountService',
    'SessionStorageService', 'loginConfig',
    function ($scope, $uibModalInstance, params, CryptoService, baseConfig, AccountService,
      SessionStorageService, loginConfig) {

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.$on('close-modal', function () {
            $uibModalInstance.dismiss('cancel');
        });

        $scope.generateTokenForm = {};
        $scope.buttonColor = 'default';

        $scope.generateToken = function(message) {

          var accountPublicKey = AccountService.getAccountDetailsFromSession('publicKey');
          var secretPhraseHex = SessionStorageService.getFromSession(loginConfig.SESSION_ACCOUNT_PRIVATE_KEY);
          var epoch =  baseConfig.EPOCH;

          $scope.generateTokenForm.output = CryptoService.generateToken(message, secretPhraseHex, accountPublicKey, epoch );

          $scope.buttonColor = 'success';

        };

    }]);

angular.module('tools').controller('ValidateTokenCtrl',
        ['$scope', '$uibModalInstance', 'params', 'CryptoService', 'baseConfig', 'AccountService',
        'SessionStorageService', 'loginConfig', 'ToolsService', 'AlertService', 'alertConfig',
        function ($scope, $uibModalInstance, params, CryptoService, baseConfig, AccountService,
          SessionStorageService, loginConfig, ToolsService, AlertService, alertConfig) {

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };

            $scope.$on('close-modal', function () {
                $uibModalInstance.dismiss('cancel');
            });

            $scope.validateTokenForm = {};

            $scope.color = 'black;';
            $scope.buttonColor = 'default';
            $scope.account  = 'Account';

            $scope.validateToken = function(token, message) {

              ToolsService.decodeToken(token, message).then(function (success) {
                  if (!success.errorCode) {

                    $scope.valid = success.valid;
                

                    if (success.valid) {
                      $scope.color = 'green;';
                      $scope.buttonColor = 'success';
                      $scope.account = success.accountRS;
                    } else {
                      $scope.color = 'red;';
                      $scope.buttonColor = 'danger';
                      $scope.account = 'Invalid Account';
                    }

                  } else {
                      AlertService.addAlert(
                          {
                              type: 'danger',
                              msg: 'Sorry, an error occured! Reason: ' + success.errorDescription
                          }, alertConfig.decodeToken
                      );
                  }
              }, function (error) {
                  AlertService.addAlert(
                      {
                          type: 'danger',
                          msg: 'Sorry, an error occured! Status: ' + error.status
                      }, alertConfig.decodeToken
                  );
              });

            };

        }]);

angular.module('tools').controller('ParseTransactionCtrl',
        ['$scope', '$uibModalInstance', 'params', 'CryptoService', 'baseConfig', 'AccountService',
        'SessionStorageService', 'loginConfig', 'ToolsService', 'AlertService', 'alertConfig',
        function ($scope, $uibModalInstance, params, CryptoService, baseConfig, AccountService,
          SessionStorageService, loginConfig, ToolsService, AlertService, alertConfig) {

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };

            $scope.$on('close-modal', function () {
                $uibModalInstance.dismiss('cancel');
            });

            $scope.buttonColor = 'default';

            $scope.parseTransaction = function(transactionBytes) {

              ToolsService.parseTransaction(transactionBytes).then(function (success) {
                  if (!success.errorCode) {

                    delete success.restangularized  ;
                    delete success.fromServer ;
                    delete success.parentResource  ;
                    delete success.restangularCollection ;
                    delete success.route ;
                    delete success.reqParams;

                    if (success.verify) {
                      $scope.buttonColor = 'success';
                    }else{
                      $scope.buttonColor = 'danger';
                    }

                    $scope.parseTransactionForm.json = JSON.stringify(success);

                  } else {
                      AlertService.addAlert(
                          {
                              type: 'danger',
                              msg: 'Sorry, an error occured! Reason: ' + success.errorDescription
                          }, alertConfig.parseTransaction
                      );
                  }
              }, function (error) {
                  AlertService.addAlert(
                      {
                          type: 'danger',
                          msg: 'Sorry, an error occured! Status: ' + error.status
                      }, alertConfig.parseTransaction
                  );
              });

            };

        }]);

angular.module('tools').controller('BroadcastTransactionCtrl',
        ['$scope', '$uibModalInstance', 'params', 'CryptoService', 'baseConfig', 'AccountService',
        'SessionStorageService', 'loginConfig', 'ToolsService', 'AlertService', 'alertConfig',
        function ($scope, $uibModalInstance, params, CryptoService, baseConfig, AccountService,
          SessionStorageService, loginConfig, ToolsService, AlertService, alertConfig) {

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };

            $scope.$on('close-modal', function () {
                $uibModalInstance.dismiss('cancel');
            });

            $scope.buttonColor = 'default';
            $scope.showTransaction = false;

            $scope.broadcastTransaction = function(transactionBytes) {

              ToolsService.broadcastTransaction(transactionBytes).then(function (success) {
                  if (!success.errorCode) {

                    $scope.fullHash = success.fullHash;
                    $scope.requestProcessingTime = success.requestProcessingTime;
                    $scope.transaction = success.transaction;

                    if (success.transaction) {
                      $scope.buttonColor = 'success';
                      $scope.showTransaction = true;
                    } else {
                      $scope.buttonColor = 'danger';
                    }

                  } else {
                      AlertService.addAlert(
                          {
                              type: 'danger',
                              msg: 'Sorry, an error occured! Reason: ' + success.errorDescription
                          }, alertConfig.broadcastTransaction
                      );
                  }
              }, function (error) {
                  AlertService.addAlert(
                      {
                          type: 'danger',
                          msg: 'Sorry, an error occured! Status: ' + error.status
                      }, alertConfig.broadcastTransaction
                  );
              });

            };

        }]);

angular.module('tools').controller('CalculateHashCtrl',
        ['$scope', '$uibModalInstance', 'params', 'CryptoService', 'baseConfig', 'AccountService',
        'SessionStorageService', 'loginConfig', 'ToolsService', 'AlertService', 'alertConfig',
        function ($scope, $uibModalInstance, params, CryptoService, baseConfig, AccountService,
          SessionStorageService, loginConfig, ToolsService, AlertService, alertConfig) {

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };

            $scope.$on('close-modal', function () {
                $uibModalInstance.dismiss('cancel');
            });

            $scope.buttonColor = 'default';
            $scope.showHash = false;
            $scope.calculateHashForm = {};

            $scope.calculateHash = function(algo, message) {

              ToolsService.calculateHash(algo, message).then(function (success) {
                  if (!success.errorCode) {

                    $scope.calculateHashForm.hash = success.hash;

                    if (success.hash) {
                      $scope.buttonColor = 'success';
                    } else {
                      $scope.buttonColor = 'danger';
                    }

                  } else {
                      AlertService.addAlert(
                          {
                              type: 'danger',
                              msg: 'Sorry, an error occured! Reason: ' + success.errorDescription
                          }, alertConfig.calculateHash
                      );
                  }
              }, function (error) {
                  AlertService.addAlert(
                      {
                          type: 'danger',
                          msg: 'Sorry, an error occured! Status: ' + error.status
                      }, alertConfig.calculateHash
                  );
              });

            };

        }]);

angular.module('tools').controller('chainStatisticsCtrl',
        ['$scope', '$uibModalInstance', 'params', 'CryptoService', 'baseConfig', 'AccountService',
        'SessionStorageService', 'loginConfig', 'ToolsService', 'AlertService', 'alertConfig',
        function ($scope, $uibModalInstance, params, CryptoService, baseConfig, AccountService,
          SessionStorageService, loginConfig, ToolsService, AlertService, alertConfig) {

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };

            $scope.$on('close-modal', function () {
                $uibModalInstance.dismiss('cancel');
            });



            $scope.getChainStats = function() {

              $scope.getChainStatsPromise = ToolsService.getChainStats().then(function (success) {
                  if (!success.errorCode) {

                    $scope.numberOfAccountLeases = success.numberOfAccountLeases;
                    $scope.numberOfAccountLeases = success.numberOfAccountLeases;
                    $scope.numberOfAccounts = success.numberOfAccounts;
                    $scope.numberOfActiveAccountLeases = success.numberOfActiveAccountLeases;
                    $scope.numberOfActivePeers = success.numberOfActivePeers;
                    $scope.numberOfAliases = success.numberOfAliases;
                    $scope.numberOfAskOrders = success.numberOfAskOrders;
                    $scope.numberOfAsks = success.numberOfAsks;
                    $scope.numberOfAssets = success.numberOfAssets;
                    $scope.numberOfBidOrders = success.numberOfBidOrders;
                    $scope.numberOfBids = success.numberOfBids;
                    $scope.numberOfBlocks = success.numberOfBlocks;
                    $scope.numberOfCurrencies = success.numberOfCurrencies;
                    $scope.numberOfAccountLeases = success.numberOfAccountLeases;
                    $scope.numberOfCurrencyTransfers = success.numberOfCurrencyTransfers;
                    $scope.numberOfExchangeRequests = success.numberOfExchangeRequests;
                    $scope.numberOfExchanges = success.numberOfExchanges;
                    $scope.numberOfOffers = success.numberOfOffers;
                    $scope.numberOfOrders = success.numberOfOrders;
                    $scope.numberOfPeers = success.numberOfPeers;
                    $scope.numberOfPhasingOnlyAccounts = success.numberOfPhasingOnlyAccounts;
                    $scope.numberOfPolls = success.numberOfPolls;
                    $scope.numberOfTrades = success.numberOfTrades;
                    $scope.numberOfTransactions = success.numberOfTransactions;
                    $scope.numberOfTransfers = success.numberOfTransfers;
                    $scope.numberOfVotes = success.numberOfVotes;

                  } else {
                      AlertService.addAlert(
                          {
                              type: 'danger',
                              msg: 'Sorry, an error occured! Reason: ' + success.errorDescription
                          }, alertConfig.calculateHash
                      );
                  }
              }, function (error) {
                  AlertService.addAlert(
                      {
                          type: 'danger',
                          msg: 'Sorry, an error occured! Status: ' + error.status
                      }, alertConfig.calculateHash
                  );
              });

            };

        }]);

angular.module('tools').controller('ToolsStepFormCtrl',
    ['$scope', '$uibModalInstance', 'params', function ($scope, $uibModalInstance, params) {

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.$on('close-modal', function () {
            $uibModalInstance.dismiss('cancel');
        });


    }]);
