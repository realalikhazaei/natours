const sharp = require('sharp');
const User = require('../models/userModel');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');
const multerUpload = require('../utils/multer');

const getAllUsers = factory.getAll(User);

const getUser = factory.getOne(User);

const createUser = factory.createOne(User);

const updateUser = factory.updateOne(User);

const deleteUser = factory.deleteOne(User);

const updateMe = async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm)
    return next(new AppError('For updating your password, please head to this route instead: /change-password', 400));

  const { name, email } = req.body;
  const { photo } = req.body.photo === 'undefined' ? req.user : req.body;
  const user = await User.findByIdAndUpdate(req.user._id, { name, email, photo }, { new: true, runValidators: true });

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

const getMe = (req, res, next) => {
  (req.params.id = req.user._id), next();
};

//User photo upload
const uploadUserPhoto = multerUpload.single('photo');
const processUserPhoto = async (req, res, next) => {
  if (!req.file) return next();

  req.body.photo = `user-${req.user._id}-${Date.now()}.jpg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`${__dirname}/../public/img/users/${req.body.photo}`);

  next();
};

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
  getMe,
  uploadUserPhoto,
  processUserPhoto,
};
