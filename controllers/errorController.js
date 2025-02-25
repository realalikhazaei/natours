const golbalErrorHandler = (err, req, res, next) => {
  console.log(err.stack);

  err.statusCode ||= 500;
  err.status ||= 'error';
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

module.exports = golbalErrorHandler;
