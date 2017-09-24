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

angular.module('baseClient').filter('timestamp', ['$sce', 'moment', 'baseConfig', function ($sce, moment, baseConfig) {
    return function (val) {
        try {
            var actual = val + baseConfig.EPOCH;
            var momentObj = moment.unix(actual);
            return momentObj.format('YYYY-MM-DDTHH:mm:ss');
        } catch (e) {
            return val;
        }
    };
}]);

angular.module('baseClient').filter('amountTQT', ['$sce','baseConfig', function ($sce, baseConfig) {
    return function (val) {
        if (!val) {
            val = 0;
        }
        var amount = val / baseConfig.TOKEN_QUANTS;
        return amount.toLocaleString('en-US', {minimumFractionDigits: 2});
    };
}]);

angular.module('baseClient').filter('amountToDecimal', ['$sce','baseConfig', function ($sce, baseConfig) {
    return function (val, numOfDecimals) {
        if (!val) {
            val = 0;
        }
        val = val * Math.pow(10, numOfDecimals);
        return val.toLocaleString('en-US', {minimumFractionDigits: numOfDecimals});
    };
}]);

angular.module('baseClient').filter('numericalString', ['$sce','baseConfig', function ($sce, baseConfig) {
    return function (val) {
        if (!val) {
            val = 0;
        }
        return val.toLocaleString('en-US', {minimumFractionDigits: 2});
    };
}]);

angular.module('baseClient').filter('amountToQuant', ['$sce', 'baseConfig', function ($sce, baseConfig) {
    return function (val) {
        if (!val) {
            val = 0;
        }

        var amount = parseInt( parseFloat(val) * baseConfig.TOKEN_QUANTS) ;

        return amount;
    };
}]);

angular.module('baseClient').filter('quantToAmount', ['$sce', 'baseConfig', function ($sce, baseConfig) {
    return function (val) {
        if (!val) {
            val = 0;
        }
        var amount = parseFloat(val) / baseConfig.TOKEN_QUANTS;
        return amount;
    };
}]);

angular.module('baseClient').filter('fiatUSD', ['$sce', 'baseConfig', function ($sce, baseConfig) {
    return function (val) {
        if (!val) {
            val = 0;
        }
        val = (val ) * 0.0000;
        return val;
    };
}]);

angular.module('baseClient').filter('amountTKN', ['$sce', function ($sce) {
    return function (val) {
        if (!val) {
            val = 0;
        }
        var amount = parseFloat(val);
        return amount.toLocaleString('en-US', {minimumFractionDigits: 2});
    };
}]);

angular.module('baseClient').filter('supply', ['$sce', function ($sce) {
    return function (val, numOfDecimals) {
        var actualPow = numOfDecimals;
        var divider = Math.pow(10, actualPow);
        val = val / divider;
        return val.toLocaleString('en-US', {minimumFractionDigits: 2});
    };
}]);

angular.module('baseClient').filter('quantityToShare', ['$sce', function ($sce) {
    return function (val, numOfDecimals) {
        var actualPow = numOfDecimals;
        var divider = Math.pow(10, actualPow);
        val = parseFloat(val) / divider;
        return val;
    };
}]);

angular.module('baseClient').filter('shareToQuantiy', ['$sce', function ($sce) {
    return function (val, numOfDecimals) {
        var actualPow = numOfDecimals;
        var multiplier = Math.pow(10, actualPow);
        val = parseFloat(val) * multiplier;
        return val;
    };
}]);

angular.module('baseClient').filter('decimals', ['$sce', function ($sce) {
    return function (val, numOfDecimals) {
        var divider = Math.pow(10, numOfDecimals);
        val = val / divider;
        return val.toLocaleString('en-US', {minimumFractionDigits: 2});
    };
}]);

angular.module('baseClient').filter('numberString', ['$sce', function ($sce) {
    return function (val, numOfDecimals) {
        return val.toLocaleString('en-US', {maximumFractionDigits: numOfDecimals});
    };
}]);

