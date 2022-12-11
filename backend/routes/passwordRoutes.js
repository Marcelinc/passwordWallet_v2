const express = require('express')
const { createPassword, getAll, decrypt } = require('../controllers/passwordController')
const {protect} = require('../middleware/authMiddleware')
const router = express.Router()

router.post('/create',protect,createPassword)
router.get('/getAll',protect,getAll)
router.post('/decrypt',protect,decrypt)

module.exports = router