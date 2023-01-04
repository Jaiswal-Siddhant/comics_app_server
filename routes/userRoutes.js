const express = require('express');
const router = express.Router();
const {
	loginUser,
	registerUser,
	getUserDetails,
} = require('../controllers/userController');

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);

module.exports = router;
