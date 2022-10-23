const express = require('express')
const { registerUser, loginUser, verifyUser, resetPassword } = require('../controllers/userController')
const protect = require('../middleware/authMiddleware')
const router = express.Router()

router.post('/register',registerUser)
router.post('/login',loginUser)
router.get('/getMe',protect,verifyUser)
router.post('/resetPassword',protect,resetPassword)

module.exports = router