angular.module('baseClient').filter('transactionConf', ['$sce', function ($sce) {
    return function (value) {
        if (!value) {
            value = 0;
        }
        if (value === 0) {

            return '<span class="label label-default">' + value + '</span>';

        } else if (value > 0 && value < 10) {

            return '<span class="label label-danger">' + value + '</span>';

        } else if (value >= 10 && value < 100) {

            return '<span class="label label-warning">' + value + '</span>';

        } else if (value >= 100 && value < 720) {

            return '<span class="label label-success">' + value + '</span>';

        } else if (value >= 720) {

            return '<span class="label label-success"> +720</span>';

        } else {

            return '<span class="label label-primary">' + value + '</span>';

        }
    };
}]);

angular.module('baseClient').filter('transactionType', ['$sce', function ($sce) {
    return function (type, subType) {

        switch (type) {
            case 0:
                return '<i class="fa fa-usd" aria-hidden="true"></i>';
            case 1:
                return '<i class="fa fa-envelope" aria-hidden="true"></i>';
            case 2:
                return '<span class="glyphicon glyphicon-signal" aria-hidden="true"></span>';
            case 4:
                return '<span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span>';
            case 5:
                return ' <i class="fa fa-random" aria-hidden="true"></i> ';
            case 7:
                return '<span class="glyphicon glyphicon-link" aria-hidden="true"></span>';
        }
    };

}]);

angular.module('baseClient').filter('transactionIconSubType', ['$sce', function ($sce) {
    return function (type, subType) {

        switch (type) {
            case 0:
                switch (subType) {
                    case 0:
                        return '<i class="fa fa-usd" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Ordinary Payment"></i>';
                    default:
                        return subType;
                }
                break;
            case 1:
                switch (subType) {
                    case 0:
                        return '<i class="fa fa-envelope-o" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Encrypted Message"></i>';
                    case 1:
                        return '<i class="fa fa-share-alt" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Alias Assigment"></i>';
                    case 2:
                        return '<i class="fa fa-signal" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Poll Creation"></i>';
                    case 3:
                        return '<i class="fa fa-signal" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Vote Casting"></i>';
                    case 4:
                        return '<i class="fa fa-credit-card" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Hub Announcement"></i>';
                    case 5:
                        return '<i class="fa fa-credit-card" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Account Info"></i>';
                    case 6:
                        return '<i class="fa fa-share-alt" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Alias Sell"></i>';
                    case 7:
                        return '<i class="fa fa-share-alt" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Alias Buy"></i>';
                    case 8:
                        return '<i class="fa fa-share-alt" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Alias Delete"></i>';
                    case 9:
                        return '<i class="fa fa-signal" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Phasing Vote Casting"></i>';
                    case 10:
                        return '<i class="fa fa-credit-card" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Account Property"></i>';
                    case 11:
                        return '<i class="fa fa-credit-card" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Account Property delete"></i>';
                    default:
                        return subType;
                }
                break;
            case 2:
                switch (subType) {
                    case 0:
                        return '<i class="fa fa-bar-chart" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Asset Issuance"></i>';
                    case 1:
                        return '<i class="fa fa-bar-chart" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Asset Transfer"></i>';
                    case 2:
                        return '<i class="fa fa-bar-chart" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Ask Order Placement"></i>';
                    case 3:
                        return '<i class="fa fa-bar-chart" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Bid Order Placement"></i>';
                    case 4:
                        return '<i class="fa fa-bar-chart" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Ask Order Cancellation"></i>';
                    case 5:
                        return '<i class="fa fa-bar-chart" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Bid Order Cancellation"></i>';
                    case 6:
                        return '<i class="fa fa-bar-chart" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Dividend Payment"></i>';
                    case 7:
                        return '<i class="fa fa-bar-chart" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Asset Delete"></i>';
                    default:
                        return subType;
                }
                break;
            case 4:
                switch (subType) {
                    case 0:
                        return '<i class="fa fa-credit-card" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Effective Balance Lease"></i>';
                    case 1:
                        return '<i class="fa fa-credit-card" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Account Control"></i>';
                    default:
                        return subType;
                }
                break;
            case 5:
                switch (subType) {
                    case 0:
                        return '<i class="fa fa-random" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Currency Issuance"></i>';
                    case 1:
                        return '<i class="fa fa-random" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Reserve Increase"></i>';
                    case 2:
                        return '<i class="fa fa-random" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Resverve Claim"></i>';
                    case 3:
                        return '<i class="fa fa-random" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Currency Transfer"></i>';
                    case 4:
                        return '<i class="fa fa-random" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Publish Exchange Offer"></i>';
                    case 5:
                        return '<i class="fa fa-random" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Exchange Buy"></i>';
                    case 6:
                        return '<i class="fa fa-random" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Exchange Sell"></i>';
                    case 7:
                        return '<i class="fa fa-random" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Currency Minting"></i>';
                    case 8:
                        return '<i class="fa fa-random" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Currency Deletion"></i>';
                    default:
                        return subType;
                }
                break;

            default:
                return subType;
        }
    };
}]);

