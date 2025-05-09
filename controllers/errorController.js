const AppError = require('../utils/appError');

const devErr = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
    return;
  }

  res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    message: err,
  });
};

const prodErr = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
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
    return;
  }

  if (err.isOperational) {
    res.status(err.statusCode).render('error', {
      title: 'Something went wrong',
      message: err.message,
    });
  } else {
    res.status(500).render('error', {
      title: 'Something went wrong',
      message: 'Something went wrong',
    });
  }
};

const invalidIdErr = err => new AppError(`Invalid ID: ${err.value}`, 400);

const duplicateNameErr = err => new AppError(err.message, 400);

const validationErr = err => {
  const message = Object.values(err.errors)
    .map(el => el.message)
    .join('. ');
  return new AppError(message, 400);
};

const invalidJwtErr = () => new AppError('Your login session has gone wrong. Please login again.', 401);

const expiredJwtErr = () => new AppError('Your login sesion is expired. Please login again.', 401);

const duplicateReviewErr = () => new AppError('You cannot review a tour booking more than once', 400);

const gloablErrorHandler = async (err, req, res, next) => {
  err.statusCode ||= 500;
  err.status ||= 'error';

  if (process.env.NODE_ENV === 'development') devErr(err, req, res);
  if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (err.name === 'CastError') error = invalidIdErr(err);
    if (err.stack.startsWith('MongooseError')) error = duplicateNameErr(err);
    if (err.name === 'ValidationError') error = validationErr(err);
    if (err.name === 'JsonWebTokenError') error = invalidJwtErr();
    if (err.name === 'TokenExpiredError') error = expiredJwtErr();
    if (err.code === 11000) error = duplicateReviewErr();

    prodErr(error, req, res);
  }
};

module.exports = gloablErrorHandler;
