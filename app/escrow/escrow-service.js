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

angular.module('escrow').service('EscrowService',
    ['nodeConfig', 'SessionStorageService', 'NodeService', 'baseConfig', 'Restangular', 'loginConfig',
        'CryptoService', 'TransactionService', '$rootScope', 'OptionsService', 'escrowConfig',
        function (nodeConfig, SessionStorageService, NodeService, baseConfig, Restangular, loginConfig,
                  CryptoService, TransactionService, $rootScope, OptionsService, escrowConfig) {


                  this.createEscrow = function (publicKey, recipientRS, amountTQT, escrowDeadline, deadlineAction, requiredSigners, signers, fee ) {
                      Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE')));
                      var params = {
                          'requestType': 'sendMoneyEscrow',
                          'publicKey': publicKey,
                          'recipient': recipientRS,
                          'amountTQT': amountTQT,
                          'escrowDeadline': escrowDeadline,
                          'deadlineAction': deadlineAction,
                          'requiredSigners' : requiredSigners,
                          'signers': signers,
                          'feeTQT': parseInt(fee * baseConfig.TOKEN_QUANTS, 10),
                          'deadline': OptionsService.getOption('DEADLINE'),
                          'broadcast': 'false'

                      };

                      return Restangular.all(escrowConfig.escrowEndPoint).customPOST('', '', params, '');
                  };

                  this.getAccountEscrowTransactions = function (account, firstIndex, lastIndex   ) {
                      Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE')));
                      var params = {
                          'requestType': 'getAccountEscrowTransactions',
                          'account': account,
                          'firstIndex': firstIndex,
                          'lastIndex': lastIndex
                      };
                      return Restangular.all(escrowConfig.escrowEndPoint).customGET('', params);
                  };

                  this.getEscrowTransaction = function (escrow, firstIndex, lastIndex   ) {
                      Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE')));
                      var params = {
                          'requestType': 'getEscrowTransaction',
                          'escrow': escrow,
                          'firstIndex': firstIndex,
                          'lastIndex': lastIndex
                      };
                      return Restangular.all(escrowConfig.escrowEndPoint).customGET('', params);
                  };

                  this.escrowSign = function (publicKey, escrow, decision, fee ) {
                      Restangular.setBaseUrl(NodeService.getNodeUrl(OptionsService.getOption('CONNECTION_MODE')));
                      var params = {
                          'requestType': 'escrowSign',
                          'publicKey': publicKey,
                          'escrow': escrow,
                          'decision': decision,
                          'feeTQT': parseInt(fee * baseConfig.TOKEN_QUANTS, 10),
                          'deadline': OptionsService.getOption('DEADLINE'),
                          'broadcast': 'false'

                      };

                      return Restangular.all(escrowConfig.escrowEndPoint).customPOST('', '', params, '');
                  };

        }]);
