const asyncHandler = require('express-async-handler')
const LoginAttempt = require('../models/LoginAttempt')

// @desc Get login attempts
// @route GET /api/loginAttempts/getAll
// @access Private
const getLoginAttempts = asyncHandler(async (req,res) => {
    const id = req.user._id
    console.log(id)

    const attempts = await LoginAttempt.find({id_user:id}).populate('id_address')

    if(attempts)
        res.status(200).json({message: 'Success', data: attempts})
    else res.status(500).json({message: 'Problem with access to data'})
})

module.exports={
    getLoginAttempts
}