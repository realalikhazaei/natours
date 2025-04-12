const AppError = require('./../utils/appError');

//Development error response
const devErr = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  }

  res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    message: err,
  });
};

//Production error response
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

//Invalid ID error
const invalidIdErrDB = err => {
  const message = `The ${err.name.slice(1).toUpperCase()} cannot have the value of ${err.path}`;
  return new AppError(message, 400);
};

//Validation error
const validationErrDB = err => {
  const message = Object.values(err.errors)
    .map(cur => cur.message)
    .join('. ');
  return new AppError(message, 400);
};

//Duplicate unique key error
const dupUniqueErrDB = err => {
  return new AppError(err.message, 400);
};

//Expired JWT token error
const expiredJWTErr = () => new AppError('Your login session has expired. Please login again', 401);

//Invalid JWT token error
const invalidJWTErr = () => new AppError('Your login session has gone wrong. Please login again', 401);

//Maximum review error
const maxReviewErr = () => new AppError('You can only write one review for each single tour', 400);

//Global error handler
const globalErrorHandler = (err, req, res, next) => {
  err.status ||= 'error';
  err.statusCode ||= 500;

  if (process.env.NODE_ENV === 'development') devErr(err, req, res);
  if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (err.name === 'CastError') error = invalidIdErrDB(err);
    if (err.name === 'ValidationError') error = validationErrDB(err);
    if (err.stack.startsWith('MongooseError')) error = dupUniqueErrDB(err);
    if (err.name === 'TokenExpiredError') error = expiredJWTErr();
    if (err.name === 'JsonWebTokenError') error = invalidJWTErr();
    if (err.code === 11000) error = maxReviewErr();

    prodErr(error, req, res);
  }
};

module.exports = globalErrorHandler;
