require('dotenv').config({ path: 'config.env' });
const mongoose = require('mongoose');
const app = require('./app');

//Global programming errors handlers
process.on('unhandledRejection', err => {
  console.log('-----------------------UNHANDLED REJECTION-----------------------'); //eslint-disable-line
  console.log(err); //eslint-disable-line
  // process.exit(0);
});
process.on('uncaughtException', err => {
  console.log('-----------------------UNCAUGHT EXCEPTION-----------------------'); //eslint-disable-line
  console.log(err); //eslint-disable-line
  server.close(process.exit(1));
});

//Connecting to database
const DB = process.env.DATABASE_CONNECT.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose
  .connect(DB)
  .then(() => console.log('Connection to the database has been established')) //eslint-disable-line
  .catch(() => console.log('There has been a problem connecting to the database')); //eslint-disable-line

//Set default values for host and port number
const HOST = process.env.HOST || '127.0.0.1';
const PORT = process.env.PORT || 5000;

//Starting the server
const server = app.listen(PORT, HOST, () => {
  console.log(`Starting the server on port ${PORT}`); //eslint-disable-line
});
