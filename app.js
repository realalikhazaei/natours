const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const globalErrorHandler = require('./controllers/errorController');
const rateLimit = require('express-rate-limit');
const sanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const hpp = require('hpp');
const httpClean = require('./utils/httpClean');

const app = express();

//Rate limit
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'You have reached the maximum request rate. Please try again in one hour',
});
app.use('/api', limiter);

//Logger middleware
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

//Body-parser with data limit and sanitize
app.use(express.json({ limit: '10kb' }));
app.use((req, res, next) => {
  ['role', 'passwordChangedAt', 'passwordResetToken', 'passwordResetExpires'].forEach(el => delete req.body?.[el]);
  next();
});

//Static file serve
app.use(express.static('public'));

//Template engine
app.set('view engine', 'pug');
app.set('views', 'views');

//Data sanitize
app.use(sanitize());

//Set special HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", 'https://cdnjs.cloudflare.com'],
        imgSrc: ["'self'", 'https://tile.openstreetmap.org', 'https://cdnjs.cloudflare.com'],
      },
    },
  }),
);

//Avoid parameter pollution
app.use(hpp({ whitelist: ['duration', 'price', 'difficulty'] }));

//Remove HTTP tags
app.use(httpClean);

//Routers
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

//Global error handler
app.all('*', (req, res, next) => next(new AppError(`Cannot find this route ${req.originalUrl}`, 404)));
app.use(globalErrorHandler);

module.exports = app;
