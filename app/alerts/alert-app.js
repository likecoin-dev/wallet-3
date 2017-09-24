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

angular.module('clientAlert', ['baseClient', 'ui.router', 'ui.bootstrap']);

angular.module('clientAlert').constant('alertConfig', {
    'mainAlertName': 'main',
    'sendTokenModalAlert': 'sendToken',
    'setInfoModalAlert': 'setInfo',
    'leaseBalanceModalAlert': 'leaseBalance',
    'blockGenerationModalAlert': 'blockGeneration',
    'setApproveTransactionAlert': 'approveTransaction',
    'issueAssetModalAlert': 'issueAsset',
    'deleteAssetModalAlert': 'deleteAsset',
    'cancelBidOrderModalAlert': 'cancelBidOrder',
    'transferAssetModalAlert': 'transferAsset',
    'deleteCurrencyModalAlert': 'deleteCurrency',
    'transferCurrencyModalAlert': 'transferCurrency',
    'setAccountControlModalAlert': 'setAccountControl',
    'optionModalAlert': 'options',
    'createPollModalAlert': 'createPoll',
    'buyAliasModalAlert': 'buyAlias',
    'cancelAliasModalAlert': 'cancelAlias',
    'deleteAliasModalAlert': 'deleteAlias',
    'editAliasModalAlert': 'editAlias',
    'setAliasModalAlert': 'setAlias',
    'transferAliasModalAlert': 'transferAlias',
    'dividendPaymentModalAlert': 'dividendPayment',
    'placeAssertOrderModalAlert': 'placeAssertOrder',
    'issueCurrencyModalAlert': 'issueCurrency',
    'readMessageModalAlert': 'readMessage',
    'sendMessageModalAlert': 'sendMessage',
    'castVoteModalAlert': 'castVote',
    'controlApproveModalAlert': 'controlApprove',
    'controlRemoveModalAlert': 'controlRemove',
    'publishExchangeOfferModalAlert': 'publishExchangeOffer',
    'buyCurrencyModalAlert': 'buyCurrency',
    'sellCurrencyModalAlert': 'sellCurrency',
    'currencyReserveClaimModalAlert': 'currencyReserveClaim',
    'currencyReserveIncreaseModalAlert': 'currencyReserveIncrease',
    'welcomeFaucetModalAlert': 'welcomeFaucet',
    'claimSecretTransaction': 'claimSecretTransaction',
    'decodeToken': 'decodeToken',
    'parseTransaction': 'parseTransaction',
    'broadcastTransaction': 'broadcastTransaction',
    'calculateHash': 'calculateHash',
    'chainStatistics': 'chainStatistics',
    'expectedAssetOrderModalAlert': 'expectedAssetOrder',
    'setPropertyAlert': 'setProperty',
    'deletePropertyAlert': 'deleteProperty',
    'createCampaignAlert': 'createCampaign',
    'reserveCampaignAlert': 'reserveCampaign',
    'createSubscriptionAlert': 'createSubscription'

});

angular.module('clientAlert')
    .service('AlertService', ['$rootScope', 'alertConfig', function ($rootScope, alertConfig) {

        this.alerts = [];

        this.alertHandlers = [];

        var ALERT_NAME = alertConfig.mainAlertName;

        this.addAlert = function (alert, alertName) {
            alertName = getAlertName(alertName);
            if (!this.alerts[alertName]) {
                this.alerts[alertName] = [];
            }
            this.alerts[alertName].push(alert);
            this.notify(alertName);
        };

        this.closeAlert = function (index, alertName) {
            alertName = getAlertName(alertName);
            if (!this.alerts[alertName]) {
                this.alerts[alertName] = [];
            }
            this.alerts[alertName].splice(index, 1);
            this.notify();
        };

        this.getAlerts = function () {
            return this.alerts;
        };

        this.subscribe = function (scope, callback, alertName) {
            var handler = $rootScope.$on(getAlertName(alertName), callback);
            scope.$on('$destroy', handler);
        };

        this.notify = function (alertName) {
            $rootScope.$emit(getAlertName(alertName));
        };

        this.getNoConnectionMessage = function (error) {
            return {
                type: 'danger',
                msg: 'Sorry, an error occured! Reason: Bad Connection'
            };
        };

        function getAlertName(alertName) {
            if (!alertName) {
                return ALERT_NAME;
            }
            return alertName;
        }

        this.getAlertName = function (alertName) {
            return getAlertName(alertName);
        };

    }]);

angular.module('clientAlert').controller('AlertDemoCtrl', ['$scope', 'AlertService', function ($scope, AlertService) {

    $scope.alerts = [];

    $scope.addAlert = function (alert, alertName) {
        AlertService.addAlert(alert, alertName);
    };

    $scope.closeAlert = function (index, alertName) {
        AlertService.closeAlert(index, alertName);
    };

    $scope.alertInit = function (alertName) {
        AlertService.subscribe($scope, handleAlertEvent, alertName);
    };

    function handleAlertEvent() {
        $scope.alerts = AlertService.getAlerts();
    }


}]);
