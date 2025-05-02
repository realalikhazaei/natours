const User = require('../models/userModel');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

const getAllUsers = factory.getAll(User);

const getUser = factory.getOne(User);

const createUser = factory.createOne(User);

const updateUser = factory.updateOne(User);

const deleteUser = factory.deleteOne(User);

const updateMe = async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm)
    return next(new AppError('For updating your password, please head to this route instead: /change-password', 400));

  const { name, email } = req.body;
  const user = await User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true });

  res.status(200).json({
    status: 'success',
    message: 'Your account has been updated successfully',
    data: user,
  });
};

const deleteMe = async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });

  res.status(200).json({
    status: 'success',
    message: 'Your account has been deleted successfully',
  });
};

module.exports = { getAllUsers, getUser, createUser, updateUser, deleteUser, updateMe, deleteMe };
