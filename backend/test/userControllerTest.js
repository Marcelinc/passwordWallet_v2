const assert = require('chai').assert
const userController = require('../controllers/userController')
const { SHA512, enc, lib, HmacSHA512 } = require("crypto-js");
const jwt = require("jsonwebtoken");

describe('userController', function(){
    describe('calculateHMAC',function(){
        it('calculateHMAC_returnsStringCode_correctValuesGiven', function(){
            let result = userController.calculateHMAC('password','key')
            assert.typeOf(result,'string')
        }),
        it('calculateHMAC_returnsHMACCode_correctValuesGiven', function(){
            let result = userController.calculateHMAC('password','key')
            assert.equal(result,HmacSHA512('password','key').toString(enc.Hex))
        })
    }),
    describe('calculateSHA512',function(){
        it('calculateSHA512_returnsSHA512Code_correctValuesGiven', function(){
            let result = userController.calculateSHA512('password')
            assert.equal(result,SHA512('password').toString(enc.Hex))
        })
    }),
    describe('generateToken', function(){
        it('generateToken_returnJWTTokenString_correctIdGiven', function(){
            let result = userController.generateToken('id')
            assert.typeOf(result, 'string')
        })
    }),
    describe('comparePasswords', function(){
        it('comparePasswords_returnTrue_passwordsAreTheSame', function(){
            userPassword = userController.calculateHMAC('password',process.env.KEY)
            let user = {isPasswordKeptAsHmac: true, salt: 'salt', password: userPassword}
            let result = userController.comparePasswords('password',user)
            assert.equal(result,true)
        })
        it('comparePasswords_returnFalse_passwordsNotTheSame', function(){
            let user = {isPasswordKeptAsHmac: true, salt: 'salt', password: userController.calculateHMAC('password',process.env.KEY)}
            let result = userController.comparePasswords('1234',user)
            assert.equal(result,false)
        })
    })
})