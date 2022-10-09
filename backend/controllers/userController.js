const User = require("../models/User");
const asyncHandler = require('express-async-handler');
const { SHA512, enc, lib, HmacSHA512 } = require("crypto-js");
const jwt = require("jsonwebtoken");

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
                    login: newUser.login,
                    token: generateToken(newUser._id)
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

    //Check for user's login
    const user = await User.findOne({login})
    if(user){
        //check passwords
        var givenPasswordHash
        if(user.isPasswordKeptAsHmac)
            givenPasswordHash = calculateHMAC(password,process.env.KEY)
        if(!user.isPasswordKeptAsHmac)
            givenPasswordHash = calculateSHA512(process.env.PEPPER+user.salt+password) 
        
        if(user.password != givenPasswordHash)
            res.status(400).json({message: 'Bad login or password'})
        
        res.status(200).json({message:'Success',data:{
            id: user._id,
            login: user.login,
            token: generateToken(user._id)
        }})
    }
    if(!user){
        res.status(400).json({message:'There is no user with given login'})
    }
})


// @desc Verify user
// @route GET /api/user/getMe
// @access Public
const verifyUser = asyncHandler(async (req,res) => {
    
    try{
        const user = await User.findById(req.user.id, 'login _id')

        if(!user)
            res.status(400).json({message: 'Not authorized'})
        
        id(user) 
            res.status(200).json({message: 'Authorized'})
    } catch(error){
        process.env.NODE_ENV === 'development' ? res.status(500).json('Server problem: '+error) :
        res.status(500).json('Server problem')
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

const generateToken = (id) => jwt.sign({id},process.env.JWT_SECRET,{expiresIn: '30d'})

module.exports = {
    registerUser,
    loginUser,
    verifyUser
}