const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/User')

const authorize = asyncHandler(async (req,res,next) => {
    let token = null 


    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            //Get token from header
            token = req.headers.authorization.split(' ')[1]

            //Verify token
            const decoded = jwt.verify(token,process.env.JWT_SECRET)

            //Get user from the token
            req.user = await User.findById(decoded.id).select('_id login isPasswordKeptAsHmac')

            res.status(200).json({message: 'Authorized',data:{
                login:req.user.login,
                isHmac: req.user.isPasswordKeptAsHmac
            }})

            next()
        } catch(error){
            token && res.status(401).json({message:'Not authorized'})
        }
    }

    if(!token){
        res.status(401).json({message: 'Not authorized, no token'})
    }
})


const protect = asyncHandler(async (req,res,next) => {
    let token = null 


    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            //Get token from header
            token = req.headers.authorization.split(' ')[1]

            //Verify token
            const decoded = jwt.verify(token,process.env.JWT_SECRET)

            //Get user from the token
            req.user = await User.findById(decoded.id).select('_id login isPasswordKeptAsHmac')

            next()
        } catch(error){
            token && res.status(401).json({message:'Not authorized'})
        }
    }

    if(!token){
        res.status(401).json({message: 'Not authorized, no token'})
    }
})

module.exports = {
    protect,
    authorize
}