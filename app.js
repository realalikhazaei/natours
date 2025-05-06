const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimiter = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const AppError = require('./utils/appError');
const sanitize = require('./utils/sanitize');
const xss = require('./utils/xss');
const hpp = require('./utils/hpp');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const viewRouter = require('./routes/viewRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const gloablErrorHandler = require('./controllers/errorController');

const app = express();

//Rate-limit
app.use(
  rateLimiter({
    max: 100,
    windowsMs: 60 * 60 * 1000,
    message: 'Too many requests. Please try again in one hour.',
  }),
);

//Body-parser
app.use(express.json({ limit: '10kb' }));

//Cookie-parser
app.use(cookieParser());

//Serve static files
app.use(express.static('public'));

//Set template engine
app.set('view engine', 'pug');
app.set('views', 'views');

//Extended query-parser
app.set('query parser', 'extended');

//Logger middleware for dev env
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

//Filter-out unwanted fields
app.use((req, res, next) => {
  const filterOut = ['role', 'passwordChangedAt', 'passwordResetToken', 'passwordResetExpires'];
  filterOut.forEach(el => delete req.body?.[el]);
  next();
});

//Special HTTP headers with Helmet
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
app.use((req, res, next) => {
  ['body', 'params', 'headers'].forEach(key => {
    req[key] = hpp(req[key]);
  });
  next();
});

//Sanitize data input
app.use((req, res, next) => {
  ['body', 'params', 'headers'].forEach(el => {
    req[el] = sanitize(req[el]);
  });
  next();
});

//Filter-out HTML tags
app.use((req, res, next) => {
  ['body', 'params', 'headers'].forEach(el => {
    req[el] = xss(req[el]);
  });
  next();
});

//Routers
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

//Global error handler
app.all(/.*/, (req, res, next) => {
  return next(new AppError(`Could not found this route ${req.originalUrl}`, 404));
});
app.use(gloablErrorHandler);

module.exports = app;
