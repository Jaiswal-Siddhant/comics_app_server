const express = require('express');
const router = express.Router();
const {} = require('../controllers/lists.js');

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);

// router.route('/me').get(isAuthenticatedUser, getUserDetails);

module.exports = router;
