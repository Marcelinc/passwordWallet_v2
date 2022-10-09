const express = require('express')
const { registerUser, loginUser, verifyUser } = require('../controllers/userController')
const protect = require('../middleware/authMiddleware')
const router = express.Router()

router.post('/register',registerUser)
router.post('/login',loginUser)
router.get('/getMe',protect,verifyUser)

module.exports = router