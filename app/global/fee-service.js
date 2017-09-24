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

angular.module('baseClient').provider('FeeService', function FeeServiceProvider() {

    this.$get = function () {

        return this;

    };
    //the provider recipe for services require you specify a $get function
    function getCharacterLength(val) {
        if (val) {
            return val.length;
        }
        return 0;
    }

    this.getSetAccountFee = function (name, description) {
        var totalLength = getCharacterLength(name) + getCharacterLength(description);
        var totalFee = 1;
        if (totalLength > 0) {
            var normalizedLength = totalLength - 1;
            var total32Blocks = Math.floor(normalizedLength / 32);
            totalFee += 2 * ( total32Blocks - 0);
        }
        return totalFee;

    };

    this.getIssueAssetFee = function () {
        return 1000;
    };

    this.getDeleteAssetFee = function () {
        return 1;
    };

    this.getDeleteCurrencyFee = function () {
        return 1;
    };

    this.transferAssetFee = function () {
        return 1;
    };

    this.getTransferCurrencyFee = function () {
        return 1;
    };

    this.getIssueCurrencyFee = function (currencyCode) {
        var length = getCharacterLength(currencyCode);
        switch (length) {
            case 3:
                return 25000;
            case 4:
                return 1000;
            case 5:
                return 40;
        }
        return -1;
    };

    this.getCreatePollFee = function () {
        return 10;
    };

    this.getCastVoteFee=function(){
        return 1;
    };

    this.getSetAliasFee = function () {
        return 2;
    };

    this.getDeleteAliasFee = function () {
        return 2;
    };

});
