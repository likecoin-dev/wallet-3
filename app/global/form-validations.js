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

angular.module('baseClient')
    .config(
        ['$validationProvider', 'FeeServiceProvider', function ($validationProvider, FeeServiceProvider, $injector) {


            angular.extend($validationProvider, {
                validCallback: function (element) {
                    $(element).parents('.form-group:first').removeClass('has-error');
                },
                invalidCallback: function (element) {
                    $(element).parents('.form-group:first').addClass('has-error');
                }
            });

            function sumJson(json) {
                if (json) {
                    for (var key in json) {
                        if (json.hasOwnProperty(key)) {
                            if (json[key]) {
                                return true;
                            }
                        }
                    }
                }
                return false;
            }

            $validationProvider.setErrorHTML(function (msg) {
                return '<label class="control-label has-error">' + msg + '</label>';
            });

            $validationProvider.setSuccessHTML(function (msg) {
                return '<label class="control-label has-error">' + msg + '</label>';
            });

            $validationProvider.showSuccessMessage = false;

            $validationProvider
                .setExpression({
                    secretphrase: function (value, scope, element, attrs, param) {
                        return scope.hasPrivateKeyInSession() || value;
                    },
                    fee: function (value, scope, element, attrs, param) {
                        var minFee;
                        if (param === 'sendToken') {
                            minFee = FeeServiceProvider.getSetAccountFee(scope.sendForm.message);
                            if (value >= minFee) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                        else if (param === 'setAccount') {
                            minFee = FeeServiceProvider.getSetAccountFee(scope.setAccountInfoForm.accountName,
                                scope.setAccountInfoForm.accountDescription);
                            if (value >= minFee) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                        else if (param === 'issueAsset') {
                            minFee = FeeServiceProvider.getIssueAssetFee();
                        } else if (param === 'deleteAsset') {
                            minFee = FeeServiceProvider.getDeleteAssetFee();
                        } else if (param === 'transferAsset') {
                            minFee = FeeServiceProvider.transferAssetFee();
                        } else if (param === 'deleteCurrency') {
                            minFee = FeeServiceProvider.getDeleteCurrencyFee();
                        } else if (param === 'transferCurrency') {
                            minFee = FeeServiceProvider.getTransferCurrencyFee();
                        } else if (param === 'createPoll') {
                            minFee = FeeServiceProvider.getCreatePollFee();
                        } else if (param === 'castVote') {
                            minFee = FeeServiceProvider.getCastVoteFee();
                        } else if (param === 'setAlias') {
                            minFee = FeeServiceProvider.getSetAliasFee();
                        } else if (param === 'deleteAlias') {
                            minFee = FeeServiceProvider.getDeleteAliasFee();
                        } else {
                            return {
                                result: false,
                                message: 'Fee must be valid'
                            };
                        }
                        if (value >= minFee) {
                            return true;
                        } else {
                            return false;
                        }

                    },
                    accountname: function (value, scope, element, attrs, param) {
                        if (value === 'undefined' || value === '' || value === null) {
                            return true;
                        }
                        else if (value.length > 100) {
                            return false;
                        } else {
                            return true;
                        }
                    },
                    accountdesc: function (value, scope, element, attrs, param) {
                        if (value === 'undefined' || value === '' || value === null) {
                            return true;
                        }
                        else if (value.length > 1000) {
                            return false;
                        }
                        else {
                            return true;
                        }
                    },
                    currencycode: function (value, scope, element, attrs, param) {
                        if (value) {
                            if (value.length >= 3 && value.length <= 5) {
                                return true;
                            }
                        }
                        return false;
                    },
                    currencytype: function (value, scope, element, attrs, param) {
                        var types = scope.issueCurrencyForm.types;                  
                        return sumJson(types);

                    },
                    newPrefix: function (value, scope, element, attrs, param) {
                        var prefixValue = scope.setAliasForm.prefix;
                        if (prefixValue === 'new') {
                            return value;
                        }
                        return true;

                    },
                    aliasSearch: function (value, scope, element, attrs, param) {
                        if (value) {
                            if (value.length >= 3) {
                                return true;
                            }
                        }
                        return false;
                    },
                    nodeUrl: function (value, scope, element, attrs, param) {
                        var connectionMode = scope.optionsForm.CONNECTION_MODE;
                        if (connectionMode === 'AUTO') {
                            return true;
                        }
                        if (value) {
                            return scope.isValidUrl(value);
                        }
                        return false;
                    },

                })
                .setDefaultMsg({
                    fee: {
                        error: 'Fee is too low',
                        success: 'Thanks!'
                    },
                    accountname: {
                        error: 'Name must be less than 100 chars',
                        success: 'Account Name is valid'
                    },
                    accountdesc: {
                        error: 'Name must be less than 1000 chars',
                        success: 'Account Name is valid'
                    },
                    secretphrase: {
                        error: 'Secret Phrase is not avialbel. Please input',
                        success: 'Secret is available'
                    },
                    currencycode: {
                        error: 'Currency code must be between 3 to 5 chars',
                        success: 'Currency code is valid'
                    },
                    currencytype: {
                        error: 'Atleast one currency type must be selected',
                        success: 'Currency type is valid'
                    },
                    newPrefix: {
                        error: 'New alias type must be valid',
                        success: 'Alias type is valid'
                    },
                    aliasSearch: {
                        error: '',
                        success: ''
                    },
                    nodeUrl: {
                        error: 'Node Url is not valid',
                        success: 'Url is valid'
                    },
                    afterValidate: {
                        error: '',
                        success: ''
                    }
                });
        }]);
