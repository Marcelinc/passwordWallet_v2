const User = require("../models/User");
const Password = require("../models/Password")
const asyncHandler = require('express-async-handler');
const { SHA512, enc, lib, HmacSHA512, MD5, AES } = require("crypto-js");
const jwt = require("jsonwebtoken");
const LoginAttempt = require("../models/LoginAttempt");
const IPAddress = require("../models/IPAddress");
const { findById } = require("../models/User");
const SharedPassword = require("../models/SharedPassword");
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
            res.status(400).json({message: 'User already registered'})
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
    var correct,locked
    var device = req.headers['user-agent']

    //Check for user's login
    const user = await User.findOne({login})
    if(user){

        //check if ip address exists
        var ipAddress = await IPAddress.findOne({addressIP: req.ip, user_id: user._id})

        //save new address info
        if(!ipAddress){
            ipAddress = await IPAddress.create({addressIP: req.ip, user_id: user._id})
        } 
        
        //account not locked permanent
        if(!ipAddress.permanentLock){
            //if account not locked 
            if(ipAddress.tempLock < Date.now()){
                //check passwords
                //calculate hash
                var givenPasswordHash
                if(user.isPasswordKeptAsHmac)
                    givenPasswordHash = calculateHMAC(password,process.env.KEY)
                if(!user.isPasswordKeptAsHmac)
                    givenPasswordHash = calculateSHA512(process.env.PEPPER+user.salt+password) 
                

                    //verify password - compare hash
                if(user.password != givenPasswordHash){
                    correct = false
                    res.status(400).json({message: 'Bad login or password'})
                } else{

                    correct = true
                    //return response
                    res.status(200).json({message:'Success',data:{
                        id: user._id,
                        login: user.login,
                        isHmac: user.isPasswordKeptAsHmac,
                        token: generateToken(user._id)
                    }})
                }


                //register login attempt

                //check login attempts numb
                if(ipAddress){
                    if(correct) ipAddress.okLoginNum = ipAddress.okLoginNum+1
                    correct ? ipAddress.lastBadLoginNum = 0 : ipAddress.lastBadLoginNum = ipAddress.lastBadLoginNum+1
                    ipAddress.save()
                    }

                //temp lock nr 1
                if(ipAddress.lastBadLoginNum === 2){
                    ipAddress.tempLock = Date.now()+5000
                }
                if(ipAddress.lastBadLoginNum === 3){
                    ipAddress.tempLock = Date.now()+10000
                }
                if(ipAddress.lastBadLoginNum === 4){
                    ipAddress.tempLock = Date.now()+120000
                }
                if(ipAddress.lastBadLoginNum > 4){
                    ipAddress.permanentLock = true
                }

                //save login attempt
                LoginAttempt.create({correct,id_user:user._id,id_address: ipAddress._id, computer: device.substring(13,device.indexOf(')'))})


            } else{
                let time = Math.round((ipAddress.tempLock - Date.now())/1000)
                //console.log('sec: ',time)

                res.status(200).json({message: `Wait ${calculateTime(time)} until next login attempt`})
            }
                //console.log('time: ',(Math.round((ipAddress.tempLock - Date.now())/-60000)*1)/1)
        }else{
            res.status(200).json({message: 'Your account has been locked because of too many unauthorized login attempts'})
        }

        


    } else{
        res.status(400).json({message:'There is no user with given login'})
    }
})


// @desc Verify user
// @route GET /api/user/getMe
// @access Private
const verifyUser = asyncHandler(async (req,res) => {
    
    /*try{*/
        const user = await User.findById(req.user.id, 'login isPasswordKeptAsHmac')

        /*if(!user)
            res.status(400).json({message: 'Not authorized'})
        else*/ 
            /*res.status(200).json({message: 'Authorized',data:{
                login:user.login,
                isHmac: user.isPasswordKeptAsHmac
            }})*/
   /* } catch(error){
        process.env.NODE_ENV === 'development' ? res.status(500).json('Server problem: '+error) :
        res.status(500).json('Server problem')
    }*/
})



