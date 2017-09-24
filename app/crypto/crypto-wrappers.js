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


  angular.module('crypto').factory('converters', ['$window', function ($window) {
      if ($window.converters) {
          $window.thirdParty = $window.thirdParty || {};
          $window.thirdParty.converters = $window.converters;
          try {
              delete $window.converters;
          } catch (e) {
              $window.converters = undefined;
          }
      }
      return $window.thirdParty.converters;
  }]);

  angular.module('crypto').factory('PassPhraseGenerator', ['$window', function ($window) {
      if ($window.PassPhraseGenerator) {
          $window.thirdParty = $window.thirdParty || {};
          $window.thirdParty.PassPhraseGenerator = $window.PassPhraseGenerator;
          try {
              delete $window.PassPhraseGenerator;
          } catch (e) {
              $window.PassPhraseGenerator = undefined;
          }
      }
      return $window.thirdParty.PassPhraseGenerator;
  }]);

  angular.module('crypto').factory('curve25519', ['$window', function ($window) {
      $window.thirdParty = $window.thirdParty || {};
      $window.thirdParty.curve25519 = $window.curve25519;
      try {
          delete $window.curve25519;
      } catch (e) {
          $window.curve25519 = undefined;
      }
      return $window.thirdParty.curve25519;
  }]);

  angular.module('crypto').factory('pako', ['$window', function ($window) {
      $window.thirdParty = $window.thirdParty || {};
      $window.thirdParty.pako = $window.pako;
      try {
          delete $window.pako;
      } catch (e) {
          $window.pako = undefined;
      }
      return $window.thirdParty.pako;
  }]);

  angular.module('crypto').factory('curve25519_', ['$window', function ($window) {
      $window.thirdParty = $window.thirdParty || {};
      $window.thirdParty.curve25519_ = $window.curve25519_;
      try {
          delete $window.curve25519_;
      } catch (e) {
          $window.curve25519_ = undefined;
      }
      return $window.thirdParty.curve25519_;
  }]);

  angular.module('crypto').factory('CryptoJS_SHA256', ['$window', function ($window) {
      $window.thirdParty = $window.thirdParty || {};
      $window.thirdParty.CryptoJS_SHA256 = $window.CryptoJS.SHA256;
      try {
          delete $window.CryptoJS.SHA256;
      } catch (e) {
          $window.CryptoJS.SHA256 = undefined;
      }
      return $window.thirdParty.CryptoJS_SHA256;
  }]);

  angular.module('crypto').factory('CryptoJS_CipherParams', ['$window', function ($window) {
      $window.thirdParty = $window.thirdParty || {};
      $window.thirdParty.CryptoJS_CipherParams = $window.CryptoJS.lib.CipherParams;
      try {
          delete $window.CryptoJS.lib.CipherParams;
      } catch (e) {
          $window.CryptoJS.lib.CipherParams = undefined;
      }
      return $window.thirdParty.CryptoJS_CipherParams;
  }]);

  angular.module('crypto').factory('AES', ['$window', function ($window) {
      $window.thirdParty = $window.thirdParty || {};
      $window.thirdParty.AES = $window.CryptoJS.AES;
      try {
          delete $window.CryptoJS.AES;
      } catch (e) {
          $window.CryptoJS.AES= undefined;
      }
      return $window.thirdParty.AES;
  }]);

  angular.module('crypto').factory('RsAddress', ['$window', function ($window) {
      $window.thirdParty = $window.thirdParty || {};
      $window.thirdParty.rsAddress = $window.rsAddress;
      try {
          delete $window.rsAddress;
      } catch (e) {
          $window.rsAddress = undefined;
      }
      return $window.thirdParty.rsAddress;
  }]);

  angular.module('crypto').factory('_hash', ['$window', function ($window) {
      return {
          init: $window.SHA256_init,
          update: $window.SHA256_write,
          getBytes: $window.SHA256_finalize
      };
  }]);

  angular.module('crypto').factory('cryptoUtils', [function () {
      return {
          byteArrayToBigInteger: function (byteArray, startIndex) {
              var value = new BigInteger('0', 10);
              var temp1, temp2;
              for (var i = byteArray.length - 1; i >= 0; i--) {
                  temp1 = value.multiply(new BigInteger('256', 10));
                  temp2 = temp1.add(new BigInteger(byteArray[i].toString(10), 10));
                  value = temp2;
              }
              return value;
          }
      };
  }]);

  angular.module('crypto').factory('sha256', ['$window', function ($window) {
      $window.thirdParty = $window.thirdParty || {};
      $window.thirdParty.sha256 = $window.CryptoJS.algo.SHA256;
      try {
          delete $window.CryptoJS.algo.SHA256;
      } catch (e) {
          $window.CryptoJS.algo.SHA256 = undefined;
      }
      return $window.thirdParty.sha256;
  }]);
