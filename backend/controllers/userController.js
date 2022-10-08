const User = require("../models/User");
const asyncHandler = require('express-async-handler');
const { SHA512, enc, lib, HmacSHA512 } = require("crypto-js");

// @desc Register an user
// @route POST /api/users/register
// @access Public
const registerUser = asyncHandler(async (req,res) => {
    const {login,password,type} = req.body

    if(!login || !password){
        res.status(400).json('Please add all fields')
    }

    try{
        const user = await User.findOne({login})
        if(user){
            res.status(400)
            return Promise.reject('User exists')
        }

        var encryptedPassword
        var salt = ''
        var isPasswordKeptAsHmac = false

        if(type === 'sha512'){
            //sha512 encryption
            salt = lib.WordArray.random(16)  //32 characters
            //console.log(salt.toString(enc.Hex))
            //console.log(process.env.PEPPER)
            encryptedPassword = calculateSHA512(process.env.PEPPER+salt+password)
        }
        if(type === 'hmac'){
            //hmac encryption
            encryptedPassword = calculateHMAC(password,process.env.KEY)
            isPasswordKeptAsHmac = true
        }

        //Create user
        const newUser = await User.create({login,password:encryptedPassword,salt,isPasswordKeptAsHmac})

        if(newUser)
            res.status(201).json({
                message: 'Success',
                data: {
                    id:newUser._id,
                    login: newUser.login
                }
            })
        else{
            res.status(400)
            return Promise.reject('Invalid user data')
        }
    } catch(error){
        console.log(error)
        res.json({message:error})
    }
})


// @desc Login an user
// @route POST /api/users/login
// @access Public
const loginUser = asyncHandler(async (req,res) => {
    const {login,password} = req.body

    const user = await User.findOne({login})
    if(user){
        //check passwords
    }
    if(!user){
        res.status(400).json({message:'There is no user with given login'})
    }
})


//Additional functions
const calculateSHA512 = password => {
    var hashedPassword = SHA512(password)
    return hashedPassword.toString(enc.Hex)
}

const calculateHMAC = (password,key) => {
    var hashedPassword = HmacSHA512(password,key)
    //console.log(hashedPassword.toString(enc.Hex))
    return hashedPassword.toString(enc.Hex)
}

module.exports = {
    registerUser
}