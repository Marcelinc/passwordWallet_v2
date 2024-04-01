const express = require('express');
const { getWebsites } = require('../controllers/websiteController');

const router = express.Router();

router.get('/getAll',getWebsites);

module.exports = router;