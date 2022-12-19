const express = require('express')
const { getLoginAttempts } = require('../controllers/loginAttemptController')
const { registerUser, loginUser, verifyUser, resetPassword, logout } = require('../controllers/userController')
const {protect,authorize} = require('../middleware/authMiddleware')
const router = express.Router()

router.post('/register',registerUser)
router.post('/login',loginUser)
router.get('/getMe',authorize,verifyUser)
router.post('/resetPassword',protect,resetPassword)
router.get('/loginAttempts/getAll',protect,getLoginAttempts)
router.get('/logout',protect,logout)

module.exports = router