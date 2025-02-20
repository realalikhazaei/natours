const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const mongoose = require('mongoose');

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
  .catch(err => console.log(err));

app.listen(process.env.PORT, process.env.HOST, () => {
  console.log(`Starting the API service on port ${process.env.PORT}...`);
});