angular.module('baseClient').filter('transactionTextSubType', ['$sce', function ($sce) {
    return function (type, subType) {

        switch (type) {
            case 0:
                switch (subType) {
                    case 0:
                        return 'Ordinary Payment';
                    default:
                        return subType;
                }
                break;
            case 1:
                switch (subType) {
                    case 0:
                        return 'Arbitary Message';
                    case 1:
                        return 'Alias Assignment';
                    case 2:
                        return 'Poll Creation';
                    case 3:
                        return 'Vote Casting';
                    case 4:
                        return 'Hub Announcement';
                    case 5:
                        return 'Account Info';
                    case 6:
                        return 'Alias Sell';
                    case 7:
                        return 'Alias Buy';
                    case 8:
                        return 'Alias Delete';
                    case 9:
                        return 'Phasing Vote Casting';
                    case 10:
                        return 'Account Property';
                    case 11:
                        return 'Account Property delete';
                    default:
                        return subType;
                }
                break;
            case 2:
                switch (subType) {
                    case 0:
                        return 'Asset Issuance';
                    case 1:
                        return 'Asset Transfer';
                    case 2:
                        return 'Ask Order Placement';
                    case 3:
                        return 'Bid Order Placement';
                    case 4:
                        return 'Ask Order Cancellation';
                    case 5:
                        return 'Bid Order Cancellation';
                    case 6:
                        return 'Dividend Payment';
                    case 7:
                        return 'Asset Delete';
                    default:
                        return subType;
                }
                break;

            case 4:
                switch (subType) {
                    case 0:
                        return 'Effective Balance Lease';
                    case 1:
                        return 'Phasing Only';
                    default:
                        return subType;
                }
                break;
            case 5:
                switch (subType) {
                    case 0:
                        return 'Currency Issuance';
                    case 1:
                        return 'Reserve Increase';
                    case 2:
                        return 'Resverve Claim';
                    case 3:
                        return 'Currency Transfer';
                    case 4:
                        return 'Publish Exchange Offer';
                    case 5:
                        return 'Exchange Buy';
                    case 6:
                        return 'Exchange Sell';
                    case 7:
                        return 'Currency Minting';
                    case 8:
                        return 'Currency Deletion';
                    default:
                        return subType;
                }
                break;

            default:
                return subType;
        }
    };
}]);

angular.module('baseClient').filter('blockTransactions', ['$sce', function ($sce) {
    return function (value) {
        if (value === 0) {
            return '<span class="label label-default">' + value + '</span>';
        } else if (value > 0 && value < 100) {
            return '<span class="label label-success">' + value + '</span>';
        } else if (value >= 100 && value < 200) {
            return '<span class="label label-warning">' + value + '</span>';
        } else if (value >= 200) {
            return '<span class="label label-danger">' + value + '</span>';
        }
    };
}]);

angular.module('baseClient').filter('isEmpty', ['$sce', function ($sce) {
    return function (val) {
        if (val === undefined || val === '') {
            return 'No Data Available';
        } else {
            return val;
        }
    };
}]);

angular.module('baseClient').filter('notSet', ['$sce', function ($sce) {
    return function (val) {
        if (val === undefined || val === '') {
            return 'Not set';
        } else {
            return val;
        }
    };
}]);

angular.module('baseClient').filter('noOutbound', ['$sce', function ($sce) {
    return function (val) {
        if (val === undefined || val === '') {
            return 'No public key available, no outbound transaction made.';
        } else {
            return val;
        }
    };
}]);

