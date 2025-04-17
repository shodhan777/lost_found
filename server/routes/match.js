const express = require('express');
const { matchItems } = require('../controllers/matchController');
const verifyToken = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', verifyToken, matchItems);

module.exports = router;
