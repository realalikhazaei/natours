const AppError = require('../utils/appError');

const devErr = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const prodErr = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
    });
  }
};

const invalidIdErr = err => new AppError(`Invalid ID: ${err.value}`, 400);

const duplicateErr = err => new AppError(err.message, 400);

const validationErr = err => {
  const message = Object.values(err.errors)
    .map(el => el.message)
    .join('. ');
  return new AppError(message, 400);
};

const invalidJwtErr = () => new AppError('Your login session has gone wrong. Please login again.', 401);

const expiredJwtErr = () => new AppError('Your login sesion is expired. Please login again.', 401);

const gloablErrorHandler = async (err, req, res, next) => {
  err.statusCode ||= 500;
  err.status ||= 'error';

  if (process.env.NODE_ENV === 'development') devErr(err, res);
  if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (err.name === 'CastError') error = invalidIdErr(err);
    if (err.stack.startsWith('MongooseError')) error = duplicateErr(err);
    if (err.name === 'ValidationError') error = validationErr(err);
    if (err.name === 'JsonWebTokenError') error = invalidJwtErr();
    if (err.name === 'TokenExpiredError') error = expiredJwtErr();

    prodErr(error, res);
  }
};

module.exports = gloablErrorHandler;
