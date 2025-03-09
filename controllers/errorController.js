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

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors)
    .map(el => el.message)
    .join('. ');
  return new AppError(errors, 400);
};

const handleDupNameDB = err => new AppError(err.message, 400);

const handleInvalidJWT = () => new AppError('Your token is invalid. Please login again.', 401);

const handleExpiredJWT = () => new AppError('Your token is expired. Please login again.', 401);

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode ||= 500;
  err.status ||= 'error';

  if (process.env.NODE_ENV === 'development') devErr(err, res);

  if (process.env.NODE_ENV === 'production') {
    let error = { ...err };

    if (err.name === 'CastError') error = handleCastErrorDB(err);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(err);
    if (err.stack.startsWith('MongooseError')) error = handleDupNameDB(err);
    if (err.name === 'JsonWebTokenError') error = handleInvalidJWT();
    if (err.name === 'TokenExpiredError') error = handleExpiredJWT();

    prodErr(error, res);
  }
};

module.exports = globalErrorHandler;
