const dotenv = require('dotenv');
const mongoose = require('mongoose');

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION 💥💥 Shutting down...');
  console.log(err);

  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log('Connection to database has been established'))
  .catch(() => console.log('Could not connect with the database'));

const server = app.listen(process.env.PORT, process.env.HOST, () => {
  console.log(`Starting the API service on port ${process.env.PORT}...`);
});

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION 💥💥 Shutting down...');
  console.log(err);

  server.close(() => process.exit(1));
});