// @desc Reset main password
// @route POST /api/user/resetPassword
// @access Private
const resetPassword = asyncHandler(async (req,res) => {
    const {oldPassword,newPassword,isHmac} = req.body

    const user = await User.findById(req.user.id, 'password isPasswordKeptAsHmac salt')

    if(!user)
        res.status(400).json({message: 'Not authorized'})
        
    //if(!comparePasswords(oldPassword,user))
        //res.status(400).json({message:"Can't update password, bad main password"})
    //else{
        var update
        var newSalt=''
        if(user.isPasswordKeptAsHmac){
            update = calculateHMAC(newPassword,process.env.KEY)
        } else{
            newSalt = lib.WordArray.random(16)
            //console.log(newSalt)
            update = calculateSHA512(process.env.PEPPER+newSalt+newPassword)
        }

        var key = MD5(update).toString()
       
        if(key && key != 'Failed'){
           //update user
            var updatedUser = await user.updateOne({$set: {password: update, salt: newSalt.toString()}})
            //update passwords
            var updatedPasswords = await Password.find({id_user: user._id})
            updatedPasswords.map(pswd => {
                //console.log('userpassword:',user.password)
                Password.updateOne({_id:pswd._id},{password: encryptPasswordAgain(pswd.password,key,user.password)}).exec()
            })

            //change shared passwords status
            const updatedShared = await SharedPassword.updateMany({id_owner: user._id,status: 'valid'},{$set: {status: 'invalid'}})


            //commit
            if(updatedUser && updatedPasswords)
            {
                res.status(200).json({message:"Success", data: newPassword})
            }
        } else res.status(500).json({message: "Can't update passwords"})
   // }
})


// @desc Log out user
// @route GET /api/user/logout
// @access Private
const logout = asyncHandler(async (req,res) => {
    const id = req.user.id
    var ipAddress = await IPAddress.findOne({user_id: id, addressIP: req.ip})
    if(ipAddress){
        ipAddress.okLoginNum = ipAddress.okLoginNum-1
        ipAddress.save()
        res.status(200).json({message: 'Success'})
    } else{
        res.status(500).json({message: 'Something gone wrong'})
    }
})



// @desc Get users list
// @route GET /api/user/getAll
// @access Private
const getUsers = asyncHandler(async (req,res) => {
    const list = await User.find({},'login')
    //console.log('list: ',list)
    if(list){
        res.status(200).json({message: 'Success', users: list})
    } else{
        res.status(500).json({message: 'Server error with fetching users'})
    }
})



//Additional functions
const calculateSHA512 = password => {
    var hashedPassword = SHA512(password)
    //console.log('sha: ',SHA512(password).toString(enc.Hex))
    return hashedPassword.toString(enc.Hex)
}

const calculateHMAC = (password,key) => {
    var hashedPassword = HmacSHA512(password,key)
    //console.log(hashedPassword.toString(enc.Hex))
    return hashedPassword.toString(enc.Hex)
}

const comparePasswords = (givenPassword,user) => {
    //console.log('givenpassword: ',givenPassword)
    //console.log('userpassword: ',user.password)
    var equal = true;
    if(user.isPasswordKeptAsHmac){
        if(user.password != calculateHMAC(givenPassword,process.env.KEY))
            equal = false
    }
    else{
        if(user.password != calculateSHA512(process.env.PEPPER+user.salt+givenPassword))
            equal = false
    }
    return equal        
}

const encryptPasswordAgain = (password,key,userPassword) => {
    console.log('password',password)
    var oldKey = MD5(userPassword).toString()
    var decrypted = AES.decrypt(password,oldKey).toString(enc.Utf8)
    console.log('decrypted:',decrypted)
    var encryptAgain = AES.encrypt(decrypted,key).toString()
    console.log('encrypted:',encryptAgain)
    return encryptAgain
}

const calculateTime = (time) => {
    let timeString
    let minutes
    if(time < 60)
        timeString = time+' seconds'
    if(time > 60){
        minutes = Math.round(time/60)*1
        timeString = minutes+' minutes'
    }
    //console.log('time: ',timeString)
    return timeString
}

const generateToken = (id) => jwt.sign({id},process.env.JWT_SECRET,{expiresIn: '30d'})

module.exports = {
    registerUser,
    loginUser,
    verifyUser,
    resetPassword,
    calculateHMAC,
    calculateSHA512,
    generateToken,
    comparePasswords,
    logout,
    getUsers
}