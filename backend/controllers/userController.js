const User = require("../models/User");
const asyncHandler = require('express-async-handler')

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

        

    } catch(error){
        console.log(error)
        res.json({message:error})
    }
})