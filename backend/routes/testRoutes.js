const express = require('express');
const { sayHello} = require('../controllers/testController');

const router = express.Router();

router.get('',sayHello);

module.exports = router;