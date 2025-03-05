const dotenv = require('dotenv');
const mongoose = require('mongoose');

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION 💥💥 Shutting down...'); //eslint-disable-line
  console.log(err); //eslint-disable-line

  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.PASSWORD);

mongoose
  .connect(DB)
  .then(() => console.log('Connection to database has been established')) //eslint-disable-line
  .catch(() => console.log('Could not connect with the database')); //eslint-disable-line

const server = app.listen(process.env.PORT, process.env.HOST, () => {
  console.log(`Starting the API service on port ${process.env.PORT}...`); //eslint-disable-line
});

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION 💥💥 Shutting down...'); //eslint-disable-line
  console.log(err); //eslint-disable-line

  server.close(() => process.exit(1));
});
