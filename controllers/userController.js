const User = require('./../models/userModel');
const factory = require('./handlerFactory');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const getAllUsers = factory.getAll(User);

const createUser = factory.createOne(User);

const getUser = factory.getOne(User);

const updateUser = factory.updateOne(User);

const deleteUser = factory.deleteOne(User);

const updateMe = catchAsync(async (req, res, next) => {
  const { password, passwordConfirm } = req.body;
  if (password || passwordConfirm)
    return next(new AppError('To change your password, please head to this link instead: /update-password', 400));

  const user = await User.findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true });

  res.status(200).json({
    status: 'success',
    message: 'Your account has been updated successfully',
    data: user,
  });
});

const deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });

  res.status(204).json({
    status: 'success',
    message: 'Your account has been deleted successfully',
    data: null,
  });
});

module.exports = { getAllUsers, createUser, getUser, updateUser, deleteUser, updateMe, deleteMe };
