const Password = require('../models/Password')
const asyncHandler = require('express-async-handler')
const { AES, MD5, enc, SHA512, HmacSHA512 } = require('crypto-js')
const User = require('../models/User')

// @desc Create a password
// @route POST /api/password/create
// @access Private
const createPassword = asyncHandler(async (req,res) => {
    const id = req.user._id
    const {password,web_address,description,login} = req.body

    if(validate(password,web_address)){
        //Get user's password
        const userPassword = await User.findById(id,'password -_id')


        //Create hash
        var key = calculateMD5(userPassword.password)
        if(key && key != 'Failed'){
            const hash = AES.encrypt(password,key)

            //Add nullable elements
            var nullableElements = elements(web_address,description,login)
    
    
    
            //Create and save password
            const newPassword = await Password.create({password:hash,id_user: id, web_address, description: nullableElements.description, login: nullableElements.login })
    
            if(newPassword)
                res.status(200).json({message: 'Success',data:newPassword})
            else res.status(500).json({message: 'Addind new password failed'})
        }
        else res.status(500).json({message: 'Failed during creating password'})
        
    }
    else res.status(500).json({message: 'Adding new password failed'})
    
})


// @desc Get all user passwords
// @route GET /api/password/getAll
// @access Private
const getAll = asyncHandler(async (req,res) => {
    const id = req.user._id

    const passwords = await Password.find({id_user: id})
    if(passwords)
        res.status(200).json({message: 'Success', data: passwords})
    else res.status(500).json({message: 'Problem with access to data'})
})


// @desc Decrypt password
// @route POST /api/password/decrypt
// @access Private
const decrypt = asyncHandler(async (req,res) => {
    const {password,userMainPassword} = req.body
    const id = req.user._id

    if(!userMainPassword)
        res.status(400).json({message: "Can't show password. Not verified"})
    else{
        //Check if user exists
        const user = await User.findById(id,'password isPasswordKeptAsHmac salt')
        if(!user)
            res.status(500).json({message: 'Showing password not available'})
        else{
            //Check if user passwords are the same
            if(!checkPasswords(user,userMainPassword))
                res.status(400).json({message: 'Not authorized'})
            else{
                //Decrypt password
                var key = calculateMD5(user.password)
                if(key && key != 'Failed'){
                    var decrypted = AES.decrypt(password,key).toString(enc.Utf8)
                    if(decrypted)
                        res.status(200).json({message: 'Success',data:{decrypted}})
                    else res.status(500).json({message: 'Decrypting failed'})
                } else res.status(500).json({message: 'Problem with decrypting password'})
            }
        }
    }
   
    
    
    
})


//Additional functions
const elements = (desc,login) => {
    let elements = {}
    if(desc && desc != '')
        elements.description = desc
    if(login && login != '')
        elements.login = login

    return elements
}

const validate = (password,address) => {
    var validate = true
    if(!password || password === '')
        validate = false
    if(!address || address === '')
        validate = false
    return validate
}

const calculateMD5 = (userPassword) => {
    var key = MD5(userPassword).toString()
    if(key)
        return key
    else return 'Failed'
}

const checkPasswords = (user,userPassword) => {
    if(!user.isPasswordKeptAsHmac){
        if(SHA512(process.env.PEPPER+user.salt+userPassword).toString(enc.Hex) === user.password)
            return true
    }  
    else{
        if(HmacSHA512(userPassword,process.env.KEY).toString(enc.Hex) === user.password)
            return true
    }
     return false   
}

module.exports = {
    createPassword,
    getAll,
    decrypt
}