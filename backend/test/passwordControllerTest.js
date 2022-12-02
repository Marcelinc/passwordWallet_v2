const assert = require('chai').assert
const passwordController = require('../controllers/passwordController')
const { SHA512, MD5, enc, lib, HmacSHA512 } = require("crypto-js");
const { calculateHMAC } = require('../controllers/userController');

describe('passwordController',() => {
    describe('validate', () => {
        it('validate_returnsTrue_givenPasswordAndAddressCorrect', () => {
            let result = passwordController.validate('password','address')
            assert.equal(result,true)
        }),
        it('validate_returnsFalse_givenPasswordIncorrect',() => {
            let result = passwordController.validate('','address')
            assert.equal(result,false)
        })
    }),
    describe('calculateMD5', () => {
        it('calculateMD5_returnMD5Key_keyGeneretedOnPassword', () => {
            let result = passwordController.calculateMD5('1234')
            assert.equal(result,MD5('1234').toString())
        })
    }),
    describe('elements', () => {
        it('addElements_returnsAddedElements_elementsGiven', () => {
            let result = passwordController.elements('description','login')
            assert.deepEqual(result,{description:'description',login:'login'})
        }),
        it('addElements_returnOneAddedElement_onlyLoginGiven', () => {
            let result = passwordController.elements('','login')
            assert.deepEqual(result,{login:'login'})
        })
    })
})