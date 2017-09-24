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


/*jshint bitwise: false*/
angular.module('crypto')
    .service('CryptoService',
        ['PassPhraseGenerator', 'converters', 'curve25519', 'cryptoUtils', 'RsAddress', '_hash', 'sha256',
            'curve25519_', 'pako', 'CryptoJS_SHA256', 'CryptoJS_CipherParams', 'AES',
            function (PassPhraseGenerator, converters, curve25519, cryptoUtils, RsAddress, _hash, sha256, curve25519_,
                      pako, CryptoJS_SHA256, CryptoJS_CipherParams, AES) {

                function curve25519_clamp(curve) {
                    curve[0] &= 0xFFF8;
                    curve[15] &= 0x7FFF;
                    curve[15] |= 0x4000;
                    return curve;
                }

                function simpleHash(b1, b2) {
                    var sha = sha256.create();
                    sha.update(converters.byteArrayToWordArray(b1));
                    if (b2) {
                        sha.update(converters.byteArrayToWordArray(b2));
                    }
                    var hash = sha.finalize();
                    return converters.wordArrayToByteArrayImpl(hash, false);
                }

                function getPrivateKey(secretPhrase) {
                    var bytes = simpleHash(converters.stringToByteArray(secretPhrase));
                    return converters.shortArrayToHexString(curve25519_clamp(converters.byteArrayToShortArray(bytes)));
                }

                function getSharedSecret(key1, key2) {
                    return converters.shortArrayToByteArray(
                        curve25519_(converters.byteArrayToShortArray(key1), converters.byteArrayToShortArray(key2),
                            null));
                }

                function getSharedKey(privateKey, publicKey, nonce) {
                    var sharedSecret = getSharedSecret(privateKey, publicKey);
                    for (var i = 0; i < 32; i++) {
                        sharedSecret[i] ^= nonce[i];
                    }
                    return simpleHash(sharedSecret);
                }

                function getRandomValues(nonce) {
                    if (window.crypto) {
                        window.crypto.getRandomValues(nonce);
                    } else {
                        window.msCrypto.getRandomValues(nonce);
                    }
                    return nonce;
                }

                function toByteArray(long) {
                    // we want to represent the input as a 8-bytes array
                    var byteArray = [0, 0, 0, 0];

                    for ( var index = 0; index < byteArray.length; index ++ ) {
                        var byte = long & 0xff;
                        byteArray [ index ] = byte;
                        long = (long - byte) / 256 ;
                    }

                    return byteArray;
                }

                function byteArrayToBigInteger(byteArray) {
                    var value = new BigInteger('0', 10);
                    for (var i = byteArray.length - 1; i >= 0; i--) {
                        value = value.multiply(new BigInteger('256', 10)).add(new BigInteger(byteArray[i].toString(10), 10));
                    }
                    return value;
                }

                function getUtf8Bytes (str) {
                    var utf8 = unescape(encodeURIComponent(str));
                    var arr = [];
                    for (var i = 0; i < utf8.length; i++) {
                        arr[i] = utf8.charCodeAt(i);
                    }
                    return arr;
                }

                this.encryptMessage = function (msgStrg, senderSecretHex, receiverPublicKey) {

                    var secret = converters.hexStringToString(senderSecretHex);

                    var senderPrivateKeyBytes = converters.hexStringToByteArray(getPrivateKey(secret));
                    var receiverPublicKeyBytes = converters.hexStringToByteArray(receiverPublicKey);

                    var sharedKey = getSharedSecret(senderPrivateKeyBytes, receiverPublicKeyBytes);
                    var nonce = getRandomValues(new Uint8Array(32));

                    var msgBytes = converters.stringToByteArray(msgStrg);
                    var msgCompressed = pako.gzip(new Uint8Array(msgBytes));
                    var msgWordArray = converters.byteArrayToWordArray(msgCompressed);

                    for (var i = 0; i < 32; i++) {
                        sharedKey[i] ^= nonce[i];
                    }

                    var key = CryptoJS_SHA256(converters.byteArrayToWordArray(sharedKey));
                    var tmp = getRandomValues(new Uint8Array(16));
                    var iv = converters.byteArrayToWordArray(tmp);
                    var encrypted = AES.encrypt(msgWordArray, key, {iv: iv});
                    var ivOut = converters.wordArrayToByteArray(encrypted.iv);
                    var ciphertextOut = converters.wordArrayToByteArray(encrypted.ciphertext);

                    var data = ivOut.concat(ciphertextOut);

                    return {
                        'nonce': converters.byteArrayToHexString(nonce), 'data': converters.byteArrayToHexString(data)
                    };

                };

                this.decryptMessage = function (msgHex, nonceHex, recieverSecretHex, senderPublicKey) {

                    var secret = converters.hexStringToString(recieverSecretHex);
                    var recieverPrivateKeyBytes = converters.hexStringToByteArray(getPrivateKey(secret));
                    var senderPublicKeyBytes = converters.hexStringToByteArray(senderPublicKey);

                    var nonce = converters.hexStringToByteArray(nonceHex);
                    var sharedKey = getSharedSecret(recieverPrivateKeyBytes, senderPublicKeyBytes);

                    var ivCiphertext = converters.hexStringToByteArray(msgHex);

                    if (ivCiphertext.length < 16 || ivCiphertext.length % 16 !== 0) {
                        console.log('Invalid Ciphertext');
                    }

                    var iv = converters.byteArrayToWordArray(ivCiphertext.slice(0, 16));
                    var ciphertext = converters.byteArrayToWordArray(ivCiphertext.slice(16));

                    var key;
                    if (nonce) {
                        for (var i = 0; i < 32; i++) {
                            sharedKey[i] ^= nonce[i];
                        }
                        key = CryptoJS_SHA256(converters.byteArrayToWordArray(sharedKey));
                    } else {
                        key = converters.byteArrayToWordArray(sharedKey);
                    }

                    var encrypted = CryptoJS_CipherParams.create({
                        ciphertext: ciphertext,
                        iv: iv,
                        key: key
                    });

                    var decrypted = AES.decrypt(encrypted, key, {
                        iv: iv
                    });

                    var compressedPlaintext = converters.wordArrayToByteArray(decrypted);

                    var binData = new Uint8Array(compressedPlaintext);
                    var msgString = converters.byteArrayToString(pako.inflate(binData));

                    return msgString;

                };

                this.generatePassPhrase = function () {
                    return PassPhraseGenerator.generatePassPhrase();
                };

                this.getAccountDetails = function (secret) {
                    var accountDetails = {};
                    accountDetails.publicKey = this.secretPhraseToPublicKey(secret);
                    accountDetails.accountId = this.publicKeyToAccountId(accountDetails.publicKey);
                    accountDetails.accountRs = this.accountIdToAccountRS(accountDetails.accountId);
                    return accountDetails;
                };

                this.secretPhraseToPublicKey = function (secretPhrase) {

                    var secretPhraseBytes = converters.stringToByteArray(secretPhrase);
                    var digest = simpleHash(secretPhraseBytes);
                    return converters.byteArrayToHexString(curve25519.keygen(digest).p);

                };

                this.getBlockTime = function(epoch) {
              		return Math.floor(Date.now() / 1000) - epoch;
              	};

                this.generateToken = function(message, secretHex, publicKey, epoch) {
                    var messageBytes = getUtf8Bytes(message);
                    var pubKeyBytes = converters.hexStringToByteArray( publicKey );
                    var token = pubKeyBytes;

                    var tsb = [];
                    var ts = epoch;
                    tsb[0] = ts & 0xFF;
                    tsb[1] = (ts >> 8) & 0xFF;
                    tsb[2] = (ts >> 16) & 0xFF;
                    tsb[3] = (ts >> 24) & 0xFF;

                    messageBytes = messageBytes.concat(pubKeyBytes, tsb);
                    token = token.concat(tsb, converters.hexStringToByteArray(
                              this.signatureHex(   converters.byteArrayToHexString(messageBytes) , secretHex) ));

                    var buf = '';
                    for (var ptr = 0; ptr < 100; ptr += 5) {
                        var nbr = [];
                        nbr[0] = token[ptr] & 0xFF;
                        nbr[1] = token[ptr+1] & 0xFF;
                        nbr[2] = token[ptr+2] & 0xFF;
                        nbr[3] = token[ptr+3] & 0xFF;
                        nbr[4] = token[ptr+4] & 0xFF;
                        var number = byteArrayToBigInteger(nbr);
                        if (number < 32) {
                            buf += '0000000';
                        } else if (number < 1024) {
                            buf += '000000';
                        } else if (number < 32768) {
                            buf += '00000';
                        } else if (number < 1048576) {
                            buf += '0000';
                        } else if (number < 33554432) {
                            buf += '000';
                        } else if (number < 1073741824) {
                            buf += '00';
                        } else if (number < 34359738368) {
                            buf += '0';
                        }
                        buf +=number.toString(32);
                    }
                    return buf;
                };

                this.secretPhraseToPrivateKey = function (secretPhrase) {
                    return converters.stringToHexString(secretPhrase);
                };

                this.publicKeyToAccountId = function (publicKey) {
                    var hex = converters.hexStringToByteArray(publicKey);

                    _hash.init();
                    _hash.update(hex);

                    var account = _hash.getBytes();

                    account = converters.byteArrayToHexString(account);

                    var slice = (converters.hexStringToByteArray(account)).slice(0, 8);

                    var accountId = cryptoUtils.byteArrayToBigInteger(slice).toString();

                    return accountId;

                };

                this.accountIdToAccountRS = function (accountId) {

                    var address = new RsAddress();

                    if (address.set(accountId)) {
                        return address.toString();
                    } else {
                        return '';
                    }
                };

                this.signatureHex = function (unsignedHex, privateHex) {

                    var unsignedBytes = converters.hexStringToByteArray(unsignedHex);
                    var secretPhraseBytes = converters.hexStringToByteArray(privateHex);

                    var digest = simpleHash(secretPhraseBytes);
                    var s = curve25519.keygen(digest).s;
                    var m = simpleHash(unsignedBytes);
                    var x = simpleHash(m, s);
                    var y = curve25519.keygen(x).p;
                    var h = simpleHash(m, y);
                    var v = curve25519.sign(h, x, s);

                    return converters.byteArrayToHexString(v.concat(h));

                };

                this.signTransactionHex = function (unsignedHex, signatureHex) {

                    var payload = unsignedHex.substr(0, 192) + signatureHex + unsignedHex.substr(320);

                    return payload;
                };



            }]);