angular.module('baseClient').filter('searchTerm', ['$sce', function ($sce) {
    return function (val) {
        if (val) {
            return '<a href="" ng-controller="SearchCtrl" ng-click="searchValue(\'' + val +
                '\')">' + val + '</a>';
        } else {
            return '';
        }

    };
}]);

angular.module('baseClient').directive('compile', ['$compile', function ($compile) {
    return function (scope, element, attrs) {
        scope.$watch(
            function (scope) {
                // watch the 'compile' expression for changes
                return scope.$eval(attrs.compile);
            },
            function (value) {
                // when the 'compile' expression changes
                // assign it into the current DOM
                element.html(value);

                // compile the new DOM and link it to the current
                // scope.
                // NOTE: we only compile .childNodes so that
                // we don't get into infinite loop compiling ourselves
                $compile(element.contents())(scope);
            }
        );
    };
}]);

angular.module('baseClient').directive('dynamic', ['$compile', function ($compile) {
    return {
        restrict: 'A',
        replace: true,
        link: function (scope, ele, attrs) {
            scope.$watch(attrs.dynamic, function (html) {
                ele.html(html);
                $compile(ele.contents())(scope);
            });
        }
    };
}]);

angular.module('baseClient').filter('currencyModel', ['$sce', function ($sce) {
    return function (val) {
        switch (val) {
            case 1:
                return 'Exchangeable';
            case 8:
                return 'Claimable';
            case 16:
                return 'Mintable';
            case 2:
                return 'Controllable';
            case 4:
                return 'Reservable';
            case 32:
                return 'Non Shuffleable';
            default:
                return val;
        }
    };
}]);

angular.module('baseClient').filter('range', function () {
    return function (input, total) {
        total = parseInt(total);

        for (var i = 0; i < total; i++) {
            input.push(i);
        }

        return input;
    };
});

angular.module('baseClient').filter('JSONStringify', ['$sce', function ($sce) {
    return function (data) {

        return JSON.stringify(data);

    };
}]);

angular.module('baseClient').filter('isEnabled', ['$sce', function ($sce) {
    return function (val) {
        switch (val) {
            case true:
                return '</small> <i class="fa fa-check" aria-hidden="true"></i></small>';
            case false:
                return '</small> <i class="fa fa-times" aria-hidden="true"></i></small>';
            default:
                return '</small> <i class="fa fa-times" aria-hidden="true"></i> </small>';
        }
    };
}]);

angular.module('baseClient').filter('isMessage', ['$sce', function ($sce) {
    return function (type, subType) {

        if (type === 1 && subType === 0) {
            return '</small> <i class="fa fa-check" aria-hidden="true"></i> </small>';
        } else {
            return '</small> <i class="fa fa-times" aria-hidden="true"></i> </small>';
        }

    };
}]);

angular.module('baseClient').filter('isMultisig', ['$sce', function ($sce) {
    return function (type, subType) {

        if (type === 1 && subType === 0) {
            return '</small> <i class="fa fa-check" aria-hidden="true"></i> </small>';
        } else {
            return '</small> <i class="fa fa-times" aria-hidden="true"></i> </small>';
        }

    };
}]);

angular.module('baseClient').filter('hasMessage', ['$sce', function ($sce) {
    return function (row, account) {
        if (row.attachment.encryptedMessage) {
            if (account === row.senderRS) {
                return ' <i class="fa fa-upload" aria-hidden="true" style="color: black;"></i> ';
            } else if (account === row.recipientRS) {
                return '<i class="fa fa-download" aria-hidden="true" style="color:black;"></i>';
            } else {
                return '</small> <i class="fa fa-check" aria-hidden="true"></i> </small>';
            }
        } else {
            return '</small> <i class="fa fa-times" aria-hidden="true"></i> </small>';
        }

    };
}]);

angular.module('baseClient').filter('hasMessageDirection', ['$sce', function ($sce) {
    return function (row, account) {
        if (account === row.senderRS) {
            return ' <i class="fa fa-upload" aria-hidden="true" style="color:back;"></i> ';
        } else {
            return '<i class="fa fa-download" aria-hidden="true" style="color:back;"></i>';
        }
    };
}]);

angular.module('baseClient').filter('controlModel', ['$sce', function ($sce) {
    return function (val) {

        val = parseInt(val);

        switch (val) {
            case 0:
                return 'Account';
            case 1:
                return 'Balance';
            case 2:
                return 'Asset';
            case 3:
                return 'Currency';
            default:
                return val;
        }
    };
}]);

