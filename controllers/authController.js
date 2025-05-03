const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const AppError = require('../utils/appError');
const Email = require('../utils/email');
const { promisify } = require('util');

/**
 *
 * @param {string} id
 * @param {object} res
 * @param {string} message
 * @param {number} statusCode
 * @default statusCode=200
 */
const signSendToken = async (id, res, message, statusCode = 200) => {
  const token = await promisify(jwt.sign)({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

  res.cookie('jwt', token, {
    expires: new Date(Date.now() + +process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' ? true : false,
  });

  res.status(statusCode).json({
    status: 'success',
    message,
    token,
  });
};

const signup = async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;
  const user = await User.create({ name, email, password, passwordConfirm });
  await signSendToken(user._id, res, 'Your account has been created successfully', 201);
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email) return next(new AppError('Please provide your email address', 400));
  if (!password) return next(new AppError('Please provide your password', 400));

  const user = await User.findOne({ email }).select('+password');
  const correct = await user?.verifyPassword(password);
  if (!user || !correct) return next(new AppError('There is no account with this email and password', 400));

  await signSendToken(user._id, res, 'You have been logged in successfully');
};

const protectRoute = async (req, res, next) => {
  const auth = req.headers.authorization;
  let token;
  if (auth && auth.startsWith('Bearer')) token = auth.split(' ')[1];
  if (req.cookies) token = req.cookies.jwt;
  if (!token) return next(new AppError('You are not allowed to access this route. Please login first.', 401));

  const payload = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const user = await User.findById(payload.id);
  if (!user) return next(new AppError('Your account has deleted. Please contact support.', 403));

  const passwordChanged = user?.passwordChangedAfter(payload.iat);
  if (passwordChanged) return next(new AppError('Your password has changed. Please login again', 403));

  req.user = user;
  next();
};

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) return next(new AppError('You are not authorized to access this route.', 403));
    return next();
  };
};

const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  if (!email) return next(new AppError('Please provide your email address', 400));

  const user = await User.findOne({ email });
  if (!user) return next(new AppError('There is no user with this email address', 404));

  const resetToken = user?.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  const url = `${req.protocol}://${req.get('host')}/api/v1/users/reset-password/${resetToken}`;

  try {
    // await new Email(user, url).sendResetPassword();
    await new Email(user, url).sendText('Your password reset link');

    res.status(200).json({
      status: 'success',
      message: 'A password reset link has sent to your email address',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(500).json({
      status: 'error',
      message: 'There was an error sending the email. Please try again later.',
    });
  }
};

const resetPassword = async (req, res, next) => {
  const { token } = req.params;
  if (!token) return next(new AppError('The password reset token has gone wrong. Please try again.', 400));

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } });
  if (!user) return next(new AppError('The password reset token is either invalid or expired. Please try again.', 401));

  user.password = req.body?.password;
  user.passwordConfirm = req.body?.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  await signSendToken(user._id, res, 'Your password has been reset successfully.');
};

const changePassword = async (req, res, next) => {
  const user = await User.findById(req.user._id).select('+password');

  const { currentPassword } = req.body;
  if (!currentPassword) return next(new AppError('Please provide your current password', 400));

  const correct = await user.verifyPassword(currentPassword);
  if (!correct) return next(new AppError('Your current password is wrong.', 401));

  const { newPassword, newPasswordConfirm } = req.body;
  user.password = newPassword;
  user.passwordConfirm = newPasswordConfirm;
  await user.save();

  await signSendToken(user._id, res, 'Your password has been changed successfully.');
};

module.exports = { signup, login, protectRoute, restrictTo, forgotPassword, resetPassword, changePassword };
