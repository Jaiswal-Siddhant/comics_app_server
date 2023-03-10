const User = require('../models/userModel');
const crypto = require('crypto');
const ErrorHandler = require('../utils/ErrorHandler');
const CatchAsyncErrors = require('../utils/CatchAsyncErrors');

// Register User
exports.registerUser = async (req, res, next) => {
	try {
		const { userName, email, password } = req.body;
		const user = await User.create({
			userName,
			email,
			password,
			avatar: {
				public_id: 'sample ID',
				url: 'sampleURI',
			},
		});
		res.status(201).json({
			success: true,
			user,
		});
	} catch (error) {
		if (error.message.includes('User validation failed')) {
			let msg = error.message
				.replace('User validation failed:', '')
				.split(':')[1]
				.trim();
			return next(new ErrorHandler(msg, 400).getError(res));
		} else {
			return next(
				new ErrorHandler('Email already exists', 409).getError(res)
			);
		}
	}
};

exports.loginUser = CatchAsyncErrors(async (req, res, next) => {
	const { email, password } = req.body;

	if (!email || !password)
		return next(
			new ErrorHandler('Please enter email and password', 400).getError(
				res
			)
		);

	const user = await User.findOne({ email }).select('+password');
	if (!user)
		return next(
			new ErrorHandler('Invalid email or password', 401).getError(res)
		);

	const isPasswordMatched = await user.comparePassword(password);
	if (!isPasswordMatched)
		return next(
			new ErrorHandler('Invalid email or password', 401).getError(res)
		);

	// sendToken(user, 200, res);
	res.status(200).json(user).end();
});

// Forgot password
exports.forgotPassword = CatchAsyncErrors(async (req, res, next) => {
	const user = await User.findOne({ email: req.body.email });
	if (!user) {
		return next(new ErrorHandler('User not found', 404).getError(res));
	}

	// Get reset password token
	const resetToken = user.getResetPasswordToken();
	await user.save({ validateBeforeSave: false });
	const resetPasswordURL = `${req.protocol}://${req.get(
		'host'
	)}/api/v1/password/reset/${resetToken}`;

	const message = `Your Password reset link is: \n\n${resetPasswordURL}\n\nIf you have not requested this email then please ignore it.`;
	try {
		await sendEmail({
			email: user.email,
			subject: 'Reset Password',
			message,
		});
		res.status(200).json({
			success: true,
			message: `Email sent to ${user.email} successfully`,
		});
	} catch (error) {
		user.getResetPasswordToken = undefined;
		user.resetPasswordExpire = undefined;
		await user.save({ validateBeforeSave: false });
		return next(new ErrorHandler(error.message, 500).getError(res));
	}
	return;
});

exports.resetPassword = CatchAsyncErrors(async (req, res, next) => {
	// Creating token hash
	const resetPasswordToken = crypto
		.createHash('sha256')
		.update(req.params.token)
		.digest('hex');

	const user = await User.findOne({
		resetPasswordToken,
		resetPasswordExpire: { $gt: Date.now() },
	});

	if (!user) {
		return next(
			new ErrorHandler(
				'Reset password token is invalid or has been expired',
				400
			).getError(res)
		);
	}

	if (req.body.password !== req.body.confirmPassword) {
		return next(
			new ErrorHandler('Password do not match', 400).getError(res)
		);
	}

	user.password = req.body.password;
	user.resetPasswordToken = undefined;
	user.resetPasswordExpire = undefined;

	await user.save();
	// sendToken(user, 200, res);
	res.status(200).json(user).end();
});

// Get user details for LOGGED IN user only
exports.getUserDetails = CatchAsyncErrors(async (req, res, next) => {
	const user = await User.findById(req.user.id);
	res.status(200).json({
		success: true,
		user,
	});
});

// Update user password
exports.updateUserPassword = CatchAsyncErrors(async (req, res, next) => {
	const user = await User.findById(req.user.id).select('+password');
	const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

	if (!isPasswordMatched) {
		return next(new ErrorHandler('Invalid password', 400).getError(res));
	}

	if (req.body.newPassword !== req.body.confirmPassword) {
		return next(
			new ErrorHandler('Passwords Do not match', 400).getError(res)
		);
	}

	user.password = req.body.newPassword;
	await user.save();
	res.status(200).json({
		success: true,
		user: {
			email: user.email,
		},
	});
});

// @ADMIN ROUTE - to see all users
exports.getAllUsers = CatchAsyncErrors(async (req, res, next) => {
	const users = await User.find({});
	res.status(200).json({ success: true, users });
});

// @ADMIN ROUTE - to see particular user detail
exports.getSingleUser = CatchAsyncErrors(async (req, res, next) => {
	const users = await User.findById(req.params.id);
	if (!users) {
		return next(
			new ErrorHandler(
				`User does not exist with id ${req.params.id}`,
				400
			).getError(res)
		);
	}
	res.status(200).json({ success: true, users });
});

// @ADMIN Delete user
exports.deleteUserProfile = CatchAsyncErrors(async (req, res, next) => {
	// TODO: remove cloudinary
	const user = await User.findById(req.params.id);

	if (!user) {
		return next(
			new ErrorHandler(
				`User does not exist with id ${req.params.id}`,
				400
			).getError(res)
		);
	}

	await user.remove();

	res.status(200).json({
		success: true,
		message: 'User deleted successfully.',
	});
});
