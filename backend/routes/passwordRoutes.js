const express = require('express')
const { createPassword, getAll, decrypt, sharePassword, getShared } = require('../controllers/passwordController')
const {protect} = require('../middleware/authMiddleware')
const router = express.Router()

router.post('/create',protect,createPassword)
router.get('/getAll',protect,getAll)
router.post('/decrypt',protect,decrypt)
router.post('/share',protect,sharePassword)
router.get('/getShared',protect,getShared)

module.exports = router