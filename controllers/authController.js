const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
};

const signUp = catchAsync(async (req, res, next) => {
  // const { name, email, password, passwordConfirm } = req.body;
  // const newUser = await User.create({ name, email, password, passwordConfirm });
  const newUser = await User.create(req.body);
  const token = signToken(newUser._id);

  res.status(200).json({
    status: 'success',
    token,
    data: {
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    },
  });
});

const login = catchAsync(async (req, res, next) => {
  //1. Check to see if email and password exist on request body
  const { email, password } = req.body;
  if (!email) return next(new AppError('Please provide your email', 400));
  if (!password) return next(new AppError('Please provide your password', 400));

  //2. Check to see if user exists and password is correct
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePasswords(password, user.password)))
    return next(new AppError('There is no user with this email and password', 401));

  //3. If everything is OK, sign a token and send as a response
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});

const protectRoute = catchAsync(async (req, res, next) => {
  //1. Check token existence
  const auth = req.headers.authorization;
  let token;
  if (!auth) return next(new AppError('You are not authorized. Please login or sign up.', 401));
  if (auth && auth.startsWith('Bearer')) token = auth.split(' ')[1];

  //2. Verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //3. Check user existence
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) return next(new AppError('Your account is deleted.', 401));

  //4. Check password is unchanged
  const changedPass = currentUser.passwordChangedAfter(decoded.iat);
  if (changedPass) return next(new AppError('Your password has been changed. Please login again.', 401));

  //5. Proceeding to next middleware
  req.user = currentUser;
  next();
});

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(new AppError("You don't have permission to perform this action", 403));
    next();
  };
};

const forgotPassword = catchAsync(async (req, res, next) => {
  //1. Find user by email
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new AppError('There is no user with this email', 400));

  //2. Generate a reset password token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //3. Send the token to user's email
  res.status(200).json({
    status: 'success',
    resetToken,
  });
});

module.exports = { signUp, login, protectRoute, restrictTo, forgotPassword };
