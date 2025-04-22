const User = require('./../models/userModel');
const factory = require('./handlerFactory');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const multerUpload = require('./../utils/multerUpload');
const sharp = require('sharp');

const getAllUsers = factory.getAll(User);

const createUser = factory.createOne(User);

const getUser = factory.getOne(User);

const updateUser = factory.updateOne(User);

const deleteUser = factory.deleteOne(User);

const updateMe = catchAsync(async (req, res, next) => {
  const { password, passwordConfirm } = req.body;
  if (password || passwordConfirm)
    return next(new AppError('To change your password, please head to this link instead: /update-password', 400));

  req.body.photo = req.file?.filename === undefined ? req.user.photo : req.file?.filename;

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

//Set the current user ID
const setMyId = (req, res, next) => {
  req.params.id = req.user._id;
  next();
};

//Multer configurations
const uploadUserPhoto = multerUpload.single('photo');
const processUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  const extension = req.file.mimetype.split('/')[1];
  req.file.filename = `user-${req.user._id}-${Date.now()}.${extension}`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

module.exports = {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
  setMyId,
  uploadUserPhoto,
  processUserPhoto,
};
