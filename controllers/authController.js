const User = require('./../models/userModel');
const jwt = require('jsonwebtoken');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
};

const signUp = catchAsync(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  // const user = await User.create(req.body);

  const { _id, name, email } = user;
  const token = signToken(_id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      _id,
      name,
      email,
    },
  });
});

const login = catchAsync(async (req, res, next) => {
  //1. Check to see if email and password exist on the request body
  const { email, password } = req.body;
  if (!email || !password) return next(new AppError('Please provide both email and password', 400));

  //2. Check to see if user exists and password is correct
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePasswords(password, user.password)))
    return next(new AppError('There is no user with this email and password', 400));

  //3. If everything ok, sign a token
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});

module.exports = { signUp, login };
