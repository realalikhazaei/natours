const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('./../utils/appError');
const { promisify } = require('util');
const Email = require('../utils/sendEmail');
const crypto = require('crypto');

/**Signs and sends a JWT
 *
 * @param {string} id
 * @param {object} res
 * @param {string} message
 * @param {number} statusCode
 * @default statusCode=200
 */
const signSendToken = (id, res, message, statusCode = 200) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

  res.cookie('jwt', token, {
    expires: new Date(Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: true,
  });
  res.status(statusCode).json({
    status: 'success',
    token,
    message,
  });
};

const signUp = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);

  const url = `${req.protocol}://${req.get('host')}/my-profile`;
  await new Email(user, url).sendWelcome();
  signSendToken(user._id, res, 'You have signed up successfully', 201);
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email) return next(new AppError('Please enter your email address', 400));
  if (!password) return next(new AppError('Please provide your password', 400));

  const user = await User.findOne({ email }).select('+password');
  const correct = await user?.comparePasswords(password);
  if (!user || !correct) return next(new AppError('There is no account with this email and password', 404));

  signSendToken(user._id, res, 'You have been logged in successfully');
});

const protectRoute = catchAsync(async (req, res, next) => {
  const bearerAuth = req.headers?.authorization;
  const cookieAuth = req.cookies?.jwt;
  let token;
  if (bearerAuth && bearerAuth.startsWith('Bearer ')) token = bearerAuth.split(' ')[1];
  if (cookieAuth) token = cookieAuth;
  if (!token || token === 'loggedout') return next(new AppError('You must login first to access this page', 401));

  const payload = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const user = await User.findById(payload.id);
  if (!user) return next(new AppError('Your account has been deactivated', 404));

  const passwordChanged = user.passwordChangedAfter(payload.iat);
  if (passwordChanged) return next(new AppError('Your password has been changed. Please login again', 401));

  req.user = user;
  res.locals.user = user;
  next();
});

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) return next(new AppError('You are not allowed to access this route', 403));
    next();
  };
};

const forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (!email) return next(new AppError('Please provide your email address', 400));

  const user = await User.findOne({ email });
  if (!user) return next(new AppError('There is no account matching this email address', 404));

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  const url = `${req.protocol}://${req.get('host')}/api/v1/users/reset-password/${resetToken}`;
  const subject = 'Your password reset link (expires in 10mins).';
  const message = `Hello ${user.name}. Here is your password reset link:\n${url}\nPlease ignore this email if you haven't requested to reset your password.`;

  try {
    await new Email(user, url).sendText(subject, message);
    res.status(200).json({
      status: 'success',
      message: 'A password reset link has been sent to your email',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return res.status(500).json({
      status: 'error',
      message: 'There was an error sending the email. Please try again later',
    });
  }
});

const resetPassword = catchAsync(async (req, res, next) => {
  const { token } = req.params;
  if (!token) return next(new AppError('The password reset link is incorrect. Please try again', 400));

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } });
  if (!user) return next(new AppError('The password reset link is either wrong or expired. Please try again', 404));

  const { password, passwordConfirm } = req.body;
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  signSendToken(user._id, res, 'Your password has been reset successfully');
});

const updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).select('+password');

  const { currentPassword, newPassword, newPasswordConfirm } = req.body;
  if (!currentPassword) return next(new AppError('Please provide your current password', 400));

  const correct = await user.comparePasswords(currentPassword);
  if (!correct) return next(new AppError('Your current password is wrong', 401));

  user.password = newPassword;
  user.passwordConfirm = newPasswordConfirm;
  await user.save();

  signSendToken(user._id, res, 'Your password has been changed successfully');
});

const isLoggedIn = async (req, res, next) => {
  const token = req.cookies?.jwt;
  if (!token || token === 'loggedout') return next();

  const payload = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const user = await User.findById(payload.id);
  if (!user) return next();

  const passwordChanged = user.passwordChangedAfter(payload.iat);
  if (passwordChanged) return next();

  req.user = user;
  res.locals.user = user;
  next();
};

const logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10000),
    httpOnly: true,
    secure: true,
  });
  res.status(200).json({ status: 'success', message: 'You have been logged out successfully' });
};

module.exports = {
  signUp,
  login,
  protectRoute,
  restrictTo,
  forgotPassword,
  resetPassword,
  updatePassword,
  isLoggedIn,
  logout,
};
