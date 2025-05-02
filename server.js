/* eslint-disable */
require('dotenv').config({ path: './config.env' });
const app = require('./app');
const mongoose = require('mongoose');

//Synchronous codebase error handler
process.on('uncaughtException', err => {
  console.log('-------------------------------------');
  console.log('UNCAUGHT EXCEPTION 💥💥');
  console.log(err);
  process.exit(1);
});

//Asynchronous codebase error handler
process.on('unhandledRejection', err => {
  console.log('-------------------------------------');
  console.log('UNHANDLED REJECTION 💥💥');
  console.log(err);
  server.close(() => process.exit(0));
});

//Conncting to database
const DB = process.env.DATABASE_CONNECT.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose
  .connect(DB)
  .then(() => console.log('Connection to the database has been established'))
  .catch(() => console.log('Could not connect to the database'));

//Starting the server
const port = process.env.PORT || 5000;
const server = app.listen(port, process.env.HOST, () => {
  console.log(`Starting the server on port ${port}...`);
});
