const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
	userName: {
		type: String,
		required: [true, 'Please Enter Your Name'],
		maxLength: [30, 'Name cannot exceed 30 characters'],
		minLength: [4, 'Name should have more than 4 characters'],
		unique: true,
	},
	email: {
		type: String,
		required: [true, 'Please Enter Your Email'],
		unique: true,
		validate: [validator.isEmail, 'Please Enter a valid Email'],
	},
	password: {
		type: String,
		required: [true, 'Please Enter Your Password'],
		minLength: [8, 'Password should be greater than 8 characters'],
		select: false,
	},
	avatar: {
		public_id: {
			type: String,
			required: true,
		},
		url: {
			type: String,
			required: true,
		},
	},
});

userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		next();
	}

	this.password = await bcrypt.hash(this.password, 10);
});

// Compare Password
userSchema.methods.comparePassword = async function (password) {
	return await bcrypt.compare(password, this.password);
};

// Generating Password Reset Token
userSchema.methods.getResetPasswordToken = function () {
	// Generating Token
	const resetToken = crypto.randomBytes(20).toString('hex');

	// Hashing and adding resetPasswordToken to userSchema
	this.resetPasswordToken = crypto
		.createHash('sha256')
		.update(resetToken)
		.digest('hex');

	this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

	return resetToken;
};

module.exports = mongoose.model('User', userSchema);