angular.module('baseClient').filter('votingModel', ['$sce', function ($sce) {
    return function (val) {

        val = parseInt(val);

        switch (val) {
            case 0:
                return 'Account';
            case 1:
                return 'Balance';
            case 2:
                return 'Asset';
            case 3:
                return 'Currency';
            default:
                return val;
        }
    };
}]);

angular.module('baseClient').filter('votingModelLabel', ['$sce', function ($sce) {
    return function (val) {

        val = parseInt(val);

        switch (val) {
            case 0:
                return '<i class="fa fa-user-o" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Account"></i>'; // Account
            case 1:
                return '<i class="fa fa-credit-card" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Balance"></i>'; // 'Balance';
            case 2:
                return '<i class="fa fa-bar-chart" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Asset"></i>'; // 'Asset';
            case 3:
                return '<i class="fa fa-random" aria-hidden="true" popover-placement="top" popover-trigger="\'mouseenter\'" uib-popover="Currency"></i>'; //'Currency';
            default:
                return val;
        }
    };
}]);

angular.module('baseClient').filter('buysell', ['$sce', function ($sce) {
    return function (val) {
        switch (val) {
            case 'buy':
                return '<span class="label label-success">B</span>';
            case 'sell':
                return '<span class="label label-danger">S</span>';
            default:
                return '<span class="label label-default">U</span>';
        }
    };
}]);

angular.module('baseClient').filter('txIsValid', ['$sce', function ($sce) {
    return function (val) {
        switch (val) {
            case true:
                return '</small> <i class="fa fa-check" aria-hidden="true" style="color:green"></i></small>';
            case false:
                return '</small> <i class="fa fa-times" aria-hidden="true" style="color:red"></i></small>';
            default:
                return '</small> <i class="fa fa-times" aria-hidden="true" style="color:red"></i> </small>';
        }
    };
}]);

angular.module('baseClient').filter('isService', ['$sce', function ($sce) {
    return function (val) {
        if (val === undefined || val === '') {
            return 'Service';
        } else {
            return val;
        }
    };
}]);

angular.module('baseClient').filter('isSync', ['$sce', function ($sce) {
    return function (val) {
        switch (val) {
            case true:
                return 'NO';
            case false:
                return 'Yes';
            default:
                return 'NO';
        }
    };
}]);

angular.module('baseClient').filter('replaceQuotes', ['$sce', function ($sce) {
  return function (val) {
    return val.replace(/("|')/g, "");
  };
}]);

angular.module('baseClient').filter('txDirection', ['$sce', function ($sce) {
    return function (account, row) {
        if (account === row.senderRS) {
            return ' <i class="fa fa-chevron-circle-up" aria-hidden="true" style="color:red;"></i> ';
        } else {
            return '<i class="fa fa-chevron-circle-down" aria-hidden="true" style="color:green;"></i>';
        }
    };
}]);

angular.module('baseClient').filter('pollDays', ['$sce', function ($sce) {
    return function (value) {
        if (!value) {
            value = 0;
        }
        if (value <= 0) {

            return '<span class="label label-default" style="width:50px;">' + value + '</span>';

        } else if (value > 0 && value < 3) {

            return '<span class="label label-danger" style="width:50%;">' + value + '</span>';

        } else if (value >= 3 && value < 7) {

            return '<span class="label label-warning" style="width:50px;">' + value + '</span>';

        } else if (value >= 7) {

            return '<span class="label label-success" style="width:50px;">' + value + '</span>';

        } else {

            return '<span class="label label-primary" style="width:50px;">' + value + '</span>';

        }
    };
}]);

angular.module('baseClient').filter('upDown', ['$sce', function ($sce) {
    return function (value) {
        if (!value) {
            value = 0;
        }
        if (value === 0) {
            return '<span class="label label-default" >' + value + '</span>';
        } else if (value > 0) {
            return '<span class="label label-success" >' + value + '</span>';
        } else if (value < 0) {
            return '<span class="label label-danger"  >' + value + '</span>';
        } else {
            return '<span class="label label-primary" >' + value + '</span>';
        }
    };
}]);
