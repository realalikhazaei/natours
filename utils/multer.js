const multer = require('multer');
const AppError = require('./appError');

const multerMemory = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) cb(null, true);
  else cb(new AppError('This file type is not allowed. Please try again with image files', 400), false);
};

const upload = multer({
  storage: multerMemory,
  fileFilter: multerFilter,
});

module.exports = upload;
