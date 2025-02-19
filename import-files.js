const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Tour = require('./models/tourModel');

dotenv.config({ path: `${__dirname}/config.env` });

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.PASSWORD);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log('Connection to database has been established'));

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf-8'));

const importData = async function () {
  try {
    await Tour.create(tours);
    console.log('Data successfully imported.');
  } catch (error) {
    console.error(error);
  }
  process.exit();
};

const deleteData = async function () {
  try {
    await Tour.deleteMany();
    console.log('Data successfully deleted.');
  } catch (error) {
    console.error(error);
  }
  process.exit();
};

if (process.argv[2] === '--import') importData();
if (process.argv[2] === '--delete') deleteData();